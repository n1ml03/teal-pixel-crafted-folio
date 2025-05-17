/**
 * Utility functions for caching data to improve performance
 */

interface CacheOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
  /** Storage type to use */
  storage?: 'memory' | 'local' | 'session';
  /** Version identifier for cache invalidation */
  version?: string;
}

interface CacheItem<T> {
  /** The cached data */
  data: T;
  /** Timestamp when the item was cached */
  timestamp: number;
  /** Version of the cache */
  version: string;
}

// Default cache options
const DEFAULT_OPTIONS: CacheOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  storage: 'memory',
  version: '1.0'
};

// In-memory cache storage
const memoryCache: Record<string, CacheItem<any>> = {};

/**
 * Get an item from cache
 * 
 * @param key Cache key
 * @param options Cache options
 * @returns The cached item or null if not found or expired
 */
export function getCacheItem<T>(key: string, options: CacheOptions = {}): T | null {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = `cache_${key}`;
  
  try {
    let cacheItem: CacheItem<T> | null = null;
    
    // Get from appropriate storage
    if (opts.storage === 'local') {
      const item = localStorage.getItem(cacheKey);
      if (item) {
        cacheItem = JSON.parse(item);
      }
    } else if (opts.storage === 'session') {
      const item = sessionStorage.getItem(cacheKey);
      if (item) {
        cacheItem = JSON.parse(item);
      }
    } else {
      // Memory cache
      cacheItem = memoryCache[cacheKey] || null;
    }
    
    // If no cache item found
    if (!cacheItem) {
      return null;
    }
    
    // Check version
    if (cacheItem.version !== opts.version) {
      // Version mismatch, invalidate cache
      removeCacheItem(key, opts);
      return null;
    }
    
    // Check if expired
    if (opts.ttl) {
      const now = Date.now();
      const age = now - cacheItem.timestamp;
      
      if (age > opts.ttl) {
        // Expired, remove from cache
        removeCacheItem(key, opts);
        return null;
      }
    }
    
    return cacheItem.data;
  } catch (error) {
    console.error('Error getting cache item:', error);
    return null;
  }
}

/**
 * Set an item in cache
 * 
 * @param key Cache key
 * @param data Data to cache
 * @param options Cache options
 */
export function setCacheItem<T>(key: string, data: T, options: CacheOptions = {}): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = `cache_${key}`;
  
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      version: opts.version || '1.0'
    };
    
    // Store in appropriate storage
    if (opts.storage === 'local') {
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } else if (opts.storage === 'session') {
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } else {
      // Memory cache
      memoryCache[cacheKey] = cacheItem;
    }
  } catch (error) {
    console.error('Error setting cache item:', error);
  }
}

/**
 * Remove an item from cache
 * 
 * @param key Cache key
 * @param options Cache options
 */
export function removeCacheItem(key: string, options: CacheOptions = {}): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = `cache_${key}`;
  
  try {
    // Remove from appropriate storage
    if (opts.storage === 'local') {
      localStorage.removeItem(cacheKey);
    } else if (opts.storage === 'session') {
      sessionStorage.removeItem(cacheKey);
    } else {
      // Memory cache
      delete memoryCache[cacheKey];
    }
  } catch (error) {
    console.error('Error removing cache item:', error);
  }
}

/**
 * Clear all cache items
 * 
 * @param storage Storage type to clear
 */
export function clearCache(storage: 'memory' | 'local' | 'session' | 'all' = 'all'): void {
  try {
    if (storage === 'memory' || storage === 'all') {
      // Clear memory cache
      Object.keys(memoryCache).forEach(key => {
        delete memoryCache[key];
      });
    }
    
    if (storage === 'local' || storage === 'all') {
      // Clear local storage cache (only our cache items)
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    if (storage === 'session' || storage === 'all') {
      // Clear session storage cache (only our cache items)
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Cache the result of an async function
 * 
 * @param fn Function to cache
 * @param key Cache key
 * @param options Cache options
 * @returns The cached result or the result of the function
 */
export async function cacheResult<T>(
  fn: () => Promise<T>,
  key: string,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cachedItem = getCacheItem<T>(key, options);
  
  if (cachedItem !== null) {
    return cachedItem;
  }
  
  // Not in cache or expired, call the function
  const result = await fn();
  
  // Cache the result
  setCacheItem(key, result, options);
  
  return result;
}

/**
 * Create a cached version of an async function
 * 
 * @param fn Function to cache
 * @param keyFn Function to generate cache key from arguments
 * @param options Cache options
 * @returns Cached function
 */
export function createCachedFunction<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn: (...args: Args) => string,
  options: CacheOptions = {}
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const key = keyFn(...args);
    
    return cacheResult(
      () => fn(...args),
      key,
      options
    );
  };
}

export default {
  getCacheItem,
  setCacheItem,
  removeCacheItem,
  clearCache,
  cacheResult,
  createCachedFunction
};
