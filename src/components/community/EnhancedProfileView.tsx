import React, { useState, useMemo, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Briefcase, 
  Droplets, 
  Calendar, 
  Grid, 
  Users, 
  Image as ImageIcon, 
  Info, 
  MessageSquare, 
  UserPlus, 
  UserMinus, 
  Edit2, 
  ExternalLink, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowLeft,
  Settings,
  MoreVertical,
  CheckCircle,
  ShieldCheck,
  Award,
  LogOut,
  X,
  Heart,
  Share2,
  Eye,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicUserProfile, CommunityPost, VerifiedBadgeType } from '../../types/community';
import { Service, District, Category } from '../../dbData';
import { IconComponent } from './IconComponent';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface ProfileVisitor {
  id: string;
  visitorUid: string;
  visitorName: string;
  visitorAvatar: string;
  timestamp: string;
}

import { PostCard } from './PostCard';
import { PostComment } from '../../types/community';

interface EnhancedProfileViewProps {
  profile: PublicUserProfile;
  currentUserUid?: string;
  isOwnProfile: boolean;
  onEdit: () => void;
  onMessage: (uid: string, name: string, avatar?: string) => void;
  onFollow: (uid: string) => void;
  onUnfollow: (uid: string) => void;
  onBack?: () => void;
  posts: CommunityPost[];
  services: Service[];
  districts: District[];
  categories: Category[];
  followers: PublicUserProfile[];
  following: PublicUserProfile[];
  onPostClick: (post: CommunityPost) => void;
  onServiceClick: (service: Service) => void;
  onUserClick: (uid: string, name: string, email: string, avatar?: string) => void;
  onUpdateCover: (url: string) => void;
  onLogout?: () => void;
  // Interaction props
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onSharePost: (post: CommunityPost) => void;
  onOpenCreatePost: () => void;
  onReport: (type: 'post' | 'comment' | 'user', id: string, title: string) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (post: CommunityPost) => void;
  commentsMap: { [postId: string]: PostComment[] };
  likedPostIds: string[];
  savedPostIds: string[];
  followingUids: string[];
  onStartMessage: (uid: string, name: string, email: string, avatar?: string) => void;
  onOpenSettings?: () => void;
}

type ProfileTab = 'posts' | 'about' | 'photos' | 'services' | 'followers';

export const EnhancedProfileView: React.FC<EnhancedProfileViewProps> = ({
  profile,
  currentUserUid,
  isOwnProfile,
  onEdit,
  onMessage,
  onFollow,
  onUnfollow,
  onBack,
  posts,
  services,
  districts,
  categories,
  followers,
  following,
  onPostClick,
  onServiceClick,
  onUserClick,
  onUpdateCover,
  onLogout,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onSharePost,
  onOpenCreatePost,
  onReport,
  onDeletePost,
  onEditPost,
  commentsMap,
  likedPostIds,
  savedPostIds,
  followingUids,
  onStartMessage,
  onOpenSettings
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Fetch visitors for own profile
  useEffect(() => {
    if (!isOwnProfile || !profile.uid) return;
    
    const visitorsRef = collection(db, 'profiles', profile.uid, 'visitors');
    const q = query(visitorsRef, orderBy('timestamp', 'desc'), limit(5));
    
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as ProfileVisitor);
      setVisitors(docs);
    });
  }, [isOwnProfile, profile.uid]);

  const districtName = useMemo(() => {
    return districts.find(d => d.id === profile.district)?.name || profile.district || 'খুলনা';
  }, [profile.district, districts]);

  const badgeConfig = (badge: VerifiedBadgeType) => {
    switch (badge) {
      case 'govt_official': return { icon: <ShieldCheck size={14} />, label: 'সরকারি কর্মকর্তা', color: 'bg-blue-500/10 text-blue-600 border-blue-200' };
      case 'emergency_service': return { icon: <Award size={14} />, label: 'জরুরি সেবা', color: 'bg-red-500/10 text-red-600 border-red-200' };
      case 'admin': return { icon: <Award size={14} />, label: 'অ্যাডমিন', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
      case 'verified_citizen': return { icon: <CheckCircle size={14} />, label: 'ভেরিফাইড নাগরিক', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
      default: return null;
    }
  };

  const badge = badgeConfig(profile.badge || 'none');

  const stats = [
    { label: 'পোস্ট', value: profile.postsCount || posts.length, tab: 'posts' as ProfileTab },
    { label: 'ফলোয়ার', value: profile.followersCount || followers.length, tab: 'followers' as ProfileTab },
    { label: 'ফলোয়িং', value: profile.followingCount || following.length, tab: 'followers' as ProfileTab },
    { label: 'সেবা', value: services.length, tab: 'services' as ProfileTab }
  ];

  const handleCoverChange = () => {
    onEdit();
  };

  const filteredFollowers = useMemo(() => {
    if (!memberSearchQuery) return followers;
    return followers.filter(f => 
      f.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
      (f.profession || '').toLowerCase().includes(memberSearchQuery.toLowerCase())
    );
  }, [followers, memberSearchQuery]);

  const filteredFollowing = useMemo(() => {
    if (!memberSearchQuery) return following;
    return following.filter(f => 
      f.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || 
      (f.profession || '').toLowerCase().includes(memberSearchQuery.toLowerCase())
    );
  }, [following, memberSearchQuery]);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      {/* Top Navigation Bar (Sticky when scrolling down) */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer">
              <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300" />
            </button>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-1">{profile.name}</h2>
            <p className="text-[10px] text-slate-500 font-medium">{profile.postsCount || posts.length} টি পোস্ট</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Profile Visitors (TikTok-like) */}
          {isOwnProfile && visitors.length > 0 && (
            <div className="flex items-center -space-x-2 mr-2 overflow-hidden px-1 cursor-pointer group relative" title="প্রোফাইল ভিজিটর">
              {visitors.map((v, i) => (
                <div 
                  key={v.id} 
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-100 flex-shrink-0"
                  style={{ zIndex: 10 - i }}
                >
                  {v.visitorAvatar ? (
                    <img src={v.visitorAvatar} alt={v.visitorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <Users size={10} className="text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
              <div className="ml-3 pl-1.5 flex items-center gap-1 text-[9px] font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
                <Eye size={10} />
                <span>ভিজিটর</span>
              </div>
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
            >
              <MoreVertical size={18} className="text-slate-600 dark:text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showMoreMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMoreMenu(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-10 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 overflow-hidden"
                  >
                    {isOwnProfile && (
                      <button 
                        onClick={() => {
                          setShowMoreMenu(false);
                          if (onOpenSettings) onOpenSettings();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                      >
                        <Settings size={15} className="text-emerald-600" />
                        অ্যাকাউন্ট সেটিংস
                      </button>
                    )}

                    <button 
                      onClick={() => {
                        setShowMoreMenu(false);
                        const url = window.location.href;
                        navigator.clipboard.writeText(url);
                        alert('প্রোফাইল লিংক কপি করা হয়েছে!');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                    >
                      <ExternalLink size={15} className="text-blue-600" />
                      প্রোফাইল শেয়ার করুন
                    </button>

                    <button 
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowGuidelinesModal(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                    >
                      <Info size={15} className="text-amber-600" />
                      কমিউনিটি নীতিমালা
                    </button>

                    <button 
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowPrivacyModal(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition border-t border-slate-100 dark:border-slate-800 mt-1"
                    >
                      <ShieldCheck size={15} className="text-emerald-700" />
                      প্রাইভেসি ও নিরাপত্তা
                    </button>

                    {isOwnProfile && onLogout && (
                      <button 
                        onClick={() => {
                          setShowMoreMenu(false);
                          if (confirm('আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?')) {
                            onLogout();
                          }
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2.5 transition border-t border-slate-100 dark:border-slate-800 mt-1"
                      >
                        <LogOut size={15} />
                        লগআউট করুন
                      </button>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Community Guidelines Modal */}
      <AnimatePresence>
        {showGuidelinesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowGuidelinesModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[80vh]"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-700 text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <Info size={18} /> কমিউনিটি নীতিমালা
                </h3>
                <button onClick={() => setShowGuidelinesModal(false)} className="p-1.5 hover:bg-white/20 rounded-full transition">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <section>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">১. সম্মান প্রদর্শন করুন</h4>
                  <p>স্মার্ট খুলনা কমিউনিটিতে সকল সদস্যের সাথে মার্জিত ও সম্মানজনক আচরণ করুন। কোনো ধরনের ঘৃণা বা উস্কানিমূলক বক্তব্য প্রদান থেকে বিরত থাকুন।</p>
                </section>
                <section>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">২. সঠিক তথ্য প্রদান</h4>
                  <p>যেকোনো সেবা বা পোস্ট প্রদানের ক্ষেত্রে সঠিক তথ্য প্রদান নিশ্চিত করুন। ভুল বা বিভ্রান্তিকর তথ্য প্রদান করলে আপনার অ্যাকাউন্ট নিষিদ্ধ হতে পারে।</p>
                </section>
                <section>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">৩. নিরাপত্তা বজায় রাখুন</h4>
                  <p>আপনার ব্যক্তিগত সংবেদনশীল তথ্য (যেমন: পাসওয়ার্ড) কারও সাথে শেয়ার করবেন না। সন্দেহজনক কিছু দেখলে এডমিনকে রিপোর্ট করুন।</p>
                </section>
                <section>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">৪. স্প্যামিং থেকে বিরত থাকুন</h4>
                  <p>একই পোস্ট বারবার করা বা অপ্রাসঙ্গিক লিংক শেয়ার করা থেকে বিরত থাকুন।</p>
                </section>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setShowGuidelinesModal(false)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md"
                >
                  আমি বুঝতে পেরেছি
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Notice Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowPrivacyModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <ShieldCheck size={18} /> প্রাইভেসি ও নিরাপত্তা
                </h3>
                <button onClick={() => setShowPrivacyModal(false)} className="p-1.5 hover:bg-white/20 rounded-full transition">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">আপনার তথ্য আমাদের কাছে নিরাপদ</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  স্মার্ট খুলনা প্ল্যাটফর্মে আপনার প্রদানকৃত সকল তথ্য এনক্রিপশন প্রযুক্তির মাধ্যমে সুরক্ষিত থাকে। আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রয় বা শেয়ার করি না।
                </p>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle size={14} className="text-emerald-600 mb-1" />
                    <span className="text-[10px] font-bold block">এন্ড-টু-এন্ড চ্যাট</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle size={14} className="text-emerald-600 mb-1" />
                    <span className="text-[10px] font-bold block">সিকিউর ডাটাবেজ</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-md"
                >
                  ঠিক আছে
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Section: Cover & Profile Photo */}
      <div className="relative group">
        {/* Cover Photo */}
        <div className="h-40 sm:h-56 md:h-64 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          {profile.coverPhoto ? (
            <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-lime-600 opacity-80" />
          )}
          {isOwnProfile && (
            <button 
              onClick={handleCoverChange}
              className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all flex items-center gap-2 text-xs font-bold backdrop-blur-sm"
            >
              <Camera size={16} />
              <span className="hidden sm:inline">কভার ফটো পরিবর্তন</span>
            </button>
          )}
        </div>

        {/* Profile Info Overlay (Negative Margin to pull up) */}
        <div className="px-4 -mt-12 sm:-mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Profile Photo */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-950 bg-white dark:bg-slate-800 overflow-hidden shadow-lg relative group/avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                    <Users size={40} className="text-slate-400" />
                  </div>
                )}
                {isOwnProfile && (
                  <button onClick={onEdit} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={onEdit}
                    className="flex-1 sm:flex-none px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition"
                  >
                    <Edit2 size={16} />
                    প্রোফাইল এডিট
                  </button>
                  <button 
                    onClick={onOpenSettings}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
                  >
                    <Settings size={18} className="text-slate-700 dark:text-slate-300" />
                  </button>
                </>
              ) : (
                <>
                  {profile.isFollowing ? (
                    <button 
                      onClick={() => onUnfollow(profile.uid)}
                      className="flex-1 sm:flex-none px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition"
                    >
                      <UserMinus size={16} />
                      আনফলো
                    </button>
                  ) : (
                    <button 
                      onClick={() => onFollow(profile.uid)}
                      className="flex-1 sm:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20"
                    >
                      <UserPlus size={16} />
                      ফলো করুন
                    </button>
                  )}
                  <button 
                    onClick={() => onMessage(profile.uid, profile.name, profile.avatar)}
                    className="flex-1 sm:flex-none px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition"
                  >
                    <MessageSquare size={16} />
                    মেসেজ
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Basic Info */}
          <div className="mt-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif">{profile.name}</h1>
              {badge && (
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.color} w-fit self-center sm:self-auto`}>
                  {badge.icon}
                  {badge.label}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {profile.profession && (
                <div className="flex items-center gap-1">
                  <Briefcase size={14} className="text-slate-400" />
                  {profile.profession}
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400" />
                {districtName}{profile.upazila ? ` • ${profile.upazila}` : ''}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                {profile.joinedDate ? `joined ${new Date(profile.joinedDate).toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}` : 'নতুন নাগরিক'}
              </div>
            </div>

            {profile.bio && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl whitespace-pre-line">
                {profile.bio}
              </p>
            )}

            {/* Stats Bar */}
            <div className="flex items-center justify-around sm:justify-start sm:gap-12 py-5 mt-2 border-t border-slate-100 dark:border-slate-800">
              {stats.map(stat => (
                <button 
                  key={stat.label} 
                  onClick={() => setActiveTab(stat.tab)}
                  className="flex flex-col items-center sm:items-start group cursor-pointer"
                >
                  <span className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-[52px] z-20">
        <div className="flex px-2 max-w-screen-xl mx-auto">
          {[
            { id: 'posts', label: 'পোস্ট', icon: <Grid size={18} /> },
            { id: 'about', label: 'তথ্য', icon: <Info size={18} /> },
            { id: 'photos', label: 'ছবি', icon: <ImageIcon size={18} /> },
            { id: 'services', label: 'সেবা', icon: <Award size={18} /> },
            { id: 'followers', label: 'ফলোয়ার', icon: <Users size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex-1 flex flex-col items-center py-3 px-1 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <div className="mb-0.5">{tab.icon}</div>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-w-screen-xl mx-auto pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'posts' && (
            <motion.div 
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Facebook-like Create Post Section */}
              {isOwnProfile && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                      {profile.avatar && <img src={profile.avatar} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <button 
                      onClick={onOpenCreatePost}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 text-sm py-2.5 px-4 rounded-full text-left transition-colors cursor-pointer"
                    >
                      {profile.name}, আপনার মনে কি আছে?
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/50">
                    <button onClick={onOpenCreatePost} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg transition">
                      <ImageIcon size={16} className="text-emerald-500" />
                      <span>ছবি</span>
                    </button>
                    <button onClick={onOpenCreatePost} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg transition">
                      <MapPin size={16} className="text-rose-500" />
                      <span>লোকেশন</span>
                    </button>
                    <button onClick={onOpenCreatePost} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg transition">
                      <Plus size={16} className="text-blue-500" />
                      <span>পোস্ট</span>
                    </button>
                  </div>
                </div>
              )}

              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    districts={districts}
                    currentUserId={currentUserUid}
                    comments={commentsMap[post.id] || []}
                    isLiked={likedPostIds.includes(post.id)}
                    isSaved={savedPostIds.includes(post.id)}
                    isFollowing={followingUids.includes(post.authorId)}
                    onToggleLike={onToggleLike}
                    onToggleSave={onToggleSave}
                    onAddComment={onAddComment}
                    onAddReply={onAddReply}
                    onDeleteComment={onDeleteComment}
                    onShare={onSharePost}
                    onReport={onReport}
                    onDeletePost={onDeletePost}
                    onEditPost={onEditPost}
                    onViewProfile={onUserClick}
                    onStartMessage={onStartMessage}
                    onToggleFollow={onFollow}
                  />
                ))
              ) : (
                <div className="py-20 text-center space-y-3">
                  <Grid size={48} className="mx-auto text-slate-300" />
                  <p className="text-slate-500 font-bold">এখনো কোনো পোস্ট করা হয়নি</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Info size={16} className="text-emerald-600" />
                  ব্যক্তিগত তথ্যাবলী
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ইমেইল</p>
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{profile.email}</p>
                  </div>
                  {profile.phone && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ফোন নম্বর</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">{profile.phone}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">রক্তের গ্রুপ</p>
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                      <Droplets size={14} />
                      {profile.bloodGroup || 'উল্লেখ নেই'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ঠিকানা</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{profile.address || 'তথ্য নেই'}</p>
                  </div>
                </div>
              </div>

              {profile.socialLinks && Object.values(profile.socialLinks).some(v => !!v) && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <Globe size={16} className="text-emerald-600" />
                    সামাজিক মাধ্যম
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.socialLinks.facebook && (
                      <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 transition">
                        <Facebook size={14} /> Facebook
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition">
                        <Twitter size={14} /> Twitter / X
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded-xl text-xs font-bold border border-pink-100 dark:border-pink-800/50 hover:bg-pink-100 transition">
                        <Instagram size={14} /> Instagram
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 transition">
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 transition">
                        <Globe size={14} /> Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'photos' && (
            <motion.div 
              key="photos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            >
              {posts.filter(p => p.images.length > 0).length > 0 ? (
                posts.filter(p => p.images.length > 0).flatMap(p => p.images).map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 group relative cursor-pointer shadow-sm">
                    <img src={img.url} alt="" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon size={24} className="text-white" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-3">
                  <ImageIcon size={48} className="mx-auto text-slate-300" />
                  <p className="text-slate-500 font-bold">কোনো ছবি পোস্ট করা হয়নি</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div 
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {services.length > 0 ? (
                services.map(svc => (
                  <div 
                    key={svc.id} 
                    onClick={() => onServiceClick(svc)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-md transition cursor-pointer shadow-xs"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400`}>
                      <IconComponent name={categories.find(c => c.id === svc.category_id)?.iconName || 'Grid'} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{svc.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{svc.address}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-400">
                          {categories.find(c => c.id === svc.category_id)?.name}
                        </span>
                        {svc.is_verified && (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold">
                            <CheckCircle size={10} /> ভেরিফাইড
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center space-y-3">
                  <Award size={48} className="mx-auto text-slate-300" />
                  <p className="text-slate-500 font-bold">এখনো কোনো সেবা যুক্ত করা হয়নি</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'followers' && (
            <motion.div 
              key="followers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Search Bar for Followers/Following */}
              <div className="relative mb-2 px-1">
                <Users size={16} className="absolute left-4 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="নাম অথবা পেশা দিয়ে খুঁজুন..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Followers Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between gap-2 px-1 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-emerald-600" />
                      ফলোয়ার ({filteredFollowers.length})
                    </div>
                  </h3>
                  <div className="space-y-2">
                    {filteredFollowers.length > 0 ? (
                      filteredFollowers.map(f => (
                        <div 
                          key={f.uid} 
                          onClick={() => onUserClick(f.uid, f.name, f.email || '', f.avatar)}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 hover:shadow-sm transition cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-2 ring-emerald-50/50">
                            {f.avatar && <img src={f.avatar} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{f.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{f.profession || 'নাগরিক'}</p>
                          </div>
                          <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        এখনো কোনো ফলোয়ার নেই
                      </div>
                    )}
                  </div>
                </div>

                {/* Following Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between gap-2 px-1 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} className="text-emerald-600" />
                      যাদের ফলো করছেন ({filteredFollowing.length})
                    </div>
                  </h3>
                  <div className="space-y-2">
                    {filteredFollowing.length > 0 ? (
                      filteredFollowing.map(f => (
                        <div 
                          key={f.uid} 
                          onClick={() => onUserClick(f.uid, f.name, f.email || '', f.avatar)}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 hover:shadow-sm transition cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 ring-2 ring-emerald-50/50">
                            {f.avatar && <img src={f.avatar} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{f.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{f.profession || 'নাগরিক'}</p>
                          </div>
                          <button className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        কাউকে ফলো করা হচ্ছে না
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
