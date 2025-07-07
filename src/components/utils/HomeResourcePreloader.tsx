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

    // Additional secondary resources for Home page only
    // Note: Main critical resources are now handled by ResourceManager in main.tsx
    const secondaryResources = [
      // Additional tech stack icons not in critical resources
      {
        href: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
        as: 'image' as const,
        fetchPriority: 'low' as const
      },
      {
        href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg',
        as: 'image' as const,
        fetchPriority: 'low' as const
      },
      {
        href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg',
        as: 'image' as const,
        fetchPriority: 'low' as const
      }
    ];

    // Preconnect to CDN
    resourceManager.preconnect('https://cdn.jsdelivr.net');

    // Preload secondary resources with delay
    const timeoutId = setTimeout(() => {
      if (secondaryResources.length > 0) {
        resourceManager.preloadMany(secondaryResources);
      }
      hasPreloaded.current = true;
    }, 3000); // Increased delay to ensure critical resources load first

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
};

export default HomeResourcePreloader;
