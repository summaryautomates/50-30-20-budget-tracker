
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    amount: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
  }) => Promise<boolean>;
  editingId: string | null;
  editingTransaction: {
    amount: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
  };
  onEditTransaction: (transaction: {
    amount: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
  }) => void;
  onSaveEdit: () => Promise<void>;
  onCancelEdit: () => void;
}

const TransactionForm = ({
  onAddTransaction,
  editingId,
  editingTransaction,
  onEditTransaction,
  onSaveEdit,
  onCancelEdit
}: TransactionFormProps) => {
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income'];
  const expenseCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 
    'Groceries', 'Personal Care', 'Other Expense'
  ];

  const handleAddTransaction = async () => {
    const success = await onAddTransaction(newTransaction);
    if (success) {
      setNewTransaction({ amount: '', description: '', category: '', type: 'expense' });
    }
  };

  const currentTransaction = editingId ? editingTransaction : newTransaction;
  
  const updateCurrentTransaction = (updates: Partial<typeof currentTransaction>) => {
    if (editingId) {
      onEditTransaction({ ...editingTransaction, ...updates });
    } else {
      setNewTransaction(prev => ({ ...prev, ...updates }));
    }
  };

  return (
    <Card className="bg-gray-900/50 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-blue-400 font-mono">
          {editingId ? 'EDIT TRANSACTION' : 'ADD NEW TRANSACTION'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Select 
            value={currentTransaction.type} 
            onValueChange={(value: 'income' | 'expense') => 
              updateCurrentTransaction({ type: value, category: '' })
            }
          >
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
            value={currentTransaction.amount}
            onChange={(e) => updateCurrentTransaction({ amount: e.target.value })}
            className="bg-gray-800 border-blue-500/50"
          />

          <Input
            placeholder="Description"
            value={currentTransaction.description}
            onChange={(e) => updateCurrentTransaction({ description: e.target.value })}
            className="bg-gray-800 border-blue-500/50"
          />

          <Select 
            value={currentTransaction.category} 
            onValueChange={(value) => updateCurrentTransaction({ category: value })}
          >
            <SelectTrigger className="bg-gray-800 border-blue-500/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {(currentTransaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {editingId ? (
              <>
                <Button onClick={onSaveEdit} className="bg-green-600 hover:bg-green-700 flex-1">
                  Save
                </Button>
                <Button onClick={onCancelEdit} variant="outline" className="border-gray-500">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleAddTransaction} className="bg-blue-600 hover:bg-blue-700 w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
