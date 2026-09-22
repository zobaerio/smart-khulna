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
  Plus,
  Ban,
  Search,
  ChevronRight,
  Lock,
  Unlock,
  Shield,
  HelpCircle,
  Bell,
  Volume2,
  Monitor,
  CreditCard,
  Check,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicUserProfile, CommunityPost, VerifiedBadgeType } from '../../types/community';
import { Service, District, Category } from '../../dbData';
import { IconComponent } from './IconComponent';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';

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
  lang?: 'bn' | 'en';
  onToggleLang?: () => void;
  onToggleDarkMode?: () => void;
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
  onOpenSettings,
  lang = 'bn',
  onToggleLang,
  onToggleDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showFbSettings, setShowFbSettings] = useState(false);
  const [activeSettingSection, setActiveSettingSection] = useState<'main' | 'profile_lock' | 'active_status' | 'meta_verified' | 'blocking' | 'tagging' | 'two_factor' | 'archive' | 'search_visibility' | 'delete_account'>('main');
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [blockingInput, setBlockingInput] = useState('');
  const [loadingSetting, setLoadingSetting] = useState<string | null>(null);
  const [twoFactorPinInput, setTwoFactorPinInput] = useState('');

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close 3-dot dropdown without blocking page scrolling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  // Load blocked users and 2fa from profile on init
  useEffect(() => {
    if (profile && isOwnProfile) {
      // @ts-ignore
      setBlockedUsers(profile.blockedUserIds || []);
      // @ts-ignore
      setTwoFactorPinInput(profile.twoFactorPin || '');
    }
  }, [profile, isOwnProfile]);

  const handleUpdateProfileField = async (fieldName: string, value: any) => {
    if (!profile.uid) return;
    setLoadingSetting(fieldName);
    try {
      const userRef = doc(db, 'profiles', profile.uid);
      await updateDoc(userRef, { [fieldName]: value });
    } catch (err) {
      console.error(`Failed to update ${fieldName}:`, err);
    } finally {
      setLoadingSetting(null);
    }
  };

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

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
            >
              <MoreVertical size={18} className="text-slate-600 dark:text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-10 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 overflow-hidden"
                >
                    {isOwnProfile ? (
                      <>
                        <button 
                          onClick={() => {
                            setShowMoreMenu(false);
                            setShowFbSettings(true);
                            setActiveSettingSection('main');
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                        >
                          <Settings size={15} className="text-emerald-600 animate-spin-slow" />
                          সেটিংস ও প্রাইভেসি
                        </button>

                        <button 
                          onClick={() => {
                            setShowMoreMenu(false);
                            if (onOpenSettings) onOpenSettings();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 transition"
                        >
                          <Settings size={15} className="text-slate-500" />
                          অ্যাকাউন্ট সেটিংস
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={async () => {
                            setShowMoreMenu(false);
                            if (confirm(`${profile.name}-কে কি আপনি ব্লক করতে চান?`)) {
                              try {
                                const currentUserProfileRef = doc(db, 'profiles', currentUserUid!);
                                const currentProfileSnap = await getDoc(currentUserProfileRef);
                                if (currentProfileSnap.exists()) {
                                  const curData = currentProfileSnap.data();
                                  const currentBlocked = curData.blockedUserIds || [];
                                  if (!currentBlocked.includes(profile.uid)) {
                                    const updatedBlocked = [...currentBlocked, profile.uid];
                                    await updateDoc(currentUserProfileRef, { blockedUserIds: updatedBlocked });
                                    alert(`${profile.name}-কে সফলভাবে ব্লক করা হয়েছে!`);
                                  } else {
                                    alert('এই ব্যবহারকারী ইতিমধ্যেই ব্লকড আছেন।');
                                  }
                                }
                              } catch (e) {
                                console.error("Error blocking user:", e);
                                alert("ব্লক করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
                              }
                            }
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition"
                        >
                          <Ban size={15} className="text-rose-500" />
                          ব্লক করুন
                        </button>

                        <button 
                          onClick={() => {
                            setShowMoreMenu(false);
                            onReport('user', profile.uid, profile.name);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition"
                        >
                          <Info size={15} className="text-amber-500" />
                          রিপোর্ট করুন
                        </button>
                      </>
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
              {profile.isLocked && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-200 dark:border-blue-800 text-[10px] font-bold w-fit self-center sm:self-auto">
                  <Lock size={12} />
                  <span>প্রোফাইল লকড</span>
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
        {profile.isLocked && !isOwnProfile ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto my-8 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 border-4 border-blue-100 dark:border-blue-900/50 mb-5 relative">
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-900">
                <CheckCircle size={12} />
              </span>
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-serif mb-2">
              {profile.name}-এর প্রোফাইলটি লক করা আছে
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-serif">
              নিজের ছবি এবং পোস্টগুলো সুরক্ষিত রাখতে {profile.name} প্রোফাইলটি লক করে রেখেছেন। শুধুমাত্র এডমিন ও অনুমোদিত নাগরিকরা তাঁর বিস্তারিত তথ্য দেখতে পারবেন।
            </p>
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
              <ShieldCheck size={16} />
              <span>স্মার্ট খুলনা সিটিজেন প্রটেকশন ট্রাস্ট</span>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Facebook Settings and Privacy Drawer/Modal */}
      <AnimatePresence>
        {showFbSettings && (
          <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950 z-50 overflow-y-auto font-sans text-slate-800 dark:text-slate-100">
            {/* Top Bar */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    if (activeSettingSection === 'main') {
                      setShowFbSettings(false);
                    } else {
                      setActiveSettingSection('main');
                    }
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
                >
                  <ArrowLeft size={20} className="text-slate-700 dark:text-slate-300" />
                </button>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif">
                  {activeSettingSection === 'main' && 'সেটিংস ও প্রাইভেসি (Settings & Privacy)'}
                  {activeSettingSection === 'profile_lock' && 'প্রোফাইল লকিং (Profile Locking)'}
                  {activeSettingSection === 'active_status' && 'সক্রিয়তা স্ট্যাটাস (Active Status)'}
                  {activeSettingSection === 'meta_verified' && 'নাগরিক ভেরিফিকেশন (Meta Verified)'}
                  {activeSettingSection === 'blocking' && 'ব্লক করা ব্যবহারকারী (Blocking)'}
                  {activeSettingSection === 'tagging' && 'টাইমলাইন ও ট্যাগিং (Timeline & Tagging)'}
                  {activeSettingSection === 'two_factor' && 'দ্বি-স্তর নিরাপত্তা (Two-Factor Security)'}
                  {activeSettingSection === 'archive' && 'স্টোরি ও পোস্ট আর্কাইভ (Archive)'}
                  {activeSettingSection === 'search_visibility' && 'সার্চ ইঞ্জিনে অনুসন্ধান (Search Visibility)'}
                  {activeSettingSection === 'delete_account' && 'অ্যাকাউন্ট নিষ্ক্রিয় ও ডিলিট (Delete Account)'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
                  <Search size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-emerald-500/20">
                  {profile.avatar && <img src={profile.avatar} alt="" className="w-full h-full object-cover" />}
                </div>
              </div>
            </div>

            {/* Container */}
            <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
              {activeSettingSection === 'main' && (
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search settings..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs shadow-xs focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                    />
                  </div>

                  {/* Profile Shortcut Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        {profile.avatar ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-200" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{profile.name}</h4>
                        <p className="text-[10px] text-slate-500">আপনার নাগরিক প্রোফাইল এবং সেটিংস পরিবর্তন করুন</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("অ্যাকাউন্ট মোড সুইচ করা হয়েছে! আপনি এখন প্রফেশনাল মোডে আছেন।")}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black transition shadow-xs"
                    >
                      প্রোফাইল সুইচ করুন
                    </button>
                  </div>

                  {/* Preferences Section */}
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase px-1">Preferences (পছন্দসমূহ)</h3>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                      
                      {/* Meta Verified Item */}
                      <button 
                        onClick={() => setActiveSettingSection('meta_verified')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-full text-blue-600">
                            <CheckCircle size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Meta Verified (নাগরিক ভেরিফিকেশন)</h4>
                            <p className="text-[10px] text-slate-500">{profile.badge === 'verified_citizen' ? 'আপনি ভেরিফাইড নাগরিক' : 'প্রোফাইলে ব্লু ভেরিফিকেশন ব্যাজ যুক্ত করুন'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>

                      {/* Language and Region */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-600">
                            <Globe size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Language & Region (ভাষা ও অঞ্চল)</h4>
                            <p className="text-[10px] text-slate-500">ভাষা পরিবর্তন করুন (বর্তমান: {lang === 'bn' ? 'বাংলা' : 'English'})</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (onToggleLang) onToggleLang();
                          }}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black rounded-lg transition"
                        >
                          {lang === 'bn' ? 'English' : 'বাংলা'}
                        </button>
                      </div>

                      {/* Dark Mode */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-600/10 rounded-full text-slate-600 dark:text-slate-400">
                            <Monitor size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Dark Mode (ডার্ক মোড)</h4>
                            <p className="text-[10px] text-slate-500">আপনার ইন্টারফেস পরিবর্তন করুন</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (onToggleDarkMode) onToggleDarkMode();
                          }}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black rounded-lg transition"
                        >
                          ডার্ক মোড স্যুইচ
                        </button>
                      </div>

                      {/* Notification sound toggle */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 rounded-full text-amber-600">
                            <Bell size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Notification Settings (নোটিফিকেশন)</h4>
                            <p className="text-[10px] text-slate-500">আলার্ট এবং শব্দ কনফিগার করুন</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Two-Factor Authentication Security */}
                      <button 
                        onClick={() => setActiveSettingSection('two_factor')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-full text-purple-600">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Two-Factor Security (দ্বি-স্তর নিরাপত্তা)</h4>
                            {/* @ts-ignore */}
                            <p className="text-[10px] text-slate-500">{profile.twoFactorEnabled ? 'দ্বি-স্তর বিশিষ্ট নিরাপত্তা লক চালু আছে' : '৪-ডিজিটের সিকিউরিটি পিন লক সেট করুন'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>

                      {/* Story and Post Archive */}
                      <button 
                        onClick={() => setActiveSettingSection('archive')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cyan-500/10 rounded-full text-cyan-600">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Story & Post Archive (আর্কাইভ সেটিংস)</h4>
                            {/* @ts-ignore */}
                            <p className="text-[10px] text-slate-500">{profile.storyArchiveEnabled !== false ? 'আপনার শেয়ার করা বিষয়গুলো আর্কাইভে সংরক্ষিত হবে' : 'আর্কাইভ ফিচার বন্ধ আছে'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Audience and visibility Section */}
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase px-1">Audience and visibility (দর্শক ও দৃশ্যমানতা)</h3>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                      
                      {/* Profile Locking */}
                      <button 
                        onClick={() => setActiveSettingSection('profile_lock')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-full text-blue-600">
                            <Lock size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Profile locking (প্রোফাইল লক)</h4>
                            <p className="text-[10px] text-slate-500">{profile.isLocked ? 'আপনার প্রোফাইল বর্তমানে লক করা' : 'আপনার ছবি ও পোস্টগুলো সুরক্ষিত রাখুন'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>

                      {/* Active Status */}
                      <button 
                        onClick={() => setActiveSettingSection('active_status')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-600">
                            <Users size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Active status (অনলাইন সক্রিয়তা)</h4>
                            <p className="text-[10px] text-slate-500">{profile.showActiveStatus !== false ? 'আপনি যখন সক্রিয় থাকেন তখন দেখাবে' : 'সক্রিয় স্ট্যাটাস লুকানো আছে'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>

                      {/* Timeline and Tagging */}
                      <button 
                        onClick={() => setActiveSettingSection('tagging')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-500/10 rounded-full text-pink-600">
                            <MessageSquare size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Timeline & Tagging (টাইমলাইন ও ট্যাগিং)</h4>
                            {/* @ts-ignore */}
                            <p className="text-[10px] text-slate-500">{profile.timelinePostingPermission === 'only_me' ? 'শুধুমাত্র আমি পোস্ট করতে পারব' : profile.timelinePostingPermission === 'followers' ? 'শুধুমাত্র ফলোয়াররা পোস্ট করতে পারবে' : 'সবার জন্য উন্মুক্ত'}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>

                      {/* How people find and contact you */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 rounded-full text-indigo-600">
                            <Shield size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Phone Privacy (যোগাযোগের গোপনীয়তা)</h4>
                            <p className="text-[10px] text-slate-500 font-medium">অন্যান্য ব্যবহারকারীদের জন্য ফোন নম্বর লুকান</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          {/* @ts-ignore */}
                          <input type="checkbox" className="sr-only peer" checked={!!profile.hidePhone} onChange={() => handleUpdateProfileField('hidePhone', !profile.hidePhone)} />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Search Engine Visibility */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-500/10 rounded-full text-teal-600">
                            <Globe size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Search Visibility (সার্চ ইঞ্জিনে অনুসন্ধান)</h4>
                            <p className="text-[10px] text-slate-500">আপনার প্রোফাইল সার্চ ইঞ্জিনে দেখাবে কিনা</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          {/* @ts-ignore */}
                          <input type="checkbox" className="sr-only peer" checked={profile.searchEngineVisible !== false} onChange={() => handleUpdateProfileField('searchEngineVisible', profile.searchEngineVisible === false ? true : false)} />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Blocking */}
                      <button 
                        onClick={() => setActiveSettingSection('blocking')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-500/10 rounded-full text-rose-600">
                            <Ban size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">Blocking (ব্লক লিস্ট)</h4>
                            <p className="text-[10px] text-slate-500">আপনার ব্লক করা নাগরিকদের তালিকা পরিচালনা করুন</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>

                      {/* Delete Account Option */}
                      <button 
                        onClick={() => setActiveSettingSection('delete_account')}
                        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 text-left transition text-slate-800 dark:text-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 rounded-full text-red-600">
                            <Trash2 size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-red-600 dark:text-red-400">Delete Account (অ্যাকাউন্ট ডিলিট)</h4>
                            <p className="text-[10px] text-slate-500">আপনার অ্যাকাউন্টটি নিষ্ক্রিয় বা ডিলিট করুন</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Section: Profile Lock */}
              {activeSettingSection === 'profile_lock' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 border-4 border-blue-100 dark:border-blue-900/50">
                    <Lock size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">আপনার প্রোফাইল কি লক করতে চান?</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      প্রোফাইল লক করলে আপনার পোস্ট, ছবি এবং বায়োডাটা শুধুমাত্র অ্যাডমিন এবং আপনার অনুমোদিত ফলোয়াররাই দেখতে পাবেন। এর মাধ্যমে আপনার গোপনীয়তা শতভাগ সুরক্ষিত থাকবে।
                    </p>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={async () => {
                        await handleUpdateProfileField('isLocked', !profile.isLocked);
                        alert(profile.isLocked ? "প্রোফাইল আনলক করা হয়েছে!" : "প্রোফাইল সফলভাবে লক করা হয়েছে!");
                        setActiveSettingSection('main');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-extrabold text-white transition ${profile.isLocked ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {loadingSetting === 'isLocked' ? 'অনুগ্রহ করে অপেক্ষা করুন...' : (profile.isLocked ? 'প্রোফাইল আনলক করুন' : 'প্রোফাইল লক করুন')}
                    </button>
                    <button 
                      onClick={() => setActiveSettingSection('main')}
                      className="w-full py-2.5 mt-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      বাতিল করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-Section: Active Status */}
              {activeSettingSection === 'active_status' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border-4 border-emerald-100 dark:border-emerald-900/50 relative">
                    <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
                    <Users size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Active status (অনলাইন সক্রিয়তা)</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      আপনি যখন অ্যাপ্লিকেশনে সক্রিয় থাকবেন, তখন অন্য নাগরিকরা আপনার নামের পাশে একটি সবুজ বিন্দু দেখতে পাবেন। এটি বন্ধ করলে আপনি অন্যদের সক্রিয়তা দেখতে পাবেন না।
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">সক্রিয় স্ট্যাটাস চালু রাখুন</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={profile.showActiveStatus !== false} 
                        onChange={() => handleUpdateProfileField('showActiveStatus', profile.showActiveStatus === false ? true : false)} 
                      />
                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <button 
                    onClick={() => setActiveSettingSection('main')}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    সেভ করুন
                  </button>
                </div>
              )}

              {/* Sub-Section: Meta Verified */}
              {activeSettingSection === 'meta_verified' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto text-blue-500 border-4 border-blue-100 dark:border-blue-900/50">
                    <CheckCircle size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">স্মার্ট খুলনা নাগরিক ভেরিফিকেশন</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      আপনার প্রোফাইলে একটি সম্মানিত "ভেরিফাইড নাগরিক" ব্লু ভেরিফিকেশন ব্যাজ যোগ করুন! এর ফলে অ্যাপের সর্বত্র আপনার নামের পাশে সম্মানিত ব্যাজটি প্রদর্শন করবে।
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl text-left space-y-2">
                      <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300">ভেরিফিকেশনের সুবিধাসমূহ:</h4>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside font-medium">
                        <li>নামের পাশে প্রফেশনাল ব্লু চেকমার্ক ব্যাজ</li>
                        <li>কমিউনিটিতে সর্বোচ্চ প্রাধান্য ও ট্রাস্ট</li>
                        <li>সহজ রক্তদান ও জরুরি সেবা প্রদানকারী অ্যাক্সেস</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl text-left space-y-2.5">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                        <Award size={16} />
                        <span>ফ্রি মেটা ভেরিফিকেশন অফার!</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        ভেরিফিকেশন চাইলে যেকোনো নাগরিক সরাসরি নিতে পারবেন। তবে আপনার এলাকা বা আপনার জেলার মানুষের সহায়তার জন্য এখানে বিভিন্ন দরকারী সার্ভিস বা ইনফরমেশন (যেমন: ব্লাড ডোনার, এম্বুলেন্স, ডাক্তার, বা অন্য যেকোনো নাগরিক সেবা) অ্যাড করার পর আপনি **সম্পূর্ণ ফ্রিতে মেটা ভেরিফিকেশন** ব্লু ব্যাজ সচল করতে পারবেন!
                      </p>
                      <div className="text-[9px] bg-white/80 dark:bg-slate-900/80 px-2.5 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-between">
                        <span>বর্তমান স্থিতি: জেলা সার্ভিস অবদানকারী</span>
                        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[8px]">যোগ্য (Eligible)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={async () => {
                        const newBadge = profile.badge === 'verified_citizen' ? 'none' : 'verified_citizen';
                        await handleUpdateProfileField('badge', newBadge);
                        alert(newBadge === 'verified_citizen' ? "অভিনন্দন! আপনার নাগরিক ভেরিফিকেশন ব্যাজ সফলভাবে সক্রিয় হয়েছে।" : "ভেরিফিকেশন ব্যাজ নিষ্ক্রিয় করা হয়েছে।");
                        setActiveSettingSection('main');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-blue-500/20"
                    >
                      {loadingSetting === 'badge' ? 'লোডিং হচ্ছে...' : (profile.badge === 'verified_citizen' ? 'ভেরিফিকেশন ব্যাজ নিষ্ক্রিয় করুন' : 'ভেরিফাই ও ব্লু ব্যাজ পান')}
                    </button>
                    <button 
                      onClick={() => setActiveSettingSection('main')}
                      className="w-full py-2.5 mt-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      ফিরে যান
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-Section: Blocking */}
              {activeSettingSection === 'blocking' && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">কাউকে ব্লক করুন:</h3>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ব্যবহারকারীর নাম লিখুন..." 
                        value={blockingInput}
                        onChange={(e) => setBlockingInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-rose-500 outline-hidden focus:outline-hidden dark:text-white"
                      />
                      <button 
                        onClick={async () => {
                          if (!blockingInput.trim()) return;
                          // Let's add block locally for simulation or add to Firestore
                          const updated = [...blockedUsers, blockingInput.trim()];
                          setBlockedUsers(updated);
                          await handleUpdateProfileField('blockedUserIds', updated);
                          setBlockingInput('');
                          alert(`${blockingInput.trim()} ব্যবহারকারীকে সফলভাবে ব্লক করা হয়েছে!`);
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        ব্লক করুন
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">ব্লক করা ব্যবহারকারীদের তালিকা ({blockedUsers.length})</h3>
                    {blockedUsers.length > 0 ? (
                      <div className="space-y-2">
                        {blockedUsers.map((user, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user}</span>
                            <button 
                              onClick={async () => {
                                const updated = blockedUsers.filter(u => u !== user);
                                setBlockedUsers(updated);
                                await handleUpdateProfileField('blockedUserIds', updated);
                                alert("আনব্লক করা হয়েছে!");
                              }}
                              className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-[10px] font-extrabold text-slate-700 dark:text-slate-300 transition"
                            >
                              আনব্লক করুন
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic text-center py-6">কোনো ব্যবহারকারী ব্লক লিস্টে নেই</p>
                    )}
                  </div>
                </div>
              )}

              {/* Sub-Section: Tagging & Timeline posting permission */}
              {activeSettingSection === 'tagging' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-16 h-16 bg-pink-50 dark:bg-pink-950/40 rounded-full flex items-center justify-center mx-auto text-pink-600 border-4 border-pink-100 dark:border-pink-900/50">
                    <MessageSquare size={28} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">টাইমলাইন ও ট্যাগিং পারমিশন</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      আপনার নাগরিক প্রোফাইলের টাইমলাইনে অন্য নাগরিকদের পোস্ট করার अधिकार কে পাবেন তা সুনির্দিষ্ট করুন।
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: 'everyone', label: 'সবার জন্য উন্মুক্ত (Everyone)', desc: 'স্মার্ট খুলনার যেকোনো নিবন্ধিত নাগরিক আপনার প্রোফাইলে পোস্ট করতে পারবেন।' },
                      { id: 'followers', label: 'শুধুমাত্র ফলোয়াররা (Followers only)', desc: 'যারা আপনাকে ফলো করছেন শুধুমাত্র তারাই আপনার প্রোফাইলে পোস্ট করতে পারবেন।' },
                      { id: 'only_me', label: 'শুধুমাত্র আমি (Only me)', desc: 'আপনার প্রোফাইলে আপনি ছাড়া অন্য কেউ পোস্ট করতে পারবেন না।' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        // @ts-ignore
                        onClick={async () => {
                          await handleUpdateProfileField('timelinePostingPermission', opt.id);
                          alert(`টাইমলাইন পারমিশন পরিবর্তন করে "${opt.label}" করা হয়েছে!`);
                          setActiveSettingSection('main');
                        }}
                        // @ts-ignore
                        className={`w-full p-4 text-left border rounded-2xl transition flex items-start gap-3 ${profile.timelinePostingPermission === opt.id || (!profile.timelinePostingPermission && opt.id === 'everyone') ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {/* @ts-ignore */}
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${profile.timelinePostingPermission === opt.id || (!profile.timelinePostingPermission && opt.id === 'everyone') ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                            {/* @ts-ignore */}
                            {(profile.timelinePostingPermission === opt.id || (!profile.timelinePostingPermission && opt.id === 'everyone')) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">{opt.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveSettingSection('main')}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  >
                    ফিরে যান
                  </button>
                </div>
              )}

              {/* Sub-Section: Two-Factor Security PIN */}
              {activeSettingSection === 'two_factor' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/40 rounded-full flex items-center justify-center mx-auto text-purple-600 border-4 border-purple-100 dark:border-purple-900/50">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">দ্বি-স্তরবিশিষ্ট পিন সিকিউরিটি (2FA)</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      আপনার অ্যাকাউন্ট অননুমোদিত অ্যাক্সেস থেকে সুরক্ষিত রাখতে ৪-ডিজিটের সিকিউরিটি পিন সেট করুন।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">সিকিউরিটি লক স্ট্যাটাস</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        // @ts-ignore
                        checked={!!profile.twoFactorEnabled} 
                        // @ts-ignore
                        onChange={async () => {
                          // @ts-ignore
                          const nextVal = !profile.twoFactorEnabled;
                          if (nextVal && !twoFactorPinInput.trim()) {
                            alert("দয়া করে প্রথমে ৪-ডিজিটের সিকিউরিটি পিন কোডটি লিখুন।");
                            return;
                          }
                          await handleUpdateProfileField('twoFactorEnabled', nextVal);
                        }} 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block">আপনার ৪-ডিজিটের সিকিউরিটি পিন কোড:</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="উদা: ৪৩২১"
                      value={twoFactorPinInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setTwoFactorPinInput(val);
                      }}
                      className="w-full text-center tracking-widest text-lg font-bold p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveSettingSection('main')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                    >
                      বাতিল করুন
                    </button>
                    <button 
                      onClick={async () => {
                        if (twoFactorPinInput.length !== 4) {
                          alert("পিন কোডটি অবশ্যই ঠিক ৪টি সংখ্যার হতে হবে।");
                          return;
                        }
                        await handleUpdateProfileField('twoFactorPin', twoFactorPinInput);
                        await handleUpdateProfileField('twoFactorEnabled', true);
                        alert("৪-ডিজিটের সিকিউরিটি পিন সফলভাবে সেভ এবং দ্বি-স্তর লক সক্রিয় হয়েছে!");
                        setActiveSettingSection('main');
                      }}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-md"
                    >
                      পিন সেভ করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-Section: Story & Post Archive */}
              {activeSettingSection === 'archive' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-950/40 rounded-full flex items-center justify-center mx-auto text-cyan-600 border-4 border-cyan-100 dark:border-cyan-900/50">
                    <Calendar size={28} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">স্টোরি ও পোস্ট আর্কাইভ সেটিংস</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      আর্কাইভ অপশন চালু রাখলে ২৪ ঘণ্টা পর পর আপনার শেয়ার করা স্টোরি বা পোস্টগুলো স্বয়ংক্রিয়ভাবে একটি আর্কাইভে সংরক্ষিত হবে যা শুধুমাত্র আপনি দেখতে পাবেন।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">স্বয়ংক্রিয় আর্কাইভ সংরক্ষণ</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        // @ts-ignore
                        checked={profile.storyArchiveEnabled !== false} 
                        // @ts-ignore
                        onChange={async () => {
                          // @ts-ignore
                          const nextVal = profile.storyArchiveEnabled === false ? true : false;
                          await handleUpdateProfileField('storyArchiveEnabled', nextVal);
                        }} 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <button 
                    onClick={() => setActiveSettingSection('main')}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    সেভ ও সম্পন্ন করুন
                  </button>
                </div>
              )}

              {/* Sub-Section: Delete Account */}
              {activeSettingSection === 'delete_account' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-xs max-w-md mx-auto">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto text-red-600 border-4 border-red-100 dark:border-red-900/50">
                    <Trash2 size={28} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">অ্যাকাউন্ট ডিলিট করুন (Delete Account)</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্টটি ডিলিট করতে চান? অ্যাকাউন্ট ডিলিট করলে আপনার প্রোফাইলটি সাময়িকভাবে নিষ্ক্রিয় করা হবে এবং অন্য কোনো ব্যবহারকারী আপনার প্রোফাইল দেখতে পাবেন না। 
                    </p>
                    <p className="text-[11px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                      পরবর্তীতে আপনি চাইলে যেকোনো সময় পুনরায় লগইন করার মাধ্যমে আপনার অ্যাকাউন্টটি সম্পূর্ণ ফ্রিতে এবং নিরাপদে সচল করতে পারবেন।
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={async () => {
                        if (confirm("আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্টটি নিষ্ক্রিয় বা ডিলিট করতে চান? পরবর্তীতে পুনরায় লগইন করে সচল করতে পারবেন।")) {
                          try {
                            setLoadingSetting('delete_account');
                            await handleUpdateProfileField('isDeleted', true);
                            if (onLogout) {
                              onLogout();
                            }
                          } catch (err) {
                            console.error(err);
                            alert("অ্যাকাউন্ট নিষ্ক্রিয় করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
                          } finally {
                            setLoadingSetting(null);
                          }
                        }
                      }}
                      disabled={loadingSetting === 'delete_account'}
                      className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                    >
                      {loadingSetting === 'delete_account' ? 'নিষ্ক্রিয় করা হচ্ছে...' : 'হ্যাঁ, অ্যাকাউন্ট ডিলিট করুন'}
                    </button>
                    <button 
                      onClick={() => setActiveSettingSection('main')}
                      className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                    >
                      ফিরে যান
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
