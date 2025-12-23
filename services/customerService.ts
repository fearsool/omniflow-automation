// ============================================
// CUSTOMER & MULTI-TENANT MANAGEMENT SERVICE
// Otomasyon satışı ve müşteri yönetimi
// ============================================

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    industry?: string;
    plan: 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    subscriptionStart: number;
    subscriptionEnd?: number;
    monthlyFee: number;
    automations: string[]; // automation IDs
    customConfig: CustomerConfig;
    createdAt: number;
    lastActive?: number;
}

export interface CustomerConfig {
    // Marka ayarları
    brandName: string;
    brandLogo?: string;
    brandColors?: {
        primary: string;
        secondary: string;
    };

    // Platform bağlantıları
    instagram?: {
        username: string;
        accessToken?: string;
    };
    telegram?: {
        botToken: string;
        chatId?: string;
    };
    whatsapp?: {
        phoneNumber: string;
        apiKey?: string;
    };
    email?: {
        address: string;
        smtpConfig?: any;
    };

    // İçerik ayarları
    contentTone: 'professional' | 'friendly' | 'casual' | 'formal';
    language: 'tr' | 'en';
    targetAudience?: string;
    keywords?: string[];
    hashtags?: string[];

    // Zamanlama
    timezone: string;
    workingHours?: { start: number; end: number };
    postSchedule?: string[]; // cron expressions
}

// ============================================
// SATILIK OTOMASYON ŞABLONLARI
// ============================================

export interface SellableTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    previewImage?: string;

    // Fiyatlandırma
    pricing: {
        oneTime?: number; // Tek seferlik satış
        monthly?: number; // Aylık abonelik
        setupFee?: number; // Kurulum ücreti
        currency: 'TRY' | 'USD' | 'EUR';
    };

    // Özellikler
    features: string[];
    requirements: string[];

    // Kişiselleştirilebilir alanlar
    customizableFields: CustomizableField[];

    // Blueprint şablonu
    blueprintTemplate: any;

    // İstatistikler
    soldCount: number;
    rating: number;
    reviews: number;
}

export interface CustomizableField {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'select' | 'number' | 'boolean' | 'color' | 'image' | 'api_key';
    required: boolean;
    defaultValue?: any;
    options?: { value: string; label: string }[];
    placeholder?: string;
    helpText?: string;
}

// ============================================
// HAZIR SATILIK ŞABLONLAR
// ============================================

export const SELLABLE_TEMPLATES: SellableTemplate[] = [
    {
        id: 'instagram-content-factory',
        name: 'Instagram İçerik Fabrikası',
        description: 'Her gün otomatik post, story ve reels içeriği üretir. AI ile trend analizi, görsel önerileri ve SEO caption yazımı.',
        category: 'Sosyal Medya',
        pricing: {
            oneTime: 2500,
            monthly: 500,
            setupFee: 1000,
            currency: 'TRY'
        },
        features: [
            '📱 Günlük 2 post + 3 story içeriği',
            '🔥 Trend konu araştırması',
            '✍️ AI ile caption yazımı',
            '#️⃣ Otomatik hashtag önerisi',
            '🖼️ Görsel brief oluşturma',
            '📊 Performans analizi',
            '⏰ Zamanlama önerileri'
        ],
        requirements: [
            'Instagram Business hesabı',
            'İnternet bağlantısı'
        ],
        customizableFields: [
            { id: 'brandName', name: 'brandName', label: 'Marka/İşletme Adı', type: 'text', required: true, placeholder: 'Örn: Beauty Studio' },
            {
                id: 'industry', name: 'industry', label: 'Sektör', type: 'select', required: true, options: [
                    { value: 'beauty', label: 'Güzellik/Kuaför' },
                    { value: 'restaurant', label: 'Restoran/Kafe' },
                    { value: 'fitness', label: 'Spor/Fitness' },
                    { value: 'fashion', label: 'Moda/Giyim' },
                    { value: 'realestate', label: 'Emlak' },
                    { value: 'other', label: 'Diğer' }
                ]
            },
            { id: 'targetAudience', name: 'targetAudience', label: 'Hedef Kitle', type: 'text', required: true, placeholder: '25-45 yaş kadınlar, İstanbul' },
            {
                id: 'contentTone', name: 'contentTone', label: 'İçerik Tonu', type: 'select', required: true, options: [
                    { value: 'professional', label: 'Profesyonel' },
                    { value: 'friendly', label: 'Samimi' },
                    { value: 'casual', label: 'Rahat/Günlük' },
                    { value: 'luxury', label: 'Lüks/Premium' }
                ]
            },
            { id: 'primaryColor', name: 'primaryColor', label: 'Marka Rengi', type: 'color', required: false, defaultValue: '#6366f1' },
            { id: 'postFrequency', name: 'postFrequency', label: 'Günlük Post Sayısı', type: 'number', required: true, defaultValue: 2 },
            { id: 'keywords', name: 'keywords', label: 'Anahtar Kelimeler', type: 'text', required: false, placeholder: 'saç bakımı, güzellik, moda' }
        ],
        blueprintTemplate: {
            nodes: [
                { type: 'researcher', title: 'Trend Araştırmacı' },
                { type: 'planner', title: 'İçerik Planlayıcı' },
                { type: 'creator', title: 'Görsel Direktör' },
                { type: 'writer', title: 'Copywriter' },
                { type: 'analyst', title: 'Performans Analist' }
            ]
        },
        soldCount: 47,
        rating: 4.8,
        reviews: 23
    },
    {
        id: 'ai-customer-support',
        name: 'AI Müşteri Destek Botu',
        description: '7/24 otomatik müşteri yanıtlama, SSS cevaplama ve bilet yönlendirme. Telegram veya web chat desteği.',
        category: 'Müşteri Hizmetleri',
        pricing: {
            oneTime: 5000,
            monthly: 1000,
            setupFee: 2000,
            currency: 'TRY'
        },
        features: [
            '🤖 7/24 otomatik yanıt',
            '❓ SSS veritabanı',
            '🎫 Bilet oluşturma',
            '📞 İnsan operatöre yönlendirme',
            '📊 Müşteri memnuniyet analizi',
            '💬 Çoklu dil desteği',
            '🔗 CRM entegrasyonu'
        ],
        requirements: [
            'Telegram Bot Token (ücretsiz)',
            'SSS listesi'
        ],
        customizableFields: [
            { id: 'brandName', name: 'brandName', label: 'İşletme Adı', type: 'text', required: true },
            { id: 'telegramToken', name: 'telegramToken', label: 'Telegram Bot Token', type: 'api_key', required: true, helpText: '@BotFather ile oluşturun' },
            { id: 'welcomeMessage', name: 'welcomeMessage', label: 'Karşılama Mesajı', type: 'text', required: true, defaultValue: 'Merhaba! Size nasıl yardımcı olabilirim?' },
            { id: 'faqTopics', name: 'faqTopics', label: 'SSS Konuları', type: 'text', required: true, placeholder: 'fiyat, çalışma saatleri, randevu' },
            { id: 'humanHandoff', name: 'humanHandoff', label: 'İnsan Operatöre Aktar', type: 'boolean', required: false, defaultValue: true },
            {
                id: 'language', name: 'language', label: 'Dil', type: 'select', required: true, options: [
                    { value: 'tr', label: 'Türkçe' },
                    { value: 'en', label: 'İngilizce' }
                ]
            }
        ],
        blueprintTemplate: {
            nodes: [
                { type: 'receiver', title: 'Mesaj Alıcı' },
                { type: 'classifier', title: 'Intent Sınıflandırıcı' },
                { type: 'responder', title: 'AI Yanıtlayıcı' },
                { type: 'escalator', title: 'Eskalasyon Yöneticisi' },
                { type: 'logger', title: 'Log Kaydedici' }
            ]
        },
        soldCount: 32,
        rating: 4.9,
        reviews: 18
    },
    {
        id: 'lead-generator-pro',
        name: 'Lead Generator Pro',
        description: 'LinkedIn ve websitelerden potansiyel müşteri bulma, email zenginleştirme ve CRM entegrasyonu.',
        category: 'Satış',
        pricing: {
            oneTime: 7500,
            monthly: 1500,
            setupFee: 2500,
            currency: 'TRY'
        },
        features: [
            '🔍 LinkedIn/Web scraping',
            '📧 Email bulma ve doğrulama',
            '📊 Lead skorlama',
            '🔄 CRM senkronizasyonu',
            '📈 Conversion tracking',
            '🎯 Hedef şirket filtreleme',
            '📩 Otomatik outreach'
        ],
        requirements: [
            'Hedef sektör/şirket listesi',
            'CRM hesabı (opsiyonel)'
        ],
        customizableFields: [
            { id: 'targetIndustry', name: 'targetIndustry', label: 'Hedef Sektör', type: 'text', required: true, placeholder: 'Yazılım, E-ticaret, Finans' },
            {
                id: 'targetCompanySize', name: 'targetCompanySize', label: 'Şirket Büyüklüğü', type: 'select', required: true, options: [
                    { value: 'startup', label: '1-10 çalışan' },
                    { value: 'small', label: '11-50 çalışan' },
                    { value: 'medium', label: '51-200 çalışan' },
                    { value: 'large', label: '200+ çalışan' }
                ]
            },
            { id: 'targetLocation', name: 'targetLocation', label: 'Lokasyon', type: 'text', required: true, defaultValue: 'İstanbul, Türkiye' },
            { id: 'leadCount', name: 'leadCount', label: 'Günlük Lead Hedefi', type: 'number', required: true, defaultValue: 50 },
            { id: 'emailDomain', name: 'emailDomain', label: 'Email Domain', type: 'text', required: false, placeholder: '@sirketiniz.com' }
        ],
        blueprintTemplate: {
            nodes: [
                { type: 'scraper', title: 'Web Scraper' },
                { type: 'enricher', title: 'Data Enricher' },
                { type: 'scorer', title: 'Lead Scorer' },
                { type: 'exporter', title: 'CRM Exporter' }
            ]
        },
        soldCount: 28,
        rating: 4.7,
        reviews: 15
    },
    {
        id: 'crypto-signal-bot',
        name: 'Kripto Sinyal Botu',
        description: 'Teknik analiz ile al/sat sinyalleri, Telegram bildirimleri ve portföy takibi.',
        category: 'Finans',
        pricing: {
            oneTime: 10000,
            monthly: 2000,
            setupFee: 3000,
            currency: 'TRY'
        },
        features: [
            '📊 Teknik analiz (RSI, MACD, BB)',
            '🔔 Anlık sinyal bildirimi',
            '💰 Portföy takibi',
            '📈 Performans raporları',
            '⚠️ Risk yönetimi',
            '🤖 Otomatik trade (opsiyonel)',
            '📱 Telegram entegrasyonu'
        ],
        requirements: [
            'Telegram Bot Token',
            'Binance/Exchange API (opsiyonel)'
        ],
        customizableFields: [
            { id: 'telegramToken', name: 'telegramToken', label: 'Telegram Bot Token', type: 'api_key', required: true },
            { id: 'telegramChatId', name: 'telegramChatId', label: 'Telegram Chat ID', type: 'text', required: true },
            { id: 'coins', name: 'coins', label: 'Takip Edilecek Coinler', type: 'text', required: true, defaultValue: 'BTC, ETH, BNB, SOL' },
            {
                id: 'riskLevel', name: 'riskLevel', label: 'Risk Seviyesi', type: 'select', required: true, options: [
                    { value: 'low', label: 'Düşük Risk' },
                    { value: 'medium', label: 'Orta Risk' },
                    { value: 'high', label: 'Yüksek Risk' }
                ]
            },
            {
                id: 'signalFrequency', name: 'signalFrequency', label: 'Sinyal Sıklığı', type: 'select', required: true, options: [
                    { value: 'hourly', label: 'Saatlik' },
                    { value: 'daily', label: 'Günlük' },
                    { value: 'realtime', label: 'Anlık' }
                ]
            }
        ],
        blueprintTemplate: {
            nodes: [
                { type: 'fetcher', title: 'Market Data Fetcher' },
                { type: 'analyzer', title: 'Teknik Analizci' },
                { type: 'signaler', title: 'Sinyal Üretici' },
                { type: 'notifier', title: 'Telegram Notifier' }
            ]
        },
        soldCount: 65,
        rating: 4.6,
        reviews: 42
    },
    {
        id: 'appointment-bot',
        name: 'Randevu Yönetim Botu',
        description: 'Telegram/WhatsApp üzerinden randevu alma, hatırlatma ve takvim yönetimi.',
        category: 'Müşteri Hizmetleri',
        pricing: {
            oneTime: 3000,
            monthly: 600,
            setupFee: 1000,
            currency: 'TRY'
        },
        features: [
            '📅 Online randevu alma',
            '⏰ Otomatik hatırlatma',
            '🔄 Randevu değiştirme/iptal',
            '📱 Telegram/WhatsApp desteği',
            '📊 Doluluk raporu',
            '🗓️ Google Calendar sync',
            '💬 Müşteri mesajlaşma'
        ],
        requirements: [
            'Telegram Bot Token',
            'Çalışma saatleri bilgisi'
        ],
        customizableFields: [
            { id: 'businessName', name: 'businessName', label: 'İşletme Adı', type: 'text', required: true },
            { id: 'telegramToken', name: 'telegramToken', label: 'Telegram Bot Token', type: 'api_key', required: true },
            { id: 'services', name: 'services', label: 'Hizmetler', type: 'text', required: true, placeholder: 'Saç kesimi - 30dk, Boyama - 2saat' },
            { id: 'workingHours', name: 'workingHours', label: 'Çalışma Saatleri', type: 'text', required: true, defaultValue: '09:00-19:00' },
            { id: 'workingDays', name: 'workingDays', label: 'Çalışma Günleri', type: 'text', required: true, defaultValue: 'Pazartesi-Cumartesi' },
            { id: 'reminderBefore', name: 'reminderBefore', label: 'Hatırlatma (saat önce)', type: 'number', required: true, defaultValue: 24 }
        ],
        blueprintTemplate: {
            nodes: [
                { type: 'receiver', title: 'Mesaj Alıcı' },
                { type: 'scheduler', title: 'Randevu Planlayıcı' },
                { type: 'reminder', title: 'Hatırlatıcı' },
                { type: 'notifier', title: 'Bildirim Gönderici' }
            ]
        },
        soldCount: 89,
        rating: 4.9,
        reviews: 56
    }
];

// ============================================
// MÜŞTERİ YÖNETİM FONKSİYONLARI
// ============================================

const CUSTOMERS_KEY = 'omniflow_customers';

export const saveCustomer = (customer: Customer): void => {
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);

    if (index >= 0) {
        customers[index] = customer;
    } else {
        customers.push(customer);
    }

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const getCustomers = (): Customer[] => {
    const stored = localStorage.getItem(CUSTOMERS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const getCustomerById = (id: string): Customer | undefined => {
    return getCustomers().find(c => c.id === id);
};

export const deleteCustomer = (id: string): void => {
    const customers = getCustomers().filter(c => c.id !== id);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const createCustomer = (
    name: string,
    email: string,
    plan: Customer['plan'],
    config: CustomerConfig
): Customer => {
    const customer: Customer = {
        id: crypto.randomUUID(),
        name,
        email,
        plan,
        status: 'trial',
        subscriptionStart: Date.now(),
        monthlyFee: plan === 'starter' ? 500 : plan === 'professional' ? 1000 : 2500,
        automations: [],
        customConfig: config,
        createdAt: Date.now()
    };

    saveCustomer(customer);
    return customer;
};

// ============================================
// ŞABLON SATIŞ FONKSİYONLARI
// ============================================

export const getTemplateById = (id: string): SellableTemplate | undefined => {
    return SELLABLE_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: string): SellableTemplate[] => {
    return SELLABLE_TEMPLATES.filter(t => t.category === category);
};

export const getBestSellingTemplates = (limit: number = 5): SellableTemplate[] => {
    return [...SELLABLE_TEMPLATES]
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, limit);
};

export const getHighestRatedTemplates = (limit: number = 5): SellableTemplate[] => {
    return [...SELLABLE_TEMPLATES]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
};

// Müşteri için şablon kişiselleştir
export const customizeTemplateForCustomer = (
    template: SellableTemplate,
    customerConfig: Record<string, any>
): any => {
    const blueprint = JSON.parse(JSON.stringify(template.blueprintTemplate));

    // Config değerlerini blueprint'e uygula
    blueprint.customerConfig = customerConfig;
    blueprint.name = `${customerConfig.brandName || 'Custom'} - ${template.name}`;

    return blueprint;
};

// ============================================
// GELİR HESAPLAMA
// ============================================

export interface RevenueStats {
    totalOneTime: number;
    totalMonthly: number;
    totalSetupFees: number;
    totalRevenue: number;
    activeSubscriptions: number;
    averageRevenue: number;
}

export const calculateRevenue = (customers: Customer[]): RevenueStats => {
    const activeCustomers = customers.filter(c => c.status === 'active');

    const totalMonthly = activeCustomers.reduce((sum, c) => sum + c.monthlyFee, 0);
    const totalOneTime = customers.length * 2500; // Ortalama tek seferlik satış
    const totalSetupFees = customers.length * 1000; // Ortalama kurulum ücreti

    return {
        totalOneTime,
        totalMonthly,
        totalSetupFees,
        totalRevenue: totalOneTime + totalSetupFees + (totalMonthly * 12),
        activeSubscriptions: activeCustomers.length,
        averageRevenue: customers.length > 0 ? (totalOneTime + totalSetupFees + totalMonthly) / customers.length : 0
    };
};

export default {
    SELLABLE_TEMPLATES,
    saveCustomer,
    getCustomers,
    getCustomerById,
    deleteCustomer,
    createCustomer,
    getTemplateById,
    getTemplatesByCategory,
    getBestSellingTemplates,
    getHighestRatedTemplates,
    customizeTemplateForCustomer,
    calculateRevenue
};
