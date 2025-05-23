import { useEffect, useRef } from 'react';
import { preloadImages } from '@/lib/image-optimization';

/**
 * HomeResourcePreloader component that preloads critical resources
 * specifically for the Home page to improve initial load performance
 */
export const HomeResourcePreloader = () => {
  const hasPreloaded = useRef(false);

  useEffect(() => {
    // Only preload once
    if (hasPreloaded.current) return;

    // Add preconnect for external domains to speed up subsequent requests
    const addPreconnect = (url: string, crossOrigin: boolean = true) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      if (crossOrigin) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    };

    // Preconnect to external domains
    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com');
    addPreconnect('https://cdn.jsdelivr.net');

    // Critical images to preload for the Home page - prioritize LCP images first
    const lcpImages = [
      // Hero section images - highest priority for LCP
      '/images/developer-portrait.webp',
      '/images/coding-preview.webp',
      '/images/testing-preview.webp',
    ];

    // Secondary important images
    const secondaryImages = [
      // Tech stack icons - most important ones
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    ];

    // Preload LCP images immediately with high priority
    const preloadLCPImages = async () => {
      try {
        // Create preload links for LCP images
        lcpImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.fetchpriority = 'high'; // lowercase for DOM attributes
          if (src.endsWith('.webp')) {
            link.type = 'image/webp';
          }
          document.head.appendChild(link);
        });

        // Also use the Image API to ensure images are in cache
        await preloadImages(lcpImages);
        console.log('LCP images preloaded');
      } catch (error) {
        console.error('Failed to preload some LCP images:', error);
      }
    };

    // Preload secondary images after a delay
    const preloadSecondaryImages = async () => {
      try {
        await preloadImages(secondaryImages);
        console.log('Secondary images preloaded');
      } catch (error) {
        console.error('Failed to preload some secondary images:', error);
      }
    };

    // Start preloading LCP images immediately
    preloadLCPImages();

    // Start preloading secondary images after a delay
    const timeoutId = setTimeout(() => {
      preloadSecondaryImages();
      hasPreloaded.current = true;
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
};

export default HomeResourcePreloader;
