import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface EnhancedLoadingProps {
  variant?: 'hero' | 'section' | 'card' | 'minimal';
  className?: string;
  itemCount?: number;
  showShimmer?: boolean;
  customHeight?: string;
  ariaLabel?: string;
}

const ShimmerEffect = () => (
  <motion.div
    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{
      translateX: ['100%', '100%', '-100%']
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
      repeatDelay: 1
    }}
  />
);

const LoadingCard = ({ showShimmer = true, className = '' }: { showShimmer?: boolean; className?: string }) => (
  <div className={cn("relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border/50", className)}>
    <div className="p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
    {showShimmer && <ShimmerEffect />}
  </div>
);

const LoadingSectionGrid = ({ itemCount = 3, showShimmer = true }: { itemCount?: number; showShimmer?: boolean }) => (
  <div className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      {/* Section title skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      {/* Grid of loading cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(itemCount)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: i * 0.1,
              ease: 'easeOut'
            }}
          >
            <LoadingCard showShimmer={showShimmer} />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const LoadingHero = ({ showShimmer = true }: { showShimmer?: boolean }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      {/* Hero title */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-12 w-1/2 mx-auto" />
      </div>
      
      {/* Hero subtitle */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </div>
      
      {/* Hero image placeholder */}
      <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80">
        <Skeleton className="w-full h-full rounded-full" />
        {showShimmer && <ShimmerEffect />}
      </div>
      
      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  </div>
);

const LoadingMinimal = ({ customHeight = "200px" }: { customHeight?: string }) => (
  <div className="flex items-center justify-center p-8" style={{ minHeight: customHeight }}>
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <div className="flex justify-center gap-2">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  variant = 'section',
  className = '',
  itemCount = 3,
  showShimmer = true,
  customHeight = '200px',
  ariaLabel = 'Đang tải nội dung...'
}) => {
  const renderLoadingContent = () => {
    switch (variant) {
      case 'hero':
        return <LoadingHero showShimmer={showShimmer} />;
      case 'section':
        return <LoadingSectionGrid itemCount={itemCount} showShimmer={showShimmer} />;
      case 'card':
        return <LoadingCard showShimmer={showShimmer} className="h-64" />;
      case 'minimal':
        return <LoadingMinimal customHeight={customHeight} />;
      default:
        return <LoadingSectionGrid itemCount={itemCount} showShimmer={showShimmer} />;
    }
  };

  return (
    <div 
      className={cn("relative", className)}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderLoadingContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Export specific loading variants for convenience
export const HeroLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="hero" />
);

export const SectionLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="section" />
);

export const CardLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="card" />
);

export const MinimalLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="minimal" />
);

export default EnhancedLoading; 