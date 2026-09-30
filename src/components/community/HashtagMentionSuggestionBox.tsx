import React from 'react';
import { Hash, Flame, Sparkles, Check, User, AtSign, ShieldCheck } from 'lucide-react';
import { HashtagInfo, toBengaliNumber } from '../../utils/hashtagUtils';
import { PublicUserProfile } from '../../types/community';
import { getSafeAvatarUrl } from '../../lib/avatarHelper';

interface HashtagMentionSuggestionBoxProps {
  type: 'hashtag' | 'mention';
  hashtagSuggestions: HashtagInfo[];
  userSuggestions: PublicUserProfile[];
  query: string;
  selectedIndex: number;
  onSelectHashtag: (tag: string) => void;
  onSelectUser: (user: PublicUserProfile) => void;
  onClose: () => void;
}

export const HashtagMentionSuggestionBox: React.FC<HashtagMentionSuggestionBoxProps> = ({
  type,
  hashtagSuggestions,
  userSuggestions,
  query,
  selectedIndex,
  onSelectHashtag,
  onSelectUser,
  onClose
}) => {
  if (type === 'hashtag') {
    return (
      <div className="absolute z-50 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="px-3.5 py-2 bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-100/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Hash size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>হ্যাশট্যাগ সাজেশন (রিয়েল-টাইম পোস্ট)</span>
          </div>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
            {query ? `#${query}` : 'জনপ্রিয়'}
          </span>
        </div>

        {/* Suggestion list */}
        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
          {hashtagSuggestions.length > 0 ? (
            hashtagSuggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.tag}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents input from losing focus prematurely
                    onSelectHashtag(item.tag);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between rounded-xl transition cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <Hash size={12} />
                    </div>
                    <span className="truncate font-semibold tracking-wide">{item.tag}</span>
                  </div>

                  {/* Real-time Post Count Badge */}
                  <div className="shrink-0 flex items-center gap-1 pl-2">
                    {item.count > 0 ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : item.isTrending
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.isTrending && <Flame size={10} className="text-amber-500 fill-amber-500" />}
                        <span>{toBengaliNumber(item.count)} টি পোস্ট</span>
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50'
                        }`}
                      >
                        নতুন হ্যাশট্যাগ
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-3 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                &ldquo;#{query}&rdquo; দিয়ে কোনো হ্যাশট্যাগ মেলেনি।
              </p>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectHashtag(`#${query}`);
                }}
                className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
              >
                <Sparkles size={12} />
                <span>নতুন হিসেবে যোগ করুন: #{query}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span>ক্লিক করে লেখায় যুক্ত করুন</span>
          <span>Tab / Enter</span>
        </div>
      </div>
    );
  }

  // Type === 'mention'
  return (
    <div className="absolute z-50 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="px-3.5 py-2 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300">
          <AtSign size={13} className="text-blue-600 dark:text-blue-400" />
          <span>ইউজার মেনশন করুন</span>
        </div>
        <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium">
          {query ? `@${query}` : 'সকল নাগরিক'}
        </span>
      </div>

      {/* Suggestion list */}
      <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
        {userSuggestions.length > 0 ? (
          userSuggestions.map((u, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={u.uid}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelectUser(u);
                }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between rounded-xl transition cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold'
                    : 'hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={getSafeAvatarUrl(u.avatar, u.name, u.uid)}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                    onError={(e) => {
                      e.currentTarget.src = getSafeAvatarUrl('', u.name, u.uid);
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="truncate font-bold">{u.name}</span>
                      {u.verification_status === 'verified' && (
                        <ShieldCheck
                          size={12}
                          className={isSelected ? 'text-white' : 'text-emerald-600'}
                        />
                      )}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {u.profession || u.district || 'স্মার্ট খুলনা নাগরিক'}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    মেনশন
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-3 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              &ldquo;@{query}&rdquo; নামের কোনো ব্যবহারকারী মেলেনি।
            </p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span>ক্লিক করে মেনশন যুক্ত করুন</span>
        <span>Tab / Enter</span>
      </div>
    </div>
  );
};
