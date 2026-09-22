import React, { useState } from 'react';

export interface SmartKhulnaLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
  id?: string;
  alt?: string;
}

/**
 * Official Smart Khulna Brand Logo Asset Component
 * 
 * Strict Brand Fidelity Implementation:
 * - Single source of truth for the official brand logo
 * - Zero artificial modifications, filters, or distortions
 * - Exact 1:1 proportional scaling with object-contain
 * - Seamlessly loads official brand asset (/logo.svg or uploaded /logo.png)
 */
export const SmartKhulnaLogo: React.FC<SmartKhulnaLogoProps> = ({
  size = 42,
  className = '',
  showGlow = false,
  id = 'smart-khulna-brand-logo',
  alt = 'Smart Khulna Brand Logo'
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/logo.svg');

  return (
    <div
      id={id}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Optional ambient backlight glow */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Official Brand Logo Image Asset */}
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-contain relative z-10 select-none transition-transform duration-200 active:scale-95 hover:scale-105 pointer-events-auto"
        onError={() => {
          // If custom logo.svg fails, fallback to icon.svg
          if (imgSrc !== '/icon.svg') {
            setImgSrc('/icon.svg');
          }
        }}
      />
    </div>
  );
};

export default SmartKhulnaLogo;
