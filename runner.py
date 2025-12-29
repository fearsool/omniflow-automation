#!/usr/bin/env python3
"""
OmniFlow Automation Runner - HuggingFace Native (0 Maliyet)
✅ Free HF API + Ollama local models
✅ SQLite persistence
✅ Exponential backoff + 3x retry
✅ Telegram/Discord notifications
"""

import os
import json
import requests
import sqlite3
import time
from datetime import datetime
from typing import Optional, Tuple, Dict, Any
import sys

# ==================== CONFIGURATION ====================

# HuggingFace (Free)
HF_TOKEN = os.environ.get('HUGGINGFACE_TOKEN', '')
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')

# Ollama (Local, completely free)
USE_OLLAMA = os.environ.get('USE_OLLAMA', 'false').lower() == 'true'
OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://localhost:11434')

# Notifications
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '')
DISCORD_WEBHOOK = os.environ.get('DISCORD_WEBHOOK', '')

# Execution settings
REQUEST_TIMEOUT = int(os.environ.get('REQUEST_TIMEOUT', '300'))
MAX_RETRIES = int(os.environ.get('MAX_RETRIES', '3'))
DB_FILE = os.environ.get('DB_FILE', 'automation_runner.db')

# HF Models
HF_MODELS = {
    'text': 'mistralai/Mistral-7B-Instruct-v0.2',
    'analysis': 'meta-llama/Llama-2-7b-chat-hf',
    'research': 'bigcode/starcoder',
}

OLLAMA_MODELS = {
    'fast': 'mistral',
    'standard': 'neural-chat',
}

# ==================== DATABASE ====================

def init_database():
    """SQLite database'i oluştur"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS runner_executions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            blueprint_id TEXT,
            blueprint_name TEXT,
            started_at TIMESTAMP,
            finished_at TIMESTAMP,
            status TEXT,
            total_time_ms INTEGER,
            result_summary TEXT,
            error_message TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def log_execution(blueprint_id: str, blueprint_name: str, status: str, 
                  total_time: int, result: str, error: str = None):
    """Execution'ı database'e kaydet"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO runner_executions
        (blueprint_id, blueprint_name, started_at, finished_at, status, total_time_ms, result_summary, error_message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        blueprint_id,
        blueprint_name,
        datetime.now(),
        datetime.now(),
        status,
        total_time,
        result[:500] if result else None,
        error[:500] if error else None
    ))
    
    conn.commit()
    conn.close()

# ==================== SUPABASE CLIENT ====================

def supabase_request(method: str, endpoint: str, data: Optional[dict] = None) -> dict:
    """Supabase REST API isteği"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=data, timeout=10)
        elif method == 'PATCH':
            response = requests.patch(url, headers=headers, json=data, timeout=10)
        else:
            return {'error': f'Unsupported method: {method}'}
        
        return response.json() if response.text else {}
    except Exception as e:
        print(f"[Supabase] Hata: {e}")
        return {}

def get_active_blueprints() -> list:
    """Supabase'den aktif blueprint'leri getir"""
    result = supabase_request('GET', 'blueprints?is_active=eq.true')
    return result if isinstance(result, list) else []

# ==================== HUGGINGFACE API ====================

def call_hf_with_retry(prompt: str, model: str = None, max_retries: int = MAX_RETRIES) -> Tuple[bool, str, str]:
    """
    HuggingFace API'yi çağır - 3x retry ile
    Returns: (success, output, error)
    """
    
    if not model:
        model = HF_MODELS['text']
    
    if not HF_TOKEN:
        print("[HF] Token bulunamadı, Ollama'ya fallback...")
        return call_ollama(prompt)
    
    url = f'https://api-inference.huggingface.co/models/{model}'
    headers = {
        'Authorization': f'Bearer {HF_TOKEN}',
        'Content-Type': 'application/json',
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.post(
                url,
                headers=headers,
                json={
                    'inputs': prompt,
                    'parameters': {
                        'max_new_tokens': 512,
                        'temperature': 0.7,
                        'do_sample': True,
                    }
                },
                timeout=REQUEST_TIMEOUT
            )
            
            # Model yükleniyor?
            if response.status_code == 503:
                error_text = response.text
                if 'loading' in error_text.lower():
                    wait_time = min(30 * (2 ** attempt), 60)
                    print(f"⏳ Model yükleniyor, {wait_time}s bekleniyor... ({attempt + 1}/{max_retries})")
                    time.sleep(wait_time)
                    continue
            
            # Rate limit?
            if response.status_code == 429:
                wait_time = min(5 * (2 ** attempt), 60)
                print(f"⏳ Rate limited, {wait_time}s bekleniyor... ({attempt + 1}/{max_retries})")
                time.sleep(wait_time)
                continue
            
            # Başarılı?
            if response.status_code == 200:
                data = response.json()
                output = data[0].get('generated_text', '') if isinstance(data, list) else data.get('generated_text', '')
                return True, str(output).strip(), ''
            
            # Ciddi hata
            return False, '', f'API Error {response.status_code}: {response.text[:100]}'
        
        except requests.Timeout:
            wait_time = 2 ** attempt
            print(f"⏳ Timeout, {wait_time}s sonra retry... ({attempt + 1}/{max_retries})")
            time.sleep(wait_time)
            continue
        
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt
                print(f"⚠️ Hata: {e}, {wait_time}s sonra retry...")
                time.sleep(wait_time)
                continue
            return False, '', str(e)
    
    return False, '', f'Max retries ({max_retries}) exceeded'

# ==================== OLLAMA LOCAL ====================

def call_ollama(prompt: str, model: str = None) -> Tuple[bool, str, str]:
    """Ollama local model'i çağır"""
    
    if not model:
        model = OLLAMA_MODELS['fast']
    
    try:
        response = requests.post(
            f'{OLLAMA_URL}/api/generate',
            json={
                'model': model,
                'prompt': prompt,
                'stream': False,
                'temperature': 0.7,
            },
            timeout=REQUEST_TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            return True, data.get('response', ''), ''
        else:
            return False, '', f'Ollama error: {response.status_code}'
    
    except Exception as e:
        return False, '', f'Ollama connection failed: {e}'

# ==================== UNIFIED API CALL ====================

def call_model(prompt: str) -> Tuple[bool, str, str]:
    """
    Model'i çağır - HF veya Ollama
    Önce tercih edilen, başarısız olursa fallback
    """
    
    if USE_OLLAMA:
        print("[OLLAMA] Çalışıyor...")
        success, output, error = call_ollama(prompt)
        if success:
            return True, output, ''
        print(f"[OLLAMA] Başarısız: {error}, HF'ye fallback...")
    
    # HuggingFace API'yi dene
    print("[HF] Çalışıyor...")
    return call_hf_with_retry(prompt, HF_MODELS['text'])

# ==================== NOTIFICATIONS ====================

def send_telegram(message: str):
    """Telegram bildirimi gönder"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(url, json={
            'chat_id': TELEGRAM_CHAT_ID,
            'text': message,
            'parse_mode': 'HTML'
        }, timeout=10)
        print("✓ Telegram mesajı gönderildi")
    except Exception as e:
        print(f"⚠️ Telegram hatası: {e}")

def send_discord(message: str):
    """Discord webhook bildirimi"""
    if not DISCORD_WEBHOOK:
        return
    
    try:
        requests.post(DISCORD_WEBHOOK, json={
            'embeds': [{
                'title': '🤖 OmniFlow',
                'description': message,
                'color': 5814783
            }]
        }, timeout=10)
        print("✓ Discord mesajı gönderildi")
    except Exception as e:
        print(f"⚠️ Discord hatası: {e}")

def notify(title: str, message: str):
    """Tüm kanallara bildirim gönder"""
    full_message = f"<b>{title}</b>\n\n{message}"
    send_telegram(full_message)
    send_discord(f"**{title}**\n{message}")

# ==================== BLUEPRINT EXECUTOR ====================

def run_blueprint(blueprint: Dict[str, Any]) -> Tuple[bool, str]:
    """Tek bir blueprint'i çalıştır"""
    
    name = blueprint.get('name', 'Unknown')
    nodes = blueprint.get('nodes', [])
    base_knowledge = blueprint.get('base_knowledge', '')
    
    print(f"\n{'='*60}")
    print(f"🚀 Çalıştırılıyor: {name}")
    print(f"📦 Düğüm sayısı: {len(nodes)}")
    print(f"{'='*60}")
    
    results = []
    context = base_knowledge
    start_time = time.time()
    
    for i, node in enumerate(nodes):
        node_title = node.get('title', f'Node {i+1}')
        node_type = node.get('type', 'agent')
        node_role = node.get('role', 'Assistant')
        node_task = node.get('task', 'Complete the task')
        
        print(f"\n[{i+1}/{len(nodes)}] 🔄 {node_title}...")
        
        try:
            # Prompt'u oluştur
            prompt = f"""You are a {node_role}.

Task: {node_task}

Context: {context}

Input: {results[-1]['output'] if results else 'Start'}

Provide actionable output only."""
            
            # Model'i çağır
            success, output, error = call_model(prompt)
            
            if not success:
                results.append({
                    'node': node_title,
                    'status': 'error',
                    'error': error
                })
                print(f"[{i+1}] ❌ HATA: {error}")
                return False, json.dumps(results, ensure_ascii=False)
            
            # Başarılı
            results.append({
                'node': node_title,
                'status': 'success',
                'output': output[:300]
            })
            context += f"\n\n{node_title} Çıktısı: {output[:200]}"
            print(f"[{i+1}] ✅ Tamamlandı")
            
            time.sleep(1)  # Rate limiting
        
        except Exception as e:
            results.append({
                'node': node_title,
                'status': 'error',
                'error': str(e)
            })
            print(f"[{i+1}] ❌ Hata: {e}")
            return False, json.dumps(results, ensure_ascii=False)
    
    total_time = int((time.time() - start_time) * 1000)
    return True, json.dumps({
        'status': 'success',
        'total_time_ms': total_time,
        'nodes_executed': len(nodes),
        'results': results
    }, ensure_ascii=False)

# ==================== MAIN ====================

def main():
    """Ana çalıştırıcı"""
    
    print("=" * 70)
    print("🤖 OmniFlow Automation Runner - HuggingFace Native (0 Maliyet)")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    # Yapılandırma kontrol
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL ve SUPABASE_KEY gerekli!")
        return
    
    # Database oluştur
    init_database()
    
    # Aktif blueprint'leri getir
    print("\n📋 Aktif blueprint'ler Supabase'den çekiliyor...")
    blueprints = get_active_blueprints()
    
    print(f"✓ {len(blueprints)} aktif blueprint bulundu")
    
    if not blueprints:
        print("ℹ️ Çalıştırılacak blueprint yok.")
        return
    
    # Her blueprint'i çalıştır
    success_count = 0
    error_count = 0
    
    for bp in blueprints:
        if not isinstance(bp, dict):
            print(f"⚠️ Geçersiz blueprint formatı, atlaniyor...")
            continue
        
        bp_id = bp.get('id')
        bp_name = bp.get('name', 'İsimsiz')
        
        if not bp_id:
            print(f"⚠️ Blueprint ID bulunamadı, atlaniyor...")
            continue
        
        print(f"\n🔍 Blueprint: {bp_name}")
        
        # Çalıştır
        success, result = run_blueprint(bp)
        
        # Log'a kaydet
        try:
            if success:
                success_count += 1
                log_execution(bp_id, bp_name, 'success', 0, result)
                print(f"✓ {bp_name} başarıyla tamamlandı")
                notify('✅ Otomasyon Başarılı', f"📋 {bp_name}\n⏰ {datetime.now().strftime('%H:%M')}")
            else:
                error_count += 1
                log_execution(bp_id, bp_name, 'error', 0, None, result)
                print(f"✗ {bp_name} başarısız")
                notify('❌ Otomasyon Hatası', f"📋 {bp_name}\n🔴 {result[:100]}")
        except Exception as e:
            print(f"⚠️ Log hatası: {e}")
    
    # Özet
    print("\n" + "=" * 70)
    print(f"📊 ÖZET")
    print(f"   ✅ Başarılı: {success_count}")
    print(f"   ❌ Hata: {error_count}")
    print(f"   📊 Database: {DB_FILE}")
    print("=" * 70)

if __name__ == "__main__":
    main()


def get_active_blueprints() -> list:
    """Aktif blueprint'leri getir"""
    return supabase_request('GET', 'blueprints?is_active=eq.true')

def log_execution(blueprint_id: str, status: str, result: Optional[str] = None, error: Optional[str] = None):
    """Execution log kaydet"""
    supabase_request('POST', 'execution_logs', {
        'blueprint_id': blueprint_id,
        'status': status,
        'node_results': {'output': result} if result else None,
        'error_message': error,
        'finished_at': datetime.utcnow().isoformat() if status != 'running' else None
    })

def update_blueprint_status(blueprint_id: str, last_result: str):
    """Blueprint durumunu güncelle"""
    supabase_request('PATCH', f'blueprints?id=eq.{blueprint_id}', {
        'last_run': datetime.utcnow().isoformat(),
        'last_result': last_result,
        'run_count': 'run_count + 1'  # Bu Supabase'de çalışmaz, RPC kullanın
    })

# ============================================
# GEMINI AI
# ============================================

def run_gemini_agent(node: dict, context: str) -> str:
    """Gemini AI ile ajan çalıştır"""
    if not GEMINI_API_KEY:
        return f"[MOCK] {node.get('title', 'Agent')}: Simülasyon yanıtı"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
    ROL: {node.get('role', 'Assistant')}
    GÖREV: {node.get('task', '')}
    BAĞLAM: {context}
    
    Türkçe ve detaylı yanıt ver.
    """
    
    try:
        response = requests.post(url, json={
            'contents': [{'parts': [{'text': prompt}]}]
        })
        data = response.json()
        
        if 'candidates' in data and data['candidates']:
            return data['candidates'][0]['content']['parts'][0]['text']
        else:
            return f"API Hatası: {data.get('error', {}).get('message', 'Unknown')}"
    except Exception as e:
        return f"Bağlantı hatası: {str(e)}"

# ============================================
# NOTIFICATIONS
# ============================================

def send_telegram(message: str):
    """Telegram bildirimi gönder"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("[Telegram] Yapılandırılmamış, atlaniyor...")
        return
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        requests.post(url, json={
            'chat_id': TELEGRAM_CHAT_ID,
            'text': message,
            'parse_mode': 'HTML'
        })
        print("[Telegram] Mesaj gönderildi ✓")
    except Exception as e:
        print(f"[Telegram] Hata: {e}")

def send_discord(message: str):
    """Discord webhook bildirimi"""
    if not DISCORD_WEBHOOK:
        return
    
    try:
        requests.post(DISCORD_WEBHOOK, json={
            'embeds': [{
                'title': '🤖 OmniFlow',
                'description': message,
                'color': 5814783
            }]
        })
        print("[Discord] Mesaj gönderildi ✓")
    except Exception as e:
        print(f"[Discord] Hata: {e}")

def notify(title: str, message: str):
    """Tüm kanallara bildirim gönder"""
    full_message = f"<b>{title}</b>\n\n{message}"
    send_telegram(full_message)
    send_discord(f"**{title}**\n{message}")

# ============================================
# MAIN RUNNER
# ============================================

def run_blueprint(blueprint: dict) -> tuple[bool, str]:
    """Tek bir blueprint'i çalıştır"""
    name = blueprint.get('name', 'Unknown')
    nodes = blueprint.get('nodes', [])
    context = blueprint.get('base_knowledge', '')
    
    print(f"\n{'='*50}")
    print(f"🚀 Çalıştırılıyor: {name}")
    print(f"📦 Düğüm sayısı: {len(nodes)}")
    print(f"{'='*50}")
    
    results = []
    
    for i, node in enumerate(nodes):
        node_title = node.get('title', f'Node {i+1}')
        print(f"\n[{i+1}/{len(nodes)}] {node_title}...")
        
        try:
            result = run_gemini_agent(node, context)
            results.append({
                'node': node_title,
                'status': 'success',
                'output': result[:500]  # İlk 500 karakter
            })
            context += f"\n\n{node_title} Çıktısı: {result[:200]}"
            print(f"   ✓ Tamamlandı")
        except Exception as e:
            results.append({
                'node': node_title,
                'status': 'error',
                'error': str(e)
            })
            print(f"   ✗ Hata: {e}")
            return False, str(e)
    
    return True, json.dumps(results, ensure_ascii=False)

def main():
    """Ana çalıştırıcı"""
    print("="*60)
    print("🤖 OmniFlow Automation Runner")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # Yapılandırma kontrolü
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ SUPABASE_URL ve SUPABASE_KEY gerekli!")
        return
    
    # Aktif blueprint'leri getir
    blueprints = get_active_blueprints()
    
    # Debug: Gelen veriyi kontrol et
    print(f"\n📋 Supabase yanıtı: {type(blueprints)}")
    
    # Liste olmayanı listeye çevir
    if not isinstance(blueprints, list):
        print(f"⚠️ Beklenmeyen format: {blueprints}")
        blueprints = []
    
    print(f"📋 {len(blueprints)} aktif blueprint bulundu")
    
    if not blueprints:
        print("ℹ️ Çalıştırılacak blueprint yok.")
        return
    
    # Her blueprint'i çalıştır
    success_count = 0
    error_count = 0
    
    for bp in blueprints:
        # Debug: Blueprint türünü kontrol et
        print(f"\n🔍 Blueprint türü: {type(bp)}")
        
        # Eğer bp bir dict değilse atla
        if not isinstance(bp, dict):
            print(f"⚠️ Geçersiz blueprint formatı: {bp}")
            continue
        
        bp_id = bp.get('id')
        bp_name = bp.get('name', 'İsimsiz')
        notify_on = bp.get('notify_on') or ['error']
        
        print(f"📋 Blueprint: {bp_name} (ID: {bp_id})")
        
        if not bp_id:
            print("⚠️ Blueprint ID bulunamadı, atlaniyor...")
            continue
        
        # Başlangıç logu
        try:
            log_execution(bp_id, 'running')
        except Exception as e:
            print(f"⚠️ Log hatası: {e}")
        
        # Çalıştır
        success, result = run_blueprint(bp)
        
        # Sonuç logu
        if success:
            success_count += 1
            try:
                log_execution(bp_id, 'success', result=result)
                update_blueprint_status(bp_id, 'success')
            except Exception as e:
                print(f"⚠️ Status güncelleme hatası: {e}")
            
            if 'success' in notify_on or 'always' in notify_on:
                notify('✅ Otomasyon Tamamlandı', f"📋 {bp_name}\n⏰ {datetime.now().strftime('%H:%M')}")
        else:
            error_count += 1
            try:
                log_execution(bp_id, 'error', error=result)
                update_blueprint_status(bp_id, 'error')
            except Exception as e:
                print(f"⚠️ Status güncelleme hatası: {e}")
            
            if 'error' in notify_on or 'always' in notify_on:
                notify('❌ Otomasyon Hatası', f"📋 {bp_name}\n🔴 {result[:200]}")
    
    # Özet
    print("\n" + "="*60)
    print(f"📊 ÖZET: {success_count} başarılı, {error_count} hata")
    print("="*60)

if __name__ == "__main__":
    main()
