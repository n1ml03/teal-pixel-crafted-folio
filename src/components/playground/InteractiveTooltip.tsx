import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { X, HelpCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type TooltipType = 'info' | 'help' | 'warning' | 'success';

interface InteractiveTooltipProps {
  content: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  type?: TooltipType;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconClassName?: string;
  interactive?: boolean;
  dismissable?: boolean;
  showArrow?: boolean;
  maxWidth?: string;
  delayDuration?: number;
  onDismiss?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  defaultOpen?: boolean;
  persistent?: boolean;
}

/**
 * InteractiveTooltip - An enhanced tooltip component with animations and interactive features
 */
export const InteractiveTooltip = ({
  content,
  title,
  children,
  type = 'info',
  side = 'top',
  align = 'center',
  className = '',
  iconClassName = '',
  interactive = true,
  dismissable = false,
  showArrow = true,
  maxWidth = '320px',
  delayDuration = 300,
  onDismiss,
  onOpen,
  onClose,
  defaultOpen = false,
  persistent = false,
}: InteractiveTooltipProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if dismissed and persistent
  if (isDismissed && persistent) {
    return <>{children}</>;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsOpen(false);
    onDismiss?.();
  };

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'help':
        return <HelpCircle className={cn("h-4 w-4", iconClassName)} />;
      case 'warning':
        return <AlertCircle className={cn("h-4 w-4 text-amber-500", iconClassName)} />;
      case 'success':
        return <Info className={cn("h-4 w-4 text-green-500", iconClassName)} />;
      case 'info':
      default:
        return <Info className={cn("h-4 w-4 text-blue-500", iconClassName)} />;
    }
  };

  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case 'help':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip 
        open={isOpen} 
        defaultOpen={defaultOpen}
        onOpenChange={(open) => {
          if (open) {
            handleOpen();
          } else {
            handleClose();
          }
        }}
        delayDuration={delayDuration}
      >
        <TooltipTrigger asChild>
          {children || (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              className={cn(
                "rounded-full w-6 h-6 p-0",
                iconClassName
              )}
              aria-label={`${type} tooltip`}
            >
              {getIcon()}
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "p-0 overflow-hidden",
            interactive && "cursor-auto select-text",
            !showArrow && "tooltip-no-arrow",
            className
          )}
          style={{ maxWidth }}
          sideOffset={8}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "p-3 rounded-md border",
                getBackgroundColor()
              )}
            >
              {dismissable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 p-0 opacity-70 hover:opacity-100"
                  onClick={handleDismiss}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              {title && (
                <div className="font-medium mb-1">{title}</div>
              )}
              
              <div className={cn(
                "text-sm",
                dismissable && "pr-5"
              )}>
                {content}
              </div>
            </motion.div>
          </AnimatePresence>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InteractiveTooltip;
