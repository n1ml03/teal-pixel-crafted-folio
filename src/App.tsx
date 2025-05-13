import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements
} from "react-router-dom";
import { ParallaxProvider } from "@/components/utils/ParallaxProvider.tsx";
import RouterWrapper from "@/components/utils/RouterWrapper.tsx";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ResourcePreloader from "@/components/utils/ResourcePreloader.tsx";
import { SkipLink } from "@/components/ui/skip-link";
import AccessibilityProvider from "@/components/utils/AccessibilityProvider.tsx";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Resources = lazy(() => import("./pages/Resources"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ContactForm = lazy(() => import("./pages/ContactForm"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-full max-w-md space-y-4 p-4">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-1/2 mx-auto" />
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
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/contact-form" element={<ContactForm />} />
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

const App = () => (
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
          <Suspense fallback={<PageLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </TooltipProvider>
      </ParallaxProvider>
    </QueryClientProvider>
  </AccessibilityProvider>
);

export default App;
