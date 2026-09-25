import React, { useState, useMemo } from 'react';
import {
  X,
  PhoneCall,
  Search,
  MapPin,
  Shield,
  Flame,
  Ambulance,
  HeartPulse,
  Zap,
  Info,
  Copy,
  Check,
  Radio,
  Clock,
  Sparkles,
  PhoneForwarded,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { offlineEmergencyDirectory, OfflineEmergencyItem } from '../../data/offlineEmergencyData';

interface OfflineSOSDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDistrictId?: string;
  isOffline?: boolean;
}

const DISTRICT_OPTIONS = [
  { id: 'all', label: 'সকল জেলা' },
  { id: 'khulna', label: 'খুলনা' },
  { id: 'satkhira', label: 'সাতক্ষীরা' },
  { id: 'bagerhat', label: 'বাগেরহাট' },
  { id: 'jashore', label: 'যশোর' },
  { id: 'kushtia', label: 'কুষ্টিয়া' },
  { id: 'jhenaidah', label: 'ঝিনাইদহ' },
  { id: 'magura', label: 'মাগুরা' },
  { id: 'narail', label: 'নড়াইল' },
  { id: 'chuadanga', label: 'চুয়াডাঙ্গা' },
  { id: 'meherpur', label: 'মেহেরপুর' }
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'সব জরুরি সেবা', icon: Sparkles },
  { id: 'national', label: 'জাতীয় হেল্পলাইন', icon: Radio },
  { id: 'police', label: 'পুলিশ ও থানা', icon: Shield },
  { id: 'fire', label: 'ফায়ার সার্ভিস', icon: Flame },
  { id: 'hospital', label: 'হাসপাতাল ও ডাক্তার', icon: HeartPulse },
  { id: 'ambulance', label: 'অ্যাম্বুলেন্স', icon: Ambulance },
  { id: 'blood', label: 'ব্লাড ব্যাংক', icon: HeartPulse },
  { id: 'electricity', label: 'বিদ্যুৎ জরুরি', icon: Zap }
];

export const OfflineSOSDirectoryModal: React.FC<OfflineSOSDirectoryModalProps> = ({
  isOpen,
  onClose,
  defaultDistrictId,
  isOffline = false
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    if (defaultDistrictId && defaultDistrictId !== 'all') return defaultDistrictId;
    return 'all';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return offlineEmergencyDirectory.filter(item => {
      // 1. District filter
      if (selectedDistrict !== 'all') {
        const matchesDistrict = item.districtId === selectedDistrict || item.districtId === 'national';
        if (!matchesDistrict) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'hospital' && (item.category === 'hospital' || item.category === 'blood')) {
          // match both
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(q) || (item.nameEn && item.nameEn.toLowerCase().includes(q));
        const inPhone = item.phone.includes(q) || (item.alternatePhone && item.alternatePhone.includes(q));
        const inDistrict = item.districtName.toLowerCase().includes(q);
        const inUpazila = item.upazilaName && item.upazilaName.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inCat = item.categoryLabel.toLowerCase().includes(q);
        if (!inName && !inPhone && !inDistrict && !inUpazila && !inDesc && !inCat) {
          return false;
        }
      }

      return true;
    });
  }, [selectedDistrict, selectedCategory, searchQuery]);

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(phone);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // ignore
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'police':
        return <Shield className="text-sky-600" size={18} />;
      case 'fire':
        return <Flame className="text-amber-600" size={18} />;
      case 'ambulance':
        return <Ambulance className="text-rose-600" size={18} />;
      case 'hospital':
      case 'blood':
        return <HeartPulse className="text-emerald-600" size={18} />;
      case 'electricity':
        return <Zap className="text-yellow-600" size={18} />;
      default:
        return <PhoneCall className="text-blue-600" size={18} />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'police':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'fire':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'ambulance':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'hospital':
      case 'blood':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'electricity':
        return 'bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/35 rounded-full transition text-white active:scale-90 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              ২৪/৭ অফলাইন জরুরি ডিরেক্টরি
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black mt-2 leading-tight flex items-center gap-2 font-serif">
            <PhoneCall size={22} className="animate-bounce" />
            <span>জরুরি হেল্পলাইন ও এসওএস (SOS)</span>
          </h2>
          <p className="text-xs text-rose-100 mt-1 leading-relaxed">
            কোনো ইন্টারনেট বা এমবি না থাকলেও সাধারণ মোবাইল কল দিয়ে এই নম্বরগুলোতে সরাসরি যোগাযোগ করা যাবে।
          </p>

          {/* Quick Offline Resilience Pill */}
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-[11px] bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{isOffline ? 'অফলাইন মোড চালু' : 'অফলাইন ক্যাশিং সক্রিয়'}</span>
            </span>
            <span className="text-rose-100 font-medium">
              মোট {offlineEmergencyDirectory.length} টি ভেরিফাইড জরুরি নম্বর
            </span>
          </div>
        </div>

        {/* 1-TAP TOP EMERGENCY DIAL STRIP (999 & 333) */}
        <div className="bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/40 p-2.5 sm:px-4 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">🚨</span>
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
              তাৎক্ষণিক জাতীয় জরুরি ডায়াল:
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="tel:999"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <PhoneForwarded size={12} />
              <span>৯৯৯ কল</span>
            </a>
            <a
              href="tel:333"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition"
            >
              <PhoneForwarded size={12} />
              <span>৩৩৩ কল</span>
            </a>
          </div>
        </div>

        {/* CONTROLS: SEARCH & FILTERS */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 space-y-2.5 bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="থানা, হাসপাতাল, ফায়ার সার্ভিস বা জেলা দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* District Pills Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-0.5">
              <MapPin size={11} /> জেলা:
            </span>
            {DISTRICT_OPTIONS.map(d => {
              const active = selectedDistrict === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDistrict(d.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition text-[11px] cursor-pointer ${
                    active
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            {CATEGORY_FILTERS.map(c => {
              const active = selectedCategory === c.id;
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition text-[11px] flex items-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={12} />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* EMERGENCY DIRECTORY ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 min-h-[220px]">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Info className="mx-auto text-slate-400" size={36} />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো জরুরি নম্বর পাওয়া যায়নি</p>
              <p className="text-xs text-slate-500">অনুগ্রহ করে জেলা বা সার্চ কিওয়ার্ড পরিবর্তন করে চেষ্টা করুন।</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800/80 rounded-2xl p-3 sm:p-3.5 transition shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 group-hover:scale-105 transition">
                        {getCategoryIcon(item.category)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(item.category)}`}>
                            {item.categoryLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                            <MapPin size={10} />
                            {item.districtName} {item.upazilaName ? `(${item.upazilaName})` : ''}
                          </span>
                          {item.is24Hours && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Clock size={9} /> ২৪ ঘণ্টা
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* ACTION BUTTONS (CALL & COPY) */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <a
                        href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                        title={`${item.name} এ সরাসরি কল করুন`}
                      >
                        <PhoneCall size={13} />
                        <span className="font-mono">{item.phone}</span>
                      </a>

                      <div className="flex items-center gap-1">
                        {item.alternatePhone && (
                          <a
                            href={`tel:${item.alternatePhone.replace(/[^0-9+]/g, '')}`}
                            className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-2 py-0.5 rounded-lg font-mono transition"
                            title="বিকল্প নম্বর"
                          >
                            বিকল্প: {item.alternatePhone}
                          </a>
                        )}

                        <button
                          onClick={e => handleCopyPhone(item.id, item.phone, e)}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="নম্বর কপি করুন"
                        >
                          {isCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span>জরুরি প্রয়োজনে নির্ভুল নম্বর দিয়ে সহযোগিতা করুন।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
