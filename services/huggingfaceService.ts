/**
 * HuggingFace Inference Providers Servisi - 0 Maliyet
 * ✅ HF Free API (router.huggingface.co)
 * ✅ Chat Completions format (yeni API)
 * ✅ Exponential backoff + 3 kez otomatik retry
 * ✅ Timeout protection (5 dakika)
 */

export interface HFRequestOptions {
  task: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface HFResponse {
  success: boolean;
  output?: string;
  error?: string;
  model: string;
  tokensUsed?: number;
  cached?: boolean;
}

// ==================== KONFİGÜRASYON ====================

// HuggingFace Inference Providers'da çalışan modeller (Aralık 2024)
// Resmi dökümantasyondan: https://huggingface.co/docs/api-inference/tasks/chat-completion
const FREE_HF_MODELS = {
  TEXT_GENERATION: 'google/gemma-2-2b-it', // Hafif, hızlı, ücretsiz
  ANALYSIS: 'Qwen/Qwen2.5-7B-Instruct-1M', // Analiz için
  RESEARCH: 'meta-llama/Llama-3.1-8B-Instruct', // Araştırma
  CREATIVE: 'microsoft/Phi-3-mini-4k-instruct', // Hafif fallback
};

// Ollama lokal modeller (kendi sunucunda - tamamen ücretsiz)
const OLLAMA_MODELS = {
  FAST: 'mistral',
  STANDARD: 'neural-chat',
  POWERFUL: 'llama2-uncensored',
};

const HF_TOKEN = (import.meta as any)?.env?.VITE_HUGGINGFACE_TOKEN ||
  process.env.VITE_HUGGINGFACE_TOKEN ||
  (typeof process !== 'undefined' ? process.env.HUGGINGFACE_TOKEN : '');

const OLLAMA_URL = (import.meta as any)?.env?.VITE_OLLAMA_URL ||
  (typeof process !== 'undefined' ? process.env.OLLAMA_URL : 'http://localhost:11434');

// Yeni HuggingFace Inference Providers API
const HF_API_URL = typeof window !== 'undefined'
  ? '/api/hf/chat/completions'  // Proxy üzerinden
  : 'https://router.huggingface.co/v1/chat/completions';


// ==================== RETRY & TIMEOUT LOGIC ====================

async function callWithRetry(
  fn: () => Promise<HFResponse>,
  maxRetries: number = 3
): Promise<HFResponse> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fn();

      // Model yükleniyor mu? Retry et ama bekle
      if (!result.success && result.error?.includes('loading')) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 30000); // 1s -> 2s -> 4s -> max 30s
        console.log(`[HF] Model loading, waiting ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Rate limit error? Retry et ama daha fazla bekle
      if (!result.success && result.error?.includes('429')) {
        const waitTime = Math.min(5000 * Math.pow(2, attempt), 60000); // 5s -> 10s -> 20s -> max 60s
        console.log(`[HF] Rate limited, waiting ${waitTime}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Başarılı veya ciddi hata - çık
      return result;

    } catch (error) {
      // Network hatası? Retry et
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000; // exponential backoff
        console.log(`[HF] Retry ${attempt + 1}/${maxRetries} after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      return {
        success: false,
        error: `Max retries exceeded: ${error}`,
        model: 'unknown',
      };
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
    model: 'unknown',
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 300000 // 5 dakika default
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
  );

  return Promise.race([promise, timeoutPromise]);
}

// ==================== OLLAMA (LOCAL) ÇAĞRI ====================

async function callOllama(task: string, model: string = OLLAMA_MODELS.FAST): Promise<HFResponse> {
  try {
    const response = await withTimeout(
      fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: task,
          stream: false,
          temperature: 0.7,
        }),
      }),
      300000 // 5 dakika
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Ollama API error: ${response.status}`,
        model,
      };
    }

    const data = await response.json();
    return {
      success: true,
      output: data.response || '',
      model,
      cached: false,
    };
  } catch (error) {
    return {
      success: false,
      error: `Ollama error: ${error}`,
      model,
    };
  }
}

// ==================== HUGGINGFACE CHAT COMPLETIONS API ====================

async function callHuggingFace(
  task: string,
  model: string = FREE_HF_MODELS.TEXT_GENERATION
): Promise<HFResponse> {
  // HF token yoksa error dön
  if (!HF_TOKEN) {
    return {
      success: false,
      output: '',
      error: 'HuggingFace token not configured',
      model
    };
  }

  try {
    // Chat completions format - HuggingFace Inference Providers API
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          content: task
        }
      ],
      max_tokens: 1024,
      temperature: 0.7,
      stream: false
    };

    console.log(`[HF] Calling ${HF_API_URL} with model: ${model}`);

    // Browser'da proxy üzerinden gider, Authorization header proxy tarafından eklenir
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Sadece server-side (Node.js) için Authorization header ekle
    if (typeof window === 'undefined' && HF_TOKEN) {
      headers['Authorization'] = `Bearer ${HF_TOKEN}`;
    }

    const response = await withTimeout(
      fetch(HF_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      }),
      300000 // 5 dakika timeout
    );

    console.log(`[HF] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[HF] Error response: ${errorText.substring(0, 300)}`);

      // Model yükleniyor?
      if (response.status === 503 && errorText.includes('loading')) {
        return {
          success: false,
          error: 'Model loading - retry in 30s',
          model,
        };
      }

      // Rate limit?
      if (response.status === 429) {
        return {
          success: false,
          error: 'Rate limited - retry in 60s',
          model,
        };
      }

      return {
        success: false,
        error: `HF API error ${response.status}: ${errorText.substring(0, 150)}`,
        model,
      };
    }

    const data = await response.json();

    // Chat completions format parsing
    let output = '';
    if (data.choices && data.choices.length > 0) {
      output = data.choices[0].message?.content || data.choices[0].text || '';
    } else if (data.generated_text) {
      output = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      output = data[0].generated_text;
    } else {
      output = JSON.stringify(data);
    }

    return {
      success: true,
      output: String(output).trim(),
      model,
      cached: false,
      tokensUsed: data.usage?.total_tokens,
    };
  } catch (error) {
    // Timeout veya network hatası
    return {
      success: false,
      error: `HF API error: ${error}`,
      model,
    };
  }
}

// ==================== DÜZENLI HAFIZA TEMIZLIĞI ====================

const responseCache = new Map<string, { data: HFResponse; timestamp: number }>();

function getCachedResponse(key: string): HFResponse | null {
  const cached = responseCache.get(key);
  if (!cached) return null;

  // 10 dakika geçmişse sil
  if (Date.now() - cached.timestamp > 600000) {
    responseCache.delete(key);
    return null;
  }

  return cached.data;
}

function setCachedResponse(key: string, data: HFResponse) {
  // Cache boyutunu kontrol et (max 100 entry)
  if (responseCache.size > 100) {
    const oldestKey = Array.from(responseCache.keys())[0];
    responseCache.delete(oldestKey);
  }

  responseCache.set(key, { data, timestamp: Date.now() });
}

// ==================== MAİN FONKSIYON ====================

export async function callHuggingFaceModel(options: HFRequestOptions): Promise<HFResponse> {
  const {
    task,
    model = FREE_HF_MODELS.TEXT_GENERATION,
    timeout = 300000, // 5 dakika
  } = options;

  // Cache kontrol et
  const cacheKey = `${model}:${task.substring(0, 50)}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    console.log('[HF] Cache hit');
    return { ...cached, cached: true };
  }

  // HuggingFace API'yi dene
  const hfResult = await callWithRetry(() => callHuggingFace(task, model));

  if (hfResult.success) {
    setCachedResponse(cacheKey, hfResult);
    return hfResult;
  }

  // HF başarısız ise cache etme, error döndür
  console.log('[HF] HF API failed:', hfResult.error);
  return hfResult;
}

// ==================== PROMPT BUILDER (Node formatını HF'ye çevir) ====================

export function buildHFPrompt(
  role: string,
  task: string,
  context: string,
  inputData: string
): string {
  return `You are a ${role}.

Your task: ${task}

Context: ${context}

Input: ${inputData}

Respond with actionable output only, no explanations.`;
}

// ==================== UTILITY FUNCTIONS ====================

export function selectBestModel(nodeType: string): string {
  const typeToModel: Record<string, string> = {
    'CONTENT_CREATOR': FREE_HF_MODELS.TEXT_GENERATION,
    'ANALYST_CRITIC': FREE_HF_MODELS.ANALYSIS,
    'RESEARCHER': FREE_HF_MODELS.RESEARCH,
    'LOGIC_GATE': FREE_HF_MODELS.ANALYSIS,
    'WRITER': FREE_HF_MODELS.TEXT_GENERATION,
    'default': FREE_HF_MODELS.TEXT_GENERATION,
  };

  return typeToModel[nodeType] || typeToModel.default;
}

export function isLocalOllamaAvailable(): Promise<boolean> {
  return fetch(`${OLLAMA_URL}/api/tags`, { method: 'GET' })
    .then(() => true)
    .catch(() => false);
}

export function getAvailableModels() {
  return {
    huggingface: FREE_HF_MODELS,
    ollama: OLLAMA_MODELS,
  };
}
