
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

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

const IncomeSection = ({ data, setData }: IncomeSectionProps) => {
  const [newItem, setNewItem] = useState<IncomeItem>({
    subcategory: '',
    payday: '',
    budget: 0,
    actual: 0
  });

  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0);

  const handleUpdateItem = (index: number, field: keyof IncomeItem, value: string | number) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setData(updatedData);
  };

  const handleAddItem = () => {
    if (newItem.subcategory.trim()) {
      setData([...data, { ...newItem }]);
      setNewItem({ subcategory: '', payday: '', budget: 0, actual: 0 });
    }
  };

  const handleRemoveItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

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
                <th className="px-3 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Input
                      value={item.subcategory}
                      onChange={(e) => handleUpdateItem(index, 'subcategory', e.target.value)}
                      className="border-0 p-0 h-auto bg-transparent"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="date"
                      value={item.payday}
                      onChange={(e) => handleUpdateItem(index, 'payday', e.target.value)}
                      className="border-0 p-0 h-auto bg-transparent text-right text-xs"
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
                      className="border-0 p-0 h-auto bg-transparent text-right font-medium"
                    />
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
              ))}
              <tr className="border-b bg-gray-25">
                <td className="px-3 py-2">
                  <Input
                    placeholder="Add income source..."
                    value={newItem.subcategory}
                    onChange={(e) => setNewItem({ ...newItem, subcategory: e.target.value })}
                    className="border-0 p-0 h-auto bg-transparent placeholder:text-gray-400"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="date"
                    value={newItem.payday}
                    onChange={(e) => setNewItem({ ...newItem, payday: e.target.value })}
                    className="border-0 p-0 h-auto bg-transparent text-right text-xs"
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
            <tfoot className="bg-blue-50">
              <tr>
                <td className="px-3 py-3 font-bold">TOTAL</td>
                <td className="px-3 py-3"></td>
                <td className="px-3 py-3 text-right font-bold">₱{totalBudget.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-bold">₱{totalActual.toLocaleString()}</td>
                <td className="px-3 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSection;
