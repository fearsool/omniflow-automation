#!/usr/bin/env python3
"""
Google Yorum Yanıtlayıcı (REAL API VERSION)
OmniFlow Factory tarafından oluşturuldu
🚀 GERÇEK API ENTEGRASYONLARI ile çalışır!
"""

import os
import json
import time
import requests
import sys
import io
from datetime import datetime

# Windows terminal encoding fix
try:
    if sys.stdout.encoding != 'utf-8':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
except:
    pass


# python-dotenv kullanarak .env dosyasını yükle
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ============================================
# GERÇEK API FONKSİYONLARI
# ============================================

def fetch_google_reviews():
    """Google Places API ile gerçek yorumları çeker"""
    api_key = os.getenv('GOOGLE_API_KEY')
    place_id = os.getenv('GOOGLE_PLACE_ID')
    
    if not api_key or not place_id:
        print("❌ GOOGLE_API_KEY veya GOOGLE_PLACE_ID tanımlı değil!")
        print("ℹ️  .env dosyasını kontrol edin.")
        return []
    
    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "name,rating,reviews,user_ratings_total",
        "language": "tr",
        "key": api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") == "OK":
            result = data.get("result", {})
            reviews = result.get("reviews", [])
            print(f"✅ {len(reviews)} yorum bulundu - {result.get('name', 'İşletme')}")
            return reviews
        else:
            print(f"❌ Google API hatası: {data.get('status')}")
            if data.get("status") == "REQUEST_DENIED":
                print("ℹ️  API Key'inizin 'Places API' yetkisi olduğundan emin olun.")
            return []
    except Exception as e:
        print(f"❌ Bağlantı hatası: {e}")
        return []

def analyze_sentiment(text):
    """HuggingFace ile duygu analizi yapar"""
    hf_token = os.getenv('HUGGINGFACE_TOKEN')
    
    if not hf_token:
        print("❌ HUGGINGFACE_TOKEN tanımlı değil!")
        return {"label": "nötr", "score": 0}
    
    API_URL = "https://api-inference.huggingface.co/models/savasy/bert-base-turkish-sentiment-cased"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    try:
        response = requests.post(API_URL, headers=headers, json={"inputs": text}, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0:
            predictions = result[0]
            if isinstance(predictions, list):
                best = max(predictions, key=lambda x: x.get("score", 0))
                label = best.get("label", "neutral")
                score = best.get("score", 0)
                
                label_tr = {
                    "positive": "olumlu",
                    "negative": "olumsuz", 
                    "neutral": "nötr",
                    "LABEL_0": "olumsuz",
                    "LABEL_1": "olumlu"
                }.get(label, label)
                
                return {"label": label_tr, "score": score}
        
        return {"label": "belirsiz", "score": 0}
    except Exception as e:
        print(f"⚠️ Sentiment analizi uyarısı (API meşgul olabilir): {e}")
        # Fallback: Basit kelime bazlı analiz
        lower_text = text.lower()
        if any(x in lower_text for x in ['kötü', 'berbat', 'rezalet', 'pahalı', 'yavaş']):
            return {"label": "olumsuz", "score": 0.8}
        if any(x in lower_text for x in ['iyi', 'süper', 'harika', 'güzel', 'hızlı']):
            return {"label": "olumlu", "score": 0.8}
        return {"label": "nötr", "score": 0.5}

def generate_ai_response(prompt, max_tokens=512):
    """HuggingFace veya OpenAI ile AI yanıt üretir"""
    hf_token = os.getenv('HUGGINGFACE_TOKEN')
    
    if not hf_token:
        print("❌ HUGGINGFACE_TOKEN tanımlı değil!")
        return "AI yanıtı üretilemedi"
    
    # Model: Google Gemma-2 (Free & High Quality)
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {hf_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "google/gemma-2-2b-it",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        
        if "choices" in data and len(data["choices"]) > 0:
            content = data["choices"][0]["message"]["content"]
            return content
        
        return "AI yanıtı alınamadı (boş yanıt)"
    except Exception as e:
        print(f"❌ AI üretim hatası: {e}")
        return f"Hata: {e}"

def send_telegram_message(message):
    """Telegram bildirimi gönderir"""
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        return False
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message[:4000]}
    try:
        requests.post(url, json=payload, timeout=10)
        return True
    except:
        return False

# ============================================
# WORKFLOW NODES
# ============================================

def node_0_gr_1(input_data):
    """Yorum Alıcı (Gerçek Google API)"""
    print(f"⚙️ Running: Yorum Alıcı")
    reviews = fetch_google_reviews()
    
    result = []
    if reviews:
        # API'den dönen tüm yorumları işle (Genelde Google son 5'i verir)
        recent = reviews
        for r in recent:
            result.append({
                "author": r.get("author_name", "Anonim"),
                "rating": r.get("rating", 0),
                "text": r.get("text", ""),
                "time": r.get("relative_time_description", "")
            })
        print(f"✅ {len(result)} yorum işlenmek üzere alındı")
        return result
    return []

def node_1_gr_2(input_data):
    """Sentiment Analizi"""
    print(f"⚙️ Running: Sentiment Analizi")
    
    if isinstance(input_data, list):
        analyzed = []
        for item in input_data:
            text = item.get("text", "")
            if text:
                sentiment = analyze_sentiment(text)
                analyzed.append({
                    **item,
                    "sentiment": sentiment
                })
        print(f"✅ {len(analyzed)} yorum analiz edildi")
        return analyzed
    return input_data

def node_2_gr_3(input_data):
    """Yönlendirici (Logic Gate)"""
    print(f"⚙️ Running: Yönlendirici")
    
    if isinstance(input_data, list):
        negative = [x for x in input_data if x.get("sentiment", {}).get("label") == "olumsuz"]
        positive = [x for x in input_data if x.get("sentiment", {}).get("label") == "olumlu"]
        neutral = [x for x in input_data if x.get("sentiment", {}).get("label") not in ["olumsuz", "olumlu"]]
        
        return {
            "negative": negative,
            "positive": positive,
            "neutral": neutral,
            "has_urgent": len(negative) > 0
        }
    return {"processed": input_data}

def node_3_gr_4(input_data):
    """Acil Bildirim (Telegram)"""
    print(f"⚙️ Running: Acil Bildirim")
    
    if isinstance(input_data, dict) and input_data.get("has_urgent"):
        negative = input_data.get("negative", [])
        for item in negative:
            msg = f"🚨 OLUMSUZ YORUM!\n\n"
            msg += f"👤 {item.get('author', 'Anonim')}\n"
            msg += f"⭐ {item.get('rating', '?')}/5\n"
            msg += f"📝 {item.get('text', '')[:200]}"
            send_telegram_message(msg)
            print(f"📢 Telegram bildirimi gönderildi: {item.get('author')}")
    
    return input_data

def node_4_gr_5(input_data):
    """AI Yanıt Üretici"""
    print(f"⚙️ Running: AI Yanıt Üretici")
    
    responses = []
    items_to_process = []
    
    if isinstance(input_data, dict):
        items_to_process = input_data.get("positive", []) + input_data.get("negative", [])
    elif isinstance(input_data, list):
        items_to_process = input_data
    
    print(f"ℹ️  Toplam {len(items_to_process)} yoruma yanıt üretiliyor...")
    
    for item in items_to_process:
        text = item.get("text", "")
        author = item.get("author", "Müşteri")
        sentiment = item.get("sentiment", {}).get("label", "nötr")
        
        if sentiment == "olumlu":
            prompt = f"Bir işletme sahibi olarak bu OLUMLU Google yorumuna samimi, kısa ve Türkçe bir teşekkür mesajı yaz. Yorum yapan: {author}. Yorum: '{text}'"
        else:
            prompt = f"Bir işletme sahibi olarak bu OLUMSUZ Google yorumuna profesyonel, çözüm odaklı, kibar ve Türkçe bir yanıt yaz. Özür dile ve iletişime geçmesini iste. Yorum yapan: {author}. Yorum: '{text}'"
        
        ai_response = generate_ai_response(prompt, max_tokens=250)
        
        # Tırnak işaretlerini temizle
        ai_response = ai_response.replace('"', '').replace("'", "")
        
        responses.append({
            **item,
            "suggested_reply": ai_response
        })
        time.sleep(1) # API limit
        
    print(f"✅ {len(responses)} yanıt başarıyla üretildi")
    return responses

def node_5_gr_6(input_data):
    """Yanıt Gönder (Çıktı & Dosyaya Kayıt)"""
    print(f"⚙️ Running: Yanıt Gönder")
    
    output_file = "GOOGLE_YANITLARI.txt"
    
    with open(output_file, "a", encoding="utf-8") as f:
        f.write(f"\n\n=== {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ===\n")
        
        if isinstance(input_data, list):
            for item in input_data:
                reply = item.get("suggested_reply", "")
                author = item.get("author", "Müşteri")
                rating = item.get("rating", 5)
                text = item.get("text", "")
                
                # Ekrana yaz
                print("\n" + "-"*40)
                print(f"👤 Müşteri: {author} ({rating} Yıldız)")
                print(f"📝 Yorum: {text}")
                print(f"💬 ÖNERİLEN YANIT:\n{reply}")
                print("-" * 40)
                
                # Dosyaya yaz
                f.write(f"Müşteri: {author}\n")
                f.write(f"Yorum: {text}\n")
                f.write(f"Yanıt: {reply}\n")
                f.write("-" * 30 + "\n")
                
    print(f"\n💾 Tüm yanıtlar '{output_file}' dosyasına kaydedildi.")
    print("⚠️  Google API kısıtlaması nedeniyle yanıtlar otomatik gönderilememiştir.")
    print("👉 Lütfen yukarıdaki yanıtları kopyalayıp Google Business paneline yapıştırın.")
    
    return input_data

# ============================================
# MAIN EXECUTION
# ============================================
def run_workflow():
    """Execute the complete workflow with REAL APIs"""
    print("=" * 50)
    print(f"🚀 Starting: Google Yorum Otomasyonu")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("🔌 GERÇEK API Modu Aktif")
    print("=" * 50)
    
    current_output = "Start"
    results = {}
    
    try:
        # Step 1
        results['gr-1'] = node_0_gr_1(current_output)
        current_output = results['gr-1']
        
        if not current_output:
            print("⚠️ Hiç yorum bulunamadı veya API hatası.")
            return

        # Step 2
        results['gr-2'] = node_1_gr_2(current_output)
        current_output = results['gr-2']

        # Step 3
        results['gr-3'] = node_2_gr_3(current_output)
        current_output = results['gr-3']

        # Step 4
        results['gr-4'] = node_3_gr_4(current_output)
        current_output = results['gr-4']

        # Step 5
        results['gr-5'] = node_4_gr_5(current_output)
        current_output = results['gr-5']

        # Step 6
        results['gr-6'] = node_5_gr_6(current_output)
        
    except Exception as e:
        print(f"\n❌ Kritik Hata: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 50)
    print("✅ İşlem Tamamlandı")
    print("=" * 50)

if __name__ == "__main__":
    run_workflow()
