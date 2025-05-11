import React from 'react';
import { motion, VariantLabels, TargetAndTransition, HTMLMotionProps } from 'framer-motion';

export interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  whileHover?: VariantLabels | TargetAndTransition;
  whileTap?: VariantLabels | TargetAndTransition;
  className?: string;
}

/**
 * A wrapper component that adds motion effects to any child component
 */
const MotionWrapper = ({
  children,
  className = "",
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.98 },
  ...props
}: MotionWrapperProps) => {
  return (
    <motion.div
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17,
        mass: 0.8
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { MotionWrapper };
