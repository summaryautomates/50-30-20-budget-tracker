
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface WantsItem {
  category: string;
  budget: number;
  actual: number;
}

interface WantsSectionProps {
  data: WantsItem[];
  setData: React.Dispatch<React.SetStateAction<WantsItem[]>>;
}

const WantsSection = ({ data, setData }: WantsSectionProps) => {
  const [newItem, setNewItem] = useState<WantsItem>({
    category: '',
    budget: 0,
    actual: 0
  });

  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);

  const handleUpdateItem = (index: number, field: keyof WantsItem, value: string | number) => {
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
    <Card>
      <CardHeader className="bg-green-50">
        <CardTitle className="text-lg font-bold text-green-900">WANTS (30%)</CardTitle>
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
                <th className="px-3 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const difference = item.budget - item.actual;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <Input
                        value={item.category}
                        onChange={(e) => handleUpdateItem(index, 'category', e.target.value)}
                        className="border-0 p-0 h-auto bg-transparent"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={item.budget}
                        onChange={(e) => handleUpdateItem(index, 'budget', parseFloat(e.target.value) || 0)}
                        className="border-0 p-0 h-auto bg-transparent text-right"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={item.actual}
                        onChange={(e) => handleUpdateItem(index, 'actual', parseFloat(e.target.value) || 0)}
                        className="border-0 p-0 h-auto bg-transparent text-right"
                      />
                    </td>
                    <td className={`px-3 py-2 text-right font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₱{Math.abs(difference).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveItem(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-b bg-gray-25">
                <td className="px-3 py-2">
                  <Input
                    placeholder="Add want..."
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="border-0 p-0 h-auto bg-transparent placeholder:text-gray-400"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.budget || ''}
                    onChange={(e) => setNewItem({ ...newItem, budget: parseFloat(e.target.value) || 0 })}
                    className="border-0 p-0 h-auto bg-transparent text-right"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.actual || ''}
                    onChange={(e) => setNewItem({ ...newItem, actual: parseFloat(e.target.value) || 0 })}
                    className="border-0 p-0 h-auto bg-transparent text-right"
                  />
                </td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2 text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddItem}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-green-50">
              <tr>
                <td className="px-3 py-3 font-bold">TOTAL</td>
                <td className="px-3 py-3 text-right font-bold">₱{totalBudget.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-bold">₱{totalActual.toLocaleString()}</td>
                <td className={`px-3 py-3 text-right font-bold ${totalBudget - totalActual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₱{Math.abs(totalBudget - totalActual).toLocaleString()}
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

export default WantsSection;
