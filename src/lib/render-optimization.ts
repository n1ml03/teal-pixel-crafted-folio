/**
 * Optimized render utilities using well-established libraries
 * Replaced custom implementations with battle-tested packages for better performance
 */
import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { useIntersectionObserver } from './performance-hooks';

/**
 * Simplified render tracking
 */
export function useRenderOptimizer(
  componentName: string,
  props: Record<string, unknown>,
  dependencies: unknown[] = []
): void {
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, unknown>>({});
  const prevDeps = useRef<unknown[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    renderCount.current += 1;

    // Check which props changed
    const changedProps: string[] = [];
    Object.keys(props).forEach(key => {
      if (props[key] !== prevProps.current[key]) {
        changedProps.push(key);
      }
    });

    // Check which dependencies changed
    const changedDeps: number[] = [];
    dependencies.forEach((dep, index) => {
      if (dep !== prevDeps.current[index]) {
        changedDeps.push(index);
      }
    });

    // Log render information
    if (renderCount.current > 1) {
      console.group(`%c${componentName} re-rendered (${renderCount.current})`, 'color: orange');

      if (changedProps.length > 0) {
        console.log('Changed props:', changedProps.join(', '));
        changedProps.forEach(prop => {
          console.log(`${prop}:`, {
            from: prevProps.current[prop],
            to: props[prop]
          });
        });
      } else {
        console.log('No props changed');
      }

      if (dependencies.length > 0) {
        if (changedDeps.length > 0) {
          console.log('Changed dependencies:', changedDeps.join(', '));
          changedDeps.forEach(index => {
            console.log(`dependency[${index}]:`, {
              from: prevDeps.current[index],
              to: dependencies[index]
            });
          });
        } else {
          console.log('No dependencies changed');
        }
      }

      console.groupEnd();
    }

    // Update refs for next render
    prevProps.current = { ...props };
    prevDeps.current = [...dependencies];
  });
}

/**
 * Simple memoized calculation
 */
export function useMemoizedCalculation<T>(
  fn: () => T,
  dependencies: unknown[]
): T {
  return useMemo(fn, dependencies);
}

/**
 * Optimized lazy loading using intersection observer
 */
export function useLazyLoad(
  options: IntersectionObserverInit = { rootMargin: '200px' }
): [React.RefObject<HTMLDivElement>, boolean] {
  const { ref, inView } = useIntersectionObserver(options);

  return [ref as React.RefObject<HTMLDivElement>, inView];
}

/**
 * Optimized idle callback
 */
export function useIdleCallback(
  callback: () => void,
  timeout: number = 1000
): () => void {
  const stableCallback = useCallback(callback, [callback]);

  // Create a function to request idle callback
  const requestIdleCallback = useCallback(() => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void }).requestIdleCallback(stableCallback, { timeout });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(stableCallback, timeout);
    }
  }, [stableCallback, timeout]);

  return requestIdleCallback;
}

/**
 * Re-export debounce hook from native utilities
 */
export { useDebounce } from '@/lib/native-utils';
