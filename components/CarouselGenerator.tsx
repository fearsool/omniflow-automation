
import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface CarouselSlide {
    text: string;
    imageUrl?: string;
}

interface CarouselGeneratorProps {
    onClose: () => void;
    onExport?: (images: string[]) => void;
}

export const CarouselGenerator: React.FC<CarouselGeneratorProps> = ({ onClose, onExport }) => {
    const [topic, setTopic] = useState('Kış ayında saç bakımı için 5 ipucu');
    const [slideCount, setSlideCount] = useState(5);
    const [bgColor, setBgColor] = useState('#1a1a3e');
    const [textColor, setTextColor] = useState('#ffffff');
    const [accentColor, setAccentColor] = useState('#ec4899');
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    const generateSlides = async () => {
        setIsGenerating(true);

        // Basit slide içerikleri oluştur (AI olmadan hızlı demo)
        const baseSlides: CarouselSlide[] = [
            { text: `📌 ${topic}` },
            { text: '1️⃣ Nemlendiricini kullan - Kış aylarında saç nemini kaybeder' },
            { text: '2️⃣ Sıcak su yerine ılık su kullan - Saç köklerini korur' },
            { text: '3️⃣ Saç maskesi uygula - Haftada 1-2 kez' },
            { text: '4️⃣ Föhne dikkat et - Düşük ısıda kullan' },
            { text: '5️⃣ Şapka kullan - Soğuktan koru' },
            { text: '💇 Ali Kurt Hair Artist\n📍 Randevu için DM' }
        ].slice(0, slideCount);

        setSlides(baseSlides);

        // Canvas ile görsel oluştur
        const images: string[] = [];

        for (let i = 0; i < baseSlides.length; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d')!;

            // Gradient arka plan
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, bgColor);
            gradient.addColorStop(1, shadeColor(bgColor, -30));
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dekoratif daireler
            ctx.fillStyle = accentColor + '20';
            ctx.beginPath();
            ctx.arc(150, 150, 200, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(930, 930, 250, 0, Math.PI * 2);
            ctx.fill();

            // Slide numarası
            ctx.fillStyle = accentColor;
            ctx.font = 'bold 60px Arial, sans-serif';
            ctx.fillText(`${i + 1}/${baseSlides.length}`, 60, 100);

            // Ana içerik
            ctx.fillStyle = textColor;
            ctx.font = 'bold 56px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const lines = wrapText(ctx, baseSlides[i].text, 900);
            const lineHeight = 80;
            const startY = (canvas.height - lines.length * lineHeight) / 2;

            lines.forEach((line, idx) => {
                ctx.fillText(line, canvas.width / 2, startY + idx * lineHeight);
            });

            // Alt logo
            ctx.font = '28px Arial, sans-serif';
            ctx.fillStyle = textColor + '60';
            ctx.fillText('💇 Ali Kurt Hair Artist', canvas.width / 2, canvas.height - 80);

            images.push(canvas.toDataURL('image/png'));
        }

        setGeneratedImages(images);
        setIsGenerating(false);
    };

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
        const lines: string[] = [];
        const paragraphs = text.split('\n');

        paragraphs.forEach(para => {
            const words = para.split(' ');
            let currentLine = '';

            words.forEach(word => {
                const testLine = currentLine + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine = testLine;
                }
            });
            lines.push(currentLine.trim());
        });

        return lines;
    };

    const shadeColor = (color: string, percent: number): string => {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    };

    const downloadSlide = (dataUrl: string, index: number) => {
        const link = document.createElement('a');
        link.download = `carousel_slide_${index + 1}.png`;
        link.href = dataUrl;
        link.click();
    };

    const downloadAll = () => {
        generatedImages.forEach((img, i) => {
            setTimeout(() => downloadSlide(img, i), i * 300);
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-6xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-black text-white">🎨 Carousel Oluşturucu</h2>
                        <p className="text-xs text-slate-500">Görsel üzerine yazı - Instagram carousel</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Settings */}
                    <div className="bg-[#020617] rounded-2xl p-5 border border-slate-800 mb-6">
                        <h3 className="text-sm font-bold text-slate-400 mb-4">⚙️ AYARLAR</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <label className="text-[10px] text-slate-500 mb-1 block">Konu</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                    className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg p-2 text-sm text-white"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 mb-1 block">Slide</label>
                                <select
                                    value={slideCount}
                                    onChange={e => setSlideCount(Number(e.target.value))}
                                    className="w-full bg-[#0a0f1e] border border-slate-700 rounded-lg p-2 text-sm text-white"
                                >
                                    <option value={3}>3 Slide</option>
                                    <option value={5}>5 Slide</option>
                                    <option value={7}>7 Slide</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <label className="text-[10px] text-slate-500 mb-1 block">Arka Plan</label>
                                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 mb-1 block">Metin</label>
                                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 mb-1 block">Vurgu</label>
                                    <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={generateSlides}
                            isLoading={isGenerating}
                            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500"
                        >
                            ✨ Carousel Oluştur
                        </Button>
                    </div>

                    {/* Generated Slides */}
                    {generatedImages.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-white">📸 Oluşturulan Görseller ({generatedImages.length})</h3>
                                <button onClick={downloadAll} className="px-4 py-2 bg-emerald-600 rounded-lg text-xs font-bold text-white">
                                    ⬇️ Tümünü İndir
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {generatedImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} className="rounded-xl w-full" alt={`Slide ${idx + 1}`} />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                            <button
                                                onClick={() => downloadSlide(img, idx)}
                                                className="px-3 py-1 bg-white text-black rounded text-xs font-bold"
                                            >
                                                ⬇️ İndir
                                            </button>
                                        </div>
                                        <span className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-[10px] text-white">
                                            {idx + 1}/{generatedImages.length}
                                        </span>
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
                            💡 Görselleri indirip Instagram'da carousel olarak paylaşabilirsiniz
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
