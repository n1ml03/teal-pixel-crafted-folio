/**
 * Utilities for optimizing component rendering and reducing unnecessary re-renders
 */
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * Custom hook to detect unnecessary re-renders in development mode
 * @param componentName The name of the component to monitor
 * @param props The component props to track
 * @param dependencies Optional array of dependencies to track
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
    // Only run in development mode
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
 * Custom hook for debouncing values
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for throttling values
 * @param value The value to throttle
 * @param limit The throttle limit in milliseconds
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Custom hook for memoizing expensive calculations
 * @param fn The function to memoize
 * @param dependencies The dependencies array
 * @returns The memoized result
 */
export function useMemoizedCalculation<T>(
  fn: () => T,
  dependencies: unknown[]
): T {
  const ref = useRef<{ deps: unknown[]; result: T }>({
    deps: [],
    result: null as unknown as T
  });

  // Check if dependencies have changed
  const depsChanged = dependencies.length !== ref.current.deps.length ||
    dependencies.some((dep, i) => dep !== ref.current.deps[i]);

  // If dependencies changed, recalculate
  if (depsChanged) {
    ref.current = {
      deps: dependencies,
      result: fn()
    };
  }

  return ref.current.result;
}

/**
 * Custom hook for lazy loading components when they enter the viewport
 * @param options IntersectionObserver options
 * @returns [ref, isVisible] - ref to attach to the element and visibility state
 */
export function useLazyLoad(
  options: IntersectionObserverInit = { rootMargin: '200px' }
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Memoize options to prevent unnecessary re-creation of observer
  const memoizedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, memoizedOptions);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [memoizedOptions]);

  return [ref, isVisible];
}

/**
 * Custom hook for detecting idle time to perform non-critical tasks
 * @param callback The callback to execute during idle time
 * @param timeout Optional timeout in milliseconds
 * @returns A function to trigger the idle callback manually
 */
export function useIdleCallback(
  callback: () => void,
  timeout: number = 1000
): () => void {
  const callbackRef = useRef(callback);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create a function to request idle callback
  const requestIdleCallback = useCallback(() => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void }).requestIdleCallback(() => callbackRef.current(), { timeout });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => callbackRef.current(), timeout);
    }
  }, [timeout]);

  return requestIdleCallback;
}
