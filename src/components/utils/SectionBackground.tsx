import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { optimizeForAnimation, cleanupAnimationOptimization } from '@/lib/scroll-optimization';

interface SectionBackgroundProps {
  sectionId: string;
  variant?: 'hero' | 'services' | 'projects' | 'experience' | 'certifications' | 'contact' | 'playground';
  children?: React.ReactNode;
  optimizeRendering?: boolean; // New prop to enable performance optimizations
}

/**
 * SectionBackground component that adds section-specific animated backgrounds
 * with scroll-linked effects for smoother scrolling experience
 */
const SectionBackground: React.FC<SectionBackgroundProps> = ({
  sectionId,
  variant = 'hero',
  children,
  optimizeRendering = false
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

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

  // Set up intersection observer for optimized rendering
  useEffect(() => {
    if (optimizeRendering && sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Mark as in view when the section is visible
          setIsInView(entry.isIntersecting);

          // Once it's been in view, remember that for future renders
          if (entry.isIntersecting) {
            setHasRenderedOnce(true);
          }
        },
        {
          rootMargin: '100px 0px', // Start loading slightly before section comes into view
          threshold: 0.1
        }
      );

      const currentRef = sectionRef.current;
      observer.observe(currentRef);

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    } else {
      // If not optimizing, always consider it in view
      setIsInView(true);
      setHasRenderedOnce(true);
    }
  }, [optimizeRendering]);

  // Apply optimizations on mount
  useEffect(() => {
    if (sectionRef.current && (isInView || hasRenderedOnce)) {
      // Optimize elements that will animate
      const selector = `#${sectionId} .section-bg-element`;
      optimizeForAnimation(selector, ['transform', 'opacity']);

      return () => {
        // Clean up optimizations on unmount
        cleanupAnimationOptimization(selector);
      };
    }
  }, [sectionId, isInView, hasRenderedOnce]);

  // Transform scroll values for parallax effects with enhanced visibility
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.9, 1.05, 1.05, 0.9]);

  // Pre-define all transform values at the component level to avoid hooks in render functions
  // Hero section transforms
  const heroTop = useTransform(smoothProgress, [0, 1], [0, -30]);
  const heroBottom = useTransform(smoothProgress, [0, 1], [30, 0]);
  const heroMiddle = useTransform(smoothProgress, [0, 1], [0, 20]);

  // Services section transforms
  const servicesTop = useTransform(smoothProgress, [0, 1], [20, -20]);
  const servicesBottom = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const servicesMiddle = useTransform(smoothProgress, [0, 1], [0, 30]);

  // Projects section transforms
  const projectsTop = useTransform(smoothProgress, [0, 1], [30, -30]);
  const projectsBottom = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const projectsMiddle = useTransform(smoothProgress, [0, 1], [0, 30]);

  // Experience section transforms
  const experienceTop = useTransform(smoothProgress, [0, 1], [0, -40]);
  const experienceBottom = useTransform(smoothProgress, [0, 1], [40, 0]);
  const experienceMiddle = useTransform(smoothProgress, [0, 1], [20, -20]);

  // Certifications section transforms
  const certificationsTop = useTransform(smoothProgress, [0, 1], [20, -20]);
  const certificationsBottom = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const certificationsMiddle = useTransform(smoothProgress, [0, 1], [0, 30]);

  // Contact section transforms
  const contactTop = useTransform(smoothProgress, [0, 1], [30, -30]);
  const contactBottom = useTransform(smoothProgress, [0, 1], [-30, 30]);
  const contactMiddle = useTransform(smoothProgress, [0, 1], [0, 20]);

  // Playground section transforms
  const playgroundTop = useTransform(smoothProgress, [0, 1], [20, -40]);
  const playgroundBottom = useTransform(smoothProgress, [0, 1], [-30, 30]);
  const playgroundMiddle = useTransform(smoothProgress, [0, 1], [10, -10]);

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
                y: heroTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-10 left-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-200/30 to-teal-300/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: heroBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: heroMiddle
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
                y: servicesTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[10%] right-[5%] w-72 h-72 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: servicesBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[50%] right-[20%] w-56 h-56 rounded-full bg-gradient-to-r from-blue-300/20 to-teal-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: servicesMiddle
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
                y: projectsTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[20%] left-[15%] w-64 h-64 rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: projectsBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[10%] left-[25%] w-48 h-48 rounded-full bg-gradient-to-r from-purple-200/20 to-pink-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: projectsMiddle
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
                y: experienceTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[15%] right-[15%] w-80 h-80 rounded-full bg-gradient-to-r from-lavender-200/30 to-purple-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: experienceBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] right-[20%] w-56 h-56 rounded-full bg-gradient-to-r from-blue-300/20 to-teal-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: experienceMiddle
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
                y: certificationsTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[10%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-teal-200/30 to-blue-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: certificationsBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[50%] left-[30%] w-48 h-48 rounded-full bg-gradient-to-r from-lavender-200/20 to-purple-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: certificationsMiddle
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
                y: contactTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[10%] right-[10%] w-64 h-64 rounded-full bg-gradient-to-r from-lavender-200/30 to-purple-300/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: contactBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] right-[25%] w-48 h-48 rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: contactMiddle
              }}
            />
          </>
        );

      case 'playground':
        return (
          <>
            <motion.div
              className="section-bg-element absolute top-[10%] right-[5%] w-80 h-80 rounded-full bg-gradient-to-r from-blue-300/35 to-teal-300/35 blur-3xl"
              style={{
                opacity,
                scale,
                y: playgroundTop
              }}
            />
            <motion.div
              className="section-bg-element absolute bottom-[15%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-purple-200/30 to-blue-200/30 blur-3xl"
              style={{
                opacity,
                scale,
                y: playgroundBottom
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[40%] left-[40%] w-64 h-64 rounded-full bg-gradient-to-r from-teal-200/25 to-cyan-200/25 blur-3xl"
              style={{
                opacity,
                scale,
                y: playgroundMiddle
              }}
            />
            <motion.div
              className="section-bg-element absolute top-[25%] right-[30%] w-48 h-48 rounded-full bg-gradient-to-r from-indigo-200/20 to-purple-200/20 blur-3xl"
              style={{
                opacity,
                scale,
                y: playgroundTop
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  // Only render background elements if section is in view or has been rendered once
  const shouldRenderBackground = isInView || hasRenderedOnce;

  return (
    <div id={sectionId} ref={sectionRef} className="relative" style={{ position: 'relative' }}>
      {/* Section-specific background elements - conditionally rendered for performance */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {shouldRenderBackground ? renderBackgroundElements() : null}
      </div>

      {/* Section content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SectionBackground;
