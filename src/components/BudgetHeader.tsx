
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Waves, Crown, Calendar } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 sm:p-10 shadow-2xl luxury-border glow-blue">
      <div className="absolute inset-0 ocean-pattern opacity-15"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-500/10 rounded-full animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        {/* Header Icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400 animate-pulse" />
          <Waves className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
          <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400 animate-pulse delay-500" />
        </div>
        
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 text-glow tracking-wider">
            50/30/20 BUDGET
          </h1>
          <div className="text-sm sm:text-base text-blue-300/80 mb-2 font-medium tracking-widest">
            [ LUXURY FINANCIAL OCEAN SUITE ]
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousMonth}
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400/50 rounded-xl transition-all duration-300 group"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
          </Button>
          
          <div className="flex items-center gap-3 px-4 sm:px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl backdrop-blur-sm">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
            <p className="text-lg sm:text-xl text-blue-300 font-medium min-w-[180px] sm:min-w-[220px] uppercase tracking-wide text-center">
              {formatDate(currentDate)}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="text-blue-300 hover:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400/50 rounded-xl transition-all duration-300 group"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;
