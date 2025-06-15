
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Target } from 'lucide-react';

interface StreakTrackerProps {
  budgetCompliance: number;
  leftover: number;
}

const StreakTracker = ({ budgetCompliance, leftover }: StreakTrackerProps) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [streakHistory, setStreakHistory] = useState<boolean[]>([]);

  useEffect(() => {
    // Load streak data from localStorage
    const savedStreak = localStorage.getItem('budgetStreak');
    const savedLongestStreak = localStorage.getItem('longestBudgetStreak');
    const savedHistory = localStorage.getItem('streakHistory');

    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
    if (savedLongestStreak) setLongestStreak(parseInt(savedLongestStreak));
    if (savedHistory) setStreakHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    // Determine if today is a "good budget day"
    const isGoodDay = budgetCompliance >= 80 && leftover >= 0;
    
    // Get today's date string
    const today = new Date().toDateString();
    const lastUpdate = localStorage.getItem('lastStreakUpdate');
    
    // Only update once per day
    if (lastUpdate !== today) {
      const newHistory = [...streakHistory.slice(-6), isGoodDay]; // Keep last 7 days
      setStreakHistory(newHistory);
      
      if (isGoodDay) {
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        
        if (newStreak > longestStreak) {
          setLongestStreak(newStreak);
          localStorage.setItem('longestBudgetStreak', newStreak.toString());
        }
        
        localStorage.setItem('budgetStreak', newStreak.toString());
      } else {
        setCurrentStreak(0);
        localStorage.setItem('budgetStreak', '0');
      }
      
      localStorage.setItem('streakHistory', JSON.stringify(newHistory));
      localStorage.setItem('lastStreakUpdate', today);
    }
  }, [budgetCompliance, leftover, currentStreak, longestStreak, streakHistory]);

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "You're on fire! 🔥";
    return "Legendary streak! 👑";
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return "text-gray-400";
    if (streak < 3) return "text-blue-400";
    if (streak < 7) return "text-yellow-400";
    if (streak < 30) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-gray-900/50 border-orange-500/30 shadow-lg shadow-orange-500/10">
      <CardHeader className="bg-orange-500/10 border-b border-orange-500/30">
        <CardTitle className="text-lg font-bold text-orange-400 font-mono flex items-center gap-2">
          <Flame className="h-5 w-5 animate-pulse" />
          [ STREAK TRACKER ]
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Current Streak */}
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold font-mono mb-2 ${getStreakColor(currentStreak)}`}>
            {currentStreak}
          </div>
          <div className="text-sm text-gray-400 mb-1">CURRENT STREAK</div>
          <Badge variant="outline" className="text-orange-400 border-orange-500/50">
            {getStreakMessage(currentStreak)}
          </Badge>
        </div>

        {/* Longest Streak */}
        {longestStreak > 0 && (
          <div className="text-center mb-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <div className="flex items-center justify-center gap-2 text-orange-300">
              <Target className="h-4 w-4" />
              <span className="text-sm">Personal Best: {longestStreak} days</span>
            </div>
          </div>
        )}

        {/* Weekly History */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-orange-300">
            <Calendar className="h-4 w-4" />
            <span>Last 7 Days</span>
          </div>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: 7 }, (_, i) => {
              const dayIndex = i;
              const hasData = dayIndex < streakHistory.length;
              const isGoodDay = hasData ? streakHistory[dayIndex] : false;
              
              return (
                <div
                  key={i}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                    ${hasData 
                      ? isGoodDay 
                        ? 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-400' 
                        : 'bg-red-500/30 border border-red-500/50 text-red-400'
                      : 'bg-gray-700/50 border border-gray-600/50 text-gray-500'
                    }
                  `}
                >
                  {hasData ? (isGoodDay ? '✓' : '✗') : '?'}
                </div>
              );
            })}
          </div>
          <div className="text-xs text-gray-500 text-center">
            ✓ = Good budget day (80%+ compliance, no deficit)
          </div>
        </div>

        {/* Next Milestone */}
        {currentStreak < 30 && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-sm text-gray-300 text-center">
              <span className="text-orange-400 font-semibold">
                {currentStreak < 7 ? 7 - currentStreak : 30 - currentStreak}
              </span>
              {" days to "}
              <span className="text-orange-400 font-semibold">
                {currentStreak < 7 ? "Weekly Warrior" : "Monthly Master"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
