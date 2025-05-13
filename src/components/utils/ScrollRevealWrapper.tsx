import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollRevealWrapperProps {
  children: ReactNode;
  delay?: number;
  threshold?: number;
  className?: string;
}

const ScrollRevealWrapper = ({ 
  children, 
  delay = 0, 
  threshold = 0.1,
  className = ""
}: ScrollRevealWrapperProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
    rootMargin: '0px 0px -100px 0px'
  });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.5,
          delay: delay,
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollRevealWrapper;
