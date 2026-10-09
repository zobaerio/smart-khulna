import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronRight, Sparkles, Check, Users, Flame, Star, ShieldCheck, Info, X, Crown } from 'lucide-react';
import { BADGE_TIERS, BadgeTier, UserLevelProgress } from '../../utils/badgeLevels';
import { Language } from '../../utils/translations';
import confetti from 'canvas-confetti';

interface BadgeLevelProgressionCardProps {
  progress: UserLevelProgress;
  lang: Language;
  onViewAllTiers?: () => void;
  className?: string;
}

export const BadgeLevelProgressionCard: React.FC<BadgeLevelProgressionCardProps> = ({
  progress,
  lang,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);

  const isBn = lang === 'bn';
  const { currentTier, nextTier, progressPercent, referralsCount, streakCount } = progress;

  // Detect level increase and trigger confetti celebration
  useEffect(() => {
    try {
      const storedLevelStr = localStorage.getItem('smart_khulna_user_highest_level');
      const prevLevel = storedLevelStr ? parseInt(storedLevelStr, 10) : currentTier.level;

      if (currentTier.level > prevLevel) {
        // Level up detected!
        setCelebrationLevel(currentTier.level);
        setShowCelebrationBanner(true);
        localStorage.setItem('smart_khulna_user_highest_level', currentTier.level.toString());

        // Fire confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'],
        });

        const timer = setTimeout(() => {
          setShowCelebrationBanner(false);
        }, 6000);
        return () => clearTimeout(timer);
      } else if (!storedLevelStr) {
        localStorage.setItem('smart_khulna_user_highest_level', currentTier.level.toString());
      }
    } catch {
      // ignore storage issues
    }
  }, [currentTier.level]);

  return (
    <div className={`rounded-2xl border ${currentTier.borderColor} ${currentTier.bgGradient} p-4 sm:p-5 relative overflow-hidden shadow-xs ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      {/* Celebration Level-Up Banner */}
      <AnimatePresence>
        {showCelebrationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-between gap-3 relative z-20 border border-white/25"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0 animate-bounce">
                🎉
              </div>
              <div>
                <h4 className="text-xs font-black font-serif">
                  {isBn ? `অভিনন্দন! লেভেল ${celebrationLevel} এ উন্নীত হয়েছেন!` : `Congratulations! Promoted to Level ${celebrationLevel}!`}
                </h4>
                <p className="text-[10px] text-amber-100">
                  {isBn ? 'আপনার অবদানের স্বীকৃতিস্বরূপ নতুন ব্যাজ ও সুযোগ আনলক হয়েছে।' : 'New civic privileges and tier badge unlocked.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCelebrationBanner(false)}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Level & Badge Icon */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-2xl shadow-sm shrink-0">
            <span>{currentTier.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                {isBn ? `লেভেল ${currentTier.level}` : `Level ${currentTier.level}`}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                {isBn ? 'নাগরিক ব্যাজ' : 'Civic Tier'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {isBn ? currentTier.nameBn : currentTier.nameEn}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-white/80 dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>{isBn ? 'সকল লেভেল' : 'All Levels'}</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 font-serif leading-relaxed relative z-10">
        {isBn ? currentTier.descriptionBn : currentTier.descriptionEn}
      </p>

      {/* Alternative Rule Callout for 7-day streak or 10 invites */}
      <div className="mt-3 p-2.5 rounded-xl bg-white/85 dark:bg-slate-900/85 border border-emerald-500/20 text-xs relative z-10">
        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <Flame size={13} className="text-amber-500" />
            <span>{isBn ? 'স্ট্রিক অথবা ১০ আমন্ত্রণ বিকল্প শর্ত:' : 'Streak or 10 Invites Rule:'}</span>
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
            {referralsCount >= 10 
              ? (isBn ? '✅ ১০ আমন্ত্রণ সম্পন্ন!' : '✅ 10 Invites Completed!') 
              : streakCount >= 7 
              ? (isBn ? '✅ ৭ দিন স্ট্রিক সম্পন্ন!' : '✅ 7-Day Streak Completed!') 
              : (isBn ? `আমন্ত্রণ: ${referralsCount}/১০ বা স্ট্রিক: ${streakCount}/৭` : `Invites: ${referralsCount}/10 or Streak: ${streakCount}/7`)}
          </span>
        </div>
        <p className="text-[10.5px] text-slate-500 leading-normal">
          {isBn
            ? 'টানা ৭ দিন পোস্ট করতে না পারলে কোনো সমস্যা নেই—সেক্ষেত্রে ৫+৫=১০ জন নাগরিককে আমন্ত্রণ করলেই ভেরিফিকেশন ও গোল্ড লেভেল আনলক হবে!'
            : 'If you cannot post for 7 consecutive days, no problem—inviting 5+5=10 people will automatically satisfy the requirement!'}
        </p>
      </div>

      {/* Progress Bar to Next Tier */}
      {nextTier ? (
        <div className="mt-3.5 space-y-1.5 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>{isBn ? 'পরবর্তী পদবী:' : 'Next Tier:'}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                {nextTier.icon} {isBn ? nextTier.nameBn : nextTier.nameEn} (Lvl {nextTier.level})
              </span>
            </span>
            <span className="text-[11px] font-black text-emerald-600 font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-serif">
            <span>{isBn ? `বর্তমান সফল আমন্ত্রণ: ${referralsCount} জন` : `Current Successful Invites: ${referralsCount}`}</span>
            <span>{isBn ? `লক্ষ্য: ${nextTier.minReferrals} জন` : `Target: ${nextTier.minReferrals}`}</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-xs font-bold text-amber-700 dark:text-amber-400">
          👑 {isBn ? 'আপনি সর্বোচ্চ ডায়মন্ড অ্যাম্বাসেডর স্তরে পৌঁছে গেছেন!' : 'You have reached the maximum Diamond Ambassador Tier!'}
        </div>
      )}

      {/* Modal Showing All 5 Badge Tiers & Rules */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {isBn ? 'স্মার্ট খুলনা ব্যাজ ও লেভেল সিস্টেম' : 'Smart Khulna Badges & Level System'}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {isBn ? 'অবদান রাখুন ও পর্যায়ক্রমে উচ্চতর পদবী অর্জন করুন' : 'Contribute and unlock progressive civic ranks'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body - 5 Tiers List */}
              <div className="p-4 overflow-y-auto space-y-3.5 divide-y divide-slate-100 dark:divide-slate-850">
                {BADGE_TIERS.map((tier) => {
                  const isCurrent = tier.level === currentTier.level;
                  const isUnlocked = tier.level <= currentTier.level;

                  return (
                    <div key={tier.id} className="pt-3.5 first:pt-0">
                      <div className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs' 
                          : isUnlocked 
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40' 
                          : 'border-dashed border-slate-200 dark:border-slate-800 opacity-80'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{tier.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                  {isBn ? tier.nameBn : tier.nameEn}
                                </h4>
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  Lvl {tier.level}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {isBn ? tier.descriptionBn : tier.descriptionEn}
                              </p>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-600 text-white'
                              : isUnlocked
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {isCurrent
                              ? (isBn ? 'বর্তমান লেভেল' : 'Current')
                              : isUnlocked
                              ? (isBn ? '✅ আনলকড' : 'Unlocked')
                              : (isBn ? '🔒 লকড' : 'Locked')}
                          </span>
                        </div>

                        {/* Perks */}
                        <div className="mt-2.5 space-y-1 bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl text-[10px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                            {isBn ? 'সুবিধাসমূহ:' : 'Perks:'}
                          </span>
                          {(isBn ? tier.perksBn : tier.perksEn).map((perk, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                              <Check size={11} className="text-emerald-600 shrink-0" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>

                        {/* Special Note for Level 3 */}
                        {tier.level === 3 && (
                          <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-800 dark:text-amber-300">
                            <strong>{isBn ? 'বিশেষ বিকল্প রুল:' : 'Special Alternative Rule:'}</strong>{' '}
                            {isBn
                              ? 'টানা ৭ দিন পোস্ট করতে না পারলে কোনো সমস্যা নেই, ৫+৫=১০ জন নাগরিককে আমন্ত্রণ করলেই এই লেভেল ও ভেরিফাইড টিক চিহ্ন আনলক হয়ে যাবে!'
                              : 'Unable to post for 7 straight days? No problem! Inviting 5+5=10 people completely qualifies you for this rank and the verified tick mark!'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {isBn ? 'ঠিক আছে' : 'Got it'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeLevelProgressionCard;
