
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  time: string;
}

interface TransactionSummaryProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  transactions: Transaction[];
}

const TransactionSummary = ({ selectedDate, onDateChange, transactions }: TransactionSummaryProps) => {
  // Filter transactions by selected date
  const filteredTransactions = transactions.filter(t => t.date === selectedDate);
  
  // Calculate totals for selected date
  const dayTotalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const dayTotalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const dayBalance = dayTotalIncome - dayTotalExpenses;

  return (
    <Card className="bg-gray-900/50 border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 font-mono flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            SECURE TRANSACTIONS
          </CardTitle>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-auto bg-gray-800 border-cyan-500/50 text-cyan-400"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Income: ₹{dayTotalIncome.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2 text-red-400">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm">Expenses: ₹{dayTotalExpenses.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className={`text-sm ${dayBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Balance: ₹{dayBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionSummary;
