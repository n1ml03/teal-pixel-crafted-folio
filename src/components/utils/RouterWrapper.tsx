import { Outlet } from 'react-router-dom';
import { Suspense, startTransition } from 'react';
import { PageTransition } from '@/components/ui/page-transition';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback for route transitions
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ contain: 'layout paint' }}>
    <div className="w-full max-w-md space-y-4 p-4" style={{ height: '500px', contain: 'layout paint' }}>
      <Skeleton className="h-12 w-3/4 mx-auto" style={{ minHeight: '48px' }} />
      <Skeleton className="h-64 w-full" style={{ minHeight: '256px' }} />
      <Skeleton className="h-32 w-full" style={{ minHeight: '128px' }} />
      <Skeleton className="h-8 w-1/2 mx-auto" style={{ minHeight: '32px' }} />
    </div>
  </div>
);

/**
 * RouterWrapper component that wraps the router outlet with page transitions
 * This ensures that PageTransition is used within the Router context
 * and handles suspense boundaries properly for lazy-loaded routes
 */
export const RouterWrapper = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </Suspense>
  );
};

export default RouterWrapper;
