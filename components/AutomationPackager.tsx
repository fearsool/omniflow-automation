
import React, { useState } from 'react';
import { SystemBlueprint } from '../types';
import { Button } from './Button';
import { generatePythonScript, generateNodeServer, generateGitHubAction, generateDockerfile } from '../services/codeGenerator';

interface AutomationPackagerProps {
    blueprint: SystemBlueprint;
    onClose: () => void;
}

export const AutomationPackager: React.FC<AutomationPackagerProps> = ({ blueprint, onClose }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [packageType, setPackageType] = useState<'standard' | 'premium'>('standard');

    const generatePackage = async () => {
        setIsGenerating(true);

        try {
            // Generate all code files
            const pythonFiles = generatePythonScript(blueprint);
            const nodeFiles = generateNodeServer(blueprint);
            const githubFiles = generateGitHubAction(blueprint);
            const dockerFiles = generateDockerfile(blueprint);

            const pythonCode = pythonFiles[0]?.content || '';
            const nodeCode = nodeFiles[0]?.content || '';
            const githubWorkflow = githubFiles[0]?.content || '';
            const dockerfile = dockerFiles[0]?.content || '';

            // Generate README
            const readme = generateReadme(blueprint);

            // Generate setup instructions
            const setup = generateSetup(blueprint);

            // Generate requirements.txt
            const requirements = `requests>=2.28.0
python-dotenv>=0.20.0
`;

            // Generate package.json for Node
            const packageJson = JSON.stringify({
                name: slugify(blueprint.name),
                version: "1.0.0",
                description: blueprint.description,
                main: "automation.js",
                scripts: {
                    start: "node automation.js"
                },
                dependencies: {
                    "node-fetch": "^3.3.0",
                    "dotenv": "^16.0.0"
                }
            }, null, 2);

            // Create zip using JSZip pattern (client-side)
            const files = [
                { name: 'README.md', content: readme },
                { name: 'KURULUM.md', content: setup },
                { name: 'python/automation.py', content: pythonCode },
                { name: 'python/requirements.txt', content: requirements },
                { name: 'nodejs/automation.js', content: nodeCode },
                { name: 'nodejs/package.json', content: packageJson },
                { name: '.github/workflows/run.yml', content: githubWorkflow },
                { name: 'docker/Dockerfile', content: dockerfile },
                { name: 'config/blueprint.json', content: JSON.stringify(blueprint, null, 2) }
            ];

            // Download as individual files (since no JSZip available)
            downloadAsZip(files, blueprint.name);

        } finally {
            setIsGenerating(false);
        }
    };

    const generateReadme = (bp: SystemBlueprint): string => {
        return `# ${bp.name}

${bp.description}

## 🎯 Amaç
${bp.masterGoal}

## 🔧 Kurulum

### Python
\`\`\`bash
cd python
pip install -r requirements.txt
python automation.py
\`\`\`

### Node.js
\`\`\`bash
cd nodejs
npm install
npm start
\`\`\`

### Docker
\`\`\`bash
cd docker
docker build -t ${slugify(bp.name)} .
docker run ${slugify(bp.name)}
\`\`\`

### GitHub Actions
1. Bu repo'yu fork edin
2. Settings > Secrets > Actions
3. \`HUGGINGFACE_TOKEN\` ekleyin
4. Workflow otomatik çalışır

## ⚙️ Konfigürasyon

\`.env\` dosyası oluşturun:
\`\`\`
HUGGINGFACE_TOKEN=your_token_here
\`\`\`

## 📋 Ajanlar

${bp.nodes.map((n, i) => `${i + 1}. **${n.title}** - ${n.task.substring(0, 100)}...`).join('\n')}

## 📜 Lisans
MIT - Ticari kullanıma açıktır.

---
*OmniFlow Automation Factory ile oluşturuldu*
`;
    };

    const generateSetup = (bp: SystemBlueprint): string => {
        return `# ${bp.name} - Kurulum Rehberi

## 📦 Gereksinimler
- Python 3.9+ veya Node.js 18+
- HuggingFace API Token

## 🔑 API Token Alma

1. https://huggingface.co adresine gidin
2. Kayıt olun / Giriş yapın
3. Settings > Access Tokens
4. "New token" butonuna tıklayın
5. Token'ı kopyalayın

## 🚀 Hızlı Başlangıç

### 1. Token'ı ayarlayın
\`\`\`bash
export HUGGINGFACE_TOKEN="your_token_here"
\`\`\`

### 2. Çalıştırın
\`\`\`bash
python python/automation.py
\`\`\`

## ❓ Sorun Giderme

### "Token hatası"
- Token'ın doğru olduğunu kontrol edin
- Token'ın API erişim izni olduğunu kontrol edin

### "Rate limit"
- Bir kaç dakika bekleyin
- Pro hesaba geçmeyi düşünün

## 📞 Destek
Bu otomasyon OmniFlow ile oluşturuldu.
https://omniflow-automation-bot.netlify.app
`;
    };

    const slugify = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    };

    const downloadAsZip = (files: { name: string; content: string }[], name: string) => {
        // Since we can't use JSZip easily, download files as a single merged file
        // Or create individual downloads

        // Create a combined "package" file that includes all content
        const combined = files.map(f => `
======================================
FILE: ${f.name}
======================================
${f.content}
`).join('\n\n');

        // Download combined file
        const blob = new Blob([combined], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${slugify(name)}_automation_package.txt`;
        link.click();
        URL.revokeObjectURL(url);

        // Also offer to download main automation.py separately
        setTimeout(() => {
            const pythonFile = files.find(f => f.name.includes('automation.py'));
            if (pythonFile) {
                const blob2 = new Blob([pythonFile.content], { type: 'text/x-python' });
                const url2 = URL.createObjectURL(blob2);
                const link2 = document.createElement('a');
                link2.href = url2;
                link2.download = `${slugify(name)}_automation.py`;
                link2.click();
                URL.revokeObjectURL(url2);
            }
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-2xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-black text-white">📦 Otomasyon Paketleyici</h2>
                        <p className="text-xs text-slate-500">Satışa hazır paket oluştur</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Blueprint Info */}
                    <div className="bg-[#020617] rounded-2xl p-4 border border-slate-800">
                        <h3 className="font-bold text-white mb-2">{blueprint.name}</h3>
                        <p className="text-sm text-slate-400">{blueprint.description}</p>
                        <div className="flex gap-4 mt-3 text-xs text-slate-500">
                            <span>🔗 {blueprint.nodes.length} ajan</span>
                            <span>📁 v{blueprint.version}</span>
                        </div>
                    </div>

                    {/* Package Type */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-3">PAKET TÜRÜ</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPackageType('standard')}
                                className={`p-4 rounded-xl border text-left transition-all ${packageType === 'standard'
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <span className="text-lg">📁</span>
                                <p className="font-bold text-white mt-1">Standart</p>
                                <p className="text-[10px] text-slate-500">Python + Node.js + Docker</p>
                            </button>
                            <button
                                onClick={() => setPackageType('premium')}
                                className={`p-4 rounded-xl border text-left transition-all ${packageType === 'premium'
                                    ? 'border-amber-500 bg-amber-500/10'
                                    : 'border-slate-700 hover:border-slate-600'
                                    }`}
                            >
                                <span className="text-lg">⭐</span>
                                <p className="font-bold text-white mt-1">Premium</p>
                                <p className="text-[10px] text-slate-500">+ Web UI + API + Docs</p>
                            </button>
                        </div>
                    </div>

                    {/* Included Files */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-3">PAKETE DAHİL</h4>
                        <div className="bg-[#020617] rounded-xl p-3 border border-slate-800 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="text-emerald-400">✓</span> Python otomasyonu (automation.py)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="text-emerald-400">✓</span> Node.js otomasyonu (automation.js)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="text-emerald-400">✓</span> GitHub Actions workflow
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="text-emerald-400">✓</span> Docker dosyası
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                <span className="text-emerald-400">✓</span> README ve kurulum rehberi
                            </div>
                            {packageType === 'premium' && (
                                <>
                                    <div className="flex items-center gap-2 text-xs text-amber-400">
                                        <span>⭐</span> Web arayüzü (HTML)
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-amber-400">
                                        <span>⭐</span> API endpointleri
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-[#020617]">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">
                            💰 Ticari kullanıma hazır MIT lisansı ile
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={onClose} className="bg-slate-700">
                                İptal
                            </Button>
                            <Button
                                onClick={generatePackage}
                                isLoading={isGenerating}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500"
                            >
                                📦 Paketi İndir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
