import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  X, 
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { checkForAppUpdate, applyAppUpdate, CheckUpdateResult } from '../../lib/appVersion';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({ isOpen, onClose }) => {
  const [checking, setChecking] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<CheckUpdateResult | null>(null);

  const runCheck = async () => {
    setChecking(true);
    setResult(null);
    try {
      // Small natural delay so user sees real checking state
      await new Promise(r => setTimeout(r, 600));
      const res = await checkForAppUpdate();
      setResult(res);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  const handleApplyUpdate = async () => {
    if (!result?.latestVersion) return;
    setUpdating(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      await applyAppUpdate(result.latestVersion);
    } catch (err) {
      console.error(err);
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={!updating ? onClose : undefined}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-200 dark:border-slate-800 flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DownloadCloud size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">অ্যাপ আপডেট সেন্টার</h3>
              <p className="text-[10px] text-slate-500">স্মার্ট খুলনা সিস্টেম ভার্সন</p>
            </div>
          </div>
          {!updating && (
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Loading / Checking State */}
          {checking && (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 animate-pulse">
                <RefreshCw size={26} className="animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ভার্সন পরীক্ষা করা হচ্ছে...</h4>
                <p className="text-xs text-slate-500">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন</p>
              </div>
            </div>
          )}

          {/* Updating in progress state */}
          {!checking && updating && (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                <RefreshCw size={26} className="animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">অ্যাপ আপডেট করা হচ্ছে...</h4>
                <p className="text-xs text-slate-500">ক্যাশ ফাইল সিঙ্ক ও লেটেস্ট এসেট প্রস্তুত হচ্ছে</p>
              </div>
              <div className="w-48 mx-auto h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full animate-pulse w-full" />
              </div>
            </div>
          )}

          {/* Update Available State */}
          {!checking && !updating && result?.status === 'update_available' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                  <Sparkles size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    নতুন ভার্সন পাওয়া গেছে!
                  </h4>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    আপনার অ্যাপের জন্য একটি নতুন আপডেট available। এখনই আপডেট করে নতুন ফিচারসমূহ উপভোগ করুন।
                  </p>
                </div>
              </div>

              {/* Version Numbers Box */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">বর্তমান ভার্সন</p>
                  <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    v{result.currentVersion}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-center">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">সর্বশেষ ভার্সন</p>
                  <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
                    v{result.latestVersion}
                  </p>
                </div>
              </div>

              {/* Changelog list */}
              {result.versionInfo?.changelog && result.versionInfo.changelog.length > 0 && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-2">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    নতুন যা যা যুক্ত হয়েছে:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {result.versionInfo.changelog.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold text-xs mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  পরে
                </button>
                <button
                  type="button"
                  onClick={handleApplyUpdate}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  <DownloadCloud size={15} />
                  এখন আপডেট করুন
                </button>
              </div>
            </div>
          )}

          {/* Up to Date State */}
          {!checking && !updating && result?.status === 'up_to_date' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  আপনি সর্বশেষ ভার্সন ব্যবহার করছেন
                </h4>
                <p className="text-xs text-slate-500">
                  আপনার অ্যাপটি সম্পূর্ণ আপ-টু-ডেট রয়েছে।
                </p>
              </div>

              <div className="p-3 max-w-xs mx-auto bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Current Version</p>
                <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                  v{result.currentVersion}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  ঠিক আছে
                </button>
              </div>
            </div>
          )}

          {/* Error / Offline State */}
          {!checking && !updating && result?.status === 'error' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">আপডেট চেক করা যাচ্ছে না</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {result.errorMessage || 'ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।'}
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="button"
                  onClick={runCheck}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  পুনরায় চেষ্টা করুন
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-[9px] text-slate-400 font-medium">Smart Khulna App Engine • PWA & Web Platform</p>
        </div>
      </motion.div>
    </div>
  );
};
