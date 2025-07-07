/**
 * Optimized URLSanitizerService using well-established security libraries
 * Replaced custom implementations with battle-tested packages for better security
 */
import DOMPurify from 'dompurify';
import validator from 'validator';

export class URLSanitizerService {
  /**
   * Sanitize a URL using validator library for better security
   *
   * @param url The URL to sanitize
   * @returns The sanitized URL
   */
  static sanitizeURL(url: string): string {
    if (!url) return '';

    try {
      // Use validator library for robust URL validation
      if (!validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
      })) {
        return '';
      }

      // Additional validation using native URL constructor
      const parsedUrl = new URL(url);

      // Only allow http and https protocols (double check)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return '';
      }

      // Return the validated URL
      return parsedUrl.toString();
    } catch (error) {
      console.error('Error sanitizing URL:', error);
      return '';
    }
  }

  /**
   * Sanitize HTML string using DOMPurify for better security
   *
   * @param input The string to sanitize
   * @returns The sanitized string
   */
  static sanitizeString(input: string): string {
    if (!input) return '';

    // Use DOMPurify for robust HTML sanitization
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [], // No attributes allowed
      KEEP_CONTENT: true // Keep text content
    });
  }

  /**
   * Sanitize a custom alias to ensure it only contains safe characters
   * 
   * @param alias The custom alias to sanitize
   * @returns The sanitized alias
   */
  static sanitizeAlias(alias: string): string {
    if (!alias) return '';
    
    // Only allow alphanumeric characters, hyphens, and underscores
    return alias.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /**
   * Sanitize URL parameters to prevent injection attacks
   * 
   * @param params The URL parameters to sanitize
   * @returns The sanitized parameters
   */
  static sanitizeURLParams(params: Record<string, string>): Record<string, string> {
    const sanitizedParams: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(params)) {
      // Sanitize both keys and values
      const sanitizedKey = this.sanitizeString(key);
      const sanitizedValue = this.sanitizeString(value);
      
      sanitizedParams[sanitizedKey] = sanitizedValue;
    }
    
    return sanitizedParams;
  }

  /**
   * Safely display a URL in the UI
   * 
   * @param url The URL to display
   * @returns Safe HTML for displaying the URL
   */
  static getSafeDisplayURL(url: string): { hostname: string; pathname: string; fullUrl: string } {
    try {
      // Parse the URL
      const parsedUrl = new URL(this.sanitizeURL(url));
      
      // Extract and sanitize components
      const hostname = this.sanitizeString(parsedUrl.hostname);
      const pathname = this.sanitizeString(parsedUrl.pathname + parsedUrl.search);
      const fullUrl = this.sanitizeString(parsedUrl.toString());
      
      return { hostname, pathname, fullUrl };
    } catch (error) {
      // Return safe defaults if URL is invalid
      return { 
        hostname: 'Invalid URL', 
        pathname: '', 
        fullUrl: this.sanitizeString(url) 
      };
    }
  }

  /**
   * Check if a URL is potentially dangerous
   * 
   * @param url The URL to check
   * @returns Whether the URL is potentially dangerous
   */
  static isPotentiallyDangerous(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Check for javascript: protocol (common XSS vector)
      if (parsedUrl.protocol === 'javascript:') {
        return true;
      }
      
      // Check for data: protocol (can be used for XSS)
      if (parsedUrl.protocol === 'data:') {
        return true;
      }
      
      // Check for file: protocol (can expose local files)
      if (parsedUrl.protocol === 'file:') {
        return true;
      }
      
      // Check for suspicious patterns in the URL
      const suspiciousPatterns = [
        'eval(', 'javascript:', 'vbscript:', 'data:text/html',
        'document.cookie', 'onload=', 'onerror=', '<script'
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (url.toLowerCase().includes(pattern)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      // If we can't parse the URL, consider it dangerous
      return true;
    }
  }

  /**
   * Validate an email address using validator library
   *
   * @param email The email address to validate
   * @returns Whether the email is valid
   */
  static isValidEmail(email: string): boolean {
    if (!email) return false;
    return validator.isEmail(email, {
      allow_utf8_local_part: false,
      require_tld: true,
      allow_ip_domain: false
    });
  }

  /**
   * Validate a phone number using validator library
   *
   * @param phone The phone number to validate
   * @returns Whether the phone number is valid
   */
  static isValidPhone(phone: string): boolean {
    if (!phone) return false;
    return validator.isMobilePhone(phone, 'any', { strictMode: false });
  }
}
