import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, UserPlus, X, MapPin, Phone, Mail, FileText, Sparkles, Award } from 'lucide-react';
import { District } from '../dbData';

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
  }) => Promise<void>;
}

export const JoinSmartKhulnaTeamSection: React.FC<JoinSmartKhulnaTeamSectionProps> = ({
  districts,
  currentUserName = '',
  currentUserEmail = '',
  currentUserPhone = '',
  onSubmitApplication
}) => {
  const [selectedRole, setSelectedRole] = useState<'sub_admin' | 'moderator' | null>(null);
  const [fullName, setFullName] = useState(currentUserName);
  const [phone, setPhone] = useState(currentUserPhone);
  const [email, setEmail] = useState(currentUserEmail);
  const [district, setDistrict] = useState('khulna');
  const [upazila, setUpazila] = useState('');
  const [area, setArea] = useState('');
  const [reason, setReason] = useState('');
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const handleOpenModal = (role: 'sub_admin' | 'moderator') => {
    setSelectedRole(role);
    setFullName(currentUserName || '');
    setPhone(currentUserPhone || '');
    setEmail(currentUserEmail || '');
    setSuccessSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !district || !selectedRole) {
      alert('দয়া করে নাম, মোবাইল নম্বর এবং জেলা সঠিকভাব পূরণ করুন।');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitApplication({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        district,
        upazila: upazila.trim(),
        area: area.trim(),
        role: selectedRole,
        reason: reason.trim(),
        experience: experience.trim()
      });
      setSuccessSubmitted(true);
    } catch (err: any) {
      alert('আবেদন জমা দিতে সমস্যা হয়েছে: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-10 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-emerald-500/20 relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles size={13} /> স্মার্ট খুলনা স্বেচ্ছাসেবক ও প্রশাসনিক টিম
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
              আপনিও যুক্ত হোন Smart Khulna-এর সাথে
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
              আপনার এলাকার তথ্য ও সেবাগুলো সবার কাছে পৌঁছে দিতে Smart Khulna-এর সাথে Sub Admin বা Moderator হিসেবে যুক্ত হতে পারেন।
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sub Admin Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30">
                      <Shield size={22} />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">Sub Admin (সাব-এডমিন)</h3>
                      <p className="text-[11px] text-blue-300">স্থানীয় সার্ভিস ও ডেটা ব্যবস্থাপনা</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    ম্যানেজমেন্ট
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-200">
                  <p className="font-bold text-emerald-300">কী কাজ করবেন?</p>
                  <ul className="space-y-1.5 text-slate-300 pl-4 list-disc marker:text-emerald-400">
                    <li>স্থানীয় সার্ভিস ও প্রতিষ্ঠানের তথ্য সংগ্রহ ও আপডেট</li>
                    <li>এলাকার গুরুত্বপূর্ণ তথ্য পরিচালনায় সহায়তা</li>
                    <li>Moderator-দের কাজ সমন্বয় করা</li>
                    <li>প্রয়োজন অনুযায়ী তথ্য যাচাই করা</li>
                  </ul>
                </div>

                <div className="space-y-2 text-xs text-slate-200 pt-2 border-t border-white/10">
                  <p className="font-bold text-amber-300">যোগ্যতা ও শর্ত:</p>
                  <ul className="space-y-1.5 text-slate-300 pl-4 list-disc marker:text-amber-400">
                    <li>নির্দিষ্ট এলাকার তথ্য সম্পর্কে ভালো ধারণা</li>
                    <li>দায়িত্বশীল ও নিয়মিত কাজ করার মানসিকতা</li>
                    <li>সঠিক তথ্য সংগ্রহ ও যাচাই করার দক্ষতা</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal('sub_admin')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <UserPlus size={15} />
                <span>Become a Sub Admin</span>
              </button>
            </div>

            {/* Moderator Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                      <ShieldAlert size={22} />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white font-serif">Moderator (মডারেটর)</h3>
                      <p className="text-[11px] text-indigo-300">কমিউনিটি মনিটরিং ও ভেরিফিকেশন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    মডারেশন
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-200">
                  <p className="font-bold text-emerald-300">কী কাজ করবেন?</p>
                  <ul className="space-y-1.5 text-slate-300 pl-4 list-disc marker:text-emerald-400">
                    <li>স্থানীয় তথ্য ও সার্ভিস সংগ্রহে সহায়তা</li>
                    <li>User-এর Post ও তথ্য পর্যবেক্ষণ</li>
                    <li>ভুল বা অসম্পূর্ণ তথ্য শনাক্ত করে রিপোর্ট করা</li>
                    <li>প্রয়োজন অনুযায়ী তথ্য আপডেটে সহায়তা</li>
                  </ul>
                </div>

                <div className="space-y-2 text-xs text-slate-200 pt-2 border-t border-white/10">
                  <p className="font-bold text-amber-300">যোগ্যতা ও শর্ত:</p>
                  <ul className="space-y-1.5 text-slate-300 pl-4 list-disc marker:text-amber-400">
                    <li>নিজের এলাকার বিষয়ে ভালো ধারণা</li>
                    <li>নিয়মিত সময় দিতে পারা</li>
                    <li>দায়িত্বশীলভাবে কনটেন্ট মনিটর করা</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleOpenModal('moderator')}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <UserPlus size={15} />
                <span>Become a Moderator</span>
              </button>
            </div>
          </div>

          {/* Bottom Motto */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm font-serif text-emerald-300 italic">
              “আপনার এলাকার তথ্য, আপনার সহযোগিতায় আরও সহজে পৌঁছে যাবে সবার কাছে।”
            </p>
          </div>
        </div>
      </div>

      {/* APPLICATION MODAL */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-xl text-white ${selectedRole === 'sub_admin' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  <Award size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold font-serif">
                    {selectedRole === 'sub_admin' ? 'Sub Admin পদের জন্য আবেদন' : 'Moderator পদের জন্য আবেদন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Smart Khulna Team Recruitment</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {successSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle size={48} className="mx-auto text-emerald-600 animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900 font-serif">আবেদন সফলভাবে জমা হয়েছে!</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  “আপনার আবেদনটি গ্রহণ করা হয়েছে। যাচাই শেষে Smart Khulna Team থেকে আপনার সাথে যোগাযোগ করা হবে।”
                </p>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম (Full Name) *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর (Phone) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">জেলা (District) *</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    >
                      {districts.map(d => (
                        <option key={d.id} value={d.id}>{d.name} জেলা</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">উপজেলা / থানা (Upazila)</label>
                    <input
                      type="text"
                      value={upazila}
                      onChange={e => setUpazila(e.target.value)}
                      placeholder="উদা: সোনাডাঙ্গা, রূপসা..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">নির্দিষ্ট এলাকা / ইউনিয়ন (Area)</label>
                    <input
                      type="text"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      placeholder="উদা: বয়রা, জিরো পয়েন্ট..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কেন আপনি এই দায়িত্বে যুক্ত হতে চান? *</label>
                  <textarea
                    required
                    rows={2}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="আপনার উদ্দেশ্য ও আগ্রহ সংক্ষেপে লিখুন..."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">পূর্বের অভিজ্ঞতা বা দক্ষতা (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="উদা: স্বেচ্ছাসেবক কাজ, ডেটা এন্ট্রি ইত্যাদি..."
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                  <p className="font-bold">সতর্কবার্তা:</p>
                  আবেদন করলেই সরাসরি রোল পাওয়া যাবে না। সুপার এডমিন যাচাই-বাছাই করে অনুমোদন দেবেন।
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
