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
  FileText,
  Edit3
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
    <div className="w-full min-h-full space-y-3 sm:space-y-4 pb-24 px-2 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden no-scrollbar scrollbar-none">
      {/* 1. TOP BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 sm:rounded-3xl p-4 sm:p-5 text-white shadow-sm relative overflow-hidden border-y sm:border border-emerald-800">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-lime-400/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="relative z-1">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-emerald-600/50 rounded-full text-[10px] sm:text-[11px] font-bold border border-emerald-400/30 flex items-center gap-1">
              <Sparkles size={11} className="text-lime-300" /> স্মার্ট খুলনা সোশ্যাল
            </span>

            <button
              onClick={onOpenCreatePost}
              className="bg-lime-400 hover:bg-lime-300 active:scale-95 text-emerald-950 text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Edit3 size={13} />
              <span>পোস্ট লিখুন</span>
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-extrabold font-serif leading-tight">
            খুলনা বিভাগীয় কমিউনিটি ফিড
          </h2>
          <p className="text-[11px] sm:text-xs text-emerald-100/90 max-w-lg leading-relaxed mt-1">
            ১০ জেলার নাগরিক সেবা, জরুরি আপডেট, স্থানীয় তথ্য ও অভিজ্ঞতা সরাসরি শেয়ার করুন।
          </p>
        </div>
      </div>

      {/* 2. DISTRICT COMMUNITY TABS (ALL 10 DISTRICTS) */}
      <div className="bg-white dark:bg-slate-900 sm:rounded-2xl p-2.5 sm:p-3 border-y sm:border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-serif">
            <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" /> 
            জেলা ভিত্তিক কমিউনিটি
          </span>
          {selectedFeedDistrict !== 'all' && (
            <button
              onClick={() => setSelectedFeedDistrict('all')}
              className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer font-bold"
            >
              সব জেলা দেখুন
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none no-scrollbar text-xs">
          <button
            onClick={() => setSelectedFeedDistrict('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer text-xs ${
              selectedFeedDistrict === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
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
                className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer text-xs ${
                  active
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
              >
                {d.name} কমিউনিটি
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FEED FILTER TABS & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="পোস্ট, হ্যাশট্যাগ (#) বা লেখক অনুসন্ধান..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8.5 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills & Category Dropdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none no-scrollbar text-xs">
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
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition shrink-0 cursor-pointer text-[11px] sm:text-xs ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">ক্যাটাগরি অনুযায়ী ফিল্টার:</span>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
              <Filter size={12} className="text-slate-400" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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
      </div>

      {/* 4. POSTS STREAM */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/90 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif">
                কোনো পোস্ট পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                এই ফিল্টারে কোনো তথ্য খুঁজে পাওয়া যায়নি। আপনার জেলার প্রথম পোস্টটি আপনিই তৈরি করুন!
              </p>
            </div>
            <button
              onClick={onOpenCreatePost}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>নতুন পোস্ট লিখুন</span>
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
                  className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
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
