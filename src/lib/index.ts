/**
 * Centralized exports for all utility libraries
 * This helps reduce import complexity and provides a single source of truth
 */

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

// Component utilities
export { 
  deepMemo, 
  createOptimizedLazyComponent 
} from './component-optimization';

// Form validation utilities
export { z, initializeZod } from './zod-init';

// Common utilities
export * from './utils'; 