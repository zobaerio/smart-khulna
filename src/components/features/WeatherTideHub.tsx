import React, { useState } from 'react';
import { CloudRain, Sun, Wind, Droplets, Waves, AlertTriangle, Phone, ShieldAlert, X, Compass, ChevronRight } from 'lucide-react';

interface WeatherData {
  district: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  icon: 'sun' | 'rain' | 'cloud';
}

const DISTRICT_WEATHER: Record<string, WeatherData> = {
  khulna: { district: 'খুলনা সদর', temp: 31, condition: 'আংশিক মেঘলা', humidity: 74, windSpeed: 14, rainProb: 20, icon: 'cloud' },
  mongla: { district: 'মোংলা বন্দর / রামপাল', temp: 32, condition: 'উপকূলীয় বাতাস ও রোদ', humidity: 78, windSpeed: 18, rainProb: 30, icon: 'sun' },
  satkhira: { district: 'সাতক্ষীরা (শ্যামনগর)', temp: 31, condition: 'মেঘলা ও আর্দ্র', humidity: 80, windSpeed: 16, rainProb: 40, icon: 'cloud' },
  bagerhat: { district: 'বাগেরহাট', temp: 30, condition: 'স্বাভাবিক রোদ', humidity: 72, windSpeed: 12, rainProb: 15, icon: 'sun' },
  jashore: { district: 'যশোর', temp: 32, condition: 'উষ্ণ ও রৌদ্রোজ্জ্বল', humidity: 68, windSpeed: 10, rainProb: 10, icon: 'sun' },
  kushtia: { district: 'কুষ্টিয়া', temp: 33, condition: 'রৌদ্রোজ্জ্বল', humidity: 65, windSpeed: 9, rainProb: 5, icon: 'sun' }
};

const TIDE_SCHEDULE = [
  { location: 'রূপসা নদী (খুলনা লঞ্চঘাট)', highTide1: 'সকাল ০৫:২৫', lowTide1: 'দুপুর ১১:৪০', highTide2: 'সন্ধ্যা ০৫:৫০', lowTide2: 'রাত ১১:৫৫' },
  { location: 'পশুর নদী (মোংলা বন্দর ঘাট)', highTide1: 'সকাল ০৪:১৫', lowTide1: 'সকাল ১০:৩০', highTide2: 'বিকাল ০৪:৪৫', lowTide2: 'রাত ১০:৫০' },
  { location: 'খোলপেটুয়া / সুন্দরবন রেঞ্জ', highTide1: 'সকাল ০৩:৫০', lowTide1: 'সকাল ১০:০৫', highTide2: 'বিকাল ০৪:২০', lowTide2: 'রাত ১০:২৫' }
];

export const WeatherTideHub: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedCity, setSelectedCity] = useState('khulna');
  const weather = DISTRICT_WEATHER[selectedCity] || DISTRICT_WEATHER.khulna;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 dark:border-sky-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                আবহাওয়া ও উপকূলীয় জোয়ার-ভাটা
                <span className="text-[10px] bg-sky-400 text-sky-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Coastal Live
                </span>
              </h2>
              <p className="text-[11px] text-sky-100">খুলনা ও উপকূলীয় এলাকার আবহাওয়া, নদী জোয়ার-ভাটা ও দুর্যোগ সতর্কতা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-sky-500 to-blue-700 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none mb-2 backdrop-blur-md cursor-pointer"
                >
                  <option value="khulna" className="text-slate-900">খুলনা সদর</option>
                  <option value="mongla" className="text-slate-900">মোংলা বন্দর</option>
                  <option value="satkhira" className="text-slate-900">সাতক্ষীরা (উপকূল)</option>
                  <option value="bagerhat" className="text-slate-900">বাগেরহাট</option>
                  <option value="jashore" className="text-slate-900">যশোর</option>
                  <option value="kushtia" className="text-slate-900">কুষ্টিয়া</option>
                </select>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{weather.temp}°C</span>
                  <span className="text-sm font-medium text-sky-100">{weather.condition}</span>
                </div>
                <p className="text-xs text-sky-200 mt-1">খুলনা আবহাওয়া অফিস বুলেটিন পূর্বাভাস</p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/20">
                  <Droplets size={16} className="mx-auto mb-1 text-sky-200" />
                  <span className="text-[10px] block opacity-80">আর্দ্রতা</span>
                  <strong className="text-xs">{weather.humidity}%</strong>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/20">
                  <Wind size={16} className="mx-auto mb-1 text-sky-200" />
                  <span className="text-[10px] block opacity-80">বাতাস</span>
                  <strong className="text-xs">{weather.windSpeed} km/h</strong>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/20">
                  <CloudRain size={16} className="mx-auto mb-1 text-sky-200" />
                  <span className="text-[10px] block opacity-80">বৃষ্টির সম্ভাবনা</span>
                  <strong className="text-xs">{weather.rainProb}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Tide Schedule (জোয়ার-ভাটা) */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Waves size={18} className="text-blue-600" />
              উপকূলীয় নদ-নদীর জোয়ার-ভাটার সময়সূচি
            </h3>
            <div className="space-y-2.5">
              {TIDE_SCHEDULE.map((tide, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">{tide.location}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-800 dark:text-blue-300">
                      <span className="text-[10px] block font-semibold">১ম জোয়ার</span>
                      <strong>{tide.highTide1}</strong>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300">
                      <span className="text-[10px] block font-semibold">১ম ভাটা</span>
                      <strong>{tide.lowTide1}</strong>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-800 dark:text-blue-300">
                      <span className="text-[10px] block font-semibold">২য় জোয়ার</span>
                      <strong>{tide.highTide2}</strong>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300">
                      <span className="text-[10px] block font-semibold">২য় ভাটা</span>
                      <strong>{tide.lowTide2}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cyclone & Maritime Signals Guide */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-3xl border border-emerald-200 dark:border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300">বর্তমান মোংলা সমুদ্রবন্দর সংকেত: স্বাভাবিক (১ নম্বর দূরবর্তী সংকেত)</h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400">সুন্দরবন ও বঙ্গোপসাগরে ট্রলারসমূহকে সাবধানে চলাচল করতে বলা হয়েছে।</p>
              </div>
            </div>
            <a
              href="tel:1090"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <Phone size={13} /> দুর্যোগ বার্তা: ১০৯০
            </a>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>তথ্যসূত্র: বাংলাদেশ আবহাওয়া অধিদপ্তর ও বিআইডব্লিউটিএ</span>
          <span className="font-bold text-blue-600">জরুরি সহায়তা: ৯৯৯</span>
        </div>
      </div>
    </div>
  );
};
