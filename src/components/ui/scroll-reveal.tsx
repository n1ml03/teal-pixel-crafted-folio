import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useAnimation, Variant } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  delay?: number;
  duration?: number;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  className?: string;
  once?: boolean;
}

/**
 * ScrollReveal component that animates its children when they enter the viewport
 * Optimized to prevent layout shifts and reduce jitter during scrolling
 */
export const ScrollReveal = ({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  variants,
  className = '',
  once = true
}: ScrollRevealProps) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Use provided variants or default ones
  const animationVariants = useMemo(() => {
    // Default animation variants - reduced y movement to minimize layout shifts
    const defaultVariants = {
      hidden: { opacity: 0, y: 10 }, // Reduced from 20 to 10 to minimize layout shifts
      visible: { opacity: 1, y: 0 }
    };
    return variants || defaultVariants;
  }, [variants]);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // If reduced motion is preferred, use simpler animation
  const finalVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      };
    }
    return animationVariants;
  }, [animationVariants, prefersReducedMotion]);

  useEffect(() => {
    // Skip animation if already animated and once is true
    if (once && hasAnimated) return;

    // Use a more efficient intersection observer with rootMargin to preload
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);

        if (entry.isIntersecting && (!once || !hasAnimated)) {
          // Use requestAnimationFrame to ensure we're in the right frame
          requestAnimationFrame(() => {
            controls.start('visible');
          });

          if (once) {
            setHasAnimated(true);
            // Disconnect observer if we only need to animate once
            observer.disconnect();
          }
        } else if (!once) {
          // Only animate out if we want to animate every time
          controls.start('hidden');
        }
      },
      {
        threshold,
        rootMargin: '50px 0px' // Preload slightly before element comes into view
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls, threshold, once, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={finalVariants}
      transition={{
        duration,
        delay,
        // Use more performant ease function
        ease: "easeOut"
      }}
      className={className}
      style={{
        // Force hardware acceleration to reduce jitter
        transform: isInView ? 'translateZ(0)' : 'none',
        // Use CSS containment for better performance
        contain: 'content',
        // Ensure the element takes up space even when hidden
        minHeight: hasAnimated ? 'auto' : ref.current?.offsetHeight || 'auto'
      }}
    >
      {children}
    </motion.div>
  );
};
