import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Navigate
} from "react-router-dom";
import { ParallaxProvider } from "@/components/utils/ParallaxProvider.tsx";
import RouterWrapper from "@/components/utils/RouterWrapper.tsx";
import { lazy, Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ResourcePreloader from "@/components/utils/ResourcePreloader.tsx";
import { SkipLink } from "@/components/ui/skip-link";
import AccessibilityProvider from "@/components/utils/AccessibilityProvider.tsx";
import { logCLS } from "@/lib/cls-monitoring";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import DebugInfo from "@/components/utils/DebugInfo";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/home/Home.tsx"));
const Blog = lazy(() => import("./pages/home/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/home/BlogPost.tsx"));
const Resources = lazy(() => import("./pages/home/Resources.tsx"));
const Projects = lazy(() => import("./pages/home/Projects.tsx"));
const ProjectDetail = lazy(() => import("./pages/home/ProjectDetail.tsx"));
const ContactForm = lazy(() => import("./pages/home/ContactForm.tsx"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Testing Playground pages
const PlaygroundRoutes = lazy(() => import("./pages/playground"));
import { AuthProvider } from "./contexts/AuthContext";

// Loading fallback with fixed dimensions to prevent layout shifts
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ contain: 'layout paint' }}>
    <div className="w-full max-w-md space-y-4 p-4" style={{ height: '500px', contain: 'layout paint' }}>
      <Skeleton className="h-12 w-3/4 mx-auto" style={{ minHeight: '48px' }} />
      <Skeleton className="h-64 w-full" style={{ minHeight: '256px' }} />
      <Skeleton className="h-32 w-full" style={{ minHeight: '128px' }} />
      <Skeleton className="h-8 w-1/2 mx-auto" style={{ minHeight: '32px' }} />
    </div>
  </div>
);

const queryClient = new QueryClient();

// Critical resources to preload
const criticalResources = [
  // Preload hero image - using prefetch for images to avoid warnings
  {
    href: "/images/developer-portrait.jpg",
    as: "image",
    type: "image/jpeg"
  },
  // Preload profile image - using prefetch for images to avoid warnings
  {
    href: "/images/profile.jpg",
    as: "image",
    type: "image/jpeg"
  },
  // Load fonts directly as stylesheet
  {
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    as: "style",
    crossOrigin: "anonymous"
  },
  // Preload icons - using prefetch for images to avoid warnings
  {
    href: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    as: "image",
    type: "image/svg+xml",
    crossOrigin: "anonymous"
  }
];

// Create router with future flags to address warnings
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RouterWrapper />}>
      {/* Redirect from root to home page */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/contact-form" element={<ContactForm />} />

      {/* Testing Playground Routes */}
      <Route path="/playground/*" element={
        <AuthProvider>
          <PlaygroundRoutes />
        </AuthProvider>
      } />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    // Add future flags to address React Router warnings
    future: {
      v7_relativeSplatPath: true
    }
  }
);

const App = () => {
  // Monitor CLS in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const stopMonitoring = logCLS();
      return () => stopMonitoring();
    }
  }, []);

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <QueryClientProvider client={queryClient}>
          <ParallaxProvider>
            <TooltipProvider>
              <SkipLink targetId="main-content" />
              <ResourcePreloader resources={criticalResources as Array<{
                href: string;
                as: "image" | "style" | "script" | "font";
                type?: string;
                crossOrigin?: "anonymous" | "use-credentials";
              }>} />
              <Toaster />
              <Sonner />
              <div id="app-container" style={{ minHeight: '100vh' }}>
                <Suspense fallback={<PageLoader />}>
                  <RouterProvider router={router} />
                </Suspense>
              </div>
              {/* Add debug info component in development mode */}
              {/* {process.env.NODE_ENV === 'development' && <DebugInfo />} */}
            </TooltipProvider>
          </ParallaxProvider>
        </QueryClientProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default App;
