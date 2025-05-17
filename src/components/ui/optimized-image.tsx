import React, { useState, useEffect, useRef } from 'react';
import { getImageLoadingAttribute, getImageDimensions } from '@/lib/image-optimization';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  onLoadingComplete?: () => void;
  className?: string;
  containerClassName?: string;
  showLoadingIndicator?: boolean;
  aspectRatio?: string | number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * OptimizedImage component that provides better image loading performance
 * with fallback, loading states, and optimization
 */
export const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = "https://placehold.co/600x400?text=Image+Not+Found",
  priority = false,
  onLoadingComplete,
  className = "",
  containerClassName = "",
  showLoadingIndicator = true,
  aspectRatio = "16/9", // Default aspect ratio
  objectFit = "cover",
  width,
  height,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{width?: number, height?: number}>({});
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before image comes into view
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
    onLoadingComplete?.();
  };

  // Handle image error
  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
    setIsError(true);

    // If there's a fallback, we'll try to load that instead
    if (fallbackSrc && imgRef.current) {
      imgRef.current.src = fallbackSrc;
    }
  };

  // Fetch image dimensions if not provided
  useEffect(() => {
    // Only fetch dimensions if width or height is not provided
    if ((!width || !height) && src && priority) {
      getImageDimensions(src)
        .then(dimensions => {
          setImageDimensions(dimensions);
        })
        .catch(() => {
          // If we can't get dimensions, we'll use the fallback aspect ratio
          console.warn(`Could not get dimensions for image: ${src}`);
        });
    }
  }, [src, width, height, priority]);

  // Determine loading attribute based on priority and visibility
  const loadingAttribute = getImageLoadingAttribute(priority, isVisible);

  // Calculate aspect ratio style
  const aspectRatioStyle = typeof aspectRatio === 'string'
    ? { aspectRatio }
    : { aspectRatio: `${aspectRatio}` };

  // Determine width and height attributes for the image
  const dimensionProps: {width?: number | string, height?: number | string} = {};

  if (width) dimensionProps.width = width;
  else if (imageDimensions.width) dimensionProps.width = imageDimensions.width;

  if (height) dimensionProps.height = height;
  else if (imageDimensions.height) dimensionProps.height = imageDimensions.height;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
      style={{
        ...aspectRatioStyle,
        contain: 'layout paint',
      }}
    >
      {/* Loading indicator */}
      {showLoadingIndicator && !isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* The actual image */}
      <img
        ref={imgRef}
        src={isVisible ? src : ''}
        alt={alt}
        loading={loadingAttribute}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300 w-full h-full",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        style={{ objectFit }}
        {...dimensionProps}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
