
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="bg-card rounded-lg p-6 card-shadow animate-fade-in transition-all-200 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <span
                className={`inline-flex items-center text-xs font-medium 
                  ${isPositive ? 'text-green-500' : ''}
                  ${isNegative ? 'text-red-500' : ''}
                  ${!isPositive && !isNegative ? 'text-muted-foreground' : ''}`}
              >
                {isPositive && <ArrowUpRight size={14} className="mr-1" />}
                {isNegative && <ArrowDownRight size={14} className="mr-1" />}
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">depuis le mois dernier</span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
