
import React from 'react';
// Import WorkflowNode instead of non-existent WorkflowStep
import { WorkflowNode, StepStatus } from '../types';

interface StepCardProps {
  // Use WorkflowNode as the correct interface for nodes/steps
  step: WorkflowNode;
  onUpdate: (id: string, updates: Partial<WorkflowNode>) => void;
  onDelete: (id: string) => void;
}

// Map labels to correct StepStatus enum keys defined in types.ts
// Fix: Added missing WAITING_APPROVAL key to satisfy Record<StepStatus, string>
const statusLabels: Record<StepStatus, string> = {
  [StepStatus.IDLE]: "Beklemede",
  [StepStatus.RUNNING]: "Devam Ediyor",
  [StepStatus.SUCCESS]: "Tamamlandı",
  [StepStatus.REJECTED]: "Reddedildi",
  [StepStatus.REPAIRING]: "Onarılıyor",
  [StepStatus.WAITING_APPROVAL]: "Onay Bekliyor",
};

export const StepCard: React.FC<StepCardProps> = ({ step, onUpdate, onDelete }) => {
  // Map colors to correct StepStatus enum keys defined in types.ts
  // Fix: Added missing WAITING_APPROVAL key for consistency
  const statusColors = {
    [StepStatus.IDLE]: "bg-slate-100 text-slate-600",
    [StepStatus.RUNNING]: "bg-blue-100 text-blue-600",
    [StepStatus.SUCCESS]: "bg-emerald-100 text-emerald-600",
    [StepStatus.REJECTED]: "bg-rose-100 text-rose-600",
    [StepStatus.REPAIRING]: "bg-amber-100 text-amber-600",
    [StepStatus.WAITING_APPROVAL]: "bg-cyan-100 text-cyan-600",
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[step.status]}`}>
          {statusLabels[step.status]}
        </span>
        <button 
          onClick={() => onDelete(step.id)}
          className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Adımı Sil"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <input 
        className="w-full text-lg font-semibold text-slate-800 bg-transparent border-none focus:ring-0 mb-1 p-0"
        value={step.title}
        onChange={(e) => onUpdate(step.id, { title: e.target.value })}
        placeholder="Adım Başlığı"
      />
      
      <textarea 
        className="w-full text-sm text-slate-500 bg-transparent border-none focus:ring-0 resize-none p-0"
        // Use 'task' property from WorkflowNode interface instead of 'description'
        value={step.task}
        onChange={(e) => onUpdate(step.id, { task: e.target.value })}
        placeholder="Adım detaylarını buraya ekleyin..."
        rows={2}
      />

      <div className="mt-4 flex items-center justify-between">
        <select 
          value={step.status}
          onChange={(e) => onUpdate(step.id, { status: e.target.value as StepStatus })}
          className="text-xs border-slate-200 rounded-md bg-slate-50 py-1"
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {/* Removed invalid metadata check as the WorkflowNode interface does not contain a metadata property */}
        <div className="flex gap-2">
          {step.role && (
            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100" title="Sorumlu">
              {step.role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
