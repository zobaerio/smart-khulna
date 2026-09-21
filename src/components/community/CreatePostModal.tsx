import React, { useState, useEffect } from 'react';
import {
  X,
  Image as ImageIcon,
  MapPin,
  Tag,
  HelpCircle,
  Info,
  ThumbsUp,
  Globe,
  UploadCloud,
  Trash2,
  FileEdit,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { CommunityPost, PostImage, PostType } from '../../types/community';
import { District, Category } from '../../dbData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  districts: District[];
  categories: Category[];
  selectedDistrict: string;
  currentUserName: string;
  currentUserEmail: string;
  currentUserId: string;
  initialPostToEdit?: CommunityPost | null;
  onSubmitPost: (postData: Partial<CommunityPost>, isDraft: boolean) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  districts,
  categories,
  selectedDistrict,
  initialPostToEdit,
  onSubmitPost
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('general');
  const [districtId, setDistrictId] = useState(selectedDistrict || 'khulna');
  const [upazilaId, setUpazilaId] = useState('');
  const [categoryId, setCategoryId] = useState('tourist_spots');
  const [locationName, setLocationName] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');
  const [images, setImages] = useState<PostImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialPostToEdit) {
      setTitle(initialPostToEdit.title || '');
      setContent(initialPostToEdit.content || '');
      setPostType(initialPostToEdit.type || 'general');
      setDistrictId(initialPostToEdit.districtId || selectedDistrict);
      setUpazilaId(initialPostToEdit.upazilaId || '');
      setCategoryId(initialPostToEdit.categoryId || 'tourist_spots');
      setLocationName(initialPostToEdit.locationName || '');
      setHashtagsStr((initialPostToEdit.hashtags || []).join(' '));
      setImages(initialPostToEdit.images || []);
    } else {
      setTitle('');
      setContent('');
      setPostType('general');
      setDistrictId(selectedDistrict || 'khulna');
      setUpazilaId('');
      setCategoryId('tourist_spots');
      setLocationName('');
      setHashtagsStr('');
      setImages([]);
      setErrorMessage('');
    }
  }, [initialPostToEdit, selectedDistrict, isOpen]);

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages(prev => [
      ...prev,
      {
        id: 'img_' + Date.now() + Math.random().toString(36).slice(2, 6),
        url: newImageUrl.trim(),
        caption: title || 'ছবি'
      }
    ]);
    setNewImageUrl('');
    setShowImageInput(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert file to object URL or base64 reader
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [
            ...prev,
            {
              id: 'file_' + Date.now() + '_' + index,
              url: reader.result as string,
              caption: file.name
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!content.trim() && !title.trim()) {
      setErrorMessage('পোস্টের বিষয়বস্তু বা বিবরণ লিখুন।');
      return;
    }

    const tags = hashtagsStr
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const postPayload: Partial<CommunityPost> = {
      title: title.trim(),
      content: content.trim(),
      type: postType,
      districtId,
      upazilaId: upazilaId.trim(),
      categoryId,
      locationName: locationName.trim(),
      hashtags: tags,
      images,
      status: isDraft ? 'draft' : 'published',
      updatedAt: new Date().toISOString()
    };

    onSubmitPost(postPayload, isDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <FileEdit size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                {initialPostToEdit ? 'পোস্ট সম্পাদনা করুন' : 'নতুন পোস্ট তৈরি করুন'}
              </h3>
              <p className="text-[11px] text-slate-500">খুলনা বিভাগের নাগরিকদের সাথে তথ্য শেয়ার করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* POST TYPE PILLS */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">পোস্টের ধরন</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'general', label: 'সাধারণ', icon: Globe },
                { id: 'local_info', label: 'স্থানীয় তথ্য', icon: Info },
                { id: 'question', label: 'প্রশ্ন ও জিজ্ঞাসা', icon: HelpCircle },
                { id: 'service_recommendation', label: 'সেবা পর্যালোচনা', icon: ThumbsUp },
                { id: 'location_based', label: 'স্থান কেন্দ্রিক', icon: MapPin }
              ].map(type => {
                const Icon = type.icon;
                const active = postType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPostType(type.id as PostType)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TITLE INPUT */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">শিরোনাম (ঐচ্ছিক)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="যেমন: রূপসা ঘাট ট্রাফিক আপডেট বা সেরা মিষ্টির দোকান..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* CONTENT TEXTAREA */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="আপনার অভিজ্ঞতা, তথ্য, জিজ্ঞাসা অথবা প্রয়োজনীয় নাগরিক আপডেট এখানে বিস্তারিত লিখুন..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none leading-relaxed resize-none"
              required
            />
          </div>

          {/* DISTRICT & UPAZILA SELECT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">জেলা</label>
              <select
                value={districtId}
                onChange={e => setDistrictId(e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none cursor-pointer"
              >
                {districts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">উপজেলা / এলাকা (ঐচ্ছিক)</label>
              <input
                type="text"
                value={upazilaId}
                onChange={e => setUpazilaId(e.target.value)}
                placeholder="যেমন: ডুমুরিয়া, ফুলতলা, সদর..."
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* CATEGORY & LOCATION NAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">ক্যাটাগরি</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">স্থানের নাম / ল্যান্ডমার্ক</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="যেমন: ডাকবাংলো মোড়, শিববাড়ি চত্বর..."
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* HASHTAGS */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">হ্যাশট্যাগ (স্পেস দিয়ে লিখুন)</label>
            <input
              type="text"
              value={hashtagsStr}
              onChange={e => setHashtagsStr(e.target.value)}
              placeholder="#SmartKhulna #KhulnaTraffic #HospitalHelp"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none font-mono text-emerald-800"
            />
          </div>

          {/* IMAGES UPLOAD / URL ATTACHMENTS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-emerald-700" /> ছবি সংযুক্ত করুন ({images.length})
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <UploadCloud size={12} /> ডিভাইস থেকে আপলোড
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-[11px] text-slate-600 hover:text-slate-900 font-medium bg-slate-100 px-2 py-1 rounded-lg"
                >
                  লিংক যোগ করুন
                </button>
              </div>
            </div>

            {showImageInput && (
              <div className="flex gap-2 mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="ছবির সরাসরি লিংক (https://...)"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-800"
                >
                  যোগ করুন
                </button>
              </div>
            )}

            {/* PREVIEW ATTACHED IMAGES */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                {images.map(img => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={img.url} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-rose-600/80 hover:bg-rose-700 text-white p-1 rounded-md opacity-90 transition cursor-pointer"
                      title="ছবি মুছুন"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CONTENT SAFETY REMINDER */}
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-700" /> স্মার্ট খুলনা কমিউনিটি নির্দেশিকা:
            </span>
            <p className="text-slate-600 leading-normal">
              আইন-শৃঙ্খলা রক্ষাকারী বাহিনী, সরকারি দপ্তর বা স্বাস্থ্য সেবার ভুয়া পরিচয় দিয়ে কোনো তথ্য পোস্ট করা দণ্ডনীয়। সকল পোস্ট মডারেশন দলের নজরদারিতে থাকে।
            </p>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200/60 rounded-xl font-bold transition cursor-pointer"
          >
            বাতিল
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold transition cursor-pointer"
            >
              Draft হিসেবে রাখুন
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition cursor-pointer shadow-xs"
            >
              পোস্ট করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
