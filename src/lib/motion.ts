/**
 * Utility functions and constants for animations and transitions
 */

// Spring transition presets
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 17,
  mass: 0.8,
};

// Smoother spring transition with less bounce
export const softSpringTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 1,
};

// Quick spring transition for small UI elements
export const quickSpringTransition = {
  type: "spring",
  stiffness: 500,
  damping: 20,
  mass: 0.6,
};

// Tween transitions
export const smoothTween = {
  type: "tween",
  duration: 0.3,
  ease: "easeInOut",
};

export const fastTween = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut",
};

// Button hover and tap animations
export const buttonHoverAnimation = { 
  scale: 1.03,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
};

export const buttonTapAnimation = { 
  scale: 0.97,
};

// Subtle button hover and tap animations
export const subtleButtonHoverAnimation = { 
  scale: 1.02,
  y: -2,
};

export const subtleButtonTapAnimation = { 
  scale: 0.98,
  y: 0,
};

// Navigation link hover animation
export const navLinkHoverAnimation = {
  y: -2,
  transition: { duration: 0.2 },
};

// Card hover animation
export const cardHoverAnimation = {
  y: -5,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};
