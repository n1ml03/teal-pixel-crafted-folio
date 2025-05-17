import React from 'react';
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
  variant?: 'default' | 'outline' | 'glow';
  onClick?: () => void;
}

/**
 * AchievementBadge - A component to display achievement badges with animations
 */
export const AchievementBadge = ({
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
  onClick
}: AchievementBadgeProps) => {
  // Get icon component based on icon name
  const getIcon = () => {
    const iconProps = {
      className: cn(
        "transition-all",
        size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'
      )
    };
    
    switch (icon) {
      case 'award': return <Award {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'trophy': return <Trophy {...iconProps} />;
      case 'zap': return <Zap {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'check': return <CheckCircle {...iconProps} />;
      case 'clock': return <Clock {...iconProps} />;
      case 'flame': return <Flame {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
      case 'sparkles': return <Sparkles {...iconProps} />;
      case 'lightbulb': return <Lightbulb {...iconProps} />;
      case 'rocket': return <Rocket {...iconProps} />;
      case 'medal': return <Medal {...iconProps} />;
      case 'crown': return <Crown {...iconProps} />;
      default: return <Award {...iconProps} />;
    }
  };
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-12 w-12';
      case 'lg': return 'h-24 w-24';
      case 'md':
      default: return 'h-16 w-16';
    }
  };
  
  // Get variant classes
  const getVariantClasses = () => {
    if (!unlocked) {
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
    
    switch (variant) {
      case 'outline':
        return 'bg-background border-2 border-primary text-primary';
      case 'glow':
        return 'bg-primary/10 border border-primary/50 text-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]';
      case 'default':
      default:
        return 'bg-primary text-primary-foreground border-primary-foreground/20';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.div
            className={cn(
              "relative flex flex-col items-center justify-center",
              onClick && "cursor-pointer",
              className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
          >
            <motion.div
              className={cn(
                "rounded-full flex items-center justify-center border",
                getSizeClasses(),
                getVariantClasses(),
                !unlocked && "opacity-50 grayscale"
              )}
              initial={unlocked ? { scale: 0.8, opacity: 0 } : {}}
              animate={unlocked ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {getIcon()}
              
              {/* Level badge if provided */}
              {level && unlocked && (
                <Badge 
                  variant="secondary" 
                  className="absolute -bottom-1 -right-1 min-w-5 h-5 flex items-center justify-center"
                >
                  {level}
                </Badge>
              )}
              
              {/* Progress circle for incomplete achievements */}
              {!unlocked && progress > 0 && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r={
                      size === 'sm' ? '20' : 
                      size === 'lg' ? '44' : 
                      '32'
                    }
                    strokeWidth="3"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.2"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    className="transition-all duration-1000"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r={
                      size === 'sm' ? '20' : 
                      size === 'lg' ? '44' : 
                      '32'
                    }
                    strokeWidth="3"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="100"
                    strokeDashoffset={100 - progress}
                    className="transition-all duration-1000"
                  />
                </svg>
              )}
            </motion.div>
            
            {/* Title below the badge */}
            {size !== 'sm' && (
              <span className={cn(
                "mt-2 text-center text-sm font-medium",
                !unlocked && "text-muted-foreground"
              )}>
                {title}
              </span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          <div className="space-y-1 p-1">
            <p className="font-medium">{title}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {points && unlocked && <p className="text-xs text-primary">+{points} points</p>}
            {date && unlocked && <p className="text-xs text-muted-foreground">Unlocked: {date}</p>}
            {!unlocked && progress > 0 && <p className="text-xs">{progress}% complete</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
