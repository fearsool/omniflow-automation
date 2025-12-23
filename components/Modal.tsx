
import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, onConfirm, placeholder, defaultValue = "" }) => {
  const [value, setValue] = React.useState(defaultValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0a0f1e] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter text-center">{title}</h3>
        <input 
          autoFocus
          className="w-full bg-[#020617] border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onConfirm(value)}
        />
        <div className="flex gap-4">
          <Button variant="ghost" className="flex-1 text-slate-500" onClick={onClose}>Vazgeç</Button>
          <Button className="flex-1 bg-indigo-600 rounded-2xl" onClick={() => onConfirm(value)}>Onayla</Button>
        </div>
      </div>
    </div>
  );
};
