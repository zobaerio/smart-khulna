import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

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
      <div
        id="offline-banner"
        className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-white text-xs sm:text-sm font-medium px-4 py-2 text-center flex items-center justify-center gap-2 shadow-md animate-fade-in"
      >
        <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
        <span>আপনি বর্তমানে অফলাইনে আছেন। সংরক্ষিত ডাটা ব্রাউজ করা হচ্ছে।</span>
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
        <span>সংযোগ পুনরায় চালু হয়েছে!</span>
      </div>
    );
  }

  return null;
};
