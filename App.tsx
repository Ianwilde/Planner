
import React, { useState, useEffect } from 'react';
import { AppTab, Task, Habit, CalendarEvent } from './types';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import HabitTracker from './components/HabitTracker';
import CalendarView from './components/CalendarView';
import AIPlanner from './components/AIPlanner';

const INITIAL_TASKS: Task[] = [];
const INITIAL_HABITS: Habit[] = [];
const INITIAL_EVENTS: CalendarEvent[] = [];

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zenplan_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('zenplan_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('zenplan_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('zenplan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('zenplan_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('zenplan_events', JSON.stringify(events));
  }, [events]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title: string, category: 'work' | 'personal' | 'health' | 'urgent' = 'personal') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category,
      completed: false,
      priority: 'medium'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newState = !h.completedToday;
        return { 
          ...h, 
          completedToday: newState, 
          streak: newState ? h.streak + 1 : Math.max(0, h.streak - 1) 
        };
      }
      return h;
    }));
  };

  const addHabit = (title: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      streak: 0,
      completedToday: false,
      color
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addEvent = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event].sort((a, b) => a.startHour - b.startHour));
  };

  const updateEvent = (updated: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e).sort((a, b) => a.startHour - b.startHour));
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return <Dashboard tasks={tasks} onToggleTask={toggleTask} onAddTask={addTask} />;
      case 'calendar':
        return <CalendarView 
          events={events} 
          onAddEvent={addEvent} 
          onUpdateEvent={updateEvent}
          onRemoveEvent={removeEvent} 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />;
      case 'habits':
        return <HabitTracker habits={habits} onToggleHabit={toggleHabit} onAddHabit={addHabit} onRemoveHabit={removeHabit} />;
      case 'coach':
        return <AIPlanner tasks={tasks} />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 font-outfit text-primary dark:text-primary">Settings</h1>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-green-50 dark:border-zinc-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm">ZenPlan AI v1.2.0</p>
              <button 
                onClick={() => {
                  if(confirm("Are you sure? This will delete all your tasks, habits, and schedules.")) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="mt-6 w-full bg-rose-50 dark:bg-zinc-900 text-rose-600 dark:text-rose-400 font-bold py-4 rounded-2xl transition-all active:scale-95 border border-rose-100 dark:border-rose-900"
              >
                Reset All Data
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 max-w-md mx-auto relative shadow-2xl overflow-hidden transition-colors duration-300">
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-4">
          <NavButton 
            active={activeTab === 'today'} 
            onClick={() => setActiveTab('today')} 
            icon={<Icons.Home />} 
            label="Home" 
          />
          <NavButton 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
            icon={<Icons.Calendar />} 
            label="Schedule" 
          />
          <NavButton 
            active={activeTab === 'habits'} 
            onClick={() => setActiveTab('habits')} 
            icon={<Icons.Habits />} 
            label="Habits" 
          />
          <NavButton 
            active={activeTab === 'coach'} 
            onClick={() => setActiveTab('coach')} 
            icon={<Icons.Coach />} 
            label="Coach" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<Icons.Settings />} 
            label="Meta" 
          />
        </div>
      </nav>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-primary dark:text-primary scale-110' : 'text-slate-400 dark:text-zinc-600'}`}
  >
    <div className={`p-1 rounded-lg ${active ? 'bg-green-50 dark:bg-zinc-800' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
