import React, { useState, useMemo, useEffect } from 'react';
import {
  Droplet,
  Heart,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Clock,
  ChevronRight,
  ExternalLink,
  Info,
  X,
  Plus,
  Share2,
  Sparkles,
  Building2
} from 'lucide-react';
import { BloodDonor, BloodBankContact } from '../types/bloodDonation';
import { initialBloodDonors, initialBloodBanks, divisionUpazilasByDistrict } from '../data/bloodDonationData';
import { District, UserProfile } from '../dbData';
import { getSafeAvatarUrl } from '../lib/avatarHelper';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface BloodDonationSectionProps {
  districts: District[];
  selectedDistrict: string;
  currentUser: any | null;
  userProfile: UserProfile | null;
  onUpdateUserProfile?: (updatedData: Partial<UserProfile>) => Promise<void>;
  onViewProfile: (authorId: string, authorName: string, authorEmail: string, authorAvatar?: string) => void;
  onStartMessage: (authorId: string, authorName: string, authorEmail: string, authorAvatar?: string) => void;
  onOpenCreatePost?: (prefill?: { title?: string; content?: string; categoryId?: string; bloodGroup?: string }) => void;
  onRequireAuth: (actionName: string) => boolean;
  lang?: 'bn' | 'en';
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const BloodDonationSection: React.FC<BloodDonationSectionProps> = ({
  districts,
  selectedDistrict,
  currentUser,
  userProfile,
  onUpdateUserProfile,
  onViewProfile,
  onStartMessage,
  onOpenCreatePost,
  onRequireAuth,
  lang = 'bn'
}) => {
  const bt = (key: string) => {
    const dict: Record<'bn' | 'en', Record<string, string>> = {
      bn: {
        availDonors: "শুধু বর্তমানে রক্তদানে প্রস্তুত ডোনার",
        resetFilter: "রিসেট ফিল্টার",
        results: "ফলাফল",
        noDonors: "কোনো রক্তদাতার তথ্য খুঁজে পাওয়া যায়নি",
        person: "জন",
        searchPlaceholder: "রক্তদাতা খুঁজুন (নাম, ঠিকানা)...",
        district: "জেলা",
        upazila: "উপজেলা",
        bloodGroup: "রক্তের গ্রুপ",
        all: "সব",
        register: "রক্তদাতা হিসেবে যুক্ত হোন",
        registered: "আপনার রক্তদাতা অ্যাকাউন্ট",
        registeredAlert: "আপনি ইতিমধ্যে একজন রক্তদাতা হিসেবে নিবন্ধিত!",
        lastDonation: "সর্বশেষ রক্তদান",
        totalDonation: "মোট রক্তদান",
        notes: "বিশেষ দ্রষ্টব্য",
        contact: "যোগাযোগ",
        message: "মেসেজ",
        viewProfile: "প্রোফাইল",
        bloodBanks: "ব্লাড ব্যাংক সমূহ",
        ready: "রক্তদানে প্রস্তুত",
      },
      en: {
        availDonors: "Only currently available donors",
        resetFilter: "Reset Filters",
        results: "Results",
        noDonors: "No blood donor profiles found",
        person: "person(s)",
        searchPlaceholder: "Search donor name, address, phone...",
        district: "District",
        upazila: "Upazila",
        bloodGroup: "Blood Group",
        all: "All",
        register: "Register as Donor",
        registered: "Your Donor Profile",
        registeredAlert: "You are registered as a donor!",
        lastDonation: "Last Donation Date",
        totalDonation: "Total Donations",
        notes: "Additional Notes",
        contact: "Call Now",
        message: "Message",
        viewProfile: "Profile",
        bloodBanks: "Blood Banks",
        ready: "Ready to Donate",
      }
    };
    return dict[lang][key] || key;
  };

  // Donor data state
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBloodBanksModal, setShowBloodBanksModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Filter states
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>(selectedDistrict || 'all');
  const [filterUpazila, setFilterUpazila] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Registration form state
  const [regBloodGroup, setRegBloodGroup] = useState<string>(userProfile?.bloodGroup || 'O+');
  const [regDistrict, setRegDistrict] = useState<string>(userProfile?.district || selectedDistrict || 'khulna');
  const [regUpazila, setRegUpazila] = useState<string>(userProfile?.upazila || '');
  const [regPhone, setRegPhone] = useState<string>(userProfile?.phone || '');
  const [regIsAvailable, setRegIsAvailable] = useState<boolean>(true);
  const [regLastDonationDate, setRegLastDonationDate] = useState<string>('');
  const [regTotalDonations, setRegTotalDonations] = useState<number>(1);
  const [regNotes, setRegNotes] = useState<string>('');

  // Check if current user is already an active registered donor
  const currentDonorRecord = useMemo(() => {
    if (!currentUser?.uid) return null;
    return donors.find(d => d.userId === currentUser.uid) || null;
  }, [donors, currentUser]);

  // Sync state when userProfile or currentDonorRecord changes
  useEffect(() => {
    if (currentDonorRecord) {
      setRegBloodGroup(currentDonorRecord.bloodGroup);
      setRegDistrict(currentDonorRecord.districtId);
      setRegUpazila(currentDonorRecord.upazila || '');
      setRegPhone(currentDonorRecord.phone);
      setRegIsAvailable(currentDonorRecord.isAvailable);
      setRegLastDonationDate(currentDonorRecord.lastDonationDate || '');
      setRegTotalDonations(currentDonorRecord.totalDonationsCount || 1);
      setRegNotes(currentDonorRecord.notes || '');
    } else if (userProfile) {
      if (userProfile.bloodGroup) setRegBloodGroup(userProfile.bloodGroup);
      if (userProfile.district) setRegDistrict(userProfile.district);
      if (userProfile.upazila) setRegUpazila(userProfile.upazila);
      if (userProfile.phone) setRegPhone(userProfile.phone);
    }
  }, [currentDonorRecord, userProfile]);

  // Firestore real-time synchronization for blood donors
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'blood_donors'), (snapshot) => {
        const firestoreDonors: BloodDonor[] = [];
        snapshot.forEach((docSnap) => {
          firestoreDonors.push({ id: docSnap.id, ...docSnap.data() } as BloodDonor);
        });
        setDonors(firestoreDonors);
      }, (error) => {
        console.warn("Firestore blood_donors snapshot fallback:", error);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore blood_donors listener setup error:", e);
    }
  }, []);

  // Update district filter when selectedDistrict prop changes
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== 'all') {
      setFilterDistrict(selectedDistrict);
      setFilterUpazila('all');
    }
  }, [selectedDistrict]);

  // Available upazilas for the selected filter district
  const filterUpazilasList = useMemo(() => {
    if (filterDistrict === 'all') return [];
    return divisionUpazilasByDistrict[filterDistrict] || [];
  }, [filterDistrict]);

  // Available upazilas for registration modal
  const regUpazilasList = useMemo(() => {
    return divisionUpazilasByDistrict[regDistrict] || [];
  }, [regDistrict]);

  // Calculate remaining days for next donation
  const getDonationEligibility = (lastDateStr?: string) => {
    if (!lastDateStr) return { isEligible: true, daysLeft: 0, text: 'রক্তদানে প্রস্তুত' };
    const lastDate = new Date(lastDateStr);
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const waitingPeriodDays = 90; // 3 months minimum in Bangladesh standard

    if (diffDays >= waitingPeriodDays) {
      return { isEligible: true, daysLeft: 0, text: 'রক্তদানে প্রস্তুত (৩+ মাস অতিক্রান্ত)' };
    } else {
      const daysLeft = waitingPeriodDays - diffDays;
      return {
        isEligible: false,
        daysLeft,
        text: `${daysLeft} দিন পর পরবর্তী রক্তদান করতে পারবেন`
      };
    }
  };

  // Filtered Donors List
  const filteredDonors = useMemo(() => {
    return donors.filter(d => {
      // Blood group filter
      if (selectedBloodGroup !== 'all' && d.bloodGroup !== selectedBloodGroup) {
        return false;
      }
      // District filter
      if (filterDistrict !== 'all' && d.districtId !== filterDistrict) {
        return false;
      }
      // Upazila filter
      if (filterUpazila !== 'all' && d.upazila !== filterUpazila) {
        return false;
      }
      // Availability filter
      if (onlyAvailable && !d.isAvailable) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q);
        const matchUpazila = (d.upazila || '').toLowerCase().includes(q);
        const matchAddress = (d.address || '').toLowerCase().includes(q);
        const matchBlood = d.bloodGroup.toLowerCase().includes(q);
        const matchPhone = d.phone.includes(q);
        return matchName || matchUpazila || matchAddress || matchBlood || matchPhone;
      }
      return true;
    });
  }, [donors, selectedBloodGroup, filterDistrict, filterUpazila, onlyAvailable, searchQuery]);

  // Count donors per blood group
  const bloodGroupCounts = useMemo(() => {
    const counts: Record<string, number> = { all: donors.length };
    BLOOD_GROUPS.forEach(bg => { counts[bg] = 0; });
    donors.forEach(d => {
      if (counts[d.bloodGroup] !== undefined) {
        counts[d.bloodGroup]++;
      }
    });
    return counts;
  }, [donors]);

  // Handle register/update donor
  const handleSaveDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRequireAuth('রক্তদাতা হিসেবে নিবন্ধন')) return;
    if (!currentUser?.uid) return;

    if (!regPhone.trim()) {
      alert('অনুগ্রহ করে যোগাযোগ নম্বর প্রদান করুন।');
      return;
    }

    setIsSaving(true);
    try {
      const donorRecord: BloodDonor = {
        id: currentDonorRecord?.id || `donor_${currentUser.uid}`,
        userId: currentUser.uid,
        name: userProfile?.name || currentUser.displayName || 'স্বেচ্ছাসেবী রক্তদাতা',
        avatar: userProfile?.avatar || currentUser.photoURL || '',
        bloodGroup: regBloodGroup,
        phone: regPhone.trim(),
        email: currentUser.email || '',
        districtId: regDistrict,
        upazila: regUpazila || 'সদর',
        address: userProfile?.address || '',
        isAvailable: regIsAvailable,
        lastDonationDate: regLastDonationDate || undefined,
        totalDonationsCount: Number(regTotalDonations) || 1,
        notes: regNotes.trim(),
        verifiedDonor: currentDonorRecord?.verifiedDonor ?? false,
        updatedAt: new Date().toISOString()
      };

      // 1. Optimistic Local state update
      setDonors(prev => {
        const filtered = prev.filter(d => d.userId !== currentUser.uid);
        return [donorRecord, ...filtered];
      });

      // 2. Persist to Firestore blood_donors collection
      await setDoc(doc(db, 'blood_donors', currentUser.uid), donorRecord, { merge: true });

      // 3. Update user profile with bloodGroup and phone if changed
      if (onUpdateUserProfile) {
        await onUpdateUserProfile({
          bloodGroup: regBloodGroup,
          phone: regPhone.trim(),
          district: regDistrict,
          upazila: regUpazila
        });
      }

      setSaveSuccessMsg('আপনার রক্তদাতা প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
      setShowRegisterModal(false);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error("Save donor error:", err);
      alert('সংরক্ষণ করতে সমস্যা হয়েছে: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle opt-out from donor list
  const handleRemoveDonor = async () => {
    if (!currentUser?.uid) return;
    if (!window.confirm('আপনি কি রক্তদাতা তালিকা থেকে আপনার নাম প্রত্যাহার করতে চান?')) return;

    setIsSaving(true);
    try {
      setDonors(prev => prev.filter(d => d.userId !== currentUser.uid));
      await deleteDoc(doc(db, 'blood_donors', currentUser.uid));
      setShowRegisterModal(false);
      setSaveSuccessMsg('রক্তদাতা তালিকা থেকে আপনার নাম সফলভাবে সরানো হয়েছে।');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Error removing donor:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle quick post blood request
  const handleEmergencyBloodPost = () => {
    if (!onRequireAuth('জরুরি রক্তের পোস্ট')) return;
    if (onOpenCreatePost) {
      const districtName = districts.find(d => d.id === (filterDistrict !== 'all' ? filterDistrict : selectedDistrict))?.name || 'খুলনা';
      onOpenCreatePost({
        title: `[জরুরি রক্তের আবেদন] ${selectedBloodGroup !== 'all' ? selectedBloodGroup : ''} রক্ত প্রয়োজন - ${districtName}`,
        content: `হাসপাতাল/স্থান: \nরোগীর সমস্যা: \nরক্তের গ্রুপ: ${selectedBloodGroup !== 'all' ? selectedBloodGroup : ''}\nপ্রয়োজনীয় রক্তের ব্যাগ: \nযোগাযোগের নম্বর: \nতারিখ ও সময়: জরুরি`,
        categoryId: 'emergency',
        bloodGroup: selectedBloodGroup !== 'all' ? selectedBloodGroup : undefined
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* SUCCESS NOTIFICATION TOAST */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={16} className="text-emerald-700" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg('')} className="p-1 hover:bg-emerald-100 rounded-full">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. HERO BANNER - BLOOD DONATION HUB */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-700 via-red-700 to-rose-900 text-white rounded-3xl p-4 sm:p-6 shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-bold text-rose-100 border border-white/20">
              <Droplet size={13} className="text-white fill-white animate-bounce" />
              <span>স্মার্ট খুলনা লাইফলাইন • স্বেচ্ছায় রক্তদান</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black font-serif tracking-tight">
              খুলনা বিভাগীয় রক্তদান ও ডোনার ডিরেক্টরি
            </h2>
            <p className="text-xs text-rose-100 leading-relaxed font-serif">
              ১০ জেলার রক্তদাতাদের সরাসরি তালিকা। জরুরি প্রয়োজনে রক্তদাতা খুঁজুন অথবা নিজে তালিকাভুক্ত হয়ে একটি অমূল্য জীবন বাঁচাতে এগিয়ে আসুন।
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                if (!onRequireAuth('রক্তদাতা হিসেবে তালিকাভুক্ত হওয়া')) return;
                setShowRegisterModal(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-800 font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {currentDonorRecord ? (
                <>
                  <UserCheck size={15} className="text-rose-700" />
                  <span>ডোনার প্রোফাইল এডিট</span>
                </>
              ) : (
                <>
                  <UserPlus size={15} className="text-rose-700" />
                  <span>রক্তদাতা হতে চাই</span>
                </>
              )}
            </button>

            <button
              onClick={handleEmergencyBloodPost}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-rose-950/40 hover:bg-rose-950/60 text-white border border-white/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertCircle size={14} className="text-rose-200" />
              <span>জরুরি রক্তের পোস্ট</span>
            </button>
          </div>
        </div>

        {/* Decorative Blood Drop Background Elements */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-2 text-rose-500/20 text-8xl font-black select-none pointer-events-none">
          +
        </div>
      </div>

      {/* 2. REGIONAL BLOOD BANK & EMERGENCY HOTLINES TOGGLE */}
      <div className="bg-white border border-rose-100 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
            <Building2 size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">সরকারি ও প্রাতিষ্ঠানিক ব্লাড ব্যাংক তথ্য</h3>
            <p className="text-[10px] text-slate-500">সন্ধানী, রেড ক্রিসেন্ট ও বিভাগীয় হাসপাতালের হটলাইন</p>
          </div>
        </div>
        <button
          onClick={() => setShowBloodBanksModal(true)}
          className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition flex items-center gap-1 cursor-pointer"
        >
          <span>হটলাইন ও ব্লাড ব্যাংক তালিকা</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* 3. BLOOD TYPE SELECTOR CHIPS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Droplet size={14} className="text-rose-600 fill-rose-500" />
            রক্তের গ্রুপ নির্বাচন করুন
          </span>
          <span className="text-[11px] text-slate-500">
            মোট তালিকাভুক্ত রক্তদাতা: <strong className="text-rose-700">{donors.length} জন</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-rose-200">
          <button
            onClick={() => setSelectedBloodGroup('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedBloodGroup === 'all'
                ? 'bg-rose-700 text-white shadow-sm border border-rose-800'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>সকল গ্রুপ</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              selectedBloodGroup === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {bloodGroupCounts['all'] || 0}
            </span>
          </button>

          {BLOOD_GROUPS.map(bg => {
            const count = bloodGroupCounts[bg] || 0;
            const isSelected = selectedBloodGroup === bg;
            return (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-700 text-white shadow-sm border border-rose-800 scale-105'
                    : 'bg-slate-50 text-slate-800 hover:bg-rose-50 hover:text-rose-700 border border-slate-200'
                }`}
              >
                <Droplet size={12} className={isSelected ? 'text-white fill-white' : 'text-rose-500 fill-rose-500'} />
                <span className="font-mono font-extrabold text-sm">{bg}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. LOCATION & AVAILABILITY FILTERS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* District Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">জেলা ফিল্টার</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterDistrict}
                onChange={e => {
                  setFilterDistrict(e.target.value);
                  setFilterUpazila('all');
                }}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">খুলনা বিভাগের সকল জেলা (১০টি)</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name} জেলা</option>
                ))}
              </select>
            </div>
          </div>

          {/* Upazila Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">উপজেলা / থানা</label>
            <select
              value={filterUpazila}
              onChange={e => setFilterUpazila(e.target.value)}
              disabled={filterDistrict === 'all'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
            >
              <option value="all">{filterDistrict === 'all' ? 'আগে জেলা নির্বাচন করুন' : 'সকল উপজেলা'}</option>
              {filterUpazilasList.map(up => (
                <option key={up} value={up}>{up}</option>
              ))}
            </select>
          </div>

          {/* Search by Name / Location / Phone */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">রক্তদাতা অনুসন্ধান</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="নাম, ফোন বা এলাকা খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
              className="rounded text-rose-700 focus:ring-rose-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {bt('availDonors')}
            </span>
          </label>

          <div className="flex items-center gap-2">
            {(selectedBloodGroup !== 'all' || filterDistrict !== 'all' || filterUpazila !== 'all' || onlyAvailable || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBloodGroup('all');
                  setFilterDistrict('all');
                  setFilterUpazila('all');
                  setOnlyAvailable(false);
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
              >
                {bt('resetFilter')}
              </button>
            )}
            <span className="text-xs font-bold text-slate-500">
              {bt('results')}: <span className="text-rose-700 font-extrabold">{filteredDonors.length}</span> {bt('person')}
            </span>
          </div>
        </div>
      </div>

      {/* 5. DONOR CARDS - DISPLAYED IN 1 OR 2 COLUMNS AS REQUESTED */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 border border-rose-100">
            <Droplet size={28} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">{bt('noDonors')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনার নির্বাচিত রক্ত গ্রুপ বা উপজেলায় কোনো রক্তদাতা পাওয়া যায়নি। ফিল্টার পরিবর্তন করুন অথবা নিজেই রক্তদাতা হিসেবে যুক্ত হোন।
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setSelectedBloodGroup('all');
                setFilterDistrict('all');
                setFilterUpazila('all');
                setOnlyAvailable(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              সকল ডোনার দেখুন
            </button>
            <button
              onClick={() => {
                if (!onRequireAuth('রক্তদাতা হিসেবে তালিকাভুক্ত হওয়া')) return;
                setShowRegisterModal(true);
              }}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl transition"
            >
              নিজে রক্তদাতা হিসেবে যুক্ত হন
            </button>
          </div>
        </div>
      ) : (
        /* Explicitly rendered in 1 or 2 columns */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredDonors.map(donor => {
            const districtObj = districts.find(d => d.id === donor.districtId);
            const eligibility = getDonationEligibility(donor.lastDonationDate);
            const isMe = currentUser?.uid === donor.userId;

            return (
              <div
                key={donor.id}
                className="bg-white hover:bg-rose-50/20 border border-slate-200 hover:border-rose-300 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top row: Blood group pill + status badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Blood Group Badge */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex flex-col items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition">
                        <Droplet size={14} className="fill-white" />
                        <span className="text-base font-black font-mono leading-none tracking-tight">
                          {donor.bloodGroup}
                        </span>
                      </div>

                      {/* Avatar & Name */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4
                            onClick={() => onViewProfile(donor.userId, donor.name, donor.email || '', donor.avatar)}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-rose-700 font-serif line-clamp-1 cursor-pointer"
                          >
                            {donor.name}
                          </h4>
                          {donor.verifiedDonor && (
                            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                          )}
                          {isMe && (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              আপনি
                            </span>
                          )}
                        </div>

                        {/* Location */}
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span>{districtObj?.name || donor.districtId} জেলা {donor.upazila ? `• ${donor.upazila}` : ''}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0 text-right">
                      {donor.isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          প্রস্তুত আছেন
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={10} />
                          বিরতিতে
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details section: Donations count & Notes */}
                  <div className="bg-slate-50 rounded-xl p-2 text-[11px] space-y-1 mb-3 border border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>মোট রক্তদান:</span>
                      <strong className="text-slate-800 font-bold">{donor.totalDonationsCount || 1} বার</strong>
                    </div>

                    {donor.lastDonationDate && (
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span>সর্বশেষ দান:</span>
                        <span>{donor.lastDonationDate}</span>
                      </div>
                    )}

                    {donor.notes && (
                      <p className="text-[10px] text-slate-600 italic line-clamp-2 pt-0.5 border-t border-slate-200/60 mt-1">
                        "{donor.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action buttons */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  {/* Phone Call */}
                  <a
                    href={`tel:${donor.phone}`}
                    className="flex-1 bg-rose-700 hover:bg-rose-800 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Phone size={13} />
                    <span>কল করুন</span>
                  </a>

                  {/* Direct Message */}
                  <button
                    onClick={() => onStartMessage(donor.userId, donor.name, donor.email || '', donor.avatar)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                    title="মেসেজ পাঠান"
                  >
                    <MessageCircle size={13} />
                    <span className="hidden sm:inline">মেসেজ</span>
                  </button>

                  {/* View Profile */}
                  <button
                    onClick={() => onViewProfile(donor.userId, donor.name, donor.email || '', donor.avatar)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    title="প্রোফাইল দেখুন"
                  >
                    প্রোফাইল
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. REGIONAL BLOOD BANKS MODAL */}
      {showBloodBanksModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-rose-700 to-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                <h3 className="text-sm font-bold font-serif">খুলনা বিভাগের জরুরি ব্লাড ব্যাংক ও হেল্পলাইন</h3>
              </div>
              <button
                onClick={() => setShowBloodBanksModal(false)}
                className="p-1 hover:bg-black/20 rounded-full text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <p className="text-xs text-slate-500 font-serif">
                যেসব প্রতিষ্ঠানে সার্বক্ষণিক ব্লাড ট্রান্সফিউশন ও সংরক্ষিত রক্তের মজুদ থাকে তাদের যোগাযোগের নম্বর নিচে দেওয়া হলো:
              </p>

              <div className="space-y-2.5">
                {initialBloodBanks.map(bb => {
                  const dist = districts.find(d => d.id === bb.districtId);
                  return (
                    <div key={bb.id} className="bg-rose-50/40 border border-rose-100 rounded-2xl p-3 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 font-serif">{bb.name}</h4>
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full shrink-0">
                          {dist?.name || 'খুলনা'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1">
                        <MapPin size={11} className="text-rose-500 shrink-0" />
                        <span>{bb.address}</span>
                      </p>
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[10px] text-slate-500 font-medium">সময়: {bb.operatingHours}</span>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${bb.phone}`}
                            className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition"
                          >
                            <Phone size={11} />
                            <span>কল করুন ({bb.phone})</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowBloodBanksModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. VOLUNTARY DONOR REGISTRATION / EDIT MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-700 to-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Droplet size={18} className="fill-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-serif">
                    {currentDonorRecord ? 'রক্তদাতা প্রোফাইল আপডেট' : 'স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন'}
                  </h3>
                  <p className="text-[11px] text-rose-100">
                    আপনার তথ্য খুলনা বিভাগের মুমূর্ষু রোগীদের প্রয়োজনে প্রকাশিত থাকবে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 hover:bg-black/20 rounded-full text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDonor} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Blood Group Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  রক্তের গ্রুপ <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setRegBloodGroup(bg)}
                      className={`py-2 rounded-xl text-xs font-mono font-black transition cursor-pointer border ${
                        regBloodGroup === bg
                          ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                          : 'bg-slate-50 hover:bg-rose-50 text-slate-800 border-slate-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    জেলা <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={regDistrict}
                    onChange={e => {
                      setRegDistrict(e.target.value);
                      setRegUpazila('');
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name} জেলা</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    উপজেলা / থানা <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={regUpazila}
                    onChange={e => setRegUpazila(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">উপজেলা নির্বাচন করুন</option>
                    {regUpazilasList.map(up => (
                      <option key={up} value={up}>{up}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  জরুরি মোবাইল নম্বর <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">রক্তের জরুরি প্রয়োজনে রোগীরা এই নম্বরে কল করতে পারবেন।</p>
              </div>

              {/* Availability Switch */}
              <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">বর্তমানে রক্তদানে প্রস্তুত?</h4>
                  <p className="text-[10px] text-slate-500">অসুস্থতা বা বিরতিতে থাকলে এটি বন্ধ রাখতে পারেন</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regIsAvailable}
                    onChange={e => setRegIsAvailable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Last Donation Date & Total Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    সর্বশেষ রক্তদানের তারিখ (যদি থাকে)
                  </label>
                  <input
                    type="date"
                    value={regLastDonationDate}
                    onChange={e => setRegLastDonationDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    এযাবৎ মোট রক্তদান (সংখ্যা)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={regTotalDonations}
                    onChange={e => setRegTotalDonations(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  বিশেষ তথ্য বা যোগাযোগের সময় (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: সন্ধ্যার পর কল করুন, অথবা খুলনা সদর হাসপাতালের কাছে থাকি..."
                  value={regNotes}
                  onChange={e => setRegNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                {currentDonorRecord && (
                  <button
                    type="button"
                    onClick={handleRemoveDonor}
                    disabled={isSaving}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    তালিকা থেকে সরান
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>সংরক্ষণ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
