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
import { getSafeAvatarUrl } from '../../lib/avatarHelper';

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
  onStartMessage: (targetUid: string, name: string, email: string, avatar?: string) => void;
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

  const handleToggleFollow = () => {
    if (user) {
      onToggleFollow(user.uid);
    }
  };

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
                src={getSafeAvatarUrl(user.avatar, user.name, user.uid)}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                onError={(e) => {
                  e.currentTarget.src = getSafeAvatarUrl('', user.name, user.uid);
                }}
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
                  onClick={handleToggleFollow}
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
                    onStartMessage(user.uid, user.name, user.email, user.avatar);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={13} /> মেসেজ
                </button>

                <button
                  onClick={() => onReportUser(user.uid, user.name)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="ইউজার রিপোর্ট করুন"
                >
                  <AlertTriangle size={15} />
                </button>

                <button
                  onClick={() => onToggleBlock(user.uid)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
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

          {/* NAME, BADGES & FOLLOW/UNFOLLOW BUTTON */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                {user.name}
              </h2>
              {renderBadge(user.badge)}

              {/* Follow / Unfollow button next to username */}
              {!isMe && (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 border border-slate-300'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600'
                  }`}
                  title={isFollowing ? 'আনফলো করুন' : 'ফলো করুন'}
                  aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={12} className="text-emerald-700" />
                      <span>আনফলো</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={12} />
                      <span>ফলো</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Profession & Blood Group tags */}
            {(user.profession || user.bloodGroup) && (
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {user.profession && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {user.profession}
                  </span>
                )}
                {user.bloodGroup && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    🩸 রক্তের গ্রুপ: {user.bloodGroup}
                  </span>
                )}
              </div>
            )}

            {user.bio && (
              <p className="text-xs text-slate-600 leading-relaxed mb-2.5 max-w-md">
                {user.bio}
              </p>
            )}

            {/* METADATA (DISTRICT, JOIN DATE) */}
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              {(districtObj || user.district) && (
                <span className="flex items-center gap-1 text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <MapPin size={12} className="text-emerald-600" />
                  {districtObj?.name || user.district} {user.upazila ? `(${user.upazila})` : 'জেলা'}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                যুক্ত হয়েছেন: {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short' }) : '২০২৪'}
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
                      className="profile-post-card p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition text-xs"
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
                <span className="font-bold block text-slate-900 mb-1">কমিউনিটি পরিচিতি / Bio</span>
                <p className="whitespace-pre-line">{user.bio || 'কোনো বায়ো যোগ করা হয়নি।'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold block text-slate-900 mb-1">ব্যক্তিগত ও যোগাযোগ তথ্য</span>
                {user.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">মোবাইল ফোন:</span>
                    <a href={`tel:${user.phone}`} className="font-bold text-emerald-700 hover:underline">
                      {user.phone}
                    </a>
                  </div>
                )}
                {user.profession && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">পেশা / পদবী:</span>
                    <span className="font-medium text-slate-900">{user.profession}</span>
                  </div>
                )}
                {user.bloodGroup && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">রক্তের গ্রুপ:</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {user.bloodGroup}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">জেলা ও অবস্থান:</span>
                  <span className="font-medium text-slate-800">
                    {districtObj ? `${districtObj.name} (${districtObj.nameEn})` : user.district || 'খুলনা'}
                    {user.upazila ? ` • ${user.upazila}` : ''}
                  </span>
                </div>
                {user.address && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 shrink-0">ঠিকানা:</span>
                    <span className="font-medium text-slate-800 text-right">{user.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links if present */}
              {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold block text-slate-900 mb-1">সোশ্যাল মিডিয়া ও লিংক</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {user.socialLinks.facebook && (
                      <a
                        href={user.socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] border border-blue-200 transition"
                      >
                        Facebook
                      </a>
                    )}
                    {user.socialLinks.twitter && (
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] border border-slate-300 transition"
                      >
                        Twitter/X
                      </a>
                    )}
                    {user.socialLinks.instagram && (
                      <a
                        href={user.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg font-bold text-[11px] border border-pink-200 transition"
                      >
                        Instagram
                      </a>
                    )}
                    {user.socialLinks.linkedin && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg font-bold text-[11px] border border-sky-200 transition"
                      >
                        LinkedIn
                      </a>
                    )}
                    {user.socialLinks.website && (
                      <a
                        href={user.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-200 transition"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
