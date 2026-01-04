// ============================================
// API CONFIG PANEL - Deploy Öncesi API Yapılandırması
// Template'e göre gerekli API'leri kullanıcıdan alır
// ============================================

import React, { useState } from 'react';
import { ApiRequirement } from '../services/templateService';

interface ApiConfigPanelProps {
    templateName: string;
    requiredApis: ApiRequirement[];
    onSave: (apiValues: Record<string, string>) => void;
    onCancel: () => void;
}

export const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({
    templateName,
    requiredApis,
    onSave,
    onCancel
}) => {
    const [apiValues, setApiValues] = useState<Record<string, string>>({});
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

    const handleChange = (name: string, value: string) => {
        setApiValues(prev => ({ ...prev, [name]: value }));
    };

    const toggleShowSecret = (name: string) => {
        setShowSecrets(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const isValid = () => {
        return requiredApis
            .filter(api => api.required !== false)
            .every(api => apiValues[api.name]?.trim());
    };

    const handleSubmit = () => {
        if (isValid()) {
            onSave(apiValues);
        }
    };

    const generateEnvFile = () => {
        const lines = requiredApis.map(api => {
            const value = apiValues[api.name] || '';
            return `${api.name}=${value}`;
        });
        return lines.join('\n');
    };

    const copyEnvToClipboard = () => {
        navigator.clipboard.writeText(generateEnvFile());
        alert('.env içeriği panoya kopyalandı!');
    };

    if (requiredApis.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        🔑 API Anahtarlarını Yapılandır
                    </h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        <span className="text-blue-400">{templateName}</span> için gerekli API bilgilerini girin
                    </p>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    {requiredApis.map((api) => (
                        <div key={api.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-white">
                                    {api.label}
                                    {api.required !== false && <span className="text-red-400 ml-1">*</span>}
                                </label>
                                {api.link && (
                                    <a
                                        href={api.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                    >
                                        📍 Nereden alınır?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showSecrets[api.name] ? 'text' : 'password'}
                                    value={apiValues[api.name] || ''}
                                    onChange={(e) => handleChange(api.name, e.target.value)}
                                    placeholder={api.placeholder || api.name}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowSecret(api.name)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showSecrets[api.name] ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">{api.description}</p>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mx-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400">
                        💡 API anahtarları sadece bu otomasyon için kullanılır ve güvenli şekilde saklanır.
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-700 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={copyEnvToClipboard}
                        className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                        title=".env dosyası olarak kopyala"
                    >
                        📋
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid()}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${isValid()
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        ✅ Kaydet & Devam Et
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiConfigPanel;
