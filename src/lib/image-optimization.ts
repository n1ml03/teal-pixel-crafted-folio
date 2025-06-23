/**
 * Utilities for optimizing image loading and rendering
 */
import { useEffect, useState, useRef } from 'react';
import { resourceManager } from './resource-manager';

/**
 * Interface for optimized image sources
 */
export interface OptimizedImageSources {
  src: string;
  srcset?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  sizes?: string;
}

/**
 * Preloads an image to ensure it's in the browser cache
 * @param src The image source URL
 * @returns A promise that resolves when the image is loaded
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preloads multiple images in parallel
 * @param sources Array of image source URLs
 * @returns A promise that resolves when all images are loaded
 */
export function preloadImages(sources: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(sources.map(preloadImage));
}

/**
 * Custom hook for lazy loading images
 * @param src The image source URL
 * @param options Configuration options
 * @returns Object with image state and ref to attach to the image element
 */
export function useLazyImage(
  src: string,
  options: {
    rootMargin?: string;
    threshold?: number;
    placeholder?: string;
    srcset?: string;
    sizes?: string;
  } = {}
): {
  loaded: boolean;
  error: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
  currentSrc: string;
} {
  const {
    rootMargin = '200px',
    threshold = 0.1,
    placeholder = '',
    srcset = '',
    sizes = ''
  } = options;

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    // Reset state when src changes
    if (src !== imageElement.dataset.src) {
      setLoaded(false);
      setError(false);
      setCurrentSrc(placeholder || src);
    }

    // Store original src and srcset in data attributes
    imageElement.dataset.src = src;
    if (srcset) imageElement.dataset.srcset = srcset;
    if (sizes) imageElement.dataset.sizes = sizes;

    // Function to load the image
    const loadImage = () => {
      if (!imageElement) return;

      // Set src and srcset
      imageElement.src = src;
      if (srcset) imageElement.srcset = srcset;
      if (sizes) imageElement.sizes = sizes;

      // Handle load and error events
      const handleLoad = () => {
        setLoaded(true);
        setCurrentSrc(imageElement.currentSrc || src);
      };

      const handleError = () => {
        setError(true);
        setCurrentSrc(placeholder || '');
        console.error(`Failed to load image: ${src}`);
      };

      imageElement.addEventListener('load', handleLoad);
      imageElement.addEventListener('error', handleError);

      return () => {
        imageElement.removeEventListener('load', handleLoad);
        imageElement.removeEventListener('error', handleError);
      };
    };

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadImage();
          // Disconnect after loading
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        }
      },
      { rootMargin, threshold }
    );

    // Start observing
    observerRef.current.observe(imageElement);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [src, srcset, sizes, placeholder, rootMargin, threshold]);

  return { loaded, error, imageRef, currentSrc };
}

/**
 * Checks if an image exists and is accessible
 * @param src The image source URL
 * @returns A promise that resolves to true if the image exists, false otherwise
 */
export function checkImageExists(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/**
 * Gets the dimensions of an image
 * @param src The image source URL
 * @returns A promise that resolves to the image dimensions
 */
export function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // If src is empty or invalid, return default dimensions
    if (!src || typeof src !== 'string' || src.trim() === '') {
      console.warn('Invalid image source provided to getImageDimensions');
      resolve({ width: 300, height: 200 }); // Default dimensions
      return;
    }

    const img = new Image();

    // Set a timeout to prevent hanging on slow-loading images
    const timeout = setTimeout(() => {
      console.warn(`Image load timed out for: ${src}`);
      resolve({ width: 300, height: 200 }); // Default dimensions
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      // Ensure we have valid dimensions
      const width = img.width || 300;
      const height = img.height || 200;
      resolve({ width, height });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      console.warn(`Failed to load image for dimensions: ${src}`);
      resolve({ width: 300, height: 200 }); // Default dimensions instead of rejecting
    };

    // Set crossOrigin to anonymous for CORS-enabled images
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

/**
 * Generate responsive image sources for different screen sizes
 * @param src Base image URL
 * @param options Configuration options
 * @returns Optimized image sources
 */
export function getResponsiveImageSources(
  src: string,
  options: {
    widths?: number[];
    format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'original';
    quality?: number;
    placeholder?: boolean;
  } = {}
): OptimizedImageSources {
  const {
    widths = [640, 750, 828, 1080, 1200, 1920],
    format = 'original',
    quality = 80,
    placeholder = true
  } = options;

  // If src is already a data URL or SVG, return as is
  if (src.startsWith('data:') || src.endsWith('.svg')) {
    return { src };
  }

  // Parse the URL to extract path and extension
  const url = new URL(src, window.location.origin);
  const pathname = url.pathname;
  const extension = pathname.split('.').pop() || '';

  // Generate srcset based on widths
  const srcset = widths
    .map(width => {
      // For external URLs, we can't modify them
      if (src.startsWith('http') && !src.includes(window.location.hostname)) {
        return `${src} ${width}w`;
      }

      // For local images, add width and format parameters
      const optimizedSrc = format === 'original'
        ? `${pathname}?w=${width}&q=${quality}`
        : `${pathname.replace(`.${extension}`, '')}.${format}?w=${width}&q=${quality}`;

      return `${optimizedSrc} ${width}w`;
    })
    .join(', ');

  // Generate a tiny placeholder for blur-up effect
  let placeholderSrc = '';
  if (placeholder) {
    placeholderSrc = format === 'original'
      ? `${pathname}?w=20&q=30`
      : `${pathname.replace(`.${extension}`, '')}.${format}?w=20&q=30`;
  }

  return {
    src,
    srcset,
    placeholder: placeholderSrc,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  };
}

/**
 * Optimizes image loading by setting appropriate loading attribute
 * @param priority Whether the image is high priority
 * @param isVisible Whether the image is in the viewport
 * @returns The appropriate loading attribute
 */
export function getImageLoadingAttribute(
  priority: boolean,
  isVisible: boolean
): 'eager' | 'lazy' {
  if (priority || isVisible) {
    return 'eager';
  }
  return 'lazy';
}

/**
 * Generates a responsive image srcset
 * @param src The base image source URL
 * @param widths Array of widths to generate srcset for
 * @returns A srcset string
 */
export function generateSrcSet(src: string, widths: number[]): string {
  // This is a simplified implementation
  // In a real-world scenario, you would generate different sized images
  return widths.map(width => `${src} ${width}w`).join(', ');
}

/**
 * Determines if WebP format is supported by the browser
 * @returns A promise that resolves to true if WebP is supported
 */
export async function supportsWebP(): Promise<boolean> {
  if (!window.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());

  return createImageBitmap(blob).then(() => true, () => false);
}

/**
 * @deprecated Use resourceManager.preloadMany() from resource-manager.ts instead
 * Preload critical images to improve LCP
 * @param urls Array of image URLs to preload
 */
export function preloadCriticalImages(urls: string[]): void {
  console.warn('preloadCriticalImages is deprecated. Use resourceManager from resource-manager.ts instead.');
  
  if (typeof window === 'undefined') return;

  const resources = urls.map((url, index) => ({
    href: url,
    as: 'image' as const,
    fetchPriority: index === 0 ? 'high' as const : 'auto' as const,
    type: url.endsWith('.webp') ? 'image/webp' : undefined
  }));
  
  resourceManager.preloadMany(resources);
}

/**
 * Check if an image is cached by the browser
 * @param src Image URL
 * @returns Promise that resolves to true if the image is cached
 */
export async function isImageCached(src: string): Promise<boolean> {
  try {
    const response = await fetch(src, { method: 'HEAD', cache: 'force-cache' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get the dominant color from an image for use as a placeholder
 * This is a simplified version - in production you would use a server-side solution
 * @param src Image URL
 * @returns Promise that resolves to a CSS color string
 */
export async function getDominantColor(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#f0f0f0'); // Fallback color
        return;
      }
      ctx.drawImage(img, 0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    img.onerror = () => resolve('#f0f0f0'); // Fallback color
    img.src = src;
  });
}
