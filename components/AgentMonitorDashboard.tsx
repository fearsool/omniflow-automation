import React, { useState, useEffect, useCallback } from 'react';
import {
    SystemBlueprint,
    WorkflowNode,
    StepStatus,
    AgentHealthState,
    AgentHealthStatus,
    RecoveryAction,
    AgentMetrics
} from '../types';
import { agentHealthService } from '../services/agentHealthService';

interface AgentMonitorDashboardProps {
    blueprint: SystemBlueprint | null;
    onClose: () => void;
    onUpdateBlueprint?: (blueprint: SystemBlueprint) => void; // Callback to update main app state
}

export const AgentMonitorDashboard: React.FC<AgentMonitorDashboardProps> = ({
    blueprint,
    onClose,
    onUpdateBlueprint
}) => {
    const [healthStates, setHealthStates] = useState<AgentHealthState[]>([]);
    const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
    const [recoveryHistory, setRecoveryHistory] = useState<RecoveryAction[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filter, setFilter] = useState<'all' | AgentHealthStatus>('all');

    // Convert StepStatus to AgentHealthStatus
    const stepStatusToHealthStatus = (status: StepStatus): AgentHealthStatus => {
        switch (status) {
            case StepStatus.SUCCESS: return AgentHealthStatus.HEALTHY;
            case StepStatus.RUNNING: return AgentHealthStatus.RECOVERING;
            case StepStatus.REJECTED: return AgentHealthStatus.CRITICAL;
            case StepStatus.REPAIRING: return AgentHealthStatus.RECOVERING;
            case StepStatus.WAITING_APPROVAL: return AgentHealthStatus.WARNING;
            case StepStatus.IDLE:
            default: return AgentHealthStatus.HEALTHY;
        }
    };

    // Sync health states with actual blueprint nodes
    const syncWithBlueprint = useCallback(() => {
        if (!blueprint?.nodes) return;

        const states: AgentHealthState[] = blueprint.nodes.map(node => {
            const healthStatus = stepStatusToHealthStatus(node.status);
            const existingState = healthStates.find(s => s.nodeId === node.id);

            return {
                nodeId: node.id,
                nodeName: node.title,
                status: healthStatus,
                lastHeartbeat: Date.now(),
                consecutiveFailures: node.status === StepStatus.REJECTED ? (existingState?.consecutiveFailures || 0) + 1 : 0,
                totalExecutions: (existingState?.totalExecutions || 0) + (node.status !== StepStatus.IDLE ? 1 : 0),
                successfulExecutions: (existingState?.successfulExecutions || 0) + (node.status === StepStatus.SUCCESS ? 1 : 0),
                successRate: node.status === StepStatus.REJECTED ? 0 : 100,
                averageResponseTime: Math.floor(Math.random() * 1000) + 200,
                lastResponseTime: Math.floor(Math.random() * 500) + 100,
                circuitBreakerOpen: node.status === StepStatus.REJECTED,
                circuitBreakerResetTime: node.status === StepStatus.REJECTED ? Date.now() + 30000 : null,
                recoveryAttempts: 0,
                maxRecoveryAttempts: 3,
                lastError: node.status === StepStatus.REJECTED ? 'İşlem başarısız oldu' : null,
                fallbackNodeId: null,
                queuedTasks: 0,
                memoryUsage: Math.random() * 30 + 10,
                cpuLoad: Math.random() * 40 + 5
            };
        });

        setHealthStates(states);
        updateMetricsFromStates(states);
    }, [blueprint]);

    // Update metrics based on current states
    const updateMetricsFromStates = (states: AgentHealthState[]) => {
        const total = states.length;
        if (total === 0) return;

        const healthy = states.filter(s => s.status === AgentHealthStatus.HEALTHY).length;
        const warning = states.filter(s => s.status === AgentHealthStatus.WARNING).length;
        const critical = states.filter(s => s.status === AgentHealthStatus.CRITICAL || s.status === AgentHealthStatus.CIRCUIT_OPEN).length;
        const offline = states.filter(s => s.status === AgentHealthStatus.OFFLINE).length;
        const recovering = states.filter(s => s.status === AgentHealthStatus.RECOVERING).length;

        const avgSuccessRate = states.reduce((acc, s) => acc + s.successRate, 0) / total;

        setMetrics({
            totalAgents: total,
            healthyAgents: healthy,
            warningAgents: warning,
            criticalAgents: critical,
            offlineAgents: offline,
            recoveringAgents: recovering,
            averageSuccessRate: avgSuccessRate,
            averageResponseTime: states.reduce((acc, s) => acc + s.averageResponseTime, 0) / total,
            totalExecutions: states.reduce((acc, s) => acc + s.totalExecutions, 0),
            totalRecoveries: recoveryHistory.length,
            successfulRecoveries: recoveryHistory.filter(r => r.success).length,
            uptime: ((total - offline) / total) * 100,
            lastUpdated: Date.now(),
            systemLoad: healthy / total > 0.8 ? 'low' : healthy / total > 0.5 ? 'medium' : 'high'
        });
    };

    // Initialize and sync on blueprint change
    useEffect(() => {
        syncWithBlueprint();
    }, [blueprint, syncWithBlueprint]);

    // Monitoring interval
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isMonitoring) {
            interval = setInterval(() => {
                syncWithBlueprint();
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isMonitoring, syncWithBlueprint]);

    const toggleMonitoring = () => {
        setIsMonitoring(!isMonitoring);
    };

    // RECOVER SINGLE AGENT - Actually resets the node status
    const handleRecoverAgent = async (nodeId: string) => {
        if (!blueprint || !onUpdateBlueprint) return;

        const state = healthStates.find(s => s.nodeId === nodeId);
        if (!state) return;

        // Create recovery action
        const action: RecoveryAction = {
            id: crypto.randomUUID(),
            type: 'manual',
            nodeId,
            nodeName: state.nodeName,
            timestamp: Date.now(),
            success: true,
            details: `${state.nodeName} manuel olarak kurtarıldı`,
            previousStatus: state.status,
            newStatus: AgentHealthStatus.HEALTHY,
            duration: 500
        };
        setRecoveryHistory(prev => [action, ...prev].slice(0, 50));

        // Update the actual blueprint node status
        const updatedNodes = blueprint.nodes.map(node =>
            node.id === nodeId
                ? { ...node, status: StepStatus.IDLE, outputData: undefined }
                : node
        );
        const updatedBlueprint = { ...blueprint, nodes: updatedNodes };
        onUpdateBlueprint(updatedBlueprint);

        // Update local health state
        setHealthStates(prev => prev.map(s =>
            s.nodeId === nodeId
                ? { ...s, status: AgentHealthStatus.HEALTHY, consecutiveFailures: 0, circuitBreakerOpen: false, lastError: null }
                : s
        ));
    };

    // RECOVER ALL CRITICAL AGENTS
    const handleRecoverAll = async () => {
        if (!blueprint || !onUpdateBlueprint) return;

        const criticalNodes = healthStates.filter(s =>
            s.status === AgentHealthStatus.CRITICAL ||
            s.status === AgentHealthStatus.CIRCUIT_OPEN ||
            s.status === AgentHealthStatus.OFFLINE
        );

        if (criticalNodes.length === 0) return;

        // Create recovery actions for all
        const actions: RecoveryAction[] = criticalNodes.map(state => ({
            id: crypto.randomUUID(),
            type: 'manual' as const,
            nodeId: state.nodeId,
            nodeName: state.nodeName,
            timestamp: Date.now(),
            success: true,
            details: `${state.nodeName} toplu kurtarma ile düzeltildi`,
            previousStatus: state.status,
            newStatus: AgentHealthStatus.HEALTHY,
            duration: 300
        }));
        setRecoveryHistory(prev => [...actions, ...prev].slice(0, 50));

        // Update all nodes to IDLE
        const updatedNodes = blueprint.nodes.map(node => ({
            ...node,
            status: StepStatus.IDLE,
            outputData: undefined
        }));
        const updatedBlueprint = { ...blueprint, nodes: updatedNodes };
        onUpdateBlueprint(updatedBlueprint);

        // Update local health states
        setHealthStates(prev => prev.map(s => ({
            ...s,
            status: AgentHealthStatus.HEALTHY,
            consecutiveFailures: 0,
            circuitBreakerOpen: false,
            lastError: null
        })));
    };

    // RESET ALL AGENTS
    const handleResetAll = () => {
        if (!blueprint || !onUpdateBlueprint) return;

        // Reset all nodes
        const updatedNodes = blueprint.nodes.map(node => ({
            ...node,
            status: StepStatus.IDLE,
            outputData: undefined
        }));
        const updatedBlueprint = { ...blueprint, nodes: updatedNodes };
        onUpdateBlueprint(updatedBlueprint);

        // Clear recovery history
        setRecoveryHistory([]);

        // Reset all health states
        setHealthStates(prev => prev.map(s => ({
            ...s,
            status: AgentHealthStatus.HEALTHY,
            consecutiveFailures: 0,
            totalExecutions: 0,
            successfulExecutions: 0,
            successRate: 100,
            circuitBreakerOpen: false,
            circuitBreakerResetTime: null,
            lastError: null,
            recoveryAttempts: 0
        })));
    };

    // Reset circuit breaker for single agent
    const handleResetCircuitBreaker = (nodeId: string) => {
        handleRecoverAgent(nodeId);
    };

    // Simulate failure for testing
    const simulateFailure = (nodeId: string) => {
        if (!blueprint || !onUpdateBlueprint) return;

        // Update the actual blueprint node to REJECTED
        const updatedNodes = blueprint.nodes.map(node =>
            node.id === nodeId
                ? { ...node, status: StepStatus.REJECTED }
                : node
        );
        const updatedBlueprint = { ...blueprint, nodes: updatedNodes };
        onUpdateBlueprint(updatedBlueprint);

        // Update local health state
        setHealthStates(prev => prev.map(s =>
            s.nodeId === nodeId
                ? {
                    ...s,
                    status: AgentHealthStatus.CRITICAL,
                    consecutiveFailures: s.consecutiveFailures + 3,
                    circuitBreakerOpen: true,
                    lastError: 'Simulated failure for testing',
                    successRate: 0
                }
                : s
        ));
    };

    const getStatusColor = (status: AgentHealthStatus): string => {
        switch (status) {
            case AgentHealthStatus.HEALTHY: return 'bg-emerald-500';
            case AgentHealthStatus.WARNING: return 'bg-amber-500';
            case AgentHealthStatus.CRITICAL: return 'bg-rose-500';
            case AgentHealthStatus.RECOVERING: return 'bg-blue-500';
            case AgentHealthStatus.CIRCUIT_OPEN: return 'bg-purple-500';
            case AgentHealthStatus.OFFLINE: return 'bg-slate-600';
            default: return 'bg-slate-500';
        }
    };

    const getStatusBgColor = (status: AgentHealthStatus): string => {
        switch (status) {
            case AgentHealthStatus.HEALTHY: return 'bg-emerald-500/10 border-emerald-500/30';
            case AgentHealthStatus.WARNING: return 'bg-amber-500/10 border-amber-500/30';
            case AgentHealthStatus.CRITICAL: return 'bg-rose-500/10 border-rose-500/30';
            case AgentHealthStatus.RECOVERING: return 'bg-blue-500/10 border-blue-500/30';
            case AgentHealthStatus.CIRCUIT_OPEN: return 'bg-purple-500/10 border-purple-500/30';
            case AgentHealthStatus.OFFLINE: return 'bg-slate-600/10 border-slate-600/30';
            default: return 'bg-slate-500/10 border-slate-500/30';
        }
    };

    const getStatusLabel = (status: AgentHealthStatus): string => {
        switch (status) {
            case AgentHealthStatus.HEALTHY: return 'Sağlıklı';
            case AgentHealthStatus.WARNING: return 'Uyarı';
            case AgentHealthStatus.CRITICAL: return 'Kritik';
            case AgentHealthStatus.RECOVERING: return 'Kurtarılıyor';
            case AgentHealthStatus.CIRCUIT_OPEN: return 'Devre Açık';
            case AgentHealthStatus.OFFLINE: return 'Çevrimdışı';
            default: return 'Bilinmiyor';
        }
    };

    const getSystemLoadColor = (load: string): string => {
        switch (load) {
            case 'low': return 'text-emerald-400';
            case 'medium': return 'text-amber-400';
            case 'high': return 'text-orange-400';
            case 'critical': return 'text-rose-400';
            default: return 'text-slate-400';
        }
    };

    const filteredStates = filter === 'all'
        ? healthStates
        : healthStates.filter(s => s.status === filter);

    if (!blueprint) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-6xl mb-4 block opacity-30">🩺</span>
                    <p className="text-slate-400 mb-6">Önce bir sistem seçin</p>
                    <button onClick={onClose} className="px-6 py-3 bg-slate-800 rounded-xl text-white hover:bg-slate-700">
                        Kapat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-20 bg-[#0a0f1e] border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                        <h1 className="text-xl font-black uppercase tracking-tight">Agent Health Monitor</h1>
                    </div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-bold">
                        {blueprint.name}
                    </span>
                    {!onUpdateBlueprint && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                            ⚠️ Salt okunur mod
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleMonitoring}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${isMonitoring
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                            }`}
                    >
                        {isMonitoring ? '⏸ Durdur' : '▶ Başlat'}
                    </button>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f46e5 #0a0f1e' }}>
                    {/* Metrics Overview */}
                    {metrics && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                            <MetricCard
                                label="Toplam Ajan"
                                value={metrics.totalAgents}
                                icon="🤖"
                                color="text-white"
                            />
                            <MetricCard
                                label="Sağlıklı"
                                value={metrics.healthyAgents}
                                icon="✅"
                                color="text-emerald-400"
                                percentage={metrics.totalAgents > 0 ? Math.round((metrics.healthyAgents / metrics.totalAgents) * 100) : 0}
                            />
                            <MetricCard
                                label="Uyarı"
                                value={metrics.warningAgents}
                                icon="⚠️"
                                color="text-amber-400"
                            />
                            <MetricCard
                                label="Kritik"
                                value={metrics.criticalAgents}
                                icon="🔴"
                                color="text-rose-400"
                            />
                            <MetricCard
                                label="Başarı Oranı"
                                value={`${Math.round(metrics.averageSuccessRate)}%`}
                                icon="📊"
                                color="text-blue-400"
                            />
                            <MetricCard
                                label="Sistem Yükü"
                                value={metrics.systemLoad.toUpperCase()}
                                icon="⚡"
                                color={getSystemLoadColor(metrics.systemLoad)}
                            />
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 bg-[#0a0f1e] rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                📊 Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                📋 Liste
                            </button>
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="bg-[#0a0f1e] border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none"
                        >
                            <option value="all">Tüm Ajanlar</option>
                            <option value={AgentHealthStatus.HEALTHY}>✅ Sağlıklı</option>
                            <option value={AgentHealthStatus.WARNING}>⚠️ Uyarı</option>
                            <option value={AgentHealthStatus.CRITICAL}>🔴 Kritik</option>
                            <option value={AgentHealthStatus.CIRCUIT_OPEN}>🔌 Devre Açık</option>
                            <option value={AgentHealthStatus.OFFLINE}>⚫ Çevrimdışı</option>
                        </select>

                        <div className="flex-1" />

                        <button
                            onClick={handleRecoverAll}
                            disabled={!onUpdateBlueprint}
                            className="px-4 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🔄 Tümünü Kurtar
                        </button>
                        <button
                            onClick={handleResetAll}
                            disabled={!onUpdateBlueprint}
                            className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ⟳ Sıfırla
                        </button>
                    </div>

                    {/* Agent Grid/List */}
                    <div className="pb-8">
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-max">
                                {filteredStates.map((state) => (
                                    <AgentCard
                                        key={state.nodeId}
                                        state={state}
                                        isSelected={selectedAgent === state.nodeId}
                                        onClick={() => setSelectedAgent(selectedAgent === state.nodeId ? null : state.nodeId)}
                                        onRecover={() => handleRecoverAgent(state.nodeId)}
                                        onResetCircuit={() => handleResetCircuitBreaker(state.nodeId)}
                                        onSimulateFailure={() => simulateFailure(state.nodeId)}
                                        canEdit={!!onUpdateBlueprint}
                                        getStatusColor={getStatusColor}
                                        getStatusBgColor={getStatusBgColor}
                                        getStatusLabel={getStatusLabel}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredStates.map((state) => (
                                    <AgentListItem
                                        key={state.nodeId}
                                        state={state}
                                        onRecover={() => handleRecoverAgent(state.nodeId)}
                                        onResetCircuit={() => handleResetCircuitBreaker(state.nodeId)}
                                        canEdit={!!onUpdateBlueprint}
                                        getStatusColor={getStatusColor}
                                        getStatusLabel={getStatusLabel}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Recovery Log */}
                <div className="w-80 bg-[#0a0f1e] border-l border-slate-800 flex flex-col shrink-0">
                    <div className="p-5 border-b border-slate-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            📜 Recovery Log
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                                {recoveryHistory.length}
                            </span>
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
                        {recoveryHistory.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <span className="text-4xl block mb-3">📋</span>
                                <p className="text-[10px] text-slate-500">Henüz recovery işlemi yok</p>
                            </div>
                        ) : (
                            recoveryHistory.map((action) => (
                                <RecoveryLogItem key={action.id} action={action} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const MetricCard: React.FC<{
    label: string;
    value: string | number;
    icon: string;
    color: string;
    percentage?: number;
}> = ({ label, value, icon, color, percentage }) => (
    <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-start justify-between mb-2">
            <span className="text-lg">{icon}</span>
            {percentage !== undefined && (
                <span className="text-[9px] text-slate-500">{percentage}%</span>
            )}
        </div>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
);

const AgentCard: React.FC<{
    state: AgentHealthState;
    isSelected: boolean;
    onClick: () => void;
    onRecover: () => void;
    onResetCircuit: () => void;
    onSimulateFailure: () => void;
    canEdit: boolean;
    getStatusColor: (status: AgentHealthStatus) => string;
    getStatusBgColor: (status: AgentHealthStatus) => string;
    getStatusLabel: (status: AgentHealthStatus) => string;
}> = ({ state, isSelected, onClick, onRecover, onResetCircuit, onSimulateFailure, canEdit, getStatusColor, getStatusBgColor, getStatusLabel }) => (
    <div
        className={`relative rounded-2xl border transition-all cursor-pointer min-h-[220px] ${getStatusBgColor(state.status)} ${isSelected ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''} hover:scale-[1.02] hover:shadow-lg`}
        onClick={onClick}
    >
        {/* Pulse indicator */}
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getStatusColor(state.status)} ${state.status === AgentHealthStatus.RECOVERING ? 'animate-ping' : 'animate-pulse'}`} />

        <div className="p-5">
            <h4 className="font-bold text-white text-base truncate pr-8">{state.nodeName}</h4>
            <p className="text-[10px] text-slate-500 mt-1 truncate">{state.nodeId.slice(0, 12)}...</p>

            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Durum</span>
                    <span className={`font-bold ${state.status === AgentHealthStatus.HEALTHY ? 'text-emerald-400' :
                        state.status === AgentHealthStatus.WARNING ? 'text-amber-400' :
                            state.status === AgentHealthStatus.CRITICAL ? 'text-rose-400' :
                                'text-slate-400'
                        }`}>{getStatusLabel(state.status)}</span>
                </div>

                <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Başarı</span>
                    <span className="text-white font-bold">{state.successRate}%</span>
                </div>

                <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Hata</span>
                    <span className={`font-bold ${state.consecutiveFailures > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {state.consecutiveFailures}
                    </span>
                </div>

                {/* Progress bars */}
                <div className="space-y-1 mt-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] text-slate-600 w-8">CPU</span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${state.cpuLoad > 80 ? 'bg-rose-500' : state.cpuLoad > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${state.cpuLoad}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] text-slate-600 w-8">RAM</span>
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${state.memoryUsage > 85 ? 'bg-rose-500' : state.memoryUsage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${state.memoryUsage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions when selected */}
            {isSelected && canEdit && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-2" onClick={(e) => e.stopPropagation()}>
                    {(state.status === AgentHealthStatus.CRITICAL || state.status === AgentHealthStatus.OFFLINE || state.status === AgentHealthStatus.CIRCUIT_OPEN) && (
                        <button
                            onClick={onRecover}
                            className="w-full py-2.5 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-500/30 transition-colors"
                        >
                            🔧 Kurtar
                        </button>
                    )}
                    {state.circuitBreakerOpen && (
                        <button
                            onClick={onResetCircuit}
                            className="w-full py-2.5 bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-bold hover:bg-purple-500/30 transition-colors"
                        >
                            ⚡ Circuit Reset
                        </button>
                    )}
                    <button
                        onClick={onSimulateFailure}
                        className="w-full py-2.5 bg-rose-500/10 text-rose-400 rounded-lg text-[10px] font-bold hover:bg-rose-500/20 transition-colors"
                    >
                        💥 Hata Simüle Et
                    </button>
                </div>
            )}
        </div>
    </div>
);

const AgentListItem: React.FC<{
    state: AgentHealthState;
    onRecover: () => void;
    onResetCircuit: () => void;
    canEdit: boolean;
    getStatusColor: (status: AgentHealthStatus) => string;
    getStatusLabel: (status: AgentHealthStatus) => string;
}> = ({ state, onRecover, onResetCircuit, canEdit, getStatusColor, getStatusLabel }) => (
    <div className="bg-[#0a0f1e] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(state.status)} animate-pulse`} />

        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm truncate">{state.nodeName}</h4>
            <p className="text-[9px] text-slate-500">{getStatusLabel(state.status)}</p>
        </div>

        <div className="flex items-center gap-6 text-[10px]">
            <div className="text-center">
                <p className="text-slate-500">Başarı</p>
                <p className="font-bold text-white">{state.successRate}%</p>
            </div>
            <div className="text-center">
                <p className="text-slate-500">Yanıt</p>
                <p className="font-bold text-white">{state.averageResponseTime}ms</p>
            </div>
            <div className="text-center">
                <p className="text-slate-500">Hata</p>
                <p className={`font-bold ${state.consecutiveFailures > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {state.consecutiveFailures}
                </p>
            </div>
        </div>

        {canEdit && (
            <div className="flex gap-2">
                {(state.status === AgentHealthStatus.CRITICAL || state.status === AgentHealthStatus.OFFLINE || state.status === AgentHealthStatus.CIRCUIT_OPEN) && (
                    <button
                        onClick={onRecover}
                        className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-[9px] font-bold hover:bg-blue-500/30"
                    >
                        Kurtar
                    </button>
                )}
                {state.circuitBreakerOpen && (
                    <button
                        onClick={onResetCircuit}
                        className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-[9px] font-bold hover:bg-purple-500/30"
                    >
                        Reset
                    </button>
                )}
            </div>
        )}
    </div>
);

const RecoveryLogItem: React.FC<{ action: RecoveryAction }> = ({ action }) => (
    <div className={`p-3 rounded-xl border ${action.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
        <div className="flex items-start justify-between mb-1">
            <span className={`text-[10px] font-bold ${action.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {action.success ? '✓' : '✗'} {action.type.toUpperCase()}
            </span>
            <span className="text-[8px] text-slate-600">
                {new Date(action.timestamp).toLocaleTimeString()}
            </span>
        </div>
        <p className="text-[10px] text-white font-medium">{action.nodeName}</p>
        <p className="text-[9px] text-slate-500 mt-1">{action.details}</p>
    </div>
);

export default AgentMonitorDashboard;
