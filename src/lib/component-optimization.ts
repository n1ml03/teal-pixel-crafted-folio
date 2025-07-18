/**
 * Advanced component optimization utilities for scroll performance
 * Includes memoization, re-render prevention, and performance monitoring
 */

import React, { ComponentType, memo, useCallback, useMemo, useRef, useEffect, useState } from 'react';

/**
 * Enhanced memo with custom comparison
 */
export function deepMemo<P extends object>(
  Component: ComponentType<P>,
  customCompare?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = memo(Component, customCompare || shallowEqual);
  MemoizedComponent.displayName = `DeepMemo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Shallow equality comparison
 */
function shallowEqual<T extends object>(prev: T, next: T): boolean {
  const prevKeys = Object.keys(prev) as (keyof T)[];
  const nextKeys = Object.keys(next) as (keyof T)[];

  if (prevKeys.length !== nextKeys.length) return false;
  return prevKeys.every(key => prev[key] === next[key]);
}

/**
 * Advanced scroll-optimized memo for components that animate during scroll
 */
export function scrollOptimizedMemo<P extends object>(
  Component: ComponentType<P>,
  scrollSensitiveProps: (keyof P)[] = []
) {
  const compare = (prevProps: P, nextProps: P): boolean => {
    // Always re-render if scroll-sensitive props change
    for (const prop of scrollSensitiveProps) {
      if (prevProps[prop] !== nextProps[prop]) {
        return false;
      }
    }

    // For other props, use shallow comparison
    return shallowEqual(prevProps, nextProps);
  };

  const MemoizedComponent = memo(Component, compare);
  MemoizedComponent.displayName = `ScrollOptimized(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Hook for stable callback references that don't cause re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
): T {
  const callbackRef = useRef<T>(callback);
  const stableCallback = useRef<T | null>(null);

  // Update the callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, deps);

  // Create stable callback only once
  if (!stableCallback.current) {
    stableCallback.current = ((...args: any[]) => {
      return callbackRef.current(...args);
    }) as T;
  }

  return stableCallback.current;
}

/**
 * Hook for memoizing expensive calculations with performance monitoring
 */
export function usePerformantMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  return useMemo(() => {
    if (process.env.NODE_ENV === 'development' && debugName) {
      const start = performance.now();
      const result = factory();
      const end = performance.now();

      if (end - start > 5) { // Log if calculation takes more than 5ms
        console.warn(`Expensive calculation in ${debugName}: ${(end - start).toFixed(2)}ms`);
      }

      return result;
    }

    return factory();
  }, deps);
}

/**
 * Hook for preventing re-renders during scroll events
 */
export function useScrollStableState<T>(
  initialValue: T,
  updateThrottleMs: number = 100
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingValueRef = useRef<T | null>(null);

  const setStableState = useCallback((value: T) => {
    pendingValueRef.current = value;

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (pendingValueRef.current !== null) {
        setState(pendingValueRef.current);
        pendingValueRef.current = null;
      }
    }, updateThrottleMs);
  }, [updateThrottleMs]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return [state, setStableState];
}

/**
 * Hook for visibility optimization (intersection observer)
 * Use this instead of the HOC to avoid JSX in utility files
 */
export function useVisibilityOptimization(
  options: {
    rootMargin?: string;
    threshold?: number;
    freezeOnceVisible?: boolean;
  } = {}
): {
  ref: (node: HTMLElement | null) => void;
  isVisible: boolean;
  hasBeenVisible: boolean;
} {
  const { rootMargin = '50px', threshold = 0.1, freezeOnceVisible = false } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;
    if (freezeOnceVisible && hasBeenVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const visible = entry.isIntersecting;

        setIsVisible(visible);

        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }

        if (freezeOnceVisible && visible) {
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, hasBeenVisible, rootMargin, threshold, freezeOnceVisible]);

  return { ref, isVisible, hasBeenVisible };
}

/**
 * Simple lazy component with retry and performance monitoring
 */
export function createOptimizedLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  retryCount: number = 3
) {
  return React.lazy(async () => {
    let lastError: Error | null = null;

    for (let i = 0; i < retryCount; i++) {
      try {
        const start = performance.now();
        const module = await importFn();
        const end = performance.now();

        if (process.env.NODE_ENV === 'development') {
          console.log(`Lazy component loaded in ${(end - start).toFixed(2)}ms`);
        }

        return module;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to load component (attempt ${i + 1}/${retryCount}):`, error);

        if (i < retryCount - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError;
  });
}