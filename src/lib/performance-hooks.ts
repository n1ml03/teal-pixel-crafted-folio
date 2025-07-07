/**
 * Optimized performance hooks using well-established libraries
 * Replaced custom implementations with battle-tested packages for better performance
 */

import { useCallback, useMemo, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useInView } from 'react-intersection-observer';

// Re-export optimized hooks with consistent API
export { useDebounce } from 'use-debounce';

/**
 * Optimized intersection observer hook using well-tested library
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
) {
  const { ref, inView } = useInView({
    threshold: options?.threshold || 0.1,
    rootMargin: options?.rootMargin,
    triggerOnce: false,
  });

  return [ref, inView] as const;
}

/**
 * Simple media query hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Stable callback hook
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  return useCallback(callback, [callback]);
}

/**
 * Deep comparison memo
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Window event listener hook
 */
export function useWindowEvent<T extends keyof WindowEventMap>(
  event: T,
  handler: (event: WindowEventMap[T]) => void
): void {
  const stableHandler = useOptimizedCallback(handler);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener(event, stableHandler, { passive: true });
    return () => window.removeEventListener(event, stableHandler);
  }, [event, stableHandler]);
}

/**
 * Performance metrics using optimized approach
 */
export function usePerformanceMetrics() {
  return useMemo(() => {
    if (typeof window === 'undefined') return {};

    // Use native performance API more efficiently
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      lcp: paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime,
      fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
    };
  }, []);
}

/**
 * Optimized state hook
 */
export function useOptimizedState<T>(initialState: T | (() => T)) {
  return useState(initialState);
}