import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  Building2, 
  Users, 
  FileText, 
  Calendar, 
  Heart, 
  Phone, 
  Star, 
  CheckCircle, 
  ChevronRight, 
  X,
  History,
  Trash2,
  AlertCircle
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
}

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
  isSaved
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'services' | 'posts' | 'people'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('smart_khulna_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('smart_khulna_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    const filtered = recentSearches.filter(s => s !== q.trim());
    setRecentSearches([q.trim(), ...filtered].slice(0, 5));
  };

  const clearHistory = () => {
    setRecentSearches([]);
  };

  const filteredResults = useMemo(() => {
    if (!query.trim() && activeFilter === 'all' && selectedDistrict === 'all' && selectedCategory === 'all') {
      return { services: [], posts: [], users: [] };
    }

    const q = query.toLowerCase().trim();

    // Filter Services
    let filteredServices = services.filter(s => {
      const matchQuery = !q || 
        s.name.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) || 
        s.address.toLowerCase().includes(q);
      const matchDistrict = selectedDistrict === 'all' || s.district_id === selectedDistrict;
      const matchCategory = selectedCategory === 'all' || s.category_id === selectedCategory;
      return matchQuery && matchDistrict && matchCategory && s.status === 'PUBLISHED';
    });

    // Filter Posts
    let filteredPosts = posts.filter(p => {
      const matchQuery = !q || p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q);
      const matchDistrict = selectedDistrict === 'all' || p.districtId === selectedDistrict;
      return matchQuery && matchDistrict && p.status === 'published';
    });

    // Filter Users
    let filteredUsers = users.filter(u => {
      const matchQuery = !q || u.name.toLowerCase().includes(q) || (u.bio || '').toLowerCase().includes(q);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Search Bar Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 sticky top-20 z-30">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            className="w-full bg-slate-50 dark:bg-slate-850 border-none rounded-2xl py-3.5 pl-12 pr-24 text-sm focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
            placeholder="সেবা, প্রতিষ্ঠান, পোস্ট বা প্রোফাইল খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addToHistory(query)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition cursor-pointer ${showFilters ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {(['all', 'services', 'posts', 'people'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeFilter === f 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'সব' : f === 'services' ? 'সেবা ও প্রতিষ্ঠান' : f === 'posts' ? 'কমিউনিটি পোস্ট' : 'মানুষ/প্রোফাইল'}
            </button>
          ))}
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800 mt-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">জেলা (District)</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs dark:text-white focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">সব জেলা</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ক্যাটাগরি (Category)</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs dark:text-white focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6 pb-20">
        {!query && totalResults === 0 && (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <History size={16} className="text-slate-400" />
                    সাম্প্রতিক সার্চ (Recent)
                  </h3>
                  <button 
                    onClick={clearHistory}
                    className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> ক্লিয়ার
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(s => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 transition cursor-pointer border border-slate-100 dark:border-slate-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">খুঁজুন ও আবিষ্কার করুন</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                খুলনা বিভাগের যেকোনো সেবা, প্রতিষ্ঠান, রক্তদাতা বা গুরুত্বপূর্ণ তথ্য খুঁজে পেতে উপরে সার্চ করুন।
              </p>
            </div>
          </div>
        )}

        {totalResults > 0 && (
          <div className="space-y-8">
            {/* Services Results */}
            {filteredResults.services.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 size={18} className="text-emerald-600" />
                    সেবা ও প্রতিষ্ঠান ({filteredResults.services.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredResults.services.map(svc => (
                    <ServiceResultCard 
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
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    কমিউনিটি পোস্ট ({filteredResults.posts.length})
                  </h3>
                </div>
                <div className="space-y-4">
                  {filteredResults.posts.map(post => (
                    <PostResultCard 
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

            {/* People Results */}
            {filteredResults.users.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" />
                    মানুষ ও প্রোফাইল ({filteredResults.users.length})
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredResults.users.map(user => (
                    <UserResultCard 
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
          </div>
        )}

        {query && totalResults === 0 && (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-850 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">কোনো ফলাফল পাওয়া যায়নি</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              আপনার সার্চ কিউয়ার্ড বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
            </p>
            <button
              onClick={() => { setQuery(''); setFilterCategory('all'); setSelectedDistrict('all'); }}
              className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              সব রিসেট করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Result Card Components
const ServiceResultCard = ({ service, onSelect, onSave, isSaved }: { service: Service; onSelect: () => void; onSave: () => void; isSaved: boolean }) => {
  const district = initialDistricts.find(d => d.id === service.district_id);
  const category = initialCategories.find(c => c.id === service.category_id);

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-850 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
          {service.photos && service.photos[0] ? (
            <img src={service.photos[0]} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Building2 size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
              {service.name}
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-md">
              {category?.name || 'সেবা'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <MapPin size={10} /> {district?.name}
            </span>
            {service.is_verified && (
              <span className="flex items-center gap-0.5 text-[10px] text-blue-600 font-bold">
                <CheckCircle size={10} className="fill-blue-600 text-white" /> ভেরিফাইড
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isSaved ? 'text-rose-500 bg-rose-50 dark:bg-rose-950' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <a 
            href={`tel:${service.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors"
          >
            <Phone size={16} />
          </a>
        </div>
        <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
          বিস্তারিত দেখুন <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

const PostResultCard = ({ post, onSelect, onSave, isSaved }: { post: CommunityPost; onSelect: () => void; onSave: () => void; isSaved: boolean }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-emerald-200 transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-slate-200" />
        <div>
          <h5 className="text-[11px] font-bold text-slate-900 dark:text-white">{post.authorName}</h5>
          <p className="text-[9px] text-slate-400">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</p>
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {post.content}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><Star size={12} className="text-amber-500" /> {post.likesCount} লাইক</span>
          <span className="flex items-center gap-1"><Users size={12} /> {post.commentsCount} কমেন্ট</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${isSaved ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

const UserResultCard = ({ user, onSelect, onSave, isSaved }: { user: PublicUserProfile; onSelect: () => void; onSave: () => void; isSaved: boolean }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center cursor-pointer hover:shadow-md transition-all group"
      onClick={onSelect}
    >
      <div className="relative w-16 h-16 mx-auto mb-3">
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
          alt={user.name} 
          className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
        />
        {user.role === 'super_admin' && (
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-800">
            <CheckCircle size={10} />
          </div>
        )}
      </div>
      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate px-1">{user.name}</h5>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.profession || 'নাগরিক'}</p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isSaved ? 'text-rose-500 bg-rose-50 dark:bg-rose-950' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <button className="text-[10px] font-bold text-emerald-600 hover:underline">প্রোফাইল</button>
      </div>
    </div>
  );
};
