import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  FileText,
  MessageSquare,
  Users,
  CheckCircle,
  XCircle,
  EyeOff,
  Eye,
  Trash2,
  Ban,
  UserX,
  Clock,
  MapPin,
  Lock,
  Search,
  Filter,
  X
} from 'lucide-react';
import {
  CommunityReport,
  CommunityPost,
  PublicUserProfile,
  ModerationAction
} from '../../types/community';
import { District, Category } from '../../dbData';
import { getSafeAvatarUrl } from '../../lib/avatarHelper';

interface CommunityModerationDashboardProps {
  currentUserRole: 'super_admin' | 'sub_admin';
  subAdminScope?: {
    districtId?: string;
    categoryId?: string;
  };
  reports: CommunityReport[];
  posts: CommunityPost[];
  users: PublicUserProfile[];
  districts: District[];
  categories: Category[];
  onResolveReport: (reportId: string, resolutionNote: string) => void;
  onDismissReport: (reportId: string) => void;
  onHidePost: (postId: string, reason: string) => void;
  onRestorePost: (postId: string) => void;
  onRemovePost: (postId: string, reason: string) => void;
  onBanUser: (targetUid: string, reason: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  auditLogs: ModerationAction[];
  onClose?: () => void;
}

export const CommunityModerationDashboard: React.FC<CommunityModerationDashboardProps> = ({
  currentUserRole,
  subAdminScope,
  reports,
  posts,
  users,
  districts,
  onResolveReport,
  onDismissReport,
  onHidePost,
  onRestorePost,
  onRemovePost,
  onBanUser,
  auditLogs,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'posts' | 'users' | 'audit_logs'>('reports');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('pending');
  const [resolutionNotes, setResolutionNotes] = useState<{ [reportId: string]: string }>({});

  const isSuperAdmin = currentUserRole === 'super_admin';

  // Apply Sub-Admin Scoping (District or Category)
  const scopedReports = reports.filter(r => {
    if (isSuperAdmin) return true;
    if (subAdminScope?.districtId && r.targetDistrictId && r.targetDistrictId !== subAdminScope.districtId) {
      return false;
    }
    if (subAdminScope?.categoryId && r.targetCategoryId && r.targetCategoryId !== subAdminScope.categoryId) {
      return false;
    }
    return true;
  });

  const filteredReports = scopedReports.filter(r => {
    if (reportFilter === 'all') return true;
    return r.status === reportFilter;
  });

  const scopedPosts = posts.filter(p => {
    if (isSuperAdmin) return true;
    if (subAdminScope?.districtId && p.districtId !== subAdminScope.districtId) {
      return false;
    }
    if (subAdminScope?.categoryId && p.categoryId !== subAdminScope.categoryId) {
      return false;
    }
    return true;
  });

  const assignedDistrictObj = districts.find(d => d.id === subAdminScope?.districtId);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              কমিউনিটি মডারেশন ড্যাশবোর্ড
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {isSuperAdmin
              ? 'সার্বিক খুলনা বিভাগীয় সোশ্যাল কনটেন্ট ও ইউজার মডারেশন ব্যবস্থা।'
              : `সাব-এডমিন স্কোপ: ${assignedDistrictObj?.name || 'নির্দিষ্ট জেলা'} অঞ্চলের মডারেশন।`}
          </p>
        </div>

        {/* ROLE BADGE */}
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-300 flex items-center gap-1">
              <Shield size={13} /> সুপার এডমিন কন্ট্রোল
            </span>
          ) : (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-300 flex items-center gap-1">
              <Lock size={13} /> সাব-এডমিন ({assignedDistrictObj?.name || 'আঞ্চলিক'})
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold text-slate-600 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <AlertTriangle size={14} /> রিপোর্টসমূহ ({scopedReports.filter(r => r.status === 'pending').length})
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <FileText size={14} /> পোস্ট ব্যবস্থাপনা ({scopedPosts.length})
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Users size={14} /> ব্যবহারকারী নিয়ন্ত্রণ
          </button>
        )}

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
            activeTab === 'audit_logs'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Clock size={14} /> অডিট লগ ({auditLogs.length})
        </button>
      </div>

      {/* TAB CONTENT: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs">
              {(['all', 'pending', 'resolved'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setReportFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition cursor-pointer ${
                    reportFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'সকল' : filter === 'pending' ? 'অমীমাংসিত' : 'মীমাংসিত'}
                </button>
              ))}
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              কোনো রিপোর্ট পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map(report => (
                <div
                  key={report.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md font-bold text-[10px] uppercase">
                          {report.targetType} রিপোর্ট
                        </span>
                        <span className="font-bold text-slate-900">কারণ: {report.reason}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {report.status === 'pending' ? 'অমীমাংসিত' : 'সমাধানকৃত'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        রিপোর্টকারী: <b>{report.reportedByName}</b> ({report.reportedByEmail}) •{' '}
                        {new Date(report.createdAt).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                  </div>

                  {report.targetContentSnippet && (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 italic">
                      &quot;{report.targetContentSnippet}&quot;
                    </div>
                  )}

                  {report.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                      <input
                        type="text"
                        placeholder="সমাধানের মন্তব্য লিখুন..."
                        value={resolutionNotes[report.id] || ''}
                        onChange={e =>
                          setResolutionNotes({ ...resolutionNotes, [report.id]: e.target.value })
                        }
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDismissReport(report.id)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer transition"
                        >
                          খারিজ করুন
                        </button>
                        <button
                          onClick={() =>
                            onResolveReport(report.id, resolutionNotes[report.id] || 'পর্যালোচনা সম্পন্ন')
                          }
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition flex items-center gap-1"
                        >
                          <CheckCircle size={13} /> সমাধান সম্পন্ন
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: POSTS MANAGEMENT */}
      {activeTab === 'posts' && (
        <div className="space-y-3">
          {scopedPosts.map(post => (
            <div
              key={post.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{post.authorName}</span>
                  <span className="text-[10px] text-slate-400">
                    ({post.districtId || 'খুলনা'})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : post.status === 'hidden'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-slate-700 line-clamp-2 max-w-xl font-serif">{post.content}</p>
              </div>

              {/* POST ACTIONS */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {post.status === 'hidden' ? (
                  <button
                    onClick={() => onRestorePost(post.id)}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} /> পুনরুদ্ধার
                  </button>
                ) : (
                  <button
                    onClick={() => onHidePost(post.id, 'এডমিন কর্তৃক লুকানো')}
                    className="px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff size={13} /> লুকিয়ে রাখুন
                  </button>
                )}

                <button
                  onClick={() => onRemovePost(post.id, 'পলিসি লঙ্ঘনের কারণে অপসারিত')}
                  className="px-3 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} /> মুছে ফেলুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: USERS CONTROL (SUPER ADMIN ONLY) */}
      {activeTab === 'users' && isSuperAdmin && (
        <div className="space-y-3">
          {users.map(u => (
            <div
              key={u.uid}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getSafeAvatarUrl(u.avatar, u.name, u.uid)}
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.src = getSafeAvatarUrl('', u.name, u.uid);
                  }}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{u.name}</h4>
                  <p className="text-[11px] text-slate-500">{u.email} • {u.district || 'খুলনা'}</p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onBanUser(u.uid, 'কমিউনিটি নির্দেশিকা বারবার লঙ্ঘনের জন্য')}
                  className="px-3.5 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Ban size={13} /> অ্যাকাউন্ট ব্যান / স্থগিত
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              কোনো মডারেশন রেকর্ড সংরক্ষিত নেই।
            </div>
          ) : (
            auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">{log.actionType}</span>
                  <span className="text-slate-500 ml-2">দ্বারা: {log.adminEmail}</span>
                  <p className="text-[11px] text-slate-600">কারণ: {log.reason}</p>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleDateString('bn-BD')}{' '}
                  {new Date(log.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
