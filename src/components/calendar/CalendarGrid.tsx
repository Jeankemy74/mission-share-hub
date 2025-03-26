
import React from 'react';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DayCell from './DayCell';

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  events: Array<{
    id: string;
    title: string;
    date: Date;
    endTime: Date;
    type: string;
    mission: string;
    participants: number;
  }>;
};

type CalendarGridProps = {
  currentDate: Date;
  days: CalendarDay[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  getEventColor: (type: string) => string;
  prevMonth: () => void;
  nextMonth: () => void;
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  days,
  selectedDate,
  setSelectedDate,
  getEventColor,
  prevMonth,
  nextMonth,
}) => {
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="lg:col-span-2 bg-card rounded-lg card-shadow overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold flex items-center">
          <CalendarIcon size={18} className="mr-2" />
          {formatDate(currentDate)}
        </h2>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 text-center">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => (
          <div key={i} className="py-2 text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 text-center border-t border-border">
        {days.map((day, i) => {
          const isSelected = selectedDate && 
            day.date.getDate() === selectedDate.getDate() && 
            day.date.getMonth() === selectedDate.getMonth() && 
            day.date.getFullYear() === selectedDate.getFullYear();
          
          const isToday = 
            day.date.getDate() === new Date().getDate() && 
            day.date.getMonth() === new Date().getMonth() && 
            day.date.getFullYear() === new Date().getFullYear();
          
          return (
            <DayCell
              key={i}
              day={day}
              isSelected={isSelected}
              isToday={isToday}
              onClick={() => setSelectedDate(day.date)}
              getEventColor={getEventColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
