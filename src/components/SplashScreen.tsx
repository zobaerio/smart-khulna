import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 1.2s then fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1100);

    const endTimer = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div
      id="smart-khulna-splash"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs text-center px-6 animate-pulse">
        {/* Logo Monogram */}
        <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl p-2 flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-emerald-50 opacity-60" />
          <img 
            src="/file_0000000078dc81fabee4e5a0d47f7348.png" 
            alt="Smart Khulna" 
            className="w-full h-full object-contain relative z-10 rounded-2xl" 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          স্মার্ট খুলনা
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mb-8">
          খুলনা বিভাগের সকল সেবা এক প্ল্যাটফর্মে
        </p>

        {/* Loading indicator */}
        <div className="w-32 h-1.5 bg-emerald-900/60 rounded-full overflow-hidden">
          <div className="w-full h-full bg-emerald-400 rounded-full animate-[shimmer_1.4s_infinite]" />
        </div>
      </div>
    </div>
  );
};
