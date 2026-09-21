import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  wasOffline: boolean;
  onDismissReconnected?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  wasOffline,
  onDismissReconnected,
}) => {
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        if (onDismissReconnected) onDismissReconnected();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, onDismissReconnected]);

  if (!isOnline) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <WifiOff className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">You're Offline</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Some Smart Khulna features require an internet connection. Please check your network connection.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div
        id="reconnected-banner"
        className="fixed top-0 inset-x-0 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-medium px-4 py-2 text-center flex items-center justify-center gap-2 shadow-md animate-fade-in"
      >
        <Wifi className="w-4 h-4 shrink-0" />
        <span>Connection restored! You are back online.</span>
      </div>
    );
  }

  return null;
};
