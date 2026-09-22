import React from 'react';

interface SmartKhulnaLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
  variant?: 'full' | 'icon-only';
  id?: string;
}

/**
 * Smart Khulna Official Brand Logo
 * 
 * Brand Identity Design:
 * - Rounded-square (squircle) foundation with Material 3 elevation
 * - Primary Palette: Deep Forest Green (#064E3B), Emerald Green (#0B7A4B), and Royal Gold (#D4AF37)
 * - Graphic Motifs:
 *   1. Modern bold "K" monogram
 *   2. Integrated organic Sundarbans mangrove leaf with delicate veins
 *   3. Khan Jahan Ali (Rupsha) Bridge architectural suspension arches & civic landmark silhouette
 *   4. Rupsha & Bhairab river waves flowing gracefully beneath
 *   5. Golden crest beacon symbolizing Digital Governance & Civic Technology
 * - Glass effect with specular top highlight, subtle inner glow & soft ambient shadow
 */
export const SmartKhulnaLogo: React.FC<SmartKhulnaLogoProps> = ({
  size = 40,
  className = '',
  showGlow = true,
  variant = 'icon-only',
  id = 'smart-khulna-logo'
}) => {
  const numericSize = typeof size === 'number' ? size : 40;

  return (
    <div 
      id={id}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Outer Glow */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-2xl bg-emerald-500/20 dark:bg-emerald-400/25 blur-md pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        className="w-full h-full relative z-10 transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="স্মার্ট খুলনা লোগো"
      >
        <defs>
          {/* Main Background Gradient: Deep Forest to Emerald */}
          <linearGradient id="skBgGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B7A4B" />
            <stop offset="55%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#032D22" />
          </linearGradient>

          {/* Gold Accent Gradient */}
          <linearGradient id="skGoldGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#B48B1C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Leaf Gradient: Fresh Sundarbans Vibrant Green */}
          <linearGradient id="skLeafGradient" x1="45" y1="20" x2="95" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="40%" stopColor="#34D399" />
            <stop offset="85%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Rupsha River Water Waves Gradient */}
          <linearGradient id="skRiverGradient" x1="20" y1="85" x2="100" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.2" />
          </linearGradient>

          {/* Glass Specular Top Highlight */}
          <linearGradient id="skGlassSpecular" x1="60" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Drop Shadow Filter */}
          <filter id="skShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#021C15" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
          </filter>

          {/* Subtle Inner Glow */}
          <filter id="skInnerGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.83   0 0 0 0 0.69   0 0 0 0 0.22  0 0 0 0.45 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Squircle Rounded-Square Container */}
        <rect
          x="4"
          y="4"
          width="112"
          height="112"
          rx="28"
          fill="url(#skBgGradient)"
          filter="url(#skShadow)"
        />

        {/* Outer Premium Gold Ring Border */}
        <rect
          x="4"
          y="4"
          width="112"
          height="112"
          rx="28"
          fill="none"
          stroke="url(#skGoldGradient)"
          strokeWidth="1.8"
          strokeOpacity="0.75"
        />

        {/* Inner Subtle Dashed Civic Perimeter */}
        <rect
          x="8.5"
          y="8.5"
          width="103"
          height="103"
          rx="24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.75"
          strokeOpacity="0.18"
        />

        {/* Glass Specular Upper Highlight (Curved light reflection) */}
        <path
          d="M 5 32 C 5 17 17 5 32 5 L 88 5 C 103 5 115 17 115 32 C 115 44 90 52 60 52 C 30 52 5 44 5 32 Z"
          fill="url(#skGlassSpecular)"
        />

        {/* Rupsha River Flow & Bridge Suspension Landmark Silhouette */}
        <g opacity="0.32">
          {/* Bridge Arch Cable Silhouette */}
          <path
            d="M 18 90 Q 60 62 102 90"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          {/* Bridge Deck Line */}
          <line x1="18" y1="91" x2="102" y2="91" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.3" />
          {/* River Wave Ripple */}
          <path
            d="M 22 98 Q 42 94 62 98 T 100 98"
            fill="none"
            stroke="url(#skRiverGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        {/* MAIN EMBLEM: BOLD "K" MONOGRAM + LEAF + ARCHITECTURE */}
        <g id="brand-k-group">
          {/* 1. Vertical Architectural Column (Stem of K - Khan Jahan Ali Architectural Column) */}
          <path
            d="M 30 28 
               C 30 25 32.5 22.5 35.5 22.5 
               L 44.5 22.5 
               C 47.5 22.5 50 25 50 28 
               L 50 92 
               C 50 95 47.5 97.5 44.5 97.5 
               L 35.5 97.5 
               C 32.5 97.5 30 95 30 92 
               Z"
            fill="#FFFFFF"
            filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"
          />

          {/* Golden Column Accent Stripe */}
          <path
            d="M 33 27 L 35 27 L 35 93 L 33 93 Z"
            fill="url(#skGoldGradient)"
            opacity="0.9"
          />

          {/* Architectural Minaret Dome Cap on Stem */}
          <path
            d="M 35 22.5 C 35 17 45 17 45 22.5 Z"
            fill="url(#skGoldGradient)"
          />

          {/* 2. Upper Diagonal Arm: Organic Sundarbans Mangrove Leaf */}
          {/* Main Leaf Body */}
          <path
            d="M 47 56 
               C 52 48 64 34 82 25 
               C 89 21.5 94 24 94 28 
               C 94 40 82 56 65 67 
               C 58 71.5 51 68 47 62 
               Z"
            fill="url(#skLeafGradient)"
            filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.25))"
          />

          {/* Golden Leaf Spine / Vein */}
          <path
            d="M 50 58 Q 68 42 87 27"
            fill="none"
            stroke="url(#skGoldGradient)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Side Veins */}
          <path
            d="M 62 48 Q 72 45 78 40 M 69 42 Q 78 36 84 31"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />

          {/* 3. Lower Diagonal Leg: Rupsha Bridge Twin Cable Arch & Stride */}
          <path
            d="M 50 60 
               L 75 91 
               C 77.5 94 81 96 85 96 
               L 92 96 
               C 95 96 96.5 92.5 94.5 90 
               L 68 57 
               C 65 53 55 54 50 60 
               Z"
            fill="#FFFFFF"
            filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"
          />

          {/* Gold Inlay along the Bridge Leg */}
          <path
            d="M 56 64 L 84 93 L 87 93 L 61 62 Z"
            fill="url(#skGoldGradient)"
            opacity="0.95"
          />

          {/* Central Convergence Golden Shield Node */}
          <circle cx="51" cy="59" r="4.5" fill="url(#skGoldGradient)" />
          <circle cx="51" cy="59" r="2" fill="#FFFFFF" />

          {/* 4. Golden Civic Beacon / Smart Star at the Leaf Apex */}
          <circle cx="89" cy="24" r="5" fill="url(#skGoldGradient)" />
          <circle cx="89" cy="24" r="2.5" fill="#FFFFFF" />
          
          {/* Delicate 4-Point Light Flare on Beacon */}
          <path
            d="M 89 16 L 90.5 22.5 L 97 24 L 90.5 25.5 L 89 32 L 87.5 25.5 L 81 24 L 87.5 22.5 Z"
            fill="#FFFFFF"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
};

export default SmartKhulnaLogo;
