#!/usr/bin/env python3
"""
🏻 Kuaför İçerik Otomasyonu
Kuaför/güzellik salonu için sosyal medya içerikleri üretir
"""

import os
import json
import requests
from datetime import datetime

HUGGINGFACE_TOKEN = os.getenv('HUGGINGFACE_TOKEN', '')
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = "google/gemma-2-2b-it"

def call_ai(prompt: str) -> str:
    if not HUGGINGFACE_TOKEN:
        return "Error: HUGGINGFACE_TOKEN not set"
    
    response = requests.post(HF_API_URL, 
        headers={"Authorization": f"Bearer {HUGGINGFACE_TOKEN}", "Content-Type": "application/json"},
        json={"model": HF_MODEL, "messages": [{"role": "user", "content": prompt}], "max_tokens": 1024, "temperature": 0.8},
        timeout=120
    )
    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", str(data))

def generate_hairdresser_content(salon_name: str = "Güzellik Salonu"):
    print(f"\n{'='*50}")
    print(f"💇 Kuaför İçerik Otomasyonu - {salon_name}")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*50}\n")
    
    results = {}
    
    # 1. TREND ANALİZİ
    print("🔍 1/4 Kuaför trendleri taranıyor...")
    trends_prompt = f"""Sen bir kuaför ve güzellik trendleri uzmanısın.
    
{salon_name} için güncel saç ve güzellik trendlerini listele:

1. En popüler 5 saç kesimi/modeli
2. Trend olan renkler ve boyama teknikleri
3. Bu ay öne çıkan güzellik hizmetleri
4. Popüler hashtagler

Türkiye pazarına odaklan. Kısa ve öz yaz."""
    
    results['trendler'] = call_ai(trends_prompt)
    print("✅ Trendler analiz edildi\n")
    
    # 2. INSTAGRAM İÇERİKLERİ
    print("📸 2/4 Instagram içerikleri oluşturuluyor...")
    instagram_prompt = f"""Sen profesyonel bir sosyal medya uzmanısın.
{salon_name} için 3 adet HAZIR Instagram gönderisi yaz.

Her gönderi için:
- Dikkat çekici açılış cümlesi
- Emoji kullanımı
- Hizmet/ürün tanıtımı
- Call-to-action
- 5-7 hashtag

Formatı şöyle yap:
📷 POST 1:
[İçerik buraya]

📷 POST 2:
[İçerik buraya]

📷 POST 3:
[İçerik buraya]"""

    results['instagram'] = call_ai(instagram_prompt)
    print("✅ Instagram içerikleri hazır\n")
    
    # 3. HIKAYE FİKİRLERİ
    print("📱 3/4 Story fikirleri oluşturuluyor...")
    story_prompt = f"""{salon_name} için 5 Instagram Story fikri ver.

Her biri için:
- Story türü (poll, quiz, before-after, günlük rutin vs.)
- İçerik açıklaması
- Etkileşim öğesi

Kısa ve uygulanabilir olsun."""

    results['hikayeler'] = call_ai(story_prompt)
    print("✅ Story fikirleri hazır\n")
    
    # 4. KAMPANYA ÖNERİSİ
    print("🎁 4/4 Kampanya önerileri oluşturuluyor...")
    campaign_prompt = f"""{salon_name} için 2 haftalık kampanya önerisi yap.

İçermeli:
1. Kampanya adı ve sloganı
2. İndirim/teklif detayları
3. Hedef kitle
4. Sosyal medya duyuru metni
5. Kampanya görseli için AI prompt

Yaratıcı ve Türk pazarına uygun olsun."""

    results['kampanya'] = call_ai(campaign_prompt)
    print("✅ Kampanya önerileri hazır\n")
    
    # SONUÇLARI GÖSTER
    print("\n" + "="*60)
    print("📊 SONUÇLAR - KOPYALA VE KULLAN!")
    print("="*60)
    
    print("\n" + "🔥 TRENDLER ".ljust(60, "─"))
    print(results['trendler'])
    
    print("\n" + "📸 INSTAGRAM GÖNDERİLERİ ".ljust(60, "─"))
    print(results['instagram'])
    
    print("\n" + "📱 STORY FİKİRLERİ ".ljust(60, "─"))
    print(results['hikayeler'])
    
    print("\n" + "🎁 KAMPANYA ".ljust(60, "─"))
    print(results['kampanya'])
    
    # JSON kaydet
    output_file = f"kuafor_icerik_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'salon': salon_name,
            'tarih': datetime.now().isoformat(),
            'sonuclar': results
        }, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Sonuçlar kaydedildi: {output_file}")
    return results

if __name__ == "__main__":
    import sys
    salon = sys.argv[1] if len(sys.argv) > 1 else "Ali Kurt Hair Artist"
    generate_hairdresser_content(salon)
