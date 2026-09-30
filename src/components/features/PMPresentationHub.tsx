import React, { useState } from 'react';
import { X, Award, Eye, FileText, ChevronRight, ChevronLeft, CheckCircle, Clock, Users, Play, HelpCircle, Shield, Briefcase, HeartPulse, Sparkles, MapPin, MessageSquare } from 'lucide-react';

interface PMPresentationHubProps {
  onClose: () => void;
}

export const PMPresentationHub: React.FC<PMPresentationHubProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'deck' | 'script' | 'benefits' | 'time'>('deck');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "১. দূরদর্শী চিন্তা ও স্মার্ট সিটিজেনশিপ (Civic Vision)",
      tagline: "ডিজিটাল বাংলাদেশ থেকে স্মার্ট বাংলাদেশের অগ্রযাত্রা",
      description: "প্রযুক্তির আধুনিকায়নের মাধ্যমে নাগরিক সেবাকে সাধারণ মানুষের দোরগোড়ায় পৌঁছে দিয়ে সাতক্ষীরা জেলা তথা সমগ্র খুলনা বিভাগকে 'স্মার্ট জনপদে' রূপান্তর করাই এই প্ল্যাটফর্মের মূল লক্ষ্য।",
      points: [
        "সাতক্ষীরার প্রত্যন্ত অঞ্চলের জনগণের ডিজিটাল সেবা প্রাপ্তি নিশ্চিতকরণ।",
        "একটি সমন্বিত প্ল্যাটফর্মের মাধ্যমে সরকারি ও বেসরকারি ডিরেক্টরি হাতের মুঠোয় আনা।",
        "কমিউনিটি ইন্টারেকশন ও রিয়েল-টাইম তথ্যের মাধ্যমে জনসচেতনতা বৃদ্ধি।"
      ],
      icon: <Award className="text-amber-500 w-10 h-10" />
    },
    {
      title: "২. নাগরিক অধিকার ও সরাসরি অভিযোগ (Empowerment)",
      tagline: "স্বচ্ছতা ও জবাবদিহিতা নিশ্চিতকরণ",
      description: "জনসাধারণ এখন সরাসরি তাদের সমস্যা বা নাগরিক ভোগান্তির কথা জেলা প্রশাসনের কাছে ম্যাপ লোকেশন ও প্রমাণাদিসহ দাখিল করতে পারবে। এর ফলে সেবার মান উন্নত হবে ও জবাবদিহিতা বাড়বে।",
      points: [
        "ছবি ও সুনির্দিষ্ট কো-অর্ডিনেট সহ নাগরিক অভিযোগ সরাসরি সাবমিট।",
        "অ্যাডমিন প্যানেল থেকে দ্রুততম সময়ে অভিযোগ ট্র্যাকিং ও সমাধান প্রদানের ব্যবস্থা।",
        "কোনো মধ্যস্বত্বভোগী ছাড়াই সরাসরি কর্তৃপক্ষের সাথে যোগাযোগের মাধ্যমে নাগরিক ক্ষমতায়ন।"
      ],
      icon: <FileText className="text-indigo-500 w-10 h-10" />
    },
    {
      title: "৩. জরুরি স্বাস্থ্যসেবা ও জীবন বাঁচানোর তাগিদ (Emergency SOS)",
      tagline: "রক্তদান নেটওয়ার্ক ও দ্রুততম সেবা",
      description: "জরুরি মুহূর্তে ডাক্তার বা রক্তের সন্ধান করা অনেক জটিল ও কষ্টসাধ্য। এই অ্যাপের সাহায্যে সাতক্ষীরা জেলার যেকোনো মানুষ মাত্র কয়েক সেকেন্ডের মধ্যে জীবন রক্ষাকারী রক্ত এবং নিকটস্থ চিকিৎসকের সন্ধান পাবেন।",
      points: [
        "২৪/৭ রিয়েল-টাইম ব্লাড ডোনার ডেটাবেজ ও সরাসরি যোগাযোগের সুব্যবস্থা।",
        "বিশেষজ্ঞ ডাক্তার ও অ্যাম্বুলেন্সের তাৎক্ষণিক অফলাইন ও অনলাইন ডিরেক্টরি।",
        "জরুরি হেল্পলাইন নম্বরসমূহ অফলাইনেও ব্যবহারের সহজ সুযোগ।"
      ],
      icon: <HeartPulse className="text-red-500 w-10 h-10" />
    },
    {
      title: "৪. স্থানীয় অর্থনীতি ও স্বনির্ভর কর্মসংস্থান (Economic Growth)",
      tagline: "চাকরির সুযোগ ও জীবনযাত্রার মানোন্নয়ন",
      description: "সাতক্ষীরা জেলার স্থানীয় তরুণ-তরুণীদের জন্য কর্মসংস্থান সৃষ্টি এবং আবাসন সমস্যা সমাধানে এই অ্যাপটি সরাসরি ভূমিকা পালন করবে।",
      points: [
        "স্থানীয় ক্ষুদ্র ও মাঝারি ব্যবসায়ী এবং চাকরিদাতাদের সরাসরি নিয়োগের সুযোগ।",
        "উপজেলা ভিত্তিক চাকরির খোঁজ এবং অতি সহজে বায়োডাটা দাখিল।",
        "বাড়ি ভাড়া বা মেস (To-Let) খোঁজার ভোগান্তি দূর করে স্থানীয় পর্যায়ে আবাসন সহায়তা।"
      ],
      icon: <Briefcase className="text-amber-600 w-10 h-10" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-xl">
              <Award className="text-amber-300 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight font-serif">সাতক্ষীরা উন্নয়ন ও নাগরিক প্ল্যাটফর্ম প্রেজেন্টেশন</h1>
              <p className="text-[10px] sm:text-xs text-emerald-100 font-medium">শ্রদ্ধেয় সাবেক প্রধানমন্ত্রী মহোদয়ের সমীপে উপস্থাপনা নির্দেশিকা</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-950 p-2 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto scrollbar-none">
          <div className="flex space-x-1 sm:space-x-2 min-w-max">
            <button
              onClick={() => setActiveTab('deck')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'deck' 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles size={14} /> স্লাইড শো (Slide Deck)
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'script' 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileText size={14} /> উপস্থাপনা স্ক্রিপ্ট
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'benefits' 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Users size={14} /> নাগরিক সুবিধা
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'time' 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Clock size={14} /> সময় ও খরচ বাঁচানোর ছক
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* TAB 1: SLIDE DECK */}
          {activeTab === 'deck' && (
            <div className="h-full flex flex-col justify-between space-y-4">
              
              {/* Slide Card */}
              <div className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-md flex-1 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Award size={180} />
                </div>

                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800/40">
                    {slides[currentSlide].icon}
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                      {slides[currentSlide].tagline}
                    </span>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white font-serif mt-0.5">
                      {slides[currentSlide].title}
                    </h2>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 sm:mb-6">
                  {slides[currentSlide].description}
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">মূল বৈশিষ্ট্যাবলী ও ফায়দা:</h4>
                  {slides[currentSlide].points.map((point, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                        <CheckCircle size={10} className="text-emerald-700 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Controller */}
              <div className="flex items-center justify-between shrink-0 bg-white dark:bg-slate-850 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500">
                  স্লাইড: {currentSlide + 1} / {slides.length}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentSlide === 0}
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    className={`p-2 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                      currentSlide === 0 
                        ? 'opacity-30 cursor-not-allowed text-slate-400 border-slate-200' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentSlide === slides.length - 1}
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    className={`p-2 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                      currentSlide === slides.length - 1 
                        ? 'opacity-30 cursor-not-allowed text-slate-400 border-slate-200' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRESENTING SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-6">
              
              {/* Introduction section */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 flex items-start gap-3">
                <Sparkles className="text-emerald-700 dark:text-emerald-400 mt-1 shrink-0" size={18} />
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>উপস্থাপনা কৌশল:</strong> কথা বলার সময় আন্তরিকতা ও বিনয় বজায় রাখুন। এই অ্যাপটি সাতক্ষীরা তথা দেশের প্রতিটি মানুষের জীবনযাত্রাকে কীভাবে বদলে দেবে এবং ডিজিটাল বাংলাদেশকে স্মার্ট বাংলাদেশে রূপান্তর করবে, সে বিষয়ে প্রধানমন্ত্রীর দৃষ্টি আকর্ষণ করুন।
                </div>
              </div>

              {/* Script Breakdown */}
              <div className="space-y-5">
                <div className="bg-white dark:bg-slate-850 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-black">১. শুভেচ্ছা ও প্রারম্ভিক সম্ভাষণ</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif">
                    \"আসসালামু আলাইকুম মহোদয়। সাতক্ষীরার সাধারণ জনগণ এবং তরুণ প্রজন্মের পক্ষ থেকে আপনাকে জানাই সশ্রদ্ধ সালাম ও শুভেচ্ছা। সাতক্ষীরা জেলার উন্নয়ন ও তথ্যপ্রযুক্তির বিকাশে আপনার অবদান চিরস্মরণীয়। আজ আমি অত্যন্ত আনন্দের সাথে আপনার কাছে আমাদের তৈরি একটি যুগান্তকারী নাগরিক উদ্যোগ <strong>'স্মার্ট খুলনা ডিরেক্টরি'</strong> অ্যাপটি উপস্থাপন করতে চাই, যা সাতক্ষীরা জেলা সহ সমগ্র খুলনা অঞ্চলের নাগরিকদের জীবনে এক নতুন দিগন্ত উম্মোচন করবে।\"
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-black">২. মূল সেবার ব্যাখ্যা ও নাগরিক ক্ষমতায়ন</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif">
                    \"মহোদয়, এই অ্যাপটি কেবল একটি সাধারণ তথ্যের মাধ্যম নয়। এটি নাগরিকদের ক্ষমতায়ন করার একটি ডিজিটাল সেতু। এই অ্যাপের সাহায্যে সাতক্ষীরার একজন সাধারণ কৃষক বা সাধারণ গৃহিণীও কোনো মধ্যস্থতাকারী ছাড়া সরাসরি তার নাগরিক অভিযোগ জেলা বা উপজেলা প্রশাসনের কাছে পৌঁছে দিতে পারেন। তারা ছবির প্রমাণ এবং গুগল ম্যাপের লোকেশন সহ অভিযোগ দাখিল করতে পারেন, যা এডমিন প্যানেল থেকে তদারকি করা সম্ভব। এর ফলে কাজের স্বচ্ছতা ও জবাবদিহিতা শতভাগ নিশ্চিত হবে।\"
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-black">৩. জীবনরক্ষাকারী ফিচার (রক্ত ও ডাক্তার)</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif">
                    \"আমরা দেখেছি যে জরুরি অবস্থায় রোগীকে হাসপাতালে নিয়ে রক্ত বা সঠিক ডাক্তারের খোঁজ করতে মানুষ দিশেহারা হয়ে পড়ে। আমাদের অ্যাপে থাকা 'রক্তদান SOS' ও 'ডাক্তার তালিকা' ফিচারের মাধ্যমে সাতক্ষীরার মানুষ মাত্র কয়েক সেকেন্ডের মধ্যে রক্তদাতার মোবাইল নম্বর পেয়ে যান এবং সরাসরি যোগাযোগ করতে পারেন। অ্যাপটি সম্পূর্ণ অফলাইনেও জরুরি হেল্পলাইন ও কন্টাক্ট ডিরেক্টরি সাপোর্ট করে, যা ইন্টারনেট সংযোগ না থাকলেও মানুষের পাশে দাঁড়াবে।\"
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-850 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-3">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-black">৪. সময় সাশ্রয় ও সমাপনী বক্তব্য</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic font-serif">
                    \"মহোদয়, পূর্বে যে সেবাটি পেতে একজন নাগরিককে বহু কিলোমিটার পথ পাড়ি দিয়ে উপজেলা সদরে এসে ঘণ্টার পর ঘণ্টা অপেক্ষা করতে হতো, এই অ্যাপের মাধ্যমে তা এখন হাতের একটি ক্লিকেই সম্ভব। এটি একদিকে জনগণের মূল্যবান সময় বাঁচাবে, অন্যদিকে সরকারি প্রশাসনকে জনগণের আরও কাছে নিয়ে আসবে। এই উদ্যোগ সাতক্ষীরাকে একটি আদর্শ ডিজিটাল জনপদ হিসেবে গড়ে তুলতে বড় অবদান রাখবে। আপনার দিকনির্দেশনা ও শুভকামনা পেলে আমরা এই নাগরিক প্রযুক্তিকে আরও বড় পরিসরে নিয়ে যেতে পারব। ধন্যবাদ মহোদয়।\"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CITIZEN BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex gap-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl h-fit shrink-0 text-rose-600">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">তাৎক্ষণিক রক্তদান ও জীবন রক্ষা</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    জরুরি মুহূর্তে কোনো দালালের খপ্পরে না পড়ে সরাসরি সাতক্ষীরার স্বেচ্ছাসেবী রক্তদাতাদের তালিকা থেকে নির্দিষ্ট রক্তের গ্রুপের ডোনার খুঁজে ফোন করতে পারবেন। এতে জীবন বাঁচানো সহজ ও দ্রুত হবে।
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl h-fit shrink-0 text-indigo-600">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">সরাসরি নাগরিক অভিযোগ</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    রাস্তাঘাট ভাঙা, ময়লা জমে থাকা বা প্রশাসনিক দুর্নীতি ও অবহেলার বিরুদ্ধে নাগরিকরা সরাসরি ছবি সহ অভিযোগ জানাতে পারেন। এটি স্থানীয় প্রশাসনের স্বচ্ছতা বৃদ্ধি করে।
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex gap-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl h-fit shrink-0 text-amber-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">চাকরি ও উপার্জনের সুযোগ</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    সাতক্ষীরার শিক্ষিত ও বেকার তরুণরা কোথাও না ঘুরে সরাসরি ঘরের পাশে থাকা স্থানীয় দোকান, ক্লিনিক বা প্রতিষ্ঠানে চাকরির খবর জানতে পারেন এবং যোগাযোগ করতে পারেন।
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl h-fit shrink-0 text-emerald-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">সহজ ও বোধগম্য বাংলা ইন্টারফেস</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    যাঁরা বেশি ইংরেজি পড়তে পারেন না, তাঁদের জন্য সম্পূর্ণ অ্যাপটি বাংলায় ডিজাইন করা হয়েছে। বড় ফন্ট ও স্পষ্ট আইকন ব্যবহারের কারণে এটি সব বয়সের মানুষের উপযোগী।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIME SAVING */}
          {activeTab === 'time' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif mb-3">ঐতিহ্যগত সেবা বনাম স্মার্ট অ্যাপ সেবা (সময় সাশ্রয় তুলনা)</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-[10px] text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">সেবার ক্ষেত্র</th>
                        <th className="px-4 py-3">ম্যানুয়াল সময়</th>
                        <th className="px-4 py-3">স্মার্ট অ্যাপ সময়</th>
                        <th className="px-4 py-3 rounded-r-lg">সাশ্রয়কৃত সময় ও ফায়দা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">জরুরি রক্ত জোগাড়</td>
                        <td className="px-4 py-3 text-red-600">৩ থেকে ৬ ঘণ্টা (অফিসে বা আত্মীয়দের ঘরে খোঁজ)</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">১০ থেকে ১৫ সেকেন্ড (ক্লিক ও সরাসরি ফোন)</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">শতভাগ সময় বাঁচবে, রোগীর জীবন রক্ষা সহজ হবে।</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">নাগরিক অভিযোগ দাখিল</td>
                        <td className="px-4 py-3 text-red-600">১ থেকে ৩ দিন (দরখাস্ত লিখে জেলা কার্যালয়ে জমা)</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">২ মিনিট (ছবি তুলুন ও অভিযোগ পাঠান)</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">কোনো যাতায়াত বা হয়রানি নেই, বাড়িতে বসেই সমাধান।</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">জরুরি ডাক্তার অনুসন্ধান</td>
                        <td className="px-4 py-3 text-red-600">২ থেকে ৪ ঘণ্টা (ক্লিনিক বা চেম্বারে গিয়ে ভিড় ঠেলে খোঁজ)</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">১ মিনিট (অ্যাপ ডিরেক্টরি)</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">সহজেই চেম্বার বা ফোন নম্বর সংগ্রহ এবং বুকিং।</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">চাকরির সুযোগ খোঁজা</td>
                        <td className="px-4 py-3 text-red-600">কয়েক দিন (অফিস বা লিফলেট দেখে খোঁজ)</td>
                        <td className="px-4 py-3 text-emerald-600 font-bold">৫ মিনিট (অ্যাপ দিয়ে ফিল্টার)</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">স্থানীয় যুবকদের জন্য তাৎক্ষণিক কর্মসংস্থান সুবিধা।</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-emerald-950 text-emerald-200 p-5 rounded-2xl border border-emerald-800 shadow-md">
                <h4 className="text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle size={14} className="text-amber-400" />
                  সারসংক্ষেপ: নাগরিকের প্রায় ৯০% সময় বাঁচবে!
                </h4>
                <p className="text-[11px] leading-relaxed">
                  ম্যানুয়াল পদ্ধতিতে প্রতিটি সেবার জন্য অর্থ, সময় ও মানসিক ধকল পোহাতে হতো। কিন্তু স্মার্ট খুলনা/সাতক্ষীরা অ্যাপের সমন্বিত ডিরেক্টরি ও অভিযোগ ব্যবস্থাপনা ডিজিটাল টুলস ব্যবহার করে প্রতিটি নাগরিকের সময় অপচয় এবং যাতায়াত খরচকে সম্পূর্ণরূপে শূন্যের কোঠায় নিয়ে আসা সম্ভব।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            © স্মার্ট বাংলাদেশ ডেমো প্ল্যাটফর্ম · জেলা নাগরিক কল্যাণ সেল
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};

export default PMPresentationHub;
