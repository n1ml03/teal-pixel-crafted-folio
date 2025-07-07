import React from 'react';
import { motion, VariantLabels, TargetAndTransition, Transition } from 'framer-motion';
import { Button, ButtonProps } from "@/components/ui/button";

export interface MotionButtonProps extends ButtonProps {
  whileHover?: VariantLabels | TargetAndTransition;
  whileTap?: VariantLabels | TargetAndTransition;
  transitionType?: "spring" | "tween";
  transitionDuration?: number;
  transition?: Transition; // Use Transition type instead of TargetAndTransition
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({
    children,
    className,
    whileHover = { scale: 1.03 },
    whileTap = { scale: 0.97 },
    transitionType = "spring",
    transitionDuration = 0.3,
    transition, // Accept custom transition
    ...props
  }, ref) => {
    // Define transition properties based on type, unless custom transition is provided
    const transitionProps: Transition = transition
      ? transition
      : transitionType === "spring"
      ? {
          type: "spring" as const,
          stiffness: 400,
          damping: 17,
          mass: 0.8
        }
      : {
          type: "tween" as const,
          duration: transitionDuration,
          ease: "easeInOut" as const
        };

    return (
      <motion.div
        whileHover={whileHover}
        whileTap={whileTap}
        transition={transitionProps}
        className="inline-block"
      >
        <Button
          className={`${className} shadow-sm hover:shadow-md transition-shadow duration-300`}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

MotionButton.displayName = "MotionButton";

export { MotionButton };
