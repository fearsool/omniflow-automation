// Netlify Edge Function - HuggingFace API Proxy
// CORS sorununu çözer, api-inference.huggingface.co kullanır

export default async (request, context) => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        const body = await request.json();
        const HF_TOKEN = Netlify.env.get('HUGGINGFACE_TOKEN') ||
            Netlify.env.get('VITE_HUGGINGFACE_TOKEN') ||
            Netlify.env.get('VITE_HF_API_KEY') || '';

        console.log('[HF Proxy] Token exists:', !!HF_TOKEN);

        if (!HF_TOKEN) {
            // Token yoksa mock response döndür
            return new Response(JSON.stringify({
                generated_text: '⚠️ HuggingFace token yapılandırılmamış. Simüle yanıt döndürülüyor.',
                mock: true
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        // Inference API kullan (daha güvenilir)
        const model = body.model || 'mistralai/Mistral-7B-Instruct-v0.2';
        const HF_URL = `https://api-inference.huggingface.co/models/${model}`;

        console.log('[HF Proxy] Calling:', HF_URL);

        // api-inference format
        const requestBody = {
            inputs: body.inputs || body.messages?.[0]?.content || body.task || 'Hello',
            parameters: {
                max_new_tokens: body.max_tokens || 500,
                temperature: body.temperature || 0.7,
                return_full_text: false
            }
        };

        const response = await fetch(HF_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('[HF Proxy] Response status:', response.status);

        // Model yükleniyor?
        if (response.status === 503 || data.error?.includes('loading')) {
            console.log('[HF Proxy] Model loading, waiting...');
            // Bekleme süresini al
            const waitTime = data.estimated_time || 20;
            return new Response(JSON.stringify({
                generated_text: `⏳ Model yükleniyor, ${Math.round(waitTime)} saniye bekleyin...`,
                loading: true,
                estimated_time: waitTime
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }

        // Başarılı yanıt - api-inference formatından çıkar
        let output = '';
        if (Array.isArray(data) && data.length > 0) {
            output = data[0].generated_text || '';
        } else if (data.generated_text) {
            output = data.generated_text;
        } else if (data.error) {
            output = `Hata: ${data.error}`;
        }

        return new Response(JSON.stringify({
            generated_text: output,
            success: true,
            model: model
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('[HF Proxy] Error:', error.message);
        return new Response(JSON.stringify({
            error: error.message,
            generated_text: '❌ API hatası oluştu, mock yanıt kullanılıyor.'
        }), {
            status: 200, // 500 yerine 200 dön ki frontend crash olmasın
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
};

export const config = {
    path: '/api/hf/*',
};
