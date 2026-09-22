import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Flame,
  Clock,
  Users,
  MapPin,
  Filter,
  Sparkles,
  Compass,
  Bookmark,
  FileText
} from 'lucide-react';
import { CommunityPost, PostComment } from '../../types/community';
import { District, Category } from '../../dbData';
import { PostCard } from './PostCard';

interface CommunityFeedProps {
  posts: CommunityPost[];
  districts: District[];
  categories: Category[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  currentUserId?: string;
  currentUserEmail?: string;
  currentUserName?: string;
  commentsMap: { [postId: string]: PostComment[] };
  likedPostIds: string[];
  savedPostIds: string[];
  followingUids: string[];
  onToggleFollow: (authorId: string) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onSharePost: (post: CommunityPost) => void;
  onReport: (type: 'post' | 'comment' | 'user', id: string, title: string) => void;
  onOpenCreatePost: () => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: CommunityPost) => void;
  onViewProfile: (authorId: string, authorName: string, authorEmail: string, authorAvatar?: string) => void;
  onStartMessage: (authorId: string, authorName: string, authorEmail: string, authorAvatar?: string) => void;
}

type FeedFilterType = 'all' | 'my_posts' | 'my_district' | 'following' | 'popular' | 'recent' | 'saved';

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  districts,
  categories,
  selectedDistrict,
  onSelectDistrict,
  currentUserId,
  currentUserEmail,
  currentUserName,
  commentsMap,
  likedPostIds,
  savedPostIds,
  followingUids,
  onToggleFollow,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onSharePost,
  onReport,
  onOpenCreatePost,
  onDeletePost,
  onEditPost,
  onViewProfile,
  onStartMessage
}) => {
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFeedDistrict, setSelectedFeedDistrict] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Hide drafts or removed posts from general feed (unless author)
      if (post.status === 'removed' || post.status === 'hidden') return false;
      if (post.status === 'draft' && post.authorId !== currentUserId) return false;

      // Filter by district
      if (selectedFeedDistrict !== 'all' && post.districtId !== selectedFeedDistrict) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'all' && post.categoryId !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeFilter === 'my_posts') {
        if (post.authorId !== currentUserId) return false;
      } else if (activeFilter === 'my_district') {
        if (post.districtId !== selectedDistrict) return false;
      } else if (activeFilter === 'following') {
        if (!followingUids.includes(post.authorId)) return false;
      } else if (activeFilter === 'saved') {
        if (!savedPostIds.includes(post.id)) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title?.toLowerCase().includes(q) || false;
        const inContent = post.content.toLowerCase().includes(q);
        const inAuthor = post.authorName.toLowerCase().includes(q);
        const inLocation = post.locationName?.toLowerCase().includes(q) || false;
        const inTags = post.hashtags?.some(tag => tag.toLowerCase().includes(q)) || false;
        return inTitle || inContent || inAuthor || inLocation || inTags;
      }

      return true;
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (activeFilter === 'popular') {
        const scoreA = (a.likesCount || 0) * 2 + (a.commentsCount || 0) * 3;
        const scoreB = (b.likesCount || 0) * 2 + (b.commentsCount || 0) * 3;
        return scoreB - scoreA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    posts,
    selectedFeedDistrict,
    selectedCategory,
    activeFilter,
    selectedDistrict,
    followingUids,
    savedPostIds,
    searchQuery,
    currentUserId
  ]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {/* TOP BANNER */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-4 sm:p-6 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-600/60 rounded-full text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1">
              <Sparkles size={12} /> স্মার্ট খুলনা সোশ্যাল
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif">
            খুলনা বিভাগীয় কমিউনিটি ফিড
          </h2>
          <p className="text-xs text-emerald-100 max-w-lg leading-relaxed mt-1">
            ১০ জেলার নাগরিক সেবা, জরুরি আপডেট, স্থানীয় তথ্য ও অভিজ্ঞতা সরাসরি শেয়ার করুন।
          </p>
        </div>
      </div>

      {/* DISTRICT COMMUNITY TABS (ALL 10 DISTRICTS) */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between px-2 pb-2 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-emerald-800">
            <MapPin size={14} className="text-emerald-600" /> জেলা ভিত্তিক কমিউনিটি
          </span>
          {selectedFeedDistrict !== 'all' && (
            <button
              onClick={() => setSelectedFeedDistrict('all')}
              className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
            >
              সব জেলা দেখুন
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedFeedDistrict('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex-shrink-0 cursor-pointer ${
              selectedFeedDistrict === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সব জেলা
          </button>
          {districts.map(d => {
            const active = selectedFeedDistrict === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedFeedDistrict(d.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex-shrink-0 cursor-pointer ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {d.name} কমিউনিটি
              </button>
            );
          })}
        </div>
      </div>

      {/* FEED FILTER TABS & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="পোস্ট, হ্যাশট্যাগ (#) বা লেখক অনুসন্ধান..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'সবার পোস্ট', icon: Compass },
              ...(currentUserId ? [{ id: 'my_posts', label: 'আমার পোস্ট', icon: FileText }] : []),
              { id: 'my_district', label: 'আমার জেলার পোস্ট', icon: MapPin },
              { id: 'following', label: 'আমি যাদের Follow করি', icon: Users },
              { id: 'popular', label: 'জনপ্রিয়', icon: Flame },
              { id: 'recent', label: 'সাম্প্রতিক', icon: Clock },
              { id: 'saved', label: 'সংরক্ষিত', icon: Bookmark }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as FeedFilterType)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-shrink-0">
            <Filter size={13} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* POSTS STREAM */}
      <div className="space-y-3.5">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              কোনো পোস্ট পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              এই ফিল্টারে কোনো তথ্য খুঁজে পাওয়া যায়নি। আপনার জেলার প্রথম পোস্টটি আপনিই তৈরি করুন!
            </p>
            <button
              onClick={onOpenCreatePost}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              + নতুন পোস্ট লিখুন
            </button>
          </div>
        ) : (
          <>
            {displayedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                districts={districts}
                currentUserId={currentUserId}
                currentUserEmail={currentUserEmail}
                currentUserName={currentUserName}
                comments={commentsMap[post.id] || []}
                isLiked={likedPostIds.includes(post.id)}
                isSaved={savedPostIds.includes(post.id)}
                isFollowing={followingUids.includes(post.authorId)}
                onToggleFollow={onToggleFollow}
                onSelectHashtag={(tag) => setSearchQuery(tag)}
                onToggleLike={onToggleLike}
                onToggleSave={onToggleSave}
                onAddComment={onAddComment}
                onAddReply={onAddReply}
                onDeleteComment={onDeleteComment}
                onShare={onSharePost}
                onReport={onReport}
                onDeletePost={onDeletePost}
                onEditPost={onEditPost}
                onViewProfile={onViewProfile}
                onStartMessage={onStartMessage}
              />
            ))}

            {/* LOAD MORE / PAGINATION BUTTON */}
            {filteredPosts.length > visibleCount && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setVisibleCount(prev => prev + 10)}
                  className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  আরও পোস্ট দেখুন ({filteredPosts.length - visibleCount}টি বাকি)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
