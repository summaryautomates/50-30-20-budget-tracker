
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SavingsItem {
  category: string;
  budget: number;
  actual: number;
}

interface SavingsSectionProps {
  data: SavingsItem[];
  setData: React.Dispatch<React.SetStateAction<SavingsItem[]>>;
}

const SavingsSection = ({ data }: SavingsSectionProps) => {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);

  return (
    <Card>
      <CardHeader className="bg-amber-50">
        <CardTitle className="text-lg font-bold text-amber-900">SAVINGS (20%)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Subcategories</th>
                <th className="px-3 py-2 text-right font-semibold">Budget</th>
                <th className="px-3 py-2 text-right font-semibold">Actual</th>
                <th className="px-3 py-2 text-right font-semibold">Difference</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const difference = item.budget - item.actual;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{item.category}</td>
                    <td className="px-3 py-2 text-right">₱{item.budget.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">₱{item.actual.toLocaleString()}</td>
                    <td className={`px-3 py-2 text-right font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{Math.abs(difference).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-amber-50">
              <tr>
                <td className="px-3 py-3 font-bold">TOTAL</td>
                <td className="px-3 py-3 text-right font-bold">₱{totalBudget.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-bold">₱{totalActual.toLocaleString()}</td>
                <td className={`px-3 py-3 text-right font-bold ${totalBudget - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₱{Math.abs(totalBudget - totalActual).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsSection;
