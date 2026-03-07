import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Database, 
  GitBranch, 
  Network, 
  List, 
  Trash2, 
  ChevronRight,
  Code2,
  Cpu,
  Gamepad2,
  MousePointer2
} from 'lucide-react';
import { DataEntry, DataStructureInfo } from './types';
import { DataStructureCard } from './components/DataStructureCard';
import { InteractivePanel } from './components/InteractivePanel';
import { DataStructureGame } from './components/DataStructureGame';

import { DataStructureModal } from './components/DataStructureModal';

const LINEAR_STRUCTURES: DataStructureInfo[] = [
  {
    title: "Array (อาร์เรย์)",
    description: "กลุ่มของข้อมูลที่เก็บไว้ในหน่วยความจำที่เรียงต่อกัน เข้าถึงได้รวดเร็วผ่านดัชนี (Index)",
    longDescription: "อาร์เรย์เป็นโครงสร้างข้อมูลพื้นฐานที่สุด โดยจะเก็บข้อมูลประเภทเดียวกันไว้ในหน่วยความจำที่เรียงต่อกัน ทำให้เราสามารถเข้าถึงข้อมูลตำแหน่งใดก็ได้ทันที (Random Access) โดยใช้ดัชนี (Index) เริ่มต้นที่ 0",
    type: 'linear',
    icon: 'List',
    details: ['เข้าถึง O(1)', 'ขนาดคงที่', 'เก็บต่อเนื่อง'],
    visualExample: 'array'
  },
  {
    title: "Stack (สแต็ก)",
    description: "โครงสร้างแบบ LIFO (เข้าทีหลังออกก่อน) เหมือนการวางจานซ้อนกัน เพิ่มและลบจากด้านบนเท่านั้น",
    longDescription: "สแต็กทำงานแบบ Last-In, First-Out (LIFO) ข้อมูลที่ถูกใส่เข้าไปล่าสุดจะเป็นตัวแรกที่ถูกนำออกเสมอ เปรียบเสมือนการวางจานซ้อนกัน เราจะหยิบจานใบบนสุดออกก่อนเสมอ",
    type: 'linear',
    icon: 'Layers',
    details: ['LIFO', 'Push/Pop', 'Undo Logic'],
    visualExample: 'stack'
  },
  {
    title: "Queue (คิว)",
    description: "โครงสร้างแบบ FIFO (เข้าก่อนออกก่อน) เหมือนการต่อแถว ข้อมูลที่มาถึงก่อนจะได้รับบริการก่อน",
    longDescription: "คิวทำงานแบบ First-In, First-Out (FIFO) ข้อมูลที่เข้ามาก่อนจะถูกนำออกไปก่อนเสมอ เหมือนการต่อแถวซื้อของ คนที่มาถึงก่อนจะได้ซื้อก่อน",
    type: 'linear',
    icon: 'Database',
    details: ['FIFO', 'Enqueue/Dequeue', 'Scheduling'],
    visualExample: 'queue'
  },
  {
    title: "Linked List (ลิสต์โยง)",
    description: "กลุ่มของโหนดที่เชื่อมต่อกันด้วยพอยน์เตอร์ แต่ละโหนดเก็บข้อมูลและที่อยู่ของโหนดถัดไป",
    longDescription: "ลิสต์โยงประกอบด้วยโหนด (Node) ที่เชื่อมต่อกัน แต่ละโหนดจะเก็บข้อมูลและพอยน์เตอร์ที่ชี้ไปยังโหนดถัดไป ทำให้สามารถเพิ่มหรือลดขนาดได้ยืดหยุ่นกว่าอาร์เรย์",
    type: 'linear',
    icon: 'GitBranch',
    details: ['ขนาดปรับเปลี่ยนได้', 'ไม่ต่อเนื่อง', 'ใช้พอยน์เตอร์'],
    visualExample: 'linkedlist'
  }
];

const NON_LINEAR_STRUCTURES: DataStructureInfo[] = [
  {
    title: "Tree (ต้นไม้)",
    description: "โครงสร้างแบบลำดับชั้น มีโหนดราก (Root) และโหนดลูกๆ แตกแขนงออกไป",
    longDescription: "ต้นไม้เป็นโครงสร้างข้อมูลแบบลำดับชั้น (Hierarchical) เริ่มต้นจากโหนดราก (Root) และแตกกิ่งก้านสาขาไปยังโหนดลูก (Child Nodes) ใช้จัดการข้อมูลที่มีความสัมพันธ์เป็นชั้นๆ",
    type: 'non-linear',
    icon: 'Network',
    details: ['ลำดับชั้น', 'Root/Leaf', 'Recursion'],
    visualExample: 'tree'
  },
  {
    title: "Graph (กราฟ)",
    description: "กลุ่มของโหนด (Vertices) ที่เชื่อมต่อกันด้วยเส้นเชื่อม (Edges) ใช้แทนเครือข่ายต่างๆ",
    longDescription: "กราฟประกอบด้วยจุด (Vertices) และเส้นเชื่อม (Edges) ที่เชื่อมจุดเหล่านั้นเข้าด้วยกัน ใช้แทนความสัมพันธ์ที่ซับซ้อน เช่น เครือข่ายสังคมออนไลน์ หรือแผนที่การเดินทาง",
    type: 'non-linear',
    icon: 'Cpu',
    details: ['Vertices/Edges', 'Adjacency', 'Pathfinding'],
    visualExample: 'graph'
  }
];

export default function App() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'play' | 'db'>('learn');
  const [selectedStructure, setSelectedStructure] = useState<DataStructureInfo | null>(null);
  const [dbStatus, setDbStatus] = useState<{ status: string; error?: string }>({ status: 'checking' });

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setDbStatus(json);
    } catch (err) {
      setDbStatus({ status: 'error', error: 'Failed to connect to server' });
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/get');
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleAdd = async (value: string) => {
    setLoading(true);
    try {
      await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to add data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to delete data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด?")) return;
    setLoading(true);
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error("Failed to reset data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchData();
    // Refresh data every 5 seconds to simulate real-time for multi-device
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* DB Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border text-[10px] font-bold uppercase tracking-wider ${
          dbStatus.status === 'connected' ? 'border-emerald-500/50 text-emerald-400' : 
          dbStatus.status === 'error' ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-400'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            dbStatus.status === 'connected' ? 'bg-emerald-500' : 
            dbStatus.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
          <span>MariaDB: {dbStatus.status}</span>
        </div>
      </div>
      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div className="glass-panel p-2 rounded-2xl flex items-center justify-between shadow-2xl border-white/20">
          <button 
            onClick={() => setActiveTab('learn')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'learn' ? 'bg-brand-accent text-brand-bg' : 'text-gray-400 hover:text-white'}`}
          >
            <Code2 size={20} />
            <span className="text-[10px] font-bold uppercase">เรียนรู้</span>
          </button>
          <button 
            onClick={() => setActiveTab('play')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'play' ? 'bg-brand-accent text-brand-bg' : 'text-gray-400 hover:text-white'}`}
          >
            <Gamepad2 size={20} />
            <span className="text-[10px] font-bold uppercase">ลองเล่น</span>
          </button>
          <button 
            onClick={() => setActiveTab('db')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'db' ? 'bg-brand-accent text-brand-bg' : 'text-gray-400 hover:text-white'}`}
          >
            <Database size={20} />
            <span className="text-[10px] font-bold uppercase">ฐานข้อมูล</span>
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-12 md:pt-16 pb-8 md:pb-12 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-accent font-mono text-sm tracking-widest uppercase">
              <Cpu size={16} />
              <span>Computer Science Hub</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter">
              Data <span className="text-gray-500">Structures</span>
            </h1>
          </div>
          <div className="text-gray-400 max-w-md text-sm leading-relaxed hidden md:block">
            เรียนรู้และทดลองใช้งานโครงสร้างข้อมูลพื้นฐานผ่านระบบ Interactive ที่รองรับทั้งมือถือและคอมพิวเตอร์
          </div>
        </motion.div>
      </header>

      <main className="px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* Linear Section */}
              <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold">โครงสร้างข้อมูลเชิงเส้น</h2>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold">
                    <MousePointer2 size={14} className="animate-bounce" />
                    เคล็ดลับ: คลิกที่การ์ดเพื่อดูภาพประกอบและคำอธิบาย
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {LINEAR_STRUCTURES.map((s, i) => (
                    <DataStructureCard 
                      key={s.title} 
                      structure={s} 
                      onClick={() => setSelectedStructure(s)}
                    />
                  ))}
                </div>
              </section>

              {/* Non-Linear Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-bold">โครงสร้างข้อมูลไม่เชิงเส้น</h2>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {NON_LINEAR_STRUCTURES.map((s, i) => (
                    <DataStructureCard 
                      key={s.title} 
                      structure={s} 
                      onClick={() => setSelectedStructure(s)}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'play' && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <Gamepad2 className="text-brand-accent" />
                  โซนทดลองเล่น
                </h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <DataStructureGame />
            </motion.div>
          )}

          {activeTab === 'db' && (
            <motion.div
              key="db"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <InteractivePanel onAdd={handleAdd} onReset={handleReset} loading={loading} />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">ข้อมูลที่บันทึกไว้</h2>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    {data.length} รายการ
                  </span>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {data.length === 0 ? (
                      <div className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600 gap-4">
                        <Database size={48} strokeWidth={1} />
                        <p className="text-sm">ยังไม่มีข้อมูลในฐานข้อมูล</p>
                      </div>
                    ) : (
                      data.map((entry) => (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group p-4 rounded-2xl glass-panel flex items-center justify-between hover:border-brand-accent/30 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="data-node">{entry.id}</div>
                            <div>
                              <p className="font-medium text-white">{entry.value}</p>
                              <p className="text-[10px] text-gray-500 font-mono">
                                {new Date(entry.created_at).toLocaleString('th-TH')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Modal */}
        <DataStructureModal 
          structure={selectedStructure} 
          onClose={() => setSelectedStructure(null)}
          onPlay={() => {
            setSelectedStructure(null);
            setActiveTab('play');
          }}
        />
      </main>
    </div>
  );
}
