import { Toaster } from "@/components/ui/sonner";
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
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
// ResourcePreloader removed - using centralized ResourceManager instead
import { SkipLink } from "@/components/ui/skip-link";
import EnhancedErrorBoundary from "@/components/ui/enhanced-error-boundary.tsx";


// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/home/Home.tsx"));
const Blog = lazy(() => import("./pages/home/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/home/BlogPost.tsx"));
const Resources = lazy(() => import("./pages/home/Resources.tsx"));
const Projects = lazy(() => import("./pages/home/Projects.tsx"));
const ProjectDetail = lazy(() => import("./pages/home/ProjectDetail.tsx"));
const ContactForm = lazy(() => import("./pages/home/ContactForm.tsx"));
const NotFound = lazy(() => import("./pages/NotFound"));

// URL Shortener pages
const URLShortenerPage = lazy(() => import("./pages/shorten/URLShortenerPage.tsx"));
const URLRedirect = lazy(() => import("./components/shorten/URLRedirect.tsx"));

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

// Critical resources are now handled by ResourceManager in main.tsx

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

      {/* URL Shortener Routes */}
      <Route path="/url-shortener" element={<URLShortenerPage />} />
      <Route path="/s/:shortCode" element={<URLRedirect />} />

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
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

const App = () => {
  return (
    <EnhancedErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ParallaxProvider>
          <TooltipProvider>
            <SkipLink targetId="main-content" />
            <Toaster />
            <div id="app-container" style={{ minHeight: '100vh', contain: 'content' }}>
              <Suspense fallback={<PageLoader />}>
                <RouterProvider router={router} />
              </Suspense>
            </div>
          </TooltipProvider>
        </ParallaxProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;
