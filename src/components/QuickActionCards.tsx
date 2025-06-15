
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Target, 
  Calendar, 
  BarChart3,
  Zap,
  ArrowRight
} from 'lucide-react';

interface QuickActionCardsProps {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  onAction: (action: string) => void;
}

const QuickActionCards = ({ totalIncome, totalExpenses, savingsRate, onAction }: QuickActionCardsProps) => {
  const suggestions = [
    {
      id: 'add-income',
      title: 'Add Income Source',
      description: 'Boost your budget by adding a new income stream',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'emerald',
      priority: totalIncome === 0 ? 'high' : 'medium',
      action: () => onAction('add-income')
    },
    {
      id: 'increase-savings',
      title: 'Optimize Savings',
      description: 'Increase your savings rate for better financial health',
      icon: <PiggyBank className="h-5 w-5" />,
      color: 'blue',
      priority: savingsRate < 20 ? 'high' : 'low',
      action: () => onAction('increase-savings')
    },
    {
      id: 'track-expenses',
      title: 'Log Daily Expenses',
      description: 'Keep track of your spending to stay on budget',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'purple',
      priority: totalExpenses === 0 ? 'high' : 'medium',
      action: () => onAction('track-expenses')
    },
    {
      id: 'set-goals',
      title: 'Set Financial Goals',
      description: 'Define targets to motivate your savings journey',
      icon: <Target className="h-5 w-5" />,
      color: 'cyan',
      priority: 'medium',
      action: () => onAction('set-goals')
    },
    {
      id: 'monthly-review',
      title: 'Monthly Review',
      description: 'Analyze your spending patterns and progress',
      icon: <Calendar className="h-5 w-5" />,
      color: 'orange',
      priority: 'low',
      action: () => onAction('monthly-review')
    },
    {
      id: 'budget-forecast',
      title: 'Budget Forecast',
      description: 'Plan your finances for the upcoming months',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'pink',
      priority: 'low',
      action: () => onAction('budget-forecast')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400',
      blue: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400',
      purple: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400',
      cyan: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400',
      orange: 'border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400',
      pink: 'border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10 text-pink-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-500/20 text-red-400 border-red-500/50">High Priority</Badge>,
      medium: <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Recommended</Badge>,
      low: <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">Optional</Badge>
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
        <h3 className="text-lg font-bold text-yellow-400 font-mono">[ QUICK ACTIONS ]</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Smart Insights */}
      <Card className="bg-gray-900/50 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">SMART INSIGHTS</span>
          </div>
          
          <div className="space-y-2 text-sm">
            {totalIncome === 0 && (
              <div className="flex items-center gap-2 text-orange-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Start by adding your monthly income to begin budgeting</span>
              </div>
            )}
            {savingsRate < 10 && totalIncome > 0 && (
              <div className="flex items-center gap-2 text-red-300">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Your savings rate is below 10% - consider reducing expenses</span>
              </div>
            )}
            {savingsRate >= 20 && (
              <div className="flex items-center gap-2 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Excellent! You're meeting the 20% savings target</span>
              </div>
            )}
            {totalExpenses === 0 && totalIncome > 0 && (
              <div className="flex items-center gap-2 text-blue-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Add your expenses to see detailed budget analysis</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionCards;
