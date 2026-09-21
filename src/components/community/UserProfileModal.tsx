import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  MessageCircle,
  UserPlus,
  UserCheck,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Ban,
  FileText,
  Bookmark,
  Info,
  CheckCircle2
} from 'lucide-react';
import { PublicUserProfile, CommunityPost, VerifiedBadgeType } from '../../types/community';
import { District } from '../../dbData';

interface UserProfileModalProps {
  user: PublicUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  districts: District[];
  userPosts: CommunityPost[];
  currentUserId?: string;
  isFollowing: boolean;
  isBlocked: boolean;
  onToggleFollow: (targetUid: string) => void;
  onToggleBlock: (targetUid: string) => void;
  onStartMessage: (targetUid: string, name: string, email: string) => void;
  onReportUser: (targetUid: string, name: string) => void;
  onSelectPost?: (post: CommunityPost) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  districts,
  userPosts,
  currentUserId,
  isFollowing,
  isBlocked,
  onToggleFollow,
  onToggleBlock,
  onStartMessage,
  onReportUser
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'about'>('posts');

  if (!isOpen || !user) return null;

  const districtObj = districts.find(d => d.id === user.district);
  const isMe = currentUserId === user.uid;

  const renderBadge = (badge?: VerifiedBadgeType) => {
    if (!badge || badge === 'none') return null;
    switch (badge) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
            <ShieldCheck size={12} /> ভেরিফাইড এডমিন
          </span>
        );
      case 'govt_official':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-300">
            <Building2 size={12} /> সরকারি কর্মকর্তা
          </span>
        );
      case 'emergency_service':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-300">
            জরুরি সেবা প্রতিনিধি
          </span>
        );
      case 'verified_citizen':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" /> ভেরিফাইড নাগরিক
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* BANNER & HEADER */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition cursor-pointer backdrop-blur-xs"
          >
            <X size={18} />
          </button>
        </div>

        {/* PROFILE INFO & AVATAR */}
        <div className="px-5 pt-0 pb-4 relative border-b border-slate-100">
          <div className="flex justify-between items-end -mt-12 sm:-mt-14 mb-3">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                referrerPolicy="no-referrer"
              />
              {user.isOnline && (
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                  title="অনলাইন আছেন"
                />
              )}
            </div>

            {/* ACTION BUTTONS (FOLLOW, MESSAGE, BLOCK, REPORT) */}
            {!isMe && (
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  onClick={() => onToggleFollow(user.uid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={13} /> ফলোয়িং
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} /> ফলো করুন
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onStartMessage(user.uid, user.name, user.email);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={13} /> মেসেজ
                </button>

                <button
                  onClick={() => onReportUser(user.uid, user.name)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="ইউজার রিপোর্ট করুন"
                >
                  <AlertTriangle size={15} />
                </button>

                <button
                  onClick={() => onToggleBlock(user.uid)}
                  className={`p-2 rounded-xl transition ${
                    isBlocked
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  title={isBlocked ? 'আনব্লক করুন' : 'ব্লক করুন'}
                >
                  <Ban size={15} />
                </button>
              </div>
            )}
          </div>

          {/* NAME & BADGES */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                {user.name}
              </h2>
              {renderBadge(user.badge)}
            </div>

            {user.bio && (
              <p className="text-xs text-slate-600 leading-relaxed mb-2.5 max-w-md">
                {user.bio}
              </p>
            )}

            {/* METADATA (DISTRICT, JOIN DATE) */}
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              {districtObj && (
                <span className="flex items-center gap-1 text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <MapPin size={12} className="text-emerald-600" />
                  {districtObj.name} জেলা
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                যুক্ত হয়েছেন: {user.joinedDate || '২০২৪'}
              </span>
            </div>

            {/* STATS (POSTS, FOLLOWERS, FOLLOWING) */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm">{userPosts.length || user.postsCount || 0}</span>
                <span className="text-slate-500 ml-1">পোস্ট</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">{user.followersCount || (isFollowing ? 1 : 0)}</span>
                <span className="text-slate-500 ml-1">ফলোয়ার</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">{user.followingCount || 0}</span>
                <span className="text-slate-500 ml-1">ফলোয়িং</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS (POSTS, SAVED, ABOUT) */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition ${
              activeTab === 'posts'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText size={14} /> পোস্ট ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition ${
              activeTab === 'about'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Info size={14} /> পরিচিতি
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="p-4 overflow-y-auto max-h-80 space-y-3">
          {activeTab === 'posts' && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  এখনও কোনো পোস্ট করেননি।
                </div>
              ) : (
                <div className="space-y-2.5">
                  {userPosts.map(p => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition text-xs"
                    >
                      {p.title && <h4 className="font-bold text-slate-900 mb-1">{p.title}</h4>}
                      <p className="text-slate-600 line-clamp-2">{p.content}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{new Date(p.createdAt).toLocaleDateString('bn-BD')}</span>
                        <span>{p.likesCount} লাইক • {p.commentsCount} মন্তব্য</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold block text-slate-900 mb-1">কমিউনিটি পরিচিতি</span>
                <p>{user.bio || 'কোনো বায়ো যোগ করা হয়নি।'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold block text-slate-900 mb-1">যাচাইকরণ বিবরণ</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">স্ট্যাটাস:</span>
                  <span className="font-medium text-slate-800">
                    {user.badge === 'admin'
                      ? 'স্মার্ট খুলনা প্ল্যাটফর্ম এডমিনিস্ট্রেটর'
                      : user.badge === 'govt_official'
                      ? 'খুলনা বিভাগীয় সরকারি কর্মকর্তা'
                      : user.badge === 'emergency_service'
                      ? 'জরুরি সেবা প্রতিনিধি'
                      : 'সাধারণ নিবন্ধিত নাগরিক'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">জেলা:</span>
                  <span className="font-medium text-slate-800">
                    {districtObj ? `${districtObj.name} (${districtObj.nameEn})` : 'খুলনা'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
