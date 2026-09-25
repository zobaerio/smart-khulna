import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, PhoneCall, X } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  wasOffline: boolean;
  onDismissReconnected?: () => void;
  onOpenSOS?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  wasOffline,
  onDismissReconnected,
  onOpenSOS
}) => {
  const [showReconnected, setShowReconnected] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      setIsDismissed(false);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        if (onDismissReconnected) onDismissReconnected();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, onDismissReconnected]);

  // When going offline, reset dismiss state so user is informed
  useEffect(() => {
    if (!isOnline) {
      setIsDismissed(false);
    }
  }, [isOnline]);

  // OFFLINE BANNER (Non-blocking, citizen-friendly with instant SOS trigger)
  if (!isOnline && !isDismissed) {
    return (
      <div
        id="smart-khulna-offline-strip"
        className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 text-white px-3 py-2 text-xs shadow-md border-b border-amber-500/40 animate-fade-in flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <WifiOff size={13} className="text-amber-200 animate-pulse" />
          </div>
          <div className="truncate">
            <span className="font-bold">অফলাইন মোড সক্রিয়:</span>{' '}
            <span className="text-amber-100 hidden sm:inline">
              ইন্টারনেট বা ডাটা না থাকলেও সেভ করা জরুরি নম্বর ও সেবায় সরাসরি কল করতে পারবেন।
            </span>
            <span className="text-amber-100 sm:hidden">
              ইন্টারনেট ছাড়াই জরুরি সেবায় কল করুন।
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenSOS && (
            <button
              onClick={onOpenSOS}
              className="bg-white text-rose-700 hover:bg-rose-50 font-black px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
            >
              <PhoneCall size={11} />
              <span>জরুরি SOS</span>
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-white/70 hover:text-white rounded-md transition"
            title="ব্যানার বন্ধ করুন"
            aria-label="Dismiss offline banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // RECONNECTED BANNER
  if (showReconnected) {
    return (
      <div
        id="reconnected-banner"
        className="sticky top-0 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-md animate-fade-in"
      >
        <Wifi size={15} className="shrink-0 animate-bounce" />
        <span>ইন্টারনেট সংযোগ ফিরে এসেছে! আপনি এখন সম্পূর্ণ অনলাইনে আছেন।</span>
      </div>
    );
  }

  return null;
};
