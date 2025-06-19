
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BudgetItem {
  id?: string;
  category: string;
  subcategory?: string;
  type: 'income' | 'needs' | 'wants' | 'savings';
  budget: number;
  actual: number;
  payday?: string;
}

interface IncomeItem {
  subcategory: string;
  payday: string;
  budget: number;
  actual: number;
}

interface ExpenseItem {
  category: string;
  budget: number;
  actual: number;
}

interface BudgetDataRow {
  id: string;
  user_id: string;
  category: string;
  subcategory?: string;
  type: string;
  budget_amount: number;
  actual_amount: number;
  payday?: string;
  created_at: string;
  updated_at: string;
}

export const useSecureBudgetData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([]);
  const [needsData, setNeedsData] = useState<ExpenseItem[]>([]);
  const [wantsData, setWantsData] = useState<ExpenseItem[]>([]);
  const [savingsData, setSavingsData] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  const loadBudgetData = async () => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('budget_data')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading budget data:', error);
        return;
      }

      // Initialize with default structure if no data exists
      const defaultIncome: IncomeItem[] = [
        { subcategory: 'Insurance Fund', payday: '2025-02-02', budget: 0, actual: 0 },
        { subcategory: 'My Paycheck', payday: '2025-02-04', budget: 0, actual: 0 }
      ];

      const defaultNeeds: ExpenseItem[] = [
        { category: 'Housing (rent)', budget: 0, actual: 0 },
        { category: 'Property taxes', budget: 0, actual: 0 },
        { category: 'Groceries', budget: 0, actual: 0 },
        { category: 'Transportation', budget: 0, actual: 0 },
        { category: 'Insurance', budget: 0, actual: 0 },
        { category: 'Debt repayment', budget: 0, actual: 0 },
        { category: 'Loan', budget: 0, actual: 0 },
        { category: 'Internet/Phone', budget: 0, actual: 0 },
        { category: 'Utility fees', budget: 0, actual: 0 }
      ];

      const defaultWants: ExpenseItem[] = [
        { category: 'Subscriptions', budget: 0, actual: 0 },
        { category: 'Dining Out', budget: 0, actual: 0 },
        { category: 'Hobbies', budget: 0, actual: 0 },
        { category: 'Entertainment', budget: 0, actual: 0 },
        { category: 'Shopping', budget: 0, actual: 0 },
        { category: 'Personal Care', budget: 0, actual: 0 },
        { category: 'Gifts', budget: 0, actual: 0 },
        { category: 'Miscellaneous', budget: 0, actual: 0 },
        { category: 'Pet Care', budget: 0, actual: 0 }
      ];

      const defaultSavings: ExpenseItem[] = [
        { category: 'Emergency Fund', budget: 0, actual: 0 },
        { category: 'Vacation', budget: 0, actual: 0 },
        { category: 'Retirement', budget: 0, actual: 0 },
        { category: 'Investment Fund', budget: 0, actual: 0 },
        { category: 'Home Repair', budget: 0, actual: 0 },
        { category: 'Car', budget: 0, actual: 0 }
      ];

      // Transform database data to component format
      const budgetData = data as BudgetDataRow[];
      const incomeItems = budgetData?.filter(item => item.type === 'income') || [];
      const needsItems = budgetData?.filter(item => item.type === 'needs') || [];
      const wantsItems = budgetData?.filter(item => item.type === 'wants') || [];
      const savingsItems = budgetData?.filter(item => item.type === 'savings') || [];

      // Merge with defaults
      const income = defaultIncome.map(defaultItem => {
        const dbItem = incomeItems.find(item => item.category === defaultItem.subcategory);
        return dbItem ? {
          subcategory: dbItem.category,
          payday: dbItem.payday || defaultItem.payday,
          budget: Number(dbItem.budget_amount) || 0,
          actual: Number(dbItem.actual_amount) || 0
        } : defaultItem;
      });

      const needs = defaultNeeds.map(defaultItem => {
        const dbItem = needsItems.find(item => item.category === defaultItem.category);
        return dbItem ? {
          category: dbItem.category,
          budget: Number(dbItem.budget_amount) || 0,
          actual: Number(dbItem.actual_amount) || 0
        } : defaultItem;
      });

      const wants = defaultWants.map(defaultItem => {
        const dbItem = wantsItems.find(item => item.category === defaultItem.category);
        return dbItem ? {
          category: dbItem.category,
          budget: Number(dbItem.budget_amount) || 0,
          actual: Number(dbItem.actual_amount) || 0
        } : defaultItem;
      });

      const savings = defaultSavings.map(defaultItem => {
        const dbItem = savingsItems.find(item => item.category === defaultItem.category);
        return dbItem ? {
          category: dbItem.category,
          budget: Number(dbItem.budget_amount) || 0,
          actual: Number(dbItem.actual_amount) || 0
        } : defaultItem;
      });

      setIncomeData(income);
      setNeedsData(needs);
      setWantsData(wants);
      setSavingsData(savings);
      
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save data to Supabase
  const saveBudgetData = async (data: any[], type: string) => {
    if (!user) return;

    try {
      // First, delete existing data of this type
      await (supabase as any)
        .from('budget_data')
        .delete()
        .eq('user_id', user.id)
        .eq('type', type);

      // Then insert new data
      const insertData = data.map(item => ({
        user_id: user.id,
        category: type === 'income' ? item.subcategory : item.category,
        subcategory: type === 'income' ? item.subcategory : null,
        type: type,
        budget_amount: item.budget,
        actual_amount: item.actual,
        payday: type === 'income' ? item.payday : null
      }));

      const { error } = await (supabase as any)
        .from('budget_data')
        .insert(insertData);

      if (error) {
        console.error('Error saving budget data:', error);
        toast({
          title: "Save Failed",
          description: "Failed to save budget data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadBudgetData();
    }
  }, [user]);

  // Auto-save when data changes
  useEffect(() => {
    if (!loading && user && incomeData.length > 0) {
      saveBudgetData(incomeData, 'income');
    }
  }, [incomeData, loading, user]);

  useEffect(() => {
    if (!loading && user && needsData.length > 0) {
      saveBudgetData(needsData, 'needs');
    }
  }, [needsData, loading, user]);

  useEffect(() => {
    if (!loading && user && wantsData.length > 0) {
      saveBudgetData(wantsData, 'wants');
    }
  }, [wantsData, loading, user]);

  useEffect(() => {
    if (!loading && user && savingsData.length > 0) {
      saveBudgetData(savingsData, 'savings');
    }
  }, [savingsData, loading, user]);

  const resetData = () => {
    const zeroIncome = incomeData.map(item => ({ ...item, budget: 0, actual: 0 }));
    const zeroNeeds = needsData.map(item => ({ ...item, budget: 0, actual: 0 }));
    const zeroWants = wantsData.map(item => ({ ...item, budget: 0, actual: 0 }));
    const zeroSavings = savingsData.map(item => ({ ...item, budget: 0, actual: 0 }));

    setIncomeData(zeroIncome);
    setNeedsData(zeroNeeds);
    setWantsData(zeroWants);
    setSavingsData(zeroSavings);
  };

  const downloadPDF = () => {
    const totalIncome = incomeData.reduce((sum, item) => sum + item.actual, 0);
    const totalNeeds = needsData.reduce((sum, item) => sum + item.actual, 0);
    const totalWants = wantsData.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = savingsData.reduce((sum, item) => sum + item.actual, 0);
    const leftover = totalIncome - (totalNeeds + totalWants + totalSavings);
    
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Budget Report - ${currentDate}</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            margin: 20px; 
            color: #00ff00; 
            background: #000; 
            line-height: 1.4;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border: 2px solid #00ff00;
            padding: 20px;
          }
          .title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .section { 
            margin-bottom: 25px; 
            border: 1px solid #00ff00;
            padding: 15px;
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 15px; 
            text-transform: uppercase;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 10px;
          }
          th, td { 
            border: 1px solid #00ff00; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #003300; 
            font-weight: bold;
          }
          .total-row { 
            font-weight: bold; 
            background-color: #001100;
          }
          .summary { 
            background-color: #001100; 
            padding: 15px; 
            margin-top: 20px;
          }
          .currency { 
            font-weight: bold;
          }
          @media print {
            body { 
              background: white; 
              color: black; 
            }
            .header, .section, th, td { 
              border-color: black; 
            }
            th { 
              background-color: #f0f0f0; 
            }
            .total-row, .summary { 
              background-color: #f5f5f5; 
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">₹ 50/30/20 BUDGET REPORT</div>
          <div>SECURE FINANCIAL MATRIX</div>
          <div>${currentDate}</div>
        </div>

        <div class="section">
          <div class="section-title">Income</div>
          <table>
            <thead>
              <tr>
                <th>Subcategory</th>
                <th>Payday</th>
                <th>Budget (₹)</th>
                <th>Actual (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${incomeData.map(item => `
                <tr>
                  <td>${item.subcategory}</td>
                  <td>${item.payday}</td>
                  <td class="currency">₹${item.budget.toLocaleString('en-IN')}</td>
                  <td class="currency">₹${item.actual.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">TOTAL INCOME</td>
                <td class="currency">₹${totalIncome.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Needs (50%)</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget (₹)</th>
                <th>Actual (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${needsData.map(item => `
                <tr>
                  <td>${item.category}</td>
                  <td class="currency">₹${item.budget.toLocaleString('en-IN')}</td>
                  <td class="currency">₹${item.actual.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL NEEDS</td>
                <td class="currency">₹${needsData.reduce((sum, item) => sum + item.budget, 0).toLocaleString('en-IN')}</td>
                <td class="currency">₹${totalNeeds.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Wants (30%)</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget (₹)</th>
                <th>Actual (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${wantsData.map(item => `
                <tr>
                  <td>${item.category}</td>
                  <td class="currency">₹${item.budget.toLocaleString('en-IN')}</td>
                  <td class="currency">₹${item.actual.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL WANTS</td>
                <td class="currency">₹${wantsData.reduce((sum, item) => sum + item.budget, 0).toLocaleString('en-IN')}</td>
                <td class="currency">₹${totalWants.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Savings (20%)</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget (₹)</th>
                <th>Actual (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${savingsData.map(item => `
                <tr>
                  <td>${item.category}</td>
                  <td class="currency">₹${item.budget.toLocaleString('en-IN')}</td>
                  <td class="currency">₹${item.actual.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL SAVINGS</td>
                <td class="currency">₹${savingsData.reduce((sum, item) => sum + item.budget, 0).toLocaleString('en-IN')}</td>
                <td class="currency">₹${totalSavings.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="summary">
          <div class="section-title">Summary</div>
          <table>
            <tr>
              <td>Total Income</td>
              <td class="currency">₹${totalIncome.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Total Expenses</td>
              <td class="currency">₹${(totalNeeds + totalWants + totalSavings).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Leftover/Deficit</td>
              <td class="currency" style="color: ${leftover >= 0 ? '#00ff00' : '#ff0000'}">₹${leftover.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const saveData = () => {
    const data = {
      income: incomeData,
      needs: needsData,
      wants: wantsData,
      savings: savingsData,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    incomeData,
    setIncomeData,
    needsData,
    setNeedsData,
    wantsData,
    setWantsData,
    savingsData,
    setSavingsData,
    resetData,
    saveData,
    downloadPDF,
    loading
  };
};
