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
  AlertOctagon
} from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  initialDistricts,
  initialCategories,
  initialEmergencyContacts,
  initialServices,
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
import { SplashScreen } from './components/SplashScreen';
import { DownloadPage } from './components/DownloadPage';
import { AdminDownloadsCMS } from './components/AdminDownloadsCMS';
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

// Dynamic Icon Component
const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    Building2, HeartPulse, GraduationCap, Bus, Landmark, Truck, Scale, MapPin, Sprout,
    Briefcase, Home, HardHat, UserCheck, Car, Zap, Wrench, Settings, Utensils, Bed, Compass, Grid,
    PhoneCall, Info, ShieldAlert, Shield, Flame, Ambulance, Sparkles, BarChart2, Plus, Bell, Clock, Edit2
  };
  const Comp = icons[name] || Grid;
  return <Comp className={className} size={18} />;
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

  // Authentication & Users
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Core Data States (synchronized between Firestore and localStorage fallback)
  const [services, setServices] = useState<Service[]>(() => getLocalData('services', initialServices));
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => getLocalData('emergencies', initialEmergencyContacts));
  const [submissions, setSubmissions] = useState<any[]>(() => getLocalData('submissions', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getLocalData('audit_logs', []));
  const [banners, setBanners] = useState<Banner[]>(() => getLocalData('banners', [
    { id: 'b1', title: 'খুলনা বিভাগের সকল ডিজিটাল নাগরিক সেবা এখন এক জায়গায়', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=1000&q=80' }
  ]));
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
        
        // Define initial roles. Check if super admin by email
        const isSuperAdminEmail = ['zobaerhasan431@gmail.com', 'zobaerio24@gmail.com'].includes(email);
        
        // Try to fetch from Firestore
        const userDocRef = doc(db, 'profiles', firebaseUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (isSuperAdminEmail && data.role !== 'super_admin') {
              const elevatedProfile = { ...data, role: 'super_admin' as const };
              await setDoc(userDocRef, elevatedProfile, { merge: true });
              setUserProfile(elevatedProfile);
            } else {
              setUserProfile(data);
            }
          } else {
            // Document does not exist, create it
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'ব্যবহারকারী',
              email: email,
              role: isSuperAdminEmail ? 'super_admin' : 'user',
              selectedDistrict: selectedDistrict,
              savedServices: []
            };
            await setDoc(userDocRef, newProfile);
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
          setUserProfile({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'ব্যবহারকারী',
            email: email,
            role: isSuperAdminEmail ? 'super_admin' : 'user',
            selectedDistrict: selectedDistrict,
            savedServices: JSON.parse(localStorage.getItem(`favs_${firebaseUser.uid}`) || '[]')
          });
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

  // Google Login / Logout
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await logAction('ব্যবহারকারী লগইন', `${res.user.email} সিস্টেমে লগইন করেছেন`);
    } catch (error) {
      console.error("Google login failed", error);
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

  const handleStartMessage = (targetUid: string, targetName: string, targetEmail: string) => {
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
      setConversations(prev => [existing!, ...prev]);
    }

    setActiveConversationId(existing.id);
    setActiveTab('messages');
    setShowUserProfileModal(false);
  };

  const handleSendMessage = (conversationId: string, text: string, attachmentsOrMediaUrl?: any, mediaType?: 'image' | 'file') => {
    if (!currentUser) return;
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const otherUid = conv.participantIds.find(uid => uid !== currentUser.uid) || '';

    let attachments: any[] = [];
    let mediaUrl: string | undefined = undefined;
    let finalMediaType: 'image' | 'file' | undefined = mediaType;

    if (Array.isArray(attachmentsOrMediaUrl)) {
      attachments = attachmentsOrMediaUrl;
      if (attachments.length > 0) {
        mediaUrl = attachments[0].url;
        finalMediaType = attachments[0].type === 'image' ? 'image' : 'file';
      }
    } else if (typeof attachmentsOrMediaUrl === 'string') {
      mediaUrl = attachmentsOrMediaUrl;
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

  const handleDeleteMessage = (conversationId: string, messageId: string) => {
    setMessagesMap(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).filter(m => m.id !== messageId)
    }));
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (!window.confirm('আপনি কি এই কথোপকথনটি আপনার ভিউ থেকে মুছে ফেলতে চান?')) return;
    setConversations(prev => prev.filter(c => c.id !== conversationId));
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

      {/* Dynamic Desktop Header Frame / Notification Alert Banner */}
      <div className="w-full bg-emerald-900 text-white py-1 px-4 text-xs text-center flex justify-center items-center gap-2 overflow-hidden shadow-sm">
        <Sparkles size={14} className="text-lime-300 animate-pulse shrink-0" />
        <span className="truncate"><strong>ঘোষণা:</strong> {systemNotifications[0]?.title} - {systemNotifications[0]?.message}</span>
        {userProfile?.role && (
          <span className="bg-lime-400 text-emerald-950 font-bold px-2 py-0.5 rounded ml-2 uppercase text-[10px]">
            {userProfile.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
          </span>
        )}
      </div>

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
        <div className="flex-1 flex flex-col min-h-[85vh] bg-slate-50 relative pb-16 md:pb-0">
          
          {/* MOBILE HEADER (Visually aligned to the Netrokona Reference Screenshot) */}
          <header className="sticky top-0 bg-white border-b border-emerald-100 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-black text-sm border border-lime-400 shrink-0 shadow-inner">
                K
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-extrabold text-emerald-950 tracking-tight font-serif">স্মার্ট খুলনা</span>
                  <span className="text-[9px] bg-lime-100 text-emerald-800 font-bold px-1 rounded">Beta</span>
                </div>
                <span className="text-[10px] text-slate-500 block -mt-1 font-serif">খুলনা বিভাগের সকল সেবা একসাথে</span>
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

                {/* 2. HERO LANDMARK BANNER */}
                <div className="relative h-40 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={banners[0].image}
                    alt="Khulna Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] text-lime-300 font-bold uppercase tracking-wider">তথ্য ও সেবা হাব</span>
                    <h2 className="text-base md:text-lg font-bold text-white tracking-wide leading-tight font-serif">
                      স্মার্ট {initialDistricts.find(d => d.id === selectedDistrict)?.name} পোর্টালে আপনাকে স্বাগতম
                    </h2>
                    <p className="text-[11px] text-emerald-100/90 truncate mt-1">
                      {initialDistricts.find(d => d.id === selectedDistrict)?.nameEn} জেলা এবং খুলনা বিভাগের অনলাইন সেবা নির্দেশিকা
                    </p>
                  </div>
                </div>

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

                {/* 4. EMERGENCY SERVICES (Red Theme, Visual Priority aligned to reference screen) */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                    <div>
                      <h2 className="text-base font-extrabold text-red-950 flex items-center gap-1.5 font-serif">
                        <ShieldAlert className="text-red-600 animate-pulse" size={18} />
                        জরুরি সেবা
                      </h2>
                      <p className="text-[11px] text-slate-500 -mt-0.5">দ্রুত সহায়তা পেতে নিচে সরাসরি কল বাটনে ক্লিক করুন</p>
                    </div>
                    {userProfile?.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          setAdminView('emergencies');
                          setActiveTab('profile');
                        }}
                        className="text-[10px] text-red-700 bg-red-50 font-bold px-2 py-1 rounded border border-rose-100 hover:bg-red-100"
                      >
                        সম্পাদনা
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {localEmergencies.map(contact => (
                      <div
                        key={contact.id}
                        className="bg-white border-l-4 border-l-red-600 border border-red-50 hover:border-red-100 p-3 rounded-xl shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 leading-tight">
                            <IconComponent name={contact.iconName} className="text-red-500 shrink-0" />
                            <span className="truncate">{contact.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{contact.description || 'জরুরি কন্টাক্ট নম্বর'}</p>
                          <span className="block text-xs font-extrabold text-emerald-900 tracking-wider mt-1.5 bg-emerald-50 px-1.5 py-0.5 rounded w-max">
                            {contact.phone}
                          </span>
                        </div>
                        <a
                          href={`tel:${contact.phone}`}
                          className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition shadow-sm"
                        >
                          <Phone size={11} />
                          কল করুন
                        </a>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. POPULAR SERVICES GRID (Clickable Cards with Arrows) */}
                <section className="space-y-3">
                  <div>
                    <h2 className="text-base font-extrabold text-emerald-950 flex items-center gap-1.5 font-serif">
                      <Sparkles size={18} className="text-emerald-700" />
                      জনপ্রিয় সেবা ক্যাটাগরি
                    </h2>
                    <p className="text-[11px] text-slate-500 -mt-0.5">সবচেয়ে বেশি প্রয়োজনীয় সেবাগুলো সিলেক্ট করুন</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {initialCategories.slice(0, 8).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setFilterCategory(cat.id);
                          setActiveTab('services');
                        }}
                        className="bg-white hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 p-3.5 rounded-xl transition flex flex-col items-center text-center space-y-2 shadow-sm shrink-0 cursor-pointer text-slate-800"
                      >
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center shadow-inner">
                          <IconComponent name={cat.iconName} className="text-emerald-700" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 truncate w-full">{cat.name}</span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </button>
                    ))}
                  </div>
                </section>

                {/* 6. PROMOTED / FEATURED LOCAL SERVICES */}
                {services.filter(s => s.isFeatured && s.status === 'PUBLISHED' && s.district_id === selectedDistrict).length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-base font-extrabold text-emerald-950 flex items-center gap-1.5 font-serif">
                      <ThumbsUp size={18} className="text-emerald-700" />
                      স্পেশাল ও ভেরিফাইড সেবা
                    </h2>
                    <div className="space-y-3">
                      {services
                        .filter(s => s.isFeatured && s.status === 'PUBLISHED' && s.district_id === selectedDistrict)
                        .map(service => (
                          <div
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className="bg-gradient-to-r from-emerald-50/60 to-white hover:from-emerald-50 border border-emerald-100 hover:border-emerald-200 p-4 rounded-xl shadow-sm flex items-center gap-3 transition cursor-pointer"
                          >
                            {service.photos && service.photos[0] ? (
                              <img src={service.photos[0]} alt={service.name} className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200" />
                            ) : (
                              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                                <Building2 size={24} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-emerald-900 bg-lime-100 px-1.5 py-0.5 rounded">ফিচার্ড</span>
                                {service.is_verified && (
                                  <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5 shrink-0">
                                    <CheckCircle size={10} className="fill-blue-500 text-white" />
                                    ভেরিফাইড
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xs font-bold text-slate-900 truncate mt-1">{service.name}</h3>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{service.address}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">খোলা: {service.opening_hours}</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-400 shrink-0" />
                          </div>
                        ))}
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
                        <div className="space-y-2">
                          {services
                            .filter(s => s.district_id === currentDist.id && s.status === 'PUBLISHED')
                            .slice(0, 5)
                            .map(s => (
                              <div
                                key={s.id}
                                onClick={() => setSelectedService(s)}
                                className="bg-white p-3 rounded-xl border border-slate-100 hover:border-emerald-200 transition cursor-pointer flex justify-between items-center"
                              >
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{s.address}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-400" />
                              </div>
                            ))}
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

                {/* Sub-Header Horizontal Category Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                      filterCategory === 'all'
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    সব ক্যাটাগরি
                  </button>
                  {initialCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        filterCategory === cat.id
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
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
                  <div className="space-y-3">
                    {filteredServices.map(service => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition shadow-sm hover:shadow flex gap-3 relative cursor-pointer"
                      >
                        {service.photos && service.photos[0] ? (
                          <img
                            src={service.photos[0]}
                            alt={service.name}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                            <IconComponent name={initialCategories.find(c => c.id === service.category_id)?.iconName || 'Grid'} className="text-slate-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                {initialCategories.find(c => c.id === service.category_id)?.name}
                              </span>
                              {service.is_verified && (
                                <span className="bg-blue-50 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <CheckCircle size={9} className="fill-blue-500 text-white" />
                                  ভেরিফাইড
                                </span>
                              )}
                            </div>
                            <h3 className="text-xs font-extrabold text-slate-900 mt-1 truncate">{service.name}</h3>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">ঠিকানা: {service.address}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-50">
                            <span className="flex items-center gap-1">
                              <Clock size={11} className="text-emerald-700" />
                              {service.opening_hours}
                            </span>
                            <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                              দেখুন
                              <ChevronRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <div className="space-y-3">
                      {savedList.map(s => (
                        <div
                          key={s.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedService(s)}>
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center">
                              <IconComponent name={initialCategories.find(c => c.id === s.category_id)?.iconName || 'Grid'} />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-slate-900 leading-tight">{s.name}</h3>
                              <p className="text-[10px] text-slate-400 mt-0.5">{s.address}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSaveService(s.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                            title="সংরক্ষণ বাতিল"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
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
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
                    <User className="text-emerald-700 mx-auto" size={44} />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">স্মার্ট খুলনা একাউন্ট</h3>
                      <p className="text-xs text-slate-500 mt-1">আপনার সংরক্ষিত ডাটা সিঙ্ক করতে এবং নতুন তথ্য যুক্ত করার ট্র্যাক রাখতে অ্যাকাউন্ট লগইন করুন।</p>
                    </div>
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                    >
                      <Sparkles size={14} className="text-lime-300" />
                      Google অ্যাকাউন্ট দিয়ে লগইন করুন
                    </button>
                    <p className="text-[10px] text-slate-400">আমরা আপনার তথ্যের গোপনীয়তা ও সুরক্ষা নিশ্চিত করি।</p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-lime-400 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center font-bold text-white uppercase shrink-0">
                          {currentUser.displayName?.substring(0, 2) || 'US'}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-white">{currentUser.displayName || 'সম্মানিত ব্যবহারকারী'}</h3>
                        <p className="text-[11px] text-slate-300">{currentUser.email}</p>
                        <span className="inline-block bg-lime-400 text-emerald-950 font-bold px-2 py-0.5 rounded text-[9px] mt-1 uppercase">
                          {userProfile?.role || 'user'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
                      title="লগআউট"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                )}

                {/* 2. ADMIN SYSTEM - RESTRICTED PANELS FOR SUPER ADMIN & SUB ADMIN */}
                {currentUser && userProfile && (userProfile.role === 'super_admin' || userProfile.role === 'sub_admin') && (
                  <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Shield className="text-emerald-700" size={18} />
                        <h3 className="text-sm font-bold text-slate-900 font-serif">প্রশাসনিক কাজের প্যানেল ({userProfile.role === 'super_admin' ? 'সুপার অ্যাডমিন' : 'সাব অ্যাডমিন'})</h3>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        সক্রিয়
                      </span>
                    </div>

                    {/* Admin Specific Action Tabs */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <button
                        onClick={() => setAdminView(adminView === 'dashboard' ? null : 'dashboard')}
                        className={`p-3 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          adminView === 'dashboard'
                            ? 'bg-slate-900 text-white border-transparent'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <BarChart2 size={14} />
                        পরিসংখ্যান ড্যাশবোর্ড
                      </button>
                      <button
                        onClick={() => setAdminView(adminView === 'submissions' ? null : 'submissions')}
                        className={`p-3 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          adminView === 'submissions'
                            ? 'bg-slate-900 text-white border-transparent'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <FileText size={14} />
                        অনুমোদন কেন্দ্র ({submissions.filter(s => s.status === 'PENDING').length})
                      </button>
                      <button
                        onClick={() => setAdminView(adminView === 'emergencies' ? null : 'emergencies')}
                        className={`p-3 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          adminView === 'emergencies'
                            ? 'bg-slate-900 text-white border-transparent'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <PhoneCall size={14} />
                        জরুরি সেবা নম্বর
                      </button>
                      <button
                        onClick={() => setAdminView(adminView === 'logs' ? null : 'logs')}
                        className={`p-3 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          adminView === 'logs'
                            ? 'bg-slate-900 text-white border-transparent'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <FileSpreadsheet size={14} />
                        অডিট লগ (Audit Logs)
                      </button>

                      {/* Community Social Moderation for Super Admin & Sub Admin */}
                      <button
                        onClick={() => setAdminView(adminView === 'community_moderation' ? null : 'community_moderation')}
                        className={`col-span-2 p-3 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          adminView === 'community_moderation'
                            ? 'bg-amber-900 text-white border-transparent shadow-sm'
                            : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                        }`}
                      >
                        <ShieldAlert size={14} className="text-amber-600" />
                        কমিউনিটি সোশ্যাল মডারেশন ও রিপোর্ট ({communityReports.filter(r => r.status === 'pending').length})
                      </button>

                      {/* Download System CMS for Super Admin */}
                      {userProfile.role === 'super_admin' && (
                        <button
                          onClick={() => setAdminView(adminView === 'downloads' ? null : 'downloads')}
                          className={`col-span-2 p-3 rounded-xl border font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                            adminView === 'downloads'
                              ? 'bg-emerald-800 text-white border-transparent shadow-sm'
                              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <Smartphone size={14} />
                          ক্রস-প্ল্যাটফর্ম অ্যাপ ও ডাউনলোড ব্যবস্থাপনা (CMS)
                        </button>
                      )}
                    </div>

                    {/* SUB-VIEW: ADMIN STATS & CHARTS */}
                    {adminView === 'dashboard' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <h4 className="text-xs font-bold text-slate-900">ড্যাশবোর্ড ওভারভিউ ও তথ্য চার্ট</h4>
                          <span className="text-[10px] text-slate-500">রিয়েল-টাইম তথ্য বিশ্লেষণ</span>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="bg-white p-2.5 rounded border border-slate-100">
                            <span className="text-[10px] text-slate-500 block">মোট ডিস্ট্রিক্ট</span>
                            <span className="text-base font-black text-slate-900">১০টি</span>
                          </div>
                          <div className="bg-white p-2.5 rounded border border-slate-100">
                            <span className="text-[10px] text-slate-500 block">মোট সেবা</span>
                            <span className="text-base font-black text-emerald-800">{stats.totalServices}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded border border-slate-100">
                            <span className="text-[10px] text-slate-500 block">অনুমোদনের অপেক্ষায়</span>
                            <span className="text-base font-black text-red-600">{stats.pendingSubmissions}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded border border-slate-100">
                            <span className="text-[10px] text-slate-500 block">ভেরিফাইড সেবা</span>
                            <span className="text-base font-black text-blue-600">{stats.verifiedServices}</span>
                          </div>
                        </div>

                        {/* Lightweight services count by district distribution block */}
                        <div className="space-y-2 bg-white p-4 rounded border border-slate-100">
                          <h5 className="text-[11px] font-bold text-slate-700">জেলা ভিত্তিক সেবা বণ্টন চিত্র</h5>
                          <div className="space-y-2">
                            {initialDistricts.map(d => {
                              const cnt = getServiceCountForDistrict(d.id);
                              const pct = Math.min(100, Math.max(8, (cnt / (services.length || 1)) * 100));
                              return (
                                <div key={d.id} className="text-[10px]">
                                  <div className="flex justify-between font-semibold text-slate-600">
                                    <span>{d.name} জেলা</span>
                                    <span>{cnt}টি সেবা</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-VIEW: PENDING SUBMISSIONS & REVIEW WORKFLOW (Main Admin Only) */}
                    {adminView === 'submissions' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">নতুন তথ্য পর্যালোচনা ও অনুমোদন করুন</h4>
                        
                        {submissions.filter(s => s.status === 'PENDING').length === 0 ? (
                          <p className="text-[11px] text-slate-500 text-center py-4">বর্তমানে কোনো নতুন সেবা অনুমোদনের অপেক্ষায় নেই।</p>
                        ) : (
                          <div className="space-y-3">
                            {submissions.filter(s => s.status === 'PENDING').map(sub => (
                              <div key={sub.id} className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="font-bold text-slate-900">{sub.name}</span>
                                  <span className="bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded text-[9px]">PENDING REVIEW</span>
                                </div>
                                <p className="text-[10px] text-slate-500">ঠিকানা: {sub.address}</p>
                                <p className="text-[10px] text-slate-500">ফোন: {sub.phone}</p>
                                <p className="text-[11px] text-slate-700 italic">"{sub.description || 'কোনো বর্ণনা নেই।'}"</p>
                                <p className="text-[9px] text-slate-400">দাখিলকারী: {sub.submitted_by}</p>
                                
                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                  <button
                                    onClick={() => handleApproveSubmission(sub)}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1 px-3 rounded text-[10px]"
                                  >
                                    অনুমোদন ও প্রকাশ
                                  </button>
                                  <button
                                    onClick={() => handleRejectSubmission(sub)}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1 px-3 rounded text-[10px]"
                                  >
                                    প্রত্যাখ্যান করুন
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUB-VIEW: EMERGENCY CONTACTS CMS */}
                    {adminView === 'emergencies' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">জরুরি সেবা কন্টাক্ট ডেটা ম্যানেজমেন্ট</h4>
                        
                        {/* Simple add inline form */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500">নতুন জরুরি নম্বর যোগ করুন:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input id="add-em-name" type="text" placeholder="সেবার নাম" className="bg-white p-2 border border-slate-200 rounded text-[11px]" />
                            <input id="add-em-phone" type="text" placeholder="ফোন নম্বর" className="bg-white p-2 border border-slate-200 rounded text-[11px]" />
                          </div>
                          <button
                            onClick={() => {
                              const nameInput = document.getElementById('add-em-name') as HTMLInputElement;
                              const phoneInput = document.getElementById('add-em-phone') as HTMLInputElement;
                              if (nameInput?.value && phoneInput?.value) {
                                handleAddEmergency(nameInput.value, phoneInput.value, selectedDistrict);
                                nameInput.value = '';
                                phoneInput.value = '';
                              }
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-3 rounded text-[10px] w-full"
                          >
                            যোগ করুন
                          </button>
                        </div>

                        {/* List editable items */}
                        <div className="space-y-1.5 pt-3">
                          <p className="text-[10px] font-bold text-slate-500">বিদ্যমান নম্বরের তালিকা:</p>
                          {emergencyContacts.filter(e => e.districtId === selectedDistrict).map(em => (
                            <div key={em.id} className="bg-white p-2.5 rounded border border-slate-100 flex justify-between items-center text-[11px]">
                              <span>{em.name} ({em.phone})</span>
                              <button
                                onClick={() => {
                                  setEmergencyContacts(prev => prev.filter(p => p.id !== em.id));
                                  logAction('জরুরি নম্বর ডিলিট', `জরুরি নম্বর "${em.name}" মুছে ফেলা হয়েছে`);
                                }}
                                className="text-red-500 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUB-VIEW: AUDIT LOG SYSTEM (Requires transparency) */}
                    {adminView === 'logs' && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <h4 className="text-xs font-bold text-slate-900">অডিট লগ সিস্টেম (Audit Log)</h4>
                          <button
                            onClick={() => setAuditLogs([])}
                            className="text-[9px] text-red-600 font-bold"
                          >
                            ক্লিয়ার লগ
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                          {auditLogs.length === 0 ? (
                            <p className="text-[10px] text-slate-400 text-center py-4">বর্তমানে কোনো কাজের লগ সংরক্ষিত নেই।</p>
                          ) : (
                            auditLogs.map(log => (
                              <div key={log.id} className="bg-white p-2.5 rounded border border-slate-150 text-[10px] space-y-1">
                                <div className="flex justify-between font-bold text-slate-600">
                                  <span>{log.user} ({log.role})</span>
                                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-slate-800 font-semibold">{log.action}</p>
                                <p className="text-slate-500 text-[9px]">{log.target}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* SUB-VIEW: CROSS-PLATFORM DOWNLOADS & PWA CMS */}
                    {adminView === 'downloads' && userProfile.role === 'super_admin' && (
                      <AdminDownloadsCMS
                        initialConfig={releaseConfig}
                        onSave={handleSaveReleaseConfig}
                        onClose={() => setAdminView(null)}
                      />
                    )}

                    {/* SUB-VIEW: COMMUNITY MODERATION DASHBOARD */}
                    {adminView === 'community_moderation' && (
                      <CommunityModerationDashboard
                        currentUserRole={userProfile.role === 'super_admin' ? 'super_admin' : 'sub_admin'}
                        subAdminScope={userProfile.role === 'sub_admin' ? { districtId: userProfile.selectedDistrict } : undefined}
                        reports={communityReports}
                        posts={communityPosts}
                        users={allCommunityUsers}
                        districts={initialDistricts}
                        categories={initialCategories}
                        onResolveReport={handleResolveReport}
                        onDismissReport={handleDismissReport}
                        onHidePost={handleHidePost}
                        onRestorePost={handleRestorePost}
                        onRemovePost={handleRemovePost}
                        onBanUser={handleBanUser}
                        onDeleteComment={handleDeleteComment}
                        auditLogs={moderationAuditLogs}
                        onClose={() => setAdminView(null)}
                      />
                    )}

                  </div>
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

          {/* Floating "+ পোস্ট করুন" Action Button inside Community tab */}
          {activeTab === 'community' && (
            <button
              onClick={() => {
                if (!requireAuth('পোস্ট তৈরি')) return;
                setEditingPost(null);
                setShowCreatePostModal(true);
              }}
              className="fixed bottom-20 right-5 md:bottom-8 md:right-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-full shadow-2xl flex items-center gap-2 z-20 cursor-pointer border-2 border-white transition transform hover:scale-105"
              title="নতুন পোস্ট লিখুন"
            >
              <Plus size={18} />
              <span className="text-xs font-serif font-bold">পোস্ট করুন</span>
            </button>
          )}

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
