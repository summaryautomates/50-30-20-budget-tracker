
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickStatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'emerald' | 'red' | 'cyan';
  isPercentage?: boolean;
}

const QuickStatsCard = ({ title, value, icon, color, isPercentage = false }: QuickStatsCardProps) => {
  const colorClasses = {
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    red: 'border-red-500/30 bg-red-500/5 text-red-400',
    cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400'
  };

  const formatValue = (val: number) => {
    if (isPercentage) {
      return `${val.toFixed(1)}%`;
    }
    return `₹${Math.abs(val).toLocaleString('en-IN')}`;
  };

  return (
    <Card className={`${colorClasses[color]} border transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-mono font-semibold tracking-wider opacity-80">
              {title}
            </span>
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono">
          {value < 0 && !isPercentage && '-'}
          {formatValue(value)}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
