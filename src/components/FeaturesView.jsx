import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Calendar, CalendarClock, Activity, Code2, Sparkles, Terminal, ArrowRight } from 'lucide-react';

const FeaturesView = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Neural Engine",
      desc: "Advanced AI conversational assistant for doubt resolution and portal interrogation.",
      icon: Bot,
      route: "/chat",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20"
    },
    {
      title: "Temporal Matrix",
      desc: "Live chronological grid of lectures, contests, and deadlines synced from Newton.",
      icon: Calendar,
      route: "/schedule",
      color: "text-pink-400",
      bg: "bg-pink-400/10",
      border: "border-pink-400/20"
    },
    {
      title: "Arena Repository",
      desc: "Direct access to Newton's coding problems with live execution and tracking.",
      icon: Code2,
      route: "/dsa",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20"
    },
    {
      title: "Decoding Records",
      desc: "Pichle lectures ki recordings and attendance analytics at a glance.",
      icon: CalendarClock,
      route: "/recent",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      title: "Academic Analytics",
      desc: "Neural mapping of your course progression and subject-wise completion matrix.",
      icon: Activity,
      route: "/progress",
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      border: "border-indigo-400/20"
    }
  ];

  return (
    <div className="p-8 pb-12 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-white flex items-center gap-4">
          <Sparkles className="text-cyan-400" size={32} />
          System Clusters
        </h1>
        <p className="text-gray-400 font-mono text-sm uppercase tracking-[0.2em] leading-relaxed">
          The central hub for all NST-X operational directives.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -top-12 -left-12 -right-12 -bottom-12 opacity-50"></div>

        {features.map((feature, i) => (
          <div 
            key={i}
            onClick={() => navigate(feature.route)}
            className={`group relative flex flex-col justify-between p-8 bg-white/[0.01] border ${feature.border} hover:border-white/40 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm`}
          >
            {/* Animated Edge */}
            <div className={`absolute top-0 right-0 w-1/2 h-1 ${feature.color.replace('text', 'bg')} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right`}></div>
            
            <div>
              <div className={`w-12 h-12 ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={feature.color} size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors uppercase tracking-widest">{feature.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed font-mono font-medium">{feature.desc}</p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[10px] font-mono font-bold text-gray-600 group-hover:text-white uppercase tracking-[0.2em] transition-all">
              Initiate_Module <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
            </div>

            {/* Glowing Backdrop */}
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${feature.bg} rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity`}></div>
          </div>
        ))}
      </div>

      <footer className="pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-700 uppercase tracking-widest">
        <span>NST-X_KERNEL: v1.0.4</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div> Link_Stable
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Auth_Verified
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesView;
