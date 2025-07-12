import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import { getPostBySlug, getRecentPosts } from '@/data/blog-posts.ts';
import { BlogPost as BlogPostType } from '@/types/blog.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import {
  Calendar, Clock, Tag as TagIcon,
  BookOpen,
  Heart, ArrowRight, User} from 'lucide-react';
import '@/styles/markdown.css';
import { toast } from "sonner";

// Dynamic imports for markdown dependencies with improved error handling
const loadMarkdownDependencies = async () => {
  try {
    // Load dependencies in the correct order to prevent circular dependency issues
    const [
      { default: ReactMarkdown },
      remarkGfmModule,
      rehypeSlugModule,
      rehypeAutolinkHeadingsModule,
      rehypeHighlightModule
    ] = await Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
      import('rehype-slug'),
      import('rehype-autolink-headings'),
      import('rehype-highlight')
    ]);

    // Extract default exports properly to avoid "Cannot access before initialization" errors
    const remarkGfm = remarkGfmModule.default || remarkGfmModule;
    const rehypeSlug = rehypeSlugModule.default || rehypeSlugModule;
    const rehypeAutolinkHeadings = rehypeAutolinkHeadingsModule.default || rehypeAutolinkHeadingsModule;
    const rehypeHighlight = rehypeHighlightModule.default || rehypeHighlightModule;

    return {
      ReactMarkdown,
      remarkGfm,
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeHighlight
    };
  } catch (error) {
    console.error('Failed to load markdown dependencies:', error);
    // Return null to indicate failure
    return null;
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [markdownDependencies, setMarkdownDependencies] = useState<{
    ReactMarkdown: React.ComponentType<any>;
    remarkGfm: unknown;
    rehypeSlug: unknown;
    rehypeAutolinkHeadings: unknown;
    rehypeHighlight: unknown;
  } | null>(null);
  const [markdownLoading, setMarkdownLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const navigateWithTransition = useNavigateWithTransition();

  useEffect(() => {
    // Load markdown dependencies and highlight.js CSS
    const loadDependencies = async () => {
      try {
        setMarkdownLoading(true);
        
        // Load markdown dependencies with retry logic
        let dependencies = await loadMarkdownDependencies();
        
        // Retry once if failed
        if (!dependencies) {
          console.warn('Retrying markdown dependencies load...');
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
          dependencies = await loadMarkdownDependencies();
        }

        if (dependencies) {
          setMarkdownDependencies(dependencies);
        } else {
          console.error('Failed to load markdown dependencies after retry');
        }
        
        // Dynamically load highlight.js CSS
        if (!document.querySelector('link[href*="highlight.js"]')) {
          try {
            await import('highlight.js/styles/github-dark.css');
          } catch (cssError) {
            console.warn('Failed to load highlight.js CSS:', cssError);
          }
        }
        
        setMarkdownLoading(false);
      } catch (error) {
        console.error('Failed to load markdown dependencies:', error);
        setMarkdownLoading(false);
      }
    };
    
    loadDependencies();
    
    window.scrollTo(0, 0);
    
    // Reset image states when changing posts
    setImageLoaded(false);
    setImageError(false);

    if (slug) {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        setRelatedPosts(getRecentPosts(3).filter(p => p.id !== foundPost.id));
      } else {
        navigateWithTransition('/blog');
      }
    }
  }, [slug]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites!");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Bookmarked for later!");
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${post?.coverImage}`);
    setImageError(true);
    e.currentTarget.src = "https://placehold.co/800x400/e2e8f0/64748b?text=Image+Not+Available";
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-8 w-64 bg-teal-200 rounded-2xl mb-4"></div>
          <div className="h-4 w-32 bg-teal-100 rounded-xl"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground optimizeForLowPerformance={false} reducedAnimations={true} />
      <Header />
    
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20">
          <motion.div
            className="absolute inset-0 bg-background"
            style={{ y: y1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="max-w-4xl">
                <Badge variant="secondary" className="mb-6 px-4 py-2">
                  <TagIcon className="w-4 h-4 mr-2" />
                  {post.category}
                </Badge>

                <h1 className="text-3xl md:text-5xl font-bold mb-8 text-teal-600">
                  {post.title}
                </h1>

                {/* Post Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm">
                    <Calendar className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-muted-foreground">{post.date}</span>
                  </div>

                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm">
                    <Clock className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-muted-foreground">{post.readingTime} min read</span>
                  </div>

                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm">
                    <User className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-muted-foreground">{post.author.name}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all backdrop-blur-sm shadow-sm ${
                      isLiked
                        ? 'bg-red-50/90 text-red-600 border border-red-200/50'
                        : 'bg-white/90 text-gray-700 border border-white/30 hover:bg-red-50/90 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all backdrop-blur-sm shadow-sm ${
                      isBookmarked
                        ? 'bg-teal-50/90 text-teal-700 border border-teal-200/50'
                        : 'bg-white/90 text-gray-700 border border-white/30 hover:bg-teal-50/90 hover:text-teal-700'
                    }`}
                  >
                    <BookOpen className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            {/* Enhanced Content Layout */}
            <div className="max-w-7xl mx-auto">

              {/* Article Header Enhancement */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                
                {/* Reading Time & Author Info */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <BookOpen className="w-4 h-4 mr-2 text-teal-600" />
                    <span>{post.readingTime} min read</span>
                  </div>
                  <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <User className="w-4 h-4 mr-2 text-teal-600" />
                    <span>By {post.author.name}</span>
                  </div>
                </div>
              </motion.div>

              {/* Main Article Container */}
              <article
                ref={articleRef}
                className="relative"
              >
                {/* Enhanced Article Card */}
                <motion.div
                  className="bg-gradient-to-br from-white/95 to-white/85 rounded-3xl shadow-2xl border border-gray-200/50 backdrop-blur-sm overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  {/* Cover Image with Enhanced Styling */}
                  {post.coverImage && (
                    <div className="relative mb-0">
                      {/* Loading state */}
                      {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
                          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}

                      <div className="relative overflow-hidden">
                        <img
                          src={post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage}
                          alt={post.title}
                          className="w-full h-72 md:h-96 object-cover"
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  )}

                  {/* Content Container with Enhanced Padding */}
                  <div className="px-8 md:px-12 lg:px-16 py-12">

                    {/* Article Content with Enhanced Typography */}
                    <div className="prose prose-lg md:prose-xl max-w-none markdown-content">
                      {markdownLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                          <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <span className="text-muted-foreground text-lg">Loading content...</span>
                        </div>
                      ) : markdownDependencies ? (
                        <markdownDependencies.ReactMarkdown
                          remarkPlugins={[markdownDependencies.remarkGfm]}
                          rehypePlugins={[
                            markdownDependencies.rehypeSlug,
                            [markdownDependencies.rehypeAutolinkHeadings, { behavior: 'wrap' }],
                            markdownDependencies.rehypeHighlight
                          ]}
                        >
                          {post.content}
                        </markdownDependencies.ReactMarkdown>
                      ) : (
                        // Enhanced fallback with better styling
                        <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                          <motion.div
                            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl mb-8"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-yellow-500 rounded-full mr-3 flex items-center justify-center">
                                <span className="text-white text-xs">!</span>
                              </div>
                              <strong>Note:</strong> Markdown rendering temporarily unavailable. Displaying plain text.
                            </div>
                          </motion.div>
                          {post.content}
                        </div>
                      )}
                    </div>

                    {/* Enhanced Tags Section */}
                    {post.tags && post.tags.length > 0 && (
                      <motion.div
                        className="mt-12 pt-8 border-t border/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="flex items-center mb-6">
                          <TagIcon className="w-5 h-5 text-teal-600 mr-3" />
                          <h4 className="text-lg font-semibold text-foreground">Topics</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {post.tags.map((tag, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 hover:from-teal-200 hover:to-blue-200 cursor-pointer px-4 py-2 text-sm font-medium border border-teal-200 hover:border-teal-300 transition-all duration-300"
                              >
                                #{tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced Action Buttons Section */}
                    <motion.div
                      className="mt-12 pt-8 border-t border/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <motion.button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                              isLiked
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                                : 'bg-white/90 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                          </motion.button>

                          <motion.button
                            onClick={handleBookmark}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                              isBookmarked
                                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
                                : 'bg-white/90 border border-gray-200 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 text-gray-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <BookOpen className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
                          </motion.button>
                        </div>

                        {/* Share Section */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Share this article</span>
                          <div className="flex gap-2">
                            <motion.button
                              className="w-10 h-10 rounded-full bg-white/90 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-700 flex items-center justify-center transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied to clipboard!");
                              }}
                            >
                              <span className="text-xs">🔗</span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
              </article>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Related Articles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {relatedPost.coverImage && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.coverImage.startsWith('./') ? relatedPost.coverImage.replace('./', '/') : relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.error(`Failed to load related post image: ${relatedPost.coverImage}`);
                              e.currentTarget.src = "https://placehold.co/400x225/e2e8f0/64748b?text=Image+Not+Available";
                            }}
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <Badge variant="secondary" className="mb-3">
                          {relatedPost.category}
                        </Badge>

                        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {relatedPost.date}
                          </div>

                          <Link
                            to={`/blog/${relatedPost.slug}`}
                            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-sm"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;