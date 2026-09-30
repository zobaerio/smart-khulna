import React, { useState, useEffect } from 'react';
import { 
  Award, CheckCircle, Clock, Copy, ExternalLink, HelpCircle, 
  ArrowRight, ShieldCheck, UserCheck, Users, Calendar, 
  BookOpen, HeartPulse, Sparkles, Loader2, RefreshCw, Share2
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { UserProfile } from '../../dbData';
import { SmartKhulnaVerifiedBadge } from '../common/SmartKhulnaVerifiedBadge';
import { ReferralShareModal } from '../common/ReferralShareModal';
import { buildReferralLink, getShortReferralCode } from '../../utils/referral';

interface GetVerifiedSectionProps {
  currentUserProfile: UserProfile;
  onStatusUpdated?: (newStatus: string) => void;
}

export const GetVerifiedSection: React.FC<GetVerifiedSectionProps> = ({ 
  currentUserProfile,
  onStatusUpdated 
}) => {
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Dynamic progress metrics
  const [profilePercent, setProfilePercent] = useState(0);
  const [invitesCount, setInvitesCount] = useState(0);
  const [postingStreak, setPostingStreak] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [photoPostsCount, setPhotoPostsCount] = useState(0);
  const [emergencyPostsCount, setEmergencyPostsCount] = useState(0);
  const [behaviorValid, setBehaviorValid] = useState(true);

  // Short Invite Link
  const referralLink = buildReferralLink(currentUserProfile);

  const calculateProgressMetrics = async () => {
    setLoading(true);
    try {
      const uid = currentUserProfile.uid;

      // 1. Calculate Profile Completion
      const profileFields = [
        currentUserProfile.name,
        currentUserProfile.phone,
        currentUserProfile.avatar,
        currentUserProfile.bio,
        currentUserProfile.profession || currentUserProfile.workplace,
        currentUserProfile.district,
        currentUserProfile.upazila,
        currentUserProfile.hometown || currentUserProfile.address
      ];
      const completedFields = profileFields.filter(f => !!f).length;
      const computedProfilePercent = Math.round((completedFields / profileFields.length) * 100);
      setProfilePercent(computedProfilePercent);

      // 2. Fetch Invites Count from Firestore 'referrals' collection
      const refQuery = query(collection(db, 'referrals'), where('referrerUid', '==', uid));
      const refSnap = await getDocs(refQuery);
      setInvitesCount(refSnap.size);

      // 3. Fetch user's community posts for Streak & Photo Posts & Emergency Posts
      const postsQuery = query(collection(db, 'posts'), where('authorId', '==', uid));
      const postsSnap = await getDocs(postsQuery);
      
      let streak = 0;
      let photoPosts = 0;
      let emergencyPosts = 0;

      if (!postsSnap.empty) {
        const postsList = postsSnap.docs.map(d => d.data());
        
        // Count Photo Posts
        photoPosts = postsList.filter(p => p.images && p.images.length > 0).length;

        // Count Emergency Posts
        emergencyPosts = postsList.filter(p => p.type === 'emergency' || p.category_id === 'emergency').length;

        // Calculate consecutive posting days in Asia/Dhaka timezone
        const uniqueDates = Array.from(new Set(
          postsList.map(p => {
            const dateStr = p.createdAt || p.joinedDate || new Date().toISOString();
            // Convert to simple local date YYYY-MM-DD
            return dateStr.substring(0, 10);
          })
        )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending order (newest first)

        if (uniqueDates.length > 0) {
          streak = 1;
          let tempStreak = 1;
          const oneDay = 24 * 60 * 60 * 1000;

          for (let i = 0; i < uniqueDates.length - 1; i++) {
            const date1 = new Date(uniqueDates[i]);
            const date2 = new Date(uniqueDates[i + 1]);
            const diffTime = Math.abs(date1.getTime() - date2.getTime());
            
            // Check if the days are consecutive
            if (diffTime <= oneDay + (2 * 60 * 60 * 1000)) { // 1 day diff + tolerance for TZ variations
              tempStreak++;
              if (tempStreak > streak) {
                streak = tempStreak;
              }
            } else {
              tempStreak = 1;
            }
          }
        }
      }

      setPostingStreak(streak);
      setPhotoPostsCount(photoPosts);
      setEmergencyPostsCount(emergencyPosts);

      // 4. Fetch Services Count added by user
      const servicesQuery = query(collection(db, 'services'), where('created_by', '==', uid));
      const servicesSnap = await getDocs(servicesQuery);
      setServicesCount(servicesSnap.size);

      // 5. Community Behavior
      setBehaviorValid(!currentUserProfile.isBanned && currentUserProfile.status !== 'suspended');

    } catch (e) {
      console.warn("Error calculating verification progress:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateProgressMetrics();
  }, [currentUserProfile]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Requirements checklist checks
  const isProfileDone = profilePercent >= 100;
  const isInvitesDone = invitesCount >= 5;
  const isStreakDone = postingStreak >= 7;
  const isServicesDone = servicesCount >= 3;
  const isPhotoPostsDone = photoPostsCount >= 3;
  const isBehaviorDone = behaviorValid;

  const totalRequirements = 6;
  const completedCount = 
    (isProfileDone ? 1 : 0) +
    (isInvitesDone ? 1 : 0) +
    (isStreakDone ? 1 : 0) +
    (isServicesDone ? 1 : 0) +
    (isPhotoPostsDone ? 1 : 0) +
    (isBehaviorDone ? 1 : 0);

  const overallProgressPercent = Math.round((completedCount / totalRequirements) * 100);
  const isEligibleToApply = completedCount >= totalRequirements;

  const handleApply = async () => {
    if (!isEligibleToApply) return;
    setApplying(true);
    try {
      const userRef = doc(db, 'profiles', currentUserProfile.uid);
      await updateDoc(userRef, {
        verification_status: 'pending',
        verification_applied_at: new Date().toISOString()
      });
      if (onStatusUpdated) {
        onStatusUpdated('pending');
      }
    } catch (err) {
      console.error("Failed to submit verification application:", err);
      alert('আবেদন জমা দিতে সমস্যা হয়েছে। দয়া করে ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setApplying(false);
    }
  };

  const status = currentUserProfile.verification_status || 'unverified';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 max-w-2xl mx-auto">
      
      {/* Platform Branding */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#006A4E] to-[#F42A41] flex items-center justify-center text-white shrink-0 shadow-md">
          <Award size={24} className="animate-pulse" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
            <span>স্মার্ট ভেরিফিকেশন সিস্টেম</span>
            <SmartKhulnaVerifiedBadge size={16} />
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-500">ভেরিফাইড কন্ট্রিবিউটর মেম্বার ব্যাজ অর্জন করুন</p>
        </div>
        <button 
          onClick={calculateProgressMetrics}
          className="ml-auto p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 transition active:scale-95 cursor-pointer"
          title="রিফ্রেশ করুন"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
      </div>

      {/* Main Status Callouts */}
      {status === 'verified' ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
            <SmartKhulnaVerifiedBadge size={32} />
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#006A4E] dark:text-emerald-400 font-serif">অভিনন্দন! আপনি একজন ভেরিফাইড সদস্য</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            আপনার নামের পাশে এখন থেকে গৌরবময় <strong>"Smart Khulna Verified"</strong> ব্যাজটি দৃশ্যমান হবে। সমাজ ও খুলনা বিভাগের উন্নয়নে আপনার অবদানের জন্য ধন্যবাদ!
          </p>
        </div>
      ) : status === 'pending' ? (
        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/40 text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300 animate-pulse">
            <Clock size={20} />
          </div>
          <h3 className="font-bold text-sm text-amber-800 dark:text-amber-400 font-serif">আবেদন প্রক্রিয়াধীন রয়েছে (Under Review)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            আপনার ভেরিফিকেশন আবেদনটি সফলভাবে জমা হয়েছে। অ্যাডমিন প্যানেল থেকে আপনার অবদানসমূহ যাচাই করে দ্রুত চূড়ান্ত অনুমোদন দেওয়া হবে। অনুগ্রহ করে অপেক্ষা করুন।
          </p>
        </div>
      ) : status === 'suspended' ? (
        <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-800 dark:text-rose-300">
            <Award size={20} className="line-through" />
          </div>
          <h3 className="font-bold text-sm text-rose-800 dark:text-rose-400 font-serif">ভেরিফিকেশন সাময়িকভাবে স্থগিত (Suspended)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            নীতিমালা পরিপন্থী বা ভুল তথ্য আপলোডের কারণে আপনার ভেরিফাইড ব্যাজটি সাময়িকভাবে স্থগিত করা হয়েছে। সমাধানের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Progress Header */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">ভেরিফিকেশন প্রগ্রেস</span>
              <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                {overallProgressPercent}% সম্পন্ন
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#006A4E] to-[#F42A41] h-full rounded-full transition-all duration-500" 
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-serif mb-1">প্রয়োজনীয় কাজ ও শর্তাবলী (Checklist)</h3>
            
            {/* Profile Completed */}
            <div className="flex items-start justify-between text-xs gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{isProfileDone ? '✅' : '⏳'}</span>
                <div>
                  <h4 className={`font-bold ${isProfileDone ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>প্রোফাইল ১০০% সম্পন্ন করা</h4>
                  <p className="text-[10px] text-slate-500">নাম, ছবি, বায়ো, বাসস্থান, পেশা ও সামাজিক লিংক যুক্ত করুন।</p>
                </div>
              </div>
              <span className="font-bold text-[10px]">{profilePercent}%</span>
            </div>

            {/* Referral / Invites completed */}
            <div className="flex items-start justify-between text-xs gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{isInvitesDone ? '✅' : '⏳'}</span>
                <div>
                  <h4 className={`font-bold ${isInvitesDone ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>৫ জন সচল সদস্যকে আমন্ত্রণ (Invite)</h4>
                  <p className="text-[10px] text-slate-500">আপনার ইনভাইট লিংকের সাহায্যে অন্তত ৫ জনকে সফলভাবে রেজিস্টার করান।</p>
                </div>
              </div>
              <span className="font-bold text-[10px]">{invitesCount} / 5</span>
            </div>

            {/* 7-Day Posting challenge */}
            <div className="flex items-start justify-between text-xs gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{isStreakDone ? '✅' : '⏳'}</span>
                <div>
                  <h4 className={`font-bold ${isStreakDone ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>৭ দিন ধারাবাহিক পোস্ট করার চ্যালেঞ্জ</h4>
                  <p className="text-[10px] text-slate-500">টানা ৭ দিন প্রতিদিন অন্তত ১টি করে তথ্যপূর্ণ কমিউনিটি পোস্ট করুন।</p>
                </div>
              </div>
              <span className="font-bold text-[10px]">{postingStreak} / 7 দিন</span>
            </div>

            {/* Services Added */}
            <div className="flex items-start justify-between text-xs gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{isServicesDone ? '✅' : '⏳'}</span>
                <div>
                  <h4 className={`font-bold ${isServicesDone ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>৩টি দরকারি স্থানীয় তথ্য/সেবা যুক্ত করা</h4>
                  <p className="text-[10px] text-slate-500">ডিরেক্টরিতে অন্তত ৩টি কার্যকর স্থানীয় ক্লিনিক, স্কুল বা সরকারি তথ্য অ্যাড করুন।</p>
                </div>
              </div>
              <span className="font-bold text-[10px]">{servicesCount} / 3</span>
            </div>

            {/* Photo posts */}
            <div className="flex items-start justify-between text-xs gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{isPhotoPostsDone ? '✅' : '⏳'}</span>
                <div>
                  <h4 className={`font-bold ${isPhotoPostsDone ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>৩টি ছবিযুক্ত চমৎকার তথ্য পোস্ট</h4>
                  <p className="text-[10px] text-slate-500">কমিউনিটি ফিডে অন্তত ৩টি আকর্ষণীয় ছবি সহ পোস্ট করুন।</p>
                </div>
              </div>
              <span className="font-bold text-[10px]">{photoPostsCount} / 3</span>
            </div>

            {/* Behavior status */}
            <div className="flex items-start justify-between text-xs gap-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5">{isBehaviorDone ? '✅' : '⏳'}</span>
                <div>
                  <h4 className={`font-bold ${isBehaviorDone ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>নিয়মশৃঙ্খলা ও উত্তম আচরণ</h4>
                  <p className="text-[10px] text-slate-500">কোনো রিপোর্ট বা স্প্যামিং রেকর্ড থাকতে পারবে না।</p>
                </div>
              </div>
              <span className="font-bold text-[10px] text-emerald-600">{isBehaviorDone ? 'সঠিক' : 'অচল'}</span>
            </div>

          </div>

          {/* Invitation Link Box */}
          <div className="bg-[#006A4E]/5 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-500/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#006A4E] dark:text-emerald-400 font-serif flex items-center gap-1.5">
                <Users size={14} />
                <span>আপনার রেফারেলে সদস্য আমন্ত্রণ লিংক</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                কোড: {getShortReferralCode(currentUserProfile)}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">নতুন সদস্যদের এই লিংক দিয়ে যুক্ত হতে বলুন। তাঁরা রেজিস্টার করলেই আপনার স্কোর বাড়বে।</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={referralLink}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-[10px] flex-1 font-mono outline-none select-all truncate"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={copyReferralLink}
                  className="p-2.5 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition active:scale-95 cursor-pointer text-xs flex items-center gap-1 font-bold"
                  title="লিংক কপি করুন"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'কপিড' : 'কপি করুন'}</span>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition active:scale-95 cursor-pointer text-xs flex items-center gap-1 font-bold shadow-sm"
                  title="ফেসবুক, হোয়াটসঅ্যাপে শেয়ার করুন"
                >
                  <Share2 size={14} />
                  <span>শেয়ার</span>
                </button>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          {isEligibleToApply ? (
            <div className="space-y-3 pt-2">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-2xl text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-100 dark:border-emerald-900/30">
                🎉 অভিনন্দন! ভেরিফিকেশনের সকল প্রয়োজনীয় শর্ত সফলভাবে সম্পন্ন হয়েছে।
              </div>
              <button
                disabled={applying}
                onClick={handleApply}
                className="w-full py-3 bg-gradient-to-r from-[#006A4E] to-[#015235] hover:opacity-95 active:scale-[0.99] text-white rounded-2xl text-xs font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>জমা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    <span>ভেরিফিকেশনের জন্য আবেদন করুন (Apply for Verification)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                ভেরিফিকেশনের জন্য আবেদন করতে সকল শর্তগুলো সম্পূর্ণ করা প্রয়োজন।
              </p>
            </div>
          )}

        </div>
      )}

      {/* Helpful Hint */}
      <div className="bg-slate-50 dark:bg-slate-850/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
        <HelpCircle size={14} className="shrink-0 mt-0.5 text-slate-400" />
        <span>ভেরিফাইড ব্যাজটি প্ল্যাটফর্মের সক্রিয় অবদানকারীদের একটি অনন্য স্বীকৃতি। এটি কোনো সরকারি যাচাইকরণ চিহ্ন নয় এবং এটি কঠোরভাবে অ্যাডমিন রিভিউ দ্বারা অনুমোদিত হয়।</span>
      </div>

      {/* Referral Link & Bengali Description Share Modal */}
      <ReferralShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        user={currentUserProfile}
        inviterName={currentUserProfile.name}
      />

    </div>
  );
};

export default GetVerifiedSection;
