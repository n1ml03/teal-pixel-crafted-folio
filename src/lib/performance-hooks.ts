/**
 * Simplified performance hooks
 * Only keeping essential hooks that are actually used
 */

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  RefObject
} from 'react';

// Remove circular dependency - don't re-export from render-optimization
// Users should import these directly from render-optimization if needed

/**
 * Simple optimized useState with reduced re-renders
 */
export function useOptimizedState<T>(
  initialState: T | (() => T),
  equalityFn?: (a: T, b: T) => boolean
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialState);

  const optimizedSetState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      if (equalityFn && equalityFn(prev, newValue)) {
        return prev;
      }
      return newValue;
    });
  }, [equalityFn]);

  return [state, optimizedSetState];
}

/**
 * Stable memo with simple equality check
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => factory(), [factory, ...deps]);
}

/**
 * Simple intersection observer hook
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [elementRef, isIntersecting];
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
 * Simple window event listener with stable handler
 */
export function useWindowEvent<T extends keyof WindowEventMap>(
  event: T,
  handler: (event: WindowEventMap[T]) => void
): void {
  // Use useCallback to stabilize the handler reference
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener(event, stableHandler, { passive: true });
    return () => window.removeEventListener(event, stableHandler);
  }, [event, stableHandler]);
}

/**
 * Basic performance metrics (simplified)
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    lcp?: number;
    fcp?: number;
  }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        } else if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'paint'] });
    } catch (error) {
      console.warn('Performance observer not supported');
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
}