
import React, { useState } from 'react';
import { SystemBlueprint } from '../types';
import {
    exportBlueprint,
    ExportFormat,
    copyToClipboard
} from '../services/codeGenerator';
import { Button } from './Button';

interface CodeExportModalProps {
    blueprint: SystemBlueprint | null;
    onClose: () => void;
}

const exportOptions: { format: ExportFormat; icon: string; name: string; description: string }[] = [
    { format: 'python', icon: '🐍', name: 'Python Script', description: 'Bağımsız çalışan Python dosyası' },
    { format: 'nodejs', icon: '🟢', name: 'Node.js Server', description: 'Express.js API server + Docker' },
    { format: 'github-action', icon: '⚡', name: 'GitHub Action', description: 'Otomatik zamanlanmış workflow' },
    { format: 'dockerfile', icon: '🐳', name: 'Docker Container', description: 'Container-ready paket' }
];

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ blueprint, onClose }) => {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('python');
    const [generatedFiles, setGeneratedFiles] = useState<{ filename: string; content: string; language: string }[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!blueprint) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate generation delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const files = exportBlueprint(blueprint, selectedFormat);
        setGeneratedFiles(files);
        setActiveFileIndex(0);
        setIsGenerating(false);
    };

    const handleCopy = async () => {
        if (generatedFiles[activeFileIndex]) {
            await copyToClipboard(generatedFiles[activeFileIndex].content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadAll = async () => {
        // Create a simple download mechanism (without JSZip for now)
        generatedFiles.forEach(file => {
            const blob = new Blob([file.content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.filename.split('/').pop() || file.filename;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-5xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">📦 Kod Export</h2>
                        <p className="text-xs text-slate-500 mt-1">{blueprint.name} sistemini dışa aktar</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Format Selection */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {exportOptions.map(opt => (
                        <button
                            key={opt.format}
                            onClick={() => { setSelectedFormat(opt.format); setGeneratedFiles([]); }}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedFormat === opt.format
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <span className="text-2xl">{opt.icon}</span>
                            <p className="text-xs font-bold text-white mt-2">{opt.name}</p>
                            <p className="text-[9px] text-slate-500 mt-1">{opt.description}</p>
                        </button>
                    ))}
                </div>

                {/* Generate Button */}
                <Button
                    onClick={handleGenerate}
                    className="w-full bg-indigo-600 rounded-xl h-12 mb-6"
                    isLoading={isGenerating}
                >
                    🔧 {selectedFormat.toUpperCase()} Kodu Oluştur
                </Button>

                {/* Generated Files */}
                {generatedFiles.length > 0 && (
                    <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
                        {/* File Tabs */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            {generatedFiles.map((file, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveFileIndex(idx)}
                                    className={`px-4 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${activeFileIndex === idx
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    📄 {file.filename}
                                </button>
                            ))}
                        </div>

                        {/* Code Display */}
                        <div className="flex-1 bg-[#020617] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800">
                                <span className="text-xs font-mono text-slate-400">{generatedFiles[activeFileIndex]?.filename}</span>
                                <div className="flex gap-2">
                                    <Button onClick={handleCopy} variant="ghost" className="text-xs h-8">
                                        {copied ? '✓ Kopyalandı' : '📋 Kopyala'}
                                    </Button>
                                    <Button onClick={handleDownloadAll} variant="ghost" className="text-xs h-8">
                                        ⬇️ Tümünü İndir
                                    </Button>
                                </div>
                            </div>

                            <pre className="flex-1 p-4 overflow-auto text-[10px] text-slate-300 font-mono">
                                {generatedFiles[activeFileIndex]?.content}
                            </pre>
                        </div>

                        {/* Quick Start Guide */}
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">🚀 Hızlı Başlangıç</h4>
                            <div className="grid grid-cols-3 gap-4 text-[9px] text-slate-300">
                                <div>
                                    <span className="text-emerald-400">1.</span> Dosyaları indirin
                                </div>
                                <div>
                                    <span className="text-emerald-400">2.</span> <code className="bg-black/30 px-1 rounded">npm install</code>
                                </div>
                                <div>
                                    <span className="text-emerald-400">3.</span> <code className="bg-black/30 px-1 rounded">npm start</code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
