
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';
import BudgetHeader from './BudgetHeader';
import IncomeSection from './IncomeSection';
import BudgetVisualization from './BudgetVisualization';
import NeedsSection from './NeedsSection';
import WantsSection from './WantsSection';
import SavingsSection from './SavingsSection';
import BudgetSummary from './BudgetSummary';

const BudgetTracker = () => {
  const {
    incomeData,
    setIncomeData,
    needsData,
    setNeedsData,
    wantsData,
    setWantsData,
    savingsData,
    setSavingsData,
    resetData
  } = useBudgetData();

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + item.actual, 0);
  const totalNeeds = needsData.reduce((sum, item) => sum + item.actual, 0);
  const totalWants = wantsData.reduce((sum, item) => sum + item.actual, 0);
  const totalSavings = savingsData.reduce((sum, item) => sum + item.actual, 0);
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const leftover = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <div></div>
        <Button 
          onClick={resetData}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Sample Data
        </Button>
      </div>
      
      <BudgetHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <div className="lg:col-span-1">
          <IncomeSection data={incomeData} setData={setIncomeData} />
        </div>
        
        <div className="lg:col-span-2">
          <BudgetVisualization 
            needs={totalNeeds}
            wants={totalWants}
            savings={totalSavings}
            income={totalIncome}
          />
        </div>
        
        <div className="lg:col-span-1">
          <BudgetSummary 
            totalIncome={totalIncome}
            totalNeeds={totalNeeds}
            totalWants={totalWants}
            totalSavings={totalSavings}
            leftover={leftover}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <NeedsSection data={needsData} setData={setNeedsData} />
        <WantsSection data={wantsData} setData={setWantsData} />
        <SavingsSection data={savingsData} setData={setSavingsData} />
      </div>
    </div>
  );
};

export default BudgetTracker;
