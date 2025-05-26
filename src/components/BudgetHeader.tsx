
import React from 'react';

const BudgetHeader = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 p-8 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
          50/30/20 BUDGET
        </h1>
        <p className="text-xl text-amber-100 font-medium">
          February 2025
        </p>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
};

export default BudgetHeader;
