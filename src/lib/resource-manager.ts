/**
 * Centralized Resource Manager
 * Consolidates all resource preloading functionality to eliminate duplication
 */

export interface PreloadResource {
  href: string;
  as: 'image' | 'style' | 'script' | 'font' | 'fetch';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchpriority?: 'high' | 'low' | 'auto';
  rel?: 'preload' | 'prefetch' | 'preconnect';
}

class ResourceManager {
  private static instance: ResourceManager;
  private preloadedResources = new Set<string>();
  private preconnectedDomains = new Set<string>();
  private linkElements = new Map<string, HTMLLinkElement>();

  private constructor() {}

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  /**
   * Add preconnect for external domains
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

      if (resource.fetchpriority) {
        link.setAttribute('fetchpriority', resource.fetchpriority);
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
    const highPriority = resources.filter(r => r.fetchpriority === 'high');
    const normalPriority = resources.filter(r => r.fetchpriority !== 'high' && r.fetchpriority !== 'low');
    const lowPriority = resources.filter(r => r.fetchpriority === 'low');

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
   * Remove unused preload links to prevent browser warnings
   */
  cleanup(): void {
    this.linkElements.forEach((link, key) => {
      if (link.parentNode && key.startsWith('preload:')) {
        // Check if resource was actually used
        setTimeout(() => {
          if (link.parentNode) {
            console.warn(`Removing unused preload: ${link.href}`);
            link.parentNode.removeChild(link);
          }
        }, 5000);
      }
    });
  }

  /**
   * Get preload status
   */
  isPreloaded(href: string): boolean {
    return this.preloadedResources.has(`preload:${href}`);
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
    fetchpriority: index === 0 ? 'high' : 'auto',
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
    fetchpriority: 'high'
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
  // Hero images
  {
    href: '/images/developer-portrait.webp',
    as: 'image',
    type: 'image/webp',
    fetchpriority: 'high'
  },
  // Fonts
  {
    href: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
    fetchpriority: 'high'
  },
  {
    href: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous',
    fetchpriority: 'high'
  },
  // Google Fonts CSS
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    as: 'style',
    crossorigin: 'anonymous'
  }
];

// Initialize resource manager
export function initResourceManager(): void {
  if (typeof window === 'undefined') return;

  // Preload critical resources
  resourceManager.preloadMany(CRITICAL_RESOURCES);

  // Setup cleanup on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      resourceManager.cleanup();
    }, 5000);
  });
} 