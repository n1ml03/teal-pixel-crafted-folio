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
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SkipLink } from "@/components/ui/skip-link";
import EnhancedErrorBoundary from "@/components/ui/enhanced-error-boundary";
import { AIConfigProvider } from "@/contexts/AIConfigContext";
import GlobalAIConfig from "@/components/ai/GlobalAIConfig";
import { createOptimizedLazyComponent } from "@/lib/component-optimization";


// Enhanced lazy loading with retry logic and preloading
const Home = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-home" */ "@/pages/home/Home"));
const Blog = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-blog" */ "@/pages/home/Blog"));
const BlogPost = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-blog-post" */ "@/pages/home/BlogPost"));
const Resources = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-resources" */ "@/pages/home/Resources"));
const Projects = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-projects" */ "@/pages/home/Projects"));
const ProjectDetail = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-project-detail" */ "@/pages/home/ProjectDetail"));
const ContactForm = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-contact" */ "@/pages/home/ContactForm"));
const Services = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-services" */ "@/pages/home/Services"));
const ProfessionalTools = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-professional-tools" */ "@/pages/home/ProfessionalTools"));
const NotFound = createOptimizedLazyComponent(() => import(/* webpackChunkName: "page-not-found" */ "@/pages/NotFound"));

// Individual tool pages - grouped for better caching with preloading
const APITesterPage = createOptimizedLazyComponent(() => import(/* webpackChunkName: "tools-api-tester" */ "@/pages/tools/APITesterPage"));
const TestCaseGeneratorPage = createOptimizedLazyComponent(() => import(/* webpackChunkName: "tools-test-generator" */ "@/pages/tools/TestCaseGeneratorPage"));
const BugReportSimulatorPage = createOptimizedLazyComponent(() => import(/* webpackChunkName: "tools-bug-simulator" */ "@/pages/tools/BugReportSimulatorPage"));
const CodeReviewToolPage = createOptimizedLazyComponent(() => import(/* webpackChunkName: "tools-code-review" */ "@/pages/tools/CodeReviewToolPage"));

// URL Shortener pages
const URLShortenerPage = createOptimizedLazyComponent(() => import(/* webpackChunkName: "shortener-main" */ "@/pages/shorten/URLShortenerPage"));
const URLRedirect = createOptimizedLazyComponent(() => import(/* webpackChunkName: "shortener-redirect" */ "@/components/shorten/URLRedirect"));

// Testing Playground pages - largest feature, separate chunk
const PlaygroundRoutes = createOptimizedLazyComponent(() => import(/* webpackChunkName: "playground-main" */ "@/pages/playground/Playground"));
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
