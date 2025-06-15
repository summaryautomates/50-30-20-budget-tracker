
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Waves, Crown } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 sm:p-12 shadow-2xl luxury-border glow-blue">
      <div className="absolute inset-0 ocean-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-transparent to-blue-500/15"></div>
      
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Crown className="h-10 w-10 text-blue-400 animate-pulse" />
          <Waves className="h-8 w-8 text-blue-400" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-400 mb-4 text-glow tracking-wider">
          ₹ 50/30/20 BUDGET
        </h1>
        <div className="text-base sm:text-lg text-blue-300 mb-6 font-medium">
          [ LUXURY FINANCIAL OCEAN SUITE ]
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousMonth}
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-500/20 border border-blue-500/50 hover:border-blue-400 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <p className="text-xl sm:text-2xl text-blue-300 font-medium min-w-[200px] uppercase tracking-wide">
            {formatDate(currentDate)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-500/20 border border-blue-500/50 hover:border-blue-400 rounded-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/15 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full translate-y-16 -translate-x-16 animate-pulse"></div>
    </div>
  );
};

export default BudgetHeader;
