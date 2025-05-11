import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { throttle, createOptimizedScrollHandler } from '@/lib/scroll-optimization';

const EnhancedBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Framer Motion's scroll utilities for smoother animations
  const { scrollY: scrollYProgress } = useScroll();

  // Create smooth spring-based scroll value with optimized settings
  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 80,  // Reduced for smoother motion
    damping: 25,    // Increased for less oscillation
    restDelta: 0.001,
    mass: 0.5       // Lighter mass for more responsive movement
  });

  // Transform scroll values to usable ranges for parallax effects
  const topBlobY = useTransform(smoothScrollY, [0, 1], [0, -100]);
  const middleBlobY = useTransform(smoothScrollY, [0, 1], [0, 50]);
  const bottomBlobY = useTransform(smoothScrollY, [0, 1], [0, 150]);

  // Track scroll position for performance optimizations with throttling
  useMotionValueEvent(scrollYProgress, "change",
    throttle((latest) => {
      setScrollY(latest * 100);
    }, 16) // ~60fps
  );

  // Apply optimizations on mount
  useEffect(() => {
    // Mark elements that will animate for browser optimization
    const elements = containerRef.current?.querySelectorAll('.will-animate');
    elements?.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.willChange = 'transform, opacity';
      }
    });

    return () => {
      // Clean up will-change properties on unmount
      elements?.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.willChange = 'auto';
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden will-change-transform">
      {/* Background gradient base with more vibrant colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"></div>

      {/* Animated gradient overlay with hardware acceleration */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-gradient-to-r from-teal-200/20 via-blue-300/20 to-purple-200/20 animate-gradient-x"
          style={{
            backgroundSize: '400% 400%',
            willChange: 'background-position'
          }}
        ></div>
      </div>

      {/* Decorative geometric elements with parallax effect */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Abstract shapes - circles with blur and parallax effect */}
        <motion.div
          className="absolute top-10 right-[10%] w-96 h-96 rounded-full bg-gradient-to-r from-teal-200/40 to-blue-300/40 blur-3xl"
          style={{
            y: topBlobY,
            willChange: 'transform'
          }}
        />

        <motion.div
          className="absolute bottom-10 left-[5%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-purple-300/30 to-pink-200/30 blur-3xl"
          style={{
            y: bottomBlobY,
            willChange: 'transform'
          }}
        />

        <motion.div
          className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full bg-gradient-to-r from-yellow-200/20 to-orange-200/20 blur-3xl"
          style={{
            y: middleBlobY,
            willChange: 'transform'
          }}
        />

        <motion.div
          className="absolute bottom-[-10%] right-[20%] w-[28rem] h-[28rem] rounded-full bg-gradient-to-r from-blue-300/30 to-teal-200/30 blur-3xl"
          style={{
            y: bottomBlobY,
            willChange: 'transform'
          }}
        />

        {/* Grid pattern overlay with subtle parallax */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            y: useTransform(smoothScrollY, [0, 1], [0, 30]),
            willChange: 'transform'
          }}
        />
      </div>

      {/* Enhanced animated floating elements - optimized for performance */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top section elements */}
        <motion.div
          className="absolute top-[15%] right-[20%] w-20 h-20 rounded-xl bg-gradient-to-tr from-teal-400/20 to-teal-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            willChange: 'transform',
            y: useTransform(smoothScrollY, [0, 0.5], [0, -30])
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 12, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Middle section elements */}
        <motion.div
          className="absolute top-[40%] left-[10%] w-36 h-14 rounded-full bg-gradient-to-r from-gray-300/20 to-gray-100/30 backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            willChange: 'transform',
            y: useTransform(smoothScrollY, [0.3, 0.6], [0, 40])
          }}
          animate={{
            y: [0, 10, 0],
            rotate: [0, 3, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        <motion.div
          className="absolute top-[25%] left-[25%] w-16 h-16 rounded-lg bg-gradient-to-tr from-yellow-400/20 to-orange-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            willChange: 'transform',
            y: useTransform(smoothScrollY, [0.2, 0.5], [0, 20])
          }}
          animate={{
            y: [0, 8, 0],
            rotate: [0, 15, 0],
            scale: [1, 1.06, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />

        {/* Bottom section elements */}
        <motion.div
          className="absolute bottom-[20%] left-[15%] w-28 h-28 rounded-full bg-gradient-to-tr from-blue-400/20 to-blue-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            willChange: 'transform',
            y: useTransform(smoothScrollY, [0.5, 1], [0, 50])
          }}
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.03, 1]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.div
          className="absolute top-[60%] right-[15%] w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-400/20 to-pink-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            willChange: 'transform',
            y: useTransform(smoothScrollY, [0.6, 1], [0, 60])
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, -8, 0],
            scale: [1, 1.04, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <motion.div
          className="absolute bottom-[5%] left-[40%] w-20 h-20 rounded-full bg-gradient-to-tr from-teal-300/20 to-blue-200/30 backdrop-blur-sm border border-white/30 shadow-lg"
          style={{
            willChange: 'transform',
            y: useTransform(smoothScrollY, [0.7, 1], [0, 70])
          }}
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0],
            scale: [1, 1.04, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>
    </div>
  );
};

export default EnhancedBackground;
