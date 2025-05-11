import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MotionButton } from "@/components/ui/motion-button";
import { MotionLink } from "@/components/ui/motion-link";
import { BlogPost } from '@/types/blog';
import { blogPosts, blogCategories, blogTags } from '@/data/blog-posts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import { Search, Calendar, Clock, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Filter posts based on search query, category, and tag
  useEffect(() => {
    let filteredPosts = [...blogPosts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(post =>
        post.category === selectedCategory
      );
    }

    // Filter by tag
    if (selectedTag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.includes(selectedTag)
      );
    }

    setPosts(filteredPosts);
  }, [searchQuery, selectedCategory, selectedTag]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />

      <Header />
      <main id="main-content" className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium"
                >
                  Blog
                </Badge>
                <motion.h1
                  className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400 relative">
                    Insights & Articles
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></div>
                  </span>
                </motion.h1>
                <motion.p
                  className="text-lg text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Thoughts, tutorials, and insights on development, testing, and quality assurance.
                </motion.p>

                {/* Search Bar */}
                <motion.div
                  className="relative max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-10 py-6 rounded-full border-gray-200 focus:border-teal-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="w-full lg:w-2/3">
                {/* Filter indicators */}
                {(selectedCategory || selectedTag || searchQuery) && (
                  <motion.div
                    className="mb-6 flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm text-gray-500 font-medium">Filtered by:</span>

                    {selectedCategory && (
                      <Badge className="bg-teal-50 text-teal-700 px-3 py-1.5 flex items-center gap-1 border border-teal-100">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('')}
                          className="ml-1 text-teal-700 hover:text-teal-900 hover:bg-teal-100 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    {selectedTag && (
                      <Badge className="bg-blue-50 text-blue-700 px-3 py-1.5 flex items-center gap-1 border border-blue-100">
                        Tag: {selectedTag}
                        <button
                          onClick={() => setSelectedTag('')}
                          className="ml-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    {searchQuery && (
                      <Badge className="bg-gray-100 text-gray-700 px-3 py-1.5 flex items-center gap-1 border border-gray-200">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    <MotionButton
                      onClick={resetFilters}
                      className="text-sm text-teal-600 hover:text-teal-800 ml-2 bg-transparent hover:bg-teal-50 border border-transparent hover:border-teal-100 px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset all
                    </MotionButton>
                  </motion.div>
                )}

                {/* Blog posts */}
                {posts.length > 0 ? (
                  <div className="space-y-8">
                    {posts.map((post, index) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                        index={index}
                        onTagClick={setSelectedTag}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                    <MotionButton
                      onClick={resetFilters}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset Filters
                    </MotionButton>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-1/3">
                <div className="sticky top-24">
                  {/* Categories */}
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {blogCategories.map(category => (
                        <motion.button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`block w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                            selectedCategory === category.name
                              ? 'bg-teal-50 text-teal-700 border-l-2 border-teal-500 font-medium shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'
                          }`}
                          whileHover={{ x: selectedCategory === category.name ? 0 : 3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {category.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Popular Tags */}
                  <motion.div
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blogTags.map((tag, index) => (
                        <motion.button
                          key={tag.id}
                          onClick={() => setSelectedTag(tag.name)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedTag === tag.name
                              ? 'bg-teal-100 text-teal-800 border border-teal-200 shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + (index * 0.03) }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tag.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Featured Article */}
                  <motion.div
                    className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>

                    <h3 className="text-lg font-bold mb-4 relative z-10">Subscribe to Newsletter</h3>
                    <p className="text-teal-50 text-sm mb-4 relative z-10">Get the latest articles and insights delivered to your inbox.</p>

                    <div className="relative z-10">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 mb-3 focus:bg-white/20"
                      />
                      <MotionButton
                        className="w-full bg-white text-teal-700 hover:bg-teal-50"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Subscribe
                      </MotionButton>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
  onTagClick?: (tag: string) => void;
}

const BlogPostCard = ({ post, index, onTagClick }: BlogPostCardProps) => {
  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.article
        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
        whileHover={{ y: -5 }}
      >
        <div className="md:flex">
          {/* Image with overlay effect */}
          <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            <img
              src={post.coverImage.startsWith('./') ? post.coverImage.replace('./', '/') : post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                console.error(`Failed to load image: ${post.coverImage}`);
                // Fallback to a placeholder image if the original fails to load
                e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
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
              {post.tags.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={i}
                  className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                  whileHover={{ y: -2 }}
                  onClick={() => onTagClick && onTagClick(tag)}
                >
                  <TagIcon className="w-3 h-3 mr-1 text-teal-500" />
                  {tag}
                </motion.span>
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
};

export default Blog;
