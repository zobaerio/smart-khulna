import React from 'react';

interface SmartKhulnaLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
  id?: string;
}

/**
 * Official Smart Khulna Brand Logo (K + Green Leaf)
 * 
 * Minimal, ultra-premium, recognizable civic icon:
 * - Bold architectural 'K' letterform
 * - Upper arm seamlessly forms a vibrant, lush Sundarbans mangrove leaf
 * - Pure colors: Deep Forest Green (#064E3B), Emerald Green (#0B7A4B), and Royal Gold (#D4AF37)
 * - Rounded-square squircle with glass specular highlight and gold rim
 * - Zero extra text or taglines for maximum clarity as app icon, favicon & header icon
 */
export const SmartKhulnaLogo: React.FC<SmartKhulnaLogoProps> = ({
  size = 42,
  className = '',
  showGlow = true,
  id = 'smart-khulna-leaf-logo'
}) => {
  return (
    <div
      id={id}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Outer Emerald Glow */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-emerald-500/25 dark:bg-emerald-400/30 blur-md pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className="w-full h-full relative z-10 transition-transform duration-200 active:scale-95 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Smart Khulna Logo"
      >
        <defs>
          {/* Background Squircle Gradient: Emerald Green to Deep Forest Green */}
          <linearGradient id="kLogoBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B7A4B" />
            <stop offset="60%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#022D22" />
          </linearGradient>

          {/* Royal Gold Accent Gradient */}
          <linearGradient id="kLogoGold" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="80%" stopColor="#B48B1C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Leaf Gradient: Fresh Sundarbans Vibrant Green */}
          <linearGradient id="kLeafGrad" x1="38" y1="20" x2="82" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="35%" stopColor="#34D399" />
            <stop offset="80%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Specular Glass Highlight */}
          <linearGradient id="kGlassReflection" x1="50" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Drop Shadow Filter */}
          <filter id="kIconShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#011F17" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Squircle Rounded-Square Container (rx=24 for 100x100) */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="url(#kLogoBg)"
          filter="url(#kIconShadow)"
        />

        {/* 2. Premium Outer Gold Rim Border */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="none"
          stroke="url(#kLogoGold)"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />

        {/* 3. Subtle Inner White Frame */}
        <rect
          x="7.5"
          y="7.5"
          width="85"
          height="85"
          rx="20.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeOpacity="0.15"
        />

        {/* 4. Top Glass Specular Arc */}
        <path
          d="M 5 26 C 5 14 14 5 26 5 L 74 5 C 86 5 95 14 95 26 C 95 38 75 44 50 44 C 25 44 5 38 5 26 Z"
          fill="url(#kGlassReflection)"
        />

        {/* 5. ICONIC 'K' + GREEN LEAF EMBLEM */}
        <g id="k-leaf-monogram">
          {/* Vertical Stem of 'K' */}
          <rect
            x="24"
            y="20"
            width="14"
            height="60"
            rx="4.5"
            fill="#FFFFFF"
            filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.35))"
          />

          {/* Stem Gold Inlay Accent */}
          <rect
            x="26.5"
            y="23"
            width="2.2"
            height="54"
            rx="1.1"
            fill="url(#kLogoGold)"
            opacity="0.9"
          />

          {/* UPPER ARM: ORGANIC VIBRANT GREEN LEAF */}
          {/* Leaf Blade Shape */}
          <path
            d="M 37 47 
               C 42 39 52 27 68 19 
               C 76 15 81 17.5 81 22 
               C 81 33 71 47 55 57 
               C 48 61.5 41 57 37 51 
               Z"
            fill="url(#kLeafGrad)"
            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
          />

          {/* Golden Leaf Central Spine/Vein */}
          <path
            d="M 39 49 Q 56 34 74 21"
            fill="none"
            stroke="url(#kLogoGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Delicate Side Vein Details */}
          <path
            d="M 50 41 Q 59 38 65 33 M 57 35 Q 66 30 71 25"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.75"
            strokeLinecap="round"
          />

          {/* Tiny Golden Dewdrop Beacon at Leaf Tip */}
          <circle cx="76" cy="18" r="3.2" fill="url(#kLogoGold)" />
          <circle cx="76" cy="18" r="1.4" fill="#FFFFFF" />

          {/* LOWER ARM: BOLD GEOMETRIC K LEG */}
          <path
            d="M 40 50 
               L 63 76 
               C 65.5 79 69 80 73 80 
               L 78 80 
               C 81 80 82.5 76.5 80.5 74 
               L 56 46 
               C 52.5 42 44 44 40 50 
               Z"
            fill="#FFFFFF"
            filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.35))"
          />

          {/* Gold Inset on the Lower Leg */}
          <path
            d="M 45 54 L 71 78 L 74 78 L 50 51 Z"
            fill="url(#kLogoGold)"
            opacity="0.95"
          />

          {/* Central Intersection Gold Joint Node */}
          <circle cx="41.5" cy="49" r="3.5" fill="url(#kLogoGold)" />
          <circle cx="41.5" cy="49" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

export default SmartKhulnaLogo;
