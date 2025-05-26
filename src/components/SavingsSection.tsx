import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface SavingsItem {
  category: string;
  budget: number;
  actual: number;
}

interface SavingsSectionProps {
  data: SavingsItem[];
  setData: React.Dispatch<React.SetStateAction<SavingsItem[]>>;
}

const SavingsSection = ({ data, setData }: SavingsSectionProps) => {
  const [newItem, setNewItem] = useState<SavingsItem>({
    category: '',
    budget: 0,
    actual: 0
  });

  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const handleUpdateItem = (index: number, field: keyof SavingsItem, value: string | number) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setData(updatedData);
  };

  const handleAddItem = () => {
    if (newItem.category.trim()) {
      setData([...data, { ...newItem }]);
      setNewItem({ category: '', budget: 0, actual: 0 });
    }
  };

  const handleRemoveItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-gray-900/50 border-green-500/30 shadow-lg shadow-green-500/10 glow-green">
      <CardHeader className="bg-green-500/10 border-b border-green-500/30">
        <CardTitle className="text-lg font-bold text-green-400 font-mono">[ SAVINGS - 20% ]</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead className="bg-gray-800/50 border-b border-green-500/30">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-green-300">CATEGORY</th>
                <th className="px-3 py-2 text-right font-semibold text-green-300">BUDGET</th>
                <th className="px-3 py-2 text-right font-semibold text-green-300">ACTUAL</th>
                <th className="px-3 py-2 text-right font-semibold text-green-300">DIFF</th>
                <th className="px-3 py-2 text-center font-semibold text-green-300">DEL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const difference = item.budget - item.actual;
                return (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-green-500/5">
                    <td className="px-3 py-2">
                      <Input
                        value={item.category}
                        onChange={(e) => handleUpdateItem(index, 'category', e.target.value)}
                        className="border-0 p-0 h-auto bg-transparent text-green-300 font-mono"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={item.budget}
                        onChange={(e) => handleUpdateItem(index, 'budget', parseFloat(e.target.value) || 0)}
                        className="border-0 p-0 h-auto bg-transparent text-right text-green-300 font-mono"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={item.actual}
                        onChange={(e) => handleUpdateItem(index, 'actual', parseFloat(e.target.value) || 0)}
                        className="border-0 p-0 h-auto bg-transparent text-right text-green-300 font-mono"
                      />
                    </td>
                    <td className={`px-3 py-2 text-right font-medium font-mono ${difference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(Math.abs(difference))}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveItem(index)}
                        className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-b border-gray-700/50 bg-gray-800/25">
                <td className="px-3 py-2">
                  <Input
                    placeholder="Add savings goal..."
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="border-0 p-0 h-auto bg-transparent placeholder:text-gray-500 text-green-300 font-mono"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.budget || ''}
                    onChange={(e) => setNewItem({ ...newItem, budget: parseFloat(e.target.value) || 0 })}
                    className="border-0 p-0 h-auto bg-transparent text-right text-green-300 font-mono"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.actual || ''}
                    onChange={(e) => setNewItem({ ...newItem, actual: parseFloat(e.target.value) || 0 })}
                    className="border-0 p-0 h-auto bg-transparent text-right text-green-300 font-mono"
                  />
                </td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2 text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddItem}
                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-green-500/10 border-t border-green-500/30">
              <tr>
                <td className="px-3 py-3 font-bold text-green-400 font-mono">TOTAL</td>
                <td className="px-3 py-3 text-right font-bold text-green-400 font-mono">{formatCurrency(totalBudget)}</td>
                <td className="px-3 py-3 text-right font-bold text-green-400 font-mono">{formatCurrency(totalActual)}</td>
                <td className={`px-3 py-3 text-right font-bold font-mono ${totalBudget - totalActual >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(Math.abs(totalBudget - totalActual))}
                </td>
                <td className="px-3 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsSection;
