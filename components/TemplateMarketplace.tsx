
import React, { useState } from 'react';
import { AUTOMATION_TEMPLATES, TEMPLATE_CATEGORIES, AutomationTemplate, createBlueprintFromTemplate } from '../services/templateService';
import { SystemBlueprint } from '../types';
import { ContentWizard } from './ContentWizard';
import { ContentAnalysisResult, generateAnswersFromTemplate } from '../services/contentStandardsService';

interface TemplateMarketplaceProps {
    onSelectTemplate: (blueprint: SystemBlueprint) => void;
    onClose: () => void;
}

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({ onSelectTemplate, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
    const [showWizard, setShowWizard] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState<AutomationTemplate | null>(null);
    const [autoAnswers, setAutoAnswers] = useState<Record<string, string> | undefined>(undefined);

    const filteredTemplates = AUTOMATION_TEMPLATES.filter(template => {
        const matchesCategory = !selectedCategory || template.category === selectedCategory;
        const matchesSearch = !searchQuery ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Şablon kullanmaya tıklandığında otomatik cevap üret ve wizard aç
    const handleUseTemplate = async (template: AutomationTemplate) => {
        setPendingTemplate(template);

        // Otomatik cevapları üret
        console.log('🤖 Template için otomatik cevaplar üretiliyor:', template.name);
        const generatedAnswers = await generateAnswersFromTemplate({
            name: template.name,
            description: template.description,
            category: template.category,
            tags: template.tags,
            estimatedRevenue: template.estimatedRevenue
        });

        setAutoAnswers(generatedAnswers);
        setShowWizard(true);
    };

    // Wizard tamamlandığında blueprint oluştur
    const handleWizardComplete = (analysisResult: ContentAnalysisResult, answers: Record<string, string>) => {
        if (!pendingTemplate) return;

        const blueprint = createBlueprintFromTemplate(pendingTemplate);

        // Analiz sonuçlarını blueprint'e ekle
        blueprint.contentScore = analysisResult.finalScore;
        blueprint.contentAnalysis = {
            step1Score: analysisResult.step1_gapAnalysis.score,
            step2Score: analysisResult.step2_psychographics.score,
            step3Score: analysisResult.step3_amygdalaTriggers.score,
            step4Score: analysisResult.step4_semanticScore.overallScore,
            finalScore: analysisResult.finalScore,
            approved: analysisResult.approved,
            recommendations: analysisResult.recommendations,
            analyzedAt: new Date().toISOString()
        };

        // Template'deki requiredApis'i blueprint'e ekle
        if (pendingTemplate.requiredApis) {
            blueprint.requiredApis = pendingTemplate.requiredApis;
        }

        console.log('✅ 4 Adımlık Analiz Tamamlandı:', blueprint.contentScore);

        onSelectTemplate(blueprint);
        setShowWizard(false);
        setPendingTemplate(null);
        setAutoAnswers(undefined);
        onClose();
    };

    const handleWizardCancel = () => {
        setShowWizard(false);
        setPendingTemplate(null);
        setAutoAnswers(undefined);
    };

    const difficultyColors = {
        easy: 'bg-emerald-500/20 text-emerald-400',
        medium: 'bg-amber-500/20 text-amber-400',
        hard: 'bg-red-500/20 text-red-400'
    };

    const difficultyLabels = {
        easy: 'Kolay',
        medium: 'Orta',
        hard: 'Zor'
    };

    return (
        <>
            {/* 4 Adımlık İçerik Analiz Wizard'ı - Otomatik Mod */}
            {showWizard && pendingTemplate && (
                <ContentWizard
                    templateName={pendingTemplate.name}
                    templateCategory={pendingTemplate.category}
                    onComplete={handleWizardComplete}
                    onCancel={handleWizardCancel}
                    autoAnswers={autoAnswers}
                />
            )}

            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                <div className="bg-[#0a0f1e] rounded-3xl border border-slate-800 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-black text-white">🎯 Template Marketplace</h2>
                                <p className="text-sm text-slate-500">Hazır otomasyon şablonlarını keşfet</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400">✕</button>
                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="🔍 Şablon ara... (örn: whatsapp, fiyat, lead)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Categories */}
                    <div className="px-6 py-4 border-b border-slate-800 flex gap-3 overflow-x-auto">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            Tümü ({AUTOMATION_TEMPLATES.length})
                        </button>
                        {Object.entries(TEMPLATE_CATEGORIES).map(([key, cat]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === key ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Template Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {selectedTemplate ? (
                            /* Template Detail View */
                            <div className="animate-in fade-in">
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="mb-4 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
                                >
                                    ← Listeye Dön
                                </button>

                                <div className="bg-[#020617] rounded-2xl border border-slate-800 p-6">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-4xl">
                                            {selectedTemplate.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">{selectedTemplate.name}</h3>
                                            <p className="text-sm text-slate-400 mb-3">{selectedTemplate.description}</p>
                                            <div className="flex gap-2 flex-wrap">
                                                <span className={`text-[10px] px-2 py-1 rounded ${difficultyColors[selectedTemplate.difficulty]}`}>
                                                    {difficultyLabels[selectedTemplate.difficulty]}
                                                </span>
                                                <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                                                    {selectedTemplate.estimatedRevenue}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-slate-400 mb-3">📊 Workflow Adımları</h4>
                                        <div className="space-y-2">
                                            {selectedTemplate.blueprint.nodes.map((node, idx) => (
                                                <div key={node.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                                                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                                                    <div>
                                                        <p className="text-sm text-white font-medium">{node.title}</p>
                                                        <p className="text-[10px] text-slate-500">{node.task}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-wrap mb-6">
                                        {selectedTemplate.tags.map(tag => (
                                            <span key={tag} className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400">#{tag}</span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUseTemplate(selectedTemplate)}
                                            className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
                                        >
                                            🚀 ŞABLONU KULLAN
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Gerçek Python kodunu göster
                                                const realTemplates = ['blog-post-generator', 'instagram-caption-generator', 'etsy-seo-generator', 'tweet-generator', 'email-responder'];
                                                if (realTemplates.includes(selectedTemplate.id)) {
                                                    alert(`✅ Bu şablon GERÇEK çalışıyor!\n\n📁 Dosya: automations/real-automations/${selectedTemplate.id.replace(/-/g, '_')}.py\n\n💡 Kullanım:\n1. pip install -r requirements.txt\n2. .env dosyasına HUGGINGFACE_TOKEN ekle\n3. python ${selectedTemplate.id.replace(/-/g, '_')}.py`);
                                                } else {
                                                    alert('⚠️ Bu şablon henüz gerçek çalışan versiyona sahip değil.\n\nGerçek çalışan 5 şablon:\n• Blog Yazısı Üretici\n• Instagram Caption Üretici\n• Etsy SEO Üretici\n• Tweet Üretici\n• Email Yanıtlayıcı');
                                                }
                                            }}
                                            className="px-4 py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                                            title="Gerçek Python kodunu çalıştır"
                                        >
                                            ⚡ GERÇEK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Template List View */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredTemplates.map(template => (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template)}
                                        className="bg-[#020617] rounded-2xl border border-slate-800 p-5 cursor-pointer hover:border-indigo-500/50 transition-all group"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {template.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-sm truncate">{template.name}</h3>
                                                <p className="text-[10px] text-slate-500">{template.blueprint.nodes.length} adım</p>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-slate-400 mb-4 line-clamp-2">{template.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className={`text-[9px] px-2 py-1 rounded ${difficultyColors[template.difficulty]}`}>
                                                {difficultyLabels[template.difficulty]}
                                            </span>
                                            <span className="text-[9px] text-emerald-400 font-bold">{template.estimatedRevenue}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredTemplates.length === 0 && (
                            <div className="text-center py-20">
                                <span className="text-6xl mb-4 block opacity-30">🔍</span>
                                <p className="text-sm text-slate-500">Arama kriterlerine uygun şablon bulunamadı</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
