
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface FinancialHealthScoreProps {
  totalIncome: number;
  totalNeeds: number;
  totalWants: number;
  totalSavings: number;
  leftover: number;
}

const FinancialHealthScore = ({ 
  totalIncome, 
  totalNeeds, 
  totalWants, 
  totalSavings, 
  leftover 
}: FinancialHealthScoreProps) => {
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [grade, setGrade] = useState('F');
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    // Calculate financial health score (0-100)
    let healthScore = 0;
    const newInsights: string[] = [];

    if (totalIncome > 0) {
      const needsRatio = totalNeeds / totalIncome;
      const wantsRatio = totalWants / totalIncome;
      const savingsRatio = totalSavings / totalIncome;

      // Needs score (50% weight) - ideal is 50%
      const needsScore = Math.max(0, 100 - Math.abs(needsRatio - 0.5) * 200);
      healthScore += needsScore * 0.3;

      // Wants score (30% weight) - ideal is 30%
      const wantsScore = Math.max(0, 100 - Math.abs(wantsRatio - 0.3) * 333);
      healthScore += wantsScore * 0.2;

      // Savings score (20% weight) - ideal is 20%
      const savingsScore = Math.max(0, 100 - Math.abs(savingsRatio - 0.2) * 500);
      healthScore += savingsScore * 0.3;

      // Balance score - positive leftover is good
      const balanceScore = leftover >= 0 ? 100 : Math.max(0, 100 + (leftover / totalIncome) * 500);
      healthScore += balanceScore * 0.2;

      // Generate insights
      if (needsRatio > 0.6) {
        newInsights.push("Consider reducing essential expenses");
      } else if (needsRatio < 0.4) {
        newInsights.push("Great job keeping needs under control!");
      }

      if (wantsRatio > 0.4) {
        newInsights.push("Try to reduce discretionary spending");
      } else if (wantsRatio < 0.2) {
        newInsights.push("You're very disciplined with wants!");
      }

      if (savingsRatio < 0.1) {
        newInsights.push("Increase your savings rate for better security");
      } else if (savingsRatio > 0.3) {
        newInsights.push("Excellent savings discipline!");
      }

      if (leftover < 0) {
        newInsights.push("You're overspending - time to adjust!");
      } else if (leftover > totalIncome * 0.1) {
        newInsights.push("Great surplus - consider investing more!");
      }
    }

    const finalScore = Math.round(Math.max(0, Math.min(100, healthScore)));
    setScore(finalScore);
    setInsights(newInsights);

    // Determine grade
    if (finalScore >= 90) setGrade('A+');
    else if (finalScore >= 80) setGrade('A');
    else if (finalScore >= 70) setGrade('B');
    else if (finalScore >= 60) setGrade('C');
    else if (finalScore >= 50) setGrade('D');
    else setGrade('F');

  }, [totalIncome, totalNeeds, totalWants, totalSavings, leftover]);

  // Animate score
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
    if (grade === 'B') return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
    return 'border-red-500/50 bg-red-500/10 text-red-400';
  };

  return (
    <Card className="bg-gray-900/50 border-purple-500/30 shadow-lg shadow-purple-500/10">
      <CardHeader className="bg-purple-500/10 border-b border-purple-500/30">
        <CardTitle className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2">
          <Activity className="h-5 w-5 animate-pulse" />
          [ FINANCIAL HEALTH ]
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - animatedScore / 100)}`}
                className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold font-mono ${getScoreColor(score)}`}>
                  {animatedScore}
                </div>
                <div className="text-sm text-gray-400">SCORE</div>
              </div>
            </div>
          </div>
          
          <Badge className={`mt-4 px-4 py-2 text-lg font-bold ${getGradeColor(grade)}`}>
            GRADE: {grade}
          </Badge>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              INSIGHTS
            </h4>
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {insight.includes('Great') || insight.includes('Excellent') ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-gray-300">{insight}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialHealthScore;
