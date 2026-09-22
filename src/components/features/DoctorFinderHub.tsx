import React, { useState } from 'react';
import { HeartPulse, Stethoscope, Phone, Clock, MapPin, Search, Ambulance, Wind, X, Shield, Calendar } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degrees: string;
  hospital: string;
  chamber: string;
  districtId: string;
  districtName: string;
  visitingHours: string;
  serialPhone: string;
  consultationFee: string;
}

const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'প্রফেসর ডাঃ এম এ সামাদ',
    specialty: 'মেডিসিন ও হৃদরোগ বিশেষজ্ঞ',
    degrees: 'MBBS, FCPS (Medicine), MD (Cardiology)',
    hospital: 'খুলনা মেডিকেল কলেজ ও হাসপাতাল',
    chamber: 'ল্যাবএইড ডায়াগনস্টিক, কেডিএ অ্যাভিনিউ, খুলনা',
    districtId: 'khulna',
    districtName: 'খুলনা',
    visitingHours: 'বিকাল ৪টা - রাত ৮টা (শুক্রবার বন্ধ)',
    serialPhone: '01712-445566',
    consultationFee: '১,০০০ টাকা'
  },
  {
    id: 'doc-2',
    name: 'ডাঃ নাসরীন জাহান',
    specialty: 'স্ত্রী ও প্রসূতি রোগ বিশেষজ্ঞ (গাইনি)',
    degrees: 'MBBS, DGO, MCPS, FCPS (Gynae)',
    hospital: 'খুলনা সদর হাসপাতাল',
    chamber: 'পপুলার ডায়াগনস্টিক সেন্টার, সোনাডাঙ্গা, খুলনা',
    districtId: 'khulna',
    districtName: 'খুলনা',
    visitingHours: 'বিকাল ৫টা - রাত ৯টা',
    serialPhone: '01911-334455',
    consultationFee: '৮০০ টাকা'
  },
  {
    id: 'doc-3',
    name: 'ডাঃ মোস্তাফিজুর রহমান',
    specialty: 'শিশু রোগ বিশেষজ্ঞ (Pediatrics)',
    degrees: 'MBBS, DCH, MD (Child Health)',
    hospital: 'খুলনা শিশু হাসপাতাল',
    chamber: 'সিটি মেডিকেল সেন্টার, রূপসা রোড',
    districtId: 'khulna',
    districtName: 'খুলনা',
    visitingHours: 'প্রতিদিন সকাল ১০টা - দুপুর ১টা ও বিকাল ৫টা - রাত ৮টা',
    serialPhone: '01819-223344',
    consultationFee: '৭০০ টাকা'
  },
  {
    id: 'doc-4',
    name: 'ডাঃ কামরুল ইসলাম',
    specialty: 'হাড়জোড়া ও অর্থোপেডিক সার্জন',
    degrees: 'MBBS, MS (Orthopedics)',
    hospital: 'যশোর ২৫০ শয্যা জেনারেল হাসপাতাল',
    chamber: 'ইবনে সিনা ডায়াগনস্টিক সেন্টার, যশোর সদর',
    districtId: 'jashore',
    districtName: 'যশোর',
    visitingHours: 'বিকাল ৪টা - রাত ৮:৩০টা',
    serialPhone: '01723-998877',
    consultationFee: '৮০০ টাকা'
  },
  {
    id: 'doc-5',
    name: 'ডাঃ তানিয়া ফেরদৌস',
    specialty: 'চক্ষু রোগ বিশেষজ্ঞ ও ফ্যাকো সার্জন',
    degrees: 'MBBS, DO, FCPS (Eye)',
    hospital: 'বিএনএসবি চক্ষু হাসপাতাল, শিরোমণি, খুলনা',
    chamber: 'দৃষ্টি আই সেন্টার, ডাকবাংলা মোড়, খুলনা',
    districtId: 'khulna',
    districtName: 'খুলনা',
    visitingHours: 'বিকাল ৪টা - রাত ৭টা',
    serialPhone: '01730-112233',
    consultationFee: '৬০০ টাকা'
  },
  {
    id: 'doc-6',
    name: 'ডাঃ রেজোয়ান হাবিব',
    specialty: 'চর্ম, এলার্জি ও যৌন রোগ বিশেষজ্ঞ',
    degrees: 'MBBS, DDV, MD (Dermatology)',
    hospital: 'কুষ্টিয়া জেনারেল হাসপাতাল',
    chamber: 'মেডিনোভা মেডিকেল সার্ভিসেস, কুষ্টিয়া',
    districtId: 'kushtia',
    districtName: 'কুষ্টিয়া',
    visitingHours: 'বিকাল ৫টা - রাত ৮টা',
    serialPhone: '01825-443322',
    consultationFee: '৭০০ টাকা'
  }
];

const AMBULANCE_SERVICES = [
  { name: 'খুলনা মেডিকেল জরুরি অ্যাম্বুলেন্স', district: 'খুলনা', phone: '01711-295328', type: 'ICU / Freezing' },
  { name: 'রেড ক্রিসেন্ট অ্যাম্বুলেন্স খুলনা', district: 'খুলনা', phone: '01712-445566', type: 'সাধারণ ও অক্সিজেন' },
  { name: 'যশোর আল-আমিন অ্যাম্বুলেন্স সার্ভিস', district: 'যশোর', phone: '01715-667788', type: '২৪ ঘণ্টা এসি/নন-এসি' },
  { name: 'সাতক্ষীরা সদর হাসপাতাল অ্যাম্বুলেন্স', district: 'সাতক্ষীরা', phone: '01713-374189', type: 'জরুরি সার্ভিস' },
  { name: 'বাগেরহাট ফায়ার সার্ভিস অ্যাম্বুলেন্স', district: 'বাগেরহাট', phone: '01730-336699', type: 'জরুরি সেবা' }
];

const OXYGEN_SERVICES = [
  { name: 'খুলনা সেন্ট্রাল অক্সিজেন ব্যাংক', district: 'খুলনা', phone: '01713-998877', note: '২৪ ঘণ্টা হোম ডেলিভারি' },
  { name: 'যশোর রেড ক্রিসেন্ট অক্সিজেন কর্নার', district: 'যশোর', phone: '01819-445566', note: 'বিনামূল্যে রিফিল সাপোর্ট' },
  { name: 'কুষ্টিয়া মানবকল্যাণ অক্সিজেন সেবা', district: 'কুষ্টিয়া', phone: '01725-332211', note: 'জরুরি সিলিন্ডার' }
];

export const DoctorFinderHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'ambulance' | 'oxygen'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('সব');

  const specialties = ['সব', 'মেডিসিন ও হৃদরোগ', 'গাইনি', 'শিশু রোগ', 'অর্থোপেডিক', 'চক্ষু', 'চর্ম ও যৌন'];

  const filteredDoctors = DOCTORS.filter(d => {
    const matchSpecialty = selectedSpecialty === 'সব' || d.specialty.includes(selectedSpecialty);
    const matchQuery = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.chamber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSpecialty && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-emerald-100 dark:border-emerald-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Stethoscope className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                বিশেষজ্ঞ ডাক্তার ও অ্যাম্বুলেন্স
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  24/7 Emergency
                </span>
              </h2>
              <p className="text-[11px] text-teal-100">খুলনা বিভাগের বিশেষজ্ঞ চিকিৎসকের সিরিয়াল ও জরুরি অ্যাম্বুলেন্স সেবা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Stethoscope size={14} /> বিশেষজ্ঞ ডাক্তার তালিকা
          </button>
          <button
            onClick={() => setActiveTab('ambulance')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ambulance'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Ambulance size={14} /> জরুরি অ্যাম্বুলেন্স
          </button>
          <button
            onClick={() => setActiveTab('oxygen')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'oxygen'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Wind size={14} /> অক্সিজেন সিলিন্ডার
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5">
          {activeTab === 'doctors' && (
            <div className="space-y-3">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
                  {specialties.map(spec => (
                    <button
                      key={spec}
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedSpecialty === spec
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="ডাক্তারের নাম বা হাসপাতাল খুঁজুন..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {filteredDoctors.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full inline-block mb-1">
                            {doc.specialty}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.degrees}</p>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-xl shrink-0">
                          {doc.consultationFee}
                        </span>
                      </div>

                      <div className="my-2 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        <p className="flex items-center gap-1.5 font-medium">
                          <MapPin size={12} className="text-emerald-600 shrink-0" /> {doc.chamber}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock size={12} className="text-amber-500 shrink-0" /> {doc.visitingHours}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${doc.serialPhone}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Phone size={14} /> সিরিয়ালের জন্য কল দিন ({doc.serialPhone})
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ambulance' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900 flex items-center gap-2 text-xs text-red-800 dark:text-red-300">
                <Ambulance size={18} className="text-red-600 shrink-0" />
                <span>যেকোনো মুমূর্ষু রোগীর দ্রুত যাতায়াতের জন্য সরাসরি কল করে বুকিং দিন।</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AMBULANCE_SERVICES.map((amb, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full inline-block mb-1">
                        {amb.district} • {amb.type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{amb.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">জরুরি নম্বর: {amb.phone}</p>
                    </div>
                    <a
                      href={`tel:${amb.phone}`}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md transition shrink-0"
                      title="কল দিন"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'oxygen' && (
            <div className="space-y-3">
              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl border border-cyan-200 dark:border-cyan-900 flex items-center gap-2 text-xs text-cyan-900 dark:text-cyan-300">
                <Wind size={18} className="text-cyan-600 shrink-0" />
                <span>শ্বাসকষ্টের রোগী বা আইসিইউ সাপোর্টের জন্য অক্সিজেন সিলিন্ডার হোম ডেলিভারি সেবা।</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OXYGEN_SERVICES.map((oxy, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-full inline-block mb-1">
                        {oxy.district}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{oxy.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{oxy.note}</p>
                    </div>
                    <a
                      href={`tel:${oxy.phone}`}
                      className="p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl shadow-md transition shrink-0"
                      title="সিলিন্ডার কল"
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>জাতীয় স্বাস্থ্য হেল্পলাইন: ১৬২৬৩</span>
          <span className="font-bold text-emerald-700">খুলনা মেডিকেল কলেজ: 02-477762234</span>
        </div>
      </div>
    </div>
  );
};
