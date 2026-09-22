import React from 'react';
import { SundarbansTigerMascot } from './SundarbansTigerMascot';

interface LuxuryNoticeTickerProps {
  noticeText: string;
  noticeLabel: string;
  id?: string;
}

/**
 * Luxury Announcement Ticker (নোটিশ বার)
 * 
 * Features:
 * - Frosted glass background with deep green gradient (#04281E -> #064E3B -> #0B7A4B)
 * - Glowing rounded pill badge for "নোটিশ" with Material 3 elevation & soft pulse
 * - Tiny animated notification indicator with expanding soft ripple effect
 * - 60 FPS continuous smooth ticker with fade-in/fade-out edge masks
 * - Touch & hover to pause for easy reading
 * - Sundarbans Bengal Tiger Mascot seamlessly integrated on the right
 */
export const LuxuryNoticeTicker: React.FC<LuxuryNoticeTickerProps> = ({
  noticeText,
  noticeLabel,
  id = 'luxury-notice-ticker'
}) => {
  return (
    <div
      id={id}
      className="relative w-full bg-gradient-to-r from-[#04281E] via-[#064E3B] to-[#04281E] border-b border-emerald-600/30 dark:border-emerald-900/60 shadow-sm z-30 select-none overflow-hidden"
    >
      {/* Subtle Top Gold Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2">
        {/* LEFT: GLOWING NOTICE PILL BADGE */}
        <div className="shrink-0 z-20 flex items-center">
          <div className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-900 border border-[#D4AF37]/50 shadow-md shadow-emerald-950/40 text-white">
            {/* Animated Ripple Notification Indicator */}
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            </span>

            {/* Glowing Text */}
            <span className="text-[10px] font-black tracking-wider uppercase text-amber-200 drop-shadow-xs font-serif">
              {noticeLabel || 'নোটিশ'}
            </span>
          </div>
        </div>

        {/* CENTER: 60 FPS SMOOTH TICKER TRACK WITH GRADIENT FADE-IN/OUT EDGES */}
        <div className="flex-1 overflow-hidden relative h-5 mx-1 notice-fade-mask flex items-center">
          <div className="animate-notice-ticker text-[10px] sm:text-[11px] font-medium tracking-wide text-emerald-100/90 hover:text-white transition-colors cursor-default whitespace-nowrap">
            <span className="pr-12 inline-block">
              {noticeText}
            </span>
            {/* Duplicate for seamless infinite 60fps loop */}
            <span className="pr-12 inline-block">
              {noticeText}
            </span>
          </div>
        </div>

        {/* RIGHT: SUNDARBANS BENGAL TIGER MASCOT */}
        <div className="shrink-0 z-20 flex items-center pl-1 sm:pl-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-700/40 shadow-xs">
            <SundarbansTigerMascot size={26} />
            <span className="text-[9px] font-extrabold text-amber-400 hidden sm:inline tracking-tight font-serif pr-1">
              রয়্যাল বেঙ্গল
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Glow Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
};

export default LuxuryNoticeTicker;
