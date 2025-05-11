import React, { useEffect, useRef, useState } from 'react';
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

  // Default animation variants
  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Use provided variants or default ones
  const animationVariants = variants || defaultVariants;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is in view and (we want to animate every time OR it hasn't animated yet)
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          controls.start('visible');
          if (once) {
            setHasAnimated(true);
          }
        } else if (!once) {
          // If we want to animate every time, hide when out of view
          controls.start('hidden');
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls, threshold, once, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationVariants}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
