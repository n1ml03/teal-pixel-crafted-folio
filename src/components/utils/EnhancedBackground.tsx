import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { throttle } from '@/lib/scroll-optimization';

interface EnhancedBackgroundProps {
  optimizeForLowPerformance?: boolean;
  reducedAnimations?: boolean;
}

// Simple static background for low-performance devices
const SimpleBackground: React.FC = () => {
  // Use CSS containment for better performance
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden"
      style={{ contain: 'content' }}
    >
      {/* Simplified background gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"></div>

      {/* Static gradient overlay with reduced opacity for better performance */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-r from-teal-200/20 via-blue-300/20 to-purple-200/20"
          style={{ backgroundSize: '400% 400%' }}
        ></div>
      </div>

      {/* Minimal decorative elements - static for performance with responsive sizing */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Reduced blur radius for better performance */}
        <div className="absolute top-10 right-[10%] w-64 md:w-96 h-64 md:h-96 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-300/30 blur-2xl md:blur-3xl" />
        <div className="absolute bottom-10 left-[5%] w-64 md:w-[30rem] h-64 md:h-[30rem] rounded-full bg-gradient-to-r from-purple-300/20 to-pink-200/20 blur-2xl md:blur-3xl" />
        <div className="absolute top-[40%] left-[30%] w-48 md:w-64 h-48 md:h-64 rounded-full bg-gradient-to-r from-yellow-200/10 to-orange-200/10 blur-2xl md:blur-3xl" />
      </div>
    </div>
  );
};

// Optimized animated blob component with memoization to avoid unnecessary re-renders
const AnimatedBlob = React.memo(({
  className,
  motionValue,
  willChange = 'transform',
  isReducedMotion = false
}: {
  className: string;
  motionValue: any;
  willChange?: string;
  isReducedMotion?: boolean;
}) => {
  // Don't apply motion values if reduced motion is enabled
  if (isReducedMotion) {
    return <div className={className} style={{ contain: 'paint layout' }} />;
  }

  return (
    <motion.div
      className={`${className} will-animate`}
      style={{
        y: motionValue,
        willChange,
        transform: 'translateZ(0)', // Force GPU acceleration
        contain: 'paint layout' // Add CSS containment for better performance
      }}
    />
  );
});

// Optimized animated floating element component with memoization
const FloatingElement = React.memo(({
  className,
  motionValue,
  animationProps,
  isReducedMotion = false
}: {
  className: string;
  motionValue: any;
  animationProps: any;
  isReducedMotion?: boolean;
}) => {
  // Don't apply animations if reduced motion is enabled
  if (isReducedMotion) {
    return <div className={className} style={{ contain: 'paint layout' }} />;
  }

  return (
    <motion.div
      className={`${className} will-animate`}
      style={{
        willChange: 'transform',
        y: motionValue,
        transform: 'translateZ(0)', // Force GPU acceleration
        contain: 'paint layout' // Add CSS containment for better performance
      }}
      animate={animationProps.animate}
      transition={animationProps.transition}
    />
  );
});

// Main component
const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  optimizeForLowPerformance = false,
  reducedAnimations = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(optimizeForLowPerformance);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Enhanced device performance detection with more accurate metrics
  const detectPerformance = useCallback(() => {
    // If explicitly set to optimize, respect that setting
    if (optimizeForLowPerformance) return true;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches || reducedAnimations);

    // Check if navigator.deviceMemory is available (Chrome, Edge, Opera)
    const lowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;

    // Check processor cores if available
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    // More comprehensive mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check for battery status if available
    let isBatteryLow = false;
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        isBatteryLow = battery.level < 0.2 && !battery.charging;
        // Update if battery is critically low
        if (isBatteryLow && !isLowPerformanceDevice) {
          setIsLowPerformanceDevice(true);
        }
      }).catch(() => {
        // Ignore errors with battery API
      });
    }

    // Set as low performance if any of these conditions are true
    return lowMemory || lowCores || isMobile || isBatteryLow;
  }, [optimizeForLowPerformance, reducedAnimations, isLowPerformanceDevice]);

  // Detect device performance on component mount
  useEffect(() => {
    setIsLowPerformanceDevice(detectPerformance());

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches || reducedAnimations);
    };

    mediaQuery.addEventListener('change', handleMotionPreferenceChange);

    // Mark as visible after a short delay to allow the page to load critical content first
    // Use a longer delay for low-performance devices
    const visibilityDelay = isLowPerformanceDevice ? 300 : 100;
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, visibilityDelay);

    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      // Execute any cleanup function stored in the ref
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [detectPerformance, isLowPerformanceDevice, reducedAnimations]);

  // Apply optimizations on mount with improved performance management
  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    // Mark elements that will animate for browser optimization
    const elements = containerRef.current.querySelectorAll('.will-animate');
    let animationFrameId: number;

    // Function to apply will-change property
    const applyWillChange = () => {
      elements?.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.willChange = 'transform, opacity';
        }
      });
    };

    // Function to remove will-change property
    const removeWillChange = () => {
      elements?.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.willChange = 'auto';
        }
      });
    };

    // Use requestAnimationFrame to apply will-change property at the right time
    animationFrameId = requestAnimationFrame(applyWillChange);

    // Set up intersection observer to optimize off-screen elements
    const observer = new IntersectionObserver(
      (entries) => {
        // If the background is not visible in the viewport, remove will-change
        if (!entries[0].isIntersecting) {
          removeWillChange();
        } else {
          // Re-apply will-change when visible again
          requestAnimationFrame(applyWillChange);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Store cleanup function in ref for access in component unmount
    cleanupRef.current = () => {
      cancelAnimationFrame(animationFrameId);
      removeWillChange();
      observer.disconnect();
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isVisible]);

  // Memoize the background to prevent unnecessary re-renders
  const memoizedBackground = useMemo(() => {
    if (isLowPerformanceDevice || !isVisible) {
      return <SimpleBackground />;
    }
    return <AnimatedBackground
      containerRef={containerRef}
      prefersReducedMotion={prefersReducedMotion}
    />;
  }, [isLowPerformanceDevice, isVisible, prefersReducedMotion]);

  // Return the memoized background to prevent unnecessary re-renders
  return memoizedBackground;
};

// Separate component for the animated background to avoid conditional hook calls
const AnimatedBackground: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
  prefersReducedMotion?: boolean;
}> = ({
  containerRef,
  prefersReducedMotion = false
}) => {
  // Use Framer Motion's scroll utilities for smoother animations
  const { scrollY: scrollYProgress } = useScroll();

  // Create smooth spring-based scroll value with optimized settings
  // Use lighter spring settings for better performance
  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 100 : 80, // Stiffer for reduced motion
    damping: prefersReducedMotion ? 30 : 25,    // More damping for reduced motion
    restDelta: 0.001,
    mass: 0.5
  });

  // Transform scroll values to usable ranges for parallax effects
  // Use smaller ranges for reduced motion preference
  const parallaxRange = prefersReducedMotion ? 0.3 : 1; // Reduce parallax effect by 70% if reduced motion

  // Create transform values directly - no nesting hooks inside useMemo
  const topBlobY = useTransform(smoothScrollY, [0, 1], [0, -50 * parallaxRange]);
  const middleBlobY = useTransform(smoothScrollY, [0, 1], [0, 25 * parallaxRange]);
  const bottomBlobY = useTransform(smoothScrollY, [0, 1], [0, 75 * parallaxRange]);

  // Additional transform values for floating elements
  const topElementY = useTransform(smoothScrollY, [0, 0.5], [0, -15 * parallaxRange]);
  const middleElementY = useTransform(smoothScrollY, [0.3, 0.6], [0, 20 * parallaxRange]);
  const bottomElementY = useTransform(smoothScrollY, [0.5, 1], [0, 25 * parallaxRange]);
  const gridPatternY = useTransform(smoothScrollY, [0, 1], [0, 15 * parallaxRange]);

  // Use React.memo to prevent unnecessary re-renders of static elements
  const StaticGradientBase = React.memo(() => (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"></div>
  ));

  // Use React.memo for the animated gradient overlay
  const AnimatedGradientOverlay = React.memo(() => (
    <div className="absolute inset-0 opacity-30">
      <div
        className={`absolute inset-0 bg-gradient-to-r from-teal-200/20 via-blue-300/20 to-purple-200/20 ${prefersReducedMotion ? '' : 'animate-gradient-x'}`}
        style={{
          backgroundSize: '400% 400%',
          willChange: prefersReducedMotion ? 'auto' : 'background-position',
          transform: 'translateZ(0)', // Force GPU acceleration
          contain: 'paint' // Add CSS containment for better performance
        }}
      ></div>
    </div>
  ));

  // Memoize the entire background content to prevent unnecessary re-renders
  const backgroundContent = useMemo(() => (
    <>
      {/* Background gradient base with more vibrant colors */}
      <StaticGradientBase />

      {/* Animated gradient overlay with hardware acceleration */}
      <AnimatedGradientOverlay />

      {/* Decorative geometric elements with parallax effect */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ contain: 'paint layout' }} // Add CSS containment for better performance
      >
        {/* Abstract shapes - circles with blur and parallax effect - responsive sizing */}
        <AnimatedBlob
          className="absolute top-10 right-[10%] w-64 md:w-96 h-64 md:h-96 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-300/30 blur-2xl md:blur-3xl"
          motionValue={topBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        <AnimatedBlob
          className="absolute bottom-10 left-[5%] w-64 md:w-[30rem] h-64 md:h-[30rem] rounded-full bg-gradient-to-r from-purple-300/20 to-pink-200/20 blur-2xl md:blur-3xl"
          motionValue={bottomBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        <AnimatedBlob
          className="absolute top-[40%] left-[30%] w-48 md:w-64 h-48 md:h-64 rounded-full bg-gradient-to-r from-yellow-200/10 to-orange-200/10 blur-2xl md:blur-3xl"
          motionValue={middleBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        {/* Reduce the number of blobs on mobile for better performance */}
        <AnimatedBlob
          className="absolute bottom-[-10%] right-[20%] hidden md:block w-64 md:w-[28rem] h-64 md:h-[28rem] rounded-full bg-gradient-to-r from-blue-300/20 to-teal-200/20 blur-2xl md:blur-3xl"
          motionValue={bottomBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        {/* Grid pattern overlay with subtle parallax - only show on larger screens */}
        <motion.div
          className="absolute inset-0 opacity-[0.02] will-animate hidden md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            y: gridPatternY,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
            contain: 'paint' // Add CSS containment for better performance
          }}
        />
      </div>

      {/* Enhanced animated floating elements - reduced for better performance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ contain: 'paint layout' }} // Add CSS containment for better performance
      >
        {/* Top section elements - reduced number and only show on larger screens */}
        <FloatingElement
          className="absolute top-[15%] right-[20%] w-16 md:w-20 h-16 md:h-20 rounded-xl bg-gradient-to-tr from-teal-400/20 to-teal-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          motionValue={topElementY}
          isReducedMotion={prefersReducedMotion}
          animationProps={{
            animate: {
              y: [0, -10, 0],
              rotate: [0, 8, 0],
              scale: [1, 1.03, 1]
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />

        {/* Middle section elements - reduced number */}
        <FloatingElement
          className="absolute top-[40%] left-[10%] hidden md:block w-36 h-14 rounded-full bg-gradient-to-r from-gray-300/20 to-gray-100/30 backdrop-blur-sm border border-white/30 shadow-lg"
          motionValue={middleElementY}
          isReducedMotion={prefersReducedMotion}
          animationProps={{
            animate: {
              y: [0, 8, 0],
              rotate: [0, 2, 0],
              scale: [1, 1.01, 1]
            },
            transition: {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        />

        {/* Bottom section elements - reduced number */}
        <FloatingElement
          className="absolute bottom-[20%] left-[15%] w-20 md:w-28 h-20 md:h-28 rounded-full bg-gradient-to-tr from-blue-400/20 to-blue-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          motionValue={bottomElementY}
          isReducedMotion={prefersReducedMotion}
          animationProps={{
            animate: {
              y: [0, 10, 0],
              rotate: [0, -3, 0],
              scale: [1, 1.02, 1]
            },
            transition: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        />
      </div>
    </>
  ), [
    // These are now MotionValues which are stable references, so we don't need to include them in deps
    // but we do need to include prefersReducedMotion which affects the component rendering
    prefersReducedMotion
  ]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden"
      style={{
        willChange: prefersReducedMotion ? 'auto' : 'transform',
        transform: 'translateZ(0)', // Force GPU acceleration
        contain: 'paint layout' // Add CSS containment for better performance
      }}
    >
      {backgroundContent}
    </div>
  );
};

export default EnhancedBackground;
