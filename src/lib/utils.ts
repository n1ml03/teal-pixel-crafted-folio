import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mobile-specific class name utilities for better performance
 */
export const mobileClassNames = {
  // Touch-friendly target sizes
  touchTarget: "min-h-[48px] min-w-[48px] touch-manipulation",
  
  // Performance optimizations
  performanceOptimized: "transform-gpu will-change-auto",
  
  // Mobile-specific animations
  mobileAnimation: "transition-all duration-200 ease-out",
  
  // Typography optimizations
  mobileText: "text-rendering-optimizelegibility antialiased",
  
  // Layout optimizations
  mobileContainer: "contain-layout-style-paint",
  
  // Responsive image classes
  mobileImage: "image-rendering-optimizeQuality will-change-transform",
  
  // Button optimizations
  mobileButton: "transform-translate-z-0 touch-manipulation",
  
  // Grid optimizations
  mobileGrid: "grid webkit-overflow-scrolling-touch",
} as const;

/**
 * Get mobile-optimized class names based on device type
 */
export function getMobileClasses(
  isMobile: boolean,
  isSmallMobile: boolean = false,
  isTinyMobile: boolean = false
) {
  if (!isMobile) return "";
  
  let classes = mobileClassNames.performanceOptimized + " " + mobileClassNames.mobileAnimation;
  
  if (isTinyMobile) {
    classes += " px-3";
  } else if (isSmallMobile) {
    classes += " px-4";
  } else {
    classes += " px-4";
  }
  
  return classes;
}

/**
 * Get responsive spacing classes
 */
export function getResponsiveSpacing(
  mobile: string,
  tablet: string = "",
  desktop: string = ""
) {
  return cn(
    mobile,
    tablet && `md:${tablet}`,
    desktop && `lg:${desktop}`
  );
}

/**
 * Get responsive text size classes
 */
export function getResponsiveTextSize(
  isTinyMobile: boolean,
  isSmallMobile: boolean,
  base: string = "text-base"
) {
  if (isTinyMobile) {
    return "text-sm";
  } else if (isSmallMobile) {
    return "text-base";
  }
  return base;
}

/**
 * Get optimized image sizes for different screen sizes
 */
export function getOptimizedImageSizes(
  isTinyMobile: boolean,
  isSmallMobile: boolean,
  isMobile: boolean
) {
  if (isTinyMobile) {
    return "256px";
  } else if (isSmallMobile) {
    return "288px";
  } else if (isMobile) {
    return "320px";
  }
  return "(max-width: 640px) 320px, (max-width: 768px) 384px, 448px";
}

/**
 * Check if device supports advanced features
 */
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      supportsWebP: false,
      supportsModernCSS: false,
      isHighPerformance: false,
      supportsTouch: false
    };
  }
  
  const canvas = document.createElement('canvas');
  const webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  const supportsCSS = CSS?.supports?.('backdrop-filter', 'blur(10px)') || false;
  
  const isHighPerformance = 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) &&
    (('deviceMemory' in navigator) ? 
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory! >= 4 : 
      true);
  
  const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    supportsWebP: webpSupport,
    supportsModernCSS: supportsCSS,
    isHighPerformance,
    supportsTouch
  };
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get scroll direction
 */
export function getScrollDirection(lastScrollY: number, currentScrollY: number): 'up' | 'down' | 'none' {
  if (currentScrollY > lastScrollY) return 'down';
  if (currentScrollY < lastScrollY) return 'up';
  return 'none';
}
