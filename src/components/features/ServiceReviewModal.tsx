import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Send,
  User,
  Sparkles,
  CheckCircle,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../../dbData';
import {
  ServiceReview,
  fetchServiceReviews,
  submitServiceReview,
  computeServiceRatingStats
} from '../../services/reviewService';

interface ServiceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  currentUser?: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
  onReviewSubmitted?: (newStats: { average: number; total: number }) => void;
}

const REVIEW_TAG_OPTIONS = [
  'দ্রুত সেবা',
  'সদাচারী ব্যবহার',
  'সাশ্রয়ী ও ন্যায্য মূল্য',
  'দক্ষ ও অভিজ্ঞ',
  'নির্ভুল তথ্য',
  'সহযোগিতাপূর্ণ',
  'পরিচ্ছন্ন পরিবেশ',
  'জরুরি সময়ে পাশে পাওয়া গেছে'
];

export const ServiceReviewModal: React.FC<ServiceReviewModalProps> = ({
  isOpen,
  onClose,
  service,
  currentUser,
  onReviewSubmitted
}) => {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.displayName || '');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName && !reviewerName) {
      setReviewerName(currentUser.displayName);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!service || !isOpen) return;
    setIsLoading(true);
    fetchServiceReviews(service.id)
      .then(res => setReviews(res))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [service, isOpen]);

  if (!isOpen || !service) return null;

  const stats = computeServiceRatingStats(reviews);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await submitServiceReview(service.id, {
        userId: currentUser?.uid || 'guest_' + Date.now(),
        userName: reviewerName.trim() || 'নাগরিক',
        userAvatar: currentUser?.photoURL || undefined,
        rating,
        comment: comment.trim(),
        tags: selectedTags,
        verifiedCitizen: !!currentUser?.uid
      });

      const updated = [created, ...reviews];
      setReviews(updated);
      setComment('');
      setSelectedTags([]);
      setShowAddForm(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);

      const newStats = computeServiceRatingStats(updated);
      if (onReviewSubmitted) {
        onReviewSubmitted(newStats);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingFeedback = (val: number) => {
    switch (val) {
      case 1:
        return '১ - অসন্তোষজনক';
      case 2:
        return '২ - মোটামুটি';
      case 3:
        return '৩ - ভালো';
      case 4:
        return '৪ - খুব ভালো ও নির্ভরযোগ্য';
      case 5:
        return '৫ - অসাধারণ ও শতভাগ বিশ্বস্ত!';
      default:
        return 'রেটিং নির্বাচন করুন';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50 dark:bg-slate-850 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              নাগরিক রিভিউ ও রেটিং
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
              {service.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {service.address}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition active:scale-90"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {successToast && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle size={16} className="text-emerald-500" />
              <span>ধন্যবাদ! আপনার মূল্যবান রিভিউ সফলভাবে যুক্ত হয়েছে।</span>
            </div>
          )}

          {/* RATING SUMMARY CARD */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-left sm:pr-4 sm:border-r border-slate-200 dark:border-slate-700 shrink-0">
              <div className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                {stats.average.toFixed(1)}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(stats.average)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {stats.total > 0 ? `${stats.total} টি নাগরিক রিভিউ` : 'এখনো কোনো রিভিউ নেই'}
              </span>
            </div>

            {/* DISTRIBUTION BARS */}
            <div className="flex-1 w-full space-y-1 text-xs">
              {[5, 4, 3, 2, 1].map(s => {
                const count = stats.distribution[s as 1 | 2 | 3 | 4 | 5] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="w-3 text-right font-mono">{s}</span>
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-[10px] text-slate-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WRITE REVIEW BUTTON / FORM TOGGLE */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>এই সেবায় আপনার রিভিউ ও রেটিং দিন</span>
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 space-y-3.5 animate-fade-in"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 dark:border-slate-700 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" />
                  রিভিউ ফর্ম
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  বাতিল
                </button>
              </div>

              {/* STAR SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার স্টার রেটিং নির্বাচন করুন:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => {
                    const activeVal = hoverRating || rating;
                    return (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        className="p-1 transition-transform active:scale-125 cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={
                            s <= activeVal
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {getRatingFeedback(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* NAME INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার নাম:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  placeholder="আপনার নাম লিখুন..."
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* EXPERIENCE TAGS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  অভিজ্ঞতা ট্যাগ নির্বাচন করুন (ঐচ্ছিক):
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {REVIEW_TAG_OPTIONS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COMMENT TEXTAREA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  আপনার মতামত ও অভিজ্ঞতা বিস্তারিত লিখুন:
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  placeholder="যেমন: ডাক্তার বা কর্মীর ব্যবহার কেমন ছিল? সময়মতো সেবা পেয়েছেন কি না? খরচ কেমন..."
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white resize-none"
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <Send size={13} />
                <span>{isSubmitting ? 'রিভিউ জমা হচ্ছে...' : 'রিভিউ পোস্ট করুন'}</span>
              </button>
            </form>
          )}

          {/* LIST OF REVIEWS */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>নাগরিকদের মতামত ও রিভিউ</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {reviews.length}
              </span>
            </h4>

            {isLoading ? (
              <div className="text-center py-6 text-xs text-slate-400">
                রিভিউ লোড হচ্ছে...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                এখনো কোনো রিভিউ দেওয়া হয়নি। আপনিই প্রথম রিভিউ দিন!
              </div>
            ) : (
              reviews.map(r => (
                <div
                  key={r.id}
                  className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center overflow-hidden shrink-0 border border-emerald-100 dark:border-slate-700">
                        {r.userAvatar ? (
                          <img src={r.userAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={15} className="text-emerald-700 dark:text-emerald-300" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {r.userName}
                          </span>
                          {r.verifiedCitizen && (
                            <span
                              className="text-emerald-600 dark:text-emerald-400"
                              title="যাচাইকৃত নাগরিক"
                            >
                              <ShieldCheck size={13} />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Star display */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= r.rating ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-700'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {r.comment}
                  </p>

                  {/* Tags */}
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {r.tags.map(t => (
                        <span
                          key={t}
                          className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
