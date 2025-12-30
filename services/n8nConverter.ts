// ============================================
// N8N to OmniFlow Converter
// ============================================
// n8n workflow JSON'larını OmniFlow formatına dönüştürür

import { NodeType, StepStatus } from '../types';

// n8n Node Type → OmniFlow Node Type mapping
export const N8N_NODE_MAPPING: Record<string, NodeType> = {
    // Triggers
    'n8n-nodes-base.webhook': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.schedule': NodeType.STATE_MANAGER,
    'n8n-nodes-base.cron': NodeType.STATE_MANAGER,
    'n8n-nodes-base.manualTrigger': NodeType.STATE_MANAGER,

    // Social Media
    'n8n-nodes-base.twitter': NodeType.SOCIAL_MANAGER,
    'n8n-nodes-base.linkedin': NodeType.SOCIAL_MANAGER,
    'n8n-nodes-base.facebook': NodeType.SOCIAL_MANAGER,
    'n8n-nodes-base.telegram': NodeType.SOCIAL_MANAGER,
    'n8n-nodes-base.discord': NodeType.SOCIAL_MANAGER,
    'n8n-nodes-base.slack': NodeType.EXTERNAL_CONNECTOR,

    // E-commerce
    'n8n-nodes-base.shopify': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.wooCommerce': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.stripe': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.paypal': NodeType.EXTERNAL_CONNECTOR,

    // CRM
    'n8n-nodes-base.hubspot': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.pipedrive': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.salesforce': NodeType.EXTERNAL_CONNECTOR,

    // Email Marketing
    'n8n-nodes-base.mailchimp': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.convertKit': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.activeCampaign': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.sendGrid': NodeType.EXTERNAL_CONNECTOR,

    // AI & Content
    'n8n-nodes-base.openAi': NodeType.CONTENT_CREATOR,
    '@n8n/n8n-nodes-langchain.openAi': NodeType.CONTENT_CREATOR,
    'n8n-nodes-base.bannerbear': NodeType.MEDIA_ENGINEER,

    // Data Processing
    'n8n-nodes-base.code': NodeType.ANALYST_CRITIC,
    'n8n-nodes-base.function': NodeType.ANALYST_CRITIC,
    'n8n-nodes-base.if': NodeType.LOGIC_GATE,
    'n8n-nodes-base.switch': NodeType.LOGIC_GATE,
    'n8n-nodes-base.filter': NodeType.LOGIC_GATE,
    'n8n-nodes-base.merge': NodeType.STATE_MANAGER,
    'n8n-nodes-base.splitInBatches': NodeType.STATE_MANAGER,

    // Databases
    'n8n-nodes-base.postgres': NodeType.STATE_MANAGER,
    'n8n-nodes-base.mysql': NodeType.STATE_MANAGER,
    'n8n-nodes-base.mongodb': NodeType.STATE_MANAGER,
    'n8n-nodes-base.airtable': NodeType.STATE_MANAGER,
    'n8n-nodes-base.notion': NodeType.STATE_MANAGER,
    'n8n-nodes-base.supabase': NodeType.STATE_MANAGER,

    // Google
    'n8n-nodes-base.googleSheets': NodeType.STATE_MANAGER,
    'n8n-nodes-base.googleDrive': NodeType.STATE_MANAGER,
    'n8n-nodes-base.gmail': NodeType.EXTERNAL_CONNECTOR,
    'n8n-nodes-base.googleCalendar': NodeType.STATE_MANAGER,

    // HTTP & API
    'n8n-nodes-base.httpRequest': NodeType.RESEARCH_WEB,
    'n8n-nodes-base.respondToWebhook': NodeType.EXTERNAL_CONNECTOR,

    // Project Management
    'n8n-nodes-base.asana': NodeType.STATE_MANAGER,
    'n8n-nodes-base.clickUp': NodeType.STATE_MANAGER,
    'n8n-nodes-base.trello': NodeType.STATE_MANAGER,
    'n8n-nodes-base.jira': NodeType.STATE_MANAGER,
    'n8n-nodes-base.monday': NodeType.STATE_MANAGER,

    // Default
    'default': NodeType.EXTERNAL_CONNECTOR
};

// n8n kategori → OmniFlow kategori mapping
export const N8N_CATEGORY_MAPPING: Record<string, string> = {
    'Shopify': 'ecommerce',
    'Woocommerce': 'ecommerce',
    'Stripe': 'payments',
    'Paypal': 'payments',
    'Hubspot': 'crm-sales',
    'Pipedrive': 'crm-sales',
    'Salesforce': 'crm-sales',
    'Zohocrm': 'crm-sales',
    'Mailchimp': 'email-marketing',
    'Convertkit': 'email-marketing',
    'Activecampaign': 'email-marketing',
    'Twitter': 'social-media',
    'Linkedin': 'social-media',
    'Facebook': 'social-media',
    'Telegram': 'social-media',
    'Discord': 'social-media',
    'Youtube': 'social-media',
    'Whatsapp': 'social-media',
    'Slack': 'productivity',
    'Googlesheets': 'productivity',
    'Googledrive': 'productivity',
    'Gmail': 'productivity',
    'Notion': 'productivity',
    'Airtable': 'productivity',
    'Asana': 'project-management',
    'Clickup': 'project-management',
    'Trello': 'project-management',
    'Jira': 'project-management',
    'Mondaycom': 'project-management',
    'Openai': 'ai-content',
    'Http': 'api-integration',
    'Webhook': 'api-integration',
    'Postgres': 'database',
    'Mysql': 'database',
    'Supabase': 'database',
    'Crypto': 'finance',
    'Coingecko': 'finance'
};

// Zorluk tahmini
function estimateDifficulty(nodeCount: number): 'easy' | 'medium' | 'hard' {
    if (nodeCount <= 5) return 'easy';
    if (nodeCount <= 10) return 'medium';
    return 'hard';
}

// Gelir tahmini (Türkçe)
function estimateRevenue(category: string, difficulty: string): string {
    const revenueMap: Record<string, Record<string, string>> = {
        'ecommerce': { easy: '₺5K-15K/ay', medium: '₺15K-40K/ay', hard: '₺40K-100K/ay' },
        'crm-sales': { easy: '₺10K-25K/ay', medium: '₺25K-50K/ay', hard: '₺50K-150K/ay' },
        'social-media': { easy: '₺3K-10K/ay', medium: '₺10K-30K/ay', hard: '₺30K-75K/ay' },
        'email-marketing': { easy: '₺5K-15K/ay', medium: '₺15K-35K/ay', hard: '₺35K-80K/ay' },
        'ai-content': { easy: '₺10K-25K/ay', medium: '₺25K-60K/ay', hard: '₺60K-150K/ay' },
        'payments': { easy: '₺5K-20K/ay', medium: '₺20K-50K/ay', hard: '₺50K-100K/ay' },
        'productivity': { easy: '5+ saat/hafta', medium: '10+ saat/hafta', hard: '20+ saat/hafta' },
        'project-management': { easy: '5+ saat/hafta', medium: '10+ saat/hafta', hard: '15+ saat/hafta' },
        'finance': { easy: '₺5K-25K/ay', medium: '₺25K-75K/ay', hard: '₺75K-500K/ay' },
        'default': { easy: '₺2K-8K/ay', medium: '₺8K-20K/ay', hard: '₺20K-50K/ay' }
    };

    const categoryRevenue = revenueMap[category] || revenueMap['default'];
    return categoryRevenue[difficulty] || categoryRevenue['medium'];
}

// Kategori ikonu
function getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
        'ecommerce': '🛒',
        'crm-sales': '🎯',
        'social-media': '📱',
        'email-marketing': '📧',
        'ai-content': '🤖',
        'payments': '💳',
        'productivity': '⚡',
        'project-management': '📋',
        'finance': '💰',
        'database': '🗄️',
        'api-integration': '🔗'
    };
    return iconMap[category] || '🔧';
}

// n8n node'unu OmniFlow node'una dönüştür
interface N8nNode {
    id: string;
    name: string;
    type: string;
    parameters?: Record<string, any>;
    position?: [number, number];
}

interface N8nConnection {
    node: string;
    type: string;
    index: number;
}

interface N8nWorkflow {
    name: string;
    nodes: N8nNode[];
    connections: Record<string, { main: N8nConnection[][] }>;
    settings?: Record<string, any>;
}

export function convertN8nNode(n8nNode: N8nNode, index: number): any {
    const nodeType = N8N_NODE_MAPPING[n8nNode.type] || N8N_NODE_MAPPING['default'];

    return {
        id: `node-${index}`,
        type: nodeType,
        title: n8nNode.name,
        role: n8nNode.type.split('.').pop() || 'Connector',
        task: `${n8nNode.name} işlemini gerçekleştir`,
        status: StepStatus.IDLE,
        connections: [] // Sonra doldurulacak
    };
}

// n8n workflow'u OmniFlow template'e dönüştür
export function convertN8nWorkflow(
    workflow: N8nWorkflow,
    sourceCategory: string,
    originalId: string
): any {
    const category = N8N_CATEGORY_MAPPING[sourceCategory] || 'other';
    const difficulty = estimateDifficulty(workflow.nodes.length);

    // Node'ları dönüştür
    const convertedNodes = workflow.nodes.map((node, index) =>
        convertN8nNode(node, index)
    );

    // Bağlantıları ekle
    if (workflow.connections) {
        Object.entries(workflow.connections).forEach(([sourceName, conn]) => {
            const sourceNode = convertedNodes.find(n => n.title === sourceName);
            if (sourceNode && conn.main) {
                conn.main.forEach(outputs => {
                    outputs.forEach(output => {
                        const targetNode = convertedNodes.find(n => n.title === output.node);
                        if (targetNode) {
                            sourceNode.connections.push({ targetId: targetNode.id });
                        }
                    });
                });
            }
        });
    }

    // Türkçe isim oluştur
    const turkishName = generateTurkishName(workflow.name, category);

    return {
        id: `n8n-${originalId}`,
        name: turkishName,
        description: generateDescription(workflow.name, category),
        category: category,
        subcategory: sourceCategory.toLowerCase(),
        difficulty: difficulty,
        estimatedRevenue: estimateRevenue(category, difficulty),
        timeToSetup: difficulty === 'easy' ? '5 dk' : difficulty === 'medium' ? '15 dk' : '30+ dk',
        icon: getCategoryIcon(category),
        tags: generateTags(workflow.name, category, sourceCategory),
        source: 'n8n',
        originalId: originalId,
        blueprint: {
            name: turkishName,
            description: generateDescription(workflow.name, category),
            masterGoal: `${turkishName} otomasyonunu çalıştır`,
            baseKnowledge: `${sourceCategory} API entegrasyonu`,
            category: category,
            version: 1,
            testConfig: { variables: [], simulateFailures: false },
            nodes: convertedNodes
        }
    };
}

// Türkçe isim üretici
function generateTurkishName(originalName: string, category: string): string {
    // Basit çeviriler
    const translations: Record<string, string> = {
        'order': 'Sipariş',
        'customer': 'Müşteri',
        'notification': 'Bildirim',
        'sync': 'Senkronizasyon',
        'send': 'Gönder',
        'create': 'Oluştur',
        'update': 'Güncelle',
        'delete': 'Sil',
        'get': 'Al',
        'post': 'Paylaş',
        'message': 'Mesaj',
        'email': 'E-posta',
        'lead': 'Potansiyel Müşteri',
        'contact': 'Kişi',
        'deal': 'Fırsat',
        'invoice': 'Fatura',
        'payment': 'Ödeme',
        'report': 'Rapor',
        'backup': 'Yedekleme',
        'alert': 'Uyarı',
        'automation': 'Otomasyon',
        'workflow': 'İş Akışı',
        'trigger': 'Tetikleyici',
        'new': 'Yeni',
        'to': '→'
    };

    let turkishName = originalName;
    Object.entries(translations).forEach(([eng, tr]) => {
        turkishName = turkishName.replace(new RegExp(eng, 'gi'), tr);
    });

    return turkishName;
}

// Açıklama üretici
function generateDescription(originalName: string, category: string): string {
    const categoryDescriptions: Record<string, string> = {
        'ecommerce': 'E-ticaret işlemlerinizi otomatikleştirin',
        'crm-sales': 'Satış süreçlerinizi hızlandırın',
        'social-media': 'Sosyal medya yönetimini otomatikleştirin',
        'email-marketing': 'E-posta pazarlama kampanyalarını otomatikleştirin',
        'ai-content': 'AI ile içerik üretimini otomatikleştirin',
        'payments': 'Ödeme işlemlerini takip edin',
        'productivity': 'Üretkenliğinizi artırın',
        'project-management': 'Proje yönetimini kolaylaştırın',
        'finance': 'Finansal işlemleri otomatikleştirin'
    };

    return categoryDescriptions[category] || 'İş akışınızı otomatikleştirin';
}

// Etiket üretici
function generateTags(name: string, category: string, sourceCategory: string): string[] {
    const baseTags = [sourceCategory.toLowerCase(), category];

    // İsimden anahtar kelimeler çıkar
    const keywords = name.toLowerCase()
        .split(/[\s\-_]+/)
        .filter(word => word.length > 2);

    return [...new Set([...baseTags, ...keywords.slice(0, 5)])];
}

export default {
    convertN8nWorkflow,
    convertN8nNode,
    N8N_NODE_MAPPING,
    N8N_CATEGORY_MAPPING
};
