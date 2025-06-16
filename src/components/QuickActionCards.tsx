
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Target, 
  Calculator, 
  BarChart3,
  Zap,
  ArrowRight,
  DollarSign,
  Lightbulb,
  TrendingDown
} from 'lucide-react';

interface QuickActionCardsProps {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  totalNeeds: number;
  totalWants: number;
  totalSavings: number;
  leftover: number;
  onAction: (action: string, data?: any) => void;
}

const QuickActionCards = ({ 
  totalIncome, 
  totalExpenses, 
  savingsRate, 
  totalNeeds,
  totalWants,
  totalSavings,
  leftover,
  onAction 
}: QuickActionCardsProps) => {
  
  // Calculate smart suggestions based on current data
  const needsPercentage = totalIncome > 0 ? (totalNeeds / totalIncome) * 100 : 0;
  const wantsPercentage = totalIncome > 0 ? (totalWants / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  
  const suggestions = [
    {
      id: 'quick-budget-setup',
      title: 'Auto-Setup 50/30/20 Budget',
      description: 'Automatically allocate your income using the proven 50/30/20 rule',
      icon: <Calculator className="h-5 w-5" />,
      color: 'emerald',
      priority: totalIncome > 0 && totalExpenses === 0 ? 'high' : 'low',
      action: () => onAction('auto-setup-budget', { 
        needs: totalIncome * 0.5,
        wants: totalIncome * 0.3,
        savings: totalIncome * 0.2
      })
    },
    {
      id: 'add-emergency-fund',
      title: 'Create Emergency Fund',
      description: 'Set up an emergency fund worth 3-6 months of expenses',
      icon: <PiggyBank className="h-5 w-5" />,
      color: 'blue',
      priority: totalSavings === 0 ? 'high' : 'medium',
      action: () => onAction('add-emergency-fund', {
        amount: totalExpenses * 3
      })
    },
    {
      id: 'optimize-wants',
      title: 'Optimize Wants Spending',
      description: 'Review and reduce non-essential expenses to boost savings',
      icon: <TrendingDown className="h-5 w-5" />,
      color: 'orange',
      priority: wantsPercentage > 35 ? 'high' : 'low',
      action: () => onAction('optimize-wants', {
        currentWants: totalWants,
        recommendedWants: totalIncome * 0.3
      })
    },
    {
      id: 'increase-income',
      title: 'Income Boost Calculator',
      description: 'Calculate how much extra income you need for your goals',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'cyan',
      priority: leftover < 0 ? 'high' : 'medium',
      action: () => onAction('income-calculator', {
        deficit: Math.abs(leftover),
        currentIncome: totalIncome
      })
    },
    {
      id: 'savings-booster',
      title: 'Savings Rate Booster',
      description: 'Get personalized tips to increase your savings rate',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'purple',
      priority: savingsRate < 20 ? 'high' : 'medium',
      action: () => onAction('savings-booster', {
        currentRate: savingsRate,
        targetRate: 20,
        income: totalIncome
      })
    },
    {
      id: 'debt-payoff-plan',
      title: 'Debt Payoff Strategy',
      description: 'Create an accelerated debt repayment plan',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'red',
      priority: 'medium',
      action: () => onAction('debt-payoff-plan')
    },
    {
      id: 'investment-planner',
      title: 'Investment Portfolio Planner',
      description: 'Plan your investment allocation based on your savings',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'pink',
      priority: totalSavings > 50000 ? 'medium' : 'low',
      action: () => onAction('investment-planner', {
        availableSavings: totalSavings
      })
    },
    {
      id: 'monthly-challenge',
      title: 'Start Savings Challenge',
      description: 'Begin a 30-day money-saving challenge',
      icon: <Target className="h-5 w-5" />,
      color: 'yellow',
      priority: 'medium',
      action: () => onAction('savings-challenge')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400',
      blue: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400',
      purple: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400',
      cyan: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400',
      orange: 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400',
      pink: 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400',
      red: 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400',
      yellow: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">High Priority</Badge>,
      medium: <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">Recommended</Badge>,
      low: <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50 text-xs">Optional</Badge>
    };
    return badges[priority as keyof typeof badges] || badges.medium;
  };

  // Sort suggestions by priority
  const sortedSuggestions = suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-yellow-400 font-mono">[ SMART FINANCIAL ACTIONS ]</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedSuggestions.map((suggestion) => (
          <Card 
            key={suggestion.id}
            className={`${getColorClasses(suggestion.color)} border transition-all duration-300 hover:scale-105 cursor-pointer`}
            onClick={suggestion.action}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {suggestion.icon}
                  <span className="font-semibold text-sm">{suggestion.title}</span>
                </div>
                <ArrowRight className="h-4 w-4 opacity-50" />
              </div>
              
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                {suggestion.description}
              </p>
              
              <div className="flex justify-between items-center">
                {getPriorityBadge(suggestion.priority)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Smart Insights with actionable data */}
      <Card className="bg-gray-900/50 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">INTELLIGENT INSIGHTS</span>
          </div>
          
          <div className="space-y-2 text-sm">
            {totalIncome === 0 && (
              <div className="flex items-center gap-2 text-orange-300">
                <DollarSign className="h-3 w-3" />
                <span>Add your income to unlock personalized budget recommendations</span>
              </div>
            )}
            {needsPercentage > 60 && totalIncome > 0 && (
              <div className="flex items-center gap-2 text-red-300">
                <TrendingUp className="h-3 w-3" />
                <span>Your needs spending is {needsPercentage.toFixed(1)}% - consider reducing housing or debt costs</span>
              </div>
            )}
            {wantsPercentage > 35 && totalIncome > 0 && (
              <div className="flex items-center gap-2 text-orange-300">
                <CreditCard className="h-3 w-3" />
                <span>Wants spending at {wantsPercentage.toFixed(1)}% - try the optimization action above</span>
              </div>
            )}
            {savingsRate >= 20 && (
              <div className="flex items-center gap-2 text-green-300">
                <PiggyBank className="h-3 w-3" />
                <span>Excellent! You're saving {savingsRate.toFixed(1)}% - consider investment planning</span>
              </div>
            )}
            {leftover < 0 && (
              <div className="flex items-center gap-2 text-red-300">
                <TrendingDown className="h-3 w-3" />
                <span>Budget deficit of ₹{Math.abs(leftover).toLocaleString('en-IN')} - use income booster action</span>
              </div>
            )}
            {leftover > totalIncome * 0.1 && (
              <div className="flex items-center gap-2 text-cyan-300">
                <Lightbulb className="h-3 w-3" />
                <span>Great! ₹{leftover.toLocaleString('en-IN')} surplus - consider boosting your savings</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionCards;
