import { createRoot } from 'react-dom/client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorText: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorText: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorText: error?.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Candy Blast Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#2b083c] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
          <div className="text-5xl mb-4">🍬</div>
          <h1 className="text-2xl font-black text-pink-400 mb-2">Candy Blast</h1>
          <p className="text-sm text-pink-200 mb-6 max-w-xs">
            Oops! The sugar rush had a little hiccup. Let's restart the sweet fun!
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="candy-btn px-6 py-2.5 rounded-full font-bold text-white text-base shadow-lg cursor-pointer"
          >
            Restart Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

