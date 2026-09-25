import React from 'react';
import { Menu, Globe, Download, Map, Sun, Moon, Bell, Search, PhoneCall } from 'lucide-react';
import { SmartKhulnaLogo } from './SmartKhulnaLogo';
import { LuxuryNoticeTicker } from './LuxuryNoticeTicker';

export interface SmartKhulnaHeaderProps {
  onOpenDrawer: () => void;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateSearch?: () => void;
  onOpenSOS?: () => void;
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
  activeNotice?: { title: string; priority?: string } | null;
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
  onNavigateProfile,
  onNavigateSearch,
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
  t,
  activeNotice,
  onOpenSOS
}) => {
  return (
    <header 
      id="smart-khulna-top-header"
      className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/10 dark:border-slate-800 shadow-sm transition-colors duration-200 shrink-0"
    >
      {/* 1. TOP LUXURY NOTICE TICKER & LARGE HERO ROYAL BENGAL TIGER */}
      <LuxuryNoticeTicker
        noticeText={activeNotice?.title || t('notice')}
        noticeLabel={t('noticeLabel')}
        priority={activeNotice?.priority as ('High' | 'Medium' | 'Low' | undefined)}
      />

      {/* 2. PRIMARY NAVIGATION BAR (Strict Responsive Material Design 3 Grid Layout) */}
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-3 h-14 sm:h-16 overflow-visible">
        {/* LEFT SECTION: DRAWER TRIGGER & CLEAN K+LEAF LOGO */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile & Tablet Navigation Drawer Button */}
          <button
            id="header-drawer-toggle"
            onClick={onOpenDrawer}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80 active:scale-95 rounded-xl lg:hidden transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            aria-label="মেনু খুলুন / Open Navigation Menu"
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>

          {/* Clean, Minimal "K + Green Leaf" Logo */}
          <div
            id="header-brand-container"
            onClick={onNavigateHome}
            className="cursor-pointer group select-none flex items-center shrink-0 active:scale-95 transition-transform duration-150"
            title="স্মার্ট খুলনা - হোম পেজ / Smart Khulna Home"
            role="button"
            tabIndex={0}
            aria-label="Smart Khulna Logo"
          >
            <SmartKhulnaLogo size={38} className="sm:w-[44px] sm:h-[44px]" showGlow={true} />
          </div>
        </div>

        {/* RIGHT SECTION: ACTION CONTROLS & UTILITIES */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 pr-0.5 sm:pr-0">
          {/* SOS Emergency Helpline Quick Button */}
          {onOpenSOS && (
            <button
              id="header-sos-emergency-btn"
              onClick={onOpenSOS}
              className="h-8 sm:h-9 text-[11px] sm:text-xs bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold px-2.5 sm:px-3 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-xs transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-rose-500/50"
              title="জরুরি হেল্পলাইন ও এসওএস / 24/7 Emergency SOS Directory"
              aria-label="Emergency SOS"
            >
              <PhoneCall size={12} className="animate-pulse" />
              <span>SOS</span>
            </button>
          )}

          {/* 0. Global Search Quick Button */}
          <button
            id="header-search-btn"
            onClick={onNavigateSearch}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 flex items-center justify-center text-slate-700 dark:text-slate-200 bg-slate-100/70 hover:bg-blue-50 dark:bg-slate-850 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 rounded-full transition-all duration-150 cursor-pointer border border-slate-200/60 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            title="সার্চ করুন / Global Search"
            aria-label="Global Search"
          >
            <Search size={16} strokeWidth={2.3} />
          </button>

          {/* 1. Language Toggle (Globe) */}
          <button
            id="header-lang-toggle"
            onClick={onToggleLang}
            className="h-8 sm:h-9 text-[11px] sm:text-xs bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 font-extrabold px-2 sm:px-3 rounded-full flex items-center gap-1 sm:gap-1.5 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
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
              className="h-8 sm:h-9 text-xs bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-2.5 sm:px-3 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              title={t('install')}
            >
              <Download size={13} className="animate-bounce" />
              <span className="hidden md:inline text-[11px] font-serif font-bold">{t('install')}</span>
            </button>
          )}

          {/* 3. District Selector Toggle */}
          <button
            id="header-district-selector-toggle"
            onClick={onToggleDistricts}
            className={`h-8 sm:h-9 text-[11px] sm:text-xs font-bold px-2 sm:px-3 rounded-full flex items-center gap-1 sm:gap-1.5 transition-all duration-150 active:scale-95 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 ${
              viewingDistrictId 
                ? 'bg-emerald-700 text-white border border-emerald-600 shadow-xs' 
                : 'bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-750'
            }`}
            title="সকল জেলা দেখুন / View All Districts"
          >
            <Map size={13} className={viewingDistrictId ? 'text-amber-300' : 'text-slate-500 dark:text-slate-400'} />
            <span className="font-serif hidden xs:inline">{t('allDistricts')}</span>
          </button>

          {/* 4. Dark / Light Theme Toggle */}
          <button
            id="header-theme-toggle"
            onClick={onToggleDarkMode}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 flex items-center justify-center text-emerald-900 dark:text-emerald-200 bg-slate-100/70 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-slate-800 active:scale-95 rounded-full cursor-pointer transition-colors duration-150 border border-slate-200/60 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
            title={darkMode ? t('themeLight') : t('themeDark')}
            aria-label="Toggle Dark/Light Theme"
          >
            {darkMode ? (
              <Sun size={17} className="text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon size={17} className="text-emerald-800 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* 5. Notification Center Bell Button (High Visibility with Inward Safe Badge) */}
          <button
            id="header-notifications-toggle"
            onClick={onToggleNotifications}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 flex items-center justify-center text-emerald-900 dark:text-emerald-200 bg-emerald-50/90 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 border border-emerald-200/80 dark:border-slate-700 active:scale-95 rounded-full relative cursor-pointer transition-all duration-150 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 shrink-0 ml-0.5"
            title="বিজ্ঞপ্তি কেন্দ্র / Notifications"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={2.2} className="text-emerald-800 dark:text-emerald-300" />
            {totalUnreadNotifications > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse pointer-events-none">
                {totalUnreadNotifications > 99 ? '99+' : totalUnreadNotifications}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};

export default SmartKhulnaHeader;
