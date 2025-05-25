import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));

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