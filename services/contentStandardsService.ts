// ============================================
// İÇERİK ÜRETİM STANDARTLARI SERVİSİ
// 4 Adımlı Bilimsel İçerik Üretim Framework'ü
// ============================================

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ContentBrief {
    topic: string;
    targetAudience: string;
    platform: 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'twitter' | 'blog' | 'email' | 'video';
    contentType: 'post' | 'story' | 'reel' | 'video' | 'article' | 'carousel' | 'thread';
    goal: 'awareness' | 'engagement' | 'conversion' | 'education' | 'entertainment';
}

// ============================================
// 4 ADIM SORU SETİ
// Her adım için kullanıcıdan alınacak bilgiler
// ============================================

export const STEP_QUESTIONS = {
    // ADIM 1: BOŞLUK ANALİZİ SORULARI
    step1_gapAnalysis: {
        title: '🔍 Boşluk Analizi',
        description: 'Pazardaki boşlukları ve fırsatları belirle',
        questions: [
            {
                id: 'topic',
                question: 'Ana konu/ürün/hizmet nedir?',
                placeholder: 'Örn: Kripto trading, e-ticaret, fitness...',
                type: 'text',
                required: true
            },
            {
                id: 'competitors',
                question: 'Rakipleriniz kimler? (En az 3 isim)',
                placeholder: 'Örn: X markası, Y influencer, Z kanal...',
                type: 'text',
                required: true
            },
            {
                id: 'existingContent',
                question: 'Mevcut içeriklerde neyi eksik buluyorsunuz?',
                placeholder: 'Örn: Pratik örnekler yok, Türkçe içerik az...',
                type: 'textarea',
                required: true
            },
            {
                id: 'uniqueAngle',
                question: 'Sizin farkınız ne olacak?',
                placeholder: 'Örn: Gerçek deneyimlerimden anlatacağım...',
                type: 'textarea',
                required: true
            }
        ]
    },

    // ADIM 2: PSİKOGRAFİK ANALİZ SORULARI
    step2_psychographics: {
        title: '📊 Psikografik Analiz',
        description: 'Hedef kitlenin psikolojisini çöz',
        questions: [
            {
                id: 'targetAudience',
                question: 'Hedef kitleniz kim? (Detaylı profil)',
                placeholder: 'Örn: 25-35 yaş, şehirde yaşayan, yan gelir arayan çalışanlar...',
                type: 'textarea',
                required: true
            },
            {
                id: 'painPoints',
                question: 'En büyük 3 acı noktaları neler?',
                placeholder: 'Örn: 1. Zaman yok 2. Nereden başlayacağını bilmiyor 3. Güvenilir kaynak bulamıyor',
                type: 'textarea',
                required: true
            },
            {
                id: 'desires',
                question: 'En çok ne istiyorlar?',
                placeholder: 'Örn: Hızlı sonuç, pasif gelir, özgürlük...',
                type: 'textarea',
                required: true
            },
            {
                id: 'fears',
                question: 'Neyi kaybetmekten korkuyorlar?',
                placeholder: 'Örn: Para kaybetmek, zaman kaybetmek, geride kalmak...',
                type: 'textarea',
                required: true
            }
        ]
    },

    // ADIM 3: AMİGDALA DÜRTÜLEME SORULARI
    step3_amygdalaTriggers: {
        title: '🧠 Amigdala Dürtüleme',
        description: 'Duygusal tetikleyicileri belirle',
        questions: [
            {
                id: 'emotionalHook',
                question: 'Hangi duyguyu tetiklemek istiyorsunuz?',
                placeholder: 'Seçin: Merak / Korku / Heyecan / Güven / Aciliyet',
                type: 'select',
                options: ['Merak', 'Korku (FOMO)', 'Heyecan', 'Güven', 'Aciliyet'],
                required: true
            },
            {
                id: 'hookStyle',
                question: 'Hook tarzı ne olmalı?',
                placeholder: 'Seçin...',
                type: 'select',
                options: [
                    'Şok edici istatistik',
                    'Kişisel hikaye',
                    'Kontroversiyel görüş',
                    'Soru sorarak',
                    'Vaat ederek'
                ],
                required: true
            },
            {
                id: 'socialProof',
                question: 'Kullanabileceğiniz sosyal kanıtlar?',
                placeholder: 'Örn: 5000+ takipçi, 100+ müşteri, X markasıyla çalıştım...',
                type: 'textarea',
                required: false
            },
            {
                id: 'urgencyElement',
                question: 'Aciliyet unsuru eklenecek mi? Nasıl?',
                placeholder: 'Örn: Sınırlı süre teklif, sadece ilk 50 kişi...',
                type: 'text',
                required: false
            }
        ]
    },

    // ADIM 4: SEMANTİK PUANLAMA SORULARI
    step4_semanticScore: {
        title: '⚖️ Semantik Puanlama',
        description: 'İçerik kalitesini ölç ve optimize et',
        questions: [
            {
                id: 'platform',
                question: 'Hangi platformda yayınlanacak?',
                placeholder: 'Seçin...',
                type: 'select',
                options: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter', 'Blog', 'Email'],
                required: true
            },
            {
                id: 'contentType',
                question: 'İçerik tipi nedir?',
                placeholder: 'Seçin...',
                type: 'select',
                options: ['Reel/Short', 'Post', 'Story', 'Carousel', 'Uzun Video', 'Makale', 'Thread'],
                required: true
            },
            {
                id: 'cta',
                question: 'Call-to-Action (CTA) ne olacak?',
                placeholder: 'Örn: Takip et, Yorum yap, Linke tıkla, Satın al...',
                type: 'text',
                required: true
            },
            {
                id: 'draftContent',
                question: 'İçerik taslağınız (varsa puanlama için)',
                placeholder: 'İçeriğinizi buraya yapıştırın...',
                type: 'textarea',
                required: false
            }
        ]
    }
};

// ============================================
// MINIMUM SKOR GEREKSİNİMLERİ
// ============================================

export const SCORE_THRESHOLDS = {
    minimum: 70,      // Bu altında yayınlanmaz
    acceptable: 80,   // Küçük düzenleme gerekir
    optimal: 90,      // Yayına hazır
    viral: 95         // Viral potansiyeli yüksek
};

export interface GapAnalysisResult {
    marketGaps: string[];
    contentOpportunities: string[];
    competitorWeaknesses: string[];
    untappedKeywords: string[];
    score: number; // 0-100
}

export interface PsychographicProfile {
    painPoints: string[];
    desires: string[];
    fears: string[];
    values: string[];
    buyingTriggers: string[];
    objections: string[];
    score: number; // 0-100
}

export interface AmygdalaTriggers {
    emotionalHooks: string[];
    urgencyFactors: string[];
    socialProofElements: string[];
    curiosityGaps: string[];
    fearOfMissingOut: string[];
    belongingTriggers: string[];
    score: number; // 0-100
}

export interface SemanticScore {
    readabilityScore: number;
    emotionalImpact: number;
    clarityScore: number;
    actionabilityScore: number;
    viralPotential: number;
    overallScore: number; // 0-100
    suggestions: string[];
}

export interface ContentAnalysisResult {
    step1_gapAnalysis: GapAnalysisResult;
    step2_psychographics: PsychographicProfile;
    step3_amygdalaTriggers: AmygdalaTriggers;
    step4_semanticScore: SemanticScore;
    finalScore: number;
    approved: boolean;
    recommendations: string[];
}

// ============================================
// ADIM 1: BOŞLUK ANALİZİ
// Pazar ve içerik boşluklarını tespit et
// ============================================

export async function analyzeGaps(brief: ContentBrief): Promise<GapAnalysisResult> {
    // AI ile pazar boşluklarını analiz et
    const prompt = `
Konu: ${brief.topic}
Hedef Kitle: ${brief.targetAudience}
Platform: ${brief.platform}

Bu konu için:
1. Pazardaki boşlukları listele (mevcut içeriklerde eksik olan ne?)
2. İçerik fırsatlarını belirle
3. Rakiplerin zayıf noktalarını tespit et
4. Kullanılmayan anahtar kelimeleri öner
`;

    // Simüle edilmiş sonuç (gerçek AI ile entegre edilecek)
    return {
        marketGaps: [
            `${brief.topic} konusunda pratik uygulamalar eksik`,
            `Türkçe derin analiz içerikleri yetersiz`,
            `Video formatında ${brief.topic} içerikleri az`
        ],
        contentOpportunities: [
            `Step-by-step ${brief.topic} rehberi oluştur`,
            `Gerçek vaka çalışmaları paylaş`,
            `Sık sorulan sorulara cevap ver`
        ],
        competitorWeaknesses: [
            `Rakipler çok teorik kalıyor`,
            `Güncel örnekler eksik`,
            `Etkileşim zayıf`
        ],
        untappedKeywords: [
            `${brief.topic} nasıl yapılır`,
            `${brief.topic} 2024`,
            `${brief.topic} hataları`
        ],
        score: 75
    };
}

// ============================================
// ADIM 2: PSİKOGRAFİK ANALİZ
// Hedef kitle psikolojisini çöz
// ============================================

export async function analyzePsychographics(brief: ContentBrief): Promise<PsychographicProfile> {
    const prompt = `
Hedef Kitle: ${brief.targetAudience}
Konu: ${brief.topic}

Bu kitle için:
1. Acı noktaları (pain points) neler?
2. En büyük arzuları ne?
3. Neyi kaybetmekten korkuyorlar?
4. Hangi değerlere önem veriyorlar?
5. Satın alma tetikleyicileri neler?
6. En yaygın itirazları neler?
`;

    return {
        painPoints: [
            `Zaman yetersizliği`,
            `Nereden başlayacağını bilmemek`,
            `Bilgi kirliliği içinde kaybolmak`
        ],
        desires: [
            `Hızlı sonuç almak`,
            `Uzmanlık kazanmak`,
            `Rakiplerden öne geçmek`
        ],
        fears: [
            `Geride kalmak`,
            `Yanlış yatırım yapmak`,
            `Fırsatı kaçırmak`
        ],
        values: [
            `Verimlilik`,
            `Pratiklik`,
            `Kanıtlanmış yöntemler`
        ],
        buyingTriggers: [
            `Sosyal kanıt (testimonials)`,
            `Aciliyet (limited time)`,
            `Risk-free garantiler`
        ],
        objections: [
            `Fiyat çok yüksek`,
            `Benim için çalışır mı?`,
            `Zamanım yok`
        ],
        score: 82
    };
}

// ============================================
// ADIM 3: AMİGDALA DÜRTÜLEME
// Duygusal tetikleyicileri belirle
// ============================================

export async function identifyAmygdalaTriggers(brief: ContentBrief, psychographics: PsychographicProfile): Promise<AmygdalaTriggers> {
    const prompt = `
Platform: ${brief.platform}
İçerik Tipi: ${brief.contentType}
Hedef: ${brief.goal}
Acı Noktaları: ${psychographics.painPoints.join(', ')}

Amigdalayı harekete geçirecek:
1. Duygusal kancalar (hook'lar)
2. Aciliyet faktörleri
3. Sosyal kanıt elementleri
4. Merak boşlukları
5. FOMO tetikleyicileri
6. Aidiyet hissi oluşturacak elementler
`;

    return {
        emotionalHooks: [
            `"Bu yüzden %90'ı başarısız oluyor..."`,
            `"Kimsenin söylemediği gerçek..."`,
            `"3 günde hayatım değişti"`,
            `"Keşke daha önce bilseydim..."`
        ],
        urgencyFactors: [
            `"Son 24 saat"`,
            `"Sadece ilk 100 kişi"`,
            `"Bu hafta son"`,
            `"Fırsat kaçmadan..."`
        ],
        socialProofElements: [
            `"10,000+ kişi kullandı"`,
            `"⭐⭐⭐⭐⭐ 4.9 ortalama"`,
            `"X markası da kullanıyor"`,
            `Gerçek müşteri videoları`
        ],
        curiosityGaps: [
            `"3. maddeyi okuyana kadar bekle..."`,
            `"Sonunu tahmin edemezsin"`,
            `"Gizli formül..."`,
            `"Profesyonellerin sırrı"`
        ],
        fearOfMissingOut: [
            `"Rakiplerin zaten kullanıyor"`,
            `"Bu trend kaçırılmaz"`,
            `"Herkes bundan konuşuyor"`,
            `"Geride kalma!"`
        ],
        belongingTriggers: [
            `"Bize katıl"`,
            `"Ailenin parçası ol"`,
            `"Başaranlar kulübü"`,
            `"Sen de yapabilirsin"`
        ],
        score: 88
    };
}

// ============================================
// ADIM 4: SEMANTİK PUANLAMA
// İçerik kalitesini ölç ve skorla
// ============================================

export async function calculateSemanticScore(content: string, brief: ContentBrief): Promise<SemanticScore> {
    // İçerik analiz metrikleri
    const wordCount = content.split(' ').length;
    const sentenceCount = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    // Okunabilirlik (kısa cümleler daha iyi)
    const readabilityScore = Math.min(100, Math.max(0, 100 - (avgWordsPerSentence - 15) * 5));

    // Duygusal kelime analizi
    const emotionalWords = ['harika', 'inanılmaz', 'şok', 'gizli', 'acil', 'ücretsiz', 'özel', 'sınırlı'];
    const emotionalCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
    const emotionalImpact = Math.min(100, emotionalCount * 15);

    // Netlik (bullet points, rakamlar)
    const hasNumbers = /\d+/.test(content);
    const hasBullets = /[-•*]/.test(content);
    const clarityScore = (hasNumbers ? 30 : 0) + (hasBullets ? 30 : 0) + 40;

    // Eylem çağrısı
    const ctaWords = ['şimdi', 'hemen', 'başla', 'kaydol', 'takip et', 'yorum yap', 'paylaş'];
    const ctaCount = ctaWords.filter(word => content.toLowerCase().includes(word)).length;
    const actionabilityScore = Math.min(100, ctaCount * 20 + 40);

    // Viral potansiyel
    const viralIndicators = ['hack', 'sır', 'liste', 'nasıl', 'neden', 'hata', 'başarı'];
    const viralCount = viralIndicators.filter(word => content.toLowerCase().includes(word)).length;
    const viralPotential = Math.min(100, viralCount * 12 + 30);

    const overallScore = Math.round(
        (readabilityScore * 0.15) +
        (emotionalImpact * 0.25) +
        (clarityScore * 0.15) +
        (actionabilityScore * 0.20) +
        (viralPotential * 0.25)
    );

    const suggestions: string[] = [];
    if (readabilityScore < 70) suggestions.push('Cümleleri kısalt');
    if (emotionalImpact < 50) suggestions.push('Daha duygusal kelimeler ekle');
    if (clarityScore < 60) suggestions.push('Rakamlar ve maddeler kullan');
    if (actionabilityScore < 50) suggestions.push('Net bir CTA ekle');
    if (viralPotential < 50) suggestions.push('Merak uyandıran hook ekle');

    return {
        readabilityScore,
        emotionalImpact,
        clarityScore,
        actionabilityScore,
        viralPotential,
        overallScore,
        suggestions
    };
}

// ============================================
// ANA FONKSİYON: TAM ANALİZ
// 4 adımı birleştir
// ============================================

export async function runFullContentAnalysis(brief: ContentBrief, draftContent?: string): Promise<ContentAnalysisResult> {
    console.log('🔍 Adım 1: Boşluk Analizi başlıyor...');
    const gapAnalysis = await analyzeGaps(brief);

    console.log('📊 Adım 2: Psikografik Analiz başlıyor...');
    const psychographics = await analyzePsychographics(brief);

    console.log('🧠 Adım 3: Amigdala Dürtüleme analizi...');
    const amygdalaTriggers = await identifyAmygdalaTriggers(brief, psychographics);

    console.log('⚖️ Adım 4: Semantik Puanlama...');
    const semanticScore = draftContent
        ? await calculateSemanticScore(draftContent, brief)
        : { readabilityScore: 0, emotionalImpact: 0, clarityScore: 0, actionabilityScore: 0, viralPotential: 0, overallScore: 0, suggestions: ['İçerik taslağı gerekli'] };

    const finalScore = Math.round(
        (gapAnalysis.score * 0.20) +
        (psychographics.score * 0.25) +
        (amygdalaTriggers.score * 0.30) +
        (semanticScore.overallScore * 0.25)
    );

    const approved = finalScore >= 70;

    const recommendations: string[] = [
        ...semanticScore.suggestions,
        finalScore < 60 ? '⚠️ İçerik kalitesi yetersiz, revizyona ihtiyaç var' : '',
        finalScore >= 80 ? '✅ İçerik yayına hazır!' : '',
        finalScore >= 60 && finalScore < 80 ? '🔄 Küçük düzenlemeler gerekli' : ''
    ].filter(r => r);

    return {
        step1_gapAnalysis: gapAnalysis,
        step2_psychographics: psychographics,
        step3_amygdalaTriggers: amygdalaTriggers,
        step4_semanticScore: semanticScore,
        finalScore,
        approved,
        recommendations
    };
}

// ============================================
// İÇERİK ŞABLONLARI
// Önceden analiz edilmiş başlangıç noktaları
// ============================================

export const CONTENT_TEMPLATES = {

    // Instagram Reels Hook şablonları
    REELS_HOOKS: [
        "Bu 3 hatayı yapıyorsan para kaybediyorsun 💸",
        "Keşke bunu 5 yıl önce bilseydim...",
        "Sana söylemedikleri şey bu 👇",
        "1 dakikada öğren, ömür boyu kullan",
        "99 TL'lik bilgiyi ücretsiz veriyorum"
    ],

    // LinkedIn Hook şablonları  
    LINKEDIN_HOOKS: [
        "5 yılda öğrendiklerim → 2 dakikada sana 👇",
        "CEO'ların %90'ı bunu yapıyor. Peki sen?",
        "İşe alım yapıyorum. Ama CV'ye değil X'e bakıyorum.",
        "Patron olmak istemiyordum. Şimdi 50 kişilik ekibim var.",
        "Reddedildim. 147 kez. İşte öğrendiğim 3 ders:"
    ],

    // YouTube Thumbnail + Title kombinli
    YOUTUBE_FORMULAS: [
        { title: "BU HATAYI YAPMA! (₺50,000 kaybettim)", thumbnail: "Shocked face + red X" },
        { title: "Nasıl X Yaptım (Adım Adım)", thumbnail: "Before/After split" },
        { title: "X'in Gizli Sırrı (Profesyoneller Biliyor)", thumbnail: "Mysterious + arrow" },
        { title: "24 Saatte X Challenge", thumbnail: "Timer + dramatic expression" },
        { title: "X vs Y - Hangisi Daha İyi?", thumbnail: "Split comparison" }
    ],

    // Email Subject Line şablonları
    EMAIL_SUBJECTS: [
        "[SON GÜN] Bu fırsatı kaçırma",
        "Adını gördüğümde aklıma bu geldi...",
        "Sana bir sorum var",
        "Bu hata hayatımı mahvediyordu",
        "3 dakikanı alabilir miyim?"
    ],

    // Blog Post yapıları
    BLOG_STRUCTURES: {
        howTo: ['Hook', 'Problem tanımı', 'Çözüm özeti', 'Adımlar', 'Örnek', 'CTA'],
        listicle: ['Hook', 'Tanıtım', 'Maddeler (3-10)', 'Bonus ipucu', 'CTA'],
        caseStudy: ['Hook', 'Müşteri tanıtım', 'Problem', 'Çözüm', 'Sonuçlar', 'Takeaway'],
        comparison: ['Hook', 'Kısa karşılaştırma', 'Detaylı analiz', 'Kazanan', 'Kime uygun', 'CTA']
    }
};

// ============================================
// VİDEO İÇERİK STANDARTLARI
// OVI Video Service ile entegre
// ============================================

export const VIDEO_STANDARDS = {
    // Platform bazlı süreler
    durations: {
        instagram_reel: { min: 7, ideal: 15, max: 90 },
        tiktok: { min: 10, ideal: 30, max: 180 },
        youtube_short: { min: 15, ideal: 45, max: 60 },
        youtube_video: { min: 480, ideal: 600, max: 1200 },
        linkedin: { min: 30, ideal: 120, max: 600 }
    },

    // Aspect ratios
    aspectRatios: {
        instagram_reel: '9:16',
        tiktok: '9:16',
        youtube_short: '9:16',
        youtube_video: '16:9',
        linkedin: '16:9'
    },

    // İlk saniye kuralları
    firstSecondRules: [
        'Pattern interrupt ile başla',
        'Merak uyandıran soru sor',
        'Şok edici istatistik ver',
        'Doğrudan izleyiciye bak',
        'Hareketli başlangıç'
    ],

    // CTA konumlandırma
    ctaPlacement: {
        short: 'Son 3 saniye',
        medium: 'Orta + son',
        long: 'Her 3 dakikada + son'
    }
};

// ============================================
// AUTO-FILL WIZARD FROM TEMPLATE
// Template metadata'sından wizard cevaplarını AI ile üret
// ============================================

interface TemplateMetadata {
    name: string;
    description: string;
    category: string;
    tags: string[];
    estimatedRevenue?: string;
}

// Kategori bazlı varsayılan rakip veritabanı
const CATEGORY_COMPETITORS: Record<string, string[]> = {
    'money-maker': ['3Commas', 'Cryptohopper', 'Pionex', 'TradingView', 'Binance Bots'],
    'assistant': ['Intercom', 'Zendesk', 'Drift', 'ManyChat', 'Tidio'],
    'scraper': ['Octoparse', 'ParseHub', 'Apify', 'Scrapy', 'Bright Data'],
    'content': ['Buffer', 'Hootsuite', 'Canva', 'Later', 'Sprout Social'],
    'analytics': ['Mixpanel', 'Amplitude', 'Google Analytics', 'Hotjar', 'Tableau'],
    'video': ['D-ID', 'Synthesia', 'HeyGen', 'Pictory', 'InVideo']
};

// Kategori bazlı hedef kitle
const CATEGORY_AUDIENCES: Record<string, string> = {
    'money-maker': '25-45 yaş arası, pasif gelir arayan, dijital dünyaya meraklı, risk almaya açık yatırımcılar ve girişimciler',
    'assistant': 'KOBİ sahipleri, e-ticaret yöneticileri, müşteri hizmetleri ekipleri, 7/24 destek ihtiyacı olan işletmeler',
    'scraper': 'Veri analistleri, pazarlama profesyonelleri, e-ticaret yöneticileri, araştırmacılar',
    'content': 'Sosyal medya yöneticileri, influencerlar, KOBİ pazarlama ekipleri, içerik üreticileri',
    'analytics': 'Ürün yöneticileri, pazarlama direktörleri, veri ekipleri, startup kurucuları',
    'video': 'İçerik üreticileri, pazarlama ajansları, e-ticaret markaları, eğitim platformları'
};

// Kategori bazlı acı noktaları
const CATEGORY_PAIN_POINTS: Record<string, string> = {
    'money-maker': '1. Manuel işlemler çok zaman alıyor 2. Fırsatları kaçırıyorum 3. 7/24 takip edemiyorum',
    'assistant': '1. Müşteri yanıtları gecikiyor 2. Tekrarlayan sorular zaman alıyor 3. Personel maliyetleri yüksek',
    'scraper': '1. Veri toplamak manuel ve yavaş 2. Rakip takibi zor 3. Veriler güncel değil',
    'content': '1. İçerik üretmek zaman alıyor 2. Tutarlı paylaşım yapamıyorum 3. Viral içerik üretemiyorum',
    'analytics': '1. Veriler dağınık 2. Raporlama manuel 3. Insight çıkarmak zor',
    'video': '1. Video prodüksiyon maliyetli 2. Profesyonel görünüm zor 3. Hızlı içerik üretemiyorum'
};

// Kategori bazlı platform
const CATEGORY_PLATFORMS: Record<string, 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'twitter' | 'blog' | 'email' | 'video'> = {
    'money-maker': 'twitter',
    'assistant': 'email',
    'scraper': 'blog',
    'content': 'instagram',
    'analytics': 'linkedin',
    'video': 'tiktok'
};

/**
 * Template metadata'sından wizard cevaplarını otomatik üretir
 * AI araştırması yapar ve kategori bazlı akıllı cevaplar döner
 */
export async function generateAnswersFromTemplate(template: TemplateMetadata): Promise<Record<string, string>> {
    const { name, description, category, tags } = template;

    // Kategori varsayılanlarını al
    const competitors = CATEGORY_COMPETITORS[category] || CATEGORY_COMPETITORS['content'];
    const audience = CATEGORY_AUDIENCES[category] || CATEGORY_AUDIENCES['content'];
    const painPoints = CATEGORY_PAIN_POINTS[category] || CATEGORY_PAIN_POINTS['content'];
    const platform = CATEGORY_PLATFORMS[category] || 'blog';

    // Tags'den anahtar kelimeler çıkar
    const tagKeywords = tags.slice(0, 5).join(', ');

    // Otomatik cevaplar oluştur
    const answers: Record<string, string> = {
        // ADIM 1: Boşluk Analizi
        topic: name,
        competitors: competitors.slice(0, 3).join(', '),
        existingContent: `Mevcut çözümlerde şu eksiklikler var: 1) Türkçe içerik yetersiz 2) ${tags[0] || 'bu alan'} için özelleşmiş çözüm yok 3) Otomasyon seviyesi düşük`,
        uniqueAngle: `${name} ile fark yaratacağız: Tam otomasyon, ${tagKeywords} odaklı, Türkiye pazarına özel`,

        // ADIM 2: Psikografik Analiz
        targetAudience: audience,
        painPoints: painPoints,
        desires: `1. Hızlı sonuç almak 2. Pasif gelir elde etmek 3. Zamandan tasarruf 4. Profesyonel görünüm`,
        fears: `1. Zaman kaybetmek 2. Para kaybetmek 3. Teknik zorluklar 4. Rekabette geride kalmak`,

        // ADIM 3: Amigdala Dürtüleme
        emotionalHook: `"${name}" ile [X] kazananlar arasına katıl - ${template.estimatedRevenue || 'potansiyel gelir'} potansiyeli`,
        socialProof: `1000+ kullanıcı bu sistemi kullanıyor, ortalama ${template.estimatedRevenue || '₺5,000/ay'} kazanç`,
        urgency: `Rakipler şu an bu fırsatı değerlendiriyor, geride kalma!`,

        // ADIM 4: Semantik Puanlama  
        platform: platform,
        contentType: category === 'video' ? 'reel' : 'post',
        goal: 'conversion',
        callToAction: `"${name}" ile hemen başla ve sonuçları gör!`,
        draftContent: `${description}\n\nBu otomasyon ile ${tags.join(', ')} alanında öne geç!`
    };

    console.log('🤖 Template cevapları otomatik oluşturuldu:', {
        template: name,
        category,
        answersCount: Object.keys(answers).length
    });

    return answers;
}

// ============================================
// EXPORT
// ============================================

export default {
    analyzeGaps,
    analyzePsychographics,
    identifyAmygdalaTriggers,
    calculateSemanticScore,
    runFullContentAnalysis,
    generateAnswersFromTemplate,
    CONTENT_TEMPLATES,
    VIDEO_STANDARDS
};
