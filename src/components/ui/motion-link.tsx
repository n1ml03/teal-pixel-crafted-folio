import React from 'react';
import { motion, VariantLabels, TargetAndTransition, HTMLMotionProps } from 'framer-motion';
import { softSpringTransition, navLinkHoverAnimation } from '@/lib/motion';

export interface MotionLinkProps extends HTMLMotionProps<"a"> {
  href: string;
  children: React.ReactNode;
  className?: string;
  whileHover?: VariantLabels | TargetAndTransition;
  whileTap?: VariantLabels | TargetAndTransition;
  onClick?: () => void;
}

/**
 * A motion-enhanced link component with smooth hover and tap animations
 */
const MotionLink = ({
  href,
  children,
  className = "",
  whileHover = navLinkHoverAnimation,
  whileTap = { scale: 0.98 },
  onClick,
  ...props
}: MotionLinkProps) => {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={softSpringTransition}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.a>
  );
};

export { MotionLink };
