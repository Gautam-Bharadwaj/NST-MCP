import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bot, Calendar, CalendarClock, Brain, Activity, 
  Code2, Flame, Sparkles, Settings, Sun, Moon,
  TerminalSquare, ChevronLeft, Hexagon
} from 'lucide-react';

import ChatView from './components/ChatView';
import ScheduleView from './components/ScheduleView';
import RecentLecturesView from './components/RecentLecturesView';
import ProgressView from './components/ProgressView';
import DSAHelperView from './components/DSAHelperView';
import LandingView from './components/LandingView';
import SettingsView from './components/SettingsView';
import FeaturesView from './components/FeaturesView';

const TopNavbar = ({ stats, isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/features', icon: Hexagon, label: 'Features' },
    { to: '/chat', icon: Bot, label: 'Chat' },
    { to: '/schedule', icon: Calendar, label: 'Matrix' },
    { to: '/dsa', icon: Code2, label: 'Arena' },
    { to: '/progress', icon: Activity, label: 'Progress' },
    { to: '/recent', icon: CalendarClock, label: 'Recent' },
  ];

  return (
    <header className="w-full h-16 bg-[#050505] border-b border-white/10 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Background Decor */}
      <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none"></div>

      {/* Brand */}
      <div 
        className="flex items-center cursor-pointer group relative z-10" 
        onClick={() => navigate('/')}
      >
        <span className="font-bold text-white tracking-[0.3em] text-sm uppercase">NST-X</span>
      </div>

      {/* Navigation Tools Container (Square Navbar Style) */}
      <nav className="hidden md:flex items-center gap-1 border border-white/10 bg-white/[0.02] p-1 relative z-10 opacity-90 hover:opacity-100 transition-opacity">
        {navLinks.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({isActive}) => `
              flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 relative group
              ${isActive ? 'text-black bg-white font-bold' : 'text-gray-500 hover:text-white hover:bg-white/10'}
            `}
          >
             <link.icon size={14} className="shrink-0" />
             <span className="relative z-10">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Utilities */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-1 border-white/10 pl-4">
           <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-500 hover:text-white transition-all bg-transparent hover:bg-white/10 flex items-center justify-center"
            title="Toggle Theme Protocol"
          >
            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>
           <button 
            onClick={() => navigate('/settings')}
            className={`p-2 transition-all flex items-center justify-center ${location.pathname === '/settings' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
            title="System Settings"
          >
            <Settings size={16} className={`${location.pathname === '/settings' ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const isLanding = location.pathname === '/';

  useEffect(() => {
    document.body.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);

  if (isLanding) {
    return <LandingView />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-[#f3f4f6] font-sans selection:bg-cyan-500/30">
      
      {/* Top Navbar */}
      <TopNavbar stats={stats} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Execution Area */}
      <main className="flex-1 overflow-hidden relative z-10 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.05),_transparent_50%),_var(--tw-gradient-stops)] via-[#050505] to-[#050505] flex items-center justify-center p-4 md:p-8">
         
         {/* Feature Box Area */}
         <div className="w-full max-w-7xl h-full border border-white/10 bg-black/60 shadow-[0_0_100px_rgba(255,255,255,0.02)] relative flex flex-col overflow-hidden backdrop-blur-3xl group">
            
            {/* Box Header Toolbar (Optional inner back button or breadcrumbs) */}
            <div className="h-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between px-4 shrink-0 transition-all opacity-50 group-hover:opacity-100">
               <button 
                 onClick={() => navigate(-1)} 
                 className="flex items-center gap-1 text-[9px] font-mono text-gray-500 hover:text-cyan-400 uppercase tracking-[0.2em] transition-all"
               >
                 <ChevronLeft size={12} /> Return_Signal
               </button>
               <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                 Box_Container_Active
               </div>
            </div>

            {/* Inner Content Area specifically for tools */}
            <div className="flex-1 overflow-y-auto w-full relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
               <Routes>
                 <Route path="/features" element={<FeaturesView />} />
                 <Route path="/chat" element={<ChatView />} />
                 <Route path="/schedule" element={<ScheduleView />} />
                 <Route path="/recent" element={<RecentLecturesView />} />
                 <Route path="/progress" element={<ProgressView />} />
                 <Route path="/dsa" element={<DSAHelperView />} />
                 <Route path="/settings" element={<SettingsView />} />
              </Routes>
            </div>

         </div>

      </main>
    </div>
  );
}

export default App;
