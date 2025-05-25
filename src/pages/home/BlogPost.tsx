import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  List,
  Eye, Hash,
  BookOpen, 
  Heart, ArrowRight,
  User, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import '@/styles/markdown.css';
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const headingRefs = useRef<{[key: string]: HTMLElement | null}>({});
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    if (slug) {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts (recent posts for now, could be improved to get truly related content)
        setRelatedPosts(getRecentPosts(3).filter(p => p.id !== foundPost.id));

        // Generate table of contents from markdown content
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const toc: {id: string, text: string, level: number}[] = [];
        let match: RegExpExecArray | null;

        while ((match = headingRegex.exec(foundPost.content)) !== null) {
          const level = match[1].length;
          const text = match[2].trim();
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

          toc.push({ id, text, level });
        }

        setTableOfContents(toc);
      } else {
        // Post not found, redirect to blog index
        navigate('/blog');
      }
    }
  }, [slug, navigate]);

  // Update reading progress based on scroll and track active heading
  useEffect(() => {
    const updateReadingProgress = () => {
      if (articleRef.current) {
        const articleHeight = articleRef.current.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        // Calculate how far the user has scrolled through the article
        const scrolled = (scrollTop / (articleHeight - windowHeight)) * 100;
        setReadingProgress(Math.min(Math.max(scrolled, 0), 100));

        // Update active heading based on scroll position
        if (tableOfContents.length > 0) {
          // Get all heading elements
          const headingElements = tableOfContents.map(toc => {
            const element = document.getElementById(toc.id);
            if (element) {
              headingRefs.current[toc.id] = element;
            }
            return { id: toc.id, element };
          }).filter(item => item.element !== null);

          // Find the heading that is currently in view
          const scrollPosition = window.scrollY + 150; // Add offset to trigger earlier

          // Find the last heading that is above the current scroll position
          for (let i = headingElements.length - 1; i >= 0; i--) {
            const { id, element } = headingElements[i];
            if (element && element.offsetTop <= scrollPosition) {
              setActiveHeading(id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [tableOfContents]);

  // Handle smooth scrolling when clicking on TOC links
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set active heading
      setActiveHeading(id);

      // Scroll to element with smooth behavior
      window.scrollTo({
        top: element.offsetTop - 100, // Add offset to account for header
        behavior: 'smooth'
      });

      // Add highlight animation to the heading
      element.classList.add('highlight-heading');
      setTimeout(() => {
        element.classList.remove('highlight-heading');
      }, 2000);
    }
  };

  // Handle like and bookmark actions
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites!");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Bookmark removed" : "Bookmarked for later!");
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-8 w-64 bg-gradient-to-r from-teal-200 to-teal-300 rounded-2xl mb-4"></div>
          <div className="h-4 w-32 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      {/* Enhanced Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600 z-50 shadow-lg"
        style={{ width: `${readingProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
        transition={{ type: "spring", damping: 25, stiffness: 400 }}
      />

      <Header />

      <main id="main-content" className="pt-24 pb-16">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60"
            style={{ y: y1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="max-w-6xl mx-auto">

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
                    {post.category}
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-800 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 leading-tight">
                    {post.title}
                  </span>
                  <motion.div 
                    className="absolute -bottom-4 left-0 w-24 h-1.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 96 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  />
                </motion.h1>

                {/* Enhanced Post Meta */}
                <motion.div
                  className="flex flex-wrap items-center gap-6 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-teal-100/50 shadow-sm">
                    <Calendar className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600 font-medium">{post.date}</span>
                  </div>
                  
                  <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-teal-100/50 shadow-sm">
                    <Clock className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600 font-medium">{post.readingTime} min read</span>
                  </div>
                  
                  <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-teal-100/50 shadow-sm">
                    <User className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600 font-medium">{post.author.name}</span>
                  </div>

                  <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-2xl border border-teal-100/50 shadow-sm">
                    <Eye className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600 font-medium">0 views</span>
                  </div>
                </motion.div>

                {/* Enhanced Action Buttons */}
                <motion.div
                  className="flex flex-wrap items-center gap-4 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <motion.button
                    onClick={handleLike}
                    className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600'
                    } backdrop-blur-sm shadow-sm`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </motion.button>

                  <motion.button
                    onClick={handleBookmark}
                    className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      isBookmarked 
                        ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                        : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-teal-50 hover:text-teal-600'
                    } backdrop-blur-sm shadow-sm`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </motion.button>

                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Enhanced Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 max-w-[1400px] mx-auto">
              
              {/* Enhanced Table of Contents Sidebar */}
              {tableOfContents.length > 0 && (
                <motion.div 
                  className="lg:w-72 order-2 lg:order-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="sticky top-32">
                    <motion.div 
                      className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                      
                      <div className="relative">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mr-4 shadow-lg">
                            <List className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Table of Contents</h3>
                        </div>
                        
                        <nav className="space-y-2">
                          {tableOfContents.map((toc, index) => (
                            <motion.button
                              key={toc.id}
                              onClick={() => scrollToHeading(toc.id)}
                              className={`w-full text-left p-3 rounded-xl transition-all duration-300 group ${
                                activeHeading === toc.id
                                  ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-500'
                                  : 'text-gray-600 hover:bg-teal-50/50 hover:text-teal-600'
                              }`}
                              style={{ paddingLeft: `${(toc.level - 1) * 12 + 12}px` }}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              whileHover={{ x: -5 }}
                            >
                              <div className="flex items-center">
                                <Hash className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="font-medium text-sm leading-tight">{toc.text}</span>
                              </div>
                            </motion.button>
                          ))}
                        </nav>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Main Article Content */}
              <motion.article 
                ref={articleRef}
                className={`flex-1 order-1 lg:order-1 ${tableOfContents.length > 0 ? 'lg:max-w-4xl' : 'max-w-6xl mx-auto'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div 
                  className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-100 relative overflow-hidden"
                  whileInView={{ y: 0 }}
                  initial={{ y: 20 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                  
                  <div className="relative prose prose-lg prose-teal max-w-none">
                    {/* Enhanced post image */}
                    {post.coverImage && (
                      <motion.div 
                        className="mb-12 rounded-2xl overflow-hidden shadow-xl border border-teal-100"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-auto object-cover"
                        />
                      </motion.div>
                    )}

                    {/* Enhanced excerpt */}
                    <motion.div 
                      className="mb-12 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Summary</h3>
                          <p className="text-gray-600 leading-relaxed text-base">{post.excerpt}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enhanced markdown content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <div className="prose-teal">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[
                            rehypeSlug,
                            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                            rehypeHighlight
                          ]}
                        >
                          {post.content}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Enhanced Tags Section */}
                {post.tags && post.tags.length > 0 && (
                  <motion.div 
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <motion.div 
                      className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-teal-100"
                      whileHover={{ y: -3 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-blue-50/40 to-white/60 rounded-3xl" />
                      
                      <div className="relative">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                          <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center mr-4">
                            <TagIcon className="w-5 h-5 text-white" />
                          </div>
                          Related Topics
                        </h3>
                        
                        <div className="flex flex-wrap gap-3">
                          {post.tags.map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * index }}
                              whileHover={{ scale: 1.05, y: -2 }}
                            >
                              <Badge 
                                variant="outline" 
                                className="text-teal-600 border-teal-200 bg-teal-50/50 px-4 py-2 hover:bg-teal-100 transition-colors text-sm font-medium"
                              >
                                #{tag}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.article>
            </div>
          </div>
        </section>

        {/* Enhanced Related Posts Section */}
        {relatedPosts.length > 0 && (
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
                      Continue Reading
                    </span>
                  </motion.h2>
                  
                  <motion.p 
                    className="text-xl text-gray-600 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Discover more insights and ideas in these related articles
                  </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group"
                    >
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
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
                            {relatedPost.coverImage && (
                              <motion.div 
                                className="mb-6 rounded-2xl overflow-hidden shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                              >
                                <img
                                  src={relatedPost.coverImage}
                                  alt={relatedPost.title}
                                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </motion.div>
                            )}

                            <Badge 
                              variant="secondary" 
                              className="mb-4 bg-teal-50 text-teal-700 border border-teal-100"
                            >
                              {relatedPost.category}
                            </Badge>

                            <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>

                            <p className="text-gray-600 mb-6 line-clamp-3">
                              {relatedPost.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{relatedPost.date}</span>
                              </div>
                              
                              <div className="flex items-center text-teal-600 group-hover:translate-x-2 transition-transform">
                                <span className="mr-2">Read more</span>
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

      <Footer />
    </div>
  );
};

export default BlogPost;
