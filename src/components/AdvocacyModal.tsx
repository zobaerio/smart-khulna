import React from 'react';
import { X, BookOpen, Award, Users } from 'lucide-react';

export const AdvocacyModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-800 text-2xl mb-4">SR</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">ডা. শফিকুর রহমান</h2>
          <p className="text-emerald-600 font-medium">সাবেক সংসদ সদস্য, সাতক্ষীরা</p>
        </div>

        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <p>সাতক্ষীরার উন্নয়ন ও জনসেবায় দীর্ঘদিনের অভিজ্ঞতাসম্পন্ন ডা. শফিকুর রহমান সর্বদা আধুনিকায়ন ও প্রযুক্তিবান্ধব উন্নয়নের পক্ষে কাজ করেছেন।</p>
          
          <div className="space-y-2 mt-4">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><BookOpen size={16} /> কর্মজীবন</h3>
            <p>স্থানীয় পর্যায়ে স্বাস্থ্যসেবা নিশ্চিত করা এবং শিক্ষা বিস্তারে তিনি অসংখ্য কার্যক্রম পরিচালনা করেছেন।</p>
            
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-4"><Award size={16} /> ডিজিটাল উন্নয়ন</h3>
            <p>স্মার্ট খুলনা এবং ডিজিটাল সাতক্ষীরা গড়ার স্বপ্নকে তিনি তরুণ প্রজন্মের উদ্ভাবনের মাধ্যমে বাস্তবায়ন করতে উৎসাহিত করেন।</p>
            
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-4"><Users size={16} /> কমিটমেন্ট</h3>
            <p>তিনি বিশ্বাস করেন, তথ্যপ্রযুক্তিই হবে আধুনিক বাংলাদেশের উন্নয়নের প্রধান চালিকাশক্তি।</p>
          </div>
        </div>
      </div>
    </div>
  );
};
