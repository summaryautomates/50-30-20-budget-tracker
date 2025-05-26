
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IncomeItem {
  subcategory: string;
  payday: string;
  budget: number;
  actual: number;
}

interface IncomeSectionProps {
  data: IncomeItem[];
  setData: React.Dispatch<React.SetStateAction<IncomeItem[]>>;
}

const IncomeSection = ({ data }: IncomeSectionProps) => {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);

  return (
    <Card className="h-fit">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-xl font-bold text-blue-900">INCOME</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Subcategories</th>
                <th className="px-3 py-2 text-right font-semibold">Payday</th>
                <th className="px-3 py-2 text-right font-semibold">Budget</th>
                <th className="px-3 py-2 text-right font-semibold">Actual</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{item.subcategory}</td>
                  <td className="px-3 py-2 text-right text-xs">{item.payday}</td>
                  <td className="px-3 py-2 text-right">₱{item.budget.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-medium">₱{item.actual.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-blue-50">
              <tr>
                <td className="px-3 py-3 font-bold">TOTAL</td>
                <td className="px-3 py-3"></td>
                <td className="px-3 py-3 text-right font-bold">₱{totalBudget.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-bold">₱{totalActual.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSection;
