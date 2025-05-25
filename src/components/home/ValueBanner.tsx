import { motion, useReducedMotion } from 'framer-motion';
import { 
  Code, 
  FileCode, 
  GitBranch, 
  Layers, 
  Server, 
  TestTube,
  Sparkles,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/lib';

const ValueBanner = () => {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  // Enhanced mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  const isTinyMobile = useMediaQuery('(max-width: 375px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  // Detect device performance
  useEffect(() => {
    const detectLowPerformanceDevice = () => {
      const lowMemory = 'deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const isMobileDevice = /Android|webOS|iPhone|iPad|Opera Mini/i.test(navigator.userAgent);
      return lowMemory || lowCores || isMobileDevice;
    };
    setIsLowPerformanceDevice(detectLowPerformanceDevice());
  }, []);

  // Mobile-optimized tech stack
  const techStack = [
    { id: 1, name: "TypeScript", icon: Code, color: "from-blue-500 to-blue-600" },
    { id: 2, name: "React", icon: Layers, color: "from-cyan-500 to-cyan-600" },
    { id: 3, name: "Node.js", icon: Server, color: "from-green-500 to-green-600" },
    { id: 4, name: "Jest", icon: TestTube, color: "from-red-500 to-red-600" },
    { id: 5, name: "Cypress", icon: GitBranch, color: "from-gray-600 to-gray-700" },
    { id: 6, name: "JIRA", icon: FileCode, color: "from-blue-600 to-blue-700" },
    { id: 7, name: "Playwright", icon: FileCode, color: "from-orange-500 to-orange-600" }
  ];

  const achievements = [
    { icon: Award, number: "15+", label: "Projects", color: "text-yellow-300" },
    { icon: Target, number: "100%", label: "Success Rate", color: "text-green-300" },
    { icon: Zap, number: "3+", label: "Years Exp.", color: "text-blue-300" }
  ];

  // Mobile-optimized spacing
  const mobileSpacing = {
    section: isTinyMobile ? 'my-8' : isSmallMobile ? 'my-12' : 'my-16 md:my-20',
    padding: isTinyMobile ? 'py-12' : isSmallMobile ? 'py-16' : 'py-20 md:py-24',
    innerPadding: isTinyMobile ? 'px-4' : isSmallMobile ? 'px-6' : 'px-8 md:px-12',
    marginBottom: isMobile && isLandscape ? 'mb-8' : 'mb-16'
  };

  return (
    <div className={`flex justify-center ${mobileSpacing.section}`}>
      <motion.section 
        className={`${mobileSpacing.padding} text-white rounded-3xl shadow-2xl max-w-6xl ${
          isTinyMobile ? 'mx-2' : isSmallMobile ? 'mx-3' : 'mx-4'
        } relative overflow-hidden touch-manipulation`}
        initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.95) 0%, rgba(6, 182, 212, 0.95) 50%, rgba(14, 165, 233, 0.95) 100%)'
        }}
      >
        {/* Mobile-optimized background */}
        <div className="absolute inset-0">
          {/* Simplified gradient overlay for mobile */}
          <div
            className={`absolute inset-0 ${isMobile ? 'opacity-10' : 'opacity-15'}`}
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
            }}
          />
          
          {/* Decorative elements - only for desktop */}
          {!isMobile && !isLowPerformanceDevice && !prefersReducedMotion && (
            <>
              <div className="absolute top-8 right-8 w-20 h-20 bg-white/5 rounded-xl border border-white/10" />
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 rounded-full border border-white/10" />
            </>
          )}
        </div>

        <div className={`relative z-10 ${mobileSpacing.innerPadding}`}>
          {/* Mobile-optimized header */}
          <div className={`text-center ${mobileSpacing.marginBottom}`}>
            <motion.div
              className={`inline-flex items-center ${isMobile ? 'mb-4' : 'mb-6'}`}
              initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <Badge 
                variant="outline" 
                className={`${
                  isTinyMobile 
                    ? 'px-3 py-1.5 text-xs' 
                    : isSmallMobile 
                      ? 'px-3 py-2 text-sm' 
                      : 'px-4 py-2 text-sm'
                } font-medium bg-white/20 backdrop-blur-sm border-white/30 text-white`}
              >
                <Sparkles className={`${isTinyMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
                My Mission
              </Badge>
            </motion.div>

            <motion.h2
              initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className={`font-bold ${isMobile ? 'mb-4' : 'mb-8'} max-w-4xl mx-auto leading-tight ${
                isTinyMobile 
                  ? 'text-2xl' 
                  : isSmallMobile 
                    ? 'text-3xl' 
                    : 'text-4xl md:text-5xl lg:text-6xl'
              }`}
            >
              Delivering{" "}
              <span className="relative">
                <span className={`bg-white/20 ${
                  isTinyMobile ? 'px-2 py-1' : 'px-4 py-2'
                } rounded-2xl backdrop-blur-sm`}>
                  High-Quality
                </span>
              </span>
              {" "}Software Solutions
            </motion.h2>

            <motion.p
              initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className={`text-white/90 max-w-3xl mx-auto leading-relaxed ${
                isTinyMobile 
                  ? 'text-base' 
                  : isSmallMobile 
                    ? 'text-lg' 
                    : 'text-xl md:text-2xl'
              }`}
            >
              Through meticulous development and comprehensive testing, 
              I create robust applications that exceed expectations.
            </motion.p>
          </div>

          {/* Mobile-optimized achievements */}
          <motion.div
            className={`flex ${
              isMobile 
                ? 'flex-col space-y-4 items-center' 
                : 'justify-center gap-8 md:gap-12'
            } ${mobileSpacing.marginBottom}`}
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className={`text-center ${
                  isMobile 
                    ? 'flex items-center gap-4 w-full max-w-sm' 
                    : 'cursor-pointer'
                }`}
                whileHover={!prefersReducedMotion && !isLowPerformanceDevice && !isMobile ? { 
                  scale: 1.05, 
                  y: -3 
                } : {}}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.div 
                  className={`${
                    isTinyMobile 
                      ? 'w-12 h-12' 
                      : 'w-16 h-16'
                  } ${
                    isMobile ? 'flex-shrink-0' : 'mx-auto mb-3'
                  } rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center ${achievement.color}`}
                  whileHover={!prefersReducedMotion && !isLowPerformanceDevice && !isMobile ? {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.4)"
                  } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {(() => {
                    const IconComponent = achievement.icon;
                    return <IconComponent className={`${isTinyMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />;
                  })()}
                </motion.div>
                <div className={isMobile ? 'text-left' : 'text-center'}>
                  <div className={`font-bold mb-1 ${
                    isTinyMobile 
                      ? 'text-xl' 
                      : isSmallMobile 
                        ? 'text-2xl' 
                        : 'text-2xl md:text-3xl'
                  }`}>
                    {achievement.number}
                  </div>
                  <p className={`text-white/80 font-medium ${
                    isTinyMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {achievement.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile-optimized tech stack */}
          <motion.div
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className={`${
              isMobile 
                ? 'grid grid-cols-2 gap-3 max-w-sm mx-auto' 
                : 'flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-4xl mx-auto'
            }`}
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.id}
                className={`group relative ${!isMobile ? 'cursor-pointer' : ''} touch-manipulation`}
                onHoverStart={() => !prefersReducedMotion && !isMobile && setHoveredTech(tech.id)}
                onHoverEnd={() => setHoveredTech(null)}
                whileHover={!prefersReducedMotion && !isLowPerformanceDevice && !isMobile ? { 
                  scale: 1.03, 
                  y: -2
                } : {}}
                whileTap={isMobile ? { scale: 0.98 } : { scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Mobile-optimized tech badge */}
                <motion.div 
                  className={`bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center shadow-lg ${
                    isMobile 
                      ? `${
                          isTinyMobile 
                            ? 'h-10 px-3 py-2 gap-2' 
                            : 'h-12 px-4 py-3 gap-3'
                        } w-full justify-center` 
                      : 'h-12 md:h-14 px-5 py-3 gap-3'
                  }`}
                  whileHover={!prefersReducedMotion && !isLowPerformanceDevice && !isMobile ? {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 8px 25px -8px rgba(255, 255, 255, 0.2)"
                  } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`${
                    isTinyMobile 
                      ? 'w-6 h-6' 
                      : 'w-8 h-8'
                  } rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-sm`}>
                    {(() => {
                      const IconComponent = tech.icon;
                      return <IconComponent className={`${
                        isTinyMobile ? 'h-3 w-3' : 'h-5 w-5'
                      } text-white`} />;
                    })()}
                  </div>
                  <span className={`font-semibold text-white ${
                    isTinyMobile 
                      ? 'text-xs' 
                      : isSmallMobile 
                        ? 'text-sm' 
                        : 'text-sm md:text-base'
                  }`}>
                    {tech.name}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile-optimized call to action */}
          <motion.div
            className={`text-center ${isMobile && isLandscape ? 'mt-8' : 'mt-16'}`}
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={`inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 cursor-pointer touch-manipulation ${
                isTinyMobile 
                  ? 'px-4 py-3 text-sm' 
                  : isSmallMobile 
                    ? 'px-5 py-3 text-sm' 
                    : 'px-6 py-4'
              }`}
              whileHover={!prefersReducedMotion && !isLowPerformanceDevice && !isMobile ? { 
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)"
              } : {}}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Star className={`${isTinyMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-3 text-yellow-300`} />
              <span className={`text-white font-semibold ${
                isTinyMobile 
                  ? 'text-xs' 
                  : isSmallMobile 
                    ? 'text-sm' 
                    : ''
              }`}>
                {isMobile 
                  ? "Ready to work with cutting-edge tech" 
                  : "Ready to work with cutting-edge technologies"
                }
              </span>
              <Sparkles className={`${isTinyMobile ? 'w-4 h-4' : 'w-5 h-5'} ml-3 text-white/80`} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ValueBanner;
