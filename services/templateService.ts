
import { SystemBlueprint, WorkflowNode, NodeType, StepStatus } from '../types';

// ============================================
// TEMPLATE SERVICE - Hazır Otomasyon Şablonları
// ============================================

// API Gereksinimi tanımı
export interface ApiRequirement {
    name: string;           // Environment variable adı: "BINANCE_API_KEY"
    label: string;          // Kullanıcıya gösterilen ad: "Binance API Key"
    description: string;    // Açıklama: "Binance hesabınızdan API key alın"
    link?: string;          // Nereden alınacağı: "https://binance.com/settings/api"
    required?: boolean;     // Zorunlu mu? (default: true)
    placeholder?: string;   // Input placeholder
}

export interface AutomationTemplate {
    id: string;
    name: string;
    description: string;
    category: 'money-maker' | 'assistant' | 'scraper' | 'content' | 'analytics' | 'video' | 'finance' | 'health' | 'education' | 'ecommerce' | 'customer';
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedRevenue: string;
    icon: string;
    tags: string[];
    blueprint: Omit<SystemBlueprint, 'id'>;
    requiredApis?: ApiRequirement[];  // Deploy öncesi girilmesi gereken API'ler
}

// ============================================
// HAZIR ŞABLONLAR
// ============================================

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
    {
        id: 'whatsapp-ai-assistant',
        name: 'WhatsApp AI Müşteri Asistanı',
        description: '7/24 çalışan, müşteri sorularını Gemini AI ile yanıtlayan WhatsApp botu. Sipariş takibi, randevu hatırlatma ve SSS desteği.',
        category: 'assistant',
        difficulty: 'medium',
        estimatedRevenue: '₺5,000-15,000/ay',
        icon: '💬',
        tags: ['whatsapp', 'chatbot', 'müşteri hizmetleri', 'ai'],
        blueprint: {
            name: 'WhatsApp AI Asistan',
            description: 'Otomatik müşteri yanıtlama sistemi',
            masterGoal: 'Müşteri sorularını 7/24 AI ile yanıtla',
            baseKnowledge: 'WhatsApp Business API, Gemini AI entegrasyonu',
            category: 'Assistant',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wa-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mesaj Alıcı', role: 'Webhook dinleyici', task: 'Gelen WhatsApp mesajlarını yakala', status: StepStatus.IDLE, connections: [{ targetId: 'wa-2' }] },
                { id: 'wa-2', type: NodeType.AGENT_PLANNER, title: 'Niyet Analizi', role: 'AI Analiz', task: 'Mesajın amacını belirle (soru, şikayet, sipariş)', status: StepStatus.IDLE, connections: [{ targetId: 'wa-3' }] },
                { id: 'wa-3', type: NodeType.LOGIC_GATE, title: 'Yönlendirici', role: 'Karar verici', task: 'SSS ise otomatik yanıt, karmaşık ise insan yönlendir', status: StepStatus.IDLE, connections: [{ targetId: 'wa-4', condition: 'auto' }, { targetId: 'wa-5', condition: 'human' }] },
                { id: 'wa-4', type: NodeType.CONTENT_CREATOR, title: 'AI Yanıt Üretici', role: 'HuggingFace Mistral 7B', task: 'Bağlamsal ve nazik yanıt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'wa-6' }] },
                { id: 'wa-5', type: NodeType.HUMAN_APPROVAL, title: 'İnsan Bildirimi', role: 'Slack/Email', task: 'Destek ekibine bildirim gönder', status: StepStatus.IDLE, connections: [{ targetId: 'wa-6' }] },
                { id: 'wa-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mesaj Gönderici', role: 'WhatsApp API', task: 'Yanıtı müşteriye gönder', status: StepStatus.IDLE, connections: [] }
            ]
        },
        requiredApis: [
            { name: 'WHATSAPP_TOKEN', label: 'WhatsApp Business API Token', description: 'Meta Business Suite üzerinden alın', link: 'https://business.facebook.com/settings/whatsapp-api', placeholder: 'EAAxxxxxxx' },
            { name: 'WHATSAPP_PHONE_ID', label: 'WhatsApp Phone Number ID', description: 'Meta geliştirici panelinden', placeholder: '1234567890' },
            { name: 'GEMINI_API_KEY', label: 'Gemini AI API Key', description: 'Google AI Studio\'dan ücretsiz alın', link: 'https://aistudio.google.com/apikey', placeholder: 'AIzaSy...' }
        ]
    },
    {
        id: 'google-reviews-responder',
        name: 'Google Yorum Otomatik Yanıtlayıcı',
        description: 'Google Business yorumlarını izler, AI ile analiz eder ve uygun yanıtlar üretir. Olumsuz yorumlara hızlı müdahale, olumlu yorumlara teşekkür.',
        category: 'assistant',
        difficulty: 'medium',
        estimatedRevenue: '₺3,000-8,000/ay (itibar yönetimi)',
        icon: '⭐',
        tags: ['google', 'yorum', 'itibar', 'müşteri', 'ai'],
        blueprint: {
            name: 'Google Yorum Yanıtlayıcı',
            description: 'Otomatik Google yorum yönetimi',
            masterGoal: 'Tüm Google yorumlarına hızlı ve profesyonel yanıt ver',
            baseKnowledge: 'Google Business API, Sentiment analizi, Müşteri hizmetleri',
            category: 'Assistant',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'gr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yorum Alıcı', role: 'Google API', task: 'Yeni Google Business yorumlarını çek', status: StepStatus.IDLE, connections: [{ targetId: 'gr-2' }] },
                { id: 'gr-2', type: NodeType.ANALYST_CRITIC, title: 'Sentiment Analizi', role: 'AI Analiz', task: 'Yorumun tonunu analiz et (olumlu/olumsuz/nötr)', status: StepStatus.IDLE, connections: [{ targetId: 'gr-3' }] },
                { id: 'gr-3', type: NodeType.LOGIC_GATE, title: 'Yönlendirici', role: 'Karar', task: 'Olumsuz ise acil, olumlu ise standart yanıt', status: StepStatus.IDLE, connections: [{ targetId: 'gr-4', condition: 'negative' }, { targetId: 'gr-5', condition: 'positive' }] },
                { id: 'gr-4', type: NodeType.HUMAN_APPROVAL, title: 'Acil Bildirim', role: 'Alert', task: 'Olumsuz yorum için yöneticiye bildirim', status: StepStatus.IDLE, connections: [{ targetId: 'gr-6' }] },
                { id: 'gr-5', type: NodeType.CONTENT_CREATOR, title: 'AI Yanıt Üretici', role: 'HuggingFace', task: 'Kişiselleştirilmiş teşekkür/çözüm mesajı yaz', status: StepStatus.IDLE, connections: [{ targetId: 'gr-6' }] },
                { id: 'gr-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yanıt Gönder', role: 'Google API', task: 'Hazırlanan yanıtı yoruma gönder', status: StepStatus.IDLE, connections: [] }
            ]
        },
        requiredApis: [
            { name: 'GOOGLE_API_KEY', label: 'Google Business API Key', description: 'Google Cloud Console\'dan alın', link: 'https://console.cloud.google.com/apis', placeholder: 'AIzaSy...' },
            { name: 'GOOGLE_PLACE_ID', label: 'Google Place ID', description: 'İşletmenizin Google Place ID\'si', link: 'https://developers.google.com/maps/documentation/places/web-service/place-id', placeholder: 'ChIJ...' },
            { name: 'HUGGINGFACE_TOKEN', label: 'HuggingFace Token', description: 'AI yanıt üretimi için', link: 'https://huggingface.co/settings/tokens', placeholder: 'hf_...' }
        ]
    },
    {
        id: 'ecommerce-price-tracker',
        name: 'E-ticaret Rakip Fiyat Takibi',
        description: 'Rakip sitelerdeki ürün fiyatlarını izler, değişiklik olduğunda bildirim gönderir. Otomatik fiyat ayarlama önerileri.',
        category: 'scraper',
        difficulty: 'medium',
        estimatedRevenue: '₺10,000-30,000/ay tasarruf',
        icon: '📊',
        tags: ['e-ticaret', 'fiyat takip', 'scraper', 'analiz'],
        blueprint: {
            name: 'Fiyat Takip Sistemi',
            description: 'Rakip fiyat monitörü',
            masterGoal: 'Rakip fiyatlarını takip et ve fırsat bul',
            baseKnowledge: 'Web scraping, fiyat karşılaştırma algoritmaları',
            category: 'Scraper',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pt-1', type: NodeType.STATE_MANAGER, title: 'URL Listesi', role: 'Konfigürasyon', task: 'Takip edilecek ürün URL listesini al', status: StepStatus.IDLE, connections: [{ targetId: 'pt-2' }] },
                { id: 'pt-2', type: NodeType.RESEARCH_WEB, title: 'Fiyat Scraper', role: 'Web Crawler', task: 'Her URL\'den güncel fiyatı çek', status: StepStatus.IDLE, connections: [{ targetId: 'pt-3' }] },
                { id: 'pt-3', type: NodeType.ANALYST_CRITIC, title: 'Fiyat Karşılaştırıcı', role: 'Analiz', task: 'Önceki fiyatlarla karşılaştır, değişim hesapla', status: StepStatus.IDLE, connections: [{ targetId: 'pt-4' }] },
                { id: 'pt-4', type: NodeType.LOGIC_GATE, title: 'Değişim Algılayıcı', role: 'Tetikleyici', task: 'Fiyat düştüyse veya çıktıysa bildir', status: StepStatus.IDLE, connections: [{ targetId: 'pt-5' }] },
                { id: 'pt-5', type: NodeType.CONTENT_CREATOR, title: 'Strateji Önerici', role: 'AI', task: 'Fiyat stratejisi önerisi oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'pt-6' }] },
                { id: 'pt-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildirim Gönder', role: 'Email/Slack', task: 'Raporu ve önerileri gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'social-content-factory',
        name: 'Sosyal Medya İçerik Fabrikası',
        description: 'Günlük trend analizi yapıp, viral potansiyeli olan içerikler üretir. Instagram, Twitter, LinkedIn için optimize.',
        category: 'content',
        difficulty: 'easy',
        estimatedRevenue: '₺3,000-10,000/ay',
        icon: '🎨',
        tags: ['sosyal medya', 'içerik', 'viral', 'trend'],
        blueprint: {
            name: 'İçerik Fabrikası',
            description: 'Otomatik sosyal medya içerik üretimi',
            masterGoal: 'Günlük viral içerik üret',
            baseKnowledge: 'Trend analizi, copywriting, görsel tasarım',
            category: 'Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sc-1', type: NodeType.RESEARCH_WEB, title: 'Trend Tarayıcı', role: 'Twitter/Instagram', task: 'Günün viral trendlerini bul', status: StepStatus.IDLE, connections: [{ targetId: 'sc-2' }] },
                { id: 'sc-2', type: NodeType.ANALYST_CRITIC, title: 'Fırsat Analizi', role: 'AI', task: 'Markayla uyumlu trendleri filtrele', status: StepStatus.IDLE, connections: [{ targetId: 'sc-3' }] },
                { id: 'sc-3', type: NodeType.CONTENT_CREATOR, title: 'Metin Yazarı', role: 'Copywriter AI', task: 'Platformlara özel caption yaz', status: StepStatus.IDLE, connections: [{ targetId: 'sc-4' }] },
                { id: 'sc-4', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Önerici', role: 'Design AI', task: 'Görsel konsepti ve prompt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'sc-5' }] },
                { id: 'sc-5', type: NodeType.SOCIAL_MANAGER, title: 'İçerik Paketi', role: 'Export', task: 'Hazır paylaşım paketi oluştur', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'lead-hunter',
        name: 'LinkedIn Lead Hunter',
        description: 'Hedef sektörden potansiyel müşterileri bulur, kişiselleştirilmiş mesaj taslakları hazırlar.',
        category: 'money-maker',
        difficulty: 'hard',
        estimatedRevenue: '₺20,000-50,000/ay',
        icon: '🎯',
        tags: ['lead generation', 'linkedin', 'satış', 'b2b'],
        blueprint: {
            name: 'Lead Hunter',
            description: 'Otomatik potansiyel müşteri bulma',
            masterGoal: 'Hedef kitelden kaliteli lead\'ler bul',
            baseKnowledge: 'LinkedIn Sales Navigator, B2B satış stratejileri',
            category: 'Money-Maker',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'lh-1', type: NodeType.STATE_MANAGER, title: 'Hedef Tanımı', role: 'Konfigürasyon', task: 'Sektör, pozisyon, şirket büyüklüğü kriterleri', status: StepStatus.IDLE, connections: [{ targetId: 'lh-2' }] },
                { id: 'lh-2', type: NodeType.RESEARCH_WEB, title: 'LinkedIn Tarayıcı', role: 'Scraper', task: 'Kriterlere uyan profilleri bul', status: StepStatus.IDLE, connections: [{ targetId: 'lh-3' }] },
                { id: 'lh-3', type: NodeType.ANALYST_CRITIC, title: 'Lead Skorlama', role: 'AI Analiz', task: 'Potansiyeli değerlendir ve puanla', status: StepStatus.IDLE, connections: [{ targetId: 'lh-4' }] },
                { id: 'lh-4', type: NodeType.CONTENT_CREATOR, title: 'Mesaj Hazırlayıcı', role: 'Copywriter', task: 'Kişiselleştirilmiş bağlantı mesajı yaz', status: StepStatus.IDLE, connections: [{ targetId: 'lh-5' }] },
                { id: 'lh-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'CRM Export', role: 'Entegrasyon', task: 'Lead\'leri CRM\'e aktar', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'weekly-analytics-report',
        name: 'Haftalık Analitik Rapor Botu',
        description: 'Tüm platformlardan verileri toplar, AI ile analiz eder, yöneticilere özet rapor gönderir.',
        category: 'analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺2,000-5,000/ay (zaman tasarrufu)',
        icon: '📈',
        tags: ['rapor', 'analitik', 'dashboard', 'özet'],
        blueprint: {
            name: 'Haftalık Rapor Botu',
            description: 'Otomatik analitik rapor sistemi',
            masterGoal: 'Haftalık performans raporu oluştur',
            baseKnowledge: 'Google Analytics, sosyal medya metrikleri, satış verileri',
            category: 'Analytics',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ar-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Veri Kaynakları', role: 'API Bağlantıları', task: 'GA, Facebook, Satış verilerini çek', status: StepStatus.IDLE, connections: [{ targetId: 'ar-2' }] },
                { id: 'ar-2', type: NodeType.STATE_MANAGER, title: 'Veri Birleştirici', role: 'ETL', task: 'Tüm verileri tek formatta birleştir', status: StepStatus.IDLE, connections: [{ targetId: 'ar-3' }] },
                { id: 'ar-3', type: NodeType.ANALYST_CRITIC, title: 'AI Yorumcu', role: 'HuggingFace Mistral 7B', task: 'Trendleri ve anomalileri analiz et', status: StepStatus.IDLE, connections: [{ targetId: 'ar-4' }] },
                { id: 'ar-4', type: NodeType.CONTENT_CREATOR, title: 'Rapor Yazıcı', role: 'Sunum', task: 'Yönetici özeti ve öneriler oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'ar-5' }] },
                { id: 'ar-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Rapor Dağıtımı', role: 'Email/Slack', task: 'PDF raporu ilgili kişilere gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-arbitrage-bot',
        name: 'Kripto Arbitraj Dedektörü',
        description: 'Borsalar arası fiyat farklarını anlık takip eder, arbitraj fırsatı bulduğunda bildirim gönderir. Yüksek karlılık potansiyeli ile futures trading için optimize.',
        category: 'money-maker',
        difficulty: 'hard',
        estimatedRevenue: '₺5,000-100,000/ay',
        icon: '💰',
        tags: ['kripto', 'arbitraj', 'trading', 'finans', 'high-roi'],
        blueprint: {
            name: 'Kripto Arbitraj Bot',
            description: 'Borsalar arası fiyat farkı takibi',
            masterGoal: 'Karlı arbitraj fırsatlarını bul',
            baseKnowledge: 'Kripto borsaları, API entegrasyonları, işlem ücretleri, hızlı karar mekanizması',
            category: 'Money-Maker',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ca-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Borsa Bağlantıları', role: 'API', task: 'Binance, Coinbase, Kraken fiyatlarını real-time çek', status: StepStatus.IDLE, connections: [{ targetId: 'ca-2' }] },
                { id: 'ca-2', type: NodeType.TRADING_DESK, title: 'Fiyat Karşılaştırıcı', role: 'Hesaplama', task: 'Aynı coin için tüm borsaları karşılaştır', status: StepStatus.IDLE, connections: [{ targetId: 'ca-3' }] },
                { id: 'ca-3', type: NodeType.LOGIC_GATE, title: 'Karlılık Filtresi', role: 'Karar', task: 'İşlem ücretleri dahil kar %2+ mı?', status: StepStatus.IDLE, connections: [{ targetId: 'ca-4' }] },
                { id: 'ca-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Acil Bildirim', role: 'Push/SMS', task: 'Fırsat detaylarını anında gönder', status: StepStatus.IDLE, connections: [] }
            ]
        },
        requiredApis: [
            { name: 'BINANCE_API_KEY', label: 'Binance API Key', description: 'Binance hesabınızdan API key oluşturun', link: 'https://www.binance.com/tr/my/settings/api-management', placeholder: 'xxxxx' },
            { name: 'BINANCE_SECRET', label: 'Binance Secret Key', description: 'API oluştururken verilen secret', placeholder: 'xxxxx' },
            { name: 'TELEGRAM_BOT_TOKEN', label: 'Telegram Bot Token', description: 'BotFather ile bot oluşturup token alın', link: 'https://t.me/BotFather', placeholder: '1234567890:ABCdef...' },
            { name: 'TELEGRAM_CHAT_ID', label: 'Telegram Chat ID', description: 'Bildirim alacağınız chat/grup ID', placeholder: '-1001234567890', required: false }
        ]
    },
    {
        id: 'customer-invoice-automation',
        name: 'Müşteri Fatura & Ödeme Takip',
        description: 'Otomatik fatura oluşturma, gönderme ve ödeme takibi. Gecikmiş ödemeler için otomatik hatırlatmalar. Muhasebecilerin %40 zamanını tasarruf ettirir.',
        category: 'money-maker',
        difficulty: 'easy',
        estimatedRevenue: '₺8,000-20,000/ay (zaman tasarrufu)',
        icon: '📋',
        tags: ['fatura', 'muhasebe', 'ödeme', 'b2b', 'zaman-tasarrufu'],
        blueprint: {
            name: 'Fatura Otomasyon Sistemi',
            description: 'Otomatik faturalama ve ödeme takibi',
            masterGoal: 'Faturalama sürecini %100 otomatik hale getir',
            baseKnowledge: 'Fatura yapısı, ödeme şartları, hatırlatma stratejileri',
            category: 'Money-Maker',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'inv-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sipariş Alıcısı', role: 'E-ticaret/CRM API', task: 'Yeni siparişleri yakala', status: StepStatus.IDLE, connections: [{ targetId: 'inv-2' }] },
                { id: 'inv-2', type: NodeType.CONTENT_CREATOR, title: 'Fatura Üretici', role: 'PDF Generator', task: 'Sipariş verilerine göre fatura oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'inv-3' }] },
                { id: 'inv-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fatura Gönderici', role: 'Email/SMS', task: 'Faturayı müşteriye gönder', status: StepStatus.IDLE, connections: [{ targetId: 'inv-4' }] },
                { id: 'inv-4', type: NodeType.STATE_MANAGER, title: 'Ödeme Takibi', role: 'Database', task: 'Ödeme durumunu izle ve sakla', status: StepStatus.IDLE, connections: [{ targetId: 'inv-5' }] },
                { id: 'inv-5', type: NodeType.LOGIC_GATE, title: 'Tardiye Detektörü', role: 'Karar', task: '15 gün gecikmiş mi?', status: StepStatus.IDLE, connections: [{ targetId: 'inv-6' }] },
                { id: 'inv-6', type: NodeType.CONTENT_CREATOR, title: 'Hatırlatma Yazıcı', role: 'Personalization', task: 'Efektif ödeme talep mesajı yaz', status: StepStatus.IDLE, connections: [{ targetId: 'inv-7' }] },
                { id: 'inv-7', type: NodeType.EXTERNAL_CONNECTOR, title: 'Hatırlatma Gönderici', role: 'Multi-channel', task: 'Email, SMS, WhatsApp ile gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'amazon-replenishment-bot',
        name: 'Amazon FBA Restock Otomasyonu',
        description: 'Satış hızını analiz ederek, stok seviyesi kritik olduğunda otomatik restock siparişi gönderir. Amazon FBA satıcıları %30+ daha hızlı büyürler.',
        category: 'money-maker',
        difficulty: 'medium',
        estimatedRevenue: '₺15,000-50,000/ay',
        icon: '📦',
        tags: ['amazon', 'e-ticaret', 'fba', 'envanter', 'growth-hacking'],
        blueprint: {
            name: 'Amazon Restock Bot',
            description: 'Otomatik stok yönetimi ve tedarik',
            masterGoal: 'Asla stok çıkmasını engelle, optimal seviye tut',
            baseKnowledge: 'Amazon Selling Partner API, satış velocity, tedarik zaman dilimi',
            category: 'Money-Maker',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'amz-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satış Verisi', role: 'Amazon SP API', task: 'Son 30 günün satış ve stok durumunu çek', status: StepStatus.IDLE, connections: [{ targetId: 'amz-2' }] },
                { id: 'amz-2', type: NodeType.ANALYST_CRITIC, title: 'Satış Hızı Analizi', role: 'ML Model', task: 'Günlük satış hızını hesapla, trend bul', status: StepStatus.IDLE, connections: [{ targetId: 'amz-3' }] },
                { id: 'amz-3', type: NodeType.LOGIC_GATE, title: 'Restock Karar', role: 'Algoritma', task: 'Tedarik süresi + arası X satış hızı = restock mu?', status: StepStatus.IDLE, connections: [{ targetId: 'amz-4' }] },
                { id: 'amz-4', type: NodeType.CONTENT_CREATOR, title: 'Sipariş Oluşturucu', role: 'Veri Hazırlayıcı', task: 'Tedarikçiye gönderilecek sipariş hazırla', status: StepStatus.IDLE, connections: [{ targetId: 'amz-5' }] },
                { id: 'amz-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Tedarikçi Bildir', role: 'Email/API', task: 'Sipariş detaylarını tedarikçiye gönder', status: StepStatus.IDLE, connections: [{ targetId: 'amz-6' }] },
                { id: 'amz-6', type: NodeType.STATE_MANAGER, title: 'Sipariş Takibi', role: 'Database', task: 'Sipariş durumunu ve tarihini kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'real-estate-lead-pipeline',
        name: 'Gayrimenkul Lead Otomasyonu',
        description: 'Web sitesi ziyaretçilerini otomatik qualify eder, potansiyel müşterilere yapılandırılmış sunumlar gönderir. Emlakçıların %60 daha fazla qualified lead elde etmesini sağlar.',
        category: 'money-maker',
        difficulty: 'medium',
        estimatedRevenue: '₺25,000-100,000/ay',
        icon: '🏠',
        tags: ['emlak', 'lead generation', 'satış funnel', 'crm', 'conversion'],
        blueprint: {
            name: 'Emlak Lead Pipeline',
            description: 'Otomatik müşteri nitelikendirme ve satış funnel',
            masterGoal: 'Her ziyaretçiyi qualified lead\'e dönüştür',
            baseKnowledge: 'Emlak satış cycle, müşteri profilleme, closing strategy',
            category: 'Money-Maker',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 're-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Site Ziyaretçi Takip', role: 'Webhook/Pixel', task: 'Ziyaretçi aktivitesini ve görüntülenen mülkleri kaydet', status: StepStatus.IDLE, connections: [{ targetId: 're-2' }] },
                { id: 're-2', type: NodeType.ANALYST_CRITIC, title: 'Lead Skorlama', role: 'AI', task: 'Ziyaretçi davranışından satın alma niyetini tahmin et', status: StepStatus.IDLE, connections: [{ targetId: 're-3' }] },
                { id: 're-3', type: NodeType.LOGIC_GATE, title: 'Yüksek Değerli mi?', role: 'Karar', task: 'Score 70+ puan ise qualified lead', status: StepStatus.IDLE, connections: [{ targetId: 're-4' }] },
                { id: 're-4', type: NodeType.CONTENT_CREATOR, title: 'Sunuş Taslağı', role: 'Copywriter', task: 'Kişiselleştirilmiş emlak sunumu taslağı oluştur', status: StepStatus.IDLE, connections: [{ targetId: 're-5' }] },
                { id: 're-5', type: NodeType.HUMAN_APPROVAL, title: 'Danışman Bildirimi', role: 'Slack/SMS', task: 'Danışmanı qualified lead ve sunuş taslağı ile bildir', status: StepStatus.IDLE, connections: [{ targetId: 're-6' }] },
                { id: 're-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Lead CRM Export', role: 'Integrasyon', task: 'Lead\'i CRM\'e aktar ve takip et', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // ============== OVI VIDEO TEMPLATES ==============
    {
        id: 'ovi-reels-factory',
        name: 'OVI Reels & TikTok Fabrikası',
        description: 'AI ile senkronize ses ve video içeren viral Reels/TikTok içerikleri üretir. Konuşan avatar, ürün tanıtım, hook videoları.',
        category: 'video',
        difficulty: 'easy',
        estimatedRevenue: '₺10,000-50,000/ay',
        icon: '🎬',
        tags: ['video', 'reels', 'tiktok', 'ovi', 'ai video', 'viral'],
        blueprint: {
            name: 'OVI Reels Fabrikası',
            description: 'AI destekli viral video üretimi',
            masterGoal: 'Günlük viral video içerik üret',
            baseKnowledge: 'OVI AI, video editing, trend analizi, viral hooks',
            category: 'Video',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ovi-1', type: NodeType.RESEARCH_WEB, title: 'Trend Tarayıcı', role: 'TikTok/Instagram', task: 'Günün viral trendlerini ve hook\'ları bul', status: StepStatus.IDLE, connections: [{ targetId: 'ovi-2' }] },
                { id: 'ovi-2', type: NodeType.CONTENT_CREATOR, title: 'Script Yazıcı', role: 'AI Copywriter', task: 'Viral hook ve script oluştur (5-10sn)', status: StepStatus.IDLE, connections: [{ targetId: 'ovi-3' }] },
                { id: 'ovi-3', type: NodeType.MEDIA_ENGINEER, title: 'OVI Video Üretici', role: 'OVI AI', task: 'Text-to-Video: Konuşan avatar + senkronize ses', status: StepStatus.IDLE, connections: [{ targetId: 'ovi-4' }] },
                { id: 'ovi-4', type: NodeType.ANALYST_CRITIC, title: 'Kalite Kontrol', role: 'AI Review', task: 'Video kalitesi, lip-sync ve ses kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'ovi-5' }] },
                { id: 'ovi-5', type: NodeType.SOCIAL_MANAGER, title: 'Sosyal Medya Export', role: 'Multi-platform', task: 'TikTok, Reels, Shorts formatlarında dışa aktar', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ovi-ai-spokesperson',
        name: 'AI Spokesperson Video Bot',
        description: 'Gerçekçi konuşan avatar videoları oluşturur. Ürün tanıtımı, duyuru, eğitim videoları için ideal. Dudak senkronizasyonu mükemmel.',
        category: 'video',
        difficulty: 'medium',
        estimatedRevenue: '₺15,000-40,000/ay',
        icon: '🗣️',
        tags: ['avatar', 'spokesperson', 'ovi', 'lip-sync', 'tanıtım'],
        blueprint: {
            name: 'AI Spokesperson Bot',
            description: 'Konuşan avatar video üretimi',
            masterGoal: 'Profesyonel spokesperson videoları üret',
            baseKnowledge: 'OVI AI, TTS, video prodüksiyon, marka iletişimi',
            category: 'Video',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'spk-1', type: NodeType.STATE_MANAGER, title: 'Mesaj Girdisi', role: 'Kullanıcı Input', task: 'Söylenmesini istediğin mesajı al', status: StepStatus.IDLE, connections: [{ targetId: 'spk-2' }] },
                { id: 'spk-2', type: NodeType.CONTENT_CREATOR, title: 'Script Düzenleyici', role: 'AI Editor', task: 'Mesajı profesyonel formata dönüştür', status: StepStatus.IDLE, connections: [{ targetId: 'spk-3' }] },
                { id: 'spk-3', type: NodeType.MEDIA_ENGINEER, title: 'OVI Avatar Üretici', role: 'OVI AI', task: 'Konuşan avatar videosu oluştur + lip-sync', status: StepStatus.IDLE, connections: [{ targetId: 'spk-4' }] },
                { id: 'spk-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Video Export', role: 'MP4/WebM', task: 'Video dosyasını indir ve kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ovi-product-demo',
        name: 'Ürün Tanıtım Video Botu',
        description: 'E-ticaret ürünleri için otomatik tanıtım videoları oluşturur. Ürün görseli + seslendirme + müzik.',
        category: 'video',
        difficulty: 'easy',
        estimatedRevenue: '₺5,000-20,000/ay',
        icon: '📦',
        tags: ['e-ticaret', 'ürün', 'video', 'ovi', 'tanıtım', 'demo'],
        blueprint: {
            name: 'Ürün Demo Video Bot',
            description: 'Otomatik ürün tanıtım videoları',
            masterGoal: 'Her ürün için profesyonel tanıtım videosu üret',
            baseKnowledge: 'OVI AI, e-ticaret, ürün fotoğrafçılığı, satış copy',
            category: 'Video',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'prd-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ürün Verisi', role: 'E-ticaret API', task: 'Ürün bilgilerini ve görsellerini çek', status: StepStatus.IDLE, connections: [{ targetId: 'prd-2' }] },
                { id: 'prd-2', type: NodeType.CONTENT_CREATOR, title: 'Tanıtım Scripti', role: 'Sales Copywriter', task: 'Ürün özelliklerinden satış scripti yaz', status: StepStatus.IDLE, connections: [{ targetId: 'prd-3' }] },
                { id: 'prd-3', type: NodeType.MEDIA_ENGINEER, title: 'OVI Image-to-Video', role: 'OVI AI I2V', task: 'Ürün görselini videoya dönüştür + seslendirme', status: StepStatus.IDLE, connections: [{ targetId: 'prd-4' }] },
                { id: 'prd-4', type: NodeType.SOCIAL_MANAGER, title: 'Çoklu Format Export', role: 'Video Processor', task: 'Instagram, TikTok, YouTube Shorts formatları', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // ============================================
    // YENİ ŞABLONLAR - 100+ TOPLAM
    // ============================================
    {
        id: 'invoice-automation',
        name: 'Otomatik Fatura Kesici',
        description: 'Siparişlerden otomatik e-fatura oluşturur ve müşteriye gönderir.',
        category: 'money-maker',
        difficulty: 'medium',
        estimatedRevenue: '₺3,000-8,000/ay tasarruf',
        icon: '🧾',
        tags: ['fatura', 'e-fatura', 'muhasebe', 'otomasyon'],
        blueprint: { name: 'Fatura Otomasyonu', description: 'Otomatik fatura sistemi', masterGoal: 'Siparişleri faturaya çevir', baseKnowledge: 'e-arşiv, GİB API', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'customer-feedback-ai',
        name: 'AI Müşteri Geri Bildirim Analizi',
        description: 'Müşteri yorumlarını AI ile analiz eder, duygu analizi yapar.',
        category: 'analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺5,000-15,000/ay değer',
        icon: '😊',
        tags: ['müşteri', 'duygu analizi', 'AI', 'feedback'],
        blueprint: { name: 'Feedback Analiz', description: 'AI yorumlama', masterGoal: 'Müşteri memnuniyetini ölç', baseKnowledge: 'NLP, sentiment analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'telegram-community-bot',
        name: 'Telegram Topluluk Yönetici Bot',
        description: 'Telegram grubunu yönetir, spam temizler, hoş geldin mesajı gönderir.',
        category: 'assistant',
        difficulty: 'easy',
        estimatedRevenue: '₺2,000-5,000/ay',
        icon: '📱',
        tags: ['telegram', 'bot', 'topluluk', 'moderasyon'],
        blueprint: { name: 'Telegram Bot', description: 'Grup yönetimi', masterGoal: 'Telegram grubunu otomatik yönet', baseKnowledge: 'Telegram Bot API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'seo-content-optimizer',
        name: 'SEO İçerik Optimizasyonu',
        description: 'Mevcut içerikleri SEO için optimize eder, anahtar kelime önerir.',
        category: 'content',
        difficulty: 'medium',
        estimatedRevenue: '₺8,000-25,000/ay',
        icon: '🔍',
        tags: ['SEO', 'içerik', 'optimizasyon', 'anahtar kelime'],
        blueprint: { name: 'SEO Optimizer', description: 'İçerik SEO', masterGoal: 'İçerikleri arama motorları için optimize et', baseKnowledge: 'SEO teknikleri, Google API', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'email-sequence-builder',
        name: 'Email Dizisi Oluşturucu',
        description: 'Otomatik email pazarlama dizileri oluşturur ve gönderir.',
        category: 'money-maker',
        difficulty: 'medium',
        estimatedRevenue: '₺10,000-30,000/ay',
        icon: '📧',
        tags: ['email', 'pazarlama', 'dizi', 'otomasyon'],
        blueprint: { name: 'Email Marketing', description: 'Otomatik email', masterGoal: 'Satış artıran email dizileri', baseKnowledge: 'Email marketing, copywriting', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'competitor-monitor',
        name: 'Rakip İzleme Sistemi',
        description: 'Rakiplerin sosyal medya, fiyat ve içerik değişikliklerini takip eder.',
        category: 'scraper',
        difficulty: 'hard',
        estimatedRevenue: '₺15,000-40,000/ay değer',
        icon: '🕵️',
        tags: ['rakip', 'izleme', 'analiz', 'scraping'],
        blueprint: { name: 'Rakip Takip', description: 'Monitoring sistemi', masterGoal: 'Rakip hareketlerini izle', baseKnowledge: 'Web scraping, data analysis', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'appointment-reminder',
        name: 'Randevu Hatırlatıcı',
        description: 'Müşterilere randevu hatırlatma mesajları gönderir (WhatsApp/SMS).',
        category: 'assistant',
        difficulty: 'easy',
        estimatedRevenue: '₺1,500-4,000/ay',
        icon: '⏰',
        tags: ['randevu', 'hatırlatma', 'SMS', 'WhatsApp'],
        blueprint: { name: 'Randevu Reminder', description: 'Otomatik hatırlatma', masterGoal: 'Randevu iptallerini azalt', baseKnowledge: 'WhatsApp API, SMS gateway', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'podcast-transcriber',
        name: 'Podcast Transkript & Özet',
        description: 'Podcast bölümlerini yazıya döker, özet ve sosyal medya paylaşımları oluşturur.',
        category: 'content',
        difficulty: 'medium',
        estimatedRevenue: '₺4,000-12,000/ay',
        icon: '🎙️',
        tags: ['podcast', 'transkript', 'özet', 'içerik'],
        blueprint: { name: 'Podcast Tool', description: 'Ses-metin dönüşümü', masterGoal: 'Podcast içeriğini çoklu formata çevir', baseKnowledge: 'Whisper AI, NLP', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'stock-alert-system',
        name: 'Hisse Senedi Alarm Sistemi',
        description: 'Belirlenen fiyat seviyelerinde anlık bildirim gönderir.',
        category: 'analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺3,000-10,000/ay',
        icon: '📈',
        tags: ['borsa', 'hisse', 'alarm', 'yatırım'],
        blueprint: { name: 'Stock Alert', description: 'Fiyat alarmı', masterGoal: 'Hisse fiyatlarını takip et ve alarm ver', baseKnowledge: 'Finansal API, gerçek zamanlı veri', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'review-responder',
        name: 'Yorum Yanıtlayıcı AI',
        description: 'Google, Yelp, Tripadvisor yorumlarını otomatik yanıtlar.',
        category: 'assistant',
        difficulty: 'easy',
        estimatedRevenue: '₺2,500-7,000/ay',
        icon: '💬',
        tags: ['yorum', 'yanıt', 'müşteri', 'AI'],
        blueprint: { name: 'Review Bot', description: 'Otomatik yanıt', masterGoal: 'Tüm yorumlara profesyonelce yanıt ver', baseKnowledge: 'NLP, müşteri hizmetleri', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'youtube-shorts-maker',
        name: 'YouTube Shorts Üretici',
        description: 'Uzun videolardan otomatik Shorts klipler çıkarır.',
        category: 'video',
        difficulty: 'medium',
        estimatedRevenue: '₺6,000-20,000/ay',
        icon: '📹',
        tags: ['youtube', 'shorts', 'video', 'klip'],
        blueprint: { name: 'Shorts Maker', description: 'Otomatik klip', masterGoal: 'Viral Shorts üret', baseKnowledge: 'Video editing, OVI AI', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'data-backup-automation',
        name: 'Otomatik Yedekleme Sistemi',
        description: 'Veritabanı ve dosyaları düzenli olarak buluta yedekler.',
        category: 'assistant',
        difficulty: 'medium',
        estimatedRevenue: '₺5,000-15,000/ay güvenlik değeri',
        icon: '💾',
        tags: ['yedekleme', 'backup', 'güvenlik', 'cloud'],
        blueprint: { name: 'Auto Backup', description: 'Yedekleme sistemi', masterGoal: 'Veri kaybını önle', baseKnowledge: 'AWS S3, Google Cloud, cron', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'influencer-outreach',
        name: 'Influencer Ulaşım Otomasyonu',
        description: 'Hedef influencer\'ları bulur ve kişiselleştirilmiş DM gönderir.',
        category: 'money-maker',
        difficulty: 'hard',
        estimatedRevenue: '₺15,000-50,000/ay',
        icon: '🌟',
        tags: ['influencer', 'marketing', 'outreach', 'DM'],
        blueprint: { name: 'Influencer Bot', description: 'Influencer bulma', masterGoal: 'Marka için doğru influencer bul', baseKnowledge: 'Sosyal medya API, outreach stratejileri', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'contract-analyzer',
        name: 'Sözleşme Analiz AI',
        description: 'Hukuki sözleşmeleri tarar, risk noktalarını belirler.',
        category: 'analytics',
        difficulty: 'hard',
        estimatedRevenue: '₺10,000-30,000/ay değer',
        icon: '📜',
        tags: ['sözleşme', 'hukuk', 'analiz', 'AI'],
        blueprint: { name: 'Contract AI', description: 'Sözleşme tarama', masterGoal: 'Sözleşme risklerini tespit et', baseKnowledge: 'Legal NLP, document parsing', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'blog-to-social',
        name: 'Blog\'dan Sosyal Medya Üretici',
        description: 'Blog yazılarını Twitter thread, LinkedIn post ve Instagram carousel\'a çevirir.',
        category: 'content',
        difficulty: 'easy',
        estimatedRevenue: '₺3,000-9,000/ay',
        icon: '🔄',
        tags: ['blog', 'sosyal medya', 'repurpose', 'içerik'],
        blueprint: { name: 'Blog Converter', description: 'İçerik dönüştürücü', masterGoal: 'Blog içeriğini çoklu platforma uyarla', baseKnowledge: 'Copywriting, sosyal medya formatları', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'currency-arbitrage',
        name: 'Döviz Arbitraj Bulucu',
        description: 'Farklı borsalardaki döviz fiyat farklarını tespit eder.',
        category: 'money-maker',
        difficulty: 'hard',
        estimatedRevenue: '₺20,000-100,000/ay potansiyel',
        icon: '💱',
        tags: ['döviz', 'arbitraj', 'trading', 'finans'],
        blueprint: { name: 'Forex Arbitrage', description: 'Döviz fırsatları', masterGoal: 'Döviz arbitraj fırsatlarını bul', baseKnowledge: 'Forex API, gerçek zamanlı veri işleme', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'newsletter-curator',
        name: 'Newsletter Küratör Bot',
        description: 'Sektördeki en iyi haberleri toplar ve haftalık bülten oluşturur.',
        category: 'content',
        difficulty: 'easy',
        estimatedRevenue: '₺2,000-8,000/ay',
        icon: '📰',
        tags: ['newsletter', 'haber', 'kürasyon', 'email'],
        blueprint: { name: 'Newsletter Bot', description: 'Otomatik bülten', masterGoal: 'Kaliteli haftalık bülten üret', baseKnowledge: 'RSS, web scraping, email', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'inventory-tracker',
        name: 'Stok Takip & Uyarı Sistemi',
        description: 'Stok seviyelerini izler, düşük stokta otomatik sipariş önerir.',
        category: 'analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺8,000-25,000/ay tasarruf',
        icon: '📦',
        tags: ['stok', 'envanter', 'takip', 'e-ticaret'],
        blueprint: { name: 'Stock Tracker', description: 'Stok yönetimi', masterGoal: 'Stok tükenmelerini önle', baseKnowledge: 'E-ticaret API, envanter yönetimi', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'discord-moderation',
        name: 'Discord Moderasyon Bot',
        description: 'Discord sunucusunu yönetir, spam ve küfür filtreler, roller atar.',
        category: 'assistant',
        difficulty: 'easy',
        estimatedRevenue: '₺1,500-5,000/ay',
        icon: '🎮',
        tags: ['discord', 'moderasyon', 'bot', 'topluluk'],
        blueprint: { name: 'Discord Mod', description: 'Sunucu yönetimi', masterGoal: 'Discord sunucusunu güvenli tut', baseKnowledge: 'Discord.js, moderasyon kuralları', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'job-application-tracker',
        name: 'İş Başvurusu Takip Sistemi',
        description: 'İş ilanlarını tarar, otomatik başvuru yapar, takip eder.',
        category: 'scraper',
        difficulty: 'medium',
        estimatedRevenue: 'Kariyer değeri: Priceless',
        icon: '💼',
        tags: ['iş', 'kariyer', 'başvuru', 'LinkedIn'],
        blueprint: { name: 'Job Tracker', description: 'İş bulma asistanı', masterGoal: 'İş arama sürecini otomatize et', baseKnowledge: 'LinkedIn API, Kariyer siteleri', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'ai-copywriting',
        name: 'AI Reklam Metni Yazarı',
        description: 'Google Ads, Facebook Ads için yüksek dönüşümlü reklam metinleri yazar.',
        category: 'content',
        difficulty: 'medium',
        estimatedRevenue: '₺10,000-30,000/ay',
        icon: '✍️',
        tags: ['reklam', 'copy', 'AI', 'marketing'],
        blueprint: { name: 'Ad Copywriter', description: 'Reklam metni AI', masterGoal: 'Satış yapan reklam metinleri üret', baseKnowledge: 'Copywriting, A/B test, pazarlama psikolojisi', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'meeting-scheduler',
        name: 'Akıllı Toplantı Planlayıcı',
        description: 'Katılımcıların takvimlerini kontrol edip optimal toplantı zamanı bulur.',
        category: 'assistant',
        difficulty: 'medium',
        estimatedRevenue: '₺3,000-8,000/ay zaman tasarrufu',
        icon: '📅',
        tags: ['toplantı', 'takvim', 'planlama', 'verimlilik'],
        blueprint: { name: 'Meeting Bot', description: 'Toplantı planlama', masterGoal: 'Toplantı planlamayı otomatize et', baseKnowledge: 'Google Calendar API, Calendly', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'website-uptime-monitor',
        name: 'Website Uptime Monitör',
        description: 'Web sitesinin çalışıp çalışmadığını 7/24 kontrol eder, sorun olunca bildirir.',
        category: 'analytics',
        difficulty: 'easy',
        estimatedRevenue: '₺5,000-20,000/ay iş kaybı önleme',
        icon: '🌐',
        tags: ['website', 'uptime', 'monitoring', 'alert'],
        blueprint: { name: 'Uptime Monitor', description: 'Site izleme', masterGoal: 'Site çökmelerini anında tespit et', baseKnowledge: 'HTTP monitoring, Slack/email bildirim', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'document-summarizer',
        name: 'Doküman Özetleyici AI',
        description: 'Uzun PDF ve Word dosyalarını AI ile özetler, anahtar noktaları çıkarır.',
        category: 'content',
        difficulty: 'medium',
        estimatedRevenue: '₺4,000-12,000/ay',
        icon: '📄',
        tags: ['doküman', 'özet', 'AI', 'PDF'],
        blueprint: { name: 'Doc Summarizer', description: 'AI özetleme', masterGoal: 'Uzun dokümanları hızla özet', baseKnowledge: 'PDF parsing, NLP, GPT', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    {
        id: 'affiliate-link-manager',
        name: 'Affiliate Link Yöneticisi',
        description: 'Affiliate linkleri takip eder, performans raporu oluşturur.',
        category: 'money-maker',
        difficulty: 'medium',
        estimatedRevenue: '₺5,000-25,000/ay',
        icon: '🔗',
        tags: ['affiliate', 'link', 'tracking', 'gelir'],
        blueprint: { name: 'Affiliate Manager', description: 'Link takibi', masterGoal: 'Affiliate gelirlerini optimize et', baseKnowledge: 'Link tracking, analytics', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] }
    },
    // ============================================
    // DAHA FAZLA ŞABLON - 150+ TOPLAM
    // ============================================
    { id: 'real-estate-scraper', name: 'Emlak İlan Takipçisi', description: 'Sahibinden, Hepsiemlak gibi sitelerden yeni ilanları toplar.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay', icon: '🏠', tags: ['emlak', 'ilan', 'scraping'], blueprint: { name: 'Emlak Scraper', description: 'İlan takibi', masterGoal: 'Yeni emlak ilanlarını yakala', baseKnowledge: 'Web scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'twitter-thread-writer', name: 'Twitter Thread Yazarı', description: 'Viral thread içerikleri üretir ve zamanlar.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🐦', tags: ['twitter', 'thread', 'viral'], blueprint: { name: 'Thread Writer', description: 'Thread üretimi', masterGoal: 'Viral thread yaz', baseKnowledge: 'Twitter API, copywriting', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'customer-churn-predictor', name: 'Müşteri Kaybı Tahmincisi', description: 'AI ile müşteri kaybı riskini önceden tahmin eder.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺20,000-50,000/ay değer', icon: '📉', tags: ['churn', 'AI', 'tahmin', 'müşteri'], blueprint: { name: 'Churn Predictor', description: 'Kayıp tahmini', masterGoal: 'Müşteri kaybını önle', baseKnowledge: 'ML, predictive analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'product-description-ai', name: 'Ürün Açıklaması Yazarı', description: 'E-ticaret ürünleri için SEO uyumlu açıklamalar yazar.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay', icon: '🛒', tags: ['e-ticaret', 'ürün', 'açıklama', 'AI'], blueprint: { name: 'Product Writer', description: 'Ürün metni', masterGoal: 'Satış yapan açıklamalar yaz', baseKnowledge: 'Copywriting, SEO', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'expense-tracker', name: 'Harcama Takip Botu', description: 'Banka hareketlerini analiz eder, bütçe önerileri sunar.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺2,000-6,000/ay tasarruf', icon: '💸', tags: ['harcama', 'bütçe', 'finans'], blueprint: { name: 'Expense Bot', description: 'Harcama takibi', masterGoal: 'Gereksiz harcamaları azalt', baseKnowledge: 'Finans API, veri analizi', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'instagram-dm-responder', name: 'Instagram DM Bot', description: 'Instagram DM mesajlarını otomatik yanıtlar.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay', icon: '📸', tags: ['instagram', 'DM', 'bot'], blueprint: { name: 'IG DM Bot', description: 'DM yanıtlama', masterGoal: 'DM lere hızlı yanıt ver', baseKnowledge: 'Instagram API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'resume-builder-ai', name: 'AI Özgeçmiş Oluşturucu', description: 'Kişiye özel profesyonel CV oluşturur.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺3,000-9,000/ay', icon: '📝', tags: ['CV', 'özgeçmiş', 'kariyer', 'AI'], blueprint: { name: 'Resume AI', description: 'CV oluşturma', masterGoal: 'Mükemmel CV yarat', baseKnowledge: 'CV formatları, AI writing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'crypto-news-aggregator', name: 'Kripto Haber Toplayıcı', description: 'Tüm kripto haberlerini toplar ve özetler.', category: 'scraper', difficulty: 'easy', estimatedRevenue: '₺2,000-6,000/ay', icon: '₿', tags: ['kripto', 'haber', 'aggregator'], blueprint: { name: 'Crypto News', description: 'Haber toplama', masterGoal: 'Kripto piyasasını takip et', baseKnowledge: 'RSS, web scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'api-health-monitor', name: 'API Sağlık Monitörü', description: 'API endpoint lerinin durumunu izler.', category: 'analytics', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🔌', tags: ['API', 'monitoring', 'devops'], blueprint: { name: 'API Monitor', description: 'API izleme', masterGoal: 'API kesintilerini önle', baseKnowledge: 'HTTP, monitoring', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'quote-generator', name: 'Motivasyon Sözü Üretici', description: 'Günlük motivasyon sözleri üretir ve paylaşır.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺1,500-5,000/ay', icon: '💭', tags: ['motivasyon', 'söz', 'içerik'], blueprint: { name: 'Quote Bot', description: 'Söz üretimi', masterGoal: 'Viral motivasyon içeriği yarat', baseKnowledge: 'Content creation', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'survey-analyzer', name: 'Anket Analiz Botu', description: 'Anket sonuçlarını AI ile analiz eder.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay', icon: '📋', tags: ['anket', 'analiz', 'AI'], blueprint: { name: 'Survey AI', description: 'Anket analizi', masterGoal: 'Anket verilerinden insight çıkar', baseKnowledge: 'Data analysis, NLP', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'birthday-reminder', name: 'Doğum Günü Hatırlatıcı', description: 'Müşteri doğum günlerini takip eder, otomatik tebrik gönderir.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺1,000-3,000/ay', icon: '🎂', tags: ['doğum günü', 'CRM', 'hatırlatma'], blueprint: { name: 'Birthday Bot', description: 'Tebrik gönderme', masterGoal: 'Müşteri ilişkilerini güçlendir', baseKnowledge: 'CRM, email/SMS', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'hashtag-generator', name: 'Hashtag Öneri Motoru', description: 'Paylaşımlar için optimal hashtag önerir.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺2,000-6,000/ay', icon: '#️⃣', tags: ['hashtag', 'sosyal medya', 'analiz'], blueprint: { name: 'Hashtag AI', description: 'Hashtag önerisi', masterGoal: 'Erişimi artıran hashtagler bul', baseKnowledge: 'Sosyal medya analizi', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'dropshipping-finder', name: 'Dropshipping Ürün Bulucu', description: 'Aliexpress den karlı dropshipping ürünleri bulur.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺10,000-40,000/ay potansiyel', icon: '📦', tags: ['dropshipping', 'ürün', 'e-ticaret'], blueprint: { name: 'Dropship Finder', description: 'Ürün keşfi', masterGoal: 'Karlı ürünleri bul', baseKnowledge: 'E-ticaret, web scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'slack-standup-bot', name: 'Slack Standup Botu', description: 'Günlük standup toplantılarını otomatik toplar.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,000-5,000/ay', icon: '💼', tags: ['slack', 'standup', 'takım'], blueprint: { name: 'Standup Bot', description: 'Günlük raporlama', masterGoal: 'Takım iletişimini güçlendir', baseKnowledge: 'Slack API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'weather-alert-bot', name: 'Hava Durumu Uyarı Botu', description: 'Kritik hava değişikliklerinde bildirim gönderir.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺1,000-3,000/ay', icon: '🌤️', tags: ['hava durumu', 'alert', 'bildirim'], blueprint: { name: 'Weather Alert', description: 'Hava uyarısı', masterGoal: 'Hava değişimlerine hazırlıklı ol', baseKnowledge: 'Weather API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'pitch-deck-generator', name: 'Pitch Deck Oluşturucu', description: 'Yatırımcı sunumu için otomatik slide hazırlar.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '📊', tags: ['pitch', 'sunum', 'startup'], blueprint: { name: 'Pitch AI', description: 'Sunum oluşturma', masterGoal: 'Etkileyici pitch deck yarat', baseKnowledge: 'Sunum tasarımı, storytelling', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'trademark-monitor', name: 'Marka İzleme Sistemi', description: 'Marka ihlallerini web de arar ve bildirir.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺15,000-40,000/ay değer', icon: '™️', tags: ['marka', 'ihlal', 'izleme'], blueprint: { name: 'Brand Monitor', description: 'Marka koruma', masterGoal: 'Marka ihlallerini tespit et', baseKnowledge: 'Web scraping, legal', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'email-cleaner', name: 'Email Liste Temizleyici', description: 'Email listelerinden geçersiz adresleri ayıklar.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-8,000/ay tasarruf', icon: '🧹', tags: ['email', 'liste', 'temizleme'], blueprint: { name: 'Email Cleaner', description: 'Liste temizliği', masterGoal: 'Email deliverability artır', baseKnowledge: 'Email validation', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ab-test-analyzer', name: 'A/B Test Analizci', description: 'A/B test sonuçlarını analiz eder, kazanan varyanttı belirler.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺6,000-18,000/ay', icon: '🧪', tags: ['A/B test', 'analiz', 'optimizasyon'], blueprint: { name: 'AB Analyzer', description: 'Test analizi', masterGoal: 'Dönüşüm oranını optimize et', baseKnowledge: 'İstatistik, analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'content-calendar', name: 'İçerik Takvimi Planlayıcı', description: 'Aylık içerik planı oluşturur ve takip eder.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺2,500-7,000/ay', icon: '📅', tags: ['içerik', 'takvim', 'planlama'], blueprint: { name: 'Content Calendar', description: 'İçerik planı', masterGoal: 'Tutarlı içerik akışı sağla', baseKnowledge: 'Content marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ticket-price-tracker', name: 'Bilet Fiyat Takipçisi', description: 'Uçak/otobüs bilet fiyatlarını izler, ucuzlayınca bildirir.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺3,000-10,000/ay tasarruf', icon: '✈️', tags: ['bilet', 'fiyat', 'seyahat'], blueprint: { name: 'Ticket Tracker', description: 'Fiyat takibi', masterGoal: 'En ucuz bileti yakala', baseKnowledge: 'Web scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'code-review-ai', name: 'AI Kod İnceleme Botu', description: 'GitHub PR lerini otomatik inceler, öneri yapar.', category: 'assistant', difficulty: 'hard', estimatedRevenue: '₺10,000-30,000/ay', icon: '💻', tags: ['kod', 'review', 'GitHub', 'AI'], blueprint: { name: 'Code Review AI', description: 'Kod inceleme', masterGoal: 'Kod kalitesini artır', baseKnowledge: 'Code analysis, GitHub API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'google-review-getter', name: 'Google Yorum İsteyici', description: 'Memnun müşterilerden Google yorumu ister.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay değer', icon: '⭐', tags: ['Google', 'yorum', 'review'], blueprint: { name: 'Review Getter', description: 'Yorum toplama', masterGoal: 'Google puanını artır', baseKnowledge: 'CRM, email automation', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'shipment-tracker', name: 'Kargo Takip Botu', description: 'Tüm kargo firmalarından gönderileri tek yerden izler.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,000-6,000/ay', icon: '🚚', tags: ['kargo', 'takip', 'e-ticaret'], blueprint: { name: 'Cargo Tracker', description: 'Kargo izleme', masterGoal: 'Gönderi durumunu anlık takip et', baseKnowledge: 'Kargo API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'domain-expiry-checker', name: 'Domain Vade Kontrolcüsü', description: 'Domain sürelerini takip eder, önceden uyarır.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺1,500-4,000/ay', icon: '🌐', tags: ['domain', 'vade', 'hatırlatma'], blueprint: { name: 'Domain Checker', description: 'Domain takibi', masterGoal: 'Domain kaybını önle', baseKnowledge: 'WHOIS API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'sentiment-dashboard', name: 'Marka Duygu Analizi Dashboard', description: 'Sosyal medyada marka algısını görselleştirir.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺15,000-40,000/ay', icon: '📈', tags: ['marka', 'duygu', 'dashboard'], blueprint: { name: 'Sentiment Dashboard', description: 'Algı analizi', masterGoal: 'Marka algısını ölç', baseKnowledge: 'NLP, data viz', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'meeting-notes-ai', name: 'Toplantı Notu AI', description: 'Toplantı kayıtlarını transkribe eder, özet çıkarır.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay', icon: '📝', tags: ['toplantı', 'not', 'AI', 'transkript'], blueprint: { name: 'Meeting Notes', description: 'Toplantı özeti', masterGoal: 'Toplantı verimliliğini artır', baseKnowledge: 'Whisper AI, summarization', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'meta-ads-optimizer', name: 'Meta Reklam Optimizasyonu', description: 'Facebook/Instagram reklamlarını otomatik optimize eder.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-60,000/ay', icon: '📢', tags: ['Facebook', 'Instagram', 'reklam', 'optimizasyon'], blueprint: { name: 'Meta Optimizer', description: 'Reklam optimizasyonu', masterGoal: 'ROAS ı maksimize et', baseKnowledge: 'Meta Marketing API', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'legal-document-generator', name: 'Hukuki Doküman Üretici', description: 'Sözleşme şablonları oluşturur ve doldurur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺6,000-18,000/ay', icon: '⚖️', tags: ['hukuk', 'sözleşme', 'doküman'], blueprint: { name: 'Legal Gen', description: 'Doküman oluşturma', masterGoal: 'Hukuki süreçleri hızlandır', baseKnowledge: 'Legal templates', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'voice-message-transcriber', name: 'Sesli Mesaj Çevirici', description: 'WhatsApp sesli mesajları yazıya döker.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺2,500-7,000/ay', icon: '🎤', tags: ['ses', 'transkript', 'WhatsApp'], blueprint: { name: 'Voice Transcriber', description: 'Ses-metin', masterGoal: 'Sesli mesajları hızla oku', baseKnowledge: 'Whisper AI', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'restaurant-menu-analyzer', name: 'Restoran Menü Analizi', description: 'Rakip restoran menülerini analiz eder.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay', icon: '🍽️', tags: ['restoran', 'menü', 'analiz'], blueprint: { name: 'Menu Analyzer', description: 'Menü karşılaştırma', masterGoal: 'Rekabetçi fiyatlama yap', baseKnowledge: 'Web scraping, data analysis', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'qr-code-generator', name: 'Dinamik QR Kod Üretici', description: 'Takip edilebilir QR kodları oluşturur.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,000-6,000/ay', icon: '📲', tags: ['QR', 'kod', 'takip'], blueprint: { name: 'QR Generator', description: 'QR üretimi', masterGoal: 'QR kampanyalarını ölç', baseKnowledge: 'QR generation, analytics', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'youtube-comment-responder', name: 'YouTube Yorum Yanıtlayıcı', description: 'YouTube yorumlarını AI ile yanıtlar.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-9,000/ay', icon: '▶️', tags: ['YouTube', 'yorum', 'AI'], blueprint: { name: 'YT Responder', description: 'Yorum yanıtlama', masterGoal: 'İzleyici etkileşimini artır', baseKnowledge: 'YouTube API, NLP', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'freelancer-proposal-writer', name: 'Freelancer Teklif Yazarı', description: 'Upwork/Fiverr için özel teklif yazıları üretir.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺5,000-15,000/ay', icon: '✉️', tags: ['freelance', 'teklif', 'proposal'], blueprint: { name: 'Proposal Writer', description: 'Teklif yazımı', masterGoal: 'Proje kazanma oranını artır', baseKnowledge: 'Copywriting, freelance', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'database-backup', name: 'Veritabanı Yedekleme Botu', description: 'MySQL/PostgreSQL backuplarını otomatik alır.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺4,000-10,000/ay güvenlik', icon: '💾', tags: ['veritabanı', 'backup', 'güvenlik'], blueprint: { name: 'DB Backup', description: 'Veritabanı yedekleme', masterGoal: 'Veri kaybını önle', baseKnowledge: 'Database admin', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'coupon-finder', name: 'Kupon Kodu Bulucu', description: 'Online mağazalar için geçerli kupon kodları bulur.', category: 'scraper', difficulty: 'easy', estimatedRevenue: '₺2,000-8,000/ay tasarruf', icon: '🎟️', tags: ['kupon', 'indirim', 'e-ticaret'], blueprint: { name: 'Coupon Finder', description: 'Kupon arama', masterGoal: 'En iyi indirimleri bul', baseKnowledge: 'Web scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'social-proof-collector', name: 'Sosyal Kanıt Toplayıcı', description: 'Müşteri referanslarını toplar ve düzenler.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '👥', tags: ['referans', 'testimonal', 'sosyal kanıt'], blueprint: { name: 'Proof Collector', description: 'Referans toplama', masterGoal: 'Güven artıran içerik topla', baseKnowledge: 'CRM, content curation', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'event-notification', name: 'Etkinlik Hatırlatıcı', description: 'Konser, maç, etkinlik biletleri için alarm kurar.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺1,500-4,000/ay', icon: '🎫', tags: ['etkinlik', 'bilet', 'hatırlatma'], blueprint: { name: 'Event Alert', description: 'Etkinlik alarmı', masterGoal: 'Etkinlik kaçırma', baseKnowledge: 'Event API', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'password-manager-audit', name: 'Şifre Güvenlik Denetimi', description: 'Zayıf ve tekrarlayan şifreleri tespit eder.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺5,000-15,000/ay güvenlik', icon: '🔐', tags: ['şifre', 'güvenlik', 'audit'], blueprint: { name: 'Password Audit', description: 'Şifre kontrolü', masterGoal: 'Hesap güvenliğini artır', baseKnowledge: 'Security analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'competitor-ad-spy', name: 'Rakip Reklam Casusu', description: 'Rakiplerin aktif reklamlarını takip eder.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺12,000-35,000/ay değer', icon: '🔎', tags: ['reklam', 'rakip', 'spy'], blueprint: { name: 'Ad Spy', description: 'Reklam takibi', masterGoal: 'Rakip stratejilerini öğren', baseKnowledge: 'Ad library scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ai-image-enhancer', name: 'AI Görsel İyileştirici', description: 'Düşük kaliteli görselleri AI ile iyileştirir.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay', icon: '🖼️', tags: ['görsel', 'AI', 'enhancement'], blueprint: { name: 'Image Enhancer', description: 'Görsel iyileştirme', masterGoal: 'Görsel kalitesini artır', baseKnowledge: 'AI image processing', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'invoice-reminder', name: 'Fatura Hatırlatıcı', description: 'Ödenmemiş faturaları takip eder, hatırlatma gönderir.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺8,000-25,000/ay nakit akışı', icon: '💵', tags: ['fatura', 'ödeme', 'hatırlatma'], blueprint: { name: 'Invoice Reminder', description: 'Fatura takibi', masterGoal: 'Ödeme gecikmelerini azalt', baseKnowledge: 'Muhasebe, email automation', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'recipe-generator', name: 'Tarif Üretici AI', description: 'Eldeki malzemelerden yemek tarifleri önerir.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺2,000-6,000/ay', icon: '🍳', tags: ['tarif', 'yemek', 'AI'], blueprint: { name: 'Recipe AI', description: 'Tarif önerisi', masterGoal: 'Yemek ilhamı sağla', baseKnowledge: 'Recipe database, NLP', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'book-summary-ai', name: 'Kitap Özeti AI', description: 'Kitapların anahtar özetlerini çıkarır.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺3,000-9,000/ay', icon: '📚', tags: ['kitap', 'özet', 'AI'], blueprint: { name: 'Book Summary', description: 'Kitap özeti', masterGoal: 'Hızlı kitap analizi', baseKnowledge: 'NLP, summarization', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'workout-planner', name: 'Egzersiz Planlayıcı', description: 'Kişiye özel antrenman programı oluşturur.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,500-7,000/ay', icon: '🏋️', tags: ['fitness', 'egzersiz', 'plan'], blueprint: { name: 'Workout Planner', description: 'Antrenman planı', masterGoal: 'Kişisel fitness hedeflerine ulaş', baseKnowledge: 'Fitness knowledge', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'spotify-playlist-curator', name: 'Spotify Playlist Küratörü', description: 'Kullanıcının zevkine göre playlist oluşturur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺2,000-6,000/ay', icon: '🎵', tags: ['Spotify', 'müzik', 'playlist'], blueprint: { name: 'Playlist Curator', description: 'Müzik önerisi', masterGoal: 'Mükemmel playlist yarat', baseKnowledge: 'Spotify API', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // ============================================
    // PREMIUM PARA KAZANDIRAN ŞABLONLAR - 250+ TOPLAM
    // ============================================
    { id: 'saas-trial-converter', name: 'SaaS Trial Dönüştürücü', description: 'Deneme kullanıcılarını ödemeye çeviren otomatik email dizisi.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay', icon: '💎', tags: ['SaaS', 'trial', 'conversion'], blueprint: { name: 'Trial Converter', description: 'Dönüşüm', masterGoal: 'Trial to paid oranını artır', baseKnowledge: 'Email marketing, SaaS metrics', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'amazon-fba-analyzer', name: 'Amazon FBA Analiz Botu', description: 'Amazon ürünlerini analiz eder, karlı nişler bulur.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '📦', tags: ['Amazon', 'FBA', 'niche'], blueprint: { name: 'FBA Analyzer', description: 'Ürün analizi', masterGoal: 'Karlı Amazon ürünleri bul', baseKnowledge: 'Amazon API, product research', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'webinar-automation', name: 'Webinar Otomasyon Sistemi', description: 'Evergreen webinar funnel oluşturur ve yönetir.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺40,000-150,000/ay', icon: '🎥', tags: ['webinar', 'funnel', 'satış'], blueprint: { name: 'Webinar Auto', description: 'Webinar funneli', masterGoal: 'Pasif gelir için evergreen webinar', baseKnowledge: 'Webinar platforms, funnel building', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'etsy-listing-optimizer', name: 'Etsy Listing Optimizasyonu', description: 'Etsy ürün listelemelerini SEO için optimize eder.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🛍️', tags: ['Etsy', 'SEO', 'e-ticaret'], blueprint: { name: 'Etsy Optimizer', description: 'Listing SEO', masterGoal: 'Etsy satışlarını artır', baseKnowledge: 'Etsy API, e-commerce SEO', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'shopify-abandoned-cart', name: 'Shopify Terk Edilmiş Sepet', description: 'Terk edilmiş sepetleri AI ile geri kazanır.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '🛒', tags: ['Shopify', 'sepet', 'recovery'], blueprint: { name: 'Cart Recovery', description: 'Sepet kurtarma', masterGoal: 'Kayıp satışları geri kazan', baseKnowledge: 'Shopify API, email marketing', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'podcast-monetization', name: 'Podcast Monetizasyon Asistanı', description: 'Podcast için sponsor bulur ve anlaşma yapar.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-70,000/ay', icon: '🎙️', tags: ['podcast', 'sponsor', 'monetize'], blueprint: { name: 'Podcast Money', description: 'Sponsor bulma', masterGoal: 'Podcast gelirlerini maksimize et', baseKnowledge: 'Podcast industry, sponsorship', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'cold-email-automation', name: 'Cold Email Otomasyonu', description: 'Kişiselleştirilmiş soğuk email kampanyaları gönderir.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '📧', tags: ['email', 'outreach', 'B2B'], blueprint: { name: 'Cold Email', description: 'Outreach otomasyonu', masterGoal: 'Yüksek açılma ve yanıt oranı', baseKnowledge: 'Email deliverability, copywriting', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'nft-monitor', name: 'NFT Fiyat ve Trend Monitörü', description: 'NFT koleksiyonlarını izler, alım fırsatlarını tespit eder.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay potansiyel', icon: '🖼️', tags: ['NFT', 'kripto', 'trading'], blueprint: { name: 'NFT Monitor', description: 'NFT takibi', masterGoal: 'NFT fırsatlarını yakala', baseKnowledge: 'OpenSea API, blockchain', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'online-course-creator', name: 'Online Kurs Oluşturucu', description: 'İçerikten otomatik online kurs yapısı oluşturur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺20,000-60,000/ay', icon: '🎓', tags: ['kurs', 'eğitim', 'içerik'], blueprint: { name: 'Course Creator', description: 'Kurs yapısı', masterGoal: 'Satılabilir kurs içeriği oluştur', baseKnowledge: 'Course design, content structure', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'print-on-demand', name: 'Print on Demand Tasarım Botu', description: 'Trend konulara göre otomatik tasarım oluşturur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '👕', tags: ['POD', 'tasarım', 'e-ticaret'], blueprint: { name: 'POD Designer', description: 'Otomatik tasarım', masterGoal: 'Satış yapan tasarımlar üret', baseKnowledge: 'AI image generation, trends', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ebook-generator', name: 'E-Kitap Üretici', description: 'Konuya göre otomatik e-kitap içeriği oluşturur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺5,000-20,000/ay', icon: '📖', tags: ['ebook', 'kitap', 'içerik'], blueprint: { name: 'Ebook Gen', description: 'E-kitap üretimi', masterGoal: 'Satılabilir e-kitap yarat', baseKnowledge: 'Content writing, formatting', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'membership-site-manager', name: 'Üyelik Sitesi Yönetici', description: 'Membership site aboneliklerini ve içerikleri yönetir.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay', icon: '🔐', tags: ['üyelik', 'abonelik', 'SaaS'], blueprint: { name: 'Membership MGR', description: 'Üyelik yönetimi', masterGoal: 'Recurring revenue maksimize et', baseKnowledge: 'Membership platforms, retention', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'chatgpt-plugin-builder', name: 'ChatGPT Plugin Oluşturucu', description: 'Özel ChatGPT pluginleri tasarlar ve kodlar.', category: 'content', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '🔮', tags: ['ChatGPT', 'plugin', 'AI'], blueprint: { name: 'Plugin Builder', description: 'Plugin geliştirme', masterGoal: 'Gelir getiren plugin yap', baseKnowledge: 'OpenAI API, plugin development', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tiktok-shop-automation', name: 'TikTok Shop Otomasyonu', description: 'TikTok Shop ürün listeleme ve stok yönetimi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺20,000-70,000/ay', icon: '🎵', tags: ['TikTok', 'shop', 'e-ticaret'], blueprint: { name: 'TikTok Shop', description: 'Mağaza yönetimi', masterGoal: 'TikTok üzerinden sat', baseKnowledge: 'TikTok API, e-commerce', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'google-my-business-manager', name: 'Google İşletmem Yönetici', description: 'GMB profillerini otomatik günceller ve yönetir.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay', icon: '📍', tags: ['Google', 'lokal', 'SEO'], blueprint: { name: 'GMB Manager', description: 'Lokal SEO', masterGoal: 'Lokal arama görünürlüğünü artır', baseKnowledge: 'Google My Business API', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'whitelabel-agency', name: 'White Label Ajans Botu', description: 'Müşteriler için white label hizmet raporları oluşturur.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺40,000-120,000/ay', icon: '🏢', tags: ['ajans', 'whitelabel', 'raporlama'], blueprint: { name: 'WL Agency', description: 'Ajans hizmetleri', masterGoal: 'Ölçeklenebilir ajans geliri', baseKnowledge: 'Agency operations, reporting', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'linkedin-content-writer', name: 'LinkedIn İçerik Yazarı', description: 'Viral LinkedIn postları ve makaleleri yazar.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-18,000/ay', icon: '💼', tags: ['LinkedIn', 'içerik', 'B2B'], blueprint: { name: 'LinkedIn Writer', description: 'İçerik üretimi', masterGoal: 'LinkedIn thought leader ol', baseKnowledge: 'LinkedIn algorithm, B2B writing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'app-store-optimizer', name: 'App Store Optimizasyonu (ASO)', description: 'Mobil uygulama listelemelerini optimize eder.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '📱', tags: ['ASO', 'uygulama', 'mobile'], blueprint: { name: 'ASO Bot', description: 'App optimizasyonu', masterGoal: 'App indirmelerini artır', baseKnowledge: 'ASO techniques, app stores', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'forex-signal-bot', name: 'Forex Sinyal Botu', description: 'Forex piyasasında alım-satım sinyalleri üretir.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺50,000-200,000/ay potansiyel', icon: '💹', tags: ['forex', 'trading', 'sinyal'], blueprint: { name: 'Forex Signals', description: 'Trading sinyalleri', masterGoal: 'Karlı forex sinyalleri üret', baseKnowledge: 'Technical analysis, forex', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'rental-property-finder', name: 'Kiralık Mülk Bulucu', description: 'Yatırım için karlı kiralık mülk fırsatları bulur.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '🏘️', tags: ['gayrimenkul', 'kiralık', 'yatırım'], blueprint: { name: 'Rental Finder', description: 'Mülk keşfi', masterGoal: 'Yüksek getirili mülk bul', baseKnowledge: 'Real estate data, ROI calculation', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'grant-finder', name: 'Hibe ve Fon Bulucu', description: 'Startuplar için uygun hibe ve fon programlarını bulur.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺20,000-80,000/ay potansiyel', icon: '💰', tags: ['hibe', 'fon', 'startup'], blueprint: { name: 'Grant Finder', description: 'Fon arama', masterGoal: 'Bedava para kaynakları bul', baseKnowledge: 'Grant databases, eligibility', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'patent-monitor', name: 'Patent İzleme Sistemi', description: 'Sektördeki yeni patent başvurularını takip eder.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺25,000-70,000/ay değer', icon: '📜', tags: ['patent', 'inovasyon', 'rakip'], blueprint: { name: 'Patent Monitor', description: 'Patent takibi', masterGoal: 'Rakip inovasyonları izle', baseKnowledge: 'Patent databases, analysis', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'press-release-writer', name: 'Basın Bülteni Yazarı', description: 'Profesyonel basın bültenleri yazar ve dağıtır.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '📰', tags: ['PR', 'basın', 'medya'], blueprint: { name: 'PR Writer', description: 'Basın bülteni', masterGoal: 'Medya coverage al', baseKnowledge: 'PR writing, media outreach', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'upsell-recommendation', name: 'Upsell Öneri Motoru', description: 'Müşterilere kişiselleştirilmiş upsell önerisi yapar.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '⬆️', tags: ['upsell', 'öneri', 'e-ticaret'], blueprint: { name: 'Upsell Engine', description: 'Öneri motoru', masterGoal: 'Sepet değerini artır', baseKnowledge: 'Recommendation algorithms', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'refund-prevention', name: 'İade Önleme Sistemi', description: 'İade taleplerini analiz eder ve müdahale eder.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-60,000/ay tasarruf', icon: '🛡️', tags: ['iade', 'müşteri', 'koruma'], blueprint: { name: 'Refund Shield', description: 'İade önleme', masterGoal: 'İade oranını düşür', baseKnowledge: 'Customer psychology, retention', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'client-onboarding', name: 'Müşteri Onboarding Otomasyonu', description: 'Yeni müşteri onboarding sürecini otomatize eder.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺10,000-30,000/ay', icon: '🤝', tags: ['onboarding', 'müşteri', 'otomasyon'], blueprint: { name: 'Onboarding Bot', description: 'Müşteri karşılama', masterGoal: 'Müşteri başarısını artır', baseKnowledge: 'Customer success, automation', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'social-listening', name: 'Sosyal Dinleme Platformu', description: 'Marka hakkındaki sosyal medya konuşmalarını izler.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺18,000-55,000/ay', icon: '👂', tags: ['sosyal', 'dinleme', 'marka'], blueprint: { name: 'Social Listen', description: 'Sosyal takip', masterGoal: 'Marka algısını anlık ölç', baseKnowledge: 'Social APIs, sentiment analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'video-ad-creator', name: 'Video Reklam Oluşturucu', description: 'AI ile video reklam içerikleri üretir.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '📺', tags: ['video', 'reklam', 'AI'], blueprint: { name: 'Video Ad AI', description: 'Reklam üretimi', masterGoal: 'Yüksek CTR reklamlar yap', baseKnowledge: 'OVI AI, video editing', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ai-voice-agent', name: 'AI Sesli Müşteri Temsilcisi', description: 'Telefon aramalarını yapay zeka ile yanıtlar.', category: 'assistant', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '📞', tags: ['ses', 'AI', 'müşteri'], blueprint: { name: 'Voice Agent', description: 'Sesli asistan', masterGoal: '7/24 telefon desteği sağla', baseKnowledge: 'Voice AI, telephony', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'content-repurposer', name: 'İçerik Yeniden Kullanım Botu', description: 'Bir içeriği 10 farklı formata çevirir.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '🔄', tags: ['içerik', 'repurpose', 'verimlilik'], blueprint: { name: 'Repurpose Bot', description: 'İçerik dönüşümü', masterGoal: 'İçerik ROI sini maksimize et', baseKnowledge: 'Content formats, adaptation', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'pricing-intelligence', name: 'Fiyatlandırma Zekası', description: 'Optimal fiyat noktalarını AI ile belirler.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺20,000-70,000/ay', icon: '💵', tags: ['fiyat', 'AI', 'strateji'], blueprint: { name: 'Price Intel', description: 'Fiyat optimizasyonu', masterGoal: 'Kar marjını maksimize et', baseKnowledge: 'Pricing psychology, analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'warranty-tracker', name: 'Garanti Takip Sistemi', description: 'Ürün garantilerini takip eder, süre dolmadan uyarır.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,000-6,000/ay tasarruf', icon: '🔧', tags: ['garanti', 'takip', 'ürün'], blueprint: { name: 'Warranty Track', description: 'Garanti takibi', masterGoal: 'Garanti haklarını koruma', baseKnowledge: 'Product tracking', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'gift-recommender', name: 'Hediye Öneri Motoru', description: 'Kişiye özel hediye önerileri sunar.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🎁', tags: ['hediye', 'öneri', 'kişiselleştirme'], blueprint: { name: 'Gift AI', description: 'Hediye önerisi', masterGoal: 'Mükemmel hediye öner', baseKnowledge: 'Recommendation systems', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'subscription-box-curator', name: 'Abonelik Kutusu Küratörü', description: 'Subscription box içeriklerini kişiselleştirir.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-45,000/ay', icon: '📦', tags: ['abonelik', 'kutu', 'kişiselleştirme'], blueprint: { name: 'Sub Box', description: 'Kutu kürasyon', masterGoal: 'Churn rate düşür', baseKnowledge: 'Subscription models, personalization', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'flash-sale-automation', name: 'Flash Sale Otomasyonu', description: 'Anlık indirim kampanyalarını otomatik yönetir.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '⚡', tags: ['indirim', 'flash sale', 'e-ticaret'], blueprint: { name: 'Flash Sale', description: 'Kampanya yönetimi', masterGoal: 'Hızlı satış artışı', baseKnowledge: 'E-commerce, urgency marketing', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'marketplace-arbitrage', name: 'Marketplace Arbitraj Botu', description: 'Farklı pazaryerleri arasında fiyat farklarını bulur.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay potansiyel', icon: '🔀', tags: ['arbitraj', 'pazaryeri', 'fiyat'], blueprint: { name: 'Mktp Arbitrage', description: 'Arbitraj fırsatları', masterGoal: 'Risksiz kar yakala', baseKnowledge: 'Marketplace APIs, price tracking', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'micro-influence-finder', name: 'Mikro Influencer Bulucu', description: 'Niş mikro influencerları tespit eder.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🌟', tags: ['influencer', 'mikro', 'marketing'], blueprint: { name: 'Micro Finder', description: 'Influencer keşfi', masterGoal: 'Düşük maliyetli influencer marketing', baseKnowledge: 'Social media analytics', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'waitlist-manager', name: 'Waitlist Viral Yönetici', description: 'Viral referral waitlist sistemi oluşturur.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '📋', tags: ['waitlist', 'viral', 'referral'], blueprint: { name: 'Waitlist Viral', description: 'Bekleme listesi', masterGoal: 'Organik kullanıcı büyümesi', baseKnowledge: 'Viral mechanics, gamification', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tax-deduction-finder', name: 'Vergi İndirimi Bulucu', description: 'Kaçırılan vergi indirimlerini tespit eder.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay tasarruf', icon: '💳', tags: ['vergi', 'indirim', 'tasarruf'], blueprint: { name: 'Tax Finder', description: 'Vergi optimizasyonu', masterGoal: 'Yasal vergi tasarrufu maksimize et', baseKnowledge: 'Tax law, financial analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'supplier-negotiator', name: 'Tedarikçi Müzakere Botu', description: 'Tedarikçilerle otomatik fiyat müzakeresi yapar.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-60,000/ay tasarruf', icon: '🤝', tags: ['tedarik', 'müzakere', 'B2B'], blueprint: { name: 'Supplier Nego', description: 'Müzakere otomasyonu', masterGoal: 'Tedarik maliyetlerini düşür', baseKnowledge: 'Negotiation tactics, procurement', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'loyalty-program', name: 'Sadakat Programı Yönetici', description: 'Müşteri sadakat programlarını otomatik yönetir.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '🏆', tags: ['sadakat', 'müşteri', 'program'], blueprint: { name: 'Loyalty MGR', description: 'Sadakat yönetimi', masterGoal: 'Müşteri LTV artır', baseKnowledge: 'Loyalty programs, gamification', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'gig-finder', name: 'Freelance İş Bulucu', description: 'En iyi freelance fırsatlarını tarar ve bildirir.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '💻', tags: ['freelance', 'iş', 'fırsat'], blueprint: { name: 'Gig Finder', description: 'İş arama', masterGoal: 'Yüksek ödeme işleri bul', baseKnowledge: 'Freelance platforms, scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'product-launch-planner', name: 'Ürün Lansman Planlayıcı', description: 'Ürün lansman stratejisi ve timeline oluşturur.', category: 'content', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '🚀', tags: ['lansman', 'ürün', 'strateji'], blueprint: { name: 'Launch Planner', description: 'Lansman planı', masterGoal: 'Başarılı ürün lansman', baseKnowledge: 'Product launch, marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'crisis-management', name: 'Kriz Yönetim Botu', description: 'PR krizlerini tespit eder ve yanıt önerir.', category: 'assistant', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay değer', icon: '🚨', tags: ['kriz', 'PR', 'yönetim'], blueprint: { name: 'Crisis Bot', description: 'Kriz müdahale', masterGoal: 'Marka itibarını koru', baseKnowledge: 'Crisis PR, social monitoring', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'competitor-pricing-intel', name: 'Rakip Fiyat İstihbaratı', description: 'Rakip fiyat değişikliklerini gerçek zamanlı izler.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🔍', tags: ['fiyat', 'rakip', 'istihbarat'], blueprint: { name: 'Price Intel', description: 'Fiyat izleme', masterGoal: 'Rekabetçi fiyatlama yap', baseKnowledge: 'Web scraping, price analysis', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'audience-segmentation', name: 'Hedef Kitle Segmentasyonu', description: 'Müşterileri AI ile segmentlere ayırır.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺18,000-55,000/ay', icon: '👥', tags: ['segment', 'hedef kitle', 'AI'], blueprint: { name: 'Audience AI', description: 'Segmentasyon', masterGoal: 'Kişiselleştirilmiş pazarlama', baseKnowledge: 'ML clustering, customer analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'event-speaker-finder', name: 'Etkinlik Konuşmacı Bulucu', description: 'Etkinlikler için uygun konuşmacıları bulur.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '🎤', tags: ['etkinlik', 'konuşmacı', 'organizasyon'], blueprint: { name: 'Speaker Finder', description: 'Konuşmacı arama', masterGoal: 'Etkinlik başarısını artır', baseKnowledge: 'Event industry, speaker networks', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'testimonial-video-maker', name: 'Müşteri Referans Video Üretici', description: 'Müşteri testimonial videolarını otomatik üretir.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🎬', tags: ['video', 'testimonial', 'referans'], blueprint: { name: 'Testimonial Vid', description: 'Video üretimi', masterGoal: 'Güven artıran videolar yap', baseKnowledge: 'OVI AI, video editing', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'chatbot-builder', name: 'AI Chatbot Oluşturucu', description: 'Kodsuz AI chatbotlar oluşturur.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '🤖', tags: ['chatbot', 'AI', 'kodsuz'], blueprint: { name: 'Chatbot Builder', description: 'Bot oluşturma', masterGoal: 'Müşteri hizmetleri otomayonu', baseKnowledge: 'NLP, chatbot platforms', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'partnership-finder', name: 'Ortaklık Fırsat Bulucu', description: 'Stratejik ortaklık fırsatlarını tespit eder.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-70,000/ay potansiyel', icon: '🤲', tags: ['ortaklık', 'B2B', 'strateji'], blueprint: { name: 'Partnership AI', description: 'Ortaklık arama', masterGoal: 'Sinerjik ortaklıklar kur', baseKnowledge: 'Business development, networking', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'knowledge-base-builder', name: 'Bilgi Bankası Oluşturucu', description: 'Otomatik FAQ ve bilgi bankası oluşturur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺6,000-18,000/ay', icon: '📚', tags: ['FAQ', 'bilgi', 'self-service'], blueprint: { name: 'KB Builder', description: 'Bilgi bankası', masterGoal: 'Destek taleplerini azalt', baseKnowledge: 'Content organization, NLP', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'brand-voice-generator', name: 'Marka Sesi Üretici', description: 'Tutarlı marka tonu ve sesi oluşturur.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺7,000-22,000/ay', icon: '🗣️', tags: ['marka', 'ses', 'ton'], blueprint: { name: 'Brand Voice', description: 'Marka sesi', masterGoal: 'Tutarlı marka iletişimi', baseKnowledge: 'Brand strategy, copywriting', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'feature-voting', name: 'Özellik Oylama Sistemi', description: 'Kullanıcı özellik taleplerini toplar ve önceliklendirir.', category: 'analytics', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '🗳️', tags: ['özellik', 'oylama', 'ürün'], blueprint: { name: 'Feature Vote', description: 'Oylama sistemi', masterGoal: 'Kullanıcı odaklı geliştirme', baseKnowledge: 'Product management, feedback', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'deal-flow-tracker', name: 'Yatırım Deal Flow Takipçisi', description: 'Yatırım fırsatlarını takip eder ve değerlendirir.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay potansiyel', icon: '📊', tags: ['yatırım', 'deal', 'VC'], blueprint: { name: 'Deal Flow', description: 'Yatırım takibi', masterGoal: 'Yatırım fırsatlarını değerlendir', baseKnowledge: 'Investment analysis, due diligence', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'referral-program-manager', name: 'Referans Program Yöneticisi', description: 'Viral referral programlarını yönetir.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '🔗', tags: ['referans', 'viral', 'büyüme'], blueprint: { name: 'Referral MGR', description: 'Referans programı', masterGoal: 'Organik kullanıcı büyümesi', baseKnowledge: 'Referral mechanics, tracking', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'live-chat-ai', name: 'AI Canlı Sohbet Asistanı', description: 'Web sitesinde AI destekli canlı sohbet.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '💬', tags: ['chat', 'AI', 'destek'], blueprint: { name: 'Live Chat AI', description: 'Canlı sohbet', masterGoal: 'Dönüşüm oranını artır', baseKnowledge: 'Chat widgets, AI responses', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'social-commerce', name: 'Sosyal Ticaret Yöneticisi', description: 'Instagram ve Facebook üzerinden satış yönetimi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺18,000-55,000/ay', icon: '🛍️', tags: ['sosyal', 'ticaret', 'satış'], blueprint: { name: 'Social Commerce', description: 'Sosyal satış', masterGoal: 'Sosyal medyadan sat', baseKnowledge: 'Social commerce, e-commerce', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'image-background-remover', name: 'Arka Plan Kaldırıcı', description: 'Görsellerin arka planını AI ile kaldırır.', category: 'video', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '✂️', tags: ['görsel', 'arka plan', 'AI'], blueprint: { name: 'BG Remover', description: 'Görsel işleme', masterGoal: 'Profesyonel görseller', baseKnowledge: 'AI image processing', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'sms-marketing', name: 'SMS Pazarlama Otomasyonu', description: 'Hedefli SMS kampanyaları gönderir.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺8,000-28,000/ay', icon: '📱', tags: ['SMS', 'pazarlama', 'kampanya'], blueprint: { name: 'SMS Marketing', description: 'SMS kampanyası', masterGoal: 'Yüksek açılma oranı', baseKnowledge: 'SMS gateways, marketing', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'cohort-analysis', name: 'Kohort Analiz Botu', description: 'Kullanıcı kohortlarını analiz eder.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺12,000-40,000/ay', icon: '📈', tags: ['kohort', 'analiz', 'retention'], blueprint: { name: 'Cohort Analytics', description: 'Kohort analizi', masterGoal: 'Retention artır', baseKnowledge: 'Analytics, cohort analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'product-review-analyzer', name: 'Ürün Yorum Analizci', description: 'Ürün yorumlarından insight çıkarır.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '⭐', tags: ['yorum', 'analiz', 'ürün'], blueprint: { name: 'Review Analyzer', description: 'Yorum analizi', masterGoal: 'Ürün geliştirme fırsatları bul', baseKnowledge: 'NLP, sentiment analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'virtual-event-host', name: 'Sanal Etkinlik Ev Sahibi', description: 'Online etkinlikleri otomatik yönetir.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🎪', tags: ['etkinlik', 'sanal', 'yönetim'], blueprint: { name: 'Event Host', description: 'Etkinlik yönetimi', masterGoal: 'Profesyonel online etkinlikler', baseKnowledge: 'Event platforms, automation', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'commission-tracker', name: 'Komisyon Takip Sistemi', description: 'Affiliate ve satış komisyonlarını takip eder.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺5,000-18,000/ay', icon: '💸', tags: ['komisyon', 'takip', 'satış'], blueprint: { name: 'Commission Track', description: 'Komisyon takibi', masterGoal: 'Kazançları doğru hesapla', baseKnowledge: 'Commission structures, tracking', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'bundle-optimizer', name: 'Ürün Paketi Optimizasyonu', description: 'Optimal ürün paketleri oluşturur.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📦', tags: ['paket', 'ürün', 'optimizasyon'], blueprint: { name: 'Bundle AI', description: 'Paket önerisi', masterGoal: 'Satış değerini artır', baseKnowledge: 'Product analytics, bundling', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'exit-intent-popup', name: 'Çıkış Niyeti Popup Yönetici', description: 'Exit intent popuplarını optimize eder.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺6,000-22,000/ay', icon: '🚪', tags: ['popup', 'exit intent', 'dönüşüm'], blueprint: { name: 'Exit Popup', description: 'Popup optimizasyonu', masterGoal: 'Bounce rate düşür', baseKnowledge: 'Conversion optimization', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'customer-win-back', name: 'Müşteri Geri Kazanma', description: 'Kayıp müşterileri geri kazanma kampanyası.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '🔙', tags: ['müşteri', 'win-back', 'kampanya'], blueprint: { name: 'Win Back', description: 'Geri kazanma', masterGoal: 'Eski müşterileri aktif et', baseKnowledge: 'Customer retention, email', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'domain-investor', name: 'Domain Yatırım Asistanı', description: 'Karlı domain isimleri tespit eder.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-60,000/ay potansiyel', icon: '🌐', tags: ['domain', 'yatırım', 'satış'], blueprint: { name: 'Domain Invest', description: 'Domain analizi', masterGoal: 'Değerli domain bul', baseKnowledge: 'Domain valuation, trends', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'content-spinner', name: 'İçerik Varyasyon Üretici', description: 'Aynı içeriğin farklı varyasyonlarını üretir.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🔄', tags: ['içerik', 'varyasyon', 'üretim'], blueprint: { name: 'Content Spinner', description: 'Varyasyon üretimi', masterGoal: 'Test edilebilir içerikler', baseKnowledge: 'NLP, content variation', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'payment-retry', name: 'Ödeme Yeniden Deneme Sistemi', description: 'Başarısız ödemeleri akıllıca yeniden dener.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-70,000/ay kurtarma', icon: '💳', tags: ['ödeme', 'retry', 'kurtarma'], blueprint: { name: 'Payment Retry', description: 'Ödeme kurtarma', masterGoal: 'Involuntary churn azalt', baseKnowledge: 'Payment systems, retry logic', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'lead-scoring', name: 'Lead Puanlama Sistemi', description: 'Potansiyel müşterileri AI ile puanlar.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '🎯', tags: ['lead', 'puanlama', 'AI'], blueprint: { name: 'Lead Score', description: 'Lead puanlama', masterGoal: 'Satış verimliliğini artır', baseKnowledge: 'ML, lead qualification', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'calendar-monetization', name: 'Takvim Monetizasyon', description: 'Zamanını para ile satma sistemi.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺8,000-30,000/ay', icon: '📅', tags: ['takvim', 'zaman', 'monetize'], blueprint: { name: 'Time Money', description: 'Zaman satışı', masterGoal: 'Danışmanlık geliri', baseKnowledge: 'Booking systems, pricing', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'newsletter-monetization', name: 'Newsletter Monetizasyonu', description: 'Newsletter için sponsor ve reklam yönetimi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺12,000-45,000/ay', icon: '📧', tags: ['newsletter', 'reklam', 'sponsor'], blueprint: { name: 'News Money', description: 'Newsletter gelir', masterGoal: 'Newsletter den gelir üret', baseKnowledge: 'Email sponsorship, monetization', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'api-usage-monitor', name: 'API Kullanım Monitörü', description: 'API kullanımını ve maliyetini takip eder.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺5,000-15,000/ay tasarruf', icon: '📊', tags: ['API', 'kullanım', 'maliyet'], blueprint: { name: 'API Monitor', description: 'Kullanım takibi', masterGoal: 'API maliyetlerini optimize et', baseKnowledge: 'API monitoring, cost analysis', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'helpdesk-automation', name: 'Helpdesk Otomasyonu', description: 'Destek taleplerini otomatik kategorize ve yanıtlar.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🎧', tags: ['destek', 'helpdesk', 'otomasyon'], blueprint: { name: 'Helpdesk AI', description: 'Destek otomasyonu', masterGoal: 'Ticket çözüm süresini kısalt', baseKnowledge: 'NLP, helpdesk systems', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'video-seo-optimizer', name: 'Video SEO Optimizasyonu', description: 'YouTube videolarını SEO için optimize eder.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '▶️', tags: ['YouTube', 'SEO', 'video'], blueprint: { name: 'Video SEO', description: 'Video optimizasyonu', masterGoal: 'Video görüntülenmeleri artır', baseKnowledge: 'YouTube SEO, video marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ai-thumbnail-maker', name: 'AI Thumbnail Üretici', description: 'Viral YouTube thumbnailları oluşturur.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '🖼️', tags: ['thumbnail', 'YouTube', 'AI'], blueprint: { name: 'Thumb AI', description: 'Thumbnail üretimi', masterGoal: 'CTR artıran thumbnails', baseKnowledge: 'AI image, clickbait psychology', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'contract-renewal', name: 'Sözleşme Yenileme Otomasyonu', description: 'Sözleşme yenileme süreçlerini yönetir.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '📝', tags: ['sözleşme', 'yenileme', 'retention'], blueprint: { name: 'Renewal Bot', description: 'Yenileme takibi', masterGoal: 'Churn azalt', baseKnowledge: 'Contract management, retention', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'localization-manager', name: 'Lokalizasyon Yöneticisi', description: 'İçerikleri farklı dillere otomatik çevirir.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '🌍', tags: ['çeviri', 'lokalizasyon', 'dil'], blueprint: { name: 'Localize Bot', description: 'Çeviri yönetimi', masterGoal: 'Global pazara aç', baseKnowledge: 'Translation APIs, localization', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // ============================================
    // 100 YENİ ŞABLON - TOPLAM 325+
    // ============================================
    // PARA KAZANDIRAN (30)
    { id: 'subscription-billing', name: 'Abonelik Faturalandırma', description: 'Recurring billing otomasyonu.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '💳', tags: ['abonelik', 'billing', 'SaaS'], blueprint: { name: 'Sub Billing', description: 'Faturalandırma', masterGoal: 'Ödeme süreçlerini otomatize et', baseKnowledge: 'Payment APIs', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'digital-product-seller', name: 'Dijital Ürün Satış Botu', description: 'E-kitap, kurs, template satışı.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '💾', tags: ['dijital', 'ürün', 'satış'], blueprint: { name: 'Digital Seller', description: 'Dijital satış', masterGoal: 'Pasif gelir üret', baseKnowledge: 'E-commerce, digital delivery', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'coaching-scheduler', name: 'Koçluk Randevu Yönetici', description: 'Online koçluk seansları planlama.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺10,000-35,000/ay', icon: '🎯', tags: ['koçluk', 'randevu', 'eğitim'], blueprint: { name: 'Coach Schedule', description: 'Seans planlama', masterGoal: 'Koçluk gelirini artır', baseKnowledge: 'Booking systems', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'saas-onboarding', name: 'SaaS Onboarding Otomasyonu', description: 'Yeni kullanıcıları aktive etme.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺20,000-60,000/ay', icon: '🚀', tags: ['SaaS', 'onboarding', 'aktivasyon'], blueprint: { name: 'SaaS Onboard', description: 'Kullanıcı aktivasyonu', masterGoal: 'Time to value azalt', baseKnowledge: 'Product-led growth', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'payment-dunning', name: 'Başarısız Ödeme Kurtarma', description: 'Failed payment recovery.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay', icon: '💰', tags: ['ödeme', 'dunning', 'recovery'], blueprint: { name: 'Dunning Bot', description: 'Ödeme kurtarma', masterGoal: 'Gelir kaybını önle', baseKnowledge: 'Payment retry logic', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'agency-reporting', name: 'Ajans Müşteri Raporlama', description: 'Otomatik müşteri performans raporları.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-45,000/ay', icon: '📊', tags: ['ajans', 'rapor', 'müşteri'], blueprint: { name: 'Agency Report', description: 'Raporlama', masterGoal: 'Müşteri memnuniyeti artır', baseKnowledge: 'Data visualization', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'order-fulfillment', name: 'Sipariş Karşılama Otomasyonu', description: 'Order to delivery sürecini yönet.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺25,000-75,000/ay', icon: '📦', tags: ['sipariş', 'fulfillment', 'lojistik'], blueprint: { name: 'Order Flow', description: 'Sipariş yönetimi', masterGoal: 'Teslimat süresini kısalt', baseKnowledge: 'E-commerce, logistics', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'invoice-collection', name: 'Fatura Tahsilat Takibi', description: 'Geciken ödemeleri takip et.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺20,000-60,000/ay', icon: '💵', tags: ['fatura', 'tahsilat', 'takip'], blueprint: { name: 'Collection Bot', description: 'Tahsilat', masterGoal: 'Nakit akışını iyileştir', baseKnowledge: 'AR management', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'cross-sell-engine', name: 'Cross-Sell Motoru', description: 'İlgili ürün önerileri.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺18,000-55,000/ay', icon: '🔀', tags: ['cross-sell', 'öneri', 'satış'], blueprint: { name: 'Cross Sell', description: 'Çapraz satış', masterGoal: 'Basket size artır', baseKnowledge: 'Recommendation engines', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'premium-upgrade', name: 'Premium Yükseltme Kampanyası', description: 'Free to paid dönüşüm.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺22,000-70,000/ay', icon: '⭐', tags: ['premium', 'upgrade', 'freemium'], blueprint: { name: 'Upgrade Bot', description: 'Yükseltme', masterGoal: 'Conversion rate artır', baseKnowledge: 'Freemium economics', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'vendor-payment', name: 'Tedarikçi Ödeme Otomasyonu', description: 'Otomatik tedarikçi ödemeleri.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺15,000-45,000/ay tasarruf', icon: '🏦', tags: ['tedarikçi', 'ödeme', 'B2B'], blueprint: { name: 'Vendor Pay', description: 'Ödeme otomasyonu', masterGoal: 'Geç ödeme cezalarını önle', baseKnowledge: 'AP automation', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'dynamic-pricing', name: 'Dinamik Fiyatlandırma', description: 'Talebe göre fiyat ayarlama.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺35,000-120,000/ay', icon: '📈', tags: ['fiyat', 'dinamik', 'algoritma'], blueprint: { name: 'Dynamic Price', description: 'Fiyat optimizasyonu', masterGoal: 'Revenue maksimize et', baseKnowledge: 'Pricing algorithms', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'partner-commission', name: 'Partner Komisyon Hesaplama', description: 'Partner paylaşımlarını otomatik hesapla.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '🤝', tags: ['partner', 'komisyon', 'hesaplama'], blueprint: { name: 'Partner Calc', description: 'Komisyon hesabı', masterGoal: 'Partner ilişkilerini güçlendir', baseKnowledge: 'Commission structures', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'revenue-forecast', name: 'Gelir Tahmini Sistemi', description: 'AI ile gelir projeksiyonu.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay değer', icon: '📊', tags: ['gelir', 'tahmin', 'AI'], blueprint: { name: 'Revenue AI', description: 'Gelir tahmini', masterGoal: 'Finansal planning', baseKnowledge: 'ML forecasting', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'reseller-management', name: 'Bayi Yönetim Sistemi', description: 'Multi-tier reseller network.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay', icon: '🏪', tags: ['bayi', 'reseller', 'network'], blueprint: { name: 'Reseller MGR', description: 'Bayi yönetimi', masterGoal: 'Bayi networkü büyüt', baseKnowledge: 'Channel management', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'license-management', name: 'Lisans Yönetimi', description: 'Yazılım lisans takibi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺18,000-55,000/ay', icon: '🔑', tags: ['lisans', 'yazılım', 'yönetim'], blueprint: { name: 'License MGR', description: 'Lisans takibi', masterGoal: 'Lisans gelirlerini koruma', baseKnowledge: 'License management', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'credit-scoring', name: 'Müşteri Kredi Skorlama', description: 'Ödeme riski değerlendirme.', category: 'money-maker', difficulty: 'hard', estimatedRevenue: '₺40,000-130,000/ay', icon: '📉', tags: ['kredi', 'skor', 'risk'], blueprint: { name: 'Credit Score', description: 'Risk değerlendirme', masterGoal: 'Batık alacakları azalt', baseKnowledge: 'Credit modeling', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'quote-automation', name: 'Teklif Otomasyonu', description: 'Otomatik fiyat teklifi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '📝', tags: ['teklif', 'fiyat', 'satış'], blueprint: { name: 'Quote Bot', description: 'Teklif üretimi', masterGoal: 'Satış döngüsünü hızlandır', baseKnowledge: 'CPQ systems', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'cashback-program', name: 'Cashback Programı', description: 'Müşteri geri ödeme sistemi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺20,000-65,000/ay', icon: '💸', tags: ['cashback', 'ödül', 'sadakat'], blueprint: { name: 'Cashback Bot', description: 'Geri ödeme', masterGoal: 'Müşteri sadakatini artır', baseKnowledge: 'Rewards programs', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'profit-margin-analyzer', name: 'Kar Marjı Analizi', description: 'Ürün bazlı karlılık takibi.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺18,000-55,000/ay', icon: '💹', tags: ['kar', 'marj', 'analiz'], blueprint: { name: 'Margin Bot', description: 'Karlılık analizi', masterGoal: 'Düşük marjlı ürünleri tespit et', baseKnowledge: 'Financial analysis', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // İÇERİK (35)
    { id: 'blog-writer-ai', name: 'AI Blog Yazarı', description: 'SEO uyumlu blog makaleleri.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺6,000-20,000/ay', icon: '✍️', tags: ['blog', 'AI', 'yazı'], blueprint: { name: 'Blog AI', description: 'Blog yazımı', masterGoal: 'Organik trafik artır', baseKnowledge: 'SEO writing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'social-caption-ai', name: 'Sosyal Medya Caption Yazarı', description: 'Viral caption üretimi.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '💬', tags: ['caption', 'sosyal', 'AI'], blueprint: { name: 'Caption AI', description: 'Caption üretimi', masterGoal: 'Engagement artır', baseKnowledge: 'Social copywriting', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'landing-page-copy', name: 'Landing Page Metin Yazarı', description: 'Dönüşüm odaklı sayfa metinleri.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📄', tags: ['landing', 'copy', 'dönüşüm'], blueprint: { name: 'LP Copy', description: 'Sayfa metni', masterGoal: 'Conversion rate artır', baseKnowledge: 'Conversion copywriting', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'email-subject-tester', name: 'Email Konu Başlığı Test', description: 'En iyi subject line bul.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay', icon: '📧', tags: ['email', 'subject', 'test'], blueprint: { name: 'Subject Test', description: 'Konu testi', masterGoal: 'Open rate artır', baseKnowledge: 'Email marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'video-script-ai', name: 'Video Script Yazarı', description: 'YouTube ve TikTok scriptleri.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🎬', tags: ['video', 'script', 'YouTube'], blueprint: { name: 'Script AI', description: 'Script yazımı', masterGoal: 'Video içerik üretimini hızlandır', baseKnowledge: 'Video scripting', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'story-creator', name: 'Instagram Story Tasarımcı', description: 'Otomatik story görselleri.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '📱', tags: ['Instagram', 'story', 'tasarım'], blueprint: { name: 'Story Bot', description: 'Story tasarımı', masterGoal: 'Story viewleri artır', baseKnowledge: 'Visual design', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tutorial-generator', name: 'Tutorial İçerik Üretici', description: 'Adım adım howto içerikleri.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺7,000-22,000/ay', icon: '📚', tags: ['tutorial', 'howto', 'eğitim'], blueprint: { name: 'Tutorial AI', description: 'İçerik üretimi', masterGoal: 'Eğitim içeriği oluştur', baseKnowledge: 'Technical writing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'case-study-writer', name: 'Vaka Çalışması Yazarı', description: 'Müşteri başarı hikayeleri.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺10,000-30,000/ay', icon: '📊', tags: ['case study', 'müşteri', 'başarı'], blueprint: { name: 'Case Writer', description: 'Vaka yazımı', masterGoal: 'Güven artıran içerik', baseKnowledge: 'Business writing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'faq-generator', name: 'FAQ Üretici', description: 'Otomatik SSS içerikleri.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '❓', tags: ['FAQ', 'SSS', 'destek'], blueprint: { name: 'FAQ Bot', description: 'SSS üretimi', masterGoal: 'Self-service artır', baseKnowledge: 'Content structuring', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'infographic-creator', name: 'Infografik Oluşturucu', description: 'Veriden infografik üret.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '📊', tags: ['infografik', 'veri', 'görsel'], blueprint: { name: 'Infographic AI', description: 'Görsel üretimi', masterGoal: 'Viral paylaşılabilir içerik', baseKnowledge: 'Data visualization', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'whitepaper-writer', name: 'Whitepaper Yazarı', description: 'B2B lead magnet içerikleri.', category: 'content', difficulty: 'hard', estimatedRevenue: '₺15,000-45,000/ay', icon: '📑', tags: ['whitepaper', 'B2B', 'lead'], blueprint: { name: 'Whitepaper AI', description: 'Teknik içerik', masterGoal: 'Kaliteli lead üret', baseKnowledge: 'Technical marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'podcast-show-notes', name: 'Podcast Show Notes Yazarı', description: 'Bölüm açıklamaları ve notlar.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '🎧', tags: ['podcast', 'notes', 'açıklama'], blueprint: { name: 'Show Notes', description: 'Bölüm notları', masterGoal: 'SEO için podcast optimize et', baseKnowledge: 'Podcast marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'carousel-maker', name: 'LinkedIn Carousel Maker', description: 'Viral carousel postları.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-18,000/ay', icon: '📑', tags: ['LinkedIn', 'carousel', 'B2B'], blueprint: { name: 'Carousel Bot', description: 'Carousel tasarımı', masterGoal: 'LinkedIn etkileşimi artır', baseKnowledge: 'LinkedIn algorithm', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'newsletter-writer', name: 'Newsletter İçerik Yazarı', description: 'Haftalık bülten içerikleri.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay', icon: '📧', tags: ['newsletter', 'email', 'içerik'], blueprint: { name: 'Newsletter AI', description: 'Bülten yazımı', masterGoal: 'Subscriber engagement artır', baseKnowledge: 'Email content', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'comparison-content', name: 'Karşılaştırma İçeriği', description: 'X vs Y makaleleri.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺7,000-22,000/ay', icon: '⚖️', tags: ['karşılaştırma', 'vs', 'SEO'], blueprint: { name: 'Compare Bot', description: 'Karşılaştırma', masterGoal: 'Bottom funnel trafik', baseKnowledge: 'Comparison marketing', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'product-update-writer', name: 'Ürün Güncelleme Duyuruları', description: 'Release notes ve changelog.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '🆕', tags: ['ürün', 'güncelleme', 'changelog'], blueprint: { name: 'Update Bot', description: 'Duyuru yazımı', masterGoal: 'Kullanıcıları bilgilendir', baseKnowledge: 'Product communication', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'listicle-generator', name: 'Listicle Üretici', description: 'Top 10, Best X listeli içerikler.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay', icon: '📋', tags: ['liste', 'top', 'SEO'], blueprint: { name: 'List Bot', description: 'Liste içerikleri', masterGoal: 'Viral potansiyeli artır', baseKnowledge: 'List content', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'glossary-builder', name: 'Sözlük/Glossary Oluşturucu', description: 'Sektör terimleri sözlüğü.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '📖', tags: ['sözlük', 'terim', 'SEO'], blueprint: { name: 'Glossary Bot', description: 'Terim sözlüğü', masterGoal: 'Long-tail SEO', baseKnowledge: 'Dictionary content', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'meme-generator', name: 'Meme Üretici', description: 'Viral meme içerikleri.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺2,000-8,000/ay', icon: '😂', tags: ['meme', 'viral', 'sosyal'], blueprint: { name: 'Meme Bot', description: 'Meme üretimi', masterGoal: 'Sosyal engagement artır', baseKnowledge: 'Meme culture', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'bio-writer', name: 'Profesyonel Bio Yazarı', description: 'LinkedIn ve sosyal bio metinleri.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '👤', tags: ['bio', 'profil', 'özgeçmiş'], blueprint: { name: 'Bio AI', description: 'Bio yazımı', masterGoal: 'Profesyonel imaj', baseKnowledge: 'Personal branding', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // ANALİZ (20)
    { id: 'funnel-analytics', name: 'Funnel Analizi', description: 'Satış hunisi optimizasyonu.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺20,000-65,000/ay', icon: '📈', tags: ['funnel', 'analiz', 'dönüşüm'], blueprint: { name: 'Funnel Bot', description: 'Huni analizi', masterGoal: 'Dönüşüm bottleneck bul', baseKnowledge: 'Funnel analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'roi-calculator', name: 'ROI Hesaplayıcı', description: 'Kampanya ROI takibi.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '💰', tags: ['ROI', 'hesaplama', 'kampanya'], blueprint: { name: 'ROI Bot', description: 'ROI hesabı', masterGoal: 'Marketing spend optimize et', baseKnowledge: 'Marketing analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'customer-journey-map', name: 'Müşteri Yolculuğu Haritası', description: 'Touchpoint analizi.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺18,000-55,000/ay', icon: '🗺️', tags: ['müşteri', 'yolculuk', 'touchpoint'], blueprint: { name: 'Journey Map', description: 'Yolculuk analizi', masterGoal: 'CX optimize et', baseKnowledge: 'Customer journey mapping', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'attribution-model', name: 'Marketing Attribution', description: 'Kanal etki analizi.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺22,000-70,000/ay', icon: '📊', tags: ['attribution', 'kanal', 'marketing'], blueprint: { name: 'Attribution Bot', description: 'Etki analizi', masterGoal: 'Bütçe dağılımı optimize et', baseKnowledge: 'Multi-touch attribution', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'revenue-waterfall', name: 'Gelir Şelale Analizi', description: 'MRR değişim detayları.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '📈', tags: ['MRR', 'gelir', 'analiz'], blueprint: { name: 'Waterfall Bot', description: 'MRR analizi', masterGoal: 'Gelir büyüme kaynaklarını anla', baseKnowledge: 'SaaS metrics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'heatmap-analyzer', name: 'Heatmap Analizci', description: 'Kullanıcı davranış ısı haritası.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🔥', tags: ['heatmap', 'davranış', 'UX'], blueprint: { name: 'Heatmap Bot', description: 'Isı haritası', masterGoal: 'UX sorunlarını tespit et', baseKnowledge: 'Behavior analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'nps-tracker', name: 'NPS Takip Sistemi', description: 'Net Promoter Score otomasyonu.', category: 'analytics', difficulty: 'easy', estimatedRevenue: '₺6,000-20,000/ay', icon: '📊', tags: ['NPS', 'müşteri', 'memnuniyet'], blueprint: { name: 'NPS Bot', description: 'NPS takibi', masterGoal: 'Müşteri memnuniyetini ölç', baseKnowledge: 'Customer feedback', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'usage-analytics', name: 'Ürün Kullanım Analizi', description: 'Feature adoption tracking.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '📈', tags: ['kullanım', 'feature', 'product'], blueprint: { name: 'Usage Bot', description: 'Kullanım analizi', masterGoal: 'Product-market fit ölç', baseKnowledge: 'Product analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'competitor-traffic', name: 'Rakip Trafik Analizi', description: 'Rakip website trafiği tahmini.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📊', tags: ['rakip', 'trafik', 'analiz'], blueprint: { name: 'Traffic Bot', description: 'Trafik analizi', masterGoal: 'Rakip performansını izle', baseKnowledge: 'Web analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ltv-predictor', name: 'LTV Tahmincisi', description: 'Müşteri yaşam boyu değeri.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺20,000-65,000/ay', icon: '💎', tags: ['LTV', 'müşteri', 'tahmin'], blueprint: { name: 'LTV Bot', description: 'LTV tahmini', masterGoal: 'Yüksek değerli müşterilere odaklan', baseKnowledge: 'Customer value modeling', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // ASISTAN (15)
    { id: 'email-sorter', name: 'Email Sınıflandırıcı', description: 'İnbox otomatik organizasyonu.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺5,000-15,000/ay tasarruf', icon: '📥', tags: ['email', 'organize', 'verimlilik'], blueprint: { name: 'Email Sorter', description: 'Email sınıflandırma', masterGoal: 'İnbox zero', baseKnowledge: 'Email automation', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'task-delegator', name: 'Görev Dağıtıcı', description: 'Akıllı görev atama.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '📋', tags: ['görev', 'takım', 'delegasyon'], blueprint: { name: 'Task Bot', description: 'Görev dağıtımı', masterGoal: 'Takım verimliliğini artır', baseKnowledge: 'Task management', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'smart-reminder', name: 'Akıllı Hatırlatıcı', description: 'Kontekst bazlı hatırlatmalar.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '⏰', tags: ['hatırlatma', 'akıllı', 'verimlilik'], blueprint: { name: 'Smart Remind', description: 'Hatırlatma', masterGoal: 'Hiçbir şeyi unutma', baseKnowledge: 'Reminder systems', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'expense-approver', name: 'Masraf Onay Botu', description: 'Otomatik harcama onayı.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '✅', tags: ['masraf', 'onay', 'iş akışı'], blueprint: { name: 'Expense Bot', description: 'Masraf onayı', masterGoal: 'Onay süreçlerini hızlandır', baseKnowledge: 'Expense management', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'interview-scheduler', name: 'Mülakat Planlayıcı', description: 'Otomatik mülakat koordinasyonu.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺5,000-18,000/ay', icon: '👔', tags: ['mülakat', 'HR', 'planlama'], blueprint: { name: 'Interview Bot', description: 'Mülakat planı', masterGoal: 'Hiring sürecini hızlandır', baseKnowledge: 'HR automation', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'document-signer', name: 'Belge İmza Yönetici', description: 'E-imza süreç takibi.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺7,000-22,000/ay', icon: '✍️', tags: ['imza', 'belge', 'e-imza'], blueprint: { name: 'Sign Bot', description: 'İmza yönetimi', masterGoal: 'Sözleşme döngüsünü kısalt', baseKnowledge: 'e-Signature', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'travel-booker', name: 'Seyahat Rezervasyon Botu', description: 'En uygun uçuş/otel arama.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺5,000-15,000/ay tasarruf', icon: '✈️', tags: ['seyahat', 'rezervasyon', 'otel'], blueprint: { name: 'Travel Bot', description: 'Seyahat planlama', masterGoal: 'Seyahat masraflarını azalt', baseKnowledge: 'Travel APIs', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'personal-finance', name: 'Kişisel Finans Asistanı', description: 'Bütçe ve yatırım takibi.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺4,000-12,000/ay değer', icon: '💵', tags: ['finans', 'bütçe', 'yatırım'], blueprint: { name: 'Finance Bot', description: 'Finans takibi', masterGoal: 'Finansal sağlığı iyileştir', baseKnowledge: 'Personal finance', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'health-tracker', name: 'Sağlık Takip Asistanı', description: 'Randevu ve ilaç hatırlatma.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🏥', tags: ['sağlık', 'takip', 'hatırlatma'], blueprint: { name: 'Health Bot', description: 'Sağlık takibi', masterGoal: 'Sağlık rutinlerini destekle', baseKnowledge: 'Health tracking', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'home-automation', name: 'Akıllı Ev Kontrolü', description: 'IoT cihaz otomasyonu.', category: 'assistant', difficulty: 'hard', estimatedRevenue: '₺6,000-20,000/ay', icon: '🏠', tags: ['ev', 'IoT', 'otomasyon'], blueprint: { name: 'Home Bot', description: 'Ev kontrolü', masterGoal: 'Akıllı ev deneyimi', baseKnowledge: 'IoT platforms', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // SCRAPER (10)
    { id: 'job-listing-scraper', name: 'İş İlanı Toplayıcı', description: 'Kariyer sitelerinden ilan.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '💼', tags: ['iş', 'ilan', 'kariyer'], blueprint: { name: 'Job Scraper', description: 'İlan toplama', masterGoal: 'İş fırsatlarını yakala', baseKnowledge: 'Web scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'review-aggregator', name: 'Yorum Toplayıcı', description: 'Tüm platformlardan yorum.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺5,000-18,000/ay', icon: '⭐', tags: ['yorum', 'toplama', 'reputation'], blueprint: { name: 'Review Scraper', description: 'Yorum toplama', masterGoal: 'Reputation monitoring', baseKnowledge: 'Multi-platform scraping', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'event-finder', name: 'Etkinlik Bulucu', description: 'Sektör etkinliklerini tara.', category: 'scraper', difficulty: 'easy', estimatedRevenue: '₺3,000-12,000/ay', icon: '🎪', tags: ['etkinlik', 'konferans', 'networking'], blueprint: { name: 'Event Scraper', description: 'Etkinlik bulma', masterGoal: 'İş fırsatlarını kaçırma', baseKnowledge: 'Event platforms', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'scholarship-finder', name: 'Burs Bulucu', description: 'Eğitim burslarını tara.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺10,000-50,000 potansiyel', icon: '🎓', tags: ['burs', 'eğitim', 'fırsat'], blueprint: { name: 'Scholarship Bot', description: 'Burs arama', masterGoal: 'Eğitim fırsatlarını bul', baseKnowledge: 'Scholarship databases', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tender-monitor', name: 'İhale Takipçisi', description: 'Kamu ihalelerini izle.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺20,000-80,000/ay potansiyel', icon: '📋', tags: ['ihale', 'kamu', 'teklif'], blueprint: { name: 'Tender Bot', description: 'İhale takibi', masterGoal: 'İhale fırsatlarını kaçırma', baseKnowledge: 'Government procurement', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    // VİDEO (5)
    { id: 'subtitle-generator', name: 'Altyazı Üretici', description: 'Otomatik video altyazısı.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺5,000-18,000/ay', icon: '💬', tags: ['altyazı', 'video', 'AI'], blueprint: { name: 'Subtitle Bot', description: 'Altyazı üretimi', masterGoal: 'Video erişilebilirliğini artır', baseKnowledge: 'Whisper AI', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'video-cutter', name: 'Video Kesme Botu', description: 'Uzun videodan kısa klipler.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '✂️', tags: ['video', 'kesme', 'klip'], blueprint: { name: 'Video Cut', description: 'Video kesme', masterGoal: 'Shorts/Reels üretimi', baseKnowledge: 'Video editing', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'talking-head', name: 'AI Avatar Video', description: 'Dijital avatar ile video.', category: 'video', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🎭', tags: ['avatar', 'AI', 'video'], blueprint: { name: 'Avatar Video', description: 'Avatar üretimi', masterGoal: 'Ölçeklenebilir video', baseKnowledge: 'AI video generation', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'video-translator', name: 'Video Çevirmen', description: 'Video içeriğini çevir ve seslendır.', category: 'video', difficulty: 'hard', estimatedRevenue: '₺12,000-40,000/ay', icon: '🌍', tags: ['çeviri', 'video', 'seslendırme'], blueprint: { name: 'Video Translate', description: 'Video çeviri', masterGoal: 'Global pazara aç', baseKnowledge: 'Translation, TTS', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'video-repurposer', name: 'Video Format Dönüştürücü', description: 'Bir video tüm formatlara.', category: 'video', difficulty: 'easy', estimatedRevenue: '₺4,000-15,000/ay', icon: '🔄', tags: ['video', 'format', 'dönüştürme'], blueprint: { name: 'Video Repurpose', description: 'Format dönüşümü', masterGoal: 'Multi-platform yayın', baseKnowledge: 'Video processing', category: 'Video', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },

    // ============================================
    // YENİ KATEGORİ: FİNANS & YATIRIM (15)
    // ============================================
    { id: 'portfolio-tracker', name: 'Portföy Takipçisi', description: 'Hisse ve kripto portföyü izleme.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📊', tags: ['portföy', 'yatırım', 'kripto'], blueprint: { name: 'Portfolio Bot', description: 'Portföy takibi', masterGoal: 'Yatırım performansını izle', baseKnowledge: 'Financial APIs', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'dividend-tracker', name: 'Temettü Takipçisi', description: 'Temettü ödemelerini izle ve hatırlat.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺5,000-18,000/ay', icon: '💵', tags: ['temettü', 'hisse', 'gelir'], blueprint: { name: 'Dividend Bot', description: 'Temettü takibi', masterGoal: 'Pasif gelir optimizasyonu', baseKnowledge: 'Dividend calendar', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'expense-tracker', name: 'Harcama Takipçisi', description: 'Kişisel ve işletme harcamalarını izle.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '💳', tags: ['harcama', 'bütçe', 'finans'], blueprint: { name: 'Expense Bot', description: 'Harcama takibi', masterGoal: 'Bütçe kontrolü', baseKnowledge: 'Expense tracking', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'crypto-dca-bot', name: 'Kripto DCA Botu', description: 'Otomatik dollar cost averaging.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '₿', tags: ['kripto', 'DCA', 'yatırım'], blueprint: { name: 'DCA Bot', description: 'Otomatik alım', masterGoal: 'Düzenli kripto birikimi', baseKnowledge: 'Binance API', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'forex-signals', name: 'Forex Sinyal Botu', description: 'Döviz piyasası sinyalleri.', category: 'finance', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '💱', tags: ['forex', 'sinyal', 'trading'], blueprint: { name: 'Forex Bot', description: 'Forex sinyalleri', masterGoal: 'Karlı trade fırsatları', baseKnowledge: 'Forex analysis', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'stock-screener', name: 'Hisse Tarama Botu', description: 'Kriterlere göre hisse bul.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '📈', tags: ['hisse', 'tarama', 'analiz'], blueprint: { name: 'Stock Screener', description: 'Hisse tarama', masterGoal: 'Yatırım fırsatlarını bul', baseKnowledge: 'Stock APIs', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tax-calculator', name: 'Vergi Hesaplayıcı', description: 'Yatırım vergisi hesaplama.', category: 'finance', difficulty: 'hard', estimatedRevenue: '₺8,000-25,000/ay', icon: '🧾', tags: ['vergi', 'hesaplama', 'finans'], blueprint: { name: 'Tax Bot', description: 'Vergi hesabı', masterGoal: 'Vergi optimizasyonu', baseKnowledge: 'Tax regulation', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ipo-tracker', name: 'IPO Takipçisi', description: 'Yeni halka arzları izle.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺6,000-20,000/ay', icon: '🎯', tags: ['IPO', 'halka arz', 'yatırım'], blueprint: { name: 'IPO Bot', description: 'IPO takibi', masterGoal: 'İlk yatırım fırsatları', baseKnowledge: 'IPO calendar', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'earnings-alert', name: 'Bilanço Uyarı Botu', description: 'Şirket bilanço tarihleri.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺5,000-15,000/ay', icon: '📅', tags: ['bilanço', 'earnings', 'hisse'], blueprint: { name: 'Earnings Bot', description: 'Bilanço takvimi', masterGoal: 'Önemli tarihleri kaçırma', baseKnowledge: 'Earnings calendar', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'gold-tracker', name: 'Altın Fiyat Takipçisi', description: 'Altın ve değerli metal fiyatları.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '🥇', tags: ['altın', 'fiyat', 'yatırım'], blueprint: { name: 'Gold Bot', description: 'Altın takibi', masterGoal: 'Altın alım zamanlaması', baseKnowledge: 'Commodity prices', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'budget-planner', name: 'Bütçe Planlayıcı', description: 'Aylık/yıllık bütçe oluşturma.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '📋', tags: ['bütçe', 'plan', 'finans'], blueprint: { name: 'Budget Bot', description: 'Bütçe planlama', masterGoal: 'Finansal disiplin', baseKnowledge: 'Budgeting', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'loan-calculator', name: 'Kredi Hesaplayıcı', description: 'Kredi karşılaştırma ve hesaplama.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺4,000-15,000/ay', icon: '🏦', tags: ['kredi', 'hesaplama', 'banka'], blueprint: { name: 'Loan Bot', description: 'Kredi hesabı', masterGoal: 'En uygun krediyi bul', baseKnowledge: 'Loan calculations', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'whale-tracker', name: 'Whale İzleyici', description: 'Büyük kripto hareketlerini izle.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🐋', tags: ['whale', 'kripto', 'takip'], blueprint: { name: 'Whale Bot', description: 'Whale takibi', masterGoal: 'Piyasa sinyalleri yakala', baseKnowledge: 'Blockchain analysis', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'nft-tracker', name: 'NFT Fiyat Takipçisi', description: 'NFT koleksiyonlarını izle.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🎨', tags: ['NFT', 'fiyat', 'koleksiyon'], blueprint: { name: 'NFT Bot', description: 'NFT takibi', masterGoal: 'NFT fırsatlarını bul', baseKnowledge: 'NFT marketplaces', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'defi-yield', name: 'DeFi Yield Takipçisi', description: 'En yüksek DeFi getirilerini bul.', category: 'finance', difficulty: 'hard', estimatedRevenue: '₺20,000-70,000/ay', icon: '🌾', tags: ['DeFi', 'yield', 'kripto'], blueprint: { name: 'Yield Bot', description: 'DeFi analizi', masterGoal: 'Pasif kripto geliri', baseKnowledge: 'DeFi protocols', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },

    // ============================================
    // YENİ KATEGORİ: SAĞLIK & WELLNESS (10)
    // ============================================
    { id: 'appointment-reminder', name: 'Randevu Hatırlatıcı', description: 'Doktor ve sağlık randevuları.', category: 'health', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🏥', tags: ['randevu', 'sağlık', 'hatırlatma'], blueprint: { name: 'Appt Bot', description: 'Randevu hatırlatma', masterGoal: 'Sağlık takibini kolaylaştır', baseKnowledge: 'Calendar integration', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'medicine-reminder', name: 'İlaç Hatırlatıcı', description: 'Günlük ilaç dozlarını hatırlat.', category: 'health', difficulty: 'easy', estimatedRevenue: '₺2,000-8,000/ay', icon: '💊', tags: ['ilaç', 'hatırlatma', 'sağlık'], blueprint: { name: 'Medicine Bot', description: 'İlaç takibi', masterGoal: 'İlaç uyumunu artır', baseKnowledge: 'Medication tracking', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'fitness-tracker', name: 'Fitness Takipçisi', description: 'Egzersiz ve spor aktivitesi izleme.', category: 'health', difficulty: 'medium', estimatedRevenue: '₺5,000-18,000/ay', icon: '🏋️', tags: ['fitness', 'egzersiz', 'spor'], blueprint: { name: 'Fitness Bot', description: 'Aktivite takibi', masterGoal: 'Fitness hedeflerine ulaş', baseKnowledge: 'Wearable APIs', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'water-reminder', name: 'Su İçme Hatırlatıcı', description: 'Günlük su tüketimi takibi.', category: 'health', difficulty: 'easy', estimatedRevenue: '₺1,000-5,000/ay', icon: '💧', tags: ['su', 'sağlık', 'hatırlatma'], blueprint: { name: 'Water Bot', description: 'Su takibi', masterGoal: 'Hidrasyon alışkanlığı', baseKnowledge: 'Reminder systems', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'sleep-analyzer', name: 'Uyku Analizi Botu', description: 'Uyku kalitesi ve örüntü analizi.', category: 'health', difficulty: 'medium', estimatedRevenue: '₺5,000-18,000/ay', icon: '😴', tags: ['uyku', 'analiz', 'sağlık'], blueprint: { name: 'Sleep Bot', description: 'Uyku analizi', masterGoal: 'Uyku kalitesini iyileştir', baseKnowledge: 'Sleep tracking', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'meal-planner', name: 'Yemek Planlayıcı', description: 'Sağlıklı menü planlama.', category: 'health', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '🍽️', tags: ['yemek', 'diyet', 'plan'], blueprint: { name: 'Meal Bot', description: 'Menü planlama', masterGoal: 'Sağlıklı beslenme', baseKnowledge: 'Nutrition data', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'calorie-counter', name: 'Kalori Sayacı', description: 'Günlük kalori ve makro takibi.', category: 'health', difficulty: 'easy', estimatedRevenue: '₺4,000-12,000/ay', icon: '🔢', tags: ['kalori', 'diyet', 'takip'], blueprint: { name: 'Calorie Bot', description: 'Kalori takibi', masterGoal: 'Kilo kontrolü', baseKnowledge: 'Nutrition database', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'mental-wellness', name: 'Mental Wellness Botu', description: 'Mindfulness ve meditasyon rehberi.', category: 'health', difficulty: 'easy', estimatedRevenue: '₺3,000-12,000/ay', icon: '🧘', tags: ['meditasyon', 'wellness', 'zihinsel'], blueprint: { name: 'Wellness Bot', description: 'Mental sağlık', masterGoal: 'Stres yönetimi', baseKnowledge: 'Mindfulness', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'symptom-checker', name: 'Semptom Kontrol Botu', description: 'AI bazlı semptom değerlendirme.', category: 'health', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '🩺', tags: ['semptom', 'sağlık', 'AI'], blueprint: { name: 'Symptom Bot', description: 'Semptom kontrolü', masterGoal: 'İlk değerlendirme', baseKnowledge: 'Medical AI', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'habit-tracker', name: 'Alışkanlık Takipçisi', description: 'Sağlıklı alışkanlık oluşturma.', category: 'health', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '✅', tags: ['alışkanlık', 'takip', 'hedef'], blueprint: { name: 'Habit Bot', description: 'Alışkanlık takibi', masterGoal: 'Pozitif alışkanlıklar', baseKnowledge: 'Behavior science', category: 'Health', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },

    // ============================================
    // YENİ KATEGORİ: EĞİTİM & ÖĞRENME (12)
    // ============================================
    { id: 'flashcard-creator', name: 'Flashcard Oluşturucu', description: 'AI ile akıllı bilgi kartları.', category: 'education', difficulty: 'easy', estimatedRevenue: '₺4,000-15,000/ay', icon: '📚', tags: ['flashcard', 'öğrenme', 'AI'], blueprint: { name: 'Flashcard Bot', description: 'Bilgi kartları', masterGoal: 'Etkili öğrenme', baseKnowledge: 'Spaced repetition', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'quiz-generator', name: 'Quiz Üretici', description: 'Konudan otomatik soru üretme.', category: 'education', difficulty: 'medium', estimatedRevenue: '₺6,000-22,000/ay', icon: '❓', tags: ['quiz', 'soru', 'eğitim'], blueprint: { name: 'Quiz Bot', description: 'Soru üretimi', masterGoal: 'Test hazırlığı', baseKnowledge: 'Question generation', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'essay-grader', name: 'Kompozisyon Değerlendirici', description: 'AI ile yazı puanlama.', category: 'education', difficulty: 'hard', estimatedRevenue: '₺10,000-35,000/ay', icon: '📝', tags: ['kompozisyon', 'puanlama', 'AI'], blueprint: { name: 'Essay Bot', description: 'Yazı değerlendirme', masterGoal: 'Yazma becerisi geliştir', baseKnowledge: 'NLP analysis', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'vocabulary-builder', name: 'Kelime Hazinesi Botu', description: 'Günlük yeni kelime öğrenme.', category: 'education', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🔤', tags: ['kelime', 'dil', 'öğrenme'], blueprint: { name: 'Vocab Bot', description: 'Kelime öğretimi', masterGoal: 'Dil gelişimi', baseKnowledge: 'Vocabulary building', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tutor-chatbot', name: 'AI Özel Ders Chatbotu', description: 'Her konuda anında yardım.', category: 'education', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '👨‍🏫', tags: ['özel ders', 'AI', 'eğitim'], blueprint: { name: 'Tutor Bot', description: 'AI ders', masterGoal: 'Kişiselleştirilmiş öğrenme', baseKnowledge: 'Educational AI', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'note-summarizer', name: 'Not Özetleyici', description: 'Uzun metinleri özetle.', category: 'education', difficulty: 'easy', estimatedRevenue: '₺4,000-14,000/ay', icon: '📋', tags: ['özet', 'not', 'AI'], blueprint: { name: 'Summary Bot', description: 'Metin özeti', masterGoal: 'Verimli çalışma', baseKnowledge: 'Summarization', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'language-practice', name: 'Dil Pratik Botu', description: 'Konuşma ve yazma pratiği.', category: 'education', difficulty: 'medium', estimatedRevenue: '₺7,000-25,000/ay', icon: '🗣️', tags: ['dil', 'pratik', 'konuşma'], blueprint: { name: 'Practice Bot', description: 'Dil pratiği', masterGoal: 'Akıcılık geliştir', baseKnowledge: 'Language learning', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'coding-tutor', name: 'Kod Öğretici Botu', description: 'Programlama dersleri ve ödevler.', category: 'education', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '💻', tags: ['kod', 'programlama', 'eğitim'], blueprint: { name: 'Code Tutor', description: 'Kod öğretimi', masterGoal: 'Programlama becerisi', baseKnowledge: 'Programming education', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'research-assistant', name: 'Araştırma Asistanı', description: 'Akademik kaynak bulma ve özet.', category: 'education', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '🔬', tags: ['araştırma', 'akademik', 'kaynak'], blueprint: { name: 'Research Bot', description: 'Araştırma desteği', masterGoal: 'Akademik verimlilik', baseKnowledge: 'Academic search', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'study-planner', name: 'Çalışma Planlayıcı', description: 'Sınav ve ödev takvimi.', category: 'education', difficulty: 'easy', estimatedRevenue: '₺3,000-12,000/ay', icon: '📅', tags: ['plan', 'çalışma', 'takvim'], blueprint: { name: 'Study Bot', description: 'Ders planı', masterGoal: 'Organize öğrenme', baseKnowledge: 'Study planning', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'citation-generator', name: 'Kaynak Gösterme Botu', description: 'Otomatik APA/MLA kaynak formatı.', category: 'education', difficulty: 'easy', estimatedRevenue: '₺2,000-8,000/ay', icon: '📖', tags: ['kaynak', 'atıf', 'akademik'], blueprint: { name: 'Citation Bot', description: 'Kaynak formatı', masterGoal: 'Doğru atıf yapma', baseKnowledge: 'Citation formats', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'math-solver', name: 'Matematik Çözücü', description: 'Adım adım matematik çözümleri.', category: 'education', difficulty: 'hard', estimatedRevenue: '₺12,000-40,000/ay', icon: '🧮', tags: ['matematik', 'çözüm', 'AI'], blueprint: { name: 'Math Bot', description: 'Matematik çözüm', masterGoal: 'Matematik anlayışı', baseKnowledge: 'Math AI', category: 'Education', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },

    // ============================================
    // YENİ KATEGORİ: E-TİCARET (12)
    // ============================================
    { id: 'product-listing', name: 'Ürün Listeleme Botu', description: 'Multi-platform ürün yükleme.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🛒', tags: ['ürün', 'listeleme', 'eticaret'], blueprint: { name: 'Listing Bot', description: 'Ürün yükleme', masterGoal: 'Multi-platform satış', baseKnowledge: 'E-commerce APIs', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'price-sync', name: 'Fiyat Senkronizasyon', description: 'Tüm kanallarda fiyat güncelleme.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🔄', tags: ['fiyat', 'senkron', 'kanal'], blueprint: { name: 'Price Sync', description: 'Fiyat senkron', masterGoal: 'Tutarlı fiyatlandırma', baseKnowledge: 'Multi-channel', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'stock-alert', name: 'Stok Uyarı Botu', description: 'Düşük stok bildirimleri.', category: 'ecommerce', difficulty: 'easy', estimatedRevenue: '₺5,000-18,000/ay', icon: '📦', tags: ['stok', 'uyarı', 'envanter'], blueprint: { name: 'Stock Alert', description: 'Stok takibi', masterGoal: 'Stok tükenmesini önle', baseKnowledge: 'Inventory management', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'abandoned-cart', name: 'Terk Edilen Sepet Kurtarma', description: 'Sepet kurtarma otomasyonu.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '🛒', tags: ['sepet', 'kurtarma', 'satış'], blueprint: { name: 'Cart Recovery', description: 'Sepet kurtarma', masterGoal: 'Kayıp satışları kurtar', baseKnowledge: 'Cart recovery', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'review-requester', name: 'Yorum İsteme Botu', description: 'Satış sonrası yorum toplama.', category: 'ecommerce', difficulty: 'easy', estimatedRevenue: '₺6,000-22,000/ay', icon: '⭐', tags: ['yorum', 'itibar', 'satış'], blueprint: { name: 'Review Bot', description: 'Yorum toplama', masterGoal: 'Sosyal kanıt artır', baseKnowledge: 'Review automation', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'shipping-tracker', name: 'Kargo Takipçisi', description: 'Otomatik kargo bildirimleri.', category: 'ecommerce', difficulty: 'easy', estimatedRevenue: '₺4,000-15,000/ay', icon: '🚚', tags: ['kargo', 'takip', 'bildirim'], blueprint: { name: 'Ship Track', description: 'Kargo takibi', masterGoal: 'Müşteri bilgilendirme', baseKnowledge: 'Shipping APIs', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'return-processor', name: 'İade İşlem Botu', description: 'Otomatik iade ve değişim.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺7,000-25,000/ay', icon: '↩️', tags: ['iade', 'değişim', 'müşteri'], blueprint: { name: 'Return Bot', description: 'İade işlemi', masterGoal: 'İade süreçlerini hızlandır', baseKnowledge: 'Return management', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'product-recommender', name: 'Ürün Öneri Botu', description: 'AI bazlı kişisel öneriler.', category: 'ecommerce', difficulty: 'hard', estimatedRevenue: '₺20,000-65,000/ay', icon: '🎯', tags: ['öneri', 'AI', 'kişiselleştirme'], blueprint: { name: 'Recommend Bot', description: 'Ürün önerisi', masterGoal: 'Satış artışı', baseKnowledge: 'Recommendation engine', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'marketplace-sync', name: 'Pazaryeri Entegrasyonu', description: 'Trendyol, Hepsiburada, N11 senkron.', category: 'ecommerce', difficulty: 'hard', estimatedRevenue: '₺12,000-45,000/ay', icon: '🔗', tags: ['pazaryeri', 'entegrasyon', 'senkron'], blueprint: { name: 'Marketplace Sync', description: 'Pazaryeri sync', masterGoal: 'Multi-platform yönetimi', baseKnowledge: 'Marketplace APIs', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'order-notification', name: 'Sipariş Bildirim Botu', description: 'WhatsApp/SMS sipariş bildirimi.', category: 'ecommerce', difficulty: 'easy', estimatedRevenue: '₺4,000-14,000/ay', icon: '📱', tags: ['sipariş', 'bildirim', 'WhatsApp'], blueprint: { name: 'Order Notify', description: 'Sipariş bildirimi', masterGoal: 'Müşteri iletişimi', baseKnowledge: 'Messaging APIs', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'flash-sale', name: 'Flaş Kampanya Botu', description: 'Zamanlı indirim kampanyaları.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '⚡', tags: ['kampanya', 'indirim', 'satış'], blueprint: { name: 'Flash Sale', description: 'Flaş satış', masterGoal: 'Hızlı satış artışı', baseKnowledge: 'Campaign management', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'supplier-manager', name: 'Tedarikçi Yönetim Botu', description: 'Tedarikçi sipariş otomasyonu.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '🏭', tags: ['tedarikçi', 'sipariş', 'B2B'], blueprint: { name: 'Supplier Bot', description: 'Tedarikçi yönetimi', masterGoal: 'Tedarik zinciri otomasyonu', baseKnowledge: 'SCM automation', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },

    // ============================================
    // YENİ KATEGORİ: MÜŞTERİ HİZMETLERİ (10)
    // ============================================
    { id: 'ticket-auto-reply', name: 'Destek Ticket Otomatik Yanıt', description: 'İlk yanıt otomasyonu.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🎫', tags: ['ticket', 'destek', 'otomasyon'], blueprint: { name: 'Ticket Bot', description: 'Ticket yanıtı', masterGoal: 'İlk yanıt süresini kısalt', baseKnowledge: 'Help desk automation', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'sentiment-alert', name: 'Müşteri Sentiment Uyarı', description: 'Negatif müşteri algısı tespiti.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '😡', tags: ['sentiment', 'müşteri', 'uyarı'], blueprint: { name: 'Sentiment Alert', description: 'Duygu analizi', masterGoal: 'Kriz önleme', baseKnowledge: 'Sentiment analysis', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'escalation-manager', name: 'Eskalasyon Yöneticisi', description: 'Akıllı issue yönlendirme.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺7,000-25,000/ay', icon: '📈', tags: ['eskalasyon', 'destek', 'yönlendirme'], blueprint: { name: 'Escalation Bot', description: 'Eskalasyon yönetimi', masterGoal: 'Doğru kişiye hızlı ulaşım', baseKnowledge: 'Ticket routing', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'satisfaction-survey', name: 'Memnuniyet Anketi Botu', description: 'Otomatik CSAT ve feedback.', category: 'customer', difficulty: 'easy', estimatedRevenue: '₺4,000-14,000/ay', icon: '📊', tags: ['anket', 'memnuniyet', 'feedback'], blueprint: { name: 'CSAT Bot', description: 'Memnuniyet anketi', masterGoal: 'Müşteri sesi topla', baseKnowledge: 'Survey automation', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'sla-monitor', name: 'SLA İzleme Botu', description: 'Yanıt süresi SLA takibi.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺6,000-22,000/ay', icon: '⏱️', tags: ['SLA', 'takip', 'performans'], blueprint: { name: 'SLA Bot', description: 'SLA izleme', masterGoal: 'SLA ihlallerini önle', baseKnowledge: 'SLA management', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'knowledge-updater', name: 'Bilgi Tabanı Güncelleyici', description: 'AI ile FAQ ve döküman güncelleme.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '📚', tags: ['bilgi tabanı', 'FAQ', 'döküman'], blueprint: { name: 'KB Updater', description: 'Bilgi güncelleme', masterGoal: 'Self-service kalitesi', baseKnowledge: 'Knowledge management', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'refund-processor', name: 'İade Talep İşleyici', description: 'Otomatik iade onayı.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺6,000-20,000/ay', icon: '💸', tags: ['iade', 'onay', 'otomasyon'], blueprint: { name: 'Refund Bot', description: 'İade işleme', masterGoal: 'Hızlı iade çözümü', baseKnowledge: 'Refund automation', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'vip-detector', name: 'VIP Müşteri Tespit Botu', description: 'Yüksek değerli müşteri tespiti.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '👑', tags: ['VIP', 'müşteri', 'değer'], blueprint: { name: 'VIP Bot', description: 'VIP tespiti', masterGoal: 'Öncelikli müşteri hizmeti', baseKnowledge: 'Customer value analysis', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'churn-predictor', name: 'Churn Tahmin Botu', description: 'Müşteri kaybı risk analizi.', category: 'customer', difficulty: 'hard', estimatedRevenue: '₺20,000-65,000/ay', icon: '📉', tags: ['churn', 'tahmin', 'analiz'], blueprint: { name: 'Churn Bot', description: 'Churn tahmini', masterGoal: 'Proaktif müşteri koruma', baseKnowledge: 'Churn modeling', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'onboarding-helper', name: 'Müşteri Onboarding Botu', description: 'Yeni müşteri eğitim akışı.', category: 'customer', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '🎓', tags: ['onboarding', 'müşteri', 'eğitim'], blueprint: { name: 'Onboard Bot', description: 'Müşteri eğitimi', masterGoal: 'Hızlı adaptasyon', baseKnowledge: 'User onboarding', category: 'Customer', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },

    // ============================================
    // 🔥 GİZLİ HAZİNELER - Kimsenin Bilmediği Ama Çok Değerli (40)
    // ============================================
    { id: 'viral-predictor', name: 'Viral Tahmin AI', description: 'İçeriğin viral olma potansiyelini önceden tahmin et.', category: 'content', difficulty: 'hard', estimatedRevenue: '₺30,000-100,000/ay', icon: '🔮', tags: ['viral', 'AI', 'tahmin'], blueprint: { name: 'Viral AI', description: 'Viral tahmini', masterGoal: 'Hit içerik üret', baseKnowledge: 'Viral mechanics, ML', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'competitor-spy', name: 'Rakip Casusu', description: 'Rakiplerin fiyat, ürün ve kampanya değişikliklerini anlık izle.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺25,000-80,000/ay', icon: '🕵️', tags: ['rakip', 'izleme', 'strateji'], blueprint: { name: 'Spy Bot', description: 'Rakip izleme', masterGoal: 'Rekabet avantajı', baseKnowledge: 'Web scraping, alerts', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'fake-review-detector', name: 'Sahte Yorum Tespit', description: 'Rakiplerin sahte yorumlarını veya kendi ürününüzdeki sahte yorumları tespit et.', category: 'analytics', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '🎭', tags: ['sahte', 'yorum', 'tespit'], blueprint: { name: 'Fake Detect', description: 'Sahte tespit', masterGoal: 'İtibar koruma', baseKnowledge: 'NLP, pattern detection', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'price-drop-sniper', name: 'Fiyat Düşüş Avcısı', description: 'İstediğin ürünlerin fiyatı düşünce anında haber al.', category: 'scraper', difficulty: 'easy', estimatedRevenue: '₺5,000-20,000/ay', icon: '🎯', tags: ['fiyat', 'indirim', 'uyarı'], blueprint: { name: 'Price Sniper', description: 'Fiyat takibi', masterGoal: 'En iyi fiyatı yakala', baseKnowledge: 'Price monitoring', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'domain-expiry-hunter', name: 'Domain Avcısı', description: 'Değerli domainlerin süreleri dolmadan yakala.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺10,000-50,000/ay', icon: '🌐', tags: ['domain', 'süre', 'fırsat'], blueprint: { name: 'Domain Hunter', description: 'Domain takibi', masterGoal: 'Premium domain yakala', baseKnowledge: 'Whois, expiry tracking', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'grant-finder', name: 'Hibe & Destek Bulucu', description: 'KOSGEB, TÜBİTAK, AB hibeleri otomatik tara.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺50,000-500,000 potansiyel', icon: '💎', tags: ['hibe', 'destek', 'fon'], blueprint: { name: 'Grant Bot', description: 'Hibe arama', masterGoal: 'Bedava para bul', baseKnowledge: 'Grant databases', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'influencer-fake-detector', name: 'Influencer Sahte Takipçi Tespiti', description: 'Influencer seçmeden önce sahte takipçi oranını öğren.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺15,000-45,000/ay', icon: '👥', tags: ['influencer', 'sahte', 'analiz'], blueprint: { name: 'Fake Follower', description: 'Takipçi analizi', masterGoal: 'Doğru influencer seç', baseKnowledge: 'Social analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'meeting-summarizer', name: 'Toplantı Özetleyici AI', description: 'Zoom/Meet toplantılarını otomatik özetle ve aksiyon çıkar.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📝', tags: ['toplantı', 'özet', 'AI'], blueprint: { name: 'Meeting AI', description: 'Toplantı özeti', masterGoal: 'Zaman kazandır', baseKnowledge: 'Whisper AI, summarization', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'contract-analyzer', name: 'Sözleşme Analiz AI', description: 'Sözleşmelerdeki riskli maddeleri otomatik bul.', category: 'assistant', difficulty: 'hard', estimatedRevenue: '₺20,000-80,000/ay', icon: '⚖️', tags: ['sözleşme', 'hukuk', 'AI'], blueprint: { name: 'Contract AI', description: 'Sözleşme analizi', masterGoal: 'Hukuki risk azalt', baseKnowledge: 'Legal NLP', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'resume-scorer', name: 'CV Puanlama Botu', description: 'İş başvurularını otomatik skorla ve sırala.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '📄', tags: ['CV', 'HR', 'puanlama'], blueprint: { name: 'Resume Bot', description: 'CV skorlama', masterGoal: 'HR süreçlerini hızlandır', baseKnowledge: 'HR AI, matching', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'personal-brand-builder', name: 'Kişisel Marka Otomasyonu', description: 'LinkedIn/Twitter için tutarlı kişisel marka içerikleri üret.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '👤', tags: ['marka', 'kişisel', 'içerik'], blueprint: { name: 'Brand Bot', description: 'Marka içeriği', masterGoal: 'Thought leader ol', baseKnowledge: 'Personal branding', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'patent-monitor', name: 'Patent İzleyici', description: 'Sektöründeki yeni patentleri takip et.', category: 'scraper', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '📜', tags: ['patent', 'inovasyon', 'izleme'], blueprint: { name: 'Patent Bot', description: 'Patent takibi', masterGoal: 'İnovasyon haberleri', baseKnowledge: 'Patent databases', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'podcast-guest-matcher', name: 'Podcast Konuk Eşleştirici', description: 'Podcastine uygun konukları otomatik bul.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺8,000-25,000/ay', icon: '🎙️', tags: ['podcast', 'konuk', 'eşleşme'], blueprint: { name: 'Guest Match', description: 'Konuk bulma', masterGoal: 'Kaliteli konuklar', baseKnowledge: 'Podcast networking', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'cold-email-personalizer', name: 'Soğuk Email Kişiselleştirici', description: 'Her prospect için AI ile ultra-kişisel email yaz.', category: 'money-maker', difficulty: 'medium', estimatedRevenue: '₺20,000-70,000/ay', icon: '✉️', tags: ['email', 'satış', 'kişiselleştirme'], blueprint: { name: 'Cold Email AI', description: 'Email kişiselleştirme', masterGoal: 'Yanıt oranı artır', baseKnowledge: 'Sales AI, personalization', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'tiktok-trend-spotter', name: 'TikTok Trend Dedektörü', description: 'Yükselen TikTok trendlerini erkenden yakala.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺15,000-50,000/ay', icon: '📱', tags: ['TikTok', 'trend', 'viral'], blueprint: { name: 'TikTok Trends', description: 'Trend takibi', masterGoal: 'Trende erken bin', baseKnowledge: 'TikTok API, trend analysis', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'negative-pr-alert', name: 'Negatif PR Uyarı Sistemi', description: 'Markan hakkında olumsuz haber çıkınca anında haber al.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺12,000-40,000/ay', icon: '🚨', tags: ['PR', 'kriz', 'uyarı'], blueprint: { name: 'PR Alert', description: 'PR izleme', masterGoal: 'Kriz yönetimi', baseKnowledge: 'Media monitoring', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'app-store-responder', name: 'App Store Yorum Yanıtlayıcı', description: 'iOS/Android uygulama yorumlarına AI ile yanıt ver.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '📲', tags: ['app', 'yorum', 'yanıt'], blueprint: { name: 'App Review Bot', description: 'Uygulama yorum yanıtı', masterGoal: 'App Store rating artır', baseKnowledge: 'App store APIs', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'amazon-review-responder', name: 'Amazon Yorum Yanıtlayıcı', description: 'Amazon satıcı yorumlarına profesyonel yanıt.', category: 'ecommerce', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📦', tags: ['Amazon', 'yorum', 'satıcı'], blueprint: { name: 'Amazon Review', description: 'Amazon yorum yanıtı', masterGoal: 'Satıcı puanı artır', baseKnowledge: 'Amazon seller API', category: 'E-commerce', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ugc-collector', name: 'UGC İçerik Toplayıcı', description: 'Müşterilerin paylaştığı içerikleri otomatik topla.', category: 'content', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '📸', tags: ['UGC', 'içerik', 'toplama'], blueprint: { name: 'UGC Bot', description: 'UGC toplama', masterGoal: 'Sosyal kanıt artır', baseKnowledge: 'Social listening', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'testimonial-collector', name: 'Müşteri Referans Toplayıcı', description: 'Mutlu müşterilerden otomatik referans/video iste.', category: 'money-maker', difficulty: 'easy', estimatedRevenue: '₺8,000-25,000/ay', icon: '⭐', tags: ['referans', 'müşteri', 'video'], blueprint: { name: 'Testimonial Bot', description: 'Referans toplama', masterGoal: 'Güven artır', baseKnowledge: 'Customer success', category: 'Money-Maker', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'best-posting-time', name: 'En İyi Paylaşım Zamanı', description: 'Her platform için optimal paylaşım saatini bul.', category: 'analytics', difficulty: 'medium', estimatedRevenue: '₺6,000-22,000/ay', icon: '⏰', tags: ['zamanlama', 'sosyal', 'analiz'], blueprint: { name: 'Best Time Bot', description: 'Zaman analizi', masterGoal: 'Reach maksimize et', baseKnowledge: 'Social analytics', category: 'Analytics', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'hashtag-optimizer', name: 'Hashtag Optimizasyonu', description: 'Her post için en etkili hashtag kombinasyonunu bul.', category: 'content', difficulty: 'easy', estimatedRevenue: '₺5,000-18,000/ay', icon: '#️⃣', tags: ['hashtag', 'sosyal', 'optimizasyon'], blueprint: { name: 'Hashtag Bot', description: 'Hashtag optimizasyonu', masterGoal: 'Keşfet görünürlüğü', baseKnowledge: 'Hashtag analytics', category: 'Content', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ssl-monitor', name: 'SSL Sertifika İzleyici', description: 'SSL süresi dolmadan uyar, SEO cezasından koru.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-10,000/ay', icon: '🔒', tags: ['SSL', 'güvenlik', 'izleme'], blueprint: { name: 'SSL Bot', description: 'SSL takibi', masterGoal: 'Site güvenliği', baseKnowledge: 'SSL monitoring', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'uptime-checker', name: 'Site Uptime İzleyici', description: 'Siten çökünce saniyeler içinde haber al.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺4,000-15,000/ay', icon: '📡', tags: ['uptime', 'izleme', 'uyarı'], blueprint: { name: 'Uptime Bot', description: 'Uptime takibi', masterGoal: 'Downtime minimize et', baseKnowledge: 'Server monitoring', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'security-scanner', name: 'Güvenlik Açığı Tarayıcı', description: 'Websitendeki güvenlik açıklarını otomatik tara.', category: 'assistant', difficulty: 'hard', estimatedRevenue: '₺15,000-50,000/ay', icon: '🛡️', tags: ['güvenlik', 'tarama', 'vulnerability'], blueprint: { name: 'Security Bot', description: 'Güvenlik taraması', masterGoal: 'Hack önle', baseKnowledge: 'Security scanning', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'gdpr-checker', name: 'GDPR/KVKK Uyumluluk', description: 'Sitenin KVKK uyumluluğunu kontrol et.', category: 'assistant', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '📋', tags: ['GDPR', 'KVKK', 'uyumluluk'], blueprint: { name: 'GDPR Bot', description: 'Uyumluluk kontrolü', masterGoal: 'Ceza önle', baseKnowledge: 'Privacy regulations', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'receipt-scanner', name: 'Fiş/Fatura Tarayıcı', description: 'Fotoğraftan fiş bilgilerini otomatik çıkar.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺8,000-28,000/ay', icon: '🧾', tags: ['fiş', 'fatura', 'OCR'], blueprint: { name: 'Receipt Bot', description: 'Fiş okuma', masterGoal: 'Manuel girişi azalt', baseKnowledge: 'OCR, document AI', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'bank-statement-parser', name: 'Banka Ekstresi Ayrıştırıcı', description: 'PDF ekstreleri otomatik kategorize et.', category: 'finance', difficulty: 'medium', estimatedRevenue: '₺10,000-35,000/ay', icon: '🏦', tags: ['banka', 'ekstre', 'kategorize'], blueprint: { name: 'Statement Bot', description: 'Ekstre analizi', masterGoal: 'Finansal görünürlük', baseKnowledge: 'PDF parsing, categorization', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'subscription-tracker', name: 'Abonelik Takipçisi', description: 'Tüm dijital aboneliklerini tek yerden izle.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺4,000-15,000/ay', icon: '📆', tags: ['abonelik', 'takip', 'tasarruf'], blueprint: { name: 'Sub Tracker', description: 'Abonelik takibi', masterGoal: 'Gereksiz harcamayı kes', baseKnowledge: 'Subscription management', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'flight-price-alert', name: 'Uçak Bileti Fiyat Alarmı', description: 'İstediğin rotada fiyat düşünce haber al.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺6,000-25,000/ay', icon: '✈️', tags: ['uçak', 'fiyat', 'seyahat'], blueprint: { name: 'Flight Alert', description: 'Uçuş fiyat takibi', masterGoal: 'Ucuz bilet yakala', baseKnowledge: 'Flight APIs', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'hotel-deal-finder', name: 'Otel Fırsat Bulucu', description: 'Gizli otel indirimlerini ve son dakika fırsatlarını bul.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺8,000-30,000/ay', icon: '🏨', tags: ['otel', 'indirim', 'seyahat'], blueprint: { name: 'Hotel Bot', description: 'Otel fırsatları', masterGoal: 'Konaklama tasarrufu', baseKnowledge: 'Hotel APIs', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'restaurant-reservation', name: 'Restoran Rezervasyon Avcısı', description: 'Dolu restoranlar için iptal olunca anında yakala.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺5,000-20,000/ay', icon: '🍽️', tags: ['restoran', 'rezervasyon', 'iptal'], blueprint: { name: 'Resy Bot', description: 'Rezervasyon yakalama', masterGoal: 'İmkansız rezervasyonu al', baseKnowledge: 'Restaurant APIs', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'concert-ticket-alert', name: 'Konser Bileti Uyarı', description: 'İstediğin sanatçının bileti satışa çıkınca ilk sen al.', category: 'scraper', difficulty: 'medium', estimatedRevenue: '₺5,000-20,000/ay', icon: '🎫', tags: ['konser', 'bilet', 'uyarı'], blueprint: { name: 'Ticket Bot', description: 'Bilet takibi', masterGoal: 'Sold out önce al', baseKnowledge: 'Ticket platforms', category: 'Scraper', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'car-maintenance-reminder', name: 'Araç Bakım Hatırlatıcı', description: 'Yağ, lastik, muayene tarihlerini takip et.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,000-8,000/ay', icon: '🚗', tags: ['araç', 'bakım', 'hatırlatma'], blueprint: { name: 'Car Bot', description: 'Araç bakımı', masterGoal: 'Bakım kaçırma', baseKnowledge: 'Vehicle maintenance', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'insurance-renewal-alert', name: 'Sigorta Yenileme Uyarısı', description: 'Sigorta süreleri dolmadan karşılaştırmalı fiyat al.', category: 'finance', difficulty: 'easy', estimatedRevenue: '₺5,000-20,000/ay', icon: '🛡️', tags: ['sigorta', 'yenileme', 'karşılaştırma'], blueprint: { name: 'Insurance Bot', description: 'Sigorta takibi', masterGoal: 'En iyi fiyat', baseKnowledge: 'Insurance APIs', category: 'Finance', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'ev-charging-finder', name: 'Elektrikli Araç Şarj Bulucu', description: 'En yakın boş şarj istasyonunu bul.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-12,000/ay', icon: '⚡', tags: ['EV', 'şarj', 'istasyon'], blueprint: { name: 'EV Charger', description: 'Şarj bulucu', masterGoal: 'Şarj stresi azalt', baseKnowledge: 'EV charging APIs', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'gas-price-optimizer', name: 'Benzin Fiyat Optimizasyonu', description: 'Çevrende en ucuz benzin istasyonunu bul.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺2,000-8,000/ay', icon: '⛽', tags: ['benzin', 'fiyat', 'tasarruf'], blueprint: { name: 'Gas Bot', description: 'Benzin fiyatı', masterGoal: 'Yakıt tasarrufu', baseKnowledge: 'Fuel price APIs', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } },
    { id: 'wine-pairing-advisor', name: 'Şarap Eşleştirme Danışmanı', description: 'Yemeğe göre mükemmel şarap önerisi.', category: 'assistant', difficulty: 'easy', estimatedRevenue: '₺3,000-12,000/ay', icon: '🍷', tags: ['şarap', 'yemek', 'öneri'], blueprint: { name: 'Wine Bot', description: 'Şarap önerisi', masterGoal: 'Mükemmel eşleşme', baseKnowledge: 'Wine pairing', category: 'Assistant', version: 1, testConfig: { variables: [], simulateFailures: false }, nodes: [] } }
];

// ============================================
// KATEGORI BILGILERI - GENİŞLETİLMİŞ
// ============================================

export const TEMPLATE_CATEGORIES = {
    'money-maker': { name: 'Para Kazandıran', icon: '💰', color: 'emerald' },
    'assistant': { name: 'Asistan Botlar', icon: '🤖', color: 'blue' },
    'scraper': { name: 'Veri Toplama', icon: '🕷️', color: 'purple' },
    'content': { name: 'İçerik Üretimi', icon: '🎨', color: 'pink' },
    'analytics': { name: 'Analiz & Rapor', icon: '📊', color: 'amber' },
    'video': { name: 'Video Üretimi (OVI)', icon: '🎬', color: 'red' },
    'finance': { name: 'Finans & Yatırım', icon: '📈', color: 'green' },
    'health': { name: 'Sağlık & Wellness', icon: '🏥', color: 'teal' },
    'education': { name: 'Eğitim & Öğrenme', icon: '📚', color: 'indigo' },
    'ecommerce': { name: 'E-Ticaret', icon: '🛒', color: 'orange' },
    'customer': { name: 'Müşteri Hizmetleri', icon: '🎫', color: 'cyan' }
};

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

export const getTemplateById = (id: string): AutomationTemplate | undefined => {
    return AUTOMATION_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: string): AutomationTemplate[] => {
    return AUTOMATION_TEMPLATES.filter(t => t.category === category);
};

export const searchTemplates = (query: string): AutomationTemplate[] => {
    const lowerQuery = query.toLowerCase();
    return AUTOMATION_TEMPLATES.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
};

export const createBlueprintFromTemplate = (template: AutomationTemplate): SystemBlueprint => {
    return {
        id: crypto.randomUUID(),
        ...template.blueprint
    };
};
