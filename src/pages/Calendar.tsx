
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  Plus, 
  BarChart4,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import refactored components
import CalendarGrid from '@/components/calendar/CalendarGrid';
import EventsList from '@/components/calendar/EventsList';
import GanttChart from '@/components/calendar/GanttChart';

// Import custom hook for calendar logic
import { useCalendar } from '@/hooks/useCalendar';

const CalendarPage = () => {
  const {
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
  } = useCalendar();
  
  const [activeTab, setActiveTab] = useState("calendar");
  
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
              {/* Calendar Grid Component */}
              <CalendarGrid 
                currentDate={currentDate}
                days={days}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getEventColor={getEventColor}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
              />
              
              {/* Events List Component */}
              <EventsList 
                selectedDate={selectedDate}
                selectedDateEvents={selectedDateEvents}
                getEventColor={getEventColor}
                formatTime={formatTime}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="gantt">
            {/* Gantt Chart Component */}
            <GanttChart missions={missions} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CalendarPage;
