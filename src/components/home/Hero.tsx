import {
  Mail as MailIcon,
  ArrowDown,
  Code,
  TestTube,
  Sparkles,
  Github,
  Linkedin,
  Workflow,
  Star,
  Award,
  Zap,
  Eye
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { MotionButton } from "@/components/ui/motion-button";
import { MotionLink } from "@/components/ui/motion-link";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from 'react';
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import OptimizedImage from "@/components/ui/optimized-image";
import { useMediaQuery } from '@/lib';

const Hero = () => {
  // Reference for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use reduced motion hook for accessibility and performance
  const prefersReducedMotion = useReducedMotion();

  // Enhanced mobile detection with more breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const isTinyMobile = useMediaQuery('(max-width: 375px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  // State to track device performance
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  // Simplified scroll animations - only for high performance devices
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -25]); // Reduced parallax effect
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]); // Less dramatic fade

  // Detect device performance on component mount
  useEffect(() => {
    const detectLowPerformanceDevice = () => {
      const lowMemory = 'deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const isMobileDevice = /Android|webOS|iPhone|iPad|Opera Mini/i.test(navigator.userAgent);
      return lowMemory || lowCores || isMobileDevice;
    };

    setIsLowPerformanceDevice(detectLowPerformanceDevice());
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Simplified tech stack with mobile-optimized layout
  const techStack = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
    { name: "Cypress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg" },
    { name: "Playwright", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" }
  ];

  // Mobile-optimized spacing and sizing
  const mobileSpacing = {
    padding: isTinyMobile ? 'pt-16 pb-12' : isSmallMobile ? 'pt-18 pb-14' : 'pt-20 pb-16',
    desktopPadding: 'md:pt-40 md:pb-32'
  };

  const mobileImageSize = {
    container: isTinyMobile 
      ? 'w-64 h-64' 
      : isSmallMobile 
        ? 'w-72 h-72' 
        : 'w-80 h-80',
    sm: 'sm:w-96 sm:h-96',
    lg: 'lg:w-[28rem] lg:h-[28rem]'
  };

  return (
    <motion.div 
      ref={heroRef} 
      className={`relative ${mobileSpacing.padding} ${mobileSpacing.desktopPadding} overflow-hidden`}
      style={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { y, opacity } : {}}
    >
      {/* Enhanced background with performance optimization */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Simplified background for mobile devices */}
        <div
          className={`absolute inset-0 ${
            isMobile 
              ? 'opacity-30' 
              : 'opacity-40'
          }`}
          style={{
            background: isMobile || isLowPerformanceDevice || prefersReducedMotion ? 
              'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.12) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 70%)' :
              'linear-gradient(-45deg, rgba(20, 184, 166, 0.1), rgba(56, 189, 248, 0.05), rgba(147, 51, 234, 0.08), rgba(20, 184, 166, 0.12))',
            backgroundSize: !isMobile && !isLowPerformanceDevice && !prefersReducedMotion ? '400% 400%' : 'auto',
            animation: !isMobile && !isLowPerformanceDevice && !prefersReducedMotion ? 'gradientShift 15s ease infinite' : 'none'
          }}
        />

        {/* Floating orbs - only for desktop */}
        {!isMobile && !isLowPerformanceDevice && !prefersReducedMotion && (
          <>
            <div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                animation: 'float 20s ease-in-out infinite',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <div 
              className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
                animation: 'float 25s ease-in-out infinite reverse',
                transform: 'translate(50%, 50%)'
              }}
            />
            <div 
              className="absolute top-1/2 left-3/4 w-72 h-72 rounded-full opacity-25 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
                animation: 'float 18s ease-in-out infinite',
                animationDelay: '5s'
              }}
            />
          </>
        )}

        {/* Enhanced grid pattern with subtle animation - simplified for mobile */}
        <div 
          className={`absolute inset-0 ${isMobile ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
            animation: !isMobile && !isLowPerformanceDevice && !prefersReducedMotion ? 'gridShift 30s linear infinite' : 'none'
          }} 
        />

        {/* Enhanced decorative elements - only for desktop */}
        {!isMobile && !isLowPerformanceDevice && !prefersReducedMotion && (
          <>
            {/* Floating glassmorphism shapes */}
            <div 
              className="absolute top-[15%] right-[15%] w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl"
              style={{
                animation: 'floatSlow 12s ease-in-out infinite',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(20, 184, 166, 0.05) 100%)'
              }}
            />
            <div 
              className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full backdrop-blur-sm border border-white/15 shadow-xl"
              style={{
                background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.08) 0%, rgba(56, 189, 248, 0.12) 50%, rgba(147, 51, 234, 0.06) 100%)',
                animation: 'floatSlow 15s ease-in-out infinite reverse'
              }}
            />
            <div 
              className="absolute top-[60%] right-[5%] w-20 h-20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg"
              style={{
                background: 'linear-gradient(225deg, rgba(56, 189, 248, 0.08) 0%, rgba(147, 51, 234, 0.05) 100%)',
                animation: 'floatSlow 10s ease-in-out infinite',
                animationDelay: '3s'
              }}
            />

            {/* Geometric accent lines */}
            <div 
              className="absolute top-[30%] left-0 w-32 h-px opacity-20"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.5) 50%, transparent 100%)',
                animation: 'slideIn 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute bottom-[40%] right-0 w-40 h-px opacity-15"
              style={{
                background: 'linear-gradient(270deg, transparent 0%, rgba(56, 189, 248, 0.5) 50%, transparent 100%)',
                animation: 'slideIn 10s ease-in-out infinite reverse',
                animationDelay: '2s'
              }}
            />
          </>
        )}

        {/* Particle effect - only for desktop */}
        {!isMobile && !isLowPerformanceDevice && !prefersReducedMotion && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + (i * 8)}%`,
                  animation: `particle 20s linear infinite`,
                  animationDelay: `${i * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* CSS animations for performance optimization */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-15px) rotate(2deg); opacity: 1; }
        }
        
        @keyframes gridShift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(80px) translateY(80px); }
        }
        
        @keyframes slideIn {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes particle {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
      `}</style>

      <div className={`container mx-auto ${isTinyMobile ? 'px-3' : isSmallMobile ? 'px-4' : 'px-4'}`}>
        <div className={`flex flex-col ${isLandscape && isMobile ? 'lg:flex-row' : 'lg:flex-row'} items-center ${isMobile ? 'gap-6' : 'gap-8 lg:gap-12'}`}>
          {/* Mobile-optimized Left Content */}
          <motion.div 
            className={`flex-1 text-center lg:text-left ${isMobile ? 'max-w-full' : 'max-w-2xl'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Mobile-optimized status badge */}
            <motion.div
              className={`inline-flex items-center ${isMobile ? 'mb-4' : 'mb-6'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Badge 
                variant="outline" 
                className={`${
                  isTinyMobile 
                    ? 'px-3 py-1.5 text-xs' 
                    : isSmallMobile 
                      ? 'px-3 py-2 text-sm' 
                      : 'px-4 py-2 text-sm'
                } font-medium bg-white/80 backdrop-blur-sm border-teal-200/50 text-teal-700 transition-colors duration-200`}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Available for Projects
              </Badge>
            </motion.div>

            {/* Mobile-optimized main heading */}
            <motion.h1 
              className={`font-bold ${isMobile ? 'mb-3' : 'mb-4 lg:mb-6'} leading-tight ${
                isTinyMobile 
                  ? 'text-3xl' 
                  : isSmallMobile 
                    ? 'text-4xl' 
                    : 'text-4xl sm:text-5xl lg:text-7xl'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <span className="block text-gray-800">Hi, I'm</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 font-extrabold">
                Nam Le
              </span>
            </motion.h1>

            {/* Mobile-optimized subtitle */}
            <motion.div
              className={`text-gray-600 ${isMobile ? 'mb-4' : 'mb-6 lg:mb-8'} font-medium ${
                isTinyMobile 
                  ? 'text-base' 
                  : isSmallMobile 
                    ? 'text-lg' 
                    : 'text-lg sm:text-xl lg:text-2xl'
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent font-bold">
                Full-stack Developer
              </span>
              <span className="text-gray-500"> & </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                QA Engineer
              </span>
            </motion.div>

            {/* Mobile-optimized description */}
            <motion.p 
              className={`text-gray-600 leading-relaxed ${isMobile ? 'mb-6' : 'mb-8 lg:mb-10'} mx-auto lg:mx-0 ${
                isTinyMobile 
                  ? 'text-sm max-w-sm' 
                  : isSmallMobile 
                    ? 'text-base max-w-md' 
                    : 'text-base sm:text-lg max-w-xl'
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Crafting exceptional digital experiences with modern technologies. 
              Specialized in both development and quality assurance to deliver 
              <span className="text-teal-600 font-semibold"> robust, scalable solutions</span>.
            </motion.p>

            {/* Mobile-optimized CTA buttons with better touch targets */}
            <motion.div 
              className={`flex flex-col ${isSmallMobile ? 'gap-3' : 'sm:flex-row gap-3 sm:gap-4'} justify-center lg:justify-start ${isMobile ? 'mb-6' : 'mb-8 lg:mb-12'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <MotionButton
                size="lg"
                className={`bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white ${
                  isTinyMobile 
                    ? 'px-6 py-3 text-base min-h-[48px]' 
                    : isSmallMobile 
                      ? 'px-6 py-3 text-base min-h-[48px]' 
                      : 'px-6 sm:px-8 py-3 sm:py-4 min-h-[48px]'
                } rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation`}
                onClick={() => scrollToSection('contact')}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <MailIcon className={`${isTinyMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
                Get In Touch
              </MotionButton>

              <MotionButton
                variant="outline"
                size="lg"
                className={`border-2 border-gray-300 text-gray-700 ${
                  isTinyMobile 
                    ? 'px-6 py-3 text-base min-h-[48px]' 
                    : isSmallMobile 
                      ? 'px-6 py-3 text-base min-h-[48px]' 
                      : 'px-6 sm:px-8 py-3 sm:py-4 min-h-[48px]'
                } rounded-2xl font-semibold bg-white/80 backdrop-blur-sm hover:bg-white hover:border-teal-300 transition-all duration-200 touch-manipulation`}
                onClick={() => scrollToSection('projects')}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className={`${isTinyMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
                View My Work
              </MotionButton>
            </motion.div>

            {/* Mobile-optimized social links with better touch targets */}
            <motion.div 
              className={`flex justify-center lg:justify-start ${isMobile ? 'space-x-4' : 'space-x-6'}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {[
                { icon: Github, href: "https://github.com/namle-dev", label: "GitHub", color: "hover:text-gray-900" },
                { icon: Linkedin, href: "https://linkedin.com/in/namle-dev", label: "LinkedIn", color: "hover:text-blue-600" }
              ].map((social) => (
                <MotionLink
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    isTinyMobile 
                      ? 'w-12 h-12' 
                      : 'w-12 h-12'
                  } min-h-[48px] min-w-[48px] rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-600 ${social.color} transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation`}
                  whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { scale: 1.05, y: -2 } : {}}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon size={isTinyMobile ? 18 : 20} />
                </MotionLink>
              ))}
            </motion.div>
          </motion.div>

          {/* Mobile-optimized Right Content - Profile Image */}
          <motion.div 
            className={`flex-1 flex justify-center lg:justify-end ${isMobile && isLandscape ? 'order-first lg:order-last' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Mobile-optimized profile image container */}
              <motion.div 
                className={`relative ${mobileImageSize.container} ${mobileImageSize.sm} ${mobileImageSize.lg} rounded-3xl overflow-hidden bg-gradient-to-tr from-teal-50 to-blue-50 border-4 border-white/50 shadow-2xl backdrop-blur-sm`}
                onHoverStart={() => !isMobile && setIsHovered(true)}
                onHoverEnd={() => !isMobile && setIsHovered(false)}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { scale: 1.02 } : {}}
                transition={{ duration: 0.3 }}
              >
                <OptimizedImage
                  src="/images/profile.webp"
                  alt="Nam Le - Full-stack Developer & QA Engineer"
                  className="w-full h-full object-cover"
                  loading="eager"
                  sizes={
                    isTinyMobile 
                      ? '256px' 
                      : isSmallMobile 
                        ? '288px' 
                        : '(max-width: 640px) 320px, (max-width: 768px) 384px, 448px'
                  }
                />

                {/* Hover overlay - disabled on mobile for better performance */}
                {!isMobile && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-teal-600/80 via-transparent to-transparent opacity-0 flex items-end justify-center pb-8"
                    animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { 
                        scale: 1.05, 
                        y: -2,
                        boxShadow: "0 10px 25px rgba(20, 184, 166, 0.2)" 
                      } : {}}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="cursor-pointer"
                    >
                      <Badge 
                        variant="outline" 
                        className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-teal-200/50 text-teal-700 transition-all duration-200 hover:bg-white/95 hover:border-teal-300 hover:text-teal-800 hover:shadow-lg"
                      >
                        <motion.div 
                          className="w-2 h-2 bg-green-400 rounded-full mr-2" 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        Available for Work
                      </Badge>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Mobile-optimized floating badges */}
              <motion.div
                className={`absolute ${
                  isTinyMobile 
                    ? '-top-2 -right-2 p-2' 
                    : '-top-4 -right-4 p-3'
                } bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { scale: 1.05 } : {}}
              >
                <Award className={`${isTinyMobile ? 'w-5 h-5' : 'w-6 h-6'} text-teal-600`} />
              </motion.div>

              <motion.div
                className={`absolute ${
                  isTinyMobile 
                    ? '-bottom-2 -left-2 p-2' 
                    : '-bottom-4 -left-4 p-3'
                } bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { scale: 1.05 } : {}}
              >
                <Zap className={`${isTinyMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-600`} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mobile-optimized Tech Stack Section */}
        <ScrollReveal>
          <motion.div 
            className={`${isMobile && isLandscape ? 'mt-8' : 'mt-12 lg:mt-20'} text-center`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className={`text-gray-500 uppercase tracking-wider font-semibold ${
                isTinyMobile 
                  ? 'text-xs mb-6' 
                  : isSmallMobile 
                    ? 'text-sm mb-6' 
                    : 'text-sm mb-8'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Technologies I Work With
            </motion.p>
            
            {/* Mobile-optimized tech stack grid */}
            <div className={`grid ${
              isTinyMobile 
                ? 'grid-cols-3 gap-3' 
                : isSmallMobile 
                  ? 'grid-cols-3 gap-4' 
                  : 'grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6'
            } justify-items-center max-w-4xl mx-auto`}>
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className={`group flex flex-col items-center ${
                    isTinyMobile 
                      ? 'p-2' 
                      : isSmallMobile 
                        ? 'p-3' 
                        : 'p-3 sm:p-4'
                  } rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 w-full max-w-[100px]`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { y: -4, scale: 1.02 } : {}}
                >
                  <div className={`${
                    isTinyMobile 
                      ? 'w-8 h-8 mb-2' 
                      : isSmallMobile 
                        ? 'w-10 h-10 mb-2' 
                        : 'w-12 h-12 mb-3'
                  } rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow`}>
                    <OptimizedImage
                      src={tech.icon}
                      alt={tech.name}
                      className={isTinyMobile ? 'w-6 h-6' : isSmallMobile ? 'w-7 h-7' : 'w-8 h-8'}
                      loading="lazy"
                    />
                  </div>
                  <span className={`text-gray-700 group-hover:text-gray-900 transition-colors text-center font-medium ${
                    isTinyMobile 
                      ? 'text-xs leading-tight' 
                      : isSmallMobile 
                        ? 'text-sm' 
                        : 'text-sm'
                  }`}>
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Mobile-optimized Scroll indicator */}
        <motion.div 
          className={`absolute ${isMobile ? 'bottom-4' : 'bottom-8'} left-1/2 transform -translate-x-1/2`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.button
            onClick={() => scrollToSection('services')}
            className={`flex flex-col items-center text-gray-400 hover:text-teal-600 transition-colors duration-200 group touch-manipulation ${
              isMobile ? 'p-2' : ''
            }`}
            whileHover={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { y: -2 } : {}}
            aria-label="Scroll to next section"
          >
            <span className={`${
              isTinyMobile ? 'text-xs' : 'text-sm'
            } font-medium mb-2 group-hover:text-teal-600`}>
              {isMobile ? 'Scroll' : 'Scroll Down'}
            </span>
            <motion.div
              animate={!isLowPerformanceDevice && !prefersReducedMotion && !isMobile ? { y: [0, 3, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className={`${isTinyMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
