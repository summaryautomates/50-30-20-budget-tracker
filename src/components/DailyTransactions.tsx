
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  time: string;
}

const DailyTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { toast } = useToast();

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income'];
  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 
    'Groceries', 'Personal Care', 'Other Expense'
  ];

  // Load transactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dailyTransactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('dailyTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category,
      type: newTransaction.type,
      date: selectedDate,
      time: new Date().toLocaleTimeString()
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({ amount: '', description: '', category: '', type: 'expense' });
    
    toast({
      title: "Transaction Added!",
      description: `₹${transaction.amount.toLocaleString('en-IN')} ${transaction.type} logged successfully`
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction removed successfully"
    });
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setNewTransaction({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      type: transaction.type
    });
  };

  const saveEdit = () => {
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.category) return;

    setTransactions(prev => prev.map(t => 
      t.id === editingId 
        ? {
            ...t,
            amount: parseFloat(newTransaction.amount),
            description: newTransaction.description,
            category: newTransaction.category,
            type: newTransaction.type
          }
        : t
    ));

    setEditingId(null);
    setNewTransaction({ amount: '', description: '', category: '', type: 'expense' });
    
    toast({
      title: "Transaction Updated!",
      description: "Changes saved successfully"
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewTransaction({ amount: '', description: '', category: '', type: 'expense' });
  };

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
    <div className="space-y-6">
      {/* Header with Date Picker and Summary */}
      <Card className="bg-gray-900/50 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 font-mono flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              DAILY TRANSACTIONS
            </CardTitle>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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

      {/* Add Transaction Form */}
      <Card className="bg-gray-900/50 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 font-mono">
            {editingId ? 'EDIT TRANSACTION' : 'ADD NEW TRANSACTION'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => 
              setNewTransaction(prev => ({ ...prev, type: value, category: '' }))
            }>
              <SelectTrigger className="bg-gray-800 border-blue-500/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Amount (₹)"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              className="bg-gray-800 border-blue-500/50"
            />

            <Input
              placeholder="Description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              className="bg-gray-800 border-blue-500/50"
            />

            <Select value={newTransaction.category} onValueChange={(value) => 
              setNewTransaction(prev => ({ ...prev, category: value }))
            }>
              <SelectTrigger className="bg-gray-800 border-blue-500/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {editingId ? (
                <>
                  <Button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 flex-1">
                    Save
                  </Button>
                  <Button onClick={cancelEdit} variant="outline" className="border-gray-500">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={addTransaction} className="bg-blue-600 hover:bg-blue-700 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 font-mono">
            TRANSACTIONS ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions for this date</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`p-4 rounded-lg border ${
                    transaction.type === 'income' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          className={`${
                            transaction.type === 'income' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                              : 'bg-red-500/20 text-red-400 border-red-500/50'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-gray-400">{transaction.time}</span>
                      </div>
                      <p className="text-sm text-gray-300">{transaction.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(transaction)}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTransactions;
