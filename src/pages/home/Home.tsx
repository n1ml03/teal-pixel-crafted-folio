import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import Header from '@/components/home/Header.tsx';
import Hero from '@/components/home/Hero.tsx';
import ValueBanner from '@/components/home/ValueBanner.tsx';
import Footer from '@/components/home/Footer.tsx';
import EnhancedBackground from '@/components/utils/EnhancedBackground.tsx';
import SectionBackground from '@/components/utils/SectionBackground.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import HomeResourcePreloader from '@/components/utils/HomeResourcePreloader.tsx';

// Lazy load non-critical sections for better initial load performance
const ServicesSection = lazy(() => import('@/components/home/ServicesSection.tsx'));
const ProjectsSection = lazy(() => import('@/components/home/ProjectsSection.tsx'));
const ExperienceSection = lazy(() => import('@/components/home/ExperienceSection.tsx'));
const CertificationsSection = lazy(() => import('@/components/home/CertificationsSection.tsx'));
const ContactSection = lazy(() => import('@/components/home/ContactSection.tsx'));

// Simple section loading fallback
const SectionFallback = () => (
  <div className="py-16">
    <Skeleton className="h-8 w-1/3 mx-auto mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-64 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

const Home = () => {
  // State to track if the page has fully loaded
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Detect low performance devices
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  // Track sections that are visible in viewport for better performance
  const [visibleSections, setVisibleSections] = useState({
    services: false,
    projects: false,
    experience: false,
    certifications: false,
    contact: false
  });

  // Detect device performance on component mount
  useEffect(() => {
    // Simple performance detection based on device memory and processor count
    const detectLowPerformanceDevice = () => {
      // Check if navigator.deviceMemory is available (Chrome, Edge, Opera)
      const lowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;

      // Check processor cores if available
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

      // Check if it's a mobile device (simplified check)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Set as low performance if any of these conditions are true
      return lowMemory || lowCores || isMobile;
    };

    setIsLowPerformanceDevice(detectLowPerformanceDevice());
  }, []);

  // Set up intersection observers for each section
  useEffect(() => {
    const observerOptions = {
      rootMargin: '200px 0px', // Start loading 200px before section comes into view
      threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [sectionId.replace('-section', '')]: true
          }));
        }
      });
    }, observerOptions);

    // Observe all section containers
    const sections = document.querySelectorAll('[id$="-section"]');
    sections.forEach(section => {
      sectionObserver.observe(section);
    });

    // Mark hero section as visible immediately to prioritize LCP
    setVisibleSections(prev => ({
      ...prev,
      'hero': true
    }));

    // Mark page as loaded after critical content is visible, but with a delay
    // to ensure LCP happens first
    const markAsLoaded = () => {
      if (!isLoaded) {
        setIsLoaded(true);
      }
    };

    // Mark page as loaded after a short delay or when load event fires
    const timeoutId = setTimeout(markAsLoaded, 1000);
    window.addEventListener('load', markAsLoaded);

    return () => {
      sections.forEach(section => {
        sectionObserver.unobserve(section);
      });
      clearTimeout(timeoutId);
      window.removeEventListener('load', markAsLoaded);
    };
  }, [isLoaded]);

  return (
    <div className="min-h-screen relative">
      {/* Preload critical resources for the Home page */}
      <HomeResourcePreloader />

      {/* Global background with optimized loading and performance detection */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50"
        style={{ contain: 'paint layout' }} // Add CSS containment for better performance
      ></div>

      {/* Load enhanced background after initial render to prioritize LCP */}
      {isLoaded && (
        <EnhancedBackground
          optimizeForLowPerformance={true} reducedAnimations={true}
        />
      )}

      <Header />

      <main id="main-content" className="relative z-0">
        {/* Hero section with dedicated background - always load immediately */}
        <SectionBackground sectionId="hero-section" variant="hero" optimizeRendering={true}>
          <Hero />
          <ValueBanner />
        </SectionBackground>

        {/* Services section - lazy loaded with content-visibility */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          <SectionBackground sectionId="services-section" variant="services" optimizeRendering={true}>
            <Suspense fallback={<SectionFallback />}>
              {(isLoaded || visibleSections.services) && <ServicesSection />}
            </Suspense>
          </SectionBackground>
        </div>

        {/* Projects section - lazy loaded with content-visibility */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          <SectionBackground sectionId="projects-section" variant="projects" optimizeRendering={true}>
            <Suspense fallback={<SectionFallback />}>
              {(isLoaded || visibleSections.projects) && <ProjectsSection />}
            </Suspense>
          </SectionBackground>
        </div>

        {/* Experience section - lazy loaded with content-visibility */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          <SectionBackground sectionId="experience-section" variant="experience" optimizeRendering={true}>
            <Suspense fallback={<SectionFallback />}>
              {(isLoaded || visibleSections.experience) && <ExperienceSection />}
            </Suspense>
          </SectionBackground>
        </div>

        {/* Certifications section - lazy loaded with content-visibility */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          <SectionBackground sectionId="certifications-section" variant="certifications" optimizeRendering={true}>
            <Suspense fallback={<SectionFallback />}>
              {(isLoaded || visibleSections.certifications) && <CertificationsSection />}
            </Suspense>
          </SectionBackground>
        </div>

        {/* Contact section - lazy loaded with content-visibility */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          <SectionBackground sectionId="contact-section" variant="contact" optimizeRendering={true}>
            <Suspense fallback={<SectionFallback />}>
              {(isLoaded || visibleSections.contact) && <ContactSection />}
            </Suspense>
          </SectionBackground>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
