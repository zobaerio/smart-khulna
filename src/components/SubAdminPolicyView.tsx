import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Bot,
  KeyRound,
  Crown,
  FileCheck2,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  Search,
  BookOpen,
  Printer,
  Sparkles,
  Users,
  MapPin,
  Clock,
  History,
  Info
} from 'lucide-react';

interface SubAdminPolicyViewProps {
  onClose?: () => void;
  onOpenAIAssistant?: () => void;
}

export const SubAdminPolicyView: React.FC<SubAdminPolicyViewProps> = ({
  onClose,
  onOpenAIAssistant
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const policySections = [
    {
      id: 1,
      title: '১. উদ্দেশ্য (Purpose)',
      icon: <Compass className="text-emerald-500" size={20} />,
      badge: 'মৌলিক লক্ষ্য',
      content: (
        <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-sm">
          <p>
            Smart Khulna অ্যাপের তথ্য, স্থানীয় সেবা ও ব্যবহারকারীদের কার্যক্রম সঠিকভাবে পরিচালনা, যাচাই ও আপডেট রাখার জন্য প্রয়োজন অনুযায়ী <strong>Sub Admin এবং Moderator</strong> নিয়োগ করা হবে।
          </p>
          <p className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-300 font-medium">
            🎯 তাদের মূল লক্ষ্য হবে Smart Khulna-কে একটি <strong>নির্ভরযোগ্য, আপডেটেড ও স্থানীয় Digital Service & Information Platform</strong> হিসেবে পরিচালনায় সহায়তা করা।
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: '২. Sub Admin-এর দায়িত্ব (Sub-Admin Responsibilities)',
      icon: <Shield className="text-blue-500" size={20} />,
      badge: 'লোকাল সার্ভিস ও ডেটা',
      content: (
        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p className="font-semibold text-slate-900 dark:text-white">
            Sub Admin নির্ধারিত এলাকা বা দায়িত্ব অনুযায়ী—
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'নতুন সার্ভিস/সেবা ও প্রতিষ্ঠান যুক্ত করতে পারবেন।',
              'স্থানীয় ব্যবসা, প্রতিষ্ঠান ও জনসেবামূলক তথ্য সংগ্রহ করতে পারবেন।',
              'সংগৃহীত তথ্য যাচাই করে অ্যাপে যুক্ত বা আপডেট করতে পারবেন।',
              'পুরোনো বা পরিবর্তিত তথ্য সংশোধন করতে পারবেন।',
              'ব্যবহারকারীদের পোস্ট ও সার্ভিসের তথ্য পর্যবেক্ষণ করতে পারবেন।',
              'ভুল, অসম্পূর্ণ, ডুপ্লিকেট বা অনুপযুক্ত তথ্য শনাক্ত করতে পারবেন।',
              'নির্ধারিত এলাকার নতুন গুরুত্বপূর্ণ তথ্য সংগ্রহ করতে পারবেন।',
              'Admin-এর অনুমোদিত AI Tools ব্যবহার করে তথ্য সংগ্রহ, সাজানো, যাচাই ও বিশ্লেষণে সহায়তা করতে পারবেন।'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 3,
      title: '৩. Moderator-এর দায়িত্ব (Moderator Responsibilities)',
      icon: <ShieldAlert className="text-indigo-500" size={20} />,
      badge: 'কমিউনিটি ও কনটেন্ট',
      content: (
        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p className="font-semibold text-slate-900 dark:text-white">
            Moderator-এর প্রধান দায়িত্ব হবে অ্যাপের তথ্য ও ব্যবহারকারীদের কার্যক্রম পর্যবেক্ষণ করা। তারা—
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'ব্যবহারকারীদের পোস্ট ও কমিউনিটি কার্যক্রম মনিটর করবেন।',
              'অনুপযুক্ত, ভুল বা বিভ্রান্তিকর কনটেন্ট শনাক্ত করবেন।',
              'প্রয়োজন অনুযায়ী রিপোর্ট তৈরি ও সমাধান করবেন।',
              'সার্ভিস ও পোস্টের তথ্য যাচাইয়ে সহায়তা করবেন।',
              'নির্ধারিত দায়িত্ব অনুযায়ী তথ্য সংগ্রহ ও আপডেট করবেন।',
              'AI-এর সহায়তায় তথ্য সাজানো, যাচাই ও রিপোর্ট তৈরির কাজে সহযোগিতা করবেন।'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 4,
      title: '৪. AI ব্যবহার নীতিমালা (AI Usage Guidelines)',
      icon: <Bot className="text-amber-500" size={20} />,
      badge: 'কঠোর সতকর্তা',
      content: (
        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p>
            Smart Khulna-এর Sub Admin ও Moderator-রা অনুমোদিত <strong>AI Tools</strong> ব্যবহার করে নিচের কাজগুলোতে সহায়তা নিতে পারবেন:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              'তথ্য সংগঠিত করা',
              'ডুপ্লিকেট তথ্য শনাক্ত করা',
              'তথ্যের অসঙ্গতি খুঁজে বের করা',
              'সার্ভিসের তথ্য সাজানো',
              'রিপোর্ট তৈরি করা',
              'প্রয়োজনীয় তথ্যের প্রাথমিক যাচাই'
            ].map((feature, idx) => (
              <div key={idx} className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 rounded-xl space-y-1.5 text-rose-950 dark:text-rose-200">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-700 dark:text-rose-400 uppercase tracking-wide">
              <AlertTriangle size={16} />
              <span>কঠোর বিধিনিষেধ ও নিষেধাজ্ঞা</span>
            </div>
            <p className="text-xs leading-relaxed font-semibold">
              ⚠️ তবে AI কোনো তথ্য তৈরি বা অনুমান করে অ্যাপে প্রকাশ করতে পারবে না। প্রয়োজনীয় তথ্য <strong>বাস্তব ও যাচাইযোগ্য উৎসের ভিত্তিতে</strong> সংগ্রহ করতে হবে।
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '৫. Access & Permission (অ্যাক্সেস ও পারমিশন)',
      icon: <KeyRound className="text-emerald-600" size={20} />,
      badge: 'নির্দিষ্ট সীমা',
      content: (
        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p>
            প্রত্যেক Sub Admin বা Moderator-এর জন্য প্রয়োজন অনুযায়ী নির্দিষ্ট Permission দেওয়া হবে।
          </p>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-900 dark:text-white mb-2">Permission হতে পারে—</p>
            <div className="flex flex-wrap gap-2">
              {[
                '📍 নির্দিষ্ট জেলা',
                '🏛️ নির্দিষ্ট উপজেলা',
                '📂 নির্দিষ্ট Service Category',
                '📝 নির্দিষ্ট Content Management',
                '🛡️ নির্দিষ্ট Moderation কার্যক্রম',
                '🔍 নির্দিষ্ট Information Collection'
              ].map((scope, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium">
                  {scope}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900">
            🚫 একজন Sub Admin বা Moderator তার অনুমোদিত Permission-এর বাইরে কোনো গুরুত্বপূর্ণ পরিবর্তন করতে পারবেন না।
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: '৬. Super Admin-এর ক্ষমতা (Super Admin Authority)',
      icon: <Crown className="text-amber-500" size={20} />,
      badge: 'সর্বোচ্চ নিয়ন্ত্রণ',
      content: (
        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p className="font-semibold text-slate-900 dark:text-white">
            <strong>Super Admin</strong> Smart Khulna-এর সর্বোচ্চ প্রশাসনিক নিয়ন্ত্রণে থাকবেন। Super Admin প্রয়োজন অনুযায়ী—
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Sub Admin / Moderator নিয়োগ করতে পারবেন',
              'তাদের Permission নির্ধারণ করতে পারবেন',
              'Permission পরিবর্তন বা আপডেট করতে পারবেন',
              'Access সাময়িকভাবে বন্ধ (Suspend/Lock) করতে পারবেন',
              'Role পরিবর্তন বা বাতিল করতে পারবেন',
              'তাদের সার্বিক কার্যক্রম পর্যবেক্ষণ করতে পারবেন',
              'প্রয়োজন হলে যেকোনো তথ্য Edit, Update বা Remove করতে পারবেন'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-amber-500/5 border border-amber-500/15 rounded-lg text-xs">
                <Crown size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: '৭. Activity Log (অ্যাক্টিভিটি লগ ও স্বচ্ছতা)',
      icon: <History className="text-purple-500" size={20} />,
      badge: 'জবাবদিহিতা',
      content: (
        <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p>
            Smart Khulna-এর নিরাপত্তা ও স্বচ্ছতা বজায় রাখতে গুরুত্বপূর্ণ প্রশাসনিক কার্যক্রমের <strong>Activity Log</strong> সংরক্ষণ করা হবে।
          </p>
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl space-y-2">
            <p className="text-xs font-bold text-purple-900 dark:text-purple-300">লগ ট্র্যাকিং প্যাটার্ন:</p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold text-purple-950 dark:text-purple-200 bg-white dark:bg-purple-900/40 p-2.5 rounded-lg border border-purple-200 dark:border-purple-700">
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800 rounded">কে (User)</span>
              <span>➔</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800 rounded">কী পরিবর্তন করেছে (Action)</span>
              <span>➔</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800 rounded">কখন করেছে (Timestamp)</span>
              <span>➔</span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-800 rounded">কোন তথ্য পরিবর্তন করেছে (Target)</span>
            </div>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 pt-1">
              🔒 এই লগগুলো সম্পূর্ণ অপরিবর্তনযোগ্য এবং Super Admin যেকোনো সময় নিরীক্ষা করতে পারবেন।
            </p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: '৮. দায়িত্বশীলতা ও আচরণবিধি (Ethics & Accountability)',
      icon: <FileCheck2 className="text-rose-500" size={20} />,
      badge: 'নৈতিকতা',
      content: (
        <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-serif">
          <p className="font-semibold text-slate-900 dark:text-white">
            Sub Admin ও Moderator-কে দায়িত্ব পালনের সময় <strong>নির্ভরযোগ্য ও যাচাইযোগ্য তথ্য</strong> ব্যবহার করতে হবে।
          </p>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-900 dark:text-rose-300 space-y-1">
            <p className="font-bold">⚠️ কঠোর সতর্কবার্তা:</p>
            <p>ইচ্ছাকৃতভাবে ভুল, ভুয়া, বিভ্রান্তিকর বা অনুমোদনহীন তথ্য যুক্ত করা যাবে না। নীতিমালা লঙ্ঘনে তাৎক্ষণিক পদ বাতিল ও শাস্তিমূলক ব্যবস্থা নেওয়া হবে।</p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: '৯. মূল নীতি (Core Mission Creed)',
      icon: <Sparkles className="text-emerald-500" size={20} />,
      badge: 'মূল স্লোগান',
      content: (
        <div className="space-y-3 leading-relaxed font-serif">
          <div className="p-4 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl border-2 border-amber-400/50 shadow-lg text-center space-y-2">
            <div className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-mono font-black uppercase tracking-widest rounded-full">
              অফিসিয়াল নীতিবাক্য
            </div>
            <h4 className="text-base sm:text-lg font-black text-amber-200 tracking-wide font-sans">
              “Collect Local. Verify Carefully. Update Regularly. Serve Better.”
            </h4>
            <p className="text-xs text-emerald-100 max-w-xl mx-auto leading-relaxed pt-1">
              Smart Khulna-এর Sub Admin ও Moderator টিমের মূল উদ্দেশ্য হবে <strong>স্থানীয় বাস্তব তথ্য সংগ্রহ, যাচাই ও নিয়মিত আপডেটের মাধ্যমে খুলনা বিভাগের মানুষের জন্য একটি নির্ভরযোগ্য ডিজিটাল সেবা প্ল্যাটফর্ম তৈরি করা।</strong>
            </p>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = policySections.filter(section => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(q) ||
      section.badge.toLowerCase().includes(q)
    );
  });

  const fullPolicyText = `# Smart Khulna
## Sub Admin & Moderator Policy

### ১. উদ্দেশ্য
Smart Khulna অ্যাপের তথ্য, স্থানীয় সেবা ও ব্যবহারকারীদের কার্যক্রম সঠিকভাবে পরিচালনা, যাচাই ও আপডেট রাখার জন্য প্রয়োজন অনুযায়ী Sub Admin এবং Moderator নিয়োগ করা হবে।
তাদের মূল লক্ষ্য হবে Smart Khulna-কে একটি নির্ভরযোগ্য, আপডেটেড ও স্থানীয় Digital Service & Information Platform হিসেবে পরিচালনায় সহায়তা করা।

### ২. Sub Admin-এর দায়িত্ব
Sub Admin নির্ধারিত এলাকা বা দায়িত্ব অনুযায়ী—
* নতুন সার্ভিস/সেবা ও প্রতিষ্ঠান যুক্ত করতে পারবেন।
* স্থানীয় ব্যবসা, প্রতিষ্ঠান ও জনসেবামূলক তথ্য সংগ্রহ করতে পারবেন।
* সংগৃহীত তথ্য যাচাই করে অ্যাপে যুক্ত বা আপডেট করতে পারবেন।
* পুরোনো বা পরিবর্তিত তথ্য সংশোধন করতে পারবেন।
* ব্যবহারকারীদের পোস্ট ও সার্ভিসের তথ্য পর্যবেক্ষণ করতে পারবেন।
* ভুল, অসম্পূর্ণ, ডুপ্লিকেট বা অনুপযুক্ত তথ্য শনাক্ত করতে পারবেন।
* নির্ধারিত এলাকার নতুন গুরুত্বপূর্ণ তথ্য সংগ্রহ করতে পারবেন।
* Admin-এর অনুমোদিত AI Tools ব্যবহার করে তথ্য সংগ্রহ, সাজানো, যাচাই ও বিশ্লেষণে সহায়তা করতে পারবেন।

### ৩. Moderator-এর দায়িত্ব
Moderator-এর প্রধান দায়িত্ব হবে অ্যাপের তথ্য ও ব্যবহারকারীদের কার্যক্রম পর্যবেক্ষণ করা।
তারা—
* ব্যবহারকারীদের পোস্ট ও কমিউনিটি কার্যক্রম মনিটর করবেন।
* অনুপযুক্ত, ভুল বা বিভ্রান্তিকর কনটেন্ট শনাক্ত করবেন।
* প্রয়োজন অনুযায়ী রিপোর্ট তৈরি করবেন।
* সার্ভিস ও পোস্টের তথ্য যাচাইয়ে সহায়তা করবেন।
* নির্ধারিত দায়িত্ব অনুযায়ী তথ্য সংগ্রহ ও আপডেট করবেন।
* AI-এর সহায়তায় তথ্য সাজানো, যাচাই ও রিপোর্ট তৈরির কাজে সহযোগিতা করবেন।

### ৪. AI ব্যবহার
Smart Khulna-এর Sub Admin ও Moderator-রা অনুমোদিত AI Tools ব্যবহার করে—
* তথ্য সংগঠিত করা
* ডুপ্লিকেট তথ্য শনাক্ত করা
* তথ্যের অসঙ্গতি খুঁজে বের করা
* সার্ভিসের তথ্য সাজানো
* রিপোর্ট তৈরি করা
* প্রয়োজনীয় তথ্যের প্রাথমিক যাচাই
ইত্যাদি কাজে সহায়তা নিতে পারবেন।
তবে AI কোনো তথ্য তৈরি বা অনুমান করে অ্যাপে প্রকাশ করতে পারবে না। প্রয়োজনীয় তথ্য বাস্তব ও যাচাইযোগ্য উৎসের ভিত্তিতে সংগ্রহ করতে হবে।

### ৫. Access & Permission
প্রত্যেক Sub Admin বা Moderator-এর জন্য প্রয়োজন অনুযায়ী নির্দিষ্ট Permission দেওয়া হবে।
Permission হতে পারে—
* নির্দিষ্ট জেলা
* নির্দিষ্ট উপজেলা
* নির্দিষ্ট Service Category
* নির্দিষ্ট Content Management
* নির্দিষ্ট Moderation কার্যক্রম
* নির্দিষ্ট Information Collection
একজন Sub Admin বা Moderator তার অনুমোদিত Permission-এর বাইরে কোনো গুরুত্বপূর্ণ পরিবর্তন করতে পারবেন না।

### ৬. Super Admin-এর ক্ষমতা
Super Admin Smart Khulna-এর সর্বোচ্চ প্রশাসনিক নিয়ন্ত্রণে থাকবেন।
Super Admin প্রয়োজন অনুযায়ী—
* Sub Admin / Moderator নিয়োগ করতে পারবেন
* তাদের Permission নির্ধারণ করতে পারবেন
* Permission পরিবর্তন করতে পারবেন
* Access সাময়িকভাবে বন্ধ করতে পারবেন
* Role পরিবর্তন বা বাতিল করতে পারবেন
* তাদের কার্যক্রম পর্যবেক্ষণ করতে পারবেন
* প্রয়োজন হলে যেকোনো তথ্য Edit, Update বা Remove করতে পারবেন

### ৭. Activity Log
Smart Khulna-এর নিরাপত্তা ও স্বচ্ছতা বজায় রাখতে গুরুত্বপূর্ণ প্রশাসনিক কার্যক্রমের Activity Log সংরক্ষণ করা হবে।
যেমন—
কে → কী পরিবর্তন করেছে → কখন করেছে → কোন তথ্য পরিবর্তন করেছে
এগুলো প্রয়োজন অনুযায়ী Super Admin দেখতে পারবেন।

### ৮. দায়িত্বশীলতা
Sub Admin ও Moderator-কে দায়িত্ব পালনের সময় নির্ভরযোগ্য ও যাচাইযোগ্য তথ্য ব্যবহার করতে হবে।
ইচ্ছাকৃতভাবে ভুল, ভুয়া, বিভ্রান্তিকর বা অনুমোদনহীন তথ্য যুক্ত করা যাবে না।

### ৯. মূল নীতি
“Collect Local. Verify Carefully. Update Regularly. Serve Better.”
Smart Khulna-এর Sub Admin ও Moderator টিমের মূল উদ্দেশ্য হবে স্থানীয় বাস্তব তথ্য সংগ্রহ, যাচাই ও নিয়মিত আপডেটের মাধ্যমে খুলনা বিভাগের মানুষের জন্য একটি নির্ভরযোগ্য ডিজিটাল সেবা প্ল্যাটফর্ম তৈরি করা।`;

  const handleCopyPolicy = () => {
    try {
      navigator.clipboard.writeText(fullPolicyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('পলিসি কপি করা সম্ভব হয়নি।');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Shield size={220} />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-500/20 text-lime-300 border border-emerald-400/30 rounded-xl">
                <BookOpen size={20} />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Official Administrative Governance
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-serif text-white">
                  Smart Khulna — Sub Admin & Moderator Policy
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPolicy}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                title="পুরো পলিসি টেক্সট কপি করুন"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'কপি হয়েছে!' : 'পলিসি কপি'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                title="প্রিন্ট করুন"
              >
                <Printer size={14} />
                <span>প্রিন্ট</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl font-serif">
            স্মার্ট খুলনা প্ল্যাটফর্মের তথ্য সংগ্রহ, নির্ভুলতা যাচাই, কমিউনিটি মনিটরিং এবং নিরাপদ ডিজিটাল সেবা নিশ্চিতকরণে সাব-এডমিন ও মডারেটরদের জন্য প্রযোজ্য আইনানুগ নীতিমালা ও আচরণবিধি।
          </p>

          {/* Creed Banner */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold shadow-inner">
              <Sparkles size={13} className="text-amber-300 shrink-0" />
              <span>“Collect Local. Verify Carefully. Update Regularly. Serve Better.”</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Role Comparison & Hierarchy Quick-Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Crown size={15} /> Super Admin
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
              সর্বোচ্চ নিয়ন্ত্রণ
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            সম্পূর্ণ প্ল্যাটফর্ম নিয়ন্ত্রণ, Sub-Admin ও Moderator নিয়োগ, অনুমতি পরিবর্তন, সাময়িক সাসপেনশন এবং সমগ্র সিস্টেম অডিট।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-950/20 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-800 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Shield size={15} /> Sub Admin
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
              সার্ভিস ও ফিল্ড ডেটা
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            নির্ধারিত জেলা/উপজেলায় নতুন সেবা যুক্ত, তথ্য সংগ্রহ, যাচাই, ডুপ্লিকেট শনাক্ত ও অনুমোদিত AI দিয়ে ডেটা সংগঠিতকরণ।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/20 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert size={15} /> Moderator
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold">
              কমিউনিটি ও রিপোর্ট
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            ব্যবহারকারীদের পোস্ট ও কার্যক্রম মনিটরিং, অনুপযুক্ত কনটেন্ট সনাক্ত, রিপোর্ট তৈরি ও সমাধান এবং সহায়তামূলক যাচাই।
          </p>
        </div>
      </div>

      {/* 3. Search / Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="নীতিমালার ধারা বা দায়িত্ব খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenAIAssistant && (
            <button
              onClick={onOpenAIAssistant}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Bot size={15} />
              <span>অনুমোদিত AI ভেরিফিকেশন টুল খুলুন</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Policy Sections Accordion / Cards */}
      <div className="space-y-4">
        {filteredSections.map(section => {
          const isOpen = activeSection === section.id || searchQuery.trim().length > 0;
          return (
            <div
              key={section.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800/80 transition"
            >
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                      {section.title}
                    </h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {section.badge}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {isOpen ? 'সংকুচিত করুন ▲' : 'বিস্তারিত দেখুন ▼'}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Footer Affirmation */}
      <div className="text-center p-6 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <p className="text-xs text-slate-600 dark:text-slate-400 font-serif leading-relaxed">
          স্মার্ট খুলনা পরিচালনা কমিটি কর্তৃক প্রণীত ও অনুমোদিত। সকল সাব-এডমিন ও মডারেটর এই নীতিমালার সকল ধারা মানতে বাধ্য।
        </p>
        <p className="text-[10px] font-mono text-slate-400">
          সর্বশেষ হালনাগাদ: সেপ্টেম্বর ২০২৬ | Smart Khulna Governance Board
        </p>
      </div>
    </div>
  );
};

export default SubAdminPolicyView;
