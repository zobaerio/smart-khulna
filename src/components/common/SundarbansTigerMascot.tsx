import React, { useState } from 'react';

interface SundarbansTigerMascotProps {
  size?: number | string;
  className?: string;
  showTooltip?: boolean;
  id?: string;
}

/**
 * Sundarbans Royal Bengal Tiger Official Mascot (রয়্যাল বেঙ্গল বাঘ)
 * 
 * Vector Character Design:
 * - Official yet warm & friendly civic tech ambassador
 * - Rich golden-orange fur (#F59E0B, #EA580C, #B45309) with authentic Bengal tiger stripes
 * - Expressive intelligent eyes with natural blinking
 * - Idle breathing animation (CSS transform)
 * - Rhythmic ear twitch (CSS keyframes)
 * - Gentle tail swaying
 * - Delicate golden sparkle accent
 * - Zero JS loops: 100% hardware-accelerated CSS animations for battery efficiency
 */
export const SundarbansTigerMascot: React.FC<SundarbansTigerMascotProps> = ({
  size = 38,
  className = '',
  showTooltip = true,
  id = 'sundarbans-tiger-mascot'
}) => {
  const [clicked, setClicked] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const handleInteraction = () => {
    setClicked(true);
    setShowBubble(true);
    setTimeout(() => setClicked(false), 800);
    setTimeout(() => setShowBubble(false), 2600);
  };

  return (
    <div
      id={id}
      onClick={handleInteraction}
      onMouseEnter={() => setShowBubble(true)}
      onMouseLeave={() => !clicked && setShowBubble(false)}
      className={`relative inline-flex items-center justify-center shrink-0 cursor-pointer select-none group ${className}`}
      style={{ width: size, height: size }}
      title="খুলনার ঐতিহ্য ও অহংকার: সুন্দরবনের রয়্যাল বেঙ্গল বাঘ"
      role="button"
      tabIndex={0}
      aria-label="রয়্যাল বেঙ্গল বাঘ মাসকট"
    >
      {/* Interactive Micro Speech Bubble */}
      {showTooltip && showBubble && (
        <div 
          className="absolute -top-9 right-0 md:right-1/2 md:translate-x-1/2 z-50 bg-emerald-950/95 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg border border-amber-400/40 backdrop-blur-md animate-fade-in flex items-center gap-1 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>রয়্যাল বেঙ্গল বাঘ 🐅</span>
        </div>
      )}

      {/* SVG Tiger Character */}
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className={`w-full h-full overflow-visible transition-transform duration-300 ${
          clicked ? 'scale-110 -rotate-3' : 'group-hover:scale-105'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fur Gradient - Warm Golden Amber to Deep Orange */}
          <linearGradient id="tigerFurGrad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Muzzle & Cheek Fur - Warm Off-White Cream */}
          <linearGradient id="tigerCreamGrad" x1="50" y1="50" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Tiger Eye Iris Gradient */}
          <linearGradient id="tigerEyeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Golden Sparkle Glow */}
          <radialGradient id="tigerSparkleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>

          {/* Tiger Nose Pink */}
          <linearGradient id="tigerNoseGrad" x1="50" y1="64" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>

        {/* 1. TAIL (Gentle Wagging Animation) */}
        <g className="tiger-tail-anim" style={{ transformOrigin: '82px 75px' }}>
          <path
            d="M 80 72 C 89 65 96 68 95 56 C 94 48 88 50 86 54"
            fill="none"
            stroke="url(#tigerFurGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Tail Black Stripes */}
          <path d="M 87 64 L 89 66 M 93 59 L 95 62 M 89 51 L 91 53" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Black Tail Tip */}
          <circle cx="86.5" cy="53" r="2.8" fill="#18181B" />
        </g>

        {/* 2. BODY & CHEST (Idle Breathing Animation) */}
        <g className="tiger-breathe-anim" style={{ transformOrigin: '50px 75px' }}>
          {/* Shoulders / Body Bust */}
          <path
            d="M 28 82 C 28 68 36 62 50 62 C 64 62 72 68 72 82 C 72 90 70 94 66 96 L 34 96 C 30 94 28 90 28 82 Z"
            fill="url(#tigerFurGrad)"
          />
          {/* White Chest Apron */}
          <path
            d="M 40 70 C 40 70 45 88 50 88 C 55 88 60 70 60 70 C 56 74 53 76 50 76 C 47 76 44 74 40 70 Z"
            fill="url(#tigerCreamGrad)"
          />
          {/* Body Stripes */}
          <path d="M 31 78 Q 38 77 42 80" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 69 78 Q 62 77 58 80" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 33 87 Q 39 85 43 87" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 67 87 Q 61 85 57 87" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />

          {/* Cute Paws Resting in Front */}
          <circle cx="36" cy="91" r="5" fill="url(#tigerFurGrad)" stroke="#18181B" strokeWidth="0.8" />
          <circle cx="64" cy="91" r="5" fill="url(#tigerFurGrad)" stroke="#18181B" strokeWidth="0.8" />
          {/* Paw Pads/Claws subtle lines */}
          <line x1="34" y1="91" x2="34" y2="94" stroke="#18181B" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="38" y1="91" x2="38" y2="94" stroke="#18181B" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="62" y1="91" x2="62" y2="94" stroke="#18181B" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="66" y1="91" x2="66" y2="94" stroke="#18181B" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* 3. HEAD & EARS GROUP */}
        <g id="tiger-head-group">
          {/* LEFT EAR (Static / subtle) */}
          <g>
            <circle cx="28" cy="28" r="11" fill="url(#tigerFurGrad)" stroke="#18181B" strokeWidth="1.2" />
            <circle cx="28" cy="28" r="6.5" fill="#FEF3C7" />
            <path d="M 23 20 Q 28 26 33 21" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* RIGHT EAR (Twitch Animation) */}
          <g className="tiger-ear-anim" style={{ transformOrigin: '72px 30px' }}>
            <circle cx="72" cy="28" r="11" fill="url(#tigerFurGrad)" stroke="#18181B" strokeWidth="1.2" />
            <circle cx="72" cy="28" r="6.5" fill="#FEF3C7" />
            <path d="M 67 21 Q 72 26 77 20" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* HEAD BASE SHAPE */}
          <path
            d="M 24 50 
               C 22 40 28 28 50 28 
               C 72 28 78 40 76 50 
               C 79 56 82 66 73 70 
               C 66 73 60 72 50 72 
               C 40 72 34 73 27 70 
               C 18 66 21 56 24 50 Z"
            fill="url(#tigerFurGrad)"
            stroke="#18181B"
            strokeWidth="1.2"
          />

          {/* WHITE CHEEK RUFFS (Fluffy Bengal Tiger Cheeks) */}
          <path
            d="M 23 54 C 18 58 19 65 25 66 C 21 68 22 72 29 70 C 34 72 39 71 42 68 C 34 66 28 62 23 54 Z"
            fill="url(#tigerCreamGrad)"
          />
          <path
            d="M 77 54 C 82 58 81 65 75 66 C 79 68 78 72 71 70 C 66 72 61 71 58 68 C 66 66 72 62 77 54 Z"
            fill="url(#tigerCreamGrad)"
          />

          {/* FOREHEAD STRIPES (The Majestic "King / Crown" Bengal Tiger Pattern) */}
          <path d="M 50 29 L 50 37" stroke="#18181B" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M 43 32 Q 50 36 57 32" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 41 39 Q 50 44 59 39" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
          {/* Side Forehead Stripes */}
          <path d="M 33 36 Q 38 39 40 43" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 67 36 Q 62 39 60 43" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          {/* Cheek Stripes */}
          <path d="M 26 48 Q 32 49 35 47" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 74 48 Q 68 49 65 47" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 25 55 Q 31 56 34 54" stroke="#18181B" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 75 55 Q 69 56 66 54" stroke="#18181B" strokeWidth="1.8" strokeLinecap="round" />

          {/* WHITE MUZZLE */}
          <ellipse cx="50" cy="62" rx="13" ry="8.5" fill="url(#tigerCreamGrad)" stroke="#E5E7EB" strokeWidth="0.5" />

          {/* NOSE */}
          <path
            d="M 46 58 Q 50 59 54 58 L 52 63.5 Q 50 65 48 63.5 Z"
            fill="url(#tigerNoseGrad)"
            stroke="#18181B"
            strokeWidth="0.8"
          />

          {/* MOUTH & CHIN */}
          <path d="M 50 64.5 L 50 68" stroke="#18181B" strokeWidth="1" strokeLinecap="round" />
          <path d="M 45 67 Q 50 70 55 67" fill="none" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
          {/* Small tongue peeking playfully */}
          <path d="M 48.5 68.5 Q 50 71 51.5 68.5 Z" fill="#FB7185" />

          {/* WHISKERS */}
          <g opacity="0.6">
            <line x1="39" y1="62" x2="27" y2="59" stroke="#18181B" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="38" y1="64" x2="26" y2="65" stroke="#18181B" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="61" y1="62" x2="73" y2="59" stroke="#18181B" strokeWidth="0.75" strokeLinecap="round" />
            <line x1="62" y1="64" x2="74" y2="65" stroke="#18181B" strokeWidth="0.75" strokeLinecap="round" />
          </g>

          {/* 4. EXPRESSIVE EYES (Natural Blinking Animation) */}
          {/* Left Eye */}
          <g className="tiger-blink-anim" style={{ transformOrigin: '38px 48px' }}>
            <ellipse cx="38" cy="48" rx="4.5" ry="5.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1" />
            <ellipse cx="38.5" cy="48" rx="3.2" ry="4.2" fill="url(#tigerEyeGrad)" />
            {/* Pupil */}
            <ellipse cx="38.5" cy="48" rx="1.8" ry="3" fill="#18181B" />
            {/* Specular Catchlights */}
            <circle cx="37" cy="46" r="1.3" fill="#FFFFFF" />
            <circle cx="40" cy="50" r="0.6" fill="#FFFFFF" />
            {/* Cute Eyelash/Eyebrow Line */}
            <path d="M 33 43 Q 38 41 43 43" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Eye */}
          <g className="tiger-blink-anim" style={{ transformOrigin: '62px 48px' }}>
            <ellipse cx="62" cy="48" rx="4.5" ry="5.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1" />
            <ellipse cx="61.5" cy="48" rx="3.2" ry="4.2" fill="url(#tigerEyeGrad)" />
            {/* Pupil */}
            <ellipse cx="61.5" cy="48" rx="1.8" ry="3" fill="#18181B" />
            {/* Specular Catchlights */}
            <circle cx="60" cy="46" r="1.3" fill="#FFFFFF" />
            <circle cx="63" cy="50" r="0.6" fill="#FFFFFF" />
            {/* Cute Eyelash/Eyebrow Line */}
            <path d="M 57 43 Q 62 41 67 43" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>

          {/* 5. TINY GOLDEN SPARKLE (Sundarbans Heritage Charm) */}
          <g className="tiger-sparkle-anim" style={{ transformOrigin: '76px 20px' }}>
            <circle cx="76" cy="20" r="4" fill="url(#tigerSparkleGlow)" />
            <path
              d="M 76 15 L 77.2 19 L 81 20 L 77.2 21 L 76 25 L 74.8 21 L 71 20 L 74.8 19 Z"
              fill="#FDE68A"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SundarbansTigerMascot;
