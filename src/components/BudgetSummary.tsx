
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-lg font-bold text-purple-900">EXPENSES SUMMARY</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Needs:</span>
              <span className="font-semibold">₱{totalNeeds.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Wants:</span>
              <span className="font-semibold">₱{totalWants.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Savings:</span>
              <span className="font-semibold">₱{totalSavings.toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>₱{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-lg font-bold text-indigo-900">PERCENTAGE BREAKDOWN</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Needs:</span>
              <span className="font-semibold">{needsPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Wants:</span>
              <span className="font-semibold">{wantsPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Savings:</span>
              <span className="font-semibold">{savingsPercent.toFixed(1)}%</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>TOTAL:</span>
              <span>{(needsPercent + wantsPercent + savingsPercent).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-green-100">
          <CardTitle className="text-lg font-bold text-green-900 flex items-center gap-2">
            LEFTOVER
            <span className="text-2xl">💰</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">BUDGET</div>
            <div className="text-2xl font-bold text-green-600">
              ₱{Math.abs(leftover).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">ACTUAL</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
