
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load transactions from Supabase
  const loadTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      const formattedTransactions = data?.map((transaction: any) => ({
        id: transaction.id,
        amount: Number(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        type: transaction.type as 'income' | 'expense',
        date: transaction.transaction_date,
        time: transaction.transaction_time || '00:00:00'
      })) || [];

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const addTransaction = async (newTransaction: {
    amount: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
  }, selectedDate: string) => {
    if (!user || !newTransaction.amount || !newTransaction.description || !newTransaction.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category: newTransaction.category,
          type: newTransaction.type,
          transaction_date: selectedDate,
          transaction_time: new Date().toLocaleTimeString()
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive"
        });
        return false;
      }

      const newTrans: Transaction = {
        id: (data as any).id,
        amount: Number((data as any).amount),
        description: (data as any).description,
        category: (data as any).category,
        type: (data as any).type,
        date: (data as any).transaction_date,
        time: (data as any).transaction_time || '00:00:00'
      };

      setTransactions(prev => [newTrans, ...prev]);
      
      toast({
        title: "Transaction Added!",
        description: `₹${newTrans.amount.toLocaleString('en-IN')} ${newTrans.type} logged successfully`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive"
        });
        return;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transaction Deleted",
        description: "Transaction removed successfully"
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (
    editingId: string,
    updatedTransaction: {
      amount: string;
      description: string;
      category: string;
      type: 'income' | 'expense';
    }
  ) => {
    if (!user || !editingId || !updatedTransaction.amount || !updatedTransaction.description || !updatedTransaction.category) {
      return false;
    }

    try {
      const { error } = await (supabase as any)
        .from('transactions')
        .update({
          amount: parseFloat(updatedTransaction.amount),
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          type: updatedTransaction.type
        })
        .eq('id', editingId)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive"
        });
        return false;
      }

      setTransactions(prev => prev.map(t => 
        t.id === editingId 
          ? {
              ...t,
              amount: parseFloat(updatedTransaction.amount),
              description: updatedTransaction.description,
              category: updatedTransaction.category,
              type: updatedTransaction.type
            }
          : t
      ));

      toast({
        title: "Transaction Updated!",
        description: "Changes saved successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };
};
