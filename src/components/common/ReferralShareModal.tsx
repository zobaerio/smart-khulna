import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  CheckCircle, 
  MessageCircle, 
  Globe, 
  Send, 
  Smartphone, 
  Sparkles 
} from 'lucide-react';
import { 
  buildReferralLink, 
  getFullShareMessage, 
  getShareDescription, 
  getShortReferralCode, 
  ReferralUserLike, 
  shareToChannel 
} from '../../utils/referral';

interface ReferralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ReferralUserLike;
  inviterName?: string;
}

export const ReferralShareModal: React.FC<ReferralShareModalProps> = ({
  isOpen,
  onClose,
  user,
  inviterName
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const shortCode = getShortReferralCode(user);
  const link = buildReferralLink(user);
  const description = getShareDescription(inviterName || user.name);
  const fullMessage = getFullShareMessage(user, inviterName || user.name);
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyFullMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSocialShare = async (channel: 'whatsapp' | 'facebook' | 'telegram' | 'twitter' | 'native') => {
    await shareToChannel(channel, user, inviterName || user.name);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug">
                আমন্ত্রণ লিংক ও বিবরণ শেয়ার
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ফেসবুক, হোয়াটসঅ্যাপে অ্যাপের বিবরণসহ বন্ধুদের পাঠান
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Short Link Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" />
                সংক্ষিপ্ত রেফারেল লিংক
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                কোড: {shortCode}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <input 
                type="text" 
                readOnly 
                value={link}
                className="bg-transparent border-0 px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 flex-1 font-mono outline-none select-all truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                {copiedLink ? <CheckCircle size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'কপিড' : 'লিংক কপি'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              সরাসরি সোশ্যাল মিডিয়ায় শেয়ার করুন (বিবরণসহ):
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 transition active:scale-[0.98] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle size={18} />
                </div>
                <div className="text-left overflow-hidden">
                  <div className="text-xs font-bold">WhatsApp</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">হোয়াটসঅ্যাপে পাঠান</div>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 transition active:scale-[0.98] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Globe size={18} />
                </div>
                <div className="text-left overflow-hidden">
                  <div className="text-xs font-bold">Facebook</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">ফেসবুকে পোস্ট করুন</div>
                </div>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleSocialShare('telegram')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 transition active:scale-[0.98] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0088cc] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Send size={18} />
                </div>
                <div className="text-left overflow-hidden">
                  <div className="text-xs font-bold">Telegram</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">টেলিগ্রামে পাঠান</div>
                </div>
              </button>

              {/* Twitter / X */}
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition active:scale-[0.98] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs">
                  𝕏
                </div>
                <div className="text-left overflow-hidden">
                  <div className="text-xs font-bold">X (Twitter)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">টুইটে পোস্ট করুন</div>
                </div>
              </button>
            </div>

            {/* Native Mobile Share if supported */}
            {hasNativeShare && (
              <button
                onClick={() => handleSocialShare('native')}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition active:scale-[0.98] cursor-pointer mt-1"
              >
                <Smartphone size={16} className="text-emerald-600" />
                <span>ফোনের অন্যান্য অ্যাপে সরাসরি শেয়ার করুন</span>
              </button>
            )}
          </div>

          {/* Message Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                মেসেজ প্রিভিউ (লিংকের সাথে এই লেখা শেয়ার হবে):
              </span>
              <button
                onClick={handleCopyFullMessage}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedMessage ? <CheckCircle size={12} /> : <Copy size={12} />}
                <span>{copiedMessage ? 'সম্পূর্ণ বার্তা কপিড!' : 'বার্তাটি কপি করুন'}</span>
              </button>
            </div>
            
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300 font-serif leading-relaxed whitespace-pre-line select-text">
              {description}
              {'\n'}
              <span className="font-mono text-emerald-800 dark:text-emerald-300 font-bold block mt-1">
                👉 আজই অ্যাপে যুক্ত হতে ক্লিক করুন: {link}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyFullMessage}
            className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedMessage ? <CheckCircle size={15} /> : <Copy size={15} />}
            <span>{copiedMessage ? 'সম্পূর্ণ বার্তা কপি করা হয়েছে!' : 'সম্পূর্ণ বার্তা ও লিংক কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
