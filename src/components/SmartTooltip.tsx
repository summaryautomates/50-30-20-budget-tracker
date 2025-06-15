
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, Lightbulb } from 'lucide-react';

interface SmartTooltipProps {
  title: string;
  content: string;
  tip?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: React.ReactNode;
}

const SmartTooltip = ({ 
  title, 
  content, 
  tip, 
  position = 'top',
  trigger 
}: SmartTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div 
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-pointer"
      >
        {trigger || <HelpCircle className="h-4 w-4 text-blue-400 hover:text-blue-300 transition-colors" />}
      </div>

      {isVisible && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsVisible(false)}
          />
          <Card className={`absolute z-50 w-80 ${positionClasses[position]} bg-gray-900/95 border-blue-500/30 shadow-xl`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-blue-400">{title}</h4>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-300 mb-3">{content}</p>
              {tip && (
                <div className="bg-yellow-500/10 p-2 rounded border border-yellow-500/30 flex items-start gap-2">
                  <Lightbulb className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-300">{tip}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SmartTooltip;
