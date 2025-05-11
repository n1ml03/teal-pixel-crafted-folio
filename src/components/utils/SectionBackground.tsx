import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { optimizeForAnimation, cleanupAnimationOptimization } from '@/lib/scroll-optimization';

interface SectionBackgroundProps {
  sectionId: string;
  variant?: 'hero' | 'services' | 'projects' | 'experience' | 'certifications' | 'contact';
  children?: React.ReactNode;
}

/**
 * SectionBackground component that adds section-specific animated backgrounds
 * with scroll-linked effects for smoother scrolling experience
 */
const SectionBackground: React.FC<SectionBackgroundProps> = ({
  sectionId,
  variant = 'hero',
  children
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Use Framer Motion's scroll utilities for section-specific animations with optimized settings
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Create smooth spring-based scroll value with optimized settings for smoother scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,  // Reduced for smoother motion
    damping: 25,    // Increased for less oscillation
    restDelta: 0.001,
    mass: 0.5       // Lighter mass for more responsive movement
  });

  // Apply optimizations on mount
  useEffect(() => {
    if (sectionRef.current) {
      // Optimize elements that will animate
      const selector = `#${sectionId} .section-bg-element`;
      optimizeForAnimation(selector, ['transform', 'opacity']);

      return () => {
        // Clean up optimizations on unmount
        cleanupAnimationOptimization(selector);
      };
    }
  }, [sectionId]);

  // Transform scroll values for parallax effects with enhanced visibility
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.9, 1.05, 1.05, 0.9]);

  // Define background elements based on section variant
  const renderBackgroundElements = () => {
    switch (variant) {
      case 'hero':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-10 right-[10%] w-80 h-80 rounded-full bg-gradient-to-r from-teal-200/40 to-blue-300/40 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, -30])
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-10 left-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-200/30 to-teal-300/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [30, 0])
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, 20])
              }}
            />
          </>
        );

      case 'services':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-[20%] left-[5%] w-64 h-64 rounded-full bg-gradient-to-r from-lavender-200/30 to-lavender-300/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [20, -20])
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [-20, 20])
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[50%] right-[20%] w-56 h-56 rounded-full bg-gradient-to-r from-blue-300/20 to-teal-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, 30])
              }}
            />
          </>
        );

      case 'projects':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-[30%] right-[10%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-300/30 to-teal-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [30, -30])
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[20%] left-[15%] w-64 h-64 rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [-20, 20])
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[10%] left-[25%] w-48 h-48 rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, 30])
              }}
            />
          </>
        );

      case 'experience':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-[10%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-teal-300/30 to-blue-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, -40])
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[15%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-r from-lavender-200/30 to-purple-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [40, 0])
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] right-[20%] w-56 h-56 rounded-full bg-gradient-to-r from-blue-300/20 to-teal-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [20, -20])
              }}
            />
          </>
        );

      case 'certifications':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-[20%] right-[5%] w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/30 to-teal-300/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [20, -20])
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[10%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [-20, 20])
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[50%] left-[30%] w-48 h-48 rounded-full bg-gradient-to-r from-lavender-200/20 to-purple-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, 30])
              }}
            />
          </>
        );

      case 'contact':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-[15%] left-[15%] w-72 h-72 rounded-full bg-gradient-to-r from-teal-200/40 to-blue-300/40 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [30, -30])
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[10%] right-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-lavender-200/30 to-purple-300/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [-30, 30])
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] right-[25%] w-48 h-48 rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: useTransform(smoothProgress, [0, 1], [0, 20])
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div id={sectionId} ref={sectionRef} className="relative">
      {/* Section-specific background elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {renderBackgroundElements()}
      </div>

      {/* Section content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SectionBackground;
