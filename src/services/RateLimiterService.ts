import { toast } from "sonner";

// Types
interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
  blockExpires?: number;
}

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

/**
 * RateLimiterService - Provides rate limiting functionality
 *
 * This service helps prevent abuse by limiting how frequently actions can be performed.
 * It uses localStorage to track attempts and implements blocking when limits are exceeded.
 */
export class RateLimiterService {
  private static STORAGE_KEY = 'rate_limits';

  /**
   * Get all rate limit records from localStorage
   */
  private static getLimits(): Record<string, RateLimitRecord> {
    try {
      const limitsJson = localStorage.getItem(this.STORAGE_KEY);
      return limitsJson ? JSON.parse(limitsJson) : {};
    } catch (error) {
      console.error('Error getting rate limits from localStorage:', error);
      return {};
    }
  }

  /**
   * Save rate limit records to localStorage
   */
  private static saveLimits(limits: Record<string, RateLimitRecord>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limits));
    } catch (error) {
      console.error('Error saving rate limits to localStorage:', error);
    }
  }

  /**
   * Clean up expired rate limit records
   */
  private static cleanupExpiredLimits(): void {
    const limits = this.getLimits();
    const now = Date.now();
    let hasChanges = false;

    // Remove expired records
    Object.keys(limits).forEach(key => {
      const record = limits[key];

      // Remove if block has expired
      if (record.blocked && record.blockExpires && record.blockExpires < now) {
        delete limits[key];
        hasChanges = true;
        return;
      }

      // Remove if window has expired and not blocked
      if (!record.blocked && (now - record.firstAttempt) > DEFAULT_OPTIONS.windowMs * 2) {
        delete limits[key];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveLimits(limits);
    }
  }

  /**
   * Check if an action is rate limited
   *
   * @param key Unique identifier for the action being rate limited
   * @param options Rate limiting options
   * @returns Object containing whether the action is allowed and remaining attempts
   */
  static checkLimit(
    key: string,
    options: Partial<RateLimitOptions> = {}
  ): { allowed: boolean; remaining: number; blockedUntil?: number } {
    // Merge options with defaults
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Clean up expired limits periodically
    this.cleanupExpiredLimits();

    // Get current limits
    const limits = this.getLimits();
    const now = Date.now();

    // If no record exists for this key, create one
    if (!limits[key]) {
      limits[key] = {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      };
    }

    const record = limits[key];

    // Check if currently blocked
    if (record.blocked) {
      if (record.blockExpires && record.blockExpires < now) {
        // Block has expired, reset the record
        record.blocked = false;
        record.count = 1;
        record.firstAttempt = now;
        record.lastAttempt = now;
        delete record.blockExpires;

        this.saveLimits(limits);
        return { allowed: true, remaining: opts.maxAttempts - 1 };
      }

      // Still blocked
      if (opts.showToast) {
        toast.error(`Too many attempts. Please try again later.`);
      }

      return {
        allowed: false,
        remaining: 0,
        blockedUntil: record.blockExpires
      };
    }

    // Check if the time window has reset
    if ((now - record.firstAttempt) > opts.windowMs) {
      // Reset the window
      record.count = 1;
      record.firstAttempt = now;
      record.lastAttempt = now;

      this.saveLimits(limits);
      return { allowed: true, remaining: opts.maxAttempts - 1 };
    }

    // Increment the counter
    record.count += 1;
    record.lastAttempt = now;

    // Check if limit exceeded
    if (record.count > opts.maxAttempts) {
      record.blocked = true;
      record.blockExpires = now + (opts.blockDurationMs || 0);

      if (opts.showToast) {
        const minutes = Math.ceil((opts.blockDurationMs || 0) / 60000);
        toast.error(`Rate limit exceeded. Please try again in ${minutes} minutes.`);
      }

      this.saveLimits(limits);
      return {
        allowed: false,
        remaining: 0,
        blockedUntil: record.blockExpires
      };
    }

    // Update the record
    this.saveLimits(limits);

    // Show warning toast when approaching limit
    if (opts.showToast && (opts.maxAttempts - record.count <= 1)) {
      toast.warning(`You are approaching the rate limit. ${opts.maxAttempts - record.count + 1} attempts remaining.`);
    }

    return {
      allowed: true,
      remaining: opts.maxAttempts - record.count
    };
  }

  /**
   * Reset rate limit for a specific key
   *
   * @param key Unique identifier for the action being rate limited
   */
  static resetLimit(key: string): void {
    const limits = this.getLimits();

    if (limits[key]) {
      delete limits[key];
      this.saveLimits(limits);
    }
  }
}
