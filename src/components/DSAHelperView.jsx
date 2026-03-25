import React, { useState, useEffect } from 'react';
import { Code2, Search, Terminal, Zap, BookOpen, ChevronRight, Activity } from 'lucide-react';

const DSAHelperView = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (q) => {
    setIsSearching(true);
    if (window.electronAPI) {
      window.electronAPI.searchDSA(q || 'all').then(res => {
        setResults(res);
        setIsSearching(false);
      });
    } else {
      setTimeout(() => setIsSearching(false), 500); // Browser fallback
    }
  };

  useEffect(() => {
    handleSearch('all');
  }, []);

  const difficultyColors = {
    'Easy': 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    'Medium': 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
    'Hard': 'text-red-400 border-red-500/20 bg-red-500/10'
  };

  return (
    <div className="p-8 pb-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Code2 className="text-cyan-400" size={32} />
            Data Structures & Algos
          </h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest leading-none">Algorithm Repository & Practice Matrix</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2">
            <Activity size={14} className="text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Compiler Ready</span>
        </div>
      </header>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Terminal className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Query topics... [ Arrays, DP, Trees ]" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          className="w-full bg-black/50 border border-white/10 p-4 pl-12 text-white font-mono focus:border-cyan-500 outline-none transition-all text-sm shadow-inner"
        />
        {isSearching && (
           <div className="absolute right-4 top-1/2 -translate-y-1/2">
               <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
         {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>

        {results.map(item => (
          <div 
            key={item.id} 
            className="group flex flex-col justify-between bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 p-6 transition-all relative overflow-hidden h-40"
          >
            {/* Edge Accents */}
            <div className={`absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 blur-xl ${item.difficulty === 'Hard' ? 'bg-red-500' : item.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></div>

            <div>
               <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white tracking-tight uppercase group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 border ${difficultyColors[item.difficulty]}`}>
                     {item.difficulty}
                  </span>
               </div>
               <span className="text-xs font-mono text-gray-500 flex items-center gap-1 uppercase tracking-widest">
                  <BookOpen size={12} /> {item.topic}
               </span>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-auto">
               <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Problem_UUID: {item.id}</span>
               <a 
                 href={item.url} 
                 className="flex items-center gap-1 text-[10px] font-bold font-mono text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-105 transition-all px-4 py-1.5 uppercase"
               >
                 Execute <ChevronRight size={14} />
               </a>
            </div>
          </div>
        ))}
        
        {results.length === 0 && !isSearching && (
          <div className="col-span-full border border-dashed border-white/10 p-12 text-center text-gray-500 font-mono text-sm uppercase tracking-widest flex flex-col items-center gap-4">
            <Zap size={32} className="text-gray-700" />
            No algorithmic vectors matched your query.
          </div>
        )}
      </div>
    </div>
  );
};

export default DSAHelperView;
