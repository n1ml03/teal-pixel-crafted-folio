import { 
  ArrowUpRight, 
  GithubIcon, 
  ExternalLink, 
  Calendar, 
  Code, 
  Layers,
  Star,
  Play,
  Sparkles,
  Award,
  Eye,
  Target,
  Zap
} from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { useState, useEffect } from 'react';

interface ProjectCardProps {
  image: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags?: string[];
  githubUrl?: string;
  demoUrl?: string;
  index: number;
  status?: 'completed' | 'in-progress' | 'featured';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

const ProjectCard = ({
  image,
  title,
  category,
  year,
  description,
  tags = [],
  githubUrl,
  demoUrl,
  index,
  status = 'completed',
  difficulty = 'intermediate'
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
      whileHover={!prefersReducedMotion ? {
        y: -4,
        scale: 1.01,
        boxShadow: "0 15px 30px -8px rgba(20, 184, 166, 0.1)"
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Simplified background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Image container */}
      <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
          transition={{ duration: 0.4 }}
        />
        
        {/* Simplified overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Simplified project links */}
        <motion.div 
          className="absolute bottom-4 right-4 flex space-x-3"
          animate={isHovered ? { 
            opacity: 1, 
            y: 0
          } : { 
            opacity: 0, 
            y: 15
          }}
          transition={{ duration: 0.2 }}
        >
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-2xl transition-all duration-200 shadow-lg"
              aria-label="View GitHub Repository"
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <GithubIcon size={18} />
            </motion.a>
          )}
          {demoUrl && (
            <motion.a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500/90 backdrop-blur-sm hover:bg-teal-500 text-white p-3 rounded-2xl transition-all duration-200 shadow-lg"
              aria-label="View Live Demo"
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={18} />
            </motion.a>
          )}
        </motion.div>

        {/* Enhanced badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white px-3 py-1 text-xs font-medium border-0 shadow-lg"
          >
            {category}
          </Badge>
          {status === 'featured' && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 text-xs font-medium border-0 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Difficulty indicator */}
        <div className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-md border-0 shadow-lg ${
              difficulty === 'beginner' ? 'text-green-600' :
              difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${
              difficulty === 'beginner' ? 'bg-green-500' :
              difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            {difficulty}
          </Badge>
        </div>
      </div>

      {/* Enhanced content */}
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{year}</span>
          </div>
          <motion.div
            className="flex items-center text-sm text-teal-600 font-medium"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Play className="w-4 h-4 mr-1" />
            View Details
          </motion.div>
        </div>

        <motion.h3 
          className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-700 transition-colors duration-300"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{description}</p>

        {/* Enhanced tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, tagIndex) => (
            <motion.div
              key={tagIndex}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <Badge 
                variant="outline" 
                className="text-xs text-teal-600 border-teal-200 bg-teal-50/70 hover:bg-teal-100 transition-colors px-3 py-1"
              >
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Enhanced CTA */}
        <div className="pt-4 border-t border-gray-100">
          <motion.a
            href={githubUrl || "#"}
            target={githubUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-600 font-semibold text-sm bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors"
            whileHover={{ x: 5, scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Project 
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </motion.a>
        </div>
      </div>

      {/* Decorative floating elements */}
      <motion.div 
        className="absolute -right-6 -top-6 w-12 h-12 bg-gradient-to-br from-teal-100/30 to-teal-50/50 rounded-full"
        animate={isHovered ? { 
          scale: 1.2, 
          opacity: 0.8,
          rotate: 30 
        } : { 
          scale: 1, 
          opacity: 0.4,
          rotate: 0 
        }}
        transition={{ duration: 0.4, type: "spring", damping: 20 }}
      />
    </motion.div>
  );
};

const FilterButton = ({ active, onClick, children, icon: Icon }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <MotionButton
    onClick={onClick}
    className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
      active 
        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg' 
        : 'bg-white/80 backdrop-blur-md text-gray-700 border border hover:bg-white hover:border-teal-300'
    }`}
    whileHover={{ 
      scale: 1.05,
      boxShadow: active 
        ? "0 8px 20px -3px rgba(20, 184, 166, 0.4)" 
        : "0 4px 12px -2px rgba(0, 0, 0, 0.1)"
    }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </div>
  </MotionButton>
);

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState('All Projects');
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

  const projects = [
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
      title: "E-commerce Website Testing",
      category: "QA ENGINEERING",
      year: "2025",
      description: "A comprehensive testing framework for e-commerce platforms with automated test suites for product listings, checkout flows, and payment processing. Includes performance testing and accessibility validation.",
      tags: ["JIRA", "ZEPHYR", "AUTOMATION", "CYPRESS"],
      githubUrl: "https://github.com/n1ml03/Website-Testing",
      demoUrl: "https://github.com/n1ml03/Website-Testing",
      status: "featured" as const,
      difficulty: "advanced" as const
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
      title: "Point of Sale (POS) System",
      category: "FULL-STACK DEVELOPMENT",
      year: "2025",
      description: "A modern POS system built with React and TypeScript featuring real-time inventory management, sales analytics, and payment processing integration.",
      tags: ["REACT", "TYPESCRIPT", "POSTGRESQL", "NODE.JS"],
      githubUrl: "https://github.com/n1ml03/nexus-checkout-system",
      demoUrl: "https://nexus-checkout-system.vercel.app/",
      status: "completed" as const,
      difficulty: "intermediate" as const
    },
    {
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000",
      title: "Customer Behavior Analysis",
      category: "Data Analytics",
      year: "2024",
      description: "Advanced data mining project analyzing customer behavior patterns using machine learning algorithms and statistical analysis for business insights.",
      tags: ["PYTHON", "PANDAS", "NUMPY", "MATPLOTLIB", "SEABORN"],
      githubUrl: "https://github.com/n1ml03/Project-Data-Mining",
      demoUrl: "https://github.com/n1ml03/Project-Data-Mining",
      status: "completed" as const,
      difficulty: "advanced" as const
    }
  ];

  const filters = [
    { name: 'All Projects', icon: Layers },
    { name: 'Frontend', icon: Code },
    { name: 'Backend', icon: Layers },
    { name: 'QA Engineering', icon: Target },
    { name: 'Data Analytics', icon: Eye }
  ];

  return (
    <section className="relative w-full h-full">
      <motion.section 
        id="projects" 
        className="py-24 relative overflow-hidden"
        style={!isLowPerformanceDevice && !prefersReducedMotion ? { y } : {}}
      >
        {/* Simplified background */}
        <div className="absolute inset-0 -z-10">
          {/* Static gradient background for better performance */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.12) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%)'
            }}
          />
          
          {/* Minimal decorative elements - only for high performance devices */}
          {!isLowPerformanceDevice && !prefersReducedMotion && (
            <>
              <div className="absolute top-32 right-16 w-48 h-48 rounded-full bg-gradient-to-tr from-blue-100/15 to-purple-100/15 backdrop-blur-sm border border-white/10" />
              <div className="absolute bottom-32 left-16 w-36 h-36 rounded-2xl bg-gradient-to-tr from-teal-100/15 to-green-100/15 backdrop-blur-sm border border-white/10" />
            </>
          )}
        </div>

        <div className="container mx-auto px-4">
          {/* Simplified section header */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              className="inline-flex items-center mb-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge 
                variant="outline" 
                className="px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-teal-200/50 text-teal-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Portfolio Showcase
              </Badge>
            </motion.div>

            <motion.h2
              className="text-5xl lg:text-6xl font-bold mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600">
                Featured Projects
              </span>
              <motion.div 
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: 128 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                viewport={{ once: true }}
              />
            </motion.h2>

            <motion.p
              className="text-gray-600 text-xl leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              A selection of my recent work across frontend, backend, and quality assurance projects.
              Each project demonstrates my 
              <span className="text-teal-600 font-semibold"> technical skills and problem-solving approach</span>.
            </motion.p>
          </div>

          {/* Enhanced project filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {filters.map((filter, index) => (
              <FilterButton
                key={filter.name}
                active={activeFilter === filter.name}
                onClick={() => setActiveFilter(filter.name)}
                icon={filter.icon}
              >
                {filter.name}
              </FilterButton>
            ))}
          </motion.div>

          {/* Enhanced Projects Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} index={index} />
            ))}
          </motion.div>

          {/* Simplified stats section */}
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-lg mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Code, number: "5+", label: "Projects Completed", color: "text-teal-600" },
                { icon: Award, number: "1+", label: "Years Experience", color: "text-blue-600" },
                { icon: Zap, number: "100%", label: "Client Satisfaction", color: "text-purple-600" },
                { icon: Target, number: "8+", label: "Technologies", color: "text-green-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={!prefersReducedMotion ? { scale: 1.02, y: -2 } : {}}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center ${stat.color}`}>
                    {(() => {
                      const IconComponent = stat.icon;
                      return <IconComponent className="w-8 h-8" />;
                    })()}
                  </div>
                  <motion.div 
                    className={`text-3xl font-bold mb-2 ${stat.color}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced View more projects button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <MotionButton
              onClick={() => window.location.href = '/projects'}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-2xl px-8 py-4 text-sm font-semibold inline-flex items-center shadow-lg hover:shadow-xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 30px -5px rgba(20, 184, 166, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Layers className="mr-3 h-5 w-5" />
              View All Projects
              <ArrowUpRight className="ml-3 h-5 w-5" />
            </MotionButton>
          </motion.div>
        </div>
      </motion.section>
    </section>
  );
};

export default ProjectsSection;
