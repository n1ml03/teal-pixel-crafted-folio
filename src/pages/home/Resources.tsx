import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Resource, resourceCategories, resources } from '@/data/resources.ts';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import ResourceCard from '@/components/utils/ResourceCard.tsx';
import {
  Search,
  Filter,
  Code,
  BookOpen,
  Download,
  Star,
  Info,
  Sparkles,
  Bookmark,
  Layers,
  ChevronUp,
  ChevronDown,
  Users,
  Quote,
  Github,
  Heart} from 'lucide-react';

// Enhanced Category Filter Component
const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: { 
  categories: any[]; 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void; 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === ''
            ? 'bg-teal-500 text-white shadow-lg'
            : 'bg-white/80 text-gray-600 hover:bg-teal-50 border border-gray-200'
        }`}
        onClick={() => onCategoryChange('')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        All Resources
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category.name
              ? 'bg-teal-500 text-white shadow-lg'
              : 'bg-white/80 text-gray-600 hover:bg-teal-50 border border-gray-200'
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
const ResourceStats = () => {
  const stats = [
    { number: `${resources.length}+`, label: "Curated Resources", icon: <BookOpen className="w-5 h-5" /> },
    { number: `${resourceCategories.length}`, label: "Categories", icon: <Layers className="w-5 h-5" /> },
    { number: `${resources.filter(r => r.featured).length}`, label: "Featured Tools", icon: <Star className="w-5 h-5" /> },
    { number: "10K+", label: "Developers Helped", icon: <Users className="w-5 h-5" /> }
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

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPricing, setSelectedPricing] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 50]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('resourceSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Memoized search and filter function to improve performance
  const filterResources = useCallback(() => {
    // Debounce search to improve performance
    const searchTimer = setTimeout(() => {
      let result = resources;

      // Filter by search query with relevance scoring
      if (searchQuery) {
        const query = searchQuery.toLowerCase();

        // Calculate relevance score for each resource
        const scoredResources = resources.map(resource => {
          let score = 0;

          // Title match (highest weight)
          if (resource.title.toLowerCase() === query) {
            score += 100; // Exact title match
          } else if (resource.title.toLowerCase().includes(query)) {
            score += 50; // Partial title match
          }

          // Category match
          if (resource.category.toLowerCase().includes(query)) {
            score += 30;
          }

          // Tag matches (good relevance)
          const tagMatches = resource.tags.filter(tag =>
            tag.toLowerCase().includes(query)
          ).length;
          score += tagMatches * 25;

          // Type match
          if (resource.type.toLowerCase().includes(query)) {
            score += 20;
          }

          // Description match (lowest weight but still valuable)
          if (resource.description.toLowerCase().includes(query)) {
            score += 15;
          }

          // Pricing match
          if (resource.pricing && resource.pricing.toLowerCase().includes(query)) {
            score += 15;
          }

          // Difficulty match
          if (resource.difficulty && resource.difficulty.toLowerCase().includes(query)) {
            score += 10;
          }

          return { resource, score };
        });

        // Filter resources with a score > 0 and sort by score
        result = scoredResources
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.resource);
      }

      // Apply additional filters
      if (selectedCategory) {
        result = result.filter(resource => resource.category === selectedCategory);
      }

      if (selectedTag) {
        result = result.filter(resource => resource.tags.includes(selectedTag));
      }

      if (selectedType) {
        result = result.filter(resource => resource.type === selectedType);
      }

      if (selectedPricing) {
        result = result.filter(resource => resource.pricing === selectedPricing);
      }

      setFilteredResources(result);
    }, 100); // Reduced debounce time for faster response

    return () => clearTimeout(searchTimer);
  }, [searchQuery, selectedCategory, selectedTag, selectedType, selectedPricing]);

  // Apply filters when dependencies change
  useEffect(() => {
    filterResources();
  }, [filterResources]);

  // Save search to history
  const saveSearchToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 5); // Keep only 5 most recent searches
      setSearchHistory(newHistory);
      localStorage.setItem('resourceSearchHistory', JSON.stringify(newHistory));
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Save to history
      saveSearchToHistory(searchQuery);
      // The filtering will be handled by the useEffect
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedType('');
    setSelectedPricing('');
    setSearchQuery('');
  };

  // Apply type filter
  const applyTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type);
  };

  // Apply pricing filter
  const applyPricingFilter = (pricing: string) => {
    setSelectedPricing(pricing === selectedPricing ? '' : pricing);
  };

  // Get all unique tags from resources

  // Enhanced testimonials data

  // FAQ data

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
                <span className="text-sm font-medium text-gray-700">Curated Developer Collection</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Developer{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Resources
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
                A handpicked collection of the best tools, resources, and guides for developers 
                and QA engineers to boost productivity and enhance skills.
              </motion.p>

              {/* Enhanced Search Bar */}
              <motion.div
                className="relative max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    type="text"
                    placeholder="Search tools, libraries, frameworks, and resources..."
                    className="pl-12 pr-4 py-4 rounded-2xl border-gray-200 focus:border-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </form>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Filter by Category</h3>
              <CategoryFilter
                categories={resourceCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {/* Enhanced Sidebar with filters */}
              <div className="lg:w-1/4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6 sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-teal-500" />
                        <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                          <motion.button
                            onClick={resetFilters}
                            className="text-xs text-teal-600 hover:text-teal-700 flex items-center bg-teal-50 px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reset All
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={isFilterExpanded ? "Collapse filters" : "Expand filters"}
                          title={isFilterExpanded ? "Collapse filters" : "Expand filters"}
                        >
                          {isFilterExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Filter content - collapsible */}
                    <motion.div
                      className="space-y-6"
                      initial={{ height: "auto", opacity: 1 }}
                      animate={{
                        height: isFilterExpanded ? "auto" : 0,
                        opacity: isFilterExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      {/* Resource Type */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-teal-500" />
                          Resource Type
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['tool', 'library', 'framework', 'language', 'service', 'course', 'guide', 'template'].map((type) => {
                            const count = resources.filter(r => r.type === type).length;
                            const isSelected = selectedType === type;
                            return (
                              <Badge
                                key={type}
                                className={`cursor-pointer flex items-center justify-between px-3 py-2 transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-teal-100 text-teal-700 border-teal-200 shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                }`}
                                onClick={() => applyTypeFilter(type)}
                              >
                                <span className="capitalize text-xs">{type}</span>
                                <span className="ml-1 bg-white/50 px-1.5 py-0.5 rounded-full text-xs">
                                  {count}
                                </span>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-teal-500" />
                          Pricing
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['free', 'freemium', 'paid', 'open-source'].map((pricing) => {
                            const count = resources.filter(r => r.pricing === pricing).length;
                            const isSelected = selectedPricing === pricing;
                            return (
                              <Badge
                                key={pricing}
                                className={`cursor-pointer flex items-center justify-between px-3 py-2 transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-teal-100 text-teal-700 border-teal-200 shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                                }`}
                                onClick={() => applyPricingFilter(pricing)}
                              >
                                <div className="flex items-center gap-1.5">
                                  {pricing === 'free' && <Download className="w-3 h-3" />}
                                  {pricing === 'freemium' && <Star className="w-3 h-3" />}
                                  {pricing === 'paid' && <Bookmark className="w-3 h-3" />}
                                  {pricing === 'open-source' && <Code className="w-3 h-3" />}
                                  <span className="capitalize text-xs">{pricing}</span>
                                </div>
                                <span className="ml-1 bg-white/50 px-1.5 py-0.5 rounded-full text-xs">
                                  {count}
                                </span>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="lg:w-3/4">
                {/* Enhanced Results count and active filters */}
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center mb-3 md:mb-0">
                      <Info className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" />
                      <p className="text-gray-600">
                        Showing <span className="font-medium text-lg text-teal-600">{filteredResources.length}</span> of <span className="font-medium text-lg">{resources.length}</span> resources
                        {searchQuery && (
                          <span className="ml-1">
                            for <span className="font-medium italic text-teal-600">"{searchQuery}"</span>
                          </span>
                        )}
                      </p>
                    </div>

                    {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                      <div className="flex flex-wrap items-center gap-2">
                        {searchQuery && (
                          <Badge className="bg-gray-100 text-gray-700 px-3 py-2 flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            <Search className="w-3 h-3" />
                            {searchQuery}
                            <button
                              onClick={() => setSearchQuery('')}
                              className="ml-1 hover:text-gray-900 font-bold"
                              aria-label="Clear search"
                            >
                              ×
                            </button>
                          </Badge>
                        )}

                        {selectedCategory && (
                          <Badge className="bg-teal-100 text-teal-700 px-3 py-2 flex items-center gap-2 hover:bg-teal-200 transition-colors">
                            <Layers className="w-3 h-3" />
                            {selectedCategory}
                            <button
                              onClick={() => setSelectedCategory('')}
                              className="ml-1 hover:text-teal-900 font-bold"
                              aria-label="Clear category filter"
                            >
                              ×
                            </button>
                          </Badge>
                        )}

                        {selectedType && (
                          <Badge className="bg-indigo-100 text-indigo-700 px-3 py-2 flex items-center gap-2 hover:bg-indigo-200 transition-colors">
                            <BookOpen className="w-3 h-3" />
                            {selectedType}
                            <button
                              onClick={() => setSelectedType('')}
                              className="ml-1 hover:text-indigo-900 font-bold"
                              aria-label="Clear type filter"
                            >
                              ×
                            </button>
                          </Badge>
                        )}

                        {selectedPricing && (
                          <Badge className="bg-purple-100 text-purple-700 px-3 py-2 flex items-center gap-2 hover:bg-purple-200 transition-colors">
                            <Star className="w-3 h-3" />
                            {selectedPricing}
                            <button
                              onClick={() => setSelectedPricing('')}
                              className="ml-1 hover:text-purple-900 font-bold"
                              aria-label="Clear pricing filter"
                            >
                              ×
                            </button>
                          </Badge>
                        )}

                        {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={resetFilters}
                              variant="outline"
                              className="text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border-gray-200 px-4 py-2 rounded-xl"
                            >
                              Clear All Filters
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Resources grid */}
                {filteredResources.length > 0 ? (
                  <>
                    {/* Featured resources section */}
                    {filteredResources.some(r => r.featured) && (
                      <div className="mb-12">
                        <div className="flex items-center mb-8">
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
                          <h3 className="text-2xl font-bold text-gray-800 px-6 flex items-center">
                            <Star className="w-6 h-6 mr-3 text-amber-500" fill="currentColor" />
                            Featured Resources
                          </h3>
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
                        </div>

                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {filteredResources.filter(r => r.featured).map((resource, index) => (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <ResourceCard
                                resource={resource}
                                index={index}
                                onTagClick={setSelectedTag}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    )}

                    {/* Regular resources */}
                    <div className="mb-6">
                      {filteredResources.some(r => r.featured) && (
                        <div className="flex items-center mb-8">
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          <h3 className="text-2xl font-bold text-gray-800 px-6">All Resources</h3>
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        </div>
                      )}

                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {filteredResources
                          .filter(r => filteredResources.some(fr => fr.featured) ? !r.featured : true)
                          .map((resource, index) => (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              viewport={{ once: true }}
                            >
                              <ResourceCard
                                resource={resource}
                                index={index}
                                onTagClick={setSelectedTag}
                              />
                            </motion.div>
                          ))}
                      </motion.div>
                    </div>
                  </>
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

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Resources Found</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        We couldn't find any resources matching your current filters. Try adjusting your search criteria or reset all filters.
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={resetFilters}
                          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl px-8 py-3 shadow-lg"
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Reset All Filters
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Resource Stats */}
        <section className="py-24 bg-white/40 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Resource <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">Impact</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Numbers that reflect the value and reach of our curated collection
              </p>
            </motion.div>
            <ResourceStats />
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
                Boost Your
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                  Development Workflow
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                Discover new tools, stay updated with the latest resources, and connect with 
                the developer community for continuous learning and growth.
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
                    <Heart className="w-4 h-4 mr-2" />
                    Suggest Resource
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
                    <Github className="w-4 h-4 mr-2" />
                    Contribute
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

export default Resources;