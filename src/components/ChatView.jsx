import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Terminal, Code2, Calendar, CalendarClock, Activity, Brain, Trash2, Plus, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatView = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef(null);
  
  const CHAT_SESSIONS_KEY = 'newton_chat_sessions';

  const defaultMessage = {
    role: 'assistant',
    content: "Hi! I'm NST-X, your personal study assistant.\n\nAsk me about your schedule, recent lectures, progress, or for DSA practice!\n\n_Try typing `/schedule` or `/recent` for instant data feeds._",
  };

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [defaultMessage]
    };
    return newSession;
  };

  // 1. Initial Load from memory
  useEffect(() => {
    const loadMemory = async () => {
      let savedMemory = null;
      if (window.electronAPI) {
        savedMemory = await window.electronAPI.storeGet(CHAT_SESSIONS_KEY);
      } else {
        const local = localStorage.getItem(CHAT_SESSIONS_KEY);
        if (local) savedMemory = JSON.parse(local);
      }

      if (savedMemory && Array.isArray(savedMemory) && savedMemory.length > 0) {
        setSessions(savedMemory);
        setActiveSessionId(savedMemory[0].id);
      } else {
        const init = createNewSession();
        setSessions([init]);
        setActiveSessionId(init.id);
      }
    };
    loadMemory();
  }, []);

  // 2. Auto-save memory on update
  useEffect(() => {
    if (sessions.length > 0) {
      if (window.electronAPI) {
        window.electronAPI.storeSet(CHAT_SESSIONS_KEY, sessions);
      } else {
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, streamingContent, isLoading]);

  // 3. Listen for streaming chunks
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onReplyChunk((event, chunk) => {
        setStreamingContent(prev => prev + chunk);
      });
    }
  }, []);

  const handleNewChat = () => {
    const ns = createNewSession();
    setSessions(prev => [ns, ...prev]);
    setActiveSessionId(ns.id);
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
       const ns = createNewSession();
       setSessions([ns]);
       setActiveSessionId(ns.id);
    } else {
       setSessions(updated);
       if (activeSessionId === id) setActiveSessionId(updated[0].id);
    }
  };

  // Browser Fallback for AI
  const browserFallbackAI = async (query) => {
    const q = query.toLowerCase();
    let intent = 'general';
    let dataPayload = null;
    let content = "I am operating in **Local Simulation Mode** (via Web Browser).\n\nAs your NST-X assistant, you can ask me to fetch your `/recent`, compile your `/schedule`, or analyze your `/progress`.";

    if (q.includes('schedule') || q.includes('/schedule')) {
      intent = 'schedule';
      content = "Here is your upcoming schedule. You have **classes and contests** coming up soon. Stay sharp!";
      dataPayload = [{ id: '1', title: 'React Hooks Deep Dive', date: new Date().toISOString(), type: 'class' }, { id: '2', title: 'Weekly Contest #112', date: new Date(Date.now() + 86400000).toISOString(), type: 'contest' }];
    } else if (q.includes('recent') || q.includes('/recent')) {
       intent = 'recent';
       content = "These are your most recent lectures. Make sure to catch up if you missed any!";
       dataPayload = [{ id: 'A1', title: 'Trees Traversal', is_attended: true }, { id: 'A2', title: 'Graphs BFS', is_attended: false }];
    } else if (q.includes('progress')) {
       intent = 'progress';
       content = "System analysis shows your progress is looking good in **Web Dev**, but System Design needs more focus.";
       dataPayload = [{ subject: 'DSA', progress: 85 }, { subject: 'Web Dev', progress: 70 }, { subject: 'Sys Design', progress: 40 }];
    }

    // Simulate streaming by typing it out manually
    const textChunks = content.split(' ');
    for(let i=0; i < textChunks.length; i++) {
        setStreamingContent(prev => prev + textChunks[i] + ' ');
        await new Promise(r => setTimeout(r, 40));
    }
    
    return { role: 'assistant', content, intent, dataPayload };
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeSession) return;

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // Optimistically update UI
    let updatedTitle = activeSession.title;
    if (activeSession.messages.length === 1 && activeSession.title === 'New Chat') {
        updatedTitle = userMsg.length > 20 ? userMsg.substring(0, 20) + '...' : userMsg;
    }

    const newHistory = [...activeSession.messages, { role: 'user', content: userMsg }];
    
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title: updatedTitle, messages: newHistory } : s));

    try {
        const historyContext = newHistory.map(m => ({ role: m.role, content: m.content }));
        
        let finalResponse;
        if (window.electronAPI) {
            finalResponse = await window.electronAPI.sendQuery(userMsg, historyContext);
        } else {
            finalResponse = await browserFallbackAI(userMsg);
        }

        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, finalResponse] } : s));
    } catch {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, { role: 'assistant', content: '`CRITICAL FAILURE: Neural engine disconnected.`' }] } : s));
    } finally {
        setIsLoading(false);
        setStreamingContent('');
    }
  };

  const renderDataPayload = (msg) => {
    if (!msg.dataPayload || !msg.intent) return null;

    const intentIcon = {
      schedule: <Calendar size={14} className="text-pink-400" />,
      recent: <CalendarClock size={14} className="text-amber-400" />,
      dsa: <Code2 size={14} className="text-cyan-400" />,
      progress: <Activity size={14} className="text-emerald-400" />,
      'study-plan': <Brain size={14} className="text-indigo-400" />
    };

    return (
      <div className="mt-4 p-4 bg-black/60 border border-white/10 shadow-inner group">
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">
          {intentIcon[msg.intent] || <Terminal size={14} />}
          {msg.intent}_DATA_STREAM
          <span className="ml-auto flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>LIVE</span>
        </div>
        
        <div className="space-y-3">
          {msg.intent === 'schedule' && msg.dataPayload.map(ev => (
            <div key={ev.id} className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-gray-300">{ev.title}</span>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 border border-white/10 text-gray-500 uppercase">{ev.date && new Date(ev.date).toLocaleDateString()}</span>
            </div>
          ))}
          
          {msg.intent === 'recent' && Array.isArray(msg.dataPayload) && msg.dataPayload.map(a => (
            <div key={a.id || a.title} className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-gray-300">{a.title || a.name || 'Lecture'}</span>
              <span className={`text-[10px] px-2 py-0.5 border uppercase text-amber-400 border-amber-500/30 bg-amber-500/10`}>
                DONE
              </span>
            </div>
          ))}

          {msg.intent === 'dsa' && msg.dataPayload.map(p => (
            <div key={p.id} className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-gray-300">{p.title}</span>
              <span className="text-[10px] text-cyan-400 border border-cyan-500/30 px-2 py-0.5 bg-cyan-500/10">{p.difficulty}</span>
            </div>
          ))}

          {msg.intent === 'progress' && msg.dataPayload.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">{item.subject}</span>
                <span className="text-cyan-400">{item.progress}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-none overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500" style={{ width: `${item.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MarkdownRenderer = ({ content }) => {
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            const isBlock = match || String(children).includes('\n')
            return isBlock ? (
              <div className="my-4 bg-black border border-white/10 p-4 font-mono text-xs overflow-x-auto rounded-none">
                <div className="text-[9px] text-gray-500 uppercase mb-2 select-none border-b border-white/5 pb-2 tracking-widest">{match ? match[1] : 'code'}</div>
                <code className={className} {...props}>{children}</code>
              </div>
            ) : (
              <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 font-mono text-xs mx-1 border border-white/5 rounded-none" {...props}>
                {children}
              </code>
            )
          },
          p({children}) { return <p className="mb-4 last:mb-0 leading-relaxed tracking-wide text-sm">{children}</p> },
          a({children, href}) { return <a href={href} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">{children}</a> },
          ul({children}) { return <ul className="list-disc list-inside mb-4 text-sm text-gray-300 marker:text-cyan-500">{children}</ul> },
          ol({children}) { return <ol className="list-decimal list-inside mb-4 text-sm text-gray-300">{children}</ol> },
          strong({children}) { return <strong className="font-bold text-white tracking-wide">{children}</strong> }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#080808] text-white animate-in fade-in duration-500">
      
      {/* Sidebar: Chat History */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#050505]">
        <div className="p-4 border-b border-white/10 shrink-0">
          <button 
            onClick={handleNewChat}
            className="w-full flex justify-center items-center gap-2 border border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white p-3 rounded-md transition-all text-sm font-medium tracking-wide group"
          >
            <Plus size={16} className="text-cyan-400 group-hover:rotate-90 transition-transform duration-300" /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
          {sessions.map(s => (
             <div 
               key={s.id}
               onClick={() => setActiveSessionId(s.id)}
               className={`flex justify-between items-center group p-3 cursor-pointer rounded-md transition-all ${
                 s.id === activeSessionId ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400'
               }`}
             >
                <div className="flex items-center gap-3 overflow-hidden">
                   <MessageSquare size={14} className={s.id === activeSessionId ? "text-cyan-400" : "text-gray-500"} shrink-0 />
                   <span className="text-sm truncate w-full tracking-wide">{s.title}</span>
                </div>
                <button 
                   onClick={(e) => handleDeleteSession(e, s.id)}
                   className={`shrink-0 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all ${s.id === activeSessionId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                   <Trash2 size={12} />
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
         <header className="absolute top-0 w-full h-12 bg-gradient-to-b from-[#080808] to-transparent z-10 pointer-events-none"></header>
         
         {/* Messages Scroll View */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-12 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 flex  items-center justify-center shrink-0 rounded-md ${
                      msg.role === 'user' ? 'bg-cyan-500 text-black' : 'bg-white/10 border border-white/20 text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[85%] space-y-2`}>
                      <div className={`text-[15px] ${
                        msg.role === 'user' ? 'text-gray-200 bg-white/5 px-4 py-3 rounded-2xl rounded-tr-sm' : 'text-gray-300'
                      }`}>
                        <MarkdownRenderer content={msg.content} />
                        {renderDataPayload(msg)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Streaming active message indicator */}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-white/10 border border-white/20 text-cyan-500 flex items-center justify-center shrink-0 rounded-md">
                      <Bot size={16} className="animate-pulse" />
                    </div>
                    <div className={`max-w-[85%] space-y-2`}>
                      <div className={`text-[15px] text-gray-300`}>
                        {streamingContent ? (
                           <MarkdownRenderer content={streamingContent} />
                        ) : (
                          <div className="flex items-center gap-2 text-cyan-500 mt-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
             </div>
         </div>

         {/* Input Box Area */}
         <div className="p-4 bg-gradient-to-t from-[#080808] via-[#080808] to-transparent">
             <div className="max-w-3xl mx-auto relative group flex items-center">
                 <input 
                    type="text" 
                    placeholder="Message Neural Engine..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(e); }}
                    disabled={isLoading}
                    className="w-full bg-[#1e1e24] border border-white/10 rounded-xl p-4 pr-12 text-white placeholder:text-gray-500 focus:border-cyan-500/50 outline-none transition-all text-sm shadow-lg"
                 />
                 <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 p-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-all active:scale-95 disabled:opacity-20 disabled:active:scale-100 disabled:bg-white text-white disabled:text-gray-500"
                 >
                    <Send size={18} className={input.trim() ? "text-white" : "text-black"} />
                 </button>
             </div>
             <div className="text-center mt-3 text-[10px] text-gray-500 tracking-wide font-mono">
                Neural Engine can make mistakes. Verify critical dates.
             </div>
         </div>
      </div>

    </div>
  );
};

export default ChatView;
