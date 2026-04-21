import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export function ErrorFallback({
    error,
    resetError,
}: {
    error: Error | null;
    resetError?: () => void;
}) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-200">
                {error?.message || 'An unexpected error occurred while rendering this section.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={resetError}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Try again
                </button>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-full border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                >
                    Refresh page
                </button>
            </div>
        </div>
    );
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, info: ErrorInfo): void {
        // eslint-disable-next-line no-console
        console.error('Uncaught error in ErrorBoundary:', error, info);
    }

    public resetError = (): void => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <ErrorFallback error={this.state.error} resetError={this.resetError} />
                )
            );
        }

        return this.props.children;
    }
}
