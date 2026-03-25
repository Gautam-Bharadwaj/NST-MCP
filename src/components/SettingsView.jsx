import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, User, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

const SettingsView = () => {
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      if (window.electronAPI) {
        const savedKey = await window.electronAPI.storeGet('anthropic_api_key');
        const savedName = await window.electronAPI.storeGet('user_name');
        if (savedKey) setApiKey(savedKey);
        if (savedName) setUserName(savedName || 'Newton Learner');
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (window.electronAPI) {
      await window.electronAPI.storeSet('anthropic_api_key', apiKey);
      await window.electronAPI.storeSet('user_name', userName);
      setSaveStatus('Settings saved successfully!');
    } else {
      setSaveStatus('Error: Storage only available in Desktop App');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="p-8 pb-12 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <SettingsIcon size={32} className="text-indigo-400" />
          System Settings
        </h1>
        <p className="text-gray-400 font-mono text-sm">Configure your AI identity and external API integrations.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Settings */}
        <section className="bg-white/5 border border-white/10 p-8 space-y-6 overflow-hidden relative">
          <div className="flex items-center gap-3 mb-2 underline decoration-indigo-500/30 underline-offset-8">
            <User size={20} className="text-indigo-400" />
            <h2 className="text-lg font-semibold text-white uppercase tracking-wider">User Identity</h2>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-500 uppercase">Display Name</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-black/50 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </section>

        {/* API Settings */}
        <section className="bg-white/5 border border-white/10 p-8 space-y-6 relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2 underline decoration-purple-500/30 underline-offset-8">
              <Key size={20} className="text-purple-400" />
              <h2 className="text-lg font-semibold text-white uppercase tracking-wider">AI Integration</h2>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-mono bg-emerald-500/10 px-2 py-1 uppercase border border-emerald-500/20">
              <ShieldCheck size={12} /> Encrypted at rest
            </div>
          </div>
          
          <p className="text-xs text-gray-500 font-mono leading-relaxed">
            Provide your **Anthropic API Key** to enable real-time Claude 3.5 Sonnet processing. 
            If left empty, the app will use the local simulation neural-engine.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-gray-500 uppercase">Anthropic API Key</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-black/50 border border-white/10 p-3 text-white font-mono focus:border-purple-500 outline-none transition-all pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                    <Key size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {saveStatus && (
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm animate-in fade-in slide-in-from-left duration-300">
                <CheckCircle2 size={16} /> {saveStatus}
              </div>
            )}
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-black font-bold font-sans px-8 py-3 hover:bg-gray-200 transition-all active:scale-95"
          >
            <Save size={18} /> SAVE CONFIGURATION
          </button>
        </div>
      </div>

      <div className="mt-12 p-6 border border-white/5 bg-white/[0.02] rounded-none">
        <h3 className="text-xs font-mono text-gray-600 uppercase mb-4 tracking-widest text-center">System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono text-gray-400 uppercase text-center">
            <div>VERSION: 1.2.0-BF</div>
            <div>STATUS: ONLINE</div>
            <div>ENCRYPTION: AES-256</div>
            <div className="cursor-pointer hover:text-cyan-400 transition-colors underline underline-offset-4" onClick={() => window.electronAPI?.openSourceFolder()}>OPEN_PROJECT_DIR</div>
            <div>NODE: {window.navigator.platform}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
