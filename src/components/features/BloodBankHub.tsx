import React, { useState, useEffect } from 'react';
import { Heart, Search, Phone, MessageCircle, Plus, AlertCircle, Droplets, MapPin, CheckCircle, ShieldCheck, X } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  districtId: string;
  upazila: string;
  phone: string;
  whatsapp?: string;
  lastDonationDate: string;
  isAvailable: boolean;
  totalDonations: number;
}

const initialDonors: Donor[] = [
  {
    id: 'b-1',
    name: 'ডাঃ আরিফুল ইসলাম',
    bloodGroup: 'O+',
    districtId: 'khulna',
    upazila: 'খুলনা সদর (বয়রা)',
    phone: '01712-345678',
    whatsapp: '8801712345678',
    lastDonationDate: '২০২৫-১২-১০',
    isAvailable: true,
    totalDonations: 9
  },
  {
    id: 'b-2',
    name: 'ফারহানা ইয়াসমিন',
    bloodGroup: 'A+',
    districtId: 'khulna',
    upazila: 'সোনাডাঙ্গা',
    phone: '01819-876543',
    whatsapp: '8801819876543',
    lastDonationDate: '২০২৬-০১-১৫',
    isAvailable: true,
    totalDonations: 4
  },
  {
    id: 'b-3',
    name: 'মোঃ তানভীর হাসান',
    bloodGroup: 'B+',
    districtId: 'jashore',
    upazila: 'যশোর সদর',
    phone: '01911-223344',
    whatsapp: '8801911223344',
    lastDonationDate: '২০২৫-১১-২০',
    isAvailable: true,
    totalDonations: 12
  },
  {
    id: 'b-4',
    name: 'রাশেদ জামান',
    bloodGroup: 'AB+',
    districtId: 'satkhira',
    upazila: 'সাতক্ষীরা সদর',
    phone: '01715-998877',
    lastDonationDate: '২০২৬-০২-০১',
    isAvailable: true,
    totalDonations: 6
  },
  {
    id: 'b-5',
    name: 'সজীব আহমেদ',
    bloodGroup: 'O-',
    districtId: 'bagerhat',
    upazila: 'বাগেরহাট সদর',
    phone: '01612-445566',
    whatsapp: '8801612445566',
    lastDonationDate: '২০২৫-১০-০৫',
    isAvailable: true,
    totalDonations: 7
  },
  {
    id: 'b-6',
    name: 'মাহমুদুল হক',
    bloodGroup: 'A-',
    districtId: 'kushtia',
    upazila: 'কুষ্টিয়া সদর',
    phone: '01723-556677',
    lastDonationDate: '২০২৫-০৯-১৫',
    isAvailable: true,
    totalDonations: 5
  },
  {
    id: 'b-7',
    name: 'তাহমিদ আলম',
    bloodGroup: 'B-',
    districtId: 'jhenaidah',
    upazila: 'ঝিনাইদহ সদর',
    phone: '01824-778899',
    lastDonationDate: '২০২৫-০৮-২০',
    isAvailable: true,
    totalDonations: 3
  },
  {
    id: 'b-8',
    name: 'নাঈম রহমান',
    bloodGroup: 'AB-',
    districtId: 'khulna',
    upazila: 'খালিশপুর',
    phone: '01935-112233',
    whatsapp: '8801935112233',
    lastDonationDate: '২০২৫-০৭-১০',
    isAvailable: true,
    totalDonations: 8
  }
];

const BLOOD_GROUPS = ['সব', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const DISTRICTS = [
  { id: 'all', name: 'সকল জেলা' },
  { id: 'khulna', name: 'খুলনা' },
  { id: 'jashore', name: 'যশোর' },
  { id: 'satkhira', name: 'সাতক্ষীরা' },
  { id: 'bagerhat', name: 'বাগেরহাট' },
  { id: 'kushtia', name: 'কুষ্টিয়া' },
  { id: 'chuadanga', name: 'চুয়াডাঙ্গা' },
  { id: 'meherpur', name: 'মেহেরপুর' },
  { id: 'jhenaidah', name: 'ঝিনাইদহ' },
  { id: 'magura', name: 'মাগুরা' },
  { id: 'narail', name: 'নড়াইল' },
];

export const BloodBankHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedGroup, setSelectedGroup] = useState('সব');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [donors, setDonors] = useState<Donor[]>(() => {
    try {
      const saved = localStorage.getItem('smart_khulna_blood_donors');
      return saved ? JSON.parse(saved) : initialDonors;
    } catch {
      return initialDonors;
    }
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  // New donor form state
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: 'A+',
    districtId: 'khulna',
    upazila: '',
    phone: '',
    whatsapp: ''
  });

  useEffect(() => {
    localStorage.setItem('smart_khulna_blood_donors', JSON.stringify(donors));
  }, [donors]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newDonor: Donor = {
      id: `donor-${Date.now()}`,
      name: formData.name,
      bloodGroup: formData.bloodGroup,
      districtId: formData.districtId,
      upazila: formData.upazila || 'সদর',
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      lastDonationDate: 'প্রস্তুত',
      isAvailable: true,
      totalDonations: 1
    };

    setDonors([newDonor, ...donors]);
    setShowRegisterModal(false);
    setFormData({ name: '', bloodGroup: 'A+', districtId: 'khulna', upazila: '', phone: '', whatsapp: '' });
  };

  const filteredDonors = donors.filter(d => {
    const matchGroup = selectedGroup === 'সব' || d.bloodGroup === selectedGroup;
    const matchDistrict = selectedDistrict === 'all' || d.districtId === selectedDistrict;
    const matchQuery = !searchQuery || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.upazila.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);
    return matchGroup && matchDistrict && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-red-100 dark:border-red-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                লাইভ রক্তদান ডিরেক্টরি
                <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Blood SOS
                </span>
              </h2>
              <p className="text-[11px] text-red-100">খুলনা বিভাগের জরুরি রক্তদাতা নেটওয়ার্ক ও সরাসরি যোগাযোগ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Banners */}
        <div className="p-3 sm:p-4 bg-red-50/70 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/40 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-red-900 dark:text-red-300 font-medium">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>জরুরি প্রয়োজনে যে কাউকে কল দিয়ে ব্লাড ব্যাংক প্রস্তুত রাখুন।</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowSosModal(true)}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart size={14} className="fill-white" /> জরুরি রক্তের আবেদন (SOS)
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> রক্তদাতা হন
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 sm:p-4 space-y-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {/* Blood Group Tabs */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
              রক্তের গ্রুপ নির্বাচন করুন:
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {BLOOD_GROUPS.map(grp => (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedGroup === grp
                      ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400/40'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* District & Search */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
            >
              {DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="রক্তদাতার নাম বা এলাকা খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        {/* Donor List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredDonors.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Heart size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">কোনো রক্তদাতা পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">অন্য গ্রুপ বা জেলা নির্বাচন করে অনুসন্ধান করুন।</p>
            </div>
          ) : (
            filteredDonors.map(donor => (
              <div
                key={donor.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                    <span className="text-sm font-black tracking-tight">{donor.bloodGroup}</span>
                    <span className="text-[8px] uppercase font-semibold opacity-90">রক্ত</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{donor.name}</h4>
                      {donor.isAvailable && (
                        <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                          <ShieldCheck size={10} /> সক্রিয়
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-red-500" />
                      {DISTRICTS.find(d => d.id === donor.districtId)?.name || 'খুলনা'}, {donor.upazila}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      সর্বশেষ রক্তদান: {donor.lastDonationDate} • মোট দান: {donor.totalDonations} বার
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${donor.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 text-xs font-bold shadow-sm"
                    title="সরাসরি কল দিন"
                  >
                    <Phone size={14} />
                    <span className="hidden sm:inline">কল দিন</span>
                  </a>
                  {donor.whatsapp && (
                    <a
                      href={`https://wa.me/${donor.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white transition flex items-center gap-1 text-xs font-bold shadow-sm"
                      title="হোয়াটসঅ্যাপে মেসেজ পাঠান"
                    >
                      <MessageCircle size={14} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>মোট তালিকাভুক্ত রক্তদাতা: {filteredDonors.length} জন</span>
          <span className="text-red-600 dark:text-red-400 font-bold">জরুরি অ্যাম্বুলেন্স: ৯৯৯</span>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart size={18} className="text-red-600 fill-red-600" /> রক্তদাতা রেজিস্ট্রেশন
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">রক্তের গ্রুপ *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    {BLOOD_GROUPS.filter(g => g !== 'সব').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">জেলা *</label>
                  <select
                    value={formData.districtId}
                    onChange={e => setFormData({ ...formData, districtId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {DISTRICTS.filter(d => d.id !== 'all').map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">উপজেলা / এলাকা</label>
                <input
                  type="text"
                  placeholder="যেমন: সোনাডাঙ্গা / খুলনা সদর"
                  value={formData.upazila}
                  onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp নম্বর</label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition cursor-pointer mt-2"
              >
                রক্তদাতা হিসেবে সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 shadow-2xl border border-red-200 dark:border-red-900 text-center animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">জরুরি রক্তের আবেদন</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              আপনার রোগী বা আত্মীয়ের জন্য তাৎক্ষণিক রক্তের প্রয়োজন হলে জাতীয় জরুরি সেবা ৯৯৯ অথবা খুলনা মেডিকেল কলেজ ব্লাড ব্যাংকে যোগাযোগ করুন।
            </p>
            <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl border border-red-200 dark:border-red-800 text-left text-xs space-y-1.5 mb-4">
              <p className="font-bold text-red-900 dark:text-red-300">খুলনা বিভাগের জরুরি ব্লাড ব্যাংক:</p>
              <p className="text-slate-700 dark:text-slate-300">• খুলনা মেডিকেল কলেজ ব্লাড ব্যাংক: 01711-123456</p>
              <p className="text-slate-700 dark:text-slate-300">• রেড ক্রিসেন্ট সোসাইটি খুলনা: 01712-445566</p>
              <p className="text-slate-700 dark:text-slate-300">• সন্ধানী খুলনা ইউনিট: 01819-332211</p>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:999"
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Phone size={14} /> ৯৯৯ এ কল করুন
              </a>
              <button
                onClick={() => setShowSosModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
