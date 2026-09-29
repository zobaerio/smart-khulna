import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Waves,
  AlertTriangle,
  Phone,
  ShieldAlert,
  X,
  Compass,
  RefreshCw,
  MapPin,
  Calendar,
  Cloud
} from 'lucide-react';

interface WeatherData {
  district: string;
  temp: number;
  feelsLike?: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  isLive?: boolean;
}

const DISTRICT_PRESETS: Record<string, WeatherData> = {
  khulna: { district: 'খুলনা সদর', temp: 30, feelsLike: 34, condition: 'আংশিক মেঘলা', humidity: 71, windSpeed: 5, rainProb: 20 },
  mongla: { district: 'মোংলা বন্দর / রামপাল', temp: 31, feelsLike: 35, condition: 'উপকূলীয় বাতাস ও রোদ', humidity: 75, windSpeed: 16, rainProb: 30 },
  satkhira: { district: 'সাতক্ষীরা', temp: 30, feelsLike: 35, condition: 'মেঘাচ্ছন্ন ও আর্দ্র', humidity: 71, windSpeed: 6, rainProb: 35 },
  bagerhat: { district: 'বাগেরহাট', temp: 30, feelsLike: 34, condition: 'স্বাভাবিক রোদ', humidity: 72, windSpeed: 7, rainProb: 15 },
  jashore: { district: 'যশোর', temp: 31, feelsLike: 35, condition: 'উষ্ণ ও রৌদ্রোজ্জ্বল', humidity: 68, windSpeed: 8, rainProb: 10 },
  kushtia: { district: 'কুষ্টিয়া', temp: 32, feelsLike: 36, condition: 'রৌদ্রোজ্জ্বল', humidity: 65, windSpeed: 7, rainProb: 10 },
  jhenaidah: { district: 'ঝিনাইদহ', temp: 31, feelsLike: 35, condition: 'আংশিক রোদ', humidity: 67, windSpeed: 8, rainProb: 15 },
  magura: { district: 'মাগুরা', temp: 31, feelsLike: 35, condition: 'স্বাভাবিক আবহাওয়া', humidity: 70, windSpeed: 6, rainProb: 15 },
  meherpur: { district: 'মেহেরপুর', temp: 32, feelsLike: 36, condition: 'রোদ ও শুষ্ক বাতাস', humidity: 64, windSpeed: 8, rainProb: 10 },
  narail: { district: 'নড়াইল', temp: 31, feelsLike: 34, condition: 'স্বাভাবিক রোদ', humidity: 71, windSpeed: 6, rainProb: 15 },
  chuadanga: { district: 'চুয়াডাঙ্গা', temp: 32, feelsLike: 36, condition: 'তীব্র রোদ ও গরম', humidity: 62, windSpeed: 9, rainProb: 10 }
};

const TIDE_SCHEDULE = [
  { location: 'রূপসা নদী (খুলনা লঞ্চঘাট)', highTide1: 'সকাল ০৫:২৫', lowTide1: 'দুপুর ১১:৪০', highTide2: 'সন্ধ্যা ০৫:৫০', lowTide2: 'রাত ১১:৫৫' },
  { location: 'পশুর নদী (মোংলা বন্দর ঘাট)', highTide1: 'সকাল ০৪:১৫', lowTide1: 'সকাল ১০:৩০', highTide2: 'বিকাল ০৪:৪৫', lowTide2: 'রাত ১০:৫০' },
  { location: 'খোলপেটুয়া / সুন্দরবন রেঞ্জ', highTide1: 'সকাল ০৩:৫০', lowTide1: 'সকাল ১০:০৫', highTide2: 'বিকাল ০৪:২০', lowTide2: 'রাত ১০:২৫' }
];

export const WeatherTideHub: React.FC<{ onClose: () => void; initialDistrict?: string }> = ({
  onClose,
  initialDistrict = 'khulna'
}) => {
  const [selectedCity, setSelectedCity] = useState(initialDistrict);
  const [liveWeather, setLiveWeather] = useState<WeatherData | null>(null);
  const [forecastList, setForecastList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLiveInfo = async (city: string) => {
    setLoading(true);
    try {
      // 1. Fetch current weather
      const res = await fetch(`/api/weather?district=${city}`);
      const data = await res.json();
      if (data && (data.cod === 200 || data.cod === '200')) {
        setLiveWeather({
          district: data.districtBn || data.name || DISTRICT_PRESETS[city]?.district || city,
          temp: Math.round(data.main?.temp ?? 30),
          feelsLike: Math.round(data.main?.feels_like ?? 34),
          condition: data.weather?.[0]?.description || 'আংশিক মেঘলা',
          humidity: data.main?.humidity ?? 72,
          windSpeed: Math.round((data.wind?.speed ?? 2) * 3.6),
          rainProb: data.rainProb ?? 25,
          isLive: data.isLive === true
        });
      }

      // 2. Fetch 5-day forecast
      const fRes = await fetch(`/api/weather/forecast?district=${city}`);
      const fData = await fRes.json();
      if (fData && fData.list && Array.isArray(fData.list)) {
        setForecastList(fData.list.slice(0, 5));
      }
    } catch (e) {
      console.warn('Failed to load live data, using preset:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveInfo(selectedCity);
  }, [selectedCity]);

  const active = liveWeather || DISTRICT_PRESETS[selectedCity] || DISTRICT_PRESETS.khulna;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 dark:border-sky-950 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                লাইভ আবহাওয়া ও জোয়ার-ভাটা
                <span className="text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  Live Radar
                </span>
              </h2>
              <p className="text-[11px] text-emerald-100">খুলনা বিভাগের ১০টি জেলার লাইভ আবহাওয়া, নদী জোয়ার-ভাটা ও ঘূর্ণিঝড় সংকেত</p>
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
          {/* Main Weather Widget */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-800 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold rounded-xl px-3 py-1.5 outline-none backdrop-blur-md cursor-pointer"
                  >
                    <option value="khulna" className="text-slate-900">খুলনা সদর</option>
                    <option value="mongla" className="text-slate-900">মোংলা বন্দর / সুন্দরবন</option>
                    <option value="satkhira" className="text-slate-900">সাতক্ষীরা</option>
                    <option value="bagerhat" className="text-slate-900">বাগেরহাট</option>
                    <option value="jashore" className="text-slate-900">যশোর</option>
                    <option value="kushtia" className="text-slate-900">কুষ্টিয়া</option>
                    <option value="jhenaidah" className="text-slate-900">ঝিনাইদহ</option>
                    <option value="magura" className="text-slate-900">মাগুরা</option>
                    <option value="meherpur" className="text-slate-900">মেহেরপুর</option>
                    <option value="narail" className="text-slate-900">নড়াইল</option>
                    <option value="chuadanga" className="text-slate-900">চুয়াডাঙ্গা</option>
                  </select>
                  <button
                    onClick={() => fetchLiveInfo(selectedCity)}
                    title="রিফ্রেশ"
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  </button>
                  {active.isLive && (
                    <span className="text-[10px] bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                      লাইভ স্যাটেলাইট
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">{active.temp}°C</span>
                  <div>
                    <span className="text-sm font-semibold capitalize text-emerald-100 block">{active.condition}</span>
                    {active.feelsLike && (
                      <span className="text-[11px] text-emerald-200">অনুভূত {active.feelsLike}°C</span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-emerald-200 mt-1">OpenWeatherMap এবং আবহাওয়া বুলেটিন সমন্বিত</p>
              </div>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/20">
                  <Droplets size={16} className="mx-auto mb-1 text-emerald-200" />
                  <span className="text-[10px] block opacity-80">আর্দ্রতা</span>
                  <strong className="text-xs">{active.humidity}%</strong>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/20">
                  <Wind size={16} className="mx-auto mb-1 text-emerald-200" />
                  <span className="text-[10px] block opacity-80">বাতাস</span>
                  <strong className="text-xs">{active.windSpeed} km/h</strong>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl text-center border border-white/20">
                  <CloudRain size={16} className="mx-auto mb-1 text-emerald-200" />
                  <span className="text-[10px] block opacity-80">বৃষ্টি সম্ভাবনা</span>
                  <strong className="text-xs">{active.rainProb}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Strip */}
          {forecastList.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
                <Calendar size={14} className="text-emerald-600" />
                পরবর্তী দিনগুলোর আবহাওয়ার পূর্বাভাস
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {forecastList.map((item, idx) => {
                  const dateStr = item.dt_txt
                    ? new Date(item.dt_txt).toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric' })
                    : `দিন ${idx + 1}`;
                  const fTemp = item.main?.temp ? Math.round(item.main.temp) : 31;
                  const fDesc = item.weather?.[0]?.description || 'রৌদ্রোজ্জ্বল';
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center"
                    >
                      <span className="text-[10px] text-slate-500 font-bold block">{dateStr}</span>
                      <Sun size={18} className="mx-auto my-1 text-amber-500" />
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">{fTemp}°C</span>
                      <span className="text-[9px] text-slate-500 truncate block">{fDesc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tide Schedule (নদীর জোয়ার-ভাটা) */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Waves size={18} className="text-teal-600" />
              উপকূলীয় নদ-নদীর জোয়ার-ভাটার সময়সূচি (রূপসা, পশুর ও সুন্দরবন)
            </h3>
            <div className="space-y-2.5">
              {TIDE_SCHEDULE.map((tide, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">{tide.location}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-teal-800 dark:text-teal-300">
                      <span className="text-[10px] block font-semibold">১ম জোয়ার</span>
                      <strong>{tide.highTide1}</strong>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300">
                      <span className="text-[10px] block font-semibold">১ম ভাটা</span>
                      <strong>{tide.lowTide1}</strong>
                    </div>
                    <div className="p-2 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-teal-800 dark:text-teal-300">
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
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300">মোংলা সমুদ্রবন্দর ও সুন্দরবন উপকূল: স্বাভাবিক আবহাওয়া সংকেত</h4>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400">সুন্দরবন ও উপকূলীয় নদীপথে সতর্কতার সাথে নৌযান চলাচলের পরামর্শ রয়েছে।</p>
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
          <span>তথ্যসূত্র: OpenWeatherMap এবং বাংলাদেশ আবহাওয়া অধিদপ্তর</span>
          <span className="font-bold text-emerald-700">জরুরি সহায়তা: ৯৯৯</span>
        </div>
      </div>
    </div>
  );
};
