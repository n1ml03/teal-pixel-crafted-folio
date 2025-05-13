
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Server,
  TestTube,
  GitBranch,
  CheckCircle,
  Layers,
  Zap
} from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  features: string[];
  number: string;
  index: number;
  iconComponent: React.ReactNode;
}

const ServiceCard = ({ title, description, features, number, index, iconComponent }: ServiceCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(20, 184, 166, 0.3)"
      }}
    >
      {/* Background decoration */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-teal-50 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

      {/* Number indicator */}
      <div className="absolute top-6 right-6 text-5xl font-bold text-gray-50 select-none">
        {number}
      </div>

      <div className="relative">
        {/* Icon and title */}
        <div className="flex items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mr-4 shadow-sm">
            {iconComponent}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mt-3">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-6">{description}</p>

        {/* Features list */}
        <div className="space-y-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ServicesSection = () => {
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
      number: "04"
    }
  ];

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-4xl font-bold mb-4 text-gray-800 relative inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
              My Services
            </span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></div>
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Specialized in both development and quality assurance, I offer end-to-end solutions
            to help bring your digital ideas to life with quality and precision.
          </motion.p>
        </div>

        {/* Services grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center space-x-8 py-6 px-8 bg-teal-50 rounded-2xl">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-teal-600 mr-2" />
              <span className="text-gray-700 font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center">
              <Layers className="w-5 h-5 text-teal-600 mr-2" />
              <span className="text-gray-700 font-medium">Modern Stack</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-teal-600 mr-2" />
              <span className="text-gray-700 font-medium">Quality Focused</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
