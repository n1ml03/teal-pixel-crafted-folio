/**
 * CSRFProtectionService - Provides CSRF protection functionality
 *
 * This service helps prevent Cross-Site Request Forgery attacks by generating
 * and validating CSRF tokens for form submissions.
 */
export class CSRFProtectionService {
  private static STORAGE_KEY = 'csrf_tokens';
  private static TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

  /**
   * Generate a random token
   */
  private static generateRandomToken(length: number = 32): string {
    try {
      // Use crypto.getRandomValues for better randomness
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback method in case crypto API is not available
      console.warn('Crypto API not available, using fallback random method');
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const timestamp = Date.now().toString();
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      // Add timestamp to improve entropy
      return result + timestamp;
    }
  }

  /**
   * Get all stored CSRF tokens
   */
  private static getTokens(): Record<string, { token: string; expires: number }> {
    try {
      const tokensJson = localStorage.getItem(this.STORAGE_KEY);
      return tokensJson ? JSON.parse(tokensJson) : {};
    } catch (error) {
      console.error('Error getting CSRF tokens from localStorage:', error);
      return {};
    }
  }

  /**
   * Save CSRF tokens to localStorage
   */
  private static saveTokens(tokens: Record<string, { token: string; expires: number }>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error saving CSRF tokens to localStorage:', error);
    }
  }

  /**
   * Clean up expired tokens
   */
  private static cleanupExpiredTokens(): void {
    const tokens = this.getTokens();
    const now = Date.now();
    let hasChanges = false;

    Object.keys(tokens).forEach(key => {
      if (tokens[key].expires < now) {
        delete tokens[key];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveTokens(tokens);
    }
  }

  /**
   * Generate a new CSRF token for a specific form
   *
   * @param formId Unique identifier for the form
   * @returns The generated CSRF token
   */
  static generateToken(formId: string): string {
    this.cleanupExpiredTokens();

    const tokens = this.getTokens();
    const token = this.generateRandomToken();
    const expires = Date.now() + this.TOKEN_EXPIRY;

    tokens[formId] = { token, expires };
    this.saveTokens(tokens);

    return token;
  }

  /**
   * Validate a CSRF token for a specific form
   *
   * @param formId Unique identifier for the form
   * @param token The CSRF token to validate
   * @returns Whether the token is valid
   */
  static validateToken(formId: string, token: string): boolean {
    this.cleanupExpiredTokens();

    const tokens = this.getTokens();
    const storedToken = tokens[formId];

    if (!storedToken) {
      return false;
    }

    if (storedToken.expires < Date.now()) {
      delete tokens[formId];
      this.saveTokens(tokens);
      return false;
    }

    if (storedToken.token !== token) {
      return false;
    }

    // Token is valid, but we'll use it only once
    delete tokens[formId];
    this.saveTokens(tokens);

    return true;
  }

  /**
   * Get token data for a form
   *
   * @param formId Unique identifier for the form
   * @returns Object with token and form ID for creating a hidden input
   */
  static getTokenData(formId: string): { token: string; formId: string } {
    const token = this.generateToken(formId);
    return { token, formId };
  }

  /**
   * Get HTML attributes for a CSRF token input
   *
   * @param formId Unique identifier for the form
   * @returns Object with attributes for creating a hidden input
   */
  static getTokenAttributes(formId: string): { type: string; name: string; value: string; 'data-form-id': string } {
    const token = this.generateToken(formId);
    return {
      type: "hidden",
      name: "csrf_token",
      value: token,
      'data-form-id': formId
    };
  }
}
