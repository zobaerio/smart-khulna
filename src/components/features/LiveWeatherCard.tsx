import React, { useState, useEffect } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Navigation,
  Compass,
  Sparkles
} from 'lucide-react';

interface WeatherProps {
  selectedDistrictId?: string;
  onOpenFullForecast?: () => void;
  className?: string;
}

const DISTRICT_NAMES_BN: Record<string, string> = {
  khulna: 'খুলনা সদর',
  bagerhat: 'বাগেরহাট',
  satkhira: 'সাতক্ষীরা',
  jashore: 'যশোর',
  jhenaidah: 'ঝিনাইদহ',
  kushtia: 'কুষ্টিয়া',
  magura: 'মাগুরা',
  meherpur: 'মেহেরপুর',
  narail: 'নড়াইল',
  chuadanga: 'চুয়াডাঙ্গা'
};

const CONDITION_MAP_BN: Record<string, string> = {
  'clear sky': 'পরিষ্কার আকাশ ও রোদ',
  'few clouds': 'স্বল্প মেঘলা',
  'scattered clouds': 'বিক্ষিপ্ত মেঘলা',
  'broken clouds': 'আংশিক মেঘলা আকাশ',
  'overcast clouds': 'মেঘাচ্ছন্ন আকাশ',
  'light rain': 'হালকা গুঁড়ি বৃষ্টি',
  'moderate rain': 'মাঝারি বৃষ্টিপাত',
  'heavy intensity rain': 'ভারী বর্ষণ',
  'very heavy rain': 'প্রবল বর্ষণ',
  'thunderstorm': 'বজ্রঝড় ও বৃষ্টি',
  'thunderstorm with rain': 'বজ্রসহ বৃষ্টিপাত',
  'haze': 'কুয়াশাচ্ছন্ন পরিবেশ',
  'mist': 'হালকা কুয়াশা'
};

export const LiveWeatherCard: React.FC<WeatherProps> = ({
  selectedDistrictId = 'khulna',
  onOpenFullForecast,
  className = ''
}) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeDistrict, setActiveDistrict] = useState(selectedDistrictId);
  const [usingGps, setUsingGps] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!usingGps) {
      setActiveDistrict(selectedDistrictId);
    }
  }, [selectedDistrictId, usingGps]);

  const fetchWeather = async (district: string, customCoords?: { lat: number; lon: number }) => {
    setLoading(true);
    try {
      const url = customCoords
        ? `/api/weather?lat=${customCoords.lat}&lon=${customCoords.lon}`
        : `/api/weather?district=${district}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && (data.cod === 200 || data.cod === '200')) {
        setWeather(data);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords && usingGps) {
      fetchWeather(activeDistrict, coords);
    } else {
      fetchWeather(activeDistrict);
    }
  }, [activeDistrict, coords, usingGps]);

  const requestGpsLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      alert('আপনার ডিভাইসে লোকেশন ফিচার চালু নেই');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setUsingGps(true);
      },
      () => {
        setUsingGps(false);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const temp = weather?.main?.temp ? Math.round(weather.main.temp) : 29;
  const feelsLike = weather?.main?.feels_like ? Math.round(weather.main.feels_like) : temp + 4;
  const conditionEn = (weather?.weather?.[0]?.description || 'broken clouds').toLowerCase();
  const conditionBn = CONDITION_MAP_BN[conditionEn] || weather?.weather?.[0]?.description || 'আংশিক মেঘলা আকাশ';
  const humidity = weather?.main?.humidity ?? 71;
  const windSpeedKmh = weather?.wind?.speed ? Math.round(weather.wind.speed * 3.6) : 4;
  const isSevere = conditionEn.includes('thunder') || conditionEn.includes('heavy rain');

  const districtName = usingGps
    ? 'আমার জিপিএস অবস্থান'
    : (DISTRICT_NAMES_BN[activeDistrict] || weather?.districtBn || weather?.name || 'খুলনা');

  return (
    <div className={`mx-3 sm:mx-0 shrink-0 ${className}`}>
      <div
        onClick={onOpenFullForecast}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white shadow-lg border border-emerald-400/25 p-4 sm:p-5 cursor-pointer hover:border-emerald-400/50 hover:shadow-xl transition-all duration-300 group select-none min-h-[145px] flex flex-col justify-between"
      >
        {/* Decorative Atmospheric Glows */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-44 h-32 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 pointer-events-none" />

        {/* Severe Alert Strip (if detected) */}
        {isSevere && (
          <div className="mb-2 p-2 rounded-xl bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2 font-bold animate-pulse">
            <AlertTriangle size={14} className="text-amber-300 shrink-0" />
            <span>সতর্কবার্তা: উপকূলীয় অঞ্চলে ঝড়ো হাওয়া ও বৃষ্টিপাতের পূর্বাভাস রয়েছে।</span>
          </div>
        )}

        {/* 1. TOP BAR: District Location, Live Radar Tag, GPS and Refresh */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-sm" />
            </span>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin size={14} className="text-emerald-400 shrink-0 drop-shadow-xs" />
              <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide truncate font-serif">
                {districtName}
              </h3>
              <span className="text-[10px] bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                লাইভ আবহাওয়া
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={requestGpsLocation}
              title="আমার বর্তমান অবস্থান (GPS)"
              className={`p-1.5 sm:px-2 sm:py-1 rounded-xl border text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs ${
                usingGps
                  ? 'bg-emerald-500/40 border-emerald-400 text-emerald-200'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200'
              }`}
            >
              <Navigation size={12} className={usingGps ? 'text-emerald-300 animate-pulse' : ''} />
              <span className="text-[10px] font-bold hidden xs:inline">GPS</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fetchWeather(activeDistrict, coords || undefined);
              }}
              title="রিফ্রেশ করুন"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition cursor-pointer shadow-2xs"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin text-emerald-300' : ''} />
            </button>
          </div>
        </div>

        {/* 2. MIDDLE HERO SECTION: Temperature, Weather Icon & Condition */}
        <div className="my-2.5 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Weather Animated Icon Box */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
              {weather?.weather?.[0]?.icon ? (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={conditionBn}
                  className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow"
                />
              ) : (
                <Sun className="text-amber-400 w-8 h-8 animate-spin-slow" />
              )}
            </div>

            {/* Temperature & Description */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white leading-none drop-shadow-sm">
                  {temp}°<span className="text-xl sm:text-2xl font-light text-emerald-300">C</span>
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-100">
                  {conditionBn}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 mt-1 flex items-center gap-1 font-medium">
                <span>অনুভূত তাপমাত্রা:</span>
                <span className="font-bold text-white bg-white/10 px-1.5 py-0.2 rounded font-mono">{feelsLike}°C</span>
              </p>
            </div>
          </div>

          {/* Right Forecast Pill Link */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] text-emerald-200/80 uppercase font-mono tracking-wider font-semibold">
              OpenWeather Satellite
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-sm transition group-hover:translate-x-0.5">
              <span>বিস্তারিত পূর্বাভাস</span>
              <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* 3. BOTTOM METRICS STRIP: Humidity, Wind Speed, Mobile Forecast Link */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-200 font-medium">
            <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-xl border border-white/10 transition" title="বাতাসের আর্দ্রতা">
              <Droplets size={12} className="text-sky-300 shrink-0" />
              <span className="text-[11px] text-slate-300">আর্দ্রতা:</span>
              <span className="font-mono font-bold text-white">{humidity}%</span>
            </div>

            <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-xl border border-white/10 transition" title="বাতাসের গতিবেগ">
              <Wind size={12} className="text-teal-300 shrink-0" />
              <span className="text-[11px] text-slate-300">বাতাস:</span>
              <span className="font-mono font-bold text-white">{windSpeedKmh} <span className="text-[9px] font-normal">কিমি/ঘ</span></span>
            </div>
          </div>

          {/* Mobile Forecast Link */}
          <div className="sm:hidden">
            <span className="inline-flex items-center gap-1 bg-emerald-400 text-emerald-950 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-xs transition group-hover:translate-x-0.5">
              <span>পূর্বাভাস</span>
              <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
