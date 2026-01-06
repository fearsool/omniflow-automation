/**
 * Automation Runner Modal
 * Fabrikadan gerçek otomasyon çalıştırma UI
 */

import React, { useState } from 'react';
import {
    AutomationType,
    AutomationParams,
    AutomationResult,
    AUTOMATION_INFO,
    runAutomation,
    getAvailableAutomations
} from '../services/automationRunnerService';

interface AutomationRunnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedType?: AutomationType;
}

export const AutomationRunnerModal: React.FC<AutomationRunnerModalProps> = ({
    isOpen,
    onClose,
    preselectedType
}) => {
    const [selectedType, setSelectedType] = useState<AutomationType | null>(preselectedType || null);
    const [params, setParams] = useState<AutomationParams>({});
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AutomationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const automations = getAvailableAutomations();

    const handleRun = async () => {
        if (!selectedType) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await runAutomation(selectedType, params);
            if (res.success) {
                setResult(res);
            } else {
                setError(res.error || "Bilinmeyen hata");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Bağlantı hatası");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.result) {
            navigator.clipboard.writeText(result.result);
            alert("✅ Kopyalandı!");
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setParams({});
    };

    if (!isOpen) return null;

    const selectedInfo = selectedType ? AUTOMATION_INFO[selectedType] : null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f172a] rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            ⚡ Gerçek Otomasyon Çalıştır
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">AI ile gerçek içerik üret</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Otomasyon Seçimi */}
                    {!selectedType && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {automations.map(({ type, info }) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-left"
                                >
                                    <span className="text-2xl mb-2 block">{info.icon}</span>
                                    <p className="text-sm font-medium text-white">{info.name}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{info.description}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Parametre Girişi */}
                    {selectedType && !result && (
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedType(null)}
                                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                                ← Geri
                            </button>

                            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                                <span className="text-3xl">{selectedInfo?.icon}</span>
                                <div>
                                    <h3 className="font-bold text-white">{selectedInfo?.name}</h3>
                                    <p className="text-xs text-slate-400">{selectedInfo?.description}</p>
                                </div>
                            </div>

                            {/* Dinamik Parametre Alanları */}
                            <div className="space-y-3">
                                {selectedInfo?.requiredParams.map(param => (
                                    <div key={param}>
                                        <label className="block text-sm text-slate-400 mb-1 capitalize">
                                            {param} <span className="text-red-400">*</span>
                                        </label>
                                        {param === 'email' ? (
                                            <textarea
                                                value={params[param as keyof AutomationParams] || ''}
                                                onChange={(e) => setParams({ ...params, [param]: e.target.value })}
                                                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
                                                rows={4}
                                                placeholder={`${param} girin...`}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={params[param as keyof AutomationParams] || ''}
                                                onChange={(e) => setParams({ ...params, [param]: e.target.value })}
                                                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                                placeholder={`${param} girin...`}
                                            />
                                        )}
                                    </div>
                                ))}

                                {selectedInfo?.optionalParams.map(param => (
                                    <div key={param}>
                                        <label className="block text-sm text-slate-400 mb-1 capitalize">
                                            {param} <span className="text-slate-600">(opsiyonel)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={params[param as keyof AutomationParams] || ''}
                                            onChange={(e) => setParams({ ...params, [param]: e.target.value })}
                                            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                                            placeholder={`${param} girin...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sonuç Gösterimi */}
                    {result && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <span className="text-2xl">✅</span>
                                    <span className="font-bold">Başarılı!</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
                                    >
                                        📋 Kopyala
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                                    >
                                        🔄 Yeniden
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono">
                                    {result.result}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Hata Gösterimi */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm">❌ {error}</p>
                            <button
                                onClick={handleReset}
                                className="mt-2 text-sm text-red-300 hover:text-red-200"
                            >
                                Tekrar dene
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {isLoading && (
                        <div className="text-center py-10">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-400">AI çalışıyor...</p>
                            <p className="text-xs text-slate-500 mt-1">Bu işlem 5-15 saniye sürebilir</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {selectedType && !result && !isLoading && (
                    <div className="p-6 border-t border-slate-800">
                        <button
                            onClick={handleRun}
                            disabled={!selectedInfo?.requiredParams.every(p => params[p as keyof AutomationParams])}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ⚡ ÇALIŞTIR
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutomationRunnerModal;
