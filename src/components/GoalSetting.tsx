
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Edit, Trash2, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'emergency' | 'vacation' | 'investment' | 'purchase' | 'other';
  priority: 'high' | 'medium' | 'low';
}

interface GoalSettingProps {
  totalSavings: number;
}

const GoalSetting = ({ totalSavings }: GoalSettingProps) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: 'other',
    priority: 'medium'
  });

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('financialGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category || 'other',
        priority: newGoal.priority || 'medium'
      };
      
      saveGoals([...goals, goal]);
      setNewGoal({ category: 'other', priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    saveGoals(goals.map(goal => 
      goal.id === id ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + amount) } : goal
    ));
  };

  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      emergency: 'border-red-500/50 bg-red-500/10 text-red-400',
      vacation: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
      investment: 'border-green-500/50 bg-green-500/10 text-green-400',
      purchase: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
      other: 'border-gray-500/50 bg-gray-500/10 text-gray-400'
    };
    return colors[category];
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    const colors = {
      high: 'border-red-500/50 text-red-400',
      medium: 'border-yellow-500/50 text-yellow-400',
      low: 'border-green-500/50 text-green-400'
    };
    return colors[priority];
  };

  return (
    <Card className="bg-gray-900/50 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <CardHeader className="bg-cyan-500/10 border-b border-cyan-500/30">
        <CardTitle className="text-lg font-bold text-cyan-400 font-mono flex items-center gap-2">
          <Target className="h-5 w-5" />
          [ FINANCIAL GOALS ]
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Add Goal Button */}
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="w-full mb-4 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        )}

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="mb-4 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Goal title"
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                value={newGoal.title || ''}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Target amount"
                  className="p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) })}
                />
                <input
                  type="date"
                  className="p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                  value={newGoal.deadline || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                  value={newGoal.category || 'other'}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                >
                  <option value="emergency">Emergency Fund</option>
                  <option value="vacation">Vacation</option>
                  <option value="investment">Investment</option>
                  <option value="purchase">Purchase</option>
                  <option value="other">Other</option>
                </select>
                <select
                  className="p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                  value={newGoal.priority || 'medium'}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={addGoal} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                  Add Goal
                </Button>
                <Button 
                  onClick={() => setShowAddForm(false)} 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={goal.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-200 text-sm">{goal.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getCategoryColor(goal.category)} variant="outline">
                        {goal.category}
                      </Badge>
                      <Badge className={getPriorityColor(goal.priority)} variant="outline">
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteGoal(goal.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    {progress.toFixed(1)}% complete
                  </div>
                </div>
                
                <div className="flex gap-1 mt-2">
                  <Button
                    onClick={() => updateGoalProgress(goal.id, 1000)}
                    size="sm"
                    variant="outline"
                    className="text-xs border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    +₹1K
                  </Button>
                  <Button
                    onClick={() => updateGoalProgress(goal.id, 5000)}
                    size="sm"
                    variant="outline"
                    className="text-xs border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    +₹5K
                  </Button>
                  <Button
                    onClick={() => updateGoalProgress(goal.id, -1000)}
                    size="sm"
                    variant="outline"
                    className="text-xs border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    -₹1K
                  </Button>
                </div>
              </div>
            );
          })}
          
          {goals.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-400">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No financial goals set yet.</p>
              <p className="text-sm">Add your first goal to start tracking progress!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
