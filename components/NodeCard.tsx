
import React, { useState } from 'react';
import { WorkflowNode, NodeType, StepStatus } from '../types';
import { Button } from './Button';

interface NodeCardProps {
  node: WorkflowNode;
  index: number;
  allNodes?: WorkflowNode[];
  onApprove?: () => void;
  onUpdate: (id: string, updates: Partial<WorkflowNode>) => void;
  onDelete: (id: string) => void;
}

const typeIcons: Record<string, string> = {
  [NodeType.AGENT_PLANNER]: "🧠",
  [NodeType.RESEARCH_WEB]: "🔎",
  [NodeType.CONTENT_CREATOR]: "📝",
  [NodeType.MEDIA_ENGINEER]: "🖼️",
  [NodeType.VIDEO_ARCHITECT]: "🎬",
  [NodeType.TRADING_DESK]: "📈",
  [NodeType.SOCIAL_MANAGER]: "📱",
  [NodeType.ANALYST_CRITIC]: "⚖️",
  [NodeType.LOGIC_GATE]: "🚥",
  [NodeType.EXTERNAL_CONNECTOR]: "🔌",
  [NodeType.STATE_MANAGER]: "💾",
  [NodeType.HUMAN_APPROVAL]: "👤"
};

const statusLabels: Record<StepStatus, string> = {
  [StepStatus.IDLE]: "HAZIR",
  [StepStatus.RUNNING]: "İŞLENİYOR",
  [StepStatus.SUCCESS]: "TAMAMLANDI",
  [StepStatus.REJECTED]: "HATA",
  [StepStatus.REPAIRING]: "ONARILIYOR",
  [StepStatus.WAITING_APPROVAL]: "ONAY BEKLİYOR",
};

export const NodeCard: React.FC<NodeCardProps> = ({ node, index, allNodes = [], onApprove, onUpdate, onDelete }) => {
  const [showWebhookInfo, setShowWebhookInfo] = useState(false);

  const resolveTaskText = (text: string) => {
    let resolved = text;
    allNodes.forEach(n => {
      const placeholder = `{{${n.id}.output}}`;
      if (resolved.includes(placeholder)) {
        resolved = resolved.replace(placeholder, n.outputData || `[${n.title} Bekleniyor]`);
      }
    });
    return resolved;
  };

  const statusConfig = {
    [StepStatus.IDLE]: "border-slate-800 opacity-40",
    [StepStatus.RUNNING]: "border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)] animate-pulse",
    [StepStatus.SUCCESS]: "border-emerald-500/50 shadow-lg shadow-emerald-500/5",
    [StepStatus.REJECTED]: "border-rose-500 bg-rose-500/5",
    [StepStatus.REPAIRING]: "border-amber-500",
    [StepStatus.WAITING_APPROVAL]: "border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
  };

  const resolvedTask = resolveTaskText(node.task);

  return (
    <div className="relative w-full flex flex-col items-center z-10 group mb-4">
      {index !== 0 && (
        <div className={`absolute -top-8 w-[2px] h-8 transition-colors duration-1000 ${node.status === StepStatus.IDLE ? 'bg-slate-800' : 'bg-indigo-500'}`}></div>
      )}

      <div className={`w-full bg-[#0a0f1e] border-2 rounded-[2rem] p-6 transition-all duration-500 relative overflow-hidden ${statusConfig[node.status]}`}>
        {/* Sandbox Indicator inside card */}
        <div className="absolute top-0 right-10 px-3 py-1 bg-amber-500/10 text-[6px] font-black text-amber-500 rounded-b-lg border-x border-b border-amber-500/20">
            TEST_NODE_DEBUG
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-[#020617] border border-slate-800 rounded-xl flex items-center justify-center text-xl">
            {typeIcons[node.type] || "🤖"}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-black text-white uppercase">{node.title}</h4>
                <p className="text-[7px] font-black text-indigo-400/80 uppercase tracking-widest">{node.role}</p>
              </div>
              <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                node.status === StepStatus.SUCCESS ? 'bg-emerald-500 text-white' : 
                node.status === StepStatus.WAITING_APPROVAL ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}>
                {statusLabels[node.status]}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`rounded-xl p-4 border ${node.status === StepStatus.WAITING_APPROVAL ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-[#020617] border-slate-800/50'}`}>
            <h5 className="text-[7px] font-black text-slate-500 uppercase mb-2">OPERASYONEL TALİMAT</h5>
            <div className="text-[10px] text-slate-300 leading-relaxed">
              {resolvedTask}
            </div>
          </div>

          {node.outputData && (
            <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">SİMÜLE EDİLEN VERİ</span>
                <button onClick={() => setShowWebhookInfo(!showWebhookInfo)} className="text-[7px] text-indigo-400 underline uppercase">Debug</button>
              </div>
              <div className="text-[10px] text-slate-300 italic font-mono bg-black/30 p-2 rounded-lg border border-slate-800/50 overflow-x-auto">
                {node.outputData}
              </div>
              
              {showWebhookInfo && (
                <div className="mt-3 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg animate-in fade-in">
                   <p className="text-[8px] font-black text-indigo-300 mb-1 uppercase">DEĞİŞKEN EŞLEŞTİRME (V-MAP)</p>
                   <p className="text-[8px] text-indigo-200 font-mono">
                     In: RAW_PROMPT <br/>
                     Out: {node.id}.output <br/>
                     State: PERSISTED
                   </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
