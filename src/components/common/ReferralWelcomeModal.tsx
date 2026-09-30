import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  Copy, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Share2, 
  Building2, 
  Activity,
  Users,
  X
} from 'lucide-react';
import { SmartKhulnaVerifiedBadge } from './SmartKhulnaVerifiedBadge';

export interface InviterDetails {
  uid: string;
  name: string;
  avatar?: string;
  district?: string;
  upazila?: string;
  profession?: string;
  isVerified?: boolean;
}

interface ReferralWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  inviter?: InviterDetails | null;
  currentUser?: any;
  onOpenAuth: () => void;
}

export const ReferralWelcomeModal: React.FC<ReferralWelcomeModalProps> = ({
  isOpen,
  onClose,
  referralCode,
  inviter,
  currentUser,
  onOpenAuth
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const inviterName = inviter?.name || 'একজন সম্মানিত খুলনাবাসী';
  const isSelf = currentUser && inviter?.uid && currentUser.uid === inviter.uid;

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleGetStarted = () => {
    onClose();
    if (!currentUser) {
      onOpenAuth();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Banner */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-7 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
              <Sparkles size={12} className="text-yellow-300" />
              <span>আমন্ত্রণ বার্তা (Invitation)</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-serif leading-tight">
            স্বাগতম খুলনাবাসীর নিজস্ব ডিজিটাল প্ল্যাটফর্মে!
          </h2>
          <p className="text-xs text-emerald-100/90 font-serif mt-1.5 leading-relaxed">
            স্মার্ট খুলনা - বিভাগের ১০টি জেলার জরুরি রক্ত, ডাক্তার, অ্যাম্বুলেন্স ও সকল নাগরিক সেবার সহজ সমাধান।
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Inviter Card */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3.5">
            <img 
              src={inviter?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={inviterName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif truncate">
                  {inviterName}
                </h4>
                {inviter?.isVerified && <SmartKhulnaVerifiedBadge size={15} />}
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                আপনাকে অ্যাপে যুক্ত হওয়ার জন্য আমন্ত্রণ জানিয়েছেন!
              </p>
              {(inviter?.district || inviter?.upazila) && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} />
                  <span>{inviter.upazila ? `${inviter.upazila}, ` : ''}{inviter.district || 'খুলনা'}</span>
                  {inviter?.profession && <span>· {inviter.profession}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                রেফারেল কোড (Referral Code)
              </span>
              <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400">
                {referralCode || 'khulna'}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedCode ? <CheckCircle size={14} /> : <Copy size={14} />}
              <span>{copiedCode ? 'কপিড!' : 'কোড কপি'}</span>
            </button>
          </div>

          {/* What they get */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              স্মার্ট খুলনায় আপনি যা যা পাবেন:
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <Heart size={16} className="text-rose-600 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">জরুরি রক্তদাতা ও অ্যাম্বুলেন্স</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <Activity size={16} className="text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">ডাক্তার ও হাসপাতাল সেবা</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">১০ জেলার নাগরিক ডিরেক্টরি</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-600 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">ভেরিফাইড সিটিজেন সুবিধা</span>
              </div>
            </div>
          </div>

          {/* Status info */}
          {isSelf ? (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center text-xs text-amber-800 dark:text-amber-300 font-bold">
              ℹ️ এটি আপনার নিজস্ব রেফারেল আমন্ত্রণ লিংক। বন্ধুদের সাথে এটি শেয়ার করতে পারেন।
            </div>
          ) : currentUser ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              ✅ আপনি ইতোমধ্যে একাউন্টে লগইন আছেন। আপনার ইনভাইটেশন রেকর্ড সংযুক্ত করা হয়েছে।
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer text-center"
          >
            অ্যাপ ঘুরে দেখুন
          </button>
          
          <button
            onClick={handleGetStarted}
            className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-800/25 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {currentUser ? (
              <>
                <span>হোমপেজে এগিয়ে যান</span>
                <ArrowRight size={15} />
              </>
            ) : (
              <>
                <UserPlus size={15} />
                <span>একাউন্ট তৈরি / লগইন করুন</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralWelcomeModal;
