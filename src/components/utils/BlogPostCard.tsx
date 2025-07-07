import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { BlogPost } from '@/types/blog.ts';
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import { MotionLink } from "@/components/ui/motion-link.tsx";
import { Calendar, Clock, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  onTagClick?: (tag: string) => void;
}

const BlogPostCard = memo(({ post, index, onTagClick }: BlogPostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${post.coverImage}`);
    setImageError(true);
    // Fallback to a placeholder image if the original fails to load
    e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
  };

  return (
    <ScrollReveal delay={index * 0.05} threshold={0.1}>
      <motion.article
        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.8,
          delay: index * 0.05 // Reduced delay for faster appearance
        }}
      >
        <div className="md:flex">
          {/* Image with overlay effect */}
          <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            
            {/* Loading state container */}
            <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center z-5 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <img
              src={post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage}
              alt={post.title}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-teal-500/80 backdrop-blur-sm text-white border-none px-3 py-1">
                {post.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:w-3/5 relative">
            {/* Featured indicator */}
            {post.featured && (
              <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                Featured
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4 mr-1 text-teal-500" />
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-1 text-teal-500" />
              <span>{post.readingTime} min read</span>
            </div>

            <Link to={`/blog/${post.slug}`} className="block group-hover:translate-x-1 transition-transform duration-300">
              <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-transparent hover:border hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => onTagClick && onTagClick(tag)}
                >
                  <TagIcon className="w-3 h-3 mr-1 text-teal-500" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500 flex items-center">
                  <span className="w-1 h-1 bg-gray-300 rounded-full mr-1"></span>
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <MotionLink
                href={'/not-found'}
                // href={`/blog/${post.slug}`}
                className="inline-flex items-center text-teal-600 font-medium text-sm bg-teal-50 px-4 py-2 rounded-full group-hover:bg-teal-100 transition-colors"
                whileHover={{ x: 5 }}
              >
                Read Article <ArrowRight className="ml-1 w-4 h-4" />
              </MotionLink>
            </div>
          </div>
        </div>
      </motion.article>
    </ScrollReveal>
  );
});

BlogPostCard.displayName = 'BlogPostCard';

export default BlogPostCard;
