import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log error to error reporting service (e.g., Sentry) in production
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-deep p-4">
          <div className="max-w-2xl w-full">
            <div className="glass-panel rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-error-main/10 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-error-main" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-text-primary mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-text-secondary mb-8 text-lg">
                We're sorry for the inconvenience. An unexpected error occurred while rendering this page.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 p-4 bg-error-main/5 border border-error-main/20 rounded-lg text-left">
                  <p className="font-mono text-sm text-error-main mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                        View stack trace
                      </summary>
                      <pre className="mt-2 text-xs text-text-secondary overflow-auto max-h-64 p-2 bg-background-elevated rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={this.handleReset}
                  icon={<RefreshCw className="w-5 h-5" />}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={this.handleGoHome}
                  icon={<Home className="w-5 h-5" />}
                >
                  Go Home
                </Button>
              </div>

              {!import.meta.env.DEV && (
                <p className="mt-8 text-sm text-text-muted">
                  If this problem persists, please contact support.
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
