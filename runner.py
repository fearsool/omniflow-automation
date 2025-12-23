#!/usr/bin/env python3
"""
OmniFlow Automation Runner
GitHub Actions veya cron ile çalıştırılır.
Supabase'den aktif blueprint'leri çekip çalıştırır.
"""

import os
import json
import requests
from datetime import datetime
from typing import Optional

# ============================================
# CONFIGURATION
# ============================================

SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

# Bildirim ayarları
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '')

DISCORD_WEBHOOK = os.environ.get('DISCORD_WEBHOOK', '')

# ============================================
# SUPABASE CLIENT
# ============================================

def supabase_request(method: str, endpoint: str, data: Optional[dict] = None) -> dict:
    """Supabase REST API isteği"""
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    if method == 'GET':
        response = requests.get(url, headers=headers)
    elif method == 'POST':
        response = requests.post(url, headers=headers, json=data)
    elif method == 'PATCH':
        response = requests.patch(url, headers=headers, json=data)
    else:
        raise ValueError(f"Unsupported method: {method}")
    
    return response.json() if response.text else {}

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
