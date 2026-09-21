import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  PhoneCall,
  Search,
  Filter,
  MapPin,
  Map,
  Shield,
  ShieldAlert,
  Flame,
  Ambulance,
  Info,
  Building2,
  HeartPulse,
  GraduationCap,
  Bus,
  Landmark,
  Truck,
  Scale,
  Sprout,
  Briefcase,
  Home,
  HardHat,
  UserCheck,
  Car,
  Zap,
  Wrench,
  Settings,
  Utensils,
  Bed,
  Compass,
  Grid,
  Heart,
  Plus,
  Share2,
  Bell,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Trash2,
  LogOut,
  SlidersHorizontal,
  ChevronLeft,
  AlertTriangle,
  User,
  PlusCircle,
  FileText,
  Lock,
  Edit2,
  Sparkles,
  BarChart2,
  ThumbsUp,
  X,
  FileSpreadsheet,
  Download,
  Smartphone,
  Laptop,
  Monitor,
  Users,
  MessageSquare,
  MessageCircle,
  AlertOctagon,
  LayoutGrid,
  Camera,
  Globe,
  Linkedin,
  Droplets,
  Loader2,
  Tractor,
  Sun,
  Moon
} from 'lucide-react';
import { compressImage } from './lib/imageCompressor';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  initialDistricts,
  initialCategories,
  initialEmergencyContacts,
  initialServices,
  initialBanners,
  saveLocalData,
  getLocalData,
  defaultReleaseConfig,
  type District,
  type Category,
  type EmergencyContact,
  type Service,
  type AuditLog,
  type UserProfile,
  type Banner,
  type Notification,
  type AppReleaseConfig
} from './dbData';
import { usePWA } from './hooks/usePWA';
import { OfflineBanner } from './components/OfflineBanner';
import { ServiceQR } from './components/ServiceQR';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { SplashScreen } from './components/SplashScreen';
import { DownloadPage } from './components/DownloadPage';
import { AdminDownloadsCMS } from './components/AdminDownloadsCMS';
import { AdminPanelComplete } from './components/AdminPanelComplete';
import { DistrictBannerCarousel } from './components/DistrictBannerCarousel';
import { testConnection, handleFirestoreError, OperationType } from './firestoreErrorHandler';
import {
  CommunityPost,
  PostComment,
  CommentReply,
  Conversation,
  ChatMessage,
  CommunityReport,
  CommunityNotification,
  PublicUserProfile,
  ModerationAction,
  ReportReason
} from './types/community';
import {
  initialCommunityPosts,
  initialCommunityComments,
  initialSampleUsers,
  initialSampleConversations,
  initialSampleNotifications
} from './data/initialCommunityData';
import { CommunityFeed } from './components/community/CommunityFeed';
import { MessagingCenter } from './components/community/MessagingCenter';
import { CreatePostModal } from './components/community/CreatePostModal';
import { UserProfileModal } from './components/community/UserProfileModal';
import { NotificationCenter } from './components/community/NotificationCenter';
import { CommunityModerationDashboard } from './components/community/CommunityModerationDashboard';
import { ReportModal } from './components/community/ReportModal';

// Category Color Scheme Mapping for Compact Visual Cards
const getCategoryStyle = (catId: string) => {
  const styles: Record<string, { bg: string; text: string }> = {
    govt: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    health: { bg: 'bg-rose-50', text: 'text-rose-600' },
    education: { bg: 'bg-blue-50', text: 'text-blue-600' },
    transport: { bg: 'bg-amber-50', text: 'text-amber-600' },
    emergency: { bg: 'bg-red-50', text: 'text-red-600' },
    citizen: { bg: 'bg-purple-50', text: 'text-purple-600' },
    banking: { bg: 'bg-sky-50', text: 'text-sky-600' },
    courier: { bg: 'bg-teal-50', text: 'text-teal-600' },
    car: { bg: 'bg-purple-50', text: 'text-purple-600' },
    professional: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    lawyer: { bg: 'bg-sky-50', text: 'text-sky-700' },
    local: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    agriculture: { bg: 'bg-lime-50', text: 'text-lime-700' },
    business: { bg: 'bg-orange-50', text: 'text-orange-600' },
    realestate: { bg: 'bg-teal-50', text: 'text-teal-700' },
    engineering: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    electrician: { bg: 'bg-amber-50', text: 'text-amber-600' },
    plumber: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
    mechanic: { bg: 'bg-slate-100', text: 'text-slate-700' },
    restaurant: { bg: 'bg-rose-50', text: 'text-rose-700' },
    hotel: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    tourism: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    other: { bg: 'bg-slate-100', text: 'text-slate-600' },
  };
  return styles[catId] || { bg: 'bg-emerald-50', text: 'text-emerald-700' };
};

// Dynamic Icon Component
const IconComponent = ({ name, className, size = 20, strokeWidth = 1.5 }: { name: string; className?: string; size?: number; strokeWidth?: number }) => {
  const icons: Record<string, any> = {
    Building2, HeartPulse, GraduationCap, Bus, Landmark, Truck, Scale, MapPin, Sprout, Tractor,
    Briefcase, Home, HardHat, UserCheck, Car, Zap, Wrench, Settings, Utensils, Bed, Compass, Grid,
    PhoneCall, Info, ShieldAlert, Shield, Flame, Ambulance, Sparkles, BarChart2, Plus, Bell, Clock, Edit2, LayoutGrid,
    AlertTriangle, User
  };
  const Comp = icons[name] || Grid;
  return <Comp className={className} size={size} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
};

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'community' | 'messages' | 'profile' | 'add' | 'saved' | 'download'>('home');
  const [adminView, setAdminView] = useState<'dashboard' | 'submissions' | 'emergencies' | 'services' | 'logs' | 'settings' | 'downloads' | 'community_moderation' | null>(null);

  // Cross-Platform App & PWA Logic
  const { isInstallable, isInstalled, isOnline, wasOffline, resetWasOffline, platform, installPWA } = usePWA();
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('smart_khulna_splash_shown'));
  const [releaseConfig, setReleaseConfig] = useState<AppReleaseConfig>(() => getLocalData('release_config', defaultReleaseConfig));
  
  // District & Data States
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    return localStorage.getItem('smart_khulna_selected_district') || 'khulna';
  });
  const [viewingDistrictId, setViewingDistrictId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Authentication & Users
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Core Data States (synchronized between Firestore and localStorage fallback)
  const [services, setServices] = useState<Service[]>(() => getLocalData('services', initialServices));
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => getLocalData('emergencies', initialEmergencyContacts));
  const [submissions, setSubmissions] = useState<any[]>(() => getLocalData('submissions', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getLocalData('audit_logs', []));
  const [banners, setBanners] = useState<Banner[]>(() => getLocalData('banners', initialBanners));
  const [systemNotifications, setSystemNotifications] = useState<Notification[]>(() => getLocalData('notifications', [
    { id: 'n1', title: 'ফ্লাড এলার্ট - খুলনা অঞ্চল', message: 'উপকূলীয় অঞ্চলে জোয়ারের পানি বৃদ্ধি পাওয়ায় সবাইকে সতর্ক থাকার নির্দেশ দেওয়া হয়েছে।', createdAt: new Date().toISOString() }
  ]));

  // Community & Social System States
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => getLocalData('community_posts', initialCommunityPosts));
  const [communityComments, setCommunityComments] = useState<{ [postId: string]: PostComment[] }>(() => getLocalData('community_comments', initialCommunityComments));
  const [conversations, setConversations] = useState<Conversation[]>(() => getLocalData('conversations', initialSampleConversations));
  const [messagesMap, setMessagesMap] = useState<{ [convId: string]: ChatMessage[] }>(() => getLocalData('messages_map', {}));
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(() => getLocalData('community_reports', []));
  const [communityNotifications, setCommunityNotifications] = useState<CommunityNotification[]>(() => getLocalData('community_notifications', initialSampleNotifications));
  const [likedCommunityPostIds, setLikedCommunityPostIds] = useState<string[]>(() => getLocalData('liked_community_post_ids', ['post_1', 'post_3']));
  const [savedCommunityPostIds, setSavedCommunityPostIds] = useState<string[]>(() => getLocalData('saved_community_post_ids', []));
  const [followingUids, setFollowingUids] = useState<string[]>(() => getLocalData('following_uids', []));
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => getLocalData('blocked_user_ids', []));
  const [allCommunityUsers, setAllCommunityUsers] = useState<PublicUserProfile[]>(() => getLocalData('community_users', initialSampleUsers));
  const [moderationAuditLogs, setModerationAuditLogs] = useState<ModerationAction[]>(() => getLocalData('moderation_audit_logs', []));

  // Community Modals
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<PublicUserProfile | null>(null);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [reportModalState, setReportModalState] = useState<{
    isOpen: boolean;
    targetType: 'post' | 'comment' | 'user' | 'message';
    targetId: string;
    targetTitle: string;
  }>({
    isOpen: false,
    targetType: 'post',
    targetId: '',
    targetTitle: ''
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterUpazila, setFilterUpazila] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfession, setEditProfession] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [editDistrict, setEditDistrict] = useState('khulna');
  const [editUpazila, setEditUpazila] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editTwitter, setEditTwitter] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [emailAuthMode, setEmailAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Gemini AI Grounding States
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);
  const [groundingResult, setGroundingResult] = useState<{ content: string; sources: any[] } | null>(null);
  const [groundingType, setGroundingType] = useState<'search' | 'maps'>('search');

  // Submit Form States
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePhone, setNewServicePhone] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState(initialCategories[0].id);
  const [newServiceAddress, setNewServiceAddress] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServiceDistrict, setNewServiceDistrict] = useState('khulna');
  const [newServiceUpazila, setNewServiceUpazila] = useState('');
  const [newServiceWebsite, setNewServiceWebsite] = useState('');
  const [newServiceFacebook, setNewServiceFacebook] = useState('');
  const [formSubmittedSuccess, setFormSubmittedSuccess] = useState(false);

  // Sync to local storage whenever core states change
  useEffect(() => {
    saveLocalData('services', services);
  }, [services]);

  useEffect(() => {
    saveLocalData('emergencies', emergencyContacts);
  }, [emergencyContacts]);

  useEffect(() => {
    saveLocalData('submissions', submissions);
  }, [submissions]);

  useEffect(() => {
    saveLocalData('audit_logs', auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveLocalData('banners', banners);
  }, [banners]);

  useEffect(() => {
    saveLocalData('notifications', systemNotifications);
  }, [systemNotifications]);

  // Sync and persist Community & Social states
  useEffect(() => {
    saveLocalData('community_posts', communityPosts);
  }, [communityPosts]);

  useEffect(() => {
    saveLocalData('community_comments', communityComments);
  }, [communityComments]);

  useEffect(() => {
    saveLocalData('conversations', conversations);
  }, [conversations]);

  useEffect(() => {
    saveLocalData('messages_map', messagesMap);
  }, [messagesMap]);

  useEffect(() => {
    saveLocalData('community_notifications', communityNotifications);
  }, [communityNotifications]);

  useEffect(() => {
    saveLocalData('community_reports', communityReports);
  }, [communityReports]);

  useEffect(() => {
    saveLocalData('liked_community_post_ids', likedCommunityPostIds);
  }, [likedCommunityPostIds]);

  useEffect(() => {
    saveLocalData('saved_community_post_ids', savedCommunityPostIds);
  }, [savedCommunityPostIds]);

  useEffect(() => {
    saveLocalData('following_uids', followingUids);
  }, [followingUids]);

  useEffect(() => {
    saveLocalData('blocked_user_ids', blockedUserIds);
  }, [blockedUserIds]);

  useEffect(() => {
    saveLocalData('moderation_audit_logs', moderationAuditLogs);
  }, [moderationAuditLogs]);

  // Sync and persist App Release Configuration
  useEffect(() => {
    saveLocalData('release_config', releaseConfig);
  }, [releaseConfig]);

  // Initialize and test connection to Firestore
  useEffect(() => {
    testConnection();
  }, []);

  // Load cloud release config if accessible
  useEffect(() => {
    const fetchReleaseConfig = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'release_config'));
        if (snap.exists()) {
          const cloudConfig = snap.data() as AppReleaseConfig;
          setReleaseConfig(cloudConfig);
          saveLocalData('release_config', cloudConfig);
        }
      } catch (err: unknown) {
        console.warn('Could not load cloud release config, falling back to local storage:', err);
      }
    };
    fetchReleaseConfig();
  }, []);

  // Load cloud banners if available
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const snap = await getDocs(collection(db, 'banners'));
        if (!snap.empty) {
          const cloudBanners = snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
          setBanners(cloudBanners);
          saveLocalData('banners', cloudBanners);
        }
      } catch (err: unknown) {
        console.warn('Could not load banners from Firestore, using local data:', err);
      }
    };
    fetchBanners();
  }, []);

  // Deep linking and browser navigation support
  useEffect(() => {
    const handleUrlRouting = () => {
      const pathname = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      if (pathname === '/download' || searchParams.get('page') === 'download' || searchParams.get('tab') === 'download') {
        setActiveTab('download');
        setViewingDistrictId(null);
      } else if (searchParams.get('tab') === 'services') {
        setActiveTab('services');
        setViewingDistrictId(null);
      } else if (searchParams.get('tab') === 'community') {
        setActiveTab('community');
        setViewingDistrictId(null);
      } else if (searchParams.get('tab') === 'messages') {
        setActiveTab('messages');
        setViewingDistrictId(null);
      } else if (searchParams.get('district')) {
        const dId = searchParams.get('district');
        if (dId && initialDistricts.some(d => d.id === dId)) {
          setSelectedDistrict(dId);
        }
      }
    };
    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const navigateTo = (tab: 'home' | 'services' | 'community' | 'messages' | 'profile' | 'add' | 'saved' | 'download') => {
    setActiveTab(tab);
    setViewingDistrictId(null);
    if (tab === 'download') {
      if (window.location.pathname !== '/download') {
        window.history.pushState(null, '', '/download');
      }
    } else if (window.location.pathname === '/download') {
      window.history.pushState(null, '', '/');
    }
  };

  // Auth & Roles Sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser);
        const email = firebaseUser.email || '';
        const displayName = firebaseUser.displayName || 'ব্যবহারকারী';
        const photoURL = firebaseUser.photoURL || '';
        
        // Define initial roles. Check if super admin by email (case-insensitive)
        const cleanEmail = email.trim().toLowerCase();
        const isSuperAdminEmail = ['zobaerhasan431@gmail.com', 'zobaerio24@gmail.com'].includes(cleanEmail);
        
        // Check local cache first
        const localCachedStr = localStorage.getItem(`smart_khulna_profile_${firebaseUser.uid}`);
        let localCached: UserProfile | null = null;
        if (localCachedStr) {
          try {
            localCached = JSON.parse(localCachedStr);
          } catch (e) {
            console.warn("Local profile parse error", e);
          }
        }

        // Try to fetch from Firestore
        const userDocRef = doc(db, 'profiles', firebaseUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            const updatedProfile: UserProfile = {
              ...data,
              uid: firebaseUser.uid,
              email: email,
              name: data.name || localCached?.name || displayName,
              avatar: data.avatar || localCached?.avatar || photoURL || '',
              phone: data.phone || localCached?.phone || '',
              bio: data.bio || localCached?.bio || '',
              profession: data.profession || localCached?.profession || '',
              bloodGroup: data.bloodGroup || localCached?.bloodGroup || '',
              district: data.district || data.selectedDistrict || localCached?.district || selectedDistrict,
              selectedDistrict: data.selectedDistrict || data.district || localCached?.selectedDistrict || selectedDistrict,
              upazila: data.upazila || localCached?.upazila || '',
              address: data.address || localCached?.address || '',
              facebook: data.facebook || localCached?.facebook || '',
              twitter: data.twitter || localCached?.twitter || '',
              instagram: data.instagram || localCached?.instagram || '',
              linkedin: data.linkedin || localCached?.linkedin || '',
              website: data.website || localCached?.website || '',
              role: isSuperAdminEmail ? ('super_admin' as const) : (data.role || localCached?.role || 'user'),
              savedServices: data.savedServices || localCached?.savedServices || []
            };
            
            // Sync with local cache and Firestore
            localStorage.setItem(`smart_khulna_profile_${firebaseUser.uid}`, JSON.stringify(updatedProfile));
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setUserProfile(updatedProfile);

            // Update in community directory
            setAllCommunityUsers(prev => {
              const exists = prev.some(u => u.uid === firebaseUser.uid);
              if (exists) {
                return prev.map(u => u.uid === firebaseUser.uid ? {
                  ...u,
                  name: updatedProfile.name,
                  avatar: updatedProfile.avatar,
                  bio: updatedProfile.bio,
                  phone: updatedProfile.phone,
                  profession: updatedProfile.profession,
                  bloodGroup: updatedProfile.bloodGroup,
                  district: updatedProfile.district || updatedProfile.selectedDistrict,
                  upazila: updatedProfile.upazila,
                  address: updatedProfile.address,
                  socialLinks: {
                    facebook: updatedProfile.facebook,
                    twitter: updatedProfile.twitter,
                    instagram: updatedProfile.instagram,
                    linkedin: updatedProfile.linkedin,
                    website: updatedProfile.website
                  }
                } : u);
              }
              return [...prev, {
                uid: firebaseUser.uid,
                name: updatedProfile.name,
                email: updatedProfile.email,
                avatar: updatedProfile.avatar,
                bio: updatedProfile.bio,
                phone: updatedProfile.phone,
                profession: updatedProfile.profession,
                bloodGroup: updatedProfile.bloodGroup,
                district: updatedProfile.district || updatedProfile.selectedDistrict,
                upazila: updatedProfile.upazila,
                address: updatedProfile.address,
                joinedDate: new Date().toISOString(),
                postsCount: 0,
                followersCount: 0,
                followingCount: 0,
                socialLinks: {
                  facebook: updatedProfile.facebook,
                  twitter: updatedProfile.twitter,
                  instagram: updatedProfile.instagram,
                  linkedin: updatedProfile.linkedin,
                  website: updatedProfile.website
                }
              }];
            });
          } else {
            // Document does not exist, create it
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: localCached?.name || displayName,
              email: email,
              avatar: localCached?.avatar || photoURL || '',
              phone: localCached?.phone || '',
              bio: localCached?.bio || '',
              profession: localCached?.profession || '',
              bloodGroup: localCached?.bloodGroup || '',
              district: localCached?.district || selectedDistrict,
              selectedDistrict: localCached?.selectedDistrict || selectedDistrict,
              upazila: localCached?.upazila || '',
              address: localCached?.address || '',
              facebook: localCached?.facebook || '',
              twitter: localCached?.twitter || '',
              instagram: localCached?.instagram || '',
              linkedin: localCached?.linkedin || '',
              website: localCached?.website || '',
              role: isSuperAdminEmail ? 'super_admin' : (localCached?.role || 'user'),
              savedServices: []
            };
            localStorage.setItem(`smart_khulna_profile_${firebaseUser.uid}`, JSON.stringify(newProfile));
            await setDoc(userDocRef, newProfile, { merge: true });
            setUserProfile(newProfile);
          }
        } catch (e: unknown) {
          console.warn("Firestore user sync encountered issue:", e);
          const errorMsg = e instanceof Error ? e.message : String(e);
          if (errorMsg.includes('insufficient permissions') || errorMsg.includes('permission-denied')) {
            try {
              handleFirestoreError(e, OperationType.GET, `profiles/${firebaseUser.uid}`);
            } catch (handledError) {
              console.error("Structured Firestore error caught:", handledError);
            }
          }
          // Fallback Offline Profile
          const fallbackProfile: UserProfile = localCached || {
            uid: firebaseUser.uid,
            name: displayName,
            email: email,
            avatar: photoURL,
            phone: '',
            bio: '',
            profession: '',
            bloodGroup: '',
            district: selectedDistrict,
            selectedDistrict: selectedDistrict,
            upazila: '',
            address: '',
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            website: '',
            role: isSuperAdminEmail ? 'super_admin' : 'user',
            savedServices: JSON.parse(localStorage.getItem(`favs_${firebaseUser.uid}`) || '[]')
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [selectedDistrict]);

  // Helper: Append Audit Log
  const logAction = async (action: string, target: string, prev = '', nextVal = '') => {
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      user: currentUser?.email || 'Anonymous',
      role: userProfile?.role || 'Guest',
      action,
      target,
      timestamp: new Date().toISOString(),
      previousValue: prev,
      newValue: nextVal
    };

    setAuditLogs(prevLogs => [newLog, ...prevLogs]);

    try {
      await addDoc(collection(db, 'activity_logs'), newLog);
    } catch (e) {
      console.warn("Could not push audit log to Firestore, stored locally", e);
    }
  };

  // Google Login / Logout & Profile Update
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await logAction('ব্যবহারকারী লগইন', `${res.user.email} সফলভাবে লগইন করেছেন`);
    } catch (error: any) {
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/user-cancelled'
      ) {
        return;
      }
      console.warn("Google popup login error, trying redirect:", error);
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError: any) {
        alert(`গুগল লগইন করতে সমস্যা হয়েছে। কারণ: ${error?.message || redirectError?.message || 'Popup blocked'}\n\nপরামর্শ: ব্রাউজারের পপআপ ব্লকার বন্ধ রাখুন অথবা নতুন ট্যাবে অ্যাপটি ওপেন করুন।`);
      }
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে।');
        return;
      }
      try {
        const compressedBase64 = await compressImage(file, 360, 360, 0.82);
        setEditPhotoURL(compressedBase64);
      } catch (err) {
        console.error("Image compression error, falling back to direct reader:", err);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setEditPhotoURL(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSavingProfile(true);
    try {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'profiles', uid);
      const finalName = editDisplayName.trim() || 'ব্যবহারকারী';
      const finalAvatar = editPhotoURL.trim() || userProfile?.avatar || auth.currentUser.photoURL || '';

      // Safely update Firebase Auth state (avoid large base64 crash on photoURL token)
      try {
        await updateProfile(auth.currentUser, {
          displayName: finalName,
          photoURL: finalAvatar.startsWith('data:') ? undefined : finalAvatar
        });
      } catch (authError) {
        console.warn("Auth updateProfile optional sync fallback:", authError);
      }

      const updatedProfileData: Partial<UserProfile> = {
        uid,
        name: finalName,
        email: auth.currentUser.email || '',
        avatar: finalAvatar,
        phone: editPhone.trim(),
        bio: editBio.trim(),
        profession: editProfession.trim(),
        bloodGroup: editBloodGroup.trim(),
        district: editDistrict || selectedDistrict,
        selectedDistrict: editDistrict || selectedDistrict,
        upazila: editUpazila.trim(),
        address: editAddress.trim(),
        facebook: editFacebook.trim(),
        twitter: editTwitter.trim(),
        instagram: editInstagram.trim(),
        linkedin: editLinkedin.trim(),
        website: editWebsite.trim(),
        updatedAt: new Date().toISOString()
      };

      // 1. Sync Firestore
      await setDoc(userDocRef, updatedProfileData, { merge: true });

      // 2. Sync Local Cache
      const fullUpdatedProfile: UserProfile = {
        ...(userProfile || {
          uid,
          email: auth.currentUser.email || '',
          role: 'user',
          selectedDistrict: editDistrict || selectedDistrict,
          savedServices: []
        }),
        ...updatedProfileData
      } as UserProfile;

      localStorage.setItem(`smart_khulna_profile_${uid}`, JSON.stringify(fullUpdatedProfile));

      // 3. Update active React state
      setUserProfile(fullUpdatedProfile);

      // 4. Update community directory user list
      setAllCommunityUsers(prev => {
        const exists = prev.some(u => u.uid === uid);
        if (exists) {
          return prev.map(u => u.uid === uid ? {
            ...u,
            name: fullUpdatedProfile.name,
            avatar: fullUpdatedProfile.avatar,
            bio: fullUpdatedProfile.bio,
            phone: fullUpdatedProfile.phone,
            profession: fullUpdatedProfile.profession,
            bloodGroup: fullUpdatedProfile.bloodGroup,
            district: fullUpdatedProfile.district || fullUpdatedProfile.selectedDistrict,
            upazila: fullUpdatedProfile.upazila,
            address: fullUpdatedProfile.address,
            socialLinks: {
              facebook: fullUpdatedProfile.facebook,
              twitter: fullUpdatedProfile.twitter,
              instagram: fullUpdatedProfile.instagram,
              linkedin: fullUpdatedProfile.linkedin,
              website: fullUpdatedProfile.website
            }
          } : u);
        }
        return [...prev, {
          uid,
          name: fullUpdatedProfile.name,
          email: fullUpdatedProfile.email,
          avatar: fullUpdatedProfile.avatar,
          bio: fullUpdatedProfile.bio,
          phone: fullUpdatedProfile.phone,
          profession: fullUpdatedProfile.profession,
          bloodGroup: fullUpdatedProfile.bloodGroup,
          district: fullUpdatedProfile.district || fullUpdatedProfile.selectedDistrict,
          upazila: fullUpdatedProfile.upazila,
          address: fullUpdatedProfile.address,
          joinedDate: fullUpdatedProfile.joinedDate || new Date().toISOString(),
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          socialLinks: {
            facebook: fullUpdatedProfile.facebook,
            twitter: fullUpdatedProfile.twitter,
            instagram: fullUpdatedProfile.instagram,
            linkedin: fullUpdatedProfile.linkedin,
            website: fullUpdatedProfile.website
          }
        }];
      });

      // 5. Update community posts & comments author cards for current user
      setCommunityPosts(prev => prev.map(p => p.authorId === uid ? {
        ...p,
        authorName: fullUpdatedProfile.name,
        authorAvatar: fullUpdatedProfile.avatar,
        authorDistrict: fullUpdatedProfile.district
      } : p));

      setCommunityComments(prev => {
        const nextState = { ...prev };
        Object.keys(nextState).forEach(postId => {
          nextState[postId] = nextState[postId].map(c => c.authorId === uid ? {
            ...c,
            authorName: fullUpdatedProfile.name,
            authorAvatar: fullUpdatedProfile.avatar
          } : c);
        });
        return nextState;
      });

      setIsEditingProfile(false);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 4000);
      await logAction('প্রোফাইল আপডেট', `${auth.currentUser.email} নিজের প্রোফাইল ছবি ও তথ্য সফলভাবে সংরক্ষণ করেছেন`);
    } catch (err: any) {
      console.error("Profile save error:", err);
      alert('প্রোফাইল সংরক্ষণ করতে সমস্যা হয়েছে: ' + (err.message || err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (emailAuthMode === 'register') {
        const res = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        if (authName.trim() && res.user) {
          await updateProfile(res.user, { displayName: authName.trim() });
        }
        await logAction('ব্যবহারকারী নিবন্ধন', `${authEmail} সফলভাবে রেজিস্টার করেছেন`);
        alert('নিবন্ধন সফল হয়েছে!');
      } else {
        const res = await signInWithEmailAndPassword(auth, authEmail, authPassword);
        await logAction('ব্যবহারকারী লগইন', `${res.user.email} সফলভাবে লগইন করেছেন`);
        alert('লগইন সফল হয়েছে!');
      }
    } catch (err: any) {
      alert('অথেন্টিকেশন ত্রুটি: ' + (err.message || err));
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      await logAction('ব্যবহারকারী লগআউট', `${currentUser.email} সিস্টেম থেকে প্রস্থান করেছেন`);
      await signOut(auth);
    }
  };

  // Save and Update App Release Configuration
  const handleSaveReleaseConfig = async (newConfig: AppReleaseConfig) => {
    setReleaseConfig(newConfig);
    saveLocalData('release_config', newConfig);
    try {
      await setDoc(doc(db, 'settings', 'release_config'), newConfig);
      await logAction('রিলিজ কনফিগারেশন আপডেট', `অ্যাপ রিলিজ সংস্করণ ${newConfig.currentVersion} আপডেট করা হয়েছে`);
      alert('অ্যাপ ও ডাউনলোড কনফিগারেশন সফলভাবে ক্লাউডে আপডেট হয়েছে!');
    } catch (e) {
      console.warn('Saved release config locally:', e);
      await logAction('রিলিজ কনফিগারেশন লোকাল আপডেট', `অ্যাপ রিলিজ সংস্করণ ${newConfig.currentVersion} লোকাল স্টোরেজে সংরক্ষিত হয়েছে`);
      alert('অ্যাপ কনফিগারেশন লোকাল স্টোরেজে সফলভাবে সংরক্ষিত হয়েছে!');
    }
  };

  // District Banner CMS Handlers
  const handleAddBanner = async (newBanner: Partial<Banner>) => {
    const bannerId = newBanner.id || 'banner_' + Date.now();
    const bannerData: Banner = {
      id: bannerId,
      title: newBanner.title || 'ব্যানার শিরোনাম',
      subtitle: newBanner.subtitle || '',
      image: newBanner.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=1000&q=80',
      districtId: newBanner.districtId || 'all',
      actionText: newBanner.actionText || 'বিস্তারিত দেখুন',
      actionType: newBanner.actionType || 'internal',
      actionTarget: newBanner.actionTarget || 'services',
      isActive: newBanner.isActive !== undefined ? newBanner.isActive : true,
      priority: newBanner.priority || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBanners(prev => [bannerData, ...prev]);
    saveLocalData('banners', [bannerData, ...banners]);

    try {
      await setDoc(doc(db, 'banners', bannerId), bannerData);
      await logAction('ব্যানার তৈরি', `নতুন জেলা ব্যানার "${bannerData.title}" (${bannerData.districtId}) যোগ করা হয়েছে`);
    } catch (e) {
      console.warn("Could not save banner to Firestore, saved locally", e);
    }
  };

  const handleUpdateBanner = async (updated: Banner) => {
    setBanners(prev => prev.map(b => b.id === updated.id ? updated : b));
    saveLocalData('banners', banners.map(b => b.id === updated.id ? updated : b));
    try {
      await setDoc(doc(db, 'banners', updated.id), updated, { merge: true });
      await logAction('ব্যানার আপডেট', `ব্যানার "${updated.title}" (${updated.districtId}) আপডেট করা হয়েছে`);
    } catch (e) {
      console.warn("Could not update banner in Firestore, saved locally", e);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    const bannerToDelete = banners.find(b => b.id === bannerId);
    setBanners(prev => prev.filter(b => b.id !== bannerId));
    saveLocalData('banners', banners.filter(b => b.id !== bannerId));
    try {
      await deleteDoc(doc(db, 'banners', bannerId));
      await logAction('ব্যানার অপসারণ', `ব্যানার "${bannerToDelete?.title || bannerId}" মুছে ফেলা হয়েছে`);
    } catch (e) {
      console.warn("Could not delete banner from Firestore, removed locally", e);
    }
  };

  const handleToggleBannerStatus = async (bannerId: string, isActive: boolean) => {
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, isActive } : b));
    saveLocalData('banners', banners.map(b => b.id === bannerId ? { ...b, isActive } : b));
    try {
      await updateDoc(doc(db, 'banners', bannerId), { isActive, updatedAt: new Date().toISOString() });
      await logAction('ব্যানার স্ট্যাটাস পরিবর্তন', `ব্যানার ID ${bannerId} ${isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`);
    } catch (e) {
      console.warn("Could not update banner status in Firestore, updated locally", e);
    }
  };

  // Select District and Store Locally
  const handleSelectDistrict = (districtId: string) => {
    setSelectedDistrict(districtId);
    localStorage.setItem('smart_khulna_selected_district', districtId);
  };

  // Saved/Favorites Operations
  const isSaved = (serviceId: string) => {
    if (userProfile) {
      return userProfile.savedServices?.includes(serviceId) || false;
    }
    const localFavs = JSON.parse(localStorage.getItem('smart_khulna_local_favs') || '[]');
    return localFavs.includes(serviceId);
  };

  const toggleSaveService = async (serviceId: string) => {
    if (currentUser && userProfile) {
      const saved = userProfile.savedServices || [];
      let updatedFavs: string[];
      if (saved.includes(serviceId)) {
        updatedFavs = saved.filter(id => id !== serviceId);
      } else {
        updatedFavs = [...saved, serviceId];
      }

      const updatedProfile = { ...userProfile, savedServices: updatedFavs };
      setUserProfile(updatedProfile);

      try {
        await updateDoc(doc(db, 'profiles', currentUser.uid), { savedServices: updatedFavs });
      } catch (e) {
        console.warn("Could not sync saved services with cloud, using local state", e);
      }
    } else {
      const localFavs = JSON.parse(localStorage.getItem('smart_khulna_local_favs') || '[]');
      let updatedFavs: string[];
      if (localFavs.includes(serviceId)) {
        updatedFavs = localFavs.filter((id: string) => id !== serviceId);
      } else {
        updatedFavs = [...localFavs, serviceId];
      }
      localStorage.setItem('smart_khulna_local_favs', JSON.stringify(updatedFavs));
      // Force render update
      setActiveTab(activeTab); 
    }
  };

  // Submit Information
  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePhone || !newServiceAddress) return;

    const newSubmission = {
      id: 'sub_' + Date.now(),
      name: newServiceName,
      phone: newServicePhone,
      category_id: newServiceCategory,
      district_id: newServiceDistrict,
      upazila_id: newServiceUpazila || 'সদর',
      address: newServiceAddress,
      description: newServiceDescription,
      website: newServiceWebsite,
      facebook: newServiceFacebook,
      status: 'PENDING',
      submitted_by: currentUser?.email || 'অতিথি ব্যবহারকারী',
      created_at: new Date().toISOString()
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    setFormSubmittedSuccess(true);
    await logAction('নতুন তথ্য সাবমিশন', `ব্যবহারকারী "${newServiceName}" তথ্য যোগ করার অনুরোধ করেছেন`);

    // Reset Form
    setNewServiceName('');
    setNewServicePhone('');
    setNewServiceAddress('');
    setNewServiceDescription('');
    setNewServiceWebsite('');
    setNewServiceFacebook('');

    // Auto clear success message
    setTimeout(() => {
      setFormSubmittedSuccess(false);
      setActiveTab('home');
    }, 4000);
  };

  // Gemini AI Grounding search execution
  const executeAIGrounding = async (type: 'search' | 'maps') => {
    if (!searchQuery) return;
    setIsGroundingLoading(true);
    setGroundingType(type);
    setGroundingResult(null);

    try {
      const response = await fetch('/api/gemini/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, type })
      });
      const data = await response.json();
      setGroundingResult({
        content: data.content,
        sources: data.sources || []
      });
    } catch (e) {
      console.error(e);
      setGroundingResult({
        content: `অনুসন্ধান সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।`,
        sources: []
      });
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Share Service
  const handleShareService = (service: Service) => {
    const shareText = `${service.name}\nজেলা: ${initialDistricts.find(d => d.id === service.district_id)?.name || service.district_id}\nবিভাগ: খুলনা\nস্মার্ট খুলনা প্ল্যাটফর্ম লিংক: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('শেয়ার করার জন্য তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  // Dynamic calculations for districts available service counts
  const getServiceCountForDistrict = (districtId: string) => {
    return services.filter(s => s.district_id === districtId && s.status === 'PUBLISHED').length;
  };

  // Filter and search services lists
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // Ensure only published services are shown to normal users
      if (s.status !== 'PUBLISHED') return false;

      // Filter by District
      if (s.district_id !== selectedDistrict) return false;

      // Filter by Category
      if (filterCategory !== 'all' && s.category_id !== filterCategory) return false;

      // Filter by verified status
      if (filterVerifiedOnly && !s.is_verified) return false;

      // Filter by Upazila
      if (filterUpazila && !s.upazila_id.toLowerCase().includes(filterUpazila.toLowerCase())) return false;

      // Match Search query
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(queryLower);
        const matchesDesc = s.description.toLowerCase().includes(queryLower);
        const matchesAddress = s.address.toLowerCase().includes(queryLower);
        const matchesCategory = initialCategories.find(c => c.id === s.category_id)?.name.toLowerCase().includes(queryLower);
        return matchesName || matchesDesc || matchesAddress || matchesCategory;
      }

      return true;
    });
  }, [services, selectedDistrict, filterCategory, filterVerifiedOnly, filterUpazila, searchQuery]);

  // District specific emergency services
  const localEmergencies = useMemo(() => {
    return emergencyContacts.filter(e => !e.districtId || e.districtId === selectedDistrict);
  }, [emergencyContacts, selectedDistrict]);

  // Admin Dashboard Statistics
  const stats = useMemo(() => {
    return {
      totalServices: services.length,
      publishedServices: services.filter(s => s.status === 'PUBLISHED').length,
      pendingSubmissions: submissions.filter(s => s.status === 'PENDING').length,
      verifiedServices: services.filter(s => s.is_verified).length,
      totalLogs: auditLogs.length
    };
  }, [services, submissions, auditLogs]);

  // Handle Submissions Actions (Approve/Reject)
  const handleApproveSubmission = async (sub: any) => {
    // Convert submission to a service
    const newService: Service = {
      id: 'ser_' + Date.now(),
      name: sub.name,
      slug: sub.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      description: sub.description || 'ব্যবহারকারী কর্তৃক জমা দেওয়া স্থানীয় সেবা প্রতিষ্ঠান।',
      category_id: sub.category_id,
      district_id: sub.district_id,
      upazila_id: sub.upazila_id || 'সদর',
      address: sub.address,
      phone: sub.phone,
      website: sub.website || '',
      facebook: sub.facebook || '',
      latitude: 22.82,
      longitude: 89.54,
      opening_hours: 'সকাল ৯:০০ - রাত ৮:০০',
      is_verified: true,
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setServices(prev => [newService, ...prev]);
    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'APPROVED' } : s));
    await logAction('অনুমোদন ও প্রকাশ', `অ্যাডমিন "${sub.name}" সেবাটি অনুমোদন করে ওয়েবসাইটে প্রকাশ করেছেন`);
  };

  const handleRejectSubmission = async (sub: any) => {
    setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'REJECTED' } : s));
    await logAction('প্রত্যাখ্যান', `অ্যাডমিন "${sub.name}" সেবাটি প্রত্যাখ্যান করেছেন`);
  };

  // Handle Emergency contacts updates
  const handleAddEmergency = async (name: string, phone: string, districtId: string) => {
    const newContact: EmergencyContact = {
      id: 'em_' + Date.now(),
      name,
      phone,
      districtId,
      iconName: 'PhoneCall'
    };
    setEmergencyContacts(prev => [...prev, newContact]);
    await logAction('জরুরি নম্বর যুক্ত', `জরুরি নম্বর "${name}" (${phone}) জেলা: ${districtId} এর জন্য যুক্ত করা হয়েছে`);
  };

  const handleDeleteEmergency = async (id: string) => {
    const item = emergencyContacts.find(e => e.id === id);
    setEmergencyContacts(prev => prev.filter(e => e.id !== id));
    await logAction('জরুরি নম্বর ডিলিট', `জরুরি নম্বর "${item?.name || id}" মুছে ফেলা হয়েছে`);
  };

  // User Management Handlers for Admin
  const handleUpdateUserRole = async (targetUid: string, role: 'super_admin' | 'sub_admin' | 'moderator' | 'user') => {
    setAllCommunityUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role } : u));
    try {
      await setDoc(doc(db, 'profiles', targetUid), { role }, { merge: true });
    } catch (e) {
      console.warn("Firestore role sync fallback:", e);
    }
    await logAction('ইউজার রোল পরিবর্তন', `অ্যাডমিন ব্যবহারকারী ${targetUid} এর রোল পরিবর্তন করে "${role}" করেছেন`);
    alert('ব্যবহারকারীর রোল সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleDeleteUser = async (targetUid: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে মুছে ফেলতে চান?')) return;
    setAllCommunityUsers(prev => prev.filter(u => u.uid !== targetUid));
    try {
      await deleteDoc(doc(db, 'profiles', targetUid));
    } catch (e) {
      console.warn("Firestore delete user fallback:", e);
    }
    await logAction('ইউজার মুছে ফেলা', `অ্যাডমিন ব্যবহারকারী ${targetUid} এর অ্যাকাউন্ট মুছে ফেলেছেন`);
    alert('ব্যবহারকারীকে সফলভাবে মুছে ফেলা হয়েছে!');
  };

  // Service Management Handlers for Admin CMS
  const handleAddServiceFromAdmin = async (newSvc: Partial<Service>) => {
    const fullSvc: Service = {
      id: newSvc.id || 'ser_' + Date.now(),
      name: newSvc.name || '',
      slug: (newSvc.name || '').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      description: newSvc.description || 'স্থানীয় সেবা প্রতিষ্ঠান।',
      category_id: newSvc.category_id || 'health',
      district_id: newSvc.district_id || selectedDistrict,
      upazila_id: newSvc.upazila_id || 'সদর',
      address: newSvc.address || '',
      phone: newSvc.phone || '',
      website: newSvc.website || '',
      facebook: newSvc.facebook || '',
      latitude: newSvc.latitude || 22.82,
      longitude: newSvc.longitude || 89.54,
      opening_hours: newSvc.opening_hours || 'সকাল ৯:০০ - রাত ৮:০০',
      is_verified: newSvc.is_verified ?? true,
      status: 'PUBLISHED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setServices(prev => [fullSvc, ...prev]);
    try {
      await setDoc(doc(db, 'services', fullSvc.id), fullSvc);
    } catch (e) {
      console.warn("Firestore service add fallback:", e);
    }
    await logAction('নতুন সেবা সংযোজন', `অ্যাডমিন "${fullSvc.name}" সেবাটি ডেটাবেসে যুক্ত করেছেন`);
    alert('নতুন সেবা সফলভাবে যুক্ত ও প্রকাশিত হয়েছে!');
  };

  const handleUpdateServiceFromAdmin = async (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    try {
      await setDoc(doc(db, 'services', updatedService.id), updatedService, { merge: true });
    } catch (e) {
      console.warn("Firestore service update fallback:", e);
    }
    await logAction('সেবা তথ্য হালনাগাদ', `অ্যাডমিন "${updatedService.name}" এর তথ্য আপডেট করেছেন`);
    alert('সেবার তথ্য সফলভাবে আপডেট হয়েছে!');
  };

  const handleDeleteServiceFromAdmin = async (serviceId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই সেবাটি মুছে ফেলতে চান?')) return;
    const s = services.find(x => x.id === serviceId);
    setServices(prev => prev.filter(x => x.id !== serviceId));
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (e) {
      console.warn("Firestore delete service fallback:", e);
    }
    await logAction('সেবা মুছে ফেলা', `অ্যাডমিন "${s?.name || serviceId}" মুছে ফেলেছেন`);
    alert('সেবাটি সফলভাবে মুছে ফেলা হয়েছে!');
  };

  // Community & Social System Handlers
  const requireAuth = (actionName: string): boolean => {
    if (!currentUser) {
      if (window.confirm(`কমিউনিটিতে ${actionName} করার জন্য গুগল দিয়ে লগইন করতে হবে। আপনি কি এখনই লগইন করতে চান?`)) {
        handleGoogleLogin();
      }
      return false;
    }
    return true;
  };

  const totalUnreadNotifications = useMemo(() => {
    return communityNotifications.filter(n => !n.isRead).length;
  }, [communityNotifications]);

  const totalUnreadMessages = useMemo(() => {
    if (!currentUser?.uid) return 0;
    return conversations.reduce((acc, c) => acc + (c.unreadCounts?.[currentUser.uid] || 0), 0);
  }, [conversations, currentUser]);

  const handleSavePost = async (postData: Partial<CommunityPost>) => {
    if (!currentUser) return;
    const currentUid = currentUser.uid;
    const currentName = currentUser.displayName || 'ব্যবহারকারী';
    const currentEmail = currentUser.email || '';
    const currentAvatar = currentUser.photoURL;

    if (editingPost) {
      setCommunityPosts(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            ...postData,
            updatedAt: new Date().toISOString()
          } as CommunityPost;
        }
        return p;
      }));
      try {
        await setDoc(doc(db, 'posts', editingPost.id), postData, { merge: true });
      } catch (e) {
        console.warn("Firestore post edit sync fallback:", e);
      }
      setEditingPost(null);
    } else {
      const newPost: CommunityPost = {
        id: 'post_' + Date.now(),
        authorId: currentUid,
        authorName: currentName,
        authorEmail: currentEmail,
        authorAvatar: currentAvatar,
        title: postData.title,
        content: postData.content || '',
        type: postData.type || 'general',
        districtId: postData.districtId,
        categoryId: postData.categoryId,
        locationName: postData.locationName,
        images: postData.images || [],
        hashtags: postData.hashtags || [],
        likesCount: 0,
        likedBy: [],
        commentsCount: 0,
        sharesCount: 0,
        savedBy: [],
        status: postData.status || 'published',
        createdAt: new Date().toISOString()
      };
      setCommunityPosts(prev => [newPost, ...prev]);
      try {
        await setDoc(doc(db, 'posts', newPost.id), newPost);
      } catch (e) {
        console.warn("Firestore post save sync fallback:", e);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান?')) return;
    setCommunityPosts(prev => prev.filter(p => p.id !== postId));
    try {
      await setDoc(doc(db, 'posts', postId), { status: 'removed' }, { merge: true });
    } catch (e) {
      console.warn("Firestore delete post fallback:", e);
    }
  };

  const handleToggleLikePost = async (postId: string) => {
    if (!requireAuth('লাইক')) return;
    const isLiked = likedCommunityPostIds.includes(postId);
    if (isLiked) {
      setLikedCommunityPostIds(prev => prev.filter(id => id !== postId));
      setCommunityPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likesCount: Math.max(0, (p.likesCount || 0) - 1),
            likedBy: (p.likedBy || []).filter(uid => uid !== currentUser.uid)
          };
        }
        return p;
      }));
    } else {
      setLikedCommunityPostIds(prev => [...prev, postId]);
      setCommunityPosts(prev => prev.map(p => {
        if (p.id === postId) {
          if (p.authorId !== currentUser.uid) {
            const newNotif: CommunityNotification = {
              id: 'notif_' + Date.now(),
              recipientUid: p.authorId,
              actorUid: currentUser.uid,
              actorName: currentUser.displayName || 'ব্যবহারকারী',
              actorAvatar: currentUser.photoURL,
              type: 'post_like',
              title: 'আপনার পোস্টে লাইক পড়েছে',
              message: `${currentUser.displayName || 'ব্যবহারকারী'} আপনার পোস্টে লাইক দিয়েছেন`,
              targetId: p.id,
              targetType: 'post',
              isRead: false,
              createdAt: new Date().toISOString()
            };
            setCommunityNotifications(n => [newNotif, ...n]);
          }
          return {
            ...p,
            likesCount: (p.likesCount || 0) + 1,
            likedBy: [...(p.likedBy || []), currentUser.uid]
          };
        }
        return p;
      }));
    }
  };

  const handleToggleSavePost = (postId: string) => {
    if (!requireAuth('সংরক্ষণ')) return;
    if (savedCommunityPostIds.includes(postId)) {
      setSavedCommunityPostIds(prev => prev.filter(id => id !== postId));
    } else {
      setSavedCommunityPostIds(prev => [...prev, postId]);
    }
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!requireAuth('মন্তব্য')) return;
    const newComment: PostComment = {
      id: 'comm_' + Date.now(),
      postId,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || 'ব্যবহারকারী',
      authorEmail: currentUser.email || '',
      authorAvatar: currentUser.photoURL,
      content: text,
      likesCount: 0,
      likedBy: [],
      replies: [],
      createdAt: new Date().toISOString()
    };

    setCommunityComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        if (p.authorId !== currentUser.uid) {
          const newNotif: CommunityNotification = {
            id: 'notif_' + Date.now(),
            recipientUid: p.authorId,
            actorUid: currentUser.uid,
            actorName: currentUser.displayName || 'ব্যবহারকারী',
            actorAvatar: currentUser.photoURL,
            type: 'post_comment',
            title: 'নতুন মন্তব্য',
            message: `${currentUser.displayName || 'ব্যবহারকারী'} আপনার পোস্টে মন্তব্য করেছেন: "${text.substring(0, 30)}..."`,
            targetId: postId,
            targetType: 'post',
            isRead: false,
            createdAt: new Date().toISOString()
          };
          setCommunityNotifications(n => [newNotif, ...n]);
        }
        return { ...p, commentsCount: (p.commentsCount || 0) + 1 };
      }
      return p;
    }));
  };

  const handleAddReply = (postId: string, commentId: string, text: string) => {
    if (!requireAuth('উত্তর')) return;
    const newReply: CommentReply = {
      id: 'rep_' + Date.now(),
      commentId,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || 'ব্যবহারকারী',
      authorEmail: currentUser.email || '',
      authorAvatar: currentUser.photoURL,
      content: text,
      likesCount: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    };

    setCommunityComments(prev => {
      const list = prev[postId] || [];
      return {
        ...prev,
        [postId]: list.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          return c;
        })
      };
    });
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setCommunityComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
    }));
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) };
      }
      return p;
    }));
  };

  const handleShareCommunityPost = (post: CommunityPost) => {
    const shareText = `স্মার্ট খুলনা কমিউনিটি পোস্ট:\n"${post.title || post.content.substring(0, 60)}"\nলেখক: ${post.authorName}\nলিংক: ${window.location.origin}?tab=community`;
    if (navigator.share) {
      navigator.share({
        title: post.title || 'স্মার্ট খুলনা পোস্ট',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      alert('পোস্টের লিংক ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  const handleViewProfile = (authorId: string, authorName: string, authorEmail: string) => {
    let targetUser = allCommunityUsers.find(u => u.uid === authorId);
    if (!targetUser) {
      targetUser = {
        uid: authorId,
        name: authorName,
        email: authorEmail,
        district: selectedDistrict,
        bio: 'স্মার্ট খুলনা কমিউনিটি সদস্য।',
        followersCount: 1,
        followingCount: 1,
        postsCount: communityPosts.filter(p => p.authorId === authorId).length,
        badge: 'none',
        joinedDate: new Date().toISOString()
      };
    }
    setSelectedProfileUser(targetUser);
    setShowUserProfileModal(true);
  };

  const handleToggleFollow = (targetUid: string) => {
    if (!requireAuth('Follow')) return;
    if (targetUid === currentUser.uid) return;
    const isFollowing = followingUids.includes(targetUid);
    if (isFollowing) {
      setFollowingUids(prev => prev.filter(id => id !== targetUid));
    } else {
      setFollowingUids(prev => [...prev, targetUid]);
      const newNotif: CommunityNotification = {
        id: 'notif_' + Date.now(),
        recipientUid: targetUid,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName || 'ব্যবহারকারী',
        actorAvatar: currentUser.photoURL,
        type: 'new_follower',
        title: 'নতুন ফলোয়ার',
        message: `${currentUser.displayName || 'ব্যবহারকারী'} আপনাকে ফলো করতে শুরু করেছেন`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setCommunityNotifications(n => [newNotif, ...n]);
    }
  };

  const handleStartMessage = async (targetUid: string, targetName: string, targetEmail: string) => {
    if (!requireAuth('বার্তা পাঠানো')) return;
    if (targetUid === currentUser.uid) {
      alert('নিজের সাথে মেসেজ আদান-প্রদান করা সম্ভব নয়।');
      return;
    }

    let existing = conversations.find(c =>
      c.participantIds.includes(currentUser.uid) && c.participantIds.includes(targetUid)
    );

    if (!existing) {
      const newConvId = 'conv_' + [currentUser.uid, targetUid].sort().join('_');
      existing = {
        id: newConvId,
        participantIds: [currentUser.uid, targetUid],
        participants: {
          [currentUser.uid]: {
            uid: currentUser.uid,
            name: currentUser.displayName || 'ব্যবহারকারী',
            email: currentUser.email || '',
            avatar: currentUser.photoURL
          },
          [targetUid]: {
            uid: targetUid,
            name: targetName,
            email: targetEmail
          }
        },
        unreadCounts: {
          [currentUser.uid]: 0,
          [targetUid]: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        await setDoc(doc(db, 'conversations', newConvId), existing);
        setConversations(prev => [existing!, ...prev]);
      } catch (err) {
        console.error('Failed to create conversation:', err);
        alert('কথোপকথন শুরু করতে সমস্যা হয়েছে।');
        return;
      }
    }

    setActiveConversationId(existing.id);
    setActiveTab('messages');
    setShowUserProfileModal(false);
  };

  const handleSendMessage = async (conversationId: string, text: string, attachmentsOrMediaUrl?: any, mediaType?: 'image' | 'file') => {
    if (!currentUser) return;
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const otherUid = conv.participantIds.find(uid => uid !== currentUser.uid) || '';

    let attachments: any[] = [];
    if (Array.isArray(attachmentsOrMediaUrl)) {
      attachments = attachmentsOrMediaUrl;
    }

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      conversationId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'ব্যবহারকারী',
      senderEmail: currentUser.email || '',
      senderAvatar: currentUser.photoURL,
      text,
      attachments,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    try {
      // 1. Add Message
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), newMsg);
      
      // 2. Update Conversation
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        lastMessage: {
          text: newMsg.text || (attachments.length > 0 && attachments[0].type === 'image' ? '📷 ছবি' : '📎 ফাইল'),
          senderId: newMsg.senderId,
          senderName: newMsg.senderName,
          timestamp: newMsg.createdAt,
          isRead: false
        },
        updatedAt: new Date().toISOString(),
        ['unreadCounts.' + otherUid]: (conv.unreadCounts?.[otherUid] || 0) + 1
      });
      
      // 3. Update Local State (as before)
      setMessagesMap(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg]
      }));

      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: {
              text: newMsg.text || (attachments.length > 0 && attachments[0].type === 'image' ? '📷 ছবি' : '📎 ফাইল'),
              senderId: newMsg.senderId,
              senderName: newMsg.senderName,
              timestamp: newMsg.createdAt,
              isRead: false
            },
            updatedAt: new Date().toISOString(),
            unreadCounts: {
              ...c.unreadCounts,
              [otherUid]: (c.unreadCounts?.[otherUid] || 0) + 1
            }
          };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('মেসেজ পাঠাতে সমস্যা হয়েছে।');
    }

    if (otherUid) {
      const summaryText = text
        ? text.substring(0, 30) + (text.length > 30 ? '...' : '')
        : attachments.length > 0 && attachments[0].type === 'image'
        ? 'একটি ছবি পাঠিয়েছেন'
        : 'একটি ফাইল পাঠিয়েছেন';

      const newNotif: CommunityNotification = {
        id: 'notif_' + Date.now(),
        recipientUid: otherUid,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName || 'ব্যবহারকারী',
        actorAvatar: currentUser.photoURL,
        type: 'new_message',
        title: 'নতুন ব্যক্তিগত বার্তা',
        message: `${currentUser.displayName || 'ব্যবহারকারী'}: ${summaryText}`,
        targetId: conversationId,
        targetType: 'conversation',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setCommunityNotifications(n => [newNotif, ...n]);
    }
  };

  const handleDeleteMessage = async (conversationId: string, messageId: string) => {
    try {
      await deleteDoc(doc(db, 'conversations', conversationId, 'messages', messageId));
      setMessagesMap(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter(m => m.id !== messageId)
      }));
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('মেসেজটি মুছতে সমস্যা হয়েছে।');
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!currentUser || !window.confirm('আপনি কি এই কথোপকথনটি আপনার ভিউ থেকে মুছে ফেলতে চান?')) return;
    try {
      const convRef = doc(db, 'conversations', conversationId);
      await updateDoc(convRef, {
        hiddenForUserIds: [...(conversations.find(c => c.id === conversationId)?.hiddenForUserIds || []), currentUser.uid]
      });
      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      alert('কথোপকথনটি মুছতে সমস্যা হয়েছে।');
    }
  };

  const handleBlockUser = (targetUid: string) => {
    if (!currentUser) return;
    if (window.confirm('আপনি কি এই ব্যবহারকারীকে ব্লক করতে চান? তিনি আপনাকে মেসেজ পাঠাতে পারবেন না।')) {
      setBlockedUserIds(prev => [...new Set([...prev, targetUid])]);
      alert('ব্যবহারকারীকে সফলভাবে ব্লক করা হয়েছে।');
    }
  };

  const handleReport = (type: 'post' | 'comment' | 'user' | 'message', id: string, title: string) => {
    if (!requireAuth('রিপোর্ট')) return;
    setReportModalState({
      isOpen: true,
      targetType: type,
      targetId: id,
      targetTitle: title
    });
  };

  const handleSubmitReport = (
    targetType: 'post' | 'comment' | 'user' | 'message',
    targetId: string,
    reason: ReportReason,
    details: string
  ) => {
    if (!currentUser) return;
    const newReport: CommunityReport = {
      id: 'rep_' + Date.now(),
      targetType,
      targetId,
      targetContentSnippet: reportModalState.targetTitle,
      reportedByUid: currentUser.uid,
      reportedByName: currentUser.displayName || 'ব্যবহারকারী',
      reportedByEmail: currentUser.email || '',
      reason,
      customDetails: details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setCommunityReports(prev => [newReport, ...prev]);
    try {
      setDoc(doc(db, 'reports', newReport.id), newReport);
    } catch (e) {
      console.warn("Firestore report save fallback:", e);
    }
  };

  const handleResolveReport = (reportId: string, resolutionNote: string) => {
    setCommunityReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: 'resolved',
          resolutionNote,
          resolvedByAdmin: currentUser?.email || 'admin'
        };
      }
      return r;
    }));
    const actionLog: ModerationAction = {
      id: 'mod_' + Date.now(),
      actionType: 'resolve_report',
      targetType: 'report',
      targetId: reportId,
      adminEmail: currentUser?.email || 'admin',
      adminRole: userProfile?.role === 'super_admin' ? 'super_admin' : 'sub_admin',
      reason: resolutionNote,
      timestamp: new Date().toISOString()
    };
    setModerationAuditLogs(prev => [actionLog, ...prev]);
  };

  const handleDismissReport = (reportId: string) => {
    setCommunityReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return { ...r, status: 'dismissed', resolvedByAdmin: currentUser?.email || 'admin' };
      }
      return r;
    }));
  };

  const handleHidePost = (postId: string, reason: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'hidden' } : p));
    const actionLog: ModerationAction = {
      id: 'mod_' + Date.now(),
      actionType: 'hide_post',
      targetType: 'post',
      targetId: postId,
      adminEmail: currentUser?.email || 'admin',
      adminRole: userProfile?.role === 'super_admin' ? 'super_admin' : 'sub_admin',
      reason,
      timestamp: new Date().toISOString()
    };
    setModerationAuditLogs(prev => [actionLog, ...prev]);
  };

  const handleRestorePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'published' } : p));
    const actionLog: ModerationAction = {
      id: 'mod_' + Date.now(),
      actionType: 'restore_post',
      targetType: 'post',
      targetId: postId,
      adminEmail: currentUser?.email || 'admin',
      adminRole: userProfile?.role === 'super_admin' ? 'super_admin' : 'sub_admin',
      reason: 'পোস্ট পুনরুদ্ধার করা হয়েছে',
      timestamp: new Date().toISOString()
    };
    setModerationAuditLogs(prev => [actionLog, ...prev]);
  };

  const handleRemovePost = (postId: string, reason: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'removed' } : p));
    const actionLog: ModerationAction = {
      id: 'mod_' + Date.now(),
      actionType: 'remove_post',
      targetType: 'post',
      targetId: postId,
      adminEmail: currentUser?.email || 'admin',
      adminRole: userProfile?.role === 'super_admin' ? 'super_admin' : 'sub_admin',
      reason,
      timestamp: new Date().toISOString()
    };
    setModerationAuditLogs(prev => [actionLog, ...prev]);
  };

  const handleBanUser = (targetUid: string, reason: string) => {
    setBlockedUserIds(prev => [...new Set([...prev, targetUid])]);
    const actionLog: ModerationAction = {
      id: 'mod_' + Date.now(),
      actionType: 'ban_user',
      targetType: 'user',
      targetId: targetUid,
      adminEmail: currentUser?.email || 'admin',
      adminRole: userProfile?.role === 'super_admin' ? 'super_admin' : 'sub_admin',
      reason,
      timestamp: new Date().toISOString()
    };
    setModerationAuditLogs(prev => [actionLog, ...prev]);
    alert('ব্যবহারকারীকে সাময়িক স্থগিত / ব্যান করা হয়েছে।');
  };

  const handleMarkAllNotificationsRead = () => {
    setCommunityNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSelectNotification = (notification: CommunityNotification) => {
    setCommunityNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    setShowNotificationCenter(false);
    if (notification.targetType === 'conversation' && notification.targetId) {
      setActiveConversationId(notification.targetId);
      setActiveTab('messages');
    } else if (notification.targetType === 'post') {
      setActiveTab('community');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center font-sans">
      {/* Animated Branded Launch Screen on cold start */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            sessionStorage.setItem('smart_khulna_splash_shown', 'true');
            setShowSplash(false);
          }}
        />
      )}

      {/* Real-time Connectivity / Offline status banner */}
      <OfflineBanner
        isOnline={isOnline}
        wasOffline={wasOffline}
        onDismissReconnected={resetWasOffline}
      />
      <InstallPromptBanner />



      {/* Main Responsive Layout Wrapper */}
      <div className="w-full max-w-5xl flex-1 bg-white shadow-xl flex flex-col md:flex-row relative">
        
        {/* SIDE PANEL / DESKTOP PREVIEW FRAME (Visible only on medium/large screens) */}
        <div className="hidden md:flex md:w-80 bg-slate-900 text-slate-100 p-6 flex-col justify-between shrink-0 border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-6">
              {/* Modern K Monogram Leaf Logo */}
              <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg border border-lime-400 shrink-0">
                <span className="text-xl font-black text-white tracking-widest relative">K<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-400 rounded-full animate-ping"></span></span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white font-serif">স্মার্ট খুলনা</h1>
                <p className="text-[10px] text-lime-400 font-medium">Smart Khulna local platform</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-serif">
              খুলনা বিভাগের সকল জেলা, জরুরি যোগাযোগ, স্বাস্থ্যসেবা ও পেশাজীবীদের তথ্য নিয়ে সম্পূর্ণ ডিজিটালাইজড লোকাল-সার্ভিস ডিরেক্টরি।
            </p>

            {/* Desktop Navigation Links */}
            <div className="space-y-1 mb-5">
              <button
                onClick={() => navigateTo('home')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'home' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><Home size={15} /> হোম পেজ</span>
              </button>
              <button
                onClick={() => navigateTo('services')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'services' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><Grid size={15} /> সকল নাগরিক সেবা</span>
              </button>
              <button
                onClick={() => navigateTo('community')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'community' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><Users size={15} /> কমিউনিটি সোশ্যাল ফিড</span>
                <span className="text-[9px] bg-emerald-700/80 text-lime-300 px-1.5 py-0.5 rounded-full font-bold">নতুন</span>
              </button>
              <button
                onClick={() => navigateTo('messages')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'messages' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><MessageSquare size={15} /> ব্যক্তিগত মেসেজ</span>
                {totalUnreadMessages > 0 && (
                  <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                    {totalUnreadMessages}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigateTo('saved')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'saved' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><Heart size={15} /> সংরক্ষিত সেবা</span>
              </button>
              <button
                onClick={() => navigateTo('add')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'add' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><Plus size={15} /> নতুন তথ্য যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-lime-400 font-bold uppercase tracking-wider mb-1">সক্রিয় জেলা</p>
                <p className="text-lg font-extrabold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-500" />
                  {initialDistricts.find(d => d.id === selectedDistrict)?.name} জেলা
                </p>
                <p className="text-[11px] text-slate-400 mt-1">খুলনা বিভাগের ১০টি জেলার তথ্যই এখানে আপডেট করা হচ্ছে।</p>
              </div>

              {/* District Status Badge Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="bg-slate-800 p-2 rounded text-center">
                  <span className="block text-white font-bold">{stats.publishedServices}+</span>
                  প্রকাশিত সেবা
                </div>
                <div className="bg-slate-800 p-2 rounded text-center">
                  <span className="block text-lime-400 font-bold">১০টি জেলা</span>
                  কাভারেজ
                </div>
              </div>

              {/* Desktop App Download Widget */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Smartphone size={12} /> স্মার্ট খুলনা অ্যাপ
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-lime-300 font-mono px-1.5 py-0.5 rounded">v{releaseConfig.currentVersion}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">Android, iOS, Windows, Mac ও Web — যেকোনো ডিভাইসে ইনস্টল করে অফলাইনেও ব্যবহার করুন।</p>
                <button
                  onClick={() => navigateTo('download')}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Download size={13} />
                  অ্যাপ ডাউনলোড ও ইনস্টল পেজ
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Quick Admin Navigation Trigger */}
            {(userProfile?.role === 'super_admin' || userProfile?.role === 'sub_admin') && (
              <button
                onClick={() => {
                  setAdminView('dashboard');
                  setActiveTab('profile'); // Place under profile workflow
                }}
                className="w-full bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 text-sm shadow-md cursor-pointer"
              >
                <Shield size={16} />
                অ্যাডমিন ড্যাশবোর্ড
              </button>
            )}

            <div className="text-[10px] text-slate-500 text-center border-t border-slate-800 pt-4 font-serif">
              স্মার্ট খুলনা প্ল্যাটফর্ম © ২০২৬<br />সকল স্বত্ব সংরক্ষিত।
            </div>
          </div>
        </div>

        {/* PRIMARY INTERACTIVE PORTAL (Mobile viewport layout on small screens, expands nicely) */}
        <div className="flex-1 flex flex-col min-h-[85vh] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative pb-16 md:pb-0">
          
          {/* MOBILE HEADER (Visually aligned to the Netrokona Reference Screenshot) */}
          <header className="sticky top-0 bg-white dark:bg-slate-950 border-b border-emerald-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-black text-sm border border-lime-400 shrink-0 shadow-inner">
                K
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-extrabold text-emerald-950 dark:text-emerald-300 tracking-tight font-serif">স্মার্ট খুলনা</span>
                  <span className="text-[9px] bg-lime-100 dark:bg-lime-900/30 text-emerald-800 dark:text-emerald-300 font-bold px-1 rounded">Beta</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-1 font-serif">খুলনা বিভাগের সকল সেবা একসাথে</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Install PWA Prompt Button if Installable */}
              {isInstallable ? (
                <button
                  onClick={installPWA}
                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-2.5 rounded-full flex items-center gap-1 shadow-sm transition animate-pulse cursor-pointer"
                  title="অ্যাপ ইনস্টল করুন"
                >
                  <Download size={13} />
                  <span>ইনস্টল করুন</span>
                </button>
              ) : isInstalled ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-full hidden sm:flex items-center gap-1">
                  <CheckCircle size={10} /> ইনস্টলড
                </span>
              ) : null}

              {/* Quick Link to Download Page */}
              <button
                onClick={() => navigateTo('download')}
                className={`text-xs border font-bold py-1.5 px-2.5 rounded-full flex items-center gap-1 transition cursor-pointer ${
                  activeTab === 'download'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}
                title="অ্যাপ ডাউনলোড ও ইনস্টল সেন্টার"
              >
                <Smartphone size={12} />
                <span className="hidden sm:inline">অ্যাপ পান</span>
              </button>

              <button
                onClick={() => setViewingDistrictId(viewingDistrictId ? null : 'all')}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-1.5 px-2.5 rounded-full flex items-center gap-1 transition"
              >
                <Map size={12} />
                <span className="hidden sm:inline">সকল</span> জেলা
              </button>
              <button
                onClick={() => setDarkMode(prev => !prev)}
                className="p-2 text-emerald-900 hover:bg-emerald-50 dark:text-emerald-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
                title={darkMode ? "লাইট মোড" : "ডার্ক মোড"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setShowNotificationCenter(prev => !prev)}
                className="p-2 text-emerald-900 hover:bg-emerald-50 rounded-full relative cursor-pointer"
                title="বিজ্ঞপ্তি কেন্দ্র"
              >
                <Bell size={18} />
                {totalUnreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 px-1 min-w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center border border-white">
                    {totalUnreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* MAIN PAGE CONTAINER */}
          <main className="flex-1 p-4 overflow-y-auto space-y-5">

            {/* TAB VIEW - HOME */}
            {activeTab === 'home' && !viewingDistrictId && (
              <>
                {/* 1. DISTRICT SELECTOR (Required top of the page) */}
                <div className="bg-gradient-to-br from-emerald-50 to-lime-50/50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      <MapPin size={16} className="text-emerald-700" />
                      আপনার জেলা নির্বাচন করুন
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ১০টি জেলা
                    </span>
                  </div>
                  {/* Horizontal Scroll Selector */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-200">
                    {initialDistricts.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleSelectDistrict(d.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                          selectedDistrict === d.id
                            ? 'bg-emerald-700 text-white shadow-md'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. DYNAMIC DISTRICT HERO BANNER CAROUSEL */}
                <DistrictBannerCarousel
                  banners={banners}
                  selectedDistrict={selectedDistrict}
                  districts={initialDistricts}
                  onNavigateToServices={(dId, catId) => {
                    setSelectedDistrict(dId);
                    if (catId) setFilterCategory(catId);
                    setActiveTab('services');
                  }}
                  onSelectCategory={(catId) => {
                    setFilterCategory(catId);
                    setActiveTab('services');
                  }}
                  onOpenDownload={() => setActiveTab('download')}
                />

                {/* 3. CORE GLOBAL SEARCH ( Bangla & English ) */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="আপনি কী সেবা খুঁজছেন? (যেমন: হাসপাতাল, পুলিশ, ব্যাংক)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent shadow-sm"
                      />
                    </div>
                    <button
                      onClick={() => setShowFiltersModal(true)}
                      className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition shadow-sm"
                      title="ফিল্টার করুন"
                    >
                      <SlidersHorizontal size={18} />
                    </button>
                  </div>

                  {/* Grounding Option Box - Real-time verified search using Gemini AI */}
                  {searchQuery && (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-emerald-700 animate-spin shrink-0" size={16} />
                        <div>
                          <p className="text-xs font-bold text-emerald-950 leading-tight">স্মার্ট এআই ভেরিফাইড সার্চ অপশন</p>
                          <p className="text-[10px] text-slate-500">গুগল রিয়েল-টাইম তথ্য এবং ম্যাপ নির্দেশনা দিয়ে তাৎক্ষণিক ফলাফল পান</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => executeAIGrounding('search')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1 px-2.5 rounded text-[10px] flex items-center gap-1 transition"
                        >
                          <Search size={12} />
                          এআই অনুসন্ধান
                        </button>
                        <button
                          onClick={() => executeAIGrounding('maps')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2.5 rounded text-[10px] flex items-center gap-1 transition"
                        >
                          <Map size={12} />
                          ম্যাপ লোকেশন
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grounding Results Display */}
                  {isGroundingLoading && (
                    <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 text-center shadow-sm">
                      <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-semibold text-slate-500">গুগল থেকে রিয়েল-টাইম ডাটা গ্রাউন্ডিং করা হচ্ছে...</p>
                    </div>
                  )}

                  {groundingResult && (
                    <div className="bg-gradient-to-br from-white to-lime-50/20 border-2 border-emerald-100 rounded-xl p-4 space-y-3 shadow-md relative">
                      <button
                        onClick={() => setGroundingResult(null)}
                        className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
                      >
                        <X size={14} />
                      </button>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                        <Sparkles size={14} className="text-emerald-700" />
                        <span>স্মার্ট খুলনা এআই ভেরিফাইড উত্তর ({groundingType === 'maps' ? 'ম্যাপ ও লোকেশন গাইড' : 'সার্চ ডেটা'})</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line font-serif">
                        {groundingResult.content}
                      </p>
                      {groundingResult.sources.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">তথ্যসূত্র:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {groundingResult.sources.map((src, i) => (
                              <a
                                key={i}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-100 transition"
                              >
                                {src.title || 'Source'}
                                <ExternalLink size={10} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-[9px] text-red-500 italic mt-1 font-bold">⚠️ সতর্কীকরণ: এই উত্তরটি এআই দ্বারা জেনারেট করা। জরুরি যোগাযোগ নিশ্চিত করুন।</p>
                    </div>
                  )}
                </div>

                {/* 4. EMERGENCY SERVICES (Compact Mobile App Grid matching reference interface) */}
                <section className="bg-white border border-rose-100/90 rounded-2xl p-3 sm:p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-red-950 font-serif">জরুরি সেবা</h3>
                        <p className="text-[10px] text-slate-500 leading-none mt-0.5">দ্রুত সহায়তা পেতে আইকনে ক্লিক করুন</p>
                      </div>
                    </div>
                    {userProfile?.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          setAdminView('emergencies');
                          setActiveTab('profile');
                        }}
                        className="text-[10px] text-red-700 bg-red-50 font-bold px-2 py-0.5 rounded border border-rose-100 hover:bg-red-100"
                      >
                        সম্পাদনা
                      </button>
                    )}
                  </div>

                  {/* 4 Emergency Services Compact Shortcut Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {/* Police */}
                    <a
                      href={`tel:${localEmergencies.find(e => e.iconName === 'Shield' || e.name.includes('পুলিশ'))?.phone || '01713-373265'}`}
                      className="bg-white hover:bg-sky-50/50 border border-slate-100 hover:border-sky-200 rounded-xl p-2 flex flex-col items-center justify-center text-center transition cursor-pointer group aspect-square shadow-xs"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0">
                        <Shield size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">পুলিশ</span>
                    </a>

                    {/* Ambulance */}
                    <a
                      href={`tel:${localEmergencies.find(e => e.iconName === 'Ambulance' || e.name.includes('অ্যাম্বুলেন্স'))?.phone || '01711-295328'}`}
                      className="bg-white hover:bg-rose-50/50 border border-slate-100 hover:border-rose-200 rounded-xl p-2 flex flex-col items-center justify-center text-center transition cursor-pointer group aspect-square shadow-xs"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0">
                        <Ambulance size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">অ্যাম্বুলেন্স</span>
                    </a>

                    {/* Fire Service */}
                    <a
                      href={`tel:${localEmergencies.find(e => e.iconName === 'Flame' || e.name.includes('ফায়ার') || e.name.includes('ফায়ার'))?.phone || '02-477722222'}`}
                      className="bg-white hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200 rounded-xl p-2 flex flex-col items-center justify-center text-center transition cursor-pointer group aspect-square shadow-xs"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0">
                        <Flame size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">ফায়ার সার্ভিস</span>
                    </a>

                    {/* National Helpline */}
                    <a
                      href={`tel:${emergencyContacts.find(e => e.id === 'nat-999')?.phone || '999'}`}
                      className="bg-white hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 rounded-xl p-2 flex flex-col items-center justify-center text-center transition cursor-pointer group aspect-square shadow-xs"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0">
                        <PhoneCall size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">জাতীয় হেল্পলাইন</span>
                    </a>
                  </div>
                </section>

                {/* 5. POPULAR SERVICES GRID (Compact App-Icon Grid matching reference interface) */}
                <section className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 font-serif">
                      <span className="text-base">🔥</span>
                      <span>জনপ্রিয় সেবা</span>
                    </h2>
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setActiveTab('services');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>সব সেবা দেখুন</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
                    {initialCategories.slice(0, 8).map(cat => {
                      const style = getCategoryStyle(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setFilterCategory(cat.id);
                            setActiveTab('services');
                          }}
                          className="bg-white dark:bg-slate-800/80 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/40 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer aspect-square min-h-[84px] sm:min-h-[92px] group"
                        >
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${style.bg} ${style.text} flex items-center justify-center mb-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0 shadow-2xs`}>
                            <IconComponent name={cat.iconName} className={style.text} />
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 text-center leading-tight line-clamp-2 w-full px-0.5 transition-colors duration-200">
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 5.5 ALL CATEGORIES GRID (Compact App-Icon Grid matching reference interface) */}
                <section className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 font-serif">
                      <LayoutGrid size={16} className="text-emerald-700" />
                      <span>সকল বিভাগ</span>
                    </h2>
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setActiveTab('services');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>বিভাগগুলো দেখুন</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5">
                    {initialCategories.slice(8).map(cat => {
                      const style = getCategoryStyle(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setFilterCategory(cat.id);
                            setActiveTab('services');
                          }}
                          className="bg-white dark:bg-slate-800/80 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/40 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer aspect-square min-h-[84px] sm:min-h-[92px] group"
                        >
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${style.bg} ${style.text} flex items-center justify-center mb-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0 shadow-2xs`}>
                            <IconComponent name={cat.iconName} className={style.text} />
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 text-center leading-tight line-clamp-2 w-full px-0.5 transition-colors duration-200">
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 6. PROMOTED / FEATURED LOCAL SERVICES */}
                {services.filter(s => s.isFeatured && s.status === 'PUBLISHED' && s.district_id === selectedDistrict).length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-base font-extrabold text-emerald-950 flex items-center gap-1.5 font-serif">
                      <ThumbsUp size={18} className="text-emerald-700" />
                      স্পেশাল ও ভেরিফাইড সেবা
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {services
                        .filter(s => s.isFeatured && s.status === 'PUBLISHED' && s.district_id === selectedDistrict)
                        .map(service => {
                          const cat = initialCategories.find(c => c.id === service.category_id);
                          const style = getCategoryStyle(service.category_id);
                          return (
                            <div
                              key={service.id}
                              onClick={() => setSelectedService(service)}
                              className="bg-white hover:bg-emerald-50/20 border border-emerald-100 hover:border-emerald-200 p-3 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm transition cursor-pointer group"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                                    {service.photos && service.photos[0] ? (
                                      <img src={service.photos[0]} alt={service.name} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                      <IconComponent name={cat?.iconName || 'Grid'} className={style.text} />
                                    )}
                                  </div>
                                  <span className="bg-lime-100 text-emerald-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded">ফিচার্ড</span>
                                </div>
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase inline-block mb-1">
                                  {cat?.name || 'সেবা'}
                                </span>
                                <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight">{service.name}</h3>
                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{service.address}</p>
                              </div>
                              
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50">
                                <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                                  <Clock size={10} className="text-emerald-700 shrink-0" />
                                  <span className="truncate">{service.opening_hours}</span>
                                </span>
                                <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                                  দেখুন
                                  <ChevronRight size={11} />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </section>
                )}

                {/* 7. APP DOWNLOAD PROMO BANNER & QUICK SERVICE ADD CTA */}
                <div className="space-y-3">
                  {/* Visual Reference-aligned App Download Banner */}
                  <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-5 rounded-2xl shadow-md relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-lime-400/10 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-lime-400 text-emerald-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            সকল ডিভাইসে
                          </span>
                          <span className="text-[11px] text-lime-200 font-medium">Android • iOS • Windows • Mac • Web</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white font-serif">
                          এক ক্লিকে সকল সেবা — খুলনা এখন আরও কাছে
                        </h4>
                        <p className="text-[11px] text-emerald-100/90 leading-snug">
                          ইন্টারনেট ছাড়া জরুরি সেবা ও হাসপাতালের যোগাযোগের জন্য স্মার্ট খুলনা ইনস্টল করুন।
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isInstallable && (
                          <button
                            onClick={installPWA}
                            className="bg-lime-400 hover:bg-lime-300 text-emerald-950 font-black py-2 px-3.5 rounded-xl text-xs transition shadow cursor-pointer flex items-center gap-1.5"
                          >
                            <Download size={14} />
                            <span>অ্যাপ ইনস্টল করুন</span>
                          </button>
                        )}
                        <button
                          onClick={() => navigateTo('download')}
                          className="bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold py-2 px-3.5 rounded-xl text-xs transition shadow cursor-pointer flex items-center gap-1.5"
                        >
                          <Smartphone size={14} />
                          <span>ডাউনলোড পেজ →</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add Service Information CTA */}
                  <div className="bg-emerald-950 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-lime-300">আপনার এলাকার তথ্য এখানে নেই?</h4>
                      <p className="text-[10px] text-emerald-100 mt-1">যেকোনো স্থানীয় সেবা, ব্যবসা বা পেশাদার তথ্য যুক্ত করতে আমাদের জানান</p>
                    </div>
                    <button
                      onClick={() => navigateTo('add')}
                      className="bg-lime-400 hover:bg-lime-300 text-emerald-950 font-black py-2 px-3 rounded-xl text-xs transition whitespace-nowrap shadow cursor-pointer"
                    >
                      তথ্য যোগ করুন
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* TAB VIEW - ALL DISTRICTS LIST PAGE */}
            {viewingDistrictId === 'all' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewingDistrictId(null)} className="p-1 hover:bg-slate-100 rounded-full">
                    <ChevronLeft size={20} className="text-slate-600" />
                  </button>
                  <h2 className="text-base font-extrabold text-emerald-950 font-serif">খুলনা বিভাগের সকল জেলা ({initialDistricts.length}টি)</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {initialDistricts.map(dist => {
                    const cnt = getServiceCountForDistrict(dist.id);
                    return (
                      <div
                        key={dist.id}
                        onClick={() => {
                          handleSelectDistrict(dist.id);
                          setViewingDistrictId(dist.id);
                        }}
                        className="bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl overflow-hidden shadow-sm hover:shadow transition flex cursor-pointer"
                      >
                        <img src={dist.image} alt={dist.name} className="w-24 h-full object-cover shrink-0" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 font-serif">{dist.name} জেলা</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">{dist.nameEn} District</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                              {cnt}+ সেবা তথ্য
                            </span>
                            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                              দেখুন
                              <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DISTRICT DETAIL LANDING PAGE VIEW */}
            {viewingDistrictId && viewingDistrictId !== 'all' && (
              <div className="space-y-4">
                {(() => {
                  const currentDist = initialDistricts.find(d => d.id === viewingDistrictId);
                  if (!currentDist) return null;
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingDistrictId(null)} className="p-1 hover:bg-slate-100 rounded-full">
                          <ChevronLeft size={20} className="text-slate-600" />
                        </button>
                        <h2 className="text-base font-extrabold text-slate-900 font-serif">{currentDist.name} জেলা পরিচিতি ও ডিরেক্টরি</h2>
                      </div>

                      {/* District Banner info */}
                      <div className="relative h-44 rounded-2xl overflow-hidden shadow-md">
                        <img src={currentDist.image} alt={currentDist.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <h1 className="text-lg font-bold text-white font-serif">{currentDist.name} জেলা</h1>
                          <p className="text-xs text-slate-300">খুলনা বিভাগের অধীনে একটি অন্যতম প্রশাসনিক ও গুরুত্বপূর্ণ অঞ্চল।</p>
                        </div>
                      </div>

                      {/* District specific local filters */}
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-3">
                        <h3 className="text-xs font-bold text-emerald-950">জেলাভিত্তিক স্থানীয় সেবা খুঁজুন</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedDistrict(currentDist.id);
                              setFilterCategory('all');
                              setViewingDistrictId(null);
                              setActiveTab('services');
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-lg text-xs transition w-full"
                          >
                            সকল সেবা অন্বেষণ করুন
                          </button>
                        </div>
                      </div>

                      {/* Filter services list in current district detail */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-700">জনপ্রিয় সেবা ও প্রতিষ্ঠান সমূহ</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {services
                            .filter(s => s.district_id === currentDist.id && s.status === 'PUBLISHED')
                            .slice(0, 8)
                            .map(s => {
                              const cat = initialCategories.find(c => c.id === s.category_id);
                              const style = getCategoryStyle(s.category_id);
                              return (
                                <div
                                  key={s.id}
                                  onClick={() => setSelectedService(s)}
                                  className="bg-white hover:bg-emerald-50/20 border border-slate-100 hover:border-emerald-200 p-3 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm transition cursor-pointer group"
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                                        {s.photos && s.photos[0] ? (
                                          <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                          <IconComponent name={cat?.iconName || 'Grid'} className={style.text} />
                                        )}
                                      </div>
                                      {s.is_verified && (
                                        <span className="bg-blue-50 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                          <CheckCircle size={9} className="fill-blue-500 text-white" />
                                          ভেরিফাইড
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase inline-block mb-1">
                                      {cat?.name || 'সেবা'}
                                    </span>
                                    <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight">{s.name}</h3>
                                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{s.address}</p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50">
                                    <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                                      <Clock size={10} className="text-emerald-700 shrink-0" />
                                      <span className="truncate">{s.opening_hours}</span>
                                    </span>
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                                      দেখুন
                                      <ChevronRight size={11} />
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB VIEW - SERVICES BROWSER DIRECTORY */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 font-serif">ডিজিটাল সেবা নির্দেশিকা</h2>
                    <p className="text-xs text-slate-500">
                      {initialDistricts.find(d => d.id === selectedDistrict)?.name} জেলায় {filteredServices.length}টি সেবা তালিকাভুক্ত আছে।
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFiltersModal(true)}
                    className="flex items-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-900 font-bold py-1.5 px-3 rounded-lg"
                  >
                    <Filter size={14} />
                    ফিল্টার
                  </button>
                </div>

                {/* Category Grid Filter matching Home page style */}
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer aspect-square min-h-[76px] group ${
                      filterCategory === 'all'
                        ? 'bg-emerald-700 text-white shadow-md border border-emerald-800'
                        : 'bg-white hover:bg-emerald-50/30 text-slate-800 border border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${filterCategory === 'all' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-700'} flex items-center justify-center mb-1 transition shrink-0`}>
                      <Grid size={18} />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight line-clamp-2 w-full px-0.5">
                      সব ক্যাটাগরি
                    </span>
                  </button>
                  {initialCategories.map(cat => {
                    const style = getCategoryStyle(cat.id);
                    const isSelected = filterCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.id)}
                        className={`p-2 rounded-2xl flex flex-col items-center justify-center text-center transition cursor-pointer aspect-square min-h-[76px] group ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-md border border-emerald-800'
                            : 'bg-white hover:bg-emerald-50/30 text-slate-800 border border-slate-100 hover:border-emerald-200'
                        }`}
                      >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${isSelected ? 'bg-emerald-800 text-white' : `${style.bg} ${style.text}`} flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0 shadow-2xs`}>
                          <IconComponent name={cat.iconName} className={isSelected ? 'text-white' : style.text} />
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-bold text-center leading-tight line-clamp-2 w-full px-0.5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Services List Display */}
                {filteredServices.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-3 shadow-sm">
                    <AlertTriangle className="text-slate-400 mx-auto" size={32} />
                    <p className="text-xs font-bold text-slate-600">কোনো তথ্য বা সেবা খুঁজে পাওয়া যায়নি</p>
                    <p className="text-[11px] text-slate-400">ফিল্টার পরিবর্তন করে অথবা অন্য কোনো জেলায় অনুসন্ধান করুন।</p>
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setFilterVerifiedOnly(false);
                        setFilterUpazila('');
                        setSearchQuery('');
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition mt-2 cursor-pointer"
                    >
                      রিসেট ফিল্টার
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredServices.map(service => {
                      const cat = initialCategories.find(c => c.id === service.category_id);
                      const style = getCategoryStyle(service.category_id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className="bg-white hover:bg-emerald-50/20 border border-slate-100 hover:border-emerald-200 p-3 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm transition cursor-pointer group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                                {service.photos && service.photos[0] ? (
                                  <img src={service.photos[0]} alt={service.name} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                  <IconComponent name={cat?.iconName || 'Grid'} className={style.text} />
                                )}
                              </div>
                              {service.is_verified && (
                                <span className="bg-blue-50 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <CheckCircle size={9} className="fill-blue-500 text-white" />
                                  ভেরিফাইড
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase inline-block mb-1">
                              {cat?.name || 'সেবা'}
                            </span>
                            <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight">{service.name}</h3>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">ঠিকানা: {service.address}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50">
                            <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                              <Clock size={10} className="text-emerald-700 shrink-0" />
                              <span className="truncate">{service.opening_hours}</span>
                            </span>
                            <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                              দেখুন
                              <ChevronRight size={11} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB VIEW - SUBMIT INFORMATION */}
            {activeTab === 'add' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 font-serif">নতুন সেবার তথ্য যুক্ত করুন</h2>
                  <p className="text-xs text-slate-500">আপনার এলাকায় তালিকাভুক্ত নয় এমন কোনো নতুন প্রতিষ্ঠান বা সেবার তথ্য দিন। আমাদের অ্যাডমিন প্যানেল এটি পর্যালোচনা করে প্রকাশ করবে।</p>
                </div>

                {formSubmittedSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                    <CheckCircle className="text-emerald-700 mx-auto" size={44} />
                    <h3 className="text-sm font-bold text-emerald-950">সফলভাবে তথ্য জমা দেওয়া হয়েছে!</h3>
                    <p className="text-xs text-slate-600">আপনার সাবমিট করা তথ্য অ্যাডমিন প্যানেলের পর্যালোচনার অপেক্ষায় রয়েছে। খুব শীঘ্রই এটি ওয়েবসাইটে প্রকাশিত হবে।</p>
                    <button
                      onClick={() => setFormSubmittedSuccess(false)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded-xl text-xs transition"
                    >
                      আরো তথ্য যোগ করুন
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitService} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="উদা: খুলনা জেনারেল ফার্মা"
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল / ফোন নম্বর <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="উদা: 01712-345678"
                          value={newServicePhone}
                          onChange={(e) => setNewServicePhone(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি <span className="text-red-500">*</span></label>
                        <select
                          value={newServiceCategory}
                          onChange={(e) => setNewServiceCategory(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        >
                          {initialCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">জেলা নির্বাচন করুন <span className="text-red-500">*</span></label>
                        <select
                          value={newServiceDistrict}
                          onChange={(e) => setNewServiceDistrict(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        >
                          {initialDistricts.map(dist => (
                            <option key={dist.id} value={dist.id}>{dist.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা / এলাকা</label>
                        <input
                          type="text"
                          placeholder="উদা: সোনাডাঙ্গা, খুলনা সদর"
                          value={newServiceUpazila}
                          onChange={(e) => setNewServiceUpazila(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ওয়েবসাইট লিংক (ঐচ্ছিক)</label>
                        <input
                          type="url"
                          placeholder="উদা: https://example.com"
                          value={newServiceWebsite}
                          onChange={(e) => setNewServiceWebsite(e.target.value)}
                          className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত ঠিকানা <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="উদা: সড়ক নং- ৫, সোনাডাঙ্গা আ/এ, খুলনা"
                        value={newServiceAddress}
                        onChange={(e) => setNewServiceAddress(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত বর্ণনা ও সেবার বিস্তারিত বিবরণ</label>
                      <textarea
                        rows={3}
                        placeholder="এখানে সেবাটির সুবিধা, সময়সূচী বা স্পেশালিটি সম্পর্কে সংক্ষেপে লিখুন..."
                        value={newServiceDescription}
                        onChange={(e) => setNewServiceDescription(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider shadow-sm cursor-pointer"
                    >
                      তথ্য সাবমিট করুন
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB VIEW - SAVED / BOOKMARKS */}
            {activeTab === 'saved' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 font-serif">আপনার সংরক্ষিত তালিকা</h2>
                  <p className="text-xs text-slate-500">জরুরি প্রয়োজনের জন্য বুকমার্ক করে রাখা সেবা এবং প্রতিষ্ঠান সমূহ।</p>
                </div>

                {/* Filter saved list */}
                {(() => {
                  const savedList = services.filter(s => isSaved(s.id));
                  if (savedList.length === 0) {
                    return (
                      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-3 shadow-sm">
                        <Heart className="text-slate-300 mx-auto" size={32} />
                        <p className="text-xs font-bold text-slate-500">তালিকাটি বর্তমানে খালি আছে</p>
                        <p className="text-[11px] text-slate-400">গুরুত্বপূর্ণ সেবাগুলোর পাশে সংরক্ষণ (♡) আইকনে ক্লিক করে জমা রাখুন।</p>
                        <button
                          onClick={() => setActiveTab('services')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition mt-2"
                        >
                          সেবা সমূহে যান
                        </button>
                      </div>
                    );
                  }
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {savedList.map(s => {
                        const cat = initialCategories.find(c => c.id === s.category_id);
                        const style = getCategoryStyle(s.category_id);
                        return (
                          <div
                            key={s.id}
                            className="bg-white hover:bg-emerald-50/20 border border-slate-100 hover:border-emerald-200 p-3 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm transition group"
                          >
                            <div className="cursor-pointer" onClick={() => setSelectedService(s)}>
                              <div className="flex items-center justify-between mb-2">
                                <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                                  <IconComponent name={cat?.iconName || 'Grid'} className={style.text} />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaveService(s.id);
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
                                  title="সংরক্ষণ বাতিল"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase inline-block mb-1">
                                {cat?.name || 'সেবা'}
                              </span>
                              <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight">{s.name}</h3>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{s.address}</p>
                            </div>
                            
                            <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-end">
                              <button
                                onClick={() => setSelectedService(s)}
                                className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-0.5 hover:underline cursor-pointer"
                              >
                                বিস্তারিত দেখুন
                                <ChevronRight size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB VIEW - PROFILE & ADMIN CONTROL PANEL PANEL */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                {/* 1. AUTH GUEST OR USER CARD */}
                {!currentUser ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm text-left">
                    <div className="text-center">
                      <User className="text-emerald-700 mx-auto mb-2" size={40} />
                      <h3 className="text-sm font-bold text-slate-900">স্মার্ট খুলনা অ্যাকাউন্ট</h3>
                      <p className="text-xs text-slate-500 mt-1">গুগল দিয়ে অথবা ইমেইল দিয়ে রেজিস্টার বা লগইন করুন।</p>
                    </div>

                    <button
                      onClick={handleGoogleLogin}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                    >
                      <Sparkles size={14} className="text-lime-300" />
                      Google অ্যাকাউন্ট দিয়ে লগইন করুন
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-200"></div>
                      <span className="flex-shrink mx-4 text-slate-400 text-[10px]">অথবা ইমেইল দিয়ে</span>
                      <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Toggle Login vs Register */}
                    <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-center">
                      <button
                        type="button"
                        onClick={() => setEmailAuthMode('login')}
                        className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${emailAuthMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                      >
                        লগইন
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailAuthMode('register')}
                        className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${emailAuthMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                      >
                        রেজিস্ট্রেশন
                      </button>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-3">
                      {emailAuthMode === 'register' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">আপনার নাম</label>
                          <input
                            type="text"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            required
                            placeholder="পূর্ণ নাম লিখুন"
                            className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          required
                          placeholder="example@gmail.com"
                          className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">পাসওয়ার্ড</label>
                        <input
                          type="password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                          className="w-full border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer shadow-sm"
                      >
                        {emailAuthMode === 'register' ? 'অ্যাকাউন্ট তৈরি করুন (Register)' : 'লগইন করুন (Login)'}
                      </button>
                    </form>
                    <p className="text-[10px] text-slate-400 text-center">আমরা আপনার তথ্যের গোপনীয়তা ও সুরক্ষা নিশ্চিত করি।</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* PROFILE HEADER CARD */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-900/40 relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div className="relative group">
                            {userProfile?.avatar || currentUser.photoURL ? (
                              <img
                                src={userProfile?.avatar || currentUser.photoURL}
                                alt="Profile Avatar"
                                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400/80 shadow-md shrink-0 bg-slate-800"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-emerald-800 border-2 border-emerald-400/50 rounded-full flex items-center justify-center font-bold text-white text-xl uppercase shrink-0 shadow-inner">
                                {(userProfile?.name || currentUser.displayName || 'U').substring(0, 2)}
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingProfile(true);
                                setEditDisplayName(userProfile?.name || currentUser.displayName || '');
                                setEditPhotoURL(userProfile?.avatar || currentUser.photoURL || '');
                                setEditPhone(userProfile?.phone || '');
                                setEditBio(userProfile?.bio || '');
                                setEditProfession(userProfile?.profession || '');
                                setEditBloodGroup(userProfile?.bloodGroup || '');
                                setEditDistrict(userProfile?.district || userProfile?.selectedDistrict || selectedDistrict);
                                setEditUpazila(userProfile?.upazila || '');
                                setEditAddress(userProfile?.address || '');
                                setEditFacebook(userProfile?.facebook || '');
                                setEditTwitter(userProfile?.twitter || '');
                                setEditInstagram(userProfile?.instagram || '');
                                setEditLinkedin(userProfile?.linkedin || '');
                                setEditWebsite(userProfile?.website || '');
                              }}
                              className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md transition cursor-pointer"
                              title="ছবি পরিবর্তন করুন"
                            >
                              <Camera size={12} />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                                {userProfile?.name || currentUser.displayName || 'সম্মানিত নাগরিক'}
                              </h3>
                              <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                                {userProfile?.role === 'super_admin' ? 'সুপার এডমিন' : userProfile?.role === 'sub_admin' ? 'সাব-এডমিন' : userProfile?.role === 'moderator' ? 'মডারেটর' : 'নাগরিক'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 flex items-center gap-1.5">
                              <span>{currentUser.email}</span>
                              {userProfile?.phone && (
                                <>
                                  <span className="text-slate-500">•</span>
                                  <span className="text-emerald-300 font-medium">{userProfile.phone}</span>
                                </>
                              )}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[11px]">
                              {(userProfile?.district || userProfile?.selectedDistrict) && (
                                <span className="bg-white/10 text-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                                  <MapPin size={11} className="text-emerald-400" />
                                  {initialDistricts.find(d => d.id === (userProfile?.district || userProfile?.selectedDistrict))?.name || userProfile?.district || selectedDistrict}
                                  {userProfile?.upazila ? ` • ${userProfile.upazila}` : ''}
                                </span>
                              )}
                              {userProfile?.profession && (
                                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                                  <Briefcase size={11} />
                                  {userProfile.profession}
                                </span>
                              )}
                              {userProfile?.bloodGroup && (
                                <span className="bg-rose-500/20 text-rose-200 border border-rose-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                                  <Droplets size={11} className="text-rose-400" />
                                  {userProfile.bloodGroup}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => {
                              const willEdit = !isEditingProfile;
                              setIsEditingProfile(willEdit);
                              if (willEdit) {
                                setEditDisplayName(userProfile?.name || currentUser.displayName || '');
                                setEditPhotoURL(userProfile?.avatar || currentUser.photoURL || '');
                                setEditPhone(userProfile?.phone || '');
                                setEditBio(userProfile?.bio || '');
                                setEditProfession(userProfile?.profession || '');
                                setEditBloodGroup(userProfile?.bloodGroup || '');
                                setEditDistrict(userProfile?.district || userProfile?.selectedDistrict || selectedDistrict);
                                setEditUpazila(userProfile?.upazila || '');
                                setEditAddress(userProfile?.address || '');
                                setEditFacebook(userProfile?.facebook || '');
                                setEditTwitter(userProfile?.twitter || '');
                                setEditInstagram(userProfile?.instagram || '');
                                setEditLinkedin(userProfile?.linkedin || '');
                                setEditWebsite(userProfile?.website || '');
                              }
                            }}
                            className="px-3.5 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs border border-emerald-500/40"
                          >
                            <Edit2 size={13} />
                            <span>{isEditingProfile ? 'সম্পাদনা বন্ধ' : 'প্রোফাইল পরিবর্তন'}</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="p-2 bg-white/10 hover:bg-rose-600/80 text-white rounded-xl transition cursor-pointer"
                            title="লগআউট"
                          >
                            <LogOut size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SAVE SUCCESS NOTIFICATION */}
                    {profileSaveSuccess && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
                        <CheckCircle size={16} className="text-emerald-700 shrink-0" />
                        <span>আপনার প্রোফাইল ছবি, নাম ও যাবতীয় তথ্য ডাটাবেজে সফলভাবে সংরক্ষণ করা হয়েছে!</span>
                      </div>
                    )}

                    {/* PROFILE DETAILS OVERVIEW (READ-ONLY) */}
                    {!isEditingProfile && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <User size={15} className="text-emerald-700" />
                            নাগরিক প্রোফাইল তথ্যাবলী
                          </h4>
                          <span className="text-[11px] text-slate-400">সর্বশেষ আপডেট: {userProfile?.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString('bn-BD') : 'আজ'}</span>
                        </div>

                        {/* Grid details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">পূর্ণ নাম</span>
                            <span className="font-bold text-slate-900 text-sm">{userProfile?.name || currentUser.displayName || 'নাম প্রদান করা হয়নি'}</span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">মোবাইল ফোন নম্বর</span>
                            <span className="font-bold text-emerald-800 text-sm">
                              {userProfile?.phone ? userProfile.phone : <span className="text-slate-400 font-normal italic">নম্বর যোগ করা হয়নি</span>}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">পেশা / পদবী</span>
                            <span className="font-semibold text-slate-800">
                              {userProfile?.profession ? userProfile.profession : <span className="text-slate-400 font-normal italic">পেশা উল্লেখ নেই</span>}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">রক্তের গ্রুপ</span>
                            <span className="font-bold text-rose-700">
                              {userProfile?.bloodGroup ? (
                                <span className="bg-rose-50 px-2 py-0.5 rounded border border-rose-200">🩸 {userProfile.bloodGroup}</span>
                              ) : (
                                <span className="text-slate-400 font-normal italic">রক্তের গ্রুপ দেওয়া নেই</span>
                              )}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">জেলা ও উপজেলা</span>
                            <span className="font-semibold text-slate-800">
                              {initialDistricts.find(d => d.id === (userProfile?.district || userProfile?.selectedDistrict))?.name || userProfile?.district || 'খুলনা'}
                              {userProfile?.upazila ? ` • ${userProfile.upazila}` : ''}
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                            <span className="text-[11px] font-bold text-slate-400 block uppercase">ঠিকানা</span>
                            <span className="text-slate-700">
                              {userProfile?.address || <span className="text-slate-400 italic">ঠিকানা দেওয়া হয়নি</span>}
                            </span>
                          </div>
                        </div>

                        {/* Bio */}
                        {userProfile?.bio && (
                          <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-1">
                            <span className="text-[11px] font-bold text-emerald-900 block">নিজের সম্পর্কে (Bio):</span>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{userProfile.bio}</p>
                          </div>
                        )}

                        {/* Social profiles if available */}
                        {(userProfile?.facebook || userProfile?.twitter || userProfile?.instagram || userProfile?.linkedin || userProfile?.website) && (
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-500 block mb-2">সংযুক্ত সামাজিক যোগাযোগ মাধ্যম:</span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {userProfile.facebook && (
                                <a
                                  href={userProfile.facebook}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <span>Facebook</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                              {userProfile.twitter && (
                                <a
                                  href={userProfile.twitter}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <span>Twitter / X</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                              {userProfile.instagram && (
                                <a
                                  href={userProfile.instagram}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <span>Instagram</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                              {userProfile.linkedin && (
                                <a
                                  href={userProfile.linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <span>LinkedIn</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                              {userProfile.website && (
                                <a
                                  href={userProfile.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <Globe size={12} />
                                  <span>Website</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* EDIT PROFILE FORM */}
                    {isEditingProfile && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <Edit2 size={15} className="text-emerald-700" />
                              প্রোফাইল তথ্য ও ছবি সম্পাদনা
                            </h4>
                            <p className="text-[11px] text-slate-500">আপনার ছবি, নাম এবং অন্যান্য ঐচ্ছিক তথ্য পূরণ করে সংরক্ষণ করুন।</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                          >
                            বাতিল
                          </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          {/* 1. PHOTO & NAME SECTION */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                            <span className="text-[11px] font-bold text-emerald-950 uppercase block tracking-wider">
                              ১. ছবি ও মৌলিক পরিচিতি
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                                  প্রোফাইল ছবি (ফাইল আপলোড)
                                </label>
                                <div className="flex items-center gap-3">
                                  <div className="w-14 h-14 rounded-full border-2 border-emerald-500 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                                    {editPhotoURL ? (
                                      <img src={editPhotoURL} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                      <User size={24} className="text-slate-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleAvatarFileChange}
                                      className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">অটো-কম্প্রেশন সক্ষম (ম্যাক্সিমাম ৮ MB)</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  অথবা ছবির সরাসরি URL
                                </label>
                                <input
                                  type="url"
                                  value={editPhotoURL.startsWith('data:') ? '' : editPhotoURL}
                                  onChange={(e) => setEditPhotoURL(e.target.value)}
                                  placeholder="https://example.com/avatar.jpg"
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  পূর্ণ নাম <span className="text-rose-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={editDisplayName}
                                  onChange={(e) => setEditDisplayName(e.target.value)}
                                  required
                                  placeholder="যেমন: মোঃ জুবায়ের হাসান"
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  মোবাইল ফোন নম্বর
                                </label>
                                <input
                                  type="tel"
                                  value={editPhone}
                                  onChange={(e) => setEditPhone(e.target.value)}
                                  placeholder="যেমন: 017XXXXXXXX"
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* 2. PROFESSION & BLOOD GROUP */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                            <span className="text-[11px] font-bold text-emerald-950 uppercase block tracking-wider">
                              ২. পেশা ও রক্তের গ্রুপ
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  পেশা / পদবী
                                </label>
                                <input
                                  type="text"
                                  value={editProfession}
                                  onChange={(e) => setEditProfession(e.target.value)}
                                  placeholder="যেমন: শিক্ষক, ডাক্তার, সফটওয়্যার ইঞ্জিনিয়ার, ছাত্র"
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  রক্তের গ্রুপ
                                </label>
                                <select
                                  value={editBloodGroup}
                                  onChange={(e) => setEditBloodGroup(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none cursor-pointer"
                                >
                                  <option value="">-- রক্তের গ্রুপ নির্বাচন করুন --</option>
                                  <option value="A+">A+ (এ পজিটিভ)</option>
                                  <option value="A-">A- (এ নেগেটিভ)</option>
                                  <option value="B+">B+ (বি পজিটিভ)</option>
                                  <option value="B-">B- (বি নেগেটিভ)</option>
                                  <option value="O+">O+ (ও পজিটিভ)</option>
                                  <option value="O-">O- (ও নেগেটিভ)</option>
                                  <option value="AB+">AB+ (এবি পজিটিভ)</option>
                                  <option value="AB-">AB- (এবি নেগেটিভ)</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* 3. LOCATION & ADDRESS */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                            <span className="text-[11px] font-bold text-emerald-950 uppercase block tracking-wider">
                              ৩. জেলা ও স্থায়ী/বর্তমান ঠিকানা
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  আপনার জেলা (খুলনা বিভাগ)
                                </label>
                                <select
                                  value={editDistrict}
                                  onChange={(e) => setEditDistrict(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none cursor-pointer"
                                >
                                  {initialDistricts.map(d => (
                                    <option key={d.id} value={d.id}>
                                      {d.name} ({d.nameEn})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  উপজেলা / থানা
                                </label>
                                <input
                                  type="text"
                                  value={editUpazila}
                                  onChange={(e) => setEditUpazila(e.target.value)}
                                  placeholder="যেমন: সোনাডাঙ্গা, ডুমুরিয়া, সদর"
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                পূর্ণ ঠিকানা (গ্রাম/মহল্লা, সড়ক)
                              </label>
                              <input
                                type="text"
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                placeholder="যেমন: বাড়ি নং ১২, রোড নং ৩, বয়রা, খুলনা"
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                              />
                            </div>
                          </div>

                          {/* 4. BIO SECTION */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                            <span className="text-[11px] font-bold text-emerald-950 uppercase block tracking-wider">
                              ৪. পরিচিতি / নিজের সম্পর্কে (Bio)
                            </span>
                            <textarea
                              value={editBio}
                              onChange={(e) => setEditBio(e.target.value)}
                              rows={3}
                              className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none resize-none"
                              placeholder="নিজের সম্পর্কে সংক্ষেপে কিছু লিখুন যা কমিউনিটি ব্যবহারকারীরা দেখতে পাবেন..."
                            />
                          </div>

                          {/* 5. SOCIAL MEDIA & WEB LINKS */}
                          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                            <span className="text-[11px] font-bold text-emerald-950 uppercase block tracking-wider">
                              ৫. সামাজিক যোগাযোগ মাধ্যম ও পোর্টফোলিও লিংক
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">ফেসবুক লিংক</label>
                                <input
                                  type="url"
                                  value={editFacebook}
                                  onChange={(e) => setEditFacebook(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                  placeholder="https://facebook.com/username"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">টুইটার / এক্স (Twitter/X)</label>
                                <input
                                  type="url"
                                  value={editTwitter}
                                  onChange={(e) => setEditTwitter(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                  placeholder="https://x.com/username"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">ইনস্টাগ্রাম (Instagram)</label>
                                <input
                                  type="url"
                                  value={editInstagram}
                                  onChange={(e) => setEditInstagram(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                  placeholder="https://instagram.com/username"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">লিঙ্কডইন (LinkedIn)</label>
                                <input
                                  type="url"
                                  value={editLinkedin}
                                  onChange={(e) => setEditLinkedin(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                  placeholder="https://linkedin.com/in/username"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">ব্যক্তিগত ওয়েবসাইট / পোর্টফোলিও</label>
                                <input
                                  type="url"
                                  value={editWebsite}
                                  onChange={(e) => setEditWebsite(e.target.value)}
                                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs bg-white focus:ring-1 focus:ring-emerald-700 outline-none"
                                  placeholder="https://yourwebsite.com"
                                />
                              </div>
                            </div>
                          </div>

                          {/* SUBMIT BUTTONS */}
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              type="submit"
                              disabled={isSavingProfile}
                              className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                            >
                              {isSavingProfile ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  <span>তথ্য ডাটাবেজে সংরক্ষণ হচ্ছে...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} />
                                  <span>সকল তথ্য ও ছবি সংরক্ষণ করুন</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditingProfile(false)}
                              className="px-5 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Community Posting Card inside Profile */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">কমিউনিটি পোস্ট তৈরি করুন</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">আপনার সেবা, অভিজ্ঞতা বা প্রশ্ন সরাসরি ফিডে শেয়ার করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!requireAuth('পোস্ট তৈরি')) return;
                      setEditingPost(null);
                      setShowCreatePostModal(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>পোস্ট করুন</span>
                  </button>
                </div>

                {/* MY POSTS MANAGER INSIDE PROFILE */}
                {currentUser && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="text-emerald-700" size={16} />
                        <h4 className="text-xs font-bold text-slate-900">আমার কমিউনিটি পোস্টসমূহ ({communityPosts.filter(p => p.authorId === currentUser.uid).length})</h4>
                      </div>
                      <button
                        onClick={() => setActiveTab('community')}
                        className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        কমিউনিটি ফিড দেখুন
                      </button>
                    </div>

                    {communityPosts.filter(p => p.authorId === currentUser.uid).length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-3">আপনি এখনো কোনো পোস্ট করেননি। উপরের বোতামে ক্লিক করে নতুন পোস্ট করুন।</p>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {communityPosts.filter(p => p.authorId === currentUser.uid).map(post => (
                          <div key={post.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs text-slate-900 line-clamp-2 font-medium">{post.content}</p>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setShowCreatePostModal(true);
                                  }}
                                  className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-white rounded transition cursor-pointer"
                                  title="সম্পাদনা করুন"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleRemovePost(post.id, 'ব্যবহারকারী দ্বারা পোস্ট মুছে ফেলা')}
                                  className="p-1 text-slate-500 hover:text-red-600 hover:bg-white rounded transition cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-150">
                              <span>লাইক: {post.likesCount} • মন্তব্য: {post.commentsCount}</span>
                              <span>{new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. COMPREHENSIVE ADMIN & SUB-ADMIN MANAGEMENT HUB */}
                {currentUser && userProfile && (userProfile.role === 'super_admin' || userProfile.role === 'sub_admin') && (
                  <AdminPanelComplete
                    currentUserRole={userProfile.role === 'super_admin' ? 'super_admin' : 'sub_admin'}
                    currentUserEmail={currentUser.email || ''}
                    subAdminScopeDistrict={userProfile.role === 'sub_admin' ? userProfile.selectedDistrict : undefined}
                    districts={initialDistricts}
                    categories={initialCategories}
                    services={services}
                    submissions={submissions}
                    emergencyContacts={emergencyContacts}
                    communityPosts={communityPosts}
                    communityReports={communityReports}
                    communityUsers={allCommunityUsers}
                    auditLogs={auditLogs}
                    releaseConfig={releaseConfig}
                    banners={banners}
                    onAddBanner={handleAddBanner}
                    onUpdateBanner={handleUpdateBanner}
                    onDeleteBanner={handleDeleteBanner}
                    onToggleBannerStatus={handleToggleBannerStatus}
                    onApproveSubmission={handleApproveSubmission}
                    onRejectSubmission={handleRejectSubmission}
                    onAddService={handleAddServiceFromAdmin}
                    onUpdateService={handleUpdateServiceFromAdmin}
                    onDeleteService={handleDeleteServiceFromAdmin}
                    onAddEmergency={handleAddEmergency}
                    onDeleteEmergency={handleDeleteEmergency}
                    onSaveReleaseConfig={handleSaveReleaseConfig}
                    onHidePost={handleHidePost}
                    onRestorePost={handleRestorePost}
                    onRemovePost={handleRemovePost}
                    onBanUser={handleBanUser}
                    onUpdateUserRole={handleUpdateUserRole}
                    onDeleteUser={handleDeleteUser}
                    onResolveReport={handleResolveReport}
                    onDismissReport={handleDismissReport}
                    onClearLogs={() => setAuditLogs([])}
                  />
                )}

                {/* QUICK APP DOWNLOAD & PWA INSTALL CARD FOR USERS */}
                <div className="bg-gradient-to-br from-emerald-50 to-lime-50/60 border border-emerald-200 p-4 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950 font-serif">স্মার্ট খুলনা মোবাইল ও ডেস্কটপ অ্যাপ</h4>
                        <p className="text-[10px] text-slate-600">Android • iOS • Windows • Mac • Web</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-700 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                      v{releaseConfig.currentVersion}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    অ্যাপ ইনস্টল করে ইন্টারনেট সংযোগ ছাড়াই দ্রুত জরুরি রক্তদাতা, ফায়ার সার্ভিস এবং হাসপাতালের তথ্য এক্সেস করুন।
                  </p>
                  <div className="flex items-center gap-2">
                    {isInstallable && (
                      <button
                        onClick={installPWA}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Download size={13} />
                        অ্যাপ ইনস্টল করুন
                      </button>
                    )}
                    <button
                      onClick={() => navigateTo('download')}
                      className="bg-white hover:bg-slate-50 text-emerald-900 border border-emerald-300 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ExternalLink size={13} />
                      সকল ডাউনলোড অপশন
                    </button>
                  </div>
                </div>

                {/* USER BIO / HELPFUL NOTES */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-3 leading-relaxed">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1">
                    <Info size={16} className="text-emerald-700" />
                    খুলনা বিভাগীয় পোর্টালে তথ্য সংগ্রহের নিয়মাবলী
                  </h4>
                  <p className="text-slate-600">
                    স্মার্ট খুলনা খুলনা বিভাগের সকল ডিজিটাল নাগরিক সুযোগ সুবিধা একত্রিত করার একটি সম্পূর্ণ স্বাধীন পোর্টাল। নাগরিকগণ এখানে বিনামূল্যে স্বত্বাধিকারী অনুযায়ী নিজ ব্যবসা, ক্লিনিক, শিক্ষা প্রতিষ্ঠান বা পেশাদার কাজের পরিচিতি আপলোড করতে পারেন।
                  </p>
                  <p className="text-slate-600">
                    আপনি কি মাঠ পর্যায়ে তথ্য সংগ্রাহক (Sub Admin) হিসেবে কাজ করতে ইচ্ছুক? দয়া করে আমাদের পরিচালনা পরিষদের সাথে যোগাযোগ করুন।
                  </p>
                </div>
              </div>
            )}

            {/* TAB VIEW - DOWNLOAD & INSTALL APP CENTER */}
            {activeTab === 'download' && (
              <DownloadPage
                releaseConfig={releaseConfig}
                platform={platform}
                isInstallable={isInstallable}
                isInstalled={isInstalled}
                onInstallPWA={installPWA}
                onBackToApp={() => navigateTo('home')}
              />
            )}

            {/* TAB VIEW - COMMUNITY SOCIAL FEED */}
            {activeTab === 'community' && (
              <CommunityFeed
                posts={communityPosts}
                districts={initialDistricts}
                categories={initialCategories}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                currentUserId={currentUser?.uid}
                currentUserEmail={currentUser?.email}
                currentUserName={currentUser?.displayName}
                commentsMap={communityComments}
                likedPostIds={likedCommunityPostIds}
                savedPostIds={savedCommunityPostIds}
                followingUids={followingUids}
                onToggleLike={handleToggleLikePost}
                onToggleSave={handleToggleSavePost}
                onAddComment={handleAddComment}
                onAddReply={handleAddReply}
                onDeleteComment={handleDeleteComment}
                onSharePost={handleShareCommunityPost}
                onReport={handleReport}
                onOpenCreatePost={() => {
                  if (!requireAuth('পোস্ট তৈরি')) return;
                  setEditingPost(null);
                  setShowCreatePostModal(true);
                }}
                onDeletePost={handleDeletePost}
                onEditPost={(post) => {
                  setEditingPost(post);
                  setShowCreatePostModal(true);
                }}
                onViewProfile={handleViewProfile}
                onStartMessage={handleStartMessage}
              />
            )}

            {/* TAB VIEW - MESSAGING CENTER */}
            {activeTab === 'messages' && (
              <MessagingCenter
                currentUserId={currentUser?.uid || null}
                currentUserEmail={currentUser?.email || null}
                currentUserName={currentUser?.displayName || null}
                currentUserAvatar={currentUser?.photoURL}
                districts={initialDistricts}
                allUsers={allCommunityUsers}
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={setActiveConversationId}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onDeleteConversation={handleDeleteConversation}
                onStartConversationWithUser={(targetUser) => {
                  handleStartMessage(targetUser.uid, targetUser.name, targetUser.email || '');
                }}
                onBlockUser={handleBlockUser}
                onReportUser={(targetUid, name) => {
                  handleReport('user', targetUid, name);
                }}
                onRequireAuth={() => requireAuth('বার্তা আদান-প্রদান')}
                messagesMap={messagesMap}
                blockedUserIds={blockedUserIds}
              />
            )}

          </main>



          {/* PERSISTENT BOTTOM NAVIGATION (5 Tab structure: Home, Services, Community, Messages, Profile) */}
          <nav className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-0 bg-white border-t border-slate-200 py-2 px-3 flex justify-around items-center z-10 shadow-lg">
            <button
              onClick={() => {
                setActiveTab('home');
                setViewingDistrictId(null);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition flex-1 cursor-pointer ${
                activeTab === 'home' && !viewingDistrictId ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home size={18} />
              হোম
            </button>
            
            <button
              onClick={() => {
                setActiveTab('services');
                setViewingDistrictId(null);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition flex-1 cursor-pointer ${
                activeTab === 'services' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid size={18} />
              সেবা
            </button>

            <button
              onClick={() => {
                setActiveTab('community');
                setViewingDistrictId(null);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition flex-1 cursor-pointer relative ${
                activeTab === 'community' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Users size={18} />
              কমিউনিটি
            </button>

            <button
              onClick={() => {
                setActiveTab('messages');
                setViewingDistrictId(null);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition flex-1 cursor-pointer relative ${
                activeTab === 'messages' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <MessageSquare size={18} />
                {totalUnreadMessages > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center border border-white">
                    {totalUnreadMessages}
                  </span>
                )}
              </div>
              মেসেজ
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setViewingDistrictId(null);
              }}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold transition flex-1 cursor-pointer ${
                activeTab === 'profile' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User size={18} />
              প্রোফাইল
            </button>
          </nav>

        </div>

      </div>

      {/* MODAL: ADVANCED BROWSER FILTERS */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">সেবা ডিরেক্টরি ফিল্টারসমূহ</h3>
              <button onClick={() => setShowFiltersModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  {initialCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">উপজেলা / এলাকা ফিল্টার</label>
                <input
                  type="text"
                  placeholder="উদা: সোনাডাঙ্গা, রুপসা"
                  value={filterUpazila}
                  onChange={(e) => setFilterUpazila(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verified-only-checkbox"
                  checked={filterVerifiedOnly}
                  onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-700 border-slate-300 rounded focus:ring-emerald-700"
                />
                <label htmlFor="verified-only-checkbox" className="font-bold text-slate-700 select-none">
                  শুধুমাত্র ভেরিফাইড তথ্য দেখান
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setFilterCategory('all');
                  setFilterVerifiedOnly(false);
                  setFilterUpazila('');
                  setShowFiltersModal(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex-1"
              >
                রিসেট
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex-1"
              >
                ফিল্টার প্রয়োগ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SERVICE DETAIL POPUP */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Header image / fallback visual */}
            <div className="relative h-44 bg-slate-100 shrink-0">
              {selectedService.photos && selectedService.photos[0] ? (
                <img src={selectedService.photos[0]} alt={selectedService.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <IconComponent name={initialCategories.find(c => c.id === selectedService.category_id)?.iconName || 'Grid'} className="w-12 h-12" />
                </div>
              )}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {initialCategories.find(c => c.id === selectedService.category_id)?.name}
                </span>
                {selectedService.is_verified && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle size={10} className="fill-white text-blue-600" />
                    ভেরিফাইড
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{selectedService.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">সর্বশেষ আপডেট: {new Date(selectedService.updated_at).toLocaleDateString()}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-serif">
                {selectedService.description}
              </p>

              <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700">ঠিকানা:</span>
                    <p className="text-slate-600 mt-0.5">{selectedService.address}, উপজেলা: {selectedService.upazila_id}, {initialDistricts.find(d => d.id === selectedService.district_id)?.name}</p>
                    <div className="mt-4">
                      <ServiceQR url={window.location.href + '?service=' + selectedService.id} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-700 shrink-0" />
                  <p className="text-slate-600"><span className="font-bold text-slate-700">ফোন নম্বর:</span> {selectedService.phone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-700 shrink-0" />
                  <p className="text-slate-600"><span className="font-bold text-slate-700">খোলা থাকার সময়সূচী:</span> {selectedService.opening_hours}</p>
                </div>
              </div>

              {/* Functional CTA Buttons based on available properties */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <a
                  href={`tel:${selectedService.phone}`}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone size={13} />
                  সরাসরি কল
                </a>
                <button
                  onClick={() => handleShareService(selectedService)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 size={13} />
                  শেয়ার করুন
                </button>
                <button
                  onClick={() => {
                    toggleSaveService(selectedService.id);
                  }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isSaved(selectedService.id)
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Heart size={13} className={isSaved(selectedService.id) ? 'fill-red-500 text-red-500' : ''} />
                  {isSaved(selectedService.id) ? 'সংরক্ষিত' : 'সংরক্ষণ করুন'}
                </button>
                {selectedService.website && (
                  <a
                    href={selectedService.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink size={13} />
                    ওয়েবসাইট
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT COMMUNITY POST */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => {
          setShowCreatePostModal(false);
          setEditingPost(null);
        }}
        districts={initialDistricts}
        categories={initialCategories}
        selectedDistrict={selectedDistrict}
        currentUserName={currentUser?.displayName || 'ব্যবহারকারী'}
        currentUserEmail={currentUser?.email || ''}
        currentUserId={currentUser?.uid || ''}
        initialPostToEdit={editingPost}
        onSubmitPost={handleSavePost}
      />

      {/* MODAL: PUBLIC USER PROFILE */}
      <UserProfileModal
        user={selectedProfileUser}
        isOpen={showUserProfileModal}
        onClose={() => {
          setShowUserProfileModal(false);
          setSelectedProfileUser(null);
        }}
        districts={initialDistricts}
        userPosts={selectedProfileUser ? communityPosts.filter(p => p.authorId === selectedProfileUser.uid) : []}
        currentUserId={currentUser?.uid}
        isFollowing={selectedProfileUser ? followingUids.includes(selectedProfileUser.uid) : false}
        isBlocked={selectedProfileUser ? blockedUserIds.includes(selectedProfileUser.uid) : false}
        onToggleFollow={handleToggleFollow}
        onToggleBlock={handleBlockUser}
        onStartMessage={(uid, name, email) => handleStartMessage(uid, name, email)}
        onReportUser={(uid, name) => handleReport('user', uid, name)}
      />

      {/* MODAL: NOTIFICATION CENTER */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        notifications={communityNotifications.filter(n => !currentUser || n.recipientUid === currentUser.uid || n.recipientUid === 'all')}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* MODAL: REPORT ABUSE / CONTENT */}
      {reportModalState.isOpen && (
        <ReportModal
          isOpen={reportModalState.isOpen}
          onClose={() => setReportModalState(prev => ({ ...prev, isOpen: false }))}
          targetType={reportModalState.targetType}
          targetId={reportModalState.targetId}
          targetTitle={reportModalState.targetTitle}
          onSubmitReport={handleSubmitReport}
        />
      )}

    </div>
  );
}
