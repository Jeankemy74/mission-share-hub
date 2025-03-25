
import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MissionCardProps {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'draft';
  members: number;
  dueDate?: string;
  progress?: number;
}

const MissionCard: React.FC<MissionCardProps> = ({
  id,
  title,
  status,
  members,
  dueDate,
  progress = 0,
}) => {
  const statusColors = {
    active: 'bg-green-500/10 text-green-600',
    completed: 'bg-blue-500/10 text-blue-600',
    draft: 'bg-amber-500/10 text-amber-600',
  };

  const statusLabels = {
    active: 'En cours',
    completed: 'Terminée',
    draft: 'Brouillon',
  };

  return (
    <Link 
      to={`/missions/${id}`}
      className="block bg-card rounded-lg p-5 card-shadow transition-all-200 hover:shadow-lg"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      
      {progress > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-muted-foreground">Progression</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div 
              className="bg-primary rounded-full h-1.5" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Users size={16} className="mr-1.5" />
          <span>{members}</span>
        </div>
        
        {dueDate && (
          <div className="flex items-center">
            <Calendar size={16} className="mr-1.5" />
            <span>{dueDate}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MissionCard;
