import React from 'react';
import { motion } from 'motion/react';
import { DataStructureInfo } from '../types';
import * as Icons from 'lucide-react';

interface Props {
  structure: DataStructureInfo;
  onClick: () => void;
}

export const DataStructureCard: React.FC<Props> = ({ structure, onClick }) => {
  const Icon = (Icons as any)[structure.icon] || Icons.Box;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="relative p-6 rounded-2xl glass-panel flex flex-col gap-4 h-full cursor-pointer group hover:border-brand-accent/40 transition-all"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="px-2 py-1 rounded-md bg-brand-accent/20 text-[10px] font-bold text-brand-accent border border-brand-accent/30">
          LEARN MORE
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-accent/20 text-brand-accent group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-bg transition-all duration-300">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold group-hover:text-brand-accent transition-colors">{structure.title}</h3>
      </div>
      
      <p className="text-gray-400 text-sm leading-relaxed">
        {structure.description}
      </p>

      <div className="mt-auto pt-4 flex flex-wrap gap-2">
        {structure.details.map((detail, idx) => (
          <span 
            key={idx} 
            className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-300"
          >
            {detail}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between group-hover:border-brand-accent/20 transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
            Interactive Card
          </span>
          <span className="text-xs font-bold text-gray-500 group-hover:text-brand-accent transition-colors">
            คลิกเพื่อเรียนรู้เพิ่มเติม
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:bg-brand-accent group-hover:text-brand-bg transition-all">
          <Icons.ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};
