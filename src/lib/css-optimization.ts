/**
 * Utility functions for CSS optimization
 * These functions help with critical CSS loading and deferring non-critical CSS
 */

/**
 * Modern CSS loading using native browser APIs and optimized patterns
 * Efficient CSS loading strategies without external dependencies
 */

/**
 * CSS loading strategies
 */
export type CSSLoadingStrategy = 'critical' | 'preload' | 'lazy' | 'defer';

/**
 * Optimized CSS loading with strategy pattern
 */
export function loadOptimizedCSS(
  href: string,
  options: {
    strategy?: CSSLoadingStrategy;
    media?: string;
    onLoad?: () => void;
    onError?: () => void;
    priority?: 'high' | 'normal' | 'low';
  } = {}
): HTMLLinkElement {
  const {
    strategy = 'preload',
    media = 'all',
    onLoad,
    onError,
    priority = 'normal'
  } = options;

  switch (strategy) {
    case 'critical':
      return loadCriticalCSS(href, media, onLoad, onError);
    
    case 'preload':
      return preloadCSS(href, media, onLoad, onError);
    
    case 'lazy':
      return loadLazyCSS(href, media, onLoad, onError);
    
    case 'defer':
      return deferCSSLoad(href, media, onLoad, onError, priority);
    
    default:
      return preloadCSS(href, media, onLoad, onError);
  }
}

/**
 * Load critical CSS immediately (blocking)
 */
function loadCriticalCSS(
  href: string,
  media: string,
  onLoad?: () => void,
  onError?: () => void
): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.media = media;
  
  if (onLoad) link.onload = onLoad;
  if (onError) link.onerror = onError;
  
  document.head.appendChild(link);
  return link;
}

/**
 * Preload CSS (non-blocking, then activate)
 */
function preloadCSS(
  href: string,
  media: string,
  onLoad?: () => void,
  onError?: () => void
): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.media = media;
  
  link.onload = () => {
    link.rel = 'stylesheet';
    onLoad?.();
  };
  
  if (onError) link.onerror = onError;
  
  document.head.appendChild(link);
  return link;
}

/**
 * Load CSS lazily when element becomes visible
 */
function loadLazyCSS(
  href: string,
  media: string,
  onLoad?: () => void,
  onError?: () => void
): HTMLLinkElement {
  const link = document.createElement('link');
  
  // Use requestIdleCallback for better performance
  const loadWhenIdle = () => {
    link.rel = 'stylesheet';
    link.href = href;
    link.media = media;
    
    if (onLoad) link.onload = onLoad;
    if (onError) link.onerror = onError;
    
    document.head.appendChild(link);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadWhenIdle, { timeout: 3000 });
  } else {
    setTimeout(loadWhenIdle, 100);
  }
  
  return link;
}

/**
 * Defer CSS loading with priority
 */
function deferCSSLoad(
  href: string,
  media: string,
  onLoad?: () => void,
  onError?: () => void,
  priority: 'high' | 'normal' | 'low' = 'normal'
): HTMLLinkElement {
  const delay = priority === 'high' ? 0 : priority === 'normal' ? 100 : 300;
  const link = document.createElement('link');
  
  setTimeout(() => {
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.media = media;
    
    link.onload = () => {
      link.rel = 'stylesheet';
      onLoad?.();
    };
    
    if (onError) link.onerror = onError;
    
    document.head.appendChild(link);
  }, delay);
  
  return link;
}

/**
 * Batch load multiple CSS files efficiently
 */
export function loadCSSBatch(
  stylesheets: Array<{
    href: string;
    strategy?: CSSLoadingStrategy;
    media?: string;
    priority?: 'high' | 'normal' | 'low';
  }>,
  onComplete?: () => void
): HTMLLinkElement[] {
  let loadedCount = 0;
  const links: HTMLLinkElement[] = [];
  
  const handleLoad = () => {
    loadedCount++;
    if (loadedCount === stylesheets.length && onComplete) {
      onComplete();
    }
  };

  stylesheets.forEach(({ href, strategy = 'preload', media = 'all', priority = 'normal' }) => {
    const link = loadOptimizedCSS(href, {
      strategy,
      media,
      priority,
      onLoad: handleLoad
    });
    links.push(link);
  });

  return links;
}

/**
 * Inline critical CSS for immediate rendering
 */
export function inlineCriticalCSS(cssText: string, id?: string): HTMLStyleElement {
  const style = document.createElement('style');
  if (id) style.id = id;
  style.textContent = cssText;
  
  // Insert at the beginning of head for high priority
  const firstLink = document.head.querySelector('link');
  if (firstLink) {
    document.head.insertBefore(style, firstLink);
  } else {
    document.head.appendChild(style);
  }
  
  return style;
}

/**
 * Remove unused CSS link elements
 */
export function cleanupUnusedCSS(): void {
  const links = document.querySelectorAll('link[rel="preload"][as="style"]');
  
  links.forEach(link => {
    // Check if the preload link was converted to stylesheet
    const href = link.getAttribute('href');
    const hasStylesheet = document.querySelector(`link[rel="stylesheet"][href="${href}"]`);
    
    if (!hasStylesheet && link.parentNode) {
      console.warn(`Removing unused CSS preload: ${href}`);
      link.parentNode.removeChild(link);
    }
  });
}

/**
 * Check if element is in viewport (for conditional CSS loading)
 */
export function isElementInViewport(element: Element, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top <= (windowHeight + offset) &&
    rect.left <= (windowWidth + offset) &&
    rect.bottom >= (0 - offset) &&
    rect.right >= (0 - offset)
  );
}

/**
 * Load CSS when target elements become visible
 */
export function loadCSSOnElementVisible(
  selector: string,
  cssFile: string,
  options: {
    rootMargin?: string;
    threshold?: number;
    strategy?: CSSLoadingStrategy;
  } = {}
): void {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const { rootMargin = '200px', threshold = 0.1, strategy = 'preload' } = options;
  let loaded = false;

  // Use modern IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      if (loaded) return;

      const isVisible = entries.some(entry => entry.isIntersecting);
      if (isVisible) {
        loadOptimizedCSS(cssFile, { strategy });
        loaded = true;
        observer.disconnect();
      }
    },
    { rootMargin, threshold }
  );

  elements.forEach(element => observer.observe(element));
}

/**
 * Media query based CSS loading
 */
export function loadCSSForMediaQuery(
  mediaQuery: string,
  cssFile: string,
  strategy: CSSLoadingStrategy = 'preload'
): HTMLLinkElement | null {
  if (!window.matchMedia) {
    console.warn('matchMedia not supported, loading CSS unconditionally');
    return loadOptimizedCSS(cssFile, { strategy });
  }

  const mediaQueryList = window.matchMedia(mediaQuery);
  
  if (mediaQueryList.matches) {
    return loadOptimizedCSS(cssFile, { strategy, media: mediaQuery });
  }

  // Listen for media query changes
  const handleChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      loadOptimizedCSS(cssFile, { strategy, media: mediaQuery });
      mediaQueryList.removeEventListener('change', handleChange);
    }
  };

  mediaQueryList.addEventListener('change', handleChange);
  return null;
}

/**
 * Get CSS loading performance metrics
 */
export function getCSSLoadingMetrics(): {
  totalStylesheets: number;
  preloadedStylesheets: number;
  inlineStyles: number;
  unusedPreloads: number;
} {
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]').length;
  const preloaded = document.querySelectorAll('link[rel="preload"][as="style"]').length;
  const inline = document.querySelectorAll('style').length;
  
  // Count unused preloads
  const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
  let unusedPreloads = 0;
  
  preloadLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hasStylesheet = document.querySelector(`link[rel="stylesheet"][href="${href}"]`);
    if (!hasStylesheet) unusedPreloads++;
  });

  return {
    totalStylesheets: stylesheets,
    preloadedStylesheets: preloaded,
    inlineStyles: inline,
    unusedPreloads
  };
}
