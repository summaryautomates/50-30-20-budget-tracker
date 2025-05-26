
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BudgetVisualizationProps {
  needs: number;
  wants: number;
  savings: number;
  income: number;
}

const BudgetVisualization = ({ needs, wants, savings, income }: BudgetVisualizationProps) => {
  const pieData = [
    { name: 'Needs', value: needs, color: '#3B82F6' },
    { name: 'Wants', value: wants, color: '#10B981' },
    { name: 'Savings', value: savings, color: '#F59E0B' }
  ];

  const barData = [
    { category: 'Needs', Budget: income * 0.5, Actual: needs },
    { category: 'Wants', Budget: income * 0.3, Actual: wants },
    { category: 'Savings', Budget: income * 0.2, Actual: savings }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Actual Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Budget and Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
              <Bar dataKey="Budget" fill="#94A3B8" />
              <Bar dataKey="Actual" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetVisualization;
