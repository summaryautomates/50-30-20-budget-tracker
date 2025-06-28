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
  signInWithGoogle: () => Promise<{ error: any }>;
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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check if user is in guest mode
        const guestMode = localStorage.getItem('guestMode');
        if (guestMode === 'true') {
          if (mounted) {
            setIsGuest(true);
            setLoading(false);
          }
          return;
        }

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              await createUserProfile(session.user);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setIsGuest(false);

          if (event === 'SIGNED_IN' && session?.user) {
            // Clear guest mode when user signs in
            localStorage.removeItem('guestMode');
            await createUserProfile(session.user);
            // Migrate localStorage data on first login
            setTimeout(() => {
              migrateLocalStorageData(session.user.id);
            }, 1000);
          }

          if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setIsGuest(false);
            localStorage.removeItem('guestMode');
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
              avatar_url: user.user_metadata?.avatar_url || null,
            }
          ]);

        if (error) {
          console.error('Error creating user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const migrateLocalStorageData = async (userId: string) => {
    try {
      // Check if user already has data in database
      const { data: existingData } = await supabase
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
        const { error } = await supabase
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
          const { error } = await supabase
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
      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      console.log('Sign in response:', { data, error });
      
      if (!error && data.user) {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully"
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Attempting to sign up with:', email, fullName);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName || '',
            name: fullName || ''
          }
        }
      });
      
      console.log('Sign up response:', { data, error });
      
      if (!error && data.user) {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
        toast({
          title: "Account Created!",
          description: "Welcome to Summary Finance Suite! You can start using the app immediately."
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      console.log('Google sign in response:', { data, error });
      
      if (!error) {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
        setIsGuest(false);
        localStorage.removeItem('guestMode');
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out"
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      console.log('Reset password response:', { error });
      
      return { error };
    } catch (error: any) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const continueAsGuest = () => {
    console.log('Continuing as guest');
    
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
    signInWithGoogle,
    signOut,
    resetPassword,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};