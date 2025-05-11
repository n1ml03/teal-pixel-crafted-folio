
import React from 'react';
import { motion, VariantLabels, TargetAndTransition } from 'framer-motion';
import { Button, ButtonProps } from "@/components/ui/button";

export interface MotionButtonProps extends ButtonProps {
  whileHover?: VariantLabels | TargetAndTransition;
  whileTap?: VariantLabels | TargetAndTransition;
  transitionType?: "spring" | "tween";
  transitionDuration?: number;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({
    children,
    className,
    whileHover = { scale: 1.03 },
    whileTap = { scale: 0.97 },
    transitionType = "spring",
    transitionDuration = 0.3,
    ...props
  }, ref) => {
    // Define transition properties based on type
    const transitionProps = transitionType === "spring"
      ? {
          type: "spring",
          stiffness: 400,
          damping: 17,
          mass: 0.8
        }
      : {
          type: "tween",
          duration: transitionDuration,
          ease: "easeInOut"
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
