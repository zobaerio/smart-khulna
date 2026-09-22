import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Send, Search, Image as ImageIcon, MapPin, X, FileText, Shield } from 'lucide-react';

interface Grievance {
  id: string;
  trackingId: string;
  title: string;
  category: string;
  district: string;
  location: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  submittedAt: string;
  phone: string;
}

const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-1',
    trackingId: 'SK-2026-8941',
    title: 'খালিশপুর ৭ নম্বর ঘাট রোডে ভাঙা রাস্তা সংস্কার প্রয়োজন',
    category: 'সড়ক ও যোগাযোগ',
    district: 'খুলনা',
    location: 'খালিশপুর ৭নং ঘাট রোড, খুলনা',
    description: 'রাস্তাটি দীর্ঘদিন ধরে খানাখন্দে ভরা। বৃষ্টির দিনে জলাবদ্ধতা তৈরি হয়ে যানবাহন চলাচলে বিঘ্ন ঘটছে।',
    status: 'in_progress',
    submittedAt: '২০২৬-০২-১৮',
    phone: '01712-******'
  },
  {
    id: 'grv-2',
    trackingId: 'SK-2026-6120',
    title: 'সোনাডাঙ্গা আবাসিক এলাকায় ড্রেনেজ উপচে পড়া ও ময়লা',
    category: 'বর্জ্য ও ড্রেনেজ',
    district: 'খুলনা',
    location: 'সোনাডাঙ্গা ফেজ-২, রোড ৩',
    description: 'ড্রেন আটকে পানি উপচে রাস্তায় ছড়িয়ে পড়ছে এবং দুর্গন্ধ ছড়াচ্ছে। দ্রুত পরিষ্কারের অনুরোধ।',
    status: 'resolved',
    submittedAt: '২০২৬-০১-০৫',
    phone: '01911-******'
  }
];

export const CitizenFeedbackHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [grievances, setGrievances] = useState<Grievance[]>(() => {
    try {
      const saved = localStorage.getItem('smart_khulna_grievances');
      return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
    } catch {
      return INITIAL_GRIEVANCES;
    }
  });

  const [form, setForm] = useState({
    title: '',
    category: 'সড়ক ও যোগাযোগ',
    district: 'খুলনা',
    location: '',
    description: '',
    phone: ''
  });

  const [trackingSearch, setTrackingSearch] = useState('');
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('smart_khulna_grievances', JSON.stringify(grievances));
  }, [grievances]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.phone) return;

    const generatedCode = `SK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      trackingId: generatedCode,
      title: form.title,
      category: form.category,
      district: form.district,
      location: form.location,
      description: form.description,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('bn-BD'),
      phone: form.phone
    };

    setGrievances([newGrievance, ...grievances]);
    setSubmittedTrackingId(generatedCode);
    setForm({ title: '', category: 'সড়ক ও যোগাযোগ', district: 'খুলনা', location: '', description: '', phone: '' });
  };

  const searchedGrievance = grievances.find(g =>
    g.trackingId.toLowerCase() === trackingSearch.trim().toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-indigo-100 dark:border-indigo-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                নাগরিক অভিযোগ ও সমাধান বক্স
                <span className="text-[10px] bg-purple-400 text-purple-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Citizen Portal
                </span>
              </h2>
              <p className="text-[11px] text-indigo-100">রাস্তাঘাট, ড্রেনেজ বা সেবাসংক্রান্ত সমস্যা সরাসরি সংশ্লিষ্ট কতৃপক্ষকে জানান</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('submit'); setSubmittedTrackingId(null); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileText size={14} /> নতুন অভিযোগ দাখিল
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Search size={14} /> অভিযোগের বর্তমান অবস্থা জানুন
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'submit' ? (
            submittedTrackingId ? (
              <div className="text-center py-8 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">আপনার অভিযোগ সফলভাবে গৃহীত হয়েছে!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  আপনার অভিযোগ ট্র্যাকিং নম্বরটি সংরক্ষণ করুন:
                </p>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl border border-indigo-200 dark:border-indigo-800 font-mono text-base font-bold text-indigo-700 dark:text-indigo-300">
                  {submittedTrackingId}
                </div>
                <p className="text-[11px] text-slate-500">
                  সংশ্লিষ্ট ওয়ার্ড বা উপজেলা নির্বাহী কর্মকর্তার দফতরে বিষয়টি তদন্তের জন্য পাঠানো হয়েছে।
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSubmittedTrackingId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    আরেকটি অভিযোগ জমা দিন
                  </button>
                  <button
                    onClick={() => {
                      setTrackingSearch(submittedTrackingId);
                      setActiveTab('track');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    স্ট্যাটাস ট্র্যাক করুন
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">অভিযোগের বিভাগ / ধরন *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    >
                      <option value="সড়ক ও যোগাযোগ">সড়ক ও যোগাযোগ (ভাঙা রাস্তা, কালভার্ট)</option>
                      <option value="বর্জ্য ও ড্রেনেজ">বর্জ্য অপসারণ ও ড্রেনেজ জলাবদ্ধতা</option>
                      <option value="বিদ্যুৎ ও সড়কবাতি">নষ্ট সড়কবাতি ও বিদ্যুৎ সংযোগ</option>
                      <option value="নিরাপত্তা ও শৃঙ্খলা">নিরাপত্তা ও স্থানীয় আইন শৃঙ্খলা</option>
                      <option value="স্বাস্থ্য ও স্যানিটেশন">স্বাস্থ্য, হাসপাতাল ও স্যানিটেশন</option>
                      <option value="অন্যান্য">অন্যান্য অভিযোগ</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">জেলা নির্বাচন করুন *</label>
                    <select
                      value={form.district}
                      onChange={e => setForm({ ...form, district: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    >
                      {['খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">অভিযোগের শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="সংক্ষেপে সমস্যার মূল কথা লিখুন"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">নির্দিষ্ট স্থান বা এলাকার ঠিকানা *</label>
                    <input
                      type="text"
                      required
                      placeholder="উপজেলা, রোড নং, ওয়ার্ড বা ল্যান্ডমার্ক"
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">আপনার সচল মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">সমস্যার বিস্তারিত বর্ণনা</label>
                  <textarea
                    rows={3}
                    placeholder="সমস্যাটির বিস্তারিত ও কতদিন ধরে চলছে তা উল্লেখ করুন..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} /> অভিযোগ দাখিল করুন
                </button>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="আপনার ট্র্যাকিং কোড লিখুন (যেমন: SK-2026-8941)"
                    value={trackingSearch}
                    onChange={e => setTrackingSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                  />
                </div>
              </div>

              {searchedGrievance ? (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
                      {searchedGrievance.trackingId}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      searchedGrievance.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : searchedGrievance.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {searchedGrievance.status === 'resolved' && <CheckCircle size={12} />}
                      {searchedGrievance.status === 'in_progress' && <Clock size={12} />}
                      {searchedGrievance.status === 'resolved' ? 'সমাধানকৃত' : searchedGrievance.status === 'in_progress' ? 'তদন্তাধীন' : 'বিচারাধীন'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{searchedGrievance.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={12} className="text-indigo-600" /> {searchedGrievance.location} ({searchedGrievance.district})
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {searchedGrievance.description}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    দাখিলের তারিখ: {searchedGrievance.submittedAt}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500">সাম্প্রতিক নাগরিক অভিযোগসমূহ:</p>
                  {grievances.map(g => (
                    <div
                      key={g.id}
                      onClick={() => setTrackingSearch(g.trackingId)}
                      className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-400 transition flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] text-indigo-600 font-bold block">{g.trackingId}</span>
                        <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{g.title}</h5>
                        <p className="text-[10px] text-slate-400">{g.location}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        g.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status === 'resolved' ? 'সমাধানকৃত' : 'তদন্তাধীন'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>জরুরি সরকারি তথ্য ও অভিযোগ সেবা: ৩৩৩</span>
          <span className="font-bold text-indigo-700">খুলনা সিটি কর্পোরেশন হটলাইন</span>
        </div>
      </div>
    </div>
  );
};
