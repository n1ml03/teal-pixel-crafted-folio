import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useScrollPosition } from '@/lib/scroll-optimization';
import { useStableCallback, usePerformantMemo } from '@/lib/component-optimization';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  getItemKey?: (item: T, index: number) => string | number;
}

/**
 * High-performance virtual scrolling component
 * Only renders visible items plus a small buffer for smooth scrolling
 */
export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  getItemKey = (_, index) => index,
}: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range with memoization for performance
  const visibleRange = usePerformantMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length], 'VirtualScroll-visibleRange');

  // Calculate total height
  const totalHeight = usePerformantMemo(() => {
    return items.length * itemHeight;
  }, [items.length, itemHeight], 'VirtualScroll-totalHeight');

  // Get visible items
  const visibleItems = usePerformantMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange.startIndex, visibleRange.endIndex], 'VirtualScroll-visibleItems');

  // Stable scroll handler
  const handleScroll = useStableCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // Render visible items with proper positioning
  const renderedItems = useMemo(() => {
    return visibleItems.map((item, index) => {
      const actualIndex = visibleRange.startIndex + index;
      const top = actualIndex * itemHeight;
      const key = getItemKey(item, actualIndex);

      return (
        <div
          key={key}
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: 0,
            right: 0,
            height: `${itemHeight}px`,
            // Performance optimizations
            contain: 'layout paint',
            transform: 'translateZ(0)',
          }}
        >
          {renderItem(item, actualIndex)}
        </div>
      );
    });
  }, [visibleItems, visibleRange.startIndex, itemHeight, renderItem, getItemKey]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto scroll-container ${className}`}
      style={{
        height: containerHeight,
        // Performance optimizations
        contain: 'strict',
        transform: 'translateZ(0)',
        // Ensure proper positioning for scroll calculations
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      {/* Total height container */}
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {renderedItems}
      </div>
    </div>
  );
}

/**
 * Hook for virtual scrolling with dynamic item heights
 */
export function useVirtualScroll<T>({
  items,
  estimatedItemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[];
  estimatedItemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate item positions based on measured heights
  const itemPositions = usePerformantMemo(() => {
    const positions: number[] = [];
    let totalHeight = 0;

    for (let i = 0; i < items.length; i++) {
      positions[i] = totalHeight;
      const height = itemHeights.get(i) || estimatedItemHeight;
      totalHeight += height;
    }

    return { positions, totalHeight };
  }, [items.length, itemHeights, estimatedItemHeight], 'VirtualScroll-itemPositions');

  // Find visible range for dynamic heights
  const visibleRange = usePerformantMemo(() => {
    const { positions } = itemPositions;
    let startIndex = 0;
    let endIndex = items.length - 1;

    // Binary search for start index
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] >= scrollTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
    }

    // Find end index
    for (let i = startIndex; i < positions.length; i++) {
      const itemHeight = itemHeights.get(i) || estimatedItemHeight;
      if (positions[i] + itemHeight >= scrollTop + containerHeight) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, itemPositions, overscan, items.length, itemHeights, estimatedItemHeight], 'VirtualScroll-dynamicVisibleRange');

  // Measure item height callback
  const measureItem = useStableCallback((index: number, height: number) => {
    setItemHeights(prev => {
      if (prev.get(index) !== height) {
        const newMap = new Map(prev);
        newMap.set(index, height);
        return newMap;
      }
      return prev;
    });
  }, []);

  const handleScroll = useStableCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    scrollTop,
    visibleRange,
    totalHeight: itemPositions.totalHeight,
    getItemPosition: (index: number) => itemPositions.positions[index] || 0,
    measureItem,
    handleScroll,
  };
}

/**
 * Virtual scroll item component with height measurement
 */
interface VirtualScrollItemProps {
  index: number;
  onMeasure: (index: number, height: number) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const VirtualScrollItem = React.memo<VirtualScrollItemProps>(({
  index,
  onMeasure,
  children,
  style = {},
}) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.offsetHeight;
      onMeasure(index, height);
    }
  }, [index, onMeasure, children]);

  return (
    <div
      ref={itemRef}
      style={{
        ...style,
        contain: 'layout paint',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  );
});

VirtualScrollItem.displayName = 'VirtualScrollItem';

/**
 * Optimized virtual grid component for 2D layouts
 */
interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gap?: number;
  overscan?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  renderItem,
  gap = 0,
  overscan = 5,
  className = '',
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Calculate grid dimensions
  const gridMetrics = usePerformantMemo(() => {
    const effectiveItemWidth = itemWidth + gap;
    const effectiveItemHeight = itemHeight + gap;
    const columnsPerRow = Math.floor((containerWidth + gap) / effectiveItemWidth);
    const totalRows = Math.ceil(items.length / columnsPerRow);
    const totalHeight = totalRows * effectiveItemHeight;

    return {
      columnsPerRow,
      totalRows,
      totalHeight,
      effectiveItemWidth,
      effectiveItemHeight,
    };
  }, [items.length, itemWidth, itemHeight, containerWidth, gap], 'VirtualGrid-metrics');

  // Calculate visible range
  const visibleRange = usePerformantMemo(() => {
    const { effectiveItemHeight, columnsPerRow } = gridMetrics;
    const startRow = Math.max(0, Math.floor(scrollTop / effectiveItemHeight) - overscan);
    const endRow = Math.min(
      gridMetrics.totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / effectiveItemHeight) + overscan
    );

    const startIndex = startRow * columnsPerRow;
    const endIndex = Math.min(items.length - 1, (endRow + 1) * columnsPerRow - 1);

    return { startIndex, endIndex, startRow, endRow };
  }, [scrollTop, containerHeight, gridMetrics, overscan, items.length], 'VirtualGrid-visibleRange');

  const handleScroll = useStableCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollLeft(event.currentTarget.scrollLeft);
  }, []);

  // Render visible items
  const renderedItems = useMemo(() => {
    const { columnsPerRow, effectiveItemWidth, effectiveItemHeight } = gridMetrics;
    const visibleItems = items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);

    return visibleItems.map((item, index) => {
      const actualIndex = visibleRange.startIndex + index;
      const row = Math.floor(actualIndex / columnsPerRow);
      const col = actualIndex % columnsPerRow;
      const left = col * effectiveItemWidth;
      const top = row * effectiveItemHeight;

      return (
        <div
          key={actualIndex}
          style={{
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: `${itemWidth}px`,
            height: `${itemHeight}px`,
            contain: 'layout paint',
            transform: 'translateZ(0)',
          }}
        >
          {renderItem(item, actualIndex)}
        </div>
      );
    });
  }, [items, visibleRange, gridMetrics, itemWidth, itemHeight, renderItem]);

  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight,
        contain: 'strict',
        transform: 'translateZ(0)',
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: gridMetrics.totalHeight,
          position: 'relative',
        }}
      >
        {renderedItems}
      </div>
    </div>
  );
}
