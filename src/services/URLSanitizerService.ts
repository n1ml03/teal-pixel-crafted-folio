/**
 * URLSanitizerService - Provides URL sanitization functionality
 * 
 * This service helps prevent XSS attacks by sanitizing URLs and other user inputs.
 */
export class URLSanitizerService {
  /**
   * Sanitize a URL to prevent XSS attacks
   * 
   * @param url The URL to sanitize
   * @returns The sanitized URL
   */
  static sanitizeURL(url: string): string {
    try {
      // Parse the URL to ensure it's valid
      const parsedUrl = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
      
      // Reconstruct the URL to ensure it's properly formatted
      return parsedUrl.toString();
    } catch (error) {
      // If the URL is invalid, return an empty string
      console.error('Error sanitizing URL:', error);
      return '';
    }
  }

  /**
   * Sanitize a string to prevent XSS attacks
   * 
   * @param input The string to sanitize
   * @returns The sanitized string
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    // Replace HTML special characters with their entity equivalents
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
}
