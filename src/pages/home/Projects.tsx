import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { Project } from '@/types/project.ts';
import { projects } from '@/data/projects.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import {
  Search,
  Calendar,
  Code,
  ArrowRight,
  ExternalLink,
  Filter,
  Sparkles,
  Bookmark,
  Eye,
  FolderSearch} from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Get all unique tags from projects

  // Filter projects based on search query, category, and tags
  useEffect(() => {
    let result = projects;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter(project => project.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(project =>
        selectedTags.every(tag => project.tags.includes(tag))
      );
    }

    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, selectedTags]);

  // Toggle tag selection

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen relative">
      {/* Global background with parallax effect */}
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      <Header />

      <main id="main-content" className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge
                variant="secondary"
                className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium items-center"
              >
                <Sparkles className="w-4 h-4 mr-2 text-teal-500" />
                DEV DIGEST
              </Badge>
              <motion.h1
                className="text-5xl md:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                  Projects Showcase
                </span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Explore my portfolio in QA, full-stack development, and data analytics—showcasing my skills, problem-solving, and attention to detail.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                className="relative max-w-xl mx-auto mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 py-6 rounded-full border-gray-200 focus:border-teal-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Projects grid with enhanced styling */}
            <div className="max-w-7xl mx-auto">
              {filteredProjects.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}>
                  {filteredProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-20 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-70"></div>

                    <motion.div
                      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-12 relative overflow-hidden"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 bg-repeat opacity-5"></div>

                      <motion.div
                        className="text-gray-400 mb-6 bg-gray-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto"
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      >
                        <FolderSearch className="h-12 w-12 text-teal-500" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Projects Found</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        We couldn't find any projects matching your current filters. Try adjusting your search criteria or reset all filters.
                      </p>

                      <MotionButton
                        onClick={resetFilters}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl px-8 py-3 shadow-md"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Filter className="mr-2 h-5 w-5" />
                        Reset All Filters
                      </MotionButton>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>
      

      <Footer />
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:border-teal-300 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -10,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
    >
      {/* Image container with overlay */}
      <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
        <img
          src={project.images.main}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay that's always visible but intensifies on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-repeat opacity-10 mix-blend-overlay"></div>

        {/* Project links */}
        <div className="absolute bottom-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          {project.links.github && (
            <motion.a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full transition-colors shadow-lg hover:shadow-xl"
              aria-label="View GitHub Repository"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Code size={18} />
            </motion.a>
          )}
          {project.links.demo && (
            <motion.a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-500/90 hover:bg-teal-500 text-white p-2.5 rounded-full transition-colors shadow-lg hover:shadow-xl"
              aria-label="View Live Demo"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLink size={18} />
            </motion.a>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <motion.span
            className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-md border border-white/20 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-3 h-3 mr-1.5 text-teal-500" />
            {project.category}
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 relative">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full opacity-50"></div>

        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
          <span>{project.year}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">{project.title}</h3>

        <p className="text-gray-600 text-sm mb-5 line-clamp-2 relative z-10">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.slice(0, 3).map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center border border-teal-100/50"
              whileHover={{ scale: 1.05, backgroundColor: "#99f6e4" }}
            >
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1.5"></span>
              {tag}
            </motion.span>
          ))}
          {project.tags.length > 3 && (
            <motion.span
              className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-100/50"
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            >
              +{project.tags.length - 3} more
            </motion.span>
          )}
        </div>

        {/* Action footer */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center text-teal-600 font-medium text-sm group"
          >
            View Project Details
            <motion.span
              className="ml-1 inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>

          <div className="flex space-x-2">
            <motion.button
              className="text-gray-400 hover:text-teal-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="View project"
            >
              <Eye size={18} />
            </motion.button>
            <motion.button
              className="text-gray-400 hover:text-teal-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Save project"
            >
              <Bookmark size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
