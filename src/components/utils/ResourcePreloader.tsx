import { useEffect, useRef } from 'react';

interface ResourcePreloaderProps {
  resources: {
    href: string;
    as: 'image' | 'style' | 'script' | 'font';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }[];
}

/**
 * ResourcePreloader component that preloads critical resources
 * to improve performance
 */
export const ResourcePreloader = ({ resources }: ResourcePreloaderProps) => {
  // Use a ref to track created elements for cleanup
  const createdLinks = useRef<HTMLLinkElement[]>([]);

  useEffect(() => {
    // Clear any existing preload links from previous renders
    createdLinks.current.forEach(link => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    });
    createdLinks.current = [];

    // Create link elements for each resource
    resources.forEach((resource) => {
      // For images, use prefetch instead of preload to avoid warnings
      const link = document.createElement('link');

      // Use appropriate rel attribute based on resource type
      if (resource.as === 'image') {
        link.rel = 'prefetch';
      } else if (resource.as === 'style') {
        link.rel = 'stylesheet';
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

      // For stylesheets, ensure they're applied immediately
      if (resource.as === 'style') {
        link.onload = () => {
          console.log(`Stylesheet loaded: ${resource.href}`);
        };
      }

      // Store reference for cleanup
      createdLinks.current.push(link);

      // Append to head
      document.head.appendChild(link);
    });

    // Cleanup function to remove links when component unmounts
    return () => {
      createdLinks.current.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [resources]);

  // This component doesn't render anything
  return null;
};

export default ResourcePreloader;
