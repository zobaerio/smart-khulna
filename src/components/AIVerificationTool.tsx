import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Search,
  RefreshCw,
  FileCheck,
  Building2,
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { Service, Category, District } from '../dbData';

interface AIVerificationToolProps {
  services: Service[];
  districts: District[];
  categories: Category[];
  onClose?: () => void;
  onApplyServiceFormat?: (formattedData: {
    name: string;
    phone: string;
    address: string;
    description: string;
    category_id: string;
    district_id: string;
  }) => void;
}

export const AIVerificationTool: React.FC<AIVerificationToolProps> = ({
  services,
  districts,
  categories,
  onClose,
  onApplyServiceFormat
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'organize' | 'duplicate' | 'verify' | 'report'>('organize');

  // Tab 1: Organize & Clean Data
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizedResult, setOrganizedResult] = useState<{
    name: string;
    phone: string;
    address: string;
    district: string;
    category: string;
    description: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Tab 2: Duplicate Check
  const [checkName, setCheckName] = useState('');
  const [checkPhone, setCheckPhone] = useState('');
  const [duplicateMatches, setDuplicateMatches] = useState<Service[]>([]);
  const [hasCheckedDuplicate, setHasCheckedDuplicate] = useState(false);

  // Tab 3: Verification Checklist
  const [verifyPhone, setVerifyPhone] = useState('');
  const [checklist, setChecklist] = useState({
    phoneValid: false,
    districtSelected: false,
    addressDetail: false,
    physicalVerification: false
  });

  // Tab 4: Report Summary
  const [rawComplaint, setRawComplaint] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');

  // Process Organize Data (Local deterministic NLP parsing)
  const handleOrganizeData = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const text = rawText;
      
      // Extract Phone: Bangladeshi format 01[3-9]\d{8} or +8801...
      const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/);
      const extractedPhone = phoneMatch ? phoneMatch[0].replace('+88', '') : '';

      // Match District
      let matchedDist = 'khulna';
      for (const d of districts) {
        if (text.toLowerCase().includes(d.name.toLowerCase()) || text.toLowerCase().includes(d.id.toLowerCase())) {
          matchedDist = d.id;
          break;
        }
      }

      // Match Category
      let matchedCat = 'others';
      for (const c of categories) {
        if (text.toLowerCase().includes(c.name.toLowerCase()) || text.toLowerCase().includes(c.id.toLowerCase())) {
          matchedCat = c.id;
          break;
        }
      }

      // First line or key sentence as Name
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const nameCandidate = lines[0] || 'নতুন সেবা প্রতিষ্ঠান';

      // Build cleaned description
      const cleanedDesc = lines.slice(1).join(' ').trim() || text;

      setOrganizedResult({
        name: nameCandidate,
        phone: extractedPhone || 'তথ্য নেই',
        address: lines[1] || `${matchedDist} জেলা সদর`,
        district: matchedDist,
        category: matchedCat,
        description: cleanedDesc
      });
      setIsProcessing(false);
    }, 400);
  };

  // Run Duplicate Check
  const handleRunDuplicateCheck = () => {
    setHasCheckedDuplicate(true);
    const targetName = checkName.trim().toLowerCase();
    const targetPhone = checkPhone.replace(/[^0-9]/g, '');

    const matches = (Array.isArray(services) ? services : []).filter(s => {
      if (!s) return false;
      const sName = (s.name || '').toLowerCase();
      const sPhone = (s.phone || '').replace(/[^0-9]/g, '');
      
      const isNameMatch = targetName.length > 2 && (sName.includes(targetName) || targetName.includes(sName));
      const isPhoneMatch = targetPhone.length >= 8 && sPhone.includes(targetPhone);

      return isNameMatch || isPhoneMatch;
    });

    setDuplicateMatches(matches);
  };

  // Run Report Summary
  const handleGenerateReportSummary = () => {
    if (!rawComplaint.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const trimmed = rawComplaint.trim();
      const summary = `[মডারেশন সারসংক্ষেপ]\nঅভিযোগের ধরন: ব্যবহারকারী রিপোর্ট\nমূল কারণ: ${trimmed}\nসুপারিশ: নীতিমালা অনুযায়ী পোস্ট বা তথ্যের সত্যতা যাচাই করে দ্রুত ব্যবস্থা গ্রহণ করা আবশ্যক।\nতারিখ: ${new Date().toLocaleDateString('bn-BD')}`;
      setGeneratedSummary(summary);
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Header Banner with Warning from Policy Section 4 */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-xl">
              <Bot size={22} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white flex items-center gap-2">
                অনুমোদিত AI ভেরিফিকেশন ও ডেটা সহকারী
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  Policy Sec 4
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-serif">
                Sub Admin ও Moderator-দের তথ্য সংগঠিতকরণ, ডুপ্লিকেট শনাক্তকরণ ও প্রাথমিক যাচাইয়ের অনুমোদিত টুল।
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              বন্ধ করুন ✕
            </button>
          )}
        </div>

        {/* Section 4 Strict Warning Clause */}
        <div className="mt-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-200 text-xs leading-relaxed">
          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <span>
            <strong>নীতিমালা সতর্কবার্তা:</strong> AI কোনো তথ্য তৈরি বা অনুমান করে অ্যাপে প্রকাশ করতে পারবে না। প্রয়োজনীয় তথ্য <strong>বাস্তব ও যাচাইযোগ্য উৎসের ভিত্তিতে</strong> সংগ্রহ করতে হবে।
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('organize')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'organize'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles size={14} /> তথ্য সংগঠিত করা
        </button>

        <button
          onClick={() => setActiveSubTab('duplicate')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'duplicate'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Search size={14} /> ডুপ্লিকেট তথ্য শনাক্ত
        </button>

        <button
          onClick={() => setActiveSubTab('verify')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'verify'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <ClipboardList size={14} /> প্রাথমিক যাচাই চেকলিস্ট
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'report'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert size={14} /> রিপোর্ট সারসংক্ষেপ
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* SUBTAB 1: ORGANIZE DATA */}
        {activeSubTab === 'organize' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-serif">
                অগোছালো বা সংগৃহীত টেক্সট পেস্ট করুন (Raw Collected Info):
              </label>
              <textarea
                rows={4}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="যেমন: খুলনা জেনারেল হাসপাতাল, ফোন ০১৭১১-০০০০০০, স্যার ইকবাল রোড, জরুরি বিভাগে ২৪ ঘন্টা সেবা পাওয়া যায়..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleOrganizeData}
              disabled={isProcessing || !rawText.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
              <span>AI ফরম্যাটিং ও সংগঠিত করুন</span>
            </button>

            {organizedResult && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> সংগঠিত সার্ভিসের তথ্য
                  </h4>
                  {onApplyServiceFormat && (
                    <button
                      onClick={() =>
                        onApplyServiceFormat({
                          name: organizedResult.name,
                          phone: organizedResult.phone,
                          address: organizedResult.address,
                          description: organizedResult.description,
                          category_id: organizedResult.category,
                          district_id: organizedResult.district
                        })
                      }
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition"
                    >
                      সার্ভিস ফর্মে প্রয়োগ করুন
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">নাম:</span>
                    <strong className="text-slate-900 dark:text-white">{organizedResult.name}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">মোবাইল / হেল্পলাইন:</span>
                    <strong className="text-slate-900 dark:text-white">{organizedResult.phone}</strong>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">ঠিকানা:</span>
                    <span className="text-slate-800 dark:text-slate-200">{organizedResult.address}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">জেলা ও ক্যাটাগরি:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {organizedResult.district} | {organizedResult.category}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 block mb-0.5">বিবরণ (Clean Description):</span>
                  <p className="text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                    {organizedResult.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: DUPLICATE CHECK */}
        {activeSubTab === 'duplicate' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 font-serif">
              নতুন সেবা যুক্ত করার পূর্বে ডিরেক্টরিতে ইতোমধ্যে একই প্রতিষ্ঠান বা ফোন নম্বর আছে কি না তা শনাক্ত করুন।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  প্রতিষ্ঠানের নাম:
                </label>
                <input
                  type="text"
                  value={checkName}
                  onChange={e => setCheckName(e.target.value)}
                  placeholder="যেমন: সিটি ডায়াগনস্টিক সেন্টার"
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ফোন বা মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  value={checkPhone}
                  onChange={e => setCheckPhone(e.target.value)}
                  placeholder="যেমন: 01711223344"
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleRunDuplicateCheck}
              disabled={!checkName.trim() && !checkPhone.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <Search size={14} />
              <span>ডুপ্লিকেট ম্যাচ খুঁজুন</span>
            </button>

            {hasCheckedDuplicate && (
              <div className="space-y-2 pt-2">
                {duplicateMatches.length === 0 ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-serif flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>কোনো ডুপ্লিকেট পাওয়া যায়নি! এই সেবাটি নিরাপদে যুক্ত করা যাবে।</span>
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-amber-600" />
                      {duplicateMatches.length}টি সম্ভাব্য ডুপ্লিকেট প্রতিষ্ঠান শনাক্ত হয়েছে:
                    </span>
                    <div className="space-y-2">
                      {duplicateMatches.map(m => (
                        <div key={m.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                          <strong className="text-slate-900 dark:text-white block">{m.name}</strong>
                          <span className="text-slate-500 font-mono text-[11px]">ফোন: {m.phone || 'নেই'} | ঠিকানা: {m.address}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: VERIFICATION CHECKLIST */}
        {activeSubTab === 'verify' && (
          <div className="space-y-3.5 text-xs font-serif">
            <p className="text-slate-600 dark:text-slate-400">
              নীতিমালার ধারা ৮ অনুযায়ী তথ্যের নির্ভুলতা নিশ্চিত করতে নিচের ফিল্ড যাচাই সম্পন্ন করুন:
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'phoneValid', label: 'ফোন বা হেল্পলাইন নম্বর সক্রিয় এবং সঠিক (১১ ডিজিট বাংলাদেশী নম্বর)' },
                { id: 'districtSelected', label: 'সঠিক জেলা ও উপজেলা চিহ্নিত করা হয়েছে' },
                { id: 'addressDetail', label: 'বাস্তব ভৌগোলিক ঠিকানা ও ল্যান্ডমার্ক স্পষ্ট রয়েছে' },
                { id: 'physicalVerification', label: 'তথ্যটি বাস্তব ও নির্ভরযোগ্য উৎস থেকে সংগৃহীত ও নিশ্চিত' }
              ].map(item => {
                const key = item.id as keyof typeof checklist;
                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[key]}
                      onChange={e => setChecklist(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item.label}</span>
                  </label>
                );
              })}
            </div>

            {Object.values(checklist).every(Boolean) ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> সকল যাচাই সম্পন্ন হয়েছে! সেবাটি পাবলিশের জন্য উপযুক্ত।
              </div>
            ) : (
              <p className="text-[11px] text-amber-600 font-semibold">
                ⚠️ পাবলিশের পূর্বে সকল যাচাই টিকচিহ্ন নিশ্চিত করুন।
              </p>
            )}
          </div>
        )}

        {/* SUBTAB 4: REPORT SUMMARY */}
        {activeSubTab === 'report' && (
          <div className="space-y-3 text-xs font-serif">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">
              রিপোর্ট বা অভিযোগের বিস্তারিত লিখুন:
            </label>
            <textarea
              rows={3}
              value={rawComplaint}
              onChange={e => setRawComplaint(e.target.value)}
              placeholder="ব্যবহারকারীর অভিযোগের বিবরণ লিখুন..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs"
            />
            <button
              onClick={handleGenerateReportSummary}
              disabled={!rawComplaint.trim() || isProcessing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition"
            >
              <FileCheck size={14} />
              <span>মডারেশন সারসংক্ষেপ তৈরি করুন</span>
            </button>

            {generatedSummary && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap font-mono text-[11px] text-slate-800 dark:text-slate-200">
                {generatedSummary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVerificationTool;
