
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Shield, Waves, Save, Download } from 'lucide-react';
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
    <div className="min-h-screen ocean-bg">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl relative z-10">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-blue-400 animate-pulse" />
            <span className="text-blue-400 font-semibold text-sm sm:text-base">[ LUXURY FINANCIAL SUITE ]</span>
          </div>
          <div className="flex flex-wrap gap-3 order-1 sm:order-2 justify-center sm:justify-end">
            <Button 
              onClick={saveData}
              variant="outline"
              size="sm"
              className="gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 font-medium text-sm"
            >
              <Save className="h-4 w-4" />
              <span className="hidden xs:inline">SAVE DATA</span>
              <span className="xs:hidden">SAVE</span>
            </Button>
            <Button 
              onClick={downloadPDF}
              variant="outline"
              size="sm"
              className="gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 font-medium text-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">DOWNLOAD PDF</span>
              <span className="xs:hidden">PDF</span>
            </Button>
            <Button 
              onClick={resetData}
              variant="outline"
              size="sm"
              className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 font-medium text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden xs:inline">RESET DATA</span>
              <span className="xs:hidden">RESET</span>
            </Button>
          </div>
        </div>
        
        <BudgetHeader />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
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
        <div className="flex items-center justify-center gap-3 mt-8 sm:mt-12 text-blue-400/70 font-medium text-sm sm:text-base">
          <Waves className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>[ OCEAN SUITE OPERATIONAL ]</span>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
