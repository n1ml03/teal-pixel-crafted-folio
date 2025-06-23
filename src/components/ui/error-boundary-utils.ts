import React, { ErrorInfo } from 'react';

// Hook wrapper for functional components
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Manual error handling:', error);
    // Could dispatch to global error state or show toast
  };

  return { handleError };
};

// HOC wrapper
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: { fallback?: React.ComponentType<{ error: Error; resetError: () => void }> }
) => {
  const WrappedComponent = (props: P) => {
    // This would need to be imported from the main component
    // For now, just return the component as-is
    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
