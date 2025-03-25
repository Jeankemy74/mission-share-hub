
import React from 'react';
import { FileText, Users, MessageSquare, Calendar } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'document' | 'mission' | 'comment' | 'calendar';
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
  const icons = {
    document: <FileText size={16} />,
    mission: <Users size={16} />,
    comment: <MessageSquare size={16} />,
    calendar: <Calendar size={16} />,
  };
  
  const colors = {
    document: 'bg-blue-500/10 text-blue-500',
    mission: 'bg-purple-500/10 text-purple-500',
    comment: 'bg-amber-500/10 text-amber-500',
    calendar: 'bg-green-500/10 text-green-500',
  };
  
  return (
    <div className={`p-2 rounded-full ${colors[type]}`}>
      {icons[type]}
    </div>
  );
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-card rounded-lg card-shadow">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold">Activité récente</h3>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 flex items-start gap-4 transition-all-200 hover:bg-muted/30">
            <ActivityIcon type={activity.type} />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  {activity.user.avatar ? (
                    <img 
                      src={activity.user.avatar} 
                      alt={activity.user.name}
                      className="w-4 h-4 rounded-full mr-1.5"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-primary/10 text-primary mr-1.5 flex items-center justify-center text-[10px] font-medium">
                      {activity.user.name.charAt(0)}
                    </div>
                  )}
                  <span>{activity.user.name}</span>
                </div>
                <span className="mx-2">•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
