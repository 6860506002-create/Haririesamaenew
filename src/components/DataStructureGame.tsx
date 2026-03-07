import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  RefreshCcw, 
  Layers, 
  Database, 
  List, 
  GitBranch, 
  Network, 
  Cpu,
  Search,
  ArrowRight
} from 'lucide-react';

type DSType = 'array' | 'stack' | 'queue' | 'linkedlist' | 'tree' | 'graph';

interface Node {
  id: string;
  value: string;
  children?: Node[];
}

export const DataStructureGame: React.FC = () => {
  const [activeDS, setActiveDS] = useState<DSType>('stack');
  const [data, setData] = useState<string[]>(['A', 'B', 'C']);
  const [inputValue, setInputValue] = useState('');
  const [searchIndex, setSearchIndex] = useState<number | null>(null);

  // For Tree/Graph visualization (simplified)
  const [treeData, setTreeData] = useState<Node>({
    id: 'root',
    value: 'Root',
    children: [
      { id: 'c1', value: 'Child 1', children: [] },
      { id: 'c2', value: 'Child 2', children: [] }
    ]
  });

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const val = inputValue.trim();
    
    switch (activeDS) {
      case 'array':
        setData([...data, val]);
        break;
      case 'stack':
        setData([val, ...data]);
        break;
      case 'queue':
        setData([...data, val]);
        break;
      case 'linkedlist':
        setData([...data, val]);
        break;
      case 'tree':
        // Simple tree add: add to first child that has space
        const newTree = { ...treeData };
        if (newTree.children) {
          newTree.children.push({ id: Date.now().toString(), value: val, children: [] });
        }
        setTreeData(newTree);
        break;
    }
    setInputValue('');
  };

  const handleRemove = () => {
    switch (activeDS) {
      case 'array':
        setData(data.slice(0, -1));
        break;
      case 'stack':
        setData(data.slice(1));
        break;
      case 'queue':
        setData(data.slice(1));
        break;
      case 'linkedlist':
        setData(data.slice(0, -1));
        break;
      case 'tree':
        const newTree = { ...treeData };
        if (newTree.children && newTree.children.length > 0) {
          newTree.children.pop();
        }
        setTreeData(newTree);
        break;
    }
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    const idx = data.indexOf(inputValue.trim());
    setSearchIndex(idx !== -1 ? idx : null);
    setTimeout(() => setSearchIndex(null), 2000);
  };

  const renderVisualization = () => {
    switch (activeDS) {
      case 'array':
      case 'linkedlist':
        return (
          <div className="flex flex-wrap justify-center gap-4 p-4">
            <AnimatePresence mode="popLayout">
              {data.map((item, idx) => (
                <motion.div
                  key={`${item}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    borderColor: searchIndex === idx ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
                    backgroundColor: searchIndex === idx ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative flex items-center"
                >
                  <div className="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center text-brand-accent font-bold shadow-lg">
                    <span className="text-xs text-gray-500 absolute -top-6">[{idx}]</span>
                    {item}
                  </div>
                  {activeDS === 'linkedlist' && idx < data.length - 1 && (
                    <ArrowRight className="ml-2 text-gray-600" size={20} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      case 'stack':
        return (
          <div className="flex flex-col-reverse items-center gap-2 p-4">
            <AnimatePresence mode="popLayout">
              {data.map((item, idx) => (
                <motion.div
                  key={`${item}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-32 h-12 rounded-xl border border-brand-accent/30 bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold"
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="w-40 h-2 bg-white/10 rounded-full mt-2" />
          </div>
        );
      case 'queue':
        return (
          <div className="flex items-center gap-2 p-4 overflow-x-auto w-full justify-center">
            <div className="text-xs text-gray-500 rotate-90 font-mono">EXIT</div>
            <AnimatePresence mode="popLayout">
              {data.map((item, idx) => (
                <motion.div
                  key={`${item}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-w-[60px] h-12 rounded-xl border border-brand-accent/30 bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold"
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-xs text-gray-500 rotate-90 font-mono">ENTRANCE</div>
          </div>
        );
      case 'tree':
        return (
          <div className="flex flex-col items-center gap-8 p-4">
            <div className="w-16 h-16 rounded-full border-2 border-brand-accent bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold">
              {treeData.value}
            </div>
            <div className="flex gap-8">
              {treeData.children?.map((child) => (
                <div key={child.id} className="flex flex-col items-center gap-4">
                  <div className="w-px h-8 bg-white/20" />
                  <div className="w-14 h-14 rounded-full border border-brand-accent/50 bg-brand-accent/5 flex items-center justify-center text-brand-accent text-sm">
                    {child.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'graph':
        return (
          <div className="relative w-full h-48 flex items-center justify-center">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border border-dashed border-white/5 rounded-full animate-spin-slow" />
             </div>
             <div className="grid grid-cols-3 gap-8">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-xs text-brand-accent">
                    V{i}
                  </div>
                ))}
             </div>
             <p className="absolute bottom-0 text-[10px] text-gray-500">กราฟแสดงความสัมพันธ์แบบเครือข่าย</p>
          </div>
        );
    }
  };

  const dsInfo = {
    array: { icon: List, label: 'Array', desc: 'เก็บข้อมูลเรียงต่อกัน เข้าถึงด้วย Index' },
    stack: { icon: Layers, label: 'Stack', desc: 'เข้าทีหลังออกก่อน (LIFO)' },
    queue: { icon: Database, label: 'Queue', desc: 'เข้าก่อนออกก่อน (FIFO)' },
    linkedlist: { icon: GitBranch, label: 'Linked List', desc: 'เชื่อมต่อกันด้วยพอยน์เตอร์' },
    tree: { icon: Network, label: 'Tree', desc: 'โครงสร้างแบบลำดับชั้น' },
    graph: { icon: Cpu, label: 'Graph', desc: 'โครงสร้างแบบเครือข่าย' },
  };

  return (
    <div className="p-4 md:p-8 rounded-3xl glass-panel space-y-6 md:space-y-8">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {(Object.keys(dsInfo) as DSType[]).map((key) => {
          const Icon = dsInfo[key].icon;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveDS(key);
                setData(['A', 'B', 'C']);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
                activeDS === key 
                  ? 'bg-brand-accent text-brand-bg border-brand-accent' 
                  : 'text-gray-400 hover:text-white border-white/10 bg-white/5'
              }`}
            >
              <Icon size={16} />
              {dsInfo[key].label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{dsInfo[activeDS].label} Playground</h3>
        <p className="text-gray-400 text-sm">{dsInfo[activeDS].desc}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="ใส่ข้อมูล..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-brand-accent text-brand-bg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            เพิ่ม
          </button>
          <button
            onClick={handleRemove}
            disabled={data.length === 0 && activeDS !== 'tree'}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
          >
            <Minus size={18} />
            ลบ
          </button>
          {activeDS === 'array' && (
            <button
              onClick={handleSearch}
              className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
            >
              <Search size={18} />
            </button>
          )}
          <button
            onClick={() => {
              setData([]);
              setTreeData({ id: 'root', value: 'Root', children: [] });
            }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="min-h-[250px] bg-black/20 rounded-2xl border border-white/5 p-4 md:p-8 flex items-center justify-center overflow-hidden relative">
        {renderVisualization()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-2">หลักการทำงาน</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {activeDS === 'array' && "Array เก็บข้อมูลในช่องที่เรียงต่อกัน สามารถเข้าถึงข้อมูลตัวไหนก็ได้ทันทีผ่าน Index (O(1))"}
            {activeDS === 'stack' && "Stack ใช้หลักการ LIFO (Last In, First Out) ข้อมูลที่เข้าทีหลังสุดจะถูกนำออกก่อน"}
            {activeDS === 'queue' && "Queue ใช้หลักการ FIFO (First In, First Out) ข้อมูลที่เข้าก่อนจะถูกนำออกก่อน"}
            {activeDS === 'linkedlist' && "Linked List เก็บข้อมูลแบบกระจายตัว แต่ละตัวจะชี้ไปยังตัวถัดไป ทำให้เพิ่ม/ลดข้อมูลได้ยืดหยุ่น"}
            {activeDS === 'tree' && "Tree จัดเก็บข้อมูลเป็นลำดับชั้น มีความสัมพันธ์แบบพ่อ-ลูก (Parent-Child)"}
            {activeDS === 'graph' && "Graph แสดงความสัมพันธ์ที่ซับซ้อนระหว่างโหนด โดยไม่มีลำดับชั้นที่แน่นอน"}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-2">ตัวอย่างจริง</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {activeDS === 'array' && "รายชื่อนักเรียนในห้อง, รายการสินค้าในสต็อก"}
            {activeDS === 'stack' && "ปุ่ม Undo, การย้อนกลับหน้าเว็บ, การเรียกฟังก์ชันซ้อนกัน"}
            {activeDS === 'queue' && "คิวพิมพ์งาน, คิวรอรับบริการ, การส่งข้อความในแชท"}
            {activeDS === 'linkedlist' && "การจัดการหน่วยความจำ, รายการเพลงในเครื่องเล่นที่กดถัดไปได้"}
            {activeDS === 'tree' && "โครงสร้างโฟลเดอร์ในคอมพิวเตอร์, แผนผังองค์กร, DOM ใน HTML"}
            {activeDS === 'graph' && "เครือข่ายเพื่อนใน Facebook, แผนที่ Google Maps, โครงข่ายอินเทอร์เน็ต"}
          </p>
        </div>
      </div>
    </div>
  );
};
