import React, { useState } from 'react';
import { Quote } from 'lucide-react';
import { AdvocacyModal } from './AdvocacyModal';

export const AdvocacySection = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mx-4 my-2">
        <Quote className="text-emerald-500 mb-4" size={32} />
        <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-4 leading-relaxed font-serif">
          "তথ্যপ্রযুক্তির সঠিক ব্যবহারের মাধ্যমে নাগরিক সেবাকে সহজলভ্য করাই আমাদের লক্ষ্য। স্মার্ট খুলনা উদ্যোগটি ডিজিটাল সাতক্ষীরা ও খুলনা বিভাগ গড়ার ক্ষেত্রে একটি সাহসী ও যুগোপযোগী পদক্ষেপ। তরুণ প্রজন্মের এই মেধা ও পরিশ্রমকে আমি সাধুবাদ জানাই।"
        </p>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowModal(true)}>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 hover:bg-emerald-200 transition">SR</div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">ডা. শফিকুর রহমান</h4>
            <p className="text-xs text-slate-500">সাবেক সংসদ সদস্য, সাতক্ষীরা</p>
          </div>
        </div>
      </div>
      {showModal && <AdvocacyModal onClose={() => setShowModal(false)} />}
    </>
  );
};
