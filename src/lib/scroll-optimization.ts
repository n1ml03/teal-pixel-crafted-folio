/**
 * Advanced scroll performance utilities with multiple optimization strategies
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { throttle } from 'lodash-es';

// Re-export throttle for use in components
export { throttle };

/**
 * Advanced scroll handler with RAF, throttling, and performance monitoring
 */
export function createOptimizedScrollHandler(
  callback: (scrollY: number) => void,
  options: {
    throttleMs?: number;
    useRAF?: boolean;
    enablePerformanceMonitoring?: boolean;
  } = {}
): () => void {
  const { throttleMs = 16, useRAF = true, enablePerformanceMonitoring = false } = options;
  let rafId: number | null = null;
  let lastCallTime = 0;

  const optimizedCallback = (scrollY: number) => {
    if (enablePerformanceMonitoring) {
      const now = performance.now();
      if (now - lastCallTime < throttleMs) return;
      lastCallTime = now;
    }

    if (useRAF) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => callback(scrollY));
    } else {
      callback(scrollY);
    }
  };

  const throttledCallback = throttle(optimizedCallback, throttleMs);

  return useCallback(() => {
    const scrollY = window.scrollY;
    throttledCallback(scrollY);
  }, [throttledCallback]);
}

/**
 * High-performance passive scroll listener with multiple optimization strategies
 */
export function usePassiveScroll(
  callback: (e: Event) => void,
  element: HTMLElement | Window = window,
  options: {
    throttleMs?: number;
    debounceMs?: number;
    useRAF?: boolean;
    enablePerformanceMonitoring?: boolean;
  } = {}
): void {
  const { throttleMs = 16, debounceMs, useRAF = true, enablePerformanceMonitoring = false } = options;
  const rafRef = useRef<number | null>(null);
  const lastCallTimeRef = useRef(0);

  const optimizedCallback = useCallback((e: Event) => {
    if (enablePerformanceMonitoring) {
      const now = performance.now();
      if (now - lastCallTimeRef.current < (throttleMs || 16)) return;
      lastCallTimeRef.current = now;
    }

    if (useRAF) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => callback(e));
    } else {
      callback(e);
    }
  }, [callback, throttleMs, useRAF, enablePerformanceMonitoring]);

  const processedCallback = debounceMs
    ? throttle(optimizedCallback, throttleMs || 16)
    : throttle(optimizedCallback, throttleMs || 16);

  useEffect(() => {
    element.addEventListener('scroll', processedCallback, {
      passive: true,
      capture: false
    });

    return () => {
      element.removeEventListener('scroll', processedCallback);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [processedCallback, element]);
}

/**
 * Advanced scroll position tracking with performance optimizations
 */
export function useScrollPosition(
  options: {
    throttleMs?: number;
    element?: HTMLElement | Window;
    enableBoundingCheck?: boolean;
  } = {}
): {
  scrollY: number;
  scrollX: number;
  scrollDirection: 'up' | 'down' | 'left' | 'right' | null;
  isScrolling: boolean;
} {
  const { throttleMs = 16, element = window, enableBoundingCheck = true } = options;
  const [scrollPosition, setScrollPosition] = useState({ scrollY: 0, scrollX: 0 });
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  usePassiveScroll(
    useCallback(() => {
      const currentScrollY = element === window ? window.scrollY : (element as HTMLElement).scrollTop;
      const currentScrollX = element === window ? window.scrollX : (element as HTMLElement).scrollLeft;

      // Determine scroll direction
      const deltaY = currentScrollY - lastPositionRef.current.y;
      const deltaX = currentScrollX - lastPositionRef.current.x;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        setScrollDirection(deltaY > 0 ? 'down' : 'up');
      } else if (Math.abs(deltaX) > 0) {
        setScrollDirection(deltaX > 0 ? 'right' : 'left');
      }

      setScrollPosition({ scrollY: currentScrollY, scrollX: currentScrollX });
      setIsScrolling(true);

      lastPositionRef.current = { x: currentScrollX, y: currentScrollY };

      // Clear existing timeout and set new one
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection(null);
      }, 150);
    }, [element]),
    element,
    { throttleMs, useRAF: true, enablePerformanceMonitoring: true }
  );

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollY: scrollPosition.scrollY,
    scrollX: scrollPosition.scrollX,
    scrollDirection,
    isScrolling,
  };
}

/**
 * Optimized intersection observer hook for scroll-based animations
 */
export function useScrollIntersection(
  options: IntersectionObserverInit & {
    freezeOnceVisible?: boolean;
    triggerOnce?: boolean;
  } = {}
): {
  ref: (node: Element | null) => void;
  inView: boolean;
  entry: IntersectionObserverEntry | undefined;
} {
  const { freezeOnceVisible = false, triggerOnce = false, ...observerOptions } = options;
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!target) return;
    if (freezeOnceVisible && hasBeenVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;

        setInView(isIntersecting);
        setEntry(entry);

        if (isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }

        if (triggerOnce && isIntersecting) {
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
        ...observerOptions,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [target, freezeOnceVisible, hasBeenVisible, triggerOnce, observerOptions]);

  const ref = useCallback((node: Element | null) => {
    setTarget(node);
  }, []);

  return { ref, inView, entry };
}

/**
 * Adds CSS will-change property to elements that will be animated
 * @param selector The CSS selector for elements to optimize
 * @param properties The CSS properties that will change
 */
export function optimizeForAnimation(
  selector: string,
  properties: string[] = ['transform', 'opacity']
): void {
  const elements = document.querySelectorAll(selector);
  const willChangeValue = properties.join(', ');

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      element.style.willChange = willChangeValue;
      // Add CSS containment for better performance
      element.style.contain = 'layout paint';
    }
  });
}

/**
 * Removes CSS will-change property after animations complete to free up resources
 * @param selector The CSS selector for elements to clean up
 */
export function cleanupAnimationOptimization(selector: string): void {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      element.style.willChange = 'auto';
      element.style.contain = '';
    }
  });
}

/**
 * Performance-optimized scroll to element function
 */
export function scrollToElement(
  element: Element | string,
  options: {
    behavior?: 'smooth' | 'instant';
    block?: 'start' | 'center' | 'end' | 'nearest';
    inline?: 'start' | 'center' | 'end' | 'nearest';
    offset?: number;
    duration?: number;
  } = {}
): void {
  const { behavior = 'smooth', block = 'start', inline = 'nearest', offset = 0, duration = 500 } = options;

  const targetElement = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  if (!targetElement) return;

  if (behavior === 'smooth' && 'scrollIntoView' in targetElement) {
    // Use native smooth scrolling when available
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block,
      inline,
    });
  } else {
    // Fallback to manual smooth scrolling
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY + offset;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smooth animation
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }
}


