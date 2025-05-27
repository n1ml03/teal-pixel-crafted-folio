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

const ValueBanner = () => {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  // Detect device performance
  useEffect(() => {
    const detectLowPerformanceDevice = () => {
      const lowMemory = 'deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const isMobile = /Android|webOS|iPhone|iPad|Opera Mini/i.test(navigator.userAgent);
      return lowMemory || lowCores || isMobile;
    };
    setIsLowPerformanceDevice(detectLowPerformanceDevice());
  }, []);

  // Simplified tech stack
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
    { icon: Award, number: "5+", label: "Projects", color: "text-yellow-300" },
    { icon: Target, number: "100%", label: "Success Rate", color: "text-green-300" },
    { icon: Zap, number: "1+", label: "Years Exp.", color: "text-blue-300" }
  ];

  return (
    <div className="flex justify-center my-16 md:my-20">
      <motion.section 
        className="py-20 md:py-24 text-white rounded-3xl shadow-2xl max-w-6xl mx-4 relative overflow-hidden"
        initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.95) 0%, rgba(6, 182, 212, 0.95) 50%, rgba(14, 165, 233, 0.95) 100%)'
        }}
      >
        {/* Minimal background - static only */}
        <div className="absolute inset-0">
          {/* Static gradient overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
            }}
          />
          
          {/* Minimal decorative elements - static only for high performance devices */}
          {!isLowPerformanceDevice && !prefersReducedMotion && (
            <>
              <div className="absolute top-8 right-8 w-20 h-20 bg-white/5 rounded-xl border border-white/10" />
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 rounded-full border border-white/10" />
            </>
          )}
        </div>

        <div className="relative z-10 px-8 md:px-12">
          {/* Simplified header - minimal animation */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center mb-6"
              initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium bg-white/20 backdrop-blur-sm border-white/30 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                My Mission
              </Badge>
            </motion.div>

            <motion.h2
              initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 max-w-4xl mx-auto leading-tight"
            >
              Delivering{" "}
              <span className="relative">
                <span className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
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
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            >
              Through meticulous development and comprehensive testing, 
              I create robust applications that exceed expectations.
            </motion.p>
          </div>

          {/* Enhanced achievements with hover effects */}
          <motion.div
            className="flex justify-center gap-8 md:gap-12 mb-16"
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="text-center cursor-pointer"
                whileHover={!prefersReducedMotion && !isLowPerformanceDevice ? { 
                  scale: 1.05, 
                  y: -3 
                } : {}}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <motion.div 
                  className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center ${achievement.color}`}
                  whileHover={!prefersReducedMotion && !isLowPerformanceDevice ? {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.4)"
                  } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {(() => {
                    const IconComponent = achievement.icon;
                    return <IconComponent className="w-8 h-8" />;
                  })()}
                </motion.div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {achievement.number}
                </div>
                <p className="text-white/80 text-sm font-medium">{achievement.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced tech stack with hover animations */}
          <motion.div
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {techStack.map((tech) => (
              <motion.div
                key={tech.id}
                className="group relative cursor-pointer"
                onHoverStart={() => !prefersReducedMotion && setHoveredTech(tech.id)}
                onHoverEnd={() => setHoveredTech(null)}
                whileHover={!prefersReducedMotion && !isLowPerformanceDevice ? { 
                  scale: 1.03, 
                  y: -2
                } : {}}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Enhanced tech badge with hover effects */}
                <motion.div 
                  className="h-12 md:h-14 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/30 flex items-center gap-3 shadow-lg"
                  whileHover={!prefersReducedMotion && !isLowPerformanceDevice ? {
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 8px 25px -8px rgba(255, 255, 255, 0.2)"
                  } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-sm`}>
                    {(() => {
                      const IconComponent = tech.icon;
                      return <IconComponent className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <span className="text-sm md:text-base font-semibold text-white">
                    {tech.name}
                  </span>
                </motion.div>

              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced call to action with hover */}
          <motion.div
            className="text-center mt-16"
            initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 cursor-pointer"
              whileHover={!prefersReducedMotion && !isLowPerformanceDevice ? { 
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)"
              } : {}}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Star className="w-5 h-5 mr-3 text-yellow-300" />
              <span className="text-white font-semibold">
                Ready to work with cutting-edge technologies
              </span>
              <Sparkles className="w-5 h-5 ml-3 text-white/80" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ValueBanner;
