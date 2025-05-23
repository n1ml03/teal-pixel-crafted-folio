import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  loadTime: number | null;
  domContentLoaded: number | null;
}

interface PerformanceMonitorProps {
  onMetricsCollected?: (metrics: PerformanceMetrics) => void;
  enableLogging?: boolean;
  enableReporting?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsCollected,
  enableLogging = false,
  enableReporting = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null
  });

  const observerRef = useRef<PerformanceObserver | null>(null);
  const metricsCollectedRef = useRef(false);

  // Report metrics to analytics service
  const reportMetrics = (metricsToReport: PerformanceMetrics) => {
    if (!enableReporting) return;

    try {
      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as any).gtag;
        
        // Report Core Web Vitals
        if (metricsToReport.lcp) {
          gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(metricsToReport.lcp),
            event_category: 'Performance'
          });
        }

        if (metricsToReport.fid) {
          gtag('event', 'web_vitals', {
            name: 'FID',
            value: Math.round(metricsToReport.fid),
            event_category: 'Performance'
          });
        }

        if (metricsToReport.cls) {
          gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(metricsToReport.cls * 1000), // Convert to ms for easier reading
            event_category: 'Performance'
          });
        }
      }

      // Send to custom analytics endpoint
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metricsToReport,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(error => {
        console.warn('Failed to send performance metrics:', error);
      });

    } catch (error) {
      console.warn('Performance reporting failed:', error);
    }
  };

  // Log metrics for debugging
  const logMetrics = (metricsToLog: PerformanceMetrics) => {
    if (!enableLogging) return;

    console.group('🚀 Performance Metrics');
    
    if (metricsToLog.lcp) {
      const lcpGrade = metricsToLog.lcp <= 2500 ? '✅ Good' : 
                      metricsToLog.lcp <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`LCP (Largest Contentful Paint): ${metricsToLog.lcp.toFixed(0)}ms - ${lcpGrade}`);
    }

    if (metricsToLog.fid) {
      const fidGrade = metricsToLog.fid <= 100 ? '✅ Good' : 
                      metricsToLog.fid <= 300 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`FID (First Input Delay): ${metricsToLog.fid.toFixed(0)}ms - ${fidGrade}`);
    }

    if (metricsToLog.cls !== null) {
      const clsGrade = metricsToLog.cls <= 0.1 ? '✅ Good' : 
                      metricsToLog.cls <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`CLS (Cumulative Layout Shift): ${metricsToLog.cls.toFixed(3)} - ${clsGrade}`);
    }

    if (metricsToLog.fcp) {
      const fcpGrade = metricsToLog.fcp <= 1800 ? '✅ Good' : 
                      metricsToLog.fcp <= 3000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`FCP (First Contentful Paint): ${metricsToLog.fcp.toFixed(0)}ms - ${fcpGrade}`);
    }

    if (metricsToLog.ttfb) {
      const ttfbGrade = metricsToLog.ttfb <= 800 ? '✅ Good' : 
                       metricsToLog.ttfb <= 1800 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`TTFB (Time to First Byte): ${metricsToLog.ttfb.toFixed(0)}ms - ${ttfbGrade}`);
    }

    if (metricsToLog.loadTime) {
      console.log(`Load Time: ${metricsToLog.loadTime.toFixed(0)}ms`);
    }

    if (metricsToLog.domContentLoaded) {
      console.log(`DOM Content Loaded: ${metricsToLog.domContentLoaded.toFixed(0)}ms`);
    }

    console.groupEnd();
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const newMetrics: PerformanceMetrics = { ...metrics };

    // Measure Navigation Timing metrics
    const measureNavigationTiming = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        newMetrics.ttfb = navigation.responseStart - navigation.requestStart;
        newMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
        newMetrics.loadTime = navigation.loadEventEnd - navigation.navigationStart;
      }
    };

    // Observe Core Web Vitals
    const observeWebVitals = () => {
      // LCP Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        newMetrics.lcp = lastEntry.startTime;
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });

      // FID Observer  
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-input-delay') {
            newMetrics.fid = entry.value;
            setMetrics(prev => ({ ...prev, fid: entry.value }));
          }
        });
      });

      // CLS Observer
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        newMetrics.cls = clsValue;
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });

      // FCP Observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            newMetrics.fcp = entry.startTime;
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        });
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        fidObserver.observe({ entryTypes: ['first-input'] });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        fcpObserver.observe({ entryTypes: ['paint'] });

        observerRef.current = lcpObserver; // Store one observer for cleanup
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    };

    // Start measuring
    measureNavigationTiming();
    observeWebVitals();

    // Collect final metrics after page load
    const collectFinalMetrics = () => {
      if (metricsCollectedRef.current) return;
      
      measureNavigationTiming();
      
      const finalMetrics = {
        ...newMetrics,
        ...metrics
      };

      setMetrics(finalMetrics);
      logMetrics(finalMetrics);
      reportMetrics(finalMetrics);
      
      if (onMetricsCollected) {
        onMetricsCollected(finalMetrics);
      }

      metricsCollectedRef.current = true;
    };

    // Collect metrics after load event or after a delay
    if (document.readyState === 'complete') {
      setTimeout(collectFinalMetrics, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(collectFinalMetrics, 1000);
      });
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Don't render anything - this is a monitoring component
  return null;
};

export default PerformanceMonitor; 