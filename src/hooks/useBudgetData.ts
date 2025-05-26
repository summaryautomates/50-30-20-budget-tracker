
import { useState, useEffect } from 'react';

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

const initialIncomeData: IncomeItem[] = [
  { subcategory: 'Insurance Fund', payday: '2025-02-02', budget: 745000.00, actual: 750000.00 },
  { subcategory: 'My Paycheck', payday: '2025-02-04', budget: 555000.00, actual: 450000.00 }
];

const initialNeedsData: ExpenseItem[] = [
  { category: 'Housing (rent)', budget: 730000.00, actual: 86.00 },
  { category: 'Property taxes', budget: 45000.00, actual: 2315.00 },
  { category: 'Groceries', budget: 41000.00, actual: 7750.00 },
  { category: 'Transportation', budget: 17000.00, actual: 14100.00 },
  { category: 'Insurance', budget: 5000.00, actual: 4832.00 },
  { category: 'Debt repayment', budget: 7200.00, actual: 41000.00 },
  { category: 'Loan', budget: 3300.00, actual: 31250.00 },
  { category: 'Internet/Phone', budget: 1400.00, actual: 31000.00 },
  { category: 'Utility fees', budget: 1200.00, actual: 24100.00 }
];

const initialWantsData: ExpenseItem[] = [
  { category: 'Subscriptions', budget: 700.00, actual: 0.00 },
  { category: 'Dining Out', budget: 64500.00, actual: 5599.00 },
  { category: 'Hobbies', budget: 10000.00, actual: 0.00 },
  { category: 'Entertainment', budget: 83000.00, actual: 0.00 },
  { category: 'Shopping', budget: 70000.00, actual: 45000.00 },
  { category: 'Personal Care', budget: 5000.00, actual: 0.00 },
  { category: 'Gifts', budget: 33500.00, actual: 41750.00 },
  { category: 'Miscellaneous', budget: 54000.00, actual: 372.00 },
  { category: 'Pet Care', budget: 58500.00, actual: 53000.00 }
];

const initialSavingsData: ExpenseItem[] = [
  { category: 'Emergency Fund', budget: 61000.00, actual: 86.00 },
  { category: 'Vacation', budget: 4500.00, actual: 3700.00 },
  { category: 'Retirement', budget: 14500.00, actual: 0.00 },
  { category: 'Investment Fund', budget: 61250.00, actual: 31350.00 },
  { category: 'Home Repair', budget: 5000.00, actual: 0.00 },
  { category: 'Car', budget: 81250.00, actual: 560.00 }
];

export const useBudgetData = () => {
  const [incomeData, setIncomeData] = useState<IncomeItem[]>(() => {
    const saved = localStorage.getItem('budgetIncomeData');
    return saved ? JSON.parse(saved) : initialIncomeData;
  });

  const [needsData, setNeedsData] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('budgetNeedsData');
    return saved ? JSON.parse(saved) : initialNeedsData;
  });

  const [wantsData, setWantsData] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('budgetWantsData');
    return saved ? JSON.parse(saved) : initialWantsData;
  });

  const [savingsData, setSavingsData] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('budgetSavingsData');
    return saved ? JSON.parse(saved) : initialSavingsData;
  });

  useEffect(() => {
    localStorage.setItem('budgetIncomeData', JSON.stringify(incomeData));
  }, [incomeData]);

  useEffect(() => {
    localStorage.setItem('budgetNeedsData', JSON.stringify(needsData));
  }, [needsData]);

  useEffect(() => {
    localStorage.setItem('budgetWantsData', JSON.stringify(wantsData));
  }, [wantsData]);

  useEffect(() => {
    localStorage.setItem('budgetSavingsData', JSON.stringify(savingsData));
  }, [savingsData]);

  const resetData = () => {
    setIncomeData(initialIncomeData);
    setNeedsData(initialNeedsData);
    setWantsData(initialWantsData);
    setSavingsData(initialSavingsData);
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
    resetData
  };
};
