import React, { useState } from 'react';
import { X, CheckCircle, Award } from 'lucide-react';
import { District } from '../dbData';

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'sub_admin' | 'moderator';
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

export const JoinRequestModal: React.FC<JoinRequestModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'sub_admin',
  districts,
  currentUserName = '',
  currentUserEmail = '',
  currentUserPhone = '',
  onSubmitApplication
}) => {
  const [role, setRole] = useState<'sub_admin' | 'moderator'>(defaultRole);
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !district || !reason.trim()) {
      alert('দয়া করে নাম, মোবাইল নম্বর, জেলা এবং কারণ ক্ষেত্রগুলো পূরণ করুন।');
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
        role,
        reason: reason.trim(),
        experience: experience.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccessSubmitted(true);
    } catch (err: any) {
      alert('আবেদন জমা দিতে সমস্যা হয়েছে: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl text-white ${role === 'sub_admin' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
              <Award size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold font-serif">
                {role === 'sub_admin' ? 'Sub Admin পদের জন্য আবেদন' : 'Moderator পদের জন্য আবেদন'}
              </h3>
              <p className="text-[11px] text-slate-500">Smart Khulna Team Recruitment</p>
            </div>
          </div>
          <button
            onClick={onClose}
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
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">আবেদনের রোল (Role) *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('sub_admin')}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    role === 'sub_admin'
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Sub Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('moderator')}
                  className={`py-2 px-3 rounded-xl font-bold border transition ${
                    role === 'moderator'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Moderator
                </button>
              </div>
            </div>

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
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর (Mobile Number) *</label>
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
                <label className="block font-bold text-slate-700 mb-1">ইমেইল (Email)</label>
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
                <label className="block font-bold text-slate-700 mb-1">উপজেলা (Upazila)</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={e => setUpazila(e.target.value)}
                  placeholder="উদা: সোনাডাঙ্গা, রূপসা..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">এলাকা (Area)</label>
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
              <label className="block font-bold text-slate-700 mb-1">কেন যুক্ত হতে চান? (Reason for Joining) *</label>
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
              <label className="block font-bold text-slate-700 mb-1">পূর্বের অভিজ্ঞতা (Previous Experience)</label>
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
              আবেদন করলেই সরাসরি রোল পাওয়া যাবে না। সুপার এডমিন যাচাই-বাছাই করে অনুমোদন দেবেন। স্ট্যাটাস পেন্ডিং থাকবে।
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
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
  );
};
