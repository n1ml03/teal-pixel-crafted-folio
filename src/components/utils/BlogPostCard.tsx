import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { BlogPost } from '@/types/blog.ts';
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import { MotionLink } from "@/components/ui/motion-link.tsx";
import { Calendar, Clock, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollOptimizedMemo, useStableCallback, usePerformantMemo } from '@/lib/component-optimization';
import { cardHoverAnimation, fastTween } from '@/lib/motion';

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  onTagClick?: (tag: string) => void;
}

const BlogPostCard = scrollOptimizedMemo(({ post, index, onTagClick }: BlogPostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Stable callbacks to prevent re-renders
  const handleImageLoad = useStableCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useStableCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${post.coverImage}`);
    setImageError(true);
    // Fallback to a placeholder image if the original fails to load
    e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
  }, [post.coverImage]);

  // Memoize expensive calculations
  const processedImageSrc = usePerformantMemo(() => {
    return post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage;
  }, [post.coverImage], 'BlogPostCard-imageSrc');

  const displayTags = usePerformantMemo(() => {
    return post.tags.slice(0, 3);
  }, [post.tags], 'BlogPostCard-tags');

  const remainingTagsCount = usePerformantMemo(() => {
    return post.tags.length > 3 ? post.tags.length - 3 : 0;
  }, [post.tags.length], 'BlogPostCard-remainingTags');

  return (
    <ScrollReveal delay={index * 0.03} threshold={0.1}> {/* Reduced delay */}
      <motion.article
        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
        whileHover={cardHoverAnimation} // Use optimized animation
        initial={{ opacity: 0, y: 15 }} // Reduced movement
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...fastTween, // Use optimized transition
          delay: index * 0.03 // Reduced delay for faster appearance
        }}
        style={{
          // Force hardware acceleration
          transform: 'translateZ(0)',
          // CSS containment for better performance
          contain: 'layout paint',
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
              src={processedImageSrc}
              alt={post.title}
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100 group-hover:scale-102' : 'opacity-0'}`} // Reduced scale and duration
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
              decoding="async" // Improve loading performance
              style={{
                // Force hardware acceleration
                transform: 'translateZ(0)',
                // Improve image rendering
                imageRendering: 'auto'
              }}
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
              {displayTags.map((tag, i) => (
                <span
                  key={`${post.id}-${tag}`} // More stable key
                  className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-transparent hover:border hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={() => onTagClick && onTagClick(tag)}
                >
                  <TagIcon className="w-3 h-3 mr-1 text-teal-500" />
                  {tag}
                </span>
              ))}
              {remainingTagsCount > 0 && (
                <span className="text-xs text-gray-500 flex items-center">
                  <span className="w-1 h-1 bg-gray-300 rounded-full mr-1"></span>
                  +{remainingTagsCount} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <MotionLink
                href={`/blog/${post.slug}`}
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
}, ['index']); // Only re-render when index changes (for scroll-based animations)

BlogPostCard.displayName = 'BlogPostCard';

export default BlogPostCard;
