import React, { useState } from 'react';
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
  UserPlus,
  UserCheck,
  Paperclip,
  Download,
  PlusCircle,
  MinusCircle,
  XCircle,
  Bell,
  Copy,
  Check,
  ChevronRight,
  X,
  User,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CommunityPost, PostComment, VerifiedBadgeType } from '../../types/community';
import { District } from '../../dbData';
import { PostImageGrid } from './PostImageGrid';
import { getSafeAvatarUrl } from '../../lib/avatarHelper';
import { downloadImageSafely } from '../../lib/downloadHelper';

interface PostCardProps {
  post: CommunityPost;
  districts: District[];
  currentUserId?: string;
  currentUserEmail?: string;
  currentUserName?: string;
  comments: PostComment[];
  isLiked: boolean;
  isSaved: boolean;
  isFollowing?: boolean;
  onToggleFollow?: (authorId: string) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddReply: (postId: string, commentId: string, text: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onShare: (post: CommunityPost) => void;
  onReport: (type: 'post' | 'comment' | 'user', id: string, title: string) => void;
  onDeletePost?: (postId: string) => void;
  onEditPost?: (post: CommunityPost) => void;
  onViewProfile: (authorId: string, authorName: string, authorEmail: string, authorAvatar?: string) => void;
  onStartMessage: (authorId: string, authorName: string, authorEmail: string, authorAvatar?: string) => void;
  onSelectHashtag?: (tag: string) => void;
  onPostClick?: (post: CommunityPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  districts,
  currentUserId,
  comments,
  isLiked,
  isSaved,
  isFollowing = false,
  onToggleFollow,
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
  onSelectHashtag,
  onPostClick
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInterested, setIsInterested] = useState<boolean | null>(null);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);
  const [isPostHidden, setIsPostHidden] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Convert numbers to Bengali digits
  const toBn = (n: number | string) => {
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().replace(/\d/g, d => bnNums[parseInt(d, 10)]);
  };

  // Collect all images attached to this post (from images array and image file attachments)
  const allPostImages: { url: string; caption?: string; name: string }[] = [];
  if (Array.isArray(post.images) && post.images.length > 0) {
    post.images.forEach((img, idx) => {
      if (img && img.url) {
        allPostImages.push({
          url: img.url,
          caption: img.caption,
          name: img.caption
            ? `${img.caption.replace(/[^a-zA-Z0-9\u0980-\u09FF]/g, '_').slice(0, 30)}.jpg`
            : `smartkhulna-post-${post.id.slice(0, 6)}-photo-${idx + 1}.jpg`
        });
      }
    });
  }

  if (post.fileUrl) {
    const isImageFile =
      post.fileType?.toLowerCase().includes('image') ||
      Boolean(post.fileUrl.match(/\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i));
    if (isImageFile && !allPostImages.some(item => item.url === post.fileUrl)) {
      allPostImages.push({
        url: post.fileUrl,
        caption: post.fileName,
        name: post.fileName || `smartkhulna-post-${post.id.slice(0, 6)}-attachment.jpg`
      });
    }
  }

  const hasImages = allPostImages.length > 0;

  const handleDownloadAllImages = async () => {
    if (allPostImages.length === 0) return;
    setIsDownloading(true);
    setShowMenu(false);

    if (allPostImages.length === 1) {
      triggerToast('ছবি ডাউনলোড হচ্ছে...');
      try {
        await downloadImageSafely(allPostImages[0].url, allPostImages[0].name);
        triggerToast('ছবি সফলভাবে ডাউনলোড হয়েছে!');
      } catch {
        triggerToast('ছবি ডাউনলোড সম্পন্ন হয়েছে');
      } finally {
        setIsDownloading(false);
      }
    } else {
      triggerToast(`${toBn(allPostImages.length)}টি ছবি ডাউনলোড শুরু হয়েছে...`);
      try {
        for (let i = 0; i < allPostImages.length; i++) {
          await downloadImageSafely(allPostImages[i].url, allPostImages[i].name);
          if (i < allPostImages.length - 1) {
            await new Promise(r => setTimeout(r, 600));
          }
        }
        triggerToast(`সবকটি (${toBn(allPostImages.length)}টি) ছবি ডাউনলোড সম্পন্ন হয়েছে!`);
      } catch {
        triggerToast('ছবি ডাউনলোড সম্পন্ন হয়েছে');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleDownloadSingleImage = async (url: string, index: number, customName?: string) => {
    setIsDownloading(true);
    setShowMenu(false);
    triggerToast(`ছবি #${toBn(index + 1)} ডাউনলোড হচ্ছে...`);
    try {
      const filename = customName || `smartkhulna-post-${post.id.slice(0, 6)}-${index + 1}.jpg`;
      await downloadImageSafely(url, filename);
      triggerToast(`ছবি #${toBn(index + 1)} ডাউনলোড সম্পন্ন হয়েছে!`);
    } catch {
      triggerToast('ছবি ডাউনলোড সম্পন্ন হয়েছে');
    } finally {
      setIsDownloading(false);
    }
  };

  const districtObj = districts.find(d => d.id === post.districtId);
  const isAuthor = Boolean(currentUserId && post.authorId === currentUserId);

  // Determine if post text exceeds 4 lines or ~220 characters
  const rawLines = (post.content || '').split('\n');
  const isLongContent = rawLines.length > 4 || (post.content && post.content.length > 220);

  const renderFormattedText = (text: string) => {
    // Split by hashtags (#\S+) and mentions (@\S+)
    const parts = text.split(/([#@][\p{L}\p{N}_-]+)/gu);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSelectHashtag?.(part);
            }}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5"
            title={`${part} হ্যাশট্যাগের পোস্ট দেখুন`}
          >
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        const username = part.slice(1);
        return (
          <span
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile('', username, '');
            }}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5"
            title={`${part} এর প্রোফাইল দেখুন`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const getTruncatedContent = () => {
    const textToShow = (!isLongContent || isExpanded)
      ? post.content
      : (rawLines.length > 4 ? rawLines.slice(0, 4).join('\n') : post.content.slice(0, 200) + '...');
    return renderFormattedText(textToShow);
  };

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

  if (isPostHidden) {
    return (
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:rounded-2xl p-4 text-center my-2 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between w-full">
        <span>পোস্টটি আপনার ফিড থেকে হাইড করা হয়েছে।</span>
        <button onClick={() => setIsPostHidden(false)} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">
          আনহাইড করুন
        </button>
      </div>
    );
  }

  return (
    <article className="bg-white dark:bg-slate-950 sm:rounded-2xl border-y sm:border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-sm transition duration-200 overflow-hidden text-slate-900 dark:text-slate-100 w-full">
      {/* CARD HEADER */}
      <div className="p-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onViewProfile(post.authorId, post.authorName, post.authorEmail, post.authorAvatar)}
            className="relative flex-shrink-0 cursor-pointer group"
            title={`${post.authorName} এর প্রোফাইল দেখুন`}
          >
            <img
              src={getSafeAvatarUrl(post.authorAvatar, post.authorName, post.authorId)}
              alt={post.authorName}
              className="w-11 h-11 rounded-full object-cover border border-emerald-100 dark:border-slate-700 group-hover:ring-2 ring-emerald-500 transition bg-emerald-50 dark:bg-slate-800"
              onError={(e) => {
                e.currentTarget.src = getSafeAvatarUrl('', post.authorName, post.authorId);
              }}
              referrerPolicy="no-referrer"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onViewProfile(post.authorId, post.authorName, post.authorEmail, post.authorAvatar)}
                className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer font-serif text-left"
                title={`${post.authorName} এর প্রোফাইল দেখুন`}
              >
                {post.authorName}
              </button>
              {renderBadge(post.authorBadge)}

              {/* FOLLOW BUTTON RIGHT NEXT TO AUTHOR NAME */}
              {currentUserId && post.authorId && currentUserId !== post.authorId && onToggleFollow && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFollow(post.authorId);
                  }}
                  className={`ml-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer select-none ${
                    isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700'
                  }`}
                  title={isFollowing ? 'আনফলো করুন' : 'ফলো করুন'}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={11} className="text-slate-500 dark:text-slate-400" />
                      <span>ফলোয়িং</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>ফলো</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span>{formatTimestamp(post.createdAt)}</span>
              {(post.isEdited || post.editedAt) && (
                <span className="text-[10px] text-slate-400 italic">(সম্পাদিত)</span>
              )}
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

        {/* MORE OPTIONS MENU BUTTON */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* FACEBOOK-STYLE BOTTOM SHEET MENU MODAL */}
      <AnimatePresence>
        {showMenu && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setShowMenu(false)}
            />

            {/* Bottom Sheet Modal Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-slate-100 dark:bg-slate-950 w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl relative z-10 p-3 sm:p-4 max-h-[85vh] overflow-y-auto space-y-3"
            >
              {/* Top Drag Handle Bar */}
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-1 cursor-grab" onClick={() => setShowMenu(false)} />

              {/* Group 1: Feed Preference (Interested / Not interested) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsInterested(true);
                    triggerToast('ধন্যবাদ! আপনার ফিডে এই ধরনের পোস্ট বেশি দেখানো হবে।');
                    setShowMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition cursor-pointer group ${
                    isInterested === true ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 flex items-center justify-center shrink-0 transition">
                    <PlusCircle size={20} className="text-slate-900 dark:text-slate-100 group-hover:text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>Interested / আগ্রহী</span>
                      {isInterested === true && <Check size={14} className="text-emerald-600" />}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      More of your posts will be like this. (এই ধরনের পোস্ট আরও বেশি দেখাবে)
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsInterested(false);
                    triggerToast('আপনার ফিডে এই ধরনের পোস্ট কম দেখানো হবে।');
                    setShowMenu(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition cursor-pointer group ${
                    isInterested === false ? 'bg-rose-50 dark:bg-rose-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 flex items-center justify-center shrink-0 transition">
                    <MinusCircle size={20} className="text-slate-900 dark:text-slate-100 group-hover:text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>Not interested / আগ্রহী নই</span>
                      {isInterested === false && <Check size={14} className="text-rose-600" />}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Less of your posts will be like this. (এই ধরনের পোস্ট কম দেখাবে)
                    </p>
                  </div>
                </button>
              </div>

              {/* Group 2: Action Menu List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                {/* Download Photo(s) Option - shown ONLY if post has photo(s) */}
                {hasImages && (
                  <div className="p-1 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 mb-1">
                    <button
                      type="button"
                      onClick={handleDownloadAllImages}
                      disabled={isDownloading}
                      className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Download size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                            <span>
                              {allPostImages.length > 1
                                ? `ছবি ডাউনলোড করুন (${toBn(allPostImages.length)}টি)`
                                : 'ছবি ডাউনলোড করুন'}
                            </span>
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-200/70 dark:bg-emerald-800/60 px-2 py-0.5 rounded-full shrink-0">
                            {allPostImages.length > 1 ? `${toBn(allPostImages.length)}টি ছবি` : 'HD ছবি'}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/80 leading-tight mt-0.5">
                          {allPostImages.length > 1
                            ? 'পোস্টের সবকটি ছবি একসাথে গ্যালারিতে সেভ করুন'
                            : 'পোস্টের স্পষ্ট ছবিটি সরাসরি আপনার ডিভাইসে সেভ করুন'}
                        </p>
                      </div>
                    </button>

                    {/* If multiple images, also allow selecting individual photos to download */}
                    {allPostImages.length > 1 && (
                      <div className="mt-1.5 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-800/40 px-1">
                        <p className="text-[10px] font-medium text-emerald-800/80 dark:text-emerald-300/80 mb-1">
                          বা নির্দিষ্ট ছবি ডাউনলোড করুন:
                        </p>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                          {allPostImages.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSingleImage(img.url, idx, img.name);
                              }}
                              className="relative group shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-emerald-300/80 dark:border-emerald-700 hover:border-emerald-600 transition cursor-pointer shadow-2xs"
                              title={`ছবি ${toBn(idx + 1)} ডাউনলোড করুন`}
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                                <Download size={14} />
                              </div>
                              <span className="absolute bottom-0 right-0 bg-slate-900/80 text-[8px] text-white px-1 py-0.5 rounded-tl font-mono">
                                #{toBn(idx + 1)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Save post */}
                <button
                  type="button"
                  onClick={() => {
                    onToggleSave(post.id);
                    triggerToast(isSaved ? 'পোস্টটি সেভ লিস্ট থেকে সরানো হয়েছে' : 'পোস্টটি সেভ করা হয়েছে');
                    setShowMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 flex items-center justify-center shrink-0 transition">
                    <Bookmark size={18} className={isSaved ? "fill-emerald-600 text-emerald-600" : "text-slate-800 dark:text-slate-200"} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {isSaved ? 'Unsave post (সেভ বাতিল করুন)' : 'Save post (পোস্ট সেভ করুন)'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {isSaved ? 'Remove this from your saved items.' : 'Add this to your saved items.'}
                    </p>
                  </div>
                </button>

                {/* Share */}
                <button
                  type="button"
                  onClick={() => {
                    onShare(post);
                    setShowMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 flex items-center justify-center shrink-0 transition">
                    <Share2 size={18} className="text-slate-800 dark:text-slate-200 group-hover:text-blue-600" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Share / শেয়ার করুন</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        Share with friends or copy link
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </button>

                {/* Hide post */}
                {!isAuthor && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPostHidden(true);
                      triggerToast('পোস্টটি আপনার ফিড থেকে হাইড করা হয়েছে');
                      setShowMenu(false);
                    }}
                    className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 flex items-center justify-center shrink-0 transition">
                      <XCircle size={18} className="text-slate-800 dark:text-slate-200 group-hover:text-amber-600" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">I don't want to see this / পোস্টটি লুকাতে চাই</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          See fewer posts like this
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </button>
                )}

                {/* Report post */}
                {!isAuthor && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onReport('post', post.id, post.title || post.content.slice(0, 30));
                    }}
                    className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0 transition">
                      <AlertTriangle size={18} className="text-rose-600" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">Report post / রিপোর্ট করুন</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          We won't let {post.authorName} know who reported this.
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </button>
                )}

                {/* Turn on notifications for this post */}
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationsOn(!isNotificationsOn);
                    triggerToast(!isNotificationsOn ? 'পোস্টের নোটিফিকেশন চালু করা হয়েছে' : 'নোটিফিকেশন বন্ধ করা হয়েছে');
                    setShowMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 flex items-center justify-center shrink-0 transition">
                    <Bell size={18} className={isNotificationsOn ? "fill-amber-500 text-amber-500" : "text-slate-800 dark:text-slate-200"} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {isNotificationsOn ? 'Turn off notifications' : 'Turn on notifications for this post'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Get notified when someone interacts with this post.
                    </p>
                  </div>
                </button>

                {/* Copy link */}
                <button
                  type="button"
                  onClick={() => {
                    const postUrl = window.location.origin + '?post=' + post.id;
                    navigator.clipboard.writeText(postUrl);
                    triggerToast('পোস্টের সরাসরি লিংক কপি করা হয়েছে!');
                    setShowMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 flex items-center justify-center shrink-0 transition">
                    <Copy size={18} className="text-slate-800 dark:text-slate-200 group-hover:text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Copy link / লিংক কপি করুন</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Copy direct link to this post
                    </p>
                  </div>
                </button>
              </div>

              {/* Group 3: Author Actions (Edit & Delete) */}
              {isAuthor && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                  {onEditPost && ((Date.now() - new Date(post.createdAt).getTime()) <= 2 * 60 * 60 * 1000) && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEditPost(post);
                      }}
                      className="w-full p-2.5 rounded-xl text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Edit2 size={18} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-bold">Edit post / পোস্ট সম্পাদনা করুন</span>
                    </button>
                  )}

                  {onDeletePost && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDeletePost(post.id);
                      }}
                      className="w-full p-2.5 rounded-xl text-left flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 transition cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                        <Trash2 size={18} className="text-rose-600" />
                      </div>
                      <span className="text-xs font-bold">Delete post / পোস্ট মুছে ফেলুন</span>
                    </button>
                  )}
                </div>
              )}

              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="w-full py-3 bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-extrabold transition text-center shadow-xs cursor-pointer border border-slate-200/80 dark:border-slate-800"
              >
                বাতিল করুন
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Banner Notification */}
      {toastMsg && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl backdrop-blur-md border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 whitespace-nowrap pointer-events-none">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* POST TITLE & CONTENT (WITH SEE MORE / SEE LESS TOGGLE) */}
      <div 
        className="px-4 pb-3 cursor-pointer"
        onClick={() => {
          if (onPostClick) onPostClick(post);
        }}
      >
        {post.title && (
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-serif mb-1 leading-snug">
            {post.title}
          </h3>
        )}
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {getTruncatedContent()}
          {isLongContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
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
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-800">
                <MapPin size={10} className="text-emerald-600" />
                {post.locationName}
              </span>
            )}
            {post.hashtags?.map((tag, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHashtag?.(tag);
                }}
                className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline cursor-pointer bg-emerald-50/70 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60"
                title={`${tag} হ্যাশট্যাগ দিয়ে পোস্ট খুঁজুন`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* POST IMAGES (RESPONSIVE MULTI-IMAGE GRID WITH LIGHTBOX & SWIPE) */}
      {post.images && post.images.length > 0 && (
        <PostImageGrid
          images={post.images}
          postTitle={post.title}
          authorName={post.authorName}
          className="border-t border-b border-slate-100"
        />
      )}

      {/* ATTACHED FILE CARD */}
      {post.fileUrl && (
        <div className="mx-4 my-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="p-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-xl shrink-0">
              <Paperclip size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-serif">
                {post.fileName || 'Attached Document'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                {post.fileType || 'FILE'} {post.fileSize ? `• ${post.fileSize}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={post.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>View</span>
            </a>
            <a
              href={post.fileUrl}
              download={post.fileName || 'download'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
          </div>
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
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/35 p-4 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="একটি মন্তব্য লিখুন..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
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
                  <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewProfile(c.authorId, c.authorName, c.authorEmail, c.authorAvatar)}
                          className="shrink-0 cursor-pointer group"
                          title={`${c.authorName} এর প্রোফাইল দেখুন`}
                        >
                          <img
                            src={getSafeAvatarUrl(c.authorAvatar, c.authorName, c.authorId)}
                            alt={c.authorName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:ring-1 ring-emerald-500 bg-emerald-50 dark:bg-slate-800"
                            onError={(e) => {
                              e.currentTarget.src = getSafeAvatarUrl('', c.authorName, c.authorId);
                            }}
                            referrerPolicy="no-referrer"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewProfile(c.authorId, c.authorName, c.authorEmail, c.authorAvatar)}
                          className="font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer text-left"
                          title={`${c.authorName} এর প্রোফাইল দেখুন`}
                        >
                          {c.authorName}
                        </button>
                        {renderBadge(c.authorBadge)}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">• {formatTimestamp(c.createdAt)}</span>
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
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.content}</p>

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
                          className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/40 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onViewProfile(rep.authorId, rep.authorName, rep.authorEmail, rep.authorAvatar)}
                                className="shrink-0 cursor-pointer"
                                title={`${rep.authorName} এর প্রোফাইল দেখুন`}
                              >
                                <img
                                  src={getSafeAvatarUrl(rep.authorAvatar, rep.authorName, rep.authorId)}
                                  alt={rep.authorName}
                                  className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-emerald-50 dark:bg-slate-800"
                                  onError={(e) => {
                                    e.currentTarget.src = getSafeAvatarUrl('', rep.authorName, rep.authorId);
                                  }}
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => onViewProfile(rep.authorId, rep.authorName, rep.authorEmail, rep.authorAvatar)}
                                className="font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer text-left"
                                title={`${rep.authorName} এর প্রোফাইল দেখুন`}
                              >
                                {rep.authorName}
                              </button>
                              {renderBadge(rep.authorBadge)}
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">• {formatTimestamp(rep.createdAt)}</span>
                            </div>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{rep.content}</p>
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
                        className="flex-1 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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

