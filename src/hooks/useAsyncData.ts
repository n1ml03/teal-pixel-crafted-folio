import { use, useMemo, useCallback, useState, useTransition } from 'react';

// Type definitions for async data handling
export interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface AsyncDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  cacheKey?: string;
  staleTime?: number;
}

// Cache for storing async data results
const dataCache = new Map<string, { data: any; timestamp: number; promise?: Promise<any> }>();

/**
 * Modern React 19 hook for async data fetching using the use() hook
 * Provides automatic suspense, error boundaries, and caching
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: AsyncDataOptions<T> = {}
): AsyncDataState<T> {
  const {
    initialData = null,
    onSuccess,
    onError,
    enabled = true,
    cacheKey,
    staleTime = 5 * 60 * 1000, // 5 minutes default
  } = options;

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(initialData);

  // Create a stable fetch function
  const stableFetchFn = useCallback(fetchFn, []);

  // Create promise for the use() hook
  const promise = useMemo(() => {
    if (!enabled) return null;

    // Check cache first
    if (cacheKey) {
      const cached = dataCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < staleTime) {
        if (cached.promise) {
          return cached.promise;
        }
        // Return resolved promise with cached data
        return Promise.resolve(cached.data);
      }
    }

    // Create new promise
    const newPromise = stableFetchFn()
      .then((result) => {
        startTransition(() => {
          setData(result);
          setError(null);
          onSuccess?.(result);
        });

        // Cache the result
        if (cacheKey) {
          dataCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }

        return result;
      })
      .catch((err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        startTransition(() => {
          setError(error);
          onError?.(error);
        });
        throw error;
      });

    // Cache the promise
    if (cacheKey) {
      dataCache.set(cacheKey, {
        data: null,
        timestamp: Date.now(),
        promise: newPromise,
      });
    }

    return newPromise;
  }, [stableFetchFn, enabled, cacheKey, staleTime, onSuccess, onError]);

  // Use the promise with React 19's use() hook
  const asyncData = useMemo(() => {
    if (!promise) return initialData;
    
    try {
      return use(promise);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
      return initialData;
    }
  }, [promise, initialData]);

  // Refetch function
  const refetch = useCallback(() => {
    if (cacheKey) {
      dataCache.delete(cacheKey);
    }
    setError(null);
    // Trigger re-render by creating new promise
    stableFetchFn();
  }, [cacheKey, stableFetchFn]);

  return {
    data: asyncData || data,
    isLoading: isPending,
    error,
    refetch,
  };
}

/**
 * Hook for optimistic updates with React 19
 */
export function useOptimisticData<T>(
  data: T,
  updateFn: (currentData: T, optimisticValue: any) => T
) {
  const [optimisticData, setOptimisticData] = useState(data);
  const [isPending, startTransition] = useTransition();

  const addOptimistic = useCallback((value: any) => {
    startTransition(() => {
      setOptimisticData(current => updateFn(current, value));
    });
  }, [updateFn]);

  const resetOptimistic = useCallback(() => {
    setOptimisticData(data);
  }, [data]);

  return {
    optimisticData,
    addOptimistic,
    resetOptimistic,
    isPending,
  };
}

/**
 * Hook for handling async actions with React 19
 */
export function useAsyncAction<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  options: {
    onSuccess?: (result: R) => void;
    onError?: (error: Error) => void;
    optimisticUpdate?: (args: T) => void;
  } = {}
) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<R | null>(null);

  const execute = useCallback(async (...args: T) => {
    setError(null);
    
    // Apply optimistic update if provided
    if (options.optimisticUpdate) {
      options.optimisticUpdate(args);
    }

    try {
      const result = await action(...args);
      
      startTransition(() => {
        setResult(result);
        options.onSuccess?.(result);
      });
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      startTransition(() => {
        setError(error);
        options.onError?.(error);
      });
      
      throw error;
    }
  }, [action, options]);

  return {
    execute,
    isPending,
    error,
    result,
  };
}

/**
 * Hook for managing form state with React 19 patterns
 */
export function useFormState<T>(
  initialState: T,
  action: (prevState: T, formData: FormData) => Promise<T>
) {
  const [state, setState] = useState<T>(initialState);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  const handleAction = useCallback(async (formData: FormData) => {
    setError(null);
    
    try {
      const newState = await action(state, formData);
      
      startTransition(() => {
        setState(newState);
      });
      
      return newState;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      startTransition(() => {
        setError(error);
      });
      
      throw error;
    }
  }, [state, action]);

  return {
    state,
    isPending,
    error,
    handleAction,
  };
}

/**
 * Clear data cache - useful for testing or manual cache invalidation
 */
export function clearDataCache(key?: string) {
  if (key) {
    dataCache.delete(key);
  } else {
    dataCache.clear();
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: dataCache.size,
    keys: Array.from(dataCache.keys()),
  };
} 