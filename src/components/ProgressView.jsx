import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Flame, LayoutList, CheckCircle } from 'lucide-react';

const ProgressView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getProgress().then(progress => {
        setData(progress || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const chartData = data.map(d => ({
    name: d.subject.length > 15 ? d.subject.substring(0, 15) + '...' : d.subject,
    progress: d.progress,
    fullMark: 100
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex flex-row items-center gap-3">
             <Activity className="text-emerald-400" size={32} />
             Live Analytics
          </h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest leading-relaxed">
            Real-time course penetration metrics and academic vectors.
          </p>
        </div>
      </header>

      {data.length === 0 ? (
        <div className="border border-white/5 bg-white/[0.01] p-12 text-center">
            <h3 className="text-white text-lg font-mono">No Progress Matrix Found</h3>
            <p className="text-gray-500 text-sm mt-2 font-mono">Enroll in a course sequentially to view real-time progression charts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          
          {/* Main Chart */}
          <div className="bg-[#050505] border border-white/10 p-6 flex flex-col justify-between">
            <h2 className="text-white font-mono uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <LayoutList size={16} className="text-emerald-500" />
              Primary Completion Vectors
            </h2>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Bar dataKey="progress" fill="#10b981" radius={[2, 2, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="space-y-4">
             {data.map((subj, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-bold">{subj.subject}</h3>
                      <span className="text-emerald-400 font-mono text-sm">{subj.progress}%</span>
                  </div>
                  <div className="w-full bg-black h-2 mb-6 border border-white/5">
                      <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: `${subj.progress}%`}}></div>
                  </div>
                  <div className="space-y-2">
                      <h4 className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-3">Recent Topic Clusters</h4>
                      {(subj.topics || []).map((t, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-gray-300 text-sm border-b border-white/5 pb-2">
                              <CheckCircle size={14} className="text-emerald-500/50" />
                              <span className="font-mono">{t}</span>
                          </div>
                      ))}
                  </div>
                </div>
             ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default ProgressView;
