import { Language } from './translations';
import { PublicUserProfile } from '../types/community';

export interface BadgeTier {
  level: number;
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  badgeTextColor: string;
  descriptionBn: string;
  descriptionEn: string;
  perksBn: string[];
  perksEn: string[];
  minReferrals: number;
  minPosts: number;
  minServices: number;
  alternativeRequirementBn?: string;
  alternativeRequirementEn?: string;
}

export const BADGE_TIERS: BadgeTier[] = [
  {
    level: 1,
    id: 'bronze_citizen',
    nameBn: 'ব্রোঞ্জ নাগরিক',
    nameEn: 'Bronze Citizen',
    icon: '🥉',
    color: 'from-amber-700 to-amber-900',
    bgGradient: 'bg-gradient-to-r from-amber-900/10 via-amber-700/10 to-amber-900/10',
    borderColor: 'border-amber-700/40',
    badgeTextColor: 'text-amber-800 dark:text-amber-300',
    descriptionBn: 'প্রাথমিক নাগরিক স্তর - প্ল্যাটফর্মে যোগদান ও প্রোফাইল সম্পন্নকরণ।',
    descriptionEn: 'Starter Citizen Level - Joined platform and completed civic profile.',
    perksBn: ['কমিউনিটিতে পোস্ট ও মন্তব্য করার অধিকার', 'ব্রোঞ্জ নাগরিক পরিচয় ব্যাজ', 'নাগরিক সেবা ডিরেক্টরি ব্যবহার'],
    perksEn: ['Create community posts & comments', 'Bronze Citizen badge', 'Access civic service directory'],
    minReferrals: 1,
    minPosts: 1,
    minServices: 0,
  },
  {
    level: 2,
    id: 'silver_contributor',
    nameBn: 'সিলভার কন্ট্রিবিউটর',
    nameEn: 'Silver Contributor',
    icon: '🥈',
    color: 'from-slate-400 to-slate-600',
    bgGradient: 'bg-gradient-to-r from-slate-400/10 via-slate-500/10 to-slate-400/10',
    borderColor: 'border-slate-400/40',
    badgeTextColor: 'text-slate-800 dark:text-slate-200',
    descriptionBn: 'সক্রিয় কন্ট্রিবিউটর - অন্তত ৩ জন বন্ধুকে আমন্ত্রণ বা ৫টি তথ্যবহুল পোস্ট।',
    descriptionEn: 'Active Contributor - Invited at least 3 citizens or shared 5 informative posts.',
    perksBn: ['সিলভার ব্যাজ ও উচ্চতর বিশ্বাসযোগ্যতা', '১টি নতুন স্থানীয় সেবা ডিরেক্টরিতে অ্যাড করার বিশেষ সুবিধা', 'পোস্টে সিলভার কন্ট্রিবিউটর হাইলাইট'],
    perksEn: ['Silver badge & higher credibility', 'Contribute local directory entries', 'Highlighted post author styling'],
    minReferrals: 3,
    minPosts: 5,
    minServices: 1,
    alternativeRequirementBn: '৩ জন আমন্ত্রণ অথবা ৫টি পোস্ট এবং ১টি সেবা সংযোজন',
    alternativeRequirementEn: '3 invites or 5 posts, plus 1 local service',
  },
  {
    level: 3,
    id: 'gold_leader',
    nameBn: 'গোল্ড কমিউনিটি লিডার',
    nameEn: 'Gold Community Leader',
    icon: '🥇',
    color: 'from-amber-400 to-yellow-600',
    bgGradient: 'bg-gradient-to-r from-amber-400/15 via-yellow-500/15 to-amber-500/15',
    borderColor: 'border-amber-400/50',
    badgeTextColor: 'text-amber-700 dark:text-amber-300',
    descriptionBn: 'কমিউনিটি লিডার - টানা ৭ দিন পোস্ট স্ট্রিক অথবা ৫+৫=১০ জন নাগরিককে আমন্ত্রণ!',
    descriptionEn: 'Community Leader - 7-day post streak OR 10 total citizen invites!',
    perksBn: ['স্মার্ট খুলনা অফিসিয়াল ভেরিফাইড টিক চিহ্ন (✅)', 'গোল্ড লিডার ব্যাজ প্রদর্শন', 'কমিউনিটি আলোচনা মডারেশন প্রাধান্য', 'টপ রেফারার লিডারবোর্ডে দৃশ্যমানতা'],
    perksEn: ['Official Smart Khulna Verified Tick (✅)', 'Gold Leader Badge styling', 'Community moderation priority', 'Top Referrers leaderboard visibility'],
    minReferrals: 10,
    minPosts: 7,
    minServices: 3,
    alternativeRequirementBn: 'টানা ৭ দিন ১টি করে পোস্ট অথবা মোট ১০ জন নাগরিক আমন্ত্রণ (৫+৫=১০ জন)',
    alternativeRequirementEn: '7-day daily streak OR 10 total citizen invites (5+5=10)',
  },
  {
    level: 4,
    id: 'platinum_champion',
    nameBn: 'প্লাটিনাম চ্যাম্পিয়ন',
    nameEn: 'Platinum Champion',
    icon: '💎',
    color: 'from-cyan-400 to-blue-600',
    bgGradient: 'bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-indigo-500/15',
    borderColor: 'border-cyan-400/50',
    badgeTextColor: 'text-cyan-700 dark:text-cyan-300',
    descriptionBn: 'প্লাটিনাম চ্যাম্পিয়ন - ২৫+ সফল আমন্ত্রণ ও সক্রিয় অবদানকারী নাগরিক।',
    descriptionEn: 'Platinum Champion - 25+ successful invites & active civic champion.',
    perksBn: ['ঝলমলে প্ল্যাটিনাম ক্রাউন ব্যাজ', 'বিশেষ কমিউনিটি পিন করার সুযোগ', 'অ্যাডমিন মডারেশন প্যানেল নমিনেশন সুবিধা', 'খুলনা বিভাগীয় নাগরিক সম্মাননা'],
    perksEn: ['Sparkling Platinum Crown badge', 'Ability to request pinned announcements', 'Moderation panel nomination', 'Khulna Civic Recognition'],
    minReferrals: 25,
    minPosts: 15,
    minServices: 5,
  },
  {
    level: 5,
    id: 'diamond_ambassador',
    nameBn: 'ডায়মন্ড অ্যাম্বাসেডর',
    nameEn: 'Diamond Ambassador',
    icon: '👑',
    color: 'from-purple-500 via-pink-500 to-amber-400',
    bgGradient: 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-400/20',
    borderColor: 'border-purple-400/60',
    badgeTextColor: 'text-purple-700 dark:text-pink-300',
    descriptionBn: 'স্মার্ট খুলনা সর্বোচ্চ পদবী - ৫০+ সফল রেফারেল ও শীর্ষ নাগরিক অ্যাম্বাসেডর।',
    descriptionEn: 'Smart Khulna Highest Honor - 50+ successful invites & top civic ambassador.',
    perksBn: ['কিংবদন্তি ডায়মন্ড ক্রাউন অ্যানিমেশন ব্যাজ', 'স্মার্ট খুলনা ডিজিটাল অ্যাম্বাসেডর স্বীকৃতি', 'সরাসরি সিটিজেন অ্যাডভাইজরি বোর্ডে প্রবেশাধিকার', 'সর্বোচ্চ অগ্রাধিকার সেবা'],
    perksEn: ['Legendary Animated Diamond Crown Badge', 'Smart Khulna Digital Ambassador Recognition', 'Citizen Advisory Board Access', 'Highest priority civic assistance'],
    minReferrals: 50,
    minPosts: 30,
    minServices: 10,
  },
];

export interface UserLevelProgress {
  currentTier: BadgeTier;
  nextTier: BadgeTier | null;
  progressPercent: number;
  totalPoints: number;
  referralsCount: number;
  postsCount: number;
  servicesCount: number;
  streakCount: number;
  isEligibleForVerifiedTick: boolean;
  alternativeUsedForLevel3: boolean;
  unlockedTiers: BadgeTier[];
}

export function calculateUserBadgeLevel(
  profile: Partial<PublicUserProfile> | null | undefined,
  stats?: {
    referralsCount?: number;
    postsCount?: number;
    servicesCount?: number;
    streakCount?: number;
  }
): UserLevelProgress {
  const referrals = Math.max(
    profile?.total_referrals || 0,
    profile?.referralsCount || 0,
    stats?.referralsCount || 0
  );
  const posts = Math.max(profile?.postsCount || 0, stats?.postsCount || 0);
  const services = stats?.servicesCount || 0;
  const streak = stats?.streakCount || 0;

  // Streak or 10 invites alternative rule for Level 3 / Verified:
  const satisfiesStreakOrTenInvites = streak >= 7 || referrals >= 10;
  const isAltUsedForLevel3 = referrals >= 10 && streak < 7;

  let currentTierIndex = 0; // Starts at Bronze Citizen

  // Check Level 2:
  if ((referrals >= 3 || posts >= 5) && (services >= 1 || posts >= 3 || referrals >= 2)) {
    currentTierIndex = 1;
  }

  // Check Level 3:
  // Either 10+ referrals OR (7-day streak + 5 invites), plus basic posting/services
  if (
    (referrals >= 10 || (streak >= 7 && referrals >= 5)) &&
    (posts >= 3 || referrals >= 5)
  ) {
    currentTierIndex = 2;
  }

  // Check Level 4:
  if (referrals >= 25 && posts >= 10) {
    currentTierIndex = 3;
  }

  // Check Level 5:
  if (referrals >= 50 && posts >= 20) {
    currentTierIndex = 4;
  }

  const currentTier = BADGE_TIERS[currentTierIndex];
  const nextTier = currentTierIndex < BADGE_TIERS.length - 1 ? BADGE_TIERS[currentTierIndex + 1] : null;

  // Calculate progress toward next tier:
  let progressPercent = 100;
  if (nextTier) {
    const targetRefs = nextTier.minReferrals;
    const refProgress = Math.min(100, Math.round((referrals / targetRefs) * 100));
    const targetPosts = nextTier.minPosts;
    const postProgress = Math.min(100, Math.round((posts / targetPosts) * 100));
    progressPercent = Math.min(100, Math.max(10, Math.round((refProgress * 0.7) + (postProgress * 0.3))));
  }

  const unlockedTiers = BADGE_TIERS.slice(0, currentTierIndex + 1);

  return {
    currentTier,
    nextTier,
    progressPercent,
    totalPoints: (referrals * 10) + (posts * 5) + (services * 15),
    referralsCount: referrals,
    postsCount: posts,
    servicesCount: services,
    streakCount: streak,
    isEligibleForVerifiedTick: satisfiesStreakOrTenInvites && referrals >= 5,
    alternativeUsedForLevel3: isAltUsedForLevel3,
    unlockedTiers,
  };
}
