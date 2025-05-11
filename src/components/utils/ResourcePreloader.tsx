import { useEffect } from 'react';

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
  useEffect(() => {
    // Create link elements for each resource
    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      
      if (resource.type) {
        link.type = resource.type;
      }
      
      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin;
      }
      
      // Append to head
      document.head.appendChild(link);
    });
    
    // Cleanup function to remove preload links when component unmounts
    return () => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach((link) => {
        document.head.removeChild(link);
      });
    };
  }, [resources]);
  
  // This component doesn't render anything
  return null;
};

export default ResourcePreloader;
