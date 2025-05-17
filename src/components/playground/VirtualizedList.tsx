import React, { useState, useRef, useEffect, useCallback } from 'react';
import { throttle } from '@/lib/scroll-optimization';

interface VirtualizedListProps<T> {
  items: T[];
  height: number | string;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  scrollToIndex?: number;
}

/**
 * A virtualized list component that only renders items that are visible in the viewport
 * to improve performance with large lists.
 */
export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll,
  scrollToIndex
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Calculate the total height of all items
  const totalHeight = items.length * itemHeight;
  
  // Calculate the range of visible items
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItemCount = Math.ceil(
    (typeof height === 'number' ? height : parseInt(height, 10)) / itemHeight
  ) + overscan * 2;
  const endIndex = Math.min(items.length - 1, startIndex + visibleItemCount);
  
  // Get the visible items
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  // Handle scroll events
  const handleScroll = useCallback(
    throttle(() => {
      if (containerRef.current) {
        const newScrollTop = containerRef.current.scrollTop;
        setScrollTop(newScrollTop);
        
        if (onScroll) {
          onScroll(newScrollTop);
        }
      }
    }, 16), // ~60fps
    [onScroll]
  );
  
  // Scroll to a specific index
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const targetScrollTop = scrollToIndex * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [scrollToIndex, itemHeight]);
  
  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualizedList;
