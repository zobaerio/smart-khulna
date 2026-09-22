import React from 'react';
import {
  Sparkles,
  CloudRain,
  Moon,
  Trees,
  Waves,
  Palette,
  Flame,
  Zap,
  Crown,
  Scroll,
  Heart,
  Check
} from 'lucide-react';

export interface ChatThemeDefinition {
  id: string;
  name: string;
  category: 'nature' | 'animated' | 'dark' | 'premium' | 'all';
  bgClass: string;
  animationType: 'rain' | 'fireflies' | 'stars' | 'bubbles' | 'petals' | 'leaves' | 'aurora' | 'grid' | 'none';
  myBubble: string;
  otherBubble: string;
  textMy: string;
  textOther: string;
  indicator: string;
  badgeBg: string;
  iconName: string;
  description: string;
}

export const CHAT_THEMES: { [key: string]: ChatThemeDefinition } = {
  classic: {
    id: 'classic',
    name: 'ক্লাসিক গ্রিন (Classic)',
    category: 'nature',
    bgClass: 'bg-slate-50 dark:bg-slate-950',
    animationType: 'none',
    myBubble: 'bg-emerald-700 text-white rounded-br-none shadow-xs',
    otherBubble: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-emerald-200',
    textOther: 'text-slate-400',
    indicator: 'bg-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    iconName: 'Trees',
    description: 'খুলনার ঐতিহ্যবাহী নির্মল সবুজ ও সাদা থিম'
  },
  sundarbans: {
    id: 'sundarbans',
    name: 'সুন্দরবন ম্যানগ্রোভ ও জোনাকি (Sundarbans)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-emerald-950/20 via-slate-900/10 to-teal-950/30 dark:from-slate-950 dark:to-emerald-950/60 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]',
    animationType: 'fireflies',
    myBubble: 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-br-none shadow-md border border-emerald-500/20',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-emerald-200 dark:border-emerald-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-emerald-200',
    textOther: 'text-emerald-600 dark:text-emerald-400',
    indicator: 'bg-emerald-500',
    badgeBg: 'bg-emerald-600 text-white',
    iconName: 'Trees',
    description: 'ম্যানগ্রোভ বন ও রাতের ভাসমান সোনালী জোনাকি'
  },
  monsoon_rain: {
    id: 'monsoon_rain',
    name: 'বর্ষার রিমঝিম বৃষ্টি (Monsoon Rain)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-slate-200 via-sky-100 to-slate-200 dark:from-slate-950 dark:via-sky-950/40 dark:to-slate-950',
    animationType: 'rain',
    myBubble: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-br-none shadow-md border border-sky-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-sky-200 dark:border-sky-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-sky-200',
    textOther: 'text-sky-600 dark:text-sky-400',
    indicator: 'bg-sky-500',
    badgeBg: 'bg-sky-100 text-sky-800',
    iconName: 'CloudRain',
    description: 'অ্যানিমেটেড শীতল বৃষ্টির ফোঁটা ও স্নিগ্ধ পরিবেশ'
  },
  moonlit_night: {
    id: 'moonlit_night',
    name: 'নীল চাঁদনী রাত ও তারা (Starry Night)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 text-slate-100',
    animationType: 'stars',
    myBubble: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none shadow-lg border border-indigo-400/30',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-indigo-900/60 text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-indigo-200',
    textOther: 'text-indigo-300',
    indicator: 'bg-indigo-500',
    badgeBg: 'bg-indigo-900 text-indigo-200',
    iconName: 'Moon',
    description: 'আকাশে মিটিমিটি তারার মেলা ও চাঁদের স্নিগ্ধ আলো'
  },
  cherry_blossom: {
    id: 'cherry_blossom',
    name: 'গোলাপী চেরি ব্লসম (Sakura Blossom)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-rose-50 via-pink-50/60 to-rose-100/40 dark:from-slate-950 dark:via-pink-950/30 dark:to-slate-950',
    animationType: 'petals',
    myBubble: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none shadow-md border border-rose-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-rose-200 dark:border-rose-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-rose-200',
    textOther: 'text-rose-500 dark:text-rose-400',
    indicator: 'bg-rose-500',
    badgeBg: 'bg-rose-100 text-rose-800',
    iconName: 'Heart',
    description: 'বাতাসে ভাসমান মৃদু গোলাপী পাপড়ি'
  },
  autumn_leaves: {
    id: 'autumn_leaves',
    name: 'হেমন্তের সোনালী পাতা (Autumn Sunset)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-amber-50 via-orange-50/50 to-amber-100/30 dark:from-slate-950 dark:via-amber-950/30 dark:to-slate-950',
    animationType: 'leaves',
    myBubble: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-none shadow-md border border-amber-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-amber-200',
    textOther: 'text-amber-600 dark:text-amber-400',
    indicator: 'bg-amber-500',
    badgeBg: 'bg-amber-100 text-amber-800',
    iconName: 'Trees',
    description: 'হেমন্তের মৃদু রোদ ও বাতাসে ঝরে পড়া সোনালী পাতা'
  },
  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    name: 'সাইবারপাঙ্ক নিয়ন (Cyberpunk Neon)',
    category: 'dark',
    bgClass: 'bg-slate-950 text-slate-100 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:20px_20px]',
    animationType: 'none',
    myBubble: 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/40',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-fuchsia-500/30 text-slate-100 rounded-bl-none shadow-[0_0_10px_rgba(217,70,239,0.15)]',
    textMy: 'text-cyan-200',
    textOther: 'text-fuchsia-300',
    indicator: 'bg-cyan-400',
    badgeBg: 'bg-cyan-950 text-cyan-300 border border-cyan-500/30',
    iconName: 'Zap',
    description: 'উজ্জ্বল নিয়ন গ্লো, সায়ান ও ফুশিয়া টেক গ্রিড'
  },
  ocean_waves: {
    id: 'ocean_waves',
    name: 'রূপালী সাগর ও বুদবুদ (Ocean Waves)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-cyan-50 via-teal-50 to-blue-100/50 dark:from-slate-950 dark:via-teal-950/40 dark:to-slate-950',
    animationType: 'bubbles',
    myBubble: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-br-none shadow-md border border-cyan-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-teal-200 dark:border-teal-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-cyan-200',
    textOther: 'text-teal-600 dark:text-teal-400',
    indicator: 'bg-teal-500',
    badgeBg: 'bg-teal-100 text-teal-800',
    iconName: 'Waves',
    description: 'গভীর সাগরের নীল জলরাশি ও ওপরের দিকে ওঠা বুদবুদ'
  },
  galaxy_aurora: {
    id: 'galaxy_aurora',
    name: 'মহাজাগতিক অরোরা (Cosmic Aurora)',
    category: 'dark',
    bgClass: 'bg-gradient-to-tr from-slate-950 via-emerald-950/50 to-indigo-950 text-slate-100 animate-aurora',
    animationType: 'stars',
    myBubble: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white rounded-br-none shadow-lg border border-emerald-400/30',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-teal-500/30 text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-emerald-200',
    textOther: 'text-teal-300',
    indicator: 'bg-emerald-400',
    badgeBg: 'bg-slate-800 text-teal-300',
    iconName: 'Sparkles',
    description: 'অরোরা বোরিয়ালিসের চলমান আলোর তরঙ্গ ও নক্ষত্রমণ্ডল'
  },
  royal_gold: {
    id: 'royal_gold',
    name: 'রয়্যাল গোল্ড ও ব্ল্যাক (Royal Gold)',
    category: 'premium',
    bgClass: 'bg-gradient-to-b from-slate-950 via-zinc-900 to-slate-950 text-amber-100',
    animationType: 'none',
    myBubble: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-medium rounded-br-none shadow-lg border border-amber-300/40',
    otherBubble: 'bg-zinc-900/90 backdrop-blur-xs border border-amber-500/30 text-amber-100 rounded-bl-none shadow-xs',
    textMy: 'text-slate-900',
    textOther: 'text-amber-400',
    indicator: 'bg-amber-400',
    badgeBg: 'bg-amber-950 text-amber-300 border border-amber-500/30',
    iconName: 'Crown',
    description: 'আভিজাত্যপূর্ণ কালো মার্বেল ও চকচকে সোনালী ফ্রেম'
  },
  bengal_tiger: {
    id: 'bengal_tiger',
    name: 'রয়্যাল বেঙ্গল ফায়ার (Bengal Flame)',
    category: 'premium',
    bgClass: 'bg-gradient-to-b from-amber-950/30 via-orange-950/20 to-slate-950 dark:bg-slate-950 text-slate-100',
    animationType: 'none',
    myBubble: 'bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-br-none shadow-md border border-orange-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-orange-200 dark:border-orange-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-orange-200',
    textOther: 'text-orange-600 dark:text-orange-400',
    indicator: 'bg-orange-600',
    badgeBg: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300',
    iconName: 'Flame',
    description: 'খুলনার অহংকার রয়েল বেঙ্গল টাইগারের তেজ ও সোনালী আভা'
  },
  vintage_parchment: {
    id: 'vintage_parchment',
    name: 'ঐতিহ্যবাহী নথিপত্র (Vintage Parchment)',
    category: 'premium',
    bgClass: 'bg-[#fbf7ee] dark:bg-[#1a1714] text-[#3e342a] dark:text-[#ede4d8] bg-[radial-gradient(#d6c9b5_1px,transparent_1px)] [background-size:18px_18px]',
    animationType: 'none',
    myBubble: 'bg-[#825c38] dark:bg-[#996f47] text-white rounded-br-none shadow-md border border-[#6b4a2d]',
    otherBubble: 'bg-[#f4ecdf] dark:bg-[#28221c] border border-[#d5c3aa] dark:border-[#42372d] text-[#3e342a] dark:text-[#ede4d8] rounded-bl-none shadow-xs',
    textMy: 'text-[#f0e3d2]',
    textOther: 'text-[#825c38] dark:text-[#c4a98b]',
    indicator: 'bg-[#825c38]',
    badgeBg: 'bg-[#e8dcce] text-[#5c4127]',
    iconName: 'Scroll',
    description: 'ঐতিহাসিক নথিপত্র, প্রাচীন কালির ছোঁয়া ও ক্লাসিক সাজসজ্জা'
  }
};

export const ChatThemeAnimationOverlay: React.FC<{ animationType?: string }> = ({ animationType }) => {
  if (!animationType || animationType === 'none') return null;

  if (animationType === 'rain') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-sky-400 to-sky-200 animate-rain"
            style={{
              height: `${15 + (i % 5) * 6}px`,
              left: `${(i * 4.5) + (i % 3)}%`,
              top: `-${(i % 4) * 15}px`,
              animationDelay: `${(i * 0.08) % 1.2}s`,
              animationDuration: `${0.75 + ((i % 4) * 0.15)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'fireflies') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-300/80 shadow-[0_0_8px_#34d399] animate-firefly"
            style={{
              left: `${(i * 7) + 3}%`,
              top: `${10 + (i * 6)}%`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: `${3.5 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'stars') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(26)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_5px_#ffffff] animate-twinkle"
            style={{
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
              left: `${(i * 3.8) + 2}%`,
              top: `${(i * 13) % 92}%`,
              animationDelay: `${(i * 0.2) % 3}s`,
              animationDuration: `${2.2 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'petals') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-3.5 rounded-tl-full rounded-br-full bg-rose-300/60 shadow-xs animate-petal"
            style={{
              left: `${(i * 6.5) + 3}%`,
              top: `-${(i % 5) * 10}px`,
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${6.5 + (i % 4)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'leaves') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3.5 h-3 rounded-tr-xl rounded-bl-xl bg-amber-400/55 shadow-xs animate-petal"
            style={{
              left: `${(i * 7) + 2}%`,
              top: `-${(i % 4) * 12}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${7 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'bubbles') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-teal-300/60 bg-teal-200/20 backdrop-blur-2xs animate-bubble"
            style={{
              width: `${((i % 4) + 2) * 5}px`,
              height: `${((i % 4) + 2) * 5}px`,
              left: `${(i * 6.8) + 2}%`,
              bottom: `-20px`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5.2 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    );
  }

  return null;
};

interface ThemeSelectorModalProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  currentTheme,
  onSelectTheme,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'nature' | 'animated' | 'dark' | 'premium'>('all');

  const categories = [
    { id: 'all', label: 'সকল থিম' },
    { id: 'animated', label: '✨ অ্যানিমেটেড' },
    { id: 'nature', label: '🌿 প্রকৃতি ও সুন্দরবন' },
    { id: 'dark', label: '🌙 ডার্ক ও গ্যালাক্সি' },
    { id: 'premium', label: '👑 আভিজাত্য' }
  ];

  const filteredThemes = Object.values(CHAT_THEMES).filter(t => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                চ্যাট ওয়ালপেপার ও থিম গ্যালারি
              </h3>
              <p className="text-[11px] text-slate-500">
                ছবি, অ্যানিমেশন ও কালার কম্বিনেশন দিয়ে চ্যাট ব্যাকগ্রাউন্ড সাজান
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredThemes.map(theme => {
            const isSelected = currentTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`relative rounded-2xl border-2 p-3.5 cursor-pointer transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm bg-white dark:bg-slate-900'
                }`}
              >
                {/* Live Mini Preview Box */}
                <div className={`relative h-20 w-full rounded-xl overflow-hidden p-2.5 flex flex-col justify-between border border-slate-200/60 dark:border-slate-700/60 ${theme.bgClass}`}>
                  <ChatThemeAnimationOverlay animationType={theme.animationType} />
                  
                  {/* Incoming Dummy Bubble */}
                  <div className="relative z-10 flex justify-start">
                    <span className={`text-[9px] px-2 py-1 rounded-lg ${theme.otherBubble} max-w-[130px] truncate`}>
                      কেমন আছেন?
                    </span>
                  </div>

                  {/* Outgoing Dummy Bubble */}
                  <div className="relative z-10 flex justify-end">
                    <span className={`text-[9px] px-2 py-1 rounded-lg ${theme.myBubble} max-w-[130px] truncate`}>
                      আলহামদুলিল্লাহ ভালো!
                    </span>
                  </div>
                </div>

                {/* Info & Status */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {theme.name}
                      </h4>
                      {theme.animationType !== 'none' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                          ✨ অ্যানিমেটেড
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {theme.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <Check size={14} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-blue-500 flex items-center justify-center text-transparent group-hover:text-blue-500">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
