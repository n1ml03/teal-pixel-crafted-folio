import React, { useState, useEffect } from 'react';
import { useLazyImage, getResponsiveImageSources, OptimizedImageSources } from '@/lib/image-optimization';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  wrapperClassName?: string;
  priority?: boolean;
  optimizeResponsive?: boolean;
  blurEffect?: boolean;
  loadingStrategy?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  webpSrc?: string;
  isLCP?: boolean;
  // This will be applied as lowercase 'fetchpriority' in the DOM
  fetchPriority?: 'high' | 'low' | 'auto';
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * OptimizedImage component for enhanced image loading
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Responsive image optimization with srcset
 * - Blur-up loading effect
 * - Fallback for image loading errors
 * - WebP format support
 * - LCP (Largest Contentful Paint) optimization
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderClassName = '',
  wrapperClassName = '',
  priority = false,
  optimizeResponsive = true,
  blurEffect = true,
  loadingStrategy = 'lazy',
  onLoad,
  onError,
  fallbackSrc,
  webpSrc,
  isLCP = false,
  fetchPriority = 'auto',
  aspectRatio,
  objectFit = 'cover',
  ...props
}) => {
  // Get optimized image sources if responsive optimization is enabled
  const [imageSources, setImageSources] = useState<OptimizedImageSources>({ src });
  const [dominantColor, setDominantColor] = useState<string>('#f0f0f0');

  // Use the webpSrc if provided, otherwise use the original src
  const finalSrc = webpSrc || src;

  // Use the fallbackSrc if provided for error cases
  const errorFallbackSrc = fallbackSrc || src;

  // Set up lazy loading with IntersectionObserver
  const {
    loaded,
    error,
    imageRef,
    currentSrc
  } = useLazyImage(finalSrc, {
    rootMargin: '200px',
    placeholder: imageSources.placeholder,
    srcset: imageSources.srcset,
    sizes: imageSources.sizes,
    fallbackSrc: errorFallbackSrc
  });

  // Generate optimized image sources on mount or when src changes
  useEffect(() => {
    if (optimizeResponsive) {
      const sources = getResponsiveImageSources(finalSrc, {
        widths: [640, 750, 828, 1080, 1200, 1920],
        format: 'original',
        quality: 80,
        placeholder: blurEffect
      });
      setImageSources(sources);
    } else {
      setImageSources({ src: finalSrc });
    }
  }, [finalSrc, optimizeResponsive, blurEffect]);

  // Handle custom load and error callbacks
  useEffect(() => {
    if (loaded && onLoad) {
      onLoad();
    }
    if (error && onError) {
      onError();
    }
  }, [loaded, error, onLoad, onError]);

  // Determine loading attribute based on priority and isLCP
  const loadingAttr = priority || isLCP ? 'eager' : loadingStrategy;

  // Determine fetchPriority based on isLCP
  const finalFetchPriority = isLCP ? 'high' : fetchPriority;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        wrapperClassName
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        backgroundColor: dominantColor,
        aspectRatio: aspectRatio,
        contain: 'paint layout' // Add CSS containment for better performance
      }}
    >
      {/* Placeholder with blur effect */}
      {blurEffect && imageSources.placeholder && !loaded && !error && (
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500',
            placeholderClassName
          )}
          style={{
            backgroundImage: `url(${imageSources.placeholder})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)', // Slightly larger to prevent blur edges
            opacity: loaded ? 0 : 0.5,
            contain: 'paint' // Add CSS containment for better performance
          }}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      <img
        ref={imageRef}
        alt={alt}
        className={cn(
          'transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          error ? 'hidden' : 'block',
          className
        )}
        width={width}
        height={height}
        loading={loadingAttr}
        decoding="async"
        fetchpriority={finalFetchPriority}
        style={{
          objectFit,
          objectPosition: 'center',
          width: '100%',
          height: '100%',
          contain: 'paint' // Add CSS containment for better performance
        }}
        {...props}
      />

      {/* Error fallback */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '200px'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="sr-only">Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
