import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  exitBeforeEnter?: boolean;
}

/**
 * PageTransition - A component that adds smooth transitions between pages
 *
 * @param children The page content to be animated
 * @param className Additional classes for the container
 * @param mode The animation mode (fade, slide, scale, none)
 * @param duration The animation duration in seconds
 * @param direction The slide direction (for slide mode)
 * @param exitBeforeEnter Whether to wait for exit animations to complete before entering
 */
export const PageTransition = ({
  children,
  className = '',
  mode = 'fade',
  duration = 0.3,
  direction = 'up',
  exitBeforeEnter = true,
}: PageTransitionProps) => {
  const location = useLocation();
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef<string>(location.pathname);

  // Create a stable key for AnimatePresence based on the current route
  const locationKey = location.pathname + location.search;

  // Measure content height to prevent layout shifts
  const updateContentHeight = useCallback(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      if (height > 0 && (contentHeight === null || Math.abs(height - contentHeight) > 5)) {
        setContentHeight(height);
      }
    }
  }, [contentHeight]);

  // Get animation variants based on mode and direction
  // Using transform instead of x/y properties to avoid layout shifts
  const getVariants = () => {
    switch (mode) {
      case 'slide':
        return {
          initial: {
            opacity: 0,
            transform: direction === 'left'
              ? 'translateX(20px)'
              : direction === 'right'
                ? 'translateX(-20px)'
                : direction === 'up'
                  ? 'translateY(20px)'
                  : 'translateY(-20px)',
          },
          animate: {
            opacity: 1,
            transform: 'translate(0, 0)',
          },
          exit: {
            opacity: 0,
            transform: direction === 'left'
              ? 'translateX(-20px)'
              : direction === 'right'
                ? 'translateX(20px)'
                : direction === 'up'
                  ? 'translateY(-20px)'
                  : 'translateY(20px)',
          },
        };
      case 'scale':
        return {
          initial: { opacity: 0, transform: 'scale(0.95)' },
          animate: { opacity: 1, transform: 'scale(1)' },
          exit: { opacity: 0, transform: 'scale(1.05)' },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // If no animation is desired, just render children
  if (mode === 'none') {
    return <div className={className}>{children}</div>;
  }

  // Handle initial render once
  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  // Update content height when children change
  useEffect(() => {
    if (!isInitialRender) {
      // Use requestAnimationFrame to ensure the DOM has been updated
      const rafId = requestAnimationFrame(() => {
        updateContentHeight();
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [children, isInitialRender, updateContentHeight]);

  // Handle route changes
  useEffect(() => {
    // Check if the path has actually changed
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;

      // Small delay to allow for exit animation before resetting height
      const timer = setTimeout(() => {
        setContentHeight(null);
      }, duration * 1000); // Convert duration to milliseconds

      return () => clearTimeout(timer);
    }
  }, [location.pathname, duration]);

  // Use ResizeObserver to detect content size changes
  useEffect(() => {
    if (!isInitialRender && contentRef.current) {
      const observer = new ResizeObserver(() => {
        updateContentHeight();
      });

      observer.observe(contentRef.current);
      return () => observer.disconnect();
    }
  }, [isInitialRender, updateContentHeight]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        minHeight: contentHeight ? `${contentHeight}px` : 'auto',
        contain: 'layout paint'
      }}
    >
      <AnimatePresence mode={exitBeforeEnter ? 'wait' : 'sync'}>
        <motion.div
          ref={contentRef}
          key={locationKey}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={getVariants()}
          transition={{
            duration,
            ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smoother motion
          }}
          className="w-full"
          style={{
            willChange: 'transform, opacity',
            contain: 'layout paint'
          }}
          onAnimationComplete={() => {
            // Update height after animation completes
            updateContentHeight();
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
