
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 p-8 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          50/30/20 BUDGET
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousMonth}
            className="text-amber-100 hover:text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-xl text-amber-100 font-medium min-w-[200px]">
            {formatDate(currentDate)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="text-amber-100 hover:text-white hover:bg-white/20"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
};

export default BudgetHeader;
