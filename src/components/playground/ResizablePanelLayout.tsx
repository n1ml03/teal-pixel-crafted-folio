import { ReactNode, useState, useEffect } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile.tsx';

interface ResizablePanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftSize?: number;
  defaultRightSize?: number;
  minLeftSize?: number;
  minRightSize?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
  leftPanelClassName?: string;
  rightPanelClassName?: string;
  handleClassName?: string;
  mobileView?: 'stacked' | 'tabbed';
}

export const ResizablePanelLayout = ({
  leftPanel,
  rightPanel,
  defaultLeftSize = 30,
  defaultRightSize = 70,
  minLeftSize = 20,
  minRightSize = 30,
  direction = "horizontal",
  className,
  leftPanelClassName,
  rightPanelClassName,
  handleClassName,
  mobileView = 'stacked',
}: ResizablePanelLayoutProps) => {
  const isMobile = useIsMobile();
  const [activePanel, setActivePanel] = useState<'left' | 'right'>(isMobile ? 'right' : 'left');
  const [collapsedPanel, setCollapsedPanel] = useState<'left' | 'right' | null>(null);

  // Reset active panel when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile) {
      setCollapsedPanel(null);
    }
  }, [isMobile]);

  // For mobile stacked view
  if (isMobile && mobileView === 'stacked') {
    return (
      <div className={cn("h-full w-full flex flex-col", className)}>
        {/* Mobile panel switcher */}
        <div className="flex border-b">
          <Button
            variant={activePanel === 'left' ? "default" : "ghost"}
            className="flex-1 rounded-none py-3"
            onClick={() => setActivePanel('left')}
          >
            <span className="truncate">Instructions</span>
          </Button>
          <Button
            variant={activePanel === 'right' ? "default" : "ghost"}
            className="flex-1 rounded-none py-3"
            onClick={() => setActivePanel('right')}
          >
            <span className="truncate">Testing Environment</span>
          </Button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          <div className={cn(
            "h-full w-full transition-all duration-300",
            activePanel === 'left' ? "block" : "hidden"
          )}>
            {leftPanel}
          </div>
          <div className={cn(
            "h-full w-full transition-all duration-300",
            activePanel === 'right' ? "block" : "hidden"
          )}>
            {rightPanel}
          </div>
        </div>
      </div>
    );
  }

  // For mobile tabbed view (alternative mobile layout)
  if (isMobile && mobileView === 'tabbed') {
    return (
      <div className={cn("h-full w-full flex flex-col", className)}>
        <div className="flex-1 overflow-hidden relative">
          {/* Left panel */}
          <div className={cn(
            "absolute inset-0 transition-transform duration-300 ease-in-out",
            activePanel === 'left' ? "translate-x-0" : "-translate-x-full"
          )}>
            {leftPanel}
          </div>

          {/* Right panel */}
          <div className={cn(
            "absolute inset-0 transition-transform duration-300 ease-in-out",
            activePanel === 'right' ? "translate-x-0" : "translate-x-full"
          )}>
            {rightPanel}
          </div>

          {/* Panel switcher buttons */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300",
              activePanel === 'left' ? "right-2" : "-right-10"
            )}
            onClick={() => setActivePanel('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300",
              activePanel === 'right' ? "left-2" : "-left-10"
            )}
            onClick={() => setActivePanel('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Desktop view with collapsible panels
  return (
    <ResizablePanelGroup
      direction={direction}
      className={cn("h-full w-full", className)}
    >
      <ResizablePanel
        defaultSize={collapsedPanel === 'left' ? 0 : defaultLeftSize}
        minSize={collapsedPanel === 'left' ? 0 : minLeftSize}
        className={cn(leftPanelClassName, collapsedPanel === 'left' ? 'min-w-0 overflow-hidden' : 'overflow-hidden')}
        collapsible={collapsedPanel === 'left'}
      >
        <div className="relative h-full overflow-hidden">
          {leftPanel}
          {!collapsedPanel && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10 h-6 w-6 shadow-sm"
              onClick={() => setCollapsedPanel('left')}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className={cn(handleClassName, "mx-1")} />

      <ResizablePanel
        defaultSize={collapsedPanel === 'right' ? 0 : defaultRightSize}
        minSize={collapsedPanel === 'right' ? 0 : minRightSize}
        className={cn(rightPanelClassName, collapsedPanel === 'right' ? 'min-w-0 overflow-hidden' : 'overflow-hidden')}
        collapsible={collapsedPanel === 'right'}
      >
        <div className="relative h-full overflow-hidden">
          {rightPanel}
          {!collapsedPanel && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 left-2 z-10 h-6 w-6 shadow-sm"
              onClick={() => setCollapsedPanel('right')}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </ResizablePanel>

      {/* Expand button when a panel is collapsed */}
      {collapsedPanel && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <Button
            variant="secondary"
            className="pointer-events-auto"
            onClick={() => setCollapsedPanel(null)}
          >
            {collapsedPanel === 'left' ? 'Show Instructions' : 'Show Testing Environment'}
          </Button>
        </div>
      )}
    </ResizablePanelGroup>
  );
};

export default ResizablePanelLayout;
