/**
 * Referral Utility functions for Smart Khulna
 * Provides short 4-5 character codes, clean invite links, and rich Bengali share copy.
 */

export interface ReferralUserLike {
  uid?: string;
  referralCode?: string;
  name?: string;
}

/**
 * Derives or returns a clean, short 5-character referral code.
 * Example: For UID 'IOWcT3CZeXcwTRJCTbDXXpkgfb02' -> 'iowct'
 */
export const getShortReferralCode = (userOrUid?: string | ReferralUserLike | null): string => {
  if (!userOrUid) return 'khulna';
  
  if (typeof userOrUid === 'string') {
    const clean = userOrUid.replace(/[^a-zA-Z0-9]/g, '');
    return clean.slice(0, 5).toLowerCase() || 'khulna';
  }

  if (userOrUid.referralCode && userOrUid.referralCode.trim().length > 0) {
    return userOrUid.referralCode.trim().slice(0, 6).toLowerCase();
  }

  if (userOrUid.uid) {
    const clean = userOrUid.uid.replace(/[^a-zA-Z0-9]/g, '');
    return clean.slice(0, 5).toLowerCase() || 'khulna';
  }

  return 'khulna';
};

/**
 * Builds the canonical short invite link.
 * Example: https://smartkhulna.vercel.app/invite/iowct
 */
export const buildReferralLink = (codeOrUser?: string | ReferralUserLike | null): string => {
  const code = getShortReferralCode(codeOrUser);
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://smartkhulna.vercel.app';
  return `${origin}/invite/${code}`;
};

/**
 * 2-4 lines of engaging Bengali text introducing the Smart Khulna app.
 */
export const getShareDescription = (inviterName?: string): string => {
  const inviterIntro = inviterName
    ? `${inviterName}-এর আমন্ত্রণে যুক্ত হোন খুলনাবাসীর নিজস্ব ডিজিটাল প্ল্যাটফর্মে!`
    : 'যুক্ত হোন খুলনাবাসীর নিজস্ব ডিজিটাল প্ল্যাটফর্মে!';

  return `🇧🇩 স্মার্ট খুলনা (Smart Khulna) - নাগরিক সেবা এখন হাতের মুঠোয়!

জরুরি রক্তদাতা, বিশেষজ্ঞ ডাক্তার, অ্যাম্বুলেন্স, অক্সিজেন, শিক্ষা প্রতিষ্ঠান, হোটেল ও পর্যটন এবং খুলনা বিভাগের সকল জরুরি ও নাগরিক সেবার সহজ সমাধান এক প্ল্যাটফর্মেই। 

${inviterIntro}`;
};

/**
 * Full pre-composed message combining the app description and the referral link.
 */
export const getFullShareMessage = (codeOrUser?: string | ReferralUserLike | null, inviterName?: string): string => {
  const link = buildReferralLink(codeOrUser);
  const description = getShareDescription(inviterName);
  return `${description}\n👉 আজই অ্যাপে যুক্ত হতে ক্লিক করুন:\n${link}`;
};

/**
 * Share direct to social networks
 */
export type ShareChannel = 'whatsapp' | 'facebook' | 'telegram' | 'twitter' | 'native';

export const shareToChannel = async (
  channel: ShareChannel,
  codeOrUser?: string | ReferralUserLike | null,
  inviterName?: string
): Promise<boolean> => {
  const link = buildReferralLink(codeOrUser);
  const description = getShareDescription(inviterName);
  const fullMessage = getFullShareMessage(codeOrUser, inviterName);

  switch (channel) {
    case 'whatsapp': {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }

    case 'facebook': {
      // Facebook sharer handles link and quote parameter
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(description)}`;
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
      return true;
    }

    case 'telegram': {
      const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(description)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }

    case 'twitter': {
      const tweetText = `🇧🇩 স্মার্ট খুলনা - খুলনাবাসীর অল-ইন-ওয়ান ডিজিটাল সিটিজেন প্ল্যাটফর্ম! জরুরি রক্ত, ডাক্তার, অ্যাম্বুলেন্স ও সকল নাগরিক সেবা।`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(link)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }

    case 'native': {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: 'স্মার্ট খুলনা - ডিজিটাল সিটিজেন প্ল্যাটফর্ম',
            text: fullMessage,
            url: link
          });
          return true;
        } catch {
          // User cancelled or share failed
          return false;
        }
      }
      return false;
    }

    default:
      return false;
  }
};
