
import { useState } from 'react';

// Event type definition
export type Event = {
  id: string;
  title: string;
  date: Date;
  endTime: Date;
  type: string;
  mission: string;
  participants: number;
};

// Mission type definition
export type Mission = {
  id: string;
  title: string;
  status: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
};

// Calendar day type definition
export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  events: Event[];
};

// Sample events data
const events: Event[] = [
  {
    id: '1',
    title: 'Réunion de lancement - Audit financier',
    date: new Date(2024, 5, 15, 10, 0),
    endTime: new Date(2024, 5, 15, 11, 30),
    type: 'meeting',
    mission: 'Audit financier du ministère de l\'Éducation',
    participants: 6,
  },
  {
    id: '2',
    title: 'Entretien avec le directeur financier',
    date: new Date(2024, 5, 16, 14, 0),
    endTime: new Date(2024, 5, 16, 15, 0),
    type: 'interview',
    mission: 'Audit financier du ministère de l\'Éducation',
    participants: 3,
  },
  {
    id: '3',
    title: 'Analyse des documents comptables',
    date: new Date(2024, 5, 17, 9, 0),
    endTime: new Date(2024, 5, 17, 16, 0),
    type: 'work',
    mission: 'Audit financier du ministère de l\'Éducation',
    participants: 2,
  },
  {
    id: '4',
    title: 'Présentation des résultats préliminaires',
    date: new Date(2024, 5, 20, 15, 0),
    endTime: new Date(2024, 5, 20, 16, 30),
    type: 'presentation',
    mission: 'Évaluation des politiques de santé publique',
    participants: 8,
  },
];

// Sample missions data for Gantt chart
const missions: Mission[] = [
  { 
    id: '1', 
    title: 'Audit financier du ministère de l\'Éducation', 
    status: 'active', 
    startDate: new Date(2024, 5, 10),
    endDate: new Date(2024, 6, 15),
    progress: 45,
    color: '#3b82f6'
  },
  { 
    id: '2', 
    title: 'Évaluation des politiques de santé publique', 
    status: 'active', 
    startDate: new Date(2024, 5, 5),
    endDate: new Date(2024, 6, 20),
    progress: 30,
    color: '#0ea5e9'
  },
  { 
    id: '3', 
    title: 'Revue des dépenses du projet d\'infrastructure', 
    status: 'draft', 
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 7, 15),
    progress: 15,
    color: '#f59e0b'
  },
  { 
    id: '4', 
    title: 'Analyse du programme de développement durable', 
    status: 'completed', 
    startDate: new Date(2024, 4, 15),
    endDate: new Date(2024, 5, 10),
    progress: 100,
    color: '#10b981'
  },
  { 
    id: '5', 
    title: 'Audit de conformité des marchés publics', 
    status: 'active', 
    startDate: new Date(2024, 6, 10),
    endDate: new Date(2024, 8, 5),
    progress: 20,
    color: '#6366f1'
  }
];

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Navigate between months
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Get calendar days for the current month
  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1).getDay();
    
    // Add days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        events: [],
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayEvents = events.filter(event => 
        event.date.getDate() === i && 
        event.date.getMonth() === month && 
        event.date.getFullYear() === year
      );
      
      days.push({
        date,
        isCurrentMonth: true,
        events: dayEvents,
      });
    }
    
    // Add days from next month to complete the grid (6 rows * 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        events: [],
      });
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentDate);
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? events.filter(event => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];
  
  // Get background color based on event type
  const getEventColor = (type: string) => {
    switch(type) {
      case 'meeting':
        return 'bg-blue-500/10 text-blue-500 border-blue-200';
      case 'interview':
        return 'bg-amber-500/10 text-amber-500 border-amber-200';
      case 'work':
        return 'bg-green-500/10 text-green-500 border-green-200';
      case 'presentation':
        return 'bg-purple-500/10 text-purple-500 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-200';
    }
  };

  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    days,
    missions,
    nextMonth,
    prevMonth,
    formatTime,
    selectedDateEvents,
    getEventColor,
  };
};
