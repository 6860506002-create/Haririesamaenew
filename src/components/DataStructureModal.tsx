import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, ArrowRight, Play } from 'lucide-react';
import { DataStructureInfo } from '../types';

interface Props {
  structure: DataStructureInfo | null;
  onClose: () => void;
  onPlay: () => void;
}

export const DataStructureModal: React.FC<Props> = ({ structure, onClose, onPlay }) => {
  const renderVisual = () => {
    switch (structure.visualExample) {
      case 'array':
        return (
          <div className="flex gap-2 justify-center py-8">
            {[10, 20, 30, 40].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg border-2 border-brand-accent bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">
                  {v}
                </div>
                <span className="text-[10px] text-gray-500 font-mono">[{i}]</span>
              </div>
            ))}
          </div>
        );
      case 'stack':
        return (
          <div className="flex flex-col-reverse items-center gap-2 py-8">
            {[3, 2, 1].map((v) => (
              <div key={v} className="w-32 h-10 rounded-lg border-2 border-brand-accent bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">
                Data {v}
              </div>
            ))}
            <div className="w-40 h-2 bg-white/10 rounded-full" />
          </div>
        );
      case 'queue':
        return (
          <div className="flex items-center gap-2 py-8 justify-center">
            <div className="text-[10px] text-gray-500 rotate-90">OUT</div>
            {[1, 2, 3].map((v) => (
              <div key={v} className="w-12 h-12 rounded-lg border-2 border-brand-accent bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">
                {v}
              </div>
            ))}
            <div className="text-[10px] text-gray-500 rotate-90">IN</div>
          </div>
        );
      case 'linkedlist':
        return (
          <div className="flex items-center gap-2 py-8 justify-center">
            {[1, 2].map((v) => (
              <React.Fragment key={v}>
                <div className="p-3 rounded-lg border-2 border-brand-accent bg-brand-accent/10 flex items-center gap-2">
                  <span className="text-brand-accent font-bold">{v}</span>
                  <div className="w-px h-4 bg-brand-accent/30" />
                  <ArrowRight size={14} className="text-brand-accent" />
                </div>
                {v === 1 && <div className="w-4 h-px bg-brand-accent/30" />}
              </React.Fragment>
            ))}
            <div className="text-gray-500 text-xs font-mono">NULL</div>
          </div>
        );
      case 'tree':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-10 h-10 rounded-full border-2 border-brand-accent bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">R</div>
            <div className="flex gap-8">
              <div className="w-8 h-8 rounded-full border border-brand-accent/50 bg-brand-accent/5 flex items-center justify-center text-brand-accent text-xs">L</div>
              <div className="w-8 h-8 rounded-full border border-brand-accent/50 bg-brand-accent/5 flex items-center justify-center text-brand-accent text-xs">R</div>
            </div>
          </div>
        );
      case 'graph':
        return (
          <div className="relative w-32 h-32 mx-auto py-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-brand-accent bg-brand-accent/10 flex items-center justify-center text-xs">A</div>
            <div className="absolute bottom-0 left-0 w-8 h-8 rounded-full border border-brand-accent bg-brand-accent/10 flex items-center justify-center text-xs">B</div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full border border-brand-accent bg-brand-accent/10 flex items-center justify-center text-xs">C</div>
            <svg className="absolute inset-0 w-full h-full -z-10">
              <line x1="50%" y1="15%" x2="15%" y2="85%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
              <line x1="50%" y1="15%" x2="85%" y2="85%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
              <line x1="15%" y1="85%" x2="85%" y2="85%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-brand-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-accent/20 text-brand-accent">
                  <Info size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">{structure.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                {structure.longDescription}
              </p>
              
              <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 text-center">Visual Representation</h4>
                {renderVisual()}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {structure.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={onPlay}
                className="flex-1 py-4 rounded-2xl bg-brand-accent text-brand-bg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <Play size={20} fill="currentColor" />
                ลองเล่นเลย
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </motion.div>
      </div>
  );
};
