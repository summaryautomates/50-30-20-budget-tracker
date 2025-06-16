import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Shield, Waves, Save, Download, TrendingUp, Eye, EyeOff, Gamepad2, Zap, Target } from 'lucide-react';
import { useBudgetData } from '@/hooks/useBudgetData';
import BudgetHeader from './BudgetHeader';
import IncomeSection from './IncomeSection';
import BudgetVisualization from './BudgetVisualization';
import NeedsSection from './NeedsSection';
import WantsSection from './WantsSection';
import SavingsSection from './SavingsSection';
import BudgetSummary from './BudgetSummary';
import QuickStatsCard from './QuickStatsCard';
import AchievementSystem from './AchievementSystem';
import FinancialHealthScore from './FinancialHealthScore';
import StreakTracker from './StreakTracker';
import OnboardingWizard from './OnboardingWizard';
import QuickActionCards from './QuickActionCards';
import GoalSetting from './GoalSetting';
const BudgetTracker = () => {
  const [showDetailedView, setShowDetailedView] = useState(true);
  const [showGameView, setShowGameView] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
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

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + item.actual, 0);
  const totalNeeds = needsData.reduce((sum, item) => sum + item.actual, 0);
  const totalWants = wantsData.reduce((sum, item) => sum + item.actual, 0);
  const totalSavings = savingsData.reduce((sum, item) => sum + item.actual, 0);
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const leftover = totalIncome - totalExpenses;

  // Calculate ideal allocations and compliance
  const idealNeeds = totalIncome * 0.5;
  const idealWants = totalIncome * 0.3;
  const idealSavings = totalIncome * 0.2;
  const budgetCompliance = totalIncome > 0 ? 100 - (Math.abs(totalNeeds / totalIncome - 0.5) * 100 + Math.abs(totalWants / totalIncome - 0.3) * 100 + Math.abs(totalSavings / totalIncome - 0.2) * 100) / 3 : 0;
  const savingsRate = totalIncome > 0 ? totalSavings / totalIncome * 100 : 0;
  const streak = 5; // This would come from localStorage in real implementation

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-income':
        // Focus on income section
        document.getElementById('income-section')?.scrollIntoView({
          behavior: 'smooth'
        });
        break;
      case 'set-goals':
        setShowGoals(true);
        break;
      case 'track-expenses':
        setShowDetailedView(true);
        break;
      default:
        console.log('Action:', action);
    }
  };
  return <div className="min-h-screen ocean-bg">
      {/* Onboarding Wizard */}
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} onSkip={() => {
      localStorage.setItem('hasCompletedOnboarding', 'true');
      setShowOnboarding(false);
    }} />}

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl relative z-10">
        {/* Enhanced Header with Quick Actions */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-blue-400 animate-pulse" />
              <span className="text-blue-400 font-semibold text-sm sm:text-base tracking-wide">[ SUMMARY FINANCIAL SUITE ]</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button onClick={() => setShowQuickActions(!showQuickActions)} variant="outline" size="sm" className="gap-2 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 font-medium text-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden xs:inline">{showQuickActions ? 'HIDE ACTIONS' : 'QUICK ACTIONS'}</span>
            </Button>
            <Button onClick={() => setShowGoals(!showGoals)} variant="outline" size="sm" className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 font-medium text-sm">
              <Target className="h-4 w-4" />
              <span className="hidden xs:inline">{showGoals ? 'HIDE GOALS' : 'GOALS'}</span>
            </Button>
            <Button onClick={() => setShowGameView(!showGameView)} variant="outline" size="sm" className="gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 font-medium text-sm">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden xs:inline">{showGameView ? 'HIDE GAME' : 'GAME MODE'}</span>
            </Button>
            <Button onClick={() => setShowDetailedView(!showDetailedView)} variant="outline" size="sm" className="gap-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 font-medium text-sm">
              {showDetailedView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden xs:inline">{showDetailedView ? 'SIMPLE VIEW' : 'DETAILED VIEW'}</span>
            </Button>
            <Button onClick={saveData} variant="outline" size="sm" className="gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 font-medium text-sm">
              <Save className="h-4 w-4" />
              <span className="hidden xs:inline">SAVE</span>
            </Button>
            <Button onClick={downloadPDF} variant="outline" size="sm" className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 font-medium text-sm">
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">PDF</span>
            </Button>
            <Button onClick={resetData} variant="outline" size="sm" className="gap-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 font-medium text-sm">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden xs:inline">RESET</span>
            </Button>
          </div>
        </div>
        
        <BudgetHeader />

        {/* Quick Actions Dashboard */}
        {showQuickActions && <div className="mb-8">
            <QuickActionCards totalIncome={totalIncome} totalExpenses={totalExpenses} savingsRate={savingsRate} onAction={handleQuickAction} />
          </div>}

        {/* Goals Dashboard */}
        {showGoals && <div className="mb-8">
            <GoalSetting totalSavings={totalSavings} />
          </div>}
        
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          <QuickStatsCard title="TOTAL INCOME" value={totalIncome} icon={<TrendingUp className="h-5 w-5" />} color="blue" />
          <QuickStatsCard title="EXPENSES" value={totalExpenses} icon={<Waves className="h-5 w-5" />} color="purple" />
          <QuickStatsCard title="REMAINING" value={leftover} icon={<Shield className="h-5 w-5" />} color={leftover >= 0 ? "emerald" : "red"} />
          <QuickStatsCard title="SAVINGS RATE" value={savingsRate} icon={<TrendingUp className="h-5 w-5" />} color="cyan" isPercentage={true} />
        </div>

        {/* Gamification Dashboard */}
        {showGameView && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <FinancialHealthScore totalIncome={totalIncome} totalNeeds={totalNeeds} totalWants={totalWants} totalSavings={totalSavings} leftover={leftover} />
            <AchievementSystem totalIncome={totalIncome} totalSavings={totalSavings} savingsRate={savingsRate} budgetCompliance={budgetCompliance} streak={streak} />
            <StreakTracker budgetCompliance={budgetCompliance} leftover={leftover} />
          </div>}

        {showDetailedView ? <>
            {/* Main Dashboard Grid - Detailed View */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
              <div className="xl:col-span-1" id="income-section">
                <IncomeSection data={incomeData} setData={setIncomeData} />
              </div>
              
              <div className="xl:col-span-2">
                <BudgetVisualization needs={totalNeeds} wants={totalWants} savings={totalSavings} income={totalIncome} />
              </div>
              
              <div className="xl:col-span-1">
                <BudgetSummary totalIncome={totalIncome} totalNeeds={totalNeeds} totalWants={totalWants} totalSavings={totalSavings} leftover={leftover} />
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
          </> : (/* Simple View - Focused on key metrics */
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <IncomeSection data={incomeData} setData={setIncomeData} />
              <BudgetSummary totalIncome={totalIncome} totalNeeds={totalNeeds} totalWants={totalWants} totalSavings={totalSavings} leftover={leftover} />
            </div>
            <div>
              <BudgetVisualization needs={totalNeeds} wants={totalWants} savings={totalSavings} income={totalIncome} />
            </div>
          </div>)}

        {/* Enhanced Footer with Status */}
        <div className="mt-12 pt-8 border-t border-blue-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-blue-400/70 font-medium text-sm">
              <Waves className="h-4 w-4 animate-pulse" />
              <span>[ BETA MODE ]</span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-blue-400/50 font-mono">
              <span>BUDGET ADHERENCE: {totalIncome > 0 ? ((1 - Math.abs(leftover) / totalIncome) * 100).toFixed(1) : 0}%</span>
              <span>50/30/20 COMPLIANCE: {budgetCompliance.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BudgetTracker;