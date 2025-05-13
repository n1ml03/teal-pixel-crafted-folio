import React, { useState, useEffect, useRef } from 'react';
import { getImageLoadingAttribute } from '@/lib/image-optimization';
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
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  // Determine loading attribute based on priority and visibility
  const loadingAttribute = getImageLoadingAttribute(priority, isVisible);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
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
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
