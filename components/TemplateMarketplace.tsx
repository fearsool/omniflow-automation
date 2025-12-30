
import React, { useState } from 'react';
import { MEGA_TEMPLATES, MEGA_TEMPLATE_CATEGORIES, MegaTemplate } from '../services/megaTemplateService';
import { SystemBlueprint } from '../types';

interface TemplateMarketplaceProps {
    onSelectTemplate: (blueprint: SystemBlueprint) => void;
    onClose: () => void;
}

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({ onSelectTemplate, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<MegaTemplate | null>(null);

    // Merge categories for display if needed, but MEGA_TEMPLATE_CATEGORIES covers most
    const categories = MEGA_TEMPLATE_CATEGORIES;

    const filteredTemplates = MEGA_TEMPLATES.filter(template => {
        const matchesCategory = !selectedCategory || template.category === selectedCategory;
        const matchesSearch = !searchQuery ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const createBlueprintFromTemplate = (template: MegaTemplate): SystemBlueprint => {
        return {
            id: crypto.randomUUID(),
            ...template.blueprint
        };
    };

    const handleUseTemplate = (template: MegaTemplate) => {
        const blueprint = createBlueprintFromTemplate(template);
        onSelectTemplate(blueprint);
        onClose();
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8">
            <div className="bg-[#0a0f1e] rounded-3xl border border-slate-800 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/10">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                <span className="text-3xl">🏭</span>
                                OmniFlow Profit Factory
                            </h2>
                            <p className="text-sm text-slate-400">
                                {MEGA_TEMPLATES.length}+ Para Kazandıran Otomasyon Şablonu
                            </p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">✕</button>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="🔍 Şablon, kategori veya etiket ara... (örn: dropshipping, ai agency, youtube)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                    />
                </div>

                {/* Categories */}
                <div className="px-6 py-4 border-b border-slate-800 flex gap-3 overflow-x-auto scrollbar-hide shrink-0">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${!selectedCategory
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                            }`}
                    >
                        Tümü ({MEGA_TEMPLATES.length})
                    </button>
                    {Object.entries(categories).map(([key, cat]: [string, any]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${selectedCategory === key
                                    ? `bg-${cat.color}-600 border-${cat.color}-500 text-white shadow-lg shadow-${cat.color}-900/20`
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Template Grid */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {selectedTemplate ? (
                        /* Template Detail View */
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="mb-4 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2 font-medium"
                            >
                                ← Listeye Dön
                            </button>

                            <div className="bg-[#020617] rounded-3xl border border-slate-800 p-8 shadow-2xl">
                                <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
                                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5`}>
                                        {selectedTemplate.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-black text-white">{selectedTemplate.name}</h3>
                                            {selectedTemplate.popular && (
                                                <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-1 rounded-full font-bold border border-amber-500/20">
                                                    🔥 POPÜLER
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-base text-slate-400 mb-4 leading-relaxed">{selectedTemplate.description}</p>
                                        <div className="flex gap-3 flex-wrap">
                                            <span className={`text-xs px-3 py-1.5 rounded-lg border border-white/5 ${difficultyColors[selectedTemplate.difficulty]}`}>
                                                {difficultyLabels[selectedTemplate.difficulty]}
                                            </span>
                                            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                                                💰 {selectedTemplate.estimatedRevenue}
                                            </span>
                                            <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-1">
                                                ⏱️ {selectedTemplate.timeToSetup} Kurulum
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleUseTemplate(selectedTemplate)}
                                        className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                                    >
                                        <span>🚀</span>
                                        <span>BU ŞABLONU KUR</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50">
                                        <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                                            <span>📊</span> Workflow Adımları
                                        </h4>
                                        <div className="space-y-3 relative">
                                            {/* Connecting Line */}
                                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-800 z-0"></div>

                                            {selectedTemplate.blueprint.nodes.map((node, idx) => (
                                                <div key={node.id} className="flex items-center gap-4 relative z-10 group">
                                                    <span className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 text-slate-400 text-xs flex items-center justify-center font-bold group-hover:border-indigo-500 group-hover:text-white transition-colors">
                                                        {idx + 1}
                                                    </span>
                                                    <div className="flex-1 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 group-hover:border-indigo-500/30 transition-colors">
                                                        <p className="text-sm text-white font-medium">{node.title}</p>
                                                        <p className="text-[11px] text-slate-500 mt-1">{node.task}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/50">
                                        <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                                            <span>🏷️</span> Etiketler & Detaylar
                                        </h4>
                                        <div className="flex gap-2 flex-wrap mb-6">
                                            {selectedTemplate.tags.map(tag => (
                                                <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:border-indigo-500/50 transition-colors cursor-default">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/20">
                                            <h5 className="text-indigo-300 font-bold text-xs mb-2 uppercase tracking-wider">Master Goal</h5>
                                            <p className="text-indigo-100 text-sm">{selectedTemplate.blueprint.masterGoal}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Template List View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className="bg-[#020617] rounded-2xl border border-slate-800 p-5 cursor-pointer hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group flex flex-col h-full"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                                            {template.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-sm truncate pr-2" title={template.name}>{template.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`w-2 h-2 rounded-full ${template.popular ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`}></span>
                                                <p className="text-[10px] text-slate-500">{template.blueprint.nodes.length} adım</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-1">{template.description}</p>

                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                                            <span className={`text-[9px] px-2 py-1 rounded font-medium border border-white/5 ${difficultyColors[template.difficulty]}`}>
                                                {difficultyLabels[template.difficulty]}
                                            </span>
                                            {template.popular && (
                                                <span className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                                                    🔥 Hot
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2 text-center group-hover:bg-emerald-500/10 transition-colors">
                                            <span className="text-[10px] text-emerald-400 font-bold block">
                                                {template.estimatedRevenue}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-20 flex flex-col items-center justify-center opacity-50">
                            <span className="text-6xl mb-4 block animate-bounce">🔍</span>
                            <h3 className="text-xl font-bold text-white mb-2">Şablon Bulunamadı</h3>
                            <p className="text-sm text-slate-500 max-w-sm">
                                "{searchQuery}" ile eşleşen bir sonuç yok. Başka bir kategori veya arama terimi deneyin.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                                className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
                            >
                                Tüm Şablonları Göster
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
