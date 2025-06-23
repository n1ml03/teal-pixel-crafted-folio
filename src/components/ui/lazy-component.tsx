import React, { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

/**
 * LazyComponent - A wrapper for React.lazy that provides a consistent loading experience
 *
 * @param component - A function that returns a dynamic import
 * @param fallback - Optional custom fallback component
 * @param props - Props to pass to the loaded component
 */
export const LazyComponent = ({
  component,
  fallback,
  props = {}
}: LazyComponentProps) => {
  const LazyLoadedComponent = lazy(component);

  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
};

/**
 * Default fallback component that shows a skeleton loader
 */
const DefaultFallback = () => (
  <div className="w-full space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);
