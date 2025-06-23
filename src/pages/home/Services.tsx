import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import {
  Code,
  Server,
  TestTube,
  GitBranch,
  CheckCircle,
  Calendar,
  MessageCircle,
  ArrowRight,
  Star,
  Monitor,
  Smartphone,
  Cloud,
  Shield,
  Rocket,
  Target,
  Award,
  Clock,
  Eye,
  PenTool,
  Settings,
  Sparkles,
  Play,
  Quote} from 'lucide-react';

interface ServiceDetailProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  pricing: {
    basic: number;
    premium: number;
    enterprise: string;
  };
  deliverables: string[];
  timeline: string;
  complexity: 'simple' | 'medium' | 'complex';
}

const ServiceDetail = ({ service, onClose }: { service: ServiceDetailProps; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-teal-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
        
        <div className="relative p-8">
          {/* Enhanced Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mr-6 shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {service.icon}
              </motion.div>
              <div>
                <motion.h2 
                  className="text-3xl font-bold text-gray-800 mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {service.title}
                </motion.h2>
                <Badge 
                  variant={service.complexity === 'simple' ? 'secondary' : service.complexity === 'medium' ? 'default' : 'destructive'}
                  className="text-sm px-3 py-1"
                >
                  {service.complexity === 'simple' ? 'Simple' : service.complexity === 'medium' ? 'Medium' : 'Complex'}
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="rounded-full w-10 h-10 hover:bg-red-50 hover:text-red-500 text-xl font-light"
            >
              ×
            </Button>
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="text-gray-600 text-lg leading-relaxed mb-8 bg-white/50 p-6 rounded-2xl border border-teal-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {service.description}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Features & Technologies */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/70 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-teal-500 rounded-full mr-3 mt-2 group-hover:scale-150 transition-transform" />
                      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="text-teal-600 border-teal-200 bg-teal-50/50 px-3 py-1 hover:bg-teal-100 transition-colors"
                      >
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Timeline
                </h3>
                <p className="text-gray-600 text-lg font-medium">{service.timeline}</p>
              </div>
            </motion.div>

            {/* Enhanced Pricing & Deliverables */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Pricing Packages
                </h3>
                <div className="space-y-3">
                  <motion.div 
                    className="flex justify-between items-center p-4 rounded-xl bg-white/80 border border-teal-100"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div>
                      <span className="font-semibold text-gray-800">Basic Package</span>
                      <p className="text-sm text-gray-500">Essential features</p>
                    </div>
                    <span className="text-xl font-bold text-teal-600">${service.pricing.basic.toLocaleString()}</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white relative overflow-hidden"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-400 text-yellow-900">Most Popular</Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Premium Package</span>
                      <p className="text-sm text-teal-100">Advanced features + support</p>
                    </div>
                    <span className="text-xl font-bold">${service.pricing.premium.toLocaleString()}</span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center p-4 rounded-xl bg-white/80 border border-teal-100"
                    whileHover={{ scale: 1.02, x: 5 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div>
                      <span className="font-semibold text-gray-800">Enterprise</span>
                      <p className="text-sm text-gray-500">Custom solutions</p>
                    </div>
                    <span className="text-xl font-bold text-teal-600">{service.pricing.enterprise}</span>
                  </motion.div>
                </div>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  What You'll Receive
                </h3>
                <ul className="space-y-3">
                  {service.deliverables.map((deliverable, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{deliverable}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Enhanced CTA */}
          <motion.div 
            className="mt-8 pt-6 border-t border-teal-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button 
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl shadow-lg font-semibold"
                  onClick={() => window.location.href = '/contact-form'}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Your Project
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-teal-200 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl font-semibold"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Free Consultation
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServiceCard = ({ service, onClick, index }: { service: ServiceDetailProps; onClick: () => void; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px -12px rgba(20, 184, 166, 0.15)",
        borderColor: "rgba(20, 184, 166, 0.3)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-white to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Animated decorative elements */}
      <motion.div 
        className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full"
        animate={isHovered ? { 
          scale: 1.2, 
          opacity: 0.6,
          rotate: 30 
        } : { 
          scale: 1, 
          opacity: 0.3,
          rotate: 0 
        }}
        transition={{ duration: 0.4, type: "spring", damping: 20 }}
      />
      <motion.div 
        className="absolute -left-8 -bottom-8 w-20 h-20 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full"
        animate={isHovered ? { 
          scale: 1.1, 
          opacity: 0.5,
          rotate: -20 
        } : { 
          scale: 1, 
          opacity: 0.2,
          rotate: 0 
        }}
        transition={{ duration: 0.3, type: "spring", damping: 25 }}
      />

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg"
            whileHover={{ 
              scale: 1.1, 
              rotate: 10,
              boxShadow: "0 8px 20px -3px rgba(20, 184, 166, 0.4)"
            }}
            transition={{ type: "spring", damping: 15 }}
          >
            {service.icon}
          </motion.div>
          <Badge 
            variant={service.complexity === 'simple' ? 'secondary' : service.complexity === 'medium' ? 'default' : 'destructive'}
            className="px-3 py-1 font-medium"
          >
            {service.complexity === 'simple' ? 'Simple' : service.complexity === 'medium' ? 'Medium' : 'Complex'}
          </Badge>
        </div>

        {/* Enhanced Content */}
        <motion.h3 
          className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-700 transition-colors duration-300"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {service.title}
        </motion.h3>
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
          {service.description}
        </p>

        {/* Enhanced Technologies preview */}
        <div className="flex flex-wrap gap-2 mb-6">
          {service.technologies.slice(0, 3).map((tech, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <Badge 
                variant="outline" 
                className="text-xs text-teal-600 border-teal-200 bg-teal-50/70 hover:bg-teal-100 transition-colors"
              >
                {tech}
              </Badge>
            </motion.div>
          ))}
          {service.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs text-gray-500 bg-gray-50">
              +{service.technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Enhanced Pricing preview */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Starting from 
            <div className="text-xl font-bold text-teal-600 leading-tight">
              ${service.pricing.basic.toLocaleString()}
            </div>
          </div>
          <motion.div 
            className="flex items-center text-teal-600 font-semibold bg-teal-50 px-3 py-2 rounded-full"
            animate={isHovered ? { x: 5 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            View Details 
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.div>
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
  return (
    <div className="relative">
      <motion.div
        className="flex flex-col items-center text-center p-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        <div className="relative mb-6">
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl shadow-lg"
            whileHover={{ 
              scale: 1.1, 
              rotate: 360,
              boxShadow: "0 12px 30px -5px rgba(20, 184, 166, 0.4)"
            }}
            transition={{ type: "spring", damping: 15, duration: 0.8 }}
          >
            {step.icon}
          </motion.div>
          <motion.div 
            className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2 + 0.3, type: "spring", damping: 15 }}
          >
            {index + 1}
          </motion.div>
        </div>
        <motion.h3 
          className="text-xl font-semibold text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.4 }}
        >
          {step.title}
        </motion.h3>
        <motion.p 
          className="text-gray-600 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.5 }}
        >
          {step.description}
        </motion.p>
      </motion.div>
      
      {/* Connection line to next step */}
      {!isLast && (
        <motion.div
          className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-teal-300 to-teal-200 -translate-y-1/2 z-0"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.6 }}
          viewport={{ once: true }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }: { 
  testimonial: { 
    name: string; 
    role: string; 
    company: string; 
    content: string; 
    rating: number; 
    avatar: string;
    hasVideo?: boolean;
  }; 
  index: number 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden"
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -6,
        boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Decorative background */}
      <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-50 rounded-full opacity-50" />
      
      <div className="relative z-10">
        {/* Stars with animation */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + i * 0.1, type: "spring", damping: 15 }}
            >
              <Star 
                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            </motion.div>
          ))}
        </div>

        {/* Quote icon */}
        <Quote className="w-6 h-6 text-teal-200 mb-4" />
        
        {/* Content */}
        <p className="text-gray-600 mb-6 italic leading-relaxed">
          "{testimonial.content}"
        </p>
        
        {/* Author info with enhanced styling */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold mr-4 shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              {testimonial.avatar}
            </motion.div>
            <div>
              <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
              <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
            </div>
          </div>
          
          {/* Video play button */}
          {testimonial.hasVideo && (
            <motion.button
              className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-teal-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="w-4 h-4 ml-1" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};



const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetailProps | null>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 50]);

  const services: ServiceDetailProps[] = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Frontend Development",
      description: "Building modern, responsive and highly interactive user interfaces with advanced frameworks like React, Vue.js. Optimizing user experience and ensuring the best performance.",
      features: [
        "Responsive design for all devices",
        "Interactive interfaces with smooth animations",
        "Performance and loading speed optimization",
        "Accessibility standards compliance",
        "API integration and state management",
        "Cross-browser compatibility"
      ],
      technologies: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Next.js", "Vite", "Framer Motion"],
      pricing: { basic: 2500, premium: 5000, enterprise: "Contact" },
      deliverables: [
        "Complete source code",
        "Technical documentation",
        "Deployment guide",
        "Testing suite",
        "Performance report",
        "3 months free support"
      ],
      timeline: "2-6 weeks",
      complexity: "medium"
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: "Backend Development", 
      description: "Building powerful, secure and highly scalable backend systems with Node.js, Express and modern cloud technologies. Ensuring stable APIs and high performance.",
      features: [
        "RESTful API and GraphQL",
        "Database design and optimization",
        "Authentication/authorization systems",
        "Microservices architecture",
        "Real-time communication",
        "Monitoring and logging"
      ],
      technologies: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "AWS", "Docker"],
      pricing: { basic: 3000, premium: 6000, enterprise: "Contact" },
      deliverables: [
        "Complete API documentation",
        "Database schema",
        "Docker containers",
        "CI/CD pipeline",
        "Security audit report",
        "6 months free support"
      ],
      timeline: "3-8 weeks",
      complexity: "complex"
    },
    {
      icon: <TestTube className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Implementing comprehensive testing strategies with automation testing, performance testing and security testing. Ensuring perfect product quality and user experience.",
      features: [
        "Automated testing framework",
        "Unit & Integration testing", 
        "End-to-end testing",
        "Performance & Load testing",
        "Security vulnerability assessment",
        "Continuous testing pipeline"
      ],
      technologies: ["Jest", "Cypress", "Playwright", "K6", "SonarQube", "OWASP ZAP"],
      pricing: { basic: 1500, premium: 3500, enterprise: "Contact" },
      deliverables: [
        "Test automation suite",
        "Test coverage report",
        "Performance metrics",
        "Security scan results",
        "Bug tracking system setup",
        "QA process documentation"
      ],
      timeline: "2-4 weeks",
      complexity: "medium"
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "CI/CD Implementation",
      description: "Setting up complete automated CI/CD workflows to accelerate development speed, ensure code quality and deploy applications reliably.",
      features: [
        "Automated build processes",
        "Continuous integration setup",
        "Deployment automation", 
        "Infrastructure as Code",
        "Multi-environment management",
        "Rollback strategies"
      ],
      technologies: ["GitHub Actions", "Jenkins", "Docker", "Kubernetes", "Terraform", "AWS"],
      pricing: { basic: 2000, premium: 4500, enterprise: "Contact" },
      deliverables: [
        "CI/CD pipeline setup",
        "Infrastructure templates",
        "Deployment scripts",
        "Environment configurations", 
        "Monitoring dashboards",
        "Process documentation"
      ],
      timeline: "1-3 weeks",
      complexity: "simple"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile App Development",
      description: "Developing native and cross-platform mobile applications with high performance, beautiful interfaces and optimal user experience for iOS and Android.",
      features: [
        "Native iOS & Android development",
        "Cross-platform with React Native",
        "Offline-first architecture",
        "Push notifications",
        "App store optimization",
        "Analytics & crash reporting"
      ],
      technologies: ["React Native", "Swift", "Kotlin", "Expo", "Firebase", "AppCenter"],
      pricing: { basic: 4000, premium: 8000, enterprise: "Contact" },
      deliverables: [
        "Mobile app source code",
        "App store assets",
        "Deployment guide",
        "Testing documentation",
        "Analytics setup", 
        "6 months free support"
      ],
      timeline: "4-10 weeks",
      complexity: "complex"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud Infrastructure",
      description: "Designing and deploying scalable, secure and cost-effective cloud infrastructure on AWS, Azure or Google Cloud. Optimizing performance and ensuring high availability.",
      features: [
        "Cloud architecture design",
        "Auto-scaling configuration",
        "Load balancing setup",
        "Backup & disaster recovery",
        "Security & compliance",
        "Cost optimization"
      ],
      technologies: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "CloudFormation"],
      pricing: { basic: 3500, premium: 7000, enterprise: "Contact" },
      deliverables: [
        "Infrastructure diagrams",
        "Terraform/CloudFormation templates",
        "Security configurations",
        "Monitoring setup",
        "Cost optimization report",
        "12 months free support"
      ],
      timeline: "2-6 weeks", 
      complexity: "complex"
    }
  ];

  const processSteps = [
    {
      icon: <MessageCircle />,
      title: "Discovery & Consultation",
      description: "We dive deep into your requirements, analyze your business goals, and recommend the optimal solution within your budget."
    },
    {
      icon: <PenTool />,
      title: "Design & Planning",
      description: "Creating detailed wireframes, mockups, and comprehensive development roadmap with clear milestones and timelines."
    },
    {
      icon: <Code />,
      title: "Development & Iteration",
      description: "Agile development with best practices, regular updates, and interactive demos to ensure we're aligned with your vision."
    },
    {
      icon: <TestTube />,
      title: "Testing & Quality Assurance",
      description: "Comprehensive testing including functionality, performance, security, and user experience optimization."
    },
    {
      icon: <Rocket />,
      title: "Launch & Ongoing Support",
      description: "Smooth production deployment, comprehensive training, and dedicated long-term support and maintenance."
    }
  ];

  const enhancedTestimonials = [
    {
      name: "John Smith",
      role: "CTO",
      company: "TechCorp Solutions",
      content: "The backend system Nam developed for us exceeded all expectations. Outstanding performance, rock-solid stability, and exceptional ongoing support.",
      rating: 5,
      avatar: "JS",
      hasVideo: true
    },
    {
      name: "Sarah Johnson", 
      role: "Product Manager",
      company: "InnovateLab",
      content: "The frontend project was delivered ahead of schedule with quality that surpassed our expectations. Incredibly professional team!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "FutureScale",
      content: "The CI/CD pipeline Nam implemented transformed our deployment process, reducing time-to-market by 70%. Game-changing results!",
      rating: 5,
      avatar: "MC",
      hasVideo: true
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-30"
        style={{ y: y2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-100 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <Header />

      {/* Enhanced Service Detail Modal - moved outside main for proper centering */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetail
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
      
      <main className="pt-20 z-10"> {/* removed relative here */}
        {/* Enhanced Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
            >
              {/* Floating badge */}
              <motion.div
                className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-teal-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-teal-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Professional Development Services</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Professional{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Services
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                From concept to execution, we provide comprehensive technology solutions 
                to elevate your business to new heights.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
                  onClick={() => window.location.href = '/contact-form'}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Start Free Consultation
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" 
                  className="border-2 border-teal-200 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl font-semibold"
                  onClick={() => window.location.href = '/home'}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Explore Portfolio
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Services Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">Services</span>
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Deep expertise in every field, delivering optimal solutions for all your needs.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  service={service}
                  onClick={() => setSelectedService(service)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Process Section */}
        <section className="py-24 bg-white/40 backdrop-blur-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/30 to-blue-50/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">Process</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                A proven, systematic approach that ensures exceptional results and client satisfaction at every step.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
              {processSteps.map((step, index) => (
                <ProcessStep 
                  key={index} 
                  step={step} 
                  index={index} 
                  isLast={index === processSteps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "100+", label: "Projects Delivered", icon: <Rocket className="w-6 h-6" /> },
                { number: "99%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
                { number: "24/7", label: "Support Available", icon: <Shield className="w-6 h-6" /> },
                { number: "1+", label: "Years Experience", icon: <Award className="w-6 h-6" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: "spring", damping: 25 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="py-24 bg-white/40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Client <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">Testimonials</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Don't just take our word for it. Here's what our satisfied clients have to say about their experience with us.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enhancedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>


        {/* Enhanced CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-blue-500"
            animate={{ 
              background: [
                "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #3b82f6 100%)",
                "linear-gradient(135deg, #14b8a6 0%, #3b82f6 50%, #0d9488 100%)",
                "linear-gradient(135deg, #3b82f6 0%, #0d9488 50%, #14b8a6 100%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Floating elements */}
          <motion.div 
            className="absolute top-16 left-16 w-24 h-24 bg-white/10 rounded-full"
            animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-16 right-16 w-20 h-20 bg-white/10 rounded-full"
            animate={{ y: [0, 15, 0], x: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ready to Build Something
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                  Extraordinary?
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Let's discuss your project and create a solution that exceeds your expectations. 
                Get started with a free consultation today.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold shadow-lg"
                    onClick={() => window.location.href = '/contact-form'}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Your Project
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;