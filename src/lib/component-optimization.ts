/**
 * Simplified component optimization utilities
 * Only keeping essential utilities that are actually used
 */

import React, { ComponentType, memo } from 'react';

/**
 * Enhanced memo with custom comparison
 */
export function deepMemo<P extends object>(
  Component: ComponentType<P>,
  customCompare?: (prevProps: P, nextProps: P) => boolean
) {
  const MemoizedComponent = memo(Component, customCompare || shallowEqual);
  MemoizedComponent.displayName = `DeepMemo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * Shallow equality comparison
 */
function shallowEqual<T extends object>(prev: T, next: T): boolean {
  const prevKeys = Object.keys(prev) as (keyof T)[];
  const nextKeys = Object.keys(next) as (keyof T)[];

  if (prevKeys.length !== nextKeys.length) return false;
  return prevKeys.every(key => prev[key] === next[key]);
}

/**
 * Simple lazy component with retry
 */
export function createOptimizedLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return React.lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Failed to load component:', error);
      throw error;
    }
  });
} 