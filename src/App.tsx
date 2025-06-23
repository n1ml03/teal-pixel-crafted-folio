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
import { ParallaxProvider } from "@/components/utils/ParallaxProvider";
import RouterWrapper from "@/components/utils/RouterWrapper";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SkipLink } from "@/components/ui/skip-link";
import EnhancedErrorBoundary from "@/components/ui/enhanced-error-boundary";
import { AIConfigProvider } from "@/contexts/AIConfigContext";
import GlobalAIConfig from "@/components/ai/GlobalAIConfig";


// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/home/Home"));
const Blog = lazy(() => import("@/pages/home/Blog"));
const BlogPost = lazy(() => import("@/pages/home/BlogPost"));
const Resources = lazy(() => import("@/pages/home/Resources"));
const Projects = lazy(() => import("@/pages/home/Projects"));
const ProjectDetail = lazy(() => import("@/pages/home/ProjectDetail"));
const ContactForm = lazy(() => import("@/pages/home/ContactForm"));
const Services = lazy(() => import("@/pages/home/Services"));
const ProfessionalTools = lazy(() => import("@/pages/home/ProfessionalTools"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Individual tool pages
const APITesterPage = lazy(() => import("@/pages/tools/APITesterPage"));
const TestCaseGeneratorPage = lazy(() => import("@/pages/tools/TestCaseGeneratorPage"));
const BugReportSimulatorPage = lazy(() => import("@/pages/tools/BugReportSimulatorPage"));
const CodeReviewToolPage = lazy(() => import("@/pages/tools/CodeReviewToolPage"));

// URL Shortener pages
const URLShortenerPage = lazy(() => import("@/pages/shorten/URLShortenerPage"));
const URLRedirect = lazy(() => import("@/components/shorten/URLRedirect"));

// Testing Playground pages
const PlaygroundRoutes = lazy(() => import("@/pages/playground/Playground"));
import { AuthProvider } from "@/contexts/AuthContext";

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
      <Route path="/services" element={<Services />} />
      <Route path="/professional-tools" element={<ProfessionalTools />} />
      <Route path="/contact-form" element={<ContactForm />} />

      {/* Individual Tool Routes */}
      <Route path="/tools/api-tester" element={<APITesterPage />} />
      <Route path="/tools/test-case-generator" element={<TestCaseGeneratorPage />} />
      <Route path="/tools/bug-report-simulator" element={<BugReportSimulatorPage />} />
      <Route path="/tools/code-review-tool" element={<CodeReviewToolPage />} />

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
  )
);

const App = () => {
  return (
    <EnhancedErrorBoundary>
      <ParallaxProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AIConfigProvider>
              <SkipLink targetId="main-content" />
              <Suspense fallback={<PageLoader />}>
                <RouterProvider router={router} />
              </Suspense>
              <GlobalAIConfig />
              <Toaster />
            </AIConfigProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ParallaxProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;
