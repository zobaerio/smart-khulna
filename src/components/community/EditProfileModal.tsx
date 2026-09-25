import React from 'react';
import { X, Save, Camera, MapPin, Briefcase, Droplets, Facebook, Twitter, Instagram, Linkedin, Globe, Phone, User, Info, Image as ImageIcon, GraduationCap, Building, Heart, Home as HomeIcon, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { District } from '../../dbData';
import { compressImage } from '../../lib/imageCompressor';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  districts: District[];
  
  // Form States
  displayName: string;
  setDisplayName: (val: string) => void;
  photoURL: string;
  setPhotoURL: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  coverPhoto: string;
  setCoverPhoto: (val: string) => void;
  profession: string;
  setProfession: (val: string) => void;
  workplace?: string;
  setWorkplace?: (val: string) => void;
  designation?: string;
  setDesignation?: (val: string) => void;
  school?: string;
  setSchool?: (val: string) => void;
  college?: string;
  setCollege?: (val: string) => void;
  university?: string;
  setUniversity?: (val: string) => void;
  hometown?: string;
  setHometown?: (val: string) => void;
  relationshipStatus?: string;
  setRelationshipStatus?: (val: string) => void;
  bloodGroup: string;
  setBloodGroup: (val: string) => void;
  district: string;
  setDistrict: (val: string) => void;
  upazila: string;
  setUpazila: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  
  // Social Links
  facebook: string;
  setFacebook: (val: string) => void;
  twitter: string;
  setTwitter: (val: string) => void;
  instagram: string;
  setInstagram: (val: string) => void;
  linkedin: string;
  setLinkedin: (val: string) => void;
  website: string;
  setWebsite: (val: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  districts,
  displayName,
  setDisplayName,
  photoURL,
  setPhotoURL,
  phone,
  setPhone,
  bio,
  setBio,
  profession,
  setProfession,
  workplace = '',
  setWorkplace,
  designation = '',
  setDesignation,
  school = '',
  setSchool,
  college = '',
  setCollege,
  university = '',
  setUniversity,
  hometown = '',
  setHometown,
  relationshipStatus = '',
  setRelationshipStatus,
  bloodGroup,
  setBloodGroup,
  district,
  setDistrict,
  upazila,
  setUpazila,
  address,
  setAddress,
  facebook,
  setFacebook,
  twitter,
  setTwitter,
  instagram,
  setInstagram,
  linkedin,
  setLinkedin,
  website,
  setWebsite,
  coverPhoto,
  setCoverPhoto
}) => {
  const [isUploading, setIsUploading] = React.useState(false);

  if (!isOpen) return null;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 400, 400, 0.7);
      setPhotoURL(compressed);
    } catch (err) {
      console.warn('Avatar compression failed, falling back to FileReader:', err);
      const reader = new FileReader();
      reader.onload = (re) => {
        if (typeof re.target?.result === 'string') {
          setPhotoURL(re.target.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 800, 350, 0.65);
      setCoverPhoto(compressed);
    } catch (err) {
      console.warn('Cover compression failed, trying fallback compression:', err);
      try {
        const fallbackCompressed = await compressImage(file, 600, 250, 0.5);
        setCoverPhoto(fallbackCompressed);
      } catch (e2) {
        alert("কভার ফটো কমপ্রেস করতে সমস্যা হয়েছে। ছোট সাইজের ফাইল চেষ্টা করুন।");
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <User className="text-emerald-600" size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">প্রোফাইল সম্পাদনা করুন</h3>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Avatar & Cover Section */}
          <div className="space-y-6">
            {/* Cover Photo */}
            <div className="relative group">
              <div className="h-32 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                {coverPhoto ? (
                  <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <ImageIcon className="text-slate-300" size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="px-3.5 py-2 bg-white/95 hover:bg-white text-emerald-800 rounded-xl cursor-pointer shadow-lg transition transform hover:scale-105 flex items-center gap-2 text-xs font-bold">
                    <Camera size={16} />
                    <span>ফটো আপলোড করুন</span>
                    <input type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" />
                  </label>
                </div>
                <div className="absolute bottom-2 right-2 md:hidden">
                  <label className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl cursor-pointer shadow-lg flex items-center gap-1.5 text-xs font-bold">
                    <Camera size={14} />
                    <span>আপলোড</span>
                    <input type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" />
                  </label>
                </div>
              </div>
              <p className="mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">কভার ফটো পরিবর্তন করুন (ঐচ্ছিক)</p>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3 py-2 -mt-16 relative z-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-50 dark:bg-slate-800 shadow-xl">
                  {photoURL ? (
                    <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={40} className="text-slate-300" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg cursor-pointer transition transform hover:scale-110 border-2 border-white dark:border-slate-900">
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                </label>
              </div>
              <div className="w-full max-w-xs space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">প্রোফাইল ছবির লিংক (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">কভার ফটোর লিংক (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={coverPhoto}
                    onChange={(e) => setCoverPhoto(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 border-b border-emerald-50 dark:border-emerald-900/30 pb-1 flex items-center gap-1.5">
                <Info size={14} /> মৌলিক তথ্য
              </h4>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">পেশা</label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="উদা: ছাত্র, চিকিৎসক, ইঞ্জিনিয়ার"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">কর্মক্ষেত্র / প্রতিষ্ঠান (Workplace)</label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace && setWorkplace(e.target.value)}
                    placeholder="উদা: স্মার্ট খুলনা লি:, গুগল, খুলনা জেলা পরিষদ"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">পদবী (Designation)</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation && setDesignation(e.target.value)}
                  placeholder="উদা: সফটওয়্যার ইঞ্জিনিয়ার, শিক্ষক, অফিসার"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">ফোন নম্বর</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">রক্তের গ্রুপ</label>
                <div className="relative">
                  <Droplets size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Bio */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 border-b border-emerald-50 dark:border-emerald-900/30 pb-1 flex items-center gap-1.5">
                <MapPin size={14} /> ঠিকানা ও ব্যক্তিগত তথ্য
              </h4>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">হোমটাউন / জন্মস্থান</label>
                <div className="relative">
                  <HomeIcon size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={hometown}
                    onChange={(e) => setHometown && setHometown(e.target.value)}
                    placeholder="উদা: খুলনা, যশোর, সাতক্ষীরা"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">বৈবাহিক অবস্থা / সম্পর্ক</label>
                <div className="relative">
                  <Heart size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={relationshipStatus}
                    onChange={(e) => setRelationshipStatus && setRelationshipStatus(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="সিঙ্গেল">সিঙ্গেল (Single)</option>
                    <option value="বিবাহিত">বিবাহিত (Married)</option>
                    <option value="ইন এ রিলেশনশিপ">ইন এ রিলেশনশিপ (In a relationship)</option>
                    <option value="নির্ধারিত নয়">নির্ধারিত নয়</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">জেলা</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">উপজেলা / এলাকা</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-wider">বায়ো (Bio)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Education Section (School, College, University) */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 border-b border-emerald-50 dark:border-emerald-900/30 pb-1 flex items-center gap-1.5">
              <GraduationCap size={15} /> শিক্ষা সংক্রান্ত তথ্য (Education)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* School */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">স্কুল (School)</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool && setSchool(e.target.value)}
                  placeholder="উদা: খুলনা জিলা স্কুল"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {['খুলনা জিলা স্কুল', 'করনেশন গার্লস হাই স্কুল', 'খুলনা মডেল স্কুল অ্যান্ড কলেজ', 'সেন্ট জোসেফস হাই স্কুল'].map(sc => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setSchool && setSchool(sc)}
                      className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-md font-medium hover:bg-emerald-100 cursor-pointer"
                    >
                      + {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">কলেজ (College)</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege && setCollege(e.target.value)}
                  placeholder="উদা: সরকারি বি. এল. কলেজ"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {['সরকারি বি. এল. কলেজ', 'সুন্দরবন আদর্শ কলেজ', 'খুলনা সরকারি সিটি কলেজ', 'মজিদ মেমোরিয়াল সিটি কলেজ'].map(clg => (
                    <button
                      key={clg}
                      type="button"
                      onClick={() => setCollege && setCollege(clg)}
                      className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-md font-medium hover:bg-emerald-100 cursor-pointer"
                    >
                      + {clg}
                    </button>
                  ))}
                </div>
              </div>

              {/* University */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">বিশ্ববিদ্যালয় (University)</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity && setUniversity(e.target.value)}
                  placeholder="উদা: খুলনা বিশ্ববিদ্যালয় (KU)"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {['KUET (কুয়েট)', 'খুলনা বিশ্ববিদ্যালয় (KU)', 'খুলনা কৃষি বিশ্ববিদ্যালয়', 'খুলনা মেডিকেল কলেজ'].map(univ => (
                    <button
                      key={univ}
                      type="button"
                      onClick={() => setUniversity && setUniversity(univ)}
                      className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-md font-medium hover:bg-emerald-100 cursor-pointer"
                    >
                      + {univ}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 border-b border-emerald-50 dark:border-emerald-900/30 pb-1 flex items-center gap-1.5">
              <Globe size={14} /> সোশ্যাল লিংকসমূহ
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase"><Facebook size={12} className="text-blue-600" /> ফেসবুক</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="facebook.com/username"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase"><Twitter size={12} className="text-sky-500" /> টুইটার</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="twitter.com/username"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase"><Instagram size={12} className="text-pink-600" /> ইনস্টাগ্রাম</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="instagram.com/username"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase"><Globe size={12} className="text-emerald-600" /> ওয়েবসাইট</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.example.com"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition text-xs"
          >
            বাতিল
          </button>
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="px-8 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-md flex items-center gap-2 text-xs"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            তথ্য সংরক্ষণ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
