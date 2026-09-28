import React, { useState } from 'react';

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
 * - Original realistic Bengal tiger cutout with transparent background (mix-blend-mode: multiply)
 * - Significantly increased size (70-85% of announcement bar height) so it's prominent, not a tiny icon
 * - Vertically centered on the far right with smooth breathing animation
 */
export const SundarbansTigerMascot: React.FC<SundarbansTigerMascotProps> = ({
  size = 42,
  className = '',
  showTooltip = false,
  facingLeft = true,
  id = 'royal-bengal-tiger-hero'
}) => {
  const [isManuallyRoaring, setIsManuallyRoaring] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  const handleTigerInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManuallyRoaring(true);
    setShowBadge(true);
    setTimeout(() => setIsManuallyRoaring(false), 2400);
    setTimeout(() => setShowBadge(false), 3200);
  };

  return (
    <div
      id={id}
      onClick={handleTigerInteraction}
      onMouseEnter={() => setShowBadge(true)}
      onMouseLeave={() => !isManuallyRoaring && setShowBadge(false)}
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none group ${className}`}
      style={{ width: size, height: size }}
      title="সুন্দরবনের রয়্যাল বেঙ্গল টাইগার (🐅)"
      role="button"
      tabIndex={0}
      aria-label="রয়্যাল বেঙ্গল বাঘ মাসকট"
    >
      {/* Interactive Roar Aura */}
      {isManuallyRoaring && (
        <div className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
      )}

      {/* Floating Civic Badge */}
      {showTooltip && showBadge && (
        <div className="absolute -top-8 right-0 sm:right-1/2 sm:translate-x-1/2 z-50 bg-slate-950 text-amber-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xl border border-amber-400/50 backdrop-blur-md animate-fade-in flex items-center gap-1 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-serif">রয়্যাল বেঙ্গল টাইগার 🐅</span>
        </div>
      )}

      {/* Tiger Mascot Image with Breathing Animation */}
      <div 
        className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${
          isManuallyRoaring ? 'scale-110 animate-bounce' : 'animate-tiger-breathe'
        }`}
        style={{
          transform: facingLeft ? 'scaleX(-1)' : undefined,
          transformOrigin: 'center center'
        }}
      >
        <img
          src="/tiger_mascot.png"
          alt="Smart Khulna Tiger Mascot"
          className="w-full h-full object-contain select-none pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      <style>{`
        @keyframes tigerBreathe {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-1px);
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
