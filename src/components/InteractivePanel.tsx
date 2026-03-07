import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onAdd: (value: string) => void;
  onReset: () => void;
  loading: boolean;
}

export const InteractivePanel: React.FC<Props> = ({ onAdd, onReset, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="p-8 rounded-3xl glass-panel space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">แผงควบคุมข้อมูล</h2>
        <button
          onClick={onReset}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/20"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          ล้างข้อมูลทั้งหมด
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="กรอกข้อมูลที่ต้องการบันทึก..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all placeholder:text-gray-600"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-brand-accent text-brand-bg font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">สถานะ</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-sm font-medium">เชื่อมต่อฐานข้อมูลแล้ว</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">วิธีการ</span>
          <span className="text-sm font-medium">REST API / JSON</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">การจัดเก็บ</span>
          <span className="text-sm font-medium">MariaDB / SQLite</span>
        </div>
      </div>
    </div>
  );
};
