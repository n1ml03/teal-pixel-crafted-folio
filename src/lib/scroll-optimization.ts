/**
 * Optimized scroll performance utilities using well-established libraries
 */
import React, { useCallback, useEffect } from 'react';
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce';

// Re-export optimized throttle from well-tested library
export { throttle } from 'lodash-es';

/**
 * Optimized scroll handler using RAF and throttling
 */
export function createOptimizedScrollHandler(
  callback: (scrollY: number) => void
): () => void {
  const throttledCallback = useThrottledCallback((scrollY: number) => {
    callback(scrollY);
  }, 16); // ~60fps

  return useCallback(() => {
    const scrollY = window.scrollY;
    throttledCallback(scrollY);
  }, [throttledCallback]);
}

/**
 * Optimized passive scroll listener hook
 */
export function usePassiveScroll(
  callback: (e: Event) => void,
  element: HTMLElement | Window = window
): void {
  const throttledCallback = useThrottledCallback(callback, 16); // ~60fps

  useEffect(() => {
    element.addEventListener('scroll', throttledCallback, { passive: true });

    return () => {
      element.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback, element]);
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


