import React from 'react';
import { Menu, Globe, Download, Map, Sun, Moon, Bell, ShieldCheck } from 'lucide-react';
import { SmartKhulnaLogo } from './SmartKhulnaLogo';
import { LuxuryNoticeTicker } from './LuxuryNoticeTicker';

export interface SmartKhulnaHeaderProps {
  onOpenDrawer: () => void;
  onNavigateHome: () => void;
  lang: 'bn' | 'en';
  onToggleLang: () => void;
  isInstallable: boolean;
  onInstallPWA: () => void;
  viewingDistrictId: string | null;
  onToggleDistricts: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  totalUnreadNotifications: number;
  onToggleNotifications: () => void;
  t: (key: string) => string;
}

/**
 * Smart Khulna Top Header Component
 * 
 * Aesthetic Philosophy:
 * Bangladesh Government × Google Pixel (Material 3) × Premium Civic Tech Platform
 * 
 * Key Features:
 * - 8px Material Design grid spacing
 * - Ultra-premium Brand Identity with custom vector Logo
 * - Luxury announcement ticker with 60 FPS continuous marquee & Royal Bengal Tiger mascot
 * - Smooth micro-interactions & tactile active scale feedback
 * - Perfect Light & Dark mode contrast compliance (WCAG AA+)
 * - 100% preservation of all existing navigational buttons and callbacks
 */
export const SmartKhulnaHeader: React.FC<SmartKhulnaHeaderProps> = ({
  onOpenDrawer,
  onNavigateHome,
  lang,
  onToggleLang,
  isInstallable,
  onInstallPWA,
  viewingDistrictId,
  onToggleDistricts,
  darkMode,
  onToggleDarkMode,
  totalUnreadNotifications,
  onToggleNotifications,
  t
}) => {
  return (
    <header 
      id="smart-khulna-top-header"
      className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/10 dark:border-slate-800 shadow-sm transition-colors duration-200 shrink-0"
    >
      {/* 1. TOP LUXURY NOTICE TICKER & SUNDARBANS TIGER MASCOT */}
      <LuxuryNoticeTicker
        noticeText={t('notice')}
        noticeLabel={t('noticeLabel')}
      />

      {/* 2. PRIMARY NAVIGATION BAR (8px Material Design Grid Layout) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* LEFT SECTION: DRAWER TRIGGER & BRAND IDENTITY */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Navigation Drawer Button */}
          <button
            id="header-drawer-toggle"
            onClick={onOpenDrawer}
            className="p-2 -ml-1 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80 active:scale-95 rounded-xl md:hidden transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            aria-label="মেনু খুলুন / Open Navigation Menu"
          >
            <Menu size={22} strokeWidth={2.2} />
          </button>

          {/* Interactive Logo & Brand Identity */}
          <div
            id="header-brand-container"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none min-w-0"
            title="হোম পেজে ফিরে যান / Go to Home"
          >
            {/* Custom Brand Squircle Logo */}
            <SmartKhulnaLogo size={38} className="sm:w-[42px] sm:h-[42px] shrink-0" />

            {/* Typography & Official Government Credentials */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Bengali Primary Title */}
                <span className="text-[15px] sm:text-base font-black text-emerald-950 dark:text-emerald-200 tracking-tight font-serif group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {t('title')}
                </span>

                {/* English Wordmark */}
                <span className="hidden xs:inline-block text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider font-sans">
                  Smart Khulna
                </span>

                {/* Official Government Emblem Badge */}
                <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-emerald-700 to-emerald-800 text-amber-200 border border-[#D4AF37]/40 shadow-xs uppercase tracking-wider">
                  <ShieldCheck size={9} className="text-amber-300" />
                  <span>{t('official')}</span>
                </span>
              </div>

              {/* Subtitle & Civic Tag */}
              <div className="hidden xs:flex items-center gap-1.5 -mt-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-serif font-bold whitespace-nowrap truncate max-w-[200px] sm:max-w-xs">
                  {t('subtitle')}
                </span>
                <span className="w-1 h-1 bg-emerald-600/40 dark:bg-emerald-400/40 rounded-full shrink-0" />
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold whitespace-nowrap">
                  {t('districtPortal') || 'ডিজিটাল নাগরিক সেবা'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: ACTION CONTROLS & UTILITIES */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 1. Language Toggle (Globe) */}
          <button
            id="header-lang-toggle"
            onClick={onToggleLang}
            className="h-8 sm:h-9 text-[11px] sm:text-xs bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 font-extrabold px-2.5 sm:px-3 rounded-full flex items-center gap-1 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title="ভাষা পরিবর্তন করুন / Switch Language"
            aria-label="Language Switcher"
          >
            <Globe size={13} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-sans font-bold">{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* 2. PWA Install Prompt Button (Conditional) */}
          {isInstallable && (
            <button
              id="header-pwa-install-btn"
              onClick={onInstallPWA}
              className="h-8 sm:h-9 text-xs bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              title={t('install')}
            >
              <Download size={13} className="animate-bounce" />
              <span className="hidden xs:inline text-[11px] font-serif font-bold">{t('install')}</span>
            </button>
          )}

          {/* 3. District Selector Toggle */}
          <button
            id="header-district-selector-toggle"
            onClick={onToggleDistricts}
            className={`h-8 sm:h-9 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-full flex items-center gap-1 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 ${
              viewingDistrictId 
                ? 'bg-emerald-700 text-white border border-emerald-600 shadow-xs' 
                : 'bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-750'
            }`}
            title="সকল জেলা দেখুন / View All Districts"
          >
            <Map size={13} className={viewingDistrictId ? 'text-amber-300' : 'text-slate-500 dark:text-slate-400'} />
            <span className="font-serif">{t('allDistricts')}</span>
          </button>

          {/* 4. Theme Switcher (Dark / Light Mode) */}
          <button
            id="header-theme-toggle"
            onClick={onToggleDarkMode}
            className="w-8 h-8 sm:w-9 sm:h-9 text-slate-700 dark:text-amber-300 hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-90 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title={darkMode ? t('themeLight') : t('themeDark')}
            aria-label="Toggle Theme"
          >
            <div className="transition-transform duration-300 hover:rotate-45">
              {darkMode ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
            </div>
          </button>

          {/* 5. Notification Center Bell with Animated Badge */}
          <button
            id="header-notifications-toggle"
            onClick={onToggleNotifications}
            className="w-8 h-8 sm:w-9 sm:h-9 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-90 rounded-full relative flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title="বিজ্ঞপ্তি কেন্দ্র / Notifications Center"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={2} />
            {totalUnreadNotifications > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-xs animate-pulse">
                {totalUnreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default SmartKhulnaHeader;
