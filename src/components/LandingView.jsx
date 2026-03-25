import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, CalendarDays, ClipboardList, BarChart3, Code2, 
  BookOpen, ArrowRight, Sparkles, BotMessageSquare, Bell 
} from 'lucide-react';

const LandingView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-[1400px] mx-auto border-x border-blueprint-line min-h-screen flex flex-col">
        
        {/* NAV BAR */}
        <nav className="border-b border-blueprint-line flex justify-between items-center p-6 md:px-12">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/chat')}>
            <span className="font-mono font-bold text-xl tracking-tight text-white uppercase">NST-X</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Matrix', 'Arena'].map((item, i) => (
              <button key={item} onClick={() => navigate(['/features', '/schedule', '/dsa'][i])} className="font-mono text-sm uppercase tracking-widest text-gray-400 hover:text-cyan-400 transition-colors">
                {item}
              </button>
            ))}
          </div>
          <button 
            onClick={() => navigate('/features')}
            className="bg-white/5 hover:bg-white/10 border border-blueprint-line text-white font-mono text-sm px-6 py-2 rounded-none transition-colors cursor-pointer"
          >
            GET STARTED
          </button>
        </nav>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden flex-1 border-b border-blueprint-line flex flex-col items-center justify-center py-32 px-6">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-40 mix-blend-screen pointer-events-none" style={{boxShadow: '0 0 120px 30px rgba(99, 102, 241, 0.2)'}}></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="reveal-animate inline-flex items-center gap-2 px-3 py-1 mb-6 border border-blueprint-line bg-white/5 font-mono text-xs uppercase tracking-widest text-gray-300" style={{animationDelay: '0.1s'}}>
              <Sparkles size={14} className="text-indigo-400" />
              <span>AI-Powered Student Companion</span>
            </div>
            
            <h1 className="reveal-animate font-sans text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]" style={{animationDelay: '0.3s'}}>
              Your Entire <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-500">Academic Life,</span> <br/>
              One Smart App.
            </h1>
            
            <p className="reveal-animate font-mono text-gray-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed" style={{animationDelay: '0.5s'}}>
              AI chat assistant &middot; Smart scheduling &middot; Assignment tracking<br/>
              Progress analytics &middot; DSA practice &middot; Personalized study plans
            </p>
            
            <div className="reveal-animate flex flex-col sm:flex-row items-center gap-4" style={{animationDelay: '0.7s'}}>
              <button 
                onClick={() => navigate('/features')}
                className="flex cursor-pointer items-center gap-2 bg-white text-black font-semibold font-sans px-8 py-3 rounded-none hover:bg-gray-200 transition-colors"
              >
                LAUNCH HUB <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => window.electronAPI?.openSourceFolder()}
                className="flex items-center gap-2 bg-transparent text-white border border-blueprint-line font-mono px-8 py-3 rounded-none hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Code2 size={18} /> VIEW SOURCE
              </button>
            </div>
          </div>
        </section>

        {/* BENTO GRID (FEATURES) */}
        <section className="bg-blueprint-line flex flex-col gap-[1px]">
          <div className="bg-background p-8 md:px-12">
            <h2 className="font-sans text-3xl font-semibold text-white mb-2">Features</h2>
            <p className="font-mono text-sm text-gray-500">Everything a student needs, powered by AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]">
            <div className="bg-background flex flex-col p-10 min-h-[280px] group relative overflow-hidden">
              <BotMessageSquare className="text-indigo-400 mb-6" size={32} />
              <h3 className="font-sans text-2xl font-semibold mb-3">AI Chat Assistant</h3>
              <p className="font-mono text-gray-500 text-sm flex-1 leading-relaxed">Ask about your schedule, assignments, progress — Newton AI understands your intent and fetches real-time data.</p>
              <div className="mt-8 font-mono text-xs uppercase text-gray-600 border border-white/10 inline-block px-2 py-1 bg-white/5 self-start">CLAUDE_POWERED</div>
            </div>
            <div className="bg-background flex flex-col p-10 min-h-[280px] group relative overflow-hidden">
              <CalendarDays className="text-pink-400 mb-6" size={32} />
              <h3 className="font-sans text-2xl font-semibold mb-3">Smart Schedule</h3>
              <p className="font-mono text-gray-500 text-sm flex-1 leading-relaxed">Color-coded calendar view of upcoming classes, contests, and deadlines — synced via Newton MCP endpoints.</p>
              <div className="mt-8 font-mono text-xs uppercase text-gray-600 border border-white/10 inline-block px-2 py-1 bg-white/5 self-start">MCP_CALENDAR</div>
            </div>
            <div className="bg-background flex flex-col p-10 min-h-[280px] group relative overflow-hidden">
              <ClipboardList className="text-amber-400 mb-6" size={32} />
              <h3 className="font-sans text-2xl font-semibold mb-3">Assignment Tracker</h3>
              <p className="font-mono text-gray-500 text-sm flex-1 leading-relaxed">Never miss a deadline. Track pending, upcoming, and overdue assignments with status badges and priority alerts.</p>
              <div className="mt-8 font-mono text-xs uppercase text-gray-600 border border-white/10 inline-block px-2 py-1 bg-white/5 self-start">DEADLINE_WATCH</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]">
            <div className="bg-background flex flex-col sm:flex-row p-10 min-h-[250px] relative overflow-hidden items-start gap-8">
              <div className="flex-1">
                <BarChart3 className="text-emerald-400 mb-6" size={32} />
                <h3 className="font-sans text-2xl font-semibold mb-3">Progress Dashboard</h3>
                <p className="font-mono text-gray-500 text-sm leading-relaxed max-w-sm">Visualize subject-wise completion with progress bars. Identify weak topics at a glance and focus your energy.</p>
              </div>
              <div className="w-full sm:w-1/2 h-full min-h-[150px] border border-blueprint-line bg-black/50 relative flex flex-col justify-center p-6 gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-400 w-20">DSA</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-none overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{width: '65%'}}></div></div>
                  <span className="font-mono text-xs text-indigo-300">65%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-400 w-20">Web Dev</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-none overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{width: '85%'}}></div></div>
                  <span className="font-mono text-xs text-indigo-300">85%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-400 w-20">Sys Design</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-none overflow-hidden"><div className="h-full bg-gradient-to-r from-red-500 to-amber-500" style={{width: '20%'}}></div></div>
                  <span className="font-mono text-xs text-amber-300">20%</span>
                </div>
              </div>
            </div>
            <div className="bg-background flex flex-col sm:flex-row p-10 min-h-[250px] relative overflow-hidden items-start gap-8">
              <div className="flex-1">
                <Code2 className="text-cyan-400 mb-6" size={32} />
                <h3 className="font-sans text-2xl font-semibold mb-3">DSA Coding Helper</h3>
                <p className="font-mono text-gray-500 text-sm leading-relaxed max-w-sm">Search practice problems by topic — Arrays, Trees, DP — with difficulty badges. Level up your coding skills.</p>
              </div>
              <div className="w-full sm:w-1/2 h-full min-h-[150px] border border-blueprint-line bg-black/50 relative flex flex-col justify-center p-6 gap-2">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-xs text-white">Two Sum</span>
                  <span className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 bg-emerald-500/10">EASY</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-xs text-white">Merge Intervals</span>
                  <span className="font-mono text-[10px] text-amber-400 border border-amber-500/30 px-1.5 py-0.5 bg-amber-500/10">MED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-white">Serialize Tree</span>
                  <span className="font-mono text-[10px] text-red-400 border border-red-500/30 px-1.5 py-0.5 bg-red-500/10">HARD</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]">
            <div className="bg-background flex flex-col p-10 min-h-[200px]">
              <BookOpen className="text-violet-400 mb-6" size={32} />
              <h3 className="font-sans text-2xl font-semibold mb-3">AI Study Planner</h3>
              <p className="font-mono text-gray-500 text-sm flex-1 leading-relaxed">Get a personalized weekly timetable generated by AI. It analyzes your weak subjects and pending assignments to optimize your study time.</p>
              <div className="mt-8 font-mono text-xs uppercase text-gray-600 border border-white/10 inline-block px-2 py-1 bg-white/5 self-start">AI_GENERATED</div>
            </div>
            <div className="bg-background flex flex-col p-10 min-h-[200px]">
              <Bell className="text-rose-400 mb-6" size={32} />
              <h3 className="font-sans text-2xl font-semibold mb-3">Desktop Notifications</h3>
              <p className="font-mono text-gray-500 text-sm flex-1 leading-relaxed">Native OS notifications remind you about overdue and upcoming assignments the moment you launch the app. Never miss a deadline again.</p>
              <div className="mt-8 font-mono text-xs uppercase text-gray-600 border border-white/10 inline-block px-2 py-1 bg-white/5 self-start">NATIVE_ALERTS</div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="p-12 flex flex-col md:flex-row justify-between items-center text-center gap-6">
          <div className="flex items-center">
            <span className="font-mono font-bold text-sm tracking-tight text-white uppercase">NST-X App</span>
          </div>
          <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
            Capstone Project &middot; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingView;
