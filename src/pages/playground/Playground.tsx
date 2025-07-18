import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from '@/components/playground/Navigation';
import Footer from '@/components/home/Footer';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import SectionBackground from '@/components/utils/SectionBackground';
import EnhancedErrorBoundary from '@/components/ui/enhanced-error-boundary';
import { SectionLoading, MinimalLoading } from '@/components/ui/enhanced-loading';
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/lib';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./Dashboard'));
const Challenges = lazy(() => import('./Challenges'));
const ChallengeDetails = lazy(() => import('./ChallengeDetails'));
const Leaderboard = lazy(() => import('./Leaderboard'));
const Help = lazy(() => import('./Help'));

// Loading spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

// Unified layout component with consistent design pattern
const PlaygroundLayout = ({ 
  children, 
  showFooter = true,
  sectionId = 'playground-section' 
}: { 
  children: React.ReactNode; 
  showFooter?: boolean;
  sectionId?: string;
}) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isLowPerformanceDevice = isMobile || ('deviceMemory' in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4);

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

        {/* Simple background */}
        <div className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50" />

        {/* Enhanced background only for desktop with good performance */}
        {!isLowPerformanceDevice && !prefersReducedMotion && (
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
          <Navigation />
        </EnhancedErrorBoundary>

        <main id="main-content" className="relative z-0" role="main">
          <SectionBackground sectionId={sectionId} variant="playground" optimizeRendering={true}>
            <div className="flex-1 flex flex-col relative">
              {children}
            </div>
          </SectionBackground>
        </main>

        {showFooter && (
          <EnhancedErrorBoundary fallback={<footer className="py-8 text-center">© 2024 Nam Le</footer>}>
            <Footer />
          </EnhancedErrorBoundary>
        )}
      </div>
    </EnhancedErrorBoundary>
  );
};

// Reusable route wrapper with Suspense and layout
const RouteWrapper = ({
  children,
  showFooter = true,
  withTransition = false,
  sectionId = 'playground-section'
}: {
  children: React.ReactNode;
  showFooter?: boolean;
  withTransition?: boolean;
  sectionId?: string;
}) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <SectionLoading itemCount={3} showShimmer={true} />
    </div>
  }>
    <PlaygroundLayout showFooter={showFooter} sectionId={sectionId}>
      {withTransition ? <PageTransition>{children}</PageTransition> : children}
    </PlaygroundLayout>
  </Suspense>
);



const PlaygroundRoutes = () => (
  <Routes>
    {/* Main routes with page transitions */}
    <Route index element={<RouteWrapper withTransition sectionId="dashboard-section"><Dashboard /></RouteWrapper>} />
    <Route path="challenges" element={<RouteWrapper withTransition sectionId="challenges-section"><Challenges /></RouteWrapper>} />

    {/* Routes without footer */}
    <Route path="challenge-details/:challengeId" element={<RouteWrapper showFooter={false} sectionId="details-section"><ChallengeDetails /></RouteWrapper>} />
    <Route path="leaderboard" element={<RouteWrapper showFooter={false} sectionId="leaderboard-section"><Leaderboard /></RouteWrapper>} />


    {/* Help route with footer */}
    <Route path="help" element={<RouteWrapper sectionId="help-section"><Help /></RouteWrapper>} />

    {/* Redirect any unknown routes to playground home */}
    <Route path="*" element={<Navigate to="/playground" replace />} />
  </Routes>
);

export default PlaygroundRoutes;
