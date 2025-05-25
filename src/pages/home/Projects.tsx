import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Project } from '@/types/project.ts';
import { projects } from '@/data/projects.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import {
  Search,
  Code,
  ArrowRight,
  ExternalLink,
  Filter,
  Sparkles,
  Bookmark,
  Eye,
  FolderSearch,
  Star,
  Award,
  MessageCircle,
  ChevronDown,
  Quote,
  Github,
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Enhanced Category Filter Component
const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: { 
  categories: string[]; 
  selectedCategory: string | null; 
  onCategoryChange: (category: string | null) => void; 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null
            ? 'bg-teal-500 text-white shadow-lg'
            : 'bg-white/80 text-gray-600 hover:bg-teal-50 border border-gray-200'
        }`}
        onClick={() => onCategoryChange(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        All Projects
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category
              ? 'bg-teal-500 text-white shadow-lg'
              : 'bg-white/80 text-gray-600 hover:bg-teal-50 border border-gray-200'
          }`}
          onClick={() => onCategoryChange(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

// Enhanced Stats Component
const ProjectStats = () => {
  const stats = [
    { number: "15+", label: "Projects Completed", icon: <Rocket className="w-5 h-5" /> },
    { number: "100%", label: "Client Satisfaction", icon: <Star className="w-5 h-5" /> },
    { number: "5+", label: "Technologies Used", icon: <Code className="w-5 h-5" /> },
    { number: "3+", label: "Years Experience", icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1, type: "spring", damping: 25 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {stat.icon}
          </motion.div>
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-1">
            {stat.number}
          </div>
          <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const Projects = () => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 50]);

  // Get all unique categories and tags
  const categories = Array.from(new Set(projects.map(project => project.category)));

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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

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

      <main className="pt-20 relative z-10">
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
                <span className="text-sm font-medium text-gray-700">Project Portfolio & Showcase</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Project{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Showcase
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
                Explore my portfolio in QA, full-stack development, and data analytics—showcasing 
                problem-solving skills, technical expertise, and attention to detail.
              </motion.p>

              {/* Enhanced Search Bar */}
              <motion.div
                className="relative max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Input
                  type="text"
                  placeholder="Search projects by name, technology, or category..."
                  className="pl-12 pr-4 py-4 rounded-2xl border-gray-200 focus:border-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white/20">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Filter by Category</h3>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {filteredProjects.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
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
                    <motion.div
                      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-12 relative overflow-hidden"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
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

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={resetFilters}
                          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl px-8 py-3 shadow-lg"
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Reset All Filters
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Project Stats */}
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
                Project <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">Achievements</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Numbers that reflect the quality and impact of my work
              </p>
            </motion.div>
            <ProjectStats />
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
                Ready to Start Your
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                  Next Project?
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Let's collaborate to bring your ideas to life with quality, precision, and innovative solutions.
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
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start a Project
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
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
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

// Enhanced ProjectCard Component
const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500"
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
    >
      {/* Enhanced Image container */}
      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
        <img
          src={project.images.main}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Project links with enhanced styling */}
        <div className="absolute bottom-4 right-4 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          {project.links.github && (
            <motion.a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full transition-colors shadow-lg hover:shadow-xl backdrop-blur-sm"
              aria-label="View GitHub Repository"
              whileHover={{ scale: 1.1, y: -2 }}
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
              className="bg-teal-500/95 hover:bg-teal-500 text-white p-3 rounded-full transition-colors shadow-lg hover:shadow-xl backdrop-blur-sm"
              aria-label="View Live Demo"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLink size={18} />
            </motion.a>
          )}
        </div>

        {/* Enhanced category badge */}
        <div className="absolute top-4 left-4">
          <motion.span
            className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-4 py-2 rounded-full font-medium shadow-lg border border-white/20 flex items-center"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Sparkles className="w-3 h-3 mr-2 text-teal-500" />
            {project.category}
          </motion.span>
        </div>

        {/* Year badge */}
        <div className="absolute top-4 right-4">
          <motion.span
            className="bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            {project.year}
          </motion.span>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-8 relative">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full opacity-50" />

        <motion.h3 
          className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {project.title}
        </motion.h3>

        <p className="text-gray-600 text-sm mb-6 line-clamp-2 relative z-10 leading-relaxed">
          {project.description}
        </p>

        {/* Enhanced tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.slice(0, 3).map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center border border-teal-100/50 hover:bg-teal-100 transition-colors"
              whileHover={{ scale: 1.05, y: -1 }}
            >
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2" />
              {tag}
            </motion.span>
          ))}
          {project.tags.length > 3 && (
            <motion.span
              className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-100/50 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05, y: -1 }}
            >
              +{project.tags.length - 3} more
            </motion.span>
          )}
        </div>

        {/* Enhanced action footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center text-teal-600 font-semibold text-sm group/link hover:text-teal-700 transition-colors"
          >
            View Details
            <motion.span
              className="ml-2 inline-block"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>

          <div className="flex space-x-2">
            <motion.button
              className="text-gray-400 hover:text-teal-500 transition-colors p-1 rounded-full hover:bg-teal-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="View project"
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              className="text-gray-400 hover:text-teal-500 transition-colors p-1 rounded-full hover:bg-teal-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Save project"
            >
              <Bookmark size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;

