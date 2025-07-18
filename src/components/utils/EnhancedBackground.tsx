import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/lib/performance-hooks';
import { useOptimizedScroll, useOptimizedSpring, useParallax } from '@/lib/motion';

interface EnhancedBackgroundProps {
  optimizeForLowPerformance?: boolean;
  reducedAnimations?: boolean;
}

// Simple static background for low-performance devices
const SimpleBackground: React.FC = () => (
  <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"></div>
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-200/20 via-blue-300/20 to-purple-200/20" />
    </div>
    <div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-300/30 blur-3xl" />
    <div className="absolute bottom-10 left-[5%] w-96 h-96 rounded-full bg-gradient-to-r from-purple-300/20 to-pink-200/20 blur-3xl" />
    <div className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-gradient-to-r from-yellow-200/10 to-orange-200/10 blur-3xl" />
  </div>
);

// Optimized animated blob component
const AnimatedBlob = React.memo(({
  className,
  motionValue,
  isReducedMotion = false
}: {
  className: string;
  motionValue: import('framer-motion').MotionValue<number>;
  isReducedMotion?: boolean;
}) => {
  if (isReducedMotion) {
    return <div className={className} />;
  }

  return (
    <motion.div
      className={className}
      style={{ y: motionValue, transform: 'translateZ(0)' }}
    />
  );
});

// Main component
const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  optimizeForLowPerformance = false,
  reducedAnimations = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // If low performance or mobile, use simple background
  const shouldUseSimple = optimizeForLowPerformance || isMobile || reducedAnimations;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (shouldUseSimple || !isVisible) {
    return <SimpleBackground />;
  }

  return <AnimatedBackground containerRef={containerRef} prefersReducedMotion={reducedAnimations} />;
};

// Optimized animated background component
const AnimatedBackground: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
  prefersReducedMotion?: boolean;
}> = ({ containerRef, prefersReducedMotion = false }) => {
  // Use optimized scroll hook with performance settings
  const { scrollYProgress } = useOptimizedScroll({
    target: containerRef,
    layoutEffect: false,
  });

  // Use optimized spring with better performance settings
  const smoothScrollY = useOptimizedSpring(scrollYProgress, {
    stiffness: 80,    // Reduced for smoother motion
    damping: 30,      // Increased for stability
    mass: 0.15,       // Lighter for better responsiveness
    restDelta: 0.001, // Smaller for precision
  });

  // Significantly reduced parallax for better performance
  const parallaxRange = prefersReducedMotion ? 0.05 : 0.1; // Halved the range
  const topBlobY = useParallax(smoothScrollY, 10 * parallaxRange, 'up');
  const bottomBlobY = useParallax(smoothScrollY, 15 * parallaxRange, 'down');
  const middleBlobY = useParallax(smoothScrollY, 6 * parallaxRange, 'down');

  const backgroundContent = useMemo(() => (
    <>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={`absolute inset-0 bg-gradient-to-r from-teal-200/20 via-blue-300/20 to-purple-200/20 ${
            prefersReducedMotion ? '' : 'animate-gradient-x'
          }`}
          style={{
            backgroundSize: '400% 400%',
            transform: 'translateZ(0)',
          }}
        ></div>
      </div>

      {/* Decorative elements with parallax */}
      <div className="absolute top-0 left-0 w-full h-full">
        <AnimatedBlob
          className="absolute top-10 right-[10%] w-64 md:w-96 h-64 md:h-96 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-300/30 blur-3xl"
          motionValue={topBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        <AnimatedBlob
          className="absolute bottom-10 left-[5%] w-64 md:w-[30rem] h-64 md:h-[30rem] rounded-full bg-gradient-to-r from-purple-300/20 to-pink-200/20 blur-3xl"
          motionValue={bottomBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        <AnimatedBlob
          className="absolute top-[40%] left-[30%] w-48 md:w-64 h-48 md:h-64 rounded-full bg-gradient-to-r from-yellow-200/10 to-orange-200/10 blur-3xl"
          motionValue={middleBlobY}
          isReducedMotion={prefersReducedMotion}
        />

        {/* Additional blob for desktop only */}
        <AnimatedBlob
          className="absolute bottom-[-10%] right-[20%] hidden md:block w-64 md:w-[28rem] h-64 md:h-[28rem] rounded-full bg-gradient-to-r from-blue-300/20 to-teal-200/20 blur-3xl"
          motionValue={bottomBlobY}
          isReducedMotion={prefersReducedMotion}
        />
      </div>
    </>
  ), [prefersReducedMotion, topBlobY, bottomBlobY, middleBlobY]);

  return (
    <div
      ref={containerRef}
      className="relative fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden"
      style={{ transform: 'translateZ(0)' }}
    >
      {backgroundContent}
    </div>
  );
};

export default EnhancedBackground;
