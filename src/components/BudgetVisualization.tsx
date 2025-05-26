
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';

interface BudgetVisualizationProps {
  needs: number;
  wants: number;
  savings: number;
  income: number;
}

const BudgetVisualization = ({ needs, wants, savings, income }: BudgetVisualizationProps) => {
  const pieData = [
    { name: 'Needs', value: needs, color: '#ef4444' },
    { name: 'Wants', value: wants, color: '#3b82f6' },
    { name: 'Savings', value: savings, color: '#22c55e' }
  ];

  const barData = [
    { category: 'Needs', Budget: income * 0.5, Actual: needs },
    { category: 'Wants', Budget: income * 0.3, Actual: wants },
    { category: 'Savings', Budget: income * 0.2, Actual: savings }
  ];

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-green-500/30 glow-green">
        <CardHeader className="border-b border-green-500/30">
          <CardTitle className="text-center text-green-400 font-mono flex items-center justify-center gap-2">
            <Activity className="h-5 w-5" />
            [ ACTUAL DISTRIBUTION ]
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
                fontSize={12}
                fill="#22c55e"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#22c55e" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #22c55e',
                  borderRadius: '8px',
                  color: '#22c55e'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-green-500/30 glow-green">
        <CardHeader className="border-b border-green-500/30">
          <CardTitle className="text-center text-green-400 font-mono flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" />
            [ BUDGET VS ACTUAL ]
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22c55e30" />
              <XAxis 
                dataKey="category" 
                stroke="#22c55e" 
                fontSize={12}
                fontFamily="monospace"
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                stroke="#22c55e"
                fontSize={12}
                fontFamily="monospace"
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #22c55e',
                  borderRadius: '8px',
                  color: '#22c55e'
                }}
              />
              <Bar dataKey="Budget" fill="#374151" stroke="#22c55e" strokeWidth={1} />
              <Bar dataKey="Actual" fill="#22c55e" stroke="#16a34a" strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetVisualization;
