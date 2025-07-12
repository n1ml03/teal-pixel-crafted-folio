/**
 * Modern React 19 performance hooks with advanced optimizations
 * Leverages React 19 features for better performance and user experience
 */

import { useCallback, useMemo, useEffect, useState, useTransition } from 'react';

/**
 * Enhanced media query hook with React 19 optimizations
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      startTransition(() => {
        setMatches(e.matches);
      });
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Enhanced window event listener with React 19 optimizations
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  const [isPending, startTransition] = useTransition();
  
  const stableHandler = useCallback((event: WindowEventMap[K]) => {
    startTransition(() => {
      handler(event);
    });
  }, [handler]);

  useEffect(() => {
    window.addEventListener(event, stableHandler, options);
    return () => {
      window.removeEventListener(event, stableHandler, options);
    };
  }, [event, stableHandler, options]);
}

/**
 * React 19 optimized callback hook with automatic memoization
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps?: React.DependencyList
): T {
  return useCallback(callback, deps ?? []);
}

/**
 * Enhanced memo hook with React 19 optimizations
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Modern performance metrics hook with React 19 features
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<{
    lcp?: number;
    fcp?: number;
    cls?: number;
    fid?: number;
    ttfb?: number;
    domContentLoaded?: number;
    loadComplete?: number;
  }>({});

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateMetrics = () => {
      startTransition(() => {
        // Navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // Paint timing
        const paint = performance.getEntriesByType('paint');
        
        // Core Web Vitals
        const newMetrics = {
          lcp: paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime,
          fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
          ttfb: navigation?.responseStart - navigation?.requestStart,
        };

        setMetrics(newMetrics);
      });
    };

    // Initial measurement
    updateMetrics();

    // Listen for additional performance entries
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        updateMetrics();
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
}

/**
 * React 19 optimized state hook with transition support
 */
export function useOptimizedState<T>(initialState: T | (() => T)) {
  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  const setOptimizedState = useCallback((value: T | ((prev: T) => T)) => {
    startTransition(() => {
      setState(value);
    });
  }, []);

  return [state, setOptimizedState, isPending] as const;
}

/**
 * React 19 hook for managing component lifecycle with transitions
 */
export function useLifecycleTransition() {
  const [isPending, startTransition] = useTransition();

  const withTransition = useCallback((callback: () => void) => {
    startTransition(callback);
  }, []);

  return {
    isPending,
    withTransition,
  };
}

/**
 * Enhanced React 19 hook for stable references
 */
export function useStableReference<T>(value: T): T {
  const ref = useMemo(() => ({ current: value }), []);
  ref.current = value;
  return ref.current;
}

/**
 * React 19 hook for managing component errors with better UX
 */
export function useErrorRecovery() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const clearError = useCallback(() => {
    startTransition(() => {
      setError(null);
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    startTransition(() => {
      setError(error);
    });
  }, []);

  return {
    error,
    isPending,
    clearError,
    handleError,
  };
}

/**
 * Optimized intersection observer hook with React 19 patterns
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): {
  ref: (node: Element | null) => void;
  inView: boolean;
  entry: IntersectionObserverEntry | undefined;
} {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();
  const [isPending, startTransition] = useTransition();
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        startTransition(() => {
          setInView(entry.isIntersecting);
          setEntry(entry);
        });
      },
      options
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [target, options]);

  const ref = useCallback((node: Element | null) => {
    setTarget(node);
  }, []);

  return { ref, inView, entry };
}