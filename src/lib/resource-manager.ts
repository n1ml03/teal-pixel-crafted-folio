/**
 * Resource Manager for intelligent preloading
 * Handles preloading of critical resources for better performance
 */

export interface PreloadResource {
  href: string;
  as: 'style' | 'script' | 'fetch';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchPriority?: 'high' | 'low' | 'auto';
  rel?: 'preload' | 'prefetch' | 'preconnect';
}

class ResourceManager {
  private static instance: ResourceManager;
  private preloadedResources = new Set<string>();
  private preconnectedDomains = new Set<string>();
  private linkElements = new Map<string, HTMLLinkElement>();

  private cleanupDisabled = true; // Disable cleanup by default to prevent removing used resources

  private constructor() {}

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  /**
   * Initialize intelligent link preloading
   */
  initializeIntelligentPreloading(): void {
    // Simple implementation without external dependencies
    if (typeof window === 'undefined') return;

    // Basic intersection observer for link prefetching could be added here if needed
    console.log('Resource manager initialized');
  }

  /**
   * Optimized preconnect for external domains
   */
  preconnect(url: string, crossorigin = true): void {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.origin;

      if (this.preconnectedDomains.has(domain)) return;

      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      if (crossorigin) {
        link.crossOrigin = 'anonymous';
      }

      document.head.appendChild(link);
      this.preconnectedDomains.add(domain);
      this.linkElements.set(`preconnect:${domain}`, link);
    } catch (error) {
      console.warn(`Invalid URL for preconnect: ${url}`);
    }
  }

  /**
   * Preload a single resource
   */
  preload(resource: PreloadResource): boolean {
    const key = `${resource.rel || 'preload'}:${resource.href}`;
    
    if (this.preloadedResources.has(key)) return false;

    // Check if already exists in DOM
    const existing = document.querySelector(`link[rel="${resource.rel || 'preload'}"][href="${resource.href}"]`);
    if (existing) {
      this.preloadedResources.add(key);
      return false;
    }

    try {
      const link = document.createElement('link');
      link.rel = resource.rel || 'preload';
      link.href = resource.href;
      link.setAttribute('as', resource.as);

      if (resource.type) {
        link.type = resource.type;
      }

      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }

      if (resource.fetchPriority) {
        link.setAttribute('fetchpriority', resource.fetchPriority);
      }

      // Add error handling
      link.onerror = () => {
        console.warn(`Failed to preload: ${resource.href}`);
        this.preloadedResources.delete(key);
        this.linkElements.delete(key);
      };

      document.head.appendChild(link);
      this.preloadedResources.add(key);
      this.linkElements.set(key, link);
      return true;
    } catch (error) {
      console.error(`Error preloading resource ${resource.href}:`, error);
      return false;
    }
  }

  /**
   * Preload multiple resources
   */
  preloadMany(resources: PreloadResource[]): void {
    // Auto-preconnect to external domains
    const domains = new Set<string>();
    resources.forEach(resource => {
      try {
        const url = new URL(resource.href);
        if (url.origin !== window.location.origin) {
          domains.add(url.origin);
        }
      } catch {
        // Ignore relative URLs
      }
    });

    domains.forEach(domain => this.preconnect(domain));

    // Preload resources in priority order
    const highPriority = resources.filter(r => r.fetchPriority === 'high');
    const normalPriority = resources.filter(r => r.fetchPriority !== 'high' && r.fetchPriority !== 'low');
    const lowPriority = resources.filter(r => r.fetchPriority === 'low');

    // Load high priority immediately
    highPriority.forEach(resource => this.preload(resource));

    // Load normal priority with small delay
    setTimeout(() => {
      normalPriority.forEach(resource => this.preload(resource));
    }, 50);

    // Load low priority after longer delay
    setTimeout(() => {
      lowPriority.forEach(resource => this.preload(resource));
    }, 200);
  }

  /**
   * Manual cleanup method - only removes truly unused non-critical resources
   * This method should be called manually when needed, not automatically
   */
  cleanup(): void {
    if (this.cleanupDisabled) {
      console.log('Resource cleanup is disabled to prevent removing used resources');
      return;
    }

    // Only remove non-critical preload links that are definitely unused
    this.linkElements.forEach((link, key) => {
      if (link.parentNode && key.startsWith('preload:')) {
        // Only remove if it's not a critical resource
        if (!this.isCriticalResource(link.href)) {
          // Additional check: only remove if the link has been in DOM for a very long time
          // and we're sure it's not being used
          setTimeout(() => {
            if (link.parentNode && !this.isResourceCurrentlyUsed(link.href)) {
              console.warn(`Removing unused non-critical preload: ${link.href}`);
              link.parentNode.removeChild(link);
              this.linkElements.delete(key);
              this.preloadedResources.delete(key);
            }
          }, 30000); // Very long timeout - 30 seconds
        }
      }
    });
  }

  /**
   * Enable or disable automatic cleanup
   */
  setCleanupEnabled(enabled: boolean): void {
    this.cleanupDisabled = !enabled;
    console.log(`Resource cleanup ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if a resource is critical and should never be removed
   */
  private isCriticalResource(href: string): boolean {
    const criticalPatterns = [
      '/images/developer-portrait.webp',
      '/images/profile.webp',
      '/images/coding-preview.webp',
      '/images/testing-preview.webp',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'devicons/devicon',
      'typescript-original.svg',
      'react-original.svg',
      'nodejs-original.svg',
      'jest-plain.svg',
      'cypressio-original.svg',
      'playwright-original.svg'
    ];

    return criticalPatterns.some(pattern => href.includes(pattern));
  }

  /**
   * Check if a resource is currently being used in the DOM
   */
  private isResourceCurrentlyUsed(href: string): boolean {
    try {
      // Check if the resource is used in img tags
      const images = document.querySelectorAll('img');
      for (const img of images) {
        if (img.src === href || img.src.includes(href.split('/').pop() || '')) {
          return true;
        }
      }

      // Check if the resource is used in CSS background images
      const elementsWithBg = document.querySelectorAll('*');
      for (const element of elementsWithBg) {
        const computedStyle = window.getComputedStyle(element);
        const bgImage = computedStyle.backgroundImage;
        if (bgImage && bgImage.includes(href)) {
          return true;
        }
      }



      return false;
    } catch (error) {
      // If there's an error checking, consider it as used to be safe
      return true;
    }
  }

  /**
   * Get preload status
   */
  isPreloaded(href: string): boolean {
    return this.preloadedResources.has(`preload:${href}`);
  }

  /**
   * Get count of preloaded resources
   */
  getPreloadedCount(): number {
    return this.preloadedResources.size;
  }

  /**
   * Clear all preloaded resources
   */
  clear(): void {
    this.linkElements.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    this.preloadedResources.clear();
    this.preconnectedDomains.clear();
    this.linkElements.clear();
  }
}

// Export singleton instance
export const resourceManager = ResourceManager.getInstance();

// Convenience functions for backward compatibility



export function preloadCSS(urls: string[]): void {
  const resources: PreloadResource[] = urls.map(url => ({
    href: url,
    as: 'style',
    crossorigin: 'anonymous'
  }));
  
  resourceManager.preloadMany(resources);
}

// Critical resources configuration
export const CRITICAL_RESOURCES: PreloadResource[] = [
  // No critical resources to preload
];

// Initialize resource manager
export function initResourceManager(): void {
  if (typeof window === 'undefined') return;

  // Preload critical resources
  resourceManager.preloadMany(CRITICAL_RESOURCES);

  // Initialize intelligent preloading
  resourceManager.initializeIntelligentPreloading();

  // Ensure cleanup is disabled by default
  resourceManager.setCleanupEnabled(false);

  // DO NOT automatically cleanup resources - let them stay loaded
  // Cleanup can be called manually if needed via resourceManager.cleanup()
  console.log('Resource manager initialized with', CRITICAL_RESOURCES.length, 'critical resources');
}

/**
 * Bundle Size Optimization Utilities
 */

/**
 * Monitor bundle loading performance
 */
export function monitorBundlePerformance(): {
  totalChunks: number;
  loadedChunks: number;
  failedChunks: number;
  averageLoadTime: number;
} {
  const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  const jsChunks = resourceEntries.filter(entry =>
    entry.name.includes('.js') && entry.name.includes('assets/')
  );

  const cssChunks = resourceEntries.filter(entry =>
    entry.name.includes('.css') && entry.name.includes('assets/')
  );

  const totalChunks = jsChunks.length + cssChunks.length;
  const failedChunks = resourceEntries.filter(entry =>
    (entry.name.includes('.js') || entry.name.includes('.css')) &&
    entry.transferSize === 0
  ).length;

  const averageLoadTime = totalChunks > 0
    ? [...jsChunks, ...cssChunks].reduce((sum, entry) => sum + entry.duration, 0) / totalChunks
    : 0;

  return {
    totalChunks,
    loadedChunks: totalChunks - failedChunks,
    failedChunks,
    averageLoadTime,
  };
}

/**
 * Preload critical chunks based on route
 */
export function preloadCriticalChunks(route: string): void {
  const chunkMap: Record<string, string[]> = {
    '/': ['page-home'],
    '/blog': ['page-blog', 'markdown'],
    '/blog/*': ['page-blog-post', 'markdown'],
    '/projects': ['page-projects'],
    '/services': ['page-services'],
    '/playground': ['playground-main', 'editor'],
    '/tools/*': ['tools-api-tester', 'tools-test-generator'],
  };

  const matchingChunks = Object.entries(chunkMap).find(([pattern]) => {
    if (pattern.includes('*')) {
      const basePattern = pattern.replace('*', '');
      return route.startsWith(basePattern);
    }
    return route === pattern;
  });

  if (matchingChunks) {
    const [, chunks] = matchingChunks;
    chunks.forEach(chunk => {
      resourceManager.preload({
        href: `/assets/${chunk}.js`,
        as: 'script',
        fetchPriority: 'high',
      });
    });
  }
}

/**
 * Optimize image loading with modern formats
 */
export function optimizeImageLoading(images: HTMLImageElement[]): void {
  images.forEach(img => {
    // Add loading="lazy" if not already set
    if (!img.loading) {
      img.loading = 'lazy';
    }

    // Add decoding="async" for better performance
    if (!img.decoding) {
      img.decoding = 'async';
    }

    // Preload critical images
    if (img.getBoundingClientRect().top < window.innerHeight * 2) {
      resourceManager.preload({
        href: img.src,
        as: 'fetch',
        fetchPriority: 'high',
      });
    }
  });
}

/**
 * Tree shaking analysis helper
 */
export function analyzeUnusedCode(): {
  unusedCSS: string[];
  unusedJS: string[];
  recommendations: string[];
} {
  const unusedCSS: string[] = [];
  const unusedJS: string[] = [];
  const recommendations: string[] = [];

  // Analyze CSS usage
  const stylesheets = Array.from(document.styleSheets);
  stylesheets.forEach(stylesheet => {
    try {
      const rules = Array.from(stylesheet.cssRules || []);
      rules.forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          const selector = rule.selectorText;
          if (!document.querySelector(selector)) {
            unusedCSS.push(selector);
          }
        }
      });
    } catch (e) {
      // Cross-origin stylesheets can't be analyzed
    }
  });

  // Basic recommendations
  if (unusedCSS.length > 50) {
    recommendations.push('Consider removing unused CSS rules');
    recommendations.push('Use CSS purging tools in production');
  }

  const scriptTags = document.querySelectorAll('script[src]');
  if (scriptTags.length > 10) {
    recommendations.push('Consider bundling more scripts together');
    recommendations.push('Use dynamic imports for non-critical code');
  }

  return {
    unusedCSS: unusedCSS.slice(0, 20), // Limit output
    unusedJS: [], // Would need more complex analysis
    recommendations,
  };
}

/**
 * Memory usage optimization
 */
export function optimizeMemoryUsage(): void {
  // Clean up unused event listeners
  const elements = document.querySelectorAll('*');
  elements.forEach(element => {
    // Remove data attributes that might hold references
    const dataAttrs = Array.from(element.attributes).filter(attr =>
      attr.name.startsWith('data-') && attr.value.length > 1000
    );
    dataAttrs.forEach(attr => element.removeAttribute(attr.name));
  });

  // Suggest garbage collection if available
  if ('gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc();
  }
}

// Export function to enable/disable cleanup if needed
export function setResourceCleanupEnabled(enabled: boolean): void {
  resourceManager.setCleanupEnabled(enabled);
}