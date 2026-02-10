
import React, { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '../types';
import { Icons } from '../constants';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onRemoveEvent: (id: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, onAddEvent, onUpdateEvent, onRemoveEvent, selectedDate, onDateChange 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [currentTimePos, setCurrentTimePos] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update red line position
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      if (today === selectedDate) {
        const hour = now.getHours();
        const mins = now.getMinutes();
        const totalHour = hour + mins / 60;
        
        if (totalHour >= 6 && totalHour <= 24) {
          const pixelsFromTop = (totalHour - 6) * 80;
          setCurrentTimePos(pixelsFromTop);
        } else {
          setCurrentTimePos(null);
        }
      } else {
        setCurrentTimePos(null);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const handleSave = () => {
    if (newTitle.trim()) {
      const [sH, sM] = startTime.split(':').map(Number);
      const [eH, eM] = endTime.split(':').map(Number);
      
      const eventData: CalendarEvent = {
        id: editingId || Date.now().toString(),
        title: newTitle,
        date: selectedDate,
        startHour: sH + sM / 60,
        endHour: eH + eM / 60,
        category: 'work'
      };

      if (editingId) {
        onUpdateEvent(eventData);
      } else {
        onAddEvent(eventData);
      }
      
      resetForm();
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setEditingId(null);
    setIsAdding(false);
  };

  const startEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setNewTitle(event.title);
    
    const sH = Math.floor(event.startHour);
    const sM = Math.round((event.startHour % 1) * 60);
    const eH = Math.floor(event.endHour);
    const eM = Math.round((event.endHour % 1) * 60);
    
    setStartTime(`${sH.toString().padStart(2, '0')}:${sM.toString().padStart(2, '0')}`);
    setEndTime(`${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')}`);
    setIsAdding(true);
  };

  const getWeekDays = () => {
    const days = [];
    const curr = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(curr);
      d.setDate(curr.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const formatHour = (h: number) => {
    const floorH = Math.floor(h);
    const ampm = floorH >= 12 ? 'PM' : 'AM';
    const displayHour = floorH % 12 || 12;
    return `${displayHour} ${ampm}`;
  };

  const filteredEvents = events.filter(e => e.date === selectedDate);

  return (
    <div className="p-6 space-y-6 animate-fadeIn pb-32 bg-white dark:bg-zinc-900 min-h-full">
      <header className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-green-600/60 dark:text-green-400/40 text-sm font-medium uppercase tracking-widest">Timeline</h2>
            <h1 className="text-3xl font-bold font-outfit text-green-950 dark:text-white">Rhythm</h1>
          </div>
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="w-12 h-12 rounded-2xl bg-green-600 dark:bg-zinc-950 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          >
            <Icons.Plus />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
          {getWeekDays().map((d, i) => {
            const dateStr = d.toISOString().split('T')[0];
            const isActive = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            return (
              <button
                key={i}
                onClick={() => onDateChange(dateStr)}
                className={`flex-shrink-0 w-12 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive 
                    ? 'bg-green-600 dark:bg-green-700 text-white shadow-lg scale-105' 
                    : 'bg-white dark:bg-zinc-800 text-green-800/40 dark:text-zinc-600 border border-green-50 dark:border-zinc-700'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-sm font-black">{d.getDate()}</span>
                {isToday && !isActive && <div className="w-1 h-1 rounded-full bg-green-500"></div>}
              </button>
            );
          })}
        </div>
      </header>

      {isAdding && (
        <div className="bg-green-50/50 dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 rounded-3xl p-5 space-y-4 animate-slideDown shadow-sm">
          <h3 className="font-bold font-outfit text-green-900 dark:text-green-400 text-lg">
            {editingId ? 'Edit Focus Block' : 'New Focus Block'}
          </h3>
          <div className="space-y-4">
            <input 
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the plan?"
              className="w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-sm outline-none border border-green-100 dark:border-zinc-700 shadow-sm dark:text-white"
            />
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-green-700/50 dark:text-zinc-600 uppercase ml-1">Start</label>
                <input 
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-sm outline-none border border-green-100 dark:border-zinc-700 shadow-sm dark:text-white"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-green-700/50 dark:text-zinc-600 uppercase ml-1">End</label>
                <input 
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-sm outline-none border border-green-100 dark:border-zinc-700 shadow-sm dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleSave}
                className="flex-1 bg-green-600 dark:bg-zinc-950 text-white font-bold py-3 rounded-2xl text-sm active:scale-95 transition-all shadow-md"
              >
                {editingId ? 'Update Block' : 'Save Block'}
              </button>
              <button 
                onClick={resetForm}
                className="px-6 bg-white dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 text-green-800/40 dark:text-zinc-500 font-bold py-3 rounded-2xl text-sm active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mt-4" ref={containerRef}>
        {currentTimePos !== null && (
          <div 
            className="absolute left-14 right-0 z-40 flex items-center gap-1 pointer-events-none transition-all duration-1000"
            style={{ top: `${currentTimePos}px` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg ring-2 ring-white dark:ring-zinc-900"></div>
            <div className="flex-1 h-[2px] bg-rose-500 opacity-60"></div>
          </div>
        )}

        {HOURS.map((hour) => {
          const hourEvents = filteredEvents.filter(e => Math.floor(e.startHour) === hour);
          
          return (
            <div key={hour} className="flex gap-4 h-[80px] group">
              <div className="w-14 pt-0 text-right">
                <span className="text-[10px] font-bold text-green-900/20 dark:text-zinc-700 tracking-wider">
                  {formatHour(hour)}
                </span>
              </div>

              <div className="flex-1 border-t border-green-50 dark:border-zinc-800 relative">
                {hourEvents.length > 0 && (
                  <div className="absolute inset-0 z-10 p-1 pt-2">
                    {hourEvents.map(event => {
                      const duration = event.endHour - event.startHour;
                      const offset = (event.startHour % 1) * 80;
                      const height = Math.max(duration * 80, 50);
                      
                      return (
                        <div 
                          key={event.id}
                          className="bg-white dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 border-l-4 border-l-green-600 dark:border-l-green-500 rounded-xl p-3 shadow-sm flex justify-between items-start group/card relative mb-2"
                          style={{ marginTop: `${offset}px`, height: `${height}px`, zIndex: 20 }}
                        >
                          <div className="overflow-hidden flex-1">
                            <h4 className="text-xs font-bold text-green-950 dark:text-white truncate">{event.title}</h4>
                            <span className="text-[9px] text-green-600/50 dark:text-green-400/40 uppercase font-bold tracking-tight block">
                              {formatHour(event.startHour)} - {formatHour(event.endHour)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); startEdit(event); }}
                              className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-700 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Icons.Pencil size={14} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); if(confirm("Delete this block?")) onRemoveEvent(event.id); }}
                              className="p-1.5 text-rose-300 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-700 rounded-lg transition-all"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div 
                  onClick={() => {
                    resetForm();
                    const h = hour.toString().padStart(2, '0');
                    setStartTime(`${h}:00`);
                    setEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
                    setIsAdding(true);
                  }}
                  className="h-full w-full hover:bg-green-50/30 dark:hover:bg-zinc-800/20 transition-colors cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
