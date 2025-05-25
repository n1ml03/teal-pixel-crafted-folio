import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from '@/components/playground/Navigation';
import PlaygroundFooter from '@/components/playground/PlaygroundFooter';
import TestingEnvironment from '@/components/playground/TestingEnvironment';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./Dashboard'));
const Challenges = lazy(() => import('./Challenges'));
const TestingPlayground = lazy(() => import('./TestingPlayground'));
const ChallengeDetails = lazy(() => import('./ChallengeDetails'));
const Leaderboard = lazy(() => import('./Leaderboard'));
const Help = lazy(() => import('./Help'));

// Loading spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

// Unified layout component with optional footer
const PlaygroundLayout = ({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) => (
  <div className="min-h-screen flex flex-col relative">
    <Navigation />
    <div className="flex-1 flex flex-col relative">
      {children}
    </div>
    {showFooter && <PlaygroundFooter />}
  </div>
);

// Reusable route wrapper with Suspense and layout
const RouteWrapper = ({
  children,
  showFooter = true,
  withTransition = false
}: {
  children: React.ReactNode;
  showFooter?: boolean;
  withTransition?: boolean;
}) => (
  <Suspense fallback={<LoadingSpinner />}>
    <PlaygroundLayout showFooter={showFooter}>
      {withTransition ? <PageTransition>{children}</PageTransition> : children}
    </PlaygroundLayout>
  </Suspense>
);

// Sandbox component
const Sandbox = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex flex-col">
      <EnhancedBackground optimizeForLowPerformance={false} />
      <div className="container flex-1 py-4 md:py-6 pt-20 md:pt-24 relative z-10">
        <div className="mb-4 md:mb-6">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>Testing Sandbox</h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Use this sandbox environment to practice your testing skills without any specific challenge objectives.
          </p>
        </div>
        <div className={isMobile ? "h-[calc(100vh-180px)]" : "h-[calc(150vh-250px)]"}>
          <TestingEnvironment initialUrl="https://example.com" sandboxMode="open" />
        </div>
      </div>
    </div>
  );
};

const PlaygroundRoutes = () => (
  <Routes>
    {/* Main routes with page transitions */}
    <Route index element={<RouteWrapper withTransition><Dashboard /></RouteWrapper>} />
    <Route path="challenges" element={<RouteWrapper withTransition><Challenges /></RouteWrapper>} />

    {/* Routes without footer */}
    <Route path="challenge/:challengeId" element={<RouteWrapper showFooter={false}><TestingPlayground /></RouteWrapper>} />
    <Route path="challenge-details/:challengeId" element={<RouteWrapper showFooter={false}><ChallengeDetails /></RouteWrapper>} />
    <Route path="leaderboard" element={<RouteWrapper showFooter={false}><Leaderboard /></RouteWrapper>} />
    <Route path="sandbox" element={<RouteWrapper showFooter={false}><Sandbox /></RouteWrapper>} />

    {/* Help route with footer */}
    <Route path="help" element={<RouteWrapper><Help /></RouteWrapper>} />

    {/* Redirect any unknown routes to playground home */}
    <Route path="*" element={<Navigate to="/playground" replace />} />
  </Routes>
);

export default PlaygroundRoutes;
