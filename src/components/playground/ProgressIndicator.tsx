import { useState, useEffect } from 'react';
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
  }, [progress, animated, animatedProgress]);

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
      {/* Enhanced Progress bar with glassmorphism */}
      <div className="w-full space-y-2">
        {showPercentage && (
          <motion.div 
            className="flex justify-between items-center text-xs text-muted-foreground backdrop-blur-sm bg-white/50 rounded-lg px-3 py-1.5 border border-white/30 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-medium text-gray-700">Progress</span>
            <div className="flex items-center space-x-3">
              {showTimeElapsed && (
                <motion.span 
                  className="flex items-center bg-blue-50/80 px-2 py-0.5 rounded-full"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Clock className="h-3 w-3 mr-1 text-blue-600" />
                  <span className="font-mono text-blue-700">{formatTime(timeElapsed)}</span>
                </motion.span>
              )}
              <motion.span 
                className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-bold"
                key={Math.round(animatedProgress)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
              >
                {Math.round(animatedProgress)}%
              </motion.span>
            </div>
          </motion.div>
        )}
        <div className="relative">
          <Progress
            value={animatedProgress}
            className={cn(sizeClasses.line, "w-full bg-gray-100/50 backdrop-blur-sm border border-white/30 rounded-full overflow-hidden shadow-inner")}
          />
          {/* Animated progress glow effect */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
            style={{ 
              width: `${animatedProgress}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Enhanced Steps with modern design */}
      <div className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col space-y-4' : 'justify-between items-center'
      )}>
        {steps.map((step, index) => {
          const isCompleted = step.completed;
          const isCurrent = step.current || step.id === currentStep;

          return (
            <motion.div
              key={step.id}
              className={cn(
                'flex',
                orientation === 'vertical' ? 'flex-row items-start' : 'flex-col items-center',
                'relative'
              )}
              initial={{ opacity: 0, x: orientation === 'vertical' ? -20 : 0, y: orientation === 'horizontal' ? 20 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Enhanced Step indicator with glassmorphism */}
              <motion.div
                className={cn(
                  'rounded-full flex items-center justify-center backdrop-blur-sm border-2 shadow-lg relative',
                  sizeClasses.step,
                  isCompleted ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white border-green-300 shadow-green-200' :
                    isCurrent ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white border-blue-300 shadow-blue-200' :
                    'bg-white/80 text-gray-600 border shadow-gray-100',
                  onStepClick ? 'cursor-pointer hover:shadow-xl' : ''
                )}
                whileHover={onStepClick ? { 
                  scale: 1.05, 
                  boxShadow: isCompleted ? "0 10px 25px -5px rgba(16, 185, 129, 0.4)" : 
                             isCurrent ? "0 10px 25px -5px rgba(59, 130, 246, 0.4)" :
                             "0 10px 25px -5px rgba(107, 114, 128, 0.2)"
                } : {}}
                whileTap={onStepClick ? { scale: 0.95 } : {}}
                onClick={() => onStepClick && onStepClick(step.id)}
                transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${isCompleted}-${isCurrent}`}
                    initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  >
                    {isCompleted ? (
                      <CheckCircle className={sizeClasses.icon} />
                    ) : (
                      <Circle className={sizeClasses.icon} />
                    )}
                  </motion.div>
                </AnimatePresence>
                
                {/* Subtle pulse animation for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.div>

              {/* Enhanced Step label with better typography */}
              <motion.div 
                className={cn(
                  sizeClasses.text,
                  orientation === 'vertical' ? 'ml-3' : 'mt-3',
                  'backdrop-blur-sm bg-white/60 rounded-lg px-2 py-1 border border-white/30',
                  isCompleted ? 'text-green-700 border-green-200/50' :
                    isCurrent ? 'text-blue-700 border-blue-200/50 font-semibold' :
                    'text-gray-600 border/50'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                <div className="font-medium">{step.label}</div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1 opacity-80">
                    {step.description}
                  </div>
                )}
              </motion.div>

              {/* Enhanced connection line for vertical orientation */}
              {orientation === 'vertical' && index < steps.length - 1 && (
                <motion.div
                  className={cn(
                    'absolute left-4 top-8 w-px bg-gradient-to-b transform -translate-x-1/2',
                    sizeClasses.step === 'h-6 w-6' ? 'h-8' : 
                    sizeClasses.step === 'h-10 w-10' ? 'h-12' : 'h-10',
                    isCompleted ? 'from-green-300 to-green-200' :
                    isCurrent ? 'from-blue-300 to-blue-200' :
                    'from-gray-200 to-gray-100'
                  )}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  style={{ transformOrigin: 'top' }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
