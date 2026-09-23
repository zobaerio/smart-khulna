import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Filter,
  Search,
  MapPin,
  ExternalLink,
  Sparkles,
  Upload,
  ArrowRight,
  SlidersHorizontal,
  X,
  Loader2
} from 'lucide-react';
import { Icon } from './ui/Icon';
import { Banner, District, landmarkImagePresets } from '../dbData';
import { compressImage } from '../lib/imageCompressor';


interface AdminBannersCMSProps {
  banners: Banner[];
  districts: District[];
  onAddBanner: (banner: Partial<Banner>) => Promise<void> | void;
  onUpdateBanner: (banner: Banner) => Promise<void> | void;
  onDeleteBanner: (bannerId: string) => Promise<void> | void;
  onToggleBannerStatus: (bannerId: string, isActive: boolean) => Promise<void> | void;
  onClose?: () => void;
}

export const AdminBannersCMS: React.FC<AdminBannersCMSProps> = ({
  banners,
  districts,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onToggleBannerStatus,
  onClose
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>('all_filter');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDistrictId, setFormDistrictId] = useState('all');
  const [formImage, setFormImage] = useState('');
  const [formActionText, setFormActionText] = useState('সেবা দেখুন');
  const [formActionType, setFormActionType] = useState<'internal' | 'external' | 'category' | 'emergency' | 'download'>('internal');
  const [formActionTarget, setFormActionTarget] = useState('services');
  const [formPriority, setFormPriority] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);

  // Open Create Form
  const handleOpenCreate = (prefillDistrictId?: string) => {
    setEditingBanner(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormDistrictId(prefillDistrictId || (districtFilter !== 'all_filter' ? districtFilter : 'all'));
    setFormImage('');
    setFormActionText('সেবা দেখুন');
    setFormActionType('internal');
    setFormActionTarget('services');
    setFormPriority(1);
    setFormIsActive(true);
    setIsFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormTitle(banner.title);
    setFormSubtitle(banner.subtitle || '');
    setFormDistrictId(banner.districtId || 'all');
    setFormImage(banner.image);
    setFormActionText(banner.actionText || 'সেবা দেখুন');
    setFormActionType(banner.actionType || 'internal');
    setFormActionTarget(banner.actionTarget || 'services');
    setFormPriority(banner.priority || 1);
    setFormIsActive(banner.isActive ?? true);
    setIsFormOpen(true);
  };

  // Handle Image Upload via File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (allow up to 10MB, which gets compressed)
    if (file.size > 10 * 1024 * 1024) {
      alert('ছবির সাইজ ১০ মেগাবাইট এর কম হতে হবে');
      return;
    }

    setIsCompressingImage(true);
    try {
      const compressedDataUrl = await compressImage(file, 1200, 600, 0.85);
      setFormImage(compressedDataUrl);
    } catch (err) {
      console.warn('Image compression fallback to FileReader:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Save Banner (Add or Update)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('ব্যানার শিরোনাম অবশ্যই দিতে হবে');
      return;
    }
    if (!formImage.trim()) {
      alert('ব্যানার ছবি অথবা ছবির লিঙ্ক দিন');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBanner) {
        const updated: Banner = {
          ...editingBanner,
          title: formTitle.trim(),
          subtitle: formSubtitle.trim() || undefined,
          districtId: formDistrictId,
          image: formImage.trim(),
          actionText: formActionText.trim() || undefined,
          actionType: formActionType,
          actionTarget: formActionTarget.trim() || undefined,
          priority: Number(formPriority) || 1,
          isActive: formIsActive,
          updatedAt: new Date().toISOString()
        };
        await onUpdateBanner(updated);
      } else {
        const newBanner: Partial<Banner> = {
          id: `banner_${formDistrictId}_${Date.now()}`,
          title: formTitle.trim(),
          subtitle: formSubtitle.trim() || undefined,
          districtId: formDistrictId,
          image: formImage.trim(),
          actionText: formActionText.trim() || undefined,
          actionType: formActionType,
          actionTarget: formActionTarget.trim() || undefined,
          priority: Number(formPriority) || 1,
          isActive: formIsActive,
          createdAt: new Date().toISOString()
        };
        await onAddBanner(newBanner);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to save banner:', err);
      alert('ব্যানার সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Banners
  const filteredBanners = banners.filter(b => {
    // District Filter
    if (districtFilter !== 'all_filter') {
      if (districtFilter === 'all' && b.districtId !== 'all') return false;
      if (districtFilter !== 'all' && b.districtId !== districtFilter) return false;
    }
    // Status Filter
    if (statusFilter === 'active' && !b.isActive) return false;
    if (statusFilter === 'inactive' && b.isActive) return false;
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = b.title?.toLowerCase().includes(q);
      const subMatch = b.subtitle?.toLowerCase().includes(q);
      const distMatch = (districts.find(d => d.id === b.districtId)?.name || '').toLowerCase().includes(q);
      if (!titleMatch && !subMatch && !distMatch) return false;
    }
    return true;
  });

  const getDistrictName = (distId: string) => {
    if (distId === 'all') return 'সকল জেলা (খুলনা বিভাগ)';
    const d = districts.find(item => item.id === distId);
    return d ? `${d.name} (${d.nameEn})` : distId;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ImageIcon size={18} />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 font-serif">
              জেলা ব্যানার ও ল্যান্ডমার্ক CMS
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            খুলনা বিভাগের ১০টি জেলা এবং হোমপেইজের হিরো ব্যানারগুলো সরাসরি অ্যাডমিন প্যানেল থেকে যুক্ত, সম্পাদনা ও নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenCreate()}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>নতুন ব্যানার যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* District Quick Selection & Status Badges */}
      <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ব্যানার খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">স্ট্যাটাস:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সকল ({banners.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-800 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              সক্রিয় ({banners.filter(b => b.isActive).length})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'inactive'
                  ? 'bg-slate-600 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              নিষ্ক্রিয় ({banners.filter(b => !b.isActive).length})
            </button>
          </div>
        </div>

        {/* District Filter Chips */}
        <div className="pt-2 border-t border-slate-200/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <MapPin size={12} /> জেলা:
            </span>
            <button
              onClick={() => setDistrictFilter('all_filter')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer ${
                districtFilter === 'all_filter'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              সব জেলা
            </button>
            <button
              onClick={() => setDistrictFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer ${
                districtFilter === 'all'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              বিভাগীয় সাধারণ (All)
            </button>
            {districts.map(d => {
              const districtBannersCount = banners.filter(b => b.districtId === d.id).length;
              return (
                <button
                  key={d.id}
                  onClick={() => setDistrictFilter(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer flex items-center gap-1 ${
                    districtFilter === d.id
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{d.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                    districtFilter === d.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {districtBannersCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset Quick Landmarks Generator */}
      <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">দ্রুত জেলা ব্যানার টেমপ্লেট</h4>
            <p className="text-[11px] text-emerald-800/80">যেকোনো জেলার ওপর ক্লিক করে প্রস্তুতকৃত ল্যান্ডমার্ক ছবি দিয়ে নিমিষে ব্যানার তৈরি করুন।</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {landmarkImagePresets.slice(0, 5).map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEditingBanner(null);
                setFormTitle(`স্মার্ট ${getDistrictName(preset.districtId).split(' ')[0]} সেবা ও তথ্য পোর্টাল`);
                setFormSubtitle(`${preset.name} ও সংশ্লিষ্ট সকল জরুরি নাগরিক সেবা`);
                setFormDistrictId(preset.districtId);
                setFormImage(preset.url);
                setFormActionText('সেবা দেখুন');
                setFormActionType('internal');
                setFormActionTarget('services');
                setFormPriority(1);
                setFormIsActive(true);
                setIsFormOpen(true);
              }}
              className="text-[10px] font-bold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
            >
              <span>+ {preset.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Banners Grid */}
      {filteredBanners.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3">
          <Icon icon={ImageIcon} className="mx-auto text-slate-300" size={40} interactive />
          <h4 className="text-sm font-bold text-slate-700">কোনো ব্যানার খুঁজে পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            নির্বাচিত জেলা বা ফিল্টারে কোনো ব্যানার পাওয়া যায়নি। নতুন ব্যানার যোগ করতে উপরের বোতামে চাপুন।
          </p>
          <button
            onClick={() => handleOpenCreate()}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus size={14} />
            <span>নতুন ব্যানার তৈরি করুন</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanners.map(banner => {
            const districtName = getDistrictName(banner.districtId);
            return (
              <div
                key={banner.id}
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between ${
                  banner.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                {/* Banner Image Preview */}
                <div className="relative h-36 bg-slate-800 overflow-hidden group">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-between p-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="bg-emerald-900/90 text-lime-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-lime-400/30 flex items-center gap-1 backdrop-blur-xs">
                        <MapPin size={10} />
                        {districtName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        banner.isActive
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-rose-500/90 text-white'
                      }`}>
                        {banner.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1 drop-shadow-sm font-serif">
                        {banner.title}
                      </h4>
                      {banner.subtitle && (
                        <p className="text-[10px] text-slate-200 line-clamp-1 mt-0.5 drop-shadow-sm">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Banner Details Body */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">অগ্রাধিকার ক্রম (Priority):</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{banner.priority || 1}
                      </span>
                    </div>
                    {banner.actionText && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">অ্যাকশন বোতাম:</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {banner.actionText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleBannerStatus(banner.id, !banner.isActive)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                        banner.isActive
                          ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title={banner.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    >
                      {banner.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                      <span>{banner.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(banner)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${banner.title}" ব্যানারটি মুছে ফেলতে চান?`)) {
                            onDeleteBanner(banner.id);
                          }
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 rounded-lg transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT BANNER MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-serif">
                    {editingBanner ? 'জেলা ব্যানার সম্পাদনা' : 'নতুন জেলা ব্যানার যুক্ত করুন'}
                  </h3>
                  <p className="text-[11px] text-slate-500">ব্যানারের তথ্য ও ছবি প্রদান করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Target District */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin size={13} className="text-emerald-700" />
                  টার্গেট জেলা <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formDistrictId}
                  onChange={(e) => setFormDistrictId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">সকল জেলা (খুলনা বিভাগীয় সাধারণ ব্যানার)</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} জেলা ({d.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  ব্যানার শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: স্মার্ট খুলনা জেলা পোর্টাল — ডিজিটাল সেবা হাব"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  সাবটাইটেল / বর্ণনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রূপসা সেতু ও খুলনা শহরের সকল সরকারি ও জরুরি নাগরিক সেবা"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Image Input & Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <ImageIcon size={13} className="text-emerald-700" />
                    ব্যানার ছবি (URL বা আপলোড) <span className="text-rose-500">*</span>
                  </label>
                  <label className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <Upload size={11} />
                    <span>ডিভাইস থেকে ফাইল আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />

                {/* Quick Presets Picker */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">প্রিসেট ল্যান্ডমার্ক ছবি নির্বাচন করুন:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                    {landmarkImagePresets.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormImage(p.url);
                          if (p.districtId !== 'all') {
                            setFormDistrictId(p.districtId);
                          }
                        }}
                        className={`text-[9px] font-bold p-1 rounded-lg border text-left truncate transition cursor-pointer flex items-center gap-1 ${
                          formImage === p.url
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                        title={p.name}
                      >
                        <img src={p.url} alt={p.name} className="w-4 h-4 rounded object-cover shrink-0" />
                        <span className="truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview Box */}
                {formImage && (
                  <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                    <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent p-2.5 flex flex-col justify-end">
                      <span className="text-[8px] text-lime-300 font-bold uppercase">লাইভ ব্যানার প্রিভিউ</span>
                      <h5 className="text-xs font-bold text-white truncate">{formTitle || 'ব্যানার শিরোনাম'}</h5>
                      <p className="text-[9px] text-emerald-100 truncate">{formSubtitle || 'সাবটাইটেল'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button Details & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">বোতামের লেখা</label>
                  <input
                    type="text"
                    placeholder="যেমন: সেবা দেখুন"
                    value={formActionText}
                    onChange={(e) => setFormActionText(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">অগ্রাধিকার ক্রম (Priority)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formPriority}
                    onChange={(e) => setFormPriority(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">ব্যানার প্রদর্শন করুন</span>
                  <span className="text-[10px] text-slate-500">অন থাকলে ব্যবহারকারীরা অ্যাপে এই ব্যানারটি দেখতে পাবেন</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formIsActive ? 'bg-emerald-700' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formIsActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>সংরক্ষণ হচ্ছে...</span>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      <span>{editingBanner ? 'হালনাগাদ সংরক্ষণ করুন' : 'ব্যানার যোগ করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
