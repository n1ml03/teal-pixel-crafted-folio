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
  CRITICAL_RESOURCES,
  setResourceCleanupEnabled
} from './resource-manager';

// Font loading utilities
export { loadFonts } from './font-loading';

// CSS optimization utilities
export {
  loadOptimizedCSS,
  loadCSSBatch,
  inlineCriticalCSS,
  cleanupUnusedCSS,
  isElementInViewport,
  loadCSSOnElementVisible,
  loadCSSForMediaQuery,
  getCSSLoadingMetrics
} from './css-optimization';

// Image optimization utilities (keeping non-duplicate functions)
export {
  preloadImage,
  preloadImages,
  useLazyImage,
  getImageDimensions,
  getResponsiveImageSources,
  getImageLoadingAttribute,
  supportsWebP,
  isImageCached,
  getDominantColor,
  clearImageCache
} from './image-optimization';

// Motion utilities
export * from './motion';

// Render optimization utilities - specific exports to avoid conflicts
export {
  useRenderOptimizer,
  useDebounce,
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
  usePerformanceMetrics,
  useOptimizedCallback
} from './performance-hooks';

// Component utilities
export { 
  deepMemo, 
  createOptimizedLazyComponent 
} from './component-optimization';

// Common utilities
export * from './utils'; 