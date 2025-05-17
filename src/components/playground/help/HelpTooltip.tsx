import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  interactive?: boolean;
  delayDuration?: number;
}

/**
 * HelpTooltip - A reusable tooltip component for providing contextual help
 * 
 * @param content - The content to display in the tooltip
 * @param side - The side of the trigger to show the tooltip
 * @param align - The alignment of the tooltip relative to the trigger
 * @param className - Additional classes for the tooltip content
 * @param iconClassName - Additional classes for the help icon
 * @param iconSize - Size of the help icon in pixels
 * @param interactive - Whether the tooltip should be interactive
 * @param delayDuration - Delay before showing the tooltip in milliseconds
 */
export const HelpTooltip = ({
  content,
  side = 'top',
  align = 'center',
  className = '',
  iconClassName = '',
  iconSize = 16,
  interactive = false,
  delayDuration = 300
}: HelpTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className={cn(
              "inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
              iconClassName
            )}
            aria-label="Help"
          >
            <HelpCircle size={iconSize} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className={cn(
            "max-w-xs p-4",
            interactive && "cursor-auto select-text",
            className
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
