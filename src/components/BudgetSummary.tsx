
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, PieChart, Wallet, DollarSign } from 'lucide-react';

interface BudgetSummaryProps {
  totalIncome: number;
  totalNeeds: number;
  totalWants: number;
  totalSavings: number;
  leftover: number;
}

const BudgetSummary = ({ totalIncome, totalNeeds, totalWants, totalSavings, leftover }: BudgetSummaryProps) => {
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  
  // Calculate percentages
  const needsPercent = totalIncome > 0 ? (totalNeeds / totalIncome) * 100 : 0;
  const wantsPercent = totalIncome > 0 ? (totalWants / totalIncome) * 100 : 0;
  const savingsPercent = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900/50 border-red-500/30 shadow-lg shadow-red-500/10">
        <CardHeader className="bg-red-500/10 border-b border-red-500/30">
          <CardTitle className="text-lg font-bold text-red-400 font-mono flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            [ EXPENSE MATRIX ]
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between text-red-300">
              <span>NEEDS:</span>
              <span className="font-semibold text-red-400">{formatCurrency(totalNeeds)}</span>
            </div>
            <div className="flex justify-between text-blue-300">
              <span>WANTS:</span>
              <span className="font-semibold text-blue-400">{formatCurrency(totalWants)}</span>
            </div>
            <div className="flex justify-between text-green-300">
              <span>SAVINGS:</span>
              <span className="font-semibold text-green-400">{formatCurrency(totalSavings)}</span>
            </div>
            <hr className="my-2 border-green-500/30" />
            <div className="flex justify-between font-bold text-green-400">
              <span>TOTAL:</span>
              <span>{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-blue-500/30 shadow-lg shadow-blue-500/10">
        <CardHeader className="bg-blue-500/10 border-b border-blue-500/30">
          <CardTitle className="text-lg font-bold text-blue-400 font-mono flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            [ PERCENTAGE ANALYSIS ]
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between text-red-300">
              <span>NEEDS:</span>
              <span className="font-semibold text-red-400">{needsPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-blue-300">
              <span>WANTS:</span>
              <span className="font-semibold text-blue-400">{wantsPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-green-300">
              <span>SAVINGS:</span>
              <span className="font-semibold text-green-400">{savingsPercent.toFixed(1)}%</span>
            </div>
            <hr className="my-2 border-green-500/30" />
            <div className="flex justify-between font-bold text-green-400">
              <span>TOTAL:</span>
              <span>{(needsPercent + wantsPercent + savingsPercent).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-green-500/30 shadow-lg shadow-green-500/20 glow-green">
        <CardHeader className="bg-green-500/10 border-b border-green-500/30">
          <CardTitle className="text-lg font-bold text-green-400 font-mono flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            [ BALANCE STATUS ]
            <DollarSign className="h-4 w-4 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-green-300 mb-1 font-mono">REMAINING FUNDS</div>
            <div className={`text-2xl font-bold font-mono ${leftover >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(Math.abs(leftover))}
            </div>
            <div className="text-sm text-green-300 mt-2 font-mono">
              {leftover >= 0 ? '[ SURPLUS ]' : '[ DEFICIT ]'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
