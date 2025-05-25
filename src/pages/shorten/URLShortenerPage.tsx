import React, { useState, useCallback, useMemo, lazy, Suspense, useRef, useEffect, Component } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import URLInputForm from '@/components/shorten/URLInputForm.tsx';
import ShortenedURLDisplay from '@/components/shorten/ShortenedURLDisplay.tsx';
import URLHistoryList from '@/components/shorten/URLHistoryList.tsx';
import { ShortenedURL, UTMParams } from '@/types/shorten.ts';
import { useURLHistory } from '@/hooks/useURLHistory.ts';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { Link2, History, BarChart3, AlertCircle, Tag, Sparkles } from 'lucide-react';
import Header from '@/components/home/Header.tsx';
import Footer from '@/components/home/Footer.tsx';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollReveal } from "@/components/ui/scroll-reveal.tsx";
import { MotionButton } from "@/components/ui/motion-button.tsx";

// Lazy load components that aren't needed immediately
const URLAnalytics = lazy(() => import('@/components/shorten/URLAnalytics'));

const CampaignTemplates = lazy(() => import('@/components/shorten/CampaignTemplates').then(module => ({ default: module.CampaignTemplates })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="p-4 sm:p-6 flex flex-col justify-center items-center min-h-[200px] bg-gray-50/50 rounded-lg border border-gray-100">
    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-t-2 border-primary mb-3"></div>
    <p className="text-xs sm:text-sm text-gray-500 animate-pulse">Loading content...</p>
  </div>
);

// Error boundary for lazy loaded components
class LazyLoadErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 sm:p-6 flex flex-col justify-center items-center min-h-[200px] bg-red-50/50 rounded-lg border border-red-100">
          <div className="text-red-500 mb-3">⚠️</div>
          <p className="text-xs sm:text-sm text-red-600">Failed to load component. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const URLShortenerPage: React.FC = () => {
  // Initialize the URL Shortener Service and prefetch components
  useEffect(() => {
    // Initialize the service when the component mounts
    URLShortenerService.initialize();

    // Add performance monitoring
    const startTime = performance.now();

    // Log performance metrics
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      console.log(`URL Shortener page loaded in ${loadTime.toFixed(2)}ms`);

      // Report to analytics if needed
      if (loadTime > 1000) {
        console.warn('URL Shortener page load time exceeded 1000ms');
      }
    });

    // Clean up expired URLs on component mount
    const cleanupInterval = setInterval(() => {
      // This will run the cleanup logic in the service
      URLShortenerService.initialize();
    }, 60 * 60 * 1000); // Run every hour

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  // We're using responsive design with breakpoints instead of the isMobile hook
  const [activeTab, setActiveTab] = useState<string>('shorten');
  const [currentURL, setCurrentURL] = useState<ShortenedURL | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<UTMParams | null>(null);
  const { urlHistory, addToHistory, removeFromHistory } = useURLHistory();

  // Reference to the tabs section for smooth scrolling
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  // Memoize URL history for specific tabs to prevent unnecessary re-renders
  const recentURLHistory = useMemo(() =>
    urlHistory.slice(0, 5),
    [urlHistory]
  );

  // Simple analytics data
  const analyticsData = currentURL?.analytics || null;

  // Memoize handlers to prevent unnecessary re-renders
  const handleURLShortened = useCallback((shortenedURL: ShortenedURL) => {
    setCurrentURL(shortenedURL);
    addToHistory(shortenedURL);

    // Reset the selected template after a URL is shortened
    if (selectedTemplate) {
      setSelectedTemplate(null);
    }

    // The service now handles clearing the analytics cache internally
  }, [addToHistory, selectedTemplate]);

  const handleDeleteURL = useCallback((id: string) => {
    removeFromHistory(id);
    if (currentURL && currentURL.id === id) {
      setCurrentURL(null);
    }

    // The service now handles clearing the analytics cache internally
  }, [currentURL, removeFromHistory]);

  // No longer need the getAnalyticsData function since we removed GeoMap and TimeHeatmap

  // Additional callbacks for select handlers
  const handleHistorySelect = useCallback((url: ShortenedURL) => {
    setCurrentURL(url);
    setActiveTab('shorten');
  }, [setCurrentURL, setActiveTab]);

  const handleAnalyticsSelect = useCallback((url: ShortenedURL) => {
    setCurrentURL(url);
    setActiveTab('analytics');
  }, [setCurrentURL, setActiveTab]);

  const handleTemplateSelect = useCallback((template: UTMParams) => {
    setSelectedTemplate(template);
    setActiveTab('shorten');
    toast.success('Template applied! You can now create a URL with these UTM parameters.');
  }, [setSelectedTemplate, setActiveTab]);

  // Function to smoothly scroll to the tabs section
  const scrollToTabsSection = useCallback((tabValue: string) => {
    // Set the active tab
    setActiveTab(tabValue);

    // Scroll to the tabs section with smooth behavior
    if (tabsSectionRef.current) {
      const yOffset = -20; // Small offset to account for spacing
      const y = tabsSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, [setActiveTab]);

  return (
    <>
      <Header />

      <EnhancedBackground optimizeForLowPerformance={true} />

      <main id="main-content" className="pt-20 md:pt-30">
        {/* Hero section styled to match Resources page */}
        <section className="relative pt-12 pb-24 md:pt-32 md:pb-40 overflow-hidden">
          {/* Decorative floating elements - similar to Resources page */}
          <motion.div
            className="absolute top-32 right-[10%] w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-tr from-teal-400/10 to-teal-200/20 backdrop-blur-sm border border-white/20 z-0"
            animate={{ rotate: [0, 10, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-32 left-[10%] w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-blue-400/10 to-blue-200/20 backdrop-blur-sm border border-white/20 z-0"
            animate={{ rotate: [0, -10, 0], y: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/3 left-[20%] w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-tr from-purple-400/10 to-purple-200/20 backdrop-blur-sm border border-white/20 z-0 hidden sm:block"
            animate={{ rotate: [0, 15, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute top-40 right-[25%] w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-teal-400/5 to-blue-200/10 backdrop-blur-sm border border-white/10 z-0 hidden sm:block"
            animate={{ rotate: [0, -20, 0], y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div
            className="absolute bottom-40 right-[15%] w-8 h-8 md:w-10 md:h-10 rounded-md bg-gradient-to-tr from-blue-400/5 to-purple-200/10 backdrop-blur-sm border border-white/10 z-0 hidden sm:block"
            animate={{ rotate: [0, 25, 0], x: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="text-center max-w-4xl mx-auto">
                <Badge
                  variant="secondary"
                  className="mb-4 bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 sm:px-4 text-xs sm:text-sm font-medium inline-flex items-center"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-teal-500" />
                  POWERFUL URL TOOLS
                </Badge>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="flex-1">
                    <motion.h1
                      className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500">
                        Transform & Track Your Links
                      </span>
                    </motion.h1>

                    <motion.p
                      className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      Create shortened URLs, generate QR codes, add UTM parameters, and track detailed analytics for your links in one place.
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex justify-center mb-4 md:mb-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-teal-400/30 to-blue-400/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-md">
                      <Link2 className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-teal-500/90" />
                    </div>
                  </motion.div>
                </div>

                {/* Action buttons with motion */}
                <motion.div
                  className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <MotionButton
                    onClick={() => scrollToTabsSection('shorten')}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none text-sm sm:text-base"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Scroll to URL shortener section"
                  >
                    <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shorten URL Now
                  </MotionButton>
                  <MotionButton
                    onClick={() => scrollToTabsSection('analytics')}
                    className="border border-teal-200 text-teal-700 hover:bg-teal-50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:outline-none text-sm sm:text-base"
                    variant="outline"
                    whileTap={{ scale: 0.98 }}
                    aria-label="Scroll to analytics section"
                  >
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    View Analytics
                  </MotionButton>
                </motion.div>

                {/* Stats section */}
                <motion.div
                  className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8 sm:mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-center relative">
                    <motion.div
                      className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-teal-50/50 rounded-full blur-sm"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.p
                      className="text-2xl sm:text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {urlHistory.length}+
                    </motion.p>
                    <p className="text-sm sm:text-base text-gray-500">URLs Created</p>
                  </div>

                  <div className="text-center relative">
                    <motion.div
                      className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-blue-50/50 rounded-full blur-sm"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <motion.p
                      className="text-2xl sm:text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      4
                    </motion.p>
                    <p className="text-sm sm:text-base text-gray-500">Features</p>
                  </div>

                  <div className="text-center relative">
                    <motion.div
                      className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-purple-50/50 rounded-full blur-sm"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    />
                    <motion.p
                      className="text-2xl sm:text-3xl font-bold text-gray-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      100%
                    </motion.p>
                    <p className="text-sm sm:text-base text-gray-500">Free</p>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-8" ref={tabsSectionRef}>
          <Tabs
            defaultValue="shorten"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-md p-1 mb-8 sm:mb-10 top-16 sm:top-20  z-20">
              <TabsList className="grid w-full grid-cols-4 gap-1.5 bg-transparent">
                <TabsTrigger
                  value="shorten"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Link2 className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                  <span className="hidden xs:inline text-xs sm:text-sm">Shorten</span>
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Tag className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                  <span className="hidden xs:inline text-xs sm:text-sm">Templates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <History className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                  <span className="hidden xs:inline text-xs sm:text-sm">History</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                  <span className="hidden xs:inline text-xs sm:text-sm">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="lg:col-span-8">
                <TabsContent value="shorten" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
                      <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-b border-blue-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
                            <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-xl font-bold text-blue-900">
                              Create Shortened URL
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-blue-700">
                              Enter a long URL to create a shortened version with custom options
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
                        <URLInputForm
                          onURLShortened={handleURLShortened}
                          initialUtmParams={selectedTemplate}
                        />
                      </CardContent>
                    </Card>


                    <div className="mt-4 sm:mt-6 min-h-[300px] sm:min-h-[400px] md:min-h-[600px]">
                      {currentURL && (
                        <ScrollReveal>
                          <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                            <CardContent className="p-4 sm:p-6 md:p-7">
                              <ShortenedURLDisplay shortenedURL={currentURL} />
                            </CardContent>
                          </Card>
                        </ScrollReveal>
                      )}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-purple-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
                      <div className="h-1.5 w-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-b border-purple-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-purple-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
                            <History className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-xl font-bold text-purple-900">
                              URL History
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-purple-700">
                              View and manage your previously shortened URLs
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
                        <ScrollArea className="h-[300px] sm:h-[400px] md:h-[500px] pr-2 sm:pr-4">
                          <div className="pb-2">
                            <URLHistoryList
                              urlHistory={urlHistory}
                              onDelete={handleDeleteURL}
                              onSelect={handleHistorySelect}
                              onAnalyticsSelect={handleAnalyticsSelect}
                            />
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="templates" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-teal-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
                      <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-teal-600"></div>
                      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-teal-500/10 to-teal-600/5 border-b border-teal-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="bg-teal-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
                            <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-xl font-bold text-teal-900">Campaign Templates</CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-teal-700">
                              Create and manage reusable UTM parameter templates
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
                        <LazyLoadErrorBoundary>
                          <Suspense fallback={<LoadingFallback />}>
                            <CampaignTemplates
                              onSelectTemplate={handleTemplateSelect}
                            />
                          </Suspense>
                        </LazyLoadErrorBoundary>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {urlHistory.length > 0 ? (
                      currentURL ? (
                        <div className="space-y-6">
                                                  <LazyLoadErrorBoundary>
                          <Suspense fallback={<LoadingFallback />}>
                            <URLAnalytics url={currentURL} />
                          </Suspense>
                        </LazyLoadErrorBoundary>
                        </div>
                      ) : (
                        <Card className="border border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
                          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
                          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-b border-amber-100">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
                                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                              </div>
                              <div>
                                <CardTitle className="text-base sm:text-xl font-bold text-amber-900">Analytics Dashboard</CardTitle>
                                <CardDescription className="text-xs sm:text-sm text-amber-700">
                                  View performance metrics for your shortened URLs
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
                            <Alert className="bg-amber-50/50 border-amber-200 text-xs sm:text-sm shadow-sm transition-all hover:bg-amber-50/80">
                              <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                              <AlertTitle className="text-sm sm:text-base">Select a URL to view analytics</AlertTitle>
                              <AlertDescription className="text-xs sm:text-sm">
                                Please select a URL from your history to view its analytics data.
                              </AlertDescription>
                            </Alert>

                            <div className="mt-5 sm:mt-7">
                              <h3 className="text-xs sm:text-sm font-medium text-amber-700 mb-3 sm:mb-4 flex items-center">
                                <span className="bg-amber-100/50 p-1 rounded-full mr-2">
                                  <History className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600" />
                                </span>
                                Your Recent URLs
                              </h3>
                              <ScrollArea className="h-[300px] sm:h-[400px] md:h-[600px] pr-2 sm:pr-4">
                                <div className="pb-2">
                                  <URLHistoryList
                                    urlHistory={recentURLHistory}
                                    onDelete={handleDeleteURL}
                                    onSelect={handleAnalyticsSelect}
                                    onAnalyticsSelect={handleAnalyticsSelect}
                                  />
                                </div>
                              </ScrollArea>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ) : (
                      <Card className="border border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
                        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-b border-amber-100">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
                              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base sm:text-xl font-bold text-amber-900">Link Analytics</CardTitle>
                              <CardDescription className="text-xs sm:text-sm text-amber-700">
                                Track performance and engagement for your shortened URLs
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 py-5 sm:py-7">
                          <div className="text-center py-6 sm:py-8">
                            <div className="bg-amber-50/50 p-4 sm:p-6 rounded-lg border border-amber-100 mb-4 sm:mb-6">
                              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-100/50 rounded-full mb-3 sm:mb-4">
                                <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                              </div>
                              <p className="text-gray-600 text-sm sm:text-base mb-2">No URLs to analyze yet.</p>
                              <p className="text-gray-500 text-xs sm:text-sm">Create a shortened URL first to see analytics data.</p>
                            </div>
                            <MotionButton
                              onClick={() => scrollToTabsSection('shorten')}
                              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 mx-auto"
                              whileHover={{
                                scale: 1.03,
                                boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.4)"
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link2 className="h-4 w-4 sm:h-5 sm:w-5" />
                              Create URL Now
                            </MotionButton>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>
              </div>

              <div className="lg:col-span-4">
                <ScrollReveal>
                  <Card className="border border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden sticky top-[5.5rem] sm:top-24">
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-b border-blue-100">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full flex-shrink-0 shadow-sm">
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl font-bold text-blue-900">
                          Features & Capabilities
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 md:p-7">
                      <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Create shortened URLs for easier sharing</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Generate customizable QR codes for your links</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Set custom aliases for branded links</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Add expiration dates to temporary links</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Track clicks and analyze link performance</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Create and manage UTM parameter templates</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>View geographic distribution of clicks</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Analyze click patterns with time heatmaps</span>
                        </li>
                        <li className="flex gap-2 p-2 sm:p-3 rounded-lg hover:bg-blue-50/70 transition-all shadow-sm hover:shadow border border-transparent hover:border-blue-100/50">
                          <span className="text-blue-600 font-medium flex-shrink-0 bg-blue-50 h-5 w-5 rounded-full flex items-center justify-center">✓</span>
                          <span>Export analytics data for reporting</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default URLShortenerPage;
