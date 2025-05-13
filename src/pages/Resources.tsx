import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MotionButton } from "@/components/ui/motion-button";
import { Resource, resourceCategories, resources } from '@/data/resources';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import ResourceCard from '@/components/utils/ResourceCard.tsx';
import {
  Search,
  Tag as TagIcon,
  Filter,
  Code,
  TestTube,
  Palette,
  Zap,
  GraduationCap,
  BookOpen,
  Download,
  Server,
  Shield,
  Star,
  Info,
  Sparkles,
  Bookmark,
  Layers,
  Wrench,
  Globe,
  Boxes,
  Library,
  BookText,
  FileBox,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPricing, setSelectedPricing] = useState('');
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

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
  const allTags = Array.from(new Set(resources.flatMap(resource => resource.tags))).sort();

  return (
    <div className="min-h-screen relative">
      <EnhancedBackground />

      <Header />
      <main id="main-content" className="pt-24 pb-16">
        {/* Hero section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium item-center"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-teal-500" />
                  CURATED COLLECTION
                </Badge>

                <motion.h1
                  className="text-5xl md:text-5xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                    Developer Resources & Tools
                  </span>
                </motion.h1>

                <motion.p
                  className="text-lg text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  A handpicked collection of the best tools, resources, and guides for developers and QA engineers to boost your productivity and skills.
                </motion.p>

                {/* Stats */}
                <motion.div
                  className="flex flex-wrap justify-center gap-8 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      {resources.length}+
                    </motion.p>
                    <p className="text-gray-500">Resources</p>
                  </div>

                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      {resourceCategories.length}
                    </motion.p>
                    <p className="text-gray-500">Categories</p>
                  </div>

                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      {resources.filter(r => r.featured).length}
                    </motion.p>
                    <p className="text-gray-500">Featured</p>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Main content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar with filters */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-6 sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-teal-500" />
                        <h3 className="font-bold text-gray-800">Filters</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                          <motion.button
                            onClick={resetFilters}
                            className="text-xs text-teal-600 hover:text-teal-700 flex items-center"
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reset All
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                          className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200"
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

                    {/* Search in sidebar - always visible */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Search className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                        Search Resources
                      </h4>
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <div className="relative flex items-center">
                          <Input
                            type="text"
                            placeholder="Search..."
                            className="pr-10 py-2 rounded-md border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white p-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center hover:shadow-[0_3px_10px_rgba(20,184,166,0.3)]"
                            aria-label="Search"
                          >
                            <Search className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
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
                      {/* Categories */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Layers className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Categories
                        </h4>
                        <div className="space-y-2">
                          {resourceCategories.map(category => (
                            <motion.button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.name === selectedCategory ? '' : category.name)}
                              className={`text-sm py-1.5 px-3 rounded-lg w-full text-left flex items-center transition-all ${
                                selectedCategory === category.name
                                  ? 'bg-teal-50 text-teal-700 font-medium shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {category.name === 'Testing & QA' && <TestTube className="w-3.5 h-3.5 mr-2 text-purple-500" />}
                              {category.name === 'Development' && <Code className="w-3.5 h-3.5 mr-2 text-blue-500" />}
                              {category.name === 'Design' && <Palette className="w-3.5 h-3.5 mr-2 text-pink-500" />}
                              {category.name === 'Productivity' && <Zap className="w-3.5 h-3.5 mr-2 text-yellow-500" />}
                              {category.name === 'Learning' && <GraduationCap className="w-3.5 h-3.5 mr-2 text-green-500" />}
                              {category.name === 'DevOps' && <Server className="w-3.5 h-3.5 mr-2 text-indigo-500" />}
                              {category.name === 'Security' && <Shield className="w-3.5 h-3.5 mr-2 text-red-500" />}
                              {category.name}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Resource Type */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Resource Type
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['tool', 'library', 'framework', 'language', 'service', 'course', 'guide', 'template'].map((type) => {
                            const count = resources.filter(r => r.type === type).length;
                            const isSelected = selectedType === type;
                            return (
                              <Badge
                                key={type}
                                className={`cursor-pointer flex items-center justify-between px-3 py-1.5 transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                                onClick={() => applyTypeFilter(type)}
                              >
                                <div className="flex items-center gap-1.5">
                                  {type === 'tool' && <Wrench className="w-3.5 h-3.5" />}
                                  {type === 'library' && <Library className="w-3.5 h-3.5" />}
                                  {type === 'framework' && <Boxes className="w-3.5 h-3.5" />}
                                  {type === 'language' && <Code className="w-3.5 h-3.5" />}
                                  {type === 'service' && <Globe className="w-3.5 h-3.5" />}
                                  {type === 'course' && <GraduationCap className="w-3.5 h-3.5" />}
                                  {type === 'guide' && <BookText className="w-3.5 h-3.5" />}
                                  {type === 'template' && <FileBox className="w-3.5 h-3.5" />}
                                  <span className="capitalize">{type}</span>
                                </div>
                                <span className={`ml-1 ${isSelected ? 'bg-teal-50' : 'bg-white'} px-1.5 py-0.5 rounded-full text-xs ${isSelected ? 'text-teal-600' : 'text-gray-500'}`}>
                                  {count}
                                </span>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      {/* Popular Tags */}
                      {/* <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <TagIcon className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Popular Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {allTags.slice(0, 15).map((tag, index) => (
                            <Badge
                              key={index}
                              className={`cursor-pointer flex items-center transition-all duration-300 ${
                                selectedTag === tag
                                  ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                            >
                              <TagIcon className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div> */}

                      {/* Pricing */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Download className="w-3.5 h-3.5 mr-1.5 text-teal-500" />
                          Pricing
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['free', 'freemium', 'paid', 'open-source'].map((pricing) => {
                            const count = resources.filter(r => r.pricing === pricing).length;
                            const isSelected = selectedPricing === pricing;

                            // Color configurations for each pricing type
                            const colorConfig = {
                              'free': {
                                base: 'bg-green-50 text-green-700',
                                selected: 'bg-green-100 text-green-800',
                                hover: 'hover:bg-green-100 hover:text-green-800',
                                active: 'active:bg-green-200 active:text-green-900',
                                countBg: isSelected ? 'bg-white/70' : 'bg-white/50'
                              },
                              'freemium': {
                                base: 'bg-blue-50 text-blue-700',
                                selected: 'bg-blue-100 text-blue-800',
                                hover: 'hover:bg-blue-100 hover:text-blue-800',
                                active: 'active:bg-blue-200 active:text-blue-900',
                                countBg: isSelected ? 'bg-white/70' : 'bg-white/50'
                              },
                              'paid': {
                                base: 'bg-purple-50 text-purple-700',
                                selected: 'bg-purple-100 text-purple-800',
                                hover: 'hover:bg-purple-100 hover:text-purple-800',
                                active: 'active:bg-purple-200 active:text-purple-900',
                                countBg: isSelected ? 'bg-white/70' : 'bg-white/50'
                              },
                              'open-source': {
                                base: 'bg-orange-50 text-orange-700',
                                selected: 'bg-orange-100 text-orange-800',
                                hover: 'hover:bg-orange-100 hover:text-orange-800',
                                active: 'active:bg-orange-200 active:text-orange-900',
                                countBg: isSelected ? 'bg-white/70' : 'bg-white/50'
                              }
                            };

                            const config = colorConfig[pricing];
                            const baseClasses = isSelected ? config.selected : config.base;
                            const interactionClasses = isSelected ? config.active : `${config.hover} ${config.active}`;

                            return (
                              <Badge
                                key={pricing}
                                className={`cursor-pointer ${baseClasses} ${interactionClasses} px-3 py-1.5 flex items-center justify-between shadow-sm transition-all duration-300`}
                                onClick={() => applyPricingFilter(pricing)}
                              >
                                <div className="flex items-center gap-1.5">
                                  {pricing === 'free' && <Download className="w-3.5 h-3.5" />}
                                  {pricing === 'freemium' && <Star className="w-3.5 h-3.5" />}
                                  {pricing === 'paid' && <Bookmark className="w-3.5 h-3.5" />}
                                  {pricing === 'open-source' && <Code className="w-3.5 h-3.5" />}
                                  <span className="capitalize">{pricing}</span>
                                </div>
                                <span className={`ml-1 ${config.countBg} px-1.5 py-0.5 rounded-full text-xs`}>
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
                {/* Results count and sorting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-3 md:mb-0">
                    <Info className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600">
                      Showing <span className="font-medium">{filteredResources.length}</span> of <span className="font-medium">{resources.length}</span> resources
                      {searchQuery && (
                        <span className="ml-1">
                          for <span className="font-medium italic">"{searchQuery}"</span>
                        </span>
                      )}
                    </p>
                  </div>

                  {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {searchQuery && (
                        <Badge className="bg-gray-100 text-gray-700 px-3 py-1 flex items-center gap-1">
                          <Search className="w-3 h-3" />
                          {searchQuery}
                          <button
                            onClick={() => setSearchQuery('')}
                            className="ml-1 hover:text-gray-900"
                            aria-label="Clear search"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedCategory && (
                        <Badge className="bg-teal-100 text-teal-700 px-3 py-1 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {selectedCategory}
                          <button
                            onClick={() => setSelectedCategory('')}
                            className="ml-1 hover:text-teal-900"
                            aria-label="Clear category filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedTag && (
                        <Badge className="bg-blue-100 text-blue-700 px-3 py-1 flex items-center gap-1">
                          <TagIcon className="w-3 h-3" />
                          {selectedTag}
                          <button
                            onClick={() => setSelectedTag('')}
                            className="ml-1 hover:text-blue-900"
                            aria-label="Clear tag filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedType && (
                        <Badge className="bg-indigo-100 text-indigo-700 px-3 py-1 flex items-center gap-1">
                          {selectedType === 'tool' && <Wrench className="w-3 h-3" />}
                          {selectedType === 'library' && <Library className="w-3 h-3" />}
                          {selectedType === 'framework' && <Boxes className="w-3 h-3" />}
                          {selectedType === 'language' && <Code className="w-3 h-3" />}
                          {selectedType === 'service' && <Globe className="w-3 h-3" />}
                          {selectedType === 'course' && <GraduationCap className="w-3 h-3" />}
                          {selectedType === 'guide' && <BookText className="w-3 h-3" />}
                          {selectedType === 'template' && <FileBox className="w-3 h-3" />}
                          {selectedType}
                          <button
                            onClick={() => setSelectedType('')}
                            className="ml-1 hover:text-indigo-900"
                            aria-label="Clear type filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {selectedPricing && (
                        <Badge className="bg-purple-100 text-purple-700 px-3 py-1 flex items-center gap-1">
                          {selectedPricing === 'free' && <Download className="w-3 h-3" />}
                          {selectedPricing === 'freemium' && <Star className="w-3 h-3" />}
                          {selectedPricing === 'paid' && <Bookmark className="w-3 h-3" />}
                          {selectedPricing === 'open-source' && <Code className="w-3 h-3" />}
                          {selectedPricing}
                          <button
                            onClick={() => setSelectedPricing('')}
                            className="ml-1 hover:text-purple-900"
                            aria-label="Clear pricing filter"
                          >
                            ×
                          </button>
                        </Badge>
                      )}

                      {(selectedCategory || selectedTag || selectedType || selectedPricing || searchQuery) && (
                        <button
                          onClick={resetFilters}
                          className="text-xs text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all duration-300 px-2 py-1 rounded-md flex items-center"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Resources grid */}
                {filteredResources.length > 0 ? (
                  <>
                    {/* Featured resources section - only show if there are featured resources in filtered results */}
                    {filteredResources.some(r => r.featured) && (
                      <div className="mb-12">
                        <div className="flex items-center mb-6">
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          <h3 className="text-lg font-bold text-gray-800 px-4 flex items-center">
                            <Star className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" />
                            Featured Resources
                          </h3>
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        </div>

                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {filteredResources.filter(r => r.featured).map((resource, index) => (
                            <ScrollReveal
                              key={resource.id}
                              delay={index * 0.05} // Reduced delay for faster appearance
                              threshold={0.05}
                            >
                              <ResourceCard
                                resource={resource}
                                index={index}
                                onTagClick={setSelectedTag}
                              />
                            </ScrollReveal>
                          ))}
                        </motion.div>
                      </div>
                    )}

                    {/* Regular resources */}
                    <div className="mb-6">
                      {filteredResources.some(r => r.featured) && (
                        <div className="flex items-center mb-6">
                          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          <h3 className="text-lg font-bold text-gray-800 px-4">All Resources</h3>
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
                            <ScrollReveal
                              key={resource.id}
                              delay={index * 0.05} // Reduced delay for faster appearance
                              threshold={0.05}
                            >
                              <ResourceCard
                                resource={resource}
                                index={index}
                                onTagClick={setSelectedTag}
                              />
                            </ScrollReveal>
                          ))}
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100 p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-center mb-6">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Search className="w-20 h-20 text-gray-200" />
                      </motion.div>
                    </div>
                    <motion.h3
                      className="text-2xl font-bold text-gray-800 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {searchQuery
                        ? `No results found for "${searchQuery}"`
                        : "No resources found"
                      }
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 mb-8 max-w-md mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {searchQuery ? (
                        <>
                          We couldn't find any resources matching your search. Try:
                          <ul className="mt-4 text-left max-w-xs mx-auto space-y-2">
                            <li className="flex items-start">
                              <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                              <span>Checking for typos or misspellings</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                              <span>Using more general keywords</span>
                            </li>
                            <li className="flex items-start">
                              <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                              <span>Removing filters to broaden your search</span>
                            </li>
                          </ul>
                        </>
                      ) : (
                        "We couldn't find any resources matching your criteria. Try adjusting your filters."
                      )}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                      <MotionButton
                        onClick={resetFilters}
                        className="bg-gray-700 text-white px-8 py-3 rounded-xl shadow-md"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.2)"
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Reset All Filters
                      </MotionButton>

                      {searchQuery && (
                        <MotionButton
                          onClick={() => {
                            // Keep other filters but clear search
                            setSearchQuery('');
                          }}
                          className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl shadow-sm"
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 8px 15px -5px rgba(0, 0, 0, 0.05)"
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Clear Search Only
                        </MotionButton>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;