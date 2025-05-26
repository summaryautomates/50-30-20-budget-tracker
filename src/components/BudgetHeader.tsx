
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Terminal, Zap } from 'lucide-react';

const BudgetHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 shadow-2xl terminal-border glow-green">
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10"></div>
      
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Terminal className="h-8 w-8 text-green-400 animate-pulse" />
          <Zap className="h-6 w-6 text-green-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-green-400 mb-2 text-glow font-mono tracking-wider">
          ₹ 50/30/20 BUDGET
        </h1>
        <div className="text-sm text-green-300 mb-4 font-mono">
          [ CYBER FINANCIAL MATRIX ]
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousMonth}
            className="text-green-300 hover:text-green-400 hover:bg-green-500/20 border border-green-500/50 hover:border-green-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-xl text-green-300 font-medium min-w-[200px] font-mono uppercase tracking-wide">
            {formatDate(currentDate)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="text-green-300 hover:text-green-400 hover:bg-green-500/20 border border-green-500/50 hover:border-green-400"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/10 rounded-full translate-y-12 -translate-x-12 animate-pulse"></div>
    </div>
  );
};

export default BudgetHeader;
