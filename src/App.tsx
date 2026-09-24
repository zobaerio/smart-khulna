import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
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
  Mail,
  LogIn,
  UserPlus,
  ShieldCheck,
  Edit2,
  Sparkles,
  BarChart2,
  ThumbsUp,
  Users,
  MessageCircle,
  Download,
  X,
  FileSpreadsheet,
  Smartphone,
  Laptop,
  Monitor,
  MessageSquare,
  AlertOctagon,
  LayoutGrid,
  Camera,
  Globe,
  Linkedin,
  Droplets,
  Waves,
  Loader2,
  Tractor,
  Sun,
  Moon,
  Menu,
  Star
} from 'lucide-react';
import { EnhancedProfileView } from './components/community/EnhancedProfileView';
import { PostCard } from './components/community/PostCard';
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
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot
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
import { JoinSmartKhulnaTeamSection } from './components/JoinSmartKhulnaTeamSection';
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
import { BloodDonationSection } from './components/BloodDonationSection';
import { MessagingCenter } from './components/community/MessagingCenter';
import { CreatePostModal } from './components/community/CreatePostModal';
import { UserProfileModal } from './components/community/UserProfileModal';
import { NotificationCenter } from './components/community/NotificationCenter';
import { NotificationCenterView } from './components/notifications/NotificationCenterView';
import { InAppNotificationBanner } from './components/notifications/InAppNotificationBanner';
import { notificationService } from './services/notificationService';
import { UserNotificationItem } from './types/notifications';
import { CommunityModerationDashboard } from './components/community/CommunityModerationDashboard';
import { ReportModal } from './components/community/ReportModal';
import { BloodBankHub } from './components/features/BloodBankHub';
import { TourismHub } from './components/features/TourismHub';
import { DoctorFinderHub } from './components/features/DoctorFinderHub';
import { WeatherTideHub } from './components/features/WeatherTideHub';
import { CitizenFeedbackHub } from './components/features/CitizenFeedbackHub';
import { LocalJobsHub } from './components/features/LocalJobsHub';
import { ToLetHub } from './components/features/ToLetHub';
import { EditProfileModal } from './components/community/EditProfileModal';
import { ProfileSettingsModal } from './components/community/ProfileSettingsModal';
import { getSafeAvatarUrl } from './lib/avatarHelper';
import { SmartKhulnaHeader } from './components/common/SmartKhulnaHeader';
import { SmartKhulnaLogo } from './components/common/SmartKhulnaLogo';
import { DiscoverySearch } from './components/DiscoverySearch';

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
    AlertTriangle, User, Search, Users, MessageCircle, PlusCircle, Download, Heart
  };
  const Comp = icons[name] || Grid;
  return <Comp className={className} size={size} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
};

export default function App() {
  // Lang state must be initialized first to be used by t()
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('lang') as 'bn' | 'en') || 'bn';
  });

  const t = (key: string) => {
    const dictionary: Record<'bn' | 'en', Record<string, string>> = {
      bn: {
        title: "স্মার্ট খুলনা",
        subtitle: "খুলনা জেলা ডিজিটাল নাগরিক সেবা ডিরেক্টরি",
        home: "হোম",
        services: "নাগরিক সেবা (Services)",
        community: "কমিউনিটি",
        messaging: "বার্তা",
        blood: "রক্তদান",
        downloads: "ডাউনলোড",
        admin: "অ্যাডমিন",
        install: "ইনস্টল করুন",
        official: "অফিসিয়াল",
        notice: "স্মার্ট খুলনা জেলা ডিজিটাল নাগরিক সেবা ডিরেক্টরি প্ল্যাটফর্মে আপনাকে স্বাগতম • জেলার সকল তথ্য ও সরকারি সেবা এখন হাতের মুঠোয় • স্মার্ট খুলনা অ্যাপ ব্যবহার করে দ্রুত সেবা গ্রহণ করুন • ২৪/৭ নাগরিক সহায়তা এবং কমিউনিটি সোশ্যাল ফিড",
        noticeLabel: "নোটিশ",
        districtPortal: "স্মার্ট জেলা পোর্টাল",
        searchPlaceholder: "যেকোনো সেবা বা তথ্য খুঁজুন...",
        allDistricts: "সব জেলা",
        themeDark: "ডার্ক মোড",
        themeLight: "লাইট মোড",
        login: "লগইন",
        logout: "লগআউট",
        profile: "আমার প্রোফাইল",
        adminPanel: "অ্যাডমিন প্যানেল",
      },
      en: {
        title: "Smart Khulna",
        subtitle: "Khulna District Digital Citizen Service Directory",
        home: "Home",
        services: "Services",
        community: "Community",
        messaging: "Messages",
        blood: "Blood Donation",
        downloads: "Downloads",
        admin: "Admin",
        install: "Install",
        official: "OFFICIAL",
        notice: "Welcome to the Smart Khulna District Digital Citizen Service Directory • All information and government services are at your fingertips • Use Smart Khulna App for faster services • 24/7 Citizen Support and Community Social Feed",
        noticeLabel: "Notice",
        districtPortal: "Smart District Portal",
        searchPlaceholder: "Search services or info...",
        allDistricts: "All Districts",
        themeDark: "Dark Mode",
        themeLight: "Light Mode",
        login: "Login",
        logout: "Logout",
        profile: "My Profile",
        adminPanel: "Admin Panel",
      }
    };
    return (dictionary[lang] && dictionary[lang][key]) ? dictionary[lang][key] : key;
  };

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'community' | 'messages' | 'profile' | 'add' | 'saved' | 'download' | 'search'>('home');
  const [servicesSubTab, setServicesSubTab] = useState<'directory' | 'blood'>('directory');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    return localStorage.getItem('smart_khulna_selected_district') || 'khulna';
  });
  const [viewingDistrictId, setViewingDistrictId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeFeatureHub, setActiveFeatureHub] = useState<'blood-bank' | 'tourism' | 'doctors' | 'weather' | 'complaints' | 'jobs' | 'tolet' | null>(null);
  const [adminView, setAdminView] = useState<string | null>(null);
  const [releaseConfig, setReleaseConfig] = useState<AppReleaseConfig>(() => getLocalData('release_config', defaultReleaseConfig));
  const districtScrollRef = useRef<HTMLDivElement>(null);
  const [isDistrictDragging, setIsDistrictDragging] = useState(false);
  const [districtStartX, setDistrictStartX] = useState(0);
  const [districtScrollLeft, setDistrictScrollLeft] = useState(0);

  const scrollDistricts = (direction: 'left' | 'right') => {
    if (districtScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      districtScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const { isInstallable, isInstalled, installPWA, isOnline, wasOffline, resetWasOffline, platform } = usePWA();
  const [showSplash, setShowSplash] = useState(true);

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

  // Unified Navigation Configuration
  const navItems = useMemo(() => [
    { id: 'home', label: t('home'), icon: 'Home', color: 'text-emerald-700' },
    { id: 'search', label: 'খুঁজুন (Search)', icon: 'Search', color: 'text-blue-600' },
    { id: 'services', label: t('services'), icon: 'Grid', color: 'text-amber-600' },
    { id: 'community', label: t('community'), icon: 'Users', color: 'text-indigo-600', badge: 'নতুন' },
    { id: 'messages', label: t('messaging'), icon: 'MessageCircle', color: 'text-rose-600' },
    { id: 'download', label: 'অ্যাপ আপডেট', icon: 'Download', color: 'text-emerald-600', badge: 'v' + (releaseConfig?.android?.version || releaseConfig?.pwa?.version || '1.0') },
    { id: 'profile', label: t('profile'), icon: 'User', color: 'text-slate-600' },
    { id: 'saved', label: 'সংরক্ষিত', icon: 'Heart', color: 'text-rose-500' },
    { id: 'add', label: 'যোগ করুন', icon: 'PlusCircle', color: 'text-emerald-600' },
  ], [lang, currentUser, releaseConfig]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesMap, setMessagesMap] = useState<{ [convId: string]: ChatMessage[] }>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(() => getLocalData('community_reports', []));
  const [communityNotifications, setCommunityNotifications] = useState<CommunityNotification[]>(() => getLocalData('community_notifications', initialSampleNotifications));
  const [likedCommunityPostIds, setLikedCommunityPostIds] = useState<string[]>([]);
  const [savedCommunityPostIds, setSavedCommunityPostIds] = useState<string[]>([]);
  const [followingUids, setFollowingUids] = useState<string[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => getLocalData('blocked_user_ids', []));
  const [allCommunityUsers, setAllCommunityUsers] = useState<PublicUserProfile[]>(() => getLocalData('community_users', initialSampleUsers));
  const [moderationAuditLogs, setModerationAuditLogs] = useState<ModerationAction[]>(() => getLocalData('moderation_audit_logs', []));

  // Community Modals
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<PublicUserProfile | null>(null);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [userLiveNotifications, setUserLiveNotifications] = useState<UserNotificationItem[]>([]);
  const [activeForegroundNotification, setActiveForegroundNotification] = useState<UserNotificationItem | null>(null);
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
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editCoverPhoto, setEditCoverPhoto] = useState('');
  const [viewingProfileUid, setViewingProfileUid] = useState<string | null>(null);
  const [viewingPost, setViewingPost] = useState<CommunityPost | null>(null);
  const [profileScrollPosition, setProfileScrollPosition] = useState<number>(0);
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
    if (currentUser) {
      localStorage.setItem(`conversations_${currentUser.uid}`, JSON.stringify(conversations));
    }
  }, [conversations, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`messages_map_${currentUser.uid}`, JSON.stringify(messagesMap));
    }
  }, [messagesMap, currentUser]);

  useEffect(() => {
    saveLocalData('community_notifications', communityNotifications);
  }, [communityNotifications]);

  useEffect(() => {
    saveLocalData('community_reports', communityReports);
  }, [communityReports]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`liked_community_post_ids_${currentUser.uid}`, JSON.stringify(likedCommunityPostIds));
    }
  }, [likedCommunityPostIds, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`saved_community_post_ids_${currentUser.uid}`, JSON.stringify(savedCommunityPostIds));
    }
  }, [savedCommunityPostIds, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`following_uids_${currentUser.uid}`, JSON.stringify(followingUids));
    }
  }, [followingUids, currentUser]);

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

  // Real-time Firebase Notification System Initialization & Listeners
  useEffect(() => {
    const uid = currentUser?.uid || 'guest';
    const role = userProfile?.role || 'user';
    const ward = (userProfile as any)?.ward || userProfile?.upazila;

    // Initialize FCM token registration and topic subscriptions
    notificationService.initFCM(uid, role, ward);

    // Subscribe to live Firestore user notifications
    const unsubUserNotifs = notificationService.subscribeUserNotifications(uid, (items) => {
      setUserLiveNotifications(items);
    });

    // Listen for foreground notifications (heads-up banner / popup)
    const unsubForeground = notificationService.onNotificationReceived((item) => {
      setActiveForegroundNotification(item);
    });

    return () => {
      unsubUserNotifs();
      unsubForeground();
    };
  }, [currentUser?.uid, userProfile?.role, (userProfile as any)?.ward, userProfile?.upazila]);

  // Deep Link Navigator Helper
  const handleDeepLinkNavigation = (link?: string) => {
    if (!link) return;
    const cleanLink = link.toLowerCase().trim();

    if (cleanLink.includes('service') || cleanLink === '/services') {
      setActiveTab('services');
      setActiveFeatureHub(null);
    } else if (cleanLink.includes('blood') || cleanLink === '/blood-bank') {
      setActiveFeatureHub('blood-bank');
    } else if (cleanLink.includes('doctor') || cleanLink === '/doctors' || cleanLink === '/emergency') {
      setActiveFeatureHub('doctors');
    } else if (cleanLink.includes('weather') || cleanLink === '/weather') {
      setActiveFeatureHub('weather');
    } else if (cleanLink.includes('complaint') || cleanLink === '/complaints') {
      setActiveFeatureHub('complaints');
    } else if (cleanLink.includes('job') || cleanLink === '/jobs') {
      setActiveFeatureHub('jobs');
    } else if (cleanLink.includes('tolet') || cleanLink === '/tolet') {
      setActiveFeatureHub('tolet');
    } else if (cleanLink.includes('download') || cleanLink === '/downloads') {
      setActiveTab('download');
      setActiveFeatureHub(null);
    } else if (cleanLink.includes('community') || cleanLink === '/community') {
      setActiveTab('community');
      setActiveFeatureHub(null);
    } else if (cleanLink.includes('profile') || cleanLink === '/profile') {
      setActiveTab('profile');
      setActiveFeatureHub(null);
    } else if (cleanLink.includes('message') || cleanLink === '/messages') {
      setActiveTab('messages');
      setActiveFeatureHub(null);
    }
    setShowNotificationCenter(false);
  };

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
          const raw = snap.data();
          if (raw && typeof raw === 'object') {
            const cloudConfig: AppReleaseConfig = {
              ...defaultReleaseConfig,
              ...raw,
              android: { ...defaultReleaseConfig.android, ...(raw.android || {}) },
              ios: { ...defaultReleaseConfig.ios, ...(raw.ios || {}) },
              windows: { ...defaultReleaseConfig.windows, ...(raw.windows || {}) },
              macos: { ...defaultReleaseConfig.macos, ...(raw.macos || {}) },
              linux: { ...defaultReleaseConfig.linux, ...(raw.linux || {}) },
              releaseNotes: Array.isArray(raw.releaseNotes) ? raw.releaseNotes : defaultReleaseConfig.releaseNotes
            };
            setReleaseConfig(cloudConfig);
            saveLocalData('release_config', cloudConfig);
          }
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
          const cloudBanners = snap.docs
            .map(d => ({ id: d.id, ...d.data() } as Banner))
            .filter(b => b && b.title && b.image);
          if (cloudBanners.length > 0) {
            setBanners(cloudBanners);
            saveLocalData('banners', cloudBanners);
          }
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
      const featParam = searchParams.get('feature');
      if (featParam && ['blood-bank', 'tourism', 'doctors', 'weather', 'complaints', 'jobs', 'tolet'].includes(featParam)) {
        setActiveFeatureHub(featParam as any);
      }
    };
    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, []);

  const navigateTo = (tab: 'home' | 'services' | 'community' | 'messages' | 'profile' | 'add' | 'saved' | 'download' | 'search') => {
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
              subAdminPermissions: data.subAdminPermissions || localCached?.subAdminPermissions,
              subAdminScope: data.subAdminScope || localCached?.subAdminScope,
              savedServices: data.savedServices || localCached?.savedServices || [],
              isLocked: typeof data.isLocked === 'boolean' ? data.isLocked : !!localCached?.isLocked,
              showActiveStatus: typeof data.showActiveStatus === 'boolean' ? data.showActiveStatus : (localCached?.showActiveStatus !== false),
              isDeleted: !!data.isDeleted
            };
            
            // Sync with local cache and Firestore
            localStorage.setItem(`smart_khulna_profile_${firebaseUser.uid}`, JSON.stringify(updatedProfile));
            await setDoc(userDocRef, updatedProfile, { merge: true });
            setUserProfile(updatedProfile);
            
            if (data.isDeleted) {
              setShowReactivateModal(true);
            }

            // Update in community directory
            setAllCommunityUsers(prev => {
              const safePrev = Array.isArray(prev) ? prev.filter(u => u && u.uid) : [];
              const exists = safePrev.some(u => u.uid === firebaseUser.uid);
              if (exists) {
                return safePrev.map(u => (u.uid === firebaseUser.uid) ? {
                  ...u,
                  name: updatedProfile.name || u.name,
                  avatar: updatedProfile.avatar || u.avatar,
                  bio: updatedProfile.bio || u.bio,
                  phone: updatedProfile.phone || u.phone,
                  profession: updatedProfile.profession || u.profession,
                  bloodGroup: updatedProfile.bloodGroup || u.bloodGroup,
                  district: updatedProfile.district || updatedProfile.selectedDistrict || u.district,
                  upazila: updatedProfile.upazila || u.upazila,
                  address: updatedProfile.address || u.address,
                  socialLinks: {
                    facebook: updatedProfile.facebook || u.socialLinks?.facebook,
                    twitter: updatedProfile.twitter || u.socialLinks?.twitter,
                    instagram: updatedProfile.instagram || u.socialLinks?.instagram,
                    linkedin: updatedProfile.linkedin || u.socialLinks?.linkedin,
                    website: updatedProfile.website || u.socialLinks?.website
                  }
                } : u);
              }
              return [...safePrev, {
                uid: firebaseUser.uid,
                name: updatedProfile.name || displayName,
                email: updatedProfile.email || email,
                avatar: updatedProfile.avatar || photoURL || '',
                bio: updatedProfile.bio || '',
                phone: updatedProfile.phone || '',
                profession: updatedProfile.profession || '',
                bloodGroup: updatedProfile.bloodGroup || '',
                district: updatedProfile.district || updatedProfile.selectedDistrict || selectedDistrict,
                upazila: updatedProfile.upazila || '',
                address: updatedProfile.address || '',
                joinedDate: new Date().toISOString(),
                postsCount: 0,
                followersCount: 0,
                followingCount: 0,
                socialLinks: {
                  facebook: updatedProfile.facebook || '',
                  twitter: updatedProfile.twitter || '',
                  instagram: updatedProfile.instagram || '',
                  linkedin: updatedProfile.linkedin || '',
                  website: updatedProfile.website || ''
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
            savedServices: (() => {
              try { return JSON.parse(localStorage.getItem(`favs_${firebaseUser.uid}`) || '[]'); } catch { return []; }
            })()
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setViewingProfileUid(null);
        setLikedCommunityPostIds([]);
        setFollowingUids([]);
        setSavedCommunityPostIds([]);
        setConversations([]);
        setMessagesMap({});
        setActiveConversationId(null);
      }
    });

    return () => unsubscribe();
  }, [selectedDistrict]);

  const [notices, setNotices] = useState<any[]>([]);
  const [activeNotice, setActiveNotice] = useState<{ title: string; priority: string } | null>(null);

  // Real-time Notices Subscription
  useEffect(() => {
    const q = query(collection(db, 'notices'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticeList: any[] = [];
      snapshot.forEach((doc) => {
        noticeList.push({ id: doc.id, ...doc.data() });
      });
      setNotices(noticeList);
      if (noticeList.length > 0) {
        // Find highest priority notice first, then newest
        const sorted = [...noticeList].sort((a, b) => {
          const priorityMap: { [key: string]: number } = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const pA = priorityMap[a.priority] || 0;
          const pB = priorityMap[b.priority] || 0;
          if (pB !== pA) return pB - pA;
          return new Date(b.createdAt?.seconds * 1000 || 0).getTime() - new Date(a.createdAt?.seconds * 1000 || 0).getTime();
        });
        setActiveNotice(sorted[0]);
      } else {
        setActiveNotice(null);
      }
    }, (error) => {
      console.warn("Firestore notices subscription error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Community Posts Subscription
  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setCommunityPosts(initialCommunityPosts);
      } else {
        const posts: CommunityPost[] = [];
        snapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id } as CommunityPost);
        });
        posts.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
        setCommunityPosts(posts);
      }
    }, (error) => {
      console.warn("Firestore posts subscription error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Sync and fetch all community user profiles in real-time
  useEffect(() => {
    if (!currentUser) return;
    try {
      const unsub = onSnapshot(collection(db, 'profiles'), (snap) => {
        if (!snap.empty) {
          const usersList = snap.docs.map(doc => {
            const data = doc.data();
            return {
              uid: doc.id,
              name: data.name || 'ব্যবহারকারী',
              email: data.email || '',
              avatar: data.avatar || '',
              bio: data.bio || '',
              phone: data.phone || '',
              profession: data.profession || '',
              bloodGroup: data.bloodGroup || '',
              district: data.district || data.selectedDistrict || '',
              upazila: data.upazila || '',
              address: data.address || '',
              joinedDate: data.joinedDate || data.createdAt || new Date().toISOString(),
              postsCount: typeof data.postsCount === 'number' ? data.postsCount : 0,
              followersCount: typeof data.followersCount === 'number' ? data.followersCount : 0,
              followingCount: typeof data.followingCount === 'number' ? data.followingCount : 0,
              badge: data.role === 'super_admin' ? 'admin' : (data.badge || 'none'),
              isLocked: !!data.isLocked,
              showActiveStatus: data.showActiveStatus !== false,
              socialLinks: data.socialLinks || {
                facebook: data.facebook || '',
                twitter: data.twitter || '',
                instagram: data.instagram || '',
                linkedin: data.linkedin || '',
                website: data.website || ''
              }
            } as PublicUserProfile;
          });
          setAllCommunityUsers(usersList);
        }
      }, (err) => {
        console.warn("Real-time profiles listener error:", err);
      });
      return () => unsub();
    } catch (err) {
      console.warn("Real-time community profiles setup error:", err);
    }
  }, [currentUser]);

  // User-specific Likes, Follows, Saved Posts and Conversations Loader/Sync
  useEffect(() => {
    if (!currentUser) {
      setLikedCommunityPostIds([]);
      setFollowingUids([]);
      setSavedCommunityPostIds([]);
      setConversations([]);
      setMessagesMap({});
      return;
    }

    // 1. Load cached fallbacks from user-specific local storage keys
    try {
      const cacheLikes = localStorage.getItem(`likes_${currentUser.uid}`) || localStorage.getItem(`liked_community_post_ids_${currentUser.uid}`);
      if (cacheLikes) {
        const parsed = JSON.parse(cacheLikes);
        if (Array.isArray(parsed)) setLikedCommunityPostIds(parsed);
      }

      const cacheFollows = localStorage.getItem(`follows_${currentUser.uid}`) || localStorage.getItem(`following_uids_${currentUser.uid}`);
      if (cacheFollows) {
        const parsed = JSON.parse(cacheFollows);
        if (Array.isArray(parsed)) setFollowingUids(parsed);
      }

      const cacheSaved = localStorage.getItem(`saved_${currentUser.uid}`) || localStorage.getItem(`saved_community_post_ids_${currentUser.uid}`);
      if (cacheSaved) {
        const parsed = JSON.parse(cacheSaved);
        if (Array.isArray(parsed)) setSavedCommunityPostIds(parsed);
      }

      const cacheConvs = localStorage.getItem(`conversations_${currentUser.uid}`);
      if (cacheConvs) {
        const parsed = JSON.parse(cacheConvs);
        if (Array.isArray(parsed)) setConversations(parsed);
      }

      const cacheMsgs = localStorage.getItem(`messages_map_${currentUser.uid}`);
      if (cacheMsgs) {
        const parsed = JSON.parse(cacheMsgs);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) setMessagesMap(parsed);
      }
    } catch (e) {
      console.warn("Local storage cache parse warning:", e);
    }

    // 2. Set up Firestore Real-Time Subscriptions
    // Likes Subscription
    const qLikes = query(collection(db, 'likes'), where('user_id', '==', currentUser.uid));
    const unsubLikes = onSnapshot(qLikes, (snapshot) => {
      const likedIds: string[] = [];
      snapshot.forEach((doc) => {
        likedIds.push(doc.data().post_id);
      });
      setLikedCommunityPostIds(likedIds);
      localStorage.setItem(`likes_${currentUser.uid}`, JSON.stringify(likedIds));
    }, (error) => {
      console.warn("Firestore likes subscription error:", error);
    });

    // Follows Subscription
    const qFollows = query(collection(db, 'follows'), where('follower_id', '==', currentUser.uid));
    const unsubFollows = onSnapshot(qFollows, (snapshot) => {
      const followedIds: string[] = [];
      snapshot.forEach((doc) => {
        followedIds.push(doc.data().following_id);
      });
      setFollowingUids(followedIds);
      localStorage.setItem(`follows_${currentUser.uid}`, JSON.stringify(followedIds));
    }, (error) => {
      console.warn("Firestore follows subscription error:", error);
    });

    // Conversations Subscription
    const qConvs = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', currentUser.uid)
    );
    const unsubConvs = onSnapshot(qConvs, (snapshot) => {
      const convs: Conversation[] = [];
      snapshot.forEach((doc) => {
        const cData = doc.data() as Conversation;
        if (!cData.hiddenForUserIds || !cData.hiddenForUserIds.includes(currentUser.uid)) {
          convs.push({ ...cData, id: doc.id });
        }
      });
      convs.sort((a, b) => new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime());
      setConversations(convs);
      localStorage.setItem(`conversations_${currentUser.uid}`, JSON.stringify(convs));
    }, (error) => {
      console.warn("Firestore conversations subscription error:", error);
    });

    return () => {
      unsubLikes();
      unsubFollows();
      unsubConvs();
    };
  }, [currentUser]);

  // Messages Subscription for active conversation
  useEffect(() => {
    if (!currentUser || !activeConversationId || activeConversationId === 'smart-khulna-ai') return;
    
    const messagesRef = collection(db, 'conversations', activeConversationId, 'messages');
    let unsubListener: (() => void) | null = null;

    const setupListener = (useOrdering = true) => {
      const q = useOrdering ? query(messagesRef, orderBy('createdAt', 'asc')) : messagesRef;
      return onSnapshot(q, (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
        });
        msgs.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        setMessagesMap(prev => {
          const updated = {
            ...prev,
            [activeConversationId]: msgs
          };
          try {
            localStorage.setItem(`messages_map_${currentUser.uid}`, JSON.stringify(updated));
          } catch (e) {
            console.warn("Local storage save messages map warning:", e);
          }
          return updated;
        });
      }, (error) => {
        console.warn("Firestore messages subscription warning:", error);
        if (useOrdering) {
          unsubListener = setupListener(false);
        }
      });
    };

    unsubListener = setupListener(true);
    return () => {
      if (unsubListener) unsubListener();
    };
  }, [currentUser, activeConversationId]);

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

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auth.currentUser) return;
    setIsSavingProfile(true);
    try {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'profiles', uid);
      const finalName = editDisplayName.trim() || 'ব্যবহারকারী';
      const finalAvatar = editPhotoURL.trim() || userProfile?.avatar || auth.currentUser.photoURL || '';
      const finalCover = editCoverPhoto.trim() || userProfile?.coverPhoto || '';

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
        coverPhoto: finalCover,
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
            coverPhoto: fullUpdatedProfile.coverPhoto,
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

      // Asynchronously update existing posts authored by this user in Firestore
      try {
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', uid));
        getDocs(postsQuery).then(snap => {
          snap.docs.forEach(docSnap => {
            updateDoc(docSnap.ref, {
              authorName: fullUpdatedProfile.name,
              authorAvatar: fullUpdatedProfile.avatar
            }).catch(() => {});
          });
        }).catch(() => {});
      } catch (e) {
        // ignore background sync
      }

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

  const handleJoinTeamApplication = async (application: {
    fullName: string;
    phone: string;
    email: string;
    district: string;
    upazila: string;
    area: string;
    role: 'sub_admin' | 'moderator';
    reason: string;
    experience: string;
  }) => {
    const newReq = {
      ...application,
      uid: currentUser?.uid || 'guest_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        await addDoc(collection(db, 'joinRequests'), newReq);
      } catch (e) {
        console.error('Error saving join request to firestore:', e);
      }
    }
    const existingReqs = JSON.parse(localStorage.getItem('smart_khulna_join_requests') || '[]');
    localStorage.setItem('smart_khulna_join_requests', JSON.stringify([newReq, ...existingReqs]));
    await logAction('টিমে যুক্ত হওয়ার আবেদন', `${application.fullName} (${application.role}) পদের জন্য আবেদন করেছেন`);
  };

  const handleLogout = async () => {
    try {
      if (currentUser) {
        await logAction('ব্যবহারকারী লগআউট', `${currentUser.email} সিস্টেম থেকে প্রস্থান করেছেন`);
      }
      await signOut(auth);
      setViewingProfileUid(null);
      setAdminView(null);
      setActiveTab('profile');
    } catch (err) {
      console.error('Logout error:', err);
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

  const handleAddNotice = async (notice: any) => {
    try {
      await addDoc(collection(db, 'notices'), {
        ...notice,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || 'admin',
        isActive: true
      });
      await logAction('নোটিশ তৈরি', `নতুন নোটিশ "${notice.title}" যোগ করা হয়েছে`);
    } catch (e) {
      console.error("Error adding notice:", e);
      alert('নোটিশ যোগ করতে সমস্যা হয়েছে।');
    }
  };

  const handleUpdateNotice = async (id: string, updates: any) => {
    try {
      await updateDoc(doc(db, 'notices', id), updates);
      await logAction('নোটিশ আপডেট', `নোটিশ ID ${id} আপডেট করা হয়েছে`);
    } catch (e) {
      console.error("Error updating notice:", e);
    }
  };

  const isBookmarked = (type: string, id: string) => {
    const key = `smart_khulna_saved_${type}s`;
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      saved = [];
    }
    return saved.includes(id);
  };

  const toggleBookmark = async (type: string, id: string) => {
    const key = `smart_khulna_saved_${type}s`;
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      saved = [];
    }
    
    let updated: string[];
    if (saved.includes(id)) {
      updated = saved.filter(savedId => savedId !== id);
    } else {
      updated = [...saved, id];
    }
    
    localStorage.setItem(key, JSON.stringify(updated));
    // Force refresh the saved tab if active
    if (activeTab === 'saved') {
      setActiveTab('saved');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'notices', id));
      await logAction('নোটিশ মুছে ফেলা', `নোটিশ ID ${id} মুছে ফেলা হয়েছে`);
    } catch (e) {
      console.error("Error deleting notice:", e);
    }
  };

  const handleTrackProfileVisit = async (profileOwnerUid: string) => {
    if (!currentUser || currentUser.uid === profileOwnerUid) return;
    
    // Check privacy settings of owner (simplified for now, full privacy check can be added later)
    try {
      const visitRef = doc(db, 'profiles', profileOwnerUid, 'profileVisits', currentUser.uid);
      await setDoc(visitRef, {
        visitorUid: currentUser.uid,
        visitorName: currentUser.displayName || userProfile?.name || 'ব্যবহারকারী',
        visitorPhoto: currentUser.photoURL || userProfile?.avatar || '',
        visitedAt: serverTimestamp(),
        lastVisitedAt: serverTimestamp(),
        visitCount: increment(1)
      }, { merge: true });
    } catch (e) {
      console.warn("Profile visit tracking error:", e);
    }
  };

  // Saved/Favorites Operations
  const isSaved = (serviceId: string) => {
    if (userProfile) {
      return Array.isArray(userProfile.savedServices) ? userProfile.savedServices.includes(serviceId) : false;
    }
    let localFavs: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('smart_khulna_local_favs') || '[]');
      localFavs = Array.isArray(parsed) ? parsed : [];
    } catch {
      localFavs = [];
    }
    return localFavs.includes(serviceId);
  };

  const toggleSaveService = async (serviceId: string) => {
    await toggleBookmark('service', serviceId);
  };

  // Submit Information
  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePhone || !newServiceAddress) return;

    const newId = 'ser_' + Date.now();
    const newService: Service = {
      id: newId,
      name: newServiceName,
      slug: newServiceName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      description: newServiceDescription || 'ব্যবহারকারী কর্তৃক জমা দেওয়া স্থানীয় সেবা প্রতিষ্ঠান।',
      category_id: newServiceCategory,
      district_id: newServiceDistrict,
      upazila_id: newServiceUpazila || 'সদর',
      address: newServiceAddress,
      phone: newServicePhone,
      website: newServiceWebsite || '',
      facebook: newServiceFacebook || '',
      latitude: 22.82,
      longitude: 89.54,
      opening_hours: 'সকাল ৯:০০ - রাত ৮:০০',
      is_verified: false,
      status: 'PENDING',
      created_by: currentUser?.uid || 'guest',
      owner_id: currentUser?.uid || 'guest',
      submitted_by: currentUser?.email || currentUser?.displayName || 'অতিথি ব্যবহারকারী',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setServices(prev => [newService, ...prev]);
    setSubmissions(prev => [newService, ...prev]);
    setFormSubmittedSuccess(true);
    await logAction('নতুন তথ্য সাবমিশন', `ব্যবহারকারী "${newServiceName}" তথ্য যোগ করার অনুরোধ করেছেন`);

    try {
      await setDoc(doc(db, 'services', newId), newService);
    } catch (e) {
      console.warn("Firestore service submission fallback:", e);
    }

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
    const list = Array.isArray(services) ? services : [];
    return list.filter(s => s && s.district_id === districtId && s.status === 'PUBLISHED').length;
  };

  // Filter and search services lists
  const filteredServices = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    return list.filter(s => {
      if (!s || typeof s !== 'object') return false;
      // Ensure only approved or published services are shown to normal users
      if (s.status !== 'APPROVED' && s.status !== 'PUBLISHED') return false;

      // Filter by District
      if (s.district_id !== selectedDistrict) return false;

      // Filter by Category
      if (filterCategory !== 'all' && s.category_id !== filterCategory) return false;

      // Filter by verified status
      if (filterVerifiedOnly && !s.is_verified) return false;

      // Filter by Upazila
      if (filterUpazila && !(s.upazila_id || '').toLowerCase().includes(filterUpazila.toLowerCase())) return false;

      // Match Search query
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        const matchesName = (s.name || '').toLowerCase().includes(queryLower);
        const matchesDesc = (s.description || '').toLowerCase().includes(queryLower);
        const matchesAddress = (s.address || '').toLowerCase().includes(queryLower);
        const catName = initialCategories.find(c => c && c.id === s.category_id)?.name || '';
        const matchesCategory = catName.toLowerCase().includes(queryLower);
        return matchesName || matchesDesc || matchesAddress || matchesCategory;
      }

      return true;
    });
  }, [services, selectedDistrict, filterCategory, filterVerifiedOnly, filterUpazila, searchQuery]);

  // District specific emergency services
  const localEmergencies = useMemo(() => {
    const list = Array.isArray(emergencyContacts) ? emergencyContacts : [];
    return list.filter(e => e && typeof e === 'object' && (!e.districtId || e.districtId === selectedDistrict));
  }, [emergencyContacts, selectedDistrict]);

  // Admin Dashboard Statistics
  const stats = useMemo(() => {
    const sList = Array.isArray(services) ? services : [];
    const logList = Array.isArray(auditLogs) ? auditLogs : [];
    return {
      totalServices: sList.length,
      publishedServices: sList.filter(s => s && (s.status === 'APPROVED' || s.status === 'PUBLISHED')).length,
      pendingSubmissions: sList.filter(s => s && s.status === 'PENDING').length,
      verifiedServices: sList.filter(s => s && s.is_verified).length,
      totalLogs: logList.length,
      districtsCount: initialDistricts.length
    };
  }, [services, submissions, auditLogs]);

  // Handle Submissions Actions (Approve/Reject)
  const handleApproveSubmission = async (sub: any) => {
    const updatedService = {
      ...sub,
      status: 'APPROVED',
      is_verified: true,
      approved_at: new Date().toISOString(),
      approved_by: currentUser?.uid || '',
      updated_at: new Date().toISOString()
    };

    setServices(prev => prev.map(s => s.id === sub.id ? updatedService : s));
    setSubmissions(prev => prev.map(s => s.id === sub.id ? updatedService : s));

    try {
      await setDoc(doc(db, 'services', sub.id), updatedService, { merge: true });
    } catch (e) {
      console.warn("Firestore service approval sync fallback:", e);
    }

    // Send notification to user
    const recipientUid = sub.created_by || sub.owner_id;
    if (recipientUid && recipientUid !== 'guest') {
      const notifId = 'notif_' + Date.now();
      const notif = {
        id: notifId,
        recipientUid,
        title: 'সেবা অনুমোদিত হয়েছে',
        message: `আপনার সেবা "${sub.name}" অনুমোদিত হয়েছে এবং এখন Smart Khulna-তে দেখা যাচ্ছে।`,
        read: false,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'notifications', notifId), notif);
      } catch (e) {
        console.warn("Notification sync fallback:", e);
      }
    }

    await logAction('অনুমোদন ও প্রকাশ', `অ্যাডমিন "${sub.name}" সেবাটি অনুমোদন করে ওয়েবসাইটে প্রকাশ করেছেন`);
    alert('সেবা সফলভাবে অনুমোদিত এবং প্রকাশিত হয়েছে!');
  };

  const handleRejectSubmission = async (sub: any, reason: string = 'যথাযথ তথ্য বা শর্ত পূরণ না হওয়ায় প্রত্যাখ্যান করা হয়েছে') => {
    const updatedService = {
      ...sub,
      status: 'REJECTED',
      rejectionReason: reason,
      rejected_at: new Date().toISOString(),
      rejected_by: currentUser?.uid || '',
      updated_at: new Date().toISOString()
    };

    setServices(prev => prev.map(s => s.id === sub.id ? updatedService : s));
    setSubmissions(prev => prev.map(s => s.id === sub.id ? updatedService : s));

    try {
      await setDoc(doc(db, 'services', sub.id), updatedService, { merge: true });
    } catch (e) {
      console.warn("Firestore service rejection sync fallback:", e);
    }

    // Send notification to user
    const recipientUid = sub.created_by || sub.owner_id;
    if (recipientUid && recipientUid !== 'guest') {
      const notifId = 'notif_' + Date.now();
      const notif = {
        id: notifId,
        recipientUid,
        title: 'সেবা অনুমোদিত হয়নি',
        message: `আপনার সেবা "${sub.name}" অনুমোদিত হয়নি। কারণ: ${reason}`,
        read: false,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'notifications', notifId), notif);
      } catch (e) {
        console.warn("Notification sync fallback:", e);
      }
    }

    await logAction('প্রত্যাখ্যান', `অ্যাডমিন "${sub.name}" সেবাটি প্রত্যাখ্যান করেছেন। কারণ: ${reason}`);
    alert('সেবা প্রত্যাখ্যান করা হয়েছে এবং ব্যবহারকারীকে কারণসহ জানানো হয়েছে।');
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
    const liveUnread = userLiveNotifications.filter(n => !n.isRead).length;
    const commList = Array.isArray(communityNotifications) ? communityNotifications : [];
    const commUnread = commList.filter(n => n && !n.isRead && (!currentUser || n.recipientUid === currentUser.uid || n.recipientUid === 'all')).length;
    return liveUnread + commUnread;
  }, [userLiveNotifications, communityNotifications, currentUser]);

  const totalUnreadMessages = useMemo(() => {
    if (!currentUser?.uid || !Array.isArray(conversations)) return 0;
    return conversations.reduce((acc, c) => acc + (c && c.unreadCounts ? (c.unreadCounts[currentUser.uid] || 0) : 0), 0);
  }, [conversations, currentUser]);

  const handleFollow = async (targetUid: string) => {
    if (!requireAuth('ফলো')) return;
    if (targetUid === currentUser.uid) return;
    
    try {
      const followId = `${currentUser.uid}_${targetUid}`;
      await setDoc(doc(db, 'follows', followId), {
        followerUid: currentUser.uid,
        followingUid: targetUid,
        createdAt: new Date().toISOString()
      });
      setFollowingUids(prev => [...prev, targetUid]);
      // Update counts locally
      setAllCommunityUsers(prev => prev.map(u => {
        if (u.uid === targetUid) return { ...u, followersCount: (u.followersCount || 0) + 1, isFollowing: true };
        if (u.uid === currentUser.uid) return { ...u, followingCount: (u.followingCount || 0) + 1 };
        return u;
      }));
      await logAction('ফলো', `আপনি ${targetUid} কে ফলো করা শুরু করেছেন`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfollow = async (targetUid: string) => {
    if (!currentUser) return;
    try {
      const followId = `${currentUser.uid}_${targetUid}`;
      await deleteDoc(doc(db, 'follows', followId));
      setFollowingUids(prev => prev.filter(uid => uid !== targetUid));
      // Update counts locally
      setAllCommunityUsers(prev => prev.map(u => {
        if (u.uid === targetUid) return { ...u, followersCount: Math.max(0, (u.followersCount || 0) - 1), isFollowing: false };
        if (u.uid === currentUser.uid) return { ...u, followingCount: Math.max(0, (u.followingCount || 0) - 1) };
        return u;
      }));
      await logAction('আনফলো', `আপনি ${targetUid} কে আনফলো করেছেন`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCover = async (url: string) => {
    if (!currentUser) return;

    // 1. Update user profile state and local storage cache
    const updatedProfile = {
      ...(userProfile || {
        uid: currentUser.uid,
        name: currentUser.displayName || 'সম্মানিত নাগরিক',
        email: currentUser.email || '',
        avatar: currentUser.photoURL || '',
        role: 'user',
        selectedDistrict,
        savedServices: []
      }),
      coverPhoto: url
    } as UserProfile;

    setUserProfile(updatedProfile);
    try {
      localStorage.setItem(`smart_khulna_profile_${currentUser.uid}`, JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn("Local storage cover photo save warning:", e);
    }

    // 2. Update community directory user list
    setAllCommunityUsers(prev => {
      const exists = prev.some(u => u.uid === currentUser.uid);
      if (exists) {
        return prev.map(u => u.uid === currentUser.uid ? { ...u, coverPhoto: url } : u);
      }
      return [...prev, {
        uid: currentUser.uid,
        name: updatedProfile.name,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        coverPhoto: url,
        bio: updatedProfile.bio || '',
        joinedDate: updatedProfile.joinedDate || new Date().toISOString(),
        badge: 'none',
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
      } as PublicUserProfile];
    });

    // 3. Persist to Firestore
    try {
      await setDoc(doc(db, 'profiles', currentUser.uid), { coverPhoto: url }, { merge: true });
    } catch (e) {
      console.warn("Firestore coverPhoto sync warning:", e);
    }
  };

  const handleViewProfile = (uid: string) => {
    setViewingProfileUid(uid);
    setActiveTab('profile');

    // Log Profile Visit
    if (currentUser && uid !== currentUser.uid) {
      const visitObj = {
        id: `${uid}_${currentUser.uid}`,
        targetUid: uid,
        visitorUid: currentUser.uid,
        visitorName: userProfile?.name || currentUser.displayName || 'সম্মানিত নাগরিক',
        visitorAvatar: userProfile?.avatar || currentUser.photoURL || '',
        timestamp: new Date().toISOString()
      };

      // 1. Immediately log to local cache for instant visitor count updates
      try {
        const localKey = `profile_visitors_${uid}`;
        const existingRaw = localStorage.getItem(localKey);
        let existingList = existingRaw ? JSON.parse(existingRaw) : [];
        if (!Array.isArray(existingList)) existingList = [];
        existingList = [visitObj, ...existingList.filter((v: any) => v.visitorUid !== currentUser.uid)].slice(0, 50);
        localStorage.setItem(localKey, JSON.stringify(existingList));
      } catch (e) {
        console.warn("Local storage visitor save warning:", e);
      }

      // 2. Persist to Firestore
      setDoc(doc(db, 'profiles', uid, 'visitors', currentUser.uid), visitObj, { merge: true })
        .catch(err => console.warn('Profile visit log Firestore warning:', err));
    }
  };

  const targetProfileUid = viewingProfileUid || currentUser?.uid;
  const targetProfile = useMemo(() => {
    const safeUsers = Array.isArray(allCommunityUsers) ? allCommunityUsers : [];
    const safePosts = Array.isArray(communityPosts) ? communityPosts : [];
    const safeFollows = Array.isArray(followingUids) ? followingUids : [];

    // Guest Profile Fallback if not logged in and not viewing specific profile
    if (!targetProfileUid) {
      return {
        uid: 'guest',
        name: 'অতিথি নাগরিক',
        email: 'guest@smartkhulna.gov.bd',
        avatar: '',
        bio: 'স্মার্ট খুলনা ডিজিটাল নাগরিক সেবা প্ল্যাটফর্মে স্বাগতম।',
        coverPhoto: '',
        phone: '',
        profession: 'ডিজিটাল নাগরিক',
        bloodGroup: '',
        district: selectedDistrict || 'khulna',
        upazila: '',
        address: 'খুলনা বিভাগ',
        socialLinks: {},
        joinedDate: new Date().toISOString(),
        badge: 'none',
        postsCount: 0,
        followersCount: 0, 
        followingCount: 0,
        isFollowing: false
      } as PublicUserProfile;
    }

    // 1. Current user profile takes priority for own profile view (ensures immediate UI updates for cover photo, avatar, etc.)
    if (currentUser && targetProfileUid === currentUser.uid) {
      const profileFromAll = safeUsers.find(u => u && u.uid === currentUser.uid);
      const postsCount = safePosts.filter(p => p && p.authorId === currentUser.uid).length;
      return {
        ...(profileFromAll || {}),
        uid: currentUser.uid,
        name: userProfile?.name || currentUser.displayName || profileFromAll?.name || 'সম্মানিত নাগরিক',
        email: currentUser.email || profileFromAll?.email || '',
        avatar: userProfile?.avatar || currentUser.photoURL || profileFromAll?.avatar || '',
        bio: userProfile?.bio || profileFromAll?.bio || '',
        coverPhoto: userProfile?.coverPhoto || profileFromAll?.coverPhoto || '',
        phone: userProfile?.phone || profileFromAll?.phone || '',
        profession: userProfile?.profession || profileFromAll?.profession || '',
        bloodGroup: userProfile?.bloodGroup || profileFromAll?.bloodGroup || '',
        district: userProfile?.district || userProfile?.selectedDistrict || profileFromAll?.district || selectedDistrict || 'khulna',
        upazila: userProfile?.upazila || profileFromAll?.upazila || '',
        address: userProfile?.address || profileFromAll?.address || '',
        socialLinks: {
          facebook: userProfile?.facebook || profileFromAll?.socialLinks?.facebook,
          twitter: userProfile?.twitter || profileFromAll?.socialLinks?.twitter,
          instagram: userProfile?.instagram || profileFromAll?.socialLinks?.instagram,
          linkedin: userProfile?.linkedin || profileFromAll?.socialLinks?.linkedin,
          website: userProfile?.website || profileFromAll?.socialLinks?.website
        },
        joinedDate: userProfile?.joinedDate || profileFromAll?.joinedDate || new Date().toISOString(),
        badge: userProfile?.role === 'super_admin' ? 'admin' : (userProfile?.role === 'sub_admin' ? 'govt_official' : ((userProfile as any)?.badge || profileFromAll?.badge || 'none')),
        postsCount: profileFromAll?.postsCount || postsCount,
        followersCount: profileFromAll?.followersCount || 0, 
        followingCount: safeFollows.length,
        isFollowing: false
      } as PublicUserProfile;
    }

    // 2. Viewing another user's profile
    const profile = safeUsers.find(u => u && u.uid === targetProfileUid);
    const postsCount = safePosts.filter(p => p && p.authorId === targetProfileUid).length;
    
    if (profile) {
      return {
        ...profile,
        postsCount: profile.postsCount || postsCount,
        isFollowing: safeFollows.includes(targetProfileUid)
      };
    }

    // Default Fallback for viewing another user's profile before full sync
    return {
      uid: targetProfileUid,
      name: 'ডিজিটাল নাগরিক',
      email: '',
      avatar: '',
      bio: '',
      coverPhoto: '',
      phone: '',
      profession: '',
      bloodGroup: '',
      district: selectedDistrict || 'khulna',
      upazila: '',
      address: '',
      socialLinks: {},
      joinedDate: new Date().toISOString(),
      badge: 'none',
      postsCount,
      followersCount: 0,
      followingCount: 0,
      isFollowing: safeFollows.includes(targetProfileUid)
    } as PublicUserProfile;
  }, [targetProfileUid, allCommunityUsers, currentUser, userProfile, selectedDistrict, communityPosts, followingUids]);

  const targetPosts = useMemo(() => {
    const list = Array.isArray(communityPosts) ? communityPosts : [];
    return list
      .filter(p => p && p.authorId === targetProfileUid)
      .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
  }, [communityPosts, targetProfileUid]);

  const targetServices = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    return list.filter(s => s && s.created_by === targetProfileUid);
  }, [services, targetProfileUid]);

  const targetFollowers = useMemo(() => {
    if (!targetProfileUid) return [];
    const list = Array.isArray(allCommunityUsers) ? allCommunityUsers : [];
    return list.filter(u => u && u.uid !== targetProfileUid).slice(0, 12);
  }, [allCommunityUsers, targetProfileUid]);

  const targetFollowing = useMemo(() => {
    if (!targetProfileUid) return [];
    const list = Array.isArray(allCommunityUsers) ? allCommunityUsers : [];
    const safeFollows = Array.isArray(followingUids) ? followingUids : [];
    if (targetProfileUid === currentUser?.uid) {
      return list.filter(u => u && safeFollows.includes(u.uid));
    }
    return list.filter(u => u && u.uid !== targetProfileUid).slice(5, 10);
  }, [allCommunityUsers, targetProfileUid, currentUser, followingUids]);

  const handleSavePost = async (postData: Partial<CommunityPost>) => {
    if (!currentUser) return;
    const currentUid = currentUser.uid;
    const currentName = userProfile?.name || currentUser.displayName || 'ব্যবহারকারী';
    const currentEmail = currentUser.email || '';
    const currentAvatar = userProfile?.avatar || currentUser.photoURL || '';

    if (editingPost) {
      const createdAtTime = new Date(editingPost.createdAt).getTime();
      if (Date.now() - createdAtTime > 2 * 60 * 60 * 1000) {
        alert('২ ঘণ্টা সময়সীমা পার হয়ে যাওয়ায় এই পোস্টটি আর সম্পাদনা করা যাবে না।');
        setEditingPost(null);
        return;
      }

      const updateData = {
        ...postData,
        isEdited: true,
        editedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCommunityPosts(prev => prev.map(p => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            ...updateData
          } as CommunityPost;
        }
        return p;
      }));
      try {
        await setDoc(doc(db, 'posts', editingPost.id), updateData, { merge: true });
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
        createdAt: new Date().toISOString(),
        createdAtMillis: Date.now()
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
    const likeDocId = `${currentUser.uid}_${postId}`;
    const likeRef = doc(db, 'likes', likeDocId);
    const postRef = doc(db, 'posts', postId);

    // Get latest likes values from Firestore if possible for accuracy
    let latestLikesCount = 0;
    let latestLikedBy: string[] = [];
    try {
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const pData = postSnap.data();
        latestLikesCount = pData.likesCount || 0;
        latestLikedBy = pData.likedBy || [];
      }
    } catch (e) {
      console.warn("Could not fetch latest post state for liking:", e);
    }

    if (isLiked) {
      // Optimistic updates for responsive UI
      setLikedCommunityPostIds(prev => prev.filter(id => id !== postId));
      
      const updatedLikedBy = latestLikedBy.filter(uid => uid !== currentUser.uid);
      const updatedLikesCount = Math.max(0, latestLikesCount - 1);

      try {
        await deleteDoc(likeRef);
        await setDoc(postRef, {
          likesCount: updatedLikesCount,
          likedBy: updatedLikedBy
        }, { merge: true });
      } catch (e) {
        console.error("Firestore unlike error:", e);
        alert('লাইক রিমুভ করতে সমস্যা হয়েছে।');
      }
    } else {
      // Optimistic updates
      setLikedCommunityPostIds(prev => [...prev, postId]);

      const updatedLikedBy = latestLikedBy.includes(currentUser.uid)
        ? latestLikedBy
        : [...latestLikedBy, currentUser.uid];
      const updatedLikesCount = latestLikesCount + 1;

      try {
        await setDoc(likeRef, {
          id: likeDocId,
          user_id: currentUser.uid,
          post_id: postId,
          created_at: new Date().toISOString()
        });

        await setDoc(postRef, {
          likesCount: updatedLikesCount,
          likedBy: updatedLikedBy
        }, { merge: true });

        // Fetch author to send notification
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postAuthorId = postSnap.data().authorId;
          if (postAuthorId && postAuthorId !== currentUser.uid) {
            const newNotifId = 'notif_' + Date.now();
            const newNotif: CommunityNotification = {
              id: newNotifId,
              recipientUid: postAuthorId,
              actorUid: currentUser.uid,
              actorName: currentUser.displayName || 'ব্যবহারকারী',
              actorAvatar: currentUser.photoURL || '',
              type: 'post_like',
              title: 'আপনার পোস্টে লাইক পড়েছে',
              message: `${currentUser.displayName || 'ব্যবহারকারী'} আপনার পোস্টে লাইক দিয়েছেন`,
              targetId: postId,
              targetType: 'post',
              isRead: false,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'notifications', newNotifId), newNotif);
          }
        }
      } catch (e) {
        console.error("Firestore like error:", e);
        alert('লাইক দিতে সমস্যা হয়েছে।');
      }
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
      authorAvatar: currentUser.photoURL || userProfile?.avatar || '',
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
            actorAvatar: currentUser.photoURL || userProfile?.avatar || '',
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
      authorAvatar: currentUser.photoURL || userProfile?.avatar || '',
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


  const handleToggleFollow = async (targetUid: string) => {
    if (!requireAuth('Follow')) return;
    if (targetUid === currentUser.uid) return;
    const isFollowing = followingUids.includes(targetUid);
    const followDocId = `${currentUser.uid}_${targetUid}`;
    const followRef = doc(db, 'follows', followDocId);

    // References to profiles
    const currentUserProfileRef = doc(db, 'profiles', currentUser.uid);
    const targetUserProfileRef = doc(db, 'profiles', targetUid);

    // Get current profiles counts from Firestore for precision
    let currentFollowingCount = 0;
    let targetFollowersCount = 0;

    try {
      const currentProfileSnap = await getDoc(currentUserProfileRef);
      if (currentProfileSnap.exists()) {
        currentFollowingCount = currentProfileSnap.data().followingCount || 0;
      }
      const targetProfileSnap = await getDoc(targetUserProfileRef);
      if (targetProfileSnap.exists()) {
        targetFollowersCount = targetProfileSnap.data().followersCount || 0;
      }
    } catch (e) {
      console.warn("Could not get profiles for follow counts:", e);
    }

    if (isFollowing) {
      // Optimistic updates
      setFollowingUids(prev => prev.filter(id => id !== targetUid));
      try {
        await deleteDoc(followRef);
        await setDoc(currentUserProfileRef, {
          followingCount: Math.max(0, currentFollowingCount - 1)
        }, { merge: true });
        await setDoc(targetUserProfileRef, {
          followersCount: Math.max(0, targetFollowersCount - 1)
        }, { merge: true });
      } catch (e) {
        console.error("Firestore unfollow error:", e);
        alert('ফলো রিমুভ করতে সমস্যা হয়েছে।');
      }
    } else {
      // Optimistic updates
      setFollowingUids(prev => [...prev, targetUid]);
      try {
        await setDoc(followRef, {
          id: followDocId,
          follower_id: currentUser.uid,
          following_id: targetUid,
          created_at: new Date().toISOString()
        });

        await setDoc(currentUserProfileRef, {
          followingCount: currentFollowingCount + 1
        }, { merge: true });
        const targetProfileSnapCheck = await getDoc(targetUserProfileRef);
        if (targetProfileSnapCheck.exists()) {
          const freshFollowersCount = targetProfileSnapCheck.data().followersCount || 0;
          await setDoc(targetUserProfileRef, {
            followersCount: freshFollowersCount + 1
          }, { merge: true });
        } else {
          const targetUserObj = allCommunityUsers.find(u => u.uid === targetUid);
          await setDoc(targetUserProfileRef, {
            uid: targetUid,
            name: targetUserObj?.name || 'ব্যবহারকারী',
            email: targetUserObj?.email || '',
            avatar: targetUserObj?.avatar || '',
            followersCount: 1,
            followingCount: 0,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        // Add Notification in Firestore
        const newNotifId = 'notif_' + Date.now();
        const newNotif: CommunityNotification = {
          id: newNotifId,
          recipientUid: targetUid,
          actorUid: currentUser.uid,
          actorName: currentUser.displayName || 'ব্যবহারকারী',
          actorAvatar: currentUser.photoURL || '',
          type: 'new_follower',
          title: 'নতুন ফলোয়ার',
          message: `${currentUser.displayName || 'ব্যবহারকারী'} আপনাকে ফলো করতে শুরু করেছেন`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'notifications', newNotifId), newNotif);
      } catch (e) {
        console.error("Firestore follow error:", e);
        alert('ফলো করতে সমস্যা হয়েছে।');
      }
    }
  };

  const handleStartMessage = async (targetUid: string, targetName: string, targetEmail: string, targetAvatar?: string) => {
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
      const targetUser = allCommunityUsers.find(u => u.uid === targetUid);
      const resolvedName = targetName || targetUser?.name || 'ব্যবহারকারী';
      const resolvedEmail = targetEmail || targetUser?.email || '';
      const resolvedAvatar = targetAvatar || targetUser?.avatar || '';

      existing = {
        id: newConvId,
        participantIds: [currentUser.uid, targetUid],
        participants: {
          [currentUser.uid]: {
            uid: currentUser.uid,
            name: currentUser.displayName || userProfile?.name || 'ব্যবহারকারী',
            email: currentUser.email || userProfile?.email || '',
            avatar: currentUser.photoURL || userProfile?.avatar || ''
          },
          [targetUid]: {
            uid: targetUid,
            name: resolvedName,
            email: resolvedEmail,
            avatar: resolvedAvatar
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
      } catch (err) {
        console.warn('Firestore setDoc conversation fallback:', err);
      }
      setConversations(prev => [existing!, ...prev.filter(c => c.id !== existing!.id)]);
    }

    setActiveConversationId(existing.id);
    setActiveTab('messages');
    setViewingProfileUid(null);
    setShowUserProfileModal(false);
  };

  const handleSendMessage = async (conversationId: string, text: string, attachmentsOrMediaUrl?: any, mediaType?: 'image' | 'file') => {
    if (!currentUser) return;
    let conv = conversations.find(c => c.id === conversationId);
    if (!conv) {
      try {
        const snap = await getDoc(doc(db, 'conversations', conversationId));
        if (snap.exists()) {
          conv = { ...snap.data(), id: snap.id } as Conversation;
        }
      } catch (e) {
        console.error('Failed to fetch conversation:', e);
      }
    }
    if (!conv) {
      alert('কথোপকথন পাওয়া যায়নি।');
      return;
    }

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
      senderAvatar: currentUser.photoURL || userProfile?.avatar || '',
      text,
      attachments,
      isRead: false,
      createdAt: new Date().toISOString(),
      createdAtMillis: Date.now()
    };

    // Save to Firestore
    try {
      // 1. Add Message
      await setDoc(doc(db, 'conversations', conversationId, 'messages', newMsg.id), newMsg);
      
      // 2. Update Conversation
      const convRef = doc(db, 'conversations', conversationId);
      const updatePayload: any = {
        lastMessage: {
          text: newMsg.text || (attachments.length > 0 && attachments[0].type === 'image' ? '📷 ছবি' : '📎 ফাইল'),
          senderId: newMsg.senderId,
          senderName: newMsg.senderName,
          timestamp: newMsg.createdAt,
          isRead: false
        },
        updatedAt: new Date().toISOString(),
        hiddenForUserIds: []
      };
      if (otherUid) {
        updatePayload['unreadCounts.' + otherUid] = (conv.unreadCounts?.[otherUid] || 0) + 1;
      }
      await updateDoc(convRef, updatePayload);
      
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
        actorAvatar: currentUser.photoURL || userProfile?.avatar || '',
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
    // Optimistic UI update
    setMessagesMap(prev => {
      const remaining = (prev[conversationId] || []).filter(m => m.id !== messageId);
      if (currentUser) {
        localStorage.setItem(`messages_map_${currentUser.uid}`, JSON.stringify({ ...prev, [conversationId]: remaining }));
      }
      return {
        ...prev,
        [conversationId]: remaining
      };
    });

    try {
      await deleteDoc(doc(db, 'conversations', conversationId, 'messages', messageId));
    } catch (err) {
      console.warn('Firestore message deletion notice (local state updated):', err);
    }
  };

  const handleEditMessage = async (conversationId: string, messageId: string, newText: string) => {
    if (!currentUser) return;
    const msgList = messagesMap[conversationId] || [];
    const msg = msgList.find(m => m.id === messageId);
    if (!msg) return;

    if (Date.now() - new Date(msg.createdAt).getTime() > 2 * 60 * 60 * 1000) {
      alert('২ ঘণ্টা সময়সীমা পার হয়ে যাওয়ায় এই বার্তাটি আর সম্পাদনা করা যাবে না।');
      return;
    }

    try {
      const msgRef = doc(db, 'conversations', conversationId, 'messages', messageId);
      await updateDoc(msgRef, {
        text: newText,
        isEdited: true,
        editedAt: new Date().toISOString()
      });
      setMessagesMap(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(m => m.id === messageId ? { ...m, text: newText, isEdited: true, editedAt: new Date().toISOString() } : m)
      }));
    } catch (e) {
      console.error("Failed to edit message:", e);
      alert('বার্তা সম্পাদনা করতে সমস্যা হয়েছে (সম্ভবত ২ ঘণ্টা সময়সীমা পার হয়ে গেছে)।');
    }
  };

  const handleDeleteMessages = async (conversationId: string, messageIds: string[]) => {
    if (!messageIds || messageIds.length === 0) return;
    const idsSet = new Set(messageIds);

    // Optimistic UI update
    setMessagesMap(prev => {
      const remaining = (prev[conversationId] || []).filter(m => !idsSet.has(m.id));
      if (currentUser) {
        localStorage.setItem(`messages_map_${currentUser.uid}`, JSON.stringify({ ...prev, [conversationId]: remaining }));
      }
      return {
        ...prev,
        [conversationId]: remaining
      };
    });

    try {
      await Promise.all(messageIds.map(messageId => 
        deleteDoc(doc(db, 'conversations', conversationId, 'messages', messageId)).catch(e => console.warn("Single doc delete error:", e))
      ));
    } catch (err) {
      console.warn('Firestore messages batch deletion notice (local state updated):', err);
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
    <div className="h-full max-h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 flex flex-col items-center font-sans">
      {/* Animated Branded Launch Screen on cold start */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            sessionStorage.setItem('smart_khulna_splash_shown', 'true');
            setShowSplash(false);
          }}
        />
      )}

      {/* Account Reactivation Modal overlay */}
      {showReactivateModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-4 border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle size={36} />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">স্বাগতম ফিরে এসেছেন! (Welcome Back!)</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার অ্যাকাউন্টটি পূর্বে ডিলিট বা নিষ্ক্রিয় করা হয়েছিল। আপনি কি আপনার অ্যাকাউন্টটি পুনরায় সচল বা অ্যাক্টিভেট করতে চান?
              </p>
              <div className="text-left text-[11px] bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-slate-600 dark:text-slate-300">
                <p className="font-bold text-slate-800 dark:text-slate-200">সচল করলে যা যা ফিরে পাবেন:</p>
                <p>• আপনার পূর্বের সকল পোস্ট ও সার্ভিস তথ্য</p>
                <p>• আপনার ফ্রেন্ডস, ফলোয়ার্স ও পূর্বের চ্যাট হিস্ট্রি</p>
                <p>• নাগরিক ভেরিফিকেশন স্ট্যাটাস ও অন্যান্য সেটিংস</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={async () => {
                  try {
                    if (currentUser) {
                      const userDocRef = doc(db, 'profiles', currentUser.uid);
                      await setDoc(userDocRef, { isDeleted: false }, { merge: true });
                      
                      // Update local states
                      setUserProfile(prev => {
                        if (prev) {
                          const updated = { ...prev, isDeleted: false };
                          localStorage.setItem(`smart_khulna_profile_${currentUser.uid}`, JSON.stringify(updated));
                          return updated;
                        }
                        return null;
                      });
                      
                      setShowReactivateModal(false);
                      alert("অভিনন্দন! আপনার অ্যাকাউন্টটি সফলভাবে পুনরায় সচল করা হয়েছে।");
                    }
                  } catch (err) {
                    console.error("Failed to reactivate account:", err);
                    alert("অ্যাকাউন্ট সচল করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
                  }
                }}
                className="w-full py-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md cursor-pointer"
              >
                হ্যাঁ, সচল করতে চাই (Reactivate)
              </button>
              
              <button
                onClick={() => {
                  // Sign out and close
                  auth.signOut();
                  setShowReactivateModal(false);
                }}
                className="w-full py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                না, লগআউট করুন (Logout)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Connectivity / Offline status banner */}
      <OfflineBanner
        isOnline={isOnline}
        wasOffline={wasOffline}
        onDismissReconnected={resetWasOffline}
      />
      <InstallPromptBanner />

      {/* MOBILE DRAWER (Slide-out Navigation Menu) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          {/* Overlay Backdrop with fade-in */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer content with slide-in animation */}
          <div className="relative flex w-full max-w-xs flex-col bg-slate-900 text-slate-100 p-0 shadow-2xl border-r border-slate-800 h-full overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Header Area */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer z-10"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>

              {/* Sidebar Branding */}
              <div 
                className="flex items-center gap-3 mb-4 mt-2 drawer-branding-interactive group cursor-pointer"
                onClick={() => {
                  navigateTo('home');
                  setIsDrawerOpen(false);
                }}
                title="স্মার্ট খুলনা — হোম পেজ"
              >
                <SmartKhulnaLogo 
                  size={40} 
                  showGlow={true} 
                  id="drawer-brand-logo" 
                  className="transition-transform duration-300"
                />
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white font-serif group-hover:text-emerald-300 transition-colors">স্মার্ট খুলনা</h2>
                  <p className="text-[9px] text-lime-400 font-medium">Smart Khulna local platform</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-serif">
                খুলনা বিভাগের সকল জেলা, জরুরি যোগাযোগ, স্বাস্থ্যসেবা ও পেশাজীবীদের তথ্য নিয়ে সম্পূর্ণ ডিজিটালাইজড লোকাল-সার্ভিস ডিরেক্টরি।
              </p>
            </div>

            {/* Navigation Links - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id as any);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                    activeTab === item.id ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <IconComponent name={item.icon} size={16} /> 
                    {item.label}
                  </span>
                  {item.badge && <span className="text-[9px] bg-emerald-700/80 text-lime-300 px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
                  {item.id === 'messages' && totalUnreadMessages > 0 && (
                    <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      {totalUnreadMessages}
                    </span>
                  )}
                </button>
              ))}

              {/* Special Citizen Hubs in Drawer */}
              <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-0.5">
                <p className="px-3.5 py-1 text-[10px] font-bold text-lime-400 uppercase tracking-wider">নাগরিক স্পেশাল হাব</p>
                <button
                  onClick={() => { setActiveFeatureHub('blood-bank'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <Droplets size={15} className="text-red-400" /> রক্তদান নেটওয়ার্ক (SOS)
                </button>
                <button
                  onClick={() => { setActiveFeatureHub('tourism'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <Compass size={15} className="text-emerald-400" /> সুন্দরবন ও পর্যটন
                </button>
                <button
                  onClick={() => { setActiveFeatureHub('doctors'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <HeartPulse size={15} className="text-teal-400" /> ডাক্তার ও অ্যাম্বুলেন্স
                </button>
                <button
                  onClick={() => { setActiveFeatureHub('weather'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <Waves size={15} className="text-sky-400" /> আবহাওয়া ও জোয়ার-ভাটা
                </button>
                <button
                  onClick={() => { setActiveFeatureHub('complaints'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <MessageSquare size={15} className="text-indigo-400" /> নাগরিক অভিযোগ বক্স
                </button>
                <button
                  onClick={() => { setActiveFeatureHub('jobs'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <Briefcase size={15} className="text-amber-400" /> স্থানীয় চাকরির খবর
                </button>
                <button
                  onClick={() => { setActiveFeatureHub('tolet'); setIsDrawerOpen(false); }}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                >
                  <Home size={15} className="text-blue-400" /> বাড়ি ভাড়া ও মেস (To-Let)
                </button>
              </div>

              {/* District Active Panel */}
              <div className="mt-4 bg-slate-800/85 p-3 rounded-xl border border-slate-700">
                <p className="text-[10px] text-lime-400 font-bold uppercase tracking-wider mb-1">সক্রিয় জেলা</p>
                <p className="text-base font-extrabold text-white flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-500" />
                  {initialDistricts.find(d => d.id === selectedDistrict)?.name} জেলা
                </p>
              </div>

              {/* Stats Grid inside mobile drawer */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 pt-1">
                <div className="bg-slate-800/60 p-1.5 rounded text-center">
                  <span className="block text-white font-bold">{stats.publishedServices}+</span>
                  প্রকাশিত সেবা
                </div>
                <div className="bg-slate-800/60 p-1.5 rounded text-center">
                  <span className="block text-lime-400 font-bold">১০টি জেলা</span>
                  কাভারেজ
                </div>
              </div>
            </div>

            {/* Admin trigger and footer */}
            <div className="space-y-3">
              {(userProfile?.role === 'super_admin' || userProfile?.role === 'sub_admin') && (
                <button
                  onClick={() => {
                    setAdminView('dashboard');
                    setActiveTab('profile');
                    setIsDrawerOpen(false);
                  }}
                  className="w-full bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 text-xs shadow-md cursor-pointer"
                >
                  <Shield size={14} />
                  অ্যাডমিন ড্যাশবোর্ড
                </button>
              )}

              <div className="text-[10px] text-slate-500 text-center border-t border-slate-800 pt-3 font-serif">
                স্মার্ট খুলনা প্ল্যাটফর্ম © ২০২৬<br />সকল স্বত্ব সংরক্ষিত।
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Main Responsive Layout Wrapper */}
      <div className="w-full max-w-5xl flex-1 h-full max-h-full bg-white shadow-xl flex flex-col md:flex-row relative overflow-hidden">
        
        {/* SIDE PANEL / DESKTOP PREVIEW FRAME (Visible only on medium/large screens) */}
        <div className="hidden md:flex md:w-80 bg-slate-900 text-slate-100 p-6 flex-col justify-between shrink-0 border-r border-slate-800 overflow-y-auto max-h-screen sticky top-0 scrollbar-thin scrollbar-thumb-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-6">
              {/* Modern K Monogram Leaf Logo */}
              <SmartKhulnaLogo size={44} showGlow={true} />
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white font-serif">স্মার্ট খুলনা</h1>
                <p className="text-[10px] text-lime-400 font-medium">Smart Khulna local platform</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-serif">
              খুলনা বিভাগের সকল জেলা, জরুরি যোগাযোগ, স্বাস্থ্যসেবা ও পেশাজীবীদের তথ্য নিয়ে সম্পূর্ণ ডিজিটালাইজড লোকাল-সার্ভিস ডিরেক্টরি।
            </p>

            {/* Desktop Navigation Links */}
            <div className="space-y-1.5 mb-5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer group ${
                    activeTab === item.id ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <IconComponent 
                      name={item.icon} 
                      size={17} 
                      className={activeTab === item.id ? 'text-lime-300' : 'text-slate-500 group-hover:text-slate-300'} 
                    /> 
                    {item.label}
                  </span>
                  {item.badge && <span className="text-[9px] bg-emerald-700/80 text-lime-300 px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
                  {item.id === 'messages' && totalUnreadMessages > 0 && (
                    <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      {totalUnreadMessages}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="hidden">
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
              <button
                onClick={() => {
                  navigateTo('profile');
                  setViewingProfileUid(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activeTab === 'profile' ? 'bg-emerald-800 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2"><User size={15} /> আমার প্রোফাইল</span>
              </button>

              {/* Special Citizen Hubs in Sidebar */}
              <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-0.5">
                <p className="px-3 py-1 text-[10px] font-bold text-lime-400 uppercase tracking-wider">নাগরিক স্পেশাল হাব</p>
                <button
                  onClick={() => setActiveFeatureHub('blood-bank')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Droplets size={14} className="text-red-400" /> রক্তদান নেটওয়ার্ক
                </button>
                <button
                  onClick={() => setActiveFeatureHub('tourism')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Compass size={14} className="text-emerald-400" /> সুন্দরবন ও পর্যটন
                </button>
                <button
                  onClick={() => setActiveFeatureHub('doctors')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <HeartPulse size={14} className="text-teal-400" /> ডাক্তার ও অ্যাম্বুলেন্স
                </button>
                <button
                  onClick={() => setActiveFeatureHub('weather')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Waves size={14} className="text-sky-400" /> আবহাওয়া ও জোয়ার-ভাটা
                </button>
                <button
                  onClick={() => setActiveFeatureHub('complaints')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={14} className="text-indigo-400" /> নাগরিক অভিযোগ বক্স
                </button>
                <button
                  onClick={() => setActiveFeatureHub('jobs')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Briefcase size={14} className="text-amber-400" /> স্থানীয় চাকরির খবর
                </button>
                <button
                  onClick={() => setActiveFeatureHub('tolet')}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Home size={14} className="text-blue-400" /> বাড়ি ভাড়া ও মেস
                </button>
              </div>
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
                  <span className="text-[9px] bg-emerald-500/20 text-lime-300 font-mono px-1.5 py-0.5 rounded">v{releaseConfig?.currentVersion || '2.4.0'}</span>
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
      <div className="flex-1 flex flex-col h-full max-h-full min-h-0 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative overflow-hidden">
        
        {/* STICKY TOP HEADER (Ultra-Premium Production-Ready Civic Tech Header) */}
        <SmartKhulnaHeader
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onNavigateHome={() => navigateTo('home')}
          onNavigateProfile={() => {
            navigateTo('profile');
            setViewingProfileUid(null);
          }}
          onNavigateSearch={() => navigateTo('search')}
          lang={lang}
          onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          isInstallable={isInstallable}
          onInstallPWA={installPWA}
          viewingDistrictId={viewingDistrictId}
          onToggleDistricts={() => setViewingDistrictId(viewingDistrictId ? null : 'all')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(prev => !prev)}
          totalUnreadNotifications={totalUnreadNotifications}
          onToggleNotifications={() => setShowNotificationCenter(prev => !prev)}
          t={t}
          activeNotice={activeNotice}
        />


        {/* MAIN PAGE CONTAINER */}
        <main className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
          <div className={`flex-1 min-h-0 flex flex-col ${
            activeTab === 'messages' 
              ? 'h-full max-h-full flex-1 min-h-0 overflow-hidden' 
              : activeTab === 'profile'
              ? 'h-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain custom-chat-scrollbar'
              : activeTab === 'services'
              ? 'h-full overflow-hidden p-4 pb-1'
              : 'p-4 overflow-y-auto space-y-5'
          }`}>

            {/* TAB VIEW - HOME */}
            {activeTab === 'home' && !viewingDistrictId && (
              <>
                {/* 1. DISTRICT SELECTOR (Required top of the page) */}
                <div className="bg-gradient-to-br from-emerald-50 to-lime-50/50 dark:from-slate-850 dark:to-emerald-950/20 p-3.5 sm:p-4 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-sm relative">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                      <MapPin size={16} className="text-emerald-700 dark:text-emerald-400" />
                      আপনার জেলা নির্বাচন করুন
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-0.5 rounded-full">
                        ১০টি জেলা
                      </span>
                      {/* Desktop Navigation Arrow Controls */}
                      <div className="hidden sm:flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => scrollDistricts('left')}
                          aria-label="Previous Districts"
                          className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollDistricts('right')}
                          aria-label="Next Districts"
                          className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scroll Selector with Drag & Wheel support */}
                  <div 
                    ref={districtScrollRef}
                    onWheel={(e) => {
                      if (e.deltaY !== 0 && districtScrollRef.current) {
                        districtScrollRef.current.scrollLeft += e.deltaY;
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!districtScrollRef.current) return;
                      setIsDistrictDragging(true);
                      setDistrictStartX(e.pageX - districtScrollRef.current.offsetLeft);
                      setDistrictScrollLeft(districtScrollRef.current.scrollLeft);
                    }}
                    onMouseLeave={() => setIsDistrictDragging(false)}
                    onMouseUp={() => setIsDistrictDragging(false)}
                    onMouseMove={(e) => {
                      if (!isDistrictDragging || !districtScrollRef.current) return;
                      e.preventDefault();
                      const x = e.pageX - districtScrollRef.current.offsetLeft;
                      const walk = (x - districtStartX) * 1.5;
                      districtScrollRef.current.scrollLeft = districtScrollLeft - walk;
                    }}
                    className="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-slate-700 scroll-smooth select-none cursor-grab active:cursor-grabbing"
                  >
                    {initialDistricts.map(d => (
                      <button
                        key={d.id}
                        onClick={() => handleSelectDistrict(d.id)}
                        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                          selectedDistrict === d.id
                            ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600/30'
                            : 'bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 shadow-xs'
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
                      href={`tel:${localEmergencies.find(e => e.iconName === 'Shield' || (e.name && e.name.includes('পুলিশ')))?.phone || '01713-373265'}`}
                      className="bg-white hover:bg-sky-50/50 border border-slate-100 hover:border-sky-200 rounded-xl p-2 flex flex-col items-center justify-center text-center transition cursor-pointer group aspect-square shadow-xs"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0">
                        <Shield size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">পুলিশ</span>
                    </a>

                    {/* Ambulance */}
                    <a
                      href={`tel:${localEmergencies.find(e => e.iconName === 'Ambulance' || (e.name && e.name.includes('অ্যাম্বুলেন্স')))?.phone || '01711-295328'}`}
                      className="bg-white hover:bg-rose-50/50 border border-slate-100 hover:border-rose-200 rounded-xl p-2 flex flex-col items-center justify-center text-center transition cursor-pointer group aspect-square shadow-xs"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1 group-hover:scale-105 transition shrink-0">
                        <Ambulance size={18} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight">অ্যাম্বুলেন্স</span>
                    </a>

                    {/* Fire Service */}
                    <a
                      href={`tel:${localEmergencies.find(e => e.iconName === 'Flame' || (e.name && (e.name.includes('ফায়ার') || e.name.includes('ফায়ার'))))?.phone || '02-477722222'}`}
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

                {/* 4.8 CITIZEN DIGITAL HUBS & SPECIAL DIRECTORIES */}
                <section className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
                      <span className="text-base">🌟</span>
                      <span>নাগরিক স্মার্ট ডিরেক্টরি ও সেবা</span>
                    </h2>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      ৭টি স্পেশাল হাব
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-2.5">
                    {/* 1. রক্তদান নেটওয়ার্ক */}
                    <button
                      onClick={() => setActiveFeatureHub('blood-bank')}
                      className="bg-white dark:bg-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/20 border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Droplets size={20} className="fill-red-600" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 leading-tight">
                        রক্তদান SOS
                      </span>
                    </button>

                    {/* 2. সুন্দরবন ও পর্যটন */}
                    <button
                      onClick={() => setActiveFeatureHub('tourism')}
                      className="bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Compass size={20} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 leading-tight">
                        সুন্দরবন ভ্রমণ
                      </span>
                    </button>

                    {/* 3. ডাক্তার ও অ্যাম্বুলেন্স */}
                    <button
                      onClick={() => setActiveFeatureHub('doctors')}
                      className="bg-white dark:bg-slate-800 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <HeartPulse size={20} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 leading-tight">
                        ডাক্তার তালিকা
                      </span>
                    </button>

                    {/* 4. আবহাওয়া ও জোয়ার-ভাটা */}
                    <button
                      onClick={() => setActiveFeatureHub('weather')}
                      className="bg-white dark:bg-slate-800 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 border border-slate-100 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Waves size={20} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 leading-tight">
                        জোয়ার-ভাটা
                      </span>
                    </button>

                    {/* 5. নাগরিক অভিযোগ */}
                    <button
                      onClick={() => setActiveFeatureHub('complaints')}
                      className="bg-white dark:bg-slate-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <MessageSquare size={20} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-700 leading-tight">
                        নাগরিক অভিযোগ
                      </span>
                    </button>

                    {/* 6. খুলনা জবস */}
                    <button
                      onClick={() => setActiveFeatureHub('jobs')}
                      className="bg-white dark:bg-slate-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border border-slate-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Briefcase size={20} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 leading-tight">
                        স্থানীয় চাকরি
                      </span>
                    </button>

                    {/* 7. টু-লেট ও মেস */}
                    <button
                      onClick={() => setActiveFeatureHub('tolet')}
                      className="bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group aspect-square min-h-[82px]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Home size={20} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 leading-tight">
                        টু-লেট ও মেস
                      </span>
                    </button>
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
                {(Array.isArray(services) ? services : []).filter(s => s && s.isFeatured && s.status === 'PUBLISHED').length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 font-serif">
                        <Star size={18} className="text-amber-500 fill-amber-500" />
                        ⭐ জনপ্রিয় ও গুরুত্বপূর্ণ সেবা (Featured Services)
                      </h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">হোম পেজে প্রদর্শিত সেবা</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {(Array.isArray(services) ? services : [])
                        .filter(s => s && s.isFeatured && s.status === 'PUBLISHED')
                        .slice(0, 8)
                        .map(service => {
                          const cat = initialCategories.find(c => c && c.id === service.category_id);
                          const style = getCategoryStyle(service.category_id);
                          return (
                            <div
                              key={service.id}
                              onClick={() => setSelectedService(service)}
                              className="bg-white dark:bg-slate-900 hover:bg-emerald-50/20 dark:hover:bg-slate-850 border border-emerald-100 dark:border-slate-800 hover:border-emerald-200 p-3 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-sm transition cursor-pointer group"
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
                                  <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Star size={9} className="fill-amber-600 text-amber-600" /> ফিচার্ড
                                  </span>
                                </div>
                                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase inline-block mb-1">
                                  {cat?.name || 'সেবা'}
                                </span>
                                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-tight">{service.name}</h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{service.address}</p>
                              </div>
                              
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 dark:border-slate-800">
                                <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                                  <Clock size={10} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                                  <span className="truncate">{service.opening_hours}</span>
                                </span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                                  View Service →
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

                {/* JOIN SMART KHULNA TEAM SECTION */}
                <JoinSmartKhulnaTeamSection
                  districts={initialDistricts}
                  currentUserName={currentUser?.displayName || userProfile?.name || ''}
                  currentUserEmail={currentUser?.email || userProfile?.email || ''}
                  currentUserPhone={currentUser?.phone || userProfile?.phone || ''}
                  onSubmitApplication={handleJoinTeamApplication}
                />
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

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                          {(Array.isArray(services) ? services : [])
                            .filter(s => s && s.district_id === currentDist.id && s.status === 'PUBLISHED')
                            .slice(0, 8)
                            .map(s => {
                              const cat = initialCategories.find(c => c && c.id === s.category_id);
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
              <div className="space-y-4 flex flex-col h-full overflow-hidden">
                {/* Services Sub-Tabs */}
                <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200/50 shrink-0">
                  <button
                    onClick={() => setServicesSubTab('directory')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      servicesSubTab === 'directory'
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Building2 size={13} /> ডিজিটাল সেবা
                  </button>
                  <button
                    onClick={() => setServicesSubTab('blood')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      servicesSubTab === 'blood'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Droplets size={13} /> রক্তদান সেবা
                  </button>
                </div>

                {servicesSubTab === 'blood' ? (
                  <div className="flex-1 overflow-y-auto pr-1 pb-4">
                    <BloodDonationSection
                      districts={initialDistricts}
                      selectedDistrict={selectedDistrict}
                      currentUser={currentUser}
                      userProfile={userProfile}
                      onUpdateUserProfile={async (data) => setUserProfile(prev => prev ? {...prev, ...data} : null)}
                      onViewProfile={handleViewProfile}
                      onStartMessage={handleStartMessage}
                      onOpenCreatePost={(prefill) => {
                        if (!requireAuth('রক্তদান পোস্ট')) return;
                        setEditingPost(prefill as any);
                        setShowCreatePostModal(true);
                      }}
                      onRequireAuth={requireAuth}
                      lang={lang}
                    />
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 pb-4">
                    {filterCategory === 'all' ? (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-base font-extrabold text-slate-900 font-serif">ডিজিটাল সেবা নির্দেশিকা</h2>
                            <p className="text-[11px] text-slate-500 font-bold">
                              {initialDistricts.find(d => d.id === selectedDistrict)?.name} জেলা • ক্যাটাগরি নির্বাচন করুন
                            </p>
                          </div>
                          <button
                            onClick={() => setShowFiltersModal(true)}
                            className="flex items-center gap-1 text-[11px] bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg shadow-sm"
                          >
                            <Filter size={14} />
                            ফিল্টার
                          </button>
                        </div>

                        {/* 4-Column Compact Category Grid */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
                          {initialCategories.map(cat => {
                            const style = getCategoryStyle(cat.id);
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setFilterCategory(cat.id)}
                                className="bg-white hover:bg-emerald-50/40 border border-slate-100 hover:border-emerald-200 p-1.5 py-3 rounded-xl flex flex-col items-center justify-center text-center transition cursor-pointer group shadow-2xs hover:shadow-sm"
                              >
                                <div className={`w-8 h-8 rounded-lg ${style.bg} ${style.text} flex items-center justify-center mb-1.5 group-hover:scale-110 transition duration-300 shrink-0`}>
                                  <IconComponent name={cat.iconName} size={22} className={style.text} />
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-700 leading-[1.1] line-clamp-2 w-full px-0.5">
                                  {cat.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Detail Header with Back Button */}
                        <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-xs py-2 z-10 -mx-1 px-1">
                          <button 
                            onClick={() => setFilterCategory('all')}
                            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-full transition border border-emerald-100 shadow-sm"
                          >
                            <ChevronLeft size={16} /> ফিরে যান
                          </button>
                          <button
                            onClick={() => setShowFiltersModal(true)}
                            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded-lg transition border border-slate-200 shadow-xs"
                          >
                            <Filter size={16} />
                          </button>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl ${getCategoryStyle(filterCategory).bg} ${getCategoryStyle(filterCategory).text} flex items-center justify-center shadow-xs`}>
                              <IconComponent name={initialCategories.find(c => c.id === filterCategory)?.iconName || 'Grid'} size={28} />
                            </div>
                            <div>
                              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                                {initialCategories.find(c => c.id === filterCategory)?.name}
                              </h2>
                              <p className="text-[11px] text-slate-500 font-bold">
                                {initialDistricts.find(d => d.id === selectedDistrict)?.name} জেলা • {filteredServices.length}টি সেবা পাওয়া গেছে
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Services List Display */}
                        {filteredServices.length === 0 ? (
                          <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center space-y-3 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
                              <AlertTriangle className="text-slate-300" size={32} />
                            </div>
                            <p className="text-sm font-bold text-slate-600">বর্তমানে কোনো সেবা পাওয়া যায়নি</p>
                            <p className="text-[11px] text-slate-400">এই ক্যাটাগরিতে বর্তমানে কোনো সেবা তালিকাভুক্ত করা নেই।</p>
                            <button
                              onClick={() => setFilterCategory('all')}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-6 rounded-full transition mt-4 shadow-md cursor-pointer"
                            >
                              অন্য ক্যাটাগরি দেখুন
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
                                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">{service.address}</p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50">
                                    <span className="flex items-center gap-0.5 truncate max-w-[80px]">
                                      <Clock size={10} className="text-emerald-700 shrink-0" />
                                      <span className="truncate">{service.opening_hours}</span>
                                    </span>
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                                      বিস্তারিত
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

            {/* TAB VIEW - SEARCH & DISCOVERY */}
            {activeTab === 'search' && (
              <DiscoverySearch 
                services={services}
                posts={communityPosts}
                users={allCommunityUsers}
                districts={initialDistricts}
                categories={initialCategories}
                currentUser={currentUser}
                onSelectService={(s) => setSelectedService(s)}
                onSelectProfile={(uid) => handleViewProfile(uid)}
                onSelectPost={(p) => setViewingPost(p)}
                onSaveItem={(type, id) => toggleBookmark(type, id)}
                isSaved={(type, id) => isBookmarked(type, id)}
              />
            )}

            {/* TAB VIEW - SAVED / BOOKMARKS */}
            {activeTab === 'saved' && (
              <div className="space-y-6 max-w-4xl mx-auto py-2">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-serif">আপনার সংরক্ষিত তালিকা</h2>
                  <p className="text-xs text-slate-500">জরুরি প্রয়োজনের জন্য বুকমার্ক করে রাখা সেবা, পোস্ট এবং প্রোফাইল সমূহ।</p>
                </div>

                {/* Filter saved list */}
                {(() => {
                  const savedServices = services.filter(s => isBookmarked('service', s.id));
                  const savedPosts = communityPosts.filter(p => isBookmarked('post', p.id));
                  const savedProfiles = allCommunityUsers.filter(u => isBookmarked('profile', u.uid));
                  
                  const totalSaved = savedServices.length + savedPosts.length + savedProfiles.length;

                  if (totalSaved === 0) {
                    return (
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center space-y-3 shadow-sm">
                        <Heart className="text-slate-300 mx-auto" size={32} />
                        <p className="text-xs font-bold text-slate-500">তালিকাটি বর্তমানে খালি আছে</p>
                        <p className="text-[11px] text-slate-400">গুরুত্বপূর্ণ সেবাগুলোর পাশে সংরক্ষণ (♡) আইকনে ক্লিক করে জমা রাখুন।</p>
                        <button
                          onClick={() => navigateTo('search')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition mt-2 cursor-pointer"
                        >
                          নতুন কিছু খুঁজুন
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-8 pb-20">
                      {savedServices.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider px-1">সংরক্ষিত সেবা ({savedServices.length})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {savedServices.map(s => {
                              const cat = initialCategories.find(c => c.id === s.category_id);
                              return (
                                <div key={s.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.name}</h4>
                                  <div className="mt-2 flex items-center justify-between">
                                    <button onClick={() => setSelectedService(s)} className="text-[9px] font-bold text-emerald-600">বিস্তারিত</button>
                                    <button onClick={() => toggleBookmark('service', s.id)} className="text-rose-500"><Trash2 size={12} /></button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {savedPosts.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider px-1">সংরক্ষিত পোস্ট ({savedPosts.length})</h3>
                          <div className="space-y-3">
                            {savedPosts.map(p => (
                              <div key={p.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 flex-1 pr-4">{p.content}</p>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setViewingPost(p)} className="text-[10px] font-bold text-blue-600">দেখুন</button>
                                  <button onClick={() => toggleBookmark('post', p.id)} className="text-rose-500"><Trash2 size={12} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {savedProfiles.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider px-1">সংরক্ষিত প্রোফাইল ({savedProfiles.length})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {savedProfiles.map(u => (
                              <div key={u.uid} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                                <img src={u.avatar} className="w-10 h-10 rounded-full mx-auto mb-2" alt="" />
                                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{u.name}</h4>
                                <div className="mt-2 flex items-center justify-center gap-3">
                                  <button onClick={() => handleViewProfile(u.uid)} className="text-[9px] font-bold text-indigo-600">প্রোফাইল</button>
                                  <button onClick={() => toggleBookmark('profile', u.uid)} className="text-rose-500"><Trash2 size={12} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB VIEW - PROFILE & ADMIN CONTROL PANEL PANEL */}
            {activeTab === 'profile' && (
              <div className="w-full flex-1 min-h-0 flex flex-col space-y-4 pb-24 md:pb-12">
                {!currentUser && !viewingProfileUid ? (
                  <div className="w-full max-w-md mx-auto my-6 px-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                      {/* Brand Header */}
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/80 shadow-xs">
                          <SmartKhulnaLogo size={36} />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white pt-1">
                          স্মার্ট খুলনা নাগরিক অ্যাকাউন্ট
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                          {emailAuthMode === 'login' 
                            ? 'আপনার অ্যাকাউন্টে প্রবেশ করতে নিচের তথ্য প্রদান করুন' 
                            : 'নতুন নাগরিক অ্যাকাউন্ট তৈরি করতে নিবন্ধনের তথ্য প্রদান করুন'}
                        </p>
                      </div>

                      {/* Google One-Click Login */}
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600 py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition shadow-md cursor-pointer"
                      >
                        <svg className="w-5 h-5 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>গুগল দিয়ে প্রবেশ করুন</span>
                      </button>

                      {/* Divider */}
                      <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-bold uppercase shrink-0">
                          অথবা ইমেইল দিয়ে
                        </span>
                      </div>

                      {/* Email & Password Form */}
                      <form onSubmit={handleEmailAuth} className="space-y-3.5">
                        {emailAuthMode === 'register' && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">আপনার পূর্ণ নাম</label>
                            <div className="relative">
                              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                              <input
                                type="text"
                                required
                                placeholder="যেমন: মোঃ জহিরুল ইসলাম"
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">ইমেইল ঠিকানা</label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                              type="email"
                              required
                              placeholder="example@gmail.com"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">পাসওয়ার্ড</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                            <input
                              type="password"
                              required
                              minLength={6}
                              placeholder="******"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          {emailAuthMode === 'login' ? (
                            <>
                              <LogIn size={16} />
                              <span>লগইন করুন</span>
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              <span>নিবন্ধন করুন (রেজিস্ট্রেশন)</span>
                            </>
                          )}
                        </button>
                      </form>

                      {/* Toggle between Login and Register */}
                      <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
                        {emailAuthMode === 'login' ? (
                          <button
                            type="button"
                            onClick={() => setEmailAuthMode('register')}
                            className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                          >
                            নতুন অ্যাকাউন্ট খুলতে চান? রেজিস্ট্রেশন করুন
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEmailAuthMode('login')}
                            className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                          >
                            ইতিমধ্যেই অ্যাকাউন্ট আছে? সাইন-ইন / লগইন করুন
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (userProfile?.role === 'super_admin' || userProfile?.role === 'sub_admin') && adminView ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AdminPanelComplete
                      currentUserRole={userProfile.role as 'super_admin' | 'sub_admin'}
                      currentUserEmail={currentUser?.email || ''}
                      currentUserId={currentUser?.uid}
                      currentUserPermissions={userProfile.subAdminPermissions}
                      subAdminScope={userProfile.subAdminScope}
                      districts={initialDistricts}
                      categories={initialCategories}
                      services={services}
                      banners={banners}
                      communityPosts={communityPosts}
                      submissions={submissions}
                      communityReports={communityReports}
                      communityUsers={allCommunityUsers}
                      auditLogs={auditLogs}
                      releaseConfig={releaseConfig}
                      onAddService={handleAddServiceFromAdmin}
                      onUpdateService={handleUpdateServiceFromAdmin}
                      onDeleteService={handleDeleteServiceFromAdmin}
                      onApproveSubmission={handleApproveSubmission}
                      onRejectSubmission={handleRejectSubmission}
                      onAddBanner={handleAddBanner}
                      onUpdateBanner={handleUpdateBanner}
                      onDeleteBanner={handleDeleteBanner}
                      onToggleBannerStatus={handleToggleBannerStatus}
                      onResolveReport={handleResolveReport}
                      onDismissReport={handleDismissReport}
                      onHidePost={handleHidePost}
                      onRestorePost={handleRestorePost}
                      onDeletePost={handleDeletePost}
                      onUpdateUserRole={handleUpdateUserRole}
                      onBanUser={handleBanUser}
                      onSaveReleaseConfig={(config) => setReleaseConfig(config)}
                      onClose={() => setAdminView(null)}
                      notices={notices}
                      onAddNotice={handleAddNotice}
                      onUpdateNotice={handleUpdateNotice}
                      onDeleteNotice={handleDeleteNotice}
                    />
                  </div>
                ) : (
                  <ErrorBoundary fallbackText="প্রোফাইল লোড করতে সাময়িক বিলম্ব ঘটেছে। নিচে রিফ্রেশ বাটনে চাপ দিয়ে পুনরায় চেষ্টা করুন।">
                    {viewingPost ? (
                      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                        <button
                          onClick={() => {
                            setViewingPost(null);
                            setTimeout(() => {
                              window.scrollTo({ top: profileScrollPosition, behavior: 'smooth' });
                            }, 50);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
                        >
                          <span>← প্রোফাইলে ফিরে যান</span>
                        </button>
                        <PostCard
                          post={viewingPost}
                          districts={initialDistricts}
                          currentUserId={currentUser?.uid}
                          comments={communityComments[viewingPost.id] || []}
                          isLiked={likedCommunityPostIds.includes(viewingPost.id)}
                          isSaved={savedCommunityPostIds.includes(viewingPost.id)}
                          isFollowing={followingUids.includes(viewingPost.authorId)}
                          onToggleLike={handleToggleLikePost}
                          onToggleSave={handleToggleSavePost}
                          onAddComment={handleAddComment}
                          onAddReply={handleAddReply}
                          onDeleteComment={handleDeleteComment}
                          onShare={handleShareCommunityPost}
                          onReport={handleReport}
                          onDeletePost={handleDeletePost}
                          onEditPost={(p) => {
                            setEditingPost(p);
                            setShowCreatePostModal(true);
                          }}
                          onViewProfile={(uid) => {
                            setViewingPost(null);
                            handleViewProfile(uid);
                          }}
                          onStartMessage={handleStartMessage}
                          onToggleFollow={handleFollow}
                        />
                      </div>
                    ) : (
                      <EnhancedProfileView
                      profile={targetProfile || {
                        uid: 'guest',
                        name: 'অতিথি নাগরিক',
                        email: '',
                        avatar: '',
                        bio: 'স্মার্ট খুলনা ডিজিটাল নাগরিক সেবা প্ল্যাটফর্মে স্বাগতম।',
                        coverPhoto: '',
                        phone: '',
                        profession: 'ডিজিটাল নাগরিক',
                        bloodGroup: '',
                        district: selectedDistrict,
                        upazila: '',
                        address: 'খুলনা বিভাগ',
                        socialLinks: {},
                        joinedDate: new Date().toISOString(),
                        badge: 'none',
                        postsCount: 0,
                        followersCount: 0,
                        followingCount: 0,
                        isFollowing: false
                      }}
                      currentUserUid={currentUser?.uid}
                      isOwnProfile={currentUser?.uid === (targetProfile?.uid || 'guest')}
                      onEdit={() => {
                        if (!targetProfile) return;
                        setIsEditingProfile(true);
                        setEditDisplayName(targetProfile.name || '');
                        setEditPhotoURL(targetProfile.avatar || '');
                        setEditCoverPhoto(targetProfile.coverPhoto || userProfile?.coverPhoto || '');
                        setEditPhone(targetProfile.phone || '');
                        setEditBio(targetProfile.bio || '');
                        setEditProfession(targetProfile.profession || '');
                        setEditBloodGroup(targetProfile.bloodGroup || '');
                        setEditDistrict(targetProfile.district || selectedDistrict);
                        setEditUpazila(targetProfile.upazila || '');
                        setEditAddress(targetProfile.address || '');
                        setEditFacebook(targetProfile.socialLinks?.facebook || '');
                        setEditTwitter(targetProfile.socialLinks?.twitter || '');
                        setEditInstagram(targetProfile.socialLinks?.instagram || '');
                        setEditLinkedin(targetProfile.socialLinks?.linkedin || '');
                        setEditWebsite(targetProfile.socialLinks?.website || '');
                      }}
                      onMessage={(uid: string, name: string, avatar?: string) => handleStartMessage(uid, name, '', avatar)}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                      onBack={() => {
                        if (viewingProfileUid && viewingProfileUid !== currentUser?.uid) {
                          setViewingProfileUid(null);
                          setActiveTab('community');
                        } else {
                          setActiveTab('home');
                        }
                      }}
                      posts={targetPosts}
                      services={targetServices}
                      districts={initialDistricts}
                      categories={initialCategories}
                      followers={targetFollowers}
                      following={targetFollowing}
                      onPostClick={(post) => {
                        setProfileScrollPosition(window.scrollY);
                        setViewingPost(post);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onServiceClick={(s) => setSelectedService(s)}
                      onUserClick={(uid) => {
                        setViewingPost(null);
                        handleViewProfile(uid);
                      }}
                      onUpdateCover={handleUpdateCover}
                      onLogout={handleLogout}
                      onToggleLike={handleToggleLikePost}
                      onToggleSave={handleToggleSavePost}
                      onAddComment={handleAddComment}
                      onAddReply={handleAddReply}
                      onDeleteComment={handleDeleteComment}
                      onSharePost={handleShareCommunityPost}
                      onOpenCreatePost={() => {
                        if (!requireAuth('পোস্ট তৈরি')) return;
                        setEditingPost(null);
                        setShowCreatePostModal(true);
                      }}
                      onReport={handleReport}
                      onDeletePost={handleDeletePost}
                      onEditPost={(post) => {
                        setEditingPost(post);
                        setShowCreatePostModal(true);
                      }}
                      onOpenSettings={() => setShowSettingsModal(true)}
                      commentsMap={communityComments}
                      likedPostIds={likedCommunityPostIds}
                      savedPostIds={savedCommunityPostIds}
                      followingUids={followingUids}
                      onStartMessage={handleStartMessage}
                      lang={lang}
                      onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                      onToggleDarkMode={() => setDarkMode(!darkMode)}
                    />
                  )}
                  </ErrorBoundary>
                )}
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
                onToggleFollow={handleToggleFollow}
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
              <div className="flex-1 min-h-0 h-full max-h-full w-full overflow-hidden p-0 sm:p-2 md:p-3 flex flex-col">
                <MessagingCenter
                  currentUserId={currentUser?.uid || null}
                  currentUserEmail={currentUser?.email || null}
                  currentUserName={currentUser?.displayName || null}
                  currentUserAvatar={currentUser?.photoURL || userProfile?.avatar || ''}
                  districts={initialDistricts}
                  allUsers={allCommunityUsers}
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={setActiveConversationId}
                  onSendMessage={handleSendMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onDeleteMessages={handleDeleteMessages}
                  onDeleteConversation={handleDeleteConversation}
                  onStartConversationWithUser={(targetUser) => {
                    handleStartMessage(targetUser.uid, targetUser.name, targetUser.email || '', targetUser.avatar);
                  }}
                  onBlockUser={handleBlockUser}
                  onReportUser={(targetUid, name) => {
                    handleReport('user', targetUid, name);
                  }}
                  onRequireAuth={() => requireAuth('বার্তা আদান-প্রদান')}
                  messagesMap={messagesMap}
                  blockedUserIds={blockedUserIds}
                  onViewProfile={handleViewProfile}
                />
              </div>
            )}
          </div>
        </main>



          {/* PERSISTENT BOTTOM NAVIGATION (Unified Structure) */}
          <nav
            id="main-bottom-navigation"
            className="sticky bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 pt-1.5 px-0.5 flex justify-around items-center shrink-0 z-40 shadow-lg md:hidden"
            style={{
              paddingBottom: 'max(0.65rem, calc(env(safe-area-inset-bottom, 0px) + 0.35rem))',
            }}
          >
            {navItems.filter(i => ['home', 'services', 'community', 'messages', 'download', 'profile'].includes(i.id)).map(item => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id as any)}
                className={`flex flex-col items-center gap-0.5 text-[9px] font-bold transition flex-1 cursor-pointer py-1 relative ${
                  activeTab === item.id && !viewingDistrictId 
                    ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <IconComponent name={item.icon} size={18} />
                  {item.id === 'messages' && totalUnreadMessages > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 min-w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center border border-white">
                      {totalUnreadMessages}
                    </span>
                  )}
                  {item.id === 'download' && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <span className="truncate w-full text-center">{item.id === 'download' ? 'আপডেট' : item.label.split(' ')[0]}</span>
              </button>
            ))}
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

      {/* MODAL: FIREBASE NOTIFICATION CENTER & USER INBOX */}
      <NotificationCenterView
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        currentUser={currentUser}
        onNavigateDeepLink={handleDeepLinkNavigation}
      />

      {/* FOREGROUND HEADS-UP / IN-APP BANNER NOTIFICATION */}
      <InAppNotificationBanner
        onNavigateDeepLink={handleDeepLinkNavigation}
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

      {/* MODAL: EDIT PROFILE */}
      <EditProfileModal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        onSave={() => handleUpdateProfile()}
        isSaving={isSavingProfile}
        districts={initialDistricts}
        displayName={editDisplayName}
        setDisplayName={setEditDisplayName}
        photoURL={editPhotoURL}
        setPhotoURL={setEditPhotoURL}
        coverPhoto={editCoverPhoto}
        setCoverPhoto={setEditCoverPhoto}
        phone={editPhone}
        setPhone={setEditPhone}
        bio={editBio}
        setBio={setEditBio}
        profession={editProfession}
        setProfession={setEditProfession}
        bloodGroup={editBloodGroup}
        setBloodGroup={setEditBloodGroup}
        district={editDistrict}
        setDistrict={setEditDistrict}
        upazila={editUpazila}
        setUpazila={setEditUpazila}
        address={editAddress}
        setAddress={setEditAddress}
        facebook={editFacebook}
        setFacebook={setEditFacebook}
        twitter={editTwitter}
        setTwitter={setEditTwitter}
        instagram={editInstagram}
        setInstagram={setEditInstagram}
        linkedin={editLinkedin}
        setLinkedin={setEditLinkedin}
        website={editWebsite}
        setWebsite={setEditWebsite}
      />

      {/* MODAL: PROFILE SETTINGS */}
      <ProfileSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* CITIZEN SMART HUBS & DIRECTORIES */}
      {activeFeatureHub === 'blood-bank' && <BloodBankHub onClose={() => setActiveFeatureHub(null)} />}
      {activeFeatureHub === 'tourism' && <TourismHub onClose={() => setActiveFeatureHub(null)} />}
      {activeFeatureHub === 'doctors' && <DoctorFinderHub onClose={() => setActiveFeatureHub(null)} />}
      {activeFeatureHub === 'weather' && <WeatherTideHub onClose={() => setActiveFeatureHub(null)} />}
      {activeFeatureHub === 'complaints' && <CitizenFeedbackHub onClose={() => setActiveFeatureHub(null)} />}
      {activeFeatureHub === 'jobs' && <LocalJobsHub onClose={() => setActiveFeatureHub(null)} />}
      {activeFeatureHub === 'tolet' && <ToLetHub onClose={() => setActiveFeatureHub(null)} />}

    </div>
  );
}
