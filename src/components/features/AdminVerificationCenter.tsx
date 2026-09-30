import React, { useState, useEffect } from 'react';
import { 
  Award, Search, Filter, CheckCircle, XCircle, Clock, 
  User, RefreshCw, Loader2, ShieldCheck, Mail, ShieldAlert, AlertTriangle 
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, query, where, limit, setDoc } from 'firebase/firestore';
import { UserProfile } from '../../dbData';
import { SmartKhulnaVerifiedBadge } from '../common/SmartKhulnaVerifiedBadge';

interface AdminVerificationCenterProps {
  currentUserProfile: UserProfile;
}

export const AdminVerificationCenter: React.FC<AdminVerificationCenterProps> = ({ 
  currentUserProfile 
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchUsersWithVerificationData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all profiles
      const profilesSnap = await getDocs(collection(db, 'profiles'));
      const profilesList = profilesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      const processedUsers: any[] = [];

      for (const profile of profilesList) {
        // Skip deleted profiles
        if (profile.isDeleted) continue;

        const uid = profile.uid || profile.id;
        if (!uid) continue;

        // Fetch user stats dynamically to display in Admin Center
        // A. Invites Count
        const refQuery = query(collection(db, 'referrals'), where('referrerUid', '==', uid));
        const refSnap = await getDocs(refQuery);
        const invitesCount = refSnap.size;

        // B. Posts streak, photo posts, emergency posts
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', uid));
        const postsSnap = await getDocs(postsQuery);
        const postsList = postsSnap.docs.map(d => d.data());
        const photoPosts = postsList.filter(p => p.images && p.images.length > 0).length;
        const emergencyPosts = postsList.filter(p => p.type === 'emergency' || p.category_id === 'emergency').length;

        // Streak consecutive days
        const uniqueDates = Array.from(new Set(
          postsList.map(p => {
            const dateStr = p.createdAt || p.joinedDate || new Date().toISOString();
            return dateStr.substring(0, 10);
          })
        )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        let streak = 0;
        if (uniqueDates.length > 0) {
          streak = 1;
          let tempStreak = 1;
          const oneDay = 24 * 60 * 60 * 1000;
          for (let i = 0; i < uniqueDates.length - 1; i++) {
            const date1 = new Date(uniqueDates[i]);
            const date2 = new Date(uniqueDates[i + 1]);
            const diffTime = Math.abs(date1.getTime() - date2.getTime());
            if (diffTime <= oneDay + (2 * 60 * 60 * 1000)) {
              tempStreak++;
              if (tempStreak > streak) streak = tempStreak;
            } else {
              tempStreak = 1;
            }
          }
        }

        // C. Services Count added
        const servicesQuery = query(collection(db, 'services'), where('created_by', '==', uid));
        const servicesSnap = await getDocs(servicesQuery);
        const servicesCount = servicesSnap.size;

        // D. Reports received (against this user or their posts)
        const reportsQuery = query(collection(db, 'reports'), where('targetId', '==', uid));
        const reportsSnap = await getDocs(reportsQuery);
        const reportsCount = reportsSnap.size;

        // Profile Completion
        const profileFields = [
          profile.name,
          profile.phone,
          profile.avatar,
          profile.bio,
          profile.profession,
          profile.district,
          profile.upazila,
          profile.hometown
        ];
        const completedFields = profileFields.filter(f => !!f).length;
        const profilePercent = Math.round((completedFields / profileFields.length) * 100);

        processedUsers.push({
          ...profile,
          invitesCount,
          postingStreak: streak,
          servicesCount,
          photoPosts,
          emergencyPosts,
          reportsCount,
          profilePercent,
          status: profile.verification_status || 'unverified'
        });
      }

      setUsers(processedUsers);
    } catch (e) {
      console.warn("Failed to load admin verification data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithVerificationData();
  }, []);

  const handleUpdateStatus = async (
    targetUid: string, 
    newStatus: 'verified' | 'rejected' | 'suspended' | 'unverified',
    reason: string = ''
  ) => {
    setActionInProgress(targetUid);
    try {
      const userRef = doc(db, 'profiles', targetUid);
      const updateData: any = {
        verification_status: newStatus,
        verification_reviewed_at: new Date().toISOString()
      };

      if (newStatus === 'verified') {
        updateData.verified_at = new Date().toISOString();
        updateData.verified_by = currentUserProfile.uid;
      }
      if (reason) {
        updateData.verification_reason = reason;
      }

      await updateDoc(userRef, updateData);

      // Trigger personal in-app notification to target user
      const notifId = 'notif_ver_' + Date.now();
      const notifBody = newStatus === 'verified'
        ? 'অভিনন্দন! আপনার স্মার্ট ভেরিফিকেশন আবেদনটি অনুমোদিত হয়েছে। এখন থেকে আপনার নামের পাশে ভেরিফাইড ব্যাজটি প্রদর্শিত হবে।'
        : newStatus === 'suspended'
        ? 'আপনার ভেরিফিকেশন স্ট্যাটাসটি সাময়িকভাবে স্থগিত করা হয়েছে।'
        : `আপনার ভেরিফিকেশন আবেদনটি প্রত্যাখ্যান করা হয়েছে।`;

      await setDoc(doc(db, 'user_notifications', targetUid, 'items', notifId), {
        id: notifId,
        notificationId: notifId,
        title: newStatus === 'verified' ? 'ভেরিফিকেশন অনুমোদিত' : 'ভেরিফিকেশন আপডেট',
        body: notifBody,
        category: 'notice',
        priority: 'high',
        deepLink: '/profile',
        createdAt: new Date().toISOString(),
        createdAtMillis: Date.now(),
        isRead: false,
        receivedAt: new Date().toISOString()
      });

      // Update local state
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, status: newStatus } : u));
    } catch (e) {
      console.error("Failed to update verification status:", e);
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredList = users.filter(user => {
    const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return nameMatch;
    return nameMatch && user.status === filterStatus;
  });

  return (
    <div className="space-y-4">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="text-emerald-700 dark:text-emerald-400" size={20} />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-serif">ভেরিফিকেশন কন্ট্রোল সেন্টার (Admin)</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="ব্যবহারকারীর নাম খুঁজুন..." 
              value={searchTerm}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs w-full focus:ring-1 focus:ring-emerald-700 outline-none"
            />
          </div>

          {/* Filter Status */}
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none"
          >
            <option value="all">সকল আবেদন ({users.length})</option>
            <option value="pending">রিভিউ পেন্ডিং ({users.filter(u => u.status === 'pending').length})</option>
            <option value="verified">ভেরিফাইড ({users.filter(u => u.status === 'verified').length})</option>
            <option value="suspended">স্থগিত ({users.filter(u => u.status === 'suspended').length})</option>
            <option value="rejected">প্রত্যাখ্যাত ({users.filter(u => u.status === 'rejected').length})</option>
            <option value="unverified">আনভেরিফাইড ({users.filter(u => u.status === 'unverified').length})</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchUsersWithVerificationData}
            disabled={loading}
            className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 transition active:scale-95 cursor-pointer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
        </div>
      </div>

      {/* Users grid list */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="animate-spin text-emerald-800 mx-auto" size={32} />
          <p className="text-xs text-slate-500 font-serif">সদস্যদের ভেরিফিকেশন প্রগ্রেস ও অবদান ডাটা লোড হচ্ছে...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-slate-400 text-xs">
          কোনো ব্যবহারকারী পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((user) => {
            const isEligible = user.profilePercent >= 100 && user.invitesCount >= 5 && user.postingStreak >= 7 && user.servicesCount >= 3;
            
            return (
              <div 
                key={user.uid || user.id} 
                className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border transition-all ${
                  user.status === 'verified' 
                    ? 'border-emerald-200 bg-emerald-50/5 dark:border-emerald-950/20' 
                    : user.status === 'pending'
                    ? 'border-amber-200 bg-amber-50/10 dark:border-amber-950/20 shadow-md ring-1 ring-amber-400/25'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Upper info row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar || 'https://via.placeholder.com/150'} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-full border-2 border-slate-200 object-cover"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-serif flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.status === 'verified' && <SmartKhulnaVerifiedBadge size={14} />}
                      </h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Mail size={10} />
                        <span>{user.email}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        জেলা: {user.district || 'খুলনা'} · উপজেলা: {user.upazila || 'সদর'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      user.status === 'verified' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : user.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                        : user.status === 'suspended'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {user.status === 'verified' ? 'ভেরিফাইড' : 
                       user.status === 'pending' ? 'পেনন্ডিং রিভিউ' : 
                       user.status === 'suspended' ? 'স্থগিত (Suspended)' : 
                       user.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'আনভেরিফাইড'}
                    </span>

                    {/* Eligibility Badge */}
                    {isEligible && user.status !== 'verified' && (
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-[9px] font-bold">
                        আবেদনের যোগ্য (Eligible)
                      </span>
                    )}
                  </div>
                </div>

                {/* Score & Task Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 py-4 text-center">
                  
                  {/* Profile Completed */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-serif">প্রোফাইল</span>
                    <span className={`text-xs font-bold ${user.profilePercent >= 100 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {user.profilePercent}%
                    </span>
                  </div>

                  {/* Invites count */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-serif">রেফারেল আমন্ত্রণ</span>
                    <span className={`text-xs font-bold ${user.invitesCount >= 5 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {user.invitesCount} / 5
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-serif">৭ দিনের চ্যালেঞ্জ</span>
                    <span className={`text-xs font-bold ${user.postingStreak >= 7 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {user.postingStreak} / 7 দিন
                    </span>
                  </div>

                  {/* Services count */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-serif">যুক্ত সেবা</span>
                    <span className={`text-xs font-bold ${user.servicesCount >= 3 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {user.servicesCount} / 3
                    </span>
                  </div>

                  {/* Photos and Emergency */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-serif">ছবিযুক্ত পোস্ট</span>
                    <span className={`text-xs font-bold ${user.photoPosts >= 3 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'}`}>
                      {user.photoPosts} / 3
                    </span>
                  </div>

                  {/* Violations reports */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-serif">রিপোর্ট / ভাইওলেশন</span>
                    <span className={`text-xs font-bold ${user.reportsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {user.reportsCount}
                    </span>
                  </div>

                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-850">
                  
                  {/* Approve */}
                  {user.status !== 'verified' && (
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => handleUpdateStatus(user.uid || user.id, 'verified', 'Completed requirements and approved by Admin.')}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                    >
                      {actionInProgress === (user.uid || user.id) ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle size={12} />
                      )}
                      <span>অনুমোদন করুন (Approve)</span>
                    </button>
                  )}

                  {/* Suspend */}
                  {user.status === 'verified' && (
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => {
                        const reason = window.prompt('স্থগিত করার সুনির্দিষ্ট কারণ লিখুন:');
                        if (reason !== null) {
                          handleUpdateStatus(user.uid || user.id, 'suspended', reason);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                    >
                      <ShieldAlert size={12} />
                      <span>স্থগিত করুন (Suspend)</span>
                    </button>
                  )}

                  {/* Revert to Unverified / Restore */}
                  {user.status === 'suspended' && (
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => handleUpdateStatus(user.uid || user.id, 'verified', 'Suspension lifted by Admin.')}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-850 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                    >
                      <User size={12} />
                      <span>পুনরুদ্ধার করুন (Restore)</span>
                    </button>
                  )}

                  {/* Reject / Deny */}
                  {user.status === 'pending' && (
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => {
                        const reason = window.prompt('প্রত্যাখ্যান করার কারণ লিখুন (ঐচ্ছিক):') || 'শর্ত পূরণ না হওয়ায় প্রত্যাখ্যাত।';
                        handleUpdateStatus(user.uid || user.id, 'rejected', reason);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                    >
                      <XCircle size={12} />
                      <span>প্রত্যাখ্যান (Reject)</span>
                    </button>
                  )}

                  {/* Request more contribution */}
                  {user.status === 'pending' && (
                    <button
                      disabled={actionInProgress !== null}
                      onClick={() => handleUpdateStatus(user.uid || user.id, 'unverified', 'Requested more contributions before verification.')}
                      className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 disabled:opacity-50"
                    >
                      <AlertTriangle size={12} />
                      <span>আরও অবদান প্রয়োজন (Need More)</span>
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default AdminVerificationCenter;
