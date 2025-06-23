import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BlogPost } from '@/types/blog.ts';
import { blogPosts, blogCategories, blogTags } from '@/data/blog-posts.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import { Search, Sparkles, BookOpen, PenTool, Star, Award, Users, MessageCircle, Mail, Rss, Filter, Target } from 'lucide-react';
import BlogPostCard from '@/components/utils/BlogPostCard.tsx';

// Enhanced Category Filter Component
const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: { 
  categories: { id: string; name: string }[]; 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void; 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === ''
            ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
            : 'bg-white/90 border hover:border-teal-300 hover:bg-teal-50 text-gray-700 border'
        }`}
        onClick={() => onCategoryChange('')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        All Articles
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category.name
              ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg'
              : 'bg-white/90 border hover:border-teal-300 hover:bg-teal-50 text-gray-700 border'
          }`}
          onClick={() => onCategoryChange(category.name)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

// Enhanced Stats Component
const BlogStats = () => {
  const stats = [
    { number: "50+", label: "Articles Published", icon: <BookOpen className="w-5 h-5" /> },
    { number: "10K+", label: "Monthly Readers", icon: <Users className="w-5 h-5" /> },
    { number: "95%", label: "Reader Satisfaction", icon: <Star className="w-5 h-5" /> },
    { number: "2+", label: "Years Writing", icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1, type: "spring", damping: 25 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {stat.icon}
          </motion.div>
          <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-500 bg-clip-text text-transparent mb-1">
            {stat.number}
          </div>
          <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Newsletter Signup Component
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Floating elements */}
      <motion.div 
        className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"
        animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full"
        animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Mail className="w-6 h-6 mr-3" />
          <h3 className="text-2xl font-bold">Stay Updated</h3>
        </div>
        <p className="text-primary-foreground/80 mb-6 leading-relaxed">
          Get the latest articles, tutorials, and insights delivered straight to your inbox. 
          Join 10,000+ developers who trust our content.
        </p>

        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-white/20 focus:border-white/40"
              required
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit"
                variant="secondary"
                className="w-full font-semibold py-3 rounded-xl shadow-lg bg-white text-teal-600 hover:bg-gray-50"
              >
                <Rss className="w-4 h-4 mr-2" />
                Subscribe Now
              </Button>
            </motion.div>
          </form>
        ) : (
          <motion.div
            className="text-center py-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary-foreground" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Welcome aboard! 🎉</h4>
            <p className="text-primary-foreground/80">Thank you for subscribing. Check your email for confirmation.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 50]);

  // Memoized filter function for better performance
  const filterPosts = useCallback(() => {
    let filteredPosts = [...blogPosts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        // Only search in content if necessary (can be expensive)
        (post.content.length < 5000 ? post.content.toLowerCase().includes(query) : false)
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

  // Apply filters when dependencies change
  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20"
        style={{ y: y1 }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-30"
        style={{ y: y2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-100 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <Header />

      <main className="pt-20 relative z-10">
        {/* Enhanced Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
            >
              {/* Floating badge */}
              <motion.div
                className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-teal-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-teal-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Insights & Knowledge Hub</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Blog &{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Articles
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Thoughts, tutorials, and insights on development, testing, and quality assurance. 
                Learn from real-world experiences and practical solutions.
              </motion.p>

              {/* Enhanced Search Bar */}
              <motion.div
                className="relative max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Input
                  type="text"
                  placeholder="Search articles by title, content, or topic..."
                  className="pl-12 pr-4 py-4 rounded-2xl border focus:border-primary shadow-lg hover:shadow-xl transition-all duration-300 bg-background/90 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-white/20">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">Filter by Category</h3>
              <CategoryFilter
                categories={blogCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>
          </div>
        </section>

        {/* Blog Content Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {/* Main Content */}
              <div className="w-full lg:w-2/3">
                {/* Enhanced Filter indicators */}
                {(selectedCategory || selectedTag || searchQuery) && (
                  <motion.div
                    className="mb-8 flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-sm text-muted-foreground font-medium flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Active filters:
                    </span>

                    {selectedCategory && (
                      <Badge variant="secondary" className="px-4 py-2 flex items-center gap-2">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('')}
                          className="ml-1 text-secondary-foreground hover:text-foreground hover:bg-accent rounded-full w-5 h-5 flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    {selectedTag && (
                      <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                        Tag: {selectedTag}
                        <button
                          onClick={() => setSelectedTag('')}
                          className="ml-1 text-foreground hover:text-muted-foreground hover:bg-accent rounded-full w-5 h-5 flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    {searchQuery && (
                      <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 text-foreground hover:text-muted-foreground hover:bg-accent rounded-full w-5 h-5 flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={resetFilters}
                        variant="outline"
                        className="text-sm ml-2 px-4 py-2 rounded-xl border-2 border-teal-200 text-teal-600 hover:bg-teal-50"
                      >
                        Reset all filters
                      </Button>
                    </motion.div>
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
                    className="text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-12 relative overflow-hidden max-w-2xl mx-auto"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.div
                        className="text-gray-400 mb-6 bg-gray-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto"
                        initial={{ y: 10 }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      >
                        <BookOpen className="h-12 w-12 text-teal-500" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-foreground mb-3">No Articles Found</h3>
                      <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                        We couldn't find any articles matching your current filters. Try adjusting your search criteria or reset all filters.
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={resetFilters}
                          className="rounded-xl px-8 py-3 shadow-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Reset All Filters
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Enhanced Sidebar */}
              <div className="w-full lg:w-1/3">
                <div className="sticky top-24 space-y-8">
                  {/* Newsletter Signup */}
                  <NewsletterSignup />

                  {/* Enhanced Categories */}
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {blogCategories.map(category => (
                        <motion.button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                            selectedCategory === category.name
                              ? 'bg-teal-100 text-teal-700 border-l-4 border-teal-500 font-semibold shadow-sm'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm'
                          }`}
                          whileHover={{ x: selectedCategory === category.name ? 0 : 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              selectedCategory === category.name 
                                ? 'bg-teal-500 text-teal-100' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {blogPosts.filter(post => post.category === category.name).length}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Enhanced Popular Tags */}
                  <motion.div
                    className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border p-6 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <PenTool className="w-4 h-4 text-primary-foreground" />
                      </div>
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blogTags.map((tag, index) => (
                        <motion.button
                          key={tag.id}
                          onClick={() => setSelectedTag(tag.name)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedTag === tag.name
                              ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-transparent hover:shadow-sm'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + (index * 0.03) }}
                          whileHover={{ y: -2, scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tag.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Stats */}
        <section className="py-24 bg-white/40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Blog <span className="text-primary">Impact</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Numbers that reflect the reach and value of our content
              </p>
            </motion.div>
            <BlogStats />
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Animated background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-blue-500"
            animate={{ 
              background: [
                "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #3b82f6 100%)",
                "linear-gradient(135deg, #14b8a6 0%, #3b82f6 50%, #0d9488 100%)",
                "linear-gradient(135deg, #3b82f6 0%, #0d9488 50%, #14b8a6 100%)"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {/* Floating elements */}
          <motion.div 
            className="absolute top-16 left-16 w-24 h-24 bg-white/10 rounded-full"
            animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-16 right-16 w-20 h-20 bg-white/10 rounded-full"
            animate={{ y: [0, 15, 0], x: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", damping: 25 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Stay Connected &
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                  Keep Learning
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Join our community of developers and QA professionals. Get the latest insights, 
                tutorials, and best practices delivered to your inbox.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="bg-white text-teal-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold shadow-lg"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Subscribe to Newsletter
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Join Discussion
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
