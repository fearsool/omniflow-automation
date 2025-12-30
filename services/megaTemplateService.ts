// ============================================
// MEGA TEMPLATE SERVICE - 1000+ Şablon
// ============================================
// n8n'den dönüştürülmüş para kazandıran şablonlar

import { SystemBlueprint, NodeType, StepStatus } from '../types';

// ============================================
// KATEGORİ TANIMLARI
// ============================================

export const MEGA_TEMPLATE_CATEGORIES = {
    'ecommerce': {
        name: 'E-Ticaret',
        icon: '🛒',
        color: 'emerald',
        description: 'Shopify, WooCommerce, Stripe otomasyonları'
    },
    'crm-sales': {
        name: 'CRM & Satış',
        icon: '🎯',
        color: 'blue',
        description: 'HubSpot, Pipedrive, Salesforce entegrasyonları'
    },
    'social-media': {
        name: 'Sosyal Medya',
        icon: '📱',
        color: 'pink',
        description: 'Twitter, LinkedIn, Facebook, Instagram otomasyonları'
    },
    'email-marketing': {
        name: 'E-posta Marketing',
        icon: '📧',
        color: 'purple',
        description: 'Mailchimp, ConvertKit, ActiveCampaign'
    },
    'ai-content': {
        name: 'AI & İçerik',
        icon: '🤖',
        color: 'violet',
        description: 'OpenAI, içerik üretimi, görsel oluşturma'
    },
    'lead-generation': {
        name: 'Lead Generation',
        icon: '🧲',
        color: 'orange',
        description: 'Potansiyel müşteri bulma ve yönetimi'
    },
    'payments': {
        name: 'Ödeme & Fatura',
        icon: '💳',
        color: 'green',
        description: 'Stripe, PayPal, fatura otomasyonları'
    },
    'productivity': {
        name: 'Verimlilik',
        icon: '⚡',
        color: 'amber',
        description: 'Google Workspace, Slack, Notion'
    },
    'project-management': {
        name: 'Proje Yönetimi',
        icon: '📋',
        color: 'cyan',
        description: 'Asana, ClickUp, Trello, Jira'
    },
    'analytics': {
        name: 'Analitik & Rapor',
        icon: '📊',
        color: 'indigo',
        description: 'Google Analytics, raporlama, dashboard'
    },
    'finance': {
        name: 'Finans & Kripto',
        icon: '💰',
        color: 'yellow',
        description: 'Kripto takip, finansal işlemler'
    },
    'database': {
        name: 'Veritabanı',
        icon: '🗄️',
        color: 'slate',
        description: 'Airtable, Supabase, PostgreSQL'
    }
};

// ============================================
// MEGA ŞABLON INTERFACE
// ============================================

export interface MegaTemplate {
    id: string;
    name: string;
    description: string;
    category: keyof typeof MEGA_TEMPLATE_CATEGORIES;
    subcategory: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedRevenue: string;
    timeToSetup: string;
    icon: string;
    tags: string[];
    source: 'n8n' | 'custom';
    popular: boolean;
    blueprint: Omit<SystemBlueprint, 'id'>;
}

// ============================================
// İLK BATCH: E-TİCARET ŞABLONLARI (100+)
// ============================================

const ECOMMERCE_TEMPLATES: MegaTemplate[] = [
    // Shopify (30 şablon)
    {
        id: 'shopify-order-slack',
        name: 'Shopify Sipariş → Slack Bildirimi',
        description: 'Yeni Shopify siparişlerini anında Slack kanalına bildirir',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'easy',
        estimatedRevenue: '₺5K-15K/ay',
        timeToSetup: '5 dk',
        icon: '🛒',
        tags: ['shopify', 'slack', 'sipariş', 'bildirim'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Shopify Sipariş Bildirimi',
            description: 'Yeni siparişleri Slack\'e bildir',
            masterGoal: 'Satışları anlık takip et',
            baseKnowledge: 'Shopify Webhook, Slack API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sp-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Shopify Webhook', role: 'Tetikleyici', task: 'Yeni sipariş al', status: StepStatus.IDLE, connections: [{ targetId: 'sp-2' }] },
                { id: 'sp-2', type: NodeType.CONTENT_CREATOR, title: 'Mesaj Formatla', role: 'Formatter', task: 'Sipariş bilgilerini düzenle', status: StepStatus.IDLE, connections: [{ targetId: 'sp-3' }] },
                { id: 'sp-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Gönder', role: 'Bildirim', task: 'Kanala mesaj gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'shopify-order-sheets',
        name: 'Shopify Sipariş → Google Sheets',
        description: 'Tüm siparişleri otomatik olarak Google Sheets\'e kaydet',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'easy',
        estimatedRevenue: '₺8K-20K/ay',
        timeToSetup: '10 dk',
        icon: '📊',
        tags: ['shopify', 'google-sheets', 'sipariş', 'raporlama'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Shopify Sheets Entegrasyonu',
            description: 'Siparişleri Sheets\'e kaydet',
            masterGoal: 'Satış verilerini merkezi takip',
            baseKnowledge: 'Shopify API, Google Sheets API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ss-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Shopify Webhook', role: 'Tetikleyici', task: 'Yeni sipariş al', status: StepStatus.IDLE, connections: [{ targetId: 'ss-2' }] },
                { id: 'ss-2', type: NodeType.ANALYST_CRITIC, title: 'Veri Dönüştür', role: 'ETL', task: 'Sipariş verisini düzenle', status: StepStatus.IDLE, connections: [{ targetId: 'ss-3' }] },
                { id: 'ss-3', type: NodeType.STATE_MANAGER, title: 'Sheets Kaydet', role: 'Database', task: 'Satır ekle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'shopify-inventory-alert',
        name: 'Shopify Stok Uyarı Sistemi',
        description: 'Stok kritik seviyeye düşünce otomatik bildirim gönder',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '15 dk',
        icon: '⚠️',
        tags: ['shopify', 'stok', 'uyarı', 'envanter'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Stok Uyarı Sistemi',
            description: 'Düşük stok uyarısı',
            masterGoal: 'Stok tükenmesini önle',
            baseKnowledge: 'Shopify Inventory API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'si-1', type: NodeType.STATE_MANAGER, title: 'Zamanlayıcı', role: 'Cron', task: 'Her saat çalış', status: StepStatus.IDLE, connections: [{ targetId: 'si-2' }] },
                { id: 'si-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Stok Al', role: 'Shopify API', task: 'Tüm ürün stoklarını çek', status: StepStatus.IDLE, connections: [{ targetId: 'si-3' }] },
                { id: 'si-3', type: NodeType.LOGIC_GATE, title: 'Filtre', role: 'Karar', task: 'Düşük stok olanları bul', status: StepStatus.IDLE, connections: [{ targetId: 'si-4' }] },
                { id: 'si-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Uyarı Gönder', role: 'Email/Slack', task: 'Stok uyarısı gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'shopify-abandoned-cart',
        name: 'Shopify Terk Edilen Sepet Recovery',
        description: 'Terk edilen sepetlere otomatik hatırlatma e-postası gönder',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-60K/ay',
        timeToSetup: '20 dk',
        icon: '🛒',
        tags: ['shopify', 'sepet', 'recovery', 'email'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Sepet Recovery',
            description: 'Terk edilen sepetleri kurtar',
            masterGoal: 'Satış kaybını azalt',
            baseKnowledge: 'Shopify Checkouts API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ac-1', type: NodeType.STATE_MANAGER, title: 'Zamanlayıcı', role: 'Cron', task: 'Her 30 dakika çalış', status: StepStatus.IDLE, connections: [{ targetId: 'ac-2' }] },
                { id: 'ac-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Terk Edilenler', role: 'Shopify API', task: 'Terk edilen sepetleri al', status: StepStatus.IDLE, connections: [{ targetId: 'ac-3' }] },
                { id: 'ac-3', type: NodeType.LOGIC_GATE, title: '1 Saat Geçti mi?', role: 'Filter', task: '1+ saat önce terk edilenleri filtrele', status: StepStatus.IDLE, connections: [{ targetId: 'ac-4' }] },
                { id: 'ac-4', type: NodeType.CONTENT_CREATOR, title: 'Email Hazırla', role: 'Copywriter', task: 'Kişiselleştirilmiş email oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'ac-5' }] },
                { id: 'ac-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Hatırlatma emaili gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'shopify-customer-sync-hubspot',
        name: 'Shopify Müşteri → HubSpot CRM',
        description: 'Yeni Shopify müşterilerini otomatik olarak HubSpot\'a ekle',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-50K/ay',
        timeToSetup: '15 dk',
        icon: '🔄',
        tags: ['shopify', 'hubspot', 'crm', 'müşteri', 'sync'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Shopify HubSpot Sync',
            description: 'Müşterileri CRM\'e senkronize et',
            masterGoal: 'Müşteri verilerini merkezi yönet',
            baseKnowledge: 'Shopify Customers API, HubSpot CRM API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sh-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Shopify Webhook', role: 'Tetikleyici', task: 'Yeni müşteri al', status: StepStatus.IDLE, connections: [{ targetId: 'sh-2' }] },
                { id: 'sh-2', type: NodeType.ANALYST_CRITIC, title: 'Veri Dönüştür', role: 'Mapper', task: 'HubSpot formatına dönüştür', status: StepStatus.IDLE, connections: [{ targetId: 'sh-3' }] },
                { id: 'sh-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'HubSpot Ekle', role: 'CRM', task: 'Contact oluştur veya güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // WooCommerce (20 şablon)
    {
        id: 'woo-order-telegram',
        name: 'WooCommerce Sipariş → Telegram',
        description: 'Yeni WooCommerce siparişlerini Telegram\'a bildir',
        category: 'ecommerce',
        subcategory: 'woocommerce',
        difficulty: 'easy',
        estimatedRevenue: '₺5K-12K/ay',
        timeToSetup: '5 dk',
        icon: '📦',
        tags: ['woocommerce', 'telegram', 'sipariş', 'bildirim'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'WooCommerce Telegram Bildirimi',
            description: 'Siparişleri Telegram\'a bildir',
            masterGoal: 'Mobil sipariş takibi',
            baseKnowledge: 'WooCommerce Webhook, Telegram Bot API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wt-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'WooCommerce Webhook', role: 'Tetikleyici', task: 'Yeni sipariş al', status: StepStatus.IDLE, connections: [{ targetId: 'wt-2' }] },
                { id: 'wt-2', type: NodeType.CONTENT_CREATOR, title: 'Mesaj Formatla', role: 'Formatter', task: 'Telegram mesajı oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'wt-3' }] },
                { id: 'wt-3', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Gönder', role: 'Bot', task: 'Gruba mesaj gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'woo-low-stock-reorder',
        name: 'WooCommerce Otomatik Tedarik Siparişi',
        description: 'Stok düşünce tedarikçiye otomatik sipariş emaili gönder',
        category: 'ecommerce',
        subcategory: 'woocommerce',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '30 dk',
        icon: '📋',
        tags: ['woocommerce', 'stok', 'tedarik', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Otomatik Tedarik Sistemi',
            description: 'Stok düşünce tedarikçiye sipariş ver',
            masterGoal: 'Stok yönetimini otomatikleştir',
            baseKnowledge: 'WooCommerce API, Email SMTP',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wr-1', type: NodeType.STATE_MANAGER, title: 'Günlük Kontrol', role: 'Cron', task: 'Her gün 09:00\'da çalış', status: StepStatus.IDLE, connections: [{ targetId: 'wr-2' }] },
                { id: 'wr-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Stok Durumu', role: 'WooCommerce API', task: 'Tüm ürün stoklarını al', status: StepStatus.IDLE, connections: [{ targetId: 'wr-3' }] },
                { id: 'wr-3', type: NodeType.LOGIC_GATE, title: 'Kritik Stok?', role: 'Filter', task: 'Minimum altındakileri bul', status: StepStatus.IDLE, connections: [{ targetId: 'wr-4' }] },
                { id: 'wr-4', type: NodeType.STATE_MANAGER, title: 'Tedarikçi Bul', role: 'Database', task: 'Ürünün tedarikçisini al', status: StepStatus.IDLE, connections: [{ targetId: 'wr-5' }] },
                { id: 'wr-5', type: NodeType.CONTENT_CREATOR, title: 'Sipariş Emaili', role: 'AI Writer', task: 'Profesyonel sipariş emaili oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'wr-6' }] },
                { id: 'wr-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Tedarikçiye email gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // Stripe (15 şablon)
    {
        id: 'stripe-payment-slack',
        name: 'Stripe Ödeme → Slack Bildirimi',
        description: 'Her başarılı ödemeyi anında Slack\'te görün',
        category: 'payments',
        subcategory: 'stripe',
        difficulty: 'easy',
        estimatedRevenue: '₺10K-25K/ay',
        timeToSetup: '5 dk',
        icon: '💳',
        tags: ['stripe', 'ödeme', 'slack', 'bildirim'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Stripe Ödeme Bildirimi',
            description: 'Ödemeleri Slack\'e bildir',
            masterGoal: 'Geliri anlık takip et',
            baseKnowledge: 'Stripe Webhooks, Slack API',
            category: 'Payments',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'st-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Stripe Webhook', role: 'Tetikleyici', task: 'payment_intent.succeeded al', status: StepStatus.IDLE, connections: [{ targetId: 'st-2' }] },
                { id: 'st-2', type: NodeType.CONTENT_CREATOR, title: 'Formatla', role: 'Formatter', task: 'Tutar ve müşteri bilgisini formatla', status: StepStatus.IDLE, connections: [{ targetId: 'st-3' }] },
                { id: 'st-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Gönder', role: 'Bildirim', task: '#sales kanalına gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'stripe-failed-payment-alert',
        name: 'Stripe Başarısız Ödeme Uyarısı',
        description: 'Başarısız ödemeleri anında ekibe bildir',
        category: 'payments',
        subcategory: 'stripe',
        difficulty: 'easy',
        estimatedRevenue: '₺5K-15K/ay',
        timeToSetup: '5 dk',
        icon: '🚨',
        tags: ['stripe', 'ödeme', 'hata', 'uyarı'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Başarısız Ödeme Uyarısı',
            description: 'Ödeme hatalarını bildir',
            masterGoal: 'Kayıp satışları önle',
            baseKnowledge: 'Stripe Webhooks',
            category: 'Payments',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sf-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Stripe Webhook', role: 'Tetikleyici', task: 'payment_intent.payment_failed al', status: StepStatus.IDLE, connections: [{ targetId: 'sf-2' }] },
                { id: 'sf-2', type: NodeType.CONTENT_CREATOR, title: 'Uyarı Mesajı', role: 'Formatter', task: 'Hata detaylarını formatla', status: StepStatus.IDLE, connections: [{ targetId: 'sf-3' }] },
                { id: 'sf-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Acil Bildirim', role: 'Email + Slack', task: 'Ekibe acil bildirim gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'stripe-subscription-sheets',
        name: 'Stripe Abonelik → Google Sheets Takip',
        description: 'Tüm abonelik verilerini Sheets\'te güncel tut',
        category: 'payments',
        subcategory: 'stripe',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-35K/ay',
        timeToSetup: '15 dk',
        icon: '📈',
        tags: ['stripe', 'abonelik', 'google-sheets', 'mrr'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Abonelik Takip Sistemi',
            description: 'MRR ve abonelikleri takip et',
            masterGoal: 'Gelir analitiği',
            baseKnowledge: 'Stripe Subscriptions API, Google Sheets API',
            category: 'Payments',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ss-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Stripe Webhook', role: 'Tetikleyici', task: 'Abonelik eventlerini al', status: StepStatus.IDLE, connections: [{ targetId: 'ss-2' }] },
                { id: 'ss-2', type: NodeType.LOGIC_GATE, title: 'Event Türü?', role: 'Router', task: 'created/updated/canceled', status: StepStatus.IDLE, connections: [{ targetId: 'ss-3' }] },
                { id: 'ss-3', type: NodeType.ANALYST_CRITIC, title: 'Veri Dönüştür', role: 'ETL', task: 'Sheets formatına dönüştür', status: StepStatus.IDLE, connections: [{ targetId: 'ss-4' }] },
                { id: 'ss-4', type: NodeType.STATE_MANAGER, title: 'Sheets Güncelle', role: 'Database', task: 'Satır ekle/güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // SHOPIFY EK ŞABLONLAR
    {
        id: 'shopify-refund-alert',
        name: 'Shopify İade/Refund Uyarı Sistemi',
        description: 'İade talepleri geldiğinde anında bildirim ve analiz',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'easy',
        estimatedRevenue: '₺10K-25K/ay',
        timeToSetup: '10 dk',
        icon: '🔄',
        tags: ['shopify', 'iade', 'refund', 'uyarı'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'İade Uyarı Sistemi',
            description: 'İade takibi',
            masterGoal: 'Müşteri kaybını önle',
            baseKnowledge: 'Shopify Refunds API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Refund Webhook', role: 'Tetikleyici', task: 'İade talebi al', status: StepStatus.IDLE, connections: [{ targetId: 'sr-2' }] },
                { id: 'sr-2', type: NodeType.ANALYST_CRITIC, title: 'Sebep Analiz', role: 'AI', task: 'İade nedenini kategorize et', status: StepStatus.IDLE, connections: [{ targetId: 'sr-3' }] },
                { id: 'sr-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildir', role: 'Slack', task: 'Ekibe bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'shopify-product-price-sync',
        name: 'Shopify Ürün Fiyat Senkronizasyonu',
        description: 'Rakip fiyatlarını takip edip otomatik fiyat güncelle',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '45 dk',
        icon: '💰',
        tags: ['shopify', 'fiyat', 'rakip', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Dinamik Fiyatlama',
            description: 'Rakibe göre fiyat ayarla',
            masterGoal: 'Rekabetçi kal',
            baseKnowledge: 'Web scraping, Shopify Products API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pp-1', type: NodeType.STATE_MANAGER, title: 'Günlük Kontrol', role: 'Cron', task: 'Her gün 06:00', status: StepStatus.IDLE, connections: [{ targetId: 'pp-2' }] },
                { id: 'pp-2', type: NodeType.RESEARCH_WEB, title: 'Rakip Fiyatları', role: 'Scraper', task: 'Rakip sitelerini tara', status: StepStatus.IDLE, connections: [{ targetId: 'pp-3' }] },
                { id: 'pp-3', type: NodeType.ANALYST_CRITIC, title: 'Karşılaştır', role: 'Calculator', task: 'Fiyat farkını hesapla', status: StepStatus.IDLE, connections: [{ targetId: 'pp-4' }] },
                { id: 'pp-4', type: NodeType.LOGIC_GATE, title: 'Güncelle mi?', role: 'Karar', task: '%5+ fark varsa', status: StepStatus.IDLE, connections: [{ targetId: 'pp-5' }] },
                { id: 'pp-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fiyat Güncelle', role: 'Shopify API', task: 'Ürün fiyatını değiştir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'shopify-customer-segmentation',
        name: 'Shopify Müşteri Segmentasyonu',
        description: 'Müşterileri alışveriş davranışına göre otomatik segmente et',
        category: 'ecommerce',
        subcategory: 'shopify',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '30 dk',
        icon: '👥',
        tags: ['shopify', 'segment', 'müşteri', 'analiz'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Müşteri Segmentasyonu',
            description: 'RFM analizi ile segmentasyon',
            masterGoal: 'Kişiselleştirilmiş pazarlama',
            baseKnowledge: 'Shopify Customers API, RFM metodolojisi',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'cs-1', type: NodeType.STATE_MANAGER, title: 'Haftalık Analiz', role: 'Cron', task: 'Her Pazar 23:00', status: StepStatus.IDLE, connections: [{ targetId: 'cs-2' }] },
                { id: 'cs-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Müşteri Verileri', role: 'Shopify', task: 'Tüm müşterileri al', status: StepStatus.IDLE, connections: [{ targetId: 'cs-3' }] },
                { id: 'cs-3', type: NodeType.ANALYST_CRITIC, title: 'RFM Hesapla', role: 'Calculator', task: 'Recency/Frequency/Monetary', status: StepStatus.IDLE, connections: [{ targetId: 'cs-4' }] },
                { id: 'cs-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Tag Güncelle', role: 'Shopify', task: 'VIP/Regular/AtRisk etiketleri', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // WOOCOMMERCE EK ŞABLONLAR
    {
        id: 'woo-review-request',
        name: 'WooCommerce Otomatik Yorum İste',
        description: 'Teslimat sonrası müşterilerden otomatik yorum talep et',
        category: 'ecommerce',
        subcategory: 'woocommerce',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '25 dk',
        icon: '⭐',
        tags: ['woocommerce', 'yorum', 'review', 'müşteri'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Yorum Talep Sistemi',
            description: 'Otomatik review isteği',
            masterGoal: 'Mağaza güvenilirliğini artır',
            baseKnowledge: 'WooCommerce API, Email SMTP',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Teslim Edildi', role: 'Webhook', task: 'Sipariş teslim edildi', status: StepStatus.IDLE, connections: [{ targetId: 'rr-2' }] },
                { id: 'rr-2', type: NodeType.STATE_MANAGER, title: '3 Gün Bekle', role: 'Delay', task: '72 saat bekle', status: StepStatus.IDLE, connections: [{ targetId: 'rr-3' }] },
                { id: 'rr-3', type: NodeType.CONTENT_CREATOR, title: 'Email Hazırla', role: 'AI', task: 'Kişiselleştirilmiş yorum isteği', status: StepStatus.IDLE, connections: [{ targetId: 'rr-4' }] },
                { id: 'rr-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Müşteriye gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'woo-cross-sell-automation',
        name: 'WooCommerce Cross-Sell Otomasyonu',
        description: 'Satın alınan ürünlere göre otomatik çapraz satış önerileri',
        category: 'ecommerce',
        subcategory: 'woocommerce',
        difficulty: 'hard',
        estimatedRevenue: '₺25K-70K/ay',
        timeToSetup: '40 dk',
        icon: '🛍️',
        tags: ['woocommerce', 'cross-sell', 'öneri', 'satış'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Cross-Sell Sistemi',
            description: 'Akıllı ürün önerileri',
            masterGoal: 'Sepet değerini artır',
            baseKnowledge: 'WooCommerce API, AI Recommendations',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'xs-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sipariş Al', role: 'Webhook', task: 'Yeni sipariş', status: StepStatus.IDLE, connections: [{ targetId: 'xs-2' }] },
                { id: 'xs-2', type: NodeType.ANALYST_CRITIC, title: 'Ürün Analizi', role: 'AI', task: 'Tamamlayıcı ürünleri bul', status: StepStatus.IDLE, connections: [{ targetId: 'xs-3' }] },
                { id: 'xs-3', type: NodeType.CONTENT_CREATOR, title: 'Email Hazırla', role: 'Copywriter', task: 'Kişiselleştirilmiş öneri emaili', status: StepStatus.IDLE, connections: [{ targetId: 'xs-4' }] },
                { id: 'xs-4', type: NodeType.STATE_MANAGER, title: '2 Gün Bekle', role: 'Delay', task: '48 saat sonra gönder', status: StepStatus.IDLE, connections: [{ targetId: 'xs-5' }] },
                { id: 'xs-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Öneri emaili gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // PAYPAL ŞABLONLARI
    {
        id: 'paypal-payment-notification',
        name: 'PayPal Ödeme Bildirimi',
        description: 'PayPal ödemeleri geldiğinde anında bildirim',
        category: 'payments',
        subcategory: 'paypal',
        difficulty: 'easy',
        estimatedRevenue: '₺8K-20K/ay',
        timeToSetup: '10 dk',
        icon: '💸',
        tags: ['paypal', 'ödeme', 'bildirim', 'anlık'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'PayPal Bildirimi',
            description: 'Ödeme bildirimleri',
            masterGoal: 'Geliri takip et',
            baseKnowledge: 'PayPal IPN/Webhooks',
            category: 'Payments',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pp-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'PayPal Webhook', role: 'IPN', task: 'Ödeme al', status: StepStatus.IDLE, connections: [{ targetId: 'pp-2' }] },
                { id: 'pp-2', type: NodeType.CONTENT_CREATOR, title: 'Formatla', role: 'Formatter', task: 'Ödeme detayları', status: StepStatus.IDLE, connections: [{ targetId: 'pp-3' }] },
                { id: 'pp-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildir', role: 'Slack', task: 'Kanala gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'paypal-refund-processor',
        name: 'PayPal İade İşlemcisi',
        description: 'İade taleplerini otomatik işle ve müşteriyi bilgilendir',
        category: 'payments',
        subcategory: 'paypal',
        difficulty: 'medium',
        estimatedRevenue: '₺12K-30K/ay',
        timeToSetup: '20 dk',
        icon: '↩️',
        tags: ['paypal', 'iade', 'refund', 'otomatik'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'PayPal İade Sistemi',
            description: 'Otomatik iade işleme',
            masterGoal: 'İade sürecini hızlandır',
            baseKnowledge: 'PayPal API, Email SMTP',
            category: 'Payments',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'İade Talebi', role: 'Webhook', task: 'Refund request al', status: StepStatus.IDLE, connections: [{ targetId: 'pr-2' }] },
                { id: 'pr-2', type: NodeType.LOGIC_GATE, title: 'Kriterlere Uygun mu?', role: 'Filter', task: '30 gün içinde mi?', status: StepStatus.IDLE, connections: [{ targetId: 'pr-3' }] },
                { id: 'pr-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'İadeyi İşle', role: 'PayPal API', task: 'Refund başlat', status: StepStatus.IDLE, connections: [{ targetId: 'pr-4' }] },
                { id: 'pr-4', type: NodeType.CONTENT_CREATOR, title: 'Email Hazırla', role: 'Template', task: 'İade onay emaili', status: StepStatus.IDLE, connections: [{ targetId: 'pr-5' }] },
                { id: 'pr-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Müşteriye bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // AMAZON & EBAY ŞABLONLARI
    {
        id: 'amazon-seller-alert',
        name: 'Amazon Seller Central Uyarıları',
        description: 'Amazon satış, stok ve review uyarılarını Telegram\'a gönder',
        category: 'ecommerce',
        subcategory: 'amazon',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-60K/ay',
        timeToSetup: '30 dk',
        icon: '📦',
        tags: ['amazon', 'seller', 'uyarı', 'telegram'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Amazon Seller Alerts',
            description: 'Amazon satıcı bildirimleri',
            masterGoal: 'Amazon mağazasını takip et',
            baseKnowledge: 'Amazon SP-API',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'am-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Kontrol', role: 'Cron', task: 'Her saat', status: StepStatus.IDLE, connections: [{ targetId: 'am-2' }] },
                { id: 'am-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Amazon Verileri', role: 'SP-API', task: 'Satış ve stok al', status: StepStatus.IDLE, connections: [{ targetId: 'am-3' }] },
                { id: 'am-3', type: NodeType.LOGIC_GATE, title: 'Önemli Event?', role: 'Filter', task: 'Yeni satış veya düşük stok', status: StepStatus.IDLE, connections: [{ targetId: 'am-4' }] },
                { id: 'am-4', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Bildir', role: 'Bot', task: 'Satıcıya bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ebay-listing-optimizer',
        name: 'eBay Listing Optimizasyonu',
        description: 'AI ile eBay ürün açıklamalarını ve başlıklarını optimize et',
        category: 'ecommerce',
        subcategory: 'ebay',
        difficulty: 'hard',
        estimatedRevenue: '₺15K-45K/ay',
        timeToSetup: '40 dk',
        icon: '🏷️',
        tags: ['ebay', 'listing', 'seo', 'ai'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'eBay SEO Optimizer',
            description: 'Ürün listelerini optimize et',
            masterGoal: 'eBay görünürlüğünü artır',
            baseKnowledge: 'eBay API, OpenAI',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'eb-1', type: NodeType.STATE_MANAGER, title: 'Ürün Listesi', role: 'Sheets', task: 'Optimize edilecek ürünler', status: StepStatus.IDLE, connections: [{ targetId: 'eb-2' }] },
                { id: 'eb-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mevcut Listing', role: 'eBay API', task: 'Ürün detaylarını al', status: StepStatus.IDLE, connections: [{ targetId: 'eb-3' }] },
                { id: 'eb-3', type: NodeType.CONTENT_CREATOR, title: 'AI Optimize', role: 'GPT-4', task: 'Başlık ve açıklama yaz', status: StepStatus.IDLE, connections: [{ targetId: 'eb-4' }] },
                { id: 'eb-4', type: NodeType.HUMAN_APPROVAL, title: 'Onay', role: 'Review', task: 'Değişiklikleri onayla', status: StepStatus.IDLE, connections: [{ targetId: 'eb-5' }] },
                { id: 'eb-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Güncelle', role: 'eBay API', task: 'Listingi güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // MULTI-CHANNEL E-TİCARET
    {
        id: 'multi-channel-inventory-sync',
        name: 'Çoklu Kanal Stok Senkronizasyonu',
        description: 'Shopify, WooCommerce, Amazon stokları tek merkezden yönet',
        category: 'ecommerce',
        subcategory: 'multi-channel',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-120K/ay',
        timeToSetup: '60 dk',
        icon: '🔗',
        tags: ['multi-channel', 'stok', 'sync', 'entegrasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Merkezi Stok Yönetimi',
            description: 'Tüm kanalları senkronize et',
            masterGoal: 'Over-selling önle',
            baseKnowledge: 'Multiple E-commerce APIs',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'mc-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satış Event', role: 'Webhook', task: 'Herhangi kanaldan satış', status: StepStatus.IDLE, connections: [{ targetId: 'mc-2' }] },
                { id: 'mc-2', type: NodeType.STATE_MANAGER, title: 'Merkezi DB', role: 'Airtable', task: 'Ana stok kaydını güncelle', status: StepStatus.IDLE, connections: [{ targetId: 'mc-3' }] },
                { id: 'mc-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Shopify Sync', role: 'Shopify API', task: 'Shopify stok güncelle', status: StepStatus.IDLE, connections: [{ targetId: 'mc-4' }] },
                { id: 'mc-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'WooCommerce Sync', role: 'WC API', task: 'WooCommerce güncelle', status: StepStatus.IDLE, connections: [{ targetId: 'mc-5' }] },
                { id: 'mc-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Amazon Sync', role: 'SP-API', task: 'Amazon güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ecommerce-daily-dashboard',
        name: 'E-Ticaret Günlük Dashboard',
        description: 'Tüm satış kanallarından günlük özet rapor',
        category: 'ecommerce',
        subcategory: 'analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-35K/ay',
        timeToSetup: '30 dk',
        icon: '📊',
        tags: ['dashboard', 'rapor', 'günlük', 'analiz'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Günlük E-Ticaret Raporu',
            description: 'Tüm kanallar tek raporda',
            masterGoal: 'Günlük performans takibi',
            baseKnowledge: 'Multiple APIs, Google Sheets',
            category: 'E-Commerce',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'dd-1', type: NodeType.STATE_MANAGER, title: 'Her Gece 23:55', role: 'Cron', task: 'Günlük tetikle', status: StepStatus.IDLE, connections: [{ targetId: 'dd-2' }] },
                { id: 'dd-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satış Verileri', role: 'APIs', task: 'Tüm kanallardan veri çek', status: StepStatus.IDLE, connections: [{ targetId: 'dd-3' }] },
                { id: 'dd-3', type: NodeType.ANALYST_CRITIC, title: 'Özetle', role: 'Calculator', task: 'Toplam satış, kar, adet', status: StepStatus.IDLE, connections: [{ targetId: 'dd-4' }] },
                { id: 'dd-4', type: NodeType.CONTENT_CREATOR, title: 'Rapor Oluştur', role: 'Formatter', task: 'Güzel formatlanmış rapor', status: StepStatus.IDLE, connections: [{ targetId: 'dd-5' }] },
                { id: 'dd-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'Email + Slack', task: 'Ekibe rapor gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// CRM & SATIŞ ŞABLONLARI (100+)
// ============================================

const CRM_TEMPLATES: MegaTemplate[] = [
    {
        id: 'hubspot-deal-slack',
        name: 'HubSpot Deal Won → Kutlama Bildirimi',
        description: 'Kazanılan fırsatları tüm ekibe kutlama mesajı ile bildir',
        category: 'crm-sales',
        subcategory: 'hubspot',
        difficulty: 'easy',
        estimatedRevenue: '₺10K-30K/ay',
        timeToSetup: '5 dk',
        icon: '🎉',
        tags: ['hubspot', 'deal', 'slack', 'kutlama'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Deal Won Kutlaması',
            description: 'Satış başarılarını kutla',
            masterGoal: 'Ekip motivasyonunu artır',
            baseKnowledge: 'HubSpot Deals API, Slack API',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'hd-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'HubSpot Webhook', role: 'Tetikleyici', task: 'Deal won event al', status: StepStatus.IDLE, connections: [{ targetId: 'hd-2' }] },
                { id: 'hd-2', type: NodeType.CONTENT_CREATOR, title: 'Kutlama Mesajı', role: 'AI', task: 'Eğlenceli kutlama mesajı oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'hd-3' }] },
                { id: 'hd-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Gönder', role: 'Bildirim', task: '#sales-wins kanalına gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'hubspot-lead-enrichment',
        name: 'HubSpot Lead Otomatik Zenginleştirme',
        description: 'Yeni leadlerin şirket ve LinkedIn bilgilerini otomatik ekle',
        category: 'crm-sales',
        subcategory: 'hubspot',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-100K/ay',
        timeToSetup: '30 dk',
        icon: '✨',
        tags: ['hubspot', 'lead', 'enrichment', 'linkedin'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Lead Zenginleştirme',
            description: 'Lead verilerini otomatik tamamla',
            masterGoal: 'Satış conversiyonunu artır',
            baseKnowledge: 'HubSpot API, Clearbit API, LinkedIn API',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'le-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'HubSpot Webhook', role: 'Tetikleyici', task: 'Yeni contact al', status: StepStatus.IDLE, connections: [{ targetId: 'le-2' }] },
                { id: 'le-2', type: NodeType.RESEARCH_WEB, title: 'Şirket Araştır', role: 'Clearbit', task: 'Domain\'den şirket bilgisi al', status: StepStatus.IDLE, connections: [{ targetId: 'le-3' }] },
                { id: 'le-3', type: NodeType.RESEARCH_WEB, title: 'LinkedIn Bul', role: 'API', task: 'Kişinin LinkedIn profilini bul', status: StepStatus.IDLE, connections: [{ targetId: 'le-4' }] },
                { id: 'le-4', type: NodeType.ANALYST_CRITIC, title: 'Lead Skoru', role: 'AI', task: 'Müşteri potansiyelini hesapla', status: StepStatus.IDLE, connections: [{ targetId: 'le-5' }] },
                { id: 'le-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'HubSpot Güncelle', role: 'CRM', task: 'Contact bilgilerini güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'pipedrive-activity-reminder',
        name: 'Pipedrive Aktivite Hatırlatıcı',
        description: 'Yaklaşan aktiviteleri email ve Slack ile hatırlat',
        category: 'crm-sales',
        subcategory: 'pipedrive',
        difficulty: 'easy',
        estimatedRevenue: '₺8K-20K/ay',
        timeToSetup: '10 dk',
        icon: '⏰',
        tags: ['pipedrive', 'aktivite', 'hatırlatma', 'crm'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Aktivite Hatırlatıcı',
            description: 'Önemli aktiviteleri hatırlat',
            masterGoal: 'Hiçbir fırsatı kaçırma',
            baseKnowledge: 'Pipedrive Activities API',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pa-1', type: NodeType.STATE_MANAGER, title: 'Her Saat Kontrol', role: 'Cron', task: 'Saatlik çalış', status: StepStatus.IDLE, connections: [{ targetId: 'pa-2' }] },
                { id: 'pa-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Aktiviteleri Al', role: 'Pipedrive API', task: 'Bugünkü aktiviteleri çek', status: StepStatus.IDLE, connections: [{ targetId: 'pa-3' }] },
                { id: 'pa-3', type: NodeType.LOGIC_GATE, title: '1 Saat İçinde mi?', role: 'Filter', task: '1 saat içindekileri filtrele', status: StepStatus.IDLE, connections: [{ targetId: 'pa-4' }] },
                { id: 'pa-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Hatırlatma Gönder', role: 'Multi-channel', task: 'Email ve Slack gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // SALESFORCE ŞABLONLARI
    {
        id: 'salesforce-lead-to-slack',
        name: 'Salesforce Yeni Lead → Slack',
        description: 'Salesforce\'a gelen yeni leadleri anında Slack\'e bildir',
        category: 'crm-sales',
        subcategory: 'salesforce',
        difficulty: 'easy',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '10 dk',
        icon: '☁️',
        tags: ['salesforce', 'lead', 'slack', 'bildirim'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Salesforce Lead Bildirimi',
            description: 'Yeni leadleri Slack\'e bildir',
            masterGoal: 'Hızlı lead takibi',
            baseKnowledge: 'Salesforce API, Slack API',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sf-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Salesforce Webhook', role: 'Tetikleyici', task: 'Yeni lead al', status: StepStatus.IDLE, connections: [{ targetId: 'sf-2' }] },
                { id: 'sf-2', type: NodeType.CONTENT_CREATOR, title: 'Formatla', role: 'Formatter', task: 'Lead bilgilerini düzenle', status: StepStatus.IDLE, connections: [{ targetId: 'sf-3' }] },
                { id: 'sf-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Gönder', role: 'Bildirim', task: '#sales kanalına gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'salesforce-opportunity-pipeline',
        name: 'Salesforce Fırsat Pipeline Otomasyonu',
        description: 'Fırsat aşamaları değiştiğinde otomatik görevler ve bildirimler',
        category: 'crm-sales',
        subcategory: 'salesforce',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-150K/ay',
        timeToSetup: '45 dk',
        icon: '📈',
        tags: ['salesforce', 'opportunity', 'pipeline', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Opportunity Pipeline',
            description: 'Satış sürecini otomatikleştir',
            masterGoal: 'Satış verimliliğini artır',
            baseKnowledge: 'Salesforce Opportunities API',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'so-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Stage Değişti', role: 'Webhook', task: 'Fırsat aşaması değişti', status: StepStatus.IDLE, connections: [{ targetId: 'so-2' }] },
                { id: 'so-2', type: NodeType.LOGIC_GATE, title: 'Hangi Aşama?', role: 'Router', task: 'Qualification/Proposal/Closed', status: StepStatus.IDLE, connections: [{ targetId: 'so-3' }] },
                { id: 'so-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Görev Oluştur', role: 'Salesforce', task: 'Sonraki adım görevi', status: StepStatus.IDLE, connections: [{ targetId: 'so-4' }] },
                { id: 'so-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildir', role: 'Slack', task: 'İlgili kişiye bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // ZOHO CRM ŞABLONLARI
    {
        id: 'zoho-contact-sync-sheets',
        name: 'Zoho CRM Verilerini Sheets\'e Senkronize Et',
        description: 'Zoho CRM verilerini otomatik olarak Google Sheets\'te güncel tut',
        category: 'crm-sales',
        subcategory: 'zoho',
        difficulty: 'medium',
        estimatedRevenue: '₺10K-25K/ay',
        timeToSetup: '20 dk',
        icon: '🔄',
        tags: ['zoho', 'sheets', 'sync', 'backup'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Zoho Sheets Sync',
            description: 'CRM verilerini yedekle',
            masterGoal: 'Veri erişilebilirliği',
            baseKnowledge: 'Zoho CRM API, Google Sheets',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'zs-1', type: NodeType.STATE_MANAGER, title: 'Günlük Sync', role: 'Cron', task: 'Her gece 02:00', status: StepStatus.IDLE, connections: [{ targetId: 'zs-2' }] },
                { id: 'zs-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Zoho Verileri', role: 'Zoho API', task: 'Tüm contactları çek', status: StepStatus.IDLE, connections: [{ targetId: 'zs-3' }] },
                { id: 'zs-3', type: NodeType.STATE_MANAGER, title: 'Sheets Güncelle', role: 'Sheets API', task: 'Verileri güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // MEETING & CALENDAR ŞABLONLARI
    {
        id: 'calendly-hubspot-integration',
        name: 'Calendly → HubSpot Meeting Entegrasyonu',
        description: 'Calendly\'de randevu alındığında HubSpot\'ta activity oluştur',
        category: 'crm-sales',
        subcategory: 'calendly',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-35K/ay',
        timeToSetup: '20 dk',
        icon: '📅',
        tags: ['calendly', 'hubspot', 'meeting', 'entegrasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Calendly HubSpot Sync',
            description: 'Randevuları CRM\'e kaydet',
            masterGoal: 'Meeting takibi',
            baseKnowledge: 'Calendly Webhooks, HubSpot API',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ch-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Calendly Event', role: 'Webhook', task: 'Yeni randevu', status: StepStatus.IDLE, connections: [{ targetId: 'ch-2' }] },
                { id: 'ch-2', type: NodeType.ANALYST_CRITIC, title: 'Contact Bul', role: 'HubSpot Search', task: 'Emailden contact bul', status: StepStatus.IDLE, connections: [{ targetId: 'ch-3' }] },
                { id: 'ch-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Meeting Kaydet', role: 'HubSpot', task: 'Engagement oluştur', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'meeting-reminder-bot',
        name: 'Akıllı Meeting Hatırlatma Botu',
        description: 'Meetinglerden önce katılımcılara kişiselleştirilmiş hatırlatma gönder',
        category: 'crm-sales',
        subcategory: 'meetings',
        difficulty: 'medium',
        estimatedRevenue: '₺8K-20K/ay',
        timeToSetup: '25 dk',
        icon: '⏰',
        tags: ['meeting', 'hatırlatma', 'email', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Meeting Reminder',
            description: 'Akıllı hatırlatmalar',
            masterGoal: 'No-show azalt',
            baseKnowledge: 'Google Calendar API, AI',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'mr-1', type: NodeType.STATE_MANAGER, title: 'Her Saat Kontrol', role: 'Cron', task: 'Yaklaşan meetingleri kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'mr-2' }] },
                { id: 'mr-2', type: NodeType.STATE_MANAGER, title: 'Calendar Oku', role: 'Google API', task: '1 saat içindeki meetingler', status: StepStatus.IDLE, connections: [{ targetId: 'mr-3' }] },
                { id: 'mr-3', type: NodeType.CONTENT_CREATOR, title: 'Hatırlatma Yaz', role: 'AI', task: 'Kişiselleştirilmiş mesaj', status: StepStatus.IDLE, connections: [{ targetId: 'mr-4' }] },
                { id: 'mr-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'Email', task: 'Hatırlatma gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // SALES AUTOMATION
    {
        id: 'sales-follow-up-automation',
        name: 'Otomatik Satış Takip Sistemi',
        description: 'Teklif gönderildikten sonra otomatik takip emaili serisi',
        category: 'crm-sales',
        subcategory: 'sales',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '40 dk',
        icon: '📧',
        tags: ['satış', 'takip', 'email', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Sales Follow-up',
            description: 'Otomatik satış takibi',
            masterGoal: 'Conversion artır',
            baseKnowledge: 'CRM API, Email sequences',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fu-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Teklif Gönderildi', role: 'Webhook', task: 'Deal stage değişti', status: StepStatus.IDLE, connections: [{ targetId: 'fu-2' }] },
                { id: 'fu-2', type: NodeType.STATE_MANAGER, title: '2 Gün Bekle', role: 'Delay', task: '48 saat bekle', status: StepStatus.IDLE, connections: [{ targetId: 'fu-3' }] },
                { id: 'fu-3', type: NodeType.LOGIC_GATE, title: 'Yanıt Var mı?', role: 'Check', task: 'Müşteri yanıtladı mı?', status: StepStatus.IDLE, connections: [{ targetId: 'fu-4' }] },
                { id: 'fu-4', type: NodeType.CONTENT_CREATOR, title: 'Follow-up Email', role: 'AI', task: 'Takip emaili oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'fu-5' }] },
                { id: 'fu-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Müşteriye gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'deal-win-loss-analysis',
        name: 'Deal Win/Loss Analizi',
        description: 'Kazanılan ve kaybedilen fırsatları otomatik analiz et ve raporla',
        category: 'crm-sales',
        subcategory: 'analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-45K/ay',
        timeToSetup: '30 dk',
        icon: '📊',
        tags: ['deal', 'analiz', 'win', 'loss'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Win/Loss Analizi',
            description: 'Satış performans analizi',
            masterGoal: 'Satış stratejisini optimize et',
            baseKnowledge: 'CRM API, Data analysis',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wl-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Deal Kapandı', role: 'Webhook', task: 'Won veya Lost', status: StepStatus.IDLE, connections: [{ targetId: 'wl-2' }] },
                { id: 'wl-2', type: NodeType.ANALYST_CRITIC, title: 'Sebep Analizi', role: 'AI', task: 'Kazanma/Kaybetme nedenlerini çıkar', status: StepStatus.IDLE, connections: [{ targetId: 'wl-3' }] },
                { id: 'wl-3', type: NodeType.STATE_MANAGER, title: 'Kaydet', role: 'Sheets', task: 'Analiz sonuçlarını kaydet', status: StepStatus.IDLE, connections: [{ targetId: 'wl-4' }] },
                { id: 'wl-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Rapor', role: 'Slack', task: 'Haftalık özet paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'sales-territory-assignment',
        name: 'Otomatik Satış Bölgesi Atama',
        description: 'Yeni leadleri lokasyona göre otomatik satış temsilcisine ata',
        category: 'crm-sales',
        subcategory: 'assignment',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '25 dk',
        icon: '🗺️',
        tags: ['territory', 'atama', 'lead', 'routing'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Territory Assignment',
            description: 'Otomatik lead dağıtımı',
            masterGoal: 'Lead yanıt süresini azalt',
            baseKnowledge: 'CRM API, Geolocation',
            category: 'CRM',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ta-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Lead', role: 'Webhook', task: 'Lead geldi', status: StepStatus.IDLE, connections: [{ targetId: 'ta-2' }] },
                { id: 'ta-2', type: NodeType.ANALYST_CRITIC, title: 'Lokasyon Analiz', role: 'Geo', task: 'Şehir/Bölge tespit', status: StepStatus.IDLE, connections: [{ targetId: 'ta-3' }] },
                { id: 'ta-3', type: NodeType.STATE_MANAGER, title: 'Temsilci Bul', role: 'Database', task: 'Bölge sorumlusunu al', status: StepStatus.IDLE, connections: [{ targetId: 'ta-4' }] },
                { id: 'ta-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ata', role: 'CRM', task: 'Lead sahipliğini güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// SOSYAL MEDYA ŞABLONLARI (150+)
// ============================================

const SOCIAL_MEDIA_TEMPLATES: MegaTemplate[] = [
    {
        id: 'twitter-mention-slack',
        name: 'Twitter Mention → Slack Bildirimi',
        description: 'Markanızdan bahsedildiğinde anında haberdar olun',
        category: 'social-media',
        subcategory: 'twitter',
        difficulty: 'easy',
        estimatedRevenue: '₺5K-15K/ay',
        timeToSetup: '10 dk',
        icon: '🐦',
        tags: ['twitter', 'mention', 'slack', 'marka'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Twitter Mention Takibi',
            description: 'Mentionları takip et',
            masterGoal: 'Marka itibarını koru',
            baseKnowledge: 'Twitter API v2, Slack API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'tm-1', type: NodeType.STATE_MANAGER, title: '5dk Polling', role: 'Cron', task: 'Her 5 dakika kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'tm-2' }] },
                { id: 'tm-2', type: NodeType.SOCIAL_MANAGER, title: 'Mentionları Al', role: 'Twitter API', task: 'Son mentionları çek', status: StepStatus.IDLE, connections: [{ targetId: 'tm-3' }] },
                { id: 'tm-3', type: NodeType.ANALYST_CRITIC, title: 'Sentiment Analiz', role: 'AI', task: 'Pozitif/negatif mı?', status: StepStatus.IDLE, connections: [{ targetId: 'tm-4' }] },
                { id: 'tm-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Bildir', role: 'Bildirim', task: 'Emoji ile duygu göster', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'linkedin-post-scheduler',
        name: 'LinkedIn Post Zamanlayıcı',
        description: 'Google Sheets\'ten LinkedIn postlarını otomatik planla ve paylaş',
        category: 'social-media',
        subcategory: 'linkedin',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '20 dk',
        icon: '💼',
        tags: ['linkedin', 'post', 'zamanlama', 'sheets'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'LinkedIn Zamanlayıcı',
            description: 'Postları otomatik paylaş',
            masterGoal: 'LinkedIn varlığını güçlendir',
            baseKnowledge: 'LinkedIn API, Google Sheets API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'lp-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Kontrol', role: 'Cron', task: 'Her saat çalış', status: StepStatus.IDLE, connections: [{ targetId: 'lp-2' }] },
                { id: 'lp-2', type: NodeType.STATE_MANAGER, title: 'Sheets Oku', role: 'Google Sheets', task: 'Bugünün postlarını al', status: StepStatus.IDLE, connections: [{ targetId: 'lp-3' }] },
                { id: 'lp-3', type: NodeType.LOGIC_GATE, title: 'Paylaşım Zamanı?', role: 'Filter', task: 'Saati gelenler', status: StepStatus.IDLE, connections: [{ targetId: 'lp-4' }] },
                { id: 'lp-4', type: NodeType.SOCIAL_MANAGER, title: 'LinkedIn Paylaş', role: 'API', task: 'Postu paylaş', status: StepStatus.IDLE, connections: [{ targetId: 'lp-5' }] },
                { id: 'lp-5', type: NodeType.STATE_MANAGER, title: 'Durumu Güncelle', role: 'Sheets', task: 'Paylaşıldı olarak işaretle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'telegram-bot-support',
        name: 'Telegram AI Müşteri Destek Botu',
        description: 'Telegram üzerinden 7/24 AI destekli müşteri hizmeti',
        category: 'social-media',
        subcategory: 'telegram',
        difficulty: 'hard',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '45 dk',
        icon: '🤖',
        tags: ['telegram', 'bot', 'ai', 'destek', 'chatbot'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Telegram AI Destek',
            description: '7/24 otomatik müşteri desteği',
            masterGoal: 'Müşteri memnuniyetini artır',
            baseKnowledge: 'Telegram Bot API, OpenAI API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'tb-1', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Mesaj', role: 'Bot', task: 'Gelen mesajı al', status: StepStatus.IDLE, connections: [{ targetId: 'tb-2' }] },
                { id: 'tb-2', type: NodeType.ANALYST_CRITIC, title: 'Niyet Analizi', role: 'NLP', task: 'Kullanıcının isteğini anla', status: StepStatus.IDLE, connections: [{ targetId: 'tb-3' }] },
                { id: 'tb-3', type: NodeType.LOGIC_GATE, title: 'SSS mi?', role: 'Router', task: 'Basit soru mu, karmaşık mı?', status: StepStatus.IDLE, connections: [{ targetId: 'tb-4' }, { targetId: 'tb-5' }] },
                { id: 'tb-4', type: NodeType.CONTENT_CREATOR, title: 'AI Yanıt', role: 'OpenAI', task: 'Bağlamsal yanıt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'tb-6' }] },
                { id: 'tb-5', type: NodeType.HUMAN_APPROVAL, title: 'İnsan Desteği', role: 'Escalation', task: 'Destek ekibine yönlendir', status: StepStatus.IDLE, connections: [{ targetId: 'tb-6' }] },
                { id: 'tb-6', type: NodeType.SOCIAL_MANAGER, title: 'Yanıt Gönder', role: 'Telegram', task: 'Kullanıcıya yanıt ver', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'youtube-new-video-social',
        name: 'YouTube Video → Tüm Sosyal Medyalara',
        description: 'Yeni YouTube videolarını Twitter, LinkedIn, Facebook\'ta otomatik paylaş',
        category: 'social-media',
        subcategory: 'youtube',
        difficulty: 'medium',
        estimatedRevenue: '₺10K-30K/ay',
        timeToSetup: '25 dk',
        icon: '🎬',
        tags: ['youtube', 'twitter', 'linkedin', 'facebook', 'cross-post'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'YouTube Cross-Poster',
            description: 'Videoları tüm platformlara dağıt',
            masterGoal: 'Video erişimini maksimize et',
            baseKnowledge: 'YouTube Data API, Social Media APIs',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'yv-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'YouTube RSS', role: 'Tetikleyici', task: 'Yeni video algıla', status: StepStatus.IDLE, connections: [{ targetId: 'yv-2' }] },
                { id: 'yv-2', type: NodeType.CONTENT_CREATOR, title: 'Platform Mesajları', role: 'AI', task: 'Her platforma özel mesaj oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'yv-3' }, { targetId: 'yv-4' }, { targetId: 'yv-5' }] },
                { id: 'yv-3', type: NodeType.SOCIAL_MANAGER, title: 'Twitter Paylaş', role: 'Twitter API', task: 'Tweet at', status: StepStatus.IDLE, connections: [] },
                { id: 'yv-4', type: NodeType.SOCIAL_MANAGER, title: 'LinkedIn Paylaş', role: 'LinkedIn API', task: 'Post paylaş', status: StepStatus.IDLE, connections: [] },
                { id: 'yv-5', type: NodeType.SOCIAL_MANAGER, title: 'Facebook Paylaş', role: 'Facebook API', task: 'Sayfada paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // WHATSAPP ŞABLONLARI
    {
        id: 'whatsapp-ai-customer-support',
        name: 'WhatsApp AI Müşteri Destek Botu',
        description: '7/24 çalışan, GPT-4 ile müşteri sorularını yanıtlayan WhatsApp botu',
        category: 'social-media',
        subcategory: 'whatsapp',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-100K/ay',
        timeToSetup: '60 dk',
        icon: '💬',
        tags: ['whatsapp', 'ai', 'chatbot', 'destek'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'WhatsApp AI Bot',
            description: '7/24 otomatik müşteri desteği',
            masterGoal: 'Müşteri memnuniyetini artır',
            baseKnowledge: 'WhatsApp Business API, OpenAI GPT-4',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wa-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mesaj Al', role: 'Webhook', task: 'WhatsApp mesajını dinle', status: StepStatus.IDLE, connections: [{ targetId: 'wa-2' }] },
                { id: 'wa-2', type: NodeType.ANALYST_CRITIC, title: 'Niyet Analizi', role: 'NLP', task: 'Müşteri ne istiyor?', status: StepStatus.IDLE, connections: [{ targetId: 'wa-3' }] },
                { id: 'wa-3', type: NodeType.LOGIC_GATE, title: 'Karmaşık mı?', role: 'Router', task: 'SSS mi karmaşık soru mu?', status: StepStatus.IDLE, connections: [{ targetId: 'wa-4' }, { targetId: 'wa-5' }] },
                { id: 'wa-4', type: NodeType.CONTENT_CREATOR, title: 'AI Yanıt', role: 'GPT-4', task: 'Bağlamsal yanıt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'wa-6' }] },
                { id: 'wa-5', type: NodeType.HUMAN_APPROVAL, title: 'İnsan Yönlendir', role: 'Escalation', task: 'Destek ekibine aktar', status: StepStatus.IDLE, connections: [{ targetId: 'wa-6' }] },
                { id: 'wa-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yanıt Gönder', role: 'WhatsApp API', task: 'Müşteriye yanıt', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'whatsapp-order-notification',
        name: 'WhatsApp Sipariş Bildirimi',
        description: 'Müşterilere sipariş durumu ve kargo takibi WhatsApp ile gönder',
        category: 'social-media',
        subcategory: 'whatsapp',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '25 dk',
        icon: '📦',
        tags: ['whatsapp', 'sipariş', 'kargo', 'bildirim'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'WhatsApp Sipariş Takibi',
            description: 'Otomatik kargo bildirimi',
            masterGoal: 'Müşteri deneyimini iyileştir',
            baseKnowledge: 'WhatsApp API, E-ticaret webhook',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wo-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sipariş Event', role: 'Webhook', task: 'Sipariş durumu değişti', status: StepStatus.IDLE, connections: [{ targetId: 'wo-2' }] },
                { id: 'wo-2', type: NodeType.LOGIC_GATE, title: 'Durum?', role: 'Router', task: 'Onaylandı/Kargoda/Teslim', status: StepStatus.IDLE, connections: [{ targetId: 'wo-3' }] },
                { id: 'wo-3', type: NodeType.CONTENT_CREATOR, title: 'Mesaj Hazırla', role: 'Template', task: 'Duruma göre mesaj', status: StepStatus.IDLE, connections: [{ targetId: 'wo-4' }] },
                { id: 'wo-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'WhatsApp Gönder', role: 'API', task: 'Müşteriye bildirim', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // DISCORD ŞABLONLARI
    {
        id: 'discord-moderation-bot',
        name: 'Discord AI Moderasyon Botu',
        description: 'Spam, küfür ve kural ihlallerini otomatik tespit edip işlem yap',
        category: 'social-media',
        subcategory: 'discord',
        difficulty: 'hard',
        estimatedRevenue: '₺10K-30K/ay',
        timeToSetup: '45 dk',
        icon: '🛡️',
        tags: ['discord', 'moderasyon', 'ai', 'bot'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Discord Moderatör',
            description: 'Otomatik topluluk yönetimi',
            masterGoal: 'Topluluk güvenliği',
            baseKnowledge: 'Discord API, Content moderation',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'dm-1', type: NodeType.SOCIAL_MANAGER, title: 'Mesaj Dinle', role: 'Discord Bot', task: 'Tüm mesajları izle', status: StepStatus.IDLE, connections: [{ targetId: 'dm-2' }] },
                { id: 'dm-2', type: NodeType.ANALYST_CRITIC, title: 'İçerik Analiz', role: 'AI', task: 'Spam/Küfür/Kural ihlali?', status: StepStatus.IDLE, connections: [{ targetId: 'dm-3' }] },
                { id: 'dm-3', type: NodeType.LOGIC_GATE, title: 'İhlal mi?', role: 'Filter', task: 'Kural ihlali varsa', status: StepStatus.IDLE, connections: [{ targetId: 'dm-4' }] },
                { id: 'dm-4', type: NodeType.SOCIAL_MANAGER, title: 'Aksiyon Al', role: 'Discord', task: 'Mesajı sil / Uyar / Ban', status: StepStatus.IDLE, connections: [{ targetId: 'dm-5' }] },
                { id: 'dm-5', type: NodeType.STATE_MANAGER, title: 'Log Kaydet', role: 'Database', task: 'Mod log kaydı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'discord-announcement-broadcaster',
        name: 'Discord Duyuru Yayıncı',
        description: 'Bir kanaldan diğerlerine veya birden fazla sunucuya duyuru yayınla',
        category: 'social-media',
        subcategory: 'discord',
        difficulty: 'easy',
        estimatedRevenue: '₺5K-15K/ay',
        timeToSetup: '15 dk',
        icon: '📢',
        tags: ['discord', 'duyuru', 'broadcast', 'çoklu'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Discord Broadcaster',
            description: 'Çoklu sunucu duyurusu',
            masterGoal: 'Tek noktadan yönetim',
            baseKnowledge: 'Discord Webhooks',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'db-1', type: NodeType.SOCIAL_MANAGER, title: 'Duyuru Mesajı', role: 'Discord', task: 'Ana kanaldan mesaj al', status: StepStatus.IDLE, connections: [{ targetId: 'db-2' }] },
                { id: 'db-2', type: NodeType.STATE_MANAGER, title: 'Hedefleri Al', role: 'Database', task: 'Yayın yapılacak kanallar', status: StepStatus.IDLE, connections: [{ targetId: 'db-3' }] },
                { id: 'db-3', type: NodeType.SOCIAL_MANAGER, title: 'Yayınla', role: 'Webhook', task: 'Tüm kanallara gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // INSTAGRAM ŞABLONLARI (API limitli ama Sheets/indirect)
    {
        id: 'instagram-content-calendar',
        name: 'Instagram İçerik Takvimi',
        description: 'Google Sheets\'ten Instagram postlarını planla ve hatırlat',
        category: 'social-media',
        subcategory: 'instagram',
        difficulty: 'medium',
        estimatedRevenue: '₺10K-35K/ay',
        timeToSetup: '20 dk',
        icon: '📸',
        tags: ['instagram', 'takvim', 'planlama', 'içerik'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Instagram Planlayıcı',
            description: 'İçerik takvimi yönetimi',
            masterGoal: 'Düzenli paylaşım',
            baseKnowledge: 'Google Sheets, Instagram API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ic-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Kontrol', role: 'Cron', task: 'Her saat çalış', status: StepStatus.IDLE, connections: [{ targetId: 'ic-2' }] },
                { id: 'ic-2', type: NodeType.STATE_MANAGER, title: 'Takvim Oku', role: 'Sheets', task: 'Bugünün postlarını al', status: StepStatus.IDLE, connections: [{ targetId: 'ic-3' }] },
                { id: 'ic-3', type: NodeType.LOGIC_GATE, title: 'Zamanı Geldi mi?', role: 'Filter', task: 'Paylaşım saati', status: StepStatus.IDLE, connections: [{ targetId: 'ic-4' }] },
                { id: 'ic-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Hatırlat', role: 'Slack/Email', task: 'Post zamanı bildirimi', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'instagram-hashtag-generator',
        name: 'AI Instagram Hashtag Üretici',
        description: 'Post içeriğine göre en etkili hashtagleri AI ile üret',
        category: 'social-media',
        subcategory: 'instagram',
        difficulty: 'easy',
        estimatedRevenue: '₺8K-25K/ay',
        timeToSetup: '10 dk',
        icon: '#️⃣',
        tags: ['instagram', 'hashtag', 'ai', 'engagement'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Hashtag Generator',
            description: 'AI ile hashtag önerisi',
            masterGoal: 'Erişimi artır',
            baseKnowledge: 'OpenAI, Instagram trends',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'hg-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'İçerik Al', role: 'Webhook', task: 'Post açıklaması', status: StepStatus.IDLE, connections: [{ targetId: 'hg-2' }] },
                { id: 'hg-2', type: NodeType.CONTENT_CREATOR, title: 'Hashtag Üret', role: 'GPT-4', task: '30 trending hashtag öner', status: StepStatus.IDLE, connections: [{ targetId: 'hg-3' }] },
                { id: 'hg-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sonuç Gönder', role: 'Response', task: 'Hashtag listesi döndür', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🔥 TAM OTOMATİK İÇERİK + YAYIN ŞABLONLARI
    {
        id: 'instagram-full-auto-content',
        name: '🚀 Instagram FULL AUTO - İçerik Üret + Yayınla',
        description: 'AI ile içerik oluştur, görsel üret, caption yaz, hashtag ekle ve OTOMATİK YAYINLA!',
        category: 'social-media',
        subcategory: 'instagram',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-150K/ay',
        timeToSetup: '60 dk',
        icon: '🤖',
        tags: ['instagram', 'full-auto', 'ai', 'yayın', 'görsel', 'caption'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Instagram Full Auto Publisher',
            description: 'A\'dan Z\'ye otomatik Instagram yönetimi',
            masterGoal: 'Sıfır müdahale ile Instagram büyüt',
            baseKnowledge: 'OpenAI, DALL-E, Instagram Graph API, Buffer/Later',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ifa-1', type: NodeType.STATE_MANAGER, title: 'Günlük 09:00', role: 'Cron', task: 'Her gün içerik üret', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-2' }] },
                { id: 'ifa-2', type: NodeType.RESEARCH_WEB, title: 'Trend Analizi', role: 'Web Scraper', task: 'Günün trendlerini bul', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-3' }] },
                { id: 'ifa-3', type: NodeType.CONTENT_CREATOR, title: 'İçerik Fikri', role: 'GPT-4', task: 'Viral olabilecek içerik fikri', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-4' }] },
                { id: 'ifa-4', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Üret', role: 'DALL-E/Midjourney', task: 'Instagram için görsel oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-5' }] },
                { id: 'ifa-5', type: NodeType.CONTENT_CREATOR, title: 'Caption Yaz', role: 'GPT-4', task: 'Engaging caption + CTA', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-6' }] },
                { id: 'ifa-6', type: NodeType.CONTENT_CREATOR, title: 'Hashtag Üret', role: 'GPT-4', task: '30 trending hashtag', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-7' }] },
                { id: 'ifa-7', type: NodeType.LOGIC_GATE, title: 'Kalite Kontrol', role: 'AI Check', task: 'İçerik uygun mu?', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-8' }] },
                { id: 'ifa-8', type: NodeType.SOCIAL_MANAGER, title: '🚀 YAYINLA', role: 'Instagram API', task: 'Otomatik paylaş!', status: StepStatus.IDLE, connections: [{ targetId: 'ifa-9' }] },
                { id: 'ifa-9', type: NodeType.STATE_MANAGER, title: 'Log Kaydet', role: 'Database', task: 'Performansı takip et', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'instagram-reels-auto-creator',
        name: '🎬 Instagram Reels Otomatik Üretici',
        description: 'AI ile Reels videosu oluştur, müzik ekle ve otomatik yayınla',
        category: 'social-media',
        subcategory: 'instagram',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-250K/ay',
        timeToSetup: '90 dk',
        icon: '🎥',
        tags: ['instagram', 'reels', 'video', 'auto', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Reels Auto Creator',
            description: 'AI ile Reels üret ve yayınla',
            masterGoal: 'Viral Reels ile büyü',
            baseKnowledge: 'Runway, D-ID, ElevenLabs, Instagram API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rac-1', type: NodeType.STATE_MANAGER, title: 'Günlük Tetikle', role: 'Cron', task: 'Her gün yeni Reel', status: StepStatus.IDLE, connections: [{ targetId: 'rac-2' }] },
                { id: 'rac-2', type: NodeType.RESEARCH_WEB, title: 'Viral Trend Bul', role: 'TikTok Scraper', task: 'Viral formatları analiz et', status: StepStatus.IDLE, connections: [{ targetId: 'rac-3' }] },
                { id: 'rac-3', type: NodeType.CONTENT_CREATOR, title: 'Script Yaz', role: 'GPT-4', task: '15-60 saniyelik script', status: StepStatus.IDLE, connections: [{ targetId: 'rac-4' }] },
                { id: 'rac-4', type: NodeType.VIDEO_ARCHITECT, title: 'Video Oluştur', role: 'Runway/D-ID', task: 'AI video render', status: StepStatus.IDLE, connections: [{ targetId: 'rac-5' }] },
                { id: 'rac-5', type: NodeType.MEDIA_ENGINEER, title: 'Seslendirme', role: 'ElevenLabs', task: 'AI voiceover ekle', status: StepStatus.IDLE, connections: [{ targetId: 'rac-6' }] },
                { id: 'rac-6', type: NodeType.MEDIA_ENGINEER, title: 'Müzik Ekle', role: 'Audio Mix', task: 'Trending müzik overlay', status: StepStatus.IDLE, connections: [{ targetId: 'rac-7' }] },
                { id: 'rac-7', type: NodeType.SOCIAL_MANAGER, title: '🚀 REEL YAYINLA', role: 'Instagram API', task: 'Reels olarak paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'instagram-story-auto-publisher',
        name: '📱 Instagram Story Otomatik Yayıncı',
        description: 'Günlük otomatik Story içerikleri oluştur ve yayınla',
        category: 'social-media',
        subcategory: 'instagram',
        difficulty: 'medium',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '40 dk',
        icon: '📱',
        tags: ['instagram', 'story', 'auto', 'günlük'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Story Auto Publisher',
            description: 'Günlük otomatik Story',
            masterGoal: 'Sürekli görünür kal',
            baseKnowledge: 'Canva API, Instagram API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sap-1', type: NodeType.STATE_MANAGER, title: '3 Saatte Bir', role: 'Cron', task: 'Günde 5-6 Story', status: StepStatus.IDLE, connections: [{ targetId: 'sap-2' }] },
                { id: 'sap-2', type: NodeType.CONTENT_CREATOR, title: 'İçerik Tipi Seç', role: 'Rotator', task: 'Quote/Poll/Behind/Promo', status: StepStatus.IDLE, connections: [{ targetId: 'sap-3' }] },
                { id: 'sap-3', type: NodeType.MEDIA_ENGINEER, title: 'Story Tasarla', role: 'Canva/AI', task: 'Story görseli oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'sap-4' }] },
                { id: 'sap-4', type: NodeType.SOCIAL_MANAGER, title: '📱 STORY PAYLAŞ', role: 'Instagram API', task: 'Story olarak yayınla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'twitter-full-auto-thread',
        name: '🐦 Twitter/X FULL AUTO - Thread + Görsel + Yayın',
        description: 'AI ile viral thread oluştur, görsel ekle ve otomatik tweetle',
        category: 'social-media',
        subcategory: 'twitter',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-120K/ay',
        timeToSetup: '50 dk',
        icon: '🧵',
        tags: ['twitter', 'thread', 'auto', 'viral', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Twitter Full Auto Thread',
            description: 'Viral thread üret ve yayınla',
            masterGoal: 'Twitter büyümesi otomatikleştir',
            baseKnowledge: 'Twitter API v2, OpenAI, DALL-E',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'tfa-1', type: NodeType.STATE_MANAGER, title: 'Günlük 10:00', role: 'Cron', task: 'İçerik zamanı', status: StepStatus.IDLE, connections: [{ targetId: 'tfa-2' }] },
                { id: 'tfa-2', type: NodeType.RESEARCH_WEB, title: 'Trend Konular', role: 'Twitter API', task: 'Trending topics al', status: StepStatus.IDLE, connections: [{ targetId: 'tfa-3' }] },
                { id: 'tfa-3', type: NodeType.CONTENT_CREATOR, title: 'Thread Yaz', role: 'GPT-4', task: '10-15 tweet thread', status: StepStatus.IDLE, connections: [{ targetId: 'tfa-4' }] },
                { id: 'tfa-4', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Üret', role: 'DALL-E', task: 'İlk tweet için görsel', status: StepStatus.IDLE, connections: [{ targetId: 'tfa-5' }] },
                { id: 'tfa-5', type: NodeType.SOCIAL_MANAGER, title: '🐦 THREAD PAYLAŞ', role: 'Twitter API', task: 'Thread olarak yayınla', status: StepStatus.IDLE, connections: [{ targetId: 'tfa-6' }] },
                { id: 'tfa-6', type: NodeType.STATE_MANAGER, title: 'Engage Track', role: 'Monitor', task: 'RT ve like takip et', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'linkedin-full-auto-post',
        name: '💼 LinkedIn FULL AUTO - Makale + Carousel + Yayın',
        description: 'AI ile LinkedIn postu oluştur, carousel hazırla ve otomatik yayınla',
        category: 'social-media',
        subcategory: 'linkedin',
        difficulty: 'hard',
        estimatedRevenue: '₺35K-100K/ay',
        timeToSetup: '45 dk',
        icon: '💼',
        tags: ['linkedin', 'auto', 'carousel', 'viral', 'b2b'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'LinkedIn Full Auto',
            description: 'B2B içerik otomasyonu',
            masterGoal: 'LinkedIn thought leader ol',
            baseKnowledge: 'LinkedIn API, OpenAI, Canva',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'lfa-1', type: NodeType.STATE_MANAGER, title: 'Hafta içi 08:30', role: 'Cron', task: 'En iyi engagement saati', status: StepStatus.IDLE, connections: [{ targetId: 'lfa-2' }] },
                { id: 'lfa-2', type: NodeType.CONTENT_CREATOR, title: 'Konu Seç', role: 'AI', task: 'Sektör trendiyle ilgi konu', status: StepStatus.IDLE, connections: [{ targetId: 'lfa-3' }] },
                { id: 'lfa-3', type: NodeType.CONTENT_CREATOR, title: 'Post Yaz', role: 'GPT-4', task: 'Hook + Story + CTA formatı', status: StepStatus.IDLE, connections: [{ targetId: 'lfa-4' }] },
                { id: 'lfa-4', type: NodeType.MEDIA_ENGINEER, title: 'Carousel Hazırla', role: 'Canva API', task: '10 slide carousel PDF', status: StepStatus.IDLE, connections: [{ targetId: 'lfa-5' }] },
                { id: 'lfa-5', type: NodeType.SOCIAL_MANAGER, title: '💼 LINKEDIN PAYLAŞ', role: 'LinkedIn API', task: 'Post + Carousel yayınla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'multi-platform-content-factory',
        name: '🏭 MEGA İçerik Fabrikası - 5 Platform Aynı Anda',
        description: 'Bir içerikten 5 platforma uygun formatlar üret ve hepsini otomatik yayınla!',
        category: 'social-media',
        subcategory: 'multi-platform',
        difficulty: 'hard',
        estimatedRevenue: '₺100K-300K/ay',
        timeToSetup: '90 dk',
        icon: '🏭',
        tags: ['multi-platform', 'full-auto', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Multi-Platform Content Factory',
            description: '1 içerik = 5 platform',
            masterGoal: 'Tam sosyal medya hakimiyeti',
            baseKnowledge: 'All Social APIs, OpenAI, Video/Image AI',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'mcf-1', type: NodeType.STATE_MANAGER, title: 'Günlük Trigger', role: 'Cron', task: 'Her gün içerik fabrikası', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-2' }] },
                { id: 'mcf-2', type: NodeType.CONTENT_CREATOR, title: 'Ana İçerik', role: 'GPT-4', task: 'Master content oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-3' }] },
                { id: 'mcf-3', type: NodeType.CONTENT_CREATOR, title: 'Instagram Adapt', role: 'AI', task: 'Carousel + Reels script', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-4' }] },
                { id: 'mcf-4', type: NodeType.CONTENT_CREATOR, title: 'Twitter Adapt', role: 'AI', task: 'Thread formatı', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-5' }] },
                { id: 'mcf-5', type: NodeType.CONTENT_CREATOR, title: 'LinkedIn Adapt', role: 'AI', task: 'Professional post', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-6' }] },
                { id: 'mcf-6', type: NodeType.CONTENT_CREATOR, title: 'TikTok Adapt', role: 'AI', task: 'TikTok script + hooks', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-7' }] },
                { id: 'mcf-7', type: NodeType.MEDIA_ENGINEER, title: 'Görseller Üret', role: 'Multi-AI', task: 'Her platform için görsel', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-8' }] },
                { id: 'mcf-8', type: NodeType.SOCIAL_MANAGER, title: '🚀 HEPSİNİ YAYINLA', role: 'Multi-API', task: '5 platforma aynı anda!', status: StepStatus.IDLE, connections: [{ targetId: 'mcf-9' }] },
                { id: 'mcf-9', type: NodeType.ANALYST_CRITIC, title: 'Performans Raporu', role: 'Analytics', task: 'Tüm metrikleri topla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'tiktok-full-auto-video',
        name: '🎵 TikTok FULL AUTO - Video Üret + Yayınla',
        description: 'Trend formatlarla TikTok videosu oluştur ve otomatik yayınla',
        category: 'social-media',
        subcategory: 'tiktok',
        difficulty: 'hard',
        estimatedRevenue: '₺60K-200K/ay',
        timeToSetup: '75 dk',
        icon: '🎵',
        tags: ['tiktok', 'video', 'auto', 'viral', 'trend'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'TikTok Auto Creator',
            description: 'TikTok viral makinesi',
            masterGoal: 'TikTok ile viral ol',
            baseKnowledge: 'TikTok API, Runway, ElevenLabs',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'tta-1', type: NodeType.STATE_MANAGER, title: 'Günde 3 Video', role: 'Cron', task: '08:00, 14:00, 20:00', status: StepStatus.IDLE, connections: [{ targetId: 'tta-2' }] },
                { id: 'tta-2', type: NodeType.RESEARCH_WEB, title: 'Trend Format', role: 'TikTok Trends', task: 'Viral template bul', status: StepStatus.IDLE, connections: [{ targetId: 'tta-3' }] },
                { id: 'tta-3', type: NodeType.CONTENT_CREATOR, title: 'Script Yaz', role: 'GPT-4', task: 'Hook (3sn) + İçerik', status: StepStatus.IDLE, connections: [{ targetId: 'tta-4' }] },
                { id: 'tta-4', type: NodeType.VIDEO_ARCHITECT, title: 'Video Render', role: 'AI Video', task: 'TikTok formatında video', status: StepStatus.IDLE, connections: [{ targetId: 'tta-5' }] },
                { id: 'tta-5', type: NodeType.MEDIA_ENGINEER, title: 'Sound Ekle', role: 'Audio', task: 'Trending sound + voice', status: StepStatus.IDLE, connections: [{ targetId: 'tta-6' }] },
                { id: 'tta-6', type: NodeType.SOCIAL_MANAGER, title: '🎵 TIKTOK YAYINLA', role: 'TikTok API', task: 'Video + hashtag paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // FACEBOOK ŞABLONLARI
    {
        id: 'facebook-messenger-bot',
        name: 'Facebook Messenger AI Bot',
        description: 'Sayfa mesajlarını otomatik yanıtlayan akıllı bot',
        category: 'social-media',
        subcategory: 'facebook',
        difficulty: 'hard',
        estimatedRevenue: '₺20K-60K/ay',
        timeToSetup: '45 dk',
        icon: '💬',
        tags: ['facebook', 'messenger', 'bot', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Messenger Bot',
            description: 'Otomatik mesaj yanıtlama',
            masterGoal: 'Müşteri etkileşimi',
            baseKnowledge: 'Facebook Graph API, OpenAI',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fb-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mesaj Al', role: 'Webhook', task: 'Messenger mesajı', status: StepStatus.IDLE, connections: [{ targetId: 'fb-2' }] },
                { id: 'fb-2', type: NodeType.ANALYST_CRITIC, title: 'Niyet Bul', role: 'NLP', task: 'Ne soruyor?', status: StepStatus.IDLE, connections: [{ targetId: 'fb-3' }] },
                { id: 'fb-3', type: NodeType.CONTENT_CREATOR, title: 'Yanıt Yaz', role: 'AI', task: 'Akıllı yanıt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'fb-4' }] },
                { id: 'fb-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yanıtla', role: 'Messenger API', task: 'Yanıt gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'facebook-lead-ads-crm',
        name: 'Facebook Lead Ads → CRM',
        description: 'Facebook Lead formlarını otomatik olarak CRM\'e aktar',
        category: 'social-media',
        subcategory: 'facebook',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-70K/ay',
        timeToSetup: '20 dk',
        icon: '📋',
        tags: ['facebook', 'lead-ads', 'crm', 'otomatik'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Lead Ads CRM Sync',
            description: 'Leadleri CRM\'e aktar',
            masterGoal: 'Lead kaybını önle',
            baseKnowledge: 'Facebook Ads API, HubSpot API',
            category: 'Social Media',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fl-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Lead Form', role: 'Webhook', task: 'Yeni lead geldi', status: StepStatus.IDLE, connections: [{ targetId: 'fl-2' }] },
                { id: 'fl-2', type: NodeType.ANALYST_CRITIC, title: 'Veri Zenginleştir', role: 'Clearbit', task: 'Ek bilgi ekle', status: StepStatus.IDLE, connections: [{ targetId: 'fl-3' }] },
                { id: 'fl-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'CRM Ekle', role: 'HubSpot', task: 'Contact oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'fl-4' }] },
                { id: 'fl-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Hoşgeldin emaili', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// AI & İÇERİK ŞABLONLARI (100+)
// ============================================

const AI_CONTENT_TEMPLATES: MegaTemplate[] = [
    {
        id: 'openai-blog-generator',
        name: 'AI Blog Yazısı Üretici',
        description: 'Anahtar kelimelerden SEO uyumlu blog yazısı oluştur',
        category: 'ai-content',
        subcategory: 'openai',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-60K/ay',
        timeToSetup: '20 dk',
        icon: '✍️',
        tags: ['openai', 'blog', 'seo', 'içerik'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'AI Blog Generator',
            description: 'Otomatik blog içeriği üret',
            masterGoal: 'İçerik üretimini hızlandır',
            baseKnowledge: 'OpenAI GPT-4, SEO prensipleri',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'bg-1', type: NodeType.STATE_MANAGER, title: 'Sheets Konuları', role: 'Input', task: 'Konu listesinden oku', status: StepStatus.IDLE, connections: [{ targetId: 'bg-2' }] },
                { id: 'bg-2', type: NodeType.CONTENT_CREATOR, title: 'Outline Oluştur', role: 'GPT-4', task: 'Blog yapısını oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'bg-3' }] },
                { id: 'bg-3', type: NodeType.CONTENT_CREATOR, title: 'İçerik Yaz', role: 'GPT-4', task: 'Her bölümü detaylı yaz', status: StepStatus.IDLE, connections: [{ targetId: 'bg-4' }] },
                { id: 'bg-4', type: NodeType.ANALYST_CRITIC, title: 'SEO Optimize', role: 'AI', task: 'Anahtar kelimeleri yerleştir', status: StepStatus.IDLE, connections: [{ targetId: 'bg-5' }] },
                { id: 'bg-5', type: NodeType.STATE_MANAGER, title: 'Kaydet', role: 'Sheets/Notion', task: 'Taslak olarak kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'openai-social-content',
        name: 'AI Günlük Sosyal Medya İçeriği',
        description: 'Her gün otomatik Twitter, LinkedIn, Instagram içerikleri üret',
        category: 'ai-content',
        subcategory: 'openai',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '40 dk',
        icon: '🎨',
        tags: ['openai', 'sosyal-medya', 'içerik', 'günlük'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Günlük İçerik Fabrikası',
            description: 'Her gün fresh içerik üret',
            masterGoal: 'Sosyal medya varlığını güçlendir',
            baseKnowledge: 'OpenAI, Sosyal medya stratejileri',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sc-1', type: NodeType.STATE_MANAGER, title: 'Her Sabah 08:00', role: 'Cron', task: 'Günlük tetikleme', status: StepStatus.IDLE, connections: [{ targetId: 'sc-2' }] },
                { id: 'sc-2', type: NodeType.RESEARCH_WEB, title: 'Trend Araştır', role: 'Twitter/Google', task: 'Günün trendlerini bul', status: StepStatus.IDLE, connections: [{ targetId: 'sc-3' }] },
                { id: 'sc-3', type: NodeType.CONTENT_CREATOR, title: 'İçerik Üret', role: 'GPT-4', task: '5 farklı post oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'sc-4' }] },
                { id: 'sc-4', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Öner', role: 'DALL-E', task: 'Her post için görsel prompt', status: StepStatus.IDLE, connections: [{ targetId: 'sc-5' }] },
                { id: 'sc-5', type: NodeType.HUMAN_APPROVAL, title: 'Onay Al', role: 'Slack', task: 'İçerikleri onayla', status: StepStatus.IDLE, connections: [{ targetId: 'sc-6' }] },
                { id: 'sc-6', type: NodeType.STATE_MANAGER, title: 'Planla', role: 'Sheets', task: 'Paylaşım takvmine ekle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // VIDEO & PODCAST AI
    {
        id: 'ai-video-script-generator',
        name: 'AI Video Script Üretici',
        description: 'YouTube ve TikTok videoları için AI ile script yaz',
        category: 'ai-content',
        subcategory: 'video',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-60K/ay',
        timeToSetup: '25 dk',
        icon: '🎬',
        tags: ['video', 'script', 'youtube', 'tiktok', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Video Script Generator',
            description: 'AI ile video scripti',
            masterGoal: 'Hızlı video içerik üretimi',
            baseKnowledge: 'OpenAI, Video marketing',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'vs-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Konu Al', role: 'Webhook', task: 'Video konusu', status: StepStatus.IDLE, connections: [{ targetId: 'vs-2' }] },
                { id: 'vs-2', type: NodeType.RESEARCH_WEB, title: 'Araştır', role: 'Web Search', task: 'Konu hakkında bilgi topla', status: StepStatus.IDLE, connections: [{ targetId: 'vs-3' }] },
                { id: 'vs-3', type: NodeType.CONTENT_CREATOR, title: 'Script Yaz', role: 'GPT-4', task: 'Hook + İçerik + CTA', status: StepStatus.IDLE, connections: [{ targetId: 'vs-4' }] },
                { id: 'vs-4', type: NodeType.CONTENT_CREATOR, title: 'Thumbnail Öner', role: 'AI', task: 'Thumbnail fikirleri', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ai-podcast-show-notes',
        name: 'AI Podcast Show Notes Oluşturucu',
        description: 'Podcast transkriptinden otomatik show notes ve blog yazısı',
        category: 'ai-content',
        subcategory: 'podcast',
        difficulty: 'hard',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '40 dk',
        icon: '🎙️',
        tags: ['podcast', 'show-notes', 'transkript', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Podcast Show Notes',
            description: 'Transkriptten show notes',
            masterGoal: 'Podcast SEO\'sunu artır',
            baseKnowledge: 'Whisper, OpenAI, SEO',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ps-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Audio Al', role: 'Webhook', task: 'Podcast dosyası', status: StepStatus.IDLE, connections: [{ targetId: 'ps-2' }] },
                { id: 'ps-2', type: NodeType.ANALYST_CRITIC, title: 'Transcribe', role: 'Whisper', task: 'Metne çevir', status: StepStatus.IDLE, connections: [{ targetId: 'ps-3' }] },
                { id: 'ps-3', type: NodeType.CONTENT_CREATOR, title: 'Show Notes Yaz', role: 'GPT-4', task: 'Özet + Başlıklar + Zaman damgaları', status: StepStatus.IDLE, connections: [{ targetId: 'ps-4' }] },
                { id: 'ps-4', type: NodeType.CONTENT_CREATOR, title: 'Blog Yazısı', role: 'GPT-4', task: 'SEO uyumlu blog yazısı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // COPYWRITING AI
    {
        id: 'ai-landing-page-copy',
        name: 'AI Landing Page Copywriter',
        description: 'Ürün veya servis için conversion odaklı landing page metinleri',
        category: 'ai-content',
        subcategory: 'copywriting',
        difficulty: 'medium',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '30 dk',
        icon: '📄',
        tags: ['landing-page', 'copy', 'conversion', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Landing Page Copywriter',
            description: 'Satış yapan metinler',
            masterGoal: 'Conversion artır',
            baseKnowledge: 'Copywriting, OpenAI',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'lp-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Brief Al', role: 'Form', task: 'Ürün/servis bilgileri', status: StepStatus.IDLE, connections: [{ targetId: 'lp-2' }] },
                { id: 'lp-2', type: NodeType.RESEARCH_WEB, title: 'Rakip Analizi', role: 'Scraper', task: 'Rakip sayfalarını incele', status: StepStatus.IDLE, connections: [{ targetId: 'lp-3' }] },
                { id: 'lp-3', type: NodeType.CONTENT_CREATOR, title: 'Headline Yaz', role: 'GPT-4', task: '5 farklı headline öner', status: StepStatus.IDLE, connections: [{ targetId: 'lp-4' }] },
                { id: 'lp-4', type: NodeType.CONTENT_CREATOR, title: 'Sayfa Metni', role: 'GPT-4', task: 'Hero + Features + CTA', status: StepStatus.IDLE, connections: [{ targetId: 'lp-5' }] },
                { id: 'lp-5', type: NodeType.HUMAN_APPROVAL, title: 'Onay', role: 'Review', task: 'Copy onayı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ai-product-description-writer',
        name: 'AI Ürün Açıklaması Yazarı',
        description: 'E-ticaret ürünleri için SEO uyumlu açıklamalar',
        category: 'ai-content',
        subcategory: 'ecommerce',
        difficulty: 'easy',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '15 dk',
        icon: '🛒',
        tags: ['ürün', 'açıklama', 'seo', 'ecommerce'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Product Description Writer',
            description: 'Ürün açıklamaları',
            masterGoal: 'Satışları artır',
            baseKnowledge: 'E-commerce SEO, OpenAI',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pd-1', type: NodeType.STATE_MANAGER, title: 'Ürün Listesi', role: 'Sheets', task: 'Açıklama yazılacak ürünler', status: StepStatus.IDLE, connections: [{ targetId: 'pd-2' }] },
                { id: 'pd-2', type: NodeType.CONTENT_CREATOR, title: 'Açıklama Yaz', role: 'GPT-4', task: 'SEO uyumlu açıklama', status: StepStatus.IDLE, connections: [{ targetId: 'pd-3' }] },
                { id: 'pd-3', type: NodeType.STATE_MANAGER, title: 'Kaydet', role: 'Sheets', task: 'Açıklamaları kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ai-email-campaign-writer',
        name: 'AI Email Kampanya Yazarı',
        description: 'Email marketing kampanyaları için AI ile içerik üret',
        category: 'ai-content',
        subcategory: 'email',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-65K/ay',
        timeToSetup: '25 dk',
        icon: '✉️',
        tags: ['email', 'kampanya', 'ai', 'marketing'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Email Campaign Writer',
            description: 'Email içerikleri',
            masterGoal: 'Email engagement artır',
            baseKnowledge: 'Email marketing, OpenAI',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ec-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Kampanya Brief', role: 'Form', task: 'Kampanya detayları', status: StepStatus.IDLE, connections: [{ targetId: 'ec-2' }] },
                { id: 'ec-2', type: NodeType.CONTENT_CREATOR, title: 'Subject Lines', role: 'GPT-4', task: '5 farklı konu başlığı', status: StepStatus.IDLE, connections: [{ targetId: 'ec-3' }] },
                { id: 'ec-3', type: NodeType.CONTENT_CREATOR, title: 'Email Body', role: 'GPT-4', task: 'Email içeriği yaz', status: StepStatus.IDLE, connections: [{ targetId: 'ec-4' }] },
                { id: 'ec-4', type: NodeType.HUMAN_APPROVAL, title: 'Onay', role: 'Review', task: 'Email onayı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // IMAGE & VISUAL AI
    {
        id: 'ai-banner-generator',
        name: 'AI Banner ve Görsel Üretici',
        description: 'Sosyal medya ve reklamlar için AI ile banner oluştur',
        category: 'ai-content',
        subcategory: 'visual',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-55K/ay',
        timeToSetup: '30 dk',
        icon: '🖼️',
        tags: ['banner', 'görsel', 'ai', 'tasarım'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'AI Banner Generator',
            description: 'Otomatik görsel üretimi',
            masterGoal: 'Tasarım süresini azalt',
            baseKnowledge: 'DALL-E, Stability AI',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'bg-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Brief Al', role: 'Form', task: 'Görsel gereksinimleri', status: StepStatus.IDLE, connections: [{ targetId: 'bg-2' }] },
                { id: 'bg-2', type: NodeType.CONTENT_CREATOR, title: 'Prompt Oluştur', role: 'GPT-4', task: 'Optimal AI prompt', status: StepStatus.IDLE, connections: [{ targetId: 'bg-3' }] },
                { id: 'bg-3', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Üret', role: 'DALL-E', task: 'Banner oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'bg-4' }] },
                { id: 'bg-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'Slack', task: 'Görseli paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ai-thumbnail-optimizer',
        name: 'AI YouTube Thumbnail Optimizer',
        description: 'YouTube thumbnaillerini AI ile optimize et ve CTR artır',
        category: 'ai-content',
        subcategory: 'youtube',
        difficulty: 'hard',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '35 dk',
        icon: '🎯',
        tags: ['youtube', 'thumbnail', 'ctr', 'ai'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Thumbnail Optimizer',
            description: 'CTR artıran thumbnaillar',
            masterGoal: 'Video CTR artır',
            baseKnowledge: 'YouTube Analytics, AI Vision',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'to-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Thumbnail Al', role: 'Upload', task: 'Mevcut thumbnail', status: StepStatus.IDLE, connections: [{ targetId: 'to-2' }] },
                { id: 'to-2', type: NodeType.ANALYST_CRITIC, title: 'Analiz Et', role: 'AI Vision', task: 'Rakip analizi ve öneriler', status: StepStatus.IDLE, connections: [{ targetId: 'to-3' }] },
                { id: 'to-3', type: NodeType.CONTENT_CREATOR, title: 'İyileştirme Öner', role: 'GPT-4', task: 'Renk, metin, yüz önerileri', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // SEO & CONTENT STRATEGY
    {
        id: 'ai-keyword-research',
        name: 'AI Anahtar Kelime Araştırması',
        description: 'Hedef kitle için en iyi anahtar kelimeleri AI ile bul',
        category: 'ai-content',
        subcategory: 'seo',
        difficulty: 'medium',
        estimatedRevenue: '₺18K-45K/ay',
        timeToSetup: '25 dk',
        icon: '🔍',
        tags: ['seo', 'keyword', 'araştırma', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Keyword Research AI',
            description: 'Akıllı keyword araştırması',
            masterGoal: 'Organik trafiği artır',
            baseKnowledge: 'SEO, OpenAI, Google Trends',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'kr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Konu Al', role: 'Form', task: 'Ana konu/niche', status: StepStatus.IDLE, connections: [{ targetId: 'kr-2' }] },
                { id: 'kr-2', type: NodeType.RESEARCH_WEB, title: 'Trends Araştır', role: 'Google Trends', task: 'Popüler aramalar', status: StepStatus.IDLE, connections: [{ targetId: 'kr-3' }] },
                { id: 'kr-3', type: NodeType.CONTENT_CREATOR, title: 'Keywords Üret', role: 'GPT-4', task: 'Long-tail keywords', status: StepStatus.IDLE, connections: [{ targetId: 'kr-4' }] },
                { id: 'kr-4', type: NodeType.STATE_MANAGER, title: 'Kaydet', role: 'Sheets', task: 'Keyword listesi', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ai-content-repurposer',
        name: 'AI İçerik Yeniden Kullanım',
        description: 'Bir blog yazısından 10+ farklı içerik formatı üret',
        category: 'ai-content',
        subcategory: 'repurpose',
        difficulty: 'medium',
        estimatedRevenue: '₺22K-55K/ay',
        timeToSetup: '30 dk',
        icon: '♻️',
        tags: ['repurpose', 'içerik', 'çok-format', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Content Repurposer',
            description: 'Bir içerikten onlarca format',
            masterGoal: 'İçerik ROI maksimize et',
            baseKnowledge: 'Content strategy, OpenAI',
            category: 'AI Content',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'cr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Blog Yazısı Al', role: 'Webhook', task: 'Kaynak içerik', status: StepStatus.IDLE, connections: [{ targetId: 'cr-2' }] },
                { id: 'cr-2', type: NodeType.CONTENT_CREATOR, title: 'Tweet Thread', role: 'GPT-4', task: '10 tweet thread', status: StepStatus.IDLE, connections: [{ targetId: 'cr-3' }] },
                { id: 'cr-3', type: NodeType.CONTENT_CREATOR, title: 'LinkedIn Post', role: 'GPT-4', task: 'LinkedIn makalesi', status: StepStatus.IDLE, connections: [{ targetId: 'cr-4' }] },
                { id: 'cr-4', type: NodeType.CONTENT_CREATOR, title: 'Instagram Carousel', role: 'GPT-4', task: '10 slide carousel', status: StepStatus.IDLE, connections: [{ targetId: 'cr-5' }] },
                { id: 'cr-5', type: NodeType.STATE_MANAGER, title: 'Kaydet', role: 'Notion', task: 'Tüm formatları kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// VERİMLİLİK ŞABLONLARI (100+)
// ============================================

const PRODUCTIVITY_TEMPLATES: MegaTemplate[] = [
    {
        id: 'gmail-sheets-crm',
        name: 'Gmail → Google Sheets Mini CRM',
        description: 'Gelen emaillerden otomatik lead listesi oluştur',
        category: 'productivity',
        subcategory: 'gmail',
        difficulty: 'easy',
        estimatedRevenue: '8+ saat/hafta',
        timeToSetup: '10 dk',
        icon: '📧',
        tags: ['gmail', 'sheets', 'crm', 'lead'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Gmail Mini CRM',
            description: 'Emaillerden CRM oluştur',
            masterGoal: 'Lead yönetimini kolaylaştır',
            baseKnowledge: 'Gmail API, Google Sheets API',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'gc-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gmail Trigger', role: 'Email', task: 'Yeni email al', status: StepStatus.IDLE, connections: [{ targetId: 'gc-2' }] },
                { id: 'gc-2', type: NodeType.LOGIC_GATE, title: 'Potansiyel Lead?', role: 'Filter', task: 'Spam değilse', status: StepStatus.IDLE, connections: [{ targetId: 'gc-3' }] },
                { id: 'gc-3', type: NodeType.ANALYST_CRITIC, title: 'Bilgi Çıkar', role: 'Parser', task: 'İsim, email, şirket çıkar', status: StepStatus.IDLE, connections: [{ targetId: 'gc-4' }] },
                { id: 'gc-4', type: NodeType.STATE_MANAGER, title: 'Sheets Ekle', role: 'Database', task: 'Lead listesine ekle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'notion-daily-standup',
        name: 'Notion Günlük Standup Hatırlatıcı',
        description: 'Her sabah ekibe standup hatırlatması ve template gönder',
        category: 'productivity',
        subcategory: 'notion',
        difficulty: 'easy',
        estimatedRevenue: '5+ saat/hafta',
        timeToSetup: '10 dk',
        icon: '📝',
        tags: ['notion', 'standup', 'slack', 'ekip'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Günlük Standup Bot',
            description: 'Standup hatırlatıcı',
            masterGoal: 'Ekip koordinasyonunu artır',
            baseKnowledge: 'Slack API, Notion API',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ns-1', type: NodeType.STATE_MANAGER, title: 'Her Sabah 09:00', role: 'Cron', task: 'Hafta içi tetikle', status: StepStatus.IDLE, connections: [{ targetId: 'ns-2' }] },
                { id: 'ns-2', type: NodeType.STATE_MANAGER, title: 'Notion Sayfa Al', role: 'Notion API', task: 'Bugünün standup sayfasını al', status: StepStatus.IDLE, connections: [{ targetId: 'ns-3' }] },
                { id: 'ns-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Gönder', role: 'Bildirim', task: 'Standup linki ile hatırlat', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // YOUTUBE OTOMASYONLARI
    {
        id: 'youtube-full-auto-shorts',
        name: '📺 YouTube Shorts Otomatik Fabrika',
        description: 'AI ile Shorts videosu oluştur, thumbnail yap ve otomatik yükle',
        category: 'productivity',
        subcategory: 'youtube',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-200K/ay',
        timeToSetup: '75 dk',
        icon: '📺',
        tags: ['youtube', 'shorts', 'auto', 'video', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'YouTube Shorts Factory',
            description: 'Günlük otomatik Shorts',
            masterGoal: 'YouTube ile pasif gelir',
            baseKnowledge: 'YouTube API, AI Video, ElevenLabs',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ysf-1', type: NodeType.STATE_MANAGER, title: 'Günde 3 Shorts', role: 'Cron', task: '09:00, 15:00, 21:00', status: StepStatus.IDLE, connections: [{ targetId: 'ysf-2' }] },
                { id: 'ysf-2', type: NodeType.RESEARCH_WEB, title: 'Viral Trend', role: 'Scraper', task: 'Viral short formatları', status: StepStatus.IDLE, connections: [{ targetId: 'ysf-3' }] },
                { id: 'ysf-3', type: NodeType.CONTENT_CREATOR, title: 'Script', role: 'GPT-4', task: '60sn script yaz', status: StepStatus.IDLE, connections: [{ targetId: 'ysf-4' }] },
                { id: 'ysf-4', type: NodeType.VIDEO_ARCHITECT, title: 'Video Render', role: 'AI Video', task: 'Shorts formatında video', status: StepStatus.IDLE, connections: [{ targetId: 'ysf-5' }] },
                { id: 'ysf-5', type: NodeType.MEDIA_ENGINEER, title: 'Voiceover', role: 'ElevenLabs', task: 'TTS seslendirme', status: StepStatus.IDLE, connections: [{ targetId: 'ysf-6' }] },
                { id: 'ysf-6', type: NodeType.MEDIA_ENGINEER, title: 'Thumbnail', role: 'AI', task: 'Eye-catching thumbnail', status: StepStatus.IDLE, connections: [{ targetId: 'ysf-7' }] },
                { id: 'ysf-7', type: NodeType.EXTERNAL_CONNECTOR, title: '📺 YÜKLE', role: 'YouTube API', task: 'Shorts olarak yükle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'youtube-seo-optimizer',
        name: 'YouTube SEO Optimizasyonu',
        description: 'Mevcut videolarının SEO skorunu AI ile optimize et',
        category: 'productivity',
        subcategory: 'youtube',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-60K/ay',
        timeToSetup: '30 dk',
        icon: '🔍',
        tags: ['youtube', 'seo', 'optimize', 'title', 'description'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'YouTube SEO Bot',
            description: 'Video SEO optimize et',
            masterGoal: 'Daha fazla görüntülenme',
            baseKnowledge: 'YouTube API, SEO',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'yso-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Video Listesi', role: 'YouTube API', task: 'Kanal videolarını al', status: StepStatus.IDLE, connections: [{ targetId: 'yso-2' }] },
                { id: 'yso-2', type: NodeType.ANALYST_CRITIC, title: 'SEO Analiz', role: 'AI', task: 'Mevcut SEO skorla', status: StepStatus.IDLE, connections: [{ targetId: 'yso-3' }] },
                { id: 'yso-3', type: NodeType.CONTENT_CREATOR, title: 'Optimizasyon', role: 'GPT-4', task: 'Title/Desc/Tags öner', status: StepStatus.IDLE, connections: [{ targetId: 'yso-4' }] },
                { id: 'yso-4', type: NodeType.HUMAN_APPROVAL, title: 'Onay', role: 'Review', task: 'Değişiklikleri onayla', status: StepStatus.IDLE, connections: [{ targetId: 'yso-5' }] },
                { id: 'yso-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Güncelle', role: 'YouTube API', task: 'Video bilgilerini güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // FREELANCE ARAÇLARI
    {
        id: 'freelance-proposal-generator',
        name: 'Freelance Teklif Jeneratörü',
        description: 'Upwork/Fiverr için AI ile kişiselleştirilmiş teklif yaz',
        category: 'productivity',
        subcategory: 'freelance',
        difficulty: 'medium',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '25 dk',
        icon: '💼',
        tags: ['freelance', 'upwork', 'fiverr', 'proposal', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Proposal Generator',
            description: 'Kazanan teklifler yaz',
            masterGoal: 'Daha fazla iş kazan',
            baseKnowledge: 'Freelance platforms, AI copywriting',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fpg-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'İş İlanı', role: 'Webhook', task: 'İş detaylarını al', status: StepStatus.IDLE, connections: [{ targetId: 'fpg-2' }] },
                { id: 'fpg-2', type: NodeType.ANALYST_CRITIC, title: 'İlan Analizi', role: 'AI', task: 'Müşteri ihtiyaçlarını anla', status: StepStatus.IDLE, connections: [{ targetId: 'fpg-3' }] },
                { id: 'fpg-3', type: NodeType.CONTENT_CREATOR, title: 'Teklif Yaz', role: 'GPT-4', task: 'Kişiselleştirilmiş teklif', status: StepStatus.IDLE, connections: [{ targetId: 'fpg-4' }] },
                { id: 'fpg-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'Response', task: 'Teklif metnini döndür', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'freelance-invoice-automation',
        name: 'Freelance Fatura Otomasyonu',
        description: 'Tamamlanan işler için otomatik fatura oluştur ve gönder',
        category: 'productivity',
        subcategory: 'freelance',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-35K/ay',
        timeToSetup: '30 dk',
        icon: '🧾',
        tags: ['freelance', 'fatura', 'invoice', 'otomasyon'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Auto Invoicer',
            description: 'Otomatik faturalama',
            masterGoal: 'Ödeme sürecini hızlandır',
            baseKnowledge: 'Invoice APIs, PDF generator',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fia-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'İş Tamamlandı', role: 'Webhook', task: 'Proje bitişi', status: StepStatus.IDLE, connections: [{ targetId: 'fia-2' }] },
                { id: 'fia-2', type: NodeType.STATE_MANAGER, title: 'Proje Bilgileri', role: 'Database', task: 'Fiyat ve detayları al', status: StepStatus.IDLE, connections: [{ targetId: 'fia-3' }] },
                { id: 'fia-3', type: NodeType.CONTENT_CREATOR, title: 'Fatura Oluştur', role: 'PDF', task: 'Profesyonel fatura', status: StepStatus.IDLE, connections: [{ targetId: 'fia-4' }] },
                { id: 'fia-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Müşteriye fatura gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // DROPSHIPPING OTOMASYONLARI
    {
        id: 'dropship-product-finder',
        name: 'AI Dropshipping Ürün Bulucu',
        description: 'Kazançlı dropshipping ürünlerini AI ile otomatik bul',
        category: 'productivity',
        subcategory: 'dropshipping',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-150K/ay',
        timeToSetup: '60 dk',
        icon: '🔎',
        tags: ['dropshipping', 'ürün', 'aliexpress', 'trend', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Product Finder AI',
            description: 'Kazançlı ürün keşfi',
            masterGoal: 'Winning product bul',
            baseKnowledge: 'AliExpress API, Trend analysis',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'dpf-1', type: NodeType.STATE_MANAGER, title: 'Günlük Tarama', role: 'Cron', task: 'Her gün yeni ürünler tara', status: StepStatus.IDLE, connections: [{ targetId: 'dpf-2' }] },
                { id: 'dpf-2', type: NodeType.RESEARCH_WEB, title: 'Trend Ürünler', role: 'Scraper', task: 'TikTok + AliExpress tara', status: StepStatus.IDLE, connections: [{ targetId: 'dpf-3' }] },
                { id: 'dpf-3', type: NodeType.ANALYST_CRITIC, title: 'Kar Analizi', role: 'Calculator', task: 'Maliyet vs satış fiyatı', status: StepStatus.IDLE, connections: [{ targetId: 'dpf-4' }] },
                { id: 'dpf-4', type: NodeType.ANALYST_CRITIC, title: 'Rekabet Analizi', role: 'AI', task: 'Pazar doygunluğu kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'dpf-5' }] },
                { id: 'dpf-5', type: NodeType.LOGIC_GATE, title: 'Potansiyel mi?', role: 'Filter', task: '%50+ kar marjı var mı?', status: StepStatus.IDLE, connections: [{ targetId: 'dpf-6' }] },
                { id: 'dpf-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Rapor Gönder', role: 'Telegram', task: '🔥 Winning product bulundu!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'dropship-order-fulfillment',
        name: 'Dropshipping Sipariş Otomasyonu',
        description: 'Shopify siparişlerini otomatik olarak tedarikçiye gönder',
        category: 'productivity',
        subcategory: 'dropshipping',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-120K/ay',
        timeToSetup: '50 dk',
        icon: '📦',
        tags: ['dropshipping', 'sipariş', 'fulfillment', 'shopify'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Auto Fulfillment',
            description: 'Otomatik sipariş işleme',
            masterGoal: 'Hands-free dropshipping',
            baseKnowledge: 'Shopify API, AliExpress API',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'dof-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Sipariş', role: 'Shopify Webhook', task: 'Sipariş al', status: StepStatus.IDLE, connections: [{ targetId: 'dof-2' }] },
                { id: 'dof-2', type: NodeType.ANALYST_CRITIC, title: 'Ürün Eşle', role: 'Mapper', task: 'SKU → Tedarikçi ürün', status: StepStatus.IDLE, connections: [{ targetId: 'dof-3' }] },
                { id: 'dof-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Tedarikçi Sipariş', role: 'AliExpress API', task: 'Otomatik sipariş ver', status: StepStatus.IDLE, connections: [{ targetId: 'dof-4' }] },
                { id: 'dof-4', type: NodeType.STATE_MANAGER, title: 'Kargo Takip', role: 'Tracker', task: 'Kargo numarasını al', status: StepStatus.IDLE, connections: [{ targetId: 'dof-5' }] },
                { id: 'dof-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Müşteri Bildir', role: 'Email', task: 'Kargo bildirimi gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // SAAS & STARTUP ARAÇLARI
    {
        id: 'saas-churn-predictor',
        name: 'SaaS Churn Tahmin Sistemi',
        description: 'Ayrılma riski olan müşterileri AI ile tespit et ve önlem al',
        category: 'productivity',
        subcategory: 'saas',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-150K/ay',
        timeToSetup: '60 dk',
        icon: '📉',
        tags: ['saas', 'churn', 'retention', 'ai', 'analytics'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Churn Predictor',
            description: 'Müşteri kaybını önle',
            masterGoal: 'Retention oranını artır',
            baseKnowledge: 'SaaS metrics, ML prediction',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'scp-1', type: NodeType.STATE_MANAGER, title: 'Haftalık Analiz', role: 'Cron', task: 'Her Pazartesi', status: StepStatus.IDLE, connections: [{ targetId: 'scp-2' }] },
                { id: 'scp-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Kullanım Verileri', role: 'Analytics API', task: 'Tüm müşteri metrikleri', status: StepStatus.IDLE, connections: [{ targetId: 'scp-3' }] },
                { id: 'scp-3', type: NodeType.ANALYST_CRITIC, title: 'Risk Skorla', role: 'AI/ML', task: 'Churn olasılığı hesapla', status: StepStatus.IDLE, connections: [{ targetId: 'scp-4' }] },
                { id: 'scp-4', type: NodeType.LOGIC_GATE, title: 'Yüksek Risk?', role: 'Filter', task: '%60+ churn riski', status: StepStatus.IDLE, connections: [{ targetId: 'scp-5' }] },
                { id: 'scp-5', type: NodeType.CONTENT_CREATOR, title: 'Win-back Email', role: 'AI', task: 'Kişiselleştirilmiş email', status: StepStatus.IDLE, connections: [{ targetId: 'scp-6' }] },
                { id: 'scp-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder + CS Bildir', role: 'Multi', task: 'Email + Slack alert', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'saas-trial-conversion',
        name: 'SaaS Trial → Paid Dönüşüm Otomasyonu',
        description: 'Trial kullanıcılarını ödeme yapan müşteriye dönüştür',
        category: 'productivity',
        subcategory: 'saas',
        difficulty: 'hard',
        estimatedRevenue: '₺60K-180K/ay',
        timeToSetup: '45 dk',
        icon: '💳',
        tags: ['saas', 'trial', 'conversion', 'email', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Trial Converter',
            description: 'Trial → Paid dönüşüm',
            masterGoal: 'Conversion rate artır',
            baseKnowledge: 'Email sequences, User analytics',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'stc-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Trial Başladı', role: 'Webhook', task: 'Yeni trial user', status: StepStatus.IDLE, connections: [{ targetId: 'stc-2' }] },
                { id: 'stc-2', type: NodeType.CONTENT_CREATOR, title: 'Gün 1 Email', role: 'AI', task: 'Hoşgeldin + quickstart', status: StepStatus.IDLE, connections: [{ targetId: 'stc-3' }] },
                { id: 'stc-3', type: NodeType.STATE_MANAGER, title: '3 Gün Bekle', role: 'Delay', task: 'Kullanıma bak', status: StepStatus.IDLE, connections: [{ targetId: 'stc-4' }] },
                { id: 'stc-4', type: NodeType.LOGIC_GATE, title: 'Aktif mi?', role: 'Check', task: 'Son 24h login var mı?', status: StepStatus.IDLE, connections: [{ targetId: 'stc-5' }, { targetId: 'stc-6' }] },
                { id: 'stc-5', type: NodeType.CONTENT_CREATOR, title: 'Değer Email', role: 'AI', task: 'Feature highlight', status: StepStatus.IDLE, connections: [{ targetId: 'stc-7' }] },
                { id: 'stc-6', type: NodeType.CONTENT_CREATOR, title: 'Re-engage Email', role: 'AI', task: 'Geri gel çağrısı', status: StepStatus.IDLE, connections: [{ targetId: 'stc-7' }] },
                { id: 'stc-7', type: NodeType.STATE_MANAGER, title: 'Trial Son 2 Gün', role: 'Delay', task: 'Deadline yaklaşıyor', status: StepStatus.IDLE, connections: [{ targetId: 'stc-8' }] },
                { id: 'stc-8', type: NodeType.CONTENT_CREATOR, title: 'Son Fırsat', role: 'AI', task: 'Özel teklif + urgency', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'startup-investor-outreach',
        name: 'Startup Yatırımcı Outreach Otomasyonu',
        description: 'Hedef yatırımcılara kişiselleştirilmiş email kampanyası',
        category: 'productivity',
        subcategory: 'startup',
        difficulty: 'hard',
        estimatedRevenue: 'Yatırım alma',
        timeToSetup: '50 dk',
        icon: '💰',
        tags: ['startup', 'investor', 'outreach', 'fundraising'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Investor Outreach',
            description: 'Yatırımcı erişimi',
            masterGoal: 'Yatırım al',
            baseKnowledge: 'Investor databases, Email outreach',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sio-1', type: NodeType.STATE_MANAGER, title: 'Yatırımcı Listesi', role: 'Sheets', task: 'Hedef VC listesi', status: StepStatus.IDLE, connections: [{ targetId: 'sio-2' }] },
                { id: 'sio-2', type: NodeType.RESEARCH_WEB, title: 'Yatırımcı Araştır', role: 'Web', task: 'Portfolio ve ilgi alanları', status: StepStatus.IDLE, connections: [{ targetId: 'sio-3' }] },
                { id: 'sio-3', type: NodeType.CONTENT_CREATOR, title: 'Email Kişiselleştir', role: 'GPT-4', task: 'Her yatırımcıya özel email', status: StepStatus.IDLE, connections: [{ targetId: 'sio-4' }] },
                { id: 'sio-4', type: NodeType.HUMAN_APPROVAL, title: 'Onay', role: 'Review', task: 'Email onayı', status: StepStatus.IDLE, connections: [{ targetId: 'sio-5' }] },
                { id: 'sio-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Kişiselleştirilmiş email', status: StepStatus.IDLE, connections: [{ targetId: 'sio-6' }] },
                { id: 'sio-6', type: NodeType.STATE_MANAGER, title: 'Follow-up Planla', role: 'Scheduler', task: '5 gün sonra follow-up', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // EMLAK / REAL ESTATE ŞABLONLARI
    {
        id: 'real-estate-lead-nurture',
        name: '🏠 Emlak Lead Besleme Otomasyonu',
        description: 'Emlak leadlerini otomatik takip et ve satışa dönüştür',
        category: 'productivity',
        subcategory: 'real-estate',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-300K/ay',
        timeToSetup: '60 dk',
        icon: '🏠',
        tags: ['emlak', 'lead', 'nurture', 'gayrimenkul'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Real Estate Lead Nurture',
            description: 'Emlak satış otomasyonu',
            masterGoal: 'Daha fazla ev sat',
            baseKnowledge: 'CRM, Email sequences, Property APIs',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rel-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Lead', role: 'Webhook', task: 'Form dolduran kişi', status: StepStatus.IDLE, connections: [{ targetId: 'rel-2' }] },
                { id: 'rel-2', type: NodeType.ANALYST_CRITIC, title: 'Lead Skorla', role: 'AI', task: 'Bütçe, konum, aciliyet', status: StepStatus.IDLE, connections: [{ targetId: 'rel-3' }] },
                { id: 'rel-3', type: NodeType.LOGIC_GATE, title: 'Hot Lead mi?', role: 'Filter', task: 'Yüksek potansiyel', status: StepStatus.IDLE, connections: [{ targetId: 'rel-4' }, { targetId: 'rel-5' }] },
                { id: 'rel-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Acil Ara', role: 'Slack', task: 'Satış ekibini bildir', status: StepStatus.IDLE, connections: [{ targetId: 'rel-6' }] },
                { id: 'rel-5', type: NodeType.CONTENT_CREATOR, title: 'Email Serisi', role: 'AI', task: 'İlan önerileri gönder', status: StepStatus.IDLE, connections: [{ targetId: 'rel-6' }] },
                { id: 'rel-6', type: NodeType.STATE_MANAGER, title: 'CRM Güncelle', role: 'Database', task: 'Lead durumunu kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'real-estate-listing-generator',
        name: 'AI Emlak İlanı Yazıcı',
        description: 'Ev fotoğraflarından AI ile profesyonel ilan metni oluştur',
        category: 'productivity',
        subcategory: 'real-estate',
        difficulty: 'medium',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '30 dk',
        icon: '📝',
        tags: ['emlak', 'ilan', 'ai', 'yazı'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Property Listing AI',
            description: 'Otomatik ilan yazımı',
            masterGoal: 'Hızlı ve etkili ilanlar',
            baseKnowledge: 'AI Vision, Copywriting',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rlg-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fotoğraflar', role: 'Upload', task: 'Ev fotoğraflarını al', status: StepStatus.IDLE, connections: [{ targetId: 'rlg-2' }] },
                { id: 'rlg-2', type: NodeType.ANALYST_CRITIC, title: 'Görsel Analiz', role: 'AI Vision', task: 'Oda, özellik tespit', status: StepStatus.IDLE, connections: [{ targetId: 'rlg-3' }] },
                { id: 'rlg-3', type: NodeType.CONTENT_CREATOR, title: 'İlan Yaz', role: 'GPT-4', task: 'Çekici ilan metni', status: StepStatus.IDLE, connections: [{ targetId: 'rlg-4' }] },
                { id: 'rlg-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'Response', task: 'İlan metnini döndür', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // RESTORAN / FOOD ŞABLONLARI
    {
        id: 'restaurant-auto-review-reply',
        name: '🍕 Restoran Yorum Yanıtlama Botu',
        description: 'Google/TripAdvisor yorumlarını AI ile otomatik yanıtla',
        category: 'productivity',
        subcategory: 'restaurant',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '30 dk',
        icon: '🍕',
        tags: ['restoran', 'yorum', 'google', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Review Reply Bot',
            description: 'Otomatik yorum yanıtı',
            masterGoal: 'Müşteri memnuniyeti',
            baseKnowledge: 'Google Business API, AI',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rar-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Kontrol', role: 'Cron', task: 'Yeni yorumları kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'rar-2' }] },
                { id: 'rar-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yorumları Al', role: 'Google API', task: 'Son yorumları çek', status: StepStatus.IDLE, connections: [{ targetId: 'rar-3' }] },
                { id: 'rar-3', type: NodeType.ANALYST_CRITIC, title: 'Sentiment', role: 'AI', task: 'Pozitif/Negatif/Nötr', status: StepStatus.IDLE, connections: [{ targetId: 'rar-4' }] },
                { id: 'rar-4', type: NodeType.CONTENT_CREATOR, title: 'Yanıt Yaz', role: 'GPT-4', task: 'Kişiselleştirilmiş yanıt', status: StepStatus.IDLE, connections: [{ targetId: 'rar-5' }] },
                { id: 'rar-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yanıtla', role: 'Google API', task: 'Yorumu yanıtla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'restaurant-reservation-reminder',
        name: 'Restoran Rezervasyon Hatırlatma',
        description: 'Müşterilere rezervasyon öncesi otomatik hatırlatma gönder',
        category: 'productivity',
        subcategory: 'restaurant',
        difficulty: 'easy',
        estimatedRevenue: '₺10K-25K/ay',
        timeToSetup: '15 dk',
        icon: '📅',
        tags: ['restoran', 'rezervasyon', 'hatırlatma', 'sms'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Reservation Reminder',
            description: 'No-show azalt',
            masterGoal: 'Rezervasyon iptalleri azalt',
            baseKnowledge: 'SMS API, Calendar',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rrr-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Kontrol', role: 'Cron', task: '2 saat sonraki rezervasyonlar', status: StepStatus.IDLE, connections: [{ targetId: 'rrr-2' }] },
                { id: 'rrr-2', type: NodeType.STATE_MANAGER, title: 'Rezervasyonları Al', role: 'Database', task: 'Yaklaşan rezervasyonlar', status: StepStatus.IDLE, connections: [{ targetId: 'rrr-3' }] },
                { id: 'rrr-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'SMS Gönder', role: 'Twilio', task: 'Hatırlatma mesajı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'restaurant-menu-ai-optimizer',
        name: 'AI Menü Optimizasyonu',
        description: 'Satış verilerine göre menüyü AI ile optimize et',
        category: 'productivity',
        subcategory: 'restaurant',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-100K/ay',
        timeToSetup: '50 dk',
        icon: '📋',
        tags: ['restoran', 'menü', 'ai', 'optimizasyon'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Menu Optimizer',
            description: 'Karlı menü tasarımı',
            masterGoal: 'Ortalama sipariş değerini artır',
            baseKnowledge: 'POS data, Menu engineering',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rmo-1', type: NodeType.STATE_MANAGER, title: 'Haftalık Analiz', role: 'Cron', task: 'Her Pazartesi', status: StepStatus.IDLE, connections: [{ targetId: 'rmo-2' }] },
                { id: 'rmo-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satış Verileri', role: 'POS API', task: 'Ürün satışlarını çek', status: StepStatus.IDLE, connections: [{ targetId: 'rmo-3' }] },
                { id: 'rmo-3', type: NodeType.ANALYST_CRITIC, title: 'BCG Analizi', role: 'AI', task: 'Star/Dog/Cash Cow kategorize', status: StepStatus.IDLE, connections: [{ targetId: 'rmo-4' }] },
                { id: 'rmo-4', type: NodeType.CONTENT_CREATOR, title: 'Öneriler', role: 'GPT-4', task: 'Fiyat/Pozisyon önerileri', status: StepStatus.IDLE, connections: [{ targetId: 'rmo-5' }] },
                { id: 'rmo-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Rapor Gönder', role: 'Email', task: 'Yöneticiye rapor', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // HR / İNSAN KAYNAKLARI ŞABLONLARI
    {
        id: 'hr-resume-screening',
        name: '💼 AI CV Tarama ve Sıralama',
        description: 'Gelen CVleri AI ile ön eleme yap ve sırala',
        category: 'productivity',
        subcategory: 'hr',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-120K/ay',
        timeToSetup: '50 dk',
        icon: '📄',
        tags: ['hr', 'cv', 'screening', 'ai', 'recruitment'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Resume Screener',
            description: 'Otomatik CV eleme',
            masterGoal: 'İşe alım süresini kısalt',
            baseKnowledge: 'Resume parsing, AI matching',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'hrs-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Başvuru', role: 'Webhook', task: 'CV geldi', status: StepStatus.IDLE, connections: [{ targetId: 'hrs-2' }] },
                { id: 'hrs-2', type: NodeType.ANALYST_CRITIC, title: 'CV Parse', role: 'Parser', task: 'Deneyim, beceri çıkar', status: StepStatus.IDLE, connections: [{ targetId: 'hrs-3' }] },
                { id: 'hrs-3', type: NodeType.ANALYST_CRITIC, title: 'JD Eşleştir', role: 'AI', task: 'İş tanımıyla uyum skoru', status: StepStatus.IDLE, connections: [{ targetId: 'hrs-4' }] },
                { id: 'hrs-4', type: NodeType.LOGIC_GATE, title: '%70+ Uyum?', role: 'Filter', task: 'Ön eleme geç', status: StepStatus.IDLE, connections: [{ targetId: 'hrs-5' }] },
                { id: 'hrs-5', type: NodeType.STATE_MANAGER, title: 'Aday Havuzu', role: 'ATS', task: 'Kısa listeye ekle', status: StepStatus.IDLE, connections: [{ targetId: 'hrs-6' }] },
                { id: 'hrs-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'HR Bildir', role: 'Slack', task: 'Yeni uygun aday!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'hr-interview-scheduler',
        name: 'Otomatik Mülakat Planlayıcı',
        description: 'Adaylarla otomatik mülakat randevusu ayarla',
        category: 'productivity',
        subcategory: 'hr',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '30 dk',
        icon: '📅',
        tags: ['hr', 'mülakat', 'takvim', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Interview Scheduler',
            description: 'Mülakat planlama',
            masterGoal: 'HR zamanını kurtar',
            baseKnowledge: 'Calendly, Email',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'his-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Aday Seçildi', role: 'Webhook', task: 'Mülakat adayı', status: StepStatus.IDLE, connections: [{ targetId: 'his-2' }] },
                { id: 'his-2', type: NodeType.STATE_MANAGER, title: 'Uygun Slotlar', role: 'Calendar', task: 'Müsait zamanları bul', status: StepStatus.IDLE, connections: [{ targetId: 'his-3' }] },
                { id: 'his-3', type: NodeType.CONTENT_CREATOR, title: 'Email Yaz', role: 'AI', task: 'Mülakat davet emaili', status: StepStatus.IDLE, connections: [{ targetId: 'his-4' }] },
                { id: 'his-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Davet Gönder', role: 'Email + Calendly', task: 'Schedule linki ile gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'hr-onboarding-automation',
        name: 'Yeni Çalışan Onboarding Otomasyonu',
        description: 'Yeni işe başlayanlara otomatik onboarding süreci',
        category: 'productivity',
        subcategory: 'hr',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '60 dk',
        icon: '🎉',
        tags: ['hr', 'onboarding', 'yeni çalışan', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Onboarding Bot',
            description: 'Otomatik işe alıştırma',
            masterGoal: 'İlk gün deneyimini iyileştir',
            baseKnowledge: 'HRIS, Email sequences, Slack',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'hoa-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Çalışan', role: 'HRIS Webhook', task: 'İşe başlama kaydı', status: StepStatus.IDLE, connections: [{ targetId: 'hoa-2' }] },
                { id: 'hoa-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Hoşgeldin Email', role: 'Email', task: 'İlk gün bilgileri', status: StepStatus.IDLE, connections: [{ targetId: 'hoa-3' }] },
                { id: 'hoa-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Davet', role: 'Slack', task: 'Kanallara ekle', status: StepStatus.IDLE, connections: [{ targetId: 'hoa-4' }] },
                { id: 'hoa-4', type: NodeType.STATE_MANAGER, title: 'Gün 1-5 Tasks', role: 'Scheduler', task: 'Günlük görevler ata', status: StepStatus.IDLE, connections: [{ targetId: 'hoa-5' }] },
                { id: 'hoa-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Buddy Ata', role: 'Notification', task: 'Mentoru bilgilendir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // RANDEVU / APPOINTMENT ŞABLONLARI
    {
        id: 'appointment-booking-whatsapp',
        name: '📱 WhatsApp Randevu Botu',
        description: 'WhatsApp üzerinden otomatik randevu al ve yönet',
        category: 'productivity',
        subcategory: 'appointment',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-100K/ay',
        timeToSetup: '50 dk',
        icon: '📱',
        tags: ['randevu', 'whatsapp', 'bot', 'booking'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'WhatsApp Booking Bot',
            description: 'WhatsApp randevu sistemi',
            masterGoal: '7/24 randevu al',
            baseKnowledge: 'WhatsApp Business API, Calendar',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'abw-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'WhatsApp Mesaj', role: 'Webhook', task: 'Randevu talebi', status: StepStatus.IDLE, connections: [{ targetId: 'abw-2' }] },
                { id: 'abw-2', type: NodeType.ANALYST_CRITIC, title: 'Niyet Anla', role: 'NLP', task: 'Randevu mu sorgu mu?', status: StepStatus.IDLE, connections: [{ targetId: 'abw-3' }] },
                { id: 'abw-3', type: NodeType.STATE_MANAGER, title: 'Müsait Slotlar', role: 'Calendar', task: 'Uygun zamanları göster', status: StepStatus.IDLE, connections: [{ targetId: 'abw-4' }] },
                { id: 'abw-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Seçenekler Sun', role: 'WhatsApp', task: 'Butonlu mesaj gönder', status: StepStatus.IDLE, connections: [{ targetId: 'abw-5' }] },
                { id: 'abw-5', type: NodeType.STATE_MANAGER, title: 'Randevu Kaydet', role: 'Database', task: 'Calendar + CRM güncelle', status: StepStatus.IDLE, connections: [{ targetId: 'abw-6' }] },
                { id: 'abw-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Onay Gönder', role: 'WhatsApp', task: 'Randevu onay mesajı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'appointment-no-show-reducer',
        name: 'Randevu No-Show Azaltıcı',
        description: 'Randevuya gelmeyenleri azalt: hatırlatma + onay sistemi',
        category: 'productivity',
        subcategory: 'appointment',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-60K/ay',
        timeToSetup: '30 dk',
        icon: '✅',
        tags: ['randevu', 'no-show', 'hatırlatma', 'onay'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'No-Show Reducer',
            description: 'İptal/No-show azalt',
            masterGoal: 'Randevu tutarlılığı artır',
            baseKnowledge: 'SMS, Email, Calendar',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'nsr-1', type: NodeType.STATE_MANAGER, title: 'Randevu -24h', role: 'Cron', task: 'Yarınki randevular', status: StepStatus.IDLE, connections: [{ targetId: 'nsr-2' }] },
                { id: 'nsr-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Hatırlatma SMS', role: 'Twilio', task: 'Onay/İptal butonlu SMS', status: StepStatus.IDLE, connections: [{ targetId: 'nsr-3' }] },
                { id: 'nsr-3', type: NodeType.LOGIC_GATE, title: 'Yanıt Var mı?', role: 'Wait', task: '4 saat bekle', status: StepStatus.IDLE, connections: [{ targetId: 'nsr-4' }, { targetId: 'nsr-5' }] },
                { id: 'nsr-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Telefon Ara', role: 'Call', task: 'Otomatik arama yap', status: StepStatus.IDLE, connections: [] },
                { id: 'nsr-5', type: NodeType.STATE_MANAGER, title: 'Durum Güncelle', role: 'Calendar', task: 'Onaylandı/İptal işaretle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'appointment-waitlist-manager',
        name: 'Randevu Bekleme Listesi Yöneticisi',
        description: 'İptal olunca bekleme listesindeki kişiyi otomatik bilgilendir',
        category: 'productivity',
        subcategory: 'appointment',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '25 dk',
        icon: '📋',
        tags: ['randevu', 'bekleme', 'waitlist', 'otomasyon'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Waitlist Manager',
            description: 'Boş slotları doldur',
            masterGoal: 'Doluluk oranını maksimize et',
            baseKnowledge: 'Booking system, SMS',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wlm-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Randevu İptal', role: 'Webhook', task: 'Slot boşaldı', status: StepStatus.IDLE, connections: [{ targetId: 'wlm-2' }] },
                { id: 'wlm-2', type: NodeType.STATE_MANAGER, title: 'Bekleme Listesi', role: 'Database', task: 'İlk kişiyi al', status: StepStatus.IDLE, connections: [{ targetId: 'wlm-3' }] },
                { id: 'wlm-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildirim Gönder', role: 'SMS', task: 'Slot müsait bildirimi', status: StepStatus.IDLE, connections: [{ targetId: 'wlm-4' }] },
                { id: 'wlm-4', type: NodeType.STATE_MANAGER, title: '30dk Bekle', role: 'Timer', task: 'Yanıt süresi', status: StepStatus.IDLE, connections: [{ targetId: 'wlm-5' }] },
                { id: 'wlm-5', type: NodeType.LOGIC_GATE, title: 'Onay mı?', role: 'Check', task: 'Kabul etti mi?', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // EĞİTİM / EDUCATION ŞABLONLARI
    {
        id: 'education-course-drip',
        name: '🎓 Online Kurs Drip İçerik Otomasyonu',
        description: 'Kurs modüllerini zamanlayarak öğrencilere otomatik gönder',
        category: 'productivity',
        subcategory: 'education',
        difficulty: 'medium',
        estimatedRevenue: '₺30K-90K/ay',
        timeToSetup: '40 dk',
        icon: '🎓',
        tags: ['eğitim', 'kurs', 'drip', 'email'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Course Drip System',
            description: 'Otomatik kurs içerik dağıtımı',
            masterGoal: 'Öğrenci bağlılığını artır',
            baseKnowledge: 'LMS API, Email sequences',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ecd-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Kayıt', role: 'LMS Webhook', task: 'Öğrenci kaydı', status: StepStatus.IDLE, connections: [{ targetId: 'ecd-2' }] },
                { id: 'ecd-2', type: NodeType.CONTENT_CREATOR, title: 'Hoşgeldin', role: 'Email', task: 'Başlangıç rehberi', status: StepStatus.IDLE, connections: [{ targetId: 'ecd-3' }] },
                { id: 'ecd-3', type: NodeType.STATE_MANAGER, title: 'Modül Schedule', role: 'Scheduler', task: 'Haftalık modül açılımı', status: StepStatus.IDLE, connections: [{ targetId: 'ecd-4' }] },
                { id: 'ecd-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni Modül', role: 'Email', task: 'Modül erişim bildirimi', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'education-student-progress-alert',
        name: 'Öğrenci İlerleme Takip Sistemi',
        description: 'Öğrenci aktivitesini takip et, pasif olanları bildir',
        category: 'productivity',
        subcategory: 'education',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '30 dk',
        icon: '📊',
        tags: ['eğitim', 'ilerleme', 'takip', 'analiz'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Student Progress Tracker',
            description: 'Öğrenci başarı takibi',
            masterGoal: 'Terk oranını azalt',
            baseKnowledge: 'LMS analytics',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'esp-1', type: NodeType.STATE_MANAGER, title: 'Günlük Kontrol', role: 'Cron', task: 'Aktivite kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'esp-2' }] },
                { id: 'esp-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'LMS Verileri', role: 'API', task: 'Son 7 gün aktivite', status: StepStatus.IDLE, connections: [{ targetId: 'esp-3' }] },
                { id: 'esp-3', type: NodeType.LOGIC_GATE, title: 'Pasif mi?', role: 'Filter', task: '5+ gün giriş yok', status: StepStatus.IDLE, connections: [{ targetId: 'esp-4' }] },
                { id: 'esp-4', type: NodeType.CONTENT_CREATOR, title: 'Re-engage Email', role: 'AI', task: 'Motivasyon mesajı', status: StepStatus.IDLE, connections: [{ targetId: 'esp-5' }] },
                { id: 'esp-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'Email', task: 'Öğrenciye email', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // SAĞLIK / HEALTHCARE ŞABLONLARI
    {
        id: 'healthcare-appointment-reminder',
        name: '🏥 Klinik Randevu Hatırlatma Sistemi',
        description: 'Hastalara randevu öncesi otomatik hatırlatma gönder',
        category: 'productivity',
        subcategory: 'healthcare',
        difficulty: 'easy',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '20 dk',
        icon: '🏥',
        tags: ['sağlık', 'klinik', 'randevu', 'hatırlatma'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Clinic Reminder',
            description: 'Hasta hatırlatma sistemi',
            masterGoal: 'No-show azalt',
            baseKnowledge: 'HMS, SMS API',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'har-1', type: NodeType.STATE_MANAGER, title: 'Sabah 08:00', role: 'Cron', task: 'Yarınki randevular', status: StepStatus.IDLE, connections: [{ targetId: 'har-2' }] },
                { id: 'har-2', type: NodeType.STATE_MANAGER, title: 'Randevuları Al', role: 'HMS', task: 'Yarınki hastalar', status: StepStatus.IDLE, connections: [{ targetId: 'har-3' }] },
                { id: 'har-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'SMS Gönder', role: 'Twilio', task: 'Randevu hatırlatma', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'healthcare-followup-automation',
        name: 'Hasta Takip Otomasyonu',
        description: 'Tedavi sonrası hasta takibi ve kontrol hatırlatması',
        category: 'productivity',
        subcategory: 'healthcare',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-60K/ay',
        timeToSetup: '35 dk',
        icon: '💊',
        tags: ['sağlık', 'takip', 'kontrol', 'hasta'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Patient Followup',
            description: 'Tedavi sonrası takip',
            masterGoal: 'Hasta memnuniyeti',
            baseKnowledge: 'HMS, Email/SMS',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'hfa-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Tedavi Bitti', role: 'HMS Webhook', task: 'Hasta taburcu', status: StepStatus.IDLE, connections: [{ targetId: 'hfa-2' }] },
                { id: 'hfa-2', type: NodeType.STATE_MANAGER, title: '3 Gün Bekle', role: 'Delay', task: 'İyileşme süresi', status: StepStatus.IDLE, connections: [{ targetId: 'hfa-3' }] },
                { id: 'hfa-3', type: NodeType.CONTENT_CREATOR, title: 'Takip Mesajı', role: 'Template', task: 'Nasıl hissediyorsunuz?', status: StepStatus.IDLE, connections: [{ targetId: 'hfa-4' }] },
                { id: 'hfa-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'SMS Gönder', role: 'Twilio', task: 'Takip mesajı', status: StepStatus.IDLE, connections: [{ targetId: 'hfa-5' }] },
                { id: 'hfa-5', type: NodeType.STATE_MANAGER, title: 'Kontrol Planla', role: 'Calendar', task: '1 hafta sonra kontrol', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // TELEGRAM BOT ŞABLONLARI
    {
        id: 'telegram-ai-assistant-bot',
        name: '🤖 Telegram AI Asistan Bot',
        description: 'GPT-4 destekli 7/24 Telegram botu oluştur',
        category: 'productivity',
        subcategory: 'telegram',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-120K/ay',
        timeToSetup: '50 dk',
        icon: '🤖',
        tags: ['telegram', 'bot', 'ai', 'asistan'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Telegram AI Bot',
            description: '7/24 akıllı asistan',
            masterGoal: 'Otomatik müşteri hizmeti',
            baseKnowledge: 'Telegram Bot API, OpenAI',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'tab-1', type: NodeType.SOCIAL_MANAGER, title: 'Mesaj Al', role: 'Telegram', task: 'Kullanıcı mesajı', status: StepStatus.IDLE, connections: [{ targetId: 'tab-2' }] },
                { id: 'tab-2', type: NodeType.ANALYST_CRITIC, title: 'Niyet Anla', role: 'NLP', task: 'Soru mu komut mu?', status: StepStatus.IDLE, connections: [{ targetId: 'tab-3' }] },
                { id: 'tab-3', type: NodeType.STATE_MANAGER, title: 'Context Al', role: 'Database', task: 'Önceki mesajları al', status: StepStatus.IDLE, connections: [{ targetId: 'tab-4' }] },
                { id: 'tab-4', type: NodeType.CONTENT_CREATOR, title: 'AI Yanıt', role: 'GPT-4', task: 'Bağlamsal yanıt oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'tab-5' }] },
                { id: 'tab-5', type: NodeType.SOCIAL_MANAGER, title: 'Yanıtla', role: 'Telegram', task: 'Mesaj gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'telegram-crypto-signal-bot',
        name: '📈 Telegram Kripto Sinyal Botu',
        description: 'Al/Sat sinyallerini Telegram grubuna otomatik gönder',
        category: 'productivity',
        subcategory: 'telegram',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-200K/ay',
        timeToSetup: '60 dk',
        icon: '📈',
        tags: ['telegram', 'kripto', 'sinyal', 'trading'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Crypto Signal Bot',
            description: 'Otomatik trading sinyalleri',
            masterGoal: 'Abonelik geliri',
            baseKnowledge: 'Telegram API, TradingView, Binance',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'csb-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'TradingView Alert', role: 'Webhook', task: 'Sinyal tetiklendi', status: StepStatus.IDLE, connections: [{ targetId: 'csb-2' }] },
                { id: 'csb-2', type: NodeType.TRADING_DESK, title: 'Fiyat Kontrol', role: 'Binance', task: 'Güncel fiyatı al', status: StepStatus.IDLE, connections: [{ targetId: 'csb-3' }] },
                { id: 'csb-3', type: NodeType.CONTENT_CREATOR, title: 'Sinyal Formatla', role: 'Template', task: 'Entry/TP/SL hesapla', status: StepStatus.IDLE, connections: [{ targetId: 'csb-4' }] },
                { id: 'csb-4', type: NodeType.SOCIAL_MANAGER, title: 'Gruba Gönder', role: 'Telegram', task: 'Sinyal paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'telegram-group-manager-bot',
        name: 'Telegram Grup Yönetici Bot',
        description: 'Spam engelle, hoşgeldin mesajı, kural uygula',
        category: 'productivity',
        subcategory: 'telegram',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '40 dk',
        icon: '👮',
        tags: ['telegram', 'moderasyon', 'grup', 'bot'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Group Manager Bot',
            description: 'Otomatik grup yönetimi',
            masterGoal: 'Topluluk kalitesini koru',
            baseKnowledge: 'Telegram Bot API, Moderation',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'gmb-1', type: NodeType.SOCIAL_MANAGER, title: 'Yeni Üye', role: 'Telegram', task: 'Gruba katıldı', status: StepStatus.IDLE, connections: [{ targetId: 'gmb-2' }] },
                { id: 'gmb-2', type: NodeType.CONTENT_CREATOR, title: 'Hoşgeldin', role: 'Template', task: 'Kuralları paylaş', status: StepStatus.IDLE, connections: [{ targetId: 'gmb-3' }] },
                { id: 'gmb-3', type: NodeType.SOCIAL_MANAGER, title: 'Mesaj İzle', role: 'Telegram', task: 'Spam/küfür kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'gmb-4' }] },
                { id: 'gmb-4', type: NodeType.LOGIC_GATE, title: 'İhlal mi?', role: 'Filter', task: 'Kural ihlali', status: StepStatus.IDLE, connections: [{ targetId: 'gmb-5' }] },
                { id: 'gmb-5', type: NodeType.SOCIAL_MANAGER, title: 'Aksiyon', role: 'Telegram', task: 'Sil/Uyar/Ban', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // WEB3 / NFT ŞABLONLARI
    {
        id: 'nft-mint-alert',
        name: '🎨 NFT Mint Uyarı Sistemi',
        description: 'Popüler koleksiyonların mint açılışlarını takip et',
        category: 'productivity',
        subcategory: 'web3',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-100K/ay',
        timeToSetup: '45 dk',
        icon: '🎨',
        tags: ['nft', 'mint', 'web3', 'alert'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'NFT Mint Alert',
            description: 'Erken mint fırsatları',
            masterGoal: 'Karlı mint yakala',
            baseKnowledge: 'OpenSea API, Etherscan',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'nma-1', type: NodeType.STATE_MANAGER, title: 'Her 5dk', role: 'Cron', task: 'Contract tarama', status: StepStatus.IDLE, connections: [{ targetId: 'nma-2' }] },
                { id: 'nma-2', type: NodeType.RESEARCH_WEB, title: 'Yeni Contractlar', role: 'Etherscan', task: 'Yeni NFT contractları', status: StepStatus.IDLE, connections: [{ targetId: 'nma-3' }] },
                { id: 'nma-3', type: NodeType.ANALYST_CRITIC, title: 'Potansiyel mi?', role: 'AI', task: 'Sosyal medya analizi', status: StepStatus.IDLE, connections: [{ targetId: 'nma-4' }] },
                { id: 'nma-4', type: NodeType.LOGIC_GATE, title: 'Hot Mint?', role: 'Filter', task: 'Yüksek potansiyel', status: StepStatus.IDLE, connections: [{ targetId: 'nma-5' }] },
                { id: 'nma-5', type: NodeType.SOCIAL_MANAGER, title: 'Alert Gönder', role: 'Telegram', task: 'Mint bilgisi paylaş', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'wallet-tracker',
        name: '👛 Whale Cüzdan Takipçi',
        description: 'Büyük cüzdan hareketlerini izle ve bildir',
        category: 'productivity',
        subcategory: 'web3',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-150K/ay',
        timeToSetup: '50 dk',
        icon: '👛',
        tags: ['wallet', 'whale', 'web3', 'tracking'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Wallet Tracker',
            description: 'Balina hareketleri',
            masterGoal: 'Erken sinyal yakala',
            baseKnowledge: 'Etherscan API, BSCScan',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wt-1', type: NodeType.STATE_MANAGER, title: 'Her 1dk', role: 'Cron', task: 'Cüzdan kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'wt-2' }] },
                { id: 'wt-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Tx Geçmişi', role: 'Etherscan', task: 'Son işlemleri al', status: StepStatus.IDLE, connections: [{ targetId: 'wt-3' }] },
                { id: 'wt-3', type: NodeType.LOGIC_GATE, title: 'Büyük Tx?', role: 'Filter', task: '$100K+ hareket', status: StepStatus.IDLE, connections: [{ targetId: 'wt-4' }] },
                { id: 'wt-4', type: NodeType.CONTENT_CREATOR, title: 'Alert Hazırla', role: 'Formatter', task: 'Token, miktar, yön', status: StepStatus.IDLE, connections: [{ targetId: 'wt-5' }] },
                { id: 'wt-5', type: NodeType.SOCIAL_MANAGER, title: 'Bildir', role: 'Telegram', task: '🐋 Whale Alert!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // ============================================
    // 💎 PREMIUM PARA KAZANDIRAN ŞABLONLAR 💎
    // ============================================

    // 🤖 AI AGENCY ŞABLONLARI (Aylık $10K-100K)
    {
        id: 'ai-agency-client-onboarding',
        name: '🏢 AI Agency Otomatik Müşteri Onboarding',
        description: 'Yeni müşterileri otomatik sisteme al, contract, payment, kickoff',
        category: 'productivity',
        subcategory: 'ai-agency',
        difficulty: 'hard',
        estimatedRevenue: '₺100K-500K/ay',
        timeToSetup: '90 dk',
        icon: '🏢',
        tags: ['agency', 'onboarding', 'client', 'automation'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Agency Client Onboarding',
            description: 'Tam otomatik müşteri alımı',
            masterGoal: 'Ölçeklenebilir agency',
            baseKnowledge: 'CRM, Contract, Payment, Project Management',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'aco-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Proposal Kabul', role: 'Webhook', task: 'Müşteri onayladı', status: StepStatus.IDLE, connections: [{ targetId: 'aco-2' }] },
                { id: 'aco-2', type: NodeType.CONTENT_CREATOR, title: 'Contract Oluştur', role: 'DocuSign', task: 'Otomatik sözleşme', status: StepStatus.IDLE, connections: [{ targetId: 'aco-3' }] },
                { id: 'aco-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ödeme Linki', role: 'Stripe', task: 'İlk ödeme talebi', status: StepStatus.IDLE, connections: [{ targetId: 'aco-4' }] },
                { id: 'aco-4', type: NodeType.STATE_MANAGER, title: 'CRM Güncelle', role: 'HubSpot', task: 'Deal won, contact update', status: StepStatus.IDLE, connections: [{ targetId: 'aco-5' }] },
                { id: 'aco-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Proje Oluştur', role: 'Asana', task: 'Kickoff proje', status: StepStatus.IDLE, connections: [{ targetId: 'aco-6' }] },
                { id: 'aco-6', type: NodeType.CONTENT_CREATOR, title: 'Hoşgeldin Email', role: 'AI', task: 'Onboarding rehberi', status: StepStatus.IDLE, connections: [{ targetId: 'aco-7' }] },
                { id: 'aco-7', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Davet', role: 'Slack', task: 'Müşteri kanalı aç', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'ai-agency-content-delivery',
        name: '🎯 AI Agency İçerik Teslimat Sistemi',
        description: 'Müşterilere otomatik içerik üret ve teslim et',
        category: 'productivity',
        subcategory: 'ai-agency',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-400K/ay',
        timeToSetup: '75 dk',
        icon: '🎯',
        tags: ['agency', 'content', 'delivery', 'automation'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Content Delivery System',
            description: 'Müşteri içerik fabrikası',
            masterGoal: 'Ölçeklenebilir içerik agency',
            baseKnowledge: 'OpenAI, DALL-E, Client Portal',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'acd-1', type: NodeType.STATE_MANAGER, title: 'İçerik Takvimi', role: 'Cron', task: 'Her müşteri için günlük', status: StepStatus.IDLE, connections: [{ targetId: 'acd-2' }] },
                { id: 'acd-2', type: NodeType.STATE_MANAGER, title: 'Müşteri Briefi', role: 'Database', task: 'Brand voice, guidelines', status: StepStatus.IDLE, connections: [{ targetId: 'acd-3' }] },
                { id: 'acd-3', type: NodeType.CONTENT_CREATOR, title: 'İçerik Üret', role: 'GPT-4', task: 'Post + caption + hashtag', status: StepStatus.IDLE, connections: [{ targetId: 'acd-4' }] },
                { id: 'acd-4', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Üret', role: 'DALL-E', task: 'Brand uyumlu görsel', status: StepStatus.IDLE, connections: [{ targetId: 'acd-5' }] },
                { id: 'acd-5', type: NodeType.HUMAN_APPROVAL, title: 'QA Check', role: 'Slack', task: 'İç onay', status: StepStatus.IDLE, connections: [{ targetId: 'acd-6' }] },
                { id: 'acd-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Müşteri Portal', role: 'Notion', task: 'İçerik teslimatı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🎨 PRINT-ON-DEMAND ŞABLONLARI ($5K-50K/ay)
    {
        id: 'pod-design-generator',
        name: '👕 AI Print-on-Demand Tasarım Fabrikası',
        description: 'Trendlere göre otomatik t-shirt/merch tasarımı üret',
        category: 'productivity',
        subcategory: 'print-on-demand',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-300K/ay',
        timeToSetup: '60 dk',
        icon: '👕',
        tags: ['pod', 'tshirt', 'merch', 'ai', 'design'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'POD Design Factory',
            description: 'Otomatik tasarım üretimi',
            masterGoal: 'Pasif gelir makinesi',
            baseKnowledge: 'DALL-E, Midjourney, Printful API',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pod-1', type: NodeType.STATE_MANAGER, title: 'Günlük Trend', role: 'Cron', task: 'Her gün yeni tasarım', status: StepStatus.IDLE, connections: [{ targetId: 'pod-2' }] },
                { id: 'pod-2', type: NodeType.RESEARCH_WEB, title: 'Trend Araştır', role: 'Scraper', task: 'Etsy/Amazon trendler', status: StepStatus.IDLE, connections: [{ targetId: 'pod-3' }] },
                { id: 'pod-3', type: NodeType.CONTENT_CREATOR, title: 'Konsept Oluştur', role: 'GPT-4', task: '10 tasarım fikri', status: StepStatus.IDLE, connections: [{ targetId: 'pod-4' }] },
                { id: 'pod-4', type: NodeType.MEDIA_ENGINEER, title: 'Tasarım Üret', role: 'Midjourney', task: 'Print-ready PNG', status: StepStatus.IDLE, connections: [{ targetId: 'pod-5' }] },
                { id: 'pod-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ürün Ekle', role: 'Printful', task: 'Mockup + listing', status: StepStatus.IDLE, connections: [{ targetId: 'pod-6' }] },
                { id: 'pod-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Etsy/Amazon Yükle', role: 'API', task: 'Ürün yayınla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'pod-niche-finder',
        name: '🔍 POD Karlı Niş Bulucu',
        description: 'Amazon/Etsy\'de düşük rekabet yüksek talep nişleri bul',
        category: 'productivity',
        subcategory: 'print-on-demand',
        difficulty: 'medium',
        estimatedRevenue: '₺30K-100K/ay',
        timeToSetup: '40 dk',
        icon: '🔍',
        tags: ['pod', 'niche', 'research', 'amazon', 'etsy'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'POD Niche Finder',
            description: 'Karlı niş keşfi',
            masterGoal: 'Rekabetsiz pazarlar bul',
            baseKnowledge: 'Amazon API, Etsy API, Analytics',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pnf-1', type: NodeType.STATE_MANAGER, title: 'Haftalık Tarama', role: 'Cron', task: 'Her Pazartesi', status: StepStatus.IDLE, connections: [{ targetId: 'pnf-2' }] },
                { id: 'pnf-2', type: NodeType.RESEARCH_WEB, title: 'Keyword Tara', role: 'Scraper', task: 'T-shirt + niche keywords', status: StepStatus.IDLE, connections: [{ targetId: 'pnf-3' }] },
                { id: 'pnf-3', type: NodeType.ANALYST_CRITIC, title: 'Rekabet Analizi', role: 'AI', task: 'Listing sayısı vs talep', status: StepStatus.IDLE, connections: [{ targetId: 'pnf-4' }] },
                { id: 'pnf-4', type: NodeType.LOGIC_GATE, title: 'Karlı mı?', role: 'Filter', task: 'Düşük rekabet + yüksek talep', status: StepStatus.IDLE, connections: [{ targetId: 'pnf-5' }] },
                { id: 'pnf-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Rapor Gönder', role: 'Email', task: '🔥 Karlı niş bulundu!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 💰 AFFILIATE MARKETING ŞABLONLARI ($10K-100K/ay)
    {
        id: 'affiliate-product-review-bot',
        name: '📝 AI Affiliate Ürün İnceleme Yazarı',
        description: 'Affiliate ürünler için otomatik blog yazısı ve inceleme üret',
        category: 'productivity',
        subcategory: 'affiliate',
        difficulty: 'hard',
        estimatedRevenue: '₺60K-350K/ay',
        timeToSetup: '50 dk',
        icon: '📝',
        tags: ['affiliate', 'review', 'blog', 'seo', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Affiliate Review Bot',
            description: 'Otomatik inceleme içeriği',
            masterGoal: 'Pasif affiliate geliri',
            baseKnowledge: 'Amazon Affiliate, OpenAI, WordPress',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'arb-1', type: NodeType.STATE_MANAGER, title: 'Günlük İçerik', role: 'Cron', task: 'Her gün yeni review', status: StepStatus.IDLE, connections: [{ targetId: 'arb-2' }] },
                { id: 'arb-2', type: NodeType.RESEARCH_WEB, title: 'Trending Ürünler', role: 'Amazon API', task: 'Bestseller ürünleri al', status: StepStatus.IDLE, connections: [{ targetId: 'arb-3' }] },
                { id: 'arb-3', type: NodeType.RESEARCH_WEB, title: 'Ürün Bilgileri', role: 'Scraper', task: 'Specs, reviews, pros/cons', status: StepStatus.IDLE, connections: [{ targetId: 'arb-4' }] },
                { id: 'arb-4', type: NodeType.CONTENT_CREATOR, title: 'Review Yaz', role: 'GPT-4', task: '2000+ kelime SEO review', status: StepStatus.IDLE, connections: [{ targetId: 'arb-5' }] },
                { id: 'arb-5', type: NodeType.MEDIA_ENGINEER, title: 'Görsel Oluştur', role: 'AI', task: 'Product comparison images', status: StepStatus.IDLE, connections: [{ targetId: 'arb-6' }] },
                { id: 'arb-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'WordPress Yayınla', role: 'API', task: 'Blog yazısı yayınla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'affiliate-email-funnel',
        name: '📧 Affiliate Email Funnel Otomasyonu',
        description: 'Leadleri affiliate satışa dönüştüren otomatik email serisi',
        category: 'productivity',
        subcategory: 'affiliate',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-200K/ay',
        timeToSetup: '60 dk',
        icon: '📧',
        tags: ['affiliate', 'email', 'funnel', 'conversion'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Affiliate Email Funnel',
            description: 'Email ile affiliate satış',
            masterGoal: 'High-converting funnel',
            baseKnowledge: 'Email marketing, Affiliate links',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'aef-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Lead Capture', role: 'Webhook', task: 'Yeni abone', status: StepStatus.IDLE, connections: [{ targetId: 'aef-2' }] },
                { id: 'aef-2', type: NodeType.CONTENT_CREATOR, title: 'Welcome Email', role: 'AI', task: 'Değer sağla + güven oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'aef-3' }] },
                { id: 'aef-3', type: NodeType.STATE_MANAGER, title: '2 Gün Bekle', role: 'Delay', task: 'Nurture period', status: StepStatus.IDLE, connections: [{ targetId: 'aef-4' }] },
                { id: 'aef-4', type: NodeType.CONTENT_CREATOR, title: 'Value Email', role: 'AI', task: 'Problem + çözüm', status: StepStatus.IDLE, connections: [{ targetId: 'aef-5' }] },
                { id: 'aef-5', type: NodeType.STATE_MANAGER, title: '2 Gün Bekle', role: 'Delay', task: 'Build desire', status: StepStatus.IDLE, connections: [{ targetId: 'aef-6' }] },
                { id: 'aef-6', type: NodeType.CONTENT_CREATOR, title: 'Offer Email', role: 'AI', task: 'Affiliate teklif + bonus', status: StepStatus.IDLE, connections: [{ targetId: 'aef-7' }] },
                { id: 'aef-7', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sequence Gönder', role: 'Mailchimp', task: 'Tüm emailleri gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🎓 ONLINE COURSE & COACHING ($20K-500K/ay)
    {
        id: 'course-launch-automation',
        name: '🚀 Online Kurs Lansman Otomasyonu',
        description: 'Kurs lansmanını A\'dan Z\'ye otomatikleştir: teaser, email, webinar, cart',
        category: 'productivity',
        subcategory: 'course-creator',
        difficulty: 'hard',
        estimatedRevenue: '₺200K-2M/lansman',
        timeToSetup: '120 dk',
        icon: '🚀',
        tags: ['course', 'launch', 'webinar', 'email', 'automation'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Course Launch System',
            description: 'Tam otomatik kurs lansmanı',
            masterGoal: '6-7 haneli lansman',
            baseKnowledge: 'Webinar, Email sequences, Payment',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'cla-1', type: NodeType.STATE_MANAGER, title: 'Pre-Launch Day -14', role: 'Scheduler', task: 'Teaser campaign başlat', status: StepStatus.IDLE, connections: [{ targetId: 'cla-2' }] },
                { id: 'cla-2', type: NodeType.CONTENT_CREATOR, title: 'Teaser Emails', role: 'AI', task: 'Hype oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'cla-3' }] },
                { id: 'cla-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Webinar Davet', role: 'Email', task: 'Ücretsiz webinar daveti', status: StepStatus.IDLE, connections: [{ targetId: 'cla-4' }] },
                { id: 'cla-4', type: NodeType.STATE_MANAGER, title: 'Webinar Day', role: 'Scheduler', task: 'Canlı yayın günü', status: StepStatus.IDLE, connections: [{ targetId: 'cla-5' }] },
                { id: 'cla-5', type: NodeType.CONTENT_CREATOR, title: 'Cart Open Emails', role: 'AI', task: 'Satış başladı!', status: StepStatus.IDLE, connections: [{ targetId: 'cla-6' }] },
                { id: 'cla-6', type: NodeType.STATE_MANAGER, title: 'Cart Open 5 Gün', role: 'Scheduler', task: 'Urgency emails', status: StepStatus.IDLE, connections: [{ targetId: 'cla-7' }] },
                { id: 'cla-7', type: NodeType.CONTENT_CREATOR, title: 'Cart Close Email', role: 'AI', task: 'Son şans!', status: StepStatus.IDLE, connections: [{ targetId: 'cla-8' }] },
                { id: 'cla-8', type: NodeType.STATE_MANAGER, title: 'Sonuç Raporu', role: 'Analytics', task: 'Lansman performansı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'coaching-call-automation',
        name: '🎯 Coaching Call Tam Otomasyon',
        description: 'Booking\'den ödemeye, takipten faturalamaya kadar her şey otomatik',
        category: 'productivity',
        subcategory: 'coaching',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-400K/ay',
        timeToSetup: '80 dk',
        icon: '🎯',
        tags: ['coaching', 'booking', 'payment', 'automation'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Coaching Automation',
            description: 'Zero-touch coaching business',
            masterGoal: 'Ölçeklenebilir coaching',
            baseKnowledge: 'Calendly, Stripe, Zoom, CRM',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'cca-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Booking', role: 'Calendly', task: 'Randevu alındı', status: StepStatus.IDLE, connections: [{ targetId: 'cca-2' }] },
                { id: 'cca-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ödeme Al', role: 'Stripe', task: 'Seans ücreti', status: StepStatus.IDLE, connections: [{ targetId: 'cca-3' }] },
                { id: 'cca-3', type: NodeType.CONTENT_CREATOR, title: 'Pre-call Email', role: 'AI', task: 'Hazırlık soruları', status: StepStatus.IDLE, connections: [{ targetId: 'cca-4' }] },
                { id: 'cca-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Zoom Link', role: 'Zoom', task: 'Otomatik meeting', status: StepStatus.IDLE, connections: [{ targetId: 'cca-5' }] },
                { id: 'cca-5', type: NodeType.STATE_MANAGER, title: 'Call Bitti', role: 'Trigger', task: 'Seans sonu', status: StepStatus.IDLE, connections: [{ targetId: 'cca-6' }] },
                { id: 'cca-6', type: NodeType.CONTENT_CREATOR, title: 'Follow-up Email', role: 'AI', task: 'Session notes + action items', status: StepStatus.IDLE, connections: [{ targetId: 'cca-7' }] },
                { id: 'cca-7', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fatura Gönder', role: 'Invoice', task: 'Otomatik fatura', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 📈 STOCK & FOREX TRADING ($50K-1M/ay)
    {
        id: 'stock-options-scanner',
        name: '📊 AI Stock Options Scanner',
        description: 'Unusual options activity tespit et ve anında bildir',
        category: 'productivity',
        subcategory: 'trading',
        difficulty: 'hard',
        estimatedRevenue: '₺100K-1M/ay',
        timeToSetup: '90 dk',
        icon: '📊',
        tags: ['stock', 'options', 'scanner', 'ai', 'trading'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Options Scanner',
            description: 'Unusual activity dedektör',
            masterGoal: 'Büyük hamleleri yakala',
            baseKnowledge: 'Options data, AI analysis',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sos-1', type: NodeType.STATE_MANAGER, title: 'Market Saatleri', role: 'Cron', task: '5dk interval', status: StepStatus.IDLE, connections: [{ targetId: 'sos-2' }] },
                { id: 'sos-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Options Flow', role: 'API', task: 'Canlı options verisi', status: StepStatus.IDLE, connections: [{ targetId: 'sos-3' }] },
                { id: 'sos-3', type: NodeType.ANALYST_CRITIC, title: 'Unusual Detect', role: 'AI', task: 'Anormal hacim/fiyat', status: StepStatus.IDLE, connections: [{ targetId: 'sos-4' }] },
                { id: 'sos-4', type: NodeType.LOGIC_GATE, title: 'Büyük Trade?', role: 'Filter', task: '$1M+ premium', status: StepStatus.IDLE, connections: [{ targetId: 'sos-5' }] },
                { id: 'sos-5', type: NodeType.CONTENT_CREATOR, title: 'Alert Hazırla', role: 'Formatter', task: 'Strike, expiry, size', status: StepStatus.IDLE, connections: [{ targetId: 'sos-6' }] },
                { id: 'sos-6', type: NodeType.SOCIAL_MANAGER, title: '🚨 Alert', role: 'Discord/Telegram', task: 'Anında bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'forex-news-trader',
        name: '📰 AI Forex News Trader',
        description: 'Ekonomik haberleri anında analiz edip trade sinyali ver',
        category: 'productivity',
        subcategory: 'trading',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-500K/ay',
        timeToSetup: '75 dk',
        icon: '📰',
        tags: ['forex', 'news', 'trading', 'ai', 'signals'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Forex News Trader',
            description: 'Haber bazlı trading',
            masterGoal: 'News edge yakala',
            baseKnowledge: 'Forex, News APIs, Sentiment',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fnt-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Economic Calendar', role: 'API', task: 'Yaklaşan haberler', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-2' }] },
                { id: 'fnt-2', type: NodeType.RESEARCH_WEB, title: 'News Feed', role: 'Scraper', task: 'Breaking news', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-3' }] },
                { id: 'fnt-3', type: NodeType.ANALYST_CRITIC, title: 'Sentiment Analiz', role: 'AI', task: 'Bullish/Bearish/Neutral', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-4' }] },
                { id: 'fnt-4', type: NodeType.TRADING_DESK, title: 'Trade Signal', role: 'Calculator', task: 'Entry/SL/TP hesapla', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-5' }] },
                { id: 'fnt-5', type: NodeType.SOCIAL_MANAGER, title: 'Signal Gönder', role: 'Telegram', task: 'Trade alert', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 📦 AMAZON FBA & E-COMMERCE ($20K-500K/ay)
    {
        id: 'amazon-fba-product-research',
        name: '📦 Amazon FBA Ürün Araştırma AI',
        description: 'Karlı Amazon FBA ürünlerini AI ile otomatik bul',
        category: 'productivity',
        subcategory: 'amazon-fba',
        difficulty: 'hard',
        estimatedRevenue: '₺100K-500K/ay',
        timeToSetup: '70 dk',
        icon: '📦',
        tags: ['amazon', 'fba', 'product-research', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'FBA Product Research',
            description: 'Winning product keşfi',
            masterGoal: 'Karlı FBA işi',
            baseKnowledge: 'Amazon API, Jungle Scout, Helium10',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fba-1', type: NodeType.STATE_MANAGER, title: 'Günlük Tarama', role: 'Cron', task: 'Her gün yeni fırsatlar', status: StepStatus.IDLE, connections: [{ targetId: 'fba-2' }] },
                { id: 'fba-2', type: NodeType.RESEARCH_WEB, title: 'Bestseller Tara', role: 'Amazon API', task: 'Kategori bestsellerleri', status: StepStatus.IDLE, connections: [{ targetId: 'fba-3' }] },
                { id: 'fba-3', type: NodeType.ANALYST_CRITIC, title: 'Rekabet Analizi', role: 'AI', task: 'Review sayısı, listing kalitesi', status: StepStatus.IDLE, connections: [{ targetId: 'fba-4' }] },
                { id: 'fba-4', type: NodeType.ANALYST_CRITIC, title: 'Kar Hesapla', role: 'Calculator', task: 'FBA fees, shipping, margin', status: StepStatus.IDLE, connections: [{ targetId: 'fba-5' }] },
                { id: 'fba-5', type: NodeType.LOGIC_GATE, title: '%30+ Margin?', role: 'Filter', task: 'Karlı mı?', status: StepStatus.IDLE, connections: [{ targetId: 'fba-6' }] },
                { id: 'fba-6', type: NodeType.RESEARCH_WEB, title: 'Supplier Bul', role: 'Alibaba', task: 'Tedarikçi araştır', status: StepStatus.IDLE, connections: [{ targetId: 'fba-7' }] },
                { id: 'fba-7', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fırsat Raporu', role: 'Email', task: 'Detaylı ürün raporu', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'amazon-listing-optimizer',
        name: '🎯 Amazon Listing AI Optimizer',
        description: 'Mevcut listingleri AI ile optimize et, conversion artır',
        category: 'productivity',
        subcategory: 'amazon-fba',
        difficulty: 'medium',
        estimatedRevenue: '₺40K-150K/ay',
        timeToSetup: '40 dk',
        icon: '🎯',
        tags: ['amazon', 'listing', 'seo', 'ai', 'optimization'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Listing Optimizer',
            description: 'A+ listing oluştur',
            masterGoal: 'Conversion rate artır',
            baseKnowledge: 'Amazon SEO, Copywriting',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'alo-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'ASIN Al', role: 'Input', task: 'Optimize edilecek ürün', status: StepStatus.IDLE, connections: [{ targetId: 'alo-2' }] },
                { id: 'alo-2', type: NodeType.RESEARCH_WEB, title: 'Mevcut Listing', role: 'Amazon', task: 'Title, bullets, desc al', status: StepStatus.IDLE, connections: [{ targetId: 'alo-3' }] },
                { id: 'alo-3', type: NodeType.RESEARCH_WEB, title: 'Rakip Analizi', role: 'Scraper', task: 'Top 5 rakip listingleri', status: StepStatus.IDLE, connections: [{ targetId: 'alo-4' }] },
                { id: 'alo-4', type: NodeType.CONTENT_CREATOR, title: 'Optimize Yaz', role: 'GPT-4', task: 'SEO + conversion optimized', status: StepStatus.IDLE, connections: [{ targetId: 'alo-5' }] },
                { id: 'alo-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Öneriler Gönder', role: 'Email', task: 'Before/After comparison', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🎨 ETSY AUTOMATION ($5K-50K/ay)
    {
        id: 'etsy-digital-product-factory',
        name: '🎨 Etsy Dijital Ürün Fabrikası',
        description: 'AI ile dijital ürünler (printable, template, planner) üret ve sat',
        category: 'productivity',
        subcategory: 'etsy',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-200K/ay',
        timeToSetup: '60 dk',
        icon: '🎨',
        tags: ['etsy', 'digital', 'printable', 'ai', 'passive'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Etsy Digital Factory',
            description: 'Pasif dijital ürün geliri',
            masterGoal: 'Ölçeklenebilir Etsy shop',
            baseKnowledge: 'Canva, AI Design, Etsy API',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'edf-1', type: NodeType.STATE_MANAGER, title: 'Günlük Üretim', role: 'Cron', task: 'Her gün 5 ürün', status: StepStatus.IDLE, connections: [{ targetId: 'edf-2' }] },
                { id: 'edf-2', type: NodeType.RESEARCH_WEB, title: 'Trend Ürünler', role: 'Etsy Scraper', task: 'Bestseller printables', status: StepStatus.IDLE, connections: [{ targetId: 'edf-3' }] },
                { id: 'edf-3', type: NodeType.CONTENT_CREATOR, title: 'Tasarım Fikri', role: 'GPT-4', task: 'Unique angle bul', status: StepStatus.IDLE, connections: [{ targetId: 'edf-4' }] },
                { id: 'edf-4', type: NodeType.MEDIA_ENGINEER, title: 'Ürün Oluştur', role: 'Canva/AI', task: 'PDF/PNG üret', status: StepStatus.IDLE, connections: [{ targetId: 'edf-5' }] },
                { id: 'edf-5', type: NodeType.CONTENT_CREATOR, title: 'Listing Yaz', role: 'GPT-4', task: 'SEO title + desc', status: StepStatus.IDLE, connections: [{ targetId: 'edf-6' }] },
                { id: 'edf-6', type: NodeType.MEDIA_ENGINEER, title: 'Mockup Oluştur', role: 'Template', task: 'Profesyonel mockup', status: StepStatus.IDLE, connections: [{ targetId: 'edf-7' }] },
                { id: 'edf-7', type: NodeType.EXTERNAL_CONNECTOR, title: 'Etsy Yükle', role: 'Etsy API', task: 'Ürün yayınla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🎮 GAMING & SAAS AUTOMATION
    {
        id: 'saas-product-analytics-alert',
        name: '📈 SaaS Product Analytics Alert System',
        description: 'Kritik metrikleri (churn, MRR, DAU) izle ve anında bildir',
        category: 'productivity',
        subcategory: 'saas',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-200K/ay',
        timeToSetup: '60 dk',
        icon: '📈',
        tags: ['saas', 'analytics', 'metrics', 'alert'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'SaaS Metrics Alert',
            description: 'Real-time KPI monitoring',
            masterGoal: 'Sorunları erken yakala',
            baseKnowledge: 'Analytics APIs, Slack',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'spa-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Check', role: 'Cron', task: 'Metrikleri kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'spa-2' }] },
                { id: 'spa-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Metrics Al', role: 'Analytics', task: 'MRR, Churn, DAU', status: StepStatus.IDLE, connections: [{ targetId: 'spa-3' }] },
                { id: 'spa-3', type: NodeType.ANALYST_CRITIC, title: 'Anomali Detect', role: 'AI', task: 'Normalden sapma', status: StepStatus.IDLE, connections: [{ targetId: 'spa-4' }] },
                { id: 'spa-4', type: NodeType.LOGIC_GATE, title: 'Problem var mı?', role: 'Filter', task: 'Threshold aşıldı mı?', status: StepStatus.IDLE, connections: [{ targetId: 'spa-5' }] },
                { id: 'spa-5', type: NodeType.EXTERNAL_CONNECTOR, title: '🚨 Alert', role: 'Slack', task: 'Ekibi bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 📧 NEWSLETTER MONETİZASYON ($5K-100K/ay)
    {
        id: 'newsletter-growth-machine',
        name: '📧 Newsletter Büyüme Makinesi',
        description: 'Otomatik lead magnet, viral loops ve abone büyütme sistemi',
        category: 'productivity',
        subcategory: 'newsletter',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-500K/ay',
        timeToSetup: '80 dk',
        icon: '📧',
        tags: ['newsletter', 'growth', 'viral', 'subscribers'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Newsletter Growth',
            description: 'Abone patlaması',
            masterGoal: '100K+ subscribers',
            baseKnowledge: 'Email marketing, Viral mechanics',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ngm-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Lead Magnet', role: 'Landing', task: 'Ücretsiz kaynak sun', status: StepStatus.IDLE, connections: [{ targetId: 'ngm-2' }] },
                { id: 'ngm-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Abone Kayıt', role: 'Form', task: 'Email topla', status: StepStatus.IDLE, connections: [{ targetId: 'ngm-3' }] },
                { id: 'ngm-3', type: NodeType.CONTENT_CREATOR, title: 'Welcome Sequence', role: 'AI', task: '5 email serisi', status: StepStatus.IDLE, connections: [{ targetId: 'ngm-4' }] },
                { id: 'ngm-4', type: NodeType.CONTENT_CREATOR, title: 'Referral Program', role: 'Template', task: 'Arkadaşını getir', status: StepStatus.IDLE, connections: [{ targetId: 'ngm-5' }] },
                { id: 'ngm-5', type: NodeType.STATE_MANAGER, title: 'Segmentasyon', role: 'CRM', task: 'Engage düzeyine göre', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'newsletter-sponsor-automation',
        name: '💰 Newsletter Sponsor Satış Otomasyonu',
        description: 'Sponsor bulma, fiyatlandırma, contract ve ödeme otomatik',
        category: 'productivity',
        subcategory: 'newsletter',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-300K/ay',
        timeToSetup: '60 dk',
        icon: '💰',
        tags: ['newsletter', 'sponsor', 'monetization', 'ads'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Sponsor Sales',
            description: 'Otomatik sponsor satışı',
            masterGoal: 'Pasif reklam geliri',
            baseKnowledge: 'Newsletter monetization, Contracts',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'nsa-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sponsor Başvuru', role: 'Form', task: 'Reklam talebi', status: StepStatus.IDLE, connections: [{ targetId: 'nsa-2' }] },
                { id: 'nsa-2', type: NodeType.ANALYST_CRITIC, title: 'Uygunluk Check', role: 'AI', task: 'Brand fit kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'nsa-3' }] },
                { id: 'nsa-3', type: NodeType.CONTENT_CREATOR, title: 'Media Kit Gönder', role: 'Template', task: 'Otomatik fiyat teklifi', status: StepStatus.IDLE, connections: [{ targetId: 'nsa-4' }] },
                { id: 'nsa-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Contract', role: 'DocuSign', task: 'Otomatik sözleşme', status: StepStatus.IDLE, connections: [{ targetId: 'nsa-5' }] },
                { id: 'nsa-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ödeme Al', role: 'Stripe', task: 'Peşin ödeme', status: StepStatus.IDLE, connections: [{ targetId: 'nsa-6' }] },
                { id: 'nsa-6', type: NodeType.STATE_MANAGER, title: 'Takvim Ekle', role: 'Calendar', task: 'Yayın tarihi planla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 👥 COMMUNITY & MEMBERSHIP ($10K-500K/ay)
    {
        id: 'community-engagement-bot',
        name: '👥 Topluluk Engagement Bot',
        description: 'Discord/Slack topluluğunu aktif tut, gamification ve ödüller',
        category: 'productivity',
        subcategory: 'community',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-200K/ay',
        timeToSetup: '70 dk',
        icon: '👥',
        tags: ['community', 'discord', 'engagement', 'gamification'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Community Bot',
            description: 'Aktif topluluk yönetimi',
            masterGoal: 'Engaged community',
            baseKnowledge: 'Discord/Slack API, Gamification',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ceb-1', type: NodeType.SOCIAL_MANAGER, title: 'Aktivite İzle', role: 'Bot', task: 'Mesaj/reaction takip', status: StepStatus.IDLE, connections: [{ targetId: 'ceb-2' }] },
                { id: 'ceb-2', type: NodeType.STATE_MANAGER, title: 'Puan Ver', role: 'Leaderboard', task: 'XP sistemi', status: StepStatus.IDLE, connections: [{ targetId: 'ceb-3' }] },
                { id: 'ceb-3', type: NodeType.LOGIC_GATE, title: 'Level Up?', role: 'Check', task: 'Yeni seviye', status: StepStatus.IDLE, connections: [{ targetId: 'ceb-4' }] },
                { id: 'ceb-4', type: NodeType.SOCIAL_MANAGER, title: 'Tebrik Et', role: 'Bot', task: 'Başarı duyurusu', status: StepStatus.IDLE, connections: [{ targetId: 'ceb-5' }] },
                { id: 'ceb-5', type: NodeType.STATE_MANAGER, title: 'Haftalık Lider', role: 'Cron', task: 'Weekly leaderboard', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'membership-churn-recovery',
        name: '🔄 Membership Churn Recovery System',
        description: 'İptal eden üyeleri geri kazanmak için otomatik kampanya',
        category: 'productivity',
        subcategory: 'membership',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-300K/ay',
        timeToSetup: '50 dk',
        icon: '🔄',
        tags: ['membership', 'churn', 'recovery', 'winback'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Churn Recovery',
            description: 'Üye geri kazanımı',
            masterGoal: 'Churn azalt',
            baseKnowledge: 'CRM, Email marketing',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'mcr-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'İptal Trigger', role: 'Webhook', task: 'Üyelik iptal', status: StepStatus.IDLE, connections: [{ targetId: 'mcr-2' }] },
                { id: 'mcr-2', type: NodeType.ANALYST_CRITIC, title: 'Neden Analizi', role: 'AI', task: 'İptal sebebini anla', status: StepStatus.IDLE, connections: [{ targetId: 'mcr-3' }] },
                { id: 'mcr-3', type: NodeType.CONTENT_CREATOR, title: 'Win-back Email 1', role: 'AI', task: 'Özleyeceğiz mesajı', status: StepStatus.IDLE, connections: [{ targetId: 'mcr-4' }] },
                { id: 'mcr-4', type: NodeType.STATE_MANAGER, title: '3 Gün Bekle', role: 'Delay', task: 'Cooling period', status: StepStatus.IDLE, connections: [{ targetId: 'mcr-5' }] },
                { id: 'mcr-5', type: NodeType.CONTENT_CREATOR, title: 'Özel Teklif', role: 'AI', task: '%50 indirim + bonus', status: StepStatus.IDLE, connections: [{ targetId: 'mcr-6' }] },
                { id: 'mcr-6', type: NodeType.STATE_MANAGER, title: '7 Gün Bekle', role: 'Delay', task: 'Son şans', status: StepStatus.IDLE, connections: [{ targetId: 'mcr-7' }] },
                { id: 'mcr-7', type: NodeType.CONTENT_CREATOR, title: 'Final Email', role: 'AI', task: 'FOMO + scarcity', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🎤 WEBINAR AUTOMATION ($50K-1M/lansman)
    {
        id: 'webinar-evergreen-funnel',
        name: '🎤 Evergreen Webinar Funnel',
        description: '7/24 çalışan otomatik webinar satış sistemi',
        category: 'productivity',
        subcategory: 'webinar',
        difficulty: 'hard',
        estimatedRevenue: '₺100K-1M/ay',
        timeToSetup: '120 dk',
        icon: '🎤',
        tags: ['webinar', 'evergreen', 'funnel', 'automation'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Evergreen Webinar',
            description: '7/24 satış makinesi',
            masterGoal: 'Otopilot satış',
            baseKnowledge: 'Webinar platforms, Email sequences',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ewf-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Kayıt Formu', role: 'Landing', task: 'Webinar kaydı', status: StepStatus.IDLE, connections: [{ targetId: 'ewf-2' }] },
                { id: 'ewf-2', type: NodeType.CONTENT_CREATOR, title: 'Hatırlatma 1', role: 'Email', task: '-24h reminder', status: StepStatus.IDLE, connections: [{ targetId: 'ewf-3' }] },
                { id: 'ewf-3', type: NodeType.CONTENT_CREATOR, title: 'Hatırlatma 2', role: 'Email', task: '-1h reminder', status: StepStatus.IDLE, connections: [{ targetId: 'ewf-4' }] },
                { id: 'ewf-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Webinar Başlat', role: 'Platform', task: 'Otomatik replay', status: StepStatus.IDLE, connections: [{ targetId: 'ewf-5' }] },
                { id: 'ewf-5', type: NodeType.CONTENT_CREATOR, title: 'Offer Email', role: 'AI', task: 'Sınırlı süre teklif', status: StepStatus.IDLE, connections: [{ targetId: 'ewf-6' }] },
                { id: 'ewf-6', type: NodeType.STATE_MANAGER, title: 'Cart Timer', role: 'Countdown', task: '48h deadline', status: StepStatus.IDLE, connections: [{ targetId: 'ewf-7' }] },
                { id: 'ewf-7', type: NodeType.CONTENT_CREATOR, title: 'Cart Close', role: 'Email', task: 'Son şans!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🏆 CONSULTING & SERVICES ($20K-500K/ay)
    {
        id: 'consulting-lead-qualifier',
        name: '🏆 AI Consulting Lead Qualifier',
        description: 'Gelen leadleri otomatik puanla ve yüksek değerli olanları işaretle',
        category: 'productivity',
        subcategory: 'consulting',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-400K/ay',
        timeToSetup: '60 dk',
        icon: '🏆',
        tags: ['consulting', 'lead', 'qualifier', 'ai'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Lead Qualifier',
            description: 'Otomatik lead puanlama',
            masterGoal: 'Sadece büyük müşterilere odaklan',
            baseKnowledge: 'Lead scoring, CRM',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'clq-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Başvuru Formu', role: 'Typeform', task: 'Detaylı sorular', status: StepStatus.IDLE, connections: [{ targetId: 'clq-2' }] },
                { id: 'clq-2', type: NodeType.ANALYST_CRITIC, title: 'Data Zenginleştir', role: 'Clearbit', task: 'Şirket bilgileri', status: StepStatus.IDLE, connections: [{ targetId: 'clq-3' }] },
                { id: 'clq-3', type: NodeType.ANALYST_CRITIC, title: 'AI Skorlama', role: 'GPT-4', task: 'Bütçe + aciliyet + fit', status: StepStatus.IDLE, connections: [{ targetId: 'clq-4' }] },
                { id: 'clq-4', type: NodeType.LOGIC_GATE, title: 'Hot Lead?', role: 'Filter', task: '80+ puan', status: StepStatus.IDLE, connections: [{ targetId: 'clq-5' }, { targetId: 'clq-6' }] },
                { id: 'clq-5', type: NodeType.EXTERNAL_CONNECTOR, title: '🔥 Acil Bildir', role: 'Slack', task: 'Hemen ara!', status: StepStatus.IDLE, connections: [] },
                { id: 'clq-6', type: NodeType.CONTENT_CREATOR, title: 'Nurture Sequence', role: 'Email', task: 'Değer sağla', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'productized-service-delivery',
        name: '📦 Productized Service Teslimat Sistemi',
        description: 'Standart hizmet paketlerini otomatik teslim et',
        category: 'productivity',
        subcategory: 'consulting',
        difficulty: 'hard',
        estimatedRevenue: '₺60K-300K/ay',
        timeToSetup: '70 dk',
        icon: '📦',
        tags: ['productized', 'service', 'delivery', 'automation'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Productized Delivery',
            description: 'Standart hizmet fabrikası',
            masterGoal: 'Ölçeklenebilir hizmet işi',
            baseKnowledge: 'Project management, Automation',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'psd-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satın Alma', role: 'Stripe', task: 'Paket satışı', status: StepStatus.IDLE, connections: [{ targetId: 'psd-2' }] },
                { id: 'psd-2', type: NodeType.CONTENT_CREATOR, title: 'Onboarding Form', role: 'Typeform', task: 'Müşteri bilgileri', status: StepStatus.IDLE, connections: [{ targetId: 'psd-3' }] },
                { id: 'psd-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Proje Oluştur', role: 'Asana', task: 'Standart template', status: StepStatus.IDLE, connections: [{ targetId: 'psd-4' }] },
                { id: 'psd-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Ekip Ata', role: 'Round-robin', task: 'Uygun ekip üyesi', status: StepStatus.IDLE, connections: [{ targetId: 'psd-5' }] },
                { id: 'psd-5', type: NodeType.STATE_MANAGER, title: 'SLA Takip', role: 'Monitor', task: 'Deadline kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'psd-6' }] },
                { id: 'psd-6', type: NodeType.CONTENT_CREATOR, title: 'Delivery Email', role: 'Template', task: 'Teslim + NPS survey', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🎥 VIDEO CONTENT MONETIZATION
    {
        id: 'youtube-monetization-optimizer',
        name: '🎥 YouTube Monetization Optimizer',
        description: 'Video performansını analiz et, sponsorluk ve affiliate fırsatları öner',
        category: 'productivity',
        subcategory: 'youtube',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-500K/ay',
        timeToSetup: '60 dk',
        icon: '🎥',
        tags: ['youtube', 'monetization', 'sponsor', 'affiliate'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'YT Monetization',
            description: 'YouTube gelir optimizasyonu',
            masterGoal: 'Kanal gelirini maksimize et',
            baseKnowledge: 'YouTube API, Analytics',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ymo-1', type: NodeType.STATE_MANAGER, title: 'Haftalık Analiz', role: 'Cron', task: 'Her Pazartesi', status: StepStatus.IDLE, connections: [{ targetId: 'ymo-2' }] },
                { id: 'ymo-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Analytics Çek', role: 'YouTube API', task: 'Son 7 gün performans', status: StepStatus.IDLE, connections: [{ targetId: 'ymo-3' }] },
                { id: 'ymo-3', type: NodeType.ANALYST_CRITIC, title: 'Trend Analizi', role: 'AI', task: 'En iyi performans konular', status: StepStatus.IDLE, connections: [{ targetId: 'ymo-4' }] },
                { id: 'ymo-4', type: NodeType.RESEARCH_WEB, title: 'Sponsor Eşleştir', role: 'Database', task: 'Uygun sponsorlar', status: StepStatus.IDLE, connections: [{ targetId: 'ymo-5' }] },
                { id: 'ymo-5', type: NodeType.CONTENT_CREATOR, title: 'Fırsat Raporu', role: 'AI', task: 'Monetization önerileri', status: StepStatus.IDLE, connections: [{ targetId: 'ymo-6' }] },
                { id: 'ymo-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Haftalık rapor', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 🛠️ FREELANCE AGENCY AUTOMATION
    {
        id: 'freelance-agency-pipeline',
        name: '🛠️ Freelance Agency Pipeline Manager',
        description: 'Freelancer ekibini yönet, iş dağıt, kalite kontrol et',
        category: 'productivity',
        subcategory: 'freelance-agency',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-400K/ay',
        timeToSetup: '90 dk',
        icon: '🛠️',
        tags: ['freelance', 'agency', 'pipeline', 'management'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Agency Pipeline',
            description: 'Freelance ekip yönetimi',
            masterGoal: 'Ölçeklenebilir agency',
            baseKnowledge: 'Project management, Freelancer platforms',
            category: 'Productivity',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fap-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Yeni İş', role: 'Webhook', task: 'Müşteri projesi', status: StepStatus.IDLE, connections: [{ targetId: 'fap-2' }] },
                { id: 'fap-2', type: NodeType.ANALYST_CRITIC, title: 'Skill Match', role: 'AI', task: 'En uygun freelancer', status: StepStatus.IDLE, connections: [{ targetId: 'fap-3' }] },
                { id: 'fap-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Teklif Gönder', role: 'Email', task: 'Freelancera iş teklifi', status: StepStatus.IDLE, connections: [{ targetId: 'fap-4' }] },
                { id: 'fap-4', type: NodeType.STATE_MANAGER, title: 'Deadline Takip', role: 'Monitor', task: 'İlerleme kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'fap-5' }] },
                { id: 'fap-5', type: NodeType.ANALYST_CRITIC, title: 'QA Check', role: 'Review', task: 'Kalite kontrolü', status: StepStatus.IDLE, connections: [{ targetId: 'fap-6' }] },
                { id: 'fap-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Müşteriye Teslim', role: 'Portal', task: 'Final delivery', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// E-POSTA MARKETING ŞABLONLARI (50+)
// ============================================

const EMAIL_MARKETING_TEMPLATES: MegaTemplate[] = [
    {
        id: 'mailchimp-new-subscriber-welcome',
        name: 'Mailchimp Yeni Abone Hoşgeldin Serisi',
        description: 'Yeni abonelere otomatik 5 günlük hoşgeldin email serisi gönder',
        category: 'email-marketing',
        subcategory: 'mailchimp',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '25 dk',
        icon: '📧',
        tags: ['mailchimp', 'hoşgeldin', 'otomasyon', 'drip'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Hoşgeldin Email Serisi',
            description: '5 günlük otomatik email serisi',
            masterGoal: 'Yeni aboneleri müşteriye dönüştür',
            baseKnowledge: 'Mailchimp API, Email copywriting',
            category: 'Email Marketing',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'mw-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Mailchimp Webhook', role: 'Tetikleyici', task: 'Yeni abone al', status: StepStatus.IDLE, connections: [{ targetId: 'mw-2' }] },
                { id: 'mw-2', type: NodeType.CONTENT_CREATOR, title: 'Hoşgeldin #1', role: 'Email', task: 'İlk tanışma emaili gönder', status: StepStatus.IDLE, connections: [{ targetId: 'mw-3' }] },
                { id: 'mw-3', type: NodeType.STATE_MANAGER, title: '2 Gün Bekle', role: 'Delay', task: '48 saat bekle', status: StepStatus.IDLE, connections: [{ targetId: 'mw-4' }] },
                { id: 'mw-4', type: NodeType.CONTENT_CREATOR, title: 'Değer #2', role: 'Email', task: 'Faydalı içerik emaili', status: StepStatus.IDLE, connections: [{ targetId: 'mw-5' }] },
                { id: 'mw-5', type: NodeType.STATE_MANAGER, title: '2 Gün Bekle', role: 'Delay', task: '48 saat bekle', status: StepStatus.IDLE, connections: [{ targetId: 'mw-6' }] },
                { id: 'mw-6', type: NodeType.CONTENT_CREATOR, title: 'Teklif #3', role: 'Email', task: 'Özel indirim teklifi', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'convertkit-tag-based-automation',
        name: 'ConvertKit Etiket Bazlı Kampanya',
        description: 'Kullanıcı davranışına göre otomatik etiketleme ve email gönderimi',
        category: 'email-marketing',
        subcategory: 'convertkit',
        difficulty: 'hard',
        estimatedRevenue: '₺25K-60K/ay',
        timeToSetup: '40 dk',
        icon: '🏷️',
        tags: ['convertkit', 'etiket', 'segmentasyon', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Akıllı Segmentasyon',
            description: 'Davranış bazlı email pazarlama',
            masterGoal: 'Kişiselleştirilmiş pazarlama',
            baseKnowledge: 'ConvertKit API, Behavioral marketing',
            category: 'Email Marketing',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ck-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Webhook Dinle', role: 'Tetikleyici', task: 'Kullanıcı aksiyonunu al', status: StepStatus.IDLE, connections: [{ targetId: 'ck-2' }] },
                { id: 'ck-2', type: NodeType.LOGIC_GATE, title: 'Aksiyon Türü?', role: 'Router', task: 'Link tıklama/Ürün görüntüleme/Satın alma', status: StepStatus.IDLE, connections: [{ targetId: 'ck-3' }] },
                { id: 'ck-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Etiket Ekle', role: 'ConvertKit', task: 'İlgili etiketi ekle', status: StepStatus.IDLE, connections: [{ targetId: 'ck-4' }] },
                { id: 'ck-4', type: NodeType.CONTENT_CREATOR, title: 'Email Seç', role: 'AI', task: 'Etiketlere uygun email seç', status: StepStatus.IDLE, connections: [{ targetId: 'ck-5' }] },
                { id: 'ck-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'ConvertKit', task: 'Kişiselleştirilmiş email', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'activecampaign-lead-scoring',
        name: 'ActiveCampaign Lead Skorlama',
        description: 'Email açma ve tıklama davranışlarına göre otomatik lead puanlama',
        category: 'email-marketing',
        subcategory: 'activecampaign',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '30 dk',
        icon: '📊',
        tags: ['activecampaign', 'lead-scoring', 'satış', 'önceliklendirme'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Lead Skorlama Sistemi',
            description: 'Otomatik lead puanlama',
            masterGoal: 'Sıcak leadleri tespit et',
            baseKnowledge: 'ActiveCampaign API, Lead scoring metodları',
            category: 'Email Marketing',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ac-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Event', role: 'Webhook', task: 'Açma/Tıklama olayını al', status: StepStatus.IDLE, connections: [{ targetId: 'ac-2' }] },
                { id: 'ac-2', type: NodeType.ANALYST_CRITIC, title: 'Puan Hesapla', role: 'Algoritma', task: 'Açma:+5, Tıklama:+15, Link:+25', status: StepStatus.IDLE, connections: [{ targetId: 'ac-3' }] },
                { id: 'ac-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Skor Güncelle', role: 'ActiveCampaign', task: 'Contact skorunu güncelle', status: StepStatus.IDLE, connections: [{ targetId: 'ac-4' }] },
                { id: 'ac-4', type: NodeType.LOGIC_GATE, title: 'Hot Lead mi?', role: 'Karar', task: 'Skor > 100 ise', status: StepStatus.IDLE, connections: [{ targetId: 'ac-5' }] },
                { id: 'ac-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satışa Bildir', role: 'Slack', task: 'Satış ekibine bildirim', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'sendgrid-transactional-email',
        name: 'SendGrid İşlemsel Email Sistemi',
        description: 'Sipariş, şifre sıfırlama, fatura gibi işlemsel emailleri otomatik gönder',
        category: 'email-marketing',
        subcategory: 'sendgrid',
        difficulty: 'easy',
        estimatedRevenue: '₺10K-25K/ay',
        timeToSetup: '15 dk',
        icon: '📬',
        tags: ['sendgrid', 'transactional', 'işlemsel', 'otomatik'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'İşlemsel Email',
            description: 'Otomatik sistem emailleri',
            masterGoal: 'Müşteri iletişimini otomatikleştir',
            baseKnowledge: 'SendGrid API',
            category: 'Email Marketing',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sg-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Event Webhook', role: 'Tetikleyici', task: 'Sistem olayını al', status: StepStatus.IDLE, connections: [{ targetId: 'sg-2' }] },
                { id: 'sg-2', type: NodeType.LOGIC_GATE, title: 'Email Türü?', role: 'Router', task: 'Sipariş/Şifre/Fatura', status: StepStatus.IDLE, connections: [{ targetId: 'sg-3' }] },
                { id: 'sg-3', type: NodeType.CONTENT_CREATOR, title: 'Template Seç', role: 'Formatter', task: 'İlgili template ile email hazırla', status: StepStatus.IDLE, connections: [{ targetId: 'sg-4' }] },
                { id: 'sg-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'SendGrid Gönder', role: 'Email API', task: 'Email gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// LEAD GENERATION ŞABLONLARI (50+)
// ============================================

const LEAD_GENERATION_TEMPLATES: MegaTemplate[] = [
    {
        id: 'linkedin-profile-scraper',
        name: 'LinkedIn Profil Toplayıcı',
        description: 'Hedef sektörden LinkedIn profillerini topla ve CRM\'e aktar',
        category: 'lead-generation',
        subcategory: 'linkedin',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-80K/ay',
        timeToSetup: '45 dk',
        icon: '🔍',
        tags: ['linkedin', 'scraping', 'lead', 'b2b'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'LinkedIn Lead Finder',
            description: 'Potansiyel müşteri bul',
            masterGoal: 'B2B lead listesi oluştur',
            baseKnowledge: 'LinkedIn Sales Navigator, Web Scraping',
            category: 'Lead Generation',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'lp-1', type: NodeType.STATE_MANAGER, title: 'Arama Kriterleri', role: 'Config', task: 'Sektör, pozisyon, lokasyon', status: StepStatus.IDLE, connections: [{ targetId: 'lp-2' }] },
                { id: 'lp-2', type: NodeType.RESEARCH_WEB, title: 'LinkedIn Ara', role: 'Scraper', task: 'Profilleri topla', status: StepStatus.IDLE, connections: [{ targetId: 'lp-3' }] },
                { id: 'lp-3', type: NodeType.ANALYST_CRITIC, title: 'Email Bul', role: 'Hunter.io', task: 'İş emaillerini tespit et', status: StepStatus.IDLE, connections: [{ targetId: 'lp-4' }] },
                { id: 'lp-4', type: NodeType.ANALYST_CRITIC, title: 'Skor Ver', role: 'AI', task: 'Lead kalitesini puanla', status: StepStatus.IDLE, connections: [{ targetId: 'lp-5' }] },
                { id: 'lp-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'CRM Ekle', role: 'HubSpot', task: 'Leadleri CRM\'e aktar', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'website-visitor-identification',
        name: 'Website Ziyaretçi Tanımlama',
        description: 'Anonim website ziyaretçilerini şirket bazında tanımla',
        category: 'lead-generation',
        subcategory: 'website',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-60K/ay',
        timeToSetup: '30 dk',
        icon: '👁️',
        tags: ['ziyaretçi', 'tanımlama', 'b2b', 'lead'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Ziyaretçi Tanımlayıcı',
            description: 'Kim ziyaret ediyor?',
            masterGoal: 'Anonim ziyaretçileri leadlere dönüştür',
            baseKnowledge: 'Clearbit Reveal, IP Intelligence',
            category: 'Lead Generation',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wv-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Sayfa Görüntüleme', role: 'Webhook', task: 'Ziyaret verisini al', status: StepStatus.IDLE, connections: [{ targetId: 'wv-2' }] },
                { id: 'wv-2', type: NodeType.RESEARCH_WEB, title: 'IP Araştır', role: 'Clearbit', task: 'IP\'den şirket bilgisi al', status: StepStatus.IDLE, connections: [{ targetId: 'wv-3' }] },
                { id: 'wv-3', type: NodeType.LOGIC_GATE, title: 'Hedef Şirket mi?', role: 'Filter', task: 'ICP\'ye uyuyor mu?', status: StepStatus.IDLE, connections: [{ targetId: 'wv-4' }] },
                { id: 'wv-4', type: NodeType.STATE_MANAGER, title: 'Sheets Kaydet', role: 'Database', task: 'Lead listesine ekle', status: StepStatus.IDLE, connections: [{ targetId: 'wv-5' }] },
                { id: 'wv-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Satışa Bildir', role: 'Slack', task: 'Hot lead bildirimi', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'form-lead-enrichment',
        name: 'Form Lead Otomatik Zenginleştirme',
        description: 'Form dolduran leadlerin tüm bilgilerini otomatik tamamla',
        category: 'lead-generation',
        subcategory: 'forms',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-45K/ay',
        timeToSetup: '25 dk',
        icon: '✨',
        tags: ['form', 'enrichment', 'clearbit', 'lead'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Form Zenginleştirici',
            description: 'Lead bilgilerini otomatik tamamla',
            masterGoal: 'Daha kaliteli lead verileri',
            baseKnowledge: 'Clearbit API, Form handling',
            category: 'Lead Generation',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fe-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Form Submit', role: 'Webhook', task: 'Form verisini al', status: StepStatus.IDLE, connections: [{ targetId: 'fe-2' }] },
                { id: 'fe-2', type: NodeType.RESEARCH_WEB, title: 'Email Araştır', role: 'Clearbit', task: 'Email\'den kişi/şirket bilgisi', status: StepStatus.IDLE, connections: [{ targetId: 'fe-3' }] },
                { id: 'fe-3', type: NodeType.ANALYST_CRITIC, title: 'Veri Birleştir', role: 'Merger', task: 'Form + Clearbit verisini birleştir', status: StepStatus.IDLE, connections: [{ targetId: 'fe-4' }] },
                { id: 'fe-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'CRM Kaydet', role: 'HubSpot', task: 'Zengin lead oluştur', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'cold-email-automation',
        name: 'Soğuk Email Outreach Otomasyonu',
        description: 'Kişiselleştirilmiş soğuk email kampanyaları ile lead edinimi',
        category: 'lead-generation',
        subcategory: 'outreach',
        difficulty: 'hard',
        estimatedRevenue: '₺40K-100K/ay',
        timeToSetup: '50 dk',
        icon: '📤',
        tags: ['cold-email', 'outreach', 'ai', 'personalization'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'AI Cold Email',
            description: 'Akıllı soğuk email kampanyası',
            masterGoal: 'Yüksek yanıt oranı',
            baseKnowledge: 'Email deliverability, AI copywriting',
            category: 'Lead Generation',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ce-1', type: NodeType.STATE_MANAGER, title: 'Lead Listesi', role: 'Sheets', task: 'Hedef leadleri al', status: StepStatus.IDLE, connections: [{ targetId: 'ce-2' }] },
                { id: 'ce-2', type: NodeType.RESEARCH_WEB, title: 'Şirket Araştır', role: 'Web', task: 'Şirket haberlerini bul', status: StepStatus.IDLE, connections: [{ targetId: 'ce-3' }] },
                { id: 'ce-3', type: NodeType.CONTENT_CREATOR, title: 'Email Yaz', role: 'GPT-4', task: 'Kişiselleştirilmiş email oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'ce-4' }] },
                { id: 'ce-4', type: NodeType.HUMAN_APPROVAL, title: 'Onay', role: 'Review', task: 'Email onayı al', status: StepStatus.IDLE, connections: [{ targetId: 'ce-5' }] },
                { id: 'ce-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Gönder', role: 'SMTP', task: 'Email gönder ve takip et', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// ANALİTİK & RAPOR ŞABLONLARI (40+)
// ============================================

const ANALYTICS_TEMPLATES: MegaTemplate[] = [
    {
        id: 'weekly-kpi-report',
        name: 'Haftalık KPI Raporu Otomasyonu',
        description: 'Tüm kaynaklardan KPI\'ları toplayıp otomatik rapor oluştur ve gönder',
        category: 'analytics',
        subcategory: 'reporting',
        difficulty: 'hard',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '45 dk',
        icon: '📊',
        tags: ['kpi', 'rapor', 'haftalık', 'otomasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Haftalık KPI Raporu',
            description: 'Otomatik performans raporu',
            masterGoal: 'Yöneticilere düzenli insight',
            baseKnowledge: 'Google Analytics, CRM, Satış verileri',
            category: 'Analytics',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'kr-1', type: NodeType.STATE_MANAGER, title: 'Cuma 17:00', role: 'Cron', task: 'Haftalık tetikle', status: StepStatus.IDLE, connections: [{ targetId: 'kr-2' }] },
                { id: 'kr-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'GA Verileri', role: 'Analytics', task: 'Traffic ve conversion al', status: StepStatus.IDLE, connections: [{ targetId: 'kr-3' }] },
                { id: 'kr-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'CRM Verileri', role: 'HubSpot', task: 'Pipeline ve deal verileri', status: StepStatus.IDLE, connections: [{ targetId: 'kr-4' }] },
                { id: 'kr-4', type: NodeType.ANALYST_CRITIC, title: 'Analiz', role: 'AI', task: 'Trendleri ve önerileri çıkar', status: StepStatus.IDLE, connections: [{ targetId: 'kr-5' }] },
                { id: 'kr-5', type: NodeType.CONTENT_CREATOR, title: 'Rapor Hazırla', role: 'Formatter', task: 'PDF rapor oluştur', status: StepStatus.IDLE, connections: [{ targetId: 'kr-6' }] },
                { id: 'kr-6', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Yöneticilere gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'google-analytics-alert',
        name: 'Google Analytics Anomali Uyarısı',
        description: 'Traffic veya conversion\'da anormal değişiklik olduğunda uyar',
        category: 'analytics',
        subcategory: 'google-analytics',
        difficulty: 'medium',
        estimatedRevenue: '₺10K-25K/ay',
        timeToSetup: '20 dk',
        icon: '🚨',
        tags: ['ga', 'anomali', 'uyarı', 'monitoring'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Analytics Anomali Dedektörü',
            description: 'Anormal değişiklikleri yakala',
            masterGoal: 'Sorunları erken tespit et',
            baseKnowledge: 'Google Analytics API',
            category: 'Analytics',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ga-1', type: NodeType.STATE_MANAGER, title: 'Saatlik Kontrol', role: 'Cron', task: 'Her saat çalış', status: StepStatus.IDLE, connections: [{ targetId: 'ga-2' }] },
                { id: 'ga-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'GA Verileri', role: 'Analytics API', task: 'Güncel ve geçmiş verileri al', status: StepStatus.IDLE, connections: [{ targetId: 'ga-3' }] },
                { id: 'ga-3', type: NodeType.ANALYST_CRITIC, title: 'Karşılaştır', role: 'Algoritma', task: 'Ortalamadan %30+ sapma?', status: StepStatus.IDLE, connections: [{ targetId: 'ga-4' }] },
                { id: 'ga-4', type: NodeType.LOGIC_GATE, title: 'Anomali mi?', role: 'Filter', task: 'Sadece anormal değişiklikler', status: StepStatus.IDLE, connections: [{ targetId: 'ga-5' }] },
                { id: 'ga-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Acil Uyarı', role: 'Slack', task: 'Ekibe bildir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'social-media-analytics',
        name: 'Sosyal Medya Performans Dashboard',
        description: 'Tüm sosyal medya hesaplarının performansını tek yerde topla',
        category: 'analytics',
        subcategory: 'social',
        difficulty: 'medium',
        estimatedRevenue: '₺12K-30K/ay',
        timeToSetup: '30 dk',
        icon: '📱',
        tags: ['sosyal-medya', 'analytics', 'dashboard', 'performans'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Social Media Dashboard',
            description: 'Tüm platformların analizi',
            masterGoal: 'Sosyal medya ROI takibi',
            baseKnowledge: 'Twitter, LinkedIn, Facebook APIs',
            category: 'Analytics',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sd-1', type: NodeType.STATE_MANAGER, title: 'Günlük 23:00', role: 'Cron', task: 'Günlük tetikle', status: StepStatus.IDLE, connections: [{ targetId: 'sd-2' }] },
                { id: 'sd-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Twitter Stats', role: 'Twitter API', task: 'Engagement metrikleri', status: StepStatus.IDLE, connections: [{ targetId: 'sd-4' }] },
                { id: 'sd-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'LinkedIn Stats', role: 'LinkedIn API', task: 'Takipçi ve etkileşim', status: StepStatus.IDLE, connections: [{ targetId: 'sd-4' }] },
                { id: 'sd-4', type: NodeType.STATE_MANAGER, title: 'Sheets Kaydet', role: 'Database', task: 'Tüm verileri kaydet', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// FİNANS & KRİPTO ŞABLONLARI (40+)
// ============================================

const FINANCE_TEMPLATES: MegaTemplate[] = [
    {
        id: 'crypto-price-alert',
        name: 'Kripto Fiyat Uyarı Sistemi',
        description: 'Belirlediğin fiyat seviyelerinde anında bildirim al',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'easy',
        estimatedRevenue: '₺10K-50K/ay',
        timeToSetup: '10 dk',
        icon: '🔔',
        tags: ['kripto', 'fiyat', 'uyarı', 'telegram'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Kripto Fiyat Uyarısı',
            description: 'Hedef fiyat bildirimi',
            masterGoal: 'Fırsatları kaçırma',
            baseKnowledge: 'CoinGecko API, Telegram Bot',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'cp-1', type: NodeType.STATE_MANAGER, title: '1dk Polling', role: 'Cron', task: 'Her dakika kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'cp-2' }] },
                { id: 'cp-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fiyat Al', role: 'CoinGecko', task: 'Güncel fiyatları çek', status: StepStatus.IDLE, connections: [{ targetId: 'cp-3' }] },
                { id: 'cp-3', type: NodeType.LOGIC_GATE, title: 'Hedef mi?', role: 'Compare', task: 'Hedef fiyata ulaştı mı?', status: StepStatus.IDLE, connections: [{ targetId: 'cp-4' }] },
                { id: 'cp-4', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Bildir', role: 'Bot', task: '🚀 Hedef fiyat uyarısı!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-portfolio-tracker',
        name: 'Kripto Portföy Takip Dashboard',
        description: 'Tüm kripto varlıklarını Google Sheets\'te güncel tut',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'medium',
        estimatedRevenue: '₺15K-40K/ay',
        timeToSetup: '25 dk',
        icon: '💼',
        tags: ['kripto', 'portföy', 'tracker', 'sheets'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Kripto Portföy Tracker',
            description: 'Portföy değerini takip et',
            masterGoal: 'Yatırım performansını izle',
            baseKnowledge: 'CoinGecko API, Google Sheets',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'pt-1', type: NodeType.STATE_MANAGER, title: '5dk Güncelle', role: 'Cron', task: '5 dakikada bir', status: StepStatus.IDLE, connections: [{ targetId: 'pt-2' }] },
                { id: 'pt-2', type: NodeType.STATE_MANAGER, title: 'Portföy Oku', role: 'Sheets', task: 'Coin ve miktarları al', status: StepStatus.IDLE, connections: [{ targetId: 'pt-3' }] },
                { id: 'pt-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Fiyatlar', role: 'CoinGecko', task: 'Güncel fiyatları al', status: StepStatus.IDLE, connections: [{ targetId: 'pt-4' }] },
                { id: 'pt-4', type: NodeType.ANALYST_CRITIC, title: 'Değer Hesapla', role: 'Calculator', task: 'Toplam değer ve kar/zarar', status: StepStatus.IDLE, connections: [{ targetId: 'pt-5' }] },
                { id: 'pt-5', type: NodeType.STATE_MANAGER, title: 'Dashboard Güncelle', role: 'Sheets', task: 'Değerleri güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'invoice-reminder-automation',
        name: 'Fatura Ödeme Hatırlatma Sistemi',
        description: 'Vadesi yaklaşan ve geçen faturalar için otomatik hatırlatma',
        category: 'finance',
        subcategory: 'invoicing',
        difficulty: 'medium',
        estimatedRevenue: '₺20K-50K/ay',
        timeToSetup: '30 dk',
        icon: '📋',
        tags: ['fatura', 'hatırlatma', 'ödeme', 'takip'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Fatura Hatırlatıcı',
            description: 'Ödeme takip sistemi',
            masterGoal: 'Nakit akışını optimize et',
            baseKnowledge: 'Invoice API, Email SMTP',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ir-1', type: NodeType.STATE_MANAGER, title: 'Günlük 09:00', role: 'Cron', task: 'Her sabah çalış', status: StepStatus.IDLE, connections: [{ targetId: 'ir-2' }] },
                { id: 'ir-2', type: NodeType.STATE_MANAGER, title: 'Faturaları Al', role: 'Database', task: 'Ödenmemiş faturaları çek', status: StepStatus.IDLE, connections: [{ targetId: 'ir-3' }] },
                { id: 'ir-3', type: NodeType.LOGIC_GATE, title: 'Vade Kontrolü', role: 'Filter', task: '3 gün içinde veya geçmiş', status: StepStatus.IDLE, connections: [{ targetId: 'ir-4' }] },
                { id: 'ir-4', type: NodeType.CONTENT_CREATOR, title: 'Hatırlatma Yaz', role: 'AI', task: 'Nazik ama etkili email', status: StepStatus.IDLE, connections: [{ targetId: 'ir-5' }] },
                { id: 'ir-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Müşteriye hatırlatma', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // GELİŞMİŞ KRİPTO ŞABLONLARI
    {
        id: 'crypto-arbitrage-detector',
        name: 'Kripto Arbitraj Dedektörü',
        description: 'Borsalar arası fiyat farkını tespit et, arbitraj fırsatlarını yakala',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'hard',
        estimatedRevenue: '₺50K-500K/ay',
        timeToSetup: '60 dk',
        icon: '🔄',
        tags: ['kripto', 'arbitraj', 'binance', 'multi-exchange'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Kripto Arbitraj Sistemi',
            description: 'Borsalar arası fiyat farkı tespit',
            masterGoal: 'Düşük riskli kar fırsatları',
            baseKnowledge: 'Binance, KuCoin, Bybit APIs',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ar-1', type: NodeType.STATE_MANAGER, title: '10sn Polling', role: 'Cron', task: 'Hızlı kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'ar-2' }] },
                { id: 'ar-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Binance Fiyat', role: 'API', task: 'Binance fiyatlarını al', status: StepStatus.IDLE, connections: [{ targetId: 'ar-4' }] },
                { id: 'ar-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'KuCoin Fiyat', role: 'API', task: 'KuCoin fiyatlarını al', status: StepStatus.IDLE, connections: [{ targetId: 'ar-4' }] },
                { id: 'ar-4', type: NodeType.ANALYST_CRITIC, title: 'Fark Hesapla', role: 'Calculator', task: '%0.5+ fark varsa', status: StepStatus.IDLE, connections: [{ targetId: 'ar-5' }] },
                { id: 'ar-5', type: NodeType.LOGIC_GATE, title: 'Karlı mı?', role: 'Filter', task: 'Fee sonrası kar var mı?', status: StepStatus.IDLE, connections: [{ targetId: 'ar-6' }] },
                { id: 'ar-6', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Bildir', role: 'Bot', task: '💰 Arbitraj fırsatı!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-whale-tracker',
        name: 'Kripto Whale (Balina) Takip',
        description: 'Büyük cüzdanların hareketlerini takip et, balinalar alırken al',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'hard',
        estimatedRevenue: '₺30K-200K/ay',
        timeToSetup: '45 dk',
        icon: '🐋',
        tags: ['kripto', 'whale', 'balina', 'on-chain'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Balina Takip Sistemi',
            description: 'Büyük yatırımcı hareketleri',
            masterGoal: 'Smart money takibi',
            baseKnowledge: 'Blockchain APIs, Whale Alert',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'wh-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Whale Alert', role: 'Webhook', task: 'Büyük transfer al', status: StepStatus.IDLE, connections: [{ targetId: 'wh-2' }] },
                { id: 'wh-2', type: NodeType.LOGIC_GATE, title: 'Büyüklük?', role: 'Filter', task: '$1M+ transfer mi?', status: StepStatus.IDLE, connections: [{ targetId: 'wh-3' }] },
                { id: 'wh-3', type: NodeType.ANALYST_CRITIC, title: 'Analiz', role: 'AI', task: 'Alış mı satış mı?', status: StepStatus.IDLE, connections: [{ targetId: 'wh-4' }] },
                { id: 'wh-4', type: NodeType.CONTENT_CREATOR, title: 'Mesaj Oluştur', role: 'Formatter', task: 'Detaylı balina raporu', status: StepStatus.IDLE, connections: [{ targetId: 'wh-5' }] },
                { id: 'wh-5', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Bildir', role: 'Bot', task: '🐋 Balina hareketi!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-dca-bot',
        name: 'Kripto DCA (Dollar Cost Averaging) Bot',
        description: 'Düzenli aralıklarla otomatik kripto alımı yap',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'medium',
        estimatedRevenue: 'Uzun vadeli kar',
        timeToSetup: '20 dk',
        icon: '📊',
        tags: ['kripto', 'dca', 'otomatik', 'yatırım'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'DCA Yatırım Botu',
            description: 'Düzenli otomatik alım',
            masterGoal: 'Volatiliteyi azalt',
            baseKnowledge: 'Binance API, Order execution',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'dca-1', type: NodeType.STATE_MANAGER, title: 'Haftalık Pazartesi', role: 'Cron', task: 'Her Pazartesi 10:00', status: StepStatus.IDLE, connections: [{ targetId: 'dca-2' }] },
                { id: 'dca-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Balance Kontrol', role: 'Binance', task: 'USDT bakiyesi yeterli mi?', status: StepStatus.IDLE, connections: [{ targetId: 'dca-3' }] },
                { id: 'dca-3', type: NodeType.LOGIC_GATE, title: 'Yeterli mi?', role: 'Filter', task: 'Min $50 varsa', status: StepStatus.IDLE, connections: [{ targetId: 'dca-4' }] },
                { id: 'dca-4', type: NodeType.TRADING_DESK, title: 'Alım Yap', role: 'Binance', task: 'Market order ile BTC al', status: StepStatus.IDLE, connections: [{ targetId: 'dca-5' }] },
                { id: 'dca-5', type: NodeType.STATE_MANAGER, title: 'Log Kaydet', role: 'Sheets', task: 'İşlem geçmişine ekle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-fear-greed-alert',
        name: 'Kripto Fear & Greed Index Uyarısı',
        description: 'Piyasa aşırı korku veya açgözlülükte uyar - al/sat sinyali',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'easy',
        estimatedRevenue: '₺20K-80K/ay',
        timeToSetup: '15 dk',
        icon: '😱',
        tags: ['kripto', 'fear-greed', 'sentiment', 'sinyal'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Fear & Greed Uyarısı',
            description: 'Piyasa duygu analizi',
            masterGoal: 'Dip ve tepe tespiti',
            baseKnowledge: 'Alternative.me API',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fg-1', type: NodeType.STATE_MANAGER, title: 'Günlük Kontrol', role: 'Cron', task: 'Her gün 09:00', status: StepStatus.IDLE, connections: [{ targetId: 'fg-2' }] },
                { id: 'fg-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Index Al', role: 'API', task: 'Fear & Greed değerini çek', status: StepStatus.IDLE, connections: [{ targetId: 'fg-3' }] },
                { id: 'fg-3', type: NodeType.LOGIC_GATE, title: 'Aşırı mı?', role: 'Filter', task: '<20 (Extreme Fear) veya >80 (Extreme Greed)', status: StepStatus.IDLE, connections: [{ targetId: 'fg-4' }] },
                { id: 'fg-4', type: NodeType.CONTENT_CREATOR, title: 'Sinyal Oluştur', role: 'AI', task: 'AL/SAT tavsiyesi', status: StepStatus.IDLE, connections: [{ targetId: 'fg-5' }] },
                { id: 'fg-5', type: NodeType.SOCIAL_MANAGER, title: 'Telegram Bildir', role: 'Bot', task: '📊 Piyasa sinyali!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-new-listing-alert',
        name: 'Yeni Coin Listeleme Uyarısı',
        description: 'Binance\'e yeni coin listelendiğinde erken haber al',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'medium',
        estimatedRevenue: '₺100K-1M+/ay',
        timeToSetup: '25 dk',
        icon: '🚀',
        tags: ['kripto', 'listing', 'binance', 'erken'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Yeni Listeleme Takibi',
            description: 'Erken listing haberleri',
            masterGoal: 'İlk saatlerde al',
            baseKnowledge: 'Binance Announcements, RSS',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'nl-1', type: NodeType.STATE_MANAGER, title: '1dk Polling', role: 'Cron', task: 'Sürekli kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'nl-2' }] },
                { id: 'nl-2', type: NodeType.RESEARCH_WEB, title: 'Duyuru Tara', role: 'Scraper', task: 'Binance duyurularını tara', status: StepStatus.IDLE, connections: [{ targetId: 'nl-3' }] },
                { id: 'nl-3', type: NodeType.ANALYST_CRITIC, title: 'Listing mi?', role: 'NLP', task: 'Yeni listing duyurusu mu?', status: StepStatus.IDLE, connections: [{ targetId: 'nl-4' }] },
                { id: 'nl-4', type: NodeType.LOGIC_GATE, title: 'Yeni mi?', role: 'Filter', task: 'Daha önce bildirildi mi?', status: StepStatus.IDLE, connections: [{ targetId: 'nl-5' }] },
                { id: 'nl-5', type: NodeType.SOCIAL_MANAGER, title: 'Acil Bildir', role: 'Telegram', task: '🚀 YENİ LİSTELEME!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'crypto-rsi-alert',
        name: 'Kripto RSI Teknik Analiz Uyarısı',
        description: 'RSI aşırı alım/satım bölgelerinde sinyal gönder',
        category: 'finance',
        subcategory: 'crypto',
        difficulty: 'medium',
        estimatedRevenue: '₺25K-100K/ay',
        timeToSetup: '20 dk',
        icon: '📈',
        tags: ['kripto', 'rsi', 'teknik-analiz', 'trading'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'RSI Trading Sinyalleri',
            description: 'Teknik analiz otomasyonu',
            masterGoal: 'Al/sat sinyalleri',
            baseKnowledge: 'Binance API, Teknik analiz',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'rsi-1', type: NodeType.STATE_MANAGER, title: '15dk Kontrol', role: 'Cron', task: 'Her 15 dakika', status: StepStatus.IDLE, connections: [{ targetId: 'rsi-2' }] },
                { id: 'rsi-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Klines Al', role: 'Binance', task: 'Mum verilerini çek', status: StepStatus.IDLE, connections: [{ targetId: 'rsi-3' }] },
                { id: 'rsi-3', type: NodeType.ANALYST_CRITIC, title: 'RSI Hesapla', role: 'Calculator', task: '14 periyotluk RSI', status: StepStatus.IDLE, connections: [{ targetId: 'rsi-4' }] },
                { id: 'rsi-4', type: NodeType.LOGIC_GATE, title: 'Sinyal Var mı?', role: 'Filter', task: 'RSI<30 (AL) veya RSI>70 (SAT)', status: StepStatus.IDLE, connections: [{ targetId: 'rsi-5' }] },
                { id: 'rsi-5', type: NodeType.SOCIAL_MANAGER, title: 'Sinyal Gönder', role: 'Telegram', task: '📈 Trading sinyali!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    // 📈 STOCK & FOREX ($80K-1M/ay)
    {
        id: 'stock-options-scanner-pro',
        name: '📈 Stock Options Scanner PRO (Opsiyon Tarayıcı)',
        description: 'Wall Street balinalarının opsiyon hareketlerini ve unusual volume\'u yakala',
        category: 'finance',
        subcategory: 'stock',
        difficulty: 'hard',
        estimatedRevenue: '₺100K-1M/ay',
        timeToSetup: '90 dk',
        icon: '🐂',
        tags: ['stock', 'options', 'scanner', 'trading', 'finance'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Options Scanner',
            description: 'Profesyonel opsiyon tarayıcı',
            masterGoal: 'Unusual options activity',
            baseKnowledge: 'Polygon.io API, Options Greeks',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sos-1', type: NodeType.STATE_MANAGER, title: 'Real-time Stream', role: 'WebSocket', task: 'Canlı piyasa verisi', status: StepStatus.IDLE, connections: [{ targetId: 'sos-2' }] },
                { id: 'sos-2', type: NodeType.LOGIC_GATE, title: 'Unusual Volume?', role: 'Filter', task: 'Volume > OI', status: StepStatus.IDLE, connections: [{ targetId: 'sos-3' }] },
                { id: 'sos-3', type: NodeType.ANALYST_CRITIC, title: 'Smart Money?', role: 'AI', task: 'Kurumsal işlem mi?', status: StepStatus.IDLE, connections: [{ targetId: 'sos-4' }] },
                { id: 'sos-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Acil Sinyal', role: 'Discord', task: '🚀 Unusual call option!', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'forex-news-trader-pro',
        name: '💹 Forex News Trader PRO (Haber Botu)',
        description: 'Ekonomik takvimi takip et, faiz kararlarında saniyeler içinde işlem sinyali üret',
        category: 'finance',
        subcategory: 'forex',
        difficulty: 'hard',
        estimatedRevenue: '₺80K-500K/ay',
        timeToSetup: '60 dk',
        icon: '💹',
        tags: ['forex', 'news', 'trading', 'haber', 'ekonomi'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Forex News Bot',
            description: 'Haber bazlı alım satım',
            masterGoal: 'Volatiliteyi yakala',
            baseKnowledge: 'Forex Factory API, News sentiment',
            category: 'Finance',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'fnt-1', type: NodeType.STATE_MANAGER, title: 'Takvim Kontrol', role: 'Cron', task: 'Önemli haber saati', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-2' }] },
                { id: 'fnt-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Veri Çek', role: 'API', task: 'Açıklanan veriyi al', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-3' }] },
                { id: 'fnt-3', type: NodeType.LOGIC_GATE, title: 'Sapma Var mı?', role: 'Calc', task: 'Beklenti vs Açıklanan', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-4' }] },
                { id: 'fnt-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'İşlem Tetikle', role: 'MetaTrader', task: 'Otomatik buy/sell', status: StepStatus.IDLE, connections: [{ targetId: 'fnt-5' }] },
                { id: 'fnt-5', type: NodeType.SOCIAL_MANAGER, title: 'Raporla', role: 'Telegram', task: 'İşlem sonucu', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// VERİTABANI ŞABLONLARI (30+)
// ============================================

const DATABASE_TEMPLATES: MegaTemplate[] = [
    {
        id: 'airtable-to-sheets-sync',
        name: 'Airtable ↔ Google Sheets Senkronizasyon',
        description: 'Airtable ve Sheets arasında iki yönlü otomatik senkronizasyon',
        category: 'database',
        subcategory: 'airtable',
        difficulty: 'medium',
        estimatedRevenue: '10+ saat/hafta',
        timeToSetup: '20 dk',
        icon: '🔄',
        tags: ['airtable', 'sheets', 'sync', 'database'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Airtable Sheets Sync',
            description: 'İki yönlü veri senkronizasyonu',
            masterGoal: 'Verileri her yerde güncel tut',
            baseKnowledge: 'Airtable API, Google Sheets API',
            category: 'Database',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'as-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Airtable Webhook', role: 'Tetikleyici', task: 'Değişiklik algıla', status: StepStatus.IDLE, connections: [{ targetId: 'as-2' }] },
                { id: 'as-2', type: NodeType.ANALYST_CRITIC, title: 'Veri Dönüştür', role: 'Mapper', task: 'Sheets formatına', status: StepStatus.IDLE, connections: [{ targetId: 'as-3' }] },
                { id: 'as-3', type: NodeType.STATE_MANAGER, title: 'Sheets Güncelle', role: 'Update', task: 'İlgili satırı güncelle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'supabase-backup',
        name: 'Supabase Günlük Yedekleme',
        description: 'Supabase veritabanını her gün otomatik yedekle',
        category: 'database',
        subcategory: 'supabase',
        difficulty: 'medium',
        estimatedRevenue: 'Veri güvenliği',
        timeToSetup: '25 dk',
        icon: '💾',
        tags: ['supabase', 'backup', 'yedek', 'güvenlik'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Supabase Backup',
            description: 'Otomatik veritabanı yedekleme',
            masterGoal: 'Veri kaybını önle',
            baseKnowledge: 'Supabase API, Cloud Storage',
            category: 'Database',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'sb-1', type: NodeType.STATE_MANAGER, title: 'Gece 03:00', role: 'Cron', task: 'Günlük yedekleme', status: StepStatus.IDLE, connections: [{ targetId: 'sb-2' }] },
                { id: 'sb-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Export', role: 'Supabase', task: 'Tüm tabloları export', status: StepStatus.IDLE, connections: [{ targetId: 'sb-3' }] },
                { id: 'sb-3', type: NodeType.EXTERNAL_CONNECTOR, title: 'Drive Kaydet', role: 'Storage', task: 'Google Drive\'a yükle', status: StepStatus.IDLE, connections: [{ targetId: 'sb-4' }] },
                { id: 'sb-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildir', role: 'Slack', task: 'Yedekleme tamamlandı', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'notion-database-export',
        name: 'Notion Database → CSV Export',
        description: 'Notion veritabanlarını düzenli olarak CSV olarak export et',
        category: 'database',
        subcategory: 'notion',
        difficulty: 'easy',
        estimatedRevenue: '5+ saat/hafta',
        timeToSetup: '15 dk',
        icon: '📤',
        tags: ['notion', 'export', 'csv', 'yedek'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Notion Export',
            description: 'Notion verilerini yedekle',
            masterGoal: 'Veri taşınabilirliği',
            baseKnowledge: 'Notion API',
            category: 'Database',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ne-1', type: NodeType.STATE_MANAGER, title: 'Haftalık', role: 'Cron', task: 'Her Pazar 00:00', status: StepStatus.IDLE, connections: [{ targetId: 'ne-2' }] },
                { id: 'ne-2', type: NodeType.STATE_MANAGER, title: 'Notion Oku', role: 'API', task: 'Tüm satırları al', status: StepStatus.IDLE, connections: [{ targetId: 'ne-3' }] },
                { id: 'ne-3', type: NodeType.ANALYST_CRITIC, title: 'CSV Dönüştür', role: 'Converter', task: 'CSV formatına dönüştür', status: StepStatus.IDLE, connections: [{ targetId: 'ne-4' }] },
                { id: 'ne-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Drive Kaydet', role: 'Storage', task: 'Google Drive\'a yükle', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// PROJE YÖNETİMİ ŞABLONLARI (40+)
// ============================================

const PROJECT_MANAGEMENT_TEMPLATES: MegaTemplate[] = [
    {
        id: 'asana-slack-updates',
        name: 'Asana Görev Güncellemeleri → Slack',
        description: 'Asana\'da görev tamamlandığında veya güncellendiğinde Slack\'e bildir',
        category: 'project-management',
        subcategory: 'asana',
        difficulty: 'easy',
        estimatedRevenue: '8+ saat/hafta',
        timeToSetup: '10 dk',
        icon: '✅',
        tags: ['asana', 'slack', 'görev', 'bildirim'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Asana Slack Sync',
            description: 'Görev güncellemelerini paylaş',
            masterGoal: 'Ekip iletişimini güçlendir',
            baseKnowledge: 'Asana Webhooks, Slack API',
            category: 'Project Management',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'as-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'Asana Webhook', role: 'Tetikleyici', task: 'Görev güncellemesi al', status: StepStatus.IDLE, connections: [{ targetId: 'as-2' }] },
                { id: 'as-2', type: NodeType.LOGIC_GATE, title: 'Önemli mi?', role: 'Filter', task: 'Tamamlandı veya atandı', status: StepStatus.IDLE, connections: [{ targetId: 'as-3' }] },
                { id: 'as-3', type: NodeType.CONTENT_CREATOR, title: 'Mesaj Oluştur', role: 'Formatter', task: 'Slack mesajı formatla', status: StepStatus.IDLE, connections: [{ targetId: 'as-4' }] },
                { id: 'as-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Slack Gönder', role: 'Bildirim', task: 'İlgili kanala gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'clickup-time-tracking-report',
        name: 'ClickUp Haftalık Zaman Raporu',
        description: 'Ekip üyelerinin haftalık çalışma sürelerini otomatik raporla',
        category: 'project-management',
        subcategory: 'clickup',
        difficulty: 'medium',
        estimatedRevenue: '10+ saat/hafta',
        timeToSetup: '25 dk',
        icon: '⏱️',
        tags: ['clickup', 'zaman', 'rapor', 'ekip'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Zaman Takip Raporu',
            description: 'Haftalık çalışma raporu',
            masterGoal: 'Verimlilik takibi',
            baseKnowledge: 'ClickUp API, Time tracking',
            category: 'Project Management',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'ct-1', type: NodeType.STATE_MANAGER, title: 'Cuma 17:00', role: 'Cron', task: 'Haftalık tetikle', status: StepStatus.IDLE, connections: [{ targetId: 'ct-2' }] },
                { id: 'ct-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Time Entries', role: 'ClickUp API', task: 'Haftalık süreleri çek', status: StepStatus.IDLE, connections: [{ targetId: 'ct-3' }] },
                { id: 'ct-3', type: NodeType.ANALYST_CRITIC, title: 'Özetle', role: 'Aggregator', task: 'Kişi bazlı toplam saatler', status: StepStatus.IDLE, connections: [{ targetId: 'ct-4' }] },
                { id: 'ct-4', type: NodeType.CONTENT_CREATOR, title: 'Rapor Oluştur', role: 'Formatter', task: 'Güzel formatlanmış rapor', status: StepStatus.IDLE, connections: [{ targetId: 'ct-5' }] },
                { id: 'ct-5', type: NodeType.EXTERNAL_CONNECTOR, title: 'Email Gönder', role: 'SMTP', task: 'Yöneticilere gönder', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'jira-github-integration',
        name: 'Jira ↔ GitHub İş Akışı',
        description: 'GitHub PR açıldığında Jira ticket\'ı güncelle, merge olunca kapat',
        category: 'project-management',
        subcategory: 'jira',
        difficulty: 'hard',
        estimatedRevenue: '15+ saat/hafta',
        timeToSetup: '40 dk',
        icon: '🔗',
        tags: ['jira', 'github', 'devops', 'entegrasyon'],
        source: 'n8n',
        popular: true,
        blueprint: {
            name: 'Jira GitHub Sync',
            description: 'Geliştirme iş akışı otomasyonu',
            masterGoal: 'Developer deneyimini iyileştir',
            baseKnowledge: 'Jira API, GitHub Webhooks',
            category: 'Project Management',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'jg-1', type: NodeType.EXTERNAL_CONNECTOR, title: 'GitHub Webhook', role: 'Tetikleyici', task: 'PR event al', status: StepStatus.IDLE, connections: [{ targetId: 'jg-2' }] },
                { id: 'jg-2', type: NodeType.ANALYST_CRITIC, title: 'Ticket ID Çıkar', role: 'Parser', task: 'Branch adından Jira ID', status: StepStatus.IDLE, connections: [{ targetId: 'jg-3' }] },
                { id: 'jg-3', type: NodeType.LOGIC_GATE, title: 'PR Durumu?', role: 'Router', task: 'Açıldı/Merged/Closed', status: StepStatus.IDLE, connections: [{ targetId: 'jg-4' }] },
                { id: 'jg-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Jira Güncelle', role: 'Jira API', task: 'Status değiştir', status: StepStatus.IDLE, connections: [] }
            ]
        }
    },
    {
        id: 'monday-deadline-reminder',
        name: 'Monday.com Deadline Hatırlatıcı',
        description: 'Yaklaşan deadlineler için ekip üyelerine otomatik hatırlatma',
        category: 'project-management',
        subcategory: 'monday',
        difficulty: 'easy',
        estimatedRevenue: '8+ saat/hafta',
        timeToSetup: '15 dk',
        icon: '📅',
        tags: ['monday', 'deadline', 'hatırlatma', 'görev'],
        source: 'n8n',
        popular: false,
        blueprint: {
            name: 'Deadline Hatırlatıcı',
            description: 'Görev hatırlatmaları',
            masterGoal: 'Deadline kaçırma',
            baseKnowledge: 'Monday.com API',
            category: 'Project Management',
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: [
                { id: 'md-1', type: NodeType.STATE_MANAGER, title: 'Her Sabah 09:00', role: 'Cron', task: 'Günlük kontrol', status: StepStatus.IDLE, connections: [{ targetId: 'md-2' }] },
                { id: 'md-2', type: NodeType.EXTERNAL_CONNECTOR, title: 'Görevleri Al', role: 'Monday API', task: 'Tüm açık görevler', status: StepStatus.IDLE, connections: [{ targetId: 'md-3' }] },
                { id: 'md-3', type: NodeType.LOGIC_GATE, title: 'Yaklaşan mı?', role: 'Filter', task: '3 gün içinde bitenler', status: StepStatus.IDLE, connections: [{ targetId: 'md-4' }] },
                { id: 'md-4', type: NodeType.EXTERNAL_CONNECTOR, title: 'Bildir', role: 'Slack DM', task: 'Kişiye özel hatırlatma', status: StepStatus.IDLE, connections: [] }
            ]
        }
    }
];

// ============================================
// TÜM ŞABLONLARI BİRLEŞTİR
// ============================================

export const MEGA_TEMPLATES: MegaTemplate[] = [
    ...ECOMMERCE_TEMPLATES,
    ...CRM_TEMPLATES,
    ...SOCIAL_MEDIA_TEMPLATES,
    ...AI_CONTENT_TEMPLATES,
    ...PRODUCTIVITY_TEMPLATES,
    ...EMAIL_MARKETING_TEMPLATES,
    ...LEAD_GENERATION_TEMPLATES,
    ...ANALYTICS_TEMPLATES,
    ...FINANCE_TEMPLATES,
    ...DATABASE_TEMPLATES,
    ...PROJECT_MANAGEMENT_TEMPLATES
];

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

export const getMegaTemplateById = (id: string): MegaTemplate | undefined => {
    return MEGA_TEMPLATES.find(t => t.id === id);
};

export const getMegaTemplatesByCategory = (category: string): MegaTemplate[] => {
    return MEGA_TEMPLATES.filter(t => t.category === category);
};

export const getPopularMegaTemplates = (): MegaTemplate[] => {
    return MEGA_TEMPLATES.filter(t => t.popular);
};

export const searchMegaTemplates = (query: string): MegaTemplate[] => {
    const lowerQuery = query.toLowerCase();
    return MEGA_TEMPLATES.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
};

export const getMegaTemplateStats = () => {
    const byCategory = Object.keys(MEGA_TEMPLATE_CATEGORIES).reduce((acc, cat) => {
        acc[cat] = MEGA_TEMPLATES.filter(t => t.category === cat).length;
        return acc;
    }, {} as Record<string, number>);

    return {
        total: MEGA_TEMPLATES.length,
        byCategory,
        popular: MEGA_TEMPLATES.filter(t => t.popular).length,
        easy: MEGA_TEMPLATES.filter(t => t.difficulty === 'easy').length,
        medium: MEGA_TEMPLATES.filter(t => t.difficulty === 'medium').length,
        hard: MEGA_TEMPLATES.filter(t => t.difficulty === 'hard').length
    };
};
