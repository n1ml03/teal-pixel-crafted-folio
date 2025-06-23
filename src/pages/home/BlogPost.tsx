import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import { getPostBySlug, getRecentPosts } from '@/data/blog-posts.ts';
import { BlogPost as BlogPostType } from '@/types/blog.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import {
  Calendar, Clock, Tag as TagIcon,
  List, BookOpen, 
  Heart, ArrowRight, User, 
  ChevronRight} from 'lucide-react';
import '@/styles/markdown.css';
import { toast } from "sonner";

// Dynamic imports for markdown dependencies
const loadMarkdownDependencies = async () => {
  const [
    { default: ReactMarkdown },
    { default: remarkGfm },
    { default: rehypeSlug },
    { default: rehypeAutolinkHeadings },
    { default: rehypeHighlight }
  ] = await Promise.all([
    import('react-markdown'),
    import('remark-gfm'),
    import('rehype-slug'),
    import('rehype-autolink-headings'),
    import('rehype-highlight')
  ]);

  return {
    ReactMarkdown,
    remarkGfm,
    rehypeSlug,
    rehypeAutolinkHeadings,
    rehypeHighlight
  };
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number, progress: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [markdownDependencies, setMarkdownDependencies] = useState<{
    ReactMarkdown: any;
    remarkGfm: any;
    rehypeSlug: any;
    rehypeAutolinkHeadings: any;
    rehypeHighlight: any;
  } | null>(null);
  const [markdownLoading, setMarkdownLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();

  useEffect(() => {
    // Load markdown dependencies and highlight.js CSS
    const loadDependencies = async () => {
      try {
        setMarkdownLoading(true);
        
        // Load markdown dependencies
        const dependencies = await loadMarkdownDependencies();
        setMarkdownDependencies(dependencies);
        
        // Dynamically load highlight.js CSS
        if (!document.querySelector('link[href*="highlight.js"]')) {
          await import('highlight.js/styles/github-dark.css');
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

        // Generate table of contents
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const toc: {id: string, text: string, level: number, progress: number}[] = [];
        let match: RegExpExecArray | null;

        while ((match = headingRegex.exec(foundPost.content)) !== null) {
          const level = match[1].length;
          const text = match[2].trim();
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          toc.push({ id, text, level, progress: 0 });
        }

        setTableOfContents(toc);
      } else {
        navigateWithTransition('/blog');
      }
    }
  }, [slug, navigateWithTransition]);

  // Enhanced reading progress and active heading tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      if (articleRef.current) {
        const articleHeight = articleRef.current.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const scrolled = (scrollTop / (articleHeight - windowHeight)) * 100;
        setReadingProgress(Math.min(Math.max(scrolled, 0), 100));

        // Update active heading and section progress
        if (tableOfContents.length > 0) {
          const scrollPosition = scrollTop + 120;
          const updatedToc = [...tableOfContents];
          
          for (let i = 0; i < updatedToc.length; i++) {
            const currentElement = document.getElementById(updatedToc[i].id);
            const nextElement = i < updatedToc.length - 1 ? document.getElementById(updatedToc[i + 1].id) : null;
            
            if (currentElement) {
              const sectionStart = currentElement.offsetTop;
              const sectionEnd = nextElement ? nextElement.offsetTop : articleHeight;
              const sectionHeight = sectionEnd - sectionStart;
              
              if (scrollPosition >= sectionStart && scrollPosition < sectionEnd) {
                setActiveHeading(updatedToc[i].id);
                const sectionProgress = Math.min(Math.max(((scrollPosition - sectionStart) / sectionHeight) * 100, 0), 100);
                updatedToc[i].progress = sectionProgress;
              } else if (scrollPosition >= sectionEnd) {
                updatedToc[i].progress = 100;
              } else {
                updatedToc[i].progress = 0;
              }
            }
          }
          
          setTableOfContents(updatedToc);
        }
      }
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [tableOfContents.length]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveHeading(id);
      const offset = window.innerWidth < 768 ? 80 : 100;
      window.scrollTo({
        top: Math.max(0, element.offsetTop - offset),
        behavior: 'smooth'
      });
    }
  };

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
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 z-50"
        style={{ width: `${readingProgress}%` }}
      />

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-accent/80 to-background/60"
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
                  <div className="flex items-center bg-card/70 px-4 py-2 rounded-xl">
                    <Calendar className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-muted-foreground">{post.date}</span>
                  </div>
                  
                  <div className="flex items-center bg-card/70 px-4 py-2 rounded-xl">
                    <Clock className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-muted-foreground">{post.readingTime} min read</span>
                  </div>
                  
                  <div className="flex items-center bg-card/70 px-4 py-2 rounded-xl">
                    <User className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="text-muted-foreground">{post.author.name}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                      isLiked 
                        ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                        : 'bg-card/70 text-muted-foreground border border hover:bg-destructive/5'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                      isBookmarked 
                        ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                        : 'bg-card/70 text-muted-foreground border border hover:bg-teal-50'
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              
              {/* Mobile TOC - Enhanced */}
              {tableOfContents.length > 0 && (
                <motion.div 
                  className="lg:hidden mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-gradient-to-br from-card/95 to-card/85 rounded-2xl shadow-xl border border/50 backdrop-blur-sm">
                    <button
                      onClick={() => setTocCollapsed(!tocCollapsed)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-accent/50 transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mr-4">
                          <List className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-foreground text-lg">Table of Contents</span>
                          <div className="text-sm text-muted-foreground">
                            {tableOfContents.length} sections
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: tocCollapsed ? 0 : 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </button>
                    
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: tocCollapsed ? 0 : "auto",
                        opacity: tocCollapsed ? 0 : 1 
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {tableOfContents.map((toc, index) => (
                          <motion.button
                            key={toc.id}
                            onClick={() => scrollToHeading(toc.id)}
                            className={`group relative w-full text-left p-3 rounded-xl transition-all duration-300 ${
                              activeHeading === toc.id
                                ? 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 shadow-md'
                                : 'text-muted-foreground hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground'
                            }`}
                            style={{ paddingLeft: `${(toc.level - 1) * 12 + 12}px` }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                                activeHeading === toc.id ? 'bg-teal-500' : 'bg-muted-foreground/30'
                              }`} />
                              <span className="text-sm font-medium line-clamp-3 flex-1">
                                {toc.text}
                              </span>
                              
                              {/* Progress percentage for mobile */}
                              {activeHeading === toc.id && (
                                <motion.span
                                  className="text-xs font-bold text-teal-600 ml-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {Math.round(toc.progress)}%
                                </motion.span>
                              )}
                            </div>
                            
                            {/* Progress indicator */}
                            <div className="mt-2 h-0.5 bg-teal-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${toc.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Main Content */}
              <article 
                ref={articleRef}
                className="flex-1"
              >
                <div className="bg-card/90 rounded-xl p-8 shadow-lg border border">
                  {post.coverImage && (
                    <div className="mb-8 rounded-xl overflow-hidden relative">
                      {/* Loading state */}
                      {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
                          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      
                      <img
                        src={post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage}
                        alt={post.title}
                        className="w-full h-64 md:h-80 object-cover"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="prose prose-base max-w-none markdown-content">
                    {markdownLoading || !markdownDependencies ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span className="text-muted-foreground">Loading content...</span>
                      </div>
                    ) : (
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
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-8 border-t border">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-4">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="secondary"
                            className="bg-teal-100 text-teal-700 hover:bg-teal-200 cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {/* Desktop TOC Sidebar - Enhanced */}
              {tableOfContents.length > 0 && (
                <div className="hidden lg:block lg:w-80 xl:w-96">
                  <div className="sticky top-24">
                    <motion.div 
                      className="bg-gradient-to-br from-card/95 to-card/85 rounded-2xl shadow-2xl border border/50 backdrop-blur-sm overflow-hidden"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Header */}
                      <div className="p-6 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-b border/30">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mr-4">
                            <List className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              Table of Contents
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {tableOfContents.length} sections • {Math.round(readingProgress)}% complete
                            </p>
                          </div>
                        </div>
                        
                        {/* Overall progress bar */}
                        <div className="mt-4 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${readingProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                      
                      {/* TOC Items */}
                      <div className="p-4 space-y-1 max-h-[calc(100vh-280px)] min-h-[400px] overflow-y-auto custom-scrollbar">
                        {tableOfContents.map((toc, index) => (
                          <motion.div
                            key={toc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative"
                          >
                            <button
                              onClick={() => scrollToHeading(toc.id)}
                              className={`group relative w-full text-left p-4 xl:p-5 rounded-xl transition-all duration-300 ${
                                activeHeading === toc.id
                                  ? 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 shadow-lg transform scale-105'
                                  : 'text-muted-foreground hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground hover:transform hover:scale-102'
                              }`}
                              style={{ paddingLeft: `${(toc.level - 1) * 16 + 16}px` }}
                            >
                              <div className="flex items-center">
                                {/* Level indicator */}
                                <div className={`w-3 h-3 xl:w-4 xl:h-4 rounded-full mr-3 transition-all duration-300 ${
                                  activeHeading === toc.id 
                                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg' 
                                    : toc.progress > 0 
                                      ? 'bg-teal-300' 
                                      : 'bg-muted-foreground/30'
                                }`}>
                                  {activeHeading === toc.id && (
                                    <motion.div
                                      className="w-full h-full rounded-full bg-white"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 0.5 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}
                                </div>
                                
                                <span className={`text-sm xl:text-base line-clamp-3 flex-1 transition-all duration-300 leading-relaxed ${
                                  toc.level === 1 ? 'font-bold' : 
                                  toc.level === 2 ? 'font-semibold' : 'font-medium'
                                }`}>
                                  {toc.text}
                                </span>
                                
                                {/* Progress percentage */}
                                {activeHeading === toc.id && (
                                  <motion.span
                                    className="text-xs xl:text-sm font-bold text-teal-600 ml-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {Math.round(toc.progress)}%
                                  </motion.span>
                                )}
                              </div>
                              
                              {/* Section progress bar */}
                              <div className="mt-3 h-1 xl:h-1.5 bg-muted/30 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    activeHeading === toc.id
                                      ? 'bg-gradient-to-r from-teal-500 to-blue-500'
                                      : 'bg-teal-300'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${toc.progress}%` }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                              </div>
                            </button>
                            
                            {/* Connection line for hierarchy */}
                            {index < tableOfContents.length - 1 && toc.level < tableOfContents[index + 1].level && (
                              <div 
                                className="absolute w-px h-4 bg-border/50"
                                style={{ 
                                  left: `${(toc.level - 1) * 16 + 22}px`,
                                  bottom: '-2px'
                                }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
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
                      className="bg-card rounded-xl overflow-hidden shadow-lg border border hover:shadow-xl transition-all duration-300"
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