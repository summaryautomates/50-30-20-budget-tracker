
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Target, DollarSign, TrendingUp, CheckCircle, X } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWizard = ({ onComplete, onSkip }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: "Welcome to Ocean Financial Suite",
      description: "Let's set up your budget in 3 simple steps to help you achieve financial freedom.",
      icon: <Target className="h-8 w-8 text-blue-400" />,
      content: (
        <div className="text-center space-y-4">
          <div className="text-lg text-gray-300">
            Track your income, manage expenses, and build savings with our powerful 50/30/20 budget system.
          </div>
          <div className="flex justify-center gap-4 text-sm">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/50">50% Needs</Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">30% Wants</Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">20% Savings</Badge>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Monthly Income",
      description: "Start by entering your total monthly income from all sources.",
      icon: <DollarSign className="h-8 w-8 text-green-400" />,
      content: (
        <div className="space-y-4">
          <div className="text-gray-300">
            Add your salary, freelance income, investments, or any other regular income sources.
          </div>
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
            <div className="text-sm text-green-300 mb-2">💡 Pro Tip:</div>
            <div className="text-sm text-gray-300">
              Use your net income (after taxes) for more accurate budgeting.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Track Your Expenses",
      description: "Categorize your spending into Needs, Wants, and Savings.",
      icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
              <div className="text-red-400 font-semibold mb-1">Needs (50%)</div>
              <div className="text-xs text-gray-300">Rent, utilities, groceries, insurance</div>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
              <div className="text-blue-400 font-semibold mb-1">Wants (30%)</div>
              <div className="text-xs text-gray-300">Entertainment, dining out, hobbies</div>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
              <div className="text-green-400 font-semibold mb-1">Savings (20%)</div>
              <div className="text-xs text-gray-300">Emergency fund, investments, goals</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start tracking your budget and unlock achievements as you progress.",
      icon: <CheckCircle className="h-8 w-8 text-emerald-400" />,
      content: (
        <div className="text-center space-y-4">
          <div className="text-lg text-emerald-300">
            🎉 Welcome to your financial journey!
          </div>
          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
            <div className="text-sm text-purple-300 mb-2">🏆 Game Mode Available</div>
            <div className="text-sm text-gray-300">
              Enable Game Mode to unlock achievements, track streaks, and monitor your financial health score.
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl bg-gray-900/95 border-blue-500/30 shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <CardHeader className="relative bg-blue-500/10 border-b border-blue-500/30">
          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 mb-4">
            {steps[currentStep].icon}
            <div>
              <CardTitle className="text-xl font-bold text-blue-400 font-mono">
                {steps[currentStep].title}
              </CardTitle>
              <div className="text-sm text-gray-400 mt-1">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <p className="text-gray-300 mb-4">{steps[currentStep].description}</p>
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrev}
              variant="outline"
              disabled={currentStep === 0}
              className="gap-2 border-gray-600 text-gray-400 hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button
                onClick={onSkip}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                Skip Tutorial
              </Button>
              <Button
                onClick={handleNext}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
