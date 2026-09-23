import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackText?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-4 text-center">
          <div className="max-w-md space-y-4">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif">
                সাময়িক লোডিং সমস্যা হয়েছে
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {this.props.fallbackText || 'পেজ বা কনটেন্ট লোড করতে সাময়িক বিলম্ব ঘটেছে। নিচে রিফ্রেশ বাটনে চাপ দিয়ে পুনরায় চেষ্টা করুন।'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
              <button
                onClick={() => {
                  this.handleReset();
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Home size={14} />
                <span>হোমে যান</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
