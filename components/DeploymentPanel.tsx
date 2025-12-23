
import React, { useState } from 'react';
import { SystemBlueprint } from '../types';
import { Button } from './Button';

interface DeploymentPanelProps {
    blueprint: SystemBlueprint | null;
    onClose: () => void;
}

type DeployPlatform = 'railway' | 'render' | 'vercel' | 'netlify';

const platforms: { id: DeployPlatform; name: string; icon: string; url: string; description: string }[] = [
    { id: 'railway', name: 'Railway', icon: '🚂', url: 'https://railway.app', description: 'En kolay deploy, $5/ay free tier' },
    { id: 'render', name: 'Render', icon: '🎨', url: 'https://render.com', description: 'Ücretsiz tier, otomatik deploy' },
    { id: 'vercel', name: 'Vercel', icon: '▲', url: 'https://vercel.com', description: 'Serverless, edge functions' },
    { id: 'netlify', name: 'Netlify', icon: '◆', url: 'https://netlify.com', description: 'Serverless functions' }
];

export const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ blueprint, onClose }) => {
    const [selectedPlatform, setSelectedPlatform] = useState<DeployPlatform>('railway');
    const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
        { key: 'GEMINI_API_KEY', value: '' },
        { key: 'NODE_ENV', value: 'production' }
    ]);
    const [deployStatus, setDeployStatus] = useState<'idle' | 'preparing' | 'ready'>('idle');

    if (!blueprint) return null;

    const addEnvVar = () => {
        setEnvVars([...envVars, { key: '', value: '' }]);
    };

    const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
        const updated = [...envVars];
        updated[index][field] = value;
        setEnvVars(updated);
    };

    const removeEnvVar = (index: number) => {
        setEnvVars(envVars.filter((_, i) => i !== index));
    };

    const handlePrepare = () => {
        setDeployStatus('preparing');
        setTimeout(() => setDeployStatus('ready'), 1500);
    };

    const getDeployInstructions = (): string => {
        const platform = platforms.find(p => p.id === selectedPlatform);

        const envString = envVars.map(e => `${e.key}=${e.value || 'YOUR_VALUE'}`).join('\n');

        switch (selectedPlatform) {
            case 'railway':
                return `# Railway Deploy - ${blueprint.name}

## 1. Railway CLI Kurulumu
npm install -g @railway/cli
railway login

## 2. Proje Oluştur
railway init

## 3. Environment Variables
${envString}

## 4. Deploy
railway up

## 5. Domain Al
railway domain
`;

            case 'render':
                return `# Render Deploy - ${blueprint.name}

## 1. render.yaml oluştur
\`\`\`yaml
services:
  - type: web
    name: ${blueprint.name.toLowerCase().replace(/\s+/g, '-')}
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
${envVars.map(e => `      - key: ${e.key}\n        sync: false`).join('\n')}
\`\`\`

## 2. GitHub'a Push Et
git add . && git commit -m "Add render.yaml" && git push

## 3. Render Dashboard
${platform?.url}/new/blueprint
`;

            case 'vercel':
                return `# Vercel Deploy - ${blueprint.name}

## 1. Vercel CLI
npm install -g vercel
vercel login

## 2. Deploy
vercel

## 3. Environment Variables (Dashboard'dan)
${envVars.map(e => `${e.key}=${e.value || 'YOUR_VALUE'}`).join('\n')}

## 4. Production Deploy
vercel --prod
`;

            case 'netlify':
                return `# Netlify Deploy - ${blueprint.name}

## 1. netlify.toml oluştur
\`\`\`toml
[build]
  command = "npm run build"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
\`\`\`

## 2. Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod

## 3. Environment Variables
${envVars.map(e => `${e.key}=${e.value || 'YOUR_VALUE'}`).join('\n')}
`;

            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-4xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">🚀 Deploy Merkezi</h2>
                        <p className="text-xs text-slate-500 mt-1">{blueprint.name} sistemini canlıya al</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Platform Selection */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                    {platforms.map(platform => (
                        <button
                            key={platform.id}
                            onClick={() => { setSelectedPlatform(platform.id); setDeployStatus('idle'); }}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedPlatform === platform.id
                                    ? 'border-emerald-500 bg-emerald-500/10'
                                    : 'border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <span className="text-2xl">{platform.icon}</span>
                            <p className="text-xs font-bold text-white mt-2">{platform.name}</p>
                            <p className="text-[8px] text-slate-500 mt-1">{platform.description}</p>
                        </button>
                    ))}
                </div>

                {/* Environment Variables */}
                <div className="bg-[#020617] border border-slate-800 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-indigo-400 uppercase">🔐 Environment Variables</h3>
                        <button
                            onClick={addEnvVar}
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                            + Ekle
                        </button>
                    </div>

                    <div className="space-y-3">
                        {envVars.map((env, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    className="flex-1 bg-[#0a0f1e] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                                    placeholder="KEY"
                                    value={env.key}
                                    onChange={(e) => updateEnvVar(idx, 'key', e.target.value)}
                                />
                                <input
                                    type="password"
                                    className="flex-1 bg-[#0a0f1e] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                                    placeholder="value"
                                    value={env.value}
                                    onChange={(e) => updateEnvVar(idx, 'value', e.target.value)}
                                />
                                <button
                                    onClick={() => removeEnvVar(idx)}
                                    className="text-slate-500 hover:text-rose-500"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prepare Deploy */}
                <Button
                    onClick={handlePrepare}
                    className="w-full bg-emerald-600 rounded-xl h-12 mb-6"
                    isLoading={deployStatus === 'preparing'}
                >
                    {deployStatus === 'ready' ? '✅ Hazır!' : '📋 Deploy Talimatlarını Hazırla'}
                </Button>

                {/* Deploy Instructions */}
                {deployStatus === 'ready' && (
                    <div className="bg-[#020617] border border-emerald-500/30 rounded-2xl p-6 animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-emerald-400 uppercase">
                                📋 {platforms.find(p => p.id === selectedPlatform)?.name} Deploy Talimatları
                            </h3>
                            <a
                                href={platforms.find(p => p.id === selectedPlatform)?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-400 hover:underline"
                            >
                                {platforms.find(p => p.id === selectedPlatform)?.url} ↗
                            </a>
                        </div>

                        <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-[10px] text-slate-300 font-mono whitespace-pre-wrap">
                            {getDeployInstructions()}
                        </pre>

                        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <p className="text-[10px] text-amber-400">
                                💡 <b>İpucu:</b> Önce "Kod Export" ile dosyaları indirin, sonra bu talimatları takip edin.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
