import { lazy, Suspense, useState, useEffect } from 'react';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import ValueBanner from '@/components/home/ValueBanner';
import Footer from '@/components/home/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import SectionBackground from '@/components/utils/SectionBackground';
import HomeResourcePreloader from '@/components/utils/HomeResourcePreloader';
import EnhancedErrorBoundary from '@/components/ui/enhanced-error-boundary';
import { SectionLoading, MinimalLoading } from '@/components/ui/enhanced-loading';
import { useStableMemo, useMediaQuery } from '@/lib';

// Lazy load non-critical sections
const ServicesSection = lazy(() => import('@/components/home/ServicesSection'));
const ProjectsSection = lazy(() => import('@/components/home/ProjectsSection'));
const ExperienceSection = lazy(() => import('@/components/home/ExperienceSection'));
const CertificationsSection = lazy(() => import('@/components/home/CertificationsSection'));
const ContactSection = lazy(() => import('@/components/home/ContactSection'));

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Simple device detection
  const isLowPerformanceDevice = isMobile || ('deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Simple section configurations
  const sectionConfigs = useStableMemo(() => [
    { id: 'services', Component: ServicesSection },
    { id: 'projects', Component: ProjectsSection },
    { id: 'experience', Component: ExperienceSection },
    { id: 'certifications', Component: CertificationsSection },
    { id: 'contact', Component: ContactSection }
  ], []);

  return (
    <EnhancedErrorBoundary>
      <div className="min-h-screen relative">
        {/* Skip to content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
                     bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Chuyển đến nội dung chính
        </a>

        <HomeResourcePreloader />

        {/* Simple background */}
        <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50" />

        {/* Enhanced background only for desktop with good performance */}
        {!isLowPerformanceDevice && !prefersReducedMotion && isLoaded && (
          <Suspense fallback={<MinimalLoading customHeight="100vh" />}>
            <EnhancedErrorBoundary>
              <EnhancedBackground
                optimizeForLowPerformance={isLowPerformanceDevice}
                reducedAnimations={prefersReducedMotion}
              />
            </EnhancedErrorBoundary>
          </Suspense>
        )}

        <EnhancedErrorBoundary fallback={<div className="h-16 bg-white/80" />}>
          <Header />
        </EnhancedErrorBoundary>

        <main id="main-content" className="relative z-0" role="main">
          {/* Hero section */}
          <SectionBackground sectionId="hero-section" variant="hero" optimizeRendering={true}>
            <EnhancedErrorBoundary>
              <Hero />
              <ValueBanner />
            </EnhancedErrorBoundary>
          </SectionBackground>

          {/* Other sections */}
          {sectionConfigs.map(({ id, Component }) => (
            <div key={id} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
              <SectionBackground sectionId={`${id}-section`} variant={id as 'services' | 'projects' | 'experience' | 'certifications' | 'contact'} optimizeRendering={true}>
                <EnhancedErrorBoundary>
                  <Suspense fallback={<SectionLoading itemCount={3} showShimmer={!isLowPerformanceDevice} />}>
                    <Component />
                  </Suspense>
                </EnhancedErrorBoundary>
              </SectionBackground>
            </div>
          ))}
        </main>

        <EnhancedErrorBoundary fallback={<footer className="py-8 text-center">© 2024 Nam Le</footer>}>
          <Footer />
        </EnhancedErrorBoundary>

      </div>
    </EnhancedErrorBoundary>
  );
};

export default Home;
