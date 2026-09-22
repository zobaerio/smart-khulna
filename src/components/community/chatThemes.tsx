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
  Check,
  Compass,
  Coffee,
  Sunset,
  Shield,
  Layers,
  Star,
  Sun,
  X
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
    name: 'ক্লাসিক গ্রিন (Classic Emerald)',
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
    name: 'সুন্দরবন ও জোনাকি (Sundarbans Fireflies)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-emerald-950/30 via-slate-900/20 to-teal-950/40 dark:from-slate-950 dark:to-emerald-950/70 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]',
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
    description: 'হেমন্তের মৃদু বাতাসে ঝরে পড়া সোনালী পাতা'
  },
  rupsha_river: {
    id: 'rupsha_river',
    name: 'রূপসা নদীর ঢেউ ও বুদ্বুদ (Rupsha Waves)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-teal-50 via-cyan-50/60 to-blue-50/40 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950',
    animationType: 'bubbles',
    myBubble: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-br-none shadow-md border border-cyan-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-teal-200 dark:border-teal-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-teal-200',
    textOther: 'text-teal-600 dark:text-teal-400',
    indicator: 'bg-teal-500',
    badgeBg: 'bg-teal-100 text-teal-800',
    iconName: 'Waves',
    description: 'রূপসা নদীর স্নিগ্ধ জল ও শান্ত স্রোতের ঢেউ'
  },
  aurora_borealis: {
    id: 'aurora_borealis',
    name: 'সুমেরু অরোরা আলো (Northern Aurora)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-slate-950 via-teal-950/50 to-slate-950 text-slate-100',
    animationType: 'aurora',
    myBubble: 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-br-none shadow-lg border border-teal-300/40',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-teal-800/60 text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-teal-200',
    textOther: 'text-teal-400',
    indicator: 'bg-teal-400',
    badgeBg: 'bg-teal-900 text-teal-200',
    iconName: 'Sparkles',
    description: 'রাতের আকাশে অপার্থিব সবুজ ও নীল আলোর নৃত্য'
  },
  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    name: 'সাইবারপাঙ্ক নিয়ন (Cyberpunk Neon)',
    category: 'dark',
    bgClass: 'bg-slate-950 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:20px_20px] text-pink-100',
    animationType: 'grid',
    myBubble: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-br-none shadow-[0_0_15px_rgba(236,72,153,0.3)] border border-pink-400/40',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-fuchsia-800/80 text-pink-200 rounded-bl-none shadow-xs',
    textMy: 'text-pink-200',
    textOther: 'text-pink-400',
    indicator: 'bg-pink-500',
    badgeBg: 'bg-pink-950 text-pink-300 border border-pink-500/40',
    iconName: 'Zap',
    description: 'উজ্জ্বল নিয়ন পিংক ও ফিউচারিস্টিক সাইবার লুক'
  },
  midnight_oled: {
    id: 'midnight_oled',
    name: 'মিডনাইট ওলেড ডার্ক (Midnight OLED)',
    category: 'dark',
    bgClass: 'bg-black text-slate-100',
    animationType: 'none',
    myBubble: 'bg-slate-800 text-white rounded-br-none shadow-md border border-slate-700',
    otherBubble: 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-xs',
    textMy: 'text-slate-400',
    textOther: 'text-slate-400',
    indicator: 'bg-slate-500',
    badgeBg: 'bg-slate-900 text-slate-300 border border-slate-700',
    iconName: 'Moon',
    description: 'ব্যাটারি সেভিং গভীর কালো ও আরামদায়ক ডার্ক থিম'
  },
  electric_violet: {
    id: 'electric_violet',
    name: 'ইলেকট্রিক ভায়োলেট (Electric Violet)',
    category: 'dark',
    bgClass: 'bg-gradient-to-b from-purple-950 via-slate-950 to-indigo-950 text-purple-100',
    animationType: 'stars',
    myBubble: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md border border-purple-400/30',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-purple-900/60 text-purple-100 rounded-bl-none shadow-xs',
    textMy: 'text-purple-200',
    textOther: 'text-purple-300',
    indicator: 'bg-purple-500',
    badgeBg: 'bg-purple-950 text-purple-300 border border-purple-500/30',
    iconName: 'Sparkles',
    description: 'গ্যালাক্সি পার্পল ও আধুনিক ভায়োলেট গ্লো'
  },
  matrix_terminal: {
    id: 'matrix_terminal',
    name: 'ম্যাট্রিক্স টার্মিনাল (Matrix Green)',
    category: 'dark',
    bgClass: 'bg-slate-950 text-emerald-400 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] [background-size:24px_24px]',
    animationType: 'grid',
    myBubble: 'bg-emerald-900 text-emerald-100 rounded-br-none border border-emerald-500/40 shadow-xs',
    otherBubble: 'bg-slate-900/95 border border-emerald-800/80 text-emerald-300 rounded-bl-none shadow-xs',
    textMy: 'text-emerald-300',
    textOther: 'text-emerald-400',
    indicator: 'bg-emerald-500',
    badgeBg: 'bg-emerald-950 text-emerald-400 border border-emerald-500/30',
    iconName: 'Zap',
    description: 'হ্যাকার স্টাইল সাইবার গ্রিন গ্রিড'
  },
  royal_gold: {
    id: 'royal_gold',
    name: 'রাজকীয় গোল্ডেন (Royal Gold Luxury)',
    category: 'premium',
    bgClass: 'bg-gradient-to-b from-stone-950 via-amber-950/40 to-stone-900 text-amber-100',
    animationType: 'stars',
    myBubble: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-slate-950 font-semibold rounded-br-none shadow-lg border border-amber-300/50',
    otherBubble: 'bg-stone-900/90 backdrop-blur-xs border border-amber-700/50 text-amber-100 rounded-bl-none shadow-xs',
    textMy: 'text-amber-950',
    textOther: 'text-amber-400',
    indicator: 'bg-amber-400',
    badgeBg: 'bg-amber-950 text-amber-300 border border-amber-500/30',
    iconName: 'Crown',
    description: 'আভিজাত্যপূর্ণ সোনালী ফ্রেম ও রাজকীয় চকচকে লুক'
  },
  ruby_crimson: {
    id: 'ruby_crimson',
    name: 'রুবি ক্রিস্টাল (Crimson Ruby)',
    category: 'premium',
    bgClass: 'bg-gradient-to-b from-rose-950/40 via-red-950/30 to-slate-950 text-rose-100',
    animationType: 'petals',
    myBubble: 'bg-gradient-to-r from-rose-700 to-red-700 text-white rounded-br-none shadow-md border border-rose-400/30',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-rose-900/60 text-rose-100 rounded-bl-none shadow-xs',
    textMy: 'text-rose-200',
    textOther: 'text-rose-400',
    indicator: 'bg-rose-500',
    badgeBg: 'bg-rose-950 text-rose-300 border border-rose-500/30',
    iconName: 'Heart',
    description: 'দামি রুবি পাথরের মোহনীয় লাল আভা'
  },
  bengal_flame: {
    id: 'bengal_flame',
    name: 'রয়্যাল বেঙ্গল ফায়ার (Bengal Flame)',
    category: 'premium',
    bgClass: 'bg-gradient-to-b from-amber-950/30 via-orange-950/20 to-slate-950 text-slate-100',
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
  },
  lavender_mist: {
    id: 'lavender_mist',
    name: 'স্নিগ্ধ ল্যাভেন্ডার (Lavender Mist)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-purple-50/80 via-violet-50/50 to-purple-100/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950',
    animationType: 'petals',
    myBubble: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-br-none shadow-md border border-purple-300/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-purple-200 dark:border-purple-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-purple-200',
    textOther: 'text-purple-600 dark:text-purple-400',
    indicator: 'bg-purple-500',
    badgeBg: 'bg-purple-100 text-purple-800',
    iconName: 'Sparkles',
    description: 'মন জুড়ানো শান্ত ও স্নিগ্ধ ল্যাভেন্ডার ফুলের আবহ'
  },
  tea_garden: {
    id: 'tea_garden',
    name: 'সবুজ চা বাগান (Fresh Tea Leaf)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-lime-50/80 via-emerald-50/50 to-green-100/30 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950',
    animationType: 'leaves',
    myBubble: 'bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-br-none shadow-md border border-emerald-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-emerald-200 dark:border-emerald-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-emerald-200',
    textOther: 'text-emerald-600 dark:text-emerald-400',
    indicator: 'bg-emerald-500',
    badgeBg: 'bg-lime-100 text-lime-800',
    iconName: 'Trees',
    description: 'সতেজ ও তরতাজা সবুজ চা পাতার স্নিগ্ধতা'
  },
  sky_minimal: {
    id: 'sky_minimal',
    name: 'আকাশী প্যাস্টেল (Sky Blue Minimal)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-sky-50 via-blue-50/40 to-slate-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-slate-950',
    animationType: 'none',
    myBubble: 'bg-sky-600 text-white rounded-br-none shadow-xs',
    otherBubble: 'bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-sky-200',
    textOther: 'text-sky-600 dark:text-sky-400',
    indicator: 'bg-sky-500',
    badgeBg: 'bg-sky-100 text-sky-800',
    iconName: 'Sun',
    description: 'উন্মুক্ত নীল আকাশের প্রশান্তি ও স্পষ্ট অক্ষর'
  },
  ocean_deep: {
    id: 'ocean_deep',
    name: 'গভীর সমুদ্রের নীল (Ocean Deep)',
    category: 'nature',
    bgClass: 'bg-gradient-to-b from-blue-950 via-slate-900 to-cyan-950 text-slate-100',
    animationType: 'bubbles',
    myBubble: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md border border-cyan-400/30',
    otherBubble: 'bg-slate-900/90 backdrop-blur-xs border border-blue-800/60 text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-blue-200',
    textOther: 'text-cyan-300',
    indicator: 'bg-blue-400',
    badgeBg: 'bg-blue-950 text-blue-200 border border-blue-500/30',
    iconName: 'Waves',
    description: 'গভীর সমুদ্রের শান্ত নীল ও স্ফটিক বুদ্বুদ'
  },
  warm_coffee: {
    id: 'warm_coffee',
    name: 'উষ্ণ ক্যাফে রোস্ট (Warm Mocha)',
    category: 'premium',
    bgClass: 'bg-amber-50/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100',
    animationType: 'none',
    myBubble: 'bg-amber-800 text-white rounded-br-none shadow-xs',
    otherBubble: 'bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none shadow-xs',
    textMy: 'text-amber-200',
    textOther: 'text-amber-700 dark:text-amber-400',
    indicator: 'bg-amber-700',
    badgeBg: 'bg-amber-100 text-amber-900',
    iconName: 'Coffee',
    description: 'শান্ত বিকালের কফির উষ্ণতা ও আরামদায়ক অনুভূতি'
  },
  sunset_glow: {
    id: 'sunset_glow',
    name: 'রক্তিম গোধূলি (Sunset Glow)',
    category: 'animated',
    bgClass: 'bg-gradient-to-b from-orange-100 via-rose-50 to-amber-100 dark:from-slate-950 dark:via-orange-950/30 dark:to-slate-950',
    animationType: 'leaves',
    myBubble: 'bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 text-white rounded-br-none shadow-md border border-orange-400/30',
    otherBubble: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-orange-200 dark:border-orange-900/50 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-xs',
    textMy: 'text-orange-200',
    textOther: 'text-orange-600 dark:text-orange-400',
    indicator: 'bg-orange-500',
    badgeBg: 'bg-orange-100 text-orange-800',
    iconName: 'Sunset',
    description: 'নদীর তীরে গোধূলির মনমাতানো লাল ও সোনালী আকাশ'
  }
};

export const ChatThemeAnimationOverlay: React.FC<{ animationType?: string }> = ({ animationType }) => {
  if (!animationType || animationType === 'none') return null;

  if (animationType === 'rain') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-sky-400 to-sky-200 animate-rain"
            style={{
              height: `${12 + (i % 4) * 5}px`,
              left: `${(i * 6.2) + (i % 3)}%`,
              top: `-${(i % 4) * 12}px`,
              animationDelay: `${(i * 0.1) % 1.2}s`,
              animationDuration: `${0.75 + ((i % 3) * 0.15)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'fireflies') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-300/80 shadow-[0_0_8px_#34d399] animate-firefly"
            style={{
              left: `${(i * 9.5) + 3}%`,
              top: `${12 + (i * 7)}%`,
              animationDelay: `${i * 0.4}s`,
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
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_4px_#ffffff] animate-twinkle"
            style={{
              width: i % 3 === 0 ? '3px' : '2px',
              height: i % 3 === 0 ? '3px' : '2px',
              left: `${(i * 5.5) + 2}%`,
              top: `${(i * 17) % 90}%`,
              animationDelay: `${(i * 0.25) % 3}s`,
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
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-3.5 rounded-tl-full rounded-br-full bg-rose-300/60 shadow-xs animate-petal"
            style={{
              left: `${(i * 9.5) + 3}%`,
              top: `-${(i % 4) * 10}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6.5 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'leaves') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3.5 h-3 rounded-tr-xl rounded-bl-xl bg-amber-400/55 shadow-xs animate-petal"
            style={{
              left: `${(i * 9.5) + 2}%`,
              top: `-${(i % 3) * 12}px`,
              animationDelay: `${i * 0.55}s`,
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
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-teal-300/60 bg-teal-200/20 backdrop-blur-2xs animate-bubble"
            style={{
              width: `${((i % 3) + 2) * 4.5}px`,
              height: `${((i % 3) + 2) * 4.5}px`,
              left: `${(i * 9.8) + 2}%`,
              bottom: `-15px`,
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${5.2 + (i % 3)}s`
            }}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'aurora') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute -inset-[50%] bg-gradient-to-r from-emerald-500/20 via-teal-400/30 to-blue-500/20 blur-2xl animate-pulse" />
      </div>
    );
  }

  if (animationType === 'grid') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="w-full h-full bg-[linear-gradient(to_right,#ec4899_1px,transparent_1px),linear-gradient(to_bottom,#ec4899_1px,transparent_1px)] [background-size:16px_16px]" />
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
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'animated' | 'nature' | 'dark' | 'premium'>('all');

  const categories = [
    { id: 'all', label: 'সকল থিম (২২)' },
    { id: 'animated', label: '✨ অ্যানিমেটেড' },
    { id: 'nature', label: '🌿 প্রকৃতি ও সুন্দরবন' },
    { id: 'dark', label: '🌙 ডার্ক ও নিয়ন' },
    { id: 'premium', label: '👑 আভিজাত্য ও মিনিমাল' }
  ];

  const filteredThemes = Object.values(CHAT_THEMES).filter(t => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[88vh] max-h-[750px] animate-in zoom-in-95 duration-150">
        
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-serif">
                চ্যাট ওয়ালপেপার ও থিম গ্যালারি
              </h3>
              <p className="text-[11px] text-slate-500">
                পছন্দের থিম নির্বাচন করুন • মোট ২২টি প্রিমিয়াম থিম উপলব্ধ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Strict Independent Separated Cards in 2-column Layout */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto overscroll-contain bg-slate-100/70 dark:bg-slate-950/70 custom-chat-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredThemes.map(theme => {
              const isSelected = currentTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    onClose();
                  }}
                  className={`group rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/60'
                  }`}
                >
                  {/* Top Live Preview Container */}
                  <div className={`relative h-28 sm:h-32 p-3 flex flex-col justify-between overflow-hidden ${theme.bgClass}`}>
                    {/* Background Animation */}
                    <ChatThemeAnimationOverlay animationType={theme.animationType} />

                    {/* Top Status Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-md ${theme.badgeBg}`}>
                        {theme.animationType !== 'none' ? '✨ অ্যানিমেটেড' : 'ওয়ালপেপার'}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Mini Message Bubbles Simulation */}
                    <div className="relative z-10 flex flex-col gap-1.5 my-auto px-1">
                      <div className="flex justify-start">
                        <span className={`text-[9px] sm:text-[10px] font-medium px-2.5 py-1 rounded-xl ${theme.otherBubble} truncate max-w-[85%]`}>
                          কেমন আছেন?
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span className={`text-[9px] sm:text-[10px] font-medium px-2.5 py-1 rounded-xl ${theme.myBubble} truncate max-w-[85%]`}>
                          ভালো আছি!
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Independent Theme Information Bar */}
                  <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {theme.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {theme.description}
                      </p>
                    </div>
                    {isSelected ? (
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 shrink-0">
                        সক্রিয়
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-medium group-hover:text-emerald-600 shrink-0 transition">
                        নির্বাচন করুন
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            বর্তমানে সক্রিয়: <span className="font-bold text-emerald-600 dark:text-emerald-400">{CHAT_THEMES[currentTheme]?.name || 'ডিফল্ট'}</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
