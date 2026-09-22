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
  Image as ImageIcon
} from 'lucide-react';
import { getSafeAvatarUrl } from '../lib/avatarHelper';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { District, Category, Service, AuditLog, UserProfile, Banner } from '../dbData';
import { CommunityPost, CommunityReport } from '../types/community';
import { AdminDownloadsCMS } from './AdminDownloadsCMS';
import { AdminBannersCMS } from './AdminBannersCMS';

interface AdminPanelCompleteProps {
  currentUserRole: 'super_admin' | 'sub_admin';
  currentUserEmail: string;
  currentUserId?: string;
  subAdminScopeDistrict?: string;
  subAdminScope?: {
    districtId?: string;
    categoryId?: string;
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
  onRejectSubmission: (sub: any) => Promise<void> | void;
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
}

export const AdminPanelComplete: React.FC<AdminPanelCompleteProps> = ({
  currentUserRole,
  currentUserEmail,
  currentUserId,
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
}) => {
  const effectivePosts = posts || communityPosts || [];
  const effectiveReports = reports || communityReports || [];
  const handleDeletePostAction = (postId: string) => {
    if (onDeletePost) return onDeletePost(postId);
    if (onRemovePost) return onRemovePost(postId, 'অ্যাডমিন মডারেশন দ্বারা মুছে ফেলা');
  };
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'sub_admins' | 'posts' | 'banners' | 'services' | 'submissions' | 'reports' | 'downloads' | 'logs'
  >('dashboard');

  const isSuperAdmin = currentUserRole === 'super_admin';

  // State for Users List
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'super_admin' | 'sub_admin' | 'user'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditingUserRole, setIsEditingUserRole] = useState(false);
  const [targetUserNewRole, setTargetUserNewRole] = useState<'super_admin' | 'sub_admin' | 'moderator' | 'user'>('user');
  const [targetUserDistrictScope, setTargetUserDistrictScope] = useState<string>('khulna');

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
      if (targetUserNewRole === 'sub_admin') {
        updateData.subAdminScope = { districtId: targetUserDistrictScope };
      }
      await updateDoc(userRef, updateData);

      setUsersList(prev =>
        prev.map(u => (u.uid === selectedUser.uid ? { ...u, ...updateData } : u))
      );
      alert(`ইউজারের রোল '${targetUserNewRole}' এ পরিবর্তিত হয়েছে!`);
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

  // Sub-admins List
  const subAdminsList = usersList.filter(u => u.role === 'sub_admin');

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
                ভূমিকা: <span className="font-bold text-emerald-800">{isSuperAdmin ? 'সুপার অ্যাডমিন (Super Admin)' : 'সাব অ্যাডমিন (Sub Admin)'}</span> | {currentUserEmail}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <RefreshCw size={13} className={isLoadingUsers ? 'animate-spin' : ''} />
          <span>রিলোড ডেটা</span>
        </button>
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
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Users size={14} /> ইউজার ম্যানেজমেন্ট ({usersList.length})
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
            <Shield size={14} /> সাব-অ্যাডমিন ব্যবস্থাপনা ({subAdminsList.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <FileText size={14} /> কমিউনিটি পোস্ট ({effectivePosts.length})
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
          }`}
        >
          <ImageIcon size={14} /> জেলা ব্যানার CMS ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'services'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Building2 size={14} /> জেলা সেবা ও তথ্য CMS ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <FileSpreadsheet size={14} /> পেন্ডিং সেবা ({submissions.filter(s => s.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <ShieldAlert size={14} className="text-amber-500" /> রিপোর্ট ও মডারেশন ({effectiveReports.filter(r => r.status === 'pending').length})
        </button>

        {isSuperAdmin && (
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
        )}

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Lock size={14} /> অডিট লগ ({auditLogs.length})
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
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] border border-emerald-200">
                              সাব এডমিন {u.subAdminScope?.districtId ? `(${u.subAdminScope.districtId})` : ''}
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
                                    setIsEditingUserRole(true);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                                  title="রোল পরিবর্তন"
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
              <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 border border-slate-200 shadow-2xl">
                <h3 className="font-bold text-slate-900 text-sm font-serif">
                  '{selectedUser.name}' এর রোল পরিবর্তন করুন
                </h3>

                <div className="space-y-2 text-xs">
                  <label className="block font-bold text-slate-700">নতুন ভূমিকা নির্ধারণ করুন:</label>
                  <select
                    value={targetUserNewRole}
                    onChange={e => setTargetUserNewRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl"
                  >
                    <option value="user">সাধারণ ইউজার (General User)</option>
                    <option value="sub_admin">সাব-এডমিন (Sub-Admin / Moderator)</option>
                    <option value="super_admin">সুপার এডমিন (Super Admin)</option>
                  </select>

                  {targetUserNewRole === 'sub_admin' && (
                    <div className="space-y-1 pt-2">
                      <label className="block font-bold text-slate-700">সাব-এডমিনের আওতাভুক্ত জেলা:</label>
                      <select
                        value={targetUserDistrictScope}
                        onChange={e => setTargetUserDistrictScope(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl"
                      >
                        {districts.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} জেলা
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsEditingUserRole(false);
                      setSelectedUser(null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    বাতিল
                  </button>
                  <button
                    onClick={handleSaveUserRole}
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SUB-ADMIN MANAGEMENT */}
      {activeTab === 'sub_admins' && isSuperAdmin && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
            <h3 className="font-bold text-emerald-950 text-sm mb-1">সাব-এডমিন দায়িত্ব বণ্টন</h3>
            <p className="text-emerald-800">
              সাব-এডমিনগণ নির্ধারিত জেলা বা ক্যাটাগরির সেবা যাচাইকরণ ও পোস্ট মডারেশন করতে পারেন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subAdminsList.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 col-span-2 text-center">
                বর্তমানে কোনো সাব-এডমিন নিযুক্ত নেই। ইউজার ম্যানেজমেন্ট থেকে রোল নির্ধারণ করুন।
              </p>
            ) : (
              subAdminsList.map(sa => {
                const assignedDistrict = districts.find(d => d.id === sa.subAdminScope?.districtId)?.name || 'সার্বিক';
                return (
                  <div key={sa.uid} className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{sa.name}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        সাব-এডমিন
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{sa.email}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">আওতাভুক্ত জেলা: <b>{assignedDistrict}</b></span>
                      <button
                        onClick={() => {
                          setSelectedUser(sa);
                          setTargetUserNewRole('user');
                          setIsEditingUserRole(true);
                        }}
                        className="text-rose-600 hover:underline font-bold"
                      >
                        রোল পরিবর্তন
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
                    <span className="text-[10px] text-slate-400">স্ট্যাটাস: {svc.status}</span>
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

      {/* 6. SERVICE SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900">নাগরিকদের দাখিলকৃত নতুন সেবা পর্যালোচনা</h3>
          {submissions.filter(s => s.status === 'PENDING').length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">বর্তমানে কোনো নতুন সেবা অনুমোদনের অপেক্ষায় নেই।</p>
          ) : (
            submissions.filter(s => s.status === 'PENDING').map(sub => (
              <div key={sub.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                    PENDING
                  </span>
                </div>
                <p className="text-slate-600">ঠিকানা: {sub.address}</p>
                <p className="text-slate-600 font-mono">ফোন: {sub.phone}</p>
                <p className="text-slate-500 italic">"{sub.description || 'কোনো বিবরণ নেই'}"</p>
                <p className="text-[10px] text-slate-400">দাখিলকারী: {sub.submitted_by}</p>

                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => onApproveSubmission(sub)}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    অনুমোদন ও প্রকাশ
                  </button>
                  <button
                    onClick={() => onRejectSubmission(sub)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    প্রত্যাখ্যান করুন
                  </button>
                </div>
              </div>
            ))
          )}
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

      {/* 9. AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900">প্রশাসনিক অডিট ও অ্যাক্টিভিটি লগ</h3>
          <div className="border border-slate-200 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">সময়</th>
                  <th className="p-3">ইউজার / এডমিন</th>
                  <th className="p-3">অ্যাকশন</th>
                  <th className="p-3">টার্গেট / বিবরণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('bn-BD')}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{log.user}</td>
                    <td className="p-3 text-emerald-800 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
