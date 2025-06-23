import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition component that adds smooth transitions between pages
 * using Framer Motion's AnimatePresence with CLS optimizations
 */
export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const location = useLocation();
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef<string>(location.pathname);
  const observerRef = useRef<ResizeObserver | null>(null);

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
      }, 300); // Match the exit animation duration

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Use ResizeObserver to detect content size changes
  useEffect(() => {
    if (!isInitialRender && contentRef.current) {
      // Clean up previous observer if it exists
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer
      observerRef.current = new ResizeObserver(() => {
        updateContentHeight();
      });

      // Start observing
      observerRef.current.observe(contentRef.current);

      // Cleanup function
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
    }
  }, [isInitialRender, updateContentHeight]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        minHeight: contentHeight ? `${contentHeight}px` : 'auto',
        contain: 'layout paint'
      }}
    >
      <AnimatePresence mode="wait">
        {React.Children.map(children, child => (
          <motion.div
            ref={contentRef}
            key={locationKey}
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-20px)' }}
            transition={{
              duration: 0.3,
              // Use transform instead of x/y properties to avoid layout shifts
              ease: [0.25, 0.1, 0.25, 1.0] // Cubic bezier for smoother motion
            }}
            style={{
              position: 'relative', // Changed from absolute to relative
              width: '100%',
              willChange: 'transform, opacity',
              contain: 'layout paint'
            }}
            onAnimationComplete={() => {
              // Update height after animation completes
              updateContentHeight();
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
