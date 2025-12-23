
import { SystemBlueprint, WorkflowNode, NodeType, StepStatus } from '../types';

// ============================================
// TEMPLATE SERVICE - Hazır Otomasyon Şablonları
// ============================================

export interface AutomationTemplate {
    id: string;
    name: string;
    description: string;
    category: 'money-maker' | 'assistant' | 'scraper' | 'content' | 'analytics';
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedRevenue: string;
    icon: string;
    tags: string[];
    blueprint: Omit<SystemBlueprint, 'id'>;
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
                { id: 'wa-4', type: NodeType.CONTENT_CREATOR, title: 'AI Yanıt Üretici', role: 'Gemini AI', task: 'Bağlamsal ve nazik yanıt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'wa-6' }] },
                { id: 'wa-5', type: NodeType.HUMAN_APPROVAL, title: 'İnsan Bildirimi', role: 'Slack/Email', task: 'Destek ekibine bildirim gönder', status: StepStatus.IDLE, connections: [{ targetId: 'wa-6' }] },
                { id: 'wa-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mesaj Gönderici', role: 'WhatsApp API', task: 'Yanıtı müşteriye gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
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
                { id: 'ar-3', type: NodeType.ANALYST_CRITIC, title: 'AI Yorumcu', role: 'Gemini', task: 'Trendleri ve anomalileri analiz et', status: StepStatus.IDLE, connections: [{ targetId: 'ar-4' }] },
                { id: 'ar-4', type: NodeType.CONTENT_CREATOR, title: 'Rapor Yazıcı', role: 'Sunum', task: 'Yönetici özeti ve öneriler oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'ar-5' }] },
                { id: 'ar-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Rapor Dağıtımı', role: 'Email/Slack', task: 'PDF raporu ilgili kişilere gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-arbitrage-bot',
        name: 'Kripto Arbitraj Dedektörü',
        description: 'Borsalar arası fiyat farklarını anlık takip eder, arbitraj fırsatı bulduğunda bildirim gönderir.',
        category: 'money-maker',
        difficulty: 'hard',
        estimatedRevenue: '₺5,000-100,000/ay',
        icon: '💰',
        tags: ['kripto', 'arbitraj', 'trading', 'finans'],
        blueprint: {
            name: 'Kripto Arbitraj Bot',
            description: 'Borsalar arası fiyat farkı takibi',
            masterGoal: 'Karlı arbitraj fırsatlarını bul',
            baseKnowledge: 'Kripto borsaları, API entegrasyonları, işlem ücretleri',
            category: 'Money-Maker',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ca-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Borsa Bağlantıları', role: 'API', task: 'Binance, Coinbase, Kraken fiyatlarını çek', status: StepStatus.IDLE, connections: [{ targetId: 'ca-2' }] },
                { id: 'ca-2', type: NodeType.TRADING_DESK, title: 'Fiyat Karşılaştırıcı', role: 'Hesaplama', task: 'Aynı coin için tüm borsaları karşılaştır', status: StepStatus.IDLE, connections: [{ targetId: 'ca-3' }] },
                { id: 'ca-3', type: NodeType.LOGIC_GATE, title: 'Karlılık Filtresi', role: 'Karar', task: 'İşlem ücretleri dahil kar %1+ mı?', status: StepStatus.IDLE, connections: [{ targetId: 'ca-4' }] },
                { id: 'ca-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Acil Bildirim', role: 'Push/SMS', task: 'Fırsat detaylarını anında gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// KATEGORI BILGILERI
// ============================================

export const TEMPLATE_CATEGORIES = {
    'money-maker': { name: 'Para Kazandıran', icon: '💰', color: 'emerald' },
    'assistant': { name: 'Asistan Botlar', icon: '🤖', color: 'blue' },
    'scraper': { name: 'Veri Toplama', icon: '🕷️', color: 'purple' },
    'content': { name: 'İçerik Üretimi', icon: '🎨', color: 'pink' },
    'analytics': { name: 'Analiz & Rapor', icon: '📊', color: 'amber' }
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
