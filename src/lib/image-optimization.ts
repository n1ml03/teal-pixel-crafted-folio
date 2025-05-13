/**
 * Utility functions for optimizing image loading and performance
 */

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
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Generates a placeholder color for an image
 * @param src The image source URL
 * @returns A promise that resolves to a CSS color string
 */
export async function generatePlaceholderColor(src: string): Promise<string> {
  // Default placeholder color if we can't generate one
  return '#f3f4f6';
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
