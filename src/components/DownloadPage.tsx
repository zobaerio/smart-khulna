import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Apple,
  Monitor,
  Laptop,
  Terminal,
  Globe,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Copy,
  Info,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { AppReleaseConfig } from '../dbData';
import { DevicePlatform } from '../hooks/usePWA';

interface DownloadPageProps {
  releaseConfig: AppReleaseConfig;
  platform: DevicePlatform;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstallPWA: () => void;
  onBackToApp: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({
  releaseConfig,
  platform,
  isInstallable,
  isInstalled,
  onInstallPWA,
  onBackToApp,
}) => {
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mobile' | 'desktop'>('all');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://smartkhulna.app/download';

  // Handle Share
  const handleShare = async () => {
    const shareData = {
      title: 'স্মার্ট খুলনা | Smart Khulna App',
      text: 'খুলনা বিভাগের সকল সেবা এক প্ল্যাটফর্মে। এখনই স্মার্ট খুলনা অ্যাপ ডাউনলোড করুন!',
      url: currentUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User canceled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Determine detected platform label
  const getDetectedPlatformName = () => {
    switch (platform) {
      case 'android':
        return 'Android ডিভাইস';
      case 'ios':
        return 'iPhone / iPad';
      case 'windows':
        return 'Windows PC';
      case 'macos':
        return 'Apple Mac';
      case 'linux':
        return 'Linux কম্পিউটার';
      default:
        return 'ওয়েব ব্রাউজার';
    }
  };

  return (
    <div id="download-page" className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-emerald-700 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            id="back-to-home-btn"
            onClick={onBackToApp}
            className="flex items-center gap-2 text-sm font-medium hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোমে ফিরুন</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="share-app-top-btn"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>শেয়ার করুন</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-500 text-white pt-8 pb-14 px-4 text-center relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-900/10 rounded-full blur-xl -ml-16 pointer-events-none" />

        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center">
          {/* Logo badge */}
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl p-2 flex items-center justify-center mb-4">
            <img 
              src="/file_0000000078dc81fabee4e5a0d47f7348.png" 
              alt="Smart Khulna Logo" 
              className="w-full h-full object-contain rounded-xl" 
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            স্মার্ট খুলনা অ্যাপ ডাউনলোড করুন
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base font-normal max-w-sm mb-4">
            আপনার ডিভাইস অনুযায়ী Smart Khulna ইনস্টল করুন
          </p>

          {/* Smart Device Detection Alert */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs font-medium text-emerald-50">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>সনাক্তকৃত ডিভাইস: <strong>{getDetectedPlatformName()}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-7 relative z-20 space-y-6">
        {/* Quick Recommended Platform Banner (Auto Detected) */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              {platform === 'android' && <Smartphone className="w-6 h-6" />}
              {platform === 'ios' && <Apple className="w-6 h-6" />}
              {platform === 'windows' && <Monitor className="w-6 h-6" />}
              {platform === 'macos' && <Laptop className="w-6 h-6" />}
              {platform === 'linux' && <Terminal className="w-6 h-6" />}
              {platform === 'other' && <Globe className="w-6 h-6" />}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                আপনার ডিভাইসের জন্য উপযুক্ত
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                {platform === 'android' && 'Android মোবাইল অ্যাপ'}
                {platform === 'ios' && 'Apple iPhone / iPad'}
                {platform === 'windows' && 'Windows ডেস্কটপ অ্যাপ'}
                {platform === 'macos' && 'macOS ডেস্কটপ অ্যাপ'}
                {platform === 'linux' && 'Linux ডেস্কটপ সংস্করণ'}
                {platform === 'other' && 'ইনস্টলযোগ্য প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA)'}
              </h2>
              <p className="text-xs text-slate-500">
                ভার্সন: v{releaseConfig.currentVersion} • সাইজ: {
                  platform === 'android' ? releaseConfig.android.fileSize :
                  platform === 'ios' ? releaseConfig.ios.fileSize :
                  platform === 'windows' ? releaseConfig.windows.fileSize :
                  platform === 'macos' ? releaseConfig.macos.fileSize :
                  platform === 'linux' ? releaseConfig.linux.fileSize : 'ক্যাশ লাইট'
                }
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {platform === 'android' && (
              <>
                {releaseConfig.android.storeUrl ? (
                  <a
                    href={releaseConfig.android.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Google Play থেকে ইনস্টল করুন</span>
                  </a>
                ) : releaseConfig.android.downloadUrl ? (
                  <a
                    href={releaseConfig.android.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Android APK ডাউনলোড করুন</span>
                  </a>
                ) : isInstallable ? (
                  <button
                    onClick={onInstallPWA}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>অ্যাপ ইনস্টল করুন</span>
                  </button>
                ) : (
                  <button
                    onClick={onInstallPWA}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalled ? 'অ্যাপ ইনস্টল করা আছে' : 'অ্যাপ ইনস্টল করুন'}</span>
                  </button>
                )}
              </>
            )}

            {platform === 'ios' && (
              <>
                {releaseConfig.ios.storeUrl ? (
                  <a
                    href={releaseConfig.ios.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    <Apple className="w-4 h-4" />
                    <span>App Store থেকে ইনস্টল করুন</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowIOSModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                  >
                    <Apple className="w-4 h-4" />
                    <span>iPhone এ ইনস্টল নিয়ম</span>
                  </button>
                )}
              </>
            )}

            {platform === 'windows' && (
              <button
                onClick={() => {
                  if (releaseConfig.windows.downloadUrl) {
                    window.open(releaseConfig.windows.downloadUrl, '_blank');
                  } else {
                    onInstallPWA();
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Windows App Download</span>
              </button>
            )}

            {platform === 'macos' && (
              <button
                onClick={() => {
                  if (releaseConfig.macos.downloadUrl) {
                    window.open(releaseConfig.macos.downloadUrl, '_blank');
                  } else {
                    onInstallPWA();
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
              >
                <Apple className="w-4 h-4" />
                <span>Download for macOS</span>
              </button>
            )}

            {platform === 'linux' && (
              <button
                onClick={() => {
                  if (releaseConfig.linux.downloadUrl) {
                    window.open(releaseConfig.linux.downloadUrl, '_blank');
                  } else {
                    onInstallPWA();
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span>Download for Linux</span>
              </button>
            )}

            {platform === 'other' && (
              <button
                onClick={onInstallPWA}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isInstalled ? 'অ্যাপ ইনস্টল করা আছে' : 'অ্যাপ ইনস্টল করুন'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            সকল ডিভাইস
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
              activeTab === 'mobile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            মোবাইল (Android / iOS)
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
              activeTab === 'desktop'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            ডেস্কটপ (PC / Mac)
          </button>
        </div>

        {/* Device Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. ANDROID */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div
              id="card-android"
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                platform === 'android' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">Android</h3>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        {releaseConfig.android.badge || 'AAB / APK'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Android 7.0+ (Nougat এবং পরবর্তী)</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {releaseConfig.android.fileSize}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {releaseConfig.android.instructions || 'Google Play Store রিভিউ প্রক্রিয়াধীন। অথবা সরাসরি APK ডাউনলোড করুন।'}
              </p>

              <div className="space-y-2">
                {releaseConfig.android.storeUrl ? (
                  <a
                    href={releaseConfig.android.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Google Play থেকে ইনস্টল করুন</span>
                  </a>
                ) : releaseConfig.android.downloadUrl ? (
                  <a
                    href={releaseConfig.android.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Android APK ডাউনলোড করুন</span>
                  </a>
                ) : (
                  <button
                    onClick={onInstallPWA}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalled ? 'অ্যাপ ইনস্টল করা আছে' : 'Android App ইনস্টল করুন'}</span>
                  </button>
                )}

                <div className="text-[11px] text-center text-slate-400">
                  ভার্সন: v{releaseConfig.android.version}
                </div>
              </div>
            </div>
          )}

          {/* 2. iOS */}
          {(activeTab === 'all' || activeTab === 'mobile') && (
            <div
              id="card-ios"
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                platform === 'ios' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                    <Apple className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">iPhone / iPad</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        iOS 14+
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Apple iPhone & iPad ডিভাইস</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {releaseConfig.ios.fileSize}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {releaseConfig.ios.instructions || 'Apple App Store রিভিউ প্রক্রিয়াধীন। Safari ব্রাউজারের Share থেকে Add to Home Screen করুন।'}
              </p>

              <div className="space-y-2">
                {releaseConfig.ios.storeUrl ? (
                  <a
                    href={releaseConfig.ios.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <Apple className="w-4 h-4" />
                    <span>App Store থেকে ইনস্টল করুন</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowIOSModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <Apple className="w-4 h-4" />
                    <span>ইনস্টল নির্দেশিকা (Safari)</span>
                  </button>
                )}

                <div className="text-[11px] text-center text-slate-400">
                  ভার্সন: v{releaseConfig.ios.version}
                </div>
              </div>
            </div>
          )}

          {/* 3. WINDOWS */}
          {(activeTab === 'all' || activeTab === 'desktop') && (
            <div
              id="card-windows"
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                platform === 'windows' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">Windows</h3>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        .exe / .msi
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Windows 10, Windows 11 (64-bit)</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {releaseConfig.windows.fileSize}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {releaseConfig.windows.instructions || 'Windows 10 / 11 এর জন্য .exe অথবা ক্রোমিয়াম বেসড ডেস্কটপ PWA ইনস্টলার।'}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (releaseConfig.windows.downloadUrl) {
                      window.open(releaseConfig.windows.downloadUrl, '_blank');
                    } else {
                      onInstallPWA();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Windows App Download</span>
                </button>

                <div className="text-[11px] text-center text-slate-400">
                  ভার্সন: v{releaseConfig.windows.version}
                </div>
              </div>
            </div>
          )}

          {/* 4. macOS */}
          {(activeTab === 'all' || activeTab === 'desktop') && (
            <div
              id="card-macos"
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                platform === 'macos' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">macOS</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        .dmg
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Apple Silicon (M-series) & Intel</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {releaseConfig.macos.fileSize}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {releaseConfig.macos.instructions || 'Apple Silicon এবং Intel Mac এর জন্য .dmg প্যাকেজ অথবা Safari/Chrome PWA।'}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (releaseConfig.macos.downloadUrl) {
                      window.open(releaseConfig.macos.downloadUrl, '_blank');
                    } else {
                      onInstallPWA();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download for macOS</span>
                </button>

                <div className="text-[11px] text-center text-slate-400">
                  ভার্সন: v{releaseConfig.macos.version}
                </div>
              </div>
            </div>
          )}

          {/* 5. LINUX */}
          {(activeTab === 'all' || activeTab === 'desktop') && (
            <div
              id="card-linux"
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                platform === 'linux' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">Linux</h3>
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                        AppImage / .deb
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Ubuntu, Debian, Fedora, Arch</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {releaseConfig.linux.fileSize}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {releaseConfig.linux.instructions || 'Linux ডিস্ট্রিবিউশনের জন্য AppImage অথবা .deb ইনস্টলার প্যাকেজ।'}
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (releaseConfig.linux.downloadUrl) {
                      window.open(releaseConfig.linux.downloadUrl, '_blank');
                    } else {
                      onInstallPWA();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download for Linux</span>
                </button>

                <div className="text-[11px] text-center text-slate-400">
                  ভার্সন: v{releaseConfig.linux.version}
                </div>
              </div>
            </div>
          )}

          {/* 6. WEB APP / PWA */}
          {activeTab === 'all' && (
            <div
              id="card-pwa"
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-base">Web App / PWA</h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        জিরো ইন্সটল
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">ক্রোম, এজ, সাফারি, ফায়ারফক্স</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700">
                  তাত্ক্ষণিক
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                কোন ফাইল ডাউনলোড ছাড়া সরাসরি ব্রাউজার থেকে অ্যাপের মতো ব্যবহার ও হোম স্ক্রিনে সেভ করুন।
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onInstallPWA}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isInstalled ? 'ইনস্টল করা আছে' : 'অ্যাপ ইনস্টল করুন'}</span>
                </button>
                <button
                  onClick={onBackToApp}
                  className="flex items-center justify-center gap-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <span>Web App ব্যবহার করুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* QR Code Section */}
        <div id="qr-section" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner flex flex-col items-center">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCodeSVG
                  value={currentUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/file_0000000078dc81fabee4e5a0d47f7348.png',
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>
              <div className="mt-2 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>মোবাইল ক্যামেরা দিয়ে স্ক্যান করুন</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>অফিসিয়াল নিরাপদ ইনস্টলার লিংক</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                অন্য ফোন থেকে স্ক্যান করে ইনস্টল করুন
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                আপনার অন্য যেকোনো ফোন বা ট্যাবলেটের ক্যামেরা অন করে উপরের QR কোডটি স্ক্যান করলেই সরাসরি স্মার্ট খুলনা ডাউনলোড ও ইনস্টল পেজ ওপেন হবে।
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <button
                  id="share-app-bottom-btn"
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>অ্যাপটি শেয়ার করুন</span>
                </button>

                <button
                  id="copy-link-btn"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'ডাউনলোড লিংক কপি করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Release Notes & App Update System */}
        <div id="release-notes-section" className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-base">
                রিলিজ নোট ও ভার্সন ইতিহাস (v{releaseConfig.currentVersion})
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              রিলিজ তারিখ: {releaseConfig.releaseDate}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {releaseConfig.releaseNotes.map((note, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>সর্বনিম্ন সমর্থিত সংস্করণ: v{releaseConfig.minimumSupportedVersion}</span>
            <span className="text-emerald-700 font-semibold">সব ডিভাইসে স্বয়ংক্রিয় আপডেট সমর্থিত</span>
          </div>
        </div>
      </div>

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-900" />
                <h4 className="font-bold text-slate-900 text-base">iPhone এ ইনস্টল নিয়ম</h4>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apple Safari ব্রাউজার ব্যবহার করে মাত্র ২টি ধাপে সরাসরি আপনার iPhone বা iPad এর হোম স্ক্রিনে স্মার্ট খুলনা অ্যাপটি ইনস্টল করে নিন:
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ১
                </div>
                <div className="text-xs text-slate-700">
                  Safari এর নিচে থাকা <strong>Share</strong> (শেয়ার <Share2 className="w-3 h-3 inline text-blue-600" />) বাটনে ট্যাপ করুন।
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ২
                </div>
                <div className="text-xs text-slate-700">
                  নিচের দিকে স্ক্রোল করে <strong>"Add to Home Screen"</strong> (হোম স্ক্রিনে যোগ করুন) অপশনে চাপ দিন এবং 'Add' চাপুন।
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
