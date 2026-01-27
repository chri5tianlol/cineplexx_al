import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary caught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white p-8">
                    <div className="max-w-xl w-full bg-black/50 p-8 rounded-2xl border border-red-500/30">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong.</h2>
                        <p className="mb-4 text-gray-400">The Admin Dashboard crashed. Here is the error:</p>
                        <pre className="bg-black p-4 rounded text-xs text-red-400 overflow-auto mb-4 font-mono">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <details className="text-xs text-gray-500 font-mono whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
