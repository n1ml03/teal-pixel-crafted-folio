/**
 * Utility for monitoring Cumulative Layout Shift (CLS)
 * Based on the web-vitals library approach
 */

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources: Array<{
    node?: Node;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }>;
}

interface CLSMetric {
  value: number;
  entries: LayoutShift[];
  reportCallback?: (metric: CLSMetric) => void;
}

/**
 * Monitors Cumulative Layout Shift and reports the value
 * @param reportCallback Callback function to report CLS value
 * @returns A function to stop monitoring
 */
export function monitorCLS(reportCallback?: (metric: CLSMetric) => void): () => void {
  if (!('PerformanceObserver' in window) || !('onload' in window)) {
    console.warn('CLS monitoring not supported in this browser');
    return () => {};
  }

  let sessionValue = 0;
  let sessionEntries: LayoutShift[] = [];
  let sessionId = Date.now();
  let sessionStarted = false;

  const entryHandler = (entries: PerformanceObserverEntryList) => {
    entries.getEntries().forEach((entry) => {
      // Only count layout shifts without recent user input
      if (!(entry as LayoutShift).hadRecentInput) {
        const currentEntry = entry as LayoutShift;
        
        // If this is a new session, reset the values
        if (sessionStarted && entry.startTime - sessionEntries[sessionEntries.length - 1].startTime > 5000) {
          sessionValue = 0;
          sessionEntries = [];
          sessionId = Date.now();
        }
        
        sessionStarted = true;
        sessionValue += currentEntry.value;
        sessionEntries.push(currentEntry);
        
        // Report the metric
        if (reportCallback) {
          reportCallback({
            value: sessionValue,
            entries: sessionEntries,
            reportCallback
          });
        }
        
        // Log to console for debugging
        console.debug(`CLS update: ${sessionValue.toFixed(4)}`);
      }
    });
  };

  // Create a PerformanceObserver to monitor layout shifts
  const observer = new PerformanceObserver(entryHandler);
  observer.observe({ type: 'layout-shift', buffered: true });

  // Report the final value when the page unloads
  window.addEventListener('beforeunload', () => {
    if (reportCallback && sessionValue > 0) {
      reportCallback({
        value: sessionValue,
        entries: sessionEntries,
        reportCallback
      });
    }
    
    console.log(`Final CLS: ${sessionValue.toFixed(4)}`);
  });

  // Return a function to stop monitoring
  return () => {
    observer.disconnect();
  };
}

/**
 * Logs CLS values to the console
 */
export function logCLS(): () => void {
  return monitorCLS((metric) => {
    console.log(`Current CLS: ${metric.value.toFixed(4)}`);
  });
}

/**
 * Highlights elements that contribute to CLS
 * @param threshold Minimum CLS value to highlight (default: 0.01)
 */
export function highlightCLSElements(threshold = 0.01): () => void {
  return monitorCLS((metric) => {
    // Only highlight if CLS is above threshold
    if (metric.value >= threshold) {
      metric.entries.forEach((entry) => {
        entry.sources.forEach((source) => {
          if (source.node && source.node instanceof Element) {
            // Add a highlight to the element
            const element = source.node as HTMLElement;
            element.style.outline = '3px solid red';
            element.style.position = 'relative';
            
            // Add a label with the CLS contribution
            const label = document.createElement('div');
            label.style.position = 'absolute';
            label.style.top = '0';
            label.style.left = '0';
            label.style.background = 'red';
            label.style.color = 'white';
            label.style.padding = '2px 5px';
            label.style.fontSize = '10px';
            label.style.zIndex = '10000';
            label.textContent = `CLS: ${entry.value.toFixed(4)}`;
            
            element.appendChild(label);
          }
        });
      });
    }
  });
}
