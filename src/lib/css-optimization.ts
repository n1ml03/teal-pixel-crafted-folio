/**
 * Utility functions for CSS optimization
 * These functions help with critical CSS loading and deferring non-critical CSS
 */

/**
 * Loads a CSS file with the appropriate loading strategy
 * @param href URL of the CSS file to load
 * @param options Configuration options
 */
export function loadCSS(
  href: string,
  options: {
    critical?: boolean;
    media?: string;
    onload?: () => void;
  } = {}
): HTMLLinkElement {
  const { critical = false, media = 'all', onload } = options;

  const link = document.createElement('link');
  link.rel = critical ? 'stylesheet' : 'preload';
  link.as = critical ? undefined : 'style';
  link.href = href;
  link.media = media;

  if (!critical) {
    // For non-critical CSS, convert from preload to stylesheet once loaded
    link.onload = () => {
      link.onload = null;
      link.rel = 'stylesheet';
      if (onload) onload();
    };
  } else if (onload) {
    link.onload = onload;
  }

  document.head.appendChild(link);
  return link;
}

/**
 * Loads critical CSS inline to avoid render blocking
 * @param cssText The CSS text to inline
 * @param id Optional ID for the style element
 */
export function inlineCriticalCSS(cssText: string, id?: string): HTMLStyleElement {
  const style = document.createElement('style');
  if (id) style.id = id;
  style.textContent = cssText;
  document.head.appendChild(style);
  return style;
}

/**
 * Defers loading of non-critical CSS files
 * @param hrefs Array of CSS file URLs to load
 * @param options Configuration options
 */
export function deferCSS(
  hrefs: string[],
  options: {
    delay?: number;
    onComplete?: () => void;
  } = {}
): void {
  const { delay = 0, onComplete } = options;

  const loadCSSFiles = () => {
    let loaded = 0;
    const total = hrefs.length;

    hrefs.forEach(href => {
      loadCSS(href, {
        critical: false,
        onload: () => {
          loaded++;
          if (loaded === total && onComplete) {
            onComplete();
          }
        }
      });
    });
  };

  // Use requestIdleCallback if available with proper options format, otherwise setTimeout
  if (window.requestIdleCallback) {
    window.requestIdleCallback(loadCSSFiles, { timeout: delay });
  } else {
    window.setTimeout(loadCSSFiles, delay);
  }
}

/**
 * Extracts critical CSS for above-the-fold content
 * This is a simplified version - in production you would use a tool like critical or critters
 * @param selectors Array of critical selectors to include
 */
export function extractCriticalCSS(selectors: string[]): string {
  // In a real implementation, this would analyze the DOM and extract critical CSS
  // For this example, we'll just create a placeholder
  return `
    /* Critical CSS for above-the-fold content */
    body { margin: 0; padding: 0; }
    .container { width: 100%; max-width: 1200px; margin: 0 auto; }
    ${selectors.map(selector => `${selector} { /* Critical styles */ }`).join('\n')}
  `;
}

/**
 * Removes unused CSS rules from a stylesheet
 * @param styleSheet The stylesheet to optimize
 * @param options Configuration options
 */
export function removeUnusedCSS(
  styleSheet: CSSStyleSheet,
  options: {
    whitelist?: string[];
    blacklist?: string[];
  } = {}
): void {
  const { whitelist = [], blacklist = [] } = options;

  // In a real implementation, this would analyze the DOM and remove unused rules
  // For this example, we'll just log a message
  console.log('Removing unused CSS rules from', styleSheet);
}

/**
 * Utility to check if an element is in the viewport
 * Useful for lazy-loading CSS for elements as they come into view
 * @param element The element to check
 * @param offset Optional offset to load before element is in view
 */
export function isInViewport(element: Element, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight + offset) &&
    rect.left <= (window.innerWidth + offset) &&
    rect.bottom >= (0 - offset) &&
    rect.right >= (0 - offset)
  );
}

/**
 * Lazy loads CSS for elements as they come into view
 * @param selector CSS selector for elements to watch
 * @param cssFile CSS file to load when elements are in view
 */
export function lazyLoadCSS(selector: string, cssFile: string): void {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  let loaded = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (loaded) return;

      const isVisible = entries.some(entry => entry.isIntersecting);
      if (isVisible) {
        loadCSS(cssFile);
        loaded = true;
        observer.disconnect();
      }
    },
    { rootMargin: '200px' } // Load CSS when element is within 200px of viewport
  );

  elements.forEach(element => observer.observe(element));
}
