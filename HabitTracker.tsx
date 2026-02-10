
import React, { useState } from 'react';
import { Habit } from '../types';
import { Icons, COLORS } from '../constants';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (title: string, color: string) => void;
  onRemoveHabit: (id: string) => void;
}

const HABIT_COLORS = [
  '#16a34a', // Slightly Lighter Green
  '#0d9488', // Teal
  '#4338ca', // Indigo
  '#be185d', // Pink
  '#dc2626', // Lighter Red
  '#a21caf', // Purple
  '#ea580c', // Orange
];

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit, onRemoveHabit }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  const anyHabitsCompletedToday = habits.length > 0 && habits.some(h => h.completedToday);
  const currentDayIndex = new Date().getDay(); 
  const daysMap = [6, 0, 1, 2, 3, 4, 5]; 
  const displayIndex = daysMap[currentDayIndex];

  const handleAddHabit = () => {
    if (newTitle.trim()) {
      onAddHabit(newTitle, selectedColor);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fadeIn bg-white dark:bg-zinc-900 min-h-full">
      <header>
        <h2 className="text-green-600/60 dark:text-green-400/40 text-sm font-medium">Daily Rituals</h2>
        <h1 className="text-3xl font-bold font-outfit text-green-950 dark:text-white">Habit Tracker</h1>
      </header>

      {isAdding && (
        <div className="bg-green-50/50 dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 rounded-3xl p-5 space-y-4 animate-slideDown shadow-sm">
          <h3 className="font-bold font-outfit text-green-900 dark:text-green-400 text-lg">New Habit</h3>
          <div className="space-y-4">
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What habit will you build?"
              className="w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-sm outline-none border border-green-100 dark:border-zinc-700 shadow-sm dark:text-white"
            />
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-green-600 dark:border-green-400 scale-110 shadow-md' : 'border-transparent opacity-60'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleAddHabit}
                className="flex-1 bg-green-600 dark:bg-zinc-950 text-white font-bold py-3 rounded-2xl text-sm active:scale-95 transition-all shadow-md"
              >
                Create Habit
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 bg-white dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 text-green-600 dark:text-zinc-400 font-bold py-3 rounded-2xl text-sm active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            onClick={() => onToggleHabit(habit.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-3 ${
              habit.completedToday 
                ? 'bg-white dark:bg-zinc-800 border-green-500/20 shadow-md ring-2 ring-green-100 dark:ring-green-900/30' 
                : 'bg-white dark:bg-zinc-800 border-green-50 dark:border-zinc-700 shadow-sm'
            }`}
          >
            <div 
              className={`absolute inset-0 transition-opacity duration-500 ${habit.completedToday ? 'opacity-5' : 'opacity-0'}`} 
              style={{ backgroundColor: habit.color }}
            />
            
            <div 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                habit.completedToday ? 'scale-110 shadow-lg' : 'opacity-30 grayscale'
              }`}
              style={{ 
                backgroundColor: habit.completedToday ? habit.color : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#27272a' : '#f1f5f9'), 
                color: habit.completedToday ? 'white' : '#64748b' 
              }}
            >
              <Icons.Check />
            </div>

            <div className="text-center z-10">
              <h3 className={`text-sm font-bold font-outfit truncate w-24 ${habit.completedToday ? 'text-green-950 dark:text-white' : 'text-slate-400 dark:text-zinc-600'}`}>
                {habit.title}
              </h3>
              <p className="text-[10px] text-green-700/60 dark:text-green-400/40 font-black uppercase tracking-widest mt-1">
                🔥 {habit.streak} DAY STREAK
              </p>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); if(confirm("Delete habit?")) onRemoveHabit(habit.id); }}
              className="absolute bottom-1 right-2 p-1 text-rose-100 hover:text-rose-300 dark:text-zinc-700 dark:hover:text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>

            {habit.completedToday && (
              <div className="absolute top-3 right-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm animate-pulse"></div>
              </div>
            )}
          </div>
        ))}

        <button 
          onClick={() => setIsAdding(true)}
          className="p-5 rounded-3xl border border-dashed border-green-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 text-green-300 dark:text-zinc-700 hover:border-green-400 hover:text-green-500 dark:hover:text-green-400 transition-all bg-slate-50/50 dark:bg-zinc-800/40 min-h-[140px]"
        >
          <Icons.Plus />
          <span className="text-xs font-bold font-outfit">New Habit</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-green-50 dark:border-zinc-700">
        <h3 className="text-sm font-bold text-green-950 dark:text-zinc-200 mb-6 flex justify-between items-center">
          Weekly Snapshot
          <span className="text-[9px] font-black bg-green-50 dark:bg-zinc-900 text-green-700 dark:text-green-400 px-2 py-1 rounded-full uppercase tracking-tighter">Current Week</span>
        </h3>
        <div className="flex justify-between gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const isToday = i === displayIndex;
            const isDone = isToday && anyHabitsCompletedToday;
            
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                  isDone 
                    ? 'bg-green-600 border-green-600 text-white shadow-md' 
                    : isToday 
                      ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-400 dark:text-green-600' 
                      : 'border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-100 dark:text-zinc-800'
                }`}>
                  {isDone ? <Icons.Check /> : ''}
                </div>
                <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-green-800 dark:text-green-500' : 'text-slate-200 dark:text-zinc-700'}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
