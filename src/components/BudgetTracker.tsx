
import React, { useState } from 'react';
import BudgetHeader from './BudgetHeader';
import IncomeSection from './IncomeSection';
import BudgetVisualization from './BudgetVisualization';
import NeedsSection from './NeedsSection';
import WantsSection from './WantsSection';
import SavingsSection from './SavingsSection';
import BudgetSummary from './BudgetSummary';

const BudgetTracker = () => {
  const [incomeData, setIncomeData] = useState([
    { subcategory: 'Insurance Fund', payday: '2 Feb 2025', budget: 745000.00, actual: 750000.00 },
    { subcategory: 'My Paycheck', payday: '4 Feb 2025', budget: 555000.00, actual: 450000.00 }
  ]);

  const [needsData, setNeedsData] = useState([
    { category: 'Housing (rent)', budget: 730000.00, actual: 86.00 },
    { category: 'Property taxes', budget: 45000.00, actual: 2315.00 },
    { category: 'Groceries', budget: 41000.00, actual: 7750.00 },
    { category: 'Transportation', budget: 17000.00, actual: 14100.00 },
    { category: 'Insurance', budget: 5000.00, actual: 4832.00 },
    { category: 'Debt repayment', budget: 7200.00, actual: 41000.00 },
    { category: 'Loan', budget: 3300.00, actual: 31250.00 },
    { category: 'Internet/Phone', budget: 1400.00, actual: 31000.00 },
    { category: 'Utility fees', budget: 1200.00, actual: 24100.00 }
  ]);

  const [wantsData, setWantsData] = useState([
    { category: 'Subscriptions', budget: 700.00, actual: 0.00 },
    { category: 'Dining Out', budget: 64500.00, actual: 5599.00 },
    { category: 'Hobbies', budget: 10000.00, actual: 0.00 },
    { category: 'Entertainment', budget: 83000.00, actual: 0.00 },
    { category: 'Shopping', budget: 70000.00, actual: 45000.00 },
    { category: 'Personal Care', budget: 5000.00, actual: 0.00 },
    { category: 'Gifts', budget: 33500.00, actual: 41750.00 },
    { category: 'Miscellaneous', budget: 54000.00, actual: 372.00 },
    { category: 'Pet Care', budget: 58500.00, actual: 53000.00 }
  ]);

  const [savingsData, setSavingsData] = useState([
    { category: 'Emergency Fund', budget: 61000.00, actual: 86.00 },
    { category: 'Vacation', budget: 4500.00, actual: 3700.00 },
    { category: 'Retirement', budget: 14500.00, actual: 0.00 },
    { category: 'Investment Fund', budget: 61250.00, actual: 31350.00 },
    { category: 'Home Repair', budget: 5000.00, actual: 0.00 },
    { category: 'Car', budget: 81250.00, actual: 560.00 }
  ]);

  // Calculate totals
  const totalIncome = incomeData.reduce((sum, item) => sum + item.actual, 0);
  const totalNeeds = needsData.reduce((sum, item) => sum + item.actual, 0);
  const totalWants = wantsData.reduce((sum, item) => sum + item.actual, 0);
  const totalSavings = savingsData.reduce((sum, item) => sum + item.actual, 0);
  const totalExpenses = totalNeeds + totalWants + totalSavings;
  const leftover = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <BudgetHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <div className="lg:col-span-1">
          <IncomeSection data={incomeData} setData={setIncomeData} />
        </div>
        
        <div className="lg:col-span-2">
          <BudgetVisualization 
            needs={totalNeeds}
            wants={totalWants}
            savings={totalSavings}
            income={totalIncome}
          />
        </div>
        
        <div className="lg:col-span-1">
          <BudgetSummary 
            totalIncome={totalIncome}
            totalNeeds={totalNeeds}
            totalWants={totalWants}
            totalSavings={totalSavings}
            leftover={leftover}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <NeedsSection data={needsData} setData={setNeedsData} />
        <WantsSection data={wantsData} setData={setWantsData} />
        <SavingsSection data={savingsData} setData={setSavingsData} />
      </div>
    </div>
  );
};

export default BudgetTracker;
