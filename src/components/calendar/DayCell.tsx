
import React from 'react';
import { cn } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  date: Date;
  endTime: Date;
  type: string;
  mission: string;
  participants: number;
};

type DayCellProps = {
  day: {
    date: Date;
    isCurrentMonth: boolean;
    events: Event[];
  };
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
  getEventColor: (type: string) => string;
};

const DayCell: React.FC<DayCellProps> = ({
  day,
  isSelected,
  isToday,
  onClick,
  getEventColor,
}) => {
  return (
    <div 
      className={cn(
        "p-2 border-b border-r border-border min-h-[100px] relative transition-all-200",
        !day.isCurrentMonth && "text-muted-foreground bg-muted/30",
        day.isCurrentMonth && "hover:bg-muted/50 cursor-pointer",
        isSelected && "bg-primary/5 hover:bg-primary/10"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm",
        isToday && "bg-primary text-primary-foreground",
        isSelected && !isToday && "border border-primary"
      )}>
        {day.date.getDate()}
      </div>
      
      <div className="mt-1 space-y-1">
        {day.events.slice(0, 3).map((event) => (
          <div 
            key={event.id}
            className={cn(
              "text-xs p-1 rounded-sm truncate border-l-2",
              getEventColor(event.type)
            )}
          >
            {event.title}
          </div>
        ))}
        
        {day.events.length > 3 && (
          <div className="text-xs text-center text-muted-foreground">
            +{day.events.length - 3} plus
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCell;
