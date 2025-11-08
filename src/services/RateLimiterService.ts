/**
 * Optimized RateLimiterService using the 'limiter' package
 * Replaced custom token bucket implementation with battle-tested library
 */
import { RateLimiter } from 'limiter';
import pLimit from 'p-limit';
import { toast } from "sonner";
import { LRUCache } from 'lru-cache';

// Input validation helpers
const validateKey = (key: string): void => {
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    throw new Error('Rate limiter key is required and must be a non-empty string');
  }
};

const validateRateLimitOptions = (options: Partial<RateLimitOptions>): void => {
  if (options.maxAttempts !== undefined) {
    if (typeof options.maxAttempts !== 'number' || options.maxAttempts <= 0 || !Number.isInteger(options.maxAttempts)) {
      throw new Error('maxAttempts must be a positive integer');
    }
  }
  if (options.windowMs !== undefined) {
    if (typeof options.windowMs !== 'number' || options.windowMs <= 0 || !Number.isInteger(options.windowMs)) {
      throw new Error('windowMs must be a positive integer');
    }
  }
  if (options.blockDurationMs !== undefined) {
    if (typeof options.blockDurationMs !== 'number' || options.blockDurationMs < 0 || !Number.isInteger(options.blockDurationMs)) {
      throw new Error('blockDurationMs must be a non-negative integer');
    }
  }
  if (options.showToast !== undefined && typeof options.showToast !== 'boolean') {
    throw new Error('showToast must be a boolean');
  }
};

const validateAction = (action: unknown): void => {
  if (typeof action !== 'function') {
    throw new Error('Action must be a function');
  }
};

const validateConcurrency = (concurrency: number): void => {
  if (typeof concurrency !== 'number' || concurrency <= 0 || !Number.isInteger(concurrency)) {
    throw new Error('Concurrency must be a positive integer');
  }
};

// Rate limit configuration
interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
  showToast?: boolean;
}

// Default options
const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 10 * 60 * 1000, // 10 minutes
  showToast: true
};

// Enhanced limiter wrapper with blocking capability
class EnhancedRateLimiter {
  private limiter: RateLimiter;
  private blockedUntil: number = 0;
  private readonly blockDuration: number;
  private readonly options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
    this.blockDuration = options.blockDurationMs || 0;
    
    // Create RateLimiter with tokensPerInterval and interval
    this.limiter = new RateLimiter({
      tokensPerInterval: options.maxAttempts,
      interval: options.windowMs
    });
  }

  async consume(): Promise<{ allowed: boolean; remaining: number; error?: string }> {
    const now = Date.now();

    // Check if still blocked
    if (this.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        error: 'Rate limit exceeded - blocked'
      };
    }

    // Try to remove a token (synchronous method)
    const allowed = this.limiter.tryRemoveTokens(1);

    if (allowed) {
      return {
        allowed: true,
        remaining: this.limiter.getTokensRemaining()
      };
    } else {
      // Block for the specified duration if configured
      if (this.blockDuration > 0) {
        this.blockedUntil = now + this.blockDuration;
      }

      return {
        allowed: false,
        remaining: 0,
        error: 'Rate limit exceeded'
      };
    }
  }

  async reset(): Promise<void> {
    // Reset the limiter by creating a new one
    this.limiter = new RateLimiter({
      tokensPerInterval: this.options.maxAttempts,
      interval: this.options.windowMs
    });
    this.blockedUntil = 0;
  }

  getTokensRemaining(): number {
    return this.limiter.getTokensRemaining();
  }

  isBlocked(): boolean {
    return this.blockedUntil > Date.now();
  }
}

/**
 * Optimized RateLimiterService using the 'limiter' package and LRU cache
 */
export class RateLimiterService {
  // Use LRU cache to prevent unlimited memory growth
  private static limiters = new LRUCache<string, EnhancedRateLimiter>({
    max: 1000, // Maximum number of limiters to cache
    ttl: 1000 * 60 * 60 // 1 hour TTL
  });

  private static concurrencyLimiters = new LRUCache<string, ReturnType<typeof pLimit>>({
    max: 100,
    ttl: 1000 * 60 * 30 // 30 minutes TTL
  });

  /**
   * Create or get a rate limiter for a specific key with validation
   */
  private static getLimiter(key: string, options: RateLimitOptions): EnhancedRateLimiter {
    validateKey(key);

    let limiter = this.limiters.get(key);
    
    if (!limiter) {
      limiter = new EnhancedRateLimiter(options);
      this.limiters.set(key, limiter);
    }

    return limiter;
  }

  /**
   * Create or get a concurrency limiter for a specific key with validation
   */
  private static getConcurrencyLimiter(key: string, concurrency: number = 1): ReturnType<typeof pLimit> {
    validateKey(key);
    validateConcurrency(concurrency);

    let limiter = this.concurrencyLimiters.get(key);
    
    if (!limiter) {
      limiter = pLimit(concurrency);
      this.concurrencyLimiters.set(key, limiter);
    }

    return limiter;
  }

  /**
   * Check if an action is rate limited and execute if allowed with validation
   */
  static async checkLimit<T = unknown>(
    key: string,
    action: () => Promise<T> | T,
    options: Partial<RateLimitOptions> = {}
  ): Promise<{ allowed: boolean; result?: T; remaining?: number; error?: string }> {
    validateKey(key);
    validateAction(action);
    validateRateLimitOptions(options);

    const opts = { ...DEFAULT_OPTIONS, ...options };
    const limiter = this.getLimiter(key, opts);

    try {
      // Check if we can consume a token
      const consumeResult = await limiter.consume();

      if (!consumeResult.allowed) {
        if (opts.showToast) {
          if (limiter.isBlocked()) {
            const minutes = Math.ceil((opts.blockDurationMs || 0) / 60000);
            toast.error(`Rate limit exceeded. Please try again in ${minutes} minutes.`);
          } else {
            toast.error('Too many attempts. Please try again later.');
          }
        }

        return {
          allowed: false,
          remaining: consumeResult.remaining,
          error: consumeResult.error
        };
      }

      // Execute the action
      const result = await action();

      return {
        allowed: true,
        result,
        remaining: consumeResult.remaining
      };
    } catch (error) {
      return {
        allowed: true,
        remaining: limiter.getTokensRemaining(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if a key is currently rate limited without consuming tokens with validation
   */
  static async isAllowed(
    key: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<{ allowed: boolean; remaining: number }> {
    validateKey(key);
    validateRateLimitOptions(options);

    const opts = { ...DEFAULT_OPTIONS, ...options };
    const limiter = this.getLimiter(key, opts);

    // Check if blocked
    if (limiter.isBlocked()) {
      return { allowed: false, remaining: 0 };
    }

    const remaining = limiter.getTokensRemaining();
    return { allowed: remaining > 0, remaining };
  }

  /**
   * Execute an action with concurrency limiting and validation
   */
  static async withConcurrencyLimit<T>(
    key: string,
    action: () => Promise<T> | T,
    concurrency: number = 1
  ): Promise<T> {
    validateKey(key);
    validateAction(action);
    validateConcurrency(concurrency);

    const limiter = this.getConcurrencyLimiter(key, concurrency);
    return limiter(action);
  }

  /**
   * Reset rate limiting for a specific key with validation
   */
  static async resetLimit(key: string): Promise<void> {
    validateKey(key);

    const limiter = this.limiters.get(key);
    if (limiter) {
      await limiter.reset();
    }
  }

  /**
   * Get current status of a rate limiter with validation
   */
  static async getLimitStatus(key: string): Promise<{
    hasLimiter: boolean;
    remaining?: number;
    isBlocked?: boolean;
  }> {
    validateKey(key);

    const limiter = this.limiters.get(key);
    
    if (!limiter) {
      return { hasLimiter: false };
    }

    return {
      hasLimiter: true,
      remaining: limiter.getTokensRemaining(),
      isBlocked: limiter.isBlocked()
    };
  }

  /**
   * Clean up all limiters and reset caches
   */
  static async cleanup(): Promise<void> {
    this.limiters.clear();
    this.concurrencyLimiters.clear();
  }

  /**
   * Execute multiple actions with rate limiting and validation
   */
  static async batchExecute<T>(
    key: string,
    actions: (() => Promise<T> | T)[],
    options: Partial<RateLimitOptions> = {}
  ): Promise<Array<{ success: boolean; result?: T; error?: string }>> {
    validateKey(key);
    if (!Array.isArray(actions)) {
      throw new Error('Actions must be an array');
    }
    if (actions.length === 0) {
      throw new Error('At least one action must be provided');
    }
    actions.forEach((action, index) => {
      if (typeof action !== 'function') {
        throw new Error(`Action at index ${index} must be a function`);
      }
    });
    validateRateLimitOptions(options);

    const results: Array<{ success: boolean; result?: T; error?: string }> = [];

    for (const action of actions) {
      const result = await this.checkLimit(key, action, { ...options, showToast: false });
      
      if (result.allowed) {
        results.push({ success: true, result: result.result });
      } else {
        results.push({ success: false, error: result.error || 'Rate limit exceeded' });
      }
    }

    return results;
  }

  /**
   * Create a rate-limited version of a function with validation
   */
  static createRateLimitedFunction<T extends (...args: never[]) => unknown>(
    key: string,
    fn: T,
    options: Partial<RateLimitOptions> = {}
  ): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
    validateKey(key);
    validateAction(fn);
    validateRateLimitOptions(options);

    return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      const result = await this.checkLimit(key, () => fn(...args), options);
      return result.allowed ? result.result : null;
    };
  }
}

