import React from 'react';
import { SundarbansTigerMascot } from './SundarbansTigerMascot';

interface LuxuryNoticeTickerProps {
  noticeText: string;
  noticeLabel: string;
  priority?: 'High' | 'Medium' | 'Low';
  id?: string;
}

/**
 * Slim Luxury Top Notice Header (Smart Khulna)
 * 
 * Features:
 * - 35-40% reduced height (h-[30px] to h-[32px]), matching the sleek "নোটিশ" button height
 * - Dark emerald gradient (#064E3B → #0B7A4B)
 * - 18px rounded corners with premium glass effect & subtle shadow
 * - Glowing pill badge for "নোটিশ" with ripple indicator
 * - Small, non-oversized Sundarbans Royal Bengal Tiger facing left
 * - Seamless illusion of scrolling text emerging naturally from the tiger's cheek/mouth area
 * - Smooth 60 FPS marquee scrolling with soft fade edges and pause on hover/touch
 */
export const LuxuryNoticeTicker: React.FC<LuxuryNoticeTickerProps> = ({
  noticeText,
  noticeLabel,
  priority = 'Low',
  id = 'luxury-notice-ticker'
}) => {
  const isHighPriority = priority === 'High';

  return (
    <div className="w-full px-2 sm:px-3 pt-1.5 pb-1 shrink-0 select-none">
      <div
        id={id}
        className={`relative mx-auto max-w-7xl h-[30px] sm:h-[32px] rounded-[18px] backdrop-blur-md border shadow-xs transition-colors duration-500 flex items-center justify-between px-2 sm:px-2.5 overflow-hidden ${
          isHighPriority 
            ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 border-rose-400/30 shadow-rose-950/20' 
            : 'bg-gradient-to-r from-[#064E3B] via-[#085C3E] to-[#0B7A4B] border-emerald-400/30 dark:border-emerald-500/25 shadow-emerald-950/20'
        }`}
      >
        {/* Top Gold Specular Sheen (Subtle hairline highlight) */}
        <div className={`absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent pointer-events-none`} />

        {/* 1. LEFT: GLOWING "নোটিশ" PILL BADGE */}
        <div className="relative z-20 shrink-0 flex items-center pr-1">
          <div className={`h-[21px] sm:h-[22px] px-2 sm:px-2.5 rounded-full border shadow-xs flex items-center gap-1.5 transition-colors duration-150 ${
            isHighPriority 
              ? 'bg-rose-950/90 hover:bg-rose-900/90 text-white border-rose-400/70' 
              : 'bg-emerald-950/85 hover:bg-emerald-900/90 text-white border-[#D4AF37]/70'
          }`}>
            {/* Soft Ripple Notification Indicator */}
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHighPriority ? 'bg-amber-400' : 'bg-rose-400'}`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 shadow-[0_0_6px_rgba(251,113,133,0.8)] ${isHighPriority ? 'bg-amber-400' : 'bg-rose-400'}`} />
            </span>

            {/* Notice Label Text */}
            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider font-serif leading-none ${isHighPriority ? 'text-white' : 'text-amber-200'}`}>
              {noticeLabel || 'নোটিশ'}
            </span>
          </div>

          {/* Left Fade Mask Guard behind badge */}
          <div className={`absolute -right-3 inset-y-0 w-4 bg-gradient-to-r from-transparent to-transparent pointer-events-none ${
            isHighPriority ? 'from-rose-900' : 'from-[#064E3B]'
          }`} />
        </div>

        {/* 2. CENTER: SMOOTH 60 FPS SCROLLING TEXT TRACK WITH FADE EDGES */}
        <div className="flex-1 overflow-hidden relative h-5 mx-1 flex items-center notice-fade-mask">
          <div className={`animate-notice-ticker text-[10px] sm:text-[11px] font-medium tracking-wide transition-colors cursor-default whitespace-nowrap ${
            isHighPriority ? 'text-rose-50 hover:text-white' : 'text-emerald-100 hover:text-white'
          }`}>
            <span className="pr-12 inline-block font-serif">
              {noticeText}
            </span>
            {/* Seamless duplicate for infinite loop */}
            <span className="pr-12 inline-block font-serif">
              {noticeText}
            </span>
          </div>
        </div>

        {/* 3. RIGHT: TIGER MASCOT ANNOUNCER (TEXT EMERGES FROM CHEEK/MOUTH) */}
        <div className="relative z-20 shrink-0 flex items-center pl-1">
          {/* Soft Speech / Breath Emission Gradient directly beside tiger's cheek/mouth */}
          <div className={`absolute -left-5 inset-y-0 w-6 bg-gradient-to-r from-transparent pointer-events-none ${
            isHighPriority ? 'to-rose-950' : 'to-[#0B7A4B]'
          }`} />

          {/* Micro Soundwave / Voice Pulse Visual cue */}
          <div 
            className="flex items-center -space-x-0.5 text-amber-300/80 mr-0.5 pointer-events-none select-none"
            title="বাঘের মুখের ঘোষণা"
            aria-hidden="true"
          >
            <span className="text-[9px] animate-pulse font-black leading-none">‹</span>
            <span className="text-[7px] animate-pulse opacity-60 font-black leading-none -ml-0.5">‹</span>
          </div>

          {/* Compact Sundarbans Bengal Tiger facing Left towards the text */}
          <div className="relative flex items-center justify-center">
            <SundarbansTigerMascot
              size={26}
              facingLeft={true}
              showTooltip={true}
              className="drop-shadow-xs"
            />
          </div>
        </div>

        {/* Bottom Ambient Glow Edge */}
        <div className="absolute bottom-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default LuxuryNoticeTicker;
