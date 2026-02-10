
import React, { useState } from 'react';
import { Task, AIPlanResponse } from '../types';
import { getSmartSchedule } from '../services/geminiService';
import { Icons } from '../constants';

interface AIPlannerProps {
  tasks: Task[];
}

const AIPlanner: React.FC<AIPlannerProps> = ({ tasks }) => {
  const [brainDump, setBrainDump] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIPlanResponse | null>(null);

  const handleOptimize = async () => {
    if (!brainDump.trim() && tasks.length === 0) return;
    
    setLoading(true);
    const existingStr = tasks.map(t => t.title).join(', ');
    const res = await getSmartSchedule(brainDump, existingStr);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn bg-white dark:bg-zinc-900 min-h-full transition-colors duration-300">
      <header>
        <h2 className="text-green-600/60 dark:text-green-400/40 text-sm font-medium">Zen AI Coach</h2>
        <h1 className="text-3xl font-bold font-outfit text-green-950 dark:text-white">Optimize My Day</h1>
      </header>

      {!result && !loading ? (
        <div className="space-y-6">
          <div className="bg-green-50/30 dark:bg-zinc-800 border border-green-50 dark:border-zinc-700 rounded-3xl p-6 shadow-sm">
            <h3 className="text-green-950 dark:text-zinc-200 font-bold mb-2 font-outfit text-lg">Brain Dump</h3>
            <p className="text-green-900/60 dark:text-zinc-500 text-xs mb-4">Tell me what's on your mind. I'll turn your chaos into a calm, effective schedule.</p>
            <textarea 
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              placeholder="e.g. I need to pick up dry cleaning, finish the report by 3pm, and I really want to go for a run..."
              className="w-full bg-white dark:bg-zinc-900 rounded-2xl p-4 text-sm outline-none border border-green-100 dark:border-zinc-700 focus:ring-2 focus:ring-green-400/20 min-h-[180px] resize-none shadow-sm text-green-950 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-700"
            />
          </div>
          <button 
            onClick={handleOptimize}
            className="w-full bg-green-600 dark:bg-zinc-950 text-white font-bold py-5 rounded-2xl shadow-xl shadow-green-100 dark:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Icons.Coach />
            <span>Generate Smart Schedule</span>
          </button>
        </div>
      ) : result && !loading ? (
        <div className="space-y-6 animate-slideUp">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 border border-green-50 dark:border-zinc-700 shadow-lg shadow-green-50 dark:shadow-none">
            <p className="text-sm italic text-green-600 dark:text-green-400 font-black mb-4 leading-tight">"{result.motivationalQuote}"</p>
            <p className="text-green-950 dark:text-zinc-200 text-sm leading-relaxed font-medium">{result.summary}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold font-outfit text-green-950 dark:text-zinc-200 flex items-center gap-2 ml-1">
              <span className="w-1.5 h-6 bg-green-600 rounded-full inline-block"></span>
              Your Optimized Path
            </h3>
            <div className="space-y-4">
              {result.recommendedSchedule.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start relative pl-4">
                  {idx !== result.recommendedSchedule.length - 1 && (
                    <div className="absolute left-[19px] top-7 bottom-[-16px] w-0.5 bg-green-50 dark:bg-zinc-800"></div>
                  )}
                  
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 mt-2 z-10 ring-4 ring-white dark:ring-zinc-900 shadow-sm"></div>
                  
                  <div className="flex-1 bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-green-50 dark:border-zinc-700 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">{item.time}</span>
                      <span className="text-[9px] bg-green-50 dark:bg-zinc-900 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-black uppercase">{item.duration}</span>
                    </div>
                    <h4 className="text-sm font-bold text-green-950 dark:text-white">{item.activity}</h4>
                    <span className="text-[10px] text-green-600/50 dark:text-zinc-500 uppercase font-black tracking-tighter mt-1 block">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="w-full bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-bold py-4 rounded-2xl active:scale-95 transition-all border border-slate-100 dark:border-zinc-700"
          >
            Start Over
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-50 dark:border-zinc-800 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-green-600 dark:text-green-400">
               <Icons.Coach />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-green-950 dark:text-zinc-200 text-lg">Zen AI is Thinking...</h3>
            <p className="text-green-800/40 dark:text-zinc-600 text-xs mt-1 italic font-medium">Balancing your priorities for maximum peace</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;
