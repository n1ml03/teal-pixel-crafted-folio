import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { getProjectBySlug, getRelatedProjects } from '@/data/projects.ts';
import { Project } from '@/types/project.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import SocialActions from '@/components/ui/social-actions.tsx';
import {
  Calendar,
  ArrowLeft,
  Tag as TagIcon,
  Layers,
  CheckCircle2,
  XCircle,
  LightbulbIcon,
  ArrowRight,
  Star,
  Github,
  Play,
  Eye,
  Zap,
  Target,
  Rocket,
  Settings,
  TrendingUp
} from 'lucide-react';
import { toast } from "sonner";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);


  // Enhanced scroll animation controls
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (slug) {
      const projectData = getProjectBySlug(slug);
      if (projectData) {
        setProject(projectData);
        setRelatedProjects(getRelatedProjects(projectData.id));
      }
    }
  }, [slug]);

  // Handle image navigation
  const nextImage = () => {
    if (project) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === project.images.gallery.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (project) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? project.images.gallery.length - 1 : prevIndex - 1
      );
    }
  };

  // Load and save ratings
  useEffect(() => {
    if (project) {
      // Load ratings from localStorage
      const ratingsKey = `projectRatings_${project.id}`;
      const storedRatings = JSON.parse(localStorage.getItem(ratingsKey) || '{"ratings":[], "userRating": null}');

      // Set user's previous rating if exists
      setUserRating(storedRatings.userRating);

      // Calculate average rating
      if (storedRatings.ratings.length > 0) {
        const sum = storedRatings.ratings.reduce((a: number, b: number) => a + b, 0);
        setAverageRating(parseFloat((sum / storedRatings.ratings.length).toFixed(1)));
        setRatingCount(storedRatings.ratings.length);
      } else {
        setAverageRating(0);
        setRatingCount(0);
      }
    }
  }, [project]);

  // Handle user rating
  const handleRating = (rating: number) => {
    if (!project) return;

    const ratingsKey = `projectRatings_${project.id}`;
    const storedRatings = JSON.parse(localStorage.getItem(ratingsKey) || '{"ratings":[], "userRating": null}');

    // If user already rated, update their rating
    if (storedRatings.userRating !== null) {
      // Find and replace the user's previous rating
      const index = storedRatings.ratings.indexOf(storedRatings.userRating);
      if (index !== -1) {
        storedRatings.ratings[index] = rating;
      }
    } else {
      // Add new rating
      storedRatings.ratings.push(rating);
    }

    // Update user rating
    storedRatings.userRating = rating;

    // Save to localStorage
    localStorage.setItem(ratingsKey, JSON.stringify(storedRatings));

    // Update state
    setUserRating(rating);

    // Recalculate average
    const sum = storedRatings.ratings.reduce((a: number, b: number) => a + b, 0);
    setAverageRating(parseFloat((sum / storedRatings.ratings.length).toFixed(1)));
    setRatingCount(storedRatings.ratings.length);

    toast.success(`You rated this project ${rating} stars!`);
  };

  // Handle like and bookmark actions


  if (!project) {
    return (
      <div className="min-h-screen relative">
        <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />
        <Header />
        <main className="pt-24 pb-16 relative z-0">
          <div className="container mx-auto px-4 text-center py-16">
            <motion.div
              className="text-teal-400 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Layers className="h-20 w-20 mx-auto" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">
                Project Not Found
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              The project you're looking for doesn't exist or has been moved.
            </motion.p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60"
            style={{ y: y1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Project Info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="mb-6 bg-teal-50/80 text-teal-700 hover:bg-teal-100 px-6 py-2 text-sm font-medium border border-teal-100/50 backdrop-blur-sm shadow-sm"
                    >
                      <TagIcon className="w-4 h-4 mr-2" />
                      {project.category}
                    </Badge>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                      {project.title}
                    </span>
                    <motion.div 
                      className="absolute -bottom-4 left-0 w-24 h-1.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: 96 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-600 mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Enhanced Project Meta */}
                  <motion.div
                    className="flex flex-wrap items-center gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-teal-100/50 shadow-sm">
                      <Calendar className="w-5 h-5 text-teal-500 mr-2" />
                      <span className="text-gray-600 font-medium">{project.year}</span>
                    </div>
                    
                    {/* Note: duration and team properties don't exist in Project type - removing these sections */}

                    {averageRating > 0 && (
                      <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-teal-100/50 shadow-sm">
                        <Star className="w-5 h-5 text-yellow-500 mr-2 fill-current" />
                        <span className="text-gray-600 font-medium">{averageRating} ({ratingCount})</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Enhanced Action Buttons */}
                  <motion.div
                    className="flex flex-wrap items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {project.links?.demo && (
                      <motion.a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        View Live Demo
                      </motion.a>
                    )}

                    {project.links?.github && (
                      <motion.a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-white/70 text-gray-700 border border hover:bg-gray-50 hover:text-gray-800 px-8 py-3 rounded-2xl font-semibold backdrop-blur-sm shadow-sm transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-5 h-5 mr-2" />
                        View Code
                      </motion.a>
                    )}

                    <SocialActions
                      contentId={project.id}
                      contentType="project"
                      contentTitle={project.title}
                      contentUrl={`${window.location.origin}/projects/${project.slug}`}
                      className="bg-white/70 backdrop-blur-sm border border hover:bg-teal-50 hover:text-teal-600 rounded-2xl px-6 py-3 shadow-sm transition-all duration-300"
                    />
                  </motion.div>
                </motion.div>

                {/* Enhanced Project Image */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div 
                    className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100 overflow-hidden"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                    
                    <div className="relative">
                      <motion.div 
                        className="rounded-2xl overflow-hidden shadow-xl border border-teal-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      >
                        <img
                          src={project.images?.main}
                          alt={project.title}
                          className="w-full h-auto object-cover cursor-pointer"
                        />
                      </motion.div>

                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Content Sections */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                  
                  {/* Enhanced Overview */}
                  <motion.div 
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-100 relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-teal-50/20 to-blue-50/30 rounded-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mr-6 shadow-lg">
                          <LightbulbIcon className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800">Project Overview</h2>
                          <p className="text-gray-600">The story behind this project</p>
                        </div>
                      </div>

                      <div className="prose prose-lg prose-teal max-w-none">
                        <p className="text-gray-600 leading-relaxed text-lg mb-6">
                          {project.longDescription || project.description}
                        </p>
                        
                        {project.challenges && project.challenges.length > 0 && project.challenges[0] && (
                          <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <Target className="w-6 h-6 text-orange-500 mr-3" />
                              The Challenge
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{project.challenges[0]}</p>
                          </div>
                        )}

                        {project.solutions && project.solutions.length > 0 && project.solutions[0] && (
                          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <Rocket className="w-6 h-6 text-green-500 mr-3" />
                              The Solution
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{project.solutions[0]}</p>
                          </div>
                        )}

                        {project.outcome && (
                          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <TrendingUp className="w-6 h-6 text-blue-500 mr-3" />
                              Results & Impact
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{project.outcome}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Features Section */}
                  {project.features && project.features.length > 0 && (
                    <motion.div 
                      className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-100 relative overflow-hidden"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                      
                      <div className="relative">
                        <div className="flex items-center mb-8">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mr-6 shadow-lg">
                            <Zap className="w-8 h-8" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800">Key Features</h2>
                            <p className="text-gray-600">What makes this project special</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {project.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-teal-100 shadow-sm"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 * index }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.02, y: -2 }}
                            >
                              <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">{feature}</h3>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced Gallery Section */}
                  {project.images?.gallery && project.images.gallery.length > 0 && (
                    <motion.div 
                      className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-100 relative overflow-hidden"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/40 to-white/60 rounded-3xl" />
                      
                      <div className="relative">
                        <div className="flex items-center mb-8">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mr-6 shadow-lg">
                            <Eye className="w-8 h-8" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800">Project Gallery</h2>
                            <p className="text-gray-600">Visual showcase of the project</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {project.images.gallery.map((image, index) => (
                            <motion.div
                              key={index}
                              className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer group"
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.1 * index }}
                              viewport={{ once: true }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {
                                setCurrentImageIndex(index);
                              }}
                            >
                              <img
                                src={image}
                                alt={`${project.title} - Image ${index + 1}`}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                  
                  {/* Enhanced Tech Stack */}
                  <motion.div 
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100 relative overflow-hidden sticky top-32"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mr-4 shadow-lg">
                          <Settings className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Tech Stack</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {project.technologies?.map((tech, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, y: -2 }}
                          >
                            <Badge 
                              variant="outline" 
                              className="text-teal-600 border-teal-200 bg-teal-50/50 px-3 py-2 hover:bg-teal-100 transition-colors"
                            >
                              {tech}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>

                      {/* Enhanced Rating Section */}
                      <div className="mt-8 pt-6 border-t border-teal-100">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <Star className="w-5 h-5 text-yellow-500 mr-2" />
                          Rate this Project
                        </h4>
                        
                        <div className="flex items-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <motion.button
                              key={rating}
                              onClick={() => handleRating(rating)}
                              className="focus:outline-none"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  rating <= (userRating || 0)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300 hover:text-yellow-400'
                                }`}
                              />
                            </motion.button>
                          ))}
                        </div>
                        
                        {averageRating > 0 && (
                          <p className="text-sm text-gray-600">
                            Average: {averageRating}/5 ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-16">
                  <motion.h2 
                    className="text-4xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                      Related Projects
                    </span>
                  </motion.h2>
                  
                  <motion.p 
                    className="text-xl text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Explore more of my work
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((relatedProject, index) => (
                    <motion.div
                      key={relatedProject.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group"
                    >
                      <Link 
                        to={`/projects/${relatedProject.slug}`}
                        className="block h-full"
                      >
                        <motion.div 
                          className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100 h-full relative overflow-hidden"
                          whileHover={{ 
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                            borderColor: "rgb(45 212 191)"
                          }}
                          transition={{ type: "spring", damping: 20 }}
                        >
                          {/* Animated background gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative">
                            {relatedProject.images?.main && (
                              <motion.div 
                                className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                              >
                                <img
                                  src={relatedProject.images.main}
                                  alt={relatedProject.title}
                                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </motion.div>
                            )}

                            <Badge 
                              variant="secondary" 
                              className="mb-4 bg-teal-50 text-teal-700 border border-teal-100"
                            >
                              {relatedProject.category}
                            </Badge>

                            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors">
                              {relatedProject.title}
                            </h3>

                            <p className="text-gray-600 mb-6 line-clamp-3">
                              {relatedProject.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-500">{relatedProject.year}</span>
                              </div>
                              
                              <div className="flex items-center text-teal-600 group-hover:translate-x-2 transition-transform">
                                <span className="mr-2 text-sm font-medium">View Project</span>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {/* Enhanced Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={project.images?.gallery?.[currentImageIndex] || project.images?.main}
                alt={`${project.title} - Fullscreen view`}
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
                layoutId="project-image"
              />
              
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle className="w-6 h-6 text-gray-700" />
              </motion.button>

              {/* Image navigation */}
              {project.images?.gallery && project.images.gallery.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                  </motion.button>

                  <motion.button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRight className="w-6 h-6 text-gray-700" />
                  </motion.button>
                </>
              )}

              {/* Image counter */}
              {project.images?.gallery && project.images.gallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {project.images.gallery.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
