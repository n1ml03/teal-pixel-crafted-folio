/**
 * Utilities for monitoring and optimizing performance
 */

/**
 * Interface for performance metrics
 */
export interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcp: number | null;
  loadTime: number | null;
  domContentLoaded: number | null;
}

/**
 * Initialize performance monitoring for Core Web Vitals
 * @returns A cleanup function to remove event listeners
 */
export function initPerformanceMonitoring(): () => void {
  // Initialize metrics object
  const metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
    loadTime: null,
    domContentLoaded: null
  };

  // Track CLS
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  // Function to report metrics to console or analytics
  const reportMetrics = () => {
    console.log('Performance Metrics:', metrics);
    
    // In a real application, you would send these metrics to an analytics service
    // Example: sendToAnalytics(metrics);
  };

  // Create observers if the Performance API is available
  if ('PerformanceObserver' in window) {
    // LCP observer
    let lcpObserver: PerformanceObserver | null = null;
    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
        console.log('LCP:', metrics.lcp);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP observer error:', e);
    }

    // FID observer
    let fidObserver: PerformanceObserver | null = null;
    try {
      fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry instanceof PerformanceEventTiming) {
            metrics.fid = entry.processingStart - entry.startTime;
            console.log('FID:', metrics.fid);
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID observer error:', e);
    }

    // CLS observer
    let clsObserver: PerformanceObserver | null = null;
    try {
      clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        
        entries.forEach(entry => {
          // Only count layout shifts without recent user input
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry);
            
            // Calculate CLS value
            const value = (entry as any).value;
            clsValue += value;
            metrics.cls = clsValue;
          }
        });
        
        console.log('CLS:', metrics.cls);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS observer error:', e);
    }

    // FCP observer
    let fcpObserver: PerformanceObserver | null = null;
    try {
      fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        metrics.fcp = firstEntry.startTime;
        console.log('FCP:', metrics.fcp);
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.error('FCP observer error:', e);
    }

    // Navigation and resource timing observer
    let navObserver: PerformanceObserver | null = null;
    try {
      navObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
            metrics.loadTime = navEntry.loadEventEnd - navEntry.startTime;
            metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.startTime;
            
            console.log('TTFB:', metrics.ttfb);
            console.log('Load Time:', metrics.loadTime);
            console.log('DOM Content Loaded:', metrics.domContentLoaded);
          }
        });
      });
      navObserver.observe({ type: 'navigation', buffered: true });
    } catch (e) {
      console.error('Navigation observer error:', e);
    }

    // Report metrics when the page is about to unload
    window.addEventListener('beforeunload', reportMetrics);

    // Return cleanup function
    return () => {
      if (lcpObserver) lcpObserver.disconnect();
      if (fidObserver) fidObserver.disconnect();
      if (clsObserver) clsObserver.disconnect();
      if (fcpObserver) fcpObserver.disconnect();
      if (navObserver) navObserver.disconnect();
      window.removeEventListener('beforeunload', reportMetrics);
    };
  } else {
    console.warn('PerformanceObserver not supported in this browser');
    return () => {}; // Return empty cleanup function
  }
}

/**
 * Get the current performance metrics
 * @returns The current performance metrics
 */
export function getCurrentPerformanceMetrics(): PerformanceMetrics {
  const metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
    loadTime: null,
    domContentLoaded: null
  };

  // Get navigation timing data if available
  const navEntries = performance.getEntriesByType('navigation');
  if (navEntries.length > 0) {
    const navEntry = navEntries[0] as PerformanceNavigationTiming;
    metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
    metrics.loadTime = navEntry.loadEventEnd - navEntry.startTime;
    metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.startTime;
  }

  // Get paint timing data if available
  const paintEntries = performance.getEntriesByType('paint');
  paintEntries.forEach(entry => {
    if (entry.name === 'first-contentful-paint') {
      metrics.fcp = entry.startTime;
    }
  });

  return metrics;
}

/**
 * Optimize long tasks by breaking them into smaller chunks
 * @param tasks Array of functions to execute
 * @param chunkSize Number of tasks to execute per chunk
 * @param delay Delay between chunks in milliseconds
 * @returns A promise that resolves when all tasks are complete
 */
export function optimizeLongTasks<T>(
  tasks: (() => T)[],
  chunkSize = 5,
  delay = 16
): Promise<T[]> {
  return new Promise((resolve) => {
    const results: T[] = [];
    let index = 0;

    function executeNextChunk() {
      const chunk = tasks.slice(index, index + chunkSize);
      index += chunkSize;

      if (chunk.length === 0) {
        resolve(results);
        return;
      }

      // Execute the current chunk
      chunk.forEach(task => {
        try {
          results.push(task());
        } catch (error) {
          console.error('Error executing task:', error);
        }
      });

      // Schedule the next chunk
      if (index < tasks.length) {
        setTimeout(executeNextChunk, delay);
      } else {
        resolve(results);
      }
    }

    // Start executing chunks
    executeNextChunk();
  });
}

/**
 * Optimize a heavy computation by using a web worker
 * @param fn The function to execute in a worker
 * @param data The data to pass to the function
 * @returns A promise that resolves with the result
 */
export function optimizeHeavyComputation<T, R>(
  fn: (data: T) => R,
  data: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    // Create a blob URL for the worker
    const fnString = fn.toString();
    const workerCode = `
      self.onmessage = function(e) {
        const fn = ${fnString};
        try {
          const result = fn(e.data);
          self.postMessage(result);
        } catch (error) {
          self.postMessage({ error: error.message });
        }
      }
    `;
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);

    // Create and use the worker
    const worker = new Worker(url);

    worker.onmessage = (e) => {
      if (e.data && e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data);
      }
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    worker.postMessage(data);
  });
}
