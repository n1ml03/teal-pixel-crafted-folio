import React, { useState, useEffect, useRef, KeyboardEvent, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Book,
  Code,
  Bug,
  FileQuestion,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Trophy,
  HelpCircle,
  Lightbulb,
  Info,
  Zap,
  X,
  Filter,
  AlertCircle,
  CheckCircle,
  History
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNavigateWithTransition } from '@/hooks/useNavigateWithTransition';import { helpContent, faqs } from '../../data/help-content';
import { debounce } from 'lodash';
import { useIsMobile } from '@/hooks/use-mobile';

// Memoized components for better performance
// Sidebar component
const Sidebar = React.memo(({ navigate }: { navigate: (path: string) => void }) => (
  <div className="w-full lg:w-80 space-y-6">
    {/* Quick Links */}
    <Card className="bg-white/90 backdrop-blur-md border border shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <ChevronRight className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Quick Links</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-blue-50 transition-colors duration-200 text-gray-700 hover:text-blue-700"
            onClick={() => navigateWithTransition('/playground/sandbox')}
          >
            <Code className="mr-2 h-4 w-4 text-blue-500" />
            Sandbox Environment
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-blue-50 transition-colors duration-200 text-gray-700 hover:text-blue-700"
            onClick={() => navigateWithTransition('/playground/challenges')}
          >
            <ChevronRight className="mr-2 h-4 w-4 text-blue-500" />
            Challenges
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-blue-50 transition-colors duration-200 text-gray-700 hover:text-blue-700"
            onClick={() => navigateWithTransition('/playground/leaderboard')}
          >
            <Trophy className="mr-2 h-4 w-4 text-blue-500" />
            Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* External Resources */}
    <Card className="bg-white/90 backdrop-blur-md border border shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2 rounded-full">
            <ExternalLink className="h-5 w-5 text-teal-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">External Resources</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-200 group"
          >
            <div className="bg-teal-100 p-1.5 rounded-full mr-3 group-hover:bg-teal-200 transition-colors duration-200">
              <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <span className="text-sm">MDN: DOM Documentation</span>
          </a>
          <a
            href="https://jestjs.io/docs/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-200 group"
          >
            <div className="bg-teal-100 p-1.5 rounded-full mr-3 group-hover:bg-teal-200 transition-colors duration-200">
              <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <span className="text-sm">Jest Testing Framework</span>
          </a>
          <a
            href="https://www.w3.org/WAI/fundamentals/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-200 group"
          >
            <div className="bg-teal-100 p-1.5 rounded-full mr-3 group-hover:bg-teal-200 transition-colors duration-200">
              <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
            </div>
            <span className="text-sm">Web Accessibility Fundamentals</span>
          </a>
        </div>
      </CardContent>
    </Card>

    {/* Contact Support */}
    <Card className="bg-white/90 backdrop-blur-md border border shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <HelpCircle className="h-5 w-5 text-purple-600" />
          </div>
          <CardTitle className="text-lg text-gray-800">Need More Help?</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help you with any questions.
        </p>
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
          Contact Support
        </Button>
      </CardContent>
    </Card>
  </div>
));

// Hero section component
const HeroSection = React.memo(({ title, description, badges, isMobile }: {
  title: string;
  description: string;
  badges: React.ReactNode;
  isMobile: boolean;
}) => (
  <motion.div
    className={`mb-6 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
  >
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1">
        <motion.h1
          className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-700 mb-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {description}
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {badges}
        </motion.div>
      </div>
      {!isMobile && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
        >
          <HelpCircle className="h-24 w-24 text-blue-500/80" />
        </motion.div>
      )}
    </div>
  </motion.div>
));

const Help = () => {
  const navigate = useNavigate();
  const navigateWithTransition = useNavigateWithTransition();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('getting-started');
  const [activeFaqCategory, setActiveFaqCategory] = useState('all');
  const [searchCategory, setSearchCategory] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();

  // Initialize search query from URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      // Clear the URL parameter after reading it
      navigateWithTransition('/playground/help', { replace: true });
    }
  }, [searchParams, navigateWithTransition]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('helpRecentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse recent searches from localStorage');
      }
    }
  }, []);

  // Save recent searches to localStorage when they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('helpRecentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Optimized scroll handler with throttling
  useEffect(() => {
    // Throttle scroll event to improve performance
    const handleScroll = debounce(() => {
      setShowScrollTop(window.scrollY > 300);
    }, 100);

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Ensure the debounced function is properly cleaned up
      if (typeof handleScroll.cancel === 'function') {
        handleScroll.cancel();
      }
    };
  }, []);

  // Debounced search query handler to reduce processing on each keystroke
  const debouncedSetSearchQuery = useMemo(
    () => debounce((value: string) => {
      setSearchQuery(value);
      if (value.trim() === '') {
        setSearchCategory(null);
      }
    }, 300),
    [setSearchCategory]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    // Ensure the debounced function is properly initialized
    if (typeof debouncedSetSearchQuery.cancel === 'function') {
      return () => {
        debouncedSetSearchQuery.cancel();
      };
    }
    return undefined;
  }, [debouncedSetSearchQuery]);

  // Function to improve search algorithm with partial word matching - memoized
  const matchesSearch = useCallback((text: string, query: string): boolean => {
    if (!text || !query) return false;

    const normalizedText = text.toLowerCase();
    const normalizedQuery = query.toLowerCase().trim();

    // Exact match
    if (normalizedText.includes(normalizedQuery)) return true;

    // Split query into words for partial matching
    const queryWords = normalizedQuery.split(/\s+/);

    // Check if all words in the query are at least partially present in the text
    return queryWords.every(word => {
      // Match word boundaries or partial words (minimum 3 characters)
      if (word.length >= 3) {
        return normalizedText.includes(word);
      } else {
        // For very short words, require exact match
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(normalizedText);
      }
    });
  }, []);

  // Count matches by category - memoized
  const countMatchesByCategory = useCallback(() => {
    const counts = {
      'getting-started': 0,
      'testing-environment': 0,
      'bug-reporting': 0,
      'faq': 0
    };

    if (searchQuery.trim() === '') return counts;

    helpContent.forEach(item => {
      if (matchesSearch(item.title, searchQuery) || matchesSearch(item.content, searchQuery)) {
        counts[item.category]++;
      }
    });

    faqs.forEach(faq => {
      if (matchesSearch(faq.question, searchQuery) || matchesSearch(faq.answer, searchQuery)) {
        counts['faq']++;
      }
    });

    return counts;
  }, [searchQuery, matchesSearch]);

  // Memoize match counts to prevent recalculation on every render
  const matchCounts = useMemo(() => countMatchesByCategory(), [countMatchesByCategory]);

  // Filter help content - memoized
  const filteredContent = useMemo(() =>
    searchQuery.trim() === ''
      ? helpContent
      : helpContent.filter(item =>
          (searchCategory === null || item.category === searchCategory) &&
          (matchesSearch(item.title, searchQuery) || matchesSearch(item.content, searchQuery))
        ),
    [searchQuery, searchCategory, matchesSearch]
  );

  // Filter FAQs - memoized
  const filteredFaqs = useMemo(() =>
    searchQuery.trim() === ''
      ? (activeFaqCategory === 'all'
          ? faqs
          : faqs.filter(faq => faq.category === activeFaqCategory))
      : faqs.filter(faq =>
          (matchesSearch(faq.question, searchQuery) || matchesSearch(faq.answer, searchQuery)) &&
          (activeFaqCategory === 'all' || faq.category === activeFaqCategory)
        ),
    [searchQuery, activeFaqCategory, matchesSearch]
  );

  // Save search to recent searches - memoized with useCallback
  const saveSearchToHistory = useCallback((query: string) => {
    if (query.trim() === '') return;

    setRecentSearches(prev => {
      // Remove the query if it already exists to avoid duplicates
      const filtered = prev.filter(item => item !== query);
      // Add the new query to the beginning and limit to 5 items
      return [query, ...filtered].slice(0, 5);
    });
  }, []);

  // Handle search submission - memoized with useCallback
  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery);
      setShowRecentSearches(false);

      // If there are results in a specific category but not the current one,
      // automatically switch to a category with results
      if (filteredContent.length === 0 && filteredFaqs.length === 0) {
        const categoriesWithResults = Object.entries(matchCounts)
          .filter(([_, count]) => count > 0)
          .map(([category]) => category);

        if (categoriesWithResults.length > 0) {
          const firstCategoryWithResults = categoriesWithResults[0];
          if (firstCategoryWithResults === 'faq') {
            setActiveTab('faq');
          } else {
            setActiveTab(firstCategoryWithResults);
          }
        }
      }
    }
  }, [searchQuery, filteredContent.length, filteredFaqs.length, matchCounts, saveSearchToHistory, setActiveTab, setShowRecentSearches]);

  // Function to copy code to clipboard - memoized with useCallback
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  }, []);

  // Scroll to top function - memoized with useCallback
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Highlight search terms in content with improved algorithm - memoized with useCallback
  const highlightSearchTerm = useCallback((content: string, searchTerm: string) => {
    if (!searchTerm.trim()) return { __html: content };

    let highlightedContent = content;
    const normalizedQuery = searchTerm.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    // Highlight each word in the query
    queryWords.forEach(word => {
      if (word.length >= 2) {
        // Use a regex that matches the word with word boundaries when possible
        const regex = new RegExp(`(\\b${word}|${word})`, 'gi');
        highlightedContent = highlightedContent.replace(
          regex,
          '<mark class="bg-yellow-200 text-gray-900 px-1.5 py-0.5 rounded font-medium shadow-sm">$1</mark>'
        );
      }
    });

    return { __html: highlightedContent };
  }, []);

  // Handle keyboard events for search - memoized with useCallback
  const handleSearchKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    // Press Enter to submit search
    if (e.key === 'Enter') {
      handleSearchSubmit();
      e.preventDefault();
    }

    // Press Escape to clear search
    if (e.key === 'Escape') {
      setSearchQuery('');
      setShowRecentSearches(false);
      e.preventDefault();
    }

    // Press Down Arrow to navigate to search results or recent searches
    if (e.key === 'ArrowDown' && showRecentSearches && recentSearches.length > 0) {
      // Focus on first recent search item
      const firstResult = document.querySelector('[data-recent-search]') as HTMLElement;
      if (firstResult) {
        firstResult.focus();
        e.preventDefault();
      }
    }
  }, [handleSearchSubmit, recentSearches.length, setSearchQuery, showRecentSearches, setShowRecentSearches]);

  return (
    <div className="relative">
      <main className="container py-6 pt-24 relative z-10" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
        {/* Hero Section - using memoized component */}
        <HeroSection
          title="Help & Support Center"
          description="Find answers, learn testing techniques, and get the most out of the Testing Playground platform."
          badges={
            <>
              <Badge className={`bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}>Getting Started</Badge>
              <Badge className={`bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}>Testing Environment</Badge>
              <Badge className={`bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}>Bug Reporting</Badge>
              <Badge className={`bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}>FAQs</Badge>
            </>
          }
          isMobile={isMobile}
        />

        <div className={`flex ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'} gap-6`}>
          {/* Main Content */}
          <div
            className="flex-1"
          >
            {/* Enhanced Search Bar */}
            <div className="relative mb-6">
              <div className="relative group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-500 transition-all duration-300 group-hover:text-blue-600`} />
                <Input
                  ref={searchInputRef}
                  placeholder={isMobile ? "Search help..." : "Search for help topics..."}
                  className={`${isMobile ? 'pl-10 py-4' : 'pl-12 py-6'} bg-white/90 backdrop-blur-sm border border-blue-100 rounded-full shadow-sm transition-all duration-300 focus:shadow-md focus:border-blue-300 text-gray-700`}
                  value={searchQuery}
                  onChange={(e) => {
                    // Use debounced search to improve performance
                    debouncedSetSearchQuery(e.target.value);
                    setShowRecentSearches(e.target.value.trim() === '' && document.activeElement === searchInputRef.current);
                  }}
                  onFocus={() => {
                    setShowRecentSearches(searchQuery.trim() === '' && recentSearches.length > 0);
                  }}
                  onBlur={() => {
                    // Delay hiding recent searches to allow clicking on them
                    setTimeout(() => setShowRecentSearches(false), 200);
                  }}
                  onKeyDown={handleSearchKeyDown}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-gray-400 hover:text-gray-600`}
                      onClick={() => {
                        // Clear search and reset state
                        setSearchQuery('');
                        setSearchCategory(null);
                        debouncedSetSearchQuery.cancel();
                        debouncedSetSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      title="Clear search"
                    >
                      <X className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-blue-500 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/50`}
                    onClick={handleSearchSubmit}
                    title="Search"
                  >
                    <Search className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </Button>
                </div>
              </div>

              {/* Recent Searches Dropdown */}
              {showRecentSearches && recentSearches.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">Recent Searches</div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      data-recent-search
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                      onClick={() => {
                        setSearchQuery(search);
                        setShowRecentSearches(false);
                        handleSearchSubmit();
                      }}
                    >
                      <History className="h-4 w-4 text-gray-400" />
                      {search}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-xs text-gray-500"
                      onClick={() => {
                        setRecentSearches([]);
                        setShowRecentSearches(false);
                        localStorage.removeItem('helpRecentSearches');
                      }}
                    >
                      Clear recent searches
                    </button>
                  </div>
                </div>
              )}

              {/* Search Results Summary */}
              {searchQuery && (
                <div className="mt-3 mb-4">
                  {filteredContent.length > 0 || filteredFaqs.length > 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Found <span className="font-semibold text-blue-600">{filteredContent.length + filteredFaqs.length}</span> results for "{searchQuery}"
                        </span>
                      </div>

                      {/* Category Filters */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full text-xs ${searchCategory === null ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border'}`}
                          onClick={() => setSearchCategory(null)}
                        >
                          <Filter className="h-3 w-3 mr-1" />
                          All Categories ({filteredContent.length + filteredFaqs.length})
                        </Button>

                        {matchCounts['getting-started'] > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-full text-xs ${searchCategory === 'getting-started' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => {
                              setSearchCategory('getting-started');
                              setActiveTab('getting-started');
                            }}
                          >
                            <Book className="h-3 w-3 mr-1" />
                            Getting Started ({matchCounts['getting-started']})
                          </Button>
                        )}

                        {matchCounts['testing-environment'] > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-full text-xs ${searchCategory === 'testing-environment' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => {
                              setSearchCategory('testing-environment');
                              setActiveTab('testing-environment');
                            }}
                          >
                            <Code className="h-3 w-3 mr-1" />
                            Testing Environment ({matchCounts['testing-environment']})
                          </Button>
                        )}

                        {matchCounts['bug-reporting'] > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-full text-xs ${searchCategory === 'bug-reporting' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => {
                              setSearchCategory('bug-reporting');
                              setActiveTab('bug-reporting');
                            }}
                          >
                            <Bug className="h-3 w-3 mr-1" />
                            Bug Reporting ({matchCounts['bug-reporting']})
                          </Button>
                        )}

                        {matchCounts['faq'] > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-full text-xs ${searchCategory === 'faq' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => {
                              setSearchCategory('faq');
                              setActiveTab('faq');
                            }}
                          >
                            <FileQuestion className="h-3 w-3 mr-1" />
                            FAQs ({matchCounts['faq']})
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-amber-100 shadow-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">No results found for "{searchQuery}"</h3>
                          <p className="text-sm text-gray-600 mb-3">Try adjusting your search terms or browse the categories below.</p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs bg-blue-50 text-blue-700 border-blue-200"
                              onClick={() => {
                                setSearchQuery('');
                                setActiveTab('getting-started');
                              }}
                            >
                              <Book className="h-3 w-3 mr-1" />
                              Browse Getting Started
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs bg-teal-50 text-teal-700 border-teal-200"
                              onClick={() => {
                                setSearchQuery('');
                                setActiveTab('testing-environment');
                              }}
                            >
                              <Code className="h-3 w-3 mr-1" />
                              Browse Testing Environment
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs bg-purple-50 text-purple-700 border-purple-200"
                              onClick={() => {
                                setSearchQuery('');
                                setActiveTab('bug-reporting');
                              }}
                            >
                              <Bug className="h-3 w-3 mr-1" />
                              Browse Bug Reporting
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs bg-amber-50 text-amber-700 border-amber-200"
                              onClick={() => {
                                setSearchQuery('');
                                setActiveTab('faq');
                              }}
                            >
                              <FileQuestion className="h-3 w-3 mr-1" />
                              Browse FAQs
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className={`${isMobile ? 'grid grid-cols-2 gap-1 h-auto p-1' : 'grid grid-cols-2 md:grid-cols-4'} mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm`}>
                <TabsTrigger
                  value="getting-started"
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300 ${isMobile ? 'text-xs px-2 py-3 flex-col h-auto' : ''}`}
                >
                  <Book className={`${isMobile ? 'h-3 w-3 mb-1' : 'h-4 w-4 mr-2'}`} />
                  {isMobile ? 'Getting Started' : 'Getting Started'}
                </TabsTrigger>
                <TabsTrigger
                  value="testing-environment"
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-300 ${isMobile ? 'text-xs px-2 py-3 flex-col h-auto' : ''}`}
                >
                  <Code className={`${isMobile ? 'h-3 w-3 mb-1' : 'h-4 w-4 mr-2'}`} />
                  {isMobile ? 'Testing' : 'Testing Environment'}
                </TabsTrigger>
                <TabsTrigger
                  value="bug-reporting"
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300 ${isMobile ? 'text-xs px-2 py-3 flex-col h-auto' : ''}`}
                >
                  <Bug className={`${isMobile ? 'h-3 w-3 mb-1' : 'h-4 w-4 mr-2'}`} />
                  {isMobile ? 'Bug Report' : 'Bug Reporting'}
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-300 ${isMobile ? 'text-xs px-2 py-3 flex-col h-auto' : ''}`}
                >
                  <FileQuestion className={`${isMobile ? 'h-3 w-3 mb-1' : 'h-4 w-4 mr-2'}`} />
                  FAQ
                </TabsTrigger>
              </TabsList>

              {/* Getting Started Content */}
              <TabsContent value="getting-started">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-b border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Book className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-blue-900">Getting Started with Testing Playground</CardTitle>
                          <CardDescription className="text-blue-700">
                            Learn the basics of using the Testing Playground platform
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-280px)] min-h-[400px]' : 'h-[calc(80vh-180px)] min-h-[650px]'}`}>
                        <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                          {filteredContent
                            .filter(item => item.category === 'getting-started')
                            .map((item, index) => (
                              <div key={index} className={`${isMobile ? 'mb-4 p-4' : 'mb-8 p-6'} bg-blue-50/50 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow`}>
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <Lightbulb className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-600`} />
                                  </div>
                                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-blue-900`}>{item.title}</h3>
                                </div>
                                <div className={`${isMobile ? 'text-sm leading-relaxed text-gray-800 pl-8' : 'text-base leading-relaxed text-gray-800 pl-10'} prose prose-blue max-w-none prose-headings:text-blue-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-blue-900 prose-code:text-blue-800 prose-code:bg-blue-100/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none`}>
                                  <div className="whitespace-pre-wrap">{item.content.replace(/<[^>]*>/g, '')}</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/20 p-4">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => navigateWithTransition('/playground/sandbox')}
                      >
                        Try the Sandbox Environment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Testing Environment Content */}
              <TabsContent value="testing-environment">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-teal-100 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-teal-500/10 to-teal-600/5 border-b border-teal-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-100 p-2 rounded-full">
                          <Code className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-teal-900">Using the Testing Environment</CardTitle>
                          <CardDescription className="text-teal-700">
                            Learn how to use the testing environment effectively
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-280px)] min-h-[400px]' : 'h-[calc(80vh-180px)] min-h-[650px]'}`}>
                        <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                          {filteredContent
                            .filter(item => item.category === 'testing-environment')
                            .map((item, index) => (
                              <div key={index} className={`${isMobile ? 'mb-4 p-4' : 'mb-8 p-6'} bg-teal-50/50 rounded-lg border border-teal-100/50 hover:border-teal-200 transition-all duration-300 shadow-sm hover:shadow`}>
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="bg-teal-100 p-2 rounded-full">
                                    <Code className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-teal-600`} />
                                  </div>
                                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-teal-900`}>{item.title}</h3>
                                </div>
                                <div className={`${isMobile ? 'text-sm leading-relaxed text-gray-800 pl-8' : 'text-base leading-relaxed text-gray-800 pl-10'} prose prose-teal max-w-none prose-headings:text-teal-900 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-teal-900 prose-code:text-teal-800 prose-code:bg-teal-100/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-teal-50 prose-pre:border prose-pre:border-teal-200/50 prose-pre:rounded-lg`}>
                                  <div className="whitespace-pre-wrap">{item.content.replace(/<[^>]*>/g, '')}</div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Bug Reporting Content */}
              <TabsContent value="bug-reporting">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-purple-100 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Bug className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-purple-900">Bug Reporting Guide</CardTitle>
                          <CardDescription className="text-purple-700">
                            Learn how to effectively report bugs and issues
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-280px)] min-h-[400px]' : 'h-[calc(80vh-180px)] min-h-[650px]'}`}>
                        <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                          {filteredContent
                            .filter(item => item.category === 'bug-reporting')
                            .map((item, index) => (
                              <div key={index} className={`${isMobile ? 'mb-4 p-4' : 'mb-8 p-6'} bg-purple-50/50 rounded-lg border border-purple-100/50 hover:border-purple-200 transition-all duration-300 shadow-sm hover:shadow`}>
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="bg-purple-100 p-2 rounded-full">
                                    <Bug className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-600`} />
                                  </div>
                                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-purple-900`}>{item.title}</h3>
                                </div>
                                <div className={`${isMobile ? 'text-sm leading-relaxed text-gray-800 pl-8' : 'text-base leading-relaxed text-gray-800 pl-10'} prose prose-purple max-w-none prose-headings:text-purple-900 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-purple-900 prose-code:text-purple-800 prose-code:bg-purple-100/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-ol:pl-1 prose-ul:pl-1 prose-li:mb-2`} dangerouslySetInnerHTML={searchQuery.trim() ? highlightSearchTerm(item.content, searchQuery) : { __html: item.content }} />
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* FAQ Content */}
              <TabsContent value="faq">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/90 backdrop-blur-md border border-amber-100 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-b border-amber-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <FileQuestion className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-amber-900">Frequently Asked Questions</CardTitle>
                          <CardDescription className="text-amber-700">
                            Find answers to common questions about the Testing Playground
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-amber-100 bg-amber-50/50`}>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "sm"}
                            className={`rounded-full ${isMobile ? 'text-xs px-2 py-1' : ''} ${activeFaqCategory === 'all' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => setActiveFaqCategory('all')}
                          >
                            All
                          </Button>
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "sm"}
                            className={`rounded-full ${isMobile ? 'text-xs px-2 py-1' : ''} ${activeFaqCategory === 'general' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => setActiveFaqCategory('general')}
                          >
                            General
                          </Button>
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "sm"}
                            className={`rounded-full ${isMobile ? 'text-xs px-2 py-1' : ''} ${activeFaqCategory === 'account' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => setActiveFaqCategory('account')}
                          >
                            Account
                          </Button>
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "sm"}
                            className={`rounded-full ${isMobile ? 'text-xs px-2 py-1' : ''} ${activeFaqCategory === 'challenges' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => setActiveFaqCategory('challenges')}
                          >
                            Challenges
                          </Button>
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "sm"}
                            className={`rounded-full ${isMobile ? 'text-xs px-2 py-1' : ''} ${activeFaqCategory === 'technical' ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-white text-gray-600 border'}`}
                            onClick={() => setActiveFaqCategory('technical')}
                          >
                            Technical
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-320px)] min-h-[350px]' : 'h-[calc(80vh-220px)] min-h-[600px]'}`}>
                        <div className={`${isMobile ? 'p-4' : 'p-8'}`}>
                          <Accordion type="single" collapsible className="w-full">
                            {filteredFaqs.map((faq, index) => (
                              <AccordionItem
                                key={index}
                                value={`faq-${index}`}
                                className="border-b border-amber-100 last:border-0"
                              >
                                <AccordionTrigger className={`text-left hover:bg-amber-50/50 ${isMobile ? 'px-2 py-3' : 'px-4 py-4'} rounded-lg text-amber-900 font-medium`}>
                                  <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 p-2 rounded-full">
                                      {faq.category === 'general' && <Info className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-amber-600`} />}
                                      {faq.category === 'account' && <HelpCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-amber-600`} />}
                                      {faq.category === 'challenges' && <Trophy className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-amber-600`} />}
                                      {faq.category === 'technical' && <Zap className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-amber-600`} />}
                                    </div>
                                    <span className={`${isMobile ? 'text-base' : 'text-lg'}`}>{faq.question}</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className={`${isMobile ? 'px-2 pb-4 pt-2' : 'px-4 pb-6 pt-3'}`}>
                                  <div className={`${isMobile ? 'text-sm leading-relaxed text-gray-800 pl-8 bg-amber-50/30 p-4 rounded-lg' : 'text-base leading-relaxed text-gray-800 pl-10 bg-amber-50/30 p-6 rounded-lg'} prose prose-amber max-w-none prose-headings:text-amber-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-amber-900 prose-code:text-amber-800 prose-code:bg-amber-100/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-ol:pl-1 prose-ul:pl-1 prose-li:mb-2`}>
                                    <div className="whitespace-pre-wrap">{faq.answer.replace(/<[^>]*>/g, '')}</div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Desktop Only */}
          {!isMobile && (
            <Sidebar navigate={navigate} />
          )}

        </div>
      </main>
    </div>
  );
};

export default Help;
