import React, { useState, useEffect } from 'react';
import { SystemBlueprint } from '../types';
import * as supabaseService from '../services/supabaseService';
import * as notificationService from '../services/notificationService';
import { NotificationConfig } from '../services/notificationService';

interface CloudSettingsProps {
    blueprints: SystemBlueprint[];
    onSyncComplete: (cloudBlueprints: SystemBlueprint[]) => void;
    onClose: () => void;
}

export const CloudSettings: React.FC<CloudSettingsProps> = ({
    blueprints,
    onSyncComplete,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<'sync' | 'notifications' | 'github'>('sync');
    const [isConnected, setIsConnected] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<string>('');

    // Notification config
    const [notifConfig, setNotifConfig] = useState<NotificationConfig>(() => {
        const saved = localStorage.getItem('omni_notification_config');
        return saved ? JSON.parse(saved) : {};
    });

    const [testResult, setTestResult] = useState<string>('');

    // Check Supabase connection on mount
    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        const connected = await supabaseService.checkConnection();
        setIsConnected(connected);
    };

    // Save notification config
    const saveNotifConfig = (updates: Partial<NotificationConfig>) => {
        const newConfig = { ...notifConfig, ...updates };
        setNotifConfig(newConfig);
        localStorage.setItem('omni_notification_config', JSON.stringify(newConfig));
    };

    // Sync to cloud
    const handleSyncToCloud = async () => {
        setIsSyncing(true);
        setSyncStatus('Buluta yükleniyor...');

        const result = await supabaseService.syncToCloud(blueprints);

        if (result.errors.length > 0) {
            setSyncStatus(`${result.synced} yüklendi, ${result.errors.length} hata`);
        } else {
            setSyncStatus(`✓ ${result.synced} blueprint buluta yüklendi!`);
        }

        setIsSyncing(false);
    };

    // Download from cloud
    const handleDownloadFromCloud = async () => {
        setIsSyncing(true);
        setSyncStatus('Buluttan indiriliyor...');

        const cloudBlueprints = await supabaseService.downloadFromCloud();

        if (cloudBlueprints.length > 0) {
            onSyncComplete(cloudBlueprints);
            setSyncStatus(`✓ ${cloudBlueprints.length} blueprint indirildi!`);
        } else {
            setSyncStatus('Bulutta blueprint bulunamadı.');
        }

        setIsSyncing(false);
    };

    // Test notification
    const handleTestNotification = async (channel: 'telegram' | 'discord' | 'slack') => {
        setTestResult('Gönderiliyor...');

        const testMessage = `🧪 Test Bildirimi\n\nOmniFlow bildirim testi başarılı!\nZaman: ${new Date().toLocaleString('tr-TR')}`;

        let result;

        if (channel === 'telegram' && notifConfig.telegram) {
            result = await notificationService.sendTelegram(
                notifConfig.telegram.botToken,
                notifConfig.telegram.chatId,
                testMessage
            );
        } else if (channel === 'discord' && notifConfig.discord) {
            result = await notificationService.sendDiscord(
                notifConfig.discord.webhookUrl,
                testMessage,
                '🧪 Test'
            );
        } else if (channel === 'slack' && notifConfig.slack) {
            result = await notificationService.sendSlack(
                notifConfig.slack.webhookUrl,
                testMessage
            );
        }

        if (result?.success) {
            setTestResult(`✓ ${channel} testi başarılı!`);
        } else {
            setTestResult(`✗ Hata: ${result?.error || 'Ayarları kontrol edin'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl bg-[#0a0f1e] rounded-3xl border border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-[#020617] border-b border-slate-800 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">☁️</span>
                        <h2 className="text-lg font-bold text-white">Cloud Ayarları</h2>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {isConnected ? 'Bağlı' : 'Bağlantı Yok'}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    {[
                        { id: 'sync', label: '🔄 Senkronizasyon', icon: '🔄' },
                        { id: 'notifications', label: '🔔 Bildirimler', icon: '🔔' },
                        { id: 'github', label: '🐙 GitHub Actions', icon: '🐙' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === tab.id
                                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* SYNC TAB */}
                    {activeTab === 'sync' && (
                        <div className="space-y-6">
                            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800">
                                <h3 className="text-sm font-bold text-white mb-4">📦 Blueprint Senkronizasyonu</h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 bg-[#0a0f1e] rounded-xl border border-slate-800">
                                        <p className="text-[10px] text-slate-500 uppercase mb-1">Yerel</p>
                                        <p className="text-2xl font-black text-white">{blueprints.length}</p>
                                        <p className="text-[10px] text-slate-500">Blueprint</p>
                                    </div>
                                    <div className="p-4 bg-[#0a0f1e] rounded-xl border border-slate-800">
                                        <p className="text-[10px] text-slate-500 uppercase mb-1">Durum</p>
                                        <p className="text-lg font-bold text-indigo-400">{isConnected ? 'Hazır' : 'Bağlantı Yok'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSyncToCloud}
                                        disabled={!isConnected || isSyncing}
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors"
                                    >
                                        {isSyncing ? '⏳ Yükleniyor...' : '⬆️ Buluta Yükle'}
                                    </button>
                                    <button
                                        onClick={handleDownloadFromCloud}
                                        disabled={!isConnected || isSyncing}
                                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors"
                                    >
                                        {isSyncing ? '⏳ İndiriliyor...' : '⬇️ Buluttan İndir'}
                                    </button>
                                </div>

                                {syncStatus && (
                                    <p className={`mt-4 text-sm text-center ${syncStatus.includes('✓') ? 'text-emerald-400' : 'text-amber-400'
                                        }`}>
                                        {syncStatus}
                                    </p>
                                )}
                            </div>

                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                                <p className="text-[11px] text-indigo-400">
                                    💡 <b>İpucu:</b> Buluta yüklediğiniz blueprint'ler GitHub Actions ile otomatik çalıştırılabilir.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            {/* Telegram */}
                            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">📱</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Telegram</h3>
                                        <p className="text-[10px] text-slate-500">Ücretsiz • En kolay kurulum</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Bot Token (örn: 123456:ABC...)"
                                        value={notifConfig.telegram?.botToken || ''}
                                        onChange={e => saveNotifConfig({
                                            telegram: { ...notifConfig.telegram, botToken: e.target.value, chatId: notifConfig.telegram?.chatId || '' }
                                        })}
                                        className="w-full bg-[#0a0f1e] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Chat ID (örn: -100123456789)"
                                        value={notifConfig.telegram?.chatId || ''}
                                        onChange={e => saveNotifConfig({
                                            telegram: { ...notifConfig.telegram, botToken: notifConfig.telegram?.botToken || '', chatId: e.target.value }
                                        })}
                                        className="w-full bg-[#0a0f1e] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                                    />
                                    <button
                                        onClick={() => handleTestNotification('telegram')}
                                        disabled={!notifConfig.telegram?.botToken || !notifConfig.telegram?.chatId}
                                        className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-500/30 disabled:opacity-50"
                                    >
                                        🧪 Test Et
                                    </button>
                                </div>

                                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-[10px] text-slate-400">
                                        <b>Nasıl kurulur:</b><br />
                                        1. Telegram'da @BotFather'a gidin<br />
                                        2. /newbot yazın, bot adı verin<br />
                                        3. Token'ı buraya yapıştırın<br />
                                        4. Botu bir gruba ekleyin veya mesaj atın<br />
                                        5. <a href="https://api.telegram.org/bot{TOKEN}/getUpdates" target="_blank" className="text-indigo-400">getUpdates</a> ile chat_id'yi bulun
                                    </p>
                                </div>
                            </div>

                            {/* Discord */}
                            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Discord</h3>
                                        <p className="text-[10px] text-slate-500">Ücretsiz Webhook</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Webhook URL"
                                        value={notifConfig.discord?.webhookUrl || ''}
                                        onChange={e => saveNotifConfig({ discord: { webhookUrl: e.target.value } })}
                                        className="w-full bg-[#0a0f1e] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                                    />
                                    <button
                                        onClick={() => handleTestNotification('discord')}
                                        disabled={!notifConfig.discord?.webhookUrl}
                                        className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold hover:bg-purple-500/30 disabled:opacity-50"
                                    >
                                        🧪 Test Et
                                    </button>
                                </div>
                            </div>

                            {/* Slack */}
                            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">📢</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">Slack</h3>
                                        <p className="text-[10px] text-slate-500">Ücretsiz Webhook</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Webhook URL"
                                        value={notifConfig.slack?.webhookUrl || ''}
                                        onChange={e => saveNotifConfig({ slack: { webhookUrl: e.target.value } })}
                                        className="w-full bg-[#0a0f1e] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                                    />
                                    <button
                                        onClick={() => handleTestNotification('slack')}
                                        disabled={!notifConfig.slack?.webhookUrl}
                                        className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-500/30 disabled:opacity-50"
                                    >
                                        🧪 Test Et
                                    </button>
                                </div>
                            </div>

                            {testResult && (
                                <div className={`p-4 rounded-xl text-center text-sm font-bold ${testResult.includes('✓') ? 'bg-emerald-500/20 text-emerald-400' :
                                        testResult.includes('✗') ? 'bg-rose-500/20 text-rose-400' :
                                            'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {testResult}
                                </div>
                            )}
                        </div>
                    )}

                    {/* GITHUB TAB */}
                    {activeTab === 'github' && (
                        <div className="space-y-6">
                            <div className="bg-[#020617] p-6 rounded-2xl border border-slate-800">
                                <h3 className="text-sm font-bold text-white mb-4">🐙 GitHub Actions ile Otomatik Çalıştırma</h3>

                                <p className="text-sm text-slate-400 mb-6">
                                    Aşağıdaki workflow dosyasını GitHub'a yükleyerek otomasyonlarınızı zamanlı çalıştırabilirsiniz.
                                </p>

                                <pre className="bg-black p-4 rounded-xl overflow-x-auto text-[11px] text-green-400 font-mono">
                                    {`name: 🤖 OmniFlow Automation Runner

on:
  schedule:
    - cron: '0 */6 * * *'  # Her 6 saatte bir
  workflow_dispatch:  # Manuel tetikleme

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - name: Run Automations
        run: |
          curl -X POST \\
            -H "Content-Type: application/json" \\
            -H "Authorization: Bearer \${{ secrets.SUPABASE_KEY }}" \\
            "\${{ secrets.SUPABASE_URL }}/rest/v1/rpc/run_automations"
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: \${{ secrets.SUPABASE_KEY }}`}
                                </pre>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`name: 🤖 OmniFlow Automation Runner

on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Run
        run: python runner.py
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: \${{ secrets.SUPABASE_KEY }}
          TELEGRAM_BOT_TOKEN: \${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: \${{ secrets.TELEGRAM_CHAT_ID }}`);
                                            alert('Kopyalandı!');
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                                    >
                                        📋 Workflow'u Kopyala
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <p className="text-[11px] text-amber-400">
                                    ⚠️ <b>Gerekli Secrets:</b><br />
                                    GitHub repo ayarlarına gidin → Settings → Secrets → Actions<br />
                                    • SUPABASE_URL<br />
                                    • SUPABASE_KEY<br />
                                    • TELEGRAM_BOT_TOKEN (opsiyonel)<br />
                                    • TELEGRAM_CHAT_ID (opsiyonel)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CloudSettings;
