
export interface Task {
  id: string;
  title: string;
  category: 'work' | 'personal' | 'health' | 'urgent';
  completed: boolean;
  time?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  color: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startHour: number; // 0-23.99
  endHour: number; // 0-23.99
  category: string;
}

export interface DayScheduleItem {
  time: string;
  activity: string;
  category: string;
  duration: string;
}

export type AppTab = 'today' | 'calendar' | 'habits' | 'coach' | 'settings';

export interface AIPlanResponse {
  summary: string;
  recommendedSchedule: DayScheduleItem[];
  motivationalQuote: string;
}
