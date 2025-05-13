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
    
    // Critical images to preload for the Home page
    const criticalImages = [
      // Hero section images
      '/images/developer-portrait.jpg',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000',
      
      // Tech stack icons - most important ones
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    ];

    // Preload critical images in the background
    const preloadCriticalImages = async () => {
      try {
        // Use low priority to not block other resources
        await preloadImages(criticalImages);
        console.log('Critical home page images preloaded');
      } catch (error) {
        console.error('Failed to preload some images:', error);
      }
    };

    // Start preloading after a short delay to allow more critical resources to load first
    const timeoutId = setTimeout(() => {
      preloadCriticalImages();
      hasPreloaded.current = true;
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
};

export default HomeResourcePreloader;
