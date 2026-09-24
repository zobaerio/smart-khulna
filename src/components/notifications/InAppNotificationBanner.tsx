import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  ShieldAlert, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Building2, 
  Navigation, 
  CloudRain,
  ExternalLink
} from 'lucide-react';
import { UserNotificationItem, NOTIFICATION_CATEGORIES } from '../../types/notifications';
import { notificationService } from '../../services/notificationService';

interface InAppNotificationBannerProps {
  onNavigateDeepLink: (link: string) => void;
}

export const InAppNotificationBanner: React.FC<InAppNotificationBannerProps> = ({
  onNavigateDeepLink
}) => {
  const [activeBanner, setActiveBanner] = useState<UserNotificationItem | null>(null);
  const [emergencyModal, setEmergencyModal] = useState<UserNotificationItem | null>(null);

  useEffect(() => {
    // Listen to foreground notifications
    const unsubscribe = notificationService.addForegroundListener((notification) => {
      if (notification.category === 'emergency' || notification.priority === 'high') {
        setEmergencyModal(notification);
      } else {
        setActiveBanner(notification);
        // Auto-dismiss banner after 6 seconds
        const timer = setTimeout(() => {
          setActiveBanner(prev => (prev?.id === notification.id ? null : prev));
        }, 6000);
        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, []);

  const handleAction = (item: UserNotificationItem) => {
    notificationService.markAsOpened(item.notificationId, item.id);
    setActiveBanner(null);
    setEmergencyModal(null);
    if (item.deepLink) {
      onNavigateDeepLink(item.deepLink);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />;
      case 'event':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'complaint':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'service':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'traffic':
        return <Navigation className="w-5 h-5 text-yellow-600" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-cyan-600" />;
      case 'notice':
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <>
      {/* 1. FOREGROUND HEADS-UP BANNER */}
      {activeBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 animate-in slide-in-from-top-6 duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200 dark:border-slate-700 p-3.5 flex items-start gap-3 ring-1 ring-black/5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
              {getCategoryIcon(activeBanner.category)}
            </div>

            <div className="flex-1 min-w-0" onClick={() => handleAction(activeBanner)}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {NOTIFICATION_CATEGORIES[activeBanner.category]?.label || 'বিজ্ঞপ্তি'}
                </span>
                <span className="text-[9px] text-slate-400">• এইমাত্র</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {activeBanner.title}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                {activeBanner.body}
              </p>
              {activeBanner.deepLink && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(activeBanner);
                  }}
                  className="mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  বিস্তারিত দেখুন <ArrowRight size={12} />
                </button>
              )}
            </div>

            <button
              onClick={() => setActiveBanner(null)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg shrink-0 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 2. EMERGENCY FULL ALERT OVERLAY MODAL */}
      {emergencyModal && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 flex items-center justify-center animate-bounce">
                  <Flame className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                    জরুরি হাই-প্রায়োরিটি সতর্কতা
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 font-serif">
                    {emergencyModal.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setEmergencyModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {emergencyModal.image && (
              <img
                src={emergencyModal.image}
                alt="Emergency Alert"
                className="w-full h-40 object-cover rounded-xl shadow-xs"
              />
            )}

            <div className="bg-red-50 dark:bg-red-950/30 p-3.5 rounded-2xl border border-red-100 dark:border-red-900/50">
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                {emergencyModal.body}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEmergencyModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => handleAction(emergencyModal)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ShieldAlert size={15} />
                জরুরি সহায়তা দেখুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
