import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
    <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
    {error && (
      <p className="text-slate-400 mb-4">
        Error: {error.message}
      </p>
    )}
    <button
      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
      onClick={() => window.location.reload()}
    >
      Reload Page
    </button>
  </div>
);

export default ErrorBoundary;