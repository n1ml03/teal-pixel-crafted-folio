import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ParallaxProvider } from "@/components/utils/ParallaxProvider.tsx";
import { PageTransition } from "@/components/ui/page-transition";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ResourcePreloader from "@/components/utils/ResourcePreloader.tsx";
import { SkipLink } from "@/components/ui/skip-link";
import AccessibilityProvider from "@/components/utils/AccessibilityProvider.tsx";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
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
  // Preload hero image
  {
    href: "/images/developer-portrait.jpg",
    as: "image"
  },
  // Preload profile image
  {
    href: "/images/profile.jpg",
    as: "image"
  },
  // Preload fonts
  {
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    as: "style",
    crossOrigin: "anonymous"
  },
  // Preload icons
  {
    href: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    as: "image",
    crossOrigin: "anonymous"
  }
];

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
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/contact-form" element={<ContactForm />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ParallaxProvider>
    </QueryClientProvider>
  </AccessibilityProvider>
);

export default App;
