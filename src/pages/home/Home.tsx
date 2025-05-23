import { lazy, Suspense, useMemo } from 'react';
import Header from '@/components/home/Header.tsx';
import Hero from '@/components/home/Hero.tsx';
import ValueBanner from '@/components/home/ValueBanner.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import SectionBackground from '@/components/utils/SectionBackground.tsx';
import HomeResourcePreloader from '@/components/utils/HomeResourcePreloader.tsx';
import PerformanceMonitor from '@/components/utils/PerformanceMonitor.tsx';
import EnhancedErrorBoundary from '@/components/ui/enhanced-error-boundary.tsx';
import { SectionLoading, MinimalLoading } from '@/components/ui/enhanced-loading.tsx';
import { useHomePerformance } from '@/hooks/useHomePerformance.ts';
import { useAccessibility } from '@/hooks/useAccessibility.ts';

// Lazy load non-critical sections for better initial load performance
const ServicesSection = lazy(() => import('@/components/home/ServicesSection.tsx'));
const ProjectsSection = lazy(() => import('@/components/home/ProjectsSection.tsx'));
const ExperienceSection = lazy(() => import('@/components/home/ExperienceSection.tsx'));
const CertificationsSection = lazy(() => import('@/components/home/CertificationsSection.tsx'));
const ContactSection = lazy(() => import('@/components/home/ContactSection.tsx'));

const Home = () => {
  // Use custom performance hook for optimized state management
  const {
    isLoaded,
    isLowPerformanceDevice,
    prefersReducedMotion,
    shouldRenderEnhancedBackground,
    performanceMetrics,
    isSectionVisible
  } = useHomePerformance();

  // Use accessibility hook for enhanced user experience
  const {
    shouldSkipAnimations,
    shouldSimplifyInterface,
    shouldEnhanceFocus,
    announceToScreenReader
  } = useAccessibility();

  // Memoize section configurations to prevent unnecessary re-renders
  const sectionConfigs = useMemo(() => [
    {
      id: 'services',
      Component: ServicesSection,
      props: {}
    },
    {
      id: 'projects', 
      Component: ProjectsSection,
      props: {}
    },
    {
      id: 'experience',
      Component: ExperienceSection, 
      props: {}
    },
    {
      id: 'certifications',
      Component: CertificationsSection,
      props: {}
    },
    {
      id: 'contact',
      Component: ContactSection,
      props: {}
    }
  ], []);

  // Render optimized section with error boundary and performance considerations
  const renderSection = useMemo(() => (config: typeof sectionConfigs[0]) => {
    const { id, Component, props } = config;
    const shouldRender = isSectionVisible(id);
    const containmentStyle = {
      contentVisibility: 'auto' as const,
      containIntrinsicSize: '0 600px',
      contain: 'layout style paint' as const
    };

    return (
      <div key={id} style={containmentStyle}>
        <SectionBackground 
          sectionId={`${id}-section`} 
          variant={id as any}
          optimizeRendering={true}
        >
          <EnhancedErrorBoundary
            onError={(error, errorInfo) => {
              console.error(`Error in ${id} section:`, error, errorInfo);
              announceToScreenReader(`Lỗi khi tải phần ${id}. Vui lòng thử lại.`, 'assertive');
            }}
            showErrorDetails={process.env.NODE_ENV === 'development'}
          >
            <Suspense 
              fallback={
                <SectionLoading 
                  itemCount={id === 'projects' ? 6 : 3}
                  showShimmer={!isLowPerformanceDevice && !shouldSimplifyInterface}
                  ariaLabel={`Đang tải phần ${id}...`}
                />
              }
            >
              {shouldRender && <Component {...props} />}
            </Suspense>
          </EnhancedErrorBoundary>
        </SectionBackground>
      </div>
    );
  }, [isSectionVisible, isLowPerformanceDevice, shouldSimplifyInterface, announceToScreenReader]);

  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Critical Home page error:', error, errorInfo);
        // Send critical errors to monitoring
      }}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      <div className="min-h-screen relative">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
                     bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={(e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
              mainContent.focus();
              mainContent.scrollIntoView({ behavior: 'smooth' });
              announceToScreenReader('Đã chuyển đến nội dung chính');
            }
          }}
        >
          Chuyển đến nội dung chính
        </a>

        {/* Preload critical resources for the Home page */}
        <HomeResourcePreloader />

        {/* Performance monitoring */}
        {/* <PerformanceMonitor 
          enableLogging={process.env.NODE_ENV === 'development'}
          enableReporting={process.env.NODE_ENV === 'production'}
          onMetricsCollected={(metrics) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Home page performance metrics:', metrics);
            }
          }}
        /> */}

        {/* Optimized background with progressive enhancement */}
        <div
          className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"
          style={{ 
            contain: 'paint layout',
            willChange: shouldRenderEnhancedBackground ? 'auto' : undefined
          }}
        />

        {/* Enhanced background - only render when performance allows */}
        {shouldRenderEnhancedBackground && !shouldSkipAnimations && (
          <Suspense 
            fallback={
              <MinimalLoading 
                customHeight="100vh"
              />
            }
          >
            <EnhancedErrorBoundary>
              <EnhancedBackground
                optimizeForLowPerformance={isLowPerformanceDevice}
                reducedAnimations={prefersReducedMotion || shouldSkipAnimations}
              />
            </EnhancedErrorBoundary>
          </Suspense>
        )}

        {/* Header with error boundary */}
        <EnhancedErrorBoundary
          fallback={
            <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200/50" />
          }
        >
          <Header />
        </EnhancedErrorBoundary>

        <main 
          id="main-content" 
          className="relative z-0"
          role="main"
          aria-label="Nội dung chính trang chủ"
        >
          {/* Hero section - always prioritized for LCP */}
          <SectionBackground 
            sectionId="hero-section" 
            variant="hero" 
            optimizeRendering={true}
          >
            <EnhancedErrorBoundary
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Xin chào! Tôi là Nam
                    </h1>
                    <p className="text-xl text-gray-600">
                      Full-stack Developer & QA Engineer
                    </p>
                  </div>
                </div>
              }
            >
              <Hero />
              <ValueBanner />
            </EnhancedErrorBoundary>
          </SectionBackground>

          {/* Dynamically rendered sections with performance optimization */}
          {sectionConfigs.map(renderSection)}
        </main>

        {/* Footer with error boundary */}
        <EnhancedErrorBoundary
          fallback={
            <footer className="py-8 text-center text-gray-600 bg-gray-50">
              <p>&copy; 2024 Nam Le. All rights reserved.</p>
            </footer>
          }
        >
          <Footer />
        </EnhancedErrorBoundary>

        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
            <div>Loaded: {isLoaded ? '✅' : '⏳'}</div>
            <div>Low Perf: {isLowPerformanceDevice ? '⚠️' : '✅'}</div>
            <div>Enhanced BG: {shouldRenderEnhancedBackground ? '✅' : '❌'}</div>
            {performanceMetrics.deviceMemory && (
              <div>Memory: {performanceMetrics.deviceMemory}GB</div>
            )}
            {performanceMetrics.hardwareConcurrency && (
              <div>Cores: {performanceMetrics.hardwareConcurrency}</div>
            )}
          </div>
        )}
      </div>
    </EnhancedErrorBoundary>
  );
};

export default Home;
