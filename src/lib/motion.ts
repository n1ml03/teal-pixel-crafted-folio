/**
 * Optimized animation utilities and constants for better scroll performance
 */
import React from 'react';
import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useMemo } from 'react';

// Performance-optimized spring transition presets
export const springTransition = {
  type: "spring" as const,
  stiffness: 300, // Reduced for smoother performance
  damping: 20,    // Increased for less oscillation
  mass: 0.6,      // Lighter for better responsiveness
};

// Ultra-smooth spring transition for scroll-based animations
export const scrollSpringTransition = {
  type: "spring" as const,
  stiffness: 200, // Lower stiffness for scroll animations
  damping: 25,    // Higher damping for stability
  mass: 0.4,      // Very light for responsiveness
  restDelta: 0.001, // Smaller rest delta for precision
};

// Smoother spring transition with less bounce
export const softSpringTransition = {
  type: "spring" as const,
  stiffness: 250, // Slightly reduced
  damping: 30,    // Increased damping
  mass: 0.8,
};

// Quick spring transition for small UI elements
export const quickSpringTransition = {
  type: "spring" as const,
  stiffness: 400, // Kept high for responsiveness
  damping: 25,    // Increased for stability
  mass: 0.5,      // Reduced mass
};

// Performance-optimized tween transitions
export const smoothTween = {
  type: "tween" as const,
  duration: 0.25, // Slightly faster
  ease: "easeOut" as const, // Changed to easeOut for better performance
};

export const fastTween = {
  type: "tween" as const,
  duration: 0.12, // Faster for better responsiveness
  ease: "easeOut" as const,
};

/**
 * Performance-optimized scroll hooks for Framer Motion
 */

/**
 * Optimized useScroll hook with performance settings
 */
export function useOptimizedScroll(
  options: {
    target?: React.RefObject<HTMLElement>;
    offset?: ["start end", "end start"] | ["start start", "end end"] | ["start center", "end center"];
    layoutEffect?: boolean;
  } = {}
) {
  const { target, offset = ["start end", "end start"], layoutEffect = false } = options;

  return useScroll({
    target,
    offset,
    layoutEffect,
    // Note: Removed container optimization as it requires a RefObject
  });
}

/**
 * Optimized useSpring hook for scroll animations
 */
export function useOptimizedSpring(
  source: MotionValue<number>,
  config: {
    stiffness?: number;
    damping?: number;
    mass?: number;
    restDelta?: number;
    restSpeed?: number;
  } = {}
) {
  const optimizedConfig = useMemo(() => ({
    stiffness: 150,      // Lower for smoother scroll
    damping: 25,         // Higher for stability
    mass: 0.3,           // Lighter for responsiveness
    restDelta: 0.001,    // Smaller for precision
    restSpeed: 0.01,     // Lower for smoother stops
    ...config
  }), [config.stiffness, config.damping, config.mass, config.restDelta, config.restSpeed]);

  return useSpring(source, optimizedConfig);
}

/**
 * Optimized useTransform hook - direct wrapper for better performance
 */
export function useOptimizedTransform(
  value: MotionValue<number>,
  inputRange: number[],
  outputRange: (string | number)[],
  options?: {
    clamp?: boolean;
    ease?: (t: number) => number;
  }
) {
  // Direct call to useTransform - no useMemo wrapper to avoid Rules of Hooks violation
  return useTransform(value, inputRange, outputRange, options);
}

/**
 * Performance-optimized parallax hook
 */
export function useParallax(
  scrollYProgress: MotionValue<number>,
  distance: number = 50,
  direction: 'up' | 'down' = 'up'
): MotionValue<number> {
  const multiplier = direction === 'up' ? -1 : 1;

  // Direct call to useTransform - no useMemo wrapper to avoid Rules of Hooks violation
  return useTransform(scrollYProgress, [0, 1], [0, distance * multiplier]);
}

// Performance-optimized button animations (reduced scale for better performance)
export const buttonHoverAnimation = {
  scale: 1.02, // Reduced from 1.03
  transition: fastTween,
};

export const buttonTapAnimation = {
  scale: 0.98, // Reduced from 0.97
  transition: { duration: 0.1 },
};

// Subtle button hover and tap animations
export const subtleButtonHoverAnimation = {
  scale: 1.01, // Reduced from 1.02
  y: -1,       // Reduced from -2
  transition: fastTween,
};

export const subtleButtonTapAnimation = {
  scale: 0.99, // Reduced from 0.98
  y: 0,
  transition: { duration: 0.1 },
};

// Navigation link hover animation (reduced movement)
export const navLinkHoverAnimation = {
  y: -1, // Reduced from -2
  transition: { duration: 0.15 }, // Faster
};

// Card hover animation (reduced movement and optimized shadow)
export const cardHoverAnimation = {
  y: -3, // Reduced from -5
  transition: smoothTween,
  // Removed boxShadow from here to handle in CSS for better performance
};
