
import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionSummary from './TransactionSummary';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  time: string;
}

const SecureDailyTransactions = () => {
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const handleAddTransaction = async (newTransaction: {
    amount: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
  }) => {
    return await addTransaction(newTransaction, selectedDate);
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingTransaction({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      type: transaction.type
    });
  };

  const saveEdit = async () => {
    if (editingId) {
      const success = await updateTransaction(editingId, editingTransaction);
      if (success) {
        setEditingId(null);
        setEditingTransaction({ amount: '', description: '', category: '', type: 'expense' });
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTransaction({ amount: '', description: '', category: '', type: 'expense' });
  };

  return (
    <div className="space-y-6">
      <TransactionSummary
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        transactions={transactions}
      />

      <TransactionForm
        onAddTransaction={handleAddTransaction}
        editingId={editingId}
        editingTransaction={editingTransaction}
        onEditTransaction={setEditingTransaction}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
      />

      <TransactionList
        transactions={transactions}
        selectedDate={selectedDate}
        onEdit={startEdit}
        onDelete={deleteTransaction}
      />
    </div>
  );
};

export default SecureDailyTransactions;
