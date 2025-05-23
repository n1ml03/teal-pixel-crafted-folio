import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";
import { MotionLink } from "@/components/ui/motion-link.tsx";
import { getPostBySlug, getRecentPosts } from '@/data/blog-posts.ts';
import { BlogPost as BlogPostType } from '@/types/blog.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import SocialActions from '@/components/ui/social-actions.tsx';
import {
  Calendar, Clock, Tag as TagIcon,
  ChevronLeft, ChevronRight, List,
  Eye, Link as LinkIcon, Hash
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import '@/styles/markdown.css';
import { Separator } from '@/components/ui/separator.tsx';
import { toast } from "@/components/ui/sonner.tsx";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const headingRefs = useRef<{[key: string]: HTMLElement | null}>({});
  // Keep the useScroll hook for tracking article position
  useScroll({
    target: articleRef,
    offset: ["start start", "end end"]
  });
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

  // Handle share dialog state
  const handleShareDialogChange = (open: boolean) => {
    setShowShareDialog(open);
  };

  // Handle printing article
  const handlePrintArticle = () => {
    window.print();
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground optimizeForLowPerformance={true} reducedAnimations={true} />

      <Header />

      <main id="main-content" className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">

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
                    className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium border border-teal-100"
                  >
                    {post.category}
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
                    {post.title}
                  </span>
                  <div className="absolute -bottom-3 left-0 w-20 h-1 bg-teal-500 rounded-full"></div>
                </motion.h1>

                <motion.div
                  className="flex flex-wrap items-center text-gray-500 mb-8 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4 mr-1 text-teal-500" />
                    <span>{post.date}</span>
                  </div>

                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                    <Clock className="w-4 h-4 mr-1 text-teal-500" />
                    <span>{post.readingTime} min read</span>
                  </div>

                  {/* Article Actions */}
                  <div className="ml-auto">
                    {post && (
                      <SocialActions
                        contentId={post.id}
                        contentType="article"
                        contentTitle={post.title}
                        contentUrl={window.location.href}
                        size="sm"
                        showShareDialog={showShareDialog}
                        onShareDialogChange={handleShareDialogChange}
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Image */}
        <div className="container mx-auto px-4 -mt-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="rounded-xl overflow-hidden shadow-lg relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>

              <img
                src={post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${post.coverImage}`);
                  // Fallback to a placeholder image if the original fails to load
                  e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                }}
              />

              {/* Featured badge */}
              {post.featured && (
                <div className="absolute top-4 right-4 bg-teal-500 text-white text-sm px-4 py-1 rounded-full font-medium z-20 shadow-md">
                  Featured Article
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Article Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="w-full lg:w-4/5">
                  <motion.article
                    ref={articleRef}
                    className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg prose-a:text-teal-600 prose-a:no-underline hover:prose-a:text-teal-700 prose-img:rounded-xl prose-img:shadow-md prose-code:bg-gray-100 prose-code:text-teal-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:p-4 prose-pre:border prose-pre:border-gray-800 prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2 prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-h4:text-lg prose-li:marker:text-teal-500 prose-li:text-gray-600 prose-li:leading-relaxed prose-li:text-lg prose-table:border prose-table:border-gray-300 prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-gray-300"
                    style={{ position: 'relative' }} /* Add relative positioning for scroll tracking */
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[
                        rehypeSlug,
                        [rehypeAutolinkHeadings, {
                          behavior: 'wrap',
                          properties: {
                            className: ['anchor-link'],
                            ariaHidden: true,
                            tabIndex: -1
                          }
                        }],
                        [rehypeHighlight, { ignoreMissing: true }]
                      ]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            {...props}
                            className={`group flex items-center transition-all duration-500 ${
                              activeHeading === props.id ? 'highlight-heading' : ''
                            }`}
                          >
                            <span className="relative">
                              {props.children}
                              <motion.span
                                className={`absolute -bottom-1 left-0 h-1 bg-teal-500 rounded-full ${
                                  activeHeading === props.id ? 'opacity-100' : 'opacity-0'
                                }`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: activeHeading === props.id ? '100%' : '0%',
                                  opacity: activeHeading === props.id ? 1 : 0
                                }}
                                transition={{ duration: 0.5 }}
                              />
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(window.location.origin + window.location.pathname + `#${props.id}`);
                                toast.success('Link copied to clipboard!');
                              }}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                              aria-label="Copy link to heading"
                            >
                              <Hash className="w-5 h-5 text-teal-500" />
                            </button>
                          </h1>
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            {...props}
                            className={`group flex items-center mt-8 transition-all duration-500 ${
                              activeHeading === props.id ? 'highlight-heading' : ''
                            }`}
                          >
                            <span className="relative">
                              {props.children}
                              <motion.span
                                className={`absolute -bottom-1 left-0 h-0.5 bg-teal-500 rounded-full ${
                                  activeHeading === props.id ? 'opacity-100' : 'opacity-0'
                                }`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: activeHeading === props.id ? '100%' : '0%',
                                  opacity: activeHeading === props.id ? 1 : 0
                                }}
                                transition={{ duration: 0.5 }}
                              />
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(window.location.origin + window.location.pathname + `#${props.id}`);
                                toast.success('Link copied to clipboard!');
                              }}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                              aria-label="Copy link to heading"
                            >
                              <Hash className="w-4 h-4 text-teal-500" />
                            </button>
                          </h2>
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            {...props}
                            className={`group flex items-center mt-6 transition-all duration-500 ${
                              activeHeading === props.id ? 'highlight-heading' : ''
                            }`}
                          >
                            <span className="relative">
                              {props.children}
                              <motion.span
                                className={`absolute -bottom-1 left-0 h-0.5 bg-teal-500 rounded-full ${
                                  activeHeading === props.id ? 'opacity-100' : 'opacity-0'
                                }`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: activeHeading === props.id ? '100%' : '0%',
                                  opacity: activeHeading === props.id ? 1 : 0
                                }}
                                transition={{ duration: 0.5 }}
                              />
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(window.location.origin + window.location.pathname + `#${props.id}`);
                                toast.success('Link copied to clipboard!');
                              }}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                              aria-label="Copy link to heading"
                            >
                              <Hash className="w-4 h-4 text-teal-500" />
                            </button>
                          </h3>
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-500 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out"
                            target={props.href?.startsWith('http') ? '_blank' : undefined}
                            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {props.href?.startsWith('http') ? (
                              <span className="flex items-center">
                                {props.children}
                                <LinkIcon className="ml-1 w-3 h-3 inline" />
                              </span>
                            ) : props.children}
                          </a>
                        ),
                        code: ({ node, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match;

                          if (isInline) {
                            return (
                              <code className="bg-gray-100 text-teal-700 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                                {children}
                              </code>
                            );
                          }

                          return (
                            <div className="relative group">
                              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  className="bg-gray-800 text-gray-300 hover:text-white px-2 py-1 rounded text-xs"
                                  onClick={() => {
                                    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                    toast.success('Code copied to clipboard!');
                                  }}
                                >
                                  Copy
                                </button>
                              </div>
                              <pre>
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          );
                        },
                        img: ({ node, ...props }) => (
                          <div className="my-6">
                            <img
                              {...props}
                              className="rounded-xl shadow-md w-full object-cover hover:shadow-xl transition-shadow duration-300"
                              loading="lazy"
                            />
                            {props.alt && props.alt !== props.src && (
                              <p className="text-center text-sm text-gray-500 mt-2 italic">
                                {props.alt}
                              </p>
                            )}
                          </div>
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-teal-500 bg-teal-50/50 py-1 px-4 rounded-r-md not-italic text-gray-700 my-6">
                            {props.children}
                          </blockquote>
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-6">
                            <table className="border border-gray-300 w-full" {...props} />
                          </div>
                        ),
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </motion.article>

                  {/* Tags */}
                  <motion.div
                    className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <TagIcon className="w-5 h-5 mr-2 text-teal-500" />
                      Article Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 + (i * 0.05) }}
                        >
                          <Link
                            to={`/blog?tag=${tag}`}
                            className="inline-flex items-center bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm transition-all border border-gray-200 shadow-sm hover:shadow-md hover:text-teal-600 hover:border-teal-100"
                          >
                            <TagIcon className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                            {tag}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <Separator className="my-8" />

                  {/* Author Bio */}
                  <motion.div
                    className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-8 mt-8 border border-teal-100 shadow-md relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full opacity-20 -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100 rounded-full opacity-20 -ml-10 -mb-10"></div>

                    <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                      <div className="relative">
                        <img
                          src="/images/profile.webp"
                          alt={post.author.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                          onError={(e) => {
                            // Fallback to a default image if the profile image fails to load
                            e.currentTarget.src = "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1000";
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold">✓</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                          About {post.author.name}
                          <span className="ml-2 bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">Author</span>
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Developer and QA Engineer with a passion for building robust software solutions through meticulous development and comprehensive testing.
                        </p>
                        <div className="flex items-center gap-3">
                          <MotionButton
                            className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-5 py-2 text-sm shadow-sm hover:shadow-md"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/contact-form'}
                          >
                            Contact Me
                          </MotionButton>

                          <MotionLink
                            href="https://github.com/n1ml03"
                            className="text-gray-600 hover:text-teal-600 bg-white p-2 rounded-full border border-gray-200 shadow-sm"
                            whileHover={{ y: -2 }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                          </MotionLink>

                          <MotionLink
                            href="https://linkedin.com/in/pearleseed"
                            className="text-gray-600 hover:text-teal-600 bg-white p-2 rounded-full border border-gray-200 shadow-sm"
                            whileHover={{ y: -2 }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </MotionLink>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block lg:w-1/5">
                  <div className="sticky top-32">
                    {/* Table of Contents */}
                    <motion.div
                      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <List className="w-5 h-5 mr-2 text-teal-500" />
                        Table of Contents
                      </h3>
                      <nav className="space-y-2 text-sm">
                        {tableOfContents.length > 0 ? (
                          tableOfContents.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  scrollToHeading(item.id);
                                }}
                                className={`block w-full text-left py-1 border-l-2 transition-all duration-300 ${
                                  activeHeading === item.id
                                    ? 'text-teal-600 border-teal-500 font-medium bg-teal-50/50 pl-3'
                                    : 'text-gray-600 border-gray-100 hover:text-teal-600 hover:border-teal-300'
                                } ${
                                  item.level === 1 ? 'font-semibold' : ''
                                } ${
                                  item.level === 3 ? 'pl-6' : item.level === 2 ? 'pl-4' : 'pl-3'
                                }`}
                              >
                                {item.text}
                              </button>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-gray-500 italic">No headings found in this article</div>
                        )}
                      </nav>
                    </motion.div>

                    {/* Reading Stats */}
                    <motion.div
                      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-teal-500" />
                        Reading Stats
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Reading Progress</span>
                            <span className="text-teal-600 font-medium">{Math.round(readingProgress)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-teal-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${readingProgress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Estimated time</span>
                          <span className="text-gray-800 font-medium">{post.readingTime} min</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Published</span>
                          <span className="text-gray-800 font-medium">{post.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.div
                  className="mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
                      Related Articles
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map((relatedPost, index) => (
                      <motion.div
                        key={relatedPost.id}
                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + (index * 0.1) }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative h-40 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                          <img
                            src={relatedPost.coverImage.startsWith('./') ? relatedPost.coverImage.replace('./', '/') : relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              console.error(`Failed to load image: ${relatedPost.coverImage}`);
                              // Fallback to a placeholder image if the original fails to load
                              e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                            }}
                          />
                          <div className="absolute top-3 left-3 z-20">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 backdrop-blur-sm text-teal-700 hover:bg-teal-50 px-2 py-1 text-xs font-medium"
                            >
                              {relatedPost.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-teal-500" />
                            <span>{relatedPost.date}</span>
                            <span className="mx-2">•</span>
                            <Clock className="w-3.5 h-3.5 mr-1 text-teal-500" />
                            <span>{relatedPost.readingTime} min read</span>
                          </div>

                          <Link to={`/blog/${relatedPost.slug}`} className="block group-hover:translate-x-1 transition-transform duration-300">
                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                              {relatedPost.title}
                            </h3>
                          </Link>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>

                          <MotionLink
                            href={`/blog/${relatedPost.slug}`}
                            className="inline-flex items-center text-teal-600 font-medium text-sm"
                            whileHover={{ x: 5 }}
                          >
                            Read Article <ChevronRight className="ml-1 w-4 h-4" />
                          </MotionLink>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Post Navigation */}
              <motion.div
                className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <MotionLink
                  href="/blog"
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center group overflow-hidden relative"
                  whileHover={{ x: -5 }}
                >
                  {/* Background hover effect */}
                  <div className="absolute inset-0 bg-teal-50 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>

                  <ChevronLeft className="w-5 h-5 mr-3 text-teal-600 relative z-10" />
                  <div className="relative z-10">
                    <div className="text-sm text-gray-500 mb-1">Previous</div>
                    <div className="font-medium group-hover:text-teal-600 transition-colors">Back to all articles</div>
                  </div>
                </MotionLink>

                <MotionLink
                  href="/blog"
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-end text-right group overflow-hidden relative"
                  whileHover={{ x: 5 }}
                >
                  {/* Background hover effect */}
                  <div className="absolute inset-0 bg-teal-50 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>

                  <div className="relative z-10">
                    <div className="text-sm text-gray-500 mb-1">Next</div>
                    <div className="font-medium group-hover:text-teal-600 transition-colors">Explore more articles</div>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-3 text-teal-600 relative z-10" />
                </MotionLink>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Back to Top Button */}
      {readingProgress > 20 && (
        <motion.button
          className="fixed bottom-8 right-8 bg-teal-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-teal-600 transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </motion.button>
      )}
    </div>
  );
};

export default BlogPost;
