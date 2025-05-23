import { useEffect, useRef } from 'react';

interface ResourcePreloaderProps {
  resources: {
    href: string;
    as: 'image' | 'style' | 'script' | 'font';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    // This will be applied as lowercase 'fetchpriority' in the DOM
    fetchPriority?: 'high' | 'low' | 'auto';
  }[];
  enableLogging?: boolean;
}

/**
 * Enhanced ResourcePreloader component that preloads critical resources
 * to improve performance with better error handling and logging
 */
export const ResourcePreloader = ({ resources, enableLogging = false }: ResourcePreloaderProps) => {
  const createdLinks = useRef<HTMLLinkElement[]>([]);
  const hasPreloaded = useRef(false);

  useEffect(() => {
    // Only preload once to avoid duplicates
    if (hasPreloaded.current) return;

    const cleanup = () => {
      createdLinks.current.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
      createdLinks.current = [];
    };

    // Clear any existing preload links from previous renders
    cleanup();

    // Add preconnect for external domains first
    const externalDomains = new Set<string>();
    resources.forEach(resource => {
      try {
        const url = new URL(resource.href);
        if (url.origin !== window.location.origin) {
          externalDomains.add(url.origin);
        }
      } catch {
        // Ignore relative URLs
      }
    });

    // Add preconnect links for external domains
    externalDomains.forEach(domain => {
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = domain;
      preconnectLink.crossOrigin = 'anonymous';
      document.head.appendChild(preconnectLink);
      createdLinks.current.push(preconnectLink);
    });

    // Create link elements for each resource
    resources.forEach((resource, index) => {
      try {
        const link = document.createElement('link');

        // Use appropriate rel attribute based on resource type
        if (resource.as === 'image') {
          link.rel = 'preload'; // Use preload for critical images
        } else if (resource.as === 'style') {
          link.rel = 'preload'; // Preload stylesheets to avoid FOUC
        } else {
          link.rel = 'preload';
        }

        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) {
          link.type = resource.type;
        }

        if (resource.crossOrigin) {
          link.crossOrigin = resource.crossOrigin;
        }

        // Add fetchpriority for modern browsers
        if (resource.fetchPriority && 'fetchPriority' in HTMLLinkElement.prototype) {
          (link as any).fetchpriority = resource.fetchPriority;
        }

        // Add error handling
        link.onerror = () => {
          if (enableLogging) {
            console.warn(`Failed to preload resource: ${resource.href}`);
          }
        };

        link.onload = () => {
          if (enableLogging) {
            console.log(`Successfully preloaded: ${resource.href}`);
          }
        };

        // Store reference for cleanup
        createdLinks.current.push(link);

        // Append to head with a small delay to avoid blocking
        if (resource.fetchPriority === 'high' || index < 3) {
          // High priority resources load immediately
          document.head.appendChild(link);
        } else {
          // Lower priority resources load with a small delay
          setTimeout(() => {
            document.head.appendChild(link);
          }, 100 * index);
        }

      } catch (error) {
        if (enableLogging) {
          console.error(`Error creating preload link for ${resource.href}:`, error);
        }
      }
    });

    hasPreloaded.current = true;

    // Cleanup function to remove links when component unmounts
    return cleanup;
  }, [resources, enableLogging]);

  // This component doesn't render anything
  return null;
};

export default ResourcePreloader;
