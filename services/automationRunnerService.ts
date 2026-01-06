/**
 * Automation Runner Service
 * Fabrikadan gerçek otomasyon çalıştırma
 */

// API endpoint
const API_URL = "/.netlify/functions/run-automation";

// Otomasyon tipleri
export type AutomationType =
    | "blog-post"
    | "instagram-caption"
    | "etsy-listing"
    | "tweet"
    | "tweet-thread"
    | "email-response"
    | "product-description"
    | "linkedin-post"
    | "seo-meta"
    | "video-script"
    | "trend-analysis";

// Otomasyon parametreleri
export interface AutomationParams {
    topic?: string;
    keywords?: string;
    theme?: string;
    tone?: string;
    product?: string;
    category?: string;
    style?: string;
    email?: string;
    features?: string;
    target?: string;
    page?: string;
    platform?: string;
    duration?: string;
    niche?: string;
}

// Çalıştırma sonucu
export interface AutomationResult {
    success: boolean;
    type: AutomationType;
    params: AutomationParams;
    result: string;
    timestamp: string;
    error?: string;
}

// Otomasyon tipi bilgileri
export const AUTOMATION_INFO: Record<AutomationType, {
    name: string;
    icon: string;
    description: string;
    requiredParams: string[];
    optionalParams: string[];
}> = {
    "blog-post": {
        name: "Blog Yazısı Üretici",
        icon: "📝",
        description: "SEO uyumlu blog yazısı üretir",
        requiredParams: ["topic"],
        optionalParams: ["keywords"]
    },
    "instagram-caption": {
        name: "Instagram Caption",
        icon: "📸",
        description: "Viral caption ve hashtag üretir",
        requiredParams: ["theme"],
        optionalParams: ["tone"]
    },
    "etsy-listing": {
        name: "Etsy SEO Listing",
        icon: "🛍️",
        description: "Etsy ürün başlığı, açıklama ve tag üretir",
        requiredParams: ["product"],
        optionalParams: ["category"]
    },
    "tweet": {
        name: "Tweet Üretici",
        icon: "🐦",
        description: "Viral tweet üretir (280 karakter)",
        requiredParams: ["topic"],
        optionalParams: ["style"]
    },
    "tweet-thread": {
        name: "Tweet Thread",
        icon: "🧵",
        description: "5 tweet'lik thread üretir",
        requiredParams: ["topic"],
        optionalParams: []
    },
    "email-response": {
        name: "Email Yanıtlayıcı",
        icon: "📧",
        description: "Profesyonel email yanıtı üretir",
        requiredParams: ["email"],
        optionalParams: []
    },
    "product-description": {
        name: "Ürün Açıklaması",
        icon: "🏷️",
        description: "E-ticaret ürün açıklaması üretir",
        requiredParams: ["product"],
        optionalParams: ["features"]
    },
    "linkedin-post": {
        name: "LinkedIn Post",
        icon: "💼",
        description: "Profesyonel LinkedIn postu üretir",
        requiredParams: ["topic"],
        optionalParams: ["target"]
    },
    "seo-meta": {
        name: "SEO Meta Tag",
        icon: "🔍",
        description: "Title, description ve keyword üretir",
        requiredParams: ["page", "topic"],
        optionalParams: []
    },
    "video-script": {
        name: "Video Script",
        icon: "🎬",
        description: "Viral video hook ve script üretir",
        requiredParams: ["topic"],
        optionalParams: ["platform", "duration"]
    },
    "trend-analysis": {
        name: "Trend Analizi",
        icon: "📊",
        description: "Nişe göre trend analizi yapar",
        requiredParams: ["niche"],
        optionalParams: ["platform"]
    }
};

/**
 * Otomasyon çalıştır
 */
export async function runAutomation(
    type: AutomationType,
    params: AutomationParams
): Promise<AutomationResult> {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ type, params })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return {
            success: false,
            type,
            params,
            result: "",
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

/**
 * Tüm otomasyon tiplerini listele
 */
export function getAvailableAutomations(): Array<{
    type: AutomationType;
    info: typeof AUTOMATION_INFO[AutomationType];
}> {
    return Object.entries(AUTOMATION_INFO).map(([type, info]) => ({
        type: type as AutomationType,
        info
    }));
}

/**
 * Template ID'den otomasyon tipine çevir
 */
export function templateToAutomationType(templateId: string): AutomationType | null {
    const mapping: Record<string, AutomationType> = {
        // Blog
        "blog-post-generator": "blog-post",
        "seo-blog-writer": "blog-post",
        "ai-blog-generator": "blog-post",

        // Instagram
        "instagram-caption-generator": "instagram-caption",
        "instagram-content-factory": "instagram-caption",
        "instagram-hashtag-optimizer": "instagram-caption",

        // Etsy
        "etsy-seo-generator": "etsy-listing",
        "etsy-listing-optimizer": "etsy-listing",
        "etsy-auto-lister": "etsy-listing",

        // Tweet
        "tweet-generator": "tweet",
        "twitter-thread-generator": "tweet-thread",
        "viral-tweet-generator": "tweet",

        // Email
        "email-responder": "email-response",
        "smart-email-responder": "email-response",
        "customer-reply-bot": "email-response",

        // Product
        "product-description-generator": "product-description",
        "ecommerce-description-writer": "product-description",

        // LinkedIn
        "linkedin-content-generator": "linkedin-post",
        "linkedin-post-generator": "linkedin-post",

        // SEO
        "seo-meta-generator": "seo-meta",
        "meta-tag-optimizer": "seo-meta",

        // Video
        "video-script-generator": "video-script",
        "tiktok-script-generator": "video-script",
        "reels-content-generator": "video-script",

        // Trend
        "trend-analyzer": "trend-analysis",
        "trend-tarayici": "trend-analysis",
        "niche-finder": "trend-analysis"
    };

    return mapping[templateId] || null;
}

export const AutomationRunnerService = {
    runAutomation,
    getAvailableAutomations,
    templateToAutomationType,
    AUTOMATION_INFO
};
