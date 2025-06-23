/**
 * Utility functions for optimizing scroll performance
 */

/**
 * Throttle function to limit the rate at which a function can fire
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function(this: unknown, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Creates a scroll handler that uses requestAnimationFrame for better performance
 * @param callback The callback function to execute on scroll
 * @returns A scroll handler function
 */
export function createOptimizedScrollHandler(
  callback: (scrollY: number) => void
): () => void {
  let ticking = false;

  return () => {
    const scrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(scrollY);
        ticking = false;
      });

      ticking = true;
    }
  };
}

/**
 * Hook to add a passive scroll listener for better performance
 * @param element The element to attach the scroll listener to (defaults to window)
 * @param callback The callback function to execute on scroll
 * @param deps Dependencies array for the useEffect hook
 */
export function usePassiveScroll(
  callback: (e: Event) => void,
  element: HTMLElement | Window = window
): void {
  React.useEffect(() => {
    const throttledCallback = throttle(callback, 16); // ~60fps

    element.addEventListener('scroll', throttledCallback, { passive: true });

    return () => {
      element.removeEventListener('scroll', throttledCallback);
    };
  }, [callback, element]);
}

/**
 * Adds CSS will-change property to elements that will be animated
 * @param selector The CSS selector for elements to optimize
 * @param properties The CSS properties that will change
 */
export function optimizeForAnimation(
  selector: string,
  properties: string[] = ['transform', 'opacity']
): void {
  const elements = document.querySelectorAll(selector);
  const willChangeValue = properties.join(', ');

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      element.style.willChange = willChangeValue;
    }
  });
}

/**
 * Removes CSS will-change property after animations complete to free up resources
 * @param selector The CSS selector for elements to clean up
 */
export function cleanupAnimationOptimization(selector: string): void {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      element.style.willChange = 'auto';
    }
  });
}

// Add React import for the hook
import React from 'react';
