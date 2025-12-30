
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface AutomationResult {
    id: string;
    name: string;
    createdAt: string;
    status: 'success' | 'error' | 'pending';
    results: {
        trend_tarayici?: string;
        firsat_analizi?: string;
        metin_yazari?: string;
        gorsel_onerici?: string;
        icerik_paketi?: string;
    };
}

interface ContentItem {
    platform: 'instagram' | 'twitter' | 'linkedin';
    text: string;
    hashtags: string[];
    status: 'draft' | 'scheduled' | 'published';
}

export const AutomationResults: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [results, setResults] = useState<AutomationResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<AutomationResult | null>(null);
    const [activeTab, setActiveTab] = useState<'trends' | 'content' | 'visuals' | 'schedule'>('content');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Demo data - gerçek uygulamada Supabase'den gelecek
    useEffect(() => {
        const demoResult: AutomationResult = {
            id: '1',
            name: 'İçerik Fabrikası',
            createdAt: new Date().toISOString(),
            status: 'success',
            results: {
                trend_tarayici: `## Top 5 Trend
1. #YeniYılGeçiciHayaller
2. #AyakkabıTakım
3. #KendiYolculuğu
4. #EnFarklıHayat
5. #GizemliTuval`,
                metin_yazari: `**Instagram:**
👣 Bu yolculuğu, kendi hızımızla ve kendi adımlarımızla atmaya hazır mısınız? 💫

✨ [Marka adı] ile kendinize zaman ayırın, rahatlayın ve hedeflerinize ulaşın.

#KendiYolculuğu #özdeğer #motivasyon

---

**Twitter:**
#KendiYolculuğu, hedeflerinizi ve potansiyelinizi keşfetmek için yolculuk başlatır. 🧭

---

**LinkedIn:**
We all have our own journeys. At [Marka adı], we are committed to empowering our customers.`,
                gorsel_onerici: `**Midjourney Prompt:**
"Silhouette of a lone figure walking forward, leaving a path of clutter behind, on a path to enlightenment. Pastel color palette. Artstation style."

**DALL-E Prompt:**
"A minimalist line art illustration of a person walking through a lush forest, symbolizing growth and self-discovery. Calming color scheme."`,
                icerik_paketi: `## Haftalık Takvim

**Pazartesi:** #KendiYolculuğu içeriği
**Çarşamba:** #AyakkabıTakım içeriği
**Cuma:** #GizemliTuval içeriği`
            }
        };
        setResults([demoResult]);
        setSelectedResult(demoResult);
    }, []);

    const parseInstagramContent = (text: string): ContentItem[] => {
        const items: ContentItem[] = [];

        // Instagram içeriğini parse et
        const instagramMatch = text.match(/\*\*Instagram:\*\*\n([\s\S]*?)(?=\n---|\n\*\*Twitter|$)/);
        if (instagramMatch) {
            const content = instagramMatch[1].trim();
            const hashtags = content.match(/#\w+/g) || [];
            items.push({
                platform: 'instagram',
                text: content.replace(/#\w+/g, '').trim(),
                hashtags,
                status: 'draft'
            });
        }

        // Twitter içeriğini parse et
        const twitterMatch = text.match(/\*\*Twitter:\*\*\n([\s\S]*?)(?=\n---|\n\*\*LinkedIn|$)/);
        if (twitterMatch) {
            const content = twitterMatch[1].trim();
            const hashtags = content.match(/#\w+/g) || [];
            items.push({
                platform: 'twitter',
                text: content.replace(/#\w+/g, '').trim(),
                hashtags,
                status: 'draft'
            });
        }

        return items;
    };

    const copyToClipboard = async (text: string, index: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleInstagramPublish = (content: string) => {
        // Instagram'da paylaşım için URL oluştur
        const encodedText = encodeURIComponent(content);
        window.open(`https://www.instagram.com/`, '_blank');
        alert(`📋 İçerik panoya kopyalandı!\n\n1. Instagram'a gidin\n2. Yeni gönderi oluşturun\n3. İçeriği yapıştırın (Ctrl+V)`);
        navigator.clipboard.writeText(content);
    };

    if (!selectedResult) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-8 text-center">
                    <p className="text-slate-400">Henüz otomasyon sonucu yok</p>
                    <Button onClick={onClose} className="mt-4">Kapat</Button>
                </div>
            </div>
        );
    }

    const contents = selectedResult.results.metin_yazari
        ? parseInstagramContent(selectedResult.results.metin_yazari)
        : [];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-5xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-black text-white">📊 Otomasyon Sonuçları</h2>
                        <p className="text-xs text-slate-500">{selectedResult.name} • {new Date(selectedResult.createdAt).toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                            ✅ Başarılı
                        </span>
                        <button onClick={onClose} className="text-slate-500 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    {[
                        { id: 'content', label: '📝 İçerikler', icon: '📝' },
                        { id: 'trends', label: '📊 Trendler', icon: '📊' },
                        { id: 'visuals', label: '🎨 Görseller', icon: '🎨' },
                        { id: 'schedule', label: '📅 Takvim', icon: '📅' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10'
                                    : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* İçerikler Tab */}
                    {activeTab === 'content' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">📱 Hazır Paylaşım İçerikleri</h3>

                            {/* Instagram Content Card */}
                            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">📷</span>
                                        <span className="font-bold text-white">Instagram</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => copyToClipboard(contents[0]?.text + '\n\n' + contents[0]?.hashtags.join(' '), 0)}
                                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white"
                                        >
                                            {copiedIndex === 0 ? '✅ Kopyalandı!' : '📋 Kopyala'}
                                        </button>
                                        <button
                                            onClick={() => handleInstagramPublish(contents[0]?.text + '\n\n' + contents[0]?.hashtags.join(' '))}
                                            className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-xs text-white font-bold"
                                        >
                                            🚀 Instagram'da Paylaş
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4">
                                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                                        👣 Bu yolculuğu, kendi hızımızla ve kendi adımlarımızla atmaya hazır mısınız? 💫

                                        ✨ Kendinize zaman ayırın, rahatlayın ve hedeflerinize ulaşın.

                                        #KendiYolculuğu #özdeğer #motivasyon #personalgrowth #selfimprovement
                                    </p>
                                </div>
                            </div>

                            {/* Twitter Content Card */}
                            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🐦</span>
                                        <span className="font-bold text-white">Twitter / X</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard('#KendiYolculuğu, hedeflerinizi ve potansiyelinizi keşfetmek için yolculuk başlatır. 🧭', 1)}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white"
                                    >
                                        {copiedIndex === 1 ? '✅ Kopyalandı!' : '📋 Kopyala'}
                                    </button>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4">
                                    <p className="text-slate-300 text-sm">
                                        #KendiYolculuğu, hedeflerinizi ve potansiyelinizi keşfetmek için yolculuk başlatır. 🧭 #özdeğer #motivasyon
                                    </p>
                                </div>
                            </div>

                            {/* LinkedIn Content Card */}
                            <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 border border-blue-600/30 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">💼</span>
                                        <span className="font-bold text-white">LinkedIn</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard('We all have our own journeys. At [Marka adı], we are committed to empowering our customers on their unique paths to success.', 2)}
                                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white"
                                    >
                                        {copiedIndex === 2 ? '✅ Kopyalandı!' : '📋 Kopyala'}
                                    </button>
                                </div>
                                <div className="bg-black/30 rounded-xl p-4">
                                    <p className="text-slate-300 text-sm">
                                        We all have our own journeys. At [Marka adı], we are committed to empowering our customers on their unique paths to success. #personaldevelopment #growthmindset
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trendler Tab */}
                    {activeTab === 'trends' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">📊 Bulunan Trendler</h3>
                            <div className="bg-[#020617] border border-slate-800 rounded-2xl p-5">
                                <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                                    {selectedResult.results.trend_tarayici}
                                </pre>
                            </div>

                            {selectedResult.results.firsat_analizi && (
                                <>
                                    <h3 className="text-lg font-bold text-white mt-6 mb-4">🎯 Fırsat Analizi</h3>
                                    <div className="bg-[#020617] border border-emerald-500/30 rounded-2xl p-5">
                                        <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                                            {selectedResult.results.firsat_analizi.substring(0, 1000)}...
                                        </pre>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Görseller Tab */}
                    {activeTab === 'visuals' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">🎨 AI Görsel Promptları</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">🖼️</span>
                                        <span className="font-bold text-white">Midjourney</span>
                                    </div>
                                    <div className="bg-black/30 rounded-xl p-3">
                                        <code className="text-violet-300 text-xs">
                                            "Silhouette of a lone figure walking forward, leaving a path of clutter behind, on a path to enlightenment. Pastel color palette. Artstation style."
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard('"Silhouette of a lone figure walking forward, leaving a path of clutter behind, on a path to enlightenment. Pastel color palette. Artstation style."', 10)}
                                        className="mt-3 w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs text-white font-bold"
                                    >
                                        📋 Prompt'u Kopyala
                                    </button>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">🤖</span>
                                        <span className="font-bold text-white">DALL-E</span>
                                    </div>
                                    <div className="bg-black/30 rounded-xl p-3">
                                        <code className="text-emerald-300 text-xs">
                                            "A minimalist line art illustration of a person walking through a lush forest, symbolizing growth and self-discovery. Calming color scheme."
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard('"A minimalist line art illustration of a person walking through a lush forest, symbolizing growth and self-discovery. Calming color scheme."', 11)}
                                        className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs text-white font-bold"
                                    >
                                        📋 Prompt'u Kopyala
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Takvim Tab */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white mb-4">📅 Haftalık İçerik Takvimi</h3>

                            <div className="grid grid-cols-3 gap-4">
                                {['Pazartesi', 'Çarşamba', 'Cuma'].map((day, idx) => (
                                    <div key={day} className="bg-[#020617] border border-slate-800 rounded-2xl p-4">
                                        <div className="text-center mb-3">
                                            <span className="text-2xl">📆</span>
                                            <p className="font-bold text-white mt-1">{day}</p>
                                        </div>
                                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
                                            <p className="text-xs text-indigo-300">
                                                {idx === 0 && '#KendiYolculuğu içeriği'}
                                                {idx === 1 && '#AyakkabıTakım içeriği'}
                                                {idx === 2 && '#GizemliTuval içeriği'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-[#020617]">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">
                            💡 İçerikleri kopyalayıp sosyal medyada paylaşabilirsiniz
                        </p>
                        <Button onClick={onClose} className="bg-slate-700">
                            Kapat
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
