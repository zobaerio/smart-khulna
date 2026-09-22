import React, { useState } from 'react';
import { Compass, MapPin, Calendar, Clock, DollarSign, Phone, ExternalLink, X, Search, Star, Info, Shield, Users } from 'lucide-react';

interface TouristSpot {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  category: 'heritage' | 'nature' | 'cultural' | 'liberation';
  image: string;
  tagline: string;
  description: string;
  bestTime: string;
  entryFee: string;
  howToReach: string;
  contacts: { label: string; phone: string }[];
  highlights: string[];
}

const TOURIST_SPOTS: TouristSpot[] = [
  {
    id: 'sundarbans-karamjal',
    name: 'সুন্দরবন ও করমজল পর্যটন কেন্দ্র',
    districtId: 'khulna',
    districtName: 'খুলনা / বাগেরহাট',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    tagline: 'ইউনেস্কো বিশ্ব ঐতিহ্য ও রয়েল বেঙ্গল টাইগারের প্রাকৃতিক আবাসভূমি',
    description: 'বিশ্বের বৃহত্তম ম্যানগ্রোভ অরণ্য সুন্দরবনের প্রবেশদ্বার করমজল। এখানে রয়েছে হরিণ ও বিলুপ্তপ্রায় লবণাক্ত পানির কুমির প্রজনন কেন্দ্র এবং কাঠের তৈরি দীর্ঘ ফুট ট্রেইল।',
    bestTime: 'নভেম্বর থেকে মার্চ (শীতকাল)',
    entryFee: 'দেশি পর্যটক: ৫০ টাকা, বিদেশি: ৫০০ টাকা (+ভ্যাট ও গাইড ফি)',
    howToReach: 'খুলনা বা মোংলা ফেরিঘাট থেকে ট্রলার বা ইঞ্জিনচালিত বোটে মাত্র ১-১.৫ ঘণ্টায় পৌঁছানো যায়।',
    contacts: [
      { label: 'বন বিভাগ মোংলা রেঞ্জ', phone: '04662-75123' },
      { label: 'খুলনা ট্যুরিস্ট গাইড সমিতি', phone: '01711-889900' }
    ],
    highlights: ['রয়েল বেঙ্গল টাইগার ট্র্যাকিং', 'কুমির ও চিত্রা হরিণ', 'সুউচ্চ ওয়াচ টাওয়ার', 'ম্যানগ্রোভ কাঠের হাঁটাপথ']
  },
  {
    id: 'bagerhat-sixty-dome',
    name: 'ষাট গম্বুজ মসজিদ (Sixty Dome Mosque)',
    districtId: 'bagerhat',
    districtName: 'বাগেরহাট',
    category: 'heritage',
    image: 'https://images.unsplash.com/photo-1590076212555-52e69317528e?w=800&auto=format&fit=crop&q=80',
    tagline: '১৫ শতকের ইউনেস্কো বিশ্ব ঐতিহ্যবাহী মুসলিম স্থাপত্য নিদর্শন',
    description: 'হযরত খান জাহান আলী (রহ:) কর্তৃক নির্মিত বাংলাদেশের অন্যতম প্রাচীন ও সুরক্ষিত ইসলামিক স্থাপত্য। এতে ৭৭টি গম্বুজ ও চমৎকার পোড়ামাটির অলংকরণ রয়েছে।',
    bestTime: 'সারা বছরই ভ্রমণের উপযোগী',
    entryFee: 'বাংলাদেশি: ৩০ টাকা, সার্কভুক্ত: ১০০ টাকা, বিদেশি: ২০০ টাকা',
    howToReach: 'খুলনা রূপসা ব্রিজ পার হয়ে বাগেরহাট বাস বা সিএনজিতে মাত্র ৪৫ মিনিট।',
    contacts: [
      { label: 'প্রত্নতত্ত্ব অধিদপ্তর বাগেরহাট', phone: '0468-62345' },
      { label: 'বাগেরহাট ট্যুরিজম ইনফো', phone: '01712-998877' }
    ],
    highlights: ['ইউনেস্কো ওয়ার্ল্ড হেরিটেজ', 'খানজাহান আলীর দীঘি ও কুমির', 'সংলগ্ন জাদুঘর', 'ঐতিহাসিক স্থাপত্য']
  },
  {
    id: 'mujibnagar-memorial',
    name: 'মুজিবনগর মুক্তিযুদ্ধ স্মৃতিসৌধ',
    districtId: 'meherpur',
    districtName: 'মেহেরপুর',
    category: 'liberation',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80',
    tagline: 'বাংলাদেশের প্রথম স্বাধীন সরকারের শপথ গ্রহণের ঐতিহাসিক স্মৃতিবিজড়িত প্রাঙ্গণ',
    description: '১৯৭১ সালের ১৭ এপ্রিল বাংলাদেশের প্রথম সরকার এখানে শপথ গ্রহণ করে। বিশাল কমপ্লেক্সে মুক্তিযুদ্ধ জাদুঘর, ত্রিমাত্রিক ভাস্কর্য ও মানচিত্রের মাধ্যমে মুক্তিযুদ্ধের ১১টি সেক্টর ও যুদ্ধের ইতিহাস প্রদর্শন করা হয়েছে।',
    bestTime: 'অক্টোবর থেকে এপ্রিল',
    entryFee: 'বিনামূল্যে প্রবেশ (জাদুঘর ২০ টাকা)',
    howToReach: 'মেহেরপুর জেলা শহর থেকে বাস বা অটোরিকশায় মুজিবনগর কমপ্লেক্সে যাওয়া যায় (দূরত্ব মাত্র ১৫ কিমি)।',
    contacts: [
      { label: 'মুজিবনগর কমপ্লেক্স প্রশাসন', phone: '0792-62201' },
      { label: 'মেহেরপুর জেলা তথ্য অফিস', phone: '01711-224466' }
    ],
    highlights: ['ঐতিহাসিক শপথ মঞ্চ', '২৩ স্তম্ভের স্মৃতিসৌধ', 'বিশাল ৩ডি মুক্তিযুদ্ধ মানচিত্র', 'আম্রকানন']
  },
  {
    id: 'kushtia-shilaidaha',
    name: 'রবীন্দ্রনাথ ঠাকুরের শিলাইদহ কুঠিবাড়ি',
    districtId: 'kushtia',
    districtName: 'কুষ্টিয়া',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    tagline: 'বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের নোবেলজয়ী গীতাঞ্জলির রচনাস্থল',
    description: 'পদ্মা নদীর তীরে অবস্থিত তিনতলা বিশিষ্ট সুরম্য কুঠিবাড়ি। রবীন্দ্রনাথ ঠাকুর এখানে দীর্ঘ সময় অবস্থান করেন এবং ‘সোনার তরী’, ‘চিত্রা’, ‘চৈতালি’ ও ‘গীতাঞ্জলি’র বহু কবিতা রচনা করেন।',
    bestTime: 'সারা বছর',
    entryFee: 'দেশি: ৩০ টাকা, বিদেশি: ২০০ টাকা',
    howToReach: 'কুষ্টিয়া শহর থেকে পদ্মার পাড় ধরে কুমারখালী উপজেলার শিলাইদহে সিএনজি বা অটোতে ২০-২৫ মিনিট।',
    contacts: [
      { label: 'কুঠিবাড়ি কাস্টোডিয়ান অফিস', phone: '071-71401' },
      { label: 'কুষ্টিয়া পর্যটন সেন্টার', phone: '01819-556677' }
    ],
    highlights: ['কবিগুরুর ব্যবহৃত পদ্মা বোটের অবশিষ্টাংশ', 'কবিগুরুর পালকি ও আসবাবপত্র', 'বকুলতলা', 'পদ্মার নান্দনিক সূর্যাস্ত']
  },
  {
    id: 'jashore-sagardari',
    name: 'মাইকেল মধুসূদন দত্তের বাড়ি (সাগরদাঁড়ি)',
    districtId: 'jashore',
    districtName: 'যশোর',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    tagline: 'বাংলা সাহিত্যের প্রথম আধুনিক ও মহাকবি মাইকেল মধুসূদন দত্তের জন্মভিটা',
    description: 'কপোতাক্ষ নদের তীরে অবস্থিত মহাকবি মাইকেল মধুসূদন দত্তের জমিদার বাড়ি। প্রতি বছর মাঘ মাসে এখানে সপ্তাহব্যাপী ঐতিহ্যবাহী মধুমেলার আয়োজন হয়।',
    bestTime: 'ডিসেম্বর থেকে ফেব্রুয়ারি (বিশেষ করে মধুমেলার সময়)',
    entryFee: 'দেশি পর্যটক: ২৫ টাকা',
    howToReach: 'যশোর শহর থেকে কেশবপুর উপজেলা হয়ে সাগরদাঁড়ি সিএনজি বা বাসে যাওয়া যায় (দূরত্ব ৪৫ কিমি)।',
    contacts: [
      { label: 'মধুসূদন স্মৃতি জাদুঘর', phone: '0421-65432' }
    ],
    highlights: ['কপোতাক্ষ নদের স্মৃতি ঘাট', 'কবিগুরুর বংশপরম্পরার স্মৃতিচিহ্ন', 'বার্ষিক মধুমেলা', 'মনোরম বাগান']
  },
  {
    id: 'lalon-akhra',
    name: 'বাউল সম্রাট লালন শাহের মাজার',
    districtId: 'kushtia',
    districtName: 'কুষ্টিয়া',
    category: 'cultural',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    tagline: 'মানবতাবাদী সুফি দর্শন ও লালন সাঁইজির অমর সুরের আখড়া',
    description: 'ছেঁউড়িয়ার লালন আখড়া বিশ্বজুড়ে পরিচিত। লালন স্মরণোৎসব ও দোল উৎসবে লাখো বাউল-সাধুর মিলনমেলায় পরিণত হয় এই পুণ্যভূমি।',
    bestTime: 'দোল পূর্ণিমা (মার্চ) এবং লালন তিরোধান দিবস (অক্টোবর)',
    entryFee: 'বিনামূল্যে উন্মুক্ত',
    howToReach: 'কুষ্টিয়া রেল স্টেশন বা বাস টার্মিনাল থেকে অটোতে ছেঁউড়িয়া মাত্র ১০ মিনিট।',
    contacts: [
      { label: 'লালন একাডেমি', phone: '071-61888' }
    ],
    highlights: ['একতারা ও দোতারার সুর', 'বাউল গানের রাতব্যাপী আসর', 'লালন সাঁইজির সমাধি', 'লালন মিউজিয়াম']
  }
];

export const TourismHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);

  const filteredSpots = TOURIST_SPOTS.filter(s => {
    const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchQuery = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-emerald-100 dark:border-emerald-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                সুন্দরবন ও খুলনা পর্যটন গাইড
                <span className="text-[10px] bg-lime-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Heritage & Eco
                </span>
              </h2>
              <p className="text-[11px] text-emerald-100">ইউনেস্কো হেরিটেজ, সুন্দরবন ইকো-ট্যুর ও ঐতিহাসিক দর্শনীয় স্থান</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
            {[
              { id: 'all', label: 'সকল আকর্ষণ' },
              { id: 'nature', label: 'সুন্দরবন ও প্রকৃতি' },
              { id: 'heritage', label: 'ঐতিহাসিক নিদর্শন' },
              { id: 'cultural', label: 'সাহিত্য ও সংস্কৃতি' },
              { id: 'liberation', label: 'মুক্তিযুদ্ধ স্মৃতি' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="স্থান বা জেলার নাম দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Content Cards */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSpots.map(spot => (
            <div
              key={spot.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              <div className="h-44 relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
                      <MapPin size={10} /> {spot.districtName}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">{spot.name}</h3>
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {spot.description}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-emerald-600" />
                    <span>উপযুক্ত সময়: <strong className="text-slate-700 dark:text-slate-200">{spot.bestTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={12} className="text-amber-600" />
                    <span>টিকিট মূল্য: <strong className="text-slate-700 dark:text-slate-200">{spot.entryFee}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedSpot(spot)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Info size={13} /> বিস্তারিত গাইড
                  </button>
                  {spot.contacts[0] && (
                    <a
                      href={`tel:${spot.contacts[0].phone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                      title={spot.contacts[0].label}
                    >
                      <Phone size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for spot details */}
        {selectedSpot && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[88vh] overflow-y-auto p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {selectedSpot.districtName}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedSpot.name}</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">{selectedSpot.tagline}</p>
                </div>
                <button onClick={() => setSelectedSpot(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                <p className="leading-relaxed">{selectedSpot.description}</p>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900 space-y-2">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" /> প্রধান আকর্ষণসমূহ
                  </h4>
                  <ul className="grid grid-cols-2 gap-1 text-[11px]">
                    {selectedSpot.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span> {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">কীভাবে যাবেন?</h4>
                  <p className="text-slate-600 dark:text-slate-400">{selectedSpot.howToReach}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">জরুরি ও গাইড হেল্পলাইন:</h4>
                  <div className="space-y-1.5">
                    {selectedSpot.contacts.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                        <span>{c.label}</span>
                        <a href={`tel:${c.phone}`} className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Phone size={12} /> {c.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSpot(null)}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
