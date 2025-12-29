import React, { useState, useEffect, useRef } from 'react';
import { SystemBlueprint, NodeType, StepStatus, WorkflowNode, MarketOpportunity, TestVariable } from './types';
import { Button } from './components/Button';
import { NodeCard } from './components/NodeCard';
import { Modal } from './components/Modal';
import { IntegrationHub } from './components/IntegrationHub';
import { CodeExportModal } from './components/CodeExportModal';
import { DeploymentPanel } from './components/DeploymentPanel';
import { TemplateMarketplace } from './components/TemplateMarketplace';
import { AgentMonitorDashboard } from './components/AgentMonitorDashboard';
import { CloudSettings } from './components/CloudSettings';
import { ImageGenerator } from './components/ImageGenerator';
import { architectSystem, runAgentNode, getMarketOpportunities, autoFillField, generateDiscoveryQuestions } from './services/huggingfaceNativeService';
import { callHuggingFaceModel, buildHFPrompt, selectBestModel } from './services/huggingfaceService';
import { agentQueue, AgentTask } from './services/agentQueueService';

const App: React.FC = () => {
  // --- STATES ---
  const [blueprints, setBlueprints] = useState<SystemBlueprint[]>([]);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [activeView, setActiveView] = useState<'factory' | 'insights' | 'studio' | 'vault' | 'sandbox' | 'deploy' | 'monitor'>('factory');

  // Modal states for new features
  const [showIntegrationHub, setShowIntegrationHub] = useState(false);
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [showDeployPanel, setShowDeployPanel] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false); // Template Marketplace
  const [showAgentMonitor, setShowAgentMonitor] = useState(false); // Agent Health Monitor
  const [showCloudSettings, setShowCloudSettings] = useState(false); // Cloud Settings
  const [showImageGenerator, setShowImageGenerator] = useState(false); // Image Generator
  const [selectedBlueprint, setSelectedBlueprint] = useState<SystemBlueprint | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // RADAR tarama durumu
  const [modalType, setModalType] = useState<'name_project' | 'none'>('none');
  const [testInput, setTestInput] = useState("");
  const [finalOutput, setFinalOutput] = useState("");

  const [goal, setGoal] = useState("");
  const [discoveryQuestions, setDiscoveryQuestions] = useState<{ q: string, a: string, loading: boolean }[]>([]);
  const [showDiscovery, setShowDiscovery] = useState(false);

  const [executionState, setExecutionState] = useState<{
    history: { nodeId: string, output: string }[],
    currentNodeId: string | null
  }>({ history: [], currentNodeId: null });

  const terminalRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    const saved = localStorage.getItem('omni_blueprints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBlueprints(parsed);
        if (parsed.length > 0) setSelectedBlueprint(parsed[0]);
      } catch (e) { console.error("Kayıtlı veriler okunamadı."); }
    }
    handleRefreshOpportunities();
  }, []);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = 0;
  }, [logs]);

  // --- LOGIC: UTILS ---
  const addLog = (msg: string, type: 'info' | 'error' | 'success' | 'warn' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const symbols = { info: 'ℹ', error: '✖', success: '✔', warn: '⚠' };
    setLogs(prev => [`[${timestamp}] ${symbols[type]} ${msg}`, ...prev].slice(0, 100));
  };

  const saveToLocal = (updatedBlueprints: SystemBlueprint[]) => {
    localStorage.setItem('omni_blueprints', JSON.stringify(updatedBlueprints));
  };

  // --- LOGIC: PROJECT MANAGEMENT ---
  const handleRefreshOpportunities = async () => {
    setIsScanning(true);
    addLog("🔍 RADAR: Fırsat taraması başlatıldı...", "info");
    try {
      const opps = await getMarketOpportunities();
      setOpportunities(opps);
      if (opps.length > 0) {
        addLog(`✅ ${opps.length} yeni fırsat bulundu!`, "success");
      } else {
        addLog("⚠️ Fırsat bulunamadı.", "warn");
      }
    } catch (e: any) {
      // Fallback opportunities'i göster (getMarketOpportunities fallback içinde handle ediyor)
      addLog(`⚠️ API bağlantı sorunu var, önerilen fırsatlar gösteriliyor...`, "warn");
      const fallbackOpps = await getMarketOpportunities(); // Bu fallback döner
      setOpportunities(fallbackOpps);
    } finally {
      setIsScanning(false);
    }
  };

  const startAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setIsAnalyzing(true);
    addLog(`ANALİZ: "${goal}" hedefine göre modelleme yapılıyor...`, "info");
    try {
      const questions = await generateDiscoveryQuestions(goal);
      setDiscoveryQuestions(questions.map((q: string) => ({ q, a: "", loading: false })));
      setShowDiscovery(true);
      addLog("Keşif soruları hazırlandı.", "success");
    } catch (e) {
      addLog("Analiz hatası.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalizeArchitecture = async (name: string) => {
    setModalType('none');
    setIsArchitecting(true);
    addLog(`MİMARİ: "${name}" sistemi inşa ediliyor...`, "info");
    const contextStr = discoveryQuestions.map(d => `${d.q}: ${d.a}`).join("\n");
    try {
      const systemDescription = `${goal}\n\nBağlam:\n${contextStr}`;
      const result = await architectSystem(systemDescription);
      
      const newBp: SystemBlueprint = {
        id: crypto.randomUUID(),
        name,
        description: goal,
        masterGoal: goal,
        nodes: [
          { id: '1', type: NodeType.AGENT_PLANNER, title: 'Sistem Analizi', role: 'AI', task: result.substring(0, 200), status: StepStatus.IDLE, connections: [] }
        ],
        baseKnowledge: result,
        category: "Autonomous",
        version: 1,
        testConfig: { variables: [], simulateFailures: false }
      };
      const updated = [newBp, ...blueprints];
      setBlueprints(updated);
      saveToLocal(updated);
      setSelectedBlueprint(newBp);
      setShowDiscovery(false);
      setActiveView('studio');
      addLog("Sistem fabrikaya başarıyla yüklendi.", "success");
    } catch (e: any) {
      addLog(`Mimari inşası başarısız: ${e?.message || 'Bilinmeyen hata'}`, "error");
    } finally {
      setIsArchitecting(false);
    }
  };

  // --- CLEAR WORKSPACE ---
  const clearWorkspace = () => {
    setSelectedBlueprint(null);
    setGoal('');
    setDiscoveryQuestions([]);
    setShowDiscovery(false);
    setLogs([]);
    addLog("🧹 Çalışma alanı temizlendi. Yeni otomasyon oluşturabilirsiniz.", "success");
  };

  // --- SANDBOX LOGIC ---
  const updateTestVariable = (idx: number, updates: Partial<TestVariable>) => {
    if (!selectedBlueprint) return;
    const currentVars = selectedBlueprint.testConfig?.variables || [];
    const newVars = [...currentVars];
    newVars[idx] = { ...newVars[idx], ...updates };
    const updatedBp = { ...selectedBlueprint, testConfig: { ...selectedBlueprint.testConfig!, variables: newVars } };
    setSelectedBlueprint(updatedBp);
    saveToLocal(blueprints.map(b => b.id === updatedBp.id ? updatedBp : b));
  };

  const addTestVariable = () => {
    if (!selectedBlueprint) return;
    const currentVars = selectedBlueprint.testConfig?.variables || [];
    const newVars = [...currentVars, { key: "ENV_KEY", value: "test_value" }];
    const updatedBp = { ...selectedBlueprint, testConfig: { ...selectedBlueprint.testConfig!, variables: newVars } };
    setSelectedBlueprint(updatedBp);
    saveToLocal(blueprints.map(b => b.id === updatedBp.id ? updatedBp : b));
  };

  // --- LOGIC: NODE MANAGEMENT ---
  const handleUpdateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    if (!selectedBlueprint) return;
    const updatedNodes = selectedBlueprint.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n);
    const updatedBp = { ...selectedBlueprint, nodes: updatedNodes };
    setSelectedBlueprint(updatedBp);
    const updatedBps = blueprints.map(b => b.id === selectedBlueprint.id ? updatedBp : b);
    setBlueprints(updatedBps);
    saveToLocal(updatedBps);
  };

  // --- EXECUTION WITH HUGGINGFACE & QUEUE ---
  const runGraphNode = async (node: WorkflowNode, blueprint: SystemBlueprint, history: { nodeId: string, output: string }[]): Promise<string> => {
    try {
      // Test context'i enjekte et
      const testContext = (blueprint.testConfig?.variables || [])
        .map(v => `${v.key}=${v.value}`).join("; ");

      // HuggingFace prompt'ını oluştur
      const prompt = buildHFPrompt(
        node.role || 'AI Assistant',
        node.task || 'Complete the task',
        blueprint.baseKnowledge + "\nTEST_ENV: " + testContext,
        history.length > 0 ? history[history.length - 1].output : 'Start'
      );

      // En uygun modeli seç
      const model = selectBestModel(node.type?.toString() || 'default');

      // HuggingFace API'yi çağır (3 kez retry ile)
      const hfResult = await callHuggingFaceModel({
        task: prompt,
        model,
        timeout: 300000, // 5 dakika
      });

      if (!hfResult.success) {
        throw new Error(hfResult.error || 'HF API failed');
      }

      return hfResult.output || 'No output';

    } catch (error) {
      console.error(`Node execution failed:`, error);
      throw error;
    }
  };

  const runGraph = async (startNodeId: string, currentHistory: { nodeId: string, output: string }[]) => {
    if (!selectedBlueprint) return;
    setIsRunning(true);
    let nodes: WorkflowNode[] = [...selectedBlueprint.nodes];
    let currentNodeId: string | null = startNodeId;
    let history = [...currentHistory];

    while (currentNodeId) {
      const currentIdx = nodes.findIndex(n => n.id === currentNodeId);
      if (currentIdx === -1) break;
      const node = nodes[currentIdx];

      if (node.status === StepStatus.SUCCESS) {
        currentNodeId = node.connections[0]?.targetId || null;
        continue;
      }

      nodes[currentIdx].status = StepStatus.RUNNING;
      setSelectedBlueprint({ ...selectedBlueprint, nodes: [...nodes] });
      addLog(`🚀 Node çalışıyor: ${node.title}`);

      try {
        // Mock failure if enabled in sandbox
        if (selectedBlueprint.testConfig?.simulateFailures && Math.random() > 0.7) {
          throw new Error("Simulated Failure");
        }

        // ✅ HuggingFace ile node'u çalıştır
        const result = await runGraphNode(node, selectedBlueprint, history);
        
        nodes[currentIdx].status = StepStatus.SUCCESS;
        nodes[currentIdx].outputData = result;
        history = [...history, { nodeId: node.id, output: result }];
        setSelectedBlueprint({ ...selectedBlueprint, nodes: [...nodes] });
        addLog(`✅ ${node.title} tamamlandı`);

        // Sonraki node'u belirle
        let nextNodeId: string | null = null;
        if (node.type === NodeType.LOGIC_GATE) {
          const match = node.connections.find(c => result.includes(c.targetId));
          nextNodeId = match ? match.targetId : (node.connections[0]?.targetId || null);
        } else {
          nextNodeId = node.connections[0]?.targetId || null;
        }
        currentNodeId = nextNodeId;
        setExecutionState({ history, currentNodeId });

      } catch (e) {
        nodes[currentIdx].status = StepStatus.REJECTED;
        addLog(`❌ HATA: ${node.title} başarısız - ${String(e).substring(0, 100)}`, "error");
        setSelectedBlueprint({ ...selectedBlueprint, nodes: [...nodes] });
        break;
      }
    }
    setFinalOutput(history[history.length - 1]?.output || "İşlem tamam.");
    setIsRunning(false);
    addLog("✅ TEST PROSESİ BİTTİ!", "success");
  };

  const startExecution = () => {
    if (!selectedBlueprint || !selectedBlueprint.nodes.length) return;
    const resetNodes: WorkflowNode[] = selectedBlueprint.nodes.map(n => ({ ...n, status: StepStatus.IDLE, outputData: undefined }));
    setSelectedBlueprint({ ...selectedBlueprint, nodes: resetNodes });
    const initialHistory = [{ nodeId: 'start', output: testInput || "Sistem Tetiklendi" }];
    setExecutionState({ history: initialHistory, currentNodeId: resetNodes[0].id });
    runGraph(resetNodes[0].id, initialHistory);
  };

  // --- Template Selection Handler ---
  const handleSelectTemplate = (blueprint: SystemBlueprint) => {
    const newBlueprints = [blueprint, ...blueprints];
    setBlueprints(newBlueprints);
    saveToLocal(newBlueprints);
    setSelectedBlueprint(blueprint);
    setActiveView('studio');
    addLog(`📦 "${blueprint.name}" şablonu yüklendi!`, 'success');
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Modal isOpen={modalType === 'name_project'} title="FABRİKA ADI" placeholder="Örn: Ali Kuaför WP Asistanı" onConfirm={finalizeArchitecture} onClose={() => setModalType('none')} />

      {/* New Feature Modals */}
      {showIntegrationHub && <IntegrationHub blueprint={selectedBlueprint} onClose={() => setShowIntegrationHub(false)} />}
      {showCodeExport && <CodeExportModal blueprint={selectedBlueprint} onClose={() => setShowCodeExport(false)} />}
      {showDeployPanel && <DeploymentPanel blueprint={selectedBlueprint} onClose={() => setShowDeployPanel(false)} />}
      {showTemplates && <TemplateMarketplace onSelectTemplate={handleSelectTemplate} onClose={() => setShowTemplates(false)} />}
      {showAgentMonitor && (
        <AgentMonitorDashboard
          blueprint={selectedBlueprint}
          onClose={() => setShowAgentMonitor(false)}
          onUpdateBlueprint={(updatedBp) => {
            setSelectedBlueprint(updatedBp);
            const updatedBps = blueprints.map(b => b.id === updatedBp.id ? updatedBp : b);
            setBlueprints(updatedBps);
            saveToLocal(updatedBps);
            addLog('🔧 Ajan durumu güncellendi', 'success');
          }}
        />
      )}
      {showCloudSettings && (
        <CloudSettings
          blueprints={blueprints}
          onSyncComplete={(cloudBlueprints) => {
            // Merge cloud blueprints with local
            const merged = [...cloudBlueprints];
            blueprints.forEach(local => {
              if (!merged.find(c => c.id === local.id)) {
                merged.push(local);
              }
            });
            setBlueprints(merged);
            saveToLocal(merged);
            addLog(`☁️ ${cloudBlueprints.length} blueprint buluttan senkronize edildi`, 'success');
          }}
          onClose={() => setShowCloudSettings(false)}
        />
      )}
      {showImageGenerator && (
        <ImageGenerator
          onImageGenerated={(imageUrl, prompt) => {
            addLog(`🎨 Görsel üretildi: ${prompt.substring(0, 30)}...`, 'success');
          }}
          onClose={() => setShowImageGenerator(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <nav className="w-20 bg-[#0a0f1e] border-r border-slate-800 flex flex-col items-center py-6 gap-4 z-50 overflow-y-auto">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-600/20" onClick={() => setActiveView('factory')}><svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
        <NavItem active={activeView === 'insights'} icon="💎" onClick={() => setActiveView('insights')} title="RADAR" />
        <NavItem active={activeView === 'factory'} icon="🏗️" onClick={() => setActiveView('factory')} title="MİMAR" />
        <NavItem active={activeView === 'studio'} icon="⚙️" onClick={() => setActiveView('studio')} title="STÜDYO" />
        <NavItem active={activeView === 'sandbox'} icon="🧪" onClick={() => setActiveView('sandbox')} title="TEST" />
        <NavItem active={activeView === 'deploy'} icon="🚀" onClick={() => setActiveView('deploy')} title="DEPLOY" />
        <NavItem active={activeView === 'monitor'} icon="🩺" onClick={() => setActiveView('monitor')} title="MONİTÖR" />
        <NavItem active={false} icon="☁️" onClick={() => setShowCloudSettings(true)} title="CLOUD" />
        <NavItem active={false} icon="🎨" onClick={() => setShowImageGenerator(true)} title="GÖRSEL" />
        <NavItem active={false} icon="🧹" onClick={clearWorkspace} title="TEMİZLE" />
        <NavItem active={activeView === 'vault'} icon="📂" onClick={() => setActiveView('vault')} title="KASA" />
      </nav>

      {/* LEFT PANEL */}
      <aside className="w-[420px] bg-[#0a0f1e] border-r border-slate-800 flex flex-col shadow-2xl relative overflow-hidden">
        {activeView === 'sandbox' && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 animate-pulse z-10"></div>
        )}

        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-10">
          {activeView === 'sandbox' && selectedBlueprint && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">TEST LAB</h2>
                <span className="text-[8px] bg-amber-500 text-black px-2 py-1 rounded font-black">SANDBOX MODE</span>
              </div>

              <div className="space-y-6">
                <div className="bg-[#020617] p-5 rounded-3xl border border-slate-800">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">MOCK DEĞİŞKENLER (ENV)</h4>
                  <div className="space-y-3">
                    {(selectedBlueprint.testConfig?.variables || []).map((v, i) => (
                      <div key={i} className="flex gap-2">
                        <input className="flex-1 bg-[#0a0f1e] border border-slate-800 rounded-lg p-2 text-[10px] text-white" value={v.key} onChange={e => updateTestVariable(i, { key: e.target.value })} placeholder="KEY" />
                        <input className="flex-1 bg-[#0a0f1e] border border-slate-800 rounded-lg p-2 text-[10px] text-white" value={v.value} onChange={e => updateTestVariable(i, { value: e.target.value })} placeholder="VALUE" />
                      </div>
                    ))}
                    <button onClick={addTestVariable} className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-[9px] text-slate-500 uppercase hover:border-indigo-500 transition-colors">+ YENİ TEST DEĞİŞKENİ</button>
                  </div>
                </div>

                <div className="bg-[#020617] p-5 rounded-3xl border border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">HATA SİMÜLASYONU</span>
                  <button onClick={() => {
                    const updated = { ...selectedBlueprint, testConfig: { ...selectedBlueprint.testConfig!, simulateFailures: !selectedBlueprint.testConfig?.simulateFailures } };
                    setSelectedBlueprint(updated);
                    saveToLocal(blueprints.map(b => b.id === updated.id ? updated : b));
                  }} className={`w-10 h-5 rounded-full transition-colors relative ${selectedBlueprint.testConfig?.simulateFailures ? 'bg-rose-500' : 'bg-slate-800'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${selectedBlueprint.testConfig?.simulateFailures ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                  <p className="text-[9px] text-amber-500 leading-tight">
                    <b>NOT:</b> Bu alanda yapacağınız testler gerçek API'ları etkilemez (Mock modundadır). Kodunuzdaki n8n veya GitHub bağlantılarını burada sanal olarak simüle edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'factory' && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">FABRİKA MİMARI</h2>
              {!showDiscovery ? (
                <div className="space-y-6">
                  {/* Template Marketplace Button */}
                  <button
                    onClick={() => setShowTemplates(true)}
                    className="w-full p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl hover:border-indigo-500 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">Template Marketplace</p>
                          <p className="text-[10px] text-slate-400">6 hazır otomasyon şablonu</p>
                        </div>
                      </div>
                      <span className="text-indigo-400 text-xs">KEŞFET →</span>
                    </div>
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-slate-800"></div>
                    <span className="text-[9px] text-slate-600 uppercase">veya kendi sistemini oluştur</span>
                    <div className="flex-1 border-t border-slate-800"></div>
                  </div>

                  <form onSubmit={startAnalysis} className="space-y-5">
                    <textarea className="w-full bg-[#020617] border border-slate-800 rounded-[2rem] p-6 text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Hangi otonom sistemi kurmak istersin?" rows={4} value={goal} onChange={e => setGoal(e.target.value)} required />
                    <Button type="submit" className="w-full h-14 bg-indigo-600 font-black rounded-2xl" isLoading={isAnalyzing}>ANALİZ VE KEŞİF</Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  <div className="bg-[#020617] p-6 rounded-[2.5rem] border border-slate-800 space-y-6">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest text-center">İŞLETMEYE ÖZEL VERİLER</h4>
                    {discoveryQuestions.map((dq, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-[8px] font-black text-slate-500 uppercase">{dq.q}</label>
                        <textarea className="w-full bg-[#0a0f1e] border border-slate-800 rounded-xl p-3 text-[11px] text-white outline-none h-20 resize-none" value={dq.a} onChange={e => setDiscoveryQuestions(prev => prev.map((it, i) => i === idx ? { ...it, a: e.target.value } : it))} />
                      </div>
                    ))}
                    <Button onClick={() => setModalType('name_project')} className="w-full h-14 bg-indigo-600 font-black uppercase text-xs rounded-2xl" isLoading={isArchitecting}>SİSTEMİ OLUŞTUR</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'vault' && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">SİSTEM KASASI</h2>
              <div className="space-y-4">
                {blueprints.map(bp => (
                  <div key={bp.id} className={`p-5 rounded-3xl border transition-all cursor-pointer ${selectedBlueprint?.id === bp.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-[#020617] border-slate-800 hover:border-slate-600'}`} onClick={() => setSelectedBlueprint(bp)}>
                    <h3 className="font-bold text-white text-sm">{bp.name}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{bp.masterGoal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RADAR/INSIGHTS VIEW */}
          {activeView === 'insights' && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">💎 RADAR</h2>
                <button
                  onClick={handleRefreshOpportunities}
                  disabled={isScanning}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isScanning
                    ? 'bg-indigo-500/30 text-indigo-300 cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  {isScanning ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      TARANIYOR...
                    </span>
                  ) : '🔍 YENİDEN TARA'}
                </button>
              </div>

              {isScanning && (
                <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl animate-pulse">
                  <p className="text-sm text-indigo-400 text-center">
                    🔍 AI ile pazar fırsatları taranıyor...
                  </p>
                </div>
              )}

              {opportunities.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.map((opp, idx) => (
                    <div key={opp.id || idx} className="bg-[#020617] p-5 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white text-sm">{opp.solutionName}</h3>
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold">{opp.estimatedRevenue}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2"><b>Meslek:</b> {opp.profession}</p>
                      <p className="text-[10px] text-slate-400 mb-3">{opp.painPoint}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-600">Zorluk: {opp.difficulty}</span>
                        <button
                          onClick={() => {
                            setGoal(opp.solutionLogic);
                            setActiveView('factory');
                          }}
                          className="text-[9px] bg-indigo-600/30 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          BU FİKRİ KULLAN →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <span className="text-6xl mb-4 block opacity-30">💎</span>
                  <p className="text-sm text-slate-500 mb-4">Henüz fırsat taranmadı</p>
                  <button
                    onClick={handleRefreshOpportunities}
                    disabled={isScanning}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isScanning ? 'TARANIYOR...' : '🔍 FIRSATLARI TARA'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DEPLOY VIEW */}
          {activeView === 'deploy' && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">🚀 DEPLOY MERKEZİ</h2>

              {selectedBlueprint ? (
                <div className="space-y-6">
                  {/* Selected System Info */}
                  <div className="bg-[#020617] p-5 rounded-3xl border border-indigo-500/30">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">SEÇİLİ SİSTEM</span>
                    <h3 className="text-lg font-bold text-white mt-2">{selectedBlueprint.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{selectedBlueprint.nodes?.length || 0} workflow düğümü</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowIntegrationHub(true)}
                      className="w-full p-5 bg-[#020617] border border-slate-800 rounded-2xl hover:border-indigo-500 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">🔌</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-400">Entegrasyon Merkezi</h4>
                          <p className="text-[9px] text-slate-500">WhatsApp, Telegram, Discord, Webhook bağlantıları</p>
                        </div>
                        <span className="text-slate-600 group-hover:text-indigo-400">→</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowCodeExport(true)}
                      className="w-full p-5 bg-[#020617] border border-slate-800 rounded-2xl hover:border-emerald-500 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">📦</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400">Kod Export</h4>
                          <p className="text-[9px] text-slate-500">Python, Node.js, GitHub Action, Docker</p>
                        </div>
                        <span className="text-slate-600 group-hover:text-emerald-400">→</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowDeployPanel(true)}
                      className="w-full p-5 bg-[#020617] border border-slate-800 rounded-2xl hover:border-amber-500 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">☁️</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400">Canlıya Al</h4>
                          <p className="text-[9px] text-slate-500">Railway, Render, Vercel, Netlify deploy</p>
                        </div>
                        <span className="text-slate-600 group-hover:text-amber-400">→</span>
                      </div>
                    </button>
                  </div>

                  {/* Quick Info */}
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                    <p className="text-[9px] text-indigo-400">
                      💡 <b>İpucu:</b> Önce "Entegrasyon Merkezi"nden bot kodunu oluşturun, ardından "Canlıya Al" ile deploy edin.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  <span className="text-6xl mb-4 block">📁</span>
                  <p className="text-sm text-slate-500">Önce KASA'dan bir sistem seçin</p>
                </div>
              )}
            </div>
          )}

          {/* MONITOR VIEW */}
          {activeView === 'monitor' && (
            <div className="animate-in fade-in slide-in-from-left-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">🩺 AJAN MONİTÖRÜ</h2>

              {selectedBlueprint ? (
                <div className="space-y-6">
                  {/* Selected System Info */}
                  <div className="bg-[#020617] p-5 rounded-3xl border border-emerald-500/30">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">AKTİF SİSTEM</span>
                    <h3 className="text-lg font-bold text-white mt-2">{selectedBlueprint.name}</h3>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-bold">{selectedBlueprint.nodes?.length || 0} Ajan</span>
                      </div>
                      <span className="text-[9px] text-slate-600">|</span>
                      <span className="text-[10px] text-slate-500">Hazır</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800">
                      <p className="text-[9px] text-slate-500 uppercase">Toplam Ajan</p>
                      <p className="text-2xl font-black text-white">{selectedBlueprint.nodes?.length || 0}</p>
                    </div>
                    <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800">
                      <p className="text-[9px] text-slate-500 uppercase">Maksimum Kapasite</p>
                      <p className="text-2xl font-black text-indigo-400">40+</p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="bg-[#020617] p-5 rounded-3xl border border-slate-800 space-y-3">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">SİSTEM ÖZELLİKLERİ</h4>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                      <span className="text-slate-300">Heartbeat Monitoring (5sn)</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                      <span className="text-slate-300">Auto-Retry (3 deneme)</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                      <span className="text-slate-300">Circuit Breaker (5 hata)</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                      <span className="text-slate-300">Self-Healing Recovery</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span>
                      <span className="text-slate-300">30-40+ Ajan Ölçeklenebilirlik</span>
                    </div>
                  </div>

                  {/* Main Action Button */}
                  <button
                    onClick={() => setShowAgentMonitor(true)}
                    className="w-full p-5 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-500/30 rounded-2xl hover:border-emerald-500 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform">🩺</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-400">Canlı İzleme Paneli</h4>
                        <p className="text-[9px] text-slate-500">Gerçek zamanlı ajan durumu, health check, recovery</p>
                      </div>
                      <span className="text-slate-600 group-hover:text-emerald-400">→</span>
                    </div>
                  </button>

                  {/* Info */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-[9px] text-emerald-400">
                      💡 <b>Önemli:</b> Monitör panelinde "Başlat" butonuna tıklayarak gerçek zamanlı izlemeyi aktifleştirin. Hata veren ajanları manuel olarak kurtarabilirsiniz.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  <span className="text-6xl mb-4 block">🩺</span>
                  <p className="text-sm text-slate-500">Önce KASA'dan bir sistem seçin</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-48 bg-black/80 border-t border-slate-800 p-5 font-mono text-[9px]">
          <div className="text-indigo-500 font-black tracking-widest mb-2">FABRİKA_LOGS.EXE</div>
          <div ref={terminalRef} className="h-32 overflow-y-auto custom-scrollbar flex flex-col gap-1 text-slate-400">
            {logs.map((log, i) => <div key={i} className="opacity-70 border-l border-slate-800 pl-3">{log}</div>)}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-[#020617] flex flex-col overflow-hidden relative">
        <div className="h-24 border-b border-slate-800 bg-[#0a0f1e]/80 backdrop-blur-3xl flex items-center px-10 gap-8 z-40">
          <div className="flex-1 flex items-center gap-4">
            <input className="flex-1 bg-[#020617] border border-slate-800 rounded-full h-12 px-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder={activeView === 'sandbox' ? "TEST TETİKLEYİCİSİ: Buraya bir girdi yazın..." : "Sistemi tetikle..."} value={testInput} onChange={e => setTestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && startExecution()} />
            <button onClick={startExecution} disabled={isRunning || !selectedBlueprint} className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${isRunning ? 'bg-slate-800' : 'bg-indigo-600 shadow-lg shadow-indigo-600/30'}`}>
              {isRunning ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <span className="text-white">▶</span>}
            </button>
          </div>
          {finalOutput && (
            <div className="max-w-[300px] bg-emerald-500/10 border border-emerald-500/20 rounded-2xl h-12 px-4 flex items-center shadow-lg animate-in slide-in-from-right-4">
              <span className="text-[7px] font-black text-emerald-500 uppercase mr-3">SONUÇ:</span>
              <p className="text-[9px] font-medium text-slate-300 truncate italic">"{finalOutput}"</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
          <div className="max-w-2xl mx-auto space-y-12 pb-40 relative">
            {selectedBlueprint?.nodes?.length ? (
              <>
                <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-slate-800 -z-10"></div>
                {selectedBlueprint.nodes.map((node, idx) => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    index={idx}
                    allNodes={selectedBlueprint.nodes}
                    onUpdate={handleUpdateNode}
                    onDelete={(id) => { }}
                  />
                ))}
              </>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center opacity-20">
                <div className="text-[80px] mb-4">⚙️</div>
                <p className="text-sm font-black uppercase tracking-[0.5em]">MİMARİ BEKLENİYOR</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, icon, onClick, title }: { active: boolean, icon: string, onClick: () => void, title: string }) => (
  <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onClick}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 translate-x-1' : 'text-slate-600 hover:bg-slate-800 hover:text-slate-400'}`}>{icon}</div>
    <span className={`text-[6px] font-black uppercase tracking-widest transition-colors ${active ? 'text-indigo-500' : 'text-slate-700'}`}>{title}</span>
  </div>
);

export default App;
