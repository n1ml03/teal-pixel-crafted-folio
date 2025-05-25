import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import {
  Code,
  Server,
  TestTube,
  GitBranch,
  Layers,
  Zap,
  ArrowRight,
  Award,
  Clock,
  Target,
  Sparkles,
  Eye,
  Settings
} from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  number: string;
  index: number;
  iconComponent: React.ReactNode;
  technologies: string[];
  complexity: 'simple' | 'medium' | 'complex';
  timeline: string;
}

const ServiceCard = ({ 
  title, 
  description, 
  features, 
  number, 
  index, 
  iconComponent, 
  technologies, 
  complexity, 
  timeline 
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
      whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={!prefersReducedMotion ? { 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      } : {}}
      viewport={{ once: true }}
      whileHover={!prefersReducedMotion ? { 
        y: -4, 
        scale: 1.01,
        boxShadow: "0 15px 30px -8px rgba(20, 184, 166, 0.1)"
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Simplified background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Simplified decorative elements */}
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-teal-100/60 to-teal-50/40 rounded-full opacity-30 group-hover:opacity-50 transition-opacity" />
      <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-gradient-to-tr from-blue-100/50 to-blue-50/30 rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />

      {/* Number indicator */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-4xl sm:text-6xl font-bold text-gray-50 select-none group-hover:text-teal-50/30 transition-colors duration-300">
        {number}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <motion.div 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg"
            whileHover={!prefersReducedMotion ? { 
              scale: 1.05,
              boxShadow: "0 6px 15px -3px rgba(20, 184, 166, 0.3)"
            } : {}}
            transition={{ duration: 0.2 }}
          >
            {iconComponent}
          </motion.div>
          <Badge 
            variant={complexity === 'simple' ? 'secondary' : complexity === 'medium' ? 'default' : 'destructive'}
            className="px-3 py-1 font-medium"
          >
            {complexity === 'simple' ? 'Simple' : complexity === 'medium' ? 'Medium' : 'Complex'}
          </Badge>
        </div>

        {/* Content */}
        <motion.h3 
          className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-teal-700 transition-colors duration-200"
          animate={!prefersReducedMotion && isHovered ? { x: 3 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed text-sm sm:text-base">
          {description}
        </p>

        {/* Simplified Features list */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              className="flex items-start group/feature"
              initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : {}}
              whileInView={!prefersReducedMotion ? { opacity: 1, x: 0 } : {}}
              transition={!prefersReducedMotion ? { delay: 0.1 + i * 0.03, duration: 0.3 } : {}}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-3 mt-2 group-hover/feature:scale-125 transition-transform" />
              <span className="text-sm text-gray-600 group-hover/feature:text-gray-800 transition-colors">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Technologies preview */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
          {technologies.slice(0, 3).map((tech, i) => (
            <motion.div
              key={i}
              whileHover={!prefersReducedMotion ? { scale: 1.03 } : {}}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                variant="outline" 
                className="text-xs text-teal-600 border-teal-200 bg-teal-50/70 hover:bg-teal-100 transition-colors"
              >
                {tech}
              </Badge>
            </motion.div>
          ))}
          {technologies.length > 3 && (
            <Badge variant="outline" className="text-xs text-gray-500 bg-gray-50">
              +{technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Timeline and CTA */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>{timeline}</span>
            </div>
            <motion.div 
              className="flex items-center text-teal-600 font-semibold bg-teal-50 px-3 py-2 rounded-full text-sm"
              animate={!prefersReducedMotion && isHovered ? { x: 3 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              Learn More 
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProcessStep = ({ step, index, isLast }: { 
  step: { icon: React.ReactNode; title: string; description: string; }; 
  index: number;
  isLast?: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="relative">
      <motion.div
        className="flex flex-col items-center text-center p-4 sm:p-6 relative z-10"
        initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
        whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
        transition={!prefersReducedMotion ? { duration: 0.4, delay: index * 0.05 } : {}}
        viewport={{ once: true }}
      >
        <div className="relative mb-4 sm:mb-6">
          <motion.div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg"
            whileHover={!prefersReducedMotion ? { 
              scale: 1.05,
              boxShadow: "0 8px 20px -5px rgba(20, 184, 166, 0.3)"
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {step.icon}
          </motion.div>
          <motion.div 
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
          >
            {index + 1}
          </motion.div>
        </div>
        <motion.h3 
          className="text-xl font-semibold text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
        >
          {step.title}
        </motion.h3>
        <motion.p 
          className="text-gray-600 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
        >
          {step.description}
        </motion.p>
      </motion.div>
      
      {/* Connection line to next step */}
      {!isLast && (
        <motion.div 
          className="absolute top-24 left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-teal-300 to-teal-100"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
          viewport={{ once: true }}
        />
      )}
    </div>
  );
};

const ServicesSection = () => {
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

  // Simplified scroll animations - only for high performance devices
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -25]); // Reduced parallax effect

  const services = [
    {
      iconComponent: <Code className="w-7 h-7" />,
      title: "Frontend Development",
      description: "Building responsive, interactive user interfaces with modern frameworks like React, ensuring optimal performance and accessibility.",
      features: [
        "Responsive design for all devices",
        "Interactive UI with modern frameworks",
        "Performance optimization",
        "Accessibility compliance"
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"],
      complexity: "medium" as const,
      timeline: "2-4 weeks",
      number: "01"
    },
    {
      iconComponent: <Server className="w-7 h-7" />,
      title: "Backend Development",
      description: "Creating robust server-side applications with Node.js, Express, and other technologies to power your web applications.",
      features: [
        "RESTful API development",
        "Database design and integration",
        "Authentication & authorization",
        "Scalable architecture"
      ],
      technologies: ["Node.js", "Express", "MongoDB", "PostgreSQL", "JWT"],
      complexity: "complex" as const,
      timeline: "3-6 weeks",
      number: "02"
    },
    {
      iconComponent: <TestTube className="w-7 h-7" />,
      title: "Quality Assurance",
      description: "Implementing comprehensive testing strategies including unit, integration, and end-to-end testing to ensure flawless applications.",
      features: [
        "Automated testing frameworks",
        "Test-driven development",
        "Performance testing",
        "Bug tracking and resolution"
      ],
      technologies: ["Jest", "Cypress", "Playwright", "Testing Library", "Postman"],
      complexity: "medium" as const,
      timeline: "1-3 weeks",
      number: "03"
    },
    {
      iconComponent: <GitBranch className="w-7 h-7" />,
      title: "CI/CD Implementation",
      description: "Setting up continuous integration and deployment pipelines to automate testing and delivery processes for reliable releases.",
      features: [
        "Automated build processes",
        "Continuous integration setup",
        "Deployment automation",
        "Version control best practices"
      ],
      technologies: ["GitHub Actions", "Docker", "AWS", "Vercel", "Jenkins"],
      complexity: "complex" as const,
      timeline: "1-2 weeks",
      number: "04"
    }
  ];

  const processSteps = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Discovery & Planning",
      description: "Understanding your requirements and creating a detailed project roadmap"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Development",
      description: "Building your solution with modern technologies and best practices"
    },
    {
      icon: <TestTube className="w-6 h-6" />,
      title: "Testing & QA",
      description: "Rigorous testing to ensure quality and performance"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Launch & Support",
      description: "Deployment and ongoing maintenance to keep everything running smoothly"
    }
  ];

  return (
    <motion.section 
      id="services" 
      className="py-16 sm:py-24 relative overflow-hidden"
      style={!isLowPerformanceDevice && !prefersReducedMotion ? { y } : {}}
    >
      {/* Simplified background */}
      <div className="absolute inset-0 -z-10">
        {/* Static gradient background for better performance */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(20, 184, 166, 0.12) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%)'
          }}
        />
        
        {/* Minimal decorative elements - only for high performance devices */}
        {!isLowPerformanceDevice && !prefersReducedMotion && (
          <>
            <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-gradient-to-tr from-teal-100/15 to-blue-100/15 backdrop-blur-sm border border-white/10" />
            <div className="absolute bottom-20 left-20 w-36 h-36 rounded-2xl bg-gradient-to-tr from-purple-100/15 to-pink-100/15 backdrop-blur-sm border border-white/10" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4">
        {/* Simplified section header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-20">
          <motion.div
            className="inline-flex items-center mb-4 sm:mb-6"
            initial={!prefersReducedMotion ? { opacity: 0, y: 15 } : {}}
            whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            transition={!prefersReducedMotion ? { duration: 0.5 } : {}}
            viewport={{ once: true }}
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-teal-200/50 text-teal-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Professional Services
            </Badge>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 relative"
            initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
            whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            transition={!prefersReducedMotion ? { duration: 0.6, delay: 0.1 } : {}}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600">
              My Services
            </span>
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
              initial={!prefersReducedMotion ? { width: 0 } : {}}
              whileInView={!prefersReducedMotion ? { width: 128 } : {}}
              transition={!prefersReducedMotion ? { delay: 0.8, duration: 0.6 } : {}}
              viewport={{ once: true }}
            />
          </motion.h2>

          <motion.p
            className="text-gray-600 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto"
            initial={!prefersReducedMotion ? { opacity: 0, y: 15 } : {}}
            whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
            transition={!prefersReducedMotion ? { duration: 0.5, delay: 0.3 } : {}}
            viewport={{ once: true }}
          >
            Specialized in both development and quality assurance, I offer end-to-end solutions
            to help bring your digital ideas to life with 
            <span className="text-teal-600 font-semibold"> quality and precision</span>.
          </motion.p>
        </div>

        {/* Simplified Services grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-20"
          initial={!prefersReducedMotion ? { opacity: 0, y: 30 } : {}}
          whileInView={!prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
          transition={!prefersReducedMotion ? { duration: 0.6, delay: 0.2 } : {}}
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </motion.div>

        {/* Simplified Process Section */}
        <motion.div
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-lg mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.h3 
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              My Work Process
            </motion.h3>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              How I deliver exceptional results through a proven methodology
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <ProcessStep 
                key={index} 
                step={step} 
                index={index} 
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Additional info */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center space-x-12 py-8 px-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl border border-teal-100/50 backdrop-blur-md">
            {[
              { icon: Zap, text: "Fast Delivery", color: "text-teal-600" },
              { icon: Layers, text: "Modern Stack", color: "text-blue-600" },
              { icon: Award, text: "Quality Focused", color: "text-purple-600" },
              { icon: Target, text: "Goal Oriented", color: "text-green-600" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mr-3 ${item.color}`}>
                  {(() => {
                    const IconComponent = item.icon;
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                </div>
                <span className="text-gray-700 font-semibold">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
