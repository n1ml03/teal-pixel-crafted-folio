/**
 * Optimized RateLimiterService using the 'limiter' package
 * Replaced custom token bucket implementation with battle-tested library
 */
import { RateLimiter } from 'limiter';
import pLimit from 'p-limit';
import { toast } from "sonner";
import { LRUCache } from 'lru-cache';

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
   * Create or get a rate limiter for a specific key
   */
  private static getLimiter(key: string, options: RateLimitOptions): EnhancedRateLimiter {
    let limiter = this.limiters.get(key);
    
    if (!limiter) {
      limiter = new EnhancedRateLimiter(options);
      this.limiters.set(key, limiter);
    }

    return limiter;
  }

  /**
   * Create or get a concurrency limiter for a specific key
   */
  private static getConcurrencyLimiter(key: string, concurrency: number = 1): ReturnType<typeof pLimit> {
    let limiter = this.concurrencyLimiters.get(key);
    
    if (!limiter) {
      limiter = pLimit(concurrency);
      this.concurrencyLimiters.set(key, limiter);
    }

    return limiter;
  }

  /**
   * Check if an action is rate limited and execute if allowed
   */
  static async checkLimit(
    key: string,
    action: () => Promise<any> | any,
    options: Partial<RateLimitOptions> = {}
  ): Promise<{ allowed: boolean; result?: any; remaining?: number; error?: string }> {
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
   * Check if a key is currently rate limited without consuming tokens
   */
  static async isAllowed(
    key: string,
    options: Partial<RateLimitOptions> = {}
  ): Promise<{ allowed: boolean; remaining: number }> {
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
   * Execute an action with concurrency limiting
   */
  static async withConcurrencyLimit<T>(
    key: string,
    action: () => Promise<T> | T,
    concurrency: number = 1
  ): Promise<T> {
    const limiter = this.getConcurrencyLimiter(key, concurrency);
    return limiter(action);
  }

  /**
   * Reset rate limiting for a specific key
   */
  static async resetLimit(key: string): Promise<void> {
    const limiter = this.limiters.get(key);
    if (limiter) {
      await limiter.reset();
    }
  }

  /**
   * Get current status of a rate limiter
   */
  static async getLimitStatus(key: string): Promise<{
    hasLimiter: boolean;
    remaining?: number;
    isBlocked?: boolean;
  }> {
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
   * Execute multiple actions with rate limiting
   */
  static async batchExecute<T>(
    key: string,
    actions: (() => Promise<T> | T)[],
    options: Partial<RateLimitOptions> = {}
  ): Promise<Array<{ success: boolean; result?: T; error?: string }>> {
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
   * Create a rate-limited version of a function
   */
  static createRateLimitedFunction<T extends (...args: any[]) => any>(
    key: string,
    fn: T,
    options: Partial<RateLimitOptions> = {}
  ): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
    return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      const result = await this.checkLimit(key, () => fn(...args), options);
      return result.allowed ? result.result : null;
    };
  }
}

