
import React, { useState } from 'react';
import { Task } from '../types';
import { Icons, COLORS } from '../constants';

interface DashboardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle);
      setNewTaskTitle('');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'work': return 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300';
      case 'health': return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'urgent': return 'bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn bg-white dark:bg-zinc-900 min-h-full">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-green-600/60 dark:text-green-400/40 text-sm font-medium">Daily Focus</h2>
          <h1 className="text-3xl font-bold font-outfit text-green-950 dark:text-white">Hello, Planner!</h1>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-green-600 dark:bg-zinc-950 flex items-center justify-center text-white shadow-lg shadow-green-100 dark:shadow-none">
          <Icons.Journal size={28} />
        </div>
      </header>

      <div className="bg-gradient-to-br from-green-600 to-green-800 dark:from-green-900 dark:to-zinc-950 rounded-3xl p-6 text-white shadow-xl shadow-green-100 dark:shadow-none relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-green-100 text-sm mb-1 opacity-80">Your daily goal</p>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold font-outfit">{progress === 100 ? 'Day Complete! 🌿' : `${Math.round(progress)}% Completion`}</h3>
            <span className="text-sm bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">{completedCount}/{tasks.length}</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-green-400 h-full transition-all duration-700 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="I need to..." 
          className="flex-1 bg-white dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600/20 dark:focus:ring-green-400/20 transition-all text-sm shadow-sm dark:text-white"
        />
        <button 
          type="submit"
          className="bg-green-600 dark:bg-zinc-950 text-white p-3 rounded-2xl shadow-md hover:bg-green-700 active:scale-90 transition-all"
        >
          <Icons.Plus />
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-outfit text-green-950 dark:text-zinc-200 px-1">Upcoming</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                task.completed 
                  ? 'bg-slate-50 dark:bg-zinc-800/40 border-slate-100 dark:border-zinc-800 opacity-60' 
                  : 'bg-white dark:bg-zinc-800 border-green-50 dark:border-zinc-700 shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                task.completed ? 'bg-green-600 border-green-600 text-white' : 'border-green-200 dark:border-zinc-600'
              }`}>
                {task.completed && <Icons.Check />}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-semibold transition-all ${task.completed ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-green-950 dark:text-white'}`}>
                  {task.title}
                </h4>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 bg-slate-50 dark:bg-zinc-800/40 rounded-3xl border border-dashed border-green-100 dark:border-zinc-700">
              <p className="text-sm text-green-900/30 dark:text-zinc-600 font-medium">Your path is clear today.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
