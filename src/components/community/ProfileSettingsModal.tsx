import React, { useState } from 'react';
import { X, Shield, Lock, Bell, Moon, Sun, Trash2, LogOut, ChevronRight, Settings, ArrowLeft, Eye, EyeOff, BellRing, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

type SettingsSection = 'main' | 'account' | 'notifications' | 'privacy';

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  darkMode,
  setDarkMode
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');

  if (!isOpen) return null;

  const settingsItems = [
    { 
      id: 'account',
      icon: <Lock className="text-blue-500" size={18} />, 
      label: 'পাসওয়ার্ড ও নিরাপত্তা', 
      desc: 'আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন',
      onClick: () => setActiveSection('account')
    },
    { 
      id: 'notifications',
      icon: <Bell className="text-amber-500" size={18} />, 
      label: 'নোটিফিকেশন সেটিংস', 
      desc: 'আপনার বিজ্ঞপ্তির ধরণ নিয়ন্ত্রণ করুন',
      onClick: () => setActiveSection('notifications')
    },
    { 
      id: 'privacy',
      icon: <Shield className="text-emerald-600" size={18} />, 
      label: 'প্রাইভেসি কন্ট্রোল', 
      desc: 'আপনার প্রোফাইল কে কে দেখতে পারবে',
      onClick: () => setActiveSection('privacy')
    },
    { 
      id: 'theme',
      icon: darkMode ? <Sun className="text-yellow-500" size={18} /> : <Moon className="text-slate-600" size={18} />, 
      label: darkMode ? 'লাইট মোড' : 'ডার্ক মোড', 
      desc: 'আপনার পছন্দের থিম ব্যবহার করুন',
      onClick: () => setDarkMode(!darkMode)
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="p-4 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">পাসওয়ার্ড পরিবর্তন</h4>
              <div className="space-y-3">
                <input type="password" placeholder="বর্তমান পাসওয়ার্ড" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
                <input type="password" placeholder="নতুন পাসওয়ার্ড" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
                <button className="w-full bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold shadow-sm">আপডেট করুন</button>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">লগইন ডিভাইসসমূহ</h4>
              <div className="flex items-center justify-between text-xs p-2">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300">Android - Chrome</p>
                    <p className="text-[10px] text-slate-400 text-emerald-500">বর্তমানে সক্রিয়</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-4 space-y-3">
            {[
              { label: 'নতুন মেসেজ এলে নোটিফিকেশন', icon: <BellRing size={16} className="text-amber-500" /> },
              { label: 'নতুন কমেন্ট বা লাইক এলে জানান', icon: <Lock size={16} className="text-emerald-500" /> },
              { label: 'প্রয়োজনীয় ঘোষণা ও আপডেট', icon: <Shield size={16} className="text-blue-500" /> },
              { label: 'ইমেইল নোটিফিকেশন', icon: <Bell size={16} className="text-slate-400" /> }
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  {pref.icon}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{pref.label}</span>
                </div>
                <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'privacy':
        return (
          <div className="p-4 space-y-3">
            {[
              { label: 'আমার প্রোফাইল সবার জন্য উন্মুক্ত', icon: <Eye size={16} className="text-emerald-500" />, active: true },
              { label: 'মেসেজ শুধুমাত্র ফলোয়াররা পাঠাতে পারবে', icon: <Lock size={16} className="text-amber-500" />, active: false },
              { label: 'অ্যাক্টিভিটি স্ট্যাটাস দেখান', icon: <Shield size={16} className="text-blue-500" />, active: true },
              { label: 'সার্চ রেজাল্টে আমাকে দেখান', icon: <EyeOff size={16} className="text-slate-400" />, active: true }
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  {pref.icon}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{pref.label}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${pref.active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${pref.active ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="p-2">
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition" />
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 pb-2">
              <button
                onClick={() => {
                  if (confirm('আপনার অ্যাকাউন্টটি কি স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফিরে পাওয়া যাবে না।')) {
                    alert('অ্যাকাউন্ট মোছার অনুরোধ গ্রহণ করা হয়েছে।');
                  }
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                  <Trash2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-600">অ্যাকাউন্ট মুছে ফেলুন</p>
                  <p className="text-[10px] text-rose-400">স্থায়ীভাবে ডাটা ডিলিট করুন</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition text-left group mt-1"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                  <LogOut size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">লগআউট করুন</p>
                  <p className="text-[10px] text-slate-500">বর্তমান সেশন বন্ধ করুন</p>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            {activeSection !== 'main' && (
              <button onClick={() => setActiveSection('main')} className="mr-1 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition">
                <ArrowLeft size={18} className="text-slate-600 dark:text-slate-300" />
              </button>
            )}
            <Settings className="text-slate-600 dark:text-slate-300" size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">
              {activeSection === 'account' ? 'পাসওয়ার্ড ও নিরাপত্তা' : 
               activeSection === 'notifications' ? 'নোটিফিকেশন সেটিংস' : 
               activeSection === 'privacy' ? 'প্রাইভেসি কন্ট্রোল' : 'অ্যাকাউন্ট সেটিংস'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          {renderContent()}
        </div>

        <div className="p-4 text-center border-t border-slate-50 dark:border-slate-800/50">
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Smart Khulna v2.0.0 • Digital District Directory</p>
        </div>
      </motion.div>
    </div>
  );
};
