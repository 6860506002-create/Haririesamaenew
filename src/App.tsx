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
  Cpu
} from 'lucide-react';
import { DataEntry, DataStructureInfo } from './types';
import { DataStructureCard } from './components/DataStructureCard';
import { InteractivePanel } from './components/InteractivePanel';

const LINEAR_STRUCTURES: DataStructureInfo[] = [
  {
    title: "Array",
    description: "A collection of elements identified by index or key. Elements are stored in contiguous memory locations.",
    type: 'linear',
    icon: 'List',
    details: ['O(1) Access', 'Fixed Size', 'Contiguous']
  },
  {
    title: "Stack",
    description: "Follows LIFO (Last In First Out) principle. Think of a stack of plates where you add/remove from the top.",
    type: 'linear',
    icon: 'Layers',
    details: ['LIFO', 'Push/Pop', 'Undo Logic']
  },
  {
    title: "Queue",
    description: "Follows FIFO (First In First Out) principle. Like a line at a store where the first person is served first.",
    type: 'linear',
    icon: 'Database',
    details: ['FIFO', 'Enqueue/Dequeue', 'Scheduling']
  },
  {
    title: "Linked List",
    description: "A sequence of nodes where each node contains data and a reference to the next node in the sequence.",
    type: 'linear',
    icon: 'GitBranch',
    details: ['Dynamic Size', 'Non-contiguous', 'Pointers']
  }
];

const NON_LINEAR_STRUCTURES: DataStructureInfo[] = [
  {
    title: "Tree",
    description: "A hierarchical structure with a root value and subtrees of children with a parent node.",
    type: 'non-linear',
    icon: 'Network',
    details: ['Hierarchical', 'Root/Leaf', 'Recursion']
  },
  {
    title: "Graph",
    description: "A set of nodes (vertices) connected by edges. Used to represent networks like social media or maps.",
    type: 'non-linear',
    icon: 'Cpu',
    details: ['Vertices/Edges', 'Adjacency', 'Pathfinding']
  }
];

export default function App() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/get');
      const json = await res.json();
      setData(json);
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
    if (!confirm("Are you sure you want to delete all data?")) return;
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
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="pt-16 pb-12 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-accent font-mono text-sm tracking-widest uppercase">
              <Code2 size={16} />
              <span>Computer Science Fundamentals</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              Data Structures <span className="text-gray-500">Learning</span>
            </h1>
          </div>
          <div className="text-gray-400 max-w-md text-sm leading-relaxed">
            Explore the fundamental building blocks of software engineering. 
            Understand how data is organized, managed, and stored for efficient access and modification.
          </div>
        </motion.div>
      </header>

      <main className="px-6 max-w-7xl mx-auto space-y-24">
        
        {/* Linear Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Linear Structures</h2>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Sequential</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LINEAR_STRUCTURES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <DataStructureCard structure={s} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Non-Linear Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">Non-Linear Structures</h2>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Hierarchical</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {NON_LINEAR_STRUCTURES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <DataStructureCard structure={s} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Interactive Panel & Data List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <InteractivePanel onAdd={handleAdd} onReset={handleReset} loading={loading} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Stored Data</h2>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                {data.length} Entries
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {data.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600 gap-4"
                  >
                    <Database size={48} strokeWidth={1} />
                    <p className="text-sm">No data stored in database yet.</p>
                  </motion.div>
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
                        <div className="data-node">
                          {entry.id}
                        </div>
                        <div>
                          <p className="font-medium text-white">{entry.value}</p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {new Date(entry.created_at).toLocaleString()}
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
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/5 py-12 px-6 text-center">
        <p className="text-gray-500 text-sm">
          Built with React, Express, and MariaDB. Designed for modern learning.
        </p>
      </footer>
    </div>
  );
}
