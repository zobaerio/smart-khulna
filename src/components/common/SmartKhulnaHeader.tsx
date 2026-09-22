import React from 'react';
import { Menu, Globe, Download, Map, Sun, Moon, Bell } from 'lucide-react';
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
 * Ultra-Premium Top Header Component (Smart Khulna)
 * 
 * Aesthetic Philosophy:
 * Bangladesh Government Civic Tech × Google Pixel (Material Design 3)
 * 
 * Layout & Polish:
 * - Clean, minimal "K + Green Leaf" brand squircle icon only (no text, no tagline)
 * - 8px Material Design grid spacing & 44px touch targets
 * - Ultra-premium dark emerald glass notice bar with 60 FPS marquee and large hero Bengal Tiger
 * - Smooth Material 3 transitions and tactile active-press feedback
 * - 100% preservation of all existing navigation, state handlers, and callbacks
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
      {/* 1. TOP LUXURY NOTICE TICKER & LARGE HERO ROYAL BENGAL TIGER */}
      <LuxuryNoticeTicker
        noticeText={t('notice')}
        noticeLabel={t('noticeLabel')}
      />

      {/* 2. PRIMARY NAVIGATION BAR (Strict 8px Material Design 3 Grid Layout) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 h-14 sm:h-16">
        {/* LEFT SECTION: DRAWER TRIGGER & CLEAN K+LEAF LOGO (NO TEXT, NO TAGLINE) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Navigation Drawer Button (44px touch target) */}
          <button
            id="header-drawer-toggle"
            onClick={onOpenDrawer}
            className="w-10 h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80 active:scale-95 rounded-xl md:hidden transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            aria-label="মেনু খুলুন / Open Navigation Menu"
          >
            <Menu size={22} strokeWidth={2.2} />
          </button>

          {/* Clean, Minimal "K + Green Leaf" Logo (No text, no tagline as specified) */}
          <div
            id="header-brand-container"
            onClick={onNavigateHome}
            className="cursor-pointer group select-none flex items-center shrink-0 active:scale-95 transition-transform duration-150"
            title="স্মার্ট খুলনা - হোম পেজ / Smart Khulna Home"
            role="button"
            tabIndex={0}
            aria-label="Smart Khulna Logo"
          >
            <SmartKhulnaLogo size={42} className="sm:w-[46px] sm:h-[46px]" showGlow={true} />
          </div>
        </div>

        {/* RIGHT SECTION: ACTION CONTROLS & UTILITIES (8px Material Spacing) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Language Toggle (Globe) */}
          <button
            id="header-lang-toggle"
            onClick={onToggleLang}
            className="h-9 text-[11px] sm:text-xs bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 font-extrabold px-3 rounded-full flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title="ভাষা পরিবর্তন করুন / Switch Language"
            aria-label="Language Switcher"
          >
            <Globe size={14} className="text-emerald-700 dark:text-emerald-400" />
            <span className="font-sans font-bold">{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* 2. PWA Install Prompt Button (Conditional) */}
          {isInstallable && (
            <button
              id="header-pwa-install-btn"
              onClick={onInstallPWA}
              className="h-9 text-xs bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-3 rounded-full flex items-center gap-1.5 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              title={t('install')}
            >
              <Download size={14} className="animate-bounce" />
              <span className="hidden xs:inline text-[11px] font-serif font-bold">{t('install')}</span>
            </button>
          )}

          {/* 3. District Selector Toggle */}
          <button
            id="header-district-selector-toggle"
            onClick={onToggleDistricts}
            className={`h-9 text-[11px] sm:text-xs font-bold px-3 rounded-full flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 ${
              viewingDistrictId 
                ? 'bg-emerald-700 text-white border border-emerald-600 shadow-xs' 
                : 'bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-750'
            }`}
            title="সকল জেলা দেখুন / View All Districts"
          >
            <Map size={13} className={viewingDistrictId ? 'text-amber-300' : 'text-slate-500 dark:text-slate-400'} />
            <span className="font-serif">{t('allDistricts')}</span>
          </button>

          {/* 4. Dark / Light Theme Toggle (40px touch target) */}
          <button
            id="header-theme-toggle"
            onClick={onToggleDarkMode}
            className="w-10 h-10 flex items-center justify-center text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-95 rounded-full cursor-pointer transition-colors duration-150 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title={darkMode ? t('themeLight') : t('themeDark')}
            aria-label="Toggle Dark/Light Theme"
          >
            {darkMode ? (
              <Sun size={19} className="text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon size={19} className="text-emerald-800 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* 5. Notification Center Bell Toggle (40px touch target) */}
          <button
            id="header-notifications-toggle"
            onClick={onToggleNotifications}
            className="w-10 h-10 flex items-center justify-center text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-95 rounded-full relative cursor-pointer transition-colors duration-150 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title="বিজ্ঞপ্তি কেন্দ্র / Notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {totalUnreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-xs animate-pulse">
                {totalUnreadNotifications > 99 ? '99+' : totalUnreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default SmartKhulnaHeader;
