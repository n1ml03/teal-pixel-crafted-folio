/**
 * Centralized exports for all utility libraries
 * This helps reduce import complexity and provides a single source of truth
 */

// Resource management
export {
  resourceManager,
  initResourceManager,
  preloadCSS,
  CRITICAL_RESOURCES,
  setResourceCleanupEnabled
} from './resource-manager';

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

// Motion utilities
export * from './motion';

// Render optimization utilities
export {
  useRenderOptimizer,
  useDebounce,
  useMemoizedCalculation,
  useLazyLoad,
  useIdleCallback
} from './render-optimization';

// Scroll optimization utilities
export * from './scroll-optimization';

// Essential performance hooks
export {
  useOptimizedState,
  useStableMemo,
  useIntersectionObserver,
  useMediaQuery,
  useWindowEvent,
  usePerformanceMetrics,
  useOptimizedCallback,
  useLifecycleTransition,
  useStableReference,
  useErrorRecovery
} from './performance-hooks';

// React 19 async data hooks
export {
  useAsyncData,
  useOptimisticData,
  useAsyncAction,
  useFormState,
  clearDataCache,
  getCacheStats
} from '../hooks/useAsyncData';

// React 19 form action hooks
export {
  useFormAction,
  useFormValidation,
  useOptimisticForm,
  useMultiStepForm
} from '../hooks/useFormActions';

// Component utilities
export { 
  deepMemo, 
  createOptimizedLazyComponent 
} from './component-optimization';

// Form validation utilities
export { z, initializeZod } from './zod-init';

// Common utilities
export * from './utils'; 