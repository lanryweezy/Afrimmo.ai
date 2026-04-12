
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

  handleReset = () => {
      localStorage.removeItem('afrimmo_state');
      window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-8 text-center">
            <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 tracking-tight">System Interruption</h1>
            <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                Afrimmo AI encountered an unexpected error. This might be due to a corrupt local state or a temporary service issue.
            </p>

            {this.state.error && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 w-full max-w-lg text-left overflow-x-auto">
                    <p className="text-xs font-mono text-rose-400">Error: {this.state.error.message}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700"
                    onClick={() => window.location.reload()}
                >
                    Try Refreshing
                </button>
                <button
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all"
                    onClick={this.handleReset}
                >
                    Clear Cache & Restart
                </button>
            </div>

            <p className="mt-12 text-slate-600 text-xs">If the problem persists, please contact support@afrimmo.ai</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
