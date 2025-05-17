import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: string;
  progress?: number;
  showPercentage?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  onStepClick?: (stepId: string) => void;
  showTimeElapsed?: boolean;
  timeElapsed?: number; // in seconds
}

/**
 * ProgressIndicator - A component to visualize progress through a series of steps
 */
export const ProgressIndicator = ({
  steps,
  currentStep,
  progress = 0,
  showPercentage = true,
  orientation = 'horizontal',
  size = 'md',
  animated = true,
  className = '',
  onStepClick,
  showTimeElapsed = false,
  timeElapsed = 0
}: ProgressIndicatorProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // Format time elapsed
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Animate progress
  useEffect(() => {
    if (animated) {
      // Start from current value
      const startValue = animatedProgress;
      const endValue = progress;
      const duration = 1000; // 1 second
      const startTime = Date.now();
      
      const animateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        const newValue = startValue + (endValue - startValue) * easedProgress;
        setAnimatedProgress(newValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateProgress);
        }
      };
      
      requestAnimationFrame(animateProgress);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);
  
  // Easing function
  const easeOutCubic = (x: number): number => {
    return 1 - Math.pow(1 - x, 3);
  };
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          step: 'h-6 w-6',
          icon: 'h-3 w-3',
          text: 'text-xs',
          line: 'h-1'
        };
      case 'lg':
        return {
          step: 'h-10 w-10',
          icon: 'h-5 w-5',
          text: 'text-base',
          line: 'h-2'
        };
      case 'md':
      default:
        return {
          step: 'h-8 w-8',
          icon: 'h-4 w-4',
          text: 'text-sm',
          line: 'h-1.5'
        };
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  return (
    <div className={cn(
      'w-full',
      orientation === 'vertical' ? 'flex flex-col space-y-2' : 'space-y-4',
      className
    )}>
      {/* Progress bar */}
      <div className="w-full space-y-1">
        {showPercentage && (
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress</span>
            <div className="flex items-center space-x-2">
              {showTimeElapsed && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeElapsed)}
                </span>
              )}
              <span>{Math.round(animatedProgress)}%</span>
            </div>
          </div>
        )}
        <Progress 
          value={animatedProgress} 
          className={cn(sizeClasses.line, "w-full")} 
        />
      </div>
      
      {/* Steps */}
      <div className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col space-y-4' : 'justify-between items-center'
      )}>
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = step.current || step.id === currentStep;
          
          return (
            <div 
              key={step.id}
              className={cn(
                'flex',
                orientation === 'vertical' ? 'flex-row items-start' : 'flex-col items-center',
                'relative'
              )}
            >
              {/* Step indicator */}
              <motion.div
                className={cn(
                  'rounded-full flex items-center justify-center',
                  sizeClasses.step,
                  isCompleted ? 'bg-primary text-primary-foreground' : 
                    isCurrent ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' : 
                    'bg-muted text-muted-foreground',
                  onStepClick ? 'cursor-pointer' : ''
                )}
                whileHover={onStepClick ? { scale: 1.05 } : {}}
                whileTap={onStepClick ? { scale: 0.95 } : {}}
                onClick={() => onStepClick && onStepClick(step.id)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${isCompleted}-${isCurrent}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className={sizeClasses.icon} />
                    ) : (
                      <Circle className={sizeClasses.icon} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
              {/* Step label */}
              <div className={cn(
                sizeClasses.text,
                orientation === 'vertical' ? 'ml-3' : 'mt-2',
                isCompleted ? 'text-foreground' : 
                  isCurrent ? 'text-blue-600 dark:text-blue-400 font-medium' : 
                  'text-muted-foreground'
              )}>
                {step.label}
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
              
              {/* Connector line for vertical orientation */}
              {orientation === 'vertical' && index < steps.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border h-full transform -translate-x-1/2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
