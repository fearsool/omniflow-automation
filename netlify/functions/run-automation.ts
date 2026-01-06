/**
 * Automation Runner API
 * Fabrikadan gelen otomasyon isteklerini gerçek AI ile çalıştırır
 */

// Handler tipi

// HuggingFace API çağrısı
async function callHuggingFace(prompt: string): Promise<string> {
    const token = process.env.HUGGINGFACE_TOKEN;
    if (!token) {
        throw new Error("HUGGINGFACE_TOKEN not set");
    }

    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 500,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.replace(prompt, "").trim();
    }
    return "";
}

// Otomasyon tipleri ve promptları
const AUTOMATION_PROMPTS: Record<string, (params: Record<string, string>) => string> = {
    // Blog Yazısı
    "blog-post": (params) => `Bir blog yazısı yaz:
Konu: ${params.topic || "Yapay Zeka"}
Anahtar kelimeler: ${params.keywords || "AI, teknoloji"}

Format:
# [Başlık]

[Giriş paragrafı - 2-3 cümle]

## [Alt Başlık 1]
[İçerik - 3-4 cümle]

## [Alt Başlık 2]
[İçerik - 3-4 cümle]

## Sonuç
[Sonuç paragrafı - 2-3 cümle]

Yazı profesyonel, SEO uyumlu ve Türkçe olmalı.`,

    // Instagram Caption
    "instagram-caption": (params) => `Instagram için viral bir caption yaz:
Tema: ${params.theme || "girişimcilik"}
Ton: ${params.tone || "ilham verici"}

Kurallar:
1. Hook cümlesi ile başla
2. Değer kat
3. Call-to-action ekle
4. 5-8 alakalı hashtag ekle
5. 1-2 emoji kullan

Sadece caption'ı yaz:`,

    // Etsy SEO
    "etsy-listing": (params) => `Etsy için ürün listesi oluştur:
Ürün: ${params.product || "Dijital Planner"}
Kategori: ${params.category || "dijital ürün"}

Oluştur:
1. SEO uyumlu başlık (max 140 karakter)
2. Açıklama (3-4 paragraf)
3. 13 adet SEO tag

Format:
BAŞLIK: [başlık]

AÇIKLAMA:
[açıklama]

TAGLAR: tag1, tag2, tag3...`,

    // Tweet
    "tweet": (params) => `Twitter/X için viral bir tweet yaz:
Konu: ${params.topic || "AI"}
Stil: ${params.style || "bilgilendirici"}

Kurallar:
1. Max 280 karakter
2. Dikkat çekici
3. Değer kat
4. 1-2 emoji

Sadece tweet'i yaz:`,

    // Tweet Thread
    "tweet-thread": (params) => `Twitter/X için 5 tweet'lik thread yaz:
Konu: ${params.topic || "AI ile para kazanma"}

Format:
1/ [tweet 1]
2/ [tweet 2]
3/ [tweet 3]
4/ [tweet 4]
5/ [tweet 5 - CTA içermeli]

Her tweet max 280 karakter.`,

    // Email Yanıtı
    "email-response": (params) => `Bu emaile profesyonel yanıt yaz:

GELEN EMAIL:
${params.email || "Ürününüzle ilgileniyorum. Fiyat bilgisi alabilir miyim?"}

Kurallar:
1. Profesyonel ve nazik
2. Soruları cevapla
3. İmza ekle

Yanıt:`,

    // Ürün Açıklaması
    "product-description": (params) => `E-ticaret ürün açıklaması yaz:
Ürün: ${params.product || "Kablosuz Kulaklık"}
Özellikler: ${params.features || "Bluetooth 5.0, 20 saat pil"}

Format:
1. Dikkat çekici başlık
2. Ana açıklama (2-3 paragraf)
3. Özellik listesi (bullet points)
4. Neden almalı?

Türkçe ve ikna edici olmalı.`,

    // LinkedIn Post
    "linkedin-post": (params) => `LinkedIn için profesyonel post yaz:
Konu: ${params.topic || "Kariyer gelişimi"}
Hedef: ${params.target || "profesyoneller"}

Kurallar:
1. Profesyonel ton
2. Değer kat
3. Hikaye anlat
4. CTA ekle
5. 3-5 hashtag

Post:`,

    // SEO Meta
    "seo-meta": (params) => `SEO meta bilgileri oluştur:
Sayfa: ${params.page || "Ana sayfa"}
Konu: ${params.topic || "E-ticaret"}

Oluştur:
1. Title (max 60 karakter)
2. Meta Description (max 160 karakter)
3. 5 Focus Keyword

Format:
TITLE: [title]
DESCRIPTION: [description]
KEYWORDS: keyword1, keyword2...`,

    // Script/Hook
    "video-script": (params) => `Viral video script'i yaz:
Konu: ${params.topic || "Para kazanma"}
Platform: ${params.platform || "TikTok/Reels"}
Süre: ${params.duration || "30 saniye"}

Format:
HOOK (ilk 3 saniye): [dikkat çekici açılış]

İÇERİK: [ana mesaj]

CTA: [call to action]

Script kısa, etkili ve viral potansiyelli olmalı.`,

    // Trend Analizi
    "trend-analysis": (params) => `Trend analizi yap:
Niş: ${params.niche || "dijital ürünler"}
Platform: ${params.platform || "Etsy, Amazon"}

Analiz:
1. Top 5 trend ürün/konu
2. Her biri için neden trend
3. Fırsat değerlendirmesi
4. Öneriler

Detaylı ve actionable bilgiler ver.`
};

// Ana handler - Netlify Function formatı
const handler = async (event: { httpMethod: string; body: string | null }, context: any) => {
    // CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };

    // OPTIONS request for CORS
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    // Only POST allowed
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" })
        };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const { type, params = {} } = body;

        if (!type) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing 'type' parameter" })
            };
        }

        // Prompt oluştur
        const promptFn = AUTOMATION_PROMPTS[type];
        if (!promptFn) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: `Unknown automation type: ${type}`,
                    available: Object.keys(AUTOMATION_PROMPTS)
                })
            };
        }

        const prompt = promptFn(params);

        // HuggingFace'e gönder
        const result = await callHuggingFace(prompt);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                type,
                params,
                result,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error("Automation error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error"
            })
        };
    }
};

export { handler };
