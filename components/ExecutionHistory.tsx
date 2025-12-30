
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface HistoryItem {
    id: string;
    blueprintName: string;
    timestamp: string;
    status: 'success' | 'error' | 'running';
    duration: number;
    nodeCount: number;
    outputs: Record<string, string>;
}

interface ExecutionHistoryProps {
    onClose: () => void;
    onRerun?: (item: HistoryItem) => void;
}

export const ExecutionHistory: React.FC<ExecutionHistoryProps> = ({ onClose, onRerun }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        // localStorage'dan geçmişi yükle
        const saved = localStorage.getItem('omni_execution_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Geçmiş yüklenemedi');
            }
        } else {
            // Demo data
            setHistory([
                {
                    id: '1',
                    blueprintName: 'İçerik Fabrikası',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    status: 'success',
                    duration: 45,
                    nodeCount: 5,
                    outputs: {
                        'Trend Tarayıcı': 'Top 5 trend bulundu',
                        'İçerik Yazarı': '3 içerik üretildi',
                        'Görsel Önerici': '2 prompt oluşturuldu'
                    }
                },
                {
                    id: '2',
                    blueprintName: 'Kuaför Otomasyonu',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    status: 'success',
                    duration: 32,
                    nodeCount: 4,
                    outputs: {
                        'Analiz': 'Trendler analiz edildi',
                        'İçerik': 'Instagram postları oluşturuldu'
                    }
                }
            ]);
        }
    }, []);

    const clearHistory = () => {
        if (confirm('Tüm geçmiş silinecek. Emin misiniz?')) {
            localStorage.removeItem('omni_execution_history');
            setHistory([]);
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('tr-TR');
    };

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-4xl bg-[#0a0f1e] border border-slate-800 rounded-[2rem] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-black text-white">📜 Çalıştırma Geçmişi</h2>
                        <p className="text-xs text-slate-500">{history.length} çalıştırma kaydı</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearHistory}
                            className="px-3 py-1 bg-rose-600/20 text-rose-400 rounded-lg text-xs hover:bg-rose-600/30"
                        >
                            🗑️ Temizle
                        </button>
                        <button onClick={onClose} className="text-slate-500 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* List */}
                    <div className="w-1/2 border-r border-slate-800 overflow-y-auto">
                        {history.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p className="text-4xl mb-3">📭</p>
                                <p>Henüz çalıştırma geçmişi yok</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {history.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-slate-800/50 ${selectedItem?.id === item.id ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-white text-sm">{item.blueprintName}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    item.status === 'error' ? 'bg-rose-500/20 text-rose-400' :
                                                        'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {item.status === 'success' ? '✅' : item.status === 'error' ? '❌' : '⏳'} {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 text-[10px] text-slate-500">
                                            <span>📅 {formatDate(item.timestamp)}</span>
                                            <span>⏱️ {formatDuration(item.duration)}</span>
                                            <span>🔗 {item.nodeCount} node</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail */}
                    <div className="w-1/2 overflow-y-auto p-6">
                        {selectedItem ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-white">{selectedItem.blueprintName}</h3>
                                    {onRerun && (
                                        <Button
                                            onClick={() => onRerun(selectedItem)}
                                            className="bg-indigo-600 text-xs px-3 py-1"
                                        >
                                            🔄 Tekrar Çalıştır
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-800/50 rounded-xl p-3">
                                        <p className="text-[10px] text-slate-500 mb-1">Tarih</p>
                                        <p className="text-sm text-white">{formatDate(selectedItem.timestamp)}</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-xl p-3">
                                        <p className="text-[10px] text-slate-500 mb-1">Süre</p>
                                        <p className="text-sm text-white">{formatDuration(selectedItem.duration)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 mb-3">📋 Çıktılar</h4>
                                    <div className="space-y-2">
                                        {Object.entries(selectedItem.outputs).map(([node, output]) => (
                                            <div key={node} className="bg-[#020617] rounded-xl p-3 border border-slate-800">
                                                <p className="text-[10px] text-indigo-400 font-bold mb-1">{node}</p>
                                                <p className="text-xs text-slate-300">{output}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                <p className="text-sm">👈 Detay görmek için bir kayıt seçin</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-[#020617]">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">
                            💡 Geçmiş otomatik olarak kaydedilir
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

// Utility: Save execution to history
export const saveExecutionToHistory = (
    blueprintName: string,
    status: 'success' | 'error',
    duration: number,
    nodeCount: number,
    outputs: Record<string, string>
) => {
    const saved = localStorage.getItem('omni_execution_history');
    const history = saved ? JSON.parse(saved) : [];

    const newItem = {
        id: Date.now().toString(),
        blueprintName,
        timestamp: new Date().toISOString(),
        status,
        duration,
        nodeCount,
        outputs
    };

    history.unshift(newItem);
    localStorage.setItem('omni_execution_history', JSON.stringify(history.slice(0, 50)));

    return newItem;
};
