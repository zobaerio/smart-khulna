import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  FileText,
  Building2,
  PhoneCall,
  Smartphone,
  ShieldAlert,
  BarChart2,
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  UserX,
  MapPin,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Award,
  AlertCircle,
  LogOut,
  BookOpen,
  Bot,
  Crown,
  CheckCircle2,
  ClipboardList,
  Image as ImageIcon
} from 'lucide-react';
import { getSafeAvatarUrl } from '../lib/avatarHelper';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { District, Category, Service, AuditLog, UserProfile, Banner, SubAdminPermissions } from '../dbData';
import { CommunityPost, CommunityReport } from '../types/community';
import { AdminDownloadsCMS } from './AdminDownloadsCMS';
import { AdminBannersCMS } from './AdminBannersCMS';
import { SubAdminPolicyView } from './SubAdminPolicyView';
import { AIVerificationTool } from './AIVerificationTool';

interface AdminPanelCompleteProps {
  currentUserRole: 'super_admin' | 'sub_admin' | 'moderator';
  currentUserEmail: string;
  currentUserId?: string;
  currentUserPermissions?: SubAdminPermissions;
  subAdminScopeDistrict?: string;
  subAdminScope?: {
    districtId?: string;
    upazilaId?: string;
    categoryId?: string;
    permissions?: SubAdminPermissions;
  };
  districts: District[];
  categories: Category[];
  services: Service[];
  banners?: Banner[];
  posts?: CommunityPost[];
  communityPosts?: CommunityPost[];
  submissions: any[];
  reports?: CommunityReport[];
  communityReports?: CommunityReport[];
  communityUsers?: any[];
  emergencyContacts?: any[];
  auditLogs: AuditLog[];
  releaseConfig?: any;
  onAddBanner?: (banner: Partial<Banner>) => Promise<void> | void;
  onUpdateBanner?: (banner: Banner) => Promise<void> | void;
  onDeleteBanner?: (bannerId: string) => Promise<void> | void;
  onToggleBannerStatus?: (bannerId: string, isActive: boolean) => Promise<void> | void;
  onApproveSubmission: (sub: any) => Promise<void> | void;
  onRejectSubmission: (sub: any, reason?: string) => Promise<void> | void;
  onResolveReport: (reportId: string, note: string) => Promise<void> | void;
  onDismissReport: (reportId: string) => Promise<void> | void;
  onHidePost: (postId: string, reason: string) => Promise<void> | void;
  onRestorePost: (postId: string) => Promise<void> | void;
  onDeletePost?: (postId: string) => Promise<void> | void;
  onRemovePost?: (postId: string, reason: string) => Promise<void> | void;
  onAddService: (newService: Partial<Service>) => Promise<void> | void;
  onUpdateService: (updatedService: Service) => Promise<void> | void;
  onDeleteService: (serviceId: string) => Promise<void> | void;
  onAddEmergency?: (name: string, phone: string, districtId: string) => Promise<void> | void;
  onDeleteEmergency?: (id: string) => Promise<void> | void;
  onSaveReleaseConfig?: (config: any) => Promise<void> | void;
  onBanUser?: (targetUid: string, reason: string) => Promise<void> | void;
  onUpdateUserRole?: (targetUid: string, role: 'super_admin' | 'sub_admin' | 'moderator' | 'user') => Promise<void> | void;
  onDeleteUser?: (targetUid: string) => Promise<void> | void;
  onClearLogs?: () => void;
  onClose?: () => void;
  // Notice props
  notices?: any[];
  onAddNotice?: (notice: any) => Promise<void> | void;
  onUpdateNotice?: (id: string, updates: any) => Promise<void> | void;
  onDeleteNotice?: (id: string) => Promise<void> | void;
}

export const AdminPanelComplete: React.FC<AdminPanelCompleteProps> = ({
  currentUserRole,
  currentUserEmail,
  currentUserId,
  currentUserPermissions,
  subAdminScopeDistrict,
  subAdminScope,
  districts,
  categories,
  services,
  banners = [],
  posts,
  communityPosts,
  submissions,
  reports,
  communityReports,
  communityUsers,
  emergencyContacts,
  auditLogs,
  releaseConfig,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onToggleBannerStatus,
  onApproveSubmission,
  onRejectSubmission,
  onResolveReport,
  onDismissReport,
  onHidePost,
  onRestorePost,
  onDeletePost,
  onRemovePost,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddEmergency,
  onDeleteEmergency,
  onSaveReleaseConfig,
  onBanUser,
  onUpdateUserRole,
  onDeleteUser,
  onClearLogs,
  onClose,
  notices = [],
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
}) => {
  const effectivePosts = posts || communityPosts || [];
  const effectiveReports = reports || communityReports || [];
  const handleDeletePostAction = (postId: string) => {
    if (onDeletePost) return onDeletePost(postId);
    if (onRemovePost) return onRemovePost(postId, 'অ্যাডমিন মডারেশন দ্বারা মুছে ফেলা');
  };
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'policy' | 'sub_admins' | 'users' | 'posts' | 'banners' | 'services' | 'submissions' | 'reports' | 'ai_tools' | 'downloads' | 'logs' | 'notices'
  >('dashboard');

  const isSuperAdmin = currentUserRole === 'super_admin';

  // State for Notice Management
  const [isAddingNoticeModal, setIsAddingNoticeModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDesc, setNewNoticeDesc] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'High' | 'Medium' | 'Low'>('Low');
  const [newNoticeActive, setNewNoticeActive] = useState(true);

  // State for Users List
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'super_admin' | 'sub_admin' | 'moderator' | 'user'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditingUserRole, setIsEditingUserRole] = useState(false);
  const [targetUserNewRole, setTargetUserNewRole] = useState<'super_admin' | 'sub_admin' | 'moderator' | 'user'>('user');
  const [targetUserDistrictScope, setTargetUserDistrictScope] = useState<string>('khulna');
  const [targetUserUpazilaScope, setTargetUserUpazilaScope] = useState<string>('');
  const [targetUserCategoryScope, setTargetUserCategoryScope] = useState<string>('all');
  const [targetUserPermissions, setTargetUserPermissions] = useState<SubAdminPermissions>({
    canManageServices: true,
    canManageSubmissions: true,
    canModeratePosts: true,
    canManageReports: true,
    canManageBanners: false,
    canManageDownloads: false,
    canViewUsers: false,
    canViewLogs: false,
    canCollectInfo: true,
    canUseAITools: true,
    canDeleteServices: false
  });

  // State for Sub-Admin & Moderator tab filter
  const [subAdminRoleFilter, setSubAdminRoleFilter] = useState<'all' | 'sub_admin' | 'moderator'>('all');

  // State for Service Management
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [serviceDistrictFilter, setServiceDistrictFilter] = useState('all');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [isAddingServiceModal, setIsAddingServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePhone, setNewServicePhone] = useState('');
  const [newServiceAddress, setNewServiceAddress] = useState('');
  const [newServiceDistrict, setNewServiceDistrict] = useState('khulna');
  const [newServiceCategory, setNewServiceCategory] = useState('hospitals');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceVerified, setNewServiceVerified] = useState(true);

  // State for Post Management
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [postDistrictFilter, setPostDistrictFilter] = useState('all');
  const [postStatusFilter, setPostStatusFilter] = useState('all');

  // Resolution note state
  const [reportResolutionNote, setReportResolutionNote] = useState<{ [id: string]: string }>({});

  // Submission approval sub-tabs and modal
  const [submissionSubTab, setSubmissionSubTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showRejectModalForSub, setShowRejectModalForSub] = useState<any | null>(null);

  // Fetch Users from Firestore
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const q = query(collection(db, 'profiles'), limit(150));
      const snap = await getDocs(q);
      const list: UserProfile[] = [];
      snap.forEach(d => {
        list.push({ uid: d.id, ...d.data() } as UserProfile);
      });
      // If list is empty or doesn't include currentUser, add mock/initial representation
      if (list.length === 0 && currentUserId) {
        list.push({
          uid: currentUserId,
          name: 'বর্তমান এডমিন',
          email: currentUserEmail,
          role: currentUserRole,
          selectedDistrict: 'khulna'
        });
      }
      setUsersList(list);
    } catch (err) {
      console.warn('Error fetching profiles in admin:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role in Firestore
  const handleSaveUserRole = async () => {
    if (!selectedUser || !isSuperAdmin) return;
    try {
      const userRef = doc(db, 'profiles', selectedUser.uid);
      const updateData: any = {
        role: targetUserNewRole,
        updatedAt: new Date().toISOString()
      };
      if (targetUserNewRole === 'sub_admin' || targetUserNewRole === 'moderator') {
        updateData.subAdminScope = {
          districtId: targetUserDistrictScope,
          upazilaId: targetUserUpazilaScope.trim() || undefined,
          categoryId: targetUserCategoryScope !== 'all' ? targetUserCategoryScope : undefined,
          permissions: targetUserPermissions
        };
        updateData.subAdminPermissions = targetUserPermissions;
      } else {
        // Clear permissions if not sub-admin or moderator
        updateData.subAdminPermissions = null;
        updateData.subAdminScope = null;
      }
      await updateDoc(userRef, updateData);

      setUsersList(prev =>
        prev.map(u => (u.uid === selectedUser.uid ? { ...u, ...updateData } : u))
      );
      const roleLabel = targetUserNewRole === 'super_admin' ? 'সুপার এডমিন' : targetUserNewRole === 'sub_admin' ? 'সাব এডমিন' : targetUserNewRole === 'moderator' ? 'মডারেটর' : 'সাধারণ ইউজার';
      alert(`ইউজারের পদবী সফলভাবে '${roleLabel}' এ পরিবর্তিত হয়েছে!`);
      setIsEditingUserRole(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert('রোল পরিবর্তন করতে ব্যর্থ হয়েছে: ' + (err.message || err));
    }
  };

  // Toggle user suspension
  const handleToggleUserSuspension = async (targetUser: UserProfile) => {
    if (!isSuperAdmin) return;
    const isCurrentlySuspended = targetUser.status === 'suspended' || targetUser.isBanned;
    const nextStatus = isCurrentlySuspended ? 'active' : 'suspended';
    const confirmMsg = isCurrentlySuspended
      ? `আপনি কি '${targetUser.name}' কে পুনর্বহাল (Unsuspend) করতে চান?`
      : `আপনি কি '${targetUser.name}' কে স্থগিত (Suspend/Ban) করতে চান?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const userRef = doc(db, 'profiles', targetUser.uid);
      await updateDoc(userRef, {
        status: nextStatus,
        isBanned: !isCurrentlySuspended,
        updatedAt: new Date().toISOString()
      });

      setUsersList(prev =>
        prev.map(u =>
          u.uid === targetUser.uid
            ? { ...u, status: nextStatus, isBanned: !isCurrentlySuspended }
            : u
        )
      );
      alert(`ইউজারের অ্যাকাউন্ট সফলভাবে ${isCurrentlySuspended ? 'সক্রিয়' : 'স্থগিত'} করা হয়েছে!`);
    } catch (err: any) {
      alert('স্ট্যাটাস পরিবর্তনে সমস্যা হয়েছে: ' + (err.message || err));
    }
  };

  // Delete user document
  const handleDeleteUser = async (targetUser: UserProfile) => {
    if (!isSuperAdmin) return;
    if (targetUser.email === currentUserEmail) {
      alert('আপনি নিজের অ্যাকাউন্ট মুছতে পারবেন না!');
      return;
    }
    if (!window.confirm(`সতর্কতা: আপনি কি নিশ্চিত '${targetUser.name}' (${targetUser.email}) এর প্রোফাইল ডেটাবেস থেকে মুছে ফেলবেন?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'profiles', targetUser.uid));
      setUsersList(prev => prev.filter(u => u.uid !== targetUser.uid));
      alert('ইউজার প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!');
      if (selectedUser?.uid === targetUser.uid) setSelectedUser(null);
    } catch (err: any) {
      alert('ইউজার মুছতে সমস্যা হয়েছে: ' + (err.message || err));
    }
  };

  // Service submit handler
  const handleCreateOrUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServicePhone.trim()) {
      alert('সেবার নাম ও ফোন নম্বর আবশ্যক!');
      return;
    }

    if (editingService) {
      const updated: Service = {
        ...editingService,
        name: newServiceName.trim(),
        phone: newServicePhone.trim(),
        address: newServiceAddress.trim(),
        district_id: newServiceDistrict,
        category_id: newServiceCategory,
        description: newServiceDesc.trim(),
        is_verified: newServiceVerified,
        updated_at: new Date().toISOString()
      };
      await onUpdateService(updated);
      setEditingService(null);
    } else {
      const newSvc: Partial<Service> = {
        id: 'svc_' + Date.now(),
        name: newServiceName.trim(),
        slug: newServiceName.toLowerCase().replace(/\s+/g, '-'),
        phone: newServicePhone.trim(),
        address: newServiceAddress.trim(),
        district_id: newServiceDistrict,
        upazila_id: '',
        category_id: newServiceCategory,
        description: newServiceDesc.trim(),
        is_verified: newServiceVerified,
        status: 'PUBLISHED',
        latitude: 22.8456,
        longitude: 89.5403,
        opening_hours: '২৪ ঘণ্টা',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await onAddService(newSvc);
    }

    setIsAddingServiceModal(false);
    setNewServiceName('');
    setNewServicePhone('');
    setNewServiceAddress('');
    setNewServiceDesc('');
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchSearch =
      (u.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.phone || '').includes(userSearchQuery);

    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const isSuspended = u.status === 'suspended' || u.isBanned;
    const matchStatus =
      userStatusFilter === 'all' ||
      (userStatusFilter === 'active' && !isSuspended) ||
      (userStatusFilter === 'suspended' && isSuspended);

    return matchSearch && matchRole && matchStatus;
  });

  // Filtered Services
  const filteredServices = services.filter(s => {
    const matchSearch =
      (s.name || '').toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
      (s.phone || '').includes(serviceSearchQuery) ||
      (s.address || '').toLowerCase().includes(serviceSearchQuery.toLowerCase());

    const matchDistrict = serviceDistrictFilter === 'all' || s.district_id === serviceDistrictFilter;
    const matchCat = serviceCategoryFilter === 'all' || s.category_id === serviceCategoryFilter;

    return matchSearch && matchDistrict && matchCat;
  });

  // Filtered Posts
  const filteredPosts = effectivePosts.filter(p => {
    const matchSearch =
      (p.title || '').toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      (p.content || '').toLowerCase().includes(postSearchQuery.toLowerCase()) ||
      (p.authorName || '').toLowerCase().includes(postSearchQuery.toLowerCase());

    const matchDistrict = postDistrictFilter === 'all' || p.districtId === postDistrictFilter;
    const matchStatus = postStatusFilter === 'all' || p.status === postStatusFilter;

    return matchSearch && matchDistrict && matchStatus;
  });

  // Sub-admins and Moderators List
  const subAdminsAndModsList = usersList.filter(u => u.role === 'sub_admin' || u.role === 'moderator');
  const filteredSubAdminsAndMods = subAdminsAndModsList.filter(u => {
    if (subAdminRoleFilter === 'all') return true;
    return u.role === subAdminRoleFilter;
  });

  return (
    <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-800 text-white rounded-xl shadow-xs">
              <Shield size={20} />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-serif">
                স্মার্ট খুলনা সেন্ট্রাল এডমিন কনসোল
              </h2>
              <p className="text-xs text-slate-500">
                ভূমিকা: <span className="font-bold text-emerald-800">
                  {isSuperAdmin ? 'সুপার অ্যাডমিন (Super Admin)' : currentUserRole === 'moderator' ? 'মডারেটর (Moderator)' : 'সাব অ্যাডমিন (Sub Admin)'}
                </span> | {currentUserEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('policy')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer"
            title="সাব-এডমিন ও মডারেটর নীতিমালা পড়ুন"
          >
            <BookOpen size={13} className="text-amber-600" />
            <span>অফিসিয়াল পলিসি</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_tools')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer"
            title="অনুমোদিত AI ভেরিফিকেশন টুল"
          >
            <Bot size={13} className="text-emerald-600" />
            <span>AI টুলস</span>
          </button>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw size={13} className={isLoadingUsers ? 'animate-spin' : ''} />
            <span>রিলোড ডেটা</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-100 cursor-pointer shadow-xs"
            title="অ্যাডমিন প্যানেল থেকে বের হন"
          >
            <LogOut size={13} />
            <span>বন্ধ করুন</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <BarChart2 size={14} /> ওভারভিউ ড্যাশবোর্ড
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'policy'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60'
          }`}
        >
          <BookOpen size={14} className="text-amber-500" /> সাব-এডমিন ও মডারেটর পলিসি
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('sub_admins')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sub_admins'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Shield size={14} className="text-blue-500" /> সাব-এডমিন ও মডারেটর পরিষদ ({subAdminsAndModsList.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('ai_tools')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'ai_tools'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60'
          } ${!isSuperAdmin && currentUserPermissions?.canUseAITools === false ? 'hidden' : ''}`}
        >
          <Bot size={14} className="text-emerald-500" /> AI ভেরিফিকেশন টুল
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          } ${!isSuperAdmin && !currentUserPermissions?.canViewUsers ? 'hidden' : ''}`}
        >
          <Users size={14} /> ইউজার ম্যানেজমেন্ট ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          } ${!isSuperAdmin && !currentUserPermissions?.canModeratePosts ? 'hidden' : ''}`}
        >
          <FileText size={14} /> কমিউনিটি পোস্ট ({effectivePosts.length})
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
          } ${!isSuperAdmin && !currentUserPermissions?.canManageBanners ? 'hidden' : ''}`}
        >
          <ImageIcon size={14} /> জেলা ব্যানার CMS ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'services'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          } ${!isSuperAdmin && !currentUserPermissions?.canManageServices ? 'hidden' : ''}`}
        >
          <Building2 size={14} /> জেলা সেবা ও তথ্য CMS ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          } ${!isSuperAdmin && !currentUserPermissions?.canManageSubmissions ? 'hidden' : ''}`}
        >
          <FileSpreadsheet size={14} /> পেন্ডিং সেবা ({submissions.filter(s => s.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          } ${!isSuperAdmin && !currentUserPermissions?.canManageReports ? 'hidden' : ''}`}
        >
          <ShieldAlert size={14} className="text-amber-500" /> রিপোর্ট ও মডারেশন ({effectiveReports.filter(r => r.status === 'pending').length})
        </button>

        {isSuperAdmin || currentUserPermissions?.canManageDownloads ? (
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
            }`}
          >
            <Smartphone size={14} /> রিলিজ ও ডাউনলোড CMS
          </button>
        ) : null}

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          } ${!isSuperAdmin && !currentUserPermissions?.canViewLogs ? 'hidden' : ''}`}
        >
          <Lock size={14} /> অডিট লগ ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
          } ${!isSuperAdmin ? 'hidden' : ''}`}
        >
          <Bell size={14} /> নোটিশ ম্যানেজমেন্ট
        </button>
      </div>

      {/* 1. OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs font-medium text-slate-500 block">মোট নিবন্ধিত ইউজার</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block font-serif">
                {usersList.length}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 inline-flex items-center gap-1">
                <CheckCircle size={11} /> রিয়েল-টাইম সিঙ্ক
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs font-medium text-slate-500 block">মোট কমিউনিটি পোস্ট</span>
              <span className="text-2xl font-black text-emerald-800 mt-1 block font-serif">
                {effectivePosts.length}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">১০টি জেলা জুড়ে</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs font-medium text-slate-500 block">পাবলিশড সেবা ও গাইড</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block font-serif">
                {services.length}
              </span>
              <span className="text-[10px] text-blue-600 font-bold mt-1 block">জরুরি ও নাগরিক সেবা</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
              <span className="text-xs font-medium text-rose-800 block">পর্যালোচনা ও রিপোর্ট বাকি</span>
              <span className="text-2xl font-black text-rose-700 mt-1 block font-serif">
                {submissions.filter(s => s.status === 'PENDING').length + effectiveReports.filter(r => r.status === 'pending').length}
              </span>
              <span className="text-[10px] text-rose-600 font-bold mt-1 block">পদক্ষেপ প্রয়োজন</span>
            </div>
          </div>

          {/* District Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900">খুলনা বিভাগের ১০টি জেলার সেবা ও কমিউনিটি বণ্টন চিত্র</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {districts.map(d => {
                const districtServices = services.filter(s => s.district_id === d.id);
                const districtPosts = effectivePosts.filter(p => p.districtId === d.id);
                return (
                  <div key={d.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{d.name} জেলা ({d.nameEn})</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {districtServices.length}টি সেবা তালিকাভুক্ত
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-[11px] border border-emerald-200">
                      {districtPosts.length} পোস্ট
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে ইউজার খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">সকল রোল</option>
                <option value="super_admin">সুপার এডমিন</option>
                <option value="sub_admin">সাব এডমিন</option>
                <option value="moderator">মডারেটর</option>
                <option value="user">সাধারণ ইউজার</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={e => setUserStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="active">সক্রিয় (Active)</option>
                <option value="suspended">স্থগিত (Suspended)</option>
              </select>
            </div>
          </div>

          {/* User List Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">ইউজার / নাম</th>
                  <th className="p-3">ইমেইল</th>
                  <th className="p-3">রোল (Role)</th>
                  <th className="p-3">জেলা</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      কোনো ইউজার পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const isSuspended = u.status === 'suspended' || u.isBanned;
                    const districtName = districts.find(d => d.id === u.selectedDistrict)?.name || 'খুলনা';
                    return (
                      <tr key={u.uid} className="hover:bg-slate-50 transition">
                        <td className="p-3 flex items-center gap-2.5">
                          <img
                            src={getSafeAvatarUrl(u.avatar, u.name, u.uid)}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            onError={(e) => {
                              e.currentTarget.src = getSafeAvatarUrl('', u.name, u.uid);
                            }}
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name || 'নামবিহীন'}</span>
                            <span className="text-[10px] text-slate-400 font-mono">UID: {u.uid.slice(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{u.email}</td>
                        <td className="p-3">
                          {u.role === 'super_admin' ? (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-full text-[10px] border border-rose-200">
                              সুপার এডমিন
                            </span>
                          ) : u.role === 'sub_admin' ? (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[10px] border border-blue-200">
                              সাব এডমিন {u.subAdminScope?.districtId ? `(${u.subAdminScope.districtId})` : ''}
                            </span>
                          ) : u.role === 'moderator' ? (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-full text-[10px] border border-indigo-200">
                              মডারেটর {u.subAdminScope?.districtId ? `(${u.subAdminScope.districtId})` : ''}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-full text-[10px]">
                              নাগরিক (User)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">{districtName}</td>
                        <td className="p-3">
                          {isSuspended ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded-full text-[10px]">
                              স্থগিত (Banned)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded-full text-[10px]">
                              সক্রিয়
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isSuperAdmin && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setTargetUserNewRole(u.role);
                                    setTargetUserDistrictScope(u.subAdminScope?.districtId || 'khulna');
                                    setTargetUserUpazilaScope(u.subAdminScope?.upazilaId || '');
                                    setTargetUserCategoryScope(u.subAdminScope?.categoryId || 'all');
                                    if (u.subAdminPermissions) {
                                      setTargetUserPermissions(u.subAdminPermissions);
                                    }
                                    setIsEditingUserRole(true);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                                  title="রোল ও পারমিশন পরিবর্তন"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleToggleUserSuspension(u)}
                                  className={`p-1.5 rounded-lg transition ${
                                    isSuspended
                                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  }`}
                                  title={isSuspended ? 'পুনর্বহাল করুন' : 'স্থগিত করুন'}
                                >
                                  {isSuspended ? <UserCheck size={13} /> : <UserX size={13} />}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                                  title="ইউজার মুছুন"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* EDIT ROLE MODAL */}
          {isEditingUserRole && selectedUser && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                    <Shield size={18} className="text-emerald-700" />
                    '{selectedUser.name}' এর ভূমিকা ও পারমিশন
                  </h3>
                  <p className="text-[11px] text-slate-500">{selectedUser.email}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">প্রশাসনিক ভূমিকা নির্ধারণ করুন:</label>
                    <select
                      value={targetUserNewRole}
                      onChange={e => {
                        const newRole = e.target.value as any;
                        setTargetUserNewRole(newRole);
                        if (newRole === 'moderator') {
                          setTargetUserPermissions(prev => ({
                            ...prev,
                            canManageServices: false,
                            canManageSubmissions: false,
                            canModeratePosts: true,
                            canManageReports: true,
                            canCollectInfo: true,
                            canUseAITools: true
                          }));
                        } else if (newRole === 'sub_admin') {
                          setTargetUserPermissions(prev => ({
                            ...prev,
                            canManageServices: true,
                            canManageSubmissions: true,
                            canModeratePosts: true,
                            canManageReports: true,
                            canCollectInfo: true,
                            canUseAITools: true
                          }));
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium"
                    >
                      <option value="user">সাধারণ ইউজার (General Citizen)</option>
                      <option value="moderator">মডারেটর (Moderator — কমিউনিটি মনিটরিং ও রিপোর্ট)</option>
                      <option value="sub_admin">সাব-এডমিন (Sub-Admin — স্থানীয় সেবা ও তথ্য সংগ্রহ)</option>
                      <option value="super_admin">সুপার এডমিন (Super Admin — সর্বোচ্চ নিয়ন্ত্রণ)</option>
                    </select>
                  </div>

                  {(targetUserNewRole === 'sub_admin' || targetUserNewRole === 'moderator') && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">আওতাভুক্ত জেলা:</label>
                          <select
                            value={targetUserDistrictScope}
                            onChange={e => setTargetUserDistrictScope(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
                          >
                            <option value="all">সকল জেলা (Global Scope)</option>
                            {districts.map(d => (
                              <option key={d.id} value={d.id}>
                                {d.name} জেলা
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">আওতাভুক্ত উপজেলা (ঐচ্ছিক):</label>
                          <input
                            type="text"
                            value={targetUserUpazilaScope}
                            onChange={e => setTargetUserUpazilaScope(e.target.value)}
                            placeholder="যেমন: রূপসা, ডুমুরিয়া..."
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">আওতাভুক্ত ক্যাটাগরি:</label>
                        <select
                          value={targetUserCategoryScope}
                          onChange={e => setTargetUserCategoryScope(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
                        >
                          <option value="all">সকল ক্যাটাগরি (All Services)</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.nameEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-slate-700">
                            {targetUserNewRole === 'moderator' ? 'মডারেটর পারমিশনসমূহ:' : 'সাব-এডমিন পারমিশনসমূহ:'}
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">Sec 5 Policy</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                          {Object.keys(targetUserPermissions).map((key) => {
                            const permissionKey = key as keyof SubAdminPermissions;
                            const labels: Record<string, string> = {
                              canManageServices: 'নতুন সেবা ও প্রতিষ্ঠান যুক্ত/সংশোধন',
                              canManageSubmissions: 'ইউজার সাবমিশন যাচাই ও অনুমোদন',
                              canModeratePosts: 'কমিউনিটি পোস্ট মডারেশন',
                              canManageReports: 'রিপোর্ট ও অভিযোগ সমাধান',
                              canCollectInfo: 'স্থানীয় তথ্য সংগ্রহ ও ভেরিফিকেশন',
                              canUseAITools: 'অনুমোদিত AI Tools ব্যবহার',
                              canManageBanners: 'ব্যানার CMS পরিচালনা',
                              canManageDownloads: 'ডাউনলোড CMS',
                              canViewUsers: 'ইউজার তালিকা দেখা',
                              canViewLogs: 'অ্যাক্টিভিটি লগ দেখা',
                              canDeleteServices: 'সেবা স্থায়ী মুছে ফেলা'
                            };
                            return (
                              <label key={key} className="flex items-center gap-2 cursor-pointer group p-1 hover:bg-slate-100 rounded-lg">
                                <input
                                  type="checkbox"
                                  checked={!!targetUserPermissions[permissionKey]}
                                  onChange={e => setTargetUserPermissions(prev => ({
                                    ...prev,
                                    [permissionKey]: e.target.checked
                                  }))}
                                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span className="text-[11px] font-medium text-slate-600 group-hover:text-emerald-800 transition">
                                  {labels[key] || key}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsEditingUserRole(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleSaveUserRole}
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md cursor-pointer transition"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-ADMIN & MODERATOR POLICY TAB */}
      {activeTab === 'policy' && (
        <SubAdminPolicyView
          onClose={() => setActiveTab('dashboard')}
          onOpenAIAssistant={() => setActiveTab('ai_tools')}
        />
      )}

      {/* AI VERIFICATION TOOL TAB */}
      {activeTab === 'ai_tools' && (
        <AIVerificationTool
          services={services}
          districts={districts}
          categories={categories}
          onClose={() => setActiveTab('dashboard')}
          onApplyServiceFormat={(formatted) => {
            setNewServiceName(formatted.name);
            setNewServicePhone(formatted.phone);
            setNewServiceAddress(formatted.address);
            setNewServiceDesc(formatted.description);
            setNewServiceDistrict(formatted.district_id);
            setNewServiceCategory(formatted.category_id);
            setActiveTab('services');
            setIsAddingServiceModal(true);
          }}
        />
      )}

      {/* 3. SUB-ADMIN & MODERATOR COUNCIL MANAGEMENT */}
      {activeTab === 'sub_admins' && isSuperAdmin && (
        <div className="space-y-4">
          {/* Header Policy Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-500/20 text-lime-300 rounded-lg">
                    <Shield size={18} />
                  </span>
                  <h3 className="font-bold text-white text-base font-serif">
                    সাব-এডমিন ও মডারেটর পরিষদ ব্যবস্থাপনা
                  </h3>
                </div>
                <p className="text-xs text-slate-300 font-serif mt-1">
                  খুলনা বিভাগের স্থানীয় তথ্য সংগ্রহ, নিয়মিত আপডেট ও কমিউনিটি মনিটরিং নিশ্চিত করতে দায়িত্বপ্রাপ্ত টিম।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('policy')}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <BookOpen size={13} />
                  <span>অফিসিয়াল নীতিমালা পড়ুন</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai_tools')}
                  className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-400/40 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Bot size={13} />
                  <span>AI ভেরিফিকেশন টুল</span>
                </button>
              </div>
            </div>

            {/* Creed Motto */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                “Collect Local. Verify Carefully. Update Regularly. Serve Better.”
              </span>
            </div>
          </div>

          {/* Sub-Filters: All, Sub-Admin, Moderator */}
          <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSubAdminRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  subAdminRoleFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                সকল দায়িত্বপ্রাপ্ত ({subAdminsAndModsList.length})
              </button>

              <button
                onClick={() => setSubAdminRoleFilter('sub_admin')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  subAdminRoleFilter === 'sub_admin'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                সাব-এডমিন ({subAdminsAndModsList.filter(u => u.role === 'sub_admin').length})
              </button>

              <button
                onClick={() => setSubAdminRoleFilter('moderator')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  subAdminRoleFilter === 'moderator'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                মডারেটর ({subAdminsAndModsList.filter(u => u.role === 'moderator').length})
              </button>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
              Super Admin Control Panel (Sec 6)
            </span>
          </div>

          {/* List of Sub Admins & Moderators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSubAdminsAndMods.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl col-span-2 space-y-2">
                <Shield size={32} className="mx-auto text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">
                  এই ফিল্টারে কোনো দায়িত্বপ্রাপ্ত সদস্য পাওয়া যায়নি।
                </p>
                <button
                  onClick={() => setActiveTab('users')}
                  className="px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition cursor-pointer"
                >
                  ইউজার লিস্ট থেকে নিয়োগ দিন
                </button>
              </div>
            ) : (
              filteredSubAdminsAndMods.map(sa => {
                const assignedDistrict =
                  sa.subAdminScope?.districtId === 'all'
                    ? 'সকল জেলা (Global)'
                    : districts.find(d => d.id === sa.subAdminScope?.districtId)?.name || 'সকল জেলা';
                const assignedUpazila = sa.subAdminScope?.upazilaId || sa.upazila || 'সকল উপজেলা';
                const assignedCategory =
                  sa.subAdminScope?.categoryId === 'all' || !sa.subAdminScope?.categoryId
                    ? 'সকল ক্যাটাগরি'
                    : categories.find(c => c.id === sa.subAdminScope?.categoryId)?.name || sa.subAdminScope.categoryId;

                const isSuspended = sa.status === 'suspended' || sa.isBanned;
                const permissions = sa.subAdminPermissions || sa.subAdminScope?.permissions || {};

                return (
                  <div
                    key={sa.uid}
                    className="bg-white border border-slate-200 hover:border-slate-300 p-4 sm:p-5 rounded-3xl space-y-3 text-xs shadow-xs transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeAvatarUrl(sa.avatar, sa.name, sa.uid)}
                          alt={sa.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block font-serif">
                            {sa.name}
                          </span>
                          <span className="text-[11px] text-slate-500">{sa.email}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {sa.role === 'sub_admin' ? (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-blue-200 flex items-center gap-1">
                            <Shield size={11} /> সাব-এডমিন
                          </span>
                        ) : (
                          <span className="bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-indigo-200 flex items-center gap-1">
                            <ShieldAlert size={11} /> মডারেটর
                          </span>
                        )}

                        {isSuspended ? (
                          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            সাময়িক স্থগিত (Suspended)
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            সক্রিয় (Active)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scopes Display */}
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>📍 জেলা আওতা:</span>
                        <strong className="text-slate-900">{assignedDistrict}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>🏛️ উপজেলা আওতা:</span>
                        <span className="text-slate-800">{assignedUpazila}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>📂 ক্যাটাগরি আওতা:</span>
                        <span className="text-slate-800">{assignedCategory}</span>
                      </div>
                    </div>

                    {/* Active Permission Badges */}
                    <div className="flex flex-wrap gap-1">
                      {permissions.canManageServices && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                          সেবা যুক্ত/এডিট
                        </span>
                      )}
                      {permissions.canManageSubmissions && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                          সাবমিশন যাচাই
                        </span>
                      )}
                      {permissions.canModeratePosts && (
                        <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                          পোস্ট মডারেশন
                        </span>
                      )}
                      {permissions.canManageReports && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                          রিপোর্ট সমাধান
                        </span>
                      )}
                      {permissions.canCollectInfo && (
                        <span className="text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200">
                          তথ্য সংগ্রহ
                        </span>
                      )}
                      {permissions.canUseAITools && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                          AI টুলস সহায়তা
                        </span>
                      )}
                      {permissions.canManageBanners && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          ব্যানার
                        </span>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => handleToggleUserSuspension(sa)}
                        className={`font-bold transition cursor-pointer ${
                          isSuspended ? 'text-emerald-700 hover:underline' : 'text-amber-600 hover:underline'
                        }`}
                      >
                        {isSuspended ? 'এক্সেস সচল করুন' : 'এক্সেস সাময়িক স্থগিত'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedUser(sa);
                          setTargetUserNewRole(sa.role);
                          setTargetUserDistrictScope(sa.subAdminScope?.districtId || 'khulna');
                          setTargetUserUpazilaScope(sa.subAdminScope?.upazilaId || '');
                          setTargetUserCategoryScope(sa.subAdminScope?.categoryId || 'all');
                          if (sa.subAdminPermissions) {
                            setTargetUserPermissions(sa.subAdminPermissions);
                          }
                          setIsEditingUserRole(true);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition cursor-pointer"
                      >
                        পারমিশন ও দায়িত্ব পরিবর্তন
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. POST MANAGEMENT & MODERATION */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={postSearchQuery}
                onChange={e => setPostSearchQuery(e.target.value)}
                placeholder="পোস্টের শিরোনাম, বিষয়বস্তু বা লেখকের নাম দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={postDistrictFilter}
                onChange={e => setPostDistrictFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">সকল জেলা</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={postStatusFilter}
                onChange={e => setPostStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">সকল স্ট্যাটাস</option>
                <option value="published">পাবলিশড</option>
                <option value="hidden">লুকায়িত (Hidden)</option>
                <option value="reported">রিপোর্টেড</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">কোনো পোস্ট পাওয়া যায়নি।</p>
            ) : (
              filteredPosts.map(p => {
                const districtName = districts.find(d => d.id === p.districtId)?.name || 'খুলনা';
                return (
                  <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{p.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({districtName})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'hidden'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    {p.title && <h4 className="font-bold text-slate-900 font-serif">{p.title}</h4>}
                    <p className="text-slate-700 line-clamp-3 leading-relaxed">{p.content}</p>

                    {p.images && p.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {p.images.map((img, i) => (
                          <img key={i} src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover border" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400">
                        লাইক: {p.likesCount || 0} | মন্তব্য: {p.commentsCount || 0}
                      </span>
                      <div className="flex gap-2">
                        {p.status === 'hidden' ? (
                          <button
                            onClick={() => onRestorePost(p.id)}
                            className="text-emerald-700 font-bold hover:underline"
                          >
                            পুনরুদ্ধার করুন
                          </button>
                        ) : (
                          <button
                            onClick={() => onHidePost(p.id, 'এডমিন দ্বারা লুকানো হয়েছে')}
                            className="text-amber-700 font-bold hover:underline"
                          >
                            লুকান (Hide)
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePostAction(p.id)}
                          className="text-rose-600 font-bold hover:underline ml-2"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4.5 DISTRICT BANNERS CMS */}
      {activeTab === 'banners' && (
        <div>
          <AdminBannersCMS
            banners={banners}
            districts={districts}
            onAddBanner={onAddBanner || (() => {})}
            onUpdateBanner={onUpdateBanner || (() => {})}
            onDeleteBanner={onDeleteBanner || (() => {})}
            onToggleBannerStatus={onToggleBannerStatus || (() => {})}
            onClose={() => setActiveTab('dashboard')}
          />
        </div>
      )}

      {/* 5. DISTRICT & SERVICES CMS */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={serviceSearchQuery}
                onChange={e => setServiceSearchQuery(e.target.value)}
                placeholder="সেবার নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={serviceDistrictFilter}
                onChange={e => setServiceDistrictFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="all">সকল জেলা</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingService(null);
                  setNewServiceName('');
                  setNewServicePhone('');
                  setNewServiceAddress('');
                  setNewServiceDesc('');
                  setIsAddingServiceModal(true);
                }}
                className="bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus size={14} /> নতুন সেবা যোগ করুন
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredServices.map(svc => {
              const districtName = districts.find(d => d.id === svc.district_id)?.name || 'খুলনা';
              return (
                <div key={svc.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{svc.name}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      {districtName}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">ঠিকানা: {svc.address}</p>
                  <p className="text-slate-600 text-[11px] font-mono">ফোন: {svc.phone}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">স্ট্যাটাস: {svc.status}</span>
                      <button
                        onClick={async () => {
                          const updated = { ...svc, isFeatured: !svc.isFeatured, updated_at: new Date().toISOString() };
                          await onUpdateService(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center gap-1 ${
                          svc.isFeatured ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="হোম পেজে ফিচার্ড সেকশনে দেখান"
                      >
                        <span>⭐ {svc.isFeatured ? 'Featured On Home' : 'Set Featured'}</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingService(svc);
                          setNewServiceName(svc.name);
                          setNewServicePhone(svc.phone);
                          setNewServiceAddress(svc.address);
                          setNewServiceDistrict(svc.district_id);
                          setNewServiceCategory(svc.category_id);
                          setNewServiceDesc(svc.description || '');
                          setNewServiceVerified(svc.is_verified);
                          setIsAddingServiceModal(true);
                        }}
                        className="text-emerald-800 font-bold hover:underline"
                      >
                        সম্পাদনা
                      </button>
                      <button
                        onClick={() => onDeleteService(svc.id)}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        মুছুন
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADD / EDIT SERVICE MODAL */}
          {isAddingServiceModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateOrUpdateService}
                className="bg-white rounded-3xl max-w-md w-full p-5 space-y-3 border border-slate-200 shadow-2xl"
              >
                <h3 className="font-bold text-slate-900 text-sm font-serif">
                  {editingService ? 'সেবা তথ্য সম্পাদনা করুন' : 'নতুন সেবা যোগ করুন'}
                </h3>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">সেবার নাম *</label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={e => setNewServiceName(e.target.value)}
                      placeholder="যেমন: খুলনা মেডিকেল কলেজ হাসপাতাল"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">জেলা *</label>
                      <select
                        value={newServiceDistrict}
                        onChange={e => setNewServiceDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl"
                      >
                        {districts.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                      <select
                        value={newServiceCategory}
                        onChange={e => setNewServiceCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ফোন / মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={newServicePhone}
                      onChange={e => setNewServicePhone(e.target.value)}
                      placeholder="যেমন: 01711000000"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ঠিকানা / লোকেশন</label>
                    <input
                      type="text"
                      value={newServiceAddress}
                      onChange={e => setNewServiceAddress(e.target.value)}
                      placeholder="যেমন: বয়রা মেইন রোড, খুলনা"
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বিবরণ / বিস্তারিত</label>
                    <textarea
                      rows={2}
                      value={newServiceDesc}
                      onChange={e => setNewServiceDesc(e.target.value)}
                      placeholder="সেবা সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingServiceModal(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 6. SERVICE SUBMISSIONS / APPROVAL WORKFLOW */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900">নাগরিকদের সেবার আবেদন অনুমোদন ও ব্যবস্থাপনা</h3>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSubmissionSubTab('pending')}
                className={`px-3 py-1.5 rounded-lg transition ${submissionSubTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                পেন্ডিং ({submissions.filter(s => s.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setSubmissionSubTab('approved')}
                className={`px-3 py-1.5 rounded-lg transition ${submissionSubTab === 'approved' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}
              >
                অনুমোদিত ({submissions.filter(s => s.status === 'APPROVED' || s.status === 'PUBLISHED').length})
              </button>
              <button
                onClick={() => setSubmissionSubTab('rejected')}
                className={`px-3 py-1.5 rounded-lg transition ${submissionSubTab === 'rejected' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600'}`}
              >
                প্রত্যাখ্যাত ({submissions.filter(s => s.status === 'REJECTED').length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {submissionSubTab === 'pending' && (
            <div className="space-y-3">
              {submissions.filter(s => s.status === 'PENDING').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">বর্তমানে কোনো পেন্ডিং সেবা আবেদন নেই।</p>
              ) : (
                submissions.filter(s => s.status === 'PENDING').map(sub => (
                  <div key={sub.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">PENDING</span>
                    </div>
                    <p className="text-slate-600">জেলা: {districts.find(d => d.id === sub.district_id)?.name || sub.district_id} • উপজেলা: {sub.upazila_id || 'সদর'}</p>
                    <p className="text-slate-600">ঠিকানা: {sub.address}</p>
                    <p className="text-slate-600 font-mono">ফোন: {sub.phone}</p>
                    <p className="text-slate-500 italic">"{sub.description || 'কোনো বিবরণ নেই'}"</p>
                    <p className="text-[10px] text-slate-400">দাখিলকারী: {sub.submitted_by || sub.created_by}</p>

                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedSubmissionForDetail(sub)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Eye size={13} /> বিস্তারিত দেখুন
                      </button>
                      <button
                        onClick={() => onApproveSubmission(sub)}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle size={13} /> অনুমোদন ও প্রকাশ
                      </button>
                      <button
                        onClick={() => setShowRejectModalForSub(sub)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                      >
                        <XCircle size={13} /> প্রত্যাখ্যান
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {submissionSubTab === 'approved' && (
            <div className="space-y-3">
              {submissions.filter(s => s.status === 'APPROVED' || s.status === 'PUBLISHED').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">কোনো অনুমোদিত সেবা নেই।</p>
              ) : (
                submissions.filter(s => s.status === 'APPROVED' || s.status === 'PUBLISHED').map(sub => (
                  <div key={sub.id} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">APPROVED</span>
                    </div>
                    <p className="text-slate-600">ঠিকানা: {sub.address}</p>
                    <p className="text-slate-600 font-mono">ফোন: {sub.phone}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-emerald-100">
                      <span className="text-[10px] text-emerald-700">অনুমোদিত তারিখ: {new Date(sub.updated_at || sub.created_at).toLocaleDateString('bn-BD')}</span>
                      <button
                        onClick={() => setSelectedSubmissionForDetail(sub)}
                        className="bg-emerald-800 text-white px-3 py-1 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        বিস্তারিত
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {submissionSubTab === 'rejected' && (
            <div className="space-y-3">
              {submissions.filter(s => s.status === 'REJECTED').length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">কোনো প্রত্যাখ্যাত সেবা নেই।</p>
              ) : (
                submissions.filter(s => s.status === 'REJECTED').map(sub => (
                  <div key={sub.id} className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">REJECTED</span>
                    </div>
                    <p className="text-slate-600">ঠিকানা: {sub.address}</p>
                    <p className="text-rose-700 font-semibold">প্রত্যাখ্যানের কারণ: {sub.rejectionReason || 'কোনো কারণ উল্লেখ করা হয়নি'}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-rose-100">
                      <span className="text-[10px] text-slate-400">দাখিলকারী: {sub.submitted_by || sub.created_by}</span>
                      <button
                        onClick={() => setSelectedSubmissionForDetail(sub)}
                        className="bg-slate-200 text-slate-700 px-3 py-1 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        বিস্তারিত
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedSubmissionForDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">{selectedSubmissionForDetail.name}</h3>
              <button onClick={() => setSelectedSubmissionForDetail(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <p><span className="font-bold">ক্যাটাগরি:</span> {categories.find(c => c.id === selectedSubmissionForDetail.category_id)?.name || selectedSubmissionForDetail.category_id}</p>
              <p><span className="font-bold">জেলা ও উপজেলা:</span> {districts.find(d => d.id === selectedSubmissionForDetail.district_id)?.name}, {selectedSubmissionForDetail.upazila_id}</p>
              <p><span className="font-bold">ঠিকানা:</span> {selectedSubmissionForDetail.address}</p>
              <p><span className="font-bold">ফোন:</span> {selectedSubmissionForDetail.phone}</p>
              {selectedSubmissionForDetail.email && <p><span className="font-bold">ইমেইল:</span> {selectedSubmissionForDetail.email}</p>}
              {selectedSubmissionForDetail.website && <p><span className="font-bold">ওয়েবসাইট:</span> <a href={selectedSubmissionForDetail.website} target="_blank" rel="noreferrer" className="text-emerald-700 underline">{selectedSubmissionForDetail.website}</a></p>}
              {selectedSubmissionForDetail.facebook && <p><span className="font-bold">ফেসবুক:</span> <a href={selectedSubmissionForDetail.facebook} target="_blank" rel="noreferrer" className="text-emerald-700 underline">{selectedSubmissionForDetail.facebook}</a></p>}
              <p><span className="font-bold">বিবরণ:</span> {selectedSubmissionForDetail.description || 'কোনো বিবরণ নেই'}</p>
              {selectedSubmissionForDetail.rejectionReason && (
                <p className="text-rose-700"><span className="font-bold">প্রত্যাখ্যানের কারণ:</span> {selectedSubmissionForDetail.rejectionReason}</p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSubmissionForDetail(null)}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModalForSub && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-slate-900">সেবা আবেদন প্রত্যাখ্যান করুন</h3>
            <p className="text-xs text-slate-600">অনুগ্রহ করে "{showRejectModalForSub.name}" সেবাটি প্রত্যাখ্যানের সুনির্দিষ্ট কারণ উল্লেখ করুন:</p>
            <textarea
              rows={3}
              placeholder="প্রত্যাখ্যানের কারণ লিখুন (যেমন: ভুল তথ্য বা অপ্রাসঙ্গিক)..."
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-700"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowRejectModalForSub(null); setRejectionReasonInput(''); }}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  onRejectSubmission(showRejectModalForSub, rejectionReasonInput || 'যথাযথ তথ্য না থাকায় প্রত্যাখ্যান করা হয়েছে');
                  setShowRejectModalForSub(null);
                  setRejectionReasonInput('');
                }}
                className="bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                নিশ্চিত করুন ও প্রত্যাখ্যান করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. REPORTS & MODERATION */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900">ব্যবহারকারীদের রিপোর্টসমূহ</h3>
          {effectiveReports.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">কোনো রিপোর্ট পাওয়া যায়নি।</p>
          ) : (
            effectiveReports.map(rep => (
              <div key={rep.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">টার্গেট: {rep.targetType.toUpperCase()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rep.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rep.status === 'dismissed'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rep.status}
                  </span>
                </div>
                <p className="text-slate-700">কারণ: <b>{rep.reason}</b></p>
                {(rep.customDetails || (rep as any).details) && (
                  <p className="text-slate-500 italic">"{(rep.customDetails || (rep as any).details)}"</p>
                )}

                {rep.status === 'pending' && (
                  <div className="flex gap-2 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      placeholder="নিষ্পত্তির নোট লিখুন..."
                      value={reportResolutionNote[rep.id] || ''}
                      onChange={e =>
                        setReportResolutionNote({ ...reportResolutionNote, [rep.id]: e.target.value })
                      }
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs"
                    />
                    <button
                      onClick={() =>
                        onResolveReport(rep.id, reportResolutionNote[rep.id] || 'পদক্ষেপ গ্রহণ করা হয়েছে')
                      }
                      className="bg-emerald-800 text-white px-3 py-1 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      সমাধান
                    </button>
                    <button
                      onClick={() => onDismissReport(rep.id)}
                      className="bg-slate-200 text-slate-700 px-3 py-1 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 8. DOWNLOADS CMS */}
      {activeTab === 'downloads' && isSuperAdmin && (
        <div>
          <AdminDownloadsCMS
            initialConfig={releaseConfig}
            onSave={async (cfg) => {
              if (onSaveReleaseConfig) {
                await onSaveReleaseConfig(cfg);
              }
            }}
            onClose={() => setActiveTab('dashboard')}
          />
        </div>
      )}

      {/* 9. ACTIVITY & AUDIT LOGS (Section 7 Policy) */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-2 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold font-serif flex items-center gap-2">
                  <Lock size={16} className="text-emerald-400" />
                  প্রশাসনিক অ্যাক্টিভিটি ও অডিট লগ (Activity Log)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  নীতিমালা ধারা ৭ অনুযায়ী নিরাপত্তা ও স্বচ্ছতা বজায় রাখতে সকল প্রশাসনিক পদক্ষেপের স্থায়ী ট্র্যাকিং।
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/60">
                কে → কী পরিবর্তন করেছে → কখন করেছে → কোন তথ্য পরিবর্তন করেছে
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto shadow-xs bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5">কখন করেছে (Time)</th>
                  <th className="p-3.5">কে করেছে (Admin / User)</th>
                  <th className="p-3.5">কী পরিবর্তন করেছে (Action)</th>
                  <th className="p-3.5">কোন তথ্য পরিবর্তন করেছে (Target / Entity)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400 text-xs">
                      এখনও কোনো অ্যাক্টিভিটি লগ রেকর্ড করা হয়নি।
                    </td>
                  </tr>
                ) : (
                  auditLogs.map(log => {
                    const isDelete = log.action.toLowerCase().includes('delete') || log.action.includes('মুছে');
                    const isUpdate = log.action.toLowerCase().includes('update') || log.action.includes('পরিবর্তন') || log.action.includes('এডিট');
                    const isCreate = log.action.toLowerCase().includes('add') || log.action.includes('create') || log.action.includes('যুক্ত');

                    return (
                      <tr key={log.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString('bn-BD', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            <span className="font-bold text-slate-900">{log.user}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                            isDelete
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isUpdate
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : isCreate
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-700">{log.target}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. NOTICE MANAGEMENT */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900">ডাইনামিক নোটিশ ও ঘোষণা ব্যবস্থাপনা</h3>
            <button
              onClick={() => {
                setEditingNotice(null);
                setNewNoticeTitle('');
                setNewNoticeDesc('');
                setNewNoticePriority('Low');
                setNewNoticeActive(true);
                setIsAddingNoticeModal(true);
              }}
              className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-900 transition cursor-pointer"
            >
              <Plus size={14} /> নতুন নোটিশ যুক্ত করুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                কোনো নোটিশ পাওয়া যায়নি।
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className={`p-4 rounded-2xl border transition-all ${notice.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          notice.priority === 'High' ? 'bg-rose-100 text-rose-700' : 
                          notice.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {notice.priority} Priority
                        </span>
                        {!notice.isActive && <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[9px] font-black uppercase">Inactive</span>}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{notice.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notice.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setEditingNotice(notice);
                          setNewNoticeTitle(notice.title);
                          setNewNoticeDesc(notice.description);
                          setNewNoticePriority(notice.priority);
                          setNewNoticeActive(notice.isActive);
                          setIsAddingNoticeModal(true);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => onDeleteNotice && onDeleteNotice(notice.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400">তৈরি: {notice.createdAt?.seconds ? new Date(notice.createdAt.seconds * 1000).toLocaleDateString('bn-BD') : 'এখনই'}</span>
                    <button 
                      onClick={() => onUpdateNotice && onUpdateNotice(notice.id, { isActive: !notice.isActive })}
                      className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition ${notice.isActive ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}
                    >
                      {notice.isActive ? 'বন্ধ করুন' : 'চালু করুন'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ADD/EDIT NOTICE MODAL */}
          {isAddingNoticeModal && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    {editingNotice ? 'নোটিশ আপডেট করুন' : 'নতুন নোটিশ যুক্ত করুন'}
                  </h3>
                  <button onClick={() => setIsAddingNoticeModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম *</label>
                    <input 
                      type="text"
                      value={newNoticeTitle}
                      onChange={e => setNewNoticeTitle(e.target.value)}
                      placeholder="যেমন: স্মার্ট খুলনা অ্যাপের নতুন আপডেট আসছে..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                    <textarea 
                      rows={4}
                      value={newNoticeDesc}
                      onChange={e => setNewNoticeDesc(e.target.value)}
                      placeholder="নোটিশের বিস্তারিত এখানে লিখুন..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-emerald-700 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">গুরুত্ব (Priority)</label>
                      <select 
                        value={newNoticePriority}
                        onChange={e => setNewNoticePriority(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input 
                        type="checkbox"
                        id="notice-active"
                        checked={newNoticeActive}
                        onChange={e => setNewNoticeActive(e.target.checked)}
                        className="w-4 h-4 accent-emerald-700"
                      />
                      <label htmlFor="notice-active" className="text-xs font-bold text-slate-700">সক্রিয় রাখুন</label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setIsAddingNoticeModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                  >
                    বাতিল
                  </button>
                  <button 
                    onClick={async () => {
                      if (!newNoticeTitle.trim()) {
                        alert("দয়া করে শিরোনাম লিখুন।");
                        return;
                      }
                      const noticeData = {
                        title: newNoticeTitle.trim(),
                        description: newNoticeDesc.trim(),
                        priority: newNoticePriority,
                        isActive: newNoticeActive
                      };

                      if (editingNotice) {
                        if (onUpdateNotice) await onUpdateNotice(editingNotice.id, noticeData);
                      } else {
                        if (onAddNotice) await onAddNotice(noticeData);
                      }
                      setIsAddingNoticeModal(false);
                    }}
                    className="flex-1 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition shadow-md"
                  >
                    {editingNotice ? 'আপডেট করুন' : 'যোগ করুন'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
