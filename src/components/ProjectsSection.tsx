import { ArrowUpRight, GithubIcon, ExternalLink, Calendar, Code, Layers } from "lucide-react";
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { MotionButton } from "@/components/ui/motion-button";


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
  index
}: ProjectCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:border-teal-200 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
      }}
    >
      {/* Image container with overlay */}
      <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Project links */}
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
              aria-label="View GitHub Repository"
            >
              <GithubIcon size={18} />
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500/90 hover:bg-teal-500 text-white p-2 rounded-full transition-colors"
              aria-label="View Live Demo"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-700 hover:bg-white px-3 py-1 text-xs font-medium"
          >
            {category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>{year}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">{title}</h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1.5"></span>
              {tag}
            </span>
          ))}
        </div>

        {/* View project button */}
        <div className="pt-2 border-t border-gray-100">
          <motion.a
            href={githubUrl || "#"}
            target={githubUrl ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-600 font-medium text-sm"
            whileHover={{ x: 5 }}
          >
            View Project <ArrowUpRight className="ml-1 w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const projects = [
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
      title: "E-commerce Website Testing",
      category: "QA ENGINEERING",
      year: "2025",
      description: "A comprehensive testing framework for e-commerce platforms with automated test suites for product listings, checkout flows, and payment processing.",
      tags: ["JIRA", "ZEPHYR", "AUTOMATION"],
      githubUrl: "https://github.com/n1ml03/Website-Testing",
      demoUrl: "https://github.com/n1ml03/Website-Testing"
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
      title: "Point of Sale (POS) System",
      category: "FULL-STACK DEVELOPMENT",
      year: "2025",
      description: "A responsive admin dashboard built with React and TypeScript featuring data visualization, user management, and real-time analytics.",
      tags: ["REACT", "TYPESCRIPT", "POSTGRESSQL"],
      githubUrl: "https://github.com/n1ml03/nexus-checkout-system",
      demoUrl: "https://nexus-checkout-system.vercel.app/"
    },
    {
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000",
      title: "Customer Behavior Analysis",
      category: "Data Analytics",
      year: "2024",
      description: "A Node.js application for monitoring API endpoints, tracking performance metrics, and sending alerts when services experience downtime.",
      tags: ["PYTHON", "PANDAS", "NUMPY", "MATPLOTLIB", "SEABORN"],
      githubUrl: "https://github.com/n1ml03/Project-Data-Mining",
      demoUrl: "https://github.com/n1ml03/Project-Data-Mining"
    }
  ];

  return (
    <section id="projects" className="py-24">
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
              Featured Projects
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
            A selection of my recent work across frontend, backend, and quality assurance projects.
            Each project demonstrates my technical skills and problem-solving approach.
          </motion.p>
        </div>

        {/* Project filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <MotionButton
            className="bg-teal-600 text-white rounded-full px-5 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Projects
          </MotionButton>
          <MotionButton
            className="bg-white text-gray-700 rounded-full px-5 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Frontend
          </MotionButton>
          <MotionButton
            className="bg-white text-gray-700 rounded-full px-5 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Backend
          </MotionButton>
          <MotionButton
            className="bg-white text-gray-700 rounded-full px-5 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            QA Engineering
          </MotionButton>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} index={index} />
          ))}
        </motion.div>

        {/* View more projects button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <MotionButton
            onClick={() => window.location.href = '/projects'}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-full px-8 py-3 text-sm font-medium inline-flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Layers className="mr-2 h-4 w-4" />
            View All Projects
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </MotionButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
