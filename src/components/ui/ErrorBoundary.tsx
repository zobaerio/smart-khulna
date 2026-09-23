import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackText?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL: Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleClearCacheAndReload = () => {
    try {
      // Clear all app cache
      const theme = localStorage.getItem('theme');
      const lang = localStorage.getItem('lang');
      localStorage.clear();
      sessionStorage.clear();
      if (theme) localStorage.setItem('theme', theme);
      if (lang) localStorage.setItem('lang', lang);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে';
      const componentStack = this.state.errorInfo?.componentStack;

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-center font-sans">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                সাময়িক লোডিং সমস্যা হয়েছে
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {this.props.fallbackText || 'অ্যাপ্লিকেশন রেন্ডার বা ডেটা সিঙ্ক করার সময় একটি সমস্যা দেখা দিয়েছে। নিচে বোতাম চাপ দিয়ে সমাধান করুন।'}
              </p>
              {errorMessage && (
                <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-left">
                  <p className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-300 break-words">
                    ত্রুটি: {errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>

              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 cursor-pointer"
                title="ক্যাশ মুছে অ্যাপ সম্পূর্ণ নতুনভাবে চালু করুন"
              >
                <Trash2 size={14} />
                <span>ক্যাশ পরিষ্কার ও রিলোড</span>
              </button>

              <button
                onClick={() => {
                  this.handleReset();
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home size={14} />
                <span>হোমে যান</span>
              </button>
            </div>

            {/* Error Details Accordion */}
            {(this.state.error?.stack || componentStack) && (
              <div className="pt-2 text-left">
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  className="text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span>প্রযুক্তিগত বিস্তারিত (Technical Details)</span>
                  {this.state.showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2 p-3 bg-slate-950 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48 whitespace-pre-wrap leading-tight border border-slate-800">
                    {this.state.error?.stack || ''}
                    {componentStack ? `\nComponent Stack:\n${componentStack}` : ''}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

