
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
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl relative z-10">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 animate-pulse" />
            <span className="text-green-400 font-mono text-xs sm:text-sm">[ SECURE FINANCIAL SYSTEM ]</span>
          </div>
          <div className="flex flex-wrap gap-2 order-1 sm:order-2 justify-center sm:justify-end">
            <Button 
              onClick={saveData}
              variant="outline"
              size="sm"
              className="gap-2 border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 font-mono text-xs sm:text-sm"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">SAVE DATA</span>
              <span className="xs:hidden">SAVE</span>
            </Button>
            <Button 
              onClick={downloadPDF}
              variant="outline"
              size="sm"
              className="gap-2 border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 font-mono text-xs sm:text-sm"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">DOWNLOAD PDF</span>
              <span className="xs:hidden">PDF</span>
            </Button>
            <Button 
              onClick={resetData}
              variant="outline"
              size="sm"
              className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 font-mono text-xs sm:text-sm"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">RESET DATA</span>
              <span className="xs:hidden">RESET</span>
            </Button>
          </div>
        </div>
        
        <BudgetHeader />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* Income Section - Full width on mobile, 1 column on desktop */}
          <div className="xl:col-span-1">
            <IncomeSection data={incomeData} setData={setIncomeData} />
          </div>
          
          {/* Visualization - Full width on mobile/tablet, 2 columns on desktop */}
          <div className="xl:col-span-2">
            <BudgetVisualization 
              needs={totalNeeds}
              wants={totalWants}
              savings={totalSavings}
              income={totalIncome}
            />
          </div>
          
          {/* Summary - Full width on mobile, 1 column on desktop */}
          <div className="xl:col-span-1">
            <BudgetSummary 
              totalIncome={totalIncome}
              totalNeeds={totalNeeds}
              totalWants={totalWants}
              totalSavings={totalSavings}
              leftover={leftover}
            />
          </div>
        </div>

        {/* Budget Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="w-full">
            <NeedsSection data={needsData} setData={setNeedsData} />
          </div>
          <div className="w-full">
            <WantsSection data={wantsData} setData={setWantsData} />
          </div>
          <div className="w-full">
            <SavingsSection data={savingsData} setData={setSavingsData} />
          </div>
        </div>

        {/* System Status Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 text-green-400/60 font-mono text-xs sm:text-sm">
          <Cpu className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>[ SYSTEM OPERATIONAL ]</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
