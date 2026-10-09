import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Layers, 
  Sparkles, 
  Info, 
  Check, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  BarChart2 
} from 'lucide-react';
import { District, Service } from '../../dbData';

interface KhulnaDistrictDensityMapProps {
  districts: District[];
  services: Service[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  className?: string;
}

// 10 Districts topological polygon SVG path representations positioned accurately within Khulna Division bounds (500x560 viewBox)
// Division layout:
// North: Kushtia, Meherpur, Chuadanga
// Middle-North: Jhenaidah, Magura
// Middle: Jashore, Narail
// South: Satkhira (South-West / Sundarbans), Khulna (Central South), Bagerhat (South-East / Sundarbans)
interface DistrictGeoShape {
  id: string;
  nameBn: string;
  nameEn: string;
  path: string;
  center: [number, number]; // [x, y] for label & pin placement
}

const KHULNA_DISTRICT_GEOMETRIES: DistrictGeoShape[] = [
  // 1. Meherpur (North-West corner)
  {
    id: 'meherpur',
    nameBn: 'মেহেরপুর',
    nameEn: 'Meherpur',
    path: 'M 110 50 L 155 42 L 180 75 L 165 110 L 125 120 L 95 90 Z',
    center: [135, 82]
  },
  // 2. Kushtia (North-East of Meherpur, bordering Padma)
  {
    id: 'kushtia',
    nameBn: 'কুষ্টিয়া',
    nameEn: 'Kushtia',
    path: 'M 155 42 L 235 25 L 290 60 L 265 105 L 210 115 L 180 75 Z',
    center: [225, 70]
  },
  // 3. Chuadanga (South of Meherpur/Kushtia)
  {
    id: 'chuadanga',
    nameBn: 'চুয়াডাঙ্গা',
    nameEn: 'Chuadanga',
    path: 'M 125 120 L 165 110 L 210 115 L 205 175 L 150 185 L 115 155 Z',
    center: [160, 145]
  },
  // 4. Jhenaidah (East of Chuadanga, South of Kushtia)
  {
    id: 'jhenaidah',
    nameBn: 'ঝিনাইদহ',
    nameEn: 'Jhenaidah',
    path: 'M 210 115 L 265 105 L 295 140 L 285 200 L 215 205 L 205 175 Z',
    center: [250, 155]
  },
  // 5. Magura (East of Jhenaidah, bordering Faridpur)
  {
    id: 'magura',
    nameBn: 'মাগুরা',
    nameEn: 'Magura',
    path: 'M 295 140 L 370 130 L 390 180 L 350 220 L 285 200 Z',
    center: [335, 175]
  },
  // 6. Jashore (South of Chuadanga & Jhenaidah, Central Hub)
  {
    id: 'jashore',
    nameBn: 'যশোর',
    nameEn: 'Jashore',
    path: 'M 150 185 L 215 205 L 285 200 L 295 280 L 235 300 L 170 290 L 135 240 Z',
    center: [215, 245]
  },
  // 7. Narail (East of Jashore, South of Magura)
  {
    id: 'narail',
    nameBn: 'নড়াইল',
    nameEn: 'Narail',
    path: 'M 285 200 L 350 220 L 375 270 L 330 315 L 295 280 Z',
    center: [330, 260]
  },
  // 8. Satkhira (South-West, Bordering Sundarbans & West Bengal)
  {
    id: 'satkhira',
    nameBn: 'সাতক্ষীরা',
    nameEn: 'Satkhira',
    path: 'M 135 240 L 170 290 L 210 320 L 195 440 L 155 520 L 105 480 L 100 320 Z',
    center: [150, 390]
  },
  // 9. Khulna (Central-South, Divisional HQ, Rupsha river)
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    path: 'M 210 320 L 235 300 L 295 280 L 330 315 L 305 380 L 290 480 L 245 530 L 195 440 Z',
    center: [260, 390]
  },
  // 10. Bagerhat (South-East, Sundarbans & Mongla Port)
  {
    id: 'bagerhat',
    nameBn: 'বাগেরহাট',
    nameEn: 'Bagerhat',
    path: 'M 330 315 L 375 270 L 420 310 L 410 430 L 360 525 L 290 480 L 305 380 Z',
    center: [360, 400]
  }
];

export const KhulnaDistrictDensityMap: React.FC<KhulnaDistrictDensityMapProps> = ({
  districts,
  services,
  selectedDistrict,
  onSelectDistrict,
  className = ''
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [clickPulseId, setClickPulseId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute live service count and density per district
  const serviceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    districts.forEach(d => { counts[d.id] = 0; });

    services.forEach(s => {
      const distId = s.district_id || (s as any).districtId || (s as any).district || 'khulna';
      counts[distId] = (counts[distId] || 0) + 1;
    });

    const values = Object.values(counts);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);

    return { counts, max, min, total: services.length };
  }, [districts, services]);

  // D3 Color Interpolation Scale (Khulna Green / Emerald Gradient)
  const colorScale = useMemo(() => {
    return d3.scaleSequential()
      .domain([0, Math.max(serviceStats.max, 5)])
      .interpolator(d3.interpolateRgbBasis([
        '#d1fae5', // Light mint/emerald 100
        '#6ee7b7', // Emerald 300
        '#10b981', // Emerald 500
        '#047857', // Emerald 700
        '#064e3b'  // Emerald 900
      ]));
  }, [serviceStats.max]);

  const handleDistrictClick = (districtId: string) => {
    setClickPulseId(districtId);
    setTimeout(() => setClickPulseId(null), 800);
    onSelectDistrict(districtId);
  };

  const selectedShape = KHULNA_DISTRICT_GEOMETRIES.find(g => g.id === selectedDistrict);
  const hoveredShape = KHULNA_DISTRICT_GEOMETRIES.find(g => g.id === hoveredDistrict);
  const activeDetailShape = hoveredShape || selectedShape;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-xs overflow-hidden transition-all ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black">
            <Compass size={17} className="animate-spin-slow" />
          </div>
          <div className="text-left">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 font-serif">
              <span>খুলনা বিভাগীয় ইন্টারেক্টিভ ম্যাপ</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                D3 Density
              </span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-serif">
              জেলায় ট্যাপ করে তাৎক্ষণিক সেবা ফিল্টার করুন • মোট সেবা: {serviceStats.total}টি
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer text-xs flex items-center gap-1"
            title={isExpanded ? 'ম্যাপ ছোট করুন' : 'ম্যাপ বড় করুন'}
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            <span className="text-[10px] font-bold hidden sm:inline">
              {isExpanded ? 'সংক্ষেপ' : 'ম্যাপ দেখুন'}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-3"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              {/* Left Column: Interactive D3 Map SVG */}
              <div className="lg:col-span-7 relative flex justify-center items-center bg-slate-50/70 dark:bg-slate-950/60 rounded-2xl p-2 sm:p-3 border border-slate-100 dark:border-slate-800/80">
                <svg
                  ref={svgRef}
                  viewBox="70 10 380 540"
                  className="w-full max-w-[360px] sm:max-w-[420px] h-auto drop-shadow-md select-none touch-manipulation"
                  style={{ maxHeight: '420px' }}
                >
                  <defs>
                    {/* Active District Glow Filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    
                    {/* Sundarbans Water Texture Accent */}
                    <linearGradient id="bayOfBengal" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity="0.25" />
                    </linearGradient>
                  </defs>

                  {/* Water / Bay of Bengal subtle backdrop */}
                  <rect x="70" y="470" width="380" height="80" fill="url(#bayOfBengal)" rx="12" />
                  <text x="260" y="525" textAnchor="middle" className="text-[10px] fill-sky-600/50 font-serif font-bold italic tracking-widest">
                    বঙ্গোপসাগর ও সুন্দরবন উপকূল
                  </text>

                  {/* Render 10 District Paths */}
                  {KHULNA_DISTRICT_GEOMETRIES.map((geo) => {
                    const count = serviceStats.counts[geo.id] || 0;
                    const isSelected = selectedDistrict === geo.id;
                    const isHovered = hoveredDistrict === geo.id;
                    const isPulsing = clickPulseId === geo.id;
                    const fillColor = isSelected ? '#047857' : colorScale(count);

                    return (
                      <g 
                        key={geo.id}
                        className="cursor-pointer transition-transform duration-200"
                        onMouseEnter={() => setHoveredDistrict(geo.id)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                        onClick={() => handleDistrictClick(geo.id)}
                      >
                        {/* District Polygon */}
                        <path
                          d={geo.path}
                          fill={fillColor}
                          stroke={isSelected ? '#ffffff' : '#ffffff'}
                          strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                          filter={isSelected ? 'url(#glow)' : undefined}
                          className={`transition-all duration-300 ${
                            isSelected 
                              ? 'brightness-110 drop-shadow-lg' 
                              : isHovered 
                              ? 'brightness-105 scale-[1.01] origin-center' 
                              : 'hover:brightness-105'
                          }`}
                        />

                        {/* Pulse Ring when Selected or Clicked */}
                        {(isSelected || isPulsing) && (
                          <circle
                            cx={geo.center[0]}
                            cy={geo.center[1]}
                            r={isPulsing ? 26 : 18}
                            fill="none"
                            stroke={isSelected ? '#10b981' : '#34d399'}
                            strokeWidth={2}
                            className="animate-ping opacity-75 pointer-events-none"
                          />
                        )}

                        {/* Center Pin & Count Badge */}
                        <g transform={`translate(${geo.center[0]}, ${geo.center[1]})`} pointerEvents="none">
                          <circle
                            r={isSelected ? 10 : 8}
                            fill={isSelected ? '#ffffff' : '#064e3b'}
                            stroke={isSelected ? '#047857' : '#ffffff'}
                            strokeWidth={1.5}
                            className="shadow-sm transition-all"
                          />
                          <text
                            y={3}
                            textAnchor="middle"
                            className={`text-[9px] font-black font-mono select-none ${
                              isSelected ? 'fill-emerald-800' : 'fill-white'
                            }`}
                          >
                            {count}
                          </text>

                          {/* District Name Label */}
                          <text
                            y={isSelected ? -14 : -12}
                            textAnchor="middle"
                            className={`text-[10px] font-bold select-none font-serif drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] ${
                              isSelected 
                                ? 'fill-emerald-950 font-black scale-105' 
                                : 'fill-slate-800 dark:fill-slate-100'
                            }`}
                          >
                            {geo.nameBn}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Micro Legend inside map */}
                <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
                    <span className="text-[9px] text-slate-400">কম</span>
                    <div className="w-14 h-2 rounded-full bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-900" />
                    <span className="text-[9px] text-slate-400">বেশি সেবা</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live District Insights & One-Tap Filters */}
              <div className="lg:col-span-5 space-y-2.5 text-left">
                {/* Active District Info Card */}
                {activeDetailShape && (
                  <motion.div
                    key={activeDetailShape.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-emerald-600 animate-bounce" />
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-serif">
                          {activeDetailShape.nameBn} জেলা
                        </h4>
                        <span className="text-[10px] text-slate-400 font-sans">({activeDetailShape.nameEn})</span>
                      </div>
                      
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white font-mono shadow-xs">
                        {serviceStats.counts[activeDetailShape.id] || 0} টি সেবা
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-serif leading-relaxed">
                      {activeDetailShape.id === 'khulna' && 'বিভাগীয় প্রধান শহর, রূপসা সেতু, খুলনা বিশ্ববিদ্যালয় ও সমন্বিত জরুরি সেবা কেন্দ্র।'}
                      {activeDetailShape.id === 'satkhira' && 'সুন্দরবনের প্রবেশদ্বার, চিংড়ি শিল্প ও ভারতীয় সীমান্ত লাগোয়া ঐতিহ্যবাহী জেলা।'}
                      {activeDetailShape.id === 'bagerhat' && 'ঐতিহাসিক ষাট গম্বুজ মসজিদ, মোংলা সমুদ্র বন্দর ও সুন্দরবন ইকো-ট্যুরিজম।'}
                      {activeDetailShape.id === 'jashore' && 'আইটি পার্ক, বেনাপোল স্থলবন্দর ও দেশের প্রাচীনতম যশোর বিমানবন্দর।'}
                      {activeDetailShape.id === 'kushtia' && 'বাউল সম্রাট লালন শাহের মাজার, শিলাইদহ রবীন্দ্র কুঠিবাড়ি ও সাহিত্য সংস্কৃতি।'}
                      {activeDetailShape.id === 'jhenaidah' && 'কৃষি ও মৎস্য সম্পদ সমৃদ্ধ নবগঙ্গা নদীর তীরবর্তী গুরুত্বপূর্ণ বাণিজ্য কেন্দ্র।'}
                      {activeDetailShape.id === 'magura' && 'ক্রিকেট কিংবদন্তিদের জন্মভূমি ও ঐতিহ্যবাহী মহম্মদপুর দূর্গ এলাকা।'}
                      {activeDetailShape.id === 'narail' && 'চিত্রশিল্পী এস এম সুলতানের স্মৃতিধন্য চিত্রা নদীর নান্দনিক জনপদ।'}
                      {activeDetailShape.id === 'chuadanga' && 'ঐতিহাসিক নাটুদহ ও কেরু অ্যান্ড কোং চিনি কল খ্যাত সীমান্ত জেলা।'}
                      {activeDetailShape.id === 'meherpur' && 'বাংলাদেশের প্রথম রাজধানী মুজিবনগর স্মৃতিসৌধ খ্যাত ঐতিহাসিক পূণ্যভূমি।'}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => handleDistrictClick(activeDetailShape.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          selectedDistrict === activeDetailShape.id
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Filter size={13} />
                        <span>
                          {selectedDistrict === activeDetailShape.id 
                            ? '✅ বর্তমানে এই জেলার সেবা ফিল্টারকৃত আছে' 
                            : `${activeDetailShape.nameBn} জেলার সেবাগুলো দেখুন`}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Grid of all 10 Districts Pills for Quick Tap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Layers size={12} className="text-emerald-600" />
                      ১০টি জেলার সেবা ঘনত্ব ও তালিকা:
                    </span>
                    {selectedDistrict && (
                      <button
                        onClick={() => onSelectDistrict('all')}
                        className="text-[10px] text-emerald-600 hover:underline cursor-pointer"
                      >
                        সব জেলা রিসেট
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-2 gap-1.5 text-xs">
                    {KHULNA_DISTRICT_GEOMETRIES.map(g => {
                      const count = serviceStats.counts[g.id] || 0;
                      const isSelected = selectedDistrict === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => handleDistrictClick(g.id)}
                          className={`p-2 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50/60 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span className="font-bold text-[11px] font-serif truncate">
                            {g.nameBn}
                          </span>
                          <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
