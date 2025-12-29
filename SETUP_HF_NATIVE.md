# 🏭 OmniFlow - HuggingFace Native Automation Factory

**0 Maliyet | Hatasız | Paralel 25-40 Ajan | Production Ready**

---

## 📋 Genel Bakış

OmniFlow artık **tamamen ücretsiz HuggingFace API** ve **Ollama local modellerle** çalışıyor. Gemini'ye ihtiyaç yok. Her otomasyon sorunsuz şekilde çalışır, 3 kez otomatik retry, timeout koruması ve exponential backoff ile.

### ✅ Özellikler

- **0 Maliyet**: Free HF API + Ollama lokal modeller
- **Hatasız**: 3x retry, exponential backoff, timeout protection
- **Paralel**: 25-40 ajan aynı anda (worker pool + priority queue)
- **Persistent**: SQLite database ile execution history
- **Monitörlü**: Health checks, memory management, logging
- **Notifikasyonlu**: Telegram + Discord bildirimler
- **Production Ready**: Python/Node.js/Docker/GitHub Actions exports

---

## 🚀 Hızlı Başlangıç

### 1. HuggingFace Token Olması

```bash
# 1. https://huggingface.co/settings/tokens adresine git
# 2. "New token" → "Fine-grained" seç
# 3. Name: "omniflow"
# 4. Scopes: "Read" seç
# 5. Create → Token'ı kopyala
```

### 2. Çevre Değişkenlerini Ayarla

```bash
# .env dosyası oluştur
cp .env.example .env

# Düzenle:
HUGGINGFACE_TOKEN=hf_your_token_here
USE_OLLAMA=false  # Başlangıçta HF API kullan
REQUEST_TIMEOUT=300
MAX_RETRIES=3
```

### 3. Test Et

**Browser'da:**
```bash
npm install
npm run dev
# http://localhost:5173 açı
# Test değişkenleri ekle
# "Sandbox Test" butonuna tıkla
```

**CLI'da:**
```bash
python runner.py
```

---

## 🏗️ Mimarı

### Frontend (App.tsx)

```typescript
// HuggingFace ile node çalıştır
const result = await callHuggingFaceModel({
  task: prompt,
  model: selectBestModel(nodeType),
  timeout: 300000,  // 5 dakika
  useOllama: false,
});
```

**Worker Pool (agentQueueService.ts):**
- 25-40 worker (CPU core'u kadar)
- Priority queue (critical → normal → low)
- Health checks (10s interval)
- Memory management

### Backend (runner.py)

```python
# Supabase'den aktif blueprint'leri çek
# Her birini HF API ile çalıştır
# SQLite'a kaydet
# Telegram/Discord'a bildir
```

**Retry Logic:**
- Attempt 1: 1 saniye
- Attempt 2: 2 saniye
- Attempt 3: 4 saniye
- Max total: 7 saniye

**Model Loading Handling:**
```python
# Model yükleniyor = wait 30s → retry
# Rate limit = wait 60s → retry
# Timeout = retry 3x
```

---

## 📦 Kurulum Seçenekleri

### Seçenek 1: Local (Hemen Test Etmek)

```bash
# 1. Frontend
npm install
npm run dev

# 2. Runner (başka terminal)
python runner.py

# 3. Ollama (opsiyonel - lokal modeller için)
ollama serve
```

### Seçenek 2: Docker (Production)

```bash
# Kurulum
docker-compose up -d

# Logs
docker-compose logs -f omniflow-runner

# Durdurmak
docker-compose down
```

**Compose dosyası:**
- `omniflow-runner`: Python automation runner
- `ollama`: Local model server (optional)

### Seçenek 3: GitHub Actions (Scheduled)

```bash
# 1. GitHub Secrets ekle:
HUGGINGFACE_TOKEN=hf_...
SUPABASE_URL=https://...
SUPABASE_KEY=eyJ...
TELEGRAM_BOT_TOKEN=123...
DISCORD_WEBHOOK=https://...

# 2. .github/workflows/omniflow-runner-hf.yml otomatik çalışır
# Her 6 saatte bir
```

### Seçenek 4: Railway/Render (Free Cloud)

```bash
# Railway (en kolayı)
1. https://railway.app adresine git
2. New Project → GitHub repo bağla
3. Environment variables ekle
4. Deploy

# Variables:
HUGGINGFACE_TOKEN=hf_...
SUPABASE_URL=...
USE_OLLAMA=false
```

---

## 🔧 Kod Üretimi

**Blueprint'ten otomatik kod oluştur:**

```typescript
import { generateCode } from './services/codeGeneratorHF';

// Python script
const pythonCode = generateCode(blueprint, 'python');
// → main.py, requirements.txt, .env.example, Dockerfile, docker-compose.yml

// Node.js
const nodeCode = generateCode(blueprint, 'nodejs');
// → main.js, package.json, .env.example

// GitHub Action
const actionCode = generateCode(blueprint, 'github-action');
// → .github/workflows/automation-name.yml
```

**Çıkan kod:**
- ✅ HuggingFace API entegre
- ✅ 3x retry logic
- ✅ SQLite persistence
- ✅ Timeout koruma
- ✅ Error handling
- ✅ Ready to run

---

## 📊 Monitoring

### Database Sorgusu

```bash
# SQLite'a bak
sqlite3 automation_runner.db

# Tüm executions
SELECT blueprint_name, status, total_time_ms 
FROM runner_executions 
ORDER BY started_at DESC 
LIMIT 10;

# Başarısız runs
SELECT * FROM runner_executions WHERE status = 'error';
```

### Logs

```bash
# Python runner
python runner.py 2>&1 | grep "HF\|HATA\|✓"

# Docker
docker-compose logs omniflow-runner

# GitHub Actions
GitHub repo → Actions → Run details
```

---

## 🧪 Test Senaryoları

### 1. HuggingFace API Test

```python
from services.huggingfaceService import callHuggingFaceModel

result = await callHuggingFaceModel({
    'task': 'Merhaba, sen kimsin?',
    'model': 'mistralai/Mistral-7B-Instruct-v0.2',
    'timeout': 300000,
})

print(result.output)  # Should work ✅
```

### 2. Queue Test (40 Agent)

```typescript
import { agentQueue } from './services/agentQueueService';

// 40 task ekle
const taskIds = [];
for (let i = 0; i < 40; i++) {
  const id = agentQueue.addTask({
    blueprintId: 'test',
    priority: i % 2 === 0 ? 'high' : 'normal',
    payload: { test: true },
  });
  taskIds.push(id);
}

// Bekle ve sonuç al
const results = await agentQueue.waitForTasks(taskIds);
console.log(`${results.size} tasks completed`);
```

### 3. Failure Simulation

```typescript
selectedBlueprint.testConfig = {
  variables: [
    { key: 'TEST', value: 'value' }
  ],
  simulateFailures: true  // ← 30% hata oranı
};

// Sandbox Test başlat
// Yapay hatalar ve recover'ı gözle
```

---

## 🚨 Sorun Giderme

### "Token not found"

```
❌ HUGGINGFACE_TOKEN bulunamadı

Çözüm:
1. https://huggingface.co/settings/tokens adresine git
2. Token oluştur
3. .env dosyasına ekle: HUGGINGFACE_TOKEN=hf_...
4. Uygulamayı restart et
```

### "Model loading"

```
⏳ Model yükleniyor, 30s bekleniyor...

Bu normal! İlk çağrı model'i yükler.
Otomatik retry 3 kez denecek.
Max 90 saniyede tamamlanacak.
```

### "Rate limit"

```
⏳ Rate limited, 60s bekleniyor...

Çözüm: REQUEST_TIMEOUT'u artır
Veya USE_OLLAMA=true (lokal model)
```

### "Timeout"

```
ERROR: Task timeout after 300000ms

Çözüm: .env dosyasında REQUEST_TIMEOUT değerini artır
REQUEST_TIMEOUT=600  # 10 dakika
```

### "Ollama connection failed"

```
OLLAMA_URL: http://localhost:11434

Çözüm:
1. Ollama'yı başlat: ollama serve
2. Veya docker-compose up ollama
3. Veya USE_OLLAMA=false (HF API kullan)
```

---

## 📈 Performance Tuning

### 1. Parallelism

```typescript
// agentQueueService.ts
const CONCURRENCY = Math.min(navigator.hardwareConcurrency || 4, 40);
// → Auto-adjust to CPU cores (max 40)
```

### 2. Memory Management

```python
# runner.py
MEMORY_THRESHOLD_MB = 500
# → Worker'lar 500MB'ı aşarsa garbage collection trigger
```

### 3. Timeout Ayarlanması

```bash
# Local (fast internet)
REQUEST_TIMEOUT=60

# Cloud (slow/unpredictable)
REQUEST_TIMEOUT=300

# Very slow (3G/satellite)
REQUEST_TIMEOUT=600
```

### 4. Model Selection

```python
# Fast inference (1-2 sec)
'mistralai/Mistral-7B-Instruct-v0.2'

# Better quality (3-5 sec)
'meta-llama/Llama-2-7b-chat-hf'

# Powerful (5-10 sec)
'meta-llama/Meta-Llama-3-8B-Instruct'

# Local Ollama (instant)
'mistral' or 'neural-chat'
```

---

## 🎯 Best Practices

1. **Her zaman retry logic'i test et**
   ```bash
   TEST_FAILURES=true npm run test
   ```

2. **Database'i düzenli backup'la**
   ```bash
   cp automation_runner.db automation_runner_backup.db
   ```

3. **Logs'u kontrol et**
   ```bash
   # Başarısız runs bul
   grep "❌" logs.txt
   ```

4. **Memory leak kontrolü**
   ```typescript
   // Browser DevTools → Memory → Take heap snapshot
   // Her 100 task sonra memory kontrol et
   ```

5. **Rate limit'i respektleyin**
   ```python
   time.sleep(1)  # Node'lar arasında
   ```

---

## 📚 API Referensi

### HuggingFaceService

```typescript
callHuggingFaceModel({
  task: string,           // Model için prompt
  model?: string,         // HF model ID (default: Mistral)
  temperature?: number,   // 0.0-1.0 (default: 0.7)
  maxTokens?: number,     // Max output length
  timeout?: number,       // Ms (default: 300000)
  useOllama?: boolean,    // Try Ollama first
}): Promise<HFResponse>

// Returns:
{
  success: boolean,
  output?: string,
  error?: string,
  model: string,
  tokensUsed?: number,
  cached?: boolean,
}
```

### AgentQueueService

```typescript
agentQueue.addTask(task)              // → taskId
agentQueue.addBatch(tasks)            // → taskIds[]
agentQueue.waitForTasks(ids)          // → Promise<Map>
agentQueue.getStats()                 // → QueueStats
agentQueue.retryFailedTasks()         // → count
agentQueue.on('task-completed', fn)   // → unsubscribe()
```

---

## 🌍 Deployment Checklist

- [ ] HuggingFace token oluşturdum
- [ ] .env dosyasını oluşturdum
- [ ] Local'de test ettim (`npm run dev`)
- [ ] `runner.py` başarıyla çalıştı
- [ ] SQLite database oluşturdu
- [ ] Docker image build ettim (`docker build -f Dockerfile.runner .`)
- [ ] GitHub Secrets ekledim
- [ ] Supabase blueprints setup'ını yaptım
- [ ] Telegram/Discord webhook'larını kurdum
- [ ] Production'a deploy ettim

---

## 🆘 Destek

**Sorular:**
- GitHub Issues açmak
- Logs'u share etmek (sensitive data hariç)
- SQLite database'i analiz etmek

**Rapor etmek:**
- Hata mesajını tam yaz
- `DB_FILE` içeriğini share et (tablolar)
- Çevre ayarlarını (token hariç) paylaş

---

**Made with ❤️ for 0-cost, fault-tolerant automation**
