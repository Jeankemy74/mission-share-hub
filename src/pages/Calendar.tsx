
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  User, 
  BarChart4,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { 
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

// Sample events data
const events = [
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
const missions = [
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

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Get calendar days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
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
  
  // Navigate between months
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };
  
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

  // Prepare Gantt chart data
  const prepareGanttData = () => {
    const today = new Date();
    
    return missions.map(mission => {
      const startDate = mission.startDate;
      const endDate = mission.endDate;
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        name: mission.title,
        id: mission.id,
        start: startDate.getTime(),
        end: endDate.getTime(),
        duration: durationDays,
        progress: mission.progress,
        status: mission.status,
        color: mission.color,
        isActive: today >= startDate && today <= endDate
      };
    });
  };

  const ganttData = prepareGanttData();
  
  // Find min and max dates for the Gantt chart
  const minDate = Math.min(...missions.map(m => m.startDate.getTime()));
  const maxDate = Math.max(...missions.map(m => m.endDate.getTime()));
  
  // Format date for Gantt chart
  const formatGanttDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };
  
  // Custom tooltip for Gantt chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card rounded-md border p-3 shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Du {formatGanttDate(data.start)} au {formatGanttDate(data.end)}
          </p>
          <div className="mt-2 text-sm">Progression: {data.progress}%</div>
          <div className="mt-1 text-sm">Durée: {data.duration} jours</div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Calendrier</h1>
              <p className="text-muted-foreground mt-2">Gérez vos événements et échéances</p>
            </div>
            <Button className="flex items-center">
              <Plus size={16} className="mr-2" />
              Nouvel événement
            </Button>
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6 animate-fade-in">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarIcon size={16} className="mr-2" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="gantt" className="flex items-center">
              <BarChart4 size={16} className="mr-2" />
              Chronogramme
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
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
                      <div 
                        key={i} 
                        className={cn(
                          "p-2 border-b border-r border-border min-h-[100px] relative transition-all-200",
                          !day.isCurrentMonth && "text-muted-foreground bg-muted/30",
                          day.isCurrentMonth && "hover:bg-muted/50 cursor-pointer",
                          isSelected && "bg-primary/5 hover:bg-primary/10"
                        )}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm",
                          isToday && "bg-primary text-primary-foreground",
                          isSelected && !isToday && "border border-primary"
                        )}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          {day.events.slice(0, 3).map((event, index) => (
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
                  })}
                </div>
              </div>
              
              {/* Events for selected date */}
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
            </div>
          </TabsContent>
          
          <TabsContent value="gantt">
            <div className="bg-card rounded-lg card-shadow p-6 animate-fade-in">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Chronogramme des missions</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <ChevronLeft size={16} className="mr-1" />
                    Mois précédent
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    Mois suivant
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
              
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={ganttData}
                    layout="vertical"
                    barSize={30}
                    margin={{ top: 20, right: 30, left: 180, bottom: 20 }}
                  >
                    <XAxis
                      type="number"
                      domain={[minDate, maxDate]}
                      tickFormatter={formatGanttDate}
                      dataKey="start"
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={180}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine x={new Date().getTime()} stroke="#ef4444" strokeWidth={2} />
                    <Bar 
                      dataKey="duration" 
                      background={{ fill: '#f3f4f6' }}
                      radius={[4, 4, 4, 4]}
                    >
                      {ganttData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={entry.status === 'completed' ? 1 : entry.status === 'draft' ? 0.5 : 0.8}
                        />
                      ))}
                    </Bar>
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Légende</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">En cours</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Terminée</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 opacity-50 mr-2"></div>
                    <span className="text-sm">Brouillon</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 border-l-2 border-red-500 mr-2"></div>
                    <span className="text-sm">Aujourd'hui</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CalendarPage;
