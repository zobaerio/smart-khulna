import React, { useState } from 'react';
import { playTigerRoar } from '../../lib/tigerRoarAudio';

interface SundarbansTigerMascotProps {
  size?: number | string;
  className?: string;
  showTooltip?: boolean;
  facingLeft?: boolean;
  id?: string;
}

/**
 * Majestic Royal Bengal Tiger Mascot (রয়্যাল বেঙ্গল বাঘ 🐅)
 * 
 * - True Transparent PNG Cutout (alpha channel, zero white box, zero background)
 * - Occupies ~75-85% of the ticker banner height without cropping or distortion
 * - Natural Bengal tiger orientation (head facing left towards announcements)
 * - Lightweight CSS breathing animation with roaring audio & haptic pulse on click
 */
export const SundarbansTigerMascot: React.FC<SundarbansTigerMascotProps> = ({
  size = 26,
  className = '',
  showTooltip = false,
  facingLeft = true,
  id = 'royal-bengal-tiger-hero'
}) => {
  const [isManuallyRoaring, setIsManuallyRoaring] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const handleTigerInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsManuallyRoaring(true);
    setShowBadge(true);

    // Play realistic Bengal tiger roar sound with haptic pulse
    playTigerRoar();

    setTimeout(() => setIsManuallyRoaring(false), 2600);
    setTimeout(() => setShowBadge(false), 3400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTigerInteraction(e);
    }
  };

  const numericSize = typeof size === 'number' ? size : 26;
  const heightPx = numericSize;
  const widthPx = Math.round(numericSize * 1.08);

  return (
    <div
      id={id}
      onClick={handleTigerInteraction}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setShowBadge(true)}
      onMouseLeave={() => !isManuallyRoaring && setShowBadge(false)}
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none bg-transparent active:scale-90 transition-transform ${className}`}
      style={{
        width: typeof size === 'number' ? `${widthPx}px` : size,
        height: typeof size === 'number' ? `${heightPx}px` : size
      }}
      title="সুন্দরবনের রয়্যাল বেঙ্গল টাইগার (🐅) — গর্জন শুনতে ক্লিক করুন"
      role="button"
      tabIndex={0}
      aria-label="রয়্যাল বেঙ্গল বাঘের গর্জন শুনতে ক্লিক করুন"
    >
      {/* Soundwave Shockwave Ring when Roaring */}
      {isManuallyRoaring && (
        <span className="absolute inset-0 -m-1 rounded-full border-2 border-amber-400/80 animate-ping pointer-events-none" />
      )}

      {/* Floating Civic Badge on Interaction */}
      {showTooltip && (showBadge || isManuallyRoaring) && (
        <div 
          className="absolute -top-8.5 right-0 sm:right-1/2 sm:translate-x-1/2 z-50 bg-slate-950/95 text-amber-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xl border border-amber-400/60 backdrop-blur-md animate-fade-in flex items-center gap-1.5 pointer-events-none"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isManuallyRoaring ? 'bg-rose-400 animate-ping' : 'bg-amber-400'}`} />
          <span className="font-serif">
            {isManuallyRoaring ? 'হালুম! বাঘের গর্জন 🐅' : 'রয়্যাল বেঙ্গল টাইগার 🐅'}
          </span>
        </div>
      )}

      {/* Tiger Mascot Image with True Transparency & Breathing Animation */}
      <div 
        className={`w-full h-full flex items-center justify-center transition-transform duration-200 ${
          isManuallyRoaring ? 'scale-125 animate-pulse' : 'animate-tiger-breathe'
        }`}
        style={{
          transform: facingLeft ? undefined : 'scaleX(-1)',
          transformOrigin: 'center center'
        }}
      >
        <img
          src="/tiger_mascot.png"
          alt="Smart Khulna Royal Bengal Tiger"
          className="w-full h-full object-contain select-none pointer-events-none bg-transparent drop-shadow-sm"
          loading="eager"
          decoding="async"
        />
      </div>

      <style>{`
        @keyframes tigerBreathe {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-0.5px);
          }
        }
        .animate-tiger-breathe {
          animation: tigerBreathe 3.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SundarbansTigerMascot;
