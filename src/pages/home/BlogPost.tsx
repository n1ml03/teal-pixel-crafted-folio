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
  List, Hash, BookOpen, 
  Heart, ArrowRight, User
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
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const navigate = useNavigate();

  useEffect(() => {
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
        const toc: {id: string, text: string, level: number}[] = [];
        let match: RegExpExecArray | null;

        while ((match = headingRegex.exec(foundPost.content)) !== null) {
          const level = match[1].length;
          const text = match[2].trim();
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          toc.push({ id, text, level });
        }

        setTableOfContents(toc);
      } else {
        navigate('/blog');
      }
    }
  }, [slug, navigate]);

  // Reading progress and active heading tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      if (articleRef.current) {
        const articleHeight = articleRef.current.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const scrolled = (scrollTop / (articleHeight - windowHeight)) * 100;
        setReadingProgress(Math.min(Math.max(scrolled, 0), 100));

        // Update active heading
        if (tableOfContents.length > 0) {
          const scrollPosition = scrollTop + 100;
          for (let i = tableOfContents.length - 1; i >= 0; i--) {
            const element = document.getElementById(tableOfContents[i].id);
            if (element && element.offsetTop <= scrollPosition) {
              setActiveHeading(tableOfContents[i].id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [tableOfContents]);

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
          <div className="h-8 w-64 bg-gradient-to-r from-teal-200 to-teal-300 rounded-2xl mb-4"></div>
          <div className="h-4 w-32 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600 z-50"
        style={{ width: `${readingProgress}%` }}
      />

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-teal-50/80 to-white/60"
            style={{ y: y1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <Badge variant="secondary" className="mb-6 bg-teal-50 text-teal-700 px-4 py-2">
                  <TagIcon className="w-4 h-4 mr-2" />
                  {post.category}
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">
                  {post.title}
                </h1>

                {/* Post Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center bg-white/70 px-4 py-2 rounded-xl">
                    <Calendar className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600">{post.date}</span>
                  </div>
                  
                  <div className="flex items-center bg-white/70 px-4 py-2 rounded-xl">
                    <Clock className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600">{post.readingTime} min read</span>
                  </div>
                  
                  <div className="flex items-center bg-white/70 px-4 py-2 rounded-xl">
                    <User className="w-5 h-5 text-teal-500 mr-2" />
                    <span className="text-gray-600">{post.author.name}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                      isLiked 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                      isBookmarked 
                        ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                        : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-teal-50'
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
              
              {/* Mobile TOC */}
              {tableOfContents.length > 0 && (
                <div className="lg:hidden mb-8">
                  <details className="bg-white/90 rounded-xl shadow-lg border">
                    <summary className="p-4 cursor-pointer flex items-center">
                      <List className="w-5 h-5 mr-3 text-teal-500" />
                      <span className="font-semibold">Table of Contents</span>
                    </summary>
                    
                    <div className="px-4 pb-4 space-y-1">
                      {tableOfContents.map((toc) => (
                        <button
                          key={toc.id}
                          onClick={() => scrollToHeading(toc.id)}
                          className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                            activeHeading === toc.id
                              ? 'bg-teal-50 text-teal-700'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          style={{ paddingLeft: `${(toc.level - 1) * 8 + 8}px` }}
                        >
                          <Hash className="w-3 h-3 mr-2 inline" />
                          {toc.text}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
              )}

              {/* Main Content */}
              <article 
                ref={articleRef}
                className="flex-1"
              >
                <div className="bg-white/90 rounded-xl p-8 shadow-lg border">
                  {post.coverImage && (
                    <div className="mb-8 rounded-xl overflow-hidden relative">
                      {/* Loading state */}
                      {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      
                      <img
                        src={post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage}
                        alt={post.title}
                        className={`blog-cover-image transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="eager"
                      />
                    </div>
                  )}

                  {/* Excerpt */}
                  <div className="mb-8 p-6 bg-teal-50 rounded-xl border border-teal-100">
                    <h3 className="font-semibold text-gray-800 mb-2">Quick Summary</h3>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>

                  {/* Markdown Content */}
                  <div className="prose prose-lg prose-teal max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[
                        rehypeSlug,
                        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                        rehypeHighlight
                      ]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 {...props} className="scroll-mt-24" />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 {...props} className="scroll-mt-24" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="scroll-mt-24" />
                        ),
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8">
                    <div className="bg-white/90 rounded-xl p-6 shadow-lg border">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <TagIcon className="w-5 h-5 mr-2 text-teal-500" />
                        Related Topics
                      </h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge 
                            key={tag}
                            variant="outline" 
                            className="text-teal-600 border-teal-200 bg-teal-50"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Scroll to top button */}
                {readingProgress > 20 && (
                  <button
                    className="fixed bottom-8 right-8 w-12 h-12 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition-colors z-40"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    ↑
                  </button>
                )}
              </article>

              {/* Desktop TOC - Right Side */}
              {tableOfContents.length > 0 && (
                <div className="hidden lg:block lg:w-72">
                  <div className="sticky top-28">
                    <div className="bg-white/90 rounded-xl p-6 shadow-lg border">
                      <div className="flex items-center mb-4">
                        <List className="w-5 h-5 mr-3 text-teal-500" />
                        <h3 className="font-bold text-gray-800">Contents</h3>
                      </div>
                      
                      <nav className="space-y-1 max-h-96 overflow-y-auto">
                        {tableOfContents.map((toc) => (
                          <button
                            key={toc.id}
                            onClick={() => scrollToHeading(toc.id)}
                            className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                              activeHeading === toc.id
                                ? 'bg-teal-50 text-teal-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            style={{ paddingLeft: `${(toc.level - 1) * 12 + 12}px` }}
                          >
                            <Hash className="w-3 h-3 mr-2 inline" />
                            {toc.text}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">
                    Continue Reading
                  </h2>
                  <p className="text-xl text-gray-600">
                    Discover more insights and ideas in these related articles
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block h-full group"
                    >
                      <div className="bg-white rounded-xl p-6 shadow-lg border h-full hover:shadow-xl transition-shadow">
                        {relatedPost.coverImage && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                              src={relatedPost.coverImage.startsWith('./') ? relatedPost.coverImage.replace('./', '/') : relatedPost.coverImage}
                              alt={relatedPost.title}
                              className="related-post-image group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <Badge className="mb-3 bg-teal-50 text-teal-700">
                          {relatedPost.category}
                        </Badge>

                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                          {relatedPost.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {relatedPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{relatedPost.date}</span>
                          </div>
                          
                          <div className="flex items-center text-teal-600">
                            <span className="mr-2">Read more</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
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
