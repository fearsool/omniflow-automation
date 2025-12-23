import React, { useState } from 'react';
import * as imageService from '../services/imageGenerationService';

interface ImageGeneratorProps {
    onImageGenerated?: (imageUrl: string, prompt: string) => void;
    onClose: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, onClose }) => {
    const [activeTab, setActiveTab] = useState<'custom' | 'instagram' | 'logo' | 'poster' | 'youtube'>('custom');
    const [prompt, setPrompt] = useState('');
    const [topic, setTopic] = useState('');
    const [brandName, setBrandName] = useState('');
    const [style, setStyle] = useState('modern minimalist');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [selectedModel, setSelectedModel] = useState(imageService.HF_MODELS.STABLE_DIFFUSION_XL);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError('');
        setGeneratedImages([]);

        try {
            let result;

            switch (activeTab) {
                case 'custom':
                    result = await imageService.generateImage({ prompt, model: selectedModel });
                    if (result.success && result.imageUrl) {
                        setGeneratedImages([result.imageUrl]);
                        onImageGenerated?.(result.imageUrl, prompt);
                    } else {
                        setError(result.error || 'Görsel üretilemedi');
                    }
                    break;

                case 'instagram':
                    result = await imageService.generateInstagramPost(topic, style);
                    if (result.success && result.imageUrl) {
                        setGeneratedImages([result.imageUrl]);
                        onImageGenerated?.(result.imageUrl, `Instagram: ${topic}`);
                    } else {
                        setError(result.error || 'Görsel üretilemedi');
                    }
                    break;

                case 'logo':
                    const logos = await imageService.generateLogo(brandName, style);
                    const successfulLogos = logos.filter(l => l.success && l.imageUrl).map(l => l.imageUrl!);
                    if (successfulLogos.length > 0) {
                        setGeneratedImages(successfulLogos);
                    } else {
                        setError(logos[0]?.error || 'Logo üretilemedi');
                    }
                    break;

                case 'poster':
                    result = await imageService.generateMotivationalPoster(prompt);
                    if (result.success && result.imageUrl) {
                        setGeneratedImages([result.imageUrl]);
                        onImageGenerated?.(result.imageUrl, `Poster: ${prompt}`);
                    } else {
                        setError(result.error || 'Görsel üretilemedi');
                    }
                    break;

                case 'youtube':
                    result = await imageService.generateYouTubeThumbnail(topic);
                    if (result.success && result.imageUrl) {
                        setGeneratedImages([result.imageUrl]);
                        onImageGenerated?.(result.imageUrl, `YouTube: ${topic}`);
                    } else {
                        setError(result.error || 'Görsel üretilemedi');
                    }
                    break;
            }
        } catch (e: any) {
            setError(e.message);
        }

        setIsGenerating(false);
    };

    const handleDownload = (imageUrl: string, index: number) => {
        imageService.downloadImage(imageUrl, `omniflow-image-${index + 1}.png`);
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-8">
            <div className="w-full max-w-5xl bg-[#0a0f1e] rounded-3xl border border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="h-16 bg-[#020617] border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">🎨</span>
                        <h2 className="text-lg font-bold text-white">AI Görsel Üretici</h2>
                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
                            HUGGING FACE
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 flex-shrink-0">
                    {[
                        { id: 'custom', label: '✨ Özel Prompt' },
                        { id: 'instagram', label: '📷 Instagram' },
                        { id: 'logo', label: '🏷️ Logo' },
                        { id: 'poster', label: '🖼️ Poster' },
                        { id: 'youtube', label: '📺 YouTube' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === tab.id
                                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left - Input */}
                        <div className="space-y-4">
                            {activeTab === 'custom' && (
                                <>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-2 block">Model Seçin</label>
                                        <select
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                        >
                                            <option value={imageService.HF_MODELS.STABLE_DIFFUSION_XL}>Stable Diffusion XL (Genel)</option>
                                            <option value={imageService.HF_MODELS.SDXL_TURBO}>SDXL Turbo (Hızlı)</option>
                                            <option value={imageService.HF_MODELS.REALISTIC_VISION}>Realistic Vision (Fotoğraf)</option>
                                            <option value={imageService.HF_MODELS.DREAMSHAPER}>DreamShaper (Sanatsal)</option>
                                            <option value={imageService.HF_MODELS.LOGO_DIFFUSION}>OpenJourney (Logo/İkon)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-2 block">Görsel Açıklaması (İngilizce önerilir)</label>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="A professional photo of a beautiful hair salon interior, modern design, warm lighting..."
                                            className="w-full h-32 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'instagram' && (
                                <>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-2 block">Konu</label>
                                        <input
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="Örn: bayan kuaförü, saç bakımı, gelin saçı"
                                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-2 block">Stil</label>
                                        <select
                                            value={style}
                                            onChange={(e) => setStyle(e.target.value)}
                                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                        >
                                            <option value="professional photography">Profesyonel Fotoğraf</option>
                                            <option value="modern aesthetic">Modern Estetik</option>
                                            <option value="luxury glamour">Lüks & Glamour</option>
                                            <option value="natural organic">Doğal & Organik</option>
                                            <option value="vibrant colorful">Canlı & Renkli</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {activeTab === 'logo' && (
                                <>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-2 block">Marka Adı</label>
                                        <input
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                            placeholder="Örn: Beauty Studio"
                                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-2 block">Stil</label>
                                        <select
                                            value={style}
                                            onChange={(e) => setStyle(e.target.value)}
                                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                        >
                                            <option value="modern minimalist">Modern & Minimalist</option>
                                            <option value="elegant luxury">Elegant & Lüks</option>
                                            <option value="playful colorful">Eğlenceli & Renkli</option>
                                            <option value="vintage retro">Vintage & Retro</option>
                                            <option value="professional corporate">Kurumsal</option>
                                        </select>
                                    </div>
                                    <p className="text-[10px] text-slate-500">3 farklı logo varyasyonu üretilecek</p>
                                </>
                            )}

                            {activeTab === 'poster' && (
                                <div>
                                    <label className="text-xs text-slate-400 mb-2 block">Motivasyon Sözü / Alıntı</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Başarı bir yolculuktur, varış noktası değil..."
                                        className="w-full h-32 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                                    />
                                </div>
                            )}

                            {activeTab === 'youtube' && (
                                <div>
                                    <label className="text-xs text-slate-400 mb-2 block">Video Konusu</label>
                                    <input
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Örn: Evde saç bakımı nasıl yapılır"
                                        className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating ||
                                    (activeTab === 'custom' && !prompt) ||
                                    (activeTab === 'instagram' && !topic) ||
                                    (activeTab === 'logo' && !brandName) ||
                                    (activeTab === 'poster' && !prompt) ||
                                    (activeTab === 'youtube' && !topic)
                                }
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Üretiliyor... (20-60 sn)
                                    </>
                                ) : (
                                    <>
                                        <span>🎨</span>
                                        Görsel Üret
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl">
                                    <p className="text-sm text-rose-400">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Right - Results */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white">Üretilen Görseller</h3>

                            {generatedImages.length === 0 ? (
                                <div className="aspect-square bg-[#020617] border border-slate-800 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-4xl mb-2 block">🖼️</span>
                                        <p className="text-sm text-slate-500">Görsel üretmek için<br />formu doldurun</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {generatedImages.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Generated ${index + 1}`}
                                                className="w-full rounded-xl border border-slate-800"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleDownload(img, index)}
                                                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200"
                                                >
                                                    ⬇️ İndir
                                                </button>
                                                <button
                                                    onClick={() => onImageGenerated?.(img, prompt || topic || brandName)}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700"
                                                >
                                                    ✅ Kullan
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
