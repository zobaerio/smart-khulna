import React, { useState } from 'react';
import { Home, MapPin, DollarSign, Bed, Bath, Phone, Search, Plus, X, Building, CheckCircle, Shield } from 'lucide-react';

interface ToLetListing {
  id: string;
  title: string;
  type: 'ফ্যামিলি ফ্ল্যাট' | 'ব্যাচেলর মেস' | 'ছাত্রী মেস' | 'সাবলেট' | 'দোকান/অফিস';
  district: string;
  area: string;
  address: string;
  rent: string;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  description: string;
  phone: string;
  availableFrom: string;
  nearCampus?: string;
}

const INITIAL_TOLETS: ToLetListing[] = [
  {
    id: 'tolet-1',
    title: 'খুলনা বিশ্ববিদ্যালয়ের নিকটে আধুনিক ৩ রুমের ফ্যামিলি ফ্ল্যাট',
    type: 'ফ্যামিলি ফ্ল্যাট',
    district: 'খুলনা',
    area: 'গল্লামারী / খুবি গেট',
    address: 'খুবি মেইন গেট সংলগ্ন, গল্লামারী, খুলনা',
    rent: '১২,৫০০ ৳/মাস',
    bedrooms: 3,
    bathrooms: 2,
    floor: '৩য় তলা',
    description: 'দক্ষিণমুখী খোলামেলা ফ্ল্যাট, ২৪ ঘণ্টা পানি ও তিতাস গ্যাস সিলিন্ডার সাপোর্ট, লিফট ও সিসিটিভি সুবিধা।',
    phone: '01712-887766',
    availableFrom: '১লা মে ২০২৬',
    nearCampus: 'খুলনা বিশ্ববিদ্যালয় (KU)'
  },
  {
    id: 'tolet-2',
    title: 'কুয়েট ক্যাম্পাসের পাশে ছাত্রদের জন্য মনোরম মেস সিট',
    type: 'ব্যাচেলর মেস',
    district: 'খুলনা',
    area: 'ফুলবাড়ীগেট / কুয়েট রোড',
    address: 'কুয়েট পকেট গেটের কাছে, তেলিগাতী',
    rent: '২,২০০ ৳/সিট',
    bedrooms: 2,
    bathrooms: 2,
    floor: '২য় তলা',
    description: 'শান্ত ও পড়ার উপযোগী পরিবেশ, বুয়া রান্না করে, ওয়াইফাই ও ফিল্টার পানির সুবিধা রয়েছে।',
    phone: '01911-554433',
    availableFrom: 'চলতি মাস থেকে',
    nearCampus: 'কুয়েট (KUET)'
  },
  {
    id: 'tolet-3',
    title: 'বি এল কলেজের পাশে ছাত্রীদের জন্য নিরাপদ মেস',
    type: 'ছাত্রী মেস',
    district: 'খুলনা',
    area: 'দৌলতপুর, খুলনা',
    address: 'বি এল কলেজ হোস্টেল রোড, দৌলতপুর',
    rent: '২,৫০০ ৳/সিট',
    bedrooms: 3,
    bathrooms: 2,
    floor: '১ম তলা',
    description: 'দারোয়ান ও পূর্ণ সিসিটিভি নিরাপত্তা বেষ্টিত, শুধুমাত্র অনার্স ও মাস্টার্সের ছাত্রীদের জন্য।',
    phone: '01819-332211',
    availableFrom: '১লা এপ্রিল',
    nearCampus: 'বি এল কলেজ (BL College)'
  },
  {
    id: 'tolet-4',
    title: 'সোনাডাঙ্গা বাস টার্মিনাল এলাকায় ২ রুমের সুন্দর বাসা',
    type: 'ফ্যামিলি ফ্ল্যাট',
    district: 'খুলনা',
    area: 'সোনাডাঙ্গা আবাসিক',
    address: 'ফেজ-১, রোড নম্বর ৪, সোনাডাঙ্গা',
    rent: '৯,০০০ ৳/মাস',
    bedrooms: 2,
    bathrooms: 1,
    floor: '২য় তলা',
    description: 'পরিচ্ছন্ন ছাদবাগান সহ নিরিবিলি পরিবেশ, ছোট ফ্যামিলির জন্য চমৎকার।',
    phone: '01725-443322',
    availableFrom: '১লা মে'
  }
];

export const ToLetHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tolets, setTolets] = useState<ToLetListing[]>(() => {
    try {
      const saved = localStorage.getItem('smart_khulna_tolet');
      return saved ? JSON.parse(saved) : INITIAL_TOLETS;
    } catch {
      return INITIAL_TOLETS;
    }
  });

  const [selectedType, setSelectedType] = useState('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTolet, setNewTolet] = useState({
    title: '',
    type: 'ফ্যামিলি ফ্ল্যাট' as any,
    district: 'খুলনা',
    area: '',
    address: '',
    rent: '',
    bedrooms: 2,
    bathrooms: 1,
    floor: '২য় তলা',
    description: '',
    phone: '',
    availableFrom: 'চলতি মাস'
  });

  const types = ['সব', 'ফ্যামিলি ফ্ল্যাট', 'ব্যাচেলর মেস', 'ছাত্রী মেস', 'দোকান/অফিস'];

  const filteredTolets = tolets.filter(t => {
    const matchType = selectedType === 'সব' || t.type === selectedType;
    const matchQuery = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchQuery;
  });

  const handleAddTolet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTolet.title || !newTolet.area || !newTolet.rent || !newTolet.phone) return;

    const created: ToLetListing = {
      id: `tolet-${Date.now()}`,
      title: newTolet.title,
      type: newTolet.type,
      district: newTolet.district,
      area: newTolet.area,
      address: newTolet.address || newTolet.area,
      rent: newTolet.rent,
      bedrooms: Number(newTolet.bedrooms),
      bathrooms: Number(newTolet.bathrooms),
      floor: newTolet.floor,
      description: newTolet.description,
      phone: newTolet.phone,
      availableFrom: newTolet.availableFrom
    };

    const updated = [created, ...tolets];
    setTolets(updated);
    localStorage.setItem('smart_khulna_tolet', JSON.stringify(updated));
    setShowAddModal(false);
    setNewTolet({
      title: '',
      type: 'ফ্যামিলি ফ্ল্যাট',
      district: 'খুলনা',
      area: '',
      address: '',
      rent: '',
      bedrooms: 2,
      bathrooms: 1,
      floor: '২য় তলা',
      description: '',
      phone: '',
      availableFrom: 'চলতি মাস'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-blue-100 dark:border-blue-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Home className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                বাড়ি ভাড়া ও মেস ডিরেক্টরি (To-Let)
                <span className="text-[10px] bg-blue-300 text-blue-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  City To-Let
                </span>
              </h2>
              <p className="text-[11px] text-blue-100">খুলনা ও আশেপাশের ফ্যামিলি বাসা, ব্যাচেলর ও স্টুডেন্ট মেস সেবা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter and Action Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedType === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} /> বিজ্ঞাপন দিন
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="এলাকা বা বিশ্ববিদ্যালয়ের নাম দিয়ে খুঁজুন (যেমন: গল্লামারী, সোনাডাঙ্গা, KUET)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl outline-none"
            />
          </div>
        </div>

        {/* Listings */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredTolets.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {item.rent}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>

                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-blue-600 shrink-0" /> {item.area}, {item.district}
                </p>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl">
                  <span className="flex items-center gap-1"><Bed size={12} /> {item.bedrooms} বেড</span>
                  <span className="flex items-center gap-1"><Bath size={12} /> {item.bathrooms} বাথ</span>
                  <span>{item.floor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400">উদ্বোধন: {item.availableFrom}</span>
                <a
                  href={`tel:${item.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Phone size={12} /> মালিককে কল ({item.phone})
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Home size={18} className="text-blue-600" /> নতুন টু-লেট বিজ্ঞাপন দিন
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddTolet} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">বিজ্ঞাপনের শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সোনাডাঙ্গায় ২ রুমের সুন্দর ফ্ল্যাট ভাড়া হবে"
                    value={newTolet.title}
                    onChange={e => setNewTolet({ ...newTolet, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ভাড়ার ধরন</label>
                    <select
                      value={newTolet.type}
                      onChange={e => setNewTolet({ ...newTolet, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      {types.filter(t => t !== 'সব').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">মাসিক ভাড়া (টাকা) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ১০,০০০ ৳"
                      value={newTolet.rent}
                      onChange={e => setNewTolet({ ...newTolet, rent: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">এলাকা *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: সোনাডাঙ্গা ফেজ-২"
                      value={newTolet.area}
                      onChange={e => setNewTolet({ ...newTolet, area: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={newTolet.phone}
                      onChange={e => setNewTolet({ ...newTolet, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition cursor-pointer mt-2"
                >
                  বিজ্ঞাপন প্রকাশ করুন
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
