import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-slate-200">
              L
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-tight uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              LanguaLearn AI
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
            Master languages through <span className="text-slate-400">real context.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            Stop memorizing disconnected lists. LanguaLearn generates bespoke lessons for your specific life scenarios using Gemini 3.0.
          </p>
          
          <div className="pt-10">
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center gap-3 mx-auto group active:scale-95"
            >
              Start Your Journey
              <i className="fa-solid fa-arrow-right text-xs opacity-50 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <p className="mt-8 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">Engineered for Excellence</p>
          </div>
        </div>
      </section>

      {/* Subtle Features */}
      <section className="py-24 px-6 border-t border-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="text-slate-900 font-bold flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
              <i className="fa-solid fa-bolt-lightning text-indigo-600"></i> Context-First
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">Describe any situation—from a coffee date in Rome to a technical interview in Berlin—and get a custom curriculum instantly.</p>
          </div>
          <div className="space-y-4">
            <div className="text-slate-900 font-bold flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
              <i className="fa-solid fa-volume-high text-indigo-600"></i> Native Audio
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">Crystal-clear speech synthesis for every vocabulary item and phrase, ensuring your pronunciation is spot-on from day one.</p>
          </div>
          <div className="space-y-4">
            <div className="text-slate-900 font-bold flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
              <i className="fa-solid fa-brain text-indigo-600"></i> Smart Grammar
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">Targeted linguistic insights that highlight specific patterns within context, making complex rules intuitive to understand.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;