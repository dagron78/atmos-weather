import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h1>
                    <p className="mb-4 opacity-80">Please reload the app.</p>
                    <pre className="bg-black/30 p-4 rounded text-xs text-left overflow-auto max-w-full">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-blue-500 px-6 py-2 rounded-full font-medium active:scale-95 transition-transform">
                        Reload App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
