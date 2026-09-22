import React, { useState } from 'react';
import { Briefcase, Building, MapPin, Calendar, DollarSign, Search, Phone, ExternalLink, X, Plus, CheckCircle, GraduationCap } from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  organization: string;
  category: string;
  district: string;
  location: string;
  salary: string;
  deadline: string;
  education: string;
  experience: string;
  phone: string;
  email?: string;
  type: 'ফুল-টাইম' | 'পার্ট-টাইম' | 'চুক্তিভিত্তিক' | 'ইন্টার্নশিপ';
}

const INITIAL_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'মেডিকেল অফিসার / আবাসিক চিকিৎসক',
    organization: 'গাজী মেডিকেল কলেজ হাসপাতাল',
    category: 'স্বাস্থ্যসেবা',
    district: 'খুলনা',
    location: 'সোনাডাঙ্গা, খুলনা',
    salary: '৪০,০০০ - ৫০,০০০ টাকা',
    deadline: '২০২৬-০৪-১৫',
    education: 'MBBS (BMDC Registered)',
    experience: '১-২ বছরের অভিজ্ঞতা',
    phone: '01711-887766',
    email: 'hr@gazimedical.com',
    type: 'ফুল-টাইম'
  },
  {
    id: 'job-2',
    title: 'প্রজেক্ট কো-অর্ডিনেটর (উপকূলীয় পরিবেশ প্রকল্প)',
    organization: 'রূপান্তর এনজিও (Rupantar)',
    category: 'এনজিও ও উন্নয়ন',
    district: 'খুলনা',
    location: 'খুলনা সদর ও শ্যামনগর',
    salary: '৩৫,০০০ - ৪২,০০০ টাকা',
    deadline: '২০২৬-০৩-৩০',
    education: 'স্নাতকোত্তর (পরিবেশ বিজ্ঞান / সমাজবিজ্ঞান)',
    experience: '২-৩ বছরের মাঠপর্যায়ের কাজের অভিজ্ঞতা',
    phone: '01713-332211',
    email: 'career@rupantar.org',
    type: 'ফুল-টাইম'
  },
  {
    id: 'job-3',
    title: 'সফটওয়্যার ডেভেলপার (React & Node.js)',
    organization: 'খুলনা সফটওয়্যার অ্যান্ড আইটি হাব',
    category: 'আইটি ও সফটওয়্যার',
    district: 'খুলনা',
    location: 'শেখ হাসিনা সফটওয়্যার টেকনোলজি পার্ক / খুলনা',
    salary: '৩০,০০০ - ৪৫,০০০ টাকা',
    deadline: '২০২৬-০৪-১০',
    education: 'CSE / ICT ডিপ্লোমা বা স্নাতক',
    experience: '১+ বছরের হ্যান্ডস-অন অভিজ্ঞতা',
    phone: '01819-998877',
    email: 'jobs@khulnasoft.com',
    type: 'ফুল-টাইম'
  },
  {
    id: 'job-4',
    title: 'সহকারী শিক্ষক (গণিত ও বিজ্ঞান)',
    organization: 'যশোর রেসিডেন্সিয়াল স্কুল',
    category: 'শিক্ষকতা',
    district: 'যশোর',
    location: 'যশোর সদর',
    salary: '১৮,০০০ - ২৫,০০০ টাকা',
    deadline: '২০২৬-০৪-০৫',
    education: 'সংশ্লিষ্ট বিষয়ে বিএসসি বা অনার্স',
    experience: 'অভিজ্ঞদের অগ্রাধিকার',
    phone: '01912-334455',
    type: 'ফুল-টাইম'
  },
  {
    id: 'job-5',
    title: 'ফিল্ড সেলস অফিসার (FMCG)',
    organization: 'আকিজ গ্রুপ (যশোর ডিপো)',
    category: 'বিক্রয় ও বিপণন',
    district: 'যশোর',
    location: 'যশোর ও ঝিনাইদহ অঞ্চল',
    salary: '১৫,০০০ - ২০,০০০ টাকা (+টিএ/ডিএ)',
    deadline: '২০২৬-০৩-২৮',
    education: 'এইচএসসি বা স্নাতক',
    experience: 'ফ্রেশার বা সেলসে অভিজ্ঞতা',
    phone: '01725-667788',
    type: 'ফুল-টাইম'
  }
];

export const LocalJobsHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem('smart_khulna_jobs');
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [selectedDistrict, setSelectedDistrict] = useState('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    organization: '',
    category: 'সাধারণ চাকরি',
    district: 'খুলনা',
    location: '',
    salary: 'আলোচনা সাপেক্ষে',
    education: '',
    experience: '',
    deadline: 'চলমান',
    phone: ''
  });

  const categories = ['সব', 'স্বাস্থ্যসেবা', 'এনজিও ও উন্নয়ন', 'আইটি ও সফটওয়্যার', 'শিক্ষকতা', 'বিক্রয় ও বিপণন'];

  const filteredJobs = jobs.filter(j => {
    const matchCat = selectedCategory === 'সব' || j.category === selectedCategory;
    const matchDist = selectedDistrict === 'সব' || j.district === selectedDistrict;
    const matchQuery = !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchDist && matchQuery;
  });

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.organization || !newJob.phone) return;

    const created: JobPosting = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      organization: newJob.organization,
      category: newJob.category,
      district: newJob.district,
      location: newJob.location || newJob.district,
      salary: newJob.salary,
      deadline: newJob.deadline,
      education: newJob.education || 'উল্লেখ নেই',
      experience: newJob.experience || 'প্রযোজ্য নয়',
      phone: newJob.phone,
      type: 'ফুল-টাইম'
    };

    const updated = [created, ...jobs];
    setJobs(updated);
    localStorage.setItem('smart_khulna_jobs', JSON.stringify(updated));
    setShowPostModal(false);
    setNewJob({
      title: '',
      organization: '',
      category: 'সাধারণ চাকরি',
      district: 'খুলনা',
      location: '',
      salary: 'আলোচনা সাপেক্ষে',
      education: '',
      experience: '',
      deadline: 'চলমান',
      phone: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-amber-100 dark:border-amber-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Briefcase className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                খুলনা জব পোর্টাল ও নিয়োগ বিজ্ঞপ্তি
                <span className="text-[10px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Local Careers
                </span>
              </h2>
              <p className="text-[11px] text-amber-100">খুলনা বিভাগের বিভিন্ন প্রতিষ্ঠান ও সংস্থার স্থানীয় চাকরির খবর</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action and Filter Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus size={14} /> চাকরি পোস্ট করুন
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 outline-none"
            >
              <option value="সব">সকল জেলা</option>
              {['খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="চাকরির পদবী বা কোম্পানির নাম দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 space-y-3">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Briefcase size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">কোনো চাকরির বিজ্ঞপ্তি পাওয়া যায়নি</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div
                key={job.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        {job.category}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                      <Building size={13} /> {job.organization}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                      বেতন: {job.salary}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center sm:justify-end gap-1 mt-0.5">
                      <Calendar size={11} /> আবেদনের শেষ তারিখ: {job.deadline}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-amber-600 shrink-0" />
                    <strong>এলাকা:</strong> {job.location} ({job.district})
                  </p>
                  <p className="flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-blue-600 shrink-0" />
                    <strong>যোগ্যতা:</strong> {job.education}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">অভিজ্ঞতা: {job.experience}</span>
                  <a
                    href={`tel:${job.phone}`}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone size={13} /> যোগাযোগ / আবেদন ({job.phone})
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Post Modal */}
        {showPostModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-5 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={18} className="text-amber-600" /> নতুন চাকরির বিজ্ঞপ্তি দিন
                </h3>
                <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePostJob} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">পদের নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সেলস এক্সিকিউটিভ"
                    value={newJob.title}
                    onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">প্রতিষ্ঠানের নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="কোম্পানি বা স্কুলের নাম"
                    value={newJob.organization}
                    onChange={e => setNewJob({ ...newJob, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">ক্যাটাগরি</label>
                    <select
                      value={newJob.category}
                      onChange={e => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      {categories.filter(c => c !== 'সব').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">জেলা</label>
                    <select
                      value={newJob.district}
                      onChange={e => setNewJob({ ...newJob, district: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      {['খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">বেতন ও সুবিধা</label>
                  <input
                    type="text"
                    placeholder="যেমন: ২০,০০০ - ২৫,০০০ টাকা"
                    value={newJob.salary}
                    onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">যোগাযোগের ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={newJob.phone}
                    onChange={e => setNewJob({ ...newJob, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition cursor-pointer mt-2"
                >
                  বিজ্ঞপ্তি প্রকাশ করুন
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
