/**
 * SecureHeadersService - Provides secure HTTP headers functionality
 *
 * This service helps improve security by setting appropriate HTTP headers.
 * Note: In a real application, these headers would be set server-side.
 * This client-side implementation is for demonstration purposes only.
 *
 * IMPORTANT: Some security headers (like X-Frame-Options) can ONLY be set
 * via HTTP headers from the server and cannot be set via meta tags.
 * For a production application, a proper server-side implementation is required.
 */
export class SecureHeadersService {
  /**
   * Apply secure headers to the document
   *
   * In a real application, these headers would be set server-side.
   * This method simulates that by adding meta tags to the document head.
   *
   * Limitations: Some security headers (like X-Frame-Options) can only be
   * set via HTTP headers from the server and cannot be set via meta tags.
   * These headers are omitted from this client-side implementation.
   */
  static applySecureHeaders(): void {
    this.setContentSecurityPolicy();
    this.setXSSProtection();
    this.setContentTypeOptions();
    this.setReferrerPolicy();
    // Note: X-Frame-Options header can only be set server-side via HTTP headers
    // It cannot be set via meta tags in the document
  }

  /**
   * Set Content-Security-Policy header
   *
   * CSP helps prevent XSS attacks by controlling which resources can be loaded.
   */
  private static setContentSecurityPolicy(): void {
    const cspValue = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://images.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self'",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');

    this.setMetaTag('http-equiv', 'Content-Security-Policy', cspValue);
  }

  /**
   * Set X-XSS-Protection header
   *
   * This header enables the browser's built-in XSS filter.
   */
  private static setXSSProtection(): void {
    this.setMetaTag('http-equiv', 'X-XSS-Protection', '1; mode=block');
  }

  /**
   * Set X-Content-Type-Options header
   *
   * This header prevents browsers from MIME-sniffing a response away from the declared content-type.
   */
  private static setContentTypeOptions(): void {
    this.setMetaTag('http-equiv', 'X-Content-Type-Options', 'nosniff');
  }

  /**
   * Set Referrer-Policy header
   *
   * This header controls how much referrer information is included with requests.
   */
  private static setReferrerPolicy(): void {
    this.setMetaTag('name', 'referrer', 'strict-origin-when-cross-origin');
  }

  /**
   * X-Frame-Options header
   *
   * Note: This header prevents the page from being displayed in an iframe,
   * but it can ONLY be set server-side via HTTP headers, not via meta tags.
   * In a real application, this would be implemented on the server.
   *
   * Example server implementation:
   * response.setHeader('X-Frame-Options', 'DENY');
   */

  /**
   * Helper method to set a meta tag
   */
  private static setMetaTag(attrName: string, attrValue: string, content: string): void {
    // Check if the meta tag already exists
    const existingTag = document.querySelector(`meta[${attrName}="${attrValue}"]`);

    if (existingTag) {
      // Update existing tag
      existingTag.setAttribute('content', content);
    } else {
      // Create new tag
      const metaTag = document.createElement('meta');
      metaTag.setAttribute(attrName, attrValue);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  }
}
