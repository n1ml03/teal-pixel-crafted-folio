/**
 * Simplified Performance Monitor
 * Basic performance monitoring for development
 */

import React, { useEffect } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-hooks';

interface PerformanceOptimizerProps {
  enabled?: boolean;
  enableLogging?: boolean;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  enabled = true,
  enableLogging = process.env.NODE_ENV === 'development'
}) => {
  const metrics = usePerformanceMetrics();

  useEffect(() => {
    if (!enabled || !enableLogging) return;

    // Simple memory monitoring
    if ('memory' in performance) {
      const checkMemoryUsage = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const usedMB = memory.usedJSHeapSize / 1024 / 1024;
          if (usedMB > 100) { // Log if memory usage > 100MB
            console.log(`Memory usage: ${usedMB.toFixed(2)}MB`);
          }
        }
      };

      const memoryInterval = setInterval(checkMemoryUsage, 30000);
      return () => clearInterval(memoryInterval);
    }
  }, [enabled, enableLogging]);

  // Only show in development
  if (!enableLogging || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '200px'
      }}
    >
      <div>Performance:</div>
      {metrics.lcp && <div>LCP: {metrics.lcp.toFixed(0)}ms</div>}
      {metrics.fcp && <div>FCP: {metrics.fcp.toFixed(0)}ms</div>}
    </div>
  );
};

export default PerformanceOptimizer; 