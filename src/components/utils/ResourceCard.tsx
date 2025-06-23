import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { Resource } from '@/data/resources.ts';
import SocialActions from '@/components/ui/social-actions.tsx';
import {
  ExternalLink,
  Tag as TagIcon,
  TestTube,
  Code,
  Palette,
  Zap,
  GraduationCap,
  BookOpen,
  Download,
  Server,
  Shield,
  Star,
  BarChart,
  Bookmark,
  Wrench,
  Globe,
  Boxes,
  Library,
  BookText,
  FileBox,
  Puzzle
} from 'lucide-react';
import { MotionLink } from "@/components/ui/motion-link.tsx";

interface ResourceCardProps {
  resource: Resource;
  index: number;
  onTagClick: (tag: string) => void;
}

// Function to get the appropriate icon based on category
const getCategoryIcon = (category?: string) => {
  switch(category) {
    case 'Testing & QA': return <TestTube className="w-4 h-4 text-teal-600" />;
    case 'Development': return <Code className="w-4 h-4 text-teal-600" />;
    case 'Design': return <Palette className="w-4 h-4 text-teal-600" />;
    case 'Productivity': return <Zap className="w-4 h-4 text-teal-600" />;
    case 'Learning': return <GraduationCap className="w-4 h-4 text-teal-600" />;
    case 'DevOps': return <Server className="w-4 h-4 text-teal-600" />;
    case 'Security': return <Shield className="w-4 h-4 text-teal-600" />;
    default: return <BookOpen className="w-4 h-4 text-teal-600" />;
  }
};

// Function to get the appropriate icon based on resource type
const getResourceTypeIcon = (type?: string) => {
  switch(type) {
    case 'tool': return <Wrench className="w-4 h-4 text-teal-500" />;
    case 'library': return <Library className="w-4 h-4 text-teal-500" />;
    case 'framework': return <Boxes className="w-4 h-4 text-teal-500" />;
    case 'language': return <Code className="w-4 h-4 text-teal-500" />;
    case 'service': return <Globe className="w-4 h-4 text-teal-500" />;
    case 'course': return <GraduationCap className="w-4 h-4 text-teal-500" />;
    case 'guide': return <BookText className="w-4 h-4 text-teal-500" />;
    case 'template': return <FileBox className="w-4 h-4 text-teal-500" />;
    default: return <Puzzle className="w-4 h-4 text-teal-500" />;
  }
};

// Updated badge styling with teal colors
const badgeStyle = "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-all duration-300";

const ResourceCard = memo(({ resource, index, onTagClick }: ResourceCardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle share dialog state
  const handleShareDialogChange = (open: boolean) => {
    setShowShareDialog(open);
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <motion.div
      className="group relative bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      whileHover={{
        y: -5,
        boxShadow: "0 20px 40px -12px rgba(20, 184, 166, 0.15)",
        borderColor: "rgba(20, 184, 166, 0.5)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8,
        delay: index * 0.05
      }}
    >
      {/* Featured badge - positioned absolutely */}
      {resource.featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs px-3 py-1 flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-white" /> Featured
          </Badge>
        </div>
      )}

      {/* Category color strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-blue-500"></div>

      {/* Resource header with logo and image */}
      <div className="p-5 border-b border-teal-100">
        <div className="flex items-start">
          <div
            className="w-14 h-14 rounded-lg bg-teal-50 p-2 flex items-center justify-center overflow-hidden shadow-sm border border-teal-200 mr-4"
          >
            {/* Image with loading state */}
            <div className={`w-full h-full flex items-center justify-center ${!imageLoaded ? 'bg-teal-50' : ''}`}>
              <img
                src={resource.image}
                alt={`${resource.title} logo`}
                className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                loading="lazy"
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-800 group-hover:text-teal-600 transition-colors duration-300">
              {resource.title}
            </h3>
            <div className="flex items-center text-sm text-teal-600 mt-2 flex-wrap gap-2">
              <div className="flex items-center bg-teal-50 px-2 py-1 rounded-md border border-teal-200">
                {getCategoryIcon(resource.category)}
                <span className="ml-1 font-medium">{resource.category}</span>
              </div>

              {resource.type && (
                <Badge className={`${badgeStyle} text-xs px-2 py-1 flex items-center gap-1`}>
                  {getResourceTypeIcon(resource.type)}
                  {resource.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resource content */}
      <div className="p-5 flex-grow relative">
        <p className="text-gray-800 text-sm mb-4 line-clamp-3 leading-relaxed">{resource.description}</p>

        {/* Additional info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.pricing && (
            <Badge className={`${badgeStyle} text-xs px-2 py-1 flex items-center gap-1`}>
              {resource.pricing === 'free' && <Download className="w-3 h-3" />}
              {resource.pricing === 'freemium' && <Star className="w-3 h-3" />}
              {resource.pricing === 'paid' && <Bookmark className="w-3 h-3" />}
              {resource.pricing === 'open-source' && <Code className="w-3 h-3" />}
              {resource.pricing}
            </Badge>
          )}

          {resource.difficulty && (
            <Badge className={`${badgeStyle} text-xs px-2 py-1 flex items-center gap-1`}>
              <BarChart className="w-3 h-3" />
              {resource.difficulty}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {resource.tags.slice(0, 3).map((tag, i) => (
            <Badge
              key={i}
              className="bg-teal-100 hover:bg-teal-200 text-teal-700 text-xs px-2 py-1 cursor-pointer flex items-center transition-all duration-300 border border-teal-200"
              onClick={() => onTagClick(tag)}
            >
              <TagIcon className="w-3 h-3 mr-1 text-teal-600" />
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge className="bg-teal-100 hover:bg-teal-200 text-teal-700 text-xs px-2 py-1 transition-all duration-300 border border-teal-200">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Resource footer */}
      <div className="p-5 border-t border-teal-100 bg-teal-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <SocialActions
              contentId={resource.id}
              contentType="resource"
              contentTitle={resource.title}
              contentUrl={resource.url}
              size="sm"
              showShareDialog={showShareDialog}
              onShareDialogChange={handleShareDialogChange}
            />
          </div>

          <div className="text-xs font-medium px-3 py-1.5 rounded-md bg-teal-100 text-teal-700 flex items-center gap-1 border border-teal-200">
            {getResourceTypeIcon(resource.type)}
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
          className="inline-flex items-center text-white font-medium text-sm bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-4 py-3 rounded-lg transition-all w-full justify-center shadow-lg hover:shadow-xl group"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)",
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
          <span className="relative">
            Visit Resource
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/40 rounded-full" />
          </span>
          <ExternalLink className="w-4 h-4 ml-2" />
        </MotionLink>
      </div>
    </motion.div>
  );
});

ResourceCard.displayName = 'ResourceCard';

export default ResourceCard;
