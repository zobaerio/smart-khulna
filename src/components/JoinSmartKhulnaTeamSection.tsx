import React, { useState } from 'react';
import { Shield, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { District } from '../dbData';
import { JoinRequestModal } from './JoinRequestModal';

interface JoinSmartKhulnaTeamSectionProps {
  districts: District[];
  currentUserName?: string;
  currentUserEmail?: string;
  currentUserPhone?: string;
  onSubmitApplication: (application: {
    fullName: string;
    phone: string;
    email: string;
    district: string;
    upazila: string;
    area: string;
    role: 'sub_admin' | 'moderator';
    reason: string;
    experience: string;
    status: 'pending';
    createdAt: string;
  }) => Promise<void>;
}

export const JoinSmartKhulnaTeamSection: React.FC<JoinSmartKhulnaTeamSectionProps> = ({
  districts,
  currentUserName = '',
  currentUserEmail = '',
  currentUserPhone = '',
  onSubmitApplication
}) => {
  const [expandedRole, setExpandedRole] = useState<'sub_admin' | 'moderator' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState<'sub_admin' | 'moderator'>('sub_admin');

  const handleToggleCard = (role: 'sub_admin' | 'moderator') => {
    // Smoothly toggle or switch: if already expanded, collapse; otherwise expand selected and collapse other
    setExpandedRole(prev => (prev === role ? null : role));
  };

  const handleOpenModal = (role: 'sub_admin' | 'moderator') => {
    setDefaultRole(role);
    setIsModalOpen(true);
  };

  return (
    <section className="my-10 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <Sparkles size={12} /> স্মার্ট খুলনা স্বেচ্ছাসেবক ও প্রশাসনিক টিম
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white">
              আপনিও যুক্ত হোন Smart Khulna-এর সাথে
            </h2>
            <p className="text-xs text-slate-300 font-serif">
              আপনার এলাকার তথ্য ও সেবাগুলো সবার কাছে পৌঁছে দিতে Sub Admin বা Moderator হিসেবে যোগ দিন।
            </p>
          </div>

          {/* Compact Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sub Admin Compact Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden shadow-sm">
              <div
                onClick={() => handleToggleCard('sub_admin')}
                className="p-5 flex items-center justify-between cursor-pointer group select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                    <Shield size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-serif">Sub Admin (সাব-এডমিন)</h3>
                    <p className="text-[11px] text-slate-300">স্থানীয় সার্ভিস ও ডেটা ব্যবস্থাপনা</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform duration-300">
                  <span>{expandedRole === 'sub_admin' ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত দেখুন'}</span>
                  <span className={`transform transition-transform duration-300 ${expandedRole === 'sub_admin' ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={15} />
                  </span>
                </div>
              </div>

              {/* Smooth Expandable Details Container */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  expandedRole === 'sub_admin'
                    ? 'grid-rows-[1fr] opacity-100 pb-5 px-5'
                    : 'grid-rows-[0fr] opacity-0 pb-0 px-5'
                }`}
              >
                <div className="overflow-hidden space-y-4 text-xs border-t border-white/10 pt-4">
                  <div className="space-y-1.5">
                    <p className="font-bold text-emerald-300">Sub Admin কী করবেন?</p>
                    <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-emerald-400">
                      <li>স্থানীয় সার্ভিস ও প্রতিষ্ঠানের তথ্য সংগ্রহ ও আপডেট</li>
                      <li>এলাকার গুরুত্বপূর্ণ তথ্য পরিচালনায় সহায়তা</li>
                      <li>Moderator-দের কাজ সমন্বয়</li>
                      <li>প্রয়োজন অনুযায়ী তথ্য যাচাই</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <p className="font-bold text-amber-300">যোগ্যতা ও শর্ত:</p>
                    <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-amber-400">
                      <li>নিজের এলাকার বিষয়ে ভালো ধারণা</li>
                      <li>দায়িত্বশীল ও নিয়মিত কাজ করার মানসিকতা</li>
                      <li>সঠিক তথ্য সংগ্রহ ও যাচাই করার সক্ষমতা</li>
                      <li>Smart Khulna-এর নিয়ম মেনে কাজ করা</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenModal('sub_admin')}
                    className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95"
                  >
                    <span>Become a Sub Admin →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Moderator Compact Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden shadow-sm">
              <div
                onClick={() => handleToggleCard('moderator')}
                className="p-5 flex items-center justify-between cursor-pointer group select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                    <ShieldAlert size={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-serif">Moderator (মডারেটর)</h3>
                    <p className="text-[11px] text-slate-300">তথ্য যাচাই ও কমিউনিটি পর্যবেক্ষণ</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform duration-300">
                  <span>{expandedRole === 'moderator' ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত দেখুন'}</span>
                  <span className={`transform transition-transform duration-300 ${expandedRole === 'moderator' ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={15} />
                  </span>
                </div>
              </div>

              {/* Smooth Expandable Details Container */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  expandedRole === 'moderator'
                    ? 'grid-rows-[1fr] opacity-100 pb-5 px-5'
                    : 'grid-rows-[0fr] opacity-0 pb-0 px-5'
                }`}
              >
                <div className="overflow-hidden space-y-4 text-xs border-t border-white/10 pt-4">
                  <div className="space-y-1.5">
                    <p className="font-bold text-emerald-300">Moderator কী করবেন?</p>
                    <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-emerald-400">
                      <li>স্থানীয় তথ্য ও সার্ভিস সংগ্রহে সহায়তা</li>
                      <li>User Post ও তথ্য পর্যবেক্ষণ</li>
                      <li>ভুল বা অসম্পূর্ণ তথ্য শনাক্ত ও রিপোর্ট</li>
                      <li>প্রয়োজন অনুযায়ী তথ্য আপডেটে সহায়তা</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <p className="font-bold text-amber-300">যোগ্যতা ও শর্ত:</p>
                    <ul className="space-y-1 text-slate-300 pl-4 list-disc marker:text-amber-400">
                      <li>নিজের এলাকার বিষয়ে ভালো ধারণা</li>
                      <li>নিয়মিত সময় দিতে পারা</li>
                      <li>সঠিক তথ্য দেওয়ার বিষয়ে সচেতনতা</li>
                      <li>দায়িত্বশীলভাবে কাজ করার মানসিকতা</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenModal('moderator')}
                    className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95"
                  >
                    <span>Become a Moderator →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Motto */}
          <div className="text-center pt-1">
            <p className="text-xs font-serif text-emerald-300 italic">
              “আপনার এলাকার তথ্য, আপনার সহযোগিতায় আরও সহজে পৌঁছে যাবে সবার কাছে।”
            </p>
          </div>
        </div>
      </div>

      <JoinRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultRole={defaultRole}
        districts={districts}
        currentUserName={currentUserName}
        currentUserEmail={currentUserEmail}
        currentUserPhone={currentUserPhone}
        onSubmitApplication={onSubmitApplication}
      />
    </section>
  );
};
