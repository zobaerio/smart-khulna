import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle } from 'lucide-react';
import { ReportReason } from '../../types/community';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'comment' | 'user' | 'message';
  targetId: string;
  targetTitle: string;
  onSubmitReport: (
    targetType: 'post' | 'comment' | 'user' | 'message',
    targetId: string,
    reason: ReportReason,
    details: string
  ) => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'স্প্যাম অথবা বিভ্রান্তিকর বিজ্ঞাপন' },
  { value: 'hate_speech', label: 'বিদ্বেষমূলক বা আক্রমণাত্মক বক্তব্য' },
  { value: 'harassment', label: 'হয়রানি বা ব্যক্তিগত আক্রমণ' },
  { value: 'misinformation', label: 'ভুল তথ্য বা গুজব ছড়ানো' },
  { value: 'impersonation', label: 'জরুরি সেবা বা অন্য ব্যক্তির ভুয়া পরিচয়' },
  { value: 'violence', label: 'সহিংসতা বা ক্ষতিকর উসকানি' },
  { value: 'other', label: 'অন্যান্য গুরুতর লঙ্ঘন' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  onSubmitReport
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('spam');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(targetType, targetId, selectedReason, details.trim());
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
    }, 1200);
  };

  const getTypeName = () => {
    switch (targetType) {
      case 'post':
        return 'পোস্ট';
      case 'comment':
        return 'মন্তব্য';
      case 'user':
        return 'ব্যবহারকারী';
      case 'message':
        return 'বার্তা';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <ShieldAlert size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950 font-serif">
                {getTypeName()} রিপোর্ট করুন
              </h3>
              <p className="text-[10px] text-rose-700">কমিউনিটি নিরাপত্তা দল পর্যালোচনা করবে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle size={40} className="text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 font-serif">
              রিপোর্টটি সফলভাবে জমা দেওয়া হয়েছে!
            </h4>
            <p className="text-xs text-slate-600">
              আমাদের অ্যাডমিন দল দ্রুত এটি পর্যালোচনা করে ব্যবস্থা নেবে। সুস্থ কমিউনিটি বজায় রাখতে সহযোগিতার জন্য ধন্যবাদ।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <span className="block font-bold text-slate-700 mb-1">রিপোর্টের বিষয়:</span>
              <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 line-clamp-2">
                {targetTitle || getTypeName()}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                লঙ্ঘনের কারণ নির্বাচন করুন <span className="text-rose-600">*</span>
              </label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map(r => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                      selectedReason === r.value
                        ? 'bg-rose-50/70 border-rose-300 text-rose-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.value}
                      checked={selectedReason === r.value}
                      onChange={() => setSelectedReason(r.value)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                অতিরিক্ত বিস্তারিত তথ্য (ঐচ্ছিক):
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="নির্দিষ্ট কোনো তথ্য থাকলে এখানে উল্লেখ করুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle size={13} /> রিপোর্ট পাঠান
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
