/**
 * Optimized Resource Manager using quicklink for intelligent preloading
 * Replaced custom implementation with battle-tested library for better performance
 */
import { listen } from 'quicklink';

export interface PreloadResource {
  href: string;
  as: 'image' | 'style' | 'script' | 'font' | 'fetch';
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
  private quicklinkInitialized = false;
  private cleanupDisabled = true; // Disable cleanup by default to prevent removing used resources

  private constructor() {}

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  /**
   * Initialize intelligent link preloading using quicklink
   */
  initializeIntelligentPreloading(): void {
    if (this.quicklinkInitialized || typeof window === 'undefined') return;

    try {
      listen({
        limit: 2, // Limit concurrent prefetches
        threshold: 0.5, // Prefetch when 50% of link is visible
        timeout: 2000, // Timeout after 2 seconds
        priority: true, // Use high priority fetch
        origins: true, // Allow cross-origin prefetching
      });
      this.quicklinkInitialized = true;
    } catch (error) {
      console.error('Error initializing quicklink:', error);
    }
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

      // For fonts, always consider them as used if they're loaded
      if (href.includes('font') || href.includes('.woff') || href.includes('fonts.g')) {
        return true; // Always keep fonts
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
export function preloadCriticalImages(urls: string[]): void {
  const resources: PreloadResource[] = urls.map((url, index) => ({
    href: url,
    as: 'image',
    fetchPriority: index === 0 ? 'high' : 'auto',
    type: url.endsWith('.webp') ? 'image/webp' : undefined
  }));
  
  resourceManager.preloadMany(resources);
}

export function preloadFonts(urls: string[]): void {
  const resources: PreloadResource[] = urls.map(url => ({
    href: url,
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
    fetchPriority: 'high'
  }));
  
  resourceManager.preloadMany(resources);
}

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
  // Hero images - high priority for LCP
  {
    href: '/images/developer-portrait.webp',
    as: 'image',
    type: 'image/webp',
    fetchPriority: 'high'
  },
  {
    href: '/images/profile.webp',
    as: 'image',
    type: 'image/webp',
    fetchPriority: 'high'
  },
  // Secondary images - lower priority
  {
    href: '/images/coding-preview.webp',
    as: 'image',
    type: 'image/webp',
    fetchPriority: 'low'
  },
  {
    href: '/images/testing-preview.webp',
    as: 'image',
    type: 'image/webp',
    fetchPriority: 'low'
  },
  // Fonts - high priority for text rendering
  {
    href: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
    fetchPriority: 'high'
  },
  {
    href: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
    fetchPriority: 'high'
  },
  // Google Fonts CSS
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    as: 'style',
    crossorigin: 'anonymous'
  },
  // Tech stack icons - low priority
  {
    href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    as: 'image',
    fetchPriority: 'low'
  },
  {
    href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    as: 'image',
    fetchPriority: 'low'
  },
  {
    href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    as: 'image',
    fetchPriority: 'low'
  }
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

// Export function to enable/disable cleanup if needed
export function setResourceCleanupEnabled(enabled: boolean): void {
  resourceManager.setCleanupEnabled(enabled);
}