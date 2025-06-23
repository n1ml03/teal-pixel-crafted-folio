/**
 * Centralized exports for all utility libraries
 * This helps reduce import complexity and provides a single source of truth
 */

// Resource management (replaces multiple preload utilities)
export { 
  resourceManager, 
  initResourceManager, 
  preloadCriticalImages, 
  preloadFonts, 
  preloadCSS,
  CRITICAL_RESOURCES
} from './resource-manager';

// Font loading utilities
export { loadFonts } from './font-loading';

// CSS optimization utilities
export { 
  loadCSS, 
  inlineCriticalCSS, 
  deferCSS, 
  extractCriticalCSS, 
  removeUnusedCSS, 
  isInViewport, 
  lazyLoadCSS 
} from './css-optimization';

// Image optimization utilities (keeping non-duplicate functions)
export { 
  preloadImage, 
  preloadImages, 
  useLazyImage, 
  checkImageExists, 
  getImageDimensions, 
  getResponsiveImageSources, 
  getImageLoadingAttribute, 
  generateSrcSet, 
  supportsWebP, 
  isImageCached, 
  getDominantColor 
} from './image-optimization';

// Motion utilities
export * from './motion';

// Render optimization utilities - specific exports to avoid conflicts
export {
  useRenderOptimizer,
  useDebounce,
  useThrottle,
  useMemoizedCalculation,
  useLazyLoad,
  useIdleCallback
} from './render-optimization';

// Scroll optimization utilities
export * from './scroll-optimization';

// Essential performance hooks - specific exports to avoid conflicts
export { 
  useOptimizedState, 
  useStableMemo, 
  useIntersectionObserver, 
  useMediaQuery, 
  useWindowEvent, 
  usePerformanceMetrics 
} from './performance-hooks';

// Component utilities
export { 
  deepMemo, 
  createOptimizedLazyComponent 
} from './component-optimization';

// Common utilities
export * from './utils'; 