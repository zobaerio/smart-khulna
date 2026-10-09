import React, { useState } from 'react';
import { Ambulance, Phone, Heart, MapPin, ShieldAlert, CheckCircle, Search, Droplets } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AmbulanceHubProps {
  onClose: () => void;
}

interface AmbulanceService {
  id: string;
  nameBn: string;
  nameEn: string;
  phone: string;
  type: string;
  locationBn: string;
  locationEn: string;
  hasOxygen: boolean;
  available247: boolean;
}

const AMBULANCES: AmbulanceService[] = [
  { id: 'a1', nameBn: 'খুলনা মেডিকেল কলেজ অ্যাম্বুলেন্স সার্ভিস', nameEn: 'Khulna Medical College Ambulance', phone: '01711-234567', type: 'ICU / AC Ambulance', locationBn: 'সোনাডাঙ্গা, খুলনা', locationEn: 'Sonadanga, Khulna', hasOxygen: true, available247: true },
  { id: 'a2', nameBn: 'আল-আকসা অ্যাম্বুলেন্স সার্ভিস', nameEn: 'Al-Aqsa Ambulance Service', phone: '01819-987654', type: 'Freezer / Non-AC', locationBn: 'শিববাড়ি মোড়, খুলনা', locationEn: 'Shibbari Moor, Khulna', hasOxygen: true, available247: true },
  { id: 'a3', nameBn: 'সেবা ২৪ অ্যাম্বুলেন্স খুলনা', nameEn: 'Seba 24 Ambulance Khulna', phone: '01911-334455', type: 'Oxygen Support Ambulance', locationBn: 'খালিশপুর, খুলনা', locationEn: 'Khalishpur, Khulna', hasOxygen: true, available247: true },
  { id: 'a4', nameBn: 'খুলনা রেড ক্রিসেন্ট অ্যাম্বুলেন্স', nameEn: 'Khulna Red Crescent Ambulance', phone: '041-722333', type: 'Emergency Transport', locationBn: 'কেডি ঘোষ রোড, খুলনা', locationEn: 'KD Ghosh Road, Khulna', hasOxygen: false, available247: true },
  { id: 'a5', nameBn: 'সিটি অ্যাম্বুলেন্স সার্ভিস', nameEn: 'City Ambulance Service', phone: '01730-112233', type: 'AC Ambulance', locationBn: 'ডুমুরিয়া, খুলনা', locationEn: 'Dumuria, Khulna', hasOxygen: true, available247: true }
];

const EMERGENCY_HOTLINES = [
  { titleBn: 'জাতীয় জরুরি সেবা', titleEn: 'National Emergency', number: '999', desc: 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স' },
  { titleBn: 'খুলনা পুলিশ কন্ট্রোল রুম', titleEn: 'Khulna Police Control', number: '041-720233', desc: 'আইনশৃঙ্খলা ও নিরাপত্তা সহায়তা' },
  { titleBn: 'খুলনা ফায়ার সার্ভিস', titleEn: 'Khulna Fire Service', number: '041-720044', desc: 'আগুন ও দুর্ঘটনা উদ্ধার' },
  { titleBn: 'খুলনা সদর হাসপাতাল', titleEn: 'Khulna Sadar Hospital', number: '041-721555', desc: 'জরুরি চিকিৎসা বিভাগ' }
];

export const AmbulanceEmergencyHub: React.FC<AmbulanceHubProps> = ({ onClose }) => {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOxygen, setFilterOxygen] = useState(false);

  const filteredAmbulances = AMBULANCES.filter(a => {
    const matchesSearch = a.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.locationBn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOxygen = filterOxygen ? a.hasOxygen : true;
    return matchesSearch && matchesOxygen;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-red-500/20">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Ambulance className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                {isBn ? 'জরুরি অ্যাম্বুলেন্স ও হটলাইন নেটওয়ার্ক' : 'Emergency Ambulance & Hotline Network'}
              </h2>
              <p className="text-xs md:text-sm text-red-100">
                {isBn ? '২৪/৭ অ্যাম্বুলেন্স সার্ভিস এবং জরুরি সরকারি হটলাইন নম্বর' : '24/7 Ambulance service & emergency government hotlines'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Hotlines Banner */}
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            {isBn ? 'জরুরি হেল্পলাইন নম্বরসমূহ' : 'Emergency Hotline Numbers'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EMERGENCY_HOTLINES.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number}`}
                className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-red-200 dark:border-red-900/50 hover:shadow-md transition text-center group"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition">
                  {isBn ? h.titleBn : h.titleEn}
                </div>
                <div className="text-lg font-extrabold text-red-600 dark:text-red-400 my-0.5">
                  {h.number}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {h.desc}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? 'অ্যাম্বুলেন্স বা এলাকা খুঁজুন...' : 'Search ambulance or area...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={filterOxygen}
              onChange={(e) => setFilterOxygen(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            {isBn ? 'শুধুমাত্র অক্সিজেন সুবিধাসম্পন্ন' : 'Oxygen Support Only'}
          </label>
        </div>

        {/* Ambulance List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAmbulances.map((amb) => (
              <div key={amb.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {isBn ? amb.nameBn : amb.nameEn}
                    </h3>
                    {amb.hasOxygen && (
                      <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold shrink-0">
                        {isBn ? 'অক্সিজেন যুক্ত' : 'Oxygen'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">
                    {amb.type}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {isBn ? amb.locationBn : amb.locationEn}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {isBn ? '২৪ ঘণ্টা সচল' : '24/7 Available'}
                  </span>
                  <a
                    href={`tel:${amb.phone}`}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {amb.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
          {isBn ? 'স্মার্ট খুলনা জরুরি চিকিৎসা ও অ্যাম্বুলেন্স সার্ভিস' : 'Smart Khulna Emergency Medical & Ambulance Service'}
        </div>
      </div>
    </div>
  );
};
