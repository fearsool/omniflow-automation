# 🤖 Real Automations - Gerçek Çalışan Otomasyonlar

Bu klasör **OmniFlow Factory** tarafından üretilen gerçek çalışan Python otomasyonlarını içerir.

## 📦 İçerik

| Dosya | Açıklama | Gelir Potansiyeli |
|-------|----------|-------------------|
| `blog_post_generator.py` | SEO uyumlu blog yazısı üretir | $20-100/makale |
| `instagram_caption_generator.py` | Viral IG caption ve hashtag üretir | SMM hizmeti |
| `etsy_seo_generator.py` | Etsy başlık, açıklama, tag üretir | $50-200/gig |
| `tweet_generator.py` | Tweet ve thread üretir | Sosyal medya yönetimi |
| `email_responder.py` | AI ile email yanıtı üretir | Müşteri hizmetleri |

## 🚀 Kurulum

```bash
# 1. Bağımlılıkları yükle
pip install -r requirements.txt

# 2. .env dosyası oluştur
cp env_example.txt .env

# 3. HuggingFace token'ını ekle
# .env dosyasını aç ve HUGGINGFACE_TOKEN'ı güncelle
```

## 🔑 HuggingFace Token Alma

1. [huggingface.co](https://huggingface.co) → Kayıt ol / Giriş yap
2. Settings → Access Tokens
3. "New token" → "Read" izni ver
4. Token'ı kopyala ve `.env` dosyasına yapıştır

## 💡 Kullanım

```bash
# Blog yazısı üret
python blog_post_generator.py "Yapay Zeka Trendleri" "AI,teknoloji,gelecek"

# Instagram caption üret
python instagram_caption_generator.py "girişimcilik" "motivasyonel"

# Etsy listing üret
python etsy_seo_generator.py "Dijital Planner 2024" "dijital ürün"

# Tweet üret
python tweet_generator.py "AI para kazanma yolları" "tweet"
python tweet_generator.py "AI para kazanma yolları" "thread"

# Email yanıtı üret
python email_responder.py
```

## ⚡ GitHub Actions ile Otomatik Çalıştırma

Bu otomasyonları zamanlanmış görevler olarak çalıştırabilirsin:

1. Repository → Actions → New workflow
2. `.github/workflows/automation.yml` dosyasını oluştur
3. Secrets'a `HUGGINGFACE_TOKEN` ekle

---

*Made with ❤️ by OmniFlow Factory*
