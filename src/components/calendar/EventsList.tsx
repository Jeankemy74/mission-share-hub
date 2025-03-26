
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus, User } from 'lucide-react';
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

type EventsListProps = {
  selectedDate: Date | null;
  selectedDateEvents: Event[];
  getEventColor: (type: string) => string;
  formatTime: (date: Date) => string;
};

const EventsList: React.FC<EventsListProps> = ({
  selectedDate,
  selectedDateEvents,
  getEventColor,
  formatTime,
}) => {
  return (
    <div className="bg-card rounded-lg card-shadow">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">
          {selectedDate 
            ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
            : 'Sélectionnez une date'
          }
        </h2>
      </div>
      
      <div className="p-4">
        {selectedDate ? (
          selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-md border transition-all-200 hover:shadow-sm">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock size={14} className="mr-1.5" />
                      {formatTime(event.date)} - {formatTime(event.endTime)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <User size={14} className="mr-1.5" />
                      {event.participants} participants
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full inline-flex items-center",
                      getEventColor(event.type)
                    )}>
                      {event.mission}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun événement prévu pour cette date</p>
              <Button className="mt-4">
                <Plus size={16} className="mr-2" />
                Ajouter un événement
              </Button>
            </div>
          )
        ) : (
          <div className="text-center py-8">
            <CalendarIcon size={48} className="mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Sélectionnez une date pour voir les événements
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Missing import for CalendarIcon
import { CalendarIcon } from 'lucide-react';

export default EventsList;
