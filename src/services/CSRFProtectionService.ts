/**
 * Optimized CSRFProtectionService using well-established libraries
 * Enhanced with nanoid for better token generation and improved security
 */
import { nanoid } from 'nanoid';
import { LRUCache } from 'lru-cache';

interface CSRFToken {
  token: string;
  expires: number;
  formId: string;
  createdAt: number;
}

// Error logging utility to prevent sensitive information exposure
const logError = (message: string, error?: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[CSRFProtectionService] ${message}`, error);
  }
};

const logWarning = (message: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[CSRFProtectionService] ${message}`);
  }
};

/**
 * Enhanced CSRFProtectionService with optimized token management
 */
export class CSRFProtectionService {
  private static readonly STORAGE_KEY = 'csrf_tokens';
  private static readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_TOKENS_PER_SESSION = 50; // Prevent token flooding
  private static readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private static cleanupTimer: NodeJS.Timeout | null = null;

  // Use LRU cache for in-memory token management with automatic cleanup
  private static tokenCache = new LRUCache<string, CSRFToken>({
    max: 100, // Maximum number of tokens in memory
    ttl: this.TOKEN_EXPIRY, // Auto-expire tokens
    updateAgeOnGet: false // Don't reset TTL on access
  });

  /**
   * Generate a secure random token using nanoid
   */
  private static generateSecureToken(): string {
    try {
      // Use nanoid for better security and uniqueness (URL-safe)
      const baseToken = nanoid();
      const timestamp = Date.now().toString(36);
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      
      // Combine multiple entropy sources for enhanced security
      return `${baseToken}-${timestamp}-${randomSuffix}`;
    } catch (error) {
      logError('Error generating secure token', error);
      // Fallback to crypto API if nanoid fails
      try {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      } catch (cryptoError) {
        // Final fallback (should never happen in modern browsers)
        logWarning('Crypto API not available, using fallback method');
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2);
        return `fallback-${timestamp}-${random}`;
      }
    }
  }

  /**
   * Get all stored CSRF tokens with automatic cleanup
   */
  private static getTokens(): Record<string, CSRFToken> {
    try {
      const tokensJson = localStorage.getItem(this.STORAGE_KEY);
      const tokens = tokensJson ? JSON.parse(tokensJson) as Record<string, CSRFToken> : {};
      
      // Clean expired tokens automatically
      const now = Date.now();
      const cleanedTokens: Record<string, CSRFToken> = {};
      
      Object.entries(tokens).forEach(([key, token]) => {
        // Type guard to ensure token has required properties
        if (token && typeof token === 'object' && 'expires' in token && 'token' in token && 'formId' in token && 'createdAt' in token) {
          if (token.expires > now) {
            cleanedTokens[key] = token as CSRFToken;
          }
        }
      });

      return cleanedTokens;
    } catch (error) {
      logError('Error getting CSRF tokens from localStorage', error);
      return {};
    }
  }

  /**
   * Save CSRF tokens to localStorage with compression
   */
  private static saveTokens(tokens: Record<string, CSRFToken>): void {
    try {
      // Limit the number of tokens to prevent storage bloat
      const tokenEntries = Object.entries(tokens);
      if (tokenEntries.length > this.MAX_TOKENS_PER_SESSION) {
        // Keep only the most recent tokens
        const sortedTokens = tokenEntries
          .sort(([, a], [, b]) => b.createdAt - a.createdAt)
          .slice(0, this.MAX_TOKENS_PER_SESSION);
        
        tokens = Object.fromEntries(sortedTokens);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
      
      // Update in-memory cache
      this.tokenCache.clear();
      Object.entries(tokens).forEach(([formId, token]) => {
        this.tokenCache.set(formId, token);
      });
    } catch (error) {
      logError('Error saving CSRF tokens to localStorage', error);

      // If localStorage fails, try to clear old data and retry
      try {
        this.clearExpiredTokens();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
      } catch (retryError) {
        logError('Failed to save tokens even after cleanup', retryError);
      }
    }
  }

  /**
   * Clean up expired tokens with enhanced performance
   */
  private static clearExpiredTokens(): void {
    const tokens = this.getTokens();
    const now = Date.now();
    let hasChanges = false;

    Object.keys(tokens).forEach(key => {
      if (tokens[key].expires < now) {
        delete tokens[key];
        this.tokenCache.delete(key);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveTokens(tokens);
    }
  }

  /**
   * Enhanced initialization with better error handling
   */
  static initialize(): void {
    if (!this.cleanupTimer) {
      try {
        // Initial cleanup
        this.clearExpiredTokens();
        
        // Set up periodic cleanup
        this.cleanupTimer = setInterval(() => {
          this.clearExpiredTokens();
        }, this.CLEANUP_INTERVAL);

        // Load existing tokens into cache
        const tokens = this.getTokens();
        Object.entries(tokens).forEach(([formId, token]) => {
          this.tokenCache.set(formId, token);
        });
      } catch (error) {
        logError('Error initializing CSRF protection service', error);
      }
    }
  }

  /**
   * Generate a new CSRF token for a specific form with enhanced validation
   *
   * @param formId Unique identifier for the form
   * @returns The generated CSRF token
   */
  static generateToken(formId: string): string {
    // Enhanced input validation
    if (!formId || typeof formId !== 'string') {
      throw new Error('Form ID is required and must be a string');
    }

    if (formId.length === 0 || formId.length > 100) {
      throw new Error('Form ID must be between 1 and 100 characters');
    }

    // Sanitize form ID to prevent injection attacks
    const sanitizedFormId = formId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedFormId !== formId) {
      logWarning('Form ID contained invalid characters and was sanitized');
    }

    try {
      this.clearExpiredTokens();

      const tokens = this.getTokens();
      
      // Check token count limit
      const activeTokenCount = Object.keys(tokens).length;
      if (activeTokenCount >= this.MAX_TOKENS_PER_SESSION) {
        throw new Error('Too many active CSRF tokens. Please try again later.');
      }

      const token = this.generateSecureToken();
      const now = Date.now();
      const expires = now + this.TOKEN_EXPIRY;

      const csrfToken: CSRFToken = {
        token,
        expires,
        formId: sanitizedFormId,
        createdAt: now
      };

      tokens[sanitizedFormId] = csrfToken;
      this.saveTokens(tokens);

      return token;
    } catch (error) {
      logError('Error generating CSRF token', error);
      throw error;
    }
  }

  /**
   * Validate a CSRF token for a specific form with enhanced security
   *
   * @param formId Unique identifier for the form
   * @param token The CSRF token to validate
   * @returns Whether the token is valid
   */
  static validateToken(formId: string, token: string): boolean {
    // Enhanced input validation
    if (!formId || typeof formId !== 'string') {
      logError('Invalid form ID provided for token validation');
      return false;
    }

    if (!token || typeof token !== 'string') {
      logError('Invalid token provided for validation');
      return false;
    }

    // Check token format (should be a valid nanoid-based token with timestamp and suffix)
    if (!/^[A-Za-z0-9_-]{21}-[a-z0-9]+-[a-z0-9]{6}$/i.test(token) && !/^[a-f0-9]{64}$/i.test(token) && !/^fallback-\d+-[a-z0-9]+$/i.test(token)) {
      logWarning('Token format validation failed');
      return false;
    }

    try {
      this.clearExpiredTokens();

      // Check cache first for better performance
      let storedToken = this.tokenCache.get(formId);
      
      if (!storedToken) {
        // Fallback to localStorage
        const tokens = this.getTokens();
        storedToken = tokens[formId];
      }

      if (!storedToken) {
        logWarning(`No stored token found for form ID: ${formId}`);
        return false;
      }

      const now = Date.now();
      if (storedToken.expires < now) {
        logWarning(`Token expired for form ID: ${formId}`);
        this.removeToken(formId);
        return false;
      }

      // Use constant-time comparison to prevent timing attacks
      const isValid = this.constantTimeEquals(storedToken.token, token);

      if (isValid) {
        // Token is valid, remove it (one-time use)
        this.removeToken(formId);
        return true;
      } else {
        logWarning(`Token validation failed for form ID: ${formId}`);
        return false;
      }
    } catch (error) {
      logError('Error validating CSRF token', error);
      return false;
    }
  }

  /**
   * Remove a specific token
   */
  private static removeToken(formId: string): void {
    try {
      const tokens = this.getTokens();
      delete tokens[formId];
      this.tokenCache.delete(formId);
      this.saveTokens(tokens);
    } catch (error) {
      logError('Error removing token', error);
    }
  }

  /**
   * Enhanced constant-time string comparison to prevent timing attacks
   */
  private static constantTimeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Enhanced cleanup with cache clearing
   */
  static cleanup(): void {
    try {
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }
      
      // Clear all tokens
      localStorage.removeItem(this.STORAGE_KEY);
      this.tokenCache.clear();
    } catch (error) {
      logError('Error during CSRF service cleanup', error);
    }
  }

  /**
   * Get token data for debugging (without exposing the actual token)
   */
  static getTokenData(formId: string): { hasToken: boolean; expiresIn: number; formId: string } | null {
    try {
      const storedToken = this.tokenCache.get(formId) || this.getTokens()[formId];
      
      if (!storedToken) {
        return null;
      }

      const now = Date.now();
      const expiresIn = Math.max(0, storedToken.expires - now);

      return {
        hasToken: true,
        expiresIn,
        formId: storedToken.formId
      };
    } catch (error) {
      logError('Error getting token data', error);
      return null;
    }
  }

  /**
   * Get token attributes for form integration with enhanced security
   */
  static getTokenAttributes(formId: string): { 
    type: string; 
    name: string; 
    value: string; 
    'data-form-id': string;
    'data-expires-in': string;
  } {
    try {
      const token = this.generateToken(formId);
      const tokenData = this.getTokenData(formId);
      
      return {
        type: 'hidden',
        name: 'csrf_token',
        value: token,
        'data-form-id': formId,
        'data-expires-in': tokenData?.expiresIn.toString() || '0'
      };
    } catch (error) {
      logError('Error getting token attributes', error);
      // Return safe defaults
      return {
        type: 'hidden',
        name: 'csrf_token',
        value: '',
        'data-form-id': formId,
        'data-expires-in': '0'
      };
    }
  }

  /**
   * Check if CSRF protection is properly initialized
   */
  static isInitialized(): boolean {
    return this.cleanupTimer !== null;
  }

  /**
   * Get service statistics for monitoring
   */
  static getStatistics(): {
    activeTokens: number;
    cacheSize: number;
    isInitialized: boolean;
    cleanupInterval: number;
  } {
    try {
      const tokens = this.getTokens();
      
      return {
        activeTokens: Object.keys(tokens).length,
        cacheSize: this.tokenCache.size,
        isInitialized: this.isInitialized(),
        cleanupInterval: this.CLEANUP_INTERVAL
      };
    } catch (error) {
      logError('Error getting CSRF statistics', error);
      return {
        activeTokens: 0,
        cacheSize: 0,
        isInitialized: false,
        cleanupInterval: this.CLEANUP_INTERVAL
      };
    }
  }
}
