
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, Shield, Zap, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'budget' | 'savings' | 'streak' | 'milestone';
  threshold: number;
  currentValue: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  totalIncome: number;
  totalSavings: number;
  savingsRate: number;
  budgetCompliance: number;
  streak: number;
}

const AchievementSystem = ({ 
  totalIncome, 
  totalSavings, 
  savingsRate, 
  budgetCompliance, 
  streak 
}: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);

  const achievementData: Omit<Achievement, 'currentValue' | 'unlocked'>[] = [
    {
      id: 'first-budget',
      title: 'Budget Rookie',
      description: 'Create your first budget',
      icon: <Target className="h-4 w-4" />,
      category: 'budget',
      threshold: 1,
      rarity: 'common'
    },
    {
      id: 'savings-master',
      title: 'Savings Master',
      description: 'Achieve 20% savings rate',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'savings',
      threshold: 20,
      rarity: 'rare'
    },
    {
      id: 'budget-guardian',
      title: 'Budget Guardian',
      description: 'Maintain 90% budget compliance',
      icon: <Shield className="h-4 w-4" />,
      category: 'budget',
      threshold: 90,
      rarity: 'epic'
    },
    {
      id: 'streak-warrior',
      title: 'Streak Warrior',
      description: 'Maintain budget for 7 days',
      icon: <Zap className="h-4 w-4" />,
      category: 'streak',
      threshold: 7,
      rarity: 'rare'
    },
    {
      id: 'financial-emperor',
      title: 'Financial Emperor',
      description: 'Save ₹1,00,000',
      icon: <Crown className="h-4 w-4" />,
      category: 'milestone',
      threshold: 100000,
      rarity: 'legendary'
    }
  ];

  const rarityColors = {
    common: 'border-gray-500/30 bg-gray-500/5 text-gray-400',
    rare: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    epic: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
    legendary: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'
  };

  useEffect(() => {
    const updatedAchievements = achievementData.map(achievement => {
      let currentValue = 0;
      
      switch (achievement.category) {
        case 'budget':
          currentValue = achievement.id === 'first-budget' ? (totalIncome > 0 ? 1 : 0) : budgetCompliance;
          break;
        case 'savings':
          currentValue = savingsRate;
          break;
        case 'streak':
          currentValue = streak;
          break;
        case 'milestone':
          currentValue = totalSavings;
          break;
      }

      const wasUnlocked = achievements.find(a => a.id === achievement.id)?.unlocked || false;
      const isUnlocked = currentValue >= achievement.threshold;
      
      if (!wasUnlocked && isUnlocked) {
        setNewUnlocks(prev => [...prev, achievement.id]);
        setTimeout(() => {
          setNewUnlocks(prev => prev.filter(id => id !== achievement.id));
        }, 3000);
      }

      return {
        ...achievement,
        currentValue,
        unlocked: isUnlocked
      };
    });

    setAchievements(updatedAchievements);
  }, [totalIncome, totalSavings, savingsRate, budgetCompliance, streak]);

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalProgress = (unlockedAchievements.length / achievements.length) * 100;

  return (
    <Card className="bg-gray-900/50 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <CardHeader className="bg-cyan-500/10 border-b border-cyan-500/30">
        <CardTitle className="text-lg font-bold text-cyan-400 font-mono flex items-center gap-2">
          <Trophy className="h-5 w-5 animate-pulse" />
          [ ACHIEVEMENT MATRIX ]
          <Badge variant="outline" className="ml-auto text-cyan-400 border-cyan-500/50">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-cyan-300 mb-2">
            <span>Overall Progress</span>
            <span>{totalProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`
                p-3 rounded-lg border transition-all duration-300 relative
                ${achievement.unlocked ? rarityColors[achievement.rarity] : 'border-gray-700/50 bg-gray-800/30 text-gray-500'}
                ${newUnlocks.includes(achievement.id) ? 'animate-pulse scale-105' : ''}
                hover:scale-105
              `}
            >
              {newUnlocks.includes(achievement.id) && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-yellow-500 text-black animate-bounce">NEW!</Badge>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <div className={`p-1 rounded ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
                  <p className="text-xs opacity-80 mb-2">{achievement.description}</p>
                  
                  {!achievement.unlocked && (
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((achievement.currentValue / achievement.threshold) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementSystem;
