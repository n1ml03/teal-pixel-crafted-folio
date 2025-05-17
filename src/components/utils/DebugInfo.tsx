import React, { useState, useEffect } from 'react';

interface DebugInfoProps {
  show?: boolean;
}

/**
 * DebugInfo component to display debugging information
 * Only visible in development mode and when show is true
 */
const DebugInfo: React.FC<DebugInfoProps> = ({ show = true }) => {
  const [info, setInfo] = useState<{
    viewport: string;
    userAgent: string;
    performance: {
      memory?: {
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
      };
      timing?: any;
    };
    errors: string[];
    warnings: string[];
  }>({
    viewport: '',
    userAgent: '',
    performance: {},
    errors: [],
    warnings: []
  });

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development' || !show) {
      return;
    }

    // Collect basic information
    const updateInfo = () => {
      setInfo({
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        performance: {
          memory: (performance as any).memory,
          timing: performance.timing
        },
        errors: [],
        warnings: []
      });
    };

    // Initial update
    updateInfo();

    // Update on resize
    window.addEventListener('resize', updateInfo);

    // Intercept console errors and warnings
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args: any[]) => {
      setInfo(prev => ({
        ...prev,
        errors: [...prev.errors, args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ')].slice(-10) // Keep only the last 10 errors
      }));
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      setInfo(prev => ({
        ...prev,
        warnings: [...prev.warnings, args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ')].slice(-10) // Keep only the last 10 warnings
      }));
      originalWarn.apply(console, args);
    };

    // Restore original console methods on cleanup
    return () => {
      window.removeEventListener('resize', updateInfo);
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, [show]);

  // Only render in development mode and when show is true
  if (process.env.NODE_ENV !== 'development' || !show) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        maxWidth: '400px',
        maxHeight: '300px',
        overflow: 'auto'
      }}
    >
      <h3 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Debug Info</h3>
      <div>
        <strong>Viewport:</strong> {info.viewport}
      </div>
      <div>
        <strong>User Agent:</strong> {info.userAgent.substring(0, 50)}...
      </div>
      {info.performance.memory && (
        <div>
          <strong>Memory:</strong> Used {Math.round(info.performance.memory.usedJSHeapSize / 1048576)}MB / 
          Total {Math.round(info.performance.memory.totalJSHeapSize / 1048576)}MB
        </div>
      )}
      {info.errors.length > 0 && (
        <div>
          <strong>Errors:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {info.errors.map((error, i) => (
              <li key={i} style={{ color: '#ff6b6b' }}>{error.substring(0, 100)}</li>
            ))}
          </ul>
        </div>
      )}
      {info.warnings.length > 0 && (
        <div>
          <strong>Warnings:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {info.warnings.map((warning, i) => (
              <li key={i} style={{ color: '#feca57' }}>{warning.substring(0, 100)}</li>
            ))}
          </ul>
        </div>
      )}
      <button 
        onClick={() => window.location.reload()} 
        style={{
          backgroundColor: '#4cd137',
          border: 'none',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          marginTop: '5px',
          cursor: 'pointer'
        }}
      >
        Reload Page
      </button>
    </div>
  );
};

export default DebugInfo;
