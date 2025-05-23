import {
  Mail as MailIcon,
  ArrowDown,
  Code,
  TestTube,
  Sparkles,
  Github,
  Linkedin,
  ArrowRight,
  BookOpen,
  Cpu,
  Braces,
  Bug,
  CheckCircle,
  Workflow
} from "lucide-react";
import { motion, useReducedMotion } from 'framer-motion';
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { MotionLink } from "@/components/ui/motion-link.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useRef, useState, useEffect } from 'react';
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import OptimizedImage from "@/components/ui/optimized-image.tsx";

const Hero = () => {
  // Reference for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);

  // Use reduced motion hook for accessibility and performance
  const prefersReducedMotion = useReducedMotion();

  // State to track device performance
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  // Detect device performance on component mount
  useEffect(() => {
    // Simple performance detection based on device memory and processor count
    // This is a basic heuristic and can be improved
    const detectLowPerformanceDevice = () => {
      // Check if navigator.deviceMemory is available (Chrome, Edge, Opera)
      const lowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;

      // Check processor cores if available
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

      // Check if it's a mobile device (simplified check)
      const isMobile = /Android|webOS|iPhone|iPad|Opera Mini/i.test(navigator.userAgent);

      // Set as low performance if any of these conditions are true
      return lowMemory || lowCores || isMobile;
    };

    setIsLowPerformanceDevice(detectLowPerformanceDevice());
  }, []);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Scroll to section with smooth behavior
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Tech stack items with icons
  const techStack = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
    { name: "Cypress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg" },
    { name: "JIRA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg" },
    { name: "Playwright", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" }
  ];

  // Tech icons for floating animation
  const techIcons = [
    { icon: <Cpu size={20} />, color: "from-teal-400/20 to-teal-300/10" },
    { icon: <Braces size={20} />, color: "from-blue-400/20 to-blue-300/10" }
  ];

  return (
    <div ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Enhanced modern abstract background with gradients and shapes - optimized for performance */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Static or conditionally animated gradient background */}
        {!isLowPerformanceDevice && !prefersReducedMotion ? (
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.15) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)',
                'radial-gradient(circle at 60% 70%, rgba(20, 184, 166, 0.15) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)',
                'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.15) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)'
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          // Static gradient for low-performance devices
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.15) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)'
            }}
          />
        )}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        {/* Conditionally render animated floating elements based on device performance */}
        {!isLowPerformanceDevice && !prefersReducedMotion && (
          <>
            <div className="absolute top-[15%] right-[20%]">
              <motion.div
                className="w-16 h-16 rounded-xl bg-gradient-to-tr from-teal-400/10 to-teal-200/20 backdrop-blur-sm border border-white/20 transform rotate-12"
                animate={{ rotate: [12, 5, 12] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </div>

            <div className="absolute bottom-[20%] left-[15%]">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400/10 to-blue-200/20 backdrop-blur-sm border border-white/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </div>

            <div className="absolute top-[40%] left-[10%]">
              <motion.div
                className="w-32 h-12 rounded-full bg-gradient-to-r from-purple-300/10 to-purple-100/20 backdrop-blur-sm border border-white/20"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </div>
          </>
        )}

        {/* Render fewer tech icons with simpler animations or static elements based on performance */}
        {!isLowPerformanceDevice && !prefersReducedMotion ? (
          // Render fewer tech icons with optimized animations for better performance
          techIcons.slice(0, 4).map((tech, index) => (
            <motion.div
              key={index}
              className={`absolute rounded-full bg-gradient-to-tr ${tech.color} backdrop-blur-sm border border-white/20 flex items-center justify-center p-2 shadow-sm`}
              style={{
                top: `${15 + (index * 15)}%`,
                left: `${70 + (index % 2) * 12}%`,
                width: `${30 + (index % 2) * 5}px`,
                height: `${30 + (index % 2) * 5}px`,
                zIndex: 1
              }}
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
            >
              <div className="text-gray-600 opacity-70">
                {tech.icon}
              </div>
            </motion.div>
          ))
        ) : (
          // Static tech icons for low-performance devices
          techIcons.slice(0, 3).map((tech, index) => (
            <div
              key={index}
              className={`absolute rounded-full bg-gradient-to-tr ${tech.color} backdrop-blur-sm border border-white/20 flex items-center justify-center p-2 shadow-sm`}
              style={{
                top: `${15 + (index * 20)}%`,
                left: `${75 + (index % 2) * 10}%`,
                width: `${30 + (index % 2) * 5}px`,
                height: `${30 + (index % 2) * 5}px`,
                zIndex: 1
              }}
            >
              <div className="text-gray-600 opacity-70">
                {tech.icon}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 mb-16 lg:mb-0 lg:pr-12 relative">
            {/* Fixed content that doesn't move - increased z-index to ensure it stays above any parallax effects */}
            <div className="relative z-20">
              <ScrollReveal
                delay={0.2}
                duration={0.7}
                className="text-center lg:text-left"
              >
                <Badge
                  variant="secondary"
                  className="mb-6 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium inline-flex items-center"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-teal-500" />
                  AVAILABLE FOR WORK
                </Badge>

                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight relative">
                  {/* Static text with gradient */}
                  <h1
                    style={{
                      whiteSpace: 'pre-line',
                      display: 'block',
                      background: 'linear-gradient(to right, #0d9488, #14b8a6, #0ea5e9)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradient-x 8s ease infinite'
                    }}
                  >
                    Hi, I'm Nam<br />
                    Developer &<br />
                    QA Engineer
                  </h1>

                  {/* Decorative element - conditionally animated */}
                  {!isLowPerformanceDevice && !prefersReducedMotion ? (
                    <motion.div
                      className="absolute -z-10 top-1/2 left-0 w-12 h-12 rounded-full bg-teal-400/10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.7, 0.5]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ) : (
                    <div className="absolute -z-10 top-1/2 left-0 w-12 h-12 rounded-full bg-teal-400/10 opacity-50" />
                  )}
                </div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {/* Enhanced description with highlight */}
                  <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    Passionate <span className="text-teal-600 font-medium">Developer</span> and <span className="text-blue-600 font-medium">QA Engineer</span> with expertise in building robust software solutions
                    through meticulous development and comprehensive testing. Let's create something <span className="relative inline-block">
                      <span className="relative z-10">amazing</span>
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-2 bg-teal-200/50 -z-10"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 1 }}
                      />
                    </span> together.
                  </p>

                  {/* Decorative element - conditionally animated */}
                  {!isLowPerformanceDevice && !prefersReducedMotion ? (
                    <motion.div
                      className="absolute -z-10 -bottom-5 right-10 w-20 h-20 rounded-full bg-blue-400/5"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ) : (
                    <div className="absolute -z-10 -bottom-5 right-10 w-20 h-20 rounded-full bg-blue-400/5 opacity-30" />
                  )}
                </motion.div>

                <motion.div
                  className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {/* Enhanced contact button with optimized animation */}
                  <MotionButton
                    className="bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full px-6 py-3 text-sm font-medium flex items-center shadow-md relative overflow-hidden group"
                    whileHover={!isLowPerformanceDevice ? {
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(13, 148, 136, 0.5)"
                    } : { scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/contact-form'}
                  >
                    <span className="relative z-10">Contact Me</span>
                    {!isLowPerformanceDevice && !prefersReducedMotion && (
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-400 -z-0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                    <div className="ml-2 w-4 h-4 relative z-10">
                      {!isLowPerformanceDevice && !prefersReducedMotion ? (
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatType: "reverse"
                          }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                  </MotionButton>
                </motion.div>

                {/* Social links for desktop */}
                <motion.div
                  className="hidden md:flex items-center gap-5 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <MotionLink
                    href="https://github.com/n1ml03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                  </MotionLink>
                  <MotionLink
                    href="https://linkedin.com/in/pearleseed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={20} />
                  </MotionLink>
                  <MotionLink
                    href="mailto:pearleseed@gmail.com"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MailIcon size={20} />
                  </MotionLink>
                </motion.div>

                {/* Social links for mobile with text */}
                <motion.div
                  className="md:hidden flex flex-wrap gap-3 justify-center mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  <MotionLink
                    href="https://github.com/n1ml03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Github size={18} />
                    <span className="text-sm font-medium">GitHub</span>
                  </MotionLink>
                  <MotionLink
                    href="https://linkedin.com/in/pearleseed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Linkedin size={18} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </MotionLink>
                  <MotionLink
                    href="mailto:pearleseed@gmail.com"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MailIcon size={18} />
                    <span className="text-sm font-medium">Email</span>
                  </MotionLink>
                  <MotionLink
                    href="/blog"
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-teal-50 hover:text-teal-600 px-4 py-2 rounded-full transition-colors"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Blog</span>
                  </MotionLink>
                </motion.div>

                {/* Enhanced scroll down indicator - optimized for performance */}
                <motion.div
                  className="hidden lg:flex items-center mt-16 text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <motion.div
                    className="relative"
                    onClick={() => scrollToSection('experience')}
                    whileHover={!isLowPerformanceDevice ? { scale: 1.1 } : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ cursor: 'pointer' }}
                  >
                    {!isLowPerformanceDevice && !prefersReducedMotion ? (
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-gray-50/50 z-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <div className="absolute -inset-2 rounded-full bg-gray-50/30 z-0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <div className="flex items-center relative z-10">
                      {!isLowPerformanceDevice && !prefersReducedMotion ? (
                        <motion.div
                          animate={{
                            y: [0, 5, 0],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut"
                          }}
                        >
                          <ArrowDown className="w-5 h-5 mr-2 text-teal-500" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 mr-2 text-teal-500">
                          <ArrowDown className="w-5 h-5" />
                        </div>
                      )}
                      <span className="font-medium">Scroll to explore</span>
                    </div>
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 relative">
            {/* Background effect - static without parallax */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-50/10 to-transparent rounded-3xl transform scale-110"></div>
              </div>
            </div>

            {/* Fixed content that doesn't move - higher z-index to stay above parallax */}
            <div className="relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100/80 relative overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 via-transparent to-blue-50/30 pointer-events-none"></div>

                  <div className="flex flex-col relative z-10">
                    {/* Enhanced profile info */}
                    <div className="mb-6 flex items-center">
                      <motion.div
                        className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-teal-200 shadow-md relative"
                        whileHover={!isLowPerformanceDevice ? { scale: 1.05 } : { scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        {/* Glow effect - conditionally rendered based on device performance */}
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-md opacity-30 -z-10"
                            animate={{
                              opacity: [0.2, 0.3, 0.2],
                              scale: [0.97, 1.03, 0.97]
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ) : (
                          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-md opacity-20 -z-10" />
                        )}

                        <OptimizedImage
                          src="/images/developer-portrait.webp"
                          alt="Developer portrait"
                          className="w-full h-full"
                          width={64}
                          height={64}
                          fallbackSrc="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1000"
                          priority={true}
                          isLCP={true}
                          fetchPriority="high"
                          aspectRatio="1/1"
                          objectFit="cover"
                        />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Nam Le</h3>
                        <div className="flex items-center">
                          <Badge className="bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 mr-2 border border-teal-200/50">Developer</Badge>
                          <Badge className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200/50">QA Engineer</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced work preview images with optimized 3D effect */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <motion.div
                        className="group relative overflow-hidden rounded-xl aspect-video shadow-md"
                        whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? {
                          rotateY: 3,
                          rotateX: -3,
                          scale: 1.03,
                          z: 5,
                          boxShadow: "0 15px 25px -10px rgba(0, 0, 0, 0.2)"
                        } : {
                          scale: 1.02,
                          boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <OptimizedImage
                          src="/images/coding-preview.webp"
                          webpSrc="/images/coding-preview.webp"
                          fallbackSrc="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000"
                          alt="Coding preview"
                          className={!isLowPerformanceDevice ? "transition-transform duration-500 group-hover:scale-105" : ""}
                          width={500}
                          height={281}
                          priority={true}
                          isLCP={true}
                          fetchPriority="high"
                          aspectRatio="16/9"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 text-white w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center">
                              <div className="p-2 bg-teal-500/80 rounded-full mr-3">
                                <Code className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-bold block">Development</span>
                                <span className="text-xs text-gray-200">Frontend & Backend</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="group relative overflow-hidden rounded-xl aspect-video shadow-md"
                        whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? {
                          rotateY: -3,
                          rotateX: -3,
                          scale: 1.03,
                          z: 5,
                          boxShadow: "0 15px 25px -10px rgba(0, 0, 0, 0.2)"
                        } : {
                          scale: 1.02,
                          boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <OptimizedImage
                          src="/images/testing-preview.webp"
                          webpSrc="/images/testing-preview.webp"
                          fallbackSrc="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000"
                          alt="Testing preview"
                          className={!isLowPerformanceDevice ? "transition-transform duration-500 group-hover:scale-105" : ""}
                          width={500}
                          height={281}
                          priority={true}
                          fetchPriority="high"
                          aspectRatio="16/9"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 text-white w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center">
                              <div className="p-2 bg-blue-500/80 rounded-full mr-3">
                                <TestTube className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-bold block">Testing</span>
                                <span className="text-xs text-gray-200">Automation & QA</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Enhanced skills section with animation */}
                    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-5 mb-4 border border-white/80 shadow-inner relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-teal-200/20 blur-md"></div>
                      <div className="absolute -left-6 -bottom-6 w-12 h-12 rounded-full bg-blue-200/20 blur-md"></div>

                      <h4 className="text-sm font-semibold mb-4 text-gray-700 flex items-center">
                        <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Technologies I work with</span>
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="ml-2 w-1.5 h-1.5 rounded-full bg-teal-500"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ) : (
                          <div className="ml-2 w-1.5 h-1.5 rounded-full bg-teal-500 opacity-70" />
                        )}
                      </h4>

                      <div className="flex flex-wrap gap-3">
                        {techStack.map((tech, index) => (
                          <motion.div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm flex items-center gap-2 border border-gray-100"
                            whileHover={!isLowPerformanceDevice ? {
                              y: -3,
                              scale: 1.03,
                              boxShadow: "0 8px 12px -3px rgba(0,0,0,0.1)",
                              background: "rgba(255, 255, 255, 0.95)"
                            } : {
                              y: -2,
                              scale: 1.02
                            }}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 250,
                              damping: 20,
                              delay: 0.3 + (Math.min(index, 3) * 0.1) // Limit delay multiplication for better performance
                            }}
                          >
                            <img
                              src={tech.icon}
                              alt={tech.name}
                              className="w-5 h-5"
                              width="20"
                              height="20"
                              loading="eager"
                              style={{ contain: 'layout paint' }}
                            />
                            <span className="text-xs font-medium text-gray-700">{tech.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced stats with optimized animation */}
                    <div className="grid grid-cols-3 gap-4">
                      <motion.div
                        className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-3 text-center border border-teal-100/50 shadow-sm relative overflow-hidden"
                        whileHover={!isLowPerformanceDevice ? {
                          y: -3,
                          boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)"
                        } : {
                          y: -2
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="absolute inset-0 bg-teal-200/20 -z-10"
                            initial={{ y: "100%" }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-teal-200/10 -z-10 transform translate-y-full hover:translate-y-0 transition-transform duration-300" />
                        )}
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >1+</motion.div>
                        ) : (
                          <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">1+</div>
                        )}
                        <div className="text-xs text-gray-600 font-medium">Years Experience</div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center border border-blue-100/50 shadow-sm relative overflow-hidden"
                        whileHover={!isLowPerformanceDevice ? {
                          y: -3,
                          boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)"
                        } : {
                          y: -2
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="absolute inset-0 bg-blue-200/20 -z-10"
                            initial={{ y: "100%" }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-blue-200/10 -z-10 transform translate-y-full hover:translate-y-0 transition-transform duration-300" />
                        )}
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                          >5+</motion.div>
                        ) : (
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">5+</div>
                        )}
                        <div className="text-xs text-gray-600 font-medium">Projects</div>
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 text-center border border-purple-100/50 shadow-sm relative overflow-hidden"
                        whileHover={!isLowPerformanceDevice ? {
                          y: -3,
                          boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)"
                        } : {
                          y: -2
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="absolute inset-0 bg-purple-200/20 -z-10"
                            initial={{ y: "100%" }}
                            whileHover={{ y: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-purple-200/10 -z-10 transform translate-y-full hover:translate-y-0 transition-transform duration-300" />
                        )}
                        {!isLowPerformanceDevice && !prefersReducedMotion ? (
                          <motion.div
                            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                          >100%</motion.div>
                        ) : (
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">100%</div>
                        )}
                        <div className="text-xs text-gray-600 font-medium">Satisfaction</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Enhanced decorative elements with optimized animation */}
                {!isLowPerformanceDevice && !prefersReducedMotion ? (
                  <>
                    <motion.div
                      className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-teal-100/50 to-teal-50/80 rounded-full blur-sm"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-100/50 to-blue-50/80 rounded-full blur-sm"
                      animate={{
                        scale: [1, 1.08, 1],
                        rotate: [0, -5, 0]
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute -z-10 top-1/2 right-1/3 w-16 h-16 bg-gradient-to-tr from-purple-100/30 to-purple-50/50 rounded-full blur-sm"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-teal-100/50 to-teal-50/80 rounded-full blur-sm" />
                    <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-100/50 to-blue-50/80 rounded-full blur-sm" />
                    <div className="absolute -z-10 top-1/2 right-1/3 w-16 h-16 bg-gradient-to-tr from-purple-100/30 to-purple-50/50 rounded-full blur-sm opacity-30" />
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
