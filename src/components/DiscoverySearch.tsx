import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Building2, 
  Users, 
  FileText, 
  Heart, 
  Phone, 
  Star, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  X, 
  History, 
  Trash2, 
  AlertCircle,
  Sparkles,
  Flame,
  ShieldAlert,
  Droplets,
  HeartPulse,
  GraduationCap,
  Bus,
  Landmark,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, District, Category, initialDistricts, initialCategories } from '../dbData';
import { CommunityPost, PublicUserProfile } from '../types/community';

interface DiscoverySearchProps {
  services: Service[];
  posts: CommunityPost[];
  users: PublicUserProfile[];
  districts: District[];
  categories: Category[];
  currentUser: any;
  onSelectService: (service: Service) => void;
  onSelectProfile: (uid: string) => void;
  onSelectPost: (post: CommunityPost) => void;
  onSaveItem: (type: string, id: string) => void;
  isSaved: (type: string, id: string) => boolean;
  onBack?: () => void;
}

// Popular Instant Mobile Queries
const POPULAR_QUICK_TAGS = [
  { label: 'খুলনা মেডিকেল', query: 'খুলনা মেডিকেল', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { label: 'ফায়ার সার্ভিস', query: 'ফায়ার সার্ভিস', icon: Flame, color: 'text-red-600 bg-red-50 border-red-200' },
  { label: 'রক্তদাতা', query: 'রক্ত', icon: Droplets, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { label: 'থানা ও পুলিশ', query: 'পুলিশ', icon: ShieldAlert, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { label: 'বাস টার্মিনাল', query: 'টার্মিনাল', icon: Bus, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { label: 'বিদ্যুৎ অফিস', query: 'বিদ্যুৎ', icon: Zap, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  { label: 'পাসপোর্ট অফিস', query: 'পাসপোর্ট', icon: Landmark, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { label: 'বিশ্ববিদ্যালয়', query: 'বিশ্ববিদ্যালয়', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
];

export const DiscoverySearch: React.FC<DiscoverySearchProps> = ({
  services,
  posts,
  users,
  districts,
  categories,
  currentUser,
  onSelectService,
  onSelectProfile,
  onSelectPost,
  onSaveItem,
  isSaved,
  onBack
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'services' | 'posts' | 'people'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('smart_khulna_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart_khulna_recent_searches', JSON.stringify(recentSearches));
    } catch {
      // Ignore local storage quota errors
    }
  }, [recentSearches]);

  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    const clean = q.trim();
    const filtered = recentSearches.filter(s => s.toLowerCase() !== clean.toLowerCase());
    setRecentSearches([clean, ...filtered].slice(0, 6));
  };

  const handleApplySearchTag = (tagQuery: string) => {
    setQuery(tagQuery);
    addToHistory(tagQuery);
  };

  const clearHistory = () => {
    setRecentSearches([]);
  };

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    const isFiltering = q || selectedDistrict !== 'all' || selectedCategory !== 'all';

    if (!isFiltering) {
      return { services: [], posts: [], users: [] };
    }

    // Filter Services
    const filteredServices = (Array.isArray(services) ? services : []).filter(s => {
      if (!s || s.status !== 'PUBLISHED') return false;
      const upazila = (s as any).upazila || '';
      const matchQuery = !q || 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.description && s.description.toLowerCase().includes(q)) || 
        (s.address && s.address.toLowerCase().includes(q)) ||
        (upazila && upazila.toLowerCase().includes(q)) ||
        (s.phone && s.phone.includes(q));
      const matchDistrict = selectedDistrict === 'all' || s.district_id === selectedDistrict;
      const matchCategory = selectedCategory === 'all' || s.category_id === selectedCategory;
      return matchQuery && matchDistrict && matchCategory;
    });

    // Filter Posts
    const filteredPosts = (Array.isArray(posts) ? posts : []).filter(p => {
      if (!p || p.status !== 'published') return false;
      const matchQuery = !q || 
        (p.content && p.content.toLowerCase().includes(q)) || 
        (p.authorName && p.authorName.toLowerCase().includes(q));
      const matchDistrict = selectedDistrict === 'all' || p.districtId === selectedDistrict;
      return matchQuery && matchDistrict;
    });

    // Filter Users
    const filteredUsers = (Array.isArray(users) ? users : []).filter(u => {
      if (!u) return false;
      const matchQuery = !q || 
        (u.name && u.name.toLowerCase().includes(q)) || 
        (u.profession && u.profession.toLowerCase().includes(q)) ||
        (u.bio && u.bio.toLowerCase().includes(q));
      const matchDistrict = selectedDistrict === 'all' || u.district === selectedDistrict;
      return matchQuery && matchDistrict;
    });

    return {
      services: activeFilter === 'all' || activeFilter === 'services' ? filteredServices : [],
      posts: activeFilter === 'all' || activeFilter === 'posts' ? filteredPosts : [],
      users: activeFilter === 'all' || activeFilter === 'people' ? filteredUsers : []
    };
  }, [query, activeFilter, selectedDistrict, selectedCategory, services, posts, users]);

  const totalResults = filteredResults.services.length + filteredResults.posts.length + filteredResults.users.length;
  const isSearchActive = Boolean(query.trim() || selectedDistrict !== 'all' || selectedCategory !== 'all');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-3.5 pb-24 animate-in fade-in duration-200">
      
      {/* 1. MOBILE APP HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
              title="পিছনে যান"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-1.5 leading-none">
              <SearchIcon size={15} className="text-emerald-600 dark:text-emerald-400" />
              স্মার্ট অনুসন্ধান ও ডিরেক্টরি
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">খুলনা বিভাগের সকল সেবা, পোস্ট ও নাগরিক খুঁজুন</p>
          </div>
        </div>

        {isSearchActive && (
          <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800 shrink-0">
            {totalResults} টি ফলাফল
          </span>
        )}
      </div>

      {/* 2. MOBILE-FIRST SEARCH INPUT BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm space-y-2">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <SearchIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            className="w-full bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl py-2.5 pl-9 pr-20 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-transparent transition-all"
            placeholder="সেবা, হাসপাতাল, থানা, রক্তদাতা বা পোস্ট খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addToHistory(query);
                inputRef.current?.blur();
              }
            }}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button 
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-700/60 rounded-full active:scale-90 transition-all cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X size={13} />
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                showFilters || selectedDistrict !== 'all' || selectedCategory !== 'all'
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-750 hover:bg-slate-300'
              }`}
              title="ফিল্টার"
            >
              <Filter size={14} />
              <span className="hidden sm:inline">ফিল্টার</span>
              {(selectedDistrict !== 'all' || selectedCategory !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Filter Tabs (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none no-scrollbar">
          {(['all', 'services', 'posts', 'people'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1 ${
                activeFilter === f 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-750'
              }`}
            >
              {f === 'all' && <Sparkles size={11} />}
              {f === 'services' && <Building2 size={11} />}
              {f === 'posts' && <FileText size={11} />}
              {f === 'people' && <Users size={11} />}
              <span>
                {f === 'all' ? 'সব' : f === 'services' ? 'সেবা ও প্রতিষ্ঠান' : f === 'posts' ? 'পোস্ট' : 'নাগরিক'}
              </span>
            </button>
          ))}
        </div>

        {/* Expandable District & Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-1 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                    <MapPin size={10} /> জেলা ফিল্টার
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="all">সকল জেলা (১০টি)</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                    <Building2 size={10} /> ক্যাটাগরি
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="all">সকল ক্যাটাগরি</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {(selectedDistrict !== 'all' || selectedCategory !== 'all') && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setSelectedDistrict('all');
                      setSelectedCategory('all');
                    }}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                  >
                    <X size={11} /> ফিল্টার রিসেট
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. DEFAULT STATE: QUICK SUGGESTIONS & RECENT SEARCHES */}
      {!isSearchActive && (
        <div className="space-y-3.5">
          {/* Quick Instant Search Tags */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-serif flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                জনপ্রিয় দ্রুত অনুসন্ধান
              </h3>
              <span className="text-[10px] text-slate-400">১-ট্যাপ সার্চ</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_QUICK_TAGS.map(tag => {
                const Icon = tag.icon;
                return (
                  <button
                    key={tag.label}
                    onClick={() => handleApplySearchTag(tag.query)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/70 dark:border-slate-700/60 active:scale-95 transition-all text-left cursor-pointer group"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${tag.color}`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                      {tag.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-serif flex items-center gap-1.5">
                  <History size={13} className="text-slate-400" />
                  সাম্প্রতিক সার্চসমূহ
                </h3>
                <button 
                  onClick={clearHistory}
                  className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={11} /> মুছে ফেলুন
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map(s => (
                  <button
                    key={s}
                    onClick={() => handleApplySearchTag(s)}
                    className="bg-slate-100/90 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700 flex items-center gap-1 active:scale-95"
                  >
                    <SearchIcon size={11} className="text-slate-400" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Discovery Help Banner */}
          <div className="text-center py-6 px-4 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-slate-850/50 rounded-2xl border border-emerald-100/60 dark:border-slate-800 space-y-1.5">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto shadow-xs">
              <Building2 size={20} />
            </div>
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">খুলনা বিভাগের পূর্ণাঙ্গ ডিজিটাল নেটওয়ার্ক</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              জরুরি এম্বুলেন্স, ডাক্তার, রক্তদাতা, থানা বা যেকোনো সেবা পেতে সার্চ বক্সে টাইপ করুন।
            </p>
          </div>
        </div>
      )}

      {/* 4. ACTIVE SEARCH RESULTS */}
      {isSearchActive && (
        <div className="space-y-4">
          
          {/* Services Results */}
          {filteredResults.services.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-serif flex items-center gap-1.5">
                  <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                  সেবা ও প্রতিষ্ঠান ({filteredResults.services.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredResults.services.map(svc => (
                  <MobileServiceCard 
                    key={svc.id} 
                    service={svc} 
                    onSelect={() => onSelectService(svc)}
                    onSave={() => onSaveItem('service', svc.id)}
                    isSaved={isSaved('service', svc.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {filteredResults.posts.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-serif flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                  কমিউনিটি পোস্ট ({filteredResults.posts.length})
                </h3>
              </div>

              <div className="space-y-2">
                {filteredResults.posts.map(post => (
                  <MobilePostCard 
                    key={post.id} 
                    post={post} 
                    onSelect={() => onSelectPost(post)}
                    onSave={() => onSaveItem('post', post.id)}
                    isSaved={isSaved('post', post.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Users Results */}
          {filteredResults.users.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-serif flex items-center gap-1.5">
                  <Users size={14} className="text-indigo-600 dark:text-indigo-400" />
                  নাগরিক প্রোফাইল ({filteredResults.users.length})
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredResults.users.map(user => (
                  <MobileUserCard 
                    key={user.uid} 
                    user={user} 
                    onSelect={() => onSelectProfile(user.uid)}
                    onSave={() => onSaveItem('profile', user.uid)}
                    isSaved={isSaved('profile', user.uid)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty Search Result State */}
          {totalResults === 0 && (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif">কোনো তথ্য পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  "{query}" দিয়ে কোনো সেবা বা পোস্ট মেলেনি। বানান চেক করে অন্য শব্দ দিয়ে চেষ্টা করুন।
                </p>
              </div>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedDistrict('all');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                সব ফিল্টার রিসেট করুন
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

/* COMPACT MOBILE-OPTIMIZED RESULT CARDS */

const MobileServiceCard = ({ service, onSelect, onSave, isSaved }: { service: Service; onSelect: () => void; onSave: () => void; isSaved: boolean }) => {
  const district = initialDistricts.find(d => d.id === service.district_id);
  const category = initialCategories.find(c => c.id === service.category_id);

  return (
    <div 
      className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex flex-col justify-between"
      onClick={onSelect}
    >
      <div className="flex gap-2.5">
        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-750 flex items-center justify-center">
          {service.photos && service.photos[0] ? (
            <img src={service.photos[0]} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={22} className="text-emerald-700 dark:text-emerald-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[9px] font-extrabold rounded">
              {category?.name || 'সেবা'}
            </span>
            {district && (
              <span className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                <MapPin size={9} /> {district.name}
              </span>
            )}
            {service.is_verified && (
              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-0.5">
                <CheckCircle size={9} className="fill-blue-500 text-white" /> ভেরিফাইড
              </span>
            )}
          </div>

          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1 leading-snug mt-1">
            {service.name}
          </h4>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {service.address || (service as any).upazila || 'খুলনা বিভাগ'}
          </p>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {service.phone && (
            <a 
              href={`tel:${service.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-lg flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-800"
            >
              <Phone size={10} /> কল
            </a>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${isSaved ? 'text-rose-500 bg-rose-50 dark:bg-rose-950' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            title="সংরক্ষণ করুন"
          >
            <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
          বিস্তারিত <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
};

const MobilePostCard = ({ post, onSelect, onSave, isSaved }: { post: CommunityPost; onSelect: () => void; onSave: () => void; isSaved: boolean }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
            {post.authorName ? post.authorName.charAt(0) : 'U'}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-none">{post.authorName}</h5>
            <p className="text-[9px] text-slate-400 mt-0.5">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</p>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${isSaved ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {post.content}
      </p>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1 text-amber-600 font-bold">
          <Star size={11} className="fill-amber-500" /> {post.likesCount || 0} লাইক
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
          পোস্টটি দেখুন <ChevronRight size={11} />
        </span>
      </div>
    </div>
  );
};

const MobileUserCard = ({ user, onSelect, onSave, isSaved }: { user: PublicUserProfile; onSelect: () => void; onSave: () => void; isSaved: boolean }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 text-center cursor-pointer active:scale-95 transition-all flex flex-col justify-between"
      onClick={onSelect}
    >
      <div className="relative w-12 h-12 mx-auto mb-1.5">
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
          alt={user.name} 
          className="w-full h-full rounded-full object-cover border-2 border-emerald-100 dark:border-slate-700"
        />
        {(user.badge === 'admin' || (user as any).role === 'super_admin') && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white p-0.5 rounded-full border border-white dark:border-slate-900">
            <CheckCircle size={9} />
          </div>
        )}
      </div>

      <div>
        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</h5>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.profession || 'নাগরিক'}</p>
      </div>

      <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${isSaved ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <Heart size={12} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">প্রোফাইল</span>
      </div>
    </div>
  );
};
