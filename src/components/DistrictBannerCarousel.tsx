import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Banner, District } from '../dbData';

interface DistrictBannerCarouselProps {
  banners: Banner[];
  selectedDistrict: string;
  districts: District[];
  onNavigateToServices?: (districtId: string, categoryId?: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  onOpenDownload?: () => void;
}

export const DistrictBannerCarousel: React.FC<DistrictBannerCarouselProps> = ({
  banners,
  selectedDistrict,
  districts,
  onNavigateToServices,
  onSelectCategory,
  onOpenDownload
}) => {
  const currentDistrict = districts.find(d => d.id === selectedDistrict);

  // Filter active banners for the selected district, fallback to 'all' banners or district image
  const districtBanners = banners.filter(
    b => b.isActive && (b.districtId === selectedDistrict || b.districtId === 'all')
  ).sort((a, b) => (a.priority || 1) - (b.priority || 1));

  // Fallback if no banner exists in database
  const activeBanners = districtBanners.length > 0 ? districtBanners : [
    {
      id: `fallback_${selectedDistrict}`,
      title: `স্মার্ট ${currentDistrict?.name || 'খুলনা'} পোর্টালে আপনাকে স্বাগতম`,
      subtitle: `${currentDistrict?.nameEn || 'Khulna'} জেলা এবং খুলনা বিভাগের সকল অনলাইন নাগরিক সেবা নির্দেশিকা`,
      image: currentDistrict?.image || 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=1200&q=80',
      districtId: selectedDistrict,
      actionText: 'সেবা নির্দেশিকা দেখুন',
      actionType: 'internal' as const,
      actionTarget: 'services',
      isActive: true,
      priority: 1
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset index if selectedDistrict changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedDistrict]);

  // Auto sliding carousel
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBanners.length, isPaused, selectedDistrict]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleBannerClick = () => {
    if (!currentBanner) return;
    if (currentBanner.actionTarget === 'download' && onOpenDownload) {
      onOpenDownload();
    } else if (currentBanner.actionType === 'category' && currentBanner.actionTarget && onSelectCategory) {
      onSelectCategory(currentBanner.actionTarget);
    } else if (onNavigateToServices) {
      onNavigateToServices(selectedDistrict);
    }
  };

  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group cursor-pointer aspect-video sm:aspect-video min-h-[140px] max-h-[200px] bg-slate-900 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={handleBannerClick}
    >
      {/* Background Banner Image */}
      <img
        src={currentBanner.image}
        alt={currentBanner.title}
        className="w-full h-full object-cover transition duration-700 transform scale-100 group-hover:scale-105"
      />

      {/* Dark & Brand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent flex flex-col justify-end p-4 sm:p-5">
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          {/* District & Category Tag */}
          <div className="flex items-center gap-1.5">
            <span className="bg-lime-400 text-emerald-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <MapPin size={10} />
              <span>{currentDistrict?.name || 'খুলনা বিভাগ'}</span>
            </span>
            <span className="text-[10px] text-lime-200 font-medium">তথ্য ও সেবা হাব</span>
          </div>

          {/* Banner Title */}
          <h2 className="text-sm sm:text-lg md:text-xl font-black text-white tracking-wide leading-snug font-serif line-clamp-2 drop-shadow-sm">
            {currentBanner.title}
          </h2>

          {/* Banner Subtitle */}
          {currentBanner.subtitle && (
            <p className="text-[10px] sm:text-xs text-emerald-100/90 line-clamp-1 font-normal drop-shadow-xs">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Action CTA Button */}
          {currentBanner.actionText && (
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-xl border border-white/30 transition">
                <span>{currentBanner.actionText}</span>
                <ArrowRight size={11} />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Controls (shown if multiple banners) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight size={16} />
          </button>

          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-5 bg-lime-400'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
