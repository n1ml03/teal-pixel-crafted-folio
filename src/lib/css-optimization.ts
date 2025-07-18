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
 * CSS Animation and Transform Optimization Utilities
 */

/**
 * Optimize elements for smooth animations by setting appropriate CSS properties
 */
export function optimizeElementForAnimation(
  element: HTMLElement,
  properties: string[] = ['transform', 'opacity'],
  options: {
    useContainment?: boolean;
    useLayerization?: boolean;
    useGPUAcceleration?: boolean;
  } = {}
): void {
  const { useContainment = true, useLayerization = true, useGPUAcceleration = true } = options;

  // Set will-change for properties that will animate
  element.style.willChange = properties.join(', ');

  // Force GPU acceleration
  if (useGPUAcceleration) {
    element.style.transform = element.style.transform || 'translateZ(0)';
  }

  // Use CSS containment for better performance
  if (useContainment) {
    element.style.contain = 'layout paint';
  }

  // Create a new stacking context for better layerization
  if (useLayerization) {
    element.style.isolation = 'isolate';
  }
}

/**
 * Clean up animation optimizations to free up resources
 */
export function cleanupAnimationOptimizations(element: HTMLElement): void {
  element.style.willChange = 'auto';
  element.style.contain = '';
  element.style.isolation = '';

  // Only remove translateZ if it was added for GPU acceleration
  if (element.style.transform === 'translateZ(0)') {
    element.style.transform = '';
  }
}

/**
 * Batch optimize multiple elements for animations
 */
export function batchOptimizeForAnimation(
  selector: string,
  properties: string[] = ['transform', 'opacity'],
  options: {
    useContainment?: boolean;
    useLayerization?: boolean;
    useGPUAcceleration?: boolean;
  } = {}
): HTMLElement[] {
  const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  const optimizedElements: HTMLElement[] = [];

  elements.forEach(element => {
    optimizeElementForAnimation(element, properties, options);
    optimizedElements.push(element);
  });

  return optimizedElements;
}

/**
 * Create optimized CSS keyframes for smooth animations
 */
export function createOptimizedKeyframes(
  name: string,
  keyframes: Record<string, Record<string, string>>,
  options: {
    useGPUAcceleration?: boolean;
    optimizeForScroll?: boolean;
  } = {}
): string {
  const { useGPUAcceleration = true, optimizeForScroll = false } = options;

  let css = `@keyframes ${name} {\n`;

  Object.entries(keyframes).forEach(([percentage, styles]) => {
    css += `  ${percentage} {\n`;

    Object.entries(styles).forEach(([property, value]) => {
      css += `    ${property}: ${value};\n`;
    });

    // Add GPU acceleration if needed
    if (useGPUAcceleration && !styles.transform) {
      css += `    transform: translateZ(0);\n`;
    }

    // Optimize for scroll-based animations
    if (optimizeForScroll) {
      css += `    will-change: transform, opacity;\n`;
      css += `    contain: layout paint;\n`;
    }

    css += `  }\n`;
  });

  css += `}`;
  return css;
}

/**
 * Inject optimized CSS animations into the document
 */
export function injectOptimizedAnimations(
  animations: Record<string, Record<string, Record<string, string>>>,
  options: {
    useGPUAcceleration?: boolean;
    optimizeForScroll?: boolean;
    id?: string;
  } = {}
): HTMLStyleElement {
  const { id = 'optimized-animations' } = options;

  // Remove existing style element if it exists
  const existingStyle = document.getElementById(id);
  if (existingStyle) {
    existingStyle.remove();
  }

  let css = '';
  Object.entries(animations).forEach(([name, keyframes]) => {
    css += createOptimizedKeyframes(name, keyframes, options) + '\n\n';
  });

  return inlineCriticalCSS(css, id);
}

/**
 * Monitor animation performance and provide recommendations
 */
export function monitorAnimationPerformance(
  selector: string,
  duration: number = 5000
): Promise<{
  averageFPS: number;
  droppedFrames: number;
  recommendations: string[];
}> {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      resolve({ averageFPS: 60, droppedFrames: 0, recommendations: ['No elements found'] });
      return;
    }

    let frameCount = 0;
    let lastTime = performance.now();
    const frameTimes: number[] = [];

    const measureFrame = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      frameTimes.push(deltaTime);
      frameCount++;
      lastTime = currentTime;
    };

    const animationId = setInterval(measureFrame, 16); // ~60fps

    setTimeout(() => {
      clearInterval(animationId);

      const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const averageFPS = 1000 / averageFrameTime;
      const droppedFrames = frameTimes.filter(time => time > 20).length; // Frames longer than 20ms

      const recommendations: string[] = [];

      if (averageFPS < 50) {
        recommendations.push('Consider reducing animation complexity');
        recommendations.push('Use transform and opacity properties only');
        recommendations.push('Enable GPU acceleration with translateZ(0)');
      }

      if (droppedFrames > frameCount * 0.1) {
        recommendations.push('Too many dropped frames detected');
        recommendations.push('Consider using CSS containment');
        recommendations.push('Reduce the number of animated elements');
      }

      resolve({ averageFPS, droppedFrames, recommendations });
    }, duration);
  });
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
