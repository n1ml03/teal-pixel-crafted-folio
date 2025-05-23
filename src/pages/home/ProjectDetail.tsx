import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { MotionLink } from "@/components/ui/motion-link.tsx";
import { getProjectBySlug, getRelatedProjects } from '@/data/projects.ts';
import { Project } from '@/types/project.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import SocialActions from '@/components/ui/social-actions.tsx';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import {
  Calendar,
  ArrowLeft,
  ExternalLink,
  FileText,
  Code2,
  Tag as TagIcon,
  Layers,
  CheckCircle2,
  XCircle,
  LightbulbIcon,
  Trophy,
  Code,
  ArrowRight
} from 'lucide-react';
import { toast } from "@/components/ui/sonner.tsx";

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
  const navigate = useNavigate();

  // Refs for scroll animations
  const contentRef = useRef<HTMLDivElement>(null);
  const techSectionRef = useRef<HTMLDivElement>(null);

  // Scroll animation controls
  useScroll({
    target: techSectionRef,
    offset: ["start end", "end start"]
  });

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

  // Toggle fullscreen image view
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    // When entering fullscreen, prevent body scroll
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Download current image
  const downloadImage = () => {
    if (project) {
      const link = document.createElement('a');
      link.href = project.images.gallery[currentImageIndex] || project.images.main;
      link.download = `${project.title}-image-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image download started");
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

  // Toggle tech details visibility
  const toggleTechDetails = () => {
    setShowTechDetails(prev => !prev);
  };

  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  if (!project) {
    return (
      <div className="min-h-screen relative">
        <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />
        <Header />
        <main className="pt-24 pb-16 relative z-0">
          <div className="container mx-auto px-4 text-center py-16">
            <motion.div
              className="text-gray-400 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Layers className="h-16 w-16 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
            <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <MotionButton
              onClick={() => navigate('/projects')}
              className="bg-teal-600 text-white rounded-lg px-6 py-2 inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </MotionButton>
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

      <main id="main-content" className="relative z-0 pt-16 pb-16">
        {/* Hero section with parallax effect */}
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden mb-8">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 to-blue-900/30 mix-blend-multiply z-10" />

          {/* Hero image with parallax effect */}
          <ParallaxProvider>
            <Parallax
              className="absolute inset-0 w-full h-full"
              translateY={['-10%', '10%']}
              scale={[1.1, 1]}
            >
              <img
                src={project.images.main}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </Parallax>
          </ParallaxProvider>

          {/* Content overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end">
            <div className="container mx-auto px-4 pb-12">
              {/* Breadcrumb navigation */}
              <nav className="flex items-center text-sm mb-4">
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-white/60">/</span>
                <Link to="/projects" className="text-white/80 hover:text-white transition-colors">
                  Projects
                </Link>
                <span className="mx-2 text-white/60">/</span>
                <span className="text-white font-medium">{project.title}</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-none">
                      {project.category}
                    </Badge>
                    <div className="flex items-center text-sm text-white/80">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.year}
                    </div>
                  </div>
                  <motion.h1
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {project.title}
                  </motion.h1>
                  <motion.p
                    className="text-white/90 text-lg max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    {project.description}
                  </motion.p>
                </div>

                <div className="flex items-center gap-3">
                  {project.links.github && (
                    <MotionLink
                      href={project.links.github}
                      className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg px-4 py-2 inline-flex items-center"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Code2 className="mr-2 h-4 w-4" />
                      GitHub
                    </MotionLink>
                  )}
                  {project.links.demo && (
                    <MotionLink
                      href={project.links.demo}
                      className="bg-teal-500/80 backdrop-blur-sm text-white rounded-lg px-4 py-2 inline-flex items-center"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(20, 184, 166, 0.9)" }}
                      whileTap={{ scale: 0.95 }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </MotionLink>
                  )}
                </div>
              </div>

              <motion.div
                className="flex flex-wrap gap-2 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center border border-white/10 hover:bg-white/20 transition-colors"
                  >
                    <TagIcon className="w-3 h-3 mr-1 text-teal-300" />
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4" ref={contentRef}>

          {/* Project content */}
          <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Main content - 2/3 width on large screens */}
            <div className="w-full space-y-8">
              {/* Project description with social actions */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <div className="bg-teal-50 p-2 rounded-lg mr-3">
                        <FileText className="h-6 w-6 text-teal-600" />
                      </div>
                      Project Overview
                    </h2>

                    {/* Social Actions */}
                    <SocialActions
                      contentId={project.id}
                      contentType="project"
                      contentTitle={project.title}
                      contentUrl={window.location.href}
                      size="md"
                      showLabels={false}
                    />
                  </div>

                  <div className="prose prose-teal prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {project.longDescription}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Features */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="bg-teal-50 p-2 rounded-lg mr-3">
                      <Layers className="h-6 w-6 text-teal-600" />
                    </div>
                    Key Features
                  </h2>
                  <ul className="space-y-4">
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start bg-gray-50 rounded-lg p-4 hover:bg-teal-50 transition-colors duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="bg-white p-2 rounded-full shadow-sm mr-4 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-teal-500" />
                        </div>
                        <span className="text-gray-700 font-medium pt-1">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>

              {/* Challenges and Solutions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <div className="bg-red-50 p-2 rounded-lg mr-3">
                        <XCircle className="h-6 w-6 text-red-500" />
                      </div>
                      Challenges
                    </h2>
                    <ul className="space-y-4">
                      {project.challenges.map((challenge, index) => (
                        <motion.li
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-red-50 transition-colors duration-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-start">
                            <div className="bg-white h-6 w-6 rounded-full shadow-sm mr-3 flex items-center justify-center text-red-500 font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{challenge}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                        <LightbulbIcon className="h-6 w-6 text-yellow-500" />
                      </div>
                      Solutions
                    </h2>
                    <ul className="space-y-4">
                      {project.solutions.map((solution, index) => (
                        <motion.li
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-yellow-50 transition-colors duration-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-start">
                            <div className="bg-white h-6 w-6 rounded-full shadow-sm mr-3 flex items-center justify-center text-yellow-500 font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{solution}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              </div>

              {/* Outcome */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="bg-amber-50 p-2 rounded-lg mr-3">
                      <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                    Project Outcome
                  </h2>
                  <div className="bg-gradient-to-r from-amber-50 to-transparent p-6 rounded-lg border border-amber-100">
                    <p className="text-gray-700 leading-relaxed">
                      {project.outcome}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Technologies Used */}
              <motion.div
                ref={techSectionRef}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                style={{ position: 'relative' }} /* Add relative positioning for scroll tracking */
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <Code className="h-6 w-6 text-blue-600" />
                      </div>
                      Technologies Used
                    </h2>

                    <MotionButton
                      onClick={toggleTechDetails}
                      className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg px-3 py-1.5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showTechDetails ? "Hide Details" : "Show Details"}
                    </MotionButton>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.technologies.map((tech, index) => (
                      <motion.div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow-md transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -5, backgroundColor: "#f0f9ff" }}
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-700 font-medium">{tech}</span>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {showTechDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-blue-50/50 rounded-lg p-6 border border-blue-100">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Frontend</h4>
                              <ul className="space-y-2">
                                {project.technologies
                                  .filter(tech =>
                                    ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Bootstrap']
                                    .some(frontendTech => tech.includes(frontendTech))
                                  )
                                  .map((tech, i) => (
                                    <li key={i} className="flex items-center text-sm">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                      {tech}
                                    </li>
                                  ))
                                }
                              </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Backend</h4>
                              <ul className="space-y-2">
                                {project.technologies
                                  .filter(tech =>
                                    ['Node', 'Express', 'Django', 'Flask', 'Spring', 'Java', 'Python', 'PHP', 'Ruby', 'Go', 'C#', '.NET']
                                    .some(backendTech => tech.includes(backendTech))
                                  )
                                  .map((tech, i) => (
                                    <li key={i} className="flex items-center text-sm">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                      {tech}
                                    </li>
                                  ))
                                }
                              </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">Database</h4>
                              <ul className="space-y-2">
                                {project.technologies
                                  .filter(tech =>
                                    ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'DynamoDB', 'Redis', 'Oracle']
                                    .some(dbTech => tech.includes(dbTech))
                                  )
                                  .map((tech, i) => (
                                    <li key={i} className="flex items-center text-sm">
                                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                      {tech}
                                    </li>
                                  ))
                                }
                              </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <h4 className="text-sm font-medium text-gray-600 mb-2">DevOps & Tools</h4>
                              <ul className="space-y-2">
                                {project.technologies
                                  .filter(tech =>
                                    ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Git', 'GitHub', 'GitLab']
                                    .some(devopsTech => tech.includes(devopsTech))
                                  )
                                  .map((tech, i) => (
                                    <li key={i} className="flex items-center text-sm">
                                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                      {tech}
                                    </li>
                                  ))
                                }
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Project Rating */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="bg-yellow-50 p-2 rounded-lg mr-3">
                      <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                    Rate This Project
                  </h2>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-yellow-50 to-transparent p-6 rounded-lg border border-yellow-100">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="text-3xl font-bold text-gray-800 mr-2">{averageRating}</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Rate this project:</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            onClick={() => handleRating(star)}
                            className={`p-1 rounded-full transition-colors ${userRating === star ? 'bg-yellow-100' : 'hover:bg-yellow-50'}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              className={`w-8 h-8 ${userRating && star <= userRating ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Sidebar - 1/3 width on large screens */}

          </div>

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <motion.div
              className="mt-16 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Related Projects</h2>
                <p className="text-gray-600">Explore more projects similar to this one</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject.id}
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 overflow-hidden group hover:border-teal-200 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <Link to={`/projects/${relatedProject.slug}`} className="block">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedProject.images.main}
                          alt={relatedProject.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-none mb-2">
                              {relatedProject.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          <span>{relatedProject.year}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                          {relatedProject.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedProject.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {relatedProject.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full flex items-center">
                              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1.5"></span>
                              {tag}
                            </span>
                          ))}
                          {relatedProject.tags.length > 3 && (
                            <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full">
                              +{relatedProject.tags.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <motion.div
                            className="text-teal-600 font-medium text-sm flex items-center"
                            whileHover={{ x: 5 }}
                          >
                            View Project <ArrowRight className="ml-1 h-4 w-4" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to projects button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <MotionLink
              href="/projects"
              className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 rounded-full px-8 py-3 text-sm font-medium shadow-sm"
              whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Projects
            </MotionLink>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
