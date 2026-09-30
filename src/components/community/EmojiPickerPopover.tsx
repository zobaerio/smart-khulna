import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Flame, Smile, ThumbsUp, Leaf, Coffee, Car, Sparkles, Flag } from 'lucide-react';

export interface EmojiPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'popular',
    name: 'জনপ্রিয়',
    icon: Flame,
    emojis: ['❤️', '👍', '🔥', '😊', '😍', '👏', '🙏', '🇧🇩', '🎉', '😃', '✨', '💡', '🌟', '🤝', '💯', '🙌', '🌸', '☕', '🚗', '📍']
  },
  {
    id: 'smileys',
    name: 'হাসি ও অনুভূতি',
    icon: Smile,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
      '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗',
      '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶',
      '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯',
      '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
      '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '💩'
    ]
  },
  {
    id: 'people',
    name: 'হাত ও মানুষ',
    icon: ThumbsUp,
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘',
      '🤙', '👈', '👉', '👆', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏',
      '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🧑', '👨', '👩', '👴', '👵', '👮',
      '👷', '👨‍⚕️', '👩‍⚕️', '👨‍🏫', '👩‍🏫', '👨‍🌾', '👩‍🌾', '🧑‍🤝‍🧑', '👫', '👬', '👭'
    ]
  },
  {
    id: 'nature',
    name: 'প্রকৃতি ও প্রাণী',
    icon: Leaf,
    emojis: [
      '🌿', '🌱', '🌴', '🌳', '🌲', '🌾', '🍀', '🍁', '🍂', '🍃', '🌺', '🌸', '🌼',
      '🌻', '🌹', '🌷', '💐', '🐅', '🐯', '🦁', '🐆', '🐴', '🐎', '🐮', '🐂', '🐃',
      '🐄', '🐷', '🐗', '🐏', '🐑', '🐐', '🐪', '🐫', '🐘', '🐒', '🐵', '🐕', '🐩',
      '🐈', '🐱', '🐦', '🦅', '🦉', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐟',
      '🐠', '🐬', '🐳', '☀️', '🌤️', '⛅', '🌧️', '⛈️', '❄️', '🌈'
    ]
  },
  {
    id: 'food',
    name: 'খাবার ও পানীয়',
    icon: Coffee,
    emojis: [
      '☕', '🍵', '🧃', '🥤', '🥛', '🍎', '🍌', '🍉', '🍇', '🍓', '🥭', '🍍', '🥥',
      '🍅', '🥑', '🥔', '🥕', '🌽', '🌶️', '🥒', '🍞', '🧀', '🍗', '🍖', '🥩', '🍔',
      '🍟', '🍕', '🌭', '🥪', '🌮', '🥚', '🍲', '🥣', '🥗', '🍿', '🍙', '🍚', '🍛',
      '🍜', '🍝', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🍫', '🍬'
    ]
  },
  {
    id: 'travel',
    name: 'ভ্রমণ ও যানবাহন',
    icon: Car,
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜',
      '🛵', '🏍️', '🚲', '🛺', '🚂', '🚆', '🚄', '🛫', '✈️', '🚁', '⛵', '🚤', '🛳️',
      '🚢', '⚓', '🚨', '🚥', '🛑', '🚧', '🏢', '🏬', '🏫', '🏥', '🏦', '🏨', '🏪',
      '🏠', '🏡', '🏛️', '🕌', '🌉', '🏙️', '🌄', '🌅', '🌆', '🌇'
    ]
  },
  {
    id: 'symbols',
    name: 'প্রতীক ও পতাকা',
    icon: Flag,
    emojis: [
      '🇧🇩', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
      '💞', '💓', '💗', '💖', '💘', '💝', '💟', '💯', '💢', '💥', '💫', '💦', '💨',
      '💬', '💭', '💤', '💡', '🔔', '📢', '📣', '🎉', '🎊', '🎈', '🏆', '🥇', '🥈',
      '⭐', '🌟', '✨', '⚡', '🔥', '🎯', '📍', '📌', '🔒', '🔑', '📱', '💻', '📷',
      '✅', '❌', '⚠️', '⛔', '🟢', '🔴', '🔵'
    ]
  }
];

// Keyword search dictionary for common terms in Bengali and English
const EMOJI_KEYWORDS: { [key: string]: string[] } = {
  '❤️': ['love', 'heart', 'bhalobasha', 'ভালোবাসা', 'লাল'],
  '👍': ['like', 'thumbs up', 'good', 'bhalo', 'পছন্দ', 'লাইক', 'ভালো'],
  '🔥': ['fire', 'flame', 'trending', 'agun', 'আগুন', 'ট্রেন্ডিং'],
  '😊': ['smile', 'happy', 'blush', 'hasi', 'হাসি', 'খুশি'],
  '😍': ['love', 'crush', 'heart eyes', 'মুগ্ধ'],
  '👏': ['clap', 'applause', 'shabash', 'তালি', 'অভিনন্দন'],
  '🙏': ['pray', 'namaskar', 'prarthona', 'দোয়া', 'নমস্কার', 'ধন্যবাদ', 'অনুরোধ'],
  '🇧🇩': ['bangladesh', 'flag', 'desh', 'বাংলাদেশ', 'পতাকা', 'সোনার বাংলা'],
  '🎉': ['party', 'celebrate', 'tada', 'উৎসব', 'আনন্দ'],
  '☕': ['tea', 'coffee', 'cha', 'চা', 'কফি', 'আড্ডা'],
  '🌸': ['flower', 'ful', 'ফুল', 'সুন্দর'],
  '🐅': ['tiger', 'bagh', 'sundarbans', 'বাঘ', 'সুন্দরবন'],
  '🚗': ['car', 'gari', 'traffic', 'গাড়ি', 'ভ্রমণ'],
  '💡': ['idea', 'light', 'bulb', 'বুদ্ধি', 'আলো'],
  '📍': ['location', 'place', 'map', 'স্থান', 'ঠিকানা', 'লোকেশন'],
  '🚑': ['ambulance', 'hospital', 'doctor', 'জরুরি', 'অ্যাম্বুলেন্স', 'হাসপাতাল'],
  '🚓': ['police', 'পুলিশ', 'আইন'],
  '🏥': ['hospital', 'clinic', 'হাসপাতাল', 'চিকিৎসা'],
  '🤝': ['deal', 'handshake', 'ekota', 'হাতে হাত', 'মৈত্রী'],
  '💯': ['100', 'hundred', 'perfect', 'শতভাগ', 'একশ'],
  '😂': ['laugh', 'cry', 'funny', 'হাসি', 'মজা'],
  '🤣': ['rofl', 'laugh', 'মজার'],
  '😭': ['cry', 'sad', 'kanna', 'কান্না', 'কষ্ট'],
  '⭐': ['star', 'tara', 'তারা', 'সেরা'],
  '🌟': ['star', 'glowing', 'উজ্জ্বল'],
  '✅': ['check', 'done', 'tick', 'সঠিক', 'সম্পন্ন'],
  '⚠️': ['warning', 'alert', 'সতর্কতা', 'সাবধান']
};

export const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  align = 'left',
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filtered emojis based on search
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.trim().toLowerCase();

    const matched = new Set<string>();

    // Check keyword dictionary
    for (const [emoji, keywords] of Object.entries(EMOJI_KEYWORDS)) {
      if (keywords.some(k => k.toLowerCase().includes(query))) {
        matched.add(emoji);
      }
    }

    // Check all categories
    for (const cat of EMOJI_CATEGORIES) {
      if (cat.name.toLowerCase().includes(query)) {
        cat.emojis.forEach(e => matched.add(e));
      }
    }

    return Array.from(matched);
  }, [searchQuery]);

  if (!isOpen) return null;

  const currentCategoryObj = EMOJI_CATEGORIES.find(c => c.id === activeCategory) || EMOJI_CATEGORIES[0];

  const alignmentClass =
    align === 'right'
      ? 'right-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0';

  return (
    <div
      ref={popoverRef}
      className={`absolute z-50 ${alignmentClass} mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-200 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Search and Close */}
      <div className="p-2.5 pb-1.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ইমোজি অনুসন্ধান (বাংলা বা ইংরেজি)..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            title="বন্ধ করুন"
          >
            <X size={14} />
          </button>
        </div>

        {/* Category Navigation Bar (when not searching) */}
        {!searchQuery && (
          <div className="flex items-center justify-between gap-1 mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto no-scrollbar">
            {EMOJI_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.name}
                  className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Emoji Grid Container */}
      <div className="p-2.5 max-h-56 overflow-y-auto custom-chat-scrollbar">
        {searchQuery ? (
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              অনুসন্ধানের ফলাফল ({filteredEmojis?.length || 0})
            </div>
            {filteredEmojis && filteredEmojis.length > 0 ? (
              <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
                {filteredEmojis.map((emoji, index) => (
                  <button
                    key={`${emoji}-${index}`}
                    type="button"
                    onClick={() => {
                      onSelectEmoji(emoji);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-90 transition cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                &ldquo;{searchQuery}&rdquo; দিয়ে কোনো ইমোজি পাওয়া যায়নি
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 px-1">
              <span>{currentCategoryObj.name}</span>
              <span className="text-[9px] text-slate-400">{currentCategoryObj.emojis.length} টি</span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
              {currentCategoryObj.emojis.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  type="button"
                  onClick={() => {
                    onSelectEmoji(emoji);
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-90 transition cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Popular Strip at Footer */}
      <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
        <span className="font-medium">ট্যাপ করে যুক্ত করুন</span>
        <div className="flex items-center gap-1">
          {['❤️', '👍', '🔥', '🇧🇩'].map(quickEmoji => (
            <button
              key={quickEmoji}
              type="button"
              onClick={() => onSelectEmoji(quickEmoji)}
              className="w-5 h-5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-xs cursor-pointer"
            >
              {quickEmoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
