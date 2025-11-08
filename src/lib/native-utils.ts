/**
 * Native JavaScript utility functions to replace lodash-es and use-debounce
 * Lightweight implementations without external dependencies
 */
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Throttle function - limits function calls to once per specified time period
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Debounce function - delays function execution until after wait milliseconds have elapsed
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Group array items by a key or function
 */
export function groupBy<T>(
  array: T[],
  iteratee: ((item: T) => string) | keyof T
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  const getKey = typeof iteratee === 'function' 
    ? iteratee 
    : (item: T) => String(item[iteratee]);

  for (const item of array) {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

/**
 * Count occurrences of each unique value
 */
export function countBy<T>(
  array: T[],
  iteratee: ((item: T) => string) | keyof T
): Record<string, number> {
  const result: Record<string, number> = {};
  const getKey = typeof iteratee === 'function' 
    ? iteratee 
    : (item: T) => String(item[iteratee]);

  for (const item of array) {
    const key = getKey(item);
    result[key] = (result[key] || 0) + 1;
  }

  return result;
}

/**
 * Sum values in array by a key or function
 */
export function sumBy<T>(
  array: T[],
  iteratee: ((item: T) => number) | keyof T
): number {
  const getValue = typeof iteratee === 'function'
    ? iteratee
    : (item: T) => Number(item[iteratee]) || 0;

  return array.reduce((sum, item) => sum + getValue(item), 0);
}

/**
 * Order/sort array by key(s) and direction(s)
 */
export function orderBy<T>(
  array: T[],
  keys: (keyof T | ((item: T) => unknown))[],
  orders: ('asc' | 'desc')[] = []
): T[] {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const order = orders[i] || 'asc';
      
      const aValue = typeof key === 'function' ? key(a) : a[key];
      const bValue = typeof key === 'function' ? key(b) : b[key];

      if (aValue === bValue) continue;

      const comparison = aValue < bValue ? -1 : 1;
      return order === 'asc' ? comparison : -comparison;
    }
    return 0;
  });
}

/**
 * Sort array by key or function
 */
export function sortBy<T>(
  array: T[],
  iteratee: keyof T | ((item: T) => unknown)
): T[] {
  return orderBy(array, [iteratee], ['asc']);
}

/**
 * Take first n elements from array
 */
export function take<T>(array: T[], n: number = 1): T[] {
  return array.slice(0, n);
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone an object
 */
export function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (value instanceof Array) {
    return value.map(item => cloneDeep(item)) as T;
  }

  if (value instanceof Object) {
    const clonedObj: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        clonedObj[key] = cloneDeep(value[key]);
      }
    }
    return clonedObj as T;
  }

  return value;
}

/**
 * Omit keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Pick keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Get value from nested object path
 */
export function get<T>(
  obj: unknown,
  path: string | string[],
  defaultValue?: T
): T | undefined {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result === undefined ? defaultValue : (result as T);
}

/**
 * Chunk array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Remove duplicate values from array
 */
export function uniq<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicate values from array by key or function
 */
export function uniqBy<T>(
  array: T[],
  iteratee: ((item: T) => unknown) | keyof T
): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];
  const getKey = typeof iteratee === 'function'
    ? iteratee
    : (item: T) => item[iteratee];

  for (const item of array) {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

/**
 * React hook for debouncing a value
 */
export function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

/**
 * React hook for debouncing a callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

