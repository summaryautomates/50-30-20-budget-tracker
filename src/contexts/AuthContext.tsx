
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is in guest mode
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setIsGuest(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Clear guest mode when user signs in
          localStorage.removeItem('guestMode');
          // Migrate localStorage data on first login
          setTimeout(() => {
            migrateLocalStorageData(session.user.id);
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const migrateLocalStorageData = async (userId: string) => {
    try {
      // Check if user already has data in database
      const { data: existingData } = await (supabase as any)
        .from('budget_data')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (existingData && existingData.length > 0) {
        console.log('User already has data in database, skipping migration');
        return;
      }

      // Migrate budget data from localStorage
      const budgetIncomeData = localStorage.getItem('budgetIncomeData');
      const budgetNeedsData = localStorage.getItem('budgetNeedsData');
      const budgetWantsData = localStorage.getItem('budgetWantsData');
      const budgetSavingsData = localStorage.getItem('budgetSavingsData');

      const migrationData = [];

      if (budgetIncomeData) {
        const incomeData = JSON.parse(budgetIncomeData);
        incomeData.forEach((item: any) => {
          migrationData.push({
            user_id: userId,
            category: item.subcategory,
            subcategory: item.subcategory,
            type: 'income',
            budget_amount: item.budget,
            actual_amount: item.actual,
            payday: item.payday
          });
        });
      }

      if (budgetNeedsData) {
        const needsData = JSON.parse(budgetNeedsData);
        needsData.forEach((item: any) => {
          migrationData.push({
            user_id: userId,
            category: item.category,
            type: 'needs',
            budget_amount: item.budget,
            actual_amount: item.actual
          });
        });
      }

      if (budgetWantsData) {
        const wantsData = JSON.parse(budgetWantsData);
        wantsData.forEach((item: any) => {
          migrationData.push({
            user_id: userId,
            category: item.category,
            type: 'wants',
            budget_amount: item.budget,
            actual_amount: item.actual
          });
        });
      }

      if (budgetSavingsData) {
        const savingsData = JSON.parse(budgetSavingsData);
        savingsData.forEach((item: any) => {
          migrationData.push({
            user_id: userId,
            category: item.category,
            type: 'savings',
            budget_amount: item.budget,
            actual_amount: item.actual
          });
        });
      }

      if (migrationData.length > 0) {
        const { error } = await (supabase as any)
          .from('budget_data')
          .insert(migrationData);

        if (error) {
          console.error('Error migrating budget data:', error);
        } else {
          console.log('Successfully migrated budget data');
          toast({
            title: "Data Migrated!",
            description: "Your existing budget data has been securely transferred to your account.",
          });
        }
      }

      // Migrate daily transactions
      const dailyTransactions = localStorage.getItem('dailyTransactions');
      if (dailyTransactions) {
        const transactions = JSON.parse(dailyTransactions);
        const transactionData = transactions.map((transaction: any) => ({
          user_id: userId,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          transaction_date: transaction.date,
          transaction_time: transaction.time
        }));

        if (transactionData.length > 0) {
          const { error } = await (supabase as any)
            .from('transactions')
            .insert(transactionData);

          if (!error) {
            console.log('Successfully migrated transaction data');
          }
        }
      }

    } catch (error) {
      console.error('Error during data migration:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName || ''
          }
        }
      });
      
      if (!error) {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsGuest(false);
      localStorage.removeItem('guestMode');
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const continueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setIsGuest(true);
    setLoading(false);
    toast({
      title: "Guest Access Enabled",
      description: "You can explore the app with limited functionality. Sign up to save your data.",
    });
  };

  const value = {
    user,
    session,
    loading,
    isGuest,
    signIn,
    signUp,
    signOut,
    resetPassword,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
