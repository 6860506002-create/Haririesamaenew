import React from 'react';
import { motion } from 'motion/react';
import { DataStructureInfo } from '../types';
import * as Icons from 'lucide-react';

interface Props {
  structure: DataStructureInfo;
}

export const DataStructureCard: React.FC<Props> = ({ structure }) => {
  const Icon = (Icons as any)[structure.icon] || Icons.Box;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl glass-panel flex flex-col gap-4 h-full"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand-accent/20 text-brand-accent">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold">{structure.title}</h3>
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
    </motion.div>
  );
};
