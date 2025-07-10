import {
  Mail as MailIcon,
  Github,
  Linkedin,
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


const Hero = () => {
  // Reference for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use reduced motion hook for accessibility and performance
  const prefersReducedMotion = useReducedMotion();

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
      const isMobile = /Android|webOS|iPhone|iPad|Opera Mini/i.test(navigator.userAgent);
      return lowMemory || lowCores || isMobile;
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

  // Simplified tech stack
  const techStack = [
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Jest", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
    { name: "Cypress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg" },
    { name: "Playwright", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" }
  ];
  

  return (
    <motion.div 
      ref={heroRef} 
      className="relative pt-20 pb-16 md:pt-40 md:pb-32 overflow-hidden"
      style={!isLowPerformanceDevice && !prefersReducedMotion ? { y, opacity } : {}}
    >
      {/* Enhanced background with performance optimization */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated gradient background using CSS animations for better performance */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: !isLowPerformanceDevice && !prefersReducedMotion ? 
              'linear-gradient(-45deg, rgba(20, 184, 166, 0.1), rgba(56, 189, 248, 0.05), rgba(147, 51, 234, 0.08), rgba(20, 184, 166, 0.12))' : 
              'radial-gradient(circle at 30% 50%, rgba(20, 184, 166, 0.15) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)',
            backgroundSize: !isLowPerformanceDevice && !prefersReducedMotion ? '400% 400%' : 'auto',
            animation: !isLowPerformanceDevice && !prefersReducedMotion ? 'gradientShift 15s ease infinite' : 'none'
          }}
        />

        {/* Floating orbs with CSS transforms */}
        {!isLowPerformanceDevice && !prefersReducedMotion && (
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

        {/* Enhanced grid pattern with subtle animation */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
            animation: !isLowPerformanceDevice && !prefersReducedMotion ? 'gridShift 30s linear infinite' : 'none'
          }} 
        />

        {/* Enhanced decorative elements */}
        {!isLowPerformanceDevice && !prefersReducedMotion && (
          <>
            {/* Floating glassmorphism shapes with subtle animation */}
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

        {/* Particle effect for high-end devices */}
        {!isLowPerformanceDevice && !prefersReducedMotion && (
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

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Simplified Left Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Simplified status badge */}
            <motion.div
              className="inline-flex items-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-teal-200/50 text-teal-700 transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Available for Projects
              </Badge>
            </motion.div>

            {/* Simplified main heading */}
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 lg:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <span className="block text-gray-800">Hi, I'm</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 font-extrabold">
                Nam Le
              </span>
            </motion.h1>

            {/* Simplified subtitle */}
            <motion.div
              className="text-xl sm:text-2xl lg:text-2xl text-gray-600 mb-6 lg:mb-8 font-medium"
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

            {/* Simplified description */}
            <motion.p 
              className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Crafting exceptional digital experiences with modern technologies. 
              Specialized in both development and quality assurance to deliver 
              <span className="text-teal-600 font-semibold"> robust, scalable solutions</span>.
            </motion.p>

            {/* Simplified CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 lg:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <MotionButton
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => scrollToSection('contact')}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <MailIcon className="w-5 h-5 mr-2" />
                Get In Touch
              </MotionButton>

              <MotionButton
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold bg-white/80 backdrop-blur-sm hover:bg-white hover:border-teal-300 transition-all duration-200"
                onClick={() => scrollToSection('projects')}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-5 h-5 mr-2" />
                View My Work
              </MotionButton>
            </motion.div>

            {/* Simplified social links */}
            <motion.div 
              className="flex justify-center lg:justify-start space-x-6"
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
                  className={`w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm border border flex items-center justify-center text-gray-600 ${social.color} transition-all duration-200 shadow-sm hover:shadow-md`}
                  whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { scale: 1.05, y: -2 } : {}}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </MotionLink>
              ))}
            </motion.div>
          </motion.div>

          {/* Simplified Right Content - Profile Image */}
          <motion.div 
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Simplified profile image container */}
              <motion.div 
                className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden bg-gradient-to-tr from-teal-50 to-blue-50 border-4 border-white/50 shadow-2xl backdrop-blur-sm"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { scale: 1.02 } : {}}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/profile.webp"
                  alt="Nam Le - Full-stack Developer & QA Engineer"
                  className="w-full h-full object-cover"
                  loading="eager"
                />

                  {/* Simplified hover overlay */}
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
              </motion.div>

              {/* Simplified floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-teal-100"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { scale: 1.05 } : {}}
              >
                <Award className="w-6 h-6 text-teal-600" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-blue-100"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { scale: 1.05 } : {}}
              >
                <Zap className="w-6 h-6 text-blue-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Simplified Tech Stack Section */}
        <ScrollReveal>
          <motion.div 
            className="mt-16 lg:mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Technologies I Work With
            </motion.p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 max-w-4xl mx-auto">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={!isLowPerformanceDevice && !prefersReducedMotion ? { y: -4, scale: 1.02 } : {}}
                >
                  <div className="w-12 h-12 mb-3 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-8 h-8"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>

      </div>
    </motion.div>
  );
};

export default Hero;
