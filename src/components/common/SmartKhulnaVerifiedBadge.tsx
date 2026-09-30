import React, { useState } from 'react';

interface SmartKhulnaVerifiedBadgeProps {
  size?: number;
  className?: string;
}

export const SmartKhulnaVerifiedBadge: React.FC<SmartKhulnaVerifiedBadgeProps> = ({ 
  size = 14, 
  className = "" 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip(prev => !prev);
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transition-transform active:scale-90"
        style={{ display: 'block' }}
        aria-label="Smart Khulna Verified Member"
      >
        {/* Outer green circle matching Bangladesh deep green #006a4e */}
        <circle cx="50" cy="50" r="48" fill="#006A4E" />
        
        {/* Inner red circle matching Bangladesh flag red #f42a41 */}
        <circle cx="50" cy="50" r="32" fill="#F42A41" />
        
        {/* White bold tick mark */}
        <path
          d="M32 50 L45 63 L68 38"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showTooltip && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl shadow-xl z-50 text-center font-serif border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-1 duration-150 pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="font-extrabold text-[11px] text-emerald-300 dark:text-emerald-700 tracking-wider">
              Smart Khulna Verified
            </span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-300 dark:text-slate-600 font-sans font-medium">
            এই প্রোফাইলটি Smart Khulna কর্তৃক যাচাইকৃত।
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
        </div>
      )}
    </div>
  );
};

export default SmartKhulnaVerifiedBadge;
