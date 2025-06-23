import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Award,
  Star,
  Trophy,
  Zap,
  Target,
  CheckCircle,
  Clock,
  Flame,
  Heart,
  Shield,
  Sparkles,
  Lightbulb,
  Rocket,
  Medal,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { softSpringTransition } from '@/lib/motion';

export type AchievementIcon = 
  | 'award' 
  | 'star' 
  | 'trophy' 
  | 'zap' 
  | 'target' 
  | 'check' 
  | 'clock' 
  | 'flame'
  | 'heart'
  | 'shield'
  | 'sparkles'
  | 'lightbulb'
  | 'rocket'
  | 'medal'
  | 'crown';

export interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon: AchievementIcon;
  unlocked?: boolean;
  progress?: number;
  level?: number;
  date?: string;
  points?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'glow' | 'elegant';
  onClick?: () => void;
  animationDelay?: number;
}

// Icon mapping for better performance
const iconMap = {
  award: Award,
  star: Star,
  trophy: Trophy,
  zap: Zap,
  target: Target,
  check: CheckCircle,
  clock: Clock,
  flame: Flame,
  heart: Heart,
  shield: Shield,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  rocket: Rocket,
  medal: Medal,
  crown: Crown,
} as const;

/**
 * AchievementBadge - A polished component to display achievement badges with elegant animations
 * Optimized for performance and visual consistency with the design system
 */
export const AchievementBadge = memo(({
  title,
  description,
  icon,
  unlocked = false,
  progress = 0,
  level,
  date,
  points,
  className,
  size = 'md',
  variant = 'default',
  onClick,
  animationDelay = 0,
}: AchievementBadgeProps) => {
  // Memoized icon component for performance
  const IconComponent = useMemo(() => {
    const Component = iconMap[icon] || Award;
    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8'
    };
    
    return <Component className={cn('transition-all duration-300', iconSizes[size])} />;
  }, [icon, size]);
  
  // Memoized size classes
  const sizeClasses = useMemo(() => {
    const sizes = {
      sm: 'h-12 w-12',
      md: 'h-16 w-16',
      lg: 'h-24 w-24'
    };
    return sizes[size];
  }, [size]);
  
  // Memoized variant classes with enhanced design
  const variantClasses = useMemo(() => {
    if (!unlocked) {
      return 'bg-muted/50 text-muted-foreground border-muted-foreground/20 backdrop-blur-sm';
    }
    
    const variants = {
      default: 'bg-primary text-primary-foreground border-primary/20 shadow-lg shadow-primary/25',
      outline: 'bg-background/95 border-2 border-primary text-primary backdrop-blur-sm hover:bg-primary/5',
      glow: 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 text-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] backdrop-blur-sm',
      elegant: 'bg-gradient-to-br from-white to-gray-50 border border text-gray-700 shadow-md hover:shadow-lg dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:text-gray-200'
    };
    
    return variants[variant];
  }, [variant, unlocked]);

  // Memoized progress circle calculations
  const progressCircle = useMemo(() => {
    if (unlocked || progress <= 0) return null;
    
    const radii = { sm: 20, md: 28, lg: 40 };
    const radius = radii[size];
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return { radius, circumference, strokeDashoffset };
  }, [progress, size, unlocked]);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "relative flex flex-col items-center justify-center group",
              onClick && "cursor-pointer",
              className
            )}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              ...softSpringTransition,
              delay: animationDelay,
              duration: 0.6
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
          >
            {/* Main badge container */}
            <motion.div
              className={cn(
                "rounded-full flex items-center justify-center border-2 transition-all duration-500 relative overflow-hidden",
                sizeClasses,
                variantClasses,
                !unlocked && "opacity-60 grayscale",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
                "hover:before:opacity-100"
              )}
              layout
            >
              {/* Background glow effect for unlocked achievements */}
              {unlocked && variant === 'glow' && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-radial from-primary/30 to-transparent"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              
              {/* Icon */}
              <div className="relative z-10">
                {IconComponent}
              </div>
              
              {/* Level badge */}
              {level && unlocked && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "absolute -bottom-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs font-bold",
                    "bg-background border border shadow-sm",
                    "transition-all duration-300 group-hover:scale-110"
                  )}
                >
                  {level}
                </Badge>
              )}
              
              {/* Progress ring for incomplete achievements */}
              {progressCircle && (
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  {/* Background circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={progressCircle.radius}
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.15"
                    className="transition-all duration-500"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r={progressCircle.radius}
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeDasharray={progressCircle.circumference}
                    initial={{ strokeDashoffset: progressCircle.circumference }}
                    animate={{ strokeDashoffset: progressCircle.strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: animationDelay + 0.3 }}
                    className="transition-all duration-500"
                  />
                </svg>
              )}
            </motion.div>
            
            {/* Title below the badge */}
            {size !== 'sm' && (
              <motion.span 
                className={cn(
                  "mt-3 text-center font-medium transition-all duration-300",
                  size === 'lg' ? 'text-sm' : 'text-xs',
                  !unlocked ? "text-muted-foreground" : "text-foreground",
                  "group-hover:text-primary"
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: animationDelay + 0.2 }}
              >
                {title}
              </motion.span>
            )}

            {/* Unlock animation effect */}
            {unlocked && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/50"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        
        <TooltipContent 
          side="top" 
          align="center" 
          className={cn(
            "max-w-xs p-3 bg-card/95 backdrop-blur-sm border shadow-lg",
            "transition-all duration-200"
          )}
        >
          <div className="space-y-2">
            <p className="font-semibold text-sm">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 pt-1">
              {points && unlocked && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  +{points} pts
                </Badge>
              )}
              {date && unlocked && (
                <Badge variant="outline" className="text-xs">
                  {date}
                </Badge>
              )}
              {!unlocked && progress > 0 && (
                <Badge variant="outline" className="text-xs bg-muted/10">
                  {progress}% complete
                </Badge>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

AchievementBadge.displayName = 'AchievementBadge';

export default AchievementBadge;
