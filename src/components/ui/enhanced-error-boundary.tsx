import React, { Component, ErrorInfo, ReactNode, startTransition, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useErrorRecovery } from '@/lib/performance-hooks';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to analytics/monitoring service
    this.reportError(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Send error to monitoring service (Sentry, LogRocket, etc.)
    try {
      // Example: Send to analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'exception', {
          description: error.message,
          fatal: false,
          error_boundary: true
        });
      }

      // Log structured error data
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.error('Structured error data:', errorData);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      startTransition(() => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: prevState.retryCount + 1
        }));
      });

      // Automatic retry after a delay for certain error types
      if (this.shouldAutoRetry()) {
        this.retryTimeout = setTimeout(() => {
          this.forceUpdate();
        }, 1000);
      }
    }
  };

  private shouldAutoRetry = (): boolean => {
    const error = this.state.error;
    if (!error) return false;

    // Auto retry for network-related errors or chunk loading errors
    const retryableErrors = [
      'ChunkLoadError',
      'Loading chunk',
      'Failed to fetch',
      'NetworkError'
    ];

    return retryableErrors.some(errorType =>
      error.message.includes(errorType) || error.name.includes(errorType)
    );
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private renderErrorDetails = () => {
    if (!this.props.showErrorDetails) return null;

    const { error, errorInfo } = this.state;

    return (
      <details className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center gap-2">
          <Bug className="w-4 h-4" />
          Chi tiết lỗi (dành cho developer)
        </summary>
        <div className="mt-2 space-y-2 text-xs font-mono">
          {error && (
            <div>
              <p className="font-semibold text-red-600">Lỗi:</p>
              <pre className="whitespace-pre-wrap bg-red-50 p-2 rounded border text-red-800">
                {error.message}
              </pre>
              {error.stack && (
                <>
                  <p className="font-semibold text-red-600 mt-2">Stack trace:</p>
                  <pre className="whitespace-pre-wrap bg-red-50 p-2 rounded border text-red-800 max-h-32 overflow-y-auto">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          )}
          {errorInfo && (
            <div>
              <p className="font-semibold text-blue-600">Component stack:</p>
              <pre className="whitespace-pre-wrap bg-blue-50 p-2 rounded border text-blue-800 max-h-32 overflow-y-auto">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  private renderErrorUI = () => {
    const { error } = this.state;
    const isNetworkError = error && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('ChunkLoadError')
    );

    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-6"
          >
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isNetworkError ? 'Lỗi kết nối' : 'Có lỗi xảy ra'}
          </h2>

          <p className="text-gray-600 mb-6">
            {isNetworkError
              ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại.'
              : 'Xin lỗi, có lỗi không mong muốn đã xảy ra. Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất.'
            }
          </p>

          <div className="space-y-3">
            {this.state.retryCount < this.maxRetries && (
              <Button
                onClick={this.handleRetry}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại ({this.maxRetries - this.state.retryCount} lần còn lại)
              </Button>
            )}

            <Button
              variant="outline"
              onClick={this.handleGoHome}
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </div>

          {this.state.retryCount >= this.maxRetries && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-700">
                Đã thử lại nhiều lần nhưng vẫn lỗi. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.
              </p>
            </motion.div>
          )}

          {this.renderErrorDetails()}
        </motion.div>
      </div>
    );
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    return (
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {fallback || this.renderErrorUI()}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}



export default EnhancedErrorBoundary;

/**
 * React 19 hook for handling errors in functional components
 */
export function useComponentErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const resetError = useCallback(() => {
    startTransition(() => {
      setError(null);
      setRetryCount(0);
    });
  }, []);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      startTransition(() => {
        setError(null);
        setRetryCount(prev => prev + 1);
      });
    }
  }, [retryCount, maxRetries]);

  const handleError = useCallback((error: Error) => {
    startTransition(() => {
      setError(error);
    });

    // Report error
    console.error('Component error:', error);
    
    // Send to monitoring service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'exception', {
        description: error.message,
        fatal: false,
        functional_component: true
      });
    }
  }, []);

  return {
    error,
    retryCount,
    maxRetries,
    resetError,
    retry,
    handleError,
    canRetry: retryCount < maxRetries
  };
}

/**
 * React 19 ErrorBoundary HOC for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const WrappedComponent = (props: P) => {
    const { error, retry, handleError } = useComponentErrorBoundary();

    // Use React's error boundary features
    React.useEffect(() => {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        handleError(new Error(event.reason));
      };

      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    }, [handleError]);

    if (error) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent error={error} retry={retry} />;
      }

      return (
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Error</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={retry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      );
    }

    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * React 19 Async Error Boundary for handling async operations
 */
export function AsyncErrorBoundary({ 
  children, 
  fallback,
  onError 
}: {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error) => void;
}) {
  const { error, retry, handleError } = useComponentErrorBoundary();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  if (error) {
    if (fallback) {
      return <>{fallback(error, retry)}</>;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-red-50 border border-red-200 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h4 className="text-red-800 font-medium">Async Operation Failed</h4>
        </div>
        <p className="text-red-700 text-sm mb-4">{error.message}</p>
        <Button 
          onClick={retry} 
          size="sm" 
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-100"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return <>{children}</>;
}