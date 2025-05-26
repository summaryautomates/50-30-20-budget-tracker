
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

// Zero data for reset
const zeroIncomeData: IncomeItem[] = [
  { subcategory: 'Insurance Fund', payday: '2025-02-02', budget: 0, actual: 0 },
  { subcategory: 'My Paycheck', payday: '2025-02-04', budget: 0, actual: 0 }
];

const zeroNeedsData: ExpenseItem[] = [
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

const zeroWantsData: ExpenseItem[] = [
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

const zeroSavingsData: ExpenseItem[] = [
  { category: 'Emergency Fund', budget: 0, actual: 0 },
  { category: 'Vacation', budget: 0, actual: 0 },
  { category: 'Retirement', budget: 0, actual: 0 },
  { category: 'Investment Fund', budget: 0, actual: 0 },
  { category: 'Home Repair', budget: 0, actual: 0 },
  { category: 'Car', budget: 0, actual: 0 }
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
    setIncomeData(zeroIncomeData);
    setNeedsData(zeroNeedsData);
    setWantsData(zeroWantsData);
    setSavingsData(zeroSavingsData);
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

    // Create a new window for PDF generation
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
          <div>CYBER FINANCIAL MATRIX</div>
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
    downloadPDF
  };
};
