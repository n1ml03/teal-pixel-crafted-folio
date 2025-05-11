import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  className?: string;
  targetId: string;
  children?: React.ReactNode;
}

/**
 * SkipLink component for accessibility - allows keyboard users to skip navigation
 * and go directly to main content
 */
export const SkipLink = ({
  className,
  targetId,
  children = 'Skip to main content'
}: SkipLinkProps) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-teal-600 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:rounded-md',
        className
      )}
    >
      {children}
    </a>
  );
};
