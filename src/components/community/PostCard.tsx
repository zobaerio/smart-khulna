import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Tag,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Send,
  Trash2,
  CornerDownRight,
  Edit2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';
import { CommunityPost, PostComment, VerifiedBadgeType } from '../../types/community';
import { District } from '../../dbData';

interface PostCardProps {
  post: CommunityPost;
  districts: District[];
  currentUserId?: string;
  currentUserEmail?: string;
  currentUserName?: string;
  comments: PostComment[];
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onShare: (post: CommunityPost) => void;
  onReport: (type: 'post' | 'comment' | 'user', id: string, title: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: CommunityPost) => void;
  onViewProfile: (authorId: string, authorName: string, authorEmail: string) => void;
  onStartMessage: (authorId: string, authorName: string, authorEmail: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  districts,
  currentUserId,
  comments,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onShare,
  onReport,
  onDeletePost,
  onEditPost,
  onViewProfile,
  onStartMessage,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const districtObj = districts.find(d => d.id === post.districtId);
  const isAuthor = Boolean(currentUserId && post.authorId === currentUserId);

  // Determine if post text exceeds 4 lines or ~220 characters
  const rawLines = (post.content || '').split('\n');
  const isLongContent = rawLines.length > 4 || (post.content && post.content.length > 220);

  const getTruncatedContent = () => {
    if (!isLongContent || isExpanded) return post.content;
    if (rawLines.length > 4) {
      return rawLines.slice(0, 4).join('\n');
    }
    return post.content.slice(0, 200) + '...';
  };

  // Lightbox keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeImageIndex === null || !post.images || post.images.length === 0) return;
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev !== null ? (prev + 1) % post.images.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev !== null ? (prev - 1 + post.images.length) % post.images.length : null));
      }
    },
    [activeImageIndex, post.images]
  );

  useEffect(() => {
    if (activeImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeImageIndex, handleKeyDown]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleReplySubmit = (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onAddReply(post.id, commentId, replyInput.trim());
    setReplyInput('');
    setReplyingToCommentId(null);
  };

  const renderBadge = (badge?: VerifiedBadgeType) => {
    if (!badge || badge === 'none') return null;
    switch (badge) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
            <ShieldCheck size={10} /> এডমিন
          </span>
        );
      case 'govt_official':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full border border-blue-300">
            <Building2 size={10} /> সরকারি
          </span>
        );
      case 'emergency_service':
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full border border-rose-300">
            জরুরি সেবা
          </span>
        );
      case 'verified_citizen':
        return (
          <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[11px] font-bold" title="যাচাইকৃত নাগরিক">
            <CheckCircle2 size={13} className="fill-emerald-100 text-emerald-600" />
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMin < 2) return 'এইমাত্র';
      if (diffMin < 60) return `${diffMin} মিনিট আগে`;
      if (diffHrs < 24) return `${diffHrs} ঘণ্টা আগে`;
      if (diffDays === 1) return 'গতকাল';
      return `${diffDays} দিন আগে`;
    } catch {
      return 'সম্প্রতি';
    }
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-sm transition duration-200 overflow-hidden">
      {/* CARD HEADER */}
      <div className="p-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewProfile(post.authorId, post.authorName, post.authorEmail)}
            className="relative flex-shrink-0 cursor-pointer group"
          >
            <img
              src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'}
              alt={post.authorName}
              className="w-11 h-11 rounded-full object-cover border border-emerald-100 group-hover:ring-2 ring-emerald-500 transition"
              referrerPolicy="no-referrer"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onViewProfile(post.authorId, post.authorName, post.authorEmail)}
                className="text-sm font-bold text-slate-900 hover:text-emerald-700 cursor-pointer font-serif"
              >
                {post.authorName}
              </button>
              {renderBadge(post.authorBadge)}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
              <span>{formatTimestamp(post.createdAt)}</span>
              {districtObj && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
                    <MapPin size={10} />
                    {districtObj.name} {post.upazilaId ? `(${post.upazilaId})` : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MORE OPTIONS MENU */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 text-xs text-slate-700 animate-in fade-in duration-150">
              {isAuthor ? (
                <>
                  {onEditPost && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEditPost(post);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Edit2 size={13} /> পোস্ট সম্পাদনা
                    </button>
                  )}
                  {onDeletePost && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDeletePost(post.id);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Trash2 size={13} /> পোস্ট মুছুন
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onStartMessage(post.authorId, post.authorName, post.authorEmail);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <MessageCircle size={13} className="text-emerald-600" /> সরাসরি মেসেজ পাঠান
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onViewProfile(post.authorId, post.authorName, post.authorEmail);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    প্রোফাইল দেখুন
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onReport('post', post.id, post.title || post.content.slice(0, 30));
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100"
                  >
                    <AlertTriangle size={13} /> পোস্ট রিপোর্ট করুন
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* POST TITLE & CONTENT (WITH SEE MORE / SEE LESS TOGGLE) */}
      <div className="px-4 pb-3">
        {post.title && (
          <h3 className="font-bold text-slate-900 text-sm font-serif mb-1 leading-snug">
            {post.title}
          </h3>
        )}
        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
          {getTruncatedContent()}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-block ml-1.5 text-emerald-700 font-bold hover:text-emerald-800 hover:underline cursor-pointer focus:outline-none"
            >
              {isExpanded ? '...কম দেখুন (See less)' : '...আরও দেখুন (See more)'}
            </button>
          )}
        </div>

        {/* HASHTAGS & LOCATION */}
        {(post.hashtags?.length || post.locationName) && (
          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px]">
            {post.locationName && (
              <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
                <MapPin size={10} className="text-emerald-600" />
                {post.locationName}
              </span>
            )}
            {post.hashtags?.map((tag, i) => (
              <span key={i} className="text-emerald-700 font-medium hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* POST IMAGES (GALLERY GRID & SCROLLABLE / SWIPEABLE CAROUSEL) */}
      {post.images && post.images.length > 0 && (
        <div className="border-t border-b border-slate-100 bg-slate-900/5 relative select-none">
          {/* If 1 Image */}
          {post.images.length === 1 && (
            <div
              className="max-h-[420px] overflow-hidden cursor-pointer bg-slate-900/5 flex items-center justify-center relative group"
              onClick={() => setActiveImageIndex(0)}
            >
              <img
                src={post.images[0].url}
                alt={post.images[0].caption || 'Post image'}
                className="w-full object-cover max-h-[420px] group-hover:scale-[1.01] transition duration-300"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition backdrop-blur-xs">
                <Maximize2 size={14} />
              </div>
            </div>
          )}

          {/* If 2 Images */}
          {post.images.length === 2 && (
            <div className="grid grid-cols-2 gap-1 max-h-80 overflow-hidden">
              {post.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative h-64 cursor-pointer group overflow-hidden bg-slate-100"
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img
                    src={img.url}
                    alt={img.caption || 'Post image'}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition backdrop-blur-xs">
                    <Maximize2 size={12} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* If 3 or more Images: Carousel / Gallery with Snap Scroll and Indicators */}
          {post.images.length >= 3 && (
            <div className="relative">
              {/* Horizontal Scroll / Carousel Container */}
              <div className="relative overflow-hidden group">
                <div
                  className="flex transition-transform duration-300 ease-out h-72 sm:h-80"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {post.images.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="min-w-full h-full flex-shrink-0 cursor-pointer relative bg-slate-900/10"
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Post image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {img.caption && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Left / Right Carousel Controls */}
                {carouselIndex > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCarouselIndex(prev => Math.max(0, prev - 1));
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer backdrop-blur-xs shadow-md z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                {carouselIndex < post.images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCarouselIndex(prev => Math.min(post.images.length - 1, prev + 1));
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer backdrop-blur-xs shadow-md z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}

                {/* Image Count Pill Badge */}
                <div className="absolute top-3 right-3 bg-black/65 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs z-10">
                  {carouselIndex + 1} / {post.images.length}
                </div>

                {/* Bottom Dots Indicator */}
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10">
                  {post.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarouselIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                        carouselIndex === idx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL LIGHTBOX MODAL WITH PREV/NEXT/COUNTER */}
      {activeImageIndex !== null && post.images && post.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Lightbox Header */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white z-20"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                ছবি {activeImageIndex + 1} / {post.images.length}
              </span>
              {post.images[activeImageIndex].caption && (
                <span className="text-xs text-slate-300 max-w-xs sm:max-w-md truncate">
                  {post.images[activeImageIndex].caption}
                </span>
              )}
            </div>

            <button
              onClick={() => setActiveImageIndex(null)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              title="বন্ধ করুন (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Expanded Image & Navigation Arrows */}
          <div
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2"
            onClick={e => e.stopPropagation()}
          >
            {post.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev !== null ? (prev - 1 + post.images.length) % post.images.length : 0));
                }}
                className="absolute left-2 sm:left-4 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition cursor-pointer backdrop-blur-xs border border-white/10 z-20"
                title="পূর্ববর্তী ছবি"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img
              src={post.images[activeImageIndex].url}
              alt={post.images[activeImageIndex].caption || 'Expanded view'}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl transition-all"
            />

            {post.images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev !== null ? (prev + 1) % post.images.length : 0));
                }}
                className="absolute right-2 sm:right-4 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition cursor-pointer backdrop-blur-xs border border-white/10 z-20"
                title="পরবর্তী ছবি"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Lightbox Thumbnail Strip */}
          {post.images.length > 1 && (
            <div
              className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2 z-20"
              onClick={e => e.stopPropagation()}
            >
              {post.images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition border-2 cursor-pointer ${
                    activeImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTION BAR (LIKE, COMMENT, SHARE, SAVE) */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like */}
          <button
            onClick={() => onToggleLike(post.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition cursor-pointer font-medium ${
              isLiked
                ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
            <span>{post.likesCount || 0}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer font-medium"
          >
            <MessageCircle size={16} />
            <span>{comments.length || post.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => onShare(post)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer font-medium"
          >
            <Share2 size={16} />
            <span>{post.sharesCount || 0}</span>
          </button>
        </div>

        {/* Bookmark / Save */}
        <button
          onClick={() => onToggleSave(post.id)}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            isSaved
              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={isSaved ? 'সংরক্ষিত' : 'সেভ করুন'}
        >
          <Bookmark size={17} className={isSaved ? 'fill-emerald-600' : ''} />
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="একটি মন্তব্য লিখুন..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Send size={13} />
            </button>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-2">
              এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              {comments.map(c => (
                <div key={c.id} className="space-y-1.5">
                  <div className="bg-white rounded-xl p-3 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewProfile(c.authorId, c.authorName, c.authorEmail)}
                          className="font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
                        >
                          {c.authorName}
                        </button>
                        {renderBadge(c.authorBadge)}
                        <span className="text-[10px] text-slate-400">• {formatTimestamp(c.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {currentUserId === c.authorId && (
                          <button
                            onClick={() => onDeleteComment(post.id, c.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="মুছুন"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => onReport('comment', c.id, c.content)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded"
                          title="রিপোর্ট করুন"
                        >
                          <AlertTriangle size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.content}</p>

                    {/* Reply toggle */}
                    <div className="mt-2 pt-1 flex items-center gap-3 text-[11px] text-slate-500">
                      <button
                        onClick={() =>
                          setReplyingToCommentId(replyingToCommentId === c.id ? null : c.id)
                        }
                        className="text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CornerDownRight size={11} /> উত্তর দিন
                      </button>
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="pl-6 space-y-1.5">
                      {c.replies.map(rep => (
                        <div
                          key={rep.id}
                          className="bg-emerald-50/40 rounded-xl p-2.5 border border-emerald-100 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{rep.authorName}</span>
                              {renderBadge(rep.authorBadge)}
                              <span className="text-[10px] text-slate-400">• {formatTimestamp(rep.createdAt)}</span>
                            </div>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{rep.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Reply Form */}
                  {replyingToCommentId === c.id && (
                    <form onSubmit={e => handleReplySubmit(c.id, e)} className="pl-6 flex gap-2 pt-1">
                      <input
                        type="text"
                        value={replyInput}
                        onChange={e => setReplyInput(e.target.value)}
                        placeholder={`${c.authorName}-কে উত্তর দিন...`}
                        className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!replyInput.trim()}
                        className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40"
                      >
                        পাঠান
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

