
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

type Mission = {
  id: string;
  title: string;
  status: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
};

type GanttData = {
  name: string;
  id: string;
  start: number;
  end: number;
  duration: number;
  progress: number;
  status: string;
  color: string;
  isActive: boolean;
};

type GanttChartProps = {
  missions: Mission[];
};

const GanttChart: React.FC<GanttChartProps> = ({ missions }) => {
  // Prepare Gantt chart data
  const prepareGanttData = (): GanttData[] => {
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
  );
};

export default GanttChart;
