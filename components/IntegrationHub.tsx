
import React, { useState } from 'react';
import { SystemBlueprint } from '../types';
import {
    whatsappConfig,
    telegramConfig,
    discordConfig,
    webhookConfig,
    IntegrationConfig,
    integrationManager
} from '../services/integrationService';
import { Button } from './Button';

interface IntegrationHubProps {
    blueprint: SystemBlueprint | null;
    onClose: () => void;
}

type IntegrationType = 'whatsapp' | 'telegram' | 'discord' | 'webhook';

const integrationIcons: Record<IntegrationType, string> = {
    whatsapp: '💬',
    telegram: '✈️',
    discord: '🎮',
    webhook: '🔌'
};

const integrationNames: Record<IntegrationType, string> = {
    whatsapp: 'WhatsApp Bot',
    telegram: 'Telegram Bot',
    discord: 'Discord Bot',
    webhook: 'Webhook Server'
};

export const IntegrationHub: React.FC<IntegrationHubProps> = ({ blueprint, onClose }) => {
    const [selectedType, setSelectedType] = useState<IntegrationType | null>(null);
    const [credentials, setCredentials] = useState<Record<string, string>>({});
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [copied, setCopied] = useState(false);

    if (!blueprint) return null;

    const handleGenerate = () => {
        let code = '';

        switch (selectedType) {
            case 'whatsapp':
                code = whatsappConfig.createMessageHandler(blueprint);
                break;
            case 'telegram':
                code = telegramConfig.createBotCode(blueprint, credentials.botToken || '');
                break;
            case 'discord':
                code = discordConfig.createBotCode(blueprint, credentials.botToken || '');
                break;
            case 'webhook':
                code = webhookConfig.createExpressServer(blueprint);
                break;
        }

        setGeneratedCode(code);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveIntegration = () => {
        if (!selectedType) return;

        integrationManager.addIntegration({
            type: selectedType,
            name: `${blueprint.name} - ${integrationNames[selectedType]}`,
            credentials,
            isActive: true
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-4xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">🔌 Entegrasyon Merkezi</h2>
                        <p className="text-xs text-slate-500 mt-1">{blueprint.name} için bağlantı kur</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Integration Type Selection */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {(Object.keys(integrationIcons) as IntegrationType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => { setSelectedType(type); setGeneratedCode(''); }}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selectedType === type
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <span className="text-4xl">{integrationIcons[type]}</span>
                            <span className="text-xs font-bold text-white uppercase">{integrationNames[type]}</span>
                        </button>
                    ))}
                </div>

                {/* Configuration Form */}
                {selectedType && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="bg-[#020617] border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase mb-4">⚙️ Yapılandırma</h3>

                            {selectedType === 'whatsapp' && (
                                <div className="space-y-4">
                                    <p className="text-xs text-slate-400">
                                        WhatsApp botu için <b>Baileys</b> kütüphanesi kullanılacak.
                                        Telefonunuzdan QR kod tarayarak bağlanacaksınız.
                                    </p>
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                        <p className="text-[10px] text-amber-400">
                                            ⚠️ <b>Not:</b> WhatsApp Business API resmi değil, kişisel kullanım için uygundur.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(selectedType === 'telegram' || selectedType === 'discord') && (
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Bot Token</span>
                                        <input
                                            type="text"
                                            className="mt-2 w-full bg-[#0a0f1e] border border-slate-700 rounded-xl p-3 text-sm text-white"
                                            placeholder={selectedType === 'telegram' ? '@BotFather\'dan alınan token' : 'Discord Developer Portal\'dan'}
                                            value={credentials.botToken || ''}
                                            onChange={(e) => setCredentials({ ...credentials, botToken: e.target.value })}
                                        />
                                    </label>

                                    {selectedType === 'telegram' && (
                                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                            <p className="text-[10px] text-blue-400">
                                                💡 Telegram'da <b>@BotFather</b>'a "/newbot" yazarak bot oluşturun ve token alın.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedType === 'webhook' && (
                                <div className="space-y-4">
                                    <p className="text-xs text-slate-400">
                                        Express.js tabanlı webhook server oluşturulacak.
                                        Herhangi bir servisten (Zapier, n8n, vb.) webhook alabilirsiniz.
                                    </p>
                                    <label className="block">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Port (opsiyonel)</span>
                                        <input
                                            type="number"
                                            className="mt-2 w-full bg-[#0a0f1e] border border-slate-700 rounded-xl p-3 text-sm text-white"
                                            placeholder="3000"
                                            value={credentials.port || ''}
                                            onChange={(e) => setCredentials({ ...credentials, port: e.target.value })}
                                        />
                                    </label>
                                </div>
                            )}

                            <Button
                                onClick={handleGenerate}
                                className="w-full mt-6 bg-indigo-600 rounded-xl h-12"
                            >
                                🔧 Kodu Oluştur
                            </Button>
                        </div>

                        {/* Generated Code */}
                        {generatedCode && (
                            <div className="bg-[#020617] border border-emerald-500/30 rounded-2xl p-6 animate-in fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-emerald-400 uppercase">✅ Oluşturulan Kod</h3>
                                    <div className="flex gap-2">
                                        <Button onClick={handleCopy} variant="ghost" className="text-xs">
                                            {copied ? '✓ Kopyalandı' : '📋 Kopyala'}
                                        </Button>
                                        <Button onClick={handleSaveIntegration} variant="ghost" className="text-xs">
                                            💾 Kaydet
                                        </Button>
                                    </div>
                                </div>

                                <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-[10px] text-slate-300 font-mono max-h-96">
                                    {generatedCode}
                                </pre>

                                {/* Setup Instructions */}
                                <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3">📋 Kurulum Adımları</h4>
                                    <ol className="text-[10px] text-slate-300 space-y-2 list-decimal list-inside">
                                        <li>Kodu yeni bir klasöre <code className="bg-black/30 px-1 rounded">server.js</code> olarak kaydedin</li>
                                        <li><code className="bg-black/30 px-1 rounded">npm init -y</code> çalıştırın</li>
                                        <li>Gerekli paketleri yükleyin: <code className="bg-black/30 px-1 rounded">npm install express @google/generative-ai dotenv</code></li>
                                        {selectedType === 'whatsapp' && <li>Ek: <code className="bg-black/30 px-1 rounded">npm install @whiskeysockets/baileys</code></li>}
                                        {selectedType === 'telegram' && <li>Ek: <code className="bg-black/30 px-1 rounded">npm install node-telegram-bot-api</code></li>}
                                        {selectedType === 'discord' && <li>Ek: <code className="bg-black/30 px-1 rounded">npm install discord.js</code></li>}
                                        <li><code className="bg-black/30 px-1 rounded">.env</code> dosyası oluşturup GEMINI_API_KEY ekleyin</li>
                                        <li><code className="bg-black/30 px-1 rounded">node server.js</code> ile başlatın</li>
                                    </ol>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
