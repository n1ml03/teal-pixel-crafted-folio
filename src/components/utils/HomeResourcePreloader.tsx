import { useEffect, useRef } from 'react';
import { resourceManager } from '@/lib/resource-manager';

/**
 * @deprecated Critical resources are now handled by ResourceManager in main.tsx
 * HomeResourcePreloader component that preloads critical resources
 * specifically for the Home page to improve initial load performance
 */
export const HomeResourcePreloader = () => {
  const hasPreloaded = useRef(false);

  useEffect(() => {
    // Only preload once
    if (hasPreloaded.current) return;

    // Additional secondary images for Home page only
    const secondaryResources = [
      // Secondary images (non-LCP)
      {
        href: '/images/coding-preview.webp',
        as: 'image' as const,
        type: 'image/webp',
        fetchpriority: 'low' as const
      },
      {
        href: '/images/testing-preview.webp',
        as: 'image' as const,
        type: 'image/webp',
        fetchpriority: 'low' as const
      },
      // Tech stack icons
      {
        href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        as: 'image' as const,
        fetchpriority: 'low' as const
      },
      {
        href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        as: 'image' as const,
        fetchpriority: 'low' as const
      },
      {
        href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        as: 'image' as const,
        fetchpriority: 'low' as const
      }
    ];

    // Preconnect to CDN
    resourceManager.preconnect('https://cdn.jsdelivr.net');

    // Preload secondary resources with delay
    const timeoutId = setTimeout(() => {
      resourceManager.preloadMany(secondaryResources);
      hasPreloaded.current = true;
    }, 2000); // Delay to not interfere with critical resources

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
};

export default HomeResourcePreloader;
