import { ReactNode, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Monitor, Smartphone, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile.tsx';
import { softSpringTransition } from '@/lib/motion';

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
  leftPanelLabel?: string;
  rightPanelLabel?: string;
}

/**
 * ResizablePanelLayout - A responsive panel layout component with mobile adaptations
 * Optimized for performance and visual consistency with the design system
 */
export const ResizablePanelLayout = memo(({
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
  leftPanelLabel = 'Instructions',
  rightPanelLabel = 'Testing Environment',
}: ResizablePanelLayoutProps) => {
  const isMobile = useIsMobile();
  const [activePanel, setActivePanel] = useState<'left' | 'right'>(isMobile ? 'right' : 'left');
  const [collapsedPanel, setCollapsedPanel] = useState<'left' | 'right' | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Reset active panel when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile) {
      setCollapsedPanel(null);
    }
  }, [isMobile]);

  // Memoized panel switch handlers
  const handleLeftPanelClick = useCallback(() => setActivePanel('left'), []);
  const handleRightPanelClick = useCallback(() => setActivePanel('right'), []);
  const handleCollapseLeft = useCallback(() => setCollapsedPanel('left'), []);
  const handleCollapseRight = useCallback(() => setCollapsedPanel('right'), []);
  const handleExpandPanel = useCallback(() => setCollapsedPanel(null), []);

  // Touch gesture handlers for mobile panel switching
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setIsDragging(false);
  }, [isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || touchStartX === null || touchStartY === null) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // Determine if this is a horizontal swipe (more X movement than Y)
    if (deltaX > deltaY && deltaX > 10) {
      setIsDragging(true);
    }
  }, [isMobile, touchStartX, touchStartY]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || touchStartX === null || !isDragging) {
      setTouchStartX(null);
      setTouchStartY(null);
      setIsDragging(false);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (Math.abs(deltaX) >= minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to left panel
        setActivePanel('left');
      } else {
        // Swipe left - go to right panel  
        setActivePanel('right');
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setIsDragging(false);
  }, [isMobile, touchStartX, isDragging]);

  // Memoized animation variants
  const panelVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { ...softSpringTransition, duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  }), []);

  const slideVariants = useMemo(() => ({
    left: { x: 0 },
    right: { x: '100%' },
    hidden: { x: '-100%' }
  }), []);

  // For mobile stacked view
  if (isMobile && mobileView === 'stacked') {
    return (
      <motion.div 
        className={cn("h-full w-full flex flex-col bg-background", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced mobile panel switcher */}
        <motion.div 
          className="flex border-b bg-card/50 backdrop-blur-sm relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Button
            variant={activePanel === 'left' ? "default" : "ghost"}
            className={cn(
              "flex-1 rounded-none py-3 transition-all duration-300 relative",
              "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring",
              activePanel === 'left' && "shadow-sm bg-background"
            )}
            onClick={handleLeftPanelClick}
          >
            <Monitor className="h-4 w-4 mr-2" />
            <span className="truncate text-sm font-medium">{leftPanelLabel}</span>
            {activePanel === 'left' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Button>
          <Button
            variant={activePanel === 'right' ? "default" : "ghost"}
            className={cn(
              "flex-1 rounded-none py-3 transition-all duration-300 relative",
              "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring",
              activePanel === 'right' && "shadow-sm bg-background"
            )}
            onClick={handleRightPanelClick}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            <span className="truncate text-sm font-medium">{rightPanelLabel}</span>
            {activePanel === 'right' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Button>
          
          {/* Swipe indicator */}
          <div className="absolute top-1 right-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="w-3 h-3" />
            <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Enhanced panel content with animations and touch support */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activePanel === 'left' && (
              <motion.div
                key="left-panel"
                className="h-full w-full absolute inset-0"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className={cn("h-full w-full overflow-y-auto", leftPanelClassName)}>
                  {leftPanel}
                </div>
              </motion.div>
            )}
            {activePanel === 'right' && (
              <motion.div
                key="right-panel"
                className="h-full w-full absolute inset-0"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className={cn("h-full w-full overflow-y-auto", rightPanelClassName)}>
                  {rightPanel}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile swipe indicator overlay */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center pointer-events-none z-10"
            >
              <div className="bg-background/90 rounded-full p-4 shadow-lg border">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Swipe to switch panels</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // For mobile tabbed view (alternative mobile layout)
  if (isMobile && mobileView === 'tabbed') {
    return (
      <motion.div 
        className={cn("h-full w-full flex flex-col bg-background", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 overflow-hidden relative">
          {/* Enhanced left panel */}
          <motion.div
            className="absolute inset-0"
            animate={activePanel === 'left' ? slideVariants.left : slideVariants.hidden}
            transition={{ ...softSpringTransition, duration: 0.4 }}
          >
            <div className={cn("h-full w-full overflow-y-auto", leftPanelClassName)}>
              {leftPanel}
            </div>
          </motion.div>

          {/* Enhanced right panel */}
          <motion.div
            className="absolute inset-0"
            animate={activePanel === 'right' ? slideVariants.left : slideVariants.right}
            transition={{ ...softSpringTransition, duration: 0.4 }}
          >
            <div className={cn("h-full w-full overflow-y-auto", rightPanelClassName)}>
              {rightPanel}
            </div>
          </motion.div>

          {/* Enhanced panel switcher buttons */}
          <motion.div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              activePanel === 'left' ? "right-4" : "-right-12"
            )}
            animate={{ x: activePanel === 'left' ? 0 : -48 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 shadow-lg backdrop-blur-sm bg-background/95 border hover:scale-105 transition-all duration-200"
              onClick={handleRightPanelClick}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              activePanel === 'right' ? "left-4" : "-left-12"
            )}
            animate={{ x: activePanel === 'right' ? 0 : 48 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 shadow-lg backdrop-blur-sm bg-background/95 border hover:scale-105 transition-all duration-200"
              onClick={handleLeftPanelClick}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Mobile swipe indicator */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center pointer-events-none z-20"
            >
                             <div className="bg-background/90 rounded-full p-4 shadow-lg border">
                 <div className="flex items-center gap-2 text-sm font-medium">
                   <ArrowLeft className="w-4 h-4" />
                   <span>Swipe to switch</span>
                   <ArrowRight className="w-4 h-4" />
                 </div>
               </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Enhanced desktop view with collapsible panels
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResizablePanelGroup
        direction={direction}
        className={cn("h-full w-full", className)}
      >
        <ResizablePanel
          defaultSize={collapsedPanel === 'left' ? 0 : defaultLeftSize}
          minSize={collapsedPanel === 'left' ? 0 : minLeftSize}
          className={cn(
            leftPanelClassName, 
            collapsedPanel === 'left' ? 'min-w-0 overflow-hidden' : 'overflow-hidden',
            "transition-all duration-300"
          )}
          collapsible={collapsedPanel === 'left'}
        >
          <div className="relative h-full overflow-hidden bg-card/30 backdrop-blur-sm">
            <div className="h-full overflow-y-auto">
              {leftPanel}
            </div>
            {!collapsedPanel && (
              <motion.div
                className="absolute top-3 right-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shadow-sm backdrop-blur-sm bg-background/80 border hover:bg-background/90 transition-all duration-200"
                  onClick={handleCollapseLeft}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle 
          withHandle 
          className={cn(
            handleClassName, 
            "mx-1 bg-border/50 hover:bg-border transition-colors duration-200",
            "data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=horizontal]:w-1"
          )} 
        />

        <ResizablePanel
          defaultSize={collapsedPanel === 'right' ? 0 : defaultRightSize}
          minSize={collapsedPanel === 'right' ? 0 : minRightSize}
          className={cn(
            rightPanelClassName, 
            collapsedPanel === 'right' ? 'min-w-0 overflow-hidden' : 'overflow-hidden',
            "transition-all duration-300"
          )}
          collapsible={collapsedPanel === 'right'}
        >
          <div className="relative h-full overflow-hidden bg-card/30 backdrop-blur-sm">
            <div className="h-full overflow-y-auto">
              {rightPanel}
            </div>
            {!collapsedPanel && (
              <motion.div
                className="absolute top-3 left-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 shadow-sm backdrop-blur-sm bg-background/80 border hover:bg-background/90 transition-all duration-200"
                  onClick={handleCollapseRight}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </div>
        </ResizablePanel>

        {/* Enhanced expand button when a panel is collapsed */}
        <AnimatePresence>
          {collapsedPanel && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto"
              >
                <Button
                  variant="secondary"
                  className="shadow-lg backdrop-blur-sm bg-background/95 border px-6 py-3 text-sm font-medium hover:bg-background transition-all duration-200"
                  onClick={handleExpandPanel}
                >
                  {collapsedPanel === 'left' ? (
                    <>
                      <Monitor className="h-4 w-4 mr-2" />
                      Show {leftPanelLabel}
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Show {rightPanelLabel}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ResizablePanelGroup>
    </motion.div>
  );
});

ResizablePanelLayout.displayName = 'ResizablePanelLayout';

export default ResizablePanelLayout;
