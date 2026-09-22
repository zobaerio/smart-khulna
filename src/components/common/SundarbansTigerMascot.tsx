import React, { useState } from 'react';

interface SundarbansTigerMascotProps {
  size?: number | string;
  className?: string;
  showTooltip?: boolean;
  facingLeft?: boolean;
  id?: string;
}

/**
 * Majestic Royal Bengal Tiger of the Sundarbans (সুন্দরবনের রয়্যাল বেঙ্গল টাইগার)
 * 
 * Hero Character Design:
 * - Powerful, realistic, and official civic tech ambassador
 * - Idle breathing animation on chest & shoulders
 * - Natural eye blinking
 * - Subtle ear twitching & tail sway
 * - Periodic speaking/roaring motion: head raises, lower jaw moves naturally with fangs
 * - Whisker flare during speaking
 * - Support facing left towards the scrolling announcement text
 * - Pure hardware-accelerated CSS animations for 60 FPS battery efficiency
 */
export const SundarbansTigerMascot: React.FC<SundarbansTigerMascotProps> = ({
  size = 28,
  className = '',
  showTooltip = false,
  facingLeft = false,
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
      title="সুন্দরবনের রয়্যাল বেঙ্গল টাইগার (ঘোষক)"
      role="button"
      tabIndex={0}
      aria-label="রয়্যাল বেঙ্গল বাঘ হিরো মাসকট"
    >
      {/* Interactive Roar Aura Rings */}
      <div 
        className="absolute inset-0 rounded-full border border-amber-400/40 tiger-roar-aura pointer-events-none" 
        aria-hidden="true"
      />
      {isManuallyRoaring && (
        <div 
          className="absolute -inset-1.5 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none" 
          aria-hidden="true"
        />
      )}

      {/* Floating Civic Badge on Interaction */}
      {showTooltip && showBadge && (
        <div 
          className="absolute -top-8 right-0 sm:right-1/2 sm:translate-x-1/2 z-50 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 text-amber-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xl border border-amber-400/50 backdrop-blur-md animate-fade-in flex items-center gap-1 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-serif">রয়্যাল বেঙ্গল টাইগার 🐅</span>
        </div>
      )}

      {/* Majestic Bengal Tiger High-Fidelity Vector SVG */}
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        style={{
          transform: facingLeft ? 'scaleX(-1)' : undefined,
          transformOrigin: 'center center'
        }}
        className={`w-full h-full overflow-visible transition-transform duration-300 ${
          isManuallyRoaring ? (facingLeft ? 'scale-x-[-1.1] scale-y-[1.1]' : 'scale-110') : (facingLeft ? 'group-hover:scale-x-[-1.05] group-hover:scale-y-[1.05]' : 'group-hover:scale-105')
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fur Gradient - Rich Amber-Gold to Deep Bengal Orange */}
          <linearGradient id="heroTigerFur" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="65%" stopColor="#D97706" />
            <stop offset="90%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Underbelly & Cheek Cream Fur */}
          <linearGradient id="heroTigerCream" x1="60" y1="50" x2="60" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Penetrating Emerald/Hazel Iris */}
          <radialGradient id="heroTigerEye" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="35%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* Realistic Oral Cavity Gradient (Deep Red / Maroon) */}
          <radialGradient id="tigerOralCavity" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#BE123C" />
            <stop offset="60%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4C0519" />
          </radialGradient>

          {/* Nose Pad Leather Texture */}
          <linearGradient id="tigerNoseLeather" x1="60" y1="62" x2="60" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>

          {/* Golden Sparkle Glow */}
          <radialGradient id="heroGoldStar" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Shadow Filter */}
          <filter id="tigerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 1. TAIL (Gentle, Sinuous Swaying Movement) */}
        <g className="tiger-tail-anim" style={{ transformOrigin: '98px 90px' }}>
          <path
            d="M 94 88 C 106 80 114 84 112 68 C 110 56 102 60 100 66"
            fill="none"
            stroke="url(#heroTigerFur)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Authentic Tail Black Rings */}
          <path d="M 103 76 L 106 79 M 110 69 L 112 73 M 106 59 L 108 63" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          {/* Black Tail Tip */}
          <circle cx="101" cy="65" r="3.5" fill="#111827" />
        </g>

        {/* 2. BODY, CHEST & SHOULDERS (Idle Breathing Animation) */}
        <g className="tiger-breathe-anim" style={{ transformOrigin: '60px 95px' }} filter="url(#tigerShadow)">
          {/* Muscular Shoulders / Torso */}
          <path
            d="M 30 105 
               C 30 84 42 76 60 76 
               C 78 76 90 84 90 105 
               C 90 112 86 116 80 118 
               L 40 118 
               C 34 116 30 112 30 105 Z"
            fill="url(#heroTigerFur)"
          />

          {/* White Chest Apron with Natural Fur Edge */}
          <path
            d="M 46 84 
               C 46 84 52 108 60 108 
               C 68 108 74 84 74 84 
               C 68 89 64 91 60 91 
               C 56 91 52 89 46 84 Z"
            fill="url(#heroTigerCream)"
          />

          {/* Deep Tiger Body Stripes */}
          <path d="M 35 95 Q 44 94 48 99" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 85 95 Q 76 94 72 99" stroke="#111827" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M 37 107 Q 45 104 50 108" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 83 107 Q 75 104 70 108" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" />

          {/* Powerful Paws in Front */}
          <ellipse cx="42" cy="113" rx="7" ry="5.5" fill="url(#heroTigerFur)" stroke="#111827" strokeWidth="1" />
          <ellipse cx="78" cy="113" rx="7" ry="5.5" fill="url(#heroTigerFur)" stroke="#111827" strokeWidth="1" />
          {/* Claws/Toe separators */}
          <line x1="39" y1="113" x2="39" y2="117" stroke="#111827" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="44" y1="113" x2="44" y2="117" stroke="#111827" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="75" y1="113" x2="75" y2="117" stroke="#111827" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="80" y1="113" x2="80" y2="117" stroke="#111827" strokeWidth="1.1" strokeLinecap="round" />
        </g>

        {/* 3. HEAD, EARS, MANE & ROAR GROUP */}
        <g 
          id="tiger-head-complex" 
          className="tiger-head-roar" 
          style={{ transformOrigin: '60px 75px' }}
        >
          {/* CHEEK RUFFS / MANE (Expands during roar) */}
          <g className="tiger-mane-roar" style={{ transformOrigin: '60px 65px' }}>
            <path
              d="M 24 58 C 17 63 18 73 26 75 C 20 78 22 84 31 82 C 38 85 45 83 48 78 C 38 75 30 70 24 58 Z"
              fill="url(#heroTigerCream)"
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
            <path
              d="M 96 58 C 103 63 102 73 94 75 C 100 78 98 84 89 82 C 82 85 75 83 72 78 C 82 75 90 70 96 58 Z"
              fill="url(#heroTigerCream)"
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
          </g>

          {/* LEFT EAR (Natural ear pose) */}
          <g>
            <circle cx="32" cy="30" r="13" fill="url(#heroTigerFur)" stroke="#111827" strokeWidth="1.5" />
            <circle cx="32" cy="30" r="7.5" fill="#FEF3C7" />
            {/* Ear Black Backing Stripe */}
            <path d="M 26 21 Q 32 28 38 22" stroke="#111827" strokeWidth="2.6" strokeLinecap="round" />
          </g>

          {/* RIGHT EAR (Twitch & Active Movement) */}
          <g className="tiger-ear-anim" style={{ transformOrigin: '88px 32px' }}>
            <circle cx="88" cy="30" r="13" fill="url(#heroTigerFur)" stroke="#111827" strokeWidth="1.5" />
            <circle cx="88" cy="30" r="7.5" fill="#FEF3C7" />
            <path d="M 82 22 Q 88 28 94 21" stroke="#111827" strokeWidth="2.6" strokeLinecap="round" />
          </g>

          {/* MAIN CRANIAL HEAD STRUCTURE */}
          <path
            d="M 27 54 
               C 24 40 32 26 60 26 
               C 88 26 96 40 93 54 
               C 97 62 100 75 88 80 
               C 79 84 72 82 60 82 
               C 48 82 41 84 32 80 
               C 20 75 23 62 27 54 Z"
            fill="url(#heroTigerFur)"
            stroke="#111827"
            strokeWidth="1.5"
          />

          {/* FOREHEAD "KING" (王) BENGAL TIGER STRIPES */}
          <g stroke="#111827" strokeLinecap="round">
            <line x1="60" y1="28" x2="60" y2="40" strokeWidth="3.2" />
            <path d="M 51 32 Q 60 37 69 32" strokeWidth="2.8" />
            <path d="M 48 40 Q 60 46 72 40" strokeWidth="2.8" />
            <path d="M 39 37 Q 45 42 48 48" strokeWidth="2.4" />
            <path d="M 81 37 Q 75 42 72 48" strokeWidth="2.4" />
            <path d="M 31 52 Q 38 54 42 51" strokeWidth="2.4" />
            <path d="M 89 52 Q 82 54 78 51" strokeWidth="2.4" />
            <path d="M 30 62 Q 37 63 41 60" strokeWidth="2.2" />
            <path d="M 90 62 Q 83 63 79 60" strokeWidth="2.2" />
          </g>

          {/* EYES & BLINKING */}
          {/* Left Eye */}
          <g className="tiger-blink-anim" style={{ transformOrigin: '44px 50px' }}>
            <ellipse cx="44" cy="50" rx="5.5" ry="6.5" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />
            <ellipse cx="44.5" cy="50" rx="4" ry="5.2" fill="url(#heroTigerEye)" />
            {/* Pupil */}
            <ellipse cx="44.5" cy="50" rx="2" ry="3.8" fill="#09090B" />
            {/* Catchlight */}
            <circle cx="43" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="46.5" cy="52" r="0.7" fill="#FFFFFF" />
            {/* Eyeliner & Mascara Tear Stripe */}
            <path d="M 37 45 Q 44 42 50 45" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 39 53 Q 41 58 42 62" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Eye */}
          <g className="tiger-blink-anim" style={{ transformOrigin: '76px 50px' }}>
            <ellipse cx="76" cy="50" rx="5.5" ry="6.5" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />
            <ellipse cx="75.5" cy="50" rx="4" ry="5.2" fill="url(#heroTigerEye)" />
            {/* Pupil */}
            <ellipse cx="75.5" cy="50" rx="2" ry="3.8" fill="#09090B" />
            {/* Catchlight */}
            <circle cx="74" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="77.5" cy="52" r="0.7" fill="#FFFFFF" />
            {/* Eyeliner & Mascara Tear Stripe */}
            <path d="M 70 45 Q 76 42 83 45" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 81 53 Q 79 58 78 62" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>

          {/* WHITE NOBLE MUZZLE (Upper Muzzle Pad) */}
          <ellipse cx="60" cy="69" rx="16" ry="10.5" fill="url(#heroTigerCream)" stroke="#E5E7EB" strokeWidth="0.5" />

          {/* REALISTIC NOSE PAD */}
          <path
            d="M 54 64 Q 60 65.5 66 64 L 63 71.5 Q 60 74 57 71.5 Z"
            fill="url(#tigerNoseLeather)"
            stroke="#111827"
            strokeWidth="0.9"
          />
          {/* Nostril indentations */}
          <circle cx="57.5" cy="69" r="1" fill="#4C0519" />
          <circle cx="62.5" cy="69" r="1" fill="#4C0519" />

          {/* UPPER FANGS (Visible when mouth opens) */}
          <g id="upper-fangs" opacity="0.95">
            <path d="M 51 72 L 53 79 L 55 72 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="0.4" />
            <path d="M 65 72 L 67 79 L 69 72 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="0.4" />
            {/* Micro incisors */}
            <line x1="56" y1="72" x2="64" y2="72" stroke="#FFFBEB" strokeWidth="1" strokeDasharray="1 1" />
          </g>

          {/* 4. REALISTIC ROARING JAW & ORAL CAVITY (Smooth Cinematic Roar) */}
          <g 
            id="tiger-roaring-jaw" 
            className="tiger-jaw-roar" 
            style={{ transformOrigin: '60px 75px' }}
          >
            {/* Open Mouth Throat / Cavity */}
            <path
              d="M 48 73 
                 C 48 73 51 88 60 88 
                 C 69 88 72 73 72 73 
                 C 66 76 60 77 54 77 Z"
              fill="url(#tigerOralCavity)"
              stroke="#111827"
              strokeWidth="1.2"
            />

            {/* Realistic Roaring Tongue */}
            <path
              d="M 53 82 Q 60 89 67 82 Q 60 85 53 82 Z"
              fill="#F43F5E"
              stroke="#BE123C"
              strokeWidth="0.6"
            />

            {/* Lower Canine Fangs */}
            <path d="M 50 83 L 52 77 L 54 83 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="0.4" />
            <path d="M 66 83 L 68 77 L 70 83 Z" fill="#FFFBEB" stroke="#78350F" strokeWidth="0.4" />

            {/* Chin Fur Under Jaw */}
            <path
              d="M 52 87 Q 60 92 68 87 Q 60 90 52 87 Z"
              fill="url(#heroTigerCream)"
              stroke="#111827"
              strokeWidth="0.8"
            />
          </g>

          {/* NATURAL IDLE CHIN (Shows when mouth is closed) */}
          <path
            d="M 55 74 Q 60 77 65 74 L 63 77 Q 60 80 57 77 Z"
            fill="url(#heroTigerCream)"
            stroke="#111827"
            strokeWidth="0.8"
          />

          {/* 5. MAJESTIC WHISKERS (Flare Outwards During Roar) */}
          <g className="tiger-whisker-roar" style={{ transformOrigin: '60px 70px' }} opacity="0.75">
            {/* Left Whiskers */}
            <line x1="48" y1="68" x2="30" y2="65" stroke="#111827" strokeWidth="1" strokeLinecap="round" />
            <line x1="47" y1="71" x2="28" y2="73" stroke="#111827" strokeWidth="1" strokeLinecap="round" />
            <line x1="48" y1="74" x2="32" y2="81" stroke="#111827" strokeWidth="0.9" strokeLinecap="round" />
            {/* Right Whiskers */}
            <line x1="72" y1="68" x2="90" y2="65" stroke="#111827" strokeWidth="1" strokeLinecap="round" />
            <line x1="73" y1="71" x2="92" y2="73" stroke="#111827" strokeWidth="1" strokeLinecap="round" />
            <line x1="72" y1="74" x2="88" y2="81" stroke="#111827" strokeWidth="0.9" strokeLinecap="round" />
          </g>

          {/* 6. GOLDEN SUNDARBANS STAR OF PRIDE */}
          <g className="tiger-sparkle-anim" style={{ transformOrigin: '92px 20px' }}>
            <circle cx="92" cy="20" r="5" fill="url(#heroGoldStar)" />
            <path
              d="M 92 14 L 93.5 19 L 98 20 L 93.5 21 L 92 26 L 90.5 21 L 86 20 L 90.5 19 Z"
              fill="#FDE68A"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SundarbansTigerMascot;
