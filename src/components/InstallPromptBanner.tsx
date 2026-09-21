import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Apple, CheckCircle } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const InstallPromptBanner: React.FC = () => {
  const { isInstallable, isInstalled, platform, installPWA } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if user dismissed previously
    const dismissed = localStorage.getItem('smart_khulna_pwa_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Show again after 24 hours if not installed
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    if (!isInstalled && (isInstallable || platform === 'ios')) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, platform]);

  const handleInstallClick = async () => {
    if (platform === 'ios') {
      setShowIOSModal(true);
      return;
    }
    const success = await installPWA();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('smart_khulna_pwa_dismissed', Date.now().toString());
  };

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-emerald-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-700/50 flex items-start gap-3 animate-slide-up">
        <div className="p-2.5 bg-emerald-800 rounded-xl text-emerald-300 shrink-0">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white">স্মার্ট খুলনা অ্যাপ ইনস্টল করুন</h4>
            <button
              onClick={handleDismiss}
              className="text-emerald-300 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
            দ্রুত এক্সেস এবং অফলাইন সুবিধার জন্য আপনার ডিভাইসে স্মার্ট খুলনা অ্যাপ ইনস্টল করুন।
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              ইনস্টল করুন
            </button>
            <button
              onClick={handleDismiss}
              className="text-emerald-300 hover:text-white font-medium px-3 py-2 rounded-xl text-xs transition-colors"
            >
              এখন নয়
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                <Apple className="w-6 h-6" />
                <span>আইফোনে ইনস্টল করুন</span>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>আইফোন বা আইপ্যাডে অ্যাপটি হোম স্ক্রিনে যুক্ত করতে নিচের ধাপগুলো অনুসরণ করুন:</p>
              <ol className="list-decimal list-inside space-y-2 bg-slate-50 p-4 rounded-2xl text-xs font-medium text-slate-700">
                <li>সাফারি ব্রাউজারের নিচের দিকে থাকা <span className="font-bold text-emerald-700">Share</span> আইকনে ট্যাপ করুন।</li>
                <li>মেনু থেকে স্ক্রোল করে <span className="font-bold text-emerald-700">"Add to Home Screen"</span> সিলেক্ট করুন।</li>
                <li>উপরের কোণায় <span className="font-bold text-emerald-700">"Add"</span> এ চাপ দিন।</li>
              </ol>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 rounded-2xl text-sm transition-colors shadow-md"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>স্মার্ট খুলনা সফলভাবে ইনস্টল হয়েছে!</span>
        </div>
      )}
    </>
  );
};
