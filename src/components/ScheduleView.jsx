import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Timer, Radio } from 'lucide-react';

const ScheduleView = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getUpcomingSchedule().then(setSchedule);
    }
  }, []);

  return (
    <div className="p-8 pb-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="text-indigo-400" size={32} />
            Temporal Matrix
          </h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest leading-none">Real-time scheduling data from Newton Hub</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2">
            <Radio size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Live Sync Enabled</span>
        </div>
      </header>
      
      <div className="space-y-4">
        {schedule.map(item => (
          <div 
            key={item.id} 
            className="group relative flex flex-col md:flex-row items-center gap-6 bg-white/5 border border-white/10 p-6 hover:bg-white/[0.08] transition-all hover:border-indigo-500/30 overflow-hidden"
          >
            {/* Date Block */}
            <div className="w-full md:w-32 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 shrink-0">
                <span className="text-[10px] font-mono text-gray-500 uppercase">TIMESTAMP</span>
                <span className="text-xl font-bold text-white uppercase tracking-tighter">
                   {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-mono text-indigo-400 uppercase">
                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
            </div>

            {/* Content Block */}
            <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-indigo-300 transition-all">{item.title}</h3>
                   <span className={`text-[10px] px-2 py-0.5 border font-mono uppercase tracking-widest ${
                      item.type === 'contest' ? 'text-pink-500 border-pink-500/20 bg-pink-500/5' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
                   }`}>
                      {item.type}
                   </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> 10:00 AM - 12:00 PM</span>
                    <span className="hidden md:flex items-center gap-1"><MapPin size={14} /> Newton Portal Online</span>
                </div>
            </div>

            {/* Action Block */}
            <div className="ml-auto flex items-center gap-4">
                <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold font-sans px-6 py-2.5 transition-all text-sm uppercase rounded-none tracking-tighter">
                    Join Session <ExternalLink size={14} />
                </button>
            </div>

            {/* Decorative Grid Pulse */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rotate-45 translate-x-16 -translate-y-16 blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all"></div>
          </div>
        ))}

        {schedule.length === 0 && (
          <div className="border border-white/10 p-12 text-center space-y-4">
              <Timer size={48} className="text-gray-800 mx-auto" />
              <p className="font-mono text-gray-600 uppercase tracking-widest text-sm text-center">No temporal events detected in current timeframe_</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
