import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Crown, 
  Award, 
  Users, 
  Sparkles, 
  ChevronRight, 
  Flame, 
  CheckCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { SmartKhulnaVerifiedBadge } from './SmartKhulnaVerifiedBadge';
import { getShortReferralCode } from '../../utils/referral';

export interface LeaderboardUser {
  uid: string;
  name: string;
  avatar?: string;
  district?: string;
  referralsCount: number;
  verification_status?: string;
  badge?: string;
}

interface TopReferrersLeaderboardProps {
  currentUserUid?: string;
  onUserClick?: (uid: string) => void;
  className?: string;
}

export const TopReferrersLeaderboard: React.FC<TopReferrersLeaderboardProps> = ({
  currentUserUid,
  onUserClick,
  className = ''
}) => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // 1. Fetch all referrals to aggregate counts
        const refSnap = await getDocs(collection(db, 'referrals'));
        const countsByReferrer: Record<string, number> = {};

        refSnap.docs.forEach(docSnap => {
          const data = docSnap.data();
          const refKey = data.referrerUid || data.referrerCode;
          if (refKey && refKey !== 'guest') {
            countsByReferrer[refKey] = (countsByReferrer[refKey] || 0) + 1;
          }
        });

        // 2. Fetch profiles to resolve names and avatars
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        const userMap = new Map<string, any>();
        const codeToProfileMap = new Map<string, any>();

        profilesSnap.docs.forEach(d => {
          const data = d.data();
          const uid = d.id;
          const shortCode = data.referralCode || getShortReferralCode(uid);
          userMap.set(uid, { uid, ...data });
          if (shortCode) {
            codeToProfileMap.set(shortCode.toLowerCase(), { uid, ...data });
          }
        });

        // 3. Consolidate aggregated counts
        const aggregatedLeaders = new Map<string, LeaderboardUser>();

        // First process counts from 'referrals' collection
        for (const [key, count] of Object.entries(countsByReferrer)) {
          let userProfile = userMap.get(key) || codeToProfileMap.get(key.toLowerCase());
          const uid = userProfile?.uid || key;

          if (aggregatedLeaders.has(uid)) {
            const existing = aggregatedLeaders.get(uid)!;
            existing.referralsCount += count;
          } else {
            aggregatedLeaders.set(uid, {
              uid,
              name: userProfile?.name || 'খুলনা নাগরিক',
              avatar: userProfile?.avatar || '',
              district: userProfile?.district || userProfile?.selectedDistrict || 'খুলনা',
              referralsCount: count,
              verification_status: userProfile?.verification_status || 'unverified',
              badge: userProfile?.badge
            });
          }
        }

        // Also check if any profiles have explicitly stored referralsCount or total_referrals
        profilesSnap.docs.forEach(d => {
          const data = d.data();
          const explicitCount = data.referralsCount || data.total_referrals || 0;
          if (explicitCount > 0) {
            if (aggregatedLeaders.has(d.id)) {
              const existing = aggregatedLeaders.get(d.id)!;
              existing.referralsCount = Math.max(existing.referralsCount, explicitCount);
            } else {
              aggregatedLeaders.set(d.id, {
                uid: d.id,
                name: data.name || 'খুলনা নাগরিক',
                avatar: data.avatar || '',
                district: data.district || data.selectedDistrict || 'খুলনা',
                referralsCount: explicitCount,
                verification_status: data.verification_status || 'unverified',
                badge: data.badge
              });
            }
          }
        });

        // Convert to array and sort descending
        let sortedLeaders = Array.from(aggregatedLeaders.values())
          .sort((a, b) => b.referralsCount - a.referralsCount);

        // If very few referrals yet, provide simulated top ambassadors as inspiration
        if (sortedLeaders.length === 0) {
          sortedLeaders = [
            {
              uid: 'demo_1',
              name: 'তাহমিদ আহমেদ',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
              district: 'খুলনা সদর',
              referralsCount: 18,
              verification_status: 'verified'
            },
            {
              uid: 'demo_2',
              name: 'সাদিয়া তাসনিম',
              avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
              district: 'যশোর',
              referralsCount: 12,
              verification_status: 'verified'
            },
            {
              uid: 'demo_3',
              name: 'রাকিবুল হাসান',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
              district: 'কুষ্টিয়া',
              referralsCount: 9,
              verification_status: 'unverified'
            }
          ];
        }

        setLeaders(sortedLeaders.slice(0, 10));
      } catch (err) {
        console.warn('Leaderboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-amber-500/10 border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400',
          crownColor: 'text-amber-500 fill-amber-400',
          label: '১ম স্থান',
          borderAccent: 'border-amber-400 dark:border-amber-500'
        };
      case 2:
        return {
          bg: 'bg-slate-200/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300',
          crownColor: 'text-slate-400 fill-slate-300',
          label: '২য় স্থান',
          borderAccent: 'border-slate-300 dark:border-slate-600'
        };
      case 3:
        return {
          bg: 'bg-amber-700/10 border-amber-600/30 text-amber-800 dark:text-amber-500',
          crownColor: 'text-amber-700 fill-amber-600/70',
          label: '৩য় স্থান',
          borderAccent: 'border-amber-600/40'
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500',
          crownColor: '',
          label: `${rank}তম`,
          borderAccent: ''
        };
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            <Trophy size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>শীর্ষ রেফারার লিডারবোর্ড</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Top Referrers
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-serif">
              খুলনাবাসীকে প্ল্যাটফর্মে যুক্ত করায় সক্রিয় নাগরিক দূতগণ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <Sparkles size={13} />
          <span>র‍্যাঙ্কিং</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 animate-pulse font-serif">
          লিডারবোর্ড তথ্য লোড হচ্ছে...
        </div>
      ) : leaders.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 font-serif">
          এখনও কোনো রেফারেল ডাটা নেই। আপনার বন্ধুদের আমন্ত্রণ করে প্রথম স্থান অর্জন করুন!
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.map((user, idx) => {
            const rank = idx + 1;
            const rankInfo = getRankBadge(rank);
            const isCurrentUser = user.uid === currentUserUid;

            return (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => onUserClick && onUserClick(user.uid)}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                  isCurrentUser
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20'
                    : rank <= 3
                    ? `${rankInfo.bg} ${rankInfo.borderAccent}`
                    : 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div className="relative shrink-0 flex items-center justify-center w-7 h-7">
                    {rank <= 3 ? (
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="absolute -top-2.5 -right-1"
                      >
                        <Crown size={15} className={rankInfo.crownColor} />
                      </motion.div>
                    ) : null}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      rank === 1 ? 'bg-amber-500 text-white shadow-xs' :
                      rank === 2 ? 'bg-slate-400 text-white' :
                      rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0) || 'U'}
                      </div>
                    )}
                    {user.verification_status === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 scale-90">
                        <SmartKhulnaVerifiedBadge size={14} />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-sm bg-emerald-600 text-white shrink-0">
                          আপনি
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-serif truncate block">
                      📍 {user.district || 'খুলনা বিভাগ'}
                    </span>
                  </div>
                </div>

                {/* Right: Referral Count */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-mono font-extrabold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                      <Users size={12} className="text-emerald-500" />
                      <span>{user.referralsCount}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-serif">
                      জন নাগরিক
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
