import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MotionButton } from "@/components/ui/motion-button";
import { MotionLink } from "@/components/ui/motion-link";
import { Resource, resourceCategories, resources } from '@/data/resources';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import { toast } from "@/components/ui/sonner";
import {
  Search,
  ExternalLink,
  Tag as TagIcon,
  Filter,
  Code,
  TestTube,
  Palette,
  Zap,
  GraduationCap,
  BookOpen,
  Download,
  Server,
  Shield,
  Calendar,
  Star,
  Heart,
  Share2,
  Info,
  BarChart,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Layers,
  Wrench,
  Puzzle,
  Globe,
  Boxes,
  Library,
  BookText,
  FileBox
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResourceCardProps {
  resource: Resource;
  index: number;
  onTagClick: (tag: string) => void;
}

const ResourceCard = ({ resource, index, onTagClick }: ResourceCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Function to get the appropriate icon based on category
  const getCategoryIcon = () => {
    const category = resourceCategories.find(cat => cat.name === resource.category);
    switch(category?.icon) {
      case 'TestTube': return <TestTube className="w-4 h-4 text-teal-500" />;
      case 'Code': return <Code className="w-4 h-4 text-teal-500" />;
      case 'Palette': return <Palette className="w-4 h-4 text-teal-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-teal-500" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-teal-500" />;
      case 'Server': return <Server className="w-4 h-4 text-teal-500" />;
      case 'Shield': return <Shield className="w-4 h-4 text-teal-500" />;
      default: return <BookOpen className="w-4 h-4 text-teal-500" />;
    }
  };

  // Function to get the appropriate icon based on resource type
  const getResourceTypeIcon = () => {
    switch(resource.type) {
      case 'tool': return <Wrench className="w-4 h-4 text-gray-500" />;
      case 'library': return <Library className="w-4 h-4 text-gray-500" />;
      case 'framework': return <Boxes className="w-4 h-4 text-gray-500" />;
      case 'language': return <Code className="w-4 h-4 text-gray-500" />;
      case 'service': return <Globe className="w-4 h-4 text-gray-500" />;
      case 'course': return <GraduationCap className="w-4 h-4 text-gray-500" />;
      case 'guide': return <BookText className="w-4 h-4 text-gray-500" />;
      case 'template': return <FileBox className="w-4 h-4 text-gray-500" />;
      default: return <Puzzle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Function to get pricing badge color - simplified
  const getPricingBadgeColor = () => {
    switch(resource.pricing) {
      case 'free': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'freemium': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'paid': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'open-source': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
    }
  };

  // Function to get difficulty badge color - simplified
  const getDifficultyBadgeColor = () => {
    switch(resource.difficulty) {
      case 'beginner': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'intermediate': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'advanced': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'all-levels': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
    }
  };

  // Function to get type badge color - simplified
  const getTypeBadgeColor = () => {
    switch(resource.type) {
      case 'tool': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'library': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'framework': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'language': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'service': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'course': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'guide': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      case 'template': return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300';
    }
  };

  // Toggle save state
  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Save to localStorage
    const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');

    if (isSaved) {
      // Remove from saved resources
      localStorage.setItem('savedResources', JSON.stringify(savedResources.filter((id: string) => id !== resource.id)));
      setIsSaved(false);
      toast.success('Resource removed from saved items');
    } else {
      // Add to saved resources
      savedResources.push(resource.id);
      localStorage.setItem('savedResources', JSON.stringify(savedResources));
      setIsSaved(true);
      toast.success('Resource saved for later');
    }
  };

  // Toggle like state
  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Save to localStorage
    const likedResources = JSON.parse(localStorage.getItem('likedResources') || '[]');

    if (isLiked) {
      // Remove like
      localStorage.setItem('likedResources', JSON.stringify(likedResources.filter((id: string) => id !== resource.id)));
      setIsLiked(false);
    } else {
      // Add like
      likedResources.push(resource.id);
      localStorage.setItem('likedResources', JSON.stringify(likedResources));
      setIsLiked(true);
      toast.success('Thanks for your feedback!');
    }
  };

  // Handle sharing resource
  const handleShareResource = (platform?: string) => {
    const url = resource.url;
    const title = resource.title;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      return;
    }

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
      return;
    }

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    // If no platform specified, use Web Share API if available, otherwise show share dialog
    setShowShareDialog(true);
  };

  // Check if resource is saved/liked on component mount
  useEffect(() => {
    const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');
    const likedResources = JSON.parse(localStorage.getItem('likedResources') || '[]');

    setIsSaved(savedResources.includes(resource.id));
    setIsLiked(likedResources.includes(resource.id));
  }, [resource.id]);

  return (
    <ScrollReveal delay={index * 0.1} threshold={0.05}>
      <motion.div
        className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
        whileHover={{
          y: -5,
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.05)",
          borderColor: "rgba(20, 184, 166, 0.3)"
        }}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.8
        }}
      >
        {/* Featured badge - positioned absolutely */}
        {resource.featured && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-teal-500 text-white text-xs px-3 py-1 flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-white" /> Featured
              </Badge>
            </motion.div>
          </div>
        )}

        {/* Category color strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-teal-500"></div>

        {/* Resource header with logo and image */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start">
            <motion.div
              className="w-14 h-14 rounded-lg bg-white p-2 flex items-center justify-center overflow-hidden shadow-sm border border-gray-100 mr-4"
              whileHover={{
                scale: 1.08,
                borderColor: "rgba(20, 184, 166, 0.5)",
                boxShadow: "0 5px 15px rgba(20, 184, 166, 0.1)"
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
            >
              <motion.img
                src={resource.image}
                alt={`${resource.title} logo`}
                className="w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            </motion.div>
            <div>
              <motion.h3
                className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {resource.title}
              </motion.h3>
              <div className="flex items-center text-sm text-gray-500 mt-2 flex-wrap gap-2">
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                  {getCategoryIcon()}
                  <span className="ml-1 font-medium">{resource.category}</span>
                </div>

                {resource.type && (
                  <Badge className={`${getTypeBadgeColor()} text-xs px-2 py-1 flex items-center gap-1`}>
                    {getResourceTypeIcon()}
                    {resource.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resource content */}
        <div className="p-5 flex-grow relative">
          {/* Resource illustration */}

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{resource.description}</p>

          {/* Additional info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.pricing && (
              <Badge className={`${getPricingBadgeColor()} text-xs px-2 py-1 flex items-center gap-1`}>
                {resource.pricing === 'free' && <Download className="w-3 h-3" />}
                {resource.pricing === 'freemium' && <Star className="w-3 h-3" />}
                {resource.pricing === 'paid' && <Bookmark className="w-3 h-3" />}
                {resource.pricing === 'open-source' && <Code className="w-3 h-3" />}
                {resource.pricing}
              </Badge>
            )}

            {resource.difficulty && (
              <Badge className={`${getDifficultyBadgeColor()} text-xs px-2 py-1 flex items-center gap-1`}>
                <BarChart className="w-3 h-3" />
                {resource.difficulty}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {resource.tags.slice(0, 3).map((tag, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
              >
                <Badge
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 cursor-pointer flex items-center transition-all duration-300"
                  onClick={() => onTagClick(tag)}
                >
                  <TagIcon className="w-3 h-3 mr-1 text-gray-500" />
                  {tag}
                </Badge>
              </motion.div>
            ))}
            {resource.tags.length > 3 && (
              <motion.div
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
              >
                <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 transition-all duration-300">
                  +{resource.tags.length - 3}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        {/* Resource footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <motion.button
                onClick={toggleLike}
                className={`p-2 rounded-md transition-all ${
                  isLiked
                    ? 'bg-gray-100 text-teal-500'
                    : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                }`}
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.05)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                </motion.div>
              </motion.button>

              <motion.button
                onClick={toggleSave}
                className={`p-2 rounded-md transition-all ${
                  isSaved
                    ? 'bg-gray-100 text-teal-500'
                    : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                }`}
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.05)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
                aria-label={isSaved ? "Unsave" : "Save"}
              >
                <motion.div
                  animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </motion.div>
              </motion.button>

              <motion.button
                className="p-2 rounded-md bg-white text-gray-400 hover:bg-gray-50 transition-all border border-gray-100"
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.05)"
                }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
                aria-label="Share"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShareResource();
                }}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 flex items-center gap-1">
              {getResourceTypeIcon()}
              {resource.type === 'tool' ? 'Tool' :
               resource.type === 'library' ? 'Library' :
               resource.type === 'framework' ? 'Framework' :
               resource.type === 'language' ? 'Language' :
               resource.type === 'service' ? 'Service' :
               resource.type === 'course' ? 'Course' :
               resource.type === 'guide' ? 'Guide' :
               resource.type === 'template' ? 'Template' : 'Resource'}
            </div>
          </div>

          <MotionLink
            href={resource.url}
            className="inline-flex items-center text-white font-medium text-sm bg-teal-500 px-4 py-3 rounded-lg hover:bg-teal-600 transition-all w-full justify-center shadow-sm group"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 20px -4px rgba(20, 184, 166, 0.4)",
              y: -2
            }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.span
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 1 }}
              className="relative"
            >
              Visit Resource
              <motion.span
                className="absolute bottom-0 left-0 w-full h-0.5 bg-white/40 rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.span>
            <motion.span
              className="ml-2"
              animate={{
                x: [0, 4, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.span>
          </MotionLink>
        </div>
      </motion.div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0">
          <motion.div
            className="relative bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            ></motion.div>

            <DialogTitle className="text-2xl font-bold text-white mb-2">Share this resource</DialogTitle>
            <DialogDescription className="text-teal-100 opacity-90">
              Choose your preferred platform to share this content with your network
            </DialogDescription>
          </motion.div>

          <motion.div
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(29, 161, 242, 0.4)',
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                className="group"
              >
                <button
                  onClick={() => {
                    handleShareResource('twitter');
                    setShowShareDialog(false);
                  }}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
                  </motion.svg>
                  <span className="text-sm font-medium">Twitter</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(66, 103, 178, 0.4)',
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                className="group"
              >
                <button
                  onClick={() => {
                    handleShareResource('facebook');
                    setShowShareDialog(false);
                  }}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#4267B2]/10 text-[#4267B2] border border-[#4267B2]/20 hover:bg-[#4267B2] hover:text-white transition-all duration-300"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </motion.svg>
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(0, 119, 181, 0.4)',
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                className="group"
              >
                <button
                  onClick={() => {
                    handleShareResource('linkedin');
                    setShowShareDialog(false);
                  }}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#0077B5]/10 text-[#0077B5] border border-[#0077B5]/20 hover:bg-[#0077B5] hover:text-white transition-all duration-300"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </motion.svg>
                  <span className="text-sm font-medium">LinkedIn</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 10px 25px -5px rgba(37, 211, 102, 0.4)',
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                className="group"
              >
                <button
                  onClick={() => {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(resource.title + ' - ' + resource.url)}`, '_blank');
                    setShowShareDialog(false);
                  }}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all duration-300"
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <path d="M17.6 6.32A8.39 8.39 0 0012.05 4 8.48 8.48 0 003.6 12.45a8.31 8.31 0 001.21 4.32L3.5 22l5.46-1.35a8.41 8.41 0 004 1 8.47 8.47 0 008.5-8.5 8.42 8.42 0 00-3.86-6.83zm-5.55 13A7 7 0 018 18.56l-.36-.21-3.76.93.95-3.47-.23-.37A6.9 6.9 0 014 12.45a7 7 0 017-7 7 7 0 017 7 7 7 0 01-5.95 6.87zm3.81-5.29c-.19-.11-1.22-.6-1.41-.66s-.33-.11-.47.1-.54.66-.66.8-.24.16-.43 0a5.57 5.57 0 01-2.8-2.43c-.21-.36.21-.33.61-1.11a.38.38 0 000-.35c0-.11-.47-1.11-.64-1.53s-.35-.36-.47-.36-.26 0-.4 0a.72.72 0 00-.55.25 2.36 2.36 0 00-.66 1.54 3.89 3.89 0 00.86 2.07 9.41 9.41 0 003.6 3.19 4.07 4.07 0 002.5.54 2.21 2.21 0 001.46-1 1.72 1.72 0 00.12-1c-.05-.11-.19-.16-.38-.21z" />
                  </motion.svg>
                  <span className="text-sm font-medium">WhatsApp</span>
                </button>
              </motion.div>
            </div>

            <motion.div
              className="relative mt-6 bg-white rounded-lg p-2 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <div className="flex items-center">
                <div className="flex-1 overflow-hidden">
                  <input
                    type="text"
                    readOnly
                    value={resource.url}
                    className="w-full p-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
                  />
                </div>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className="ml-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300"
                    onClick={() => {
                      navigator.clipboard.writeText(resource.url);
                      toast.success('Link copied to clipboard!');
                      setShowShareDialog(false);
                    }}
                  >
                    Copy
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </ScrollReveal>
  );
};

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPricing, setSelectedPricing] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('resourceSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Generate search suggestions based on current input
  useEffect(() => {
    if (searchQuery.length > 1) {
      // Generate suggestions from resource titles, tags, and categories
      const query = searchQuery.toLowerCase();

      // Get suggestions from titles
      const titleSuggestions = resources
        .filter(resource => resource.title.toLowerCase().includes(query))
        .map(resource => resource.title)
        .slice(0, 3);

      // Get suggestions from tags
      const tagSuggestions = Array.from(new Set(
        resources.flatMap(resource =>
          resource.tags.filter(tag =>
            tag.toLowerCase().includes(query)
          )
        )
      )).slice(0, 3);

      // Get suggestions from categories
      const categorySuggestions = resourceCategories
        .filter(category => category.name.toLowerCase().includes(query))
        .map(category => category.name)
        .slice(0, 2);

      // Get suggestions from types
      const typeSuggestions = Array.from(new Set(
        resources
          .map(resource => resource.type)
          .filter(type => type.toLowerCase().includes(query))
      )).slice(0, 2);

      // Combine all suggestions and remove duplicates
      const allSuggestions = Array.from(new Set([
        ...titleSuggestions,
        ...tagSuggestions,
        ...categorySuggestions,
        ...typeSuggestions
      ])).slice(0, 5);

      setSearchSuggestions(allSuggestions);
      setShowSuggestions(allSuggestions.length > 0 && searchFocused);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, searchFocused]);

  // Enhanced search algorithm with relevance scoring
  useEffect(() => {
    setIsSearching(true);

    // Debounce search to improve performance
    const searchTimer = setTimeout(() => {
      let result = resources;

      // Filter by search query with relevance scoring
      if (searchQuery) {
        const query = searchQuery.toLowerCase();

        // Calculate relevance score for each resource
        const scoredResources = resources.map(resource => {
          let score = 0;

          // Title match (highest weight)
          if (resource.title.toLowerCase() === query) {
            score += 100; // Exact title match
          } else if (resource.title.toLowerCase().includes(query)) {
            score += 50; // Partial title match
          }

          // Category match
          if (resource.category.toLowerCase().includes(query)) {
            score += 30;
          }

          // Tag matches (good relevance)
          const tagMatches = resource.tags.filter(tag =>
            tag.toLowerCase().includes(query)
          ).length;
          score += tagMatches * 25;

          // Type match
          if (resource.type.toLowerCase().includes(query)) {
            score += 20;
          }

          // Description match (lowest weight but still valuable)
          if (resource.description.toLowerCase().includes(query)) {
            score += 15;
          }

          // Pricing match
          if (resource.pricing && resource.pricing.toLowerCase().includes(query)) {
            score += 15;
          }

          // Difficulty match
          if (resource.difficulty && resource.difficulty.toLowerCase().includes(query)) {
            score += 10;
          }

          return { resource, score };
        });

        // Filter resources with a score > 0 and sort by score
        result = scoredResources
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.resource);
      }

      // Apply additional filters
      if (selectedCategory) {
        result = result.filter(resource => resource.category === selectedCategory);
      }

      if (selectedTag) {
        result = result.filter(resource => resource.tags.includes(selectedTag));
      }

      if (selectedType) {
        result = result.filter(resource => resource.type === selectedType);
      }

      if (selectedPricing) {
        result = result.filter(resource => resource.pricing === selectedPricing);
      }

      setFilteredResources(result);
      setIsSearching(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimer);
  }, [searchQuery, selectedCategory, selectedTag, selectedType, selectedPricing]);

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 5); // Keep only 5 most recent searches
      setSearchHistory(newHistory);
      localStorage.setItem('resourceSearchHistory', JSON.stringify(newHistory));
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to history
      saveSearchToHistory(searchQuery);

      // Explicitly trigger search (even though it's already handled by useEffect)
      // This ensures the search is performed when the user clicks the search button
      const query = searchQuery.toLowerCase();

      // Calculate relevance score for each resource
      const scoredResources = resources.map(resource => {
        let score = 0;

        // Title match (highest weight)
        if (resource.title.toLowerCase() === query) {
          score += 100; // Exact title match
        } else if (resource.title.toLowerCase().includes(query)) {
          score += 50; // Partial title match
        }

        // Category match
        if (resource.category.toLowerCase().includes(query)) {
          score += 30;
        }

        // Tag matches (good relevance)
        const tagMatches = resource.tags.filter(tag =>
          tag.toLowerCase().includes(query)
        ).length;
        score += tagMatches * 25;

        // Type match
        if (resource.type.toLowerCase().includes(query)) {
          score += 20;
        }

        // Description match (lowest weight but still valuable)
        if (resource.description.toLowerCase().includes(query)) {
          score += 15;
        }

        // Pricing match
        if (resource.pricing && resource.pricing.toLowerCase().includes(query)) {
          score += 15;
        }

        // Difficulty match
        if (resource.difficulty && resource.difficulty.toLowerCase().includes(query)) {
          score += 10;
        }

        return { resource, score };
      });

      // Filter resources with a score > 0 and sort by score
      let result = scoredResources
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.resource);

      // Apply additional filters
      if (selectedCategory) {
        result = result.filter(resource => resource.category === selectedCategory);
      }

      if (selectedTag) {
        result = result.filter(resource => resource.tags.includes(selectedTag));
      }

      if (selectedType) {
        result = result.filter(resource => resource.type === selectedType);
      }

      if (selectedPricing) {
        result = result.filter(resource => resource.pricing === selectedPricing);
      }

      setFilteredResources(result);
      setShowSuggestions(false);
    }
  };

  // Apply a search suggestion
  const applySuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    saveSearchToHistory(suggestion);
    setShowSuggestions(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedType('');
    setSelectedPricing('');
    setSearchQuery('');
  };

  // Apply type filter
  const applyTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type);
  };

  // Apply pricing filter
  const applyPricingFilter = (pricing: string) => {
    setSelectedPricing(pricing === selectedPricing ? '' : pricing);
  };

  // Get all unique tags from resources
  const allTags = Array.from(new Set(resources.flatMap(resource => resource.tags))).sort();

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />

      <Header />
      <main id="main-content" className="pt-24 pb-16">
        {/* Hero section */}
        <section className="relative py-24 overflow-hidden">

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-5 py-2 text-sm font-medium inline-flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-teal-500" />
                  CURATED COLLECTION
                </Badge>

                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-500">
                    Developer Resources & Tools
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  A handpicked collection of the best tools, resources, and guides for developers and QA engineers to boost your productivity and skills.
                </motion.p>

                {/* Stats */}
                <motion.div
                  className="flex flex-wrap justify-center gap-8 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      {resources.length}+
                    </motion.p>
                    <p className="text-gray-500">Resources</p>
                  </div>

                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      {resourceCategories.length}
                    </motion.p>
                    <p className="text-gray-500">Categories</p>
                  </div>

                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      {resources.filter(r => r.featured).length}
                    </motion.p>
                    <p className="text-gray-500">Featured</p>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>

          {/* Wave divider */}
          {/* <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
              ></path>
            </svg>
          </div> */}
        </section>

        {/* Main content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar with filters */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6 sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-teal-500" />
                        Filters
                      </h3>
                      {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                        <motion.button
                          onClick={resetFilters}
                          className="text-xs text-teal-600 hover:text-teal-700 flex items-center"
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Reset All
                        </motion.button>
                      )}
                    </div>

                    {/* Search in sidebar */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Search className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                        Search Resources
                      </h4>
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="relative flex items-center">
                          <Input
                            type="text"
                            placeholder="Search..."
                            className="pr-10 py-2 rounded-md border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <motion.button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white p-1.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                            whileHover={{
                              scale: 1.1,
                              boxShadow: "0 3px 10px rgba(20, 184, 166, 0.3)"
                            }}
                            whileTap={{ scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10
                            }}
                            aria-label="Search"
                          >
                            <Search className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </form>
                    </div>

                    <div className="space-y-6">
                      {/* Categories */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Layers className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Categories
                        </h4>
                        <div className="space-y-2">
                          {resourceCategories.map(category => (
                            <motion.button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.name === selectedCategory ? '' : category.name)}
                              className={`text-sm py-1.5 px-3 rounded-lg w-full text-left flex items-center transition-all ${
                                selectedCategory === category.name
                                  ? 'bg-teal-50 text-teal-700 font-medium shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {category.name === 'Testing & QA' && <TestTube className="w-3.5 h-3.5 mr-2 text-purple-500" />}
                              {category.name === 'Development' && <Code className="w-3.5 h-3.5 mr-2 text-blue-500" />}
                              {category.name === 'Design' && <Palette className="w-3.5 h-3.5 mr-2 text-pink-500" />}
                              {category.name === 'Productivity' && <Zap className="w-3.5 h-3.5 mr-2 text-yellow-500" />}
                              {category.name === 'Learning' && <GraduationCap className="w-3.5 h-3.5 mr-2 text-green-500" />}
                              {category.name === 'DevOps' && <Server className="w-3.5 h-3.5 mr-2 text-indigo-500" />}
                              {category.name === 'Security' && <Shield className="w-3.5 h-3.5 mr-2 text-red-500" />}
                              {category.name}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Resource Type */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Resource Type
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['tool', 'library', 'framework', 'language', 'service', 'course', 'guide', 'template'].map((type) => {
                            const count = resources.filter(r => r.type === type).length;
                            const isSelected = selectedType === type;
                            return (
                              <Badge
                                key={type}
                                className={`cursor-pointer flex items-center justify-between px-3 py-1.5 transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                                onClick={() => applyTypeFilter(type)}
                              >
                                <div className="flex items-center gap-1.5">
                                  {type === 'tool' && <Wrench className="w-3.5 h-3.5" />}
                                  {type === 'library' && <Library className="w-3.5 h-3.5" />}
                                  {type === 'framework' && <Boxes className="w-3.5 h-3.5" />}
                                  {type === 'language' && <Code className="w-3.5 h-3.5" />}
                                  {type === 'service' && <Globe className="w-3.5 h-3.5" />}
                                  {type === 'course' && <GraduationCap className="w-3.5 h-3.5" />}
                                  {type === 'guide' && <BookText className="w-3.5 h-3.5" />}
                                  {type === 'template' && <FileBox className="w-3.5 h-3.5" />}
                                  <span className="capitalize">{type}</span>
                                </div>
                                <span className={`ml-1 ${isSelected ? 'bg-teal-50' : 'bg-white'} px-1.5 py-0.5 rounded-full text-xs ${isSelected ? 'text-teal-600' : 'text-gray-500'}`}>
                                  {count}
                                </span>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      {/* Popular Tags */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <TagIcon className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Popular Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {allTags.slice(0, 15).map((tag, index) => (
                            <Badge
                              key={index}
                              className={`cursor-pointer flex items-center transition-all duration-300 ${
                                selectedTag === tag
                                  ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                            >
                              <TagIcon className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Download className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Pricing
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['free', 'freemium', 'paid', 'open-source'].map((pricing) => {
                            const count = resources.filter(r => r.pricing === pricing).length;
                            const isSelected = selectedPricing === pricing;

                            // Base colors
                            let baseColor = '';
                            let selectedColor = '';
                            let textColor = '';
                            let selectedTextColor = '';
                            let hoverColor = '';

                            switch(pricing) {
                              case 'free':
                                baseColor = 'bg-green-50';
                                selectedColor = 'bg-green-100';
                                textColor = 'text-green-700';
                                selectedTextColor = 'text-green-800';
                                hoverColor = 'hover:bg-green-100';
                                break;
                              case 'freemium':
                                baseColor = 'bg-blue-50';
                                selectedColor = 'bg-blue-100';
                                textColor = 'text-blue-700';
                                selectedTextColor = 'text-blue-800';
                                hoverColor = 'hover:bg-blue-100';
                                break;
                              case 'paid':
                                baseColor = 'bg-purple-50';
                                selectedColor = 'bg-purple-100';
                                textColor = 'text-purple-700';
                                selectedTextColor = 'text-purple-800';
                                hoverColor = 'hover:bg-purple-100';
                                break;
                              case 'open-source':
                                baseColor = 'bg-orange-50';
                                selectedColor = 'bg-orange-100';
                                textColor = 'text-orange-700';
                                selectedTextColor = 'text-orange-800';
                                hoverColor = 'hover:bg-orange-100';
                                break;
                            }

                            const bgColor = isSelected ? selectedColor : baseColor;
                            const color = isSelected ? selectedTextColor : textColor;
                            const hoverClass = isSelected ? '' : hoverColor;

                            return (
                              <Badge
                                key={pricing}
                                className={`cursor-pointer ${bgColor} ${color} ${hoverClass} px-3 py-1.5 flex items-center justify-between shadow-sm transition-all duration-300`}
                                onClick={() => applyPricingFilter(pricing)}
                              >
                                <div className="flex items-center gap-1.5">
                                  {pricing === 'free' && <Download className="w-3.5 h-3.5" />}
                                  {pricing === 'freemium' && <Star className="w-3.5 h-3.5" />}
                                  {pricing === 'paid' && <Bookmark className="w-3.5 h-3.5" />}
                                  {pricing === 'open-source' && <Code className="w-3.5 h-3.5" />}
                                  <span className="capitalize">{pricing}</span>
                                </div>
                                <span className={`ml-1 ${isSelected ? 'bg-white/70' : 'bg-white/50'} px-1.5 py-0.5 rounded-full text-xs`}>
                                  {count}
                                </span>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="lg:w-3/4">
                {/* Results count and sorting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3 md:mb-0">
                    <Info className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      Showing <span className="font-medium">{filteredResources.length}</span> of <span className="font-medium">{resources.length}</span> resources
                      {searchQuery && (
                        <span className="ml-1">
                          for <span className="font-medium italic">"{searchQuery}"</span>
                        </span>
                      )}
                    </p>
                  </div>

                  {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {searchQuery && (
                        <Badge className="bg-gray-100 text-gray-700 px-3 py-1 flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          {searchQuery}
                          <button
                            onClick={() => setSearchQuery('')}
                            className="ml-1 hover:text-gray-900"
                            aria-label="Clear search"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedCategory && (
                        <Badge className="bg-teal-100 text-teal-700 px-3 py-1 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {selectedCategory}
                          <button
                            onClick={() => setSelectedCategory('')}
                            className="ml-1 hover:text-teal-900"
                            aria-label="Clear category filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedTag && (
                        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {selectedTag}
                          <button
                            onClick={() => setSelectedTag('')}
                            className="ml-1 hover:text-blue-900"
                            aria-label="Clear tag filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedType && (
                        <Badge className="bg-indigo-100 text-indigo-700 px-3 py-1 flex items-center gap-1">
                          {selectedType === 'tool' && <Wrench className="w-3 h-3" />}
                          {selectedType === 'library' && <Library className="w-3 h-3" />}
                          {selectedType === 'framework' && <Boxes className="w-3 h-3" />}
                          {selectedType === 'language' && <Code className="w-3 h-3" />}
                          {selectedType === 'service' && <Globe className="w-3 h-3" />}
                          {selectedType === 'course' && <GraduationCap className="w-3 h-3" />}
                          {selectedType === 'guide' && <BookText className="w-3 h-3" />}
                          {selectedType === 'template' && <FileBox className="w-3 h-3" />}
                          {selectedType}
                          <button
                            onClick={() => setSelectedType('')}
                            className="ml-1 hover:text-indigo-900"
                            aria-label="Clear type filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedPricing && (
                        <Badge className="bg-purple-100 text-purple-700 px-3 py-1 flex items-center gap-1">
                          {selectedPricing === 'free' && <Download className="w-3 h-3" />}
                          {selectedPricing === 'freemium' && <Star className="w-3 h-3" />}
                          {selectedPricing === 'paid' && <Bookmark className="w-3 h-3" />}
                          {selectedPricing === 'open-source' && <Code className="w-3 h-3" />}
                          {selectedPricing}
                          <button
                            onClick={() => setSelectedPricing('')}
                            className="ml-1 hover:text-purple-900"
                            aria-label="Clear pricing filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                        <button
                          onClick={resetFilters}
                          className="text-xs text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all duration-300 px-2 py-1 rounded-md flex items-center"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Resources grid */}
                {filteredResources.length > 0 ? (
                  <>
                    {/* Featured resources section - only show if there are featured resources in filtered results */}
                    {filteredResources.some(r => r.featured) && (
                      <div className="mb-12">
                        <div className="flex items-center mb-6">
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          <h3 className="text-lg font-bold text-gray-800 px-4 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" />
                            Featured Resources
                          </h3>
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        </div>

                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {filteredResources.filter(r => r.featured).map((resource, index) => (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, y: 30, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                              }}
                            >
                              <ResourceCard
                                key={resource.id}
                                resource={resource}
                                index={index}
                                onTagClick={setSelectedTag}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    )}

                    {/* Regular resources */}
                    <div className="mb-6">
                      {filteredResources.some(r => r.featured) && (
                        <div className="flex items-center mb-6">
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          <h3 className="text-lg font-bold text-gray-800 px-4">All Resources</h3>
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        </div>
                      )}

                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {filteredResources
                          .filter(r => filteredResources.some(fr => fr.featured) ? !r.featured : true)
                          .map((resource, index) => (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                              }}
                            >
                              <ResourceCard
                                resource={resource}
                                index={index}
                                onTagClick={setSelectedTag}
                              />
                            </motion.div>
                          ))
                        }
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100 p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-center mb-6">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Search className="w-20 h-20 text-gray-200" />
                      </motion.div>
                    </div>
                    <motion.h3
                      className="text-2xl font-bold text-gray-800 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {searchQuery
                        ? `No results found for "${searchQuery}"`
                        : "No resources found"
                      }
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 mb-8 max-w-md mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {searchQuery ? (
                        <>
                          We couldn't find any resources matching your search. Try:
                          <ul className="mt-4 text-left max-w-xs mx-auto space-y-2">
                            <li className="flex items-start">
                              <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                              <span>Checking for typos or misspellings</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                              <span>Using more general keywords</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                              <span>Removing filters to broaden your search</span>
                            </li>
                          </ul>
                        </>
                      ) : (
                        "We couldn't find any resources matching your criteria. Try adjusting your filters."
                      )}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                      <MotionButton
                        onClick={resetFilters}
                        className="bg-gray-700 text-white px-8 py-3 rounded-xl shadow-md"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.2)"
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Reset All Filters
                      </MotionButton>

                      {searchQuery && (
                        <MotionButton
                          onClick={() => {
                            // Keep other filters but clear search
                            setSearchQuery('');
                          }}
                          className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl shadow-sm"
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.05)"
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Clear Search Only
                        </MotionButton>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
