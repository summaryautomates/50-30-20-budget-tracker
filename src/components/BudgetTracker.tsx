
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Shield, Cpu, Save, Download } from 'lucide-react';
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
    resetData,
    saveData,
    downloadPDF
  } = useBudgetData();

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + item.actual, 0);
  const totalNeeds = needsData.reduce((sum, item) => sum + item.actual, 0);
  const totalWants = wantsData.reduce((sum, item) => sum + item.actual, 0);
  const totalSavings = savingsData.reduce((sum, item) => sum + item.actual, 0);
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const leftover = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen matrix-bg">
      <div className="container mx-auto px-4 py-6 max-w-7xl relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-400 animate-pulse" />
            <span className="text-green-400 font-mono text-sm">[ SECURE FINANCIAL SYSTEM ]</span>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={saveData}
              variant="outline"
              size="sm"
              className="gap-2 border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 font-mono"
            >
              <Save className="h-4 w-4" />
              SAVE DATA
            </Button>
            <Button 
              onClick={downloadPDF}
              variant="outline"
              size="sm"
              className="gap-2 border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 font-mono"
            >
              <Download className="h-4 w-4" />
              DOWNLOAD PDF
            </Button>
            <Button 
              onClick={resetData}
              variant="outline"
              size="sm"
              className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 font-mono"
            >
              <RotateCcw className="h-4 w-4" />
              RESET DATA
            </Button>
          </div>
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

        <div className="flex items-center justify-center gap-2 mt-8 text-green-400/60 font-mono text-sm">
          <Cpu className="h-4 w-4" />
          <span>[ SYSTEM OPERATIONAL ]</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
