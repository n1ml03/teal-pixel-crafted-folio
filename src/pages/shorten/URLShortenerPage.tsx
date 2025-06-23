import React, { useState, useCallback, useMemo, lazy, Suspense, useRef, useEffect, Component } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import URLInputForm from '@/components/shorten/URLInputForm.tsx';
import ShortenedURLDisplay from '@/components/shorten/ShortenedURLDisplay.tsx';
import URLHistoryList from '@/components/shorten/URLHistoryList.tsx';
import StorageSettings from '@/components/shorten/StorageSettings.tsx';
import { ShortenedURL, UTMParams } from '@/types/shorten.ts';
import { useURLHistory } from '@/hooks/useURLHistory.ts';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { Link2, History, BarChart3, AlertCircle, Tag, Sparkles, Settings } from 'lucide-react';
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
  const [showStorageSettings, setShowStorageSettings] = useState(false);

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
        {/* Enhanced Hero section styled to match Services page */}
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
                <Link2 className="w-4 h-4 text-teal-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Professional URL Shortening Tool</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                URL{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-teal-500 to-blue-500 relative">
                  Shortener
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
                Transform long URLs into short, powerful links with advanced analytics,
                UTM parameters, and custom branding capabilities.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MotionButton
                  variant="default"
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
                  onClick={() => scrollToTabsSection('shorten')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started Free
                </MotionButton>
                <MotionButton
                  variant="outline"
                  className="border-2 border-teal-200 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl font-semibold"
                  onClick={() => scrollToTabsSection('analytics')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </MotionButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-16 bg-white/40 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/30 to-blue-50/30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">URL Shortener?</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Professional-grade URL shortening with advanced features for businesses and professionals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Link2 className="w-8 h-8" />,
                  title: "Smart URL Shortening",
                  description: "Create clean, branded short links with custom aliases and automatic expiration handling."
                },
                {
                  icon: <BarChart3 className="w-8 h-8" />,
                  title: "Advanced Analytics",
                  description: "Track clicks, analyze traffic patterns, and gain insights into your link performance."
                },
                {
                  icon: <Tag className="w-8 h-8" />,
                  title: "UTM Campaign Builder",
                  description: "Built-in UTM parameter support for comprehensive marketing campaign tracking."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main functionality section */}
        <section ref={tabsSectionRef} className="py-16">
          <div className="container mx-auto px-4 pb-8">
            <Tabs
              defaultValue="shorten"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border shadow-md p-1 mb-8 sm:mb-10 top-16 sm:top-20  z-20">
                <TabsList className="grid w-full grid-cols-5 gap-1.5 bg-transparent">
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
                  <TabsTrigger
                    value="settings"
                    className="flex items-center justify-center gap-1.5 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 flex-shrink-0 mr-0 sm:mr-1" />
                    <span className="hidden xs:inline text-xs sm:text-sm">Settings</span>
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
                      <Card className="border border shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
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
                            <Card className="border border shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
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
                                onUpdate={() => {
                                  // Force reload history after permanent storage changes
                                  window.location.reload();
                                }}
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
                                  onUpdate={() => {
                                    // Force reload history after permanent storage changes
                                    window.location.reload();
                                  }}
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

                  <TabsContent value="settings" className="mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StorageSettings />
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
        </section>
      </main>
      <Footer />
    </>
  );
};

export default URLShortenerPage;
