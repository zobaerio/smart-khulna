import React, { useState } from 'react';
import {
  Smartphone,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Apple,
  Monitor
} from 'lucide-react';
import { AppReleaseConfig, defaultReleaseConfig } from '../dbData';

interface AdminDownloadsCMSProps {
  initialConfig: AppReleaseConfig;
  onSave: (config: AppReleaseConfig) => Promise<void>;
  onClose: () => void;
}

export const AdminDownloadsCMS: React.FC<AdminDownloadsCMSProps> = ({
  initialConfig,
  onSave,
  onClose,
}) => {
  const [config, setConfig] = useState<AppReleaseConfig>(initialConfig);
  const [releaseNotesText, setReleaseNotesText] = useState(
    initialConfig.releaseNotes.join('\n')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedNotes = releaseNotesText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const finalConfig: AppReleaseConfig = {
        ...config,
        releaseNotes: updatedNotes.length > 0 ? updatedNotes : config.releaseNotes,
      };

      await onSave(finalConfig);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update release config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি ডিফল্ট রিলিজ কনফিগারেশনে ফিরে যেতে চান?')) {
      setConfig(defaultReleaseConfig);
      setReleaseNotesText(defaultReleaseConfig.releaseNotes.join('\n'));
    }
  };

  return (
    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-sm">
            <Smartphone size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-serif">
              অ্যাপ ও ডাউনলোড সিস্টেম ম্যানেজমেন্ট
            </h4>
            <p className="text-[10px] text-slate-500">
              সকল প্ল্যাটফর্মের জন্য ডাউনলোড লিংক, সংস্করণ ও রিলিজ নোটস কনফিগার করুন
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded hover:bg-slate-200"
        >
          বন্ধ করুন
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span>রিলিজ কনফিগারেশন সফলভাবে আপডেট ও ক্লাউডে সিঙ্ক করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Version Settings */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles size={14} className="text-emerald-700" />
            সাধারণ সংস্করণ সেটিংস (Global Versioning)
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                বর্তমান ভার্সন (Current Version)
              </label>
              <input
                type="text"
                value={config.currentVersion}
                onChange={(e) => setConfig({ ...config, currentVersion: e.target.value })}
                placeholder="1.0.0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                নূন্যতম সমর্থিত ভার্সন (Min Version)
              </label>
              <input
                type="text"
                value={config.minimumSupportedVersion}
                onChange={(e) => setConfig({ ...config, minimumSupportedVersion: e.target.value })}
                placeholder="1.0.0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                রিলিজ তারিখ (Release Date)
              </label>
              <input
                type="text"
                value={config.releaseDate}
                onChange={(e) => setConfig({ ...config, releaseDate: e.target.value })}
                placeholder="২০২৬-০৩-২০"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              রিলিজ নোটস (Release Notes - প্রতি লাইনে একটি ফিচার লিখুন)
            </label>
            <textarea
              rows={4}
              value={releaseNotesText}
              onChange={(e) => setReleaseNotesText(e.target.value)}
              placeholder="নতুন ফিচার ১&#10;নতুন ফিচার ২"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* 1. Android Configuration */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Android সেটিংস (Google Play Store & Direct APK)
            </h5>
            <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={config.android.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    android: { ...config.android, enabled: e.target.checked },
                  })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              সক্রিয়
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                ডাইরেক্ট APK ডাউনলোড লিংক (URL)
              </label>
              <input
                type="url"
                value={config.android.downloadUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    android: { ...config.android, downloadUrl: e.target.value },
                  })
                }
                placeholder="https://example.com/smart-khulna.apk"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Google Play Store লিংক
              </label>
              <input
                type="url"
                value={config.android.storeUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    android: { ...config.android, storeUrl: e.target.value },
                  })
                }
                placeholder="https://play.google.com/store/apps/details?id=com.smartkhulna.app"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                প্যাকেজ সাইজ (APK Size)
              </label>
              <input
                type="text"
                value={config.android.fileSize}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    android: { ...config.android, fileSize: e.target.value },
                  })
                }
                placeholder="18.5 MB"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                ভার্সন
              </label>
              <input
                type="text"
                value={config.android.version}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    android: { ...config.android, version: e.target.value },
                  })
                }
                placeholder="1.0.0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Apple iOS Configuration */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Apple size={14} className="text-slate-800" />
              Apple iOS সেটিংস (iPhone & iPad)
            </h5>
            <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={config.ios.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ios: { ...config.ios, enabled: e.target.checked },
                  })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              সক্রিয়
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                Apple App Store লিংক (বা টেস্টফ্লাইট URL)
              </label>
              <input
                type="url"
                value={config.ios.storeUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ios: { ...config.ios, storeUrl: e.target.value },
                  })
                }
                placeholder="https://apps.apple.com/app/smart-khulna/id..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                iOS ভার্সন
              </label>
              <input
                type="text"
                value={config.ios.version}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ios: { ...config.ios, version: e.target.value },
                  })
                }
                placeholder="1.0.0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                আকার (Size)
              </label>
              <input
                type="text"
                value={config.ios.fileSize}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    ios: { ...config.ios, fileSize: e.target.value },
                  })
                }
                placeholder="22.1 MB"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Desktop Configurations (Windows, Mac, Linux) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-xs">
          <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Monitor size={14} className="text-blue-700" />
            ডেস্কটপ অপারেটিং সিস্টেম সেটিংস (Windows, macOS, Linux)
          </h5>

          {/* Windows */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Microsoft Windows (.exe)</span>
              <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.windows.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      windows: { ...config.windows, enabled: e.target.checked },
                    })
                  }
                />
                অন
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="url"
                value={config.windows.downloadUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    windows: { ...config.windows, downloadUrl: e.target.value },
                  })
                }
                placeholder="Windows ইনস্টলার লিংক (.exe)"
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={config.windows.fileSize}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    windows: { ...config.windows, fileSize: e.target.value },
                  })
                }
                placeholder="ফাইল সাইজ (e.g. 48.6 MB)"
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
              />
            </div>
          </div>

          {/* macOS */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Apple macOS (.dmg)</span>
              <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.macos.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      macos: { ...config.macos, enabled: e.target.checked },
                    })
                  }
                />
                অন
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="url"
                value={config.macos.downloadUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    macos: { ...config.macos, downloadUrl: e.target.value },
                  })
                }
                placeholder="macOS ইনস্টলার লিংক (.dmg)"
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={config.macos.fileSize}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    macos: { ...config.macos, fileSize: e.target.value },
                  })
                }
                placeholder="ফাইল সাইজ (e.g. 52.3 MB)"
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
              />
            </div>
          </div>

          {/* Linux */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Linux (.deb / AppImage)</span>
              <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.linux.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      linux: { ...config.linux, enabled: e.target.checked },
                    })
                  }
                />
                অন
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="url"
                value={config.linux.downloadUrl}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    linux: { ...config.linux, downloadUrl: e.target.value },
                  })
                }
                placeholder="Linux প্যাকেজ লিংক (.AppImage / .deb)"
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white"
              />
              <input
                type="text"
                value={config.linux.fileSize}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    linux: { ...config.linux, fileSize: e.target.value },
                  })
                }
                placeholder="ফাইল সাইজ (e.g. 44.8 MB)"
                className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <Shield size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>নিরাপত্তা নিশ্চিতকরণ:</strong> ডাউনলোডযোগ্য ক্লায়েন্ট এবং PWA ইনস্টলারে কোনো প্রশাসনিক অধিকার বা অ্যাডমিন অ্যাক্সেস থাকে না। শুধুমাত্র অনুমোদিত জিমেইল অ্যাকাউন্টধারী অ্যাডমিনরা ব্রাউজারে লগইন করে অনুমোদন ও কনফিগারেশন সম্পাদন করতে পারেন।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold py-2 px-3 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <RotateCcw size={14} />
            ডিফল্ট রিলিজ রিসেট
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Save size={15} />
              {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন প্রকাশ করুন'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
