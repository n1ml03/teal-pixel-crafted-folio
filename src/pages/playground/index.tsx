import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from '@/components/playground/Navigation';
import PlaygroundFooter from '@/components/playground/PlaygroundFooter';
import TestingEnvironment from '@/components/playground/TestingEnvironment';
import EnhancedBackground from '@/components/utils/EnhancedBackground';
import { PageTransition } from '@/components/ui/page-transition';
import { useIsMobile } from '@/hooks/use-mobile';

// Loading spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./Dashboard'));
const Challenges = lazy(() => import('./Challenges'));
const TestingPlayground = lazy(() => import('./TestingPlayground'));
const ChallengeDetails = lazy(() => import('./ChallengeDetails'));
const Leaderboard = lazy(() => import('./Leaderboard'));
const Help = lazy(() => import('./Help'));

// Layout component that includes Navigation and PlaygroundFooter
const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navigation />
      <div className="flex-1 flex flex-col relative">
        {children}
      </div>
      <PlaygroundFooter />
    </div>
  );
};

// Layout component without footer
const PlaygroundLayoutNoFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navigation />
      <div className="flex-1 flex flex-col relative">
        {children}
      </div>
    </div>
  );
};

// Route component for protected routes with footer (without additional transitions)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PlaygroundLayout>
        {children}
      </PlaygroundLayout>
    </Suspense>
  );
};

// Route component for protected routes without footer
const ProtectedRouteNoFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PlaygroundLayoutNoFooter>
        {children}
      </PlaygroundLayoutNoFooter>
    </Suspense>
  );
};

// Create a simple Sandbox component
const Sandbox = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex flex-col">
      {/* Enhanced background with gradient and animated elements */}
      <EnhancedBackground optimizeForLowPerformance={false} />

      <div className="container flex-1 py-4 md:py-6 pt-20 md:pt-24 relative z-10">
        <div className="mb-4 md:mb-6">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}>Testing Sandbox</h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
            Use this sandbox environment to practice your testing skills without any specific challenge objectives.
          </p>
        </div>

        <div className={isMobile ? "h-[calc(100vh-180px)]" : "h-[calc(150vh-250px)]"}>
          <TestingEnvironment
            initialUrl="https://example.com"
            sandboxMode="open"
          />
        </div>
      </div>
    </div>
  );
};

const PlaygroundRoutes = () => {
  return (
    <Routes>
      {/* Direct routes with page transitions */}
      <Route path="/playground" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PlaygroundLayout>
            <PageTransition>
              <Dashboard />
            </PageTransition>
          </PlaygroundLayout>
        </Suspense>
      } />
      <Route path="/" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PlaygroundLayout>
            <PageTransition>
              <Dashboard />
            </PageTransition>
          </PlaygroundLayout>
        </Suspense>
      } />
      <Route path="/challenges" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PlaygroundLayout>
            <PageTransition>
              <Challenges />
            </PageTransition>
          </PlaygroundLayout>
        </Suspense>
      } />

      {/* Protected routes with page transitions */}
      <Route path="/challenge/:challengeId" element={
        <ProtectedRouteNoFooter>
          <TestingPlayground />
        </ProtectedRouteNoFooter>
      } />

      <Route path="/challenge-details/:challengeId" element={
        <ProtectedRouteNoFooter>
          <ChallengeDetails />
        </ProtectedRouteNoFooter>
      } />

      <Route path="/leaderboard" element={
        <ProtectedRouteNoFooter>
          <Leaderboard />
        </ProtectedRouteNoFooter>
      } />

      <Route path="/sandbox" element={
        <ProtectedRouteNoFooter>
          <Sandbox />
        </ProtectedRouteNoFooter>
      } />

      {/* Help route */}
      <Route path="/help" element={
        <ProtectedRoute>
          <Help />
        </ProtectedRoute>
      } />

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/playground" replace />} />
    </Routes>
  );
};

export default PlaygroundRoutes;
