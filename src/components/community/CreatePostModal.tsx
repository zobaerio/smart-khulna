import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ShieldCheck,
  Loader2,
  Hash,
  AtSign,
  Flame,
  Check,
  Sparkles
} from 'lucide-react';
import { CommunityPost, PostImage, PostType, PublicUserProfile } from '../../types/community';
import { District, Category } from '../../dbData';
import { compressImage } from '../../lib/imageCompressor';
import {
  calculateHashtagsWithCounts,
  searchHashtags,
  searchUsersForMention,
  getTriggerWordAtCursor,
  insertTriggerReplacement,
  HashtagInfo,
  toBengaliNumber
} from '../../utils/hashtagUtils';
import { HashtagMentionSuggestionBox } from './HashtagMentionSuggestionBox';

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
  communityPosts?: CommunityPost[];
  allUsers?: PublicUserProfile[];
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  districts,
  categories,
  selectedDistrict,
  initialPostToEdit,
  onSubmitPost,
  communityPosts = [],
  allUsers = []
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
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // References to input elements for cursor restoration
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const hashtagsInputRef = useRef<HTMLInputElement>(null);

  // Real-time calculated hashtags with post counts from live community posts
  const allHashtags = useMemo(() => {
    return calculateHashtagsWithCounts(communityPosts);
  }, [communityPosts]);

  // Suggestions state
  const [suggestionState, setSuggestionState] = useState<{
    isOpen: boolean;
    type: 'hashtag' | 'mention';
    query: string;
    startIndex: number;
    endIndex: number;
    selectedIndex: number;
    targetField: 'content' | 'hashtags';
  }>({
    isOpen: false,
    type: 'hashtag',
    query: '',
    startIndex: -1,
    endIndex: -1,
    selectedIndex: 0,
    targetField: 'content'
  });

  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);

  // Filtered suggestions
  const filteredHashtags = useMemo(() => {
    if (!suggestionState.isOpen || suggestionState.type !== 'hashtag') return [];
    return searchHashtags(suggestionState.query, allHashtags, 12);
  }, [suggestionState.isOpen, suggestionState.type, suggestionState.query, allHashtags]);

  const filteredUsers = useMemo(() => {
    if (!suggestionState.isOpen || suggestionState.type !== 'mention') return [];
    return searchUsersForMention(suggestionState.query, allUsers, 8);
  }, [suggestionState.isOpen, suggestionState.type, suggestionState.query, allUsers]);

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
      setMentionedUserIds(initialPostToEdit.mentions || []);
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
      setMentionedUserIds([]);
      setErrorMessage('');
    }
    setSuggestionState(prev => ({ ...prev, isOpen: false }));
  }, [initialPostToEdit, selectedDistrict, isOpen]);

  if (!isOpen) return null;

  // Real-time suggestion trigger logic
  const checkAndTriggerSuggestions = (text: string, cursorPos: number, field: 'content' | 'hashtags') => {
    const triggerInfo = getTriggerWordAtCursor(text, cursorPos);
    if (triggerInfo.trigger === '#') {
      setSuggestionState({
        isOpen: true,
        type: 'hashtag',
        query: triggerInfo.query,
        startIndex: triggerInfo.startIndex,
        endIndex: triggerInfo.endIndex,
        selectedIndex: 0,
        targetField: field
      });
    } else if (triggerInfo.trigger === '@' && field === 'content') {
      setSuggestionState({
        isOpen: true,
        type: 'mention',
        query: triggerInfo.query,
        startIndex: triggerInfo.startIndex,
        endIndex: triggerInfo.endIndex,
        selectedIndex: 0,
        targetField: field
      });
    } else {
      setSuggestionState(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    const cursorPos = e.target.selectionStart;
    checkAndTriggerSuggestions(val, cursorPos, 'content');
  };

  const handleHashtagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHashtagsStr(val);
    const cursorPos = e.target.selectionStart || val.length;
    // In hashtags field, even if they don't type '#' explicitly, trigger suggestions
    const textBeforeCursor = val.slice(0, cursorPos);
    const lastSpace = Math.max(textBeforeCursor.lastIndexOf(' '), textBeforeCursor.lastIndexOf('\t'));
    const currentWord = textBeforeCursor.slice(lastSpace + 1);
    
    if (currentWord.length > 0) {
      setSuggestionState({
        isOpen: true,
        type: 'hashtag',
        query: currentWord.replace(/^#+/, ''),
        startIndex: lastSpace + 1,
        endIndex: cursorPos,
        selectedIndex: 0,
        targetField: 'hashtags'
      });
    } else {
      setSuggestionState(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!suggestionState.isOpen) return;

    const count =
      suggestionState.type === 'hashtag'
        ? filteredHashtags.length
        : filteredUsers.length;

    if (count === 0 && e.key !== 'Escape') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionState(prev => ({
        ...prev,
        selectedIndex: (prev.selectedIndex + 1) % count
      }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionState(prev => ({
        ...prev,
        selectedIndex: (prev.selectedIndex - 1 + count) % count
      }));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (suggestionState.type === 'hashtag') {
        const selected = filteredHashtags[suggestionState.selectedIndex];
        if (selected) {
          handleSelectHashtag(selected.tag);
        } else if (suggestionState.query) {
          handleSelectHashtag(`#${suggestionState.query}`);
        }
      } else {
        const selected = filteredUsers[suggestionState.selectedIndex];
        if (selected) {
          handleSelectUser(selected);
        }
      }
    } else if (e.key === 'Escape') {
      setSuggestionState(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleSelectHashtag = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;

    if (suggestionState.targetField === 'content') {
      const { newText, newCursorPos } = insertTriggerReplacement(
        content,
        suggestionState.startIndex,
        suggestionState.endIndex,
        cleanTag
      );
      setContent(newText);
      setSuggestionState(prev => ({ ...prev, isOpen: false }));

      // Also automatically add to hashtagsStr field if not already there
      const existing = hashtagsStr.split(' ').map(t => t.trim()).filter(Boolean);
      if (!existing.some(t => t.toLowerCase() === cleanTag.toLowerCase())) {
        setHashtagsStr(prev => (prev.trim() ? `${prev.trim()} ${cleanTag}` : cleanTag));
      }

      setTimeout(() => {
        if (contentTextareaRef.current) {
          contentTextareaRef.current.focus();
          contentTextareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 10);
    } else {
      // Selected for the hashtags input field
      const { newText, newCursorPos } = insertTriggerReplacement(
        hashtagsStr,
        suggestionState.startIndex,
        suggestionState.endIndex,
        cleanTag
      );
      setHashtagsStr(newText);
      setSuggestionState(prev => ({ ...prev, isOpen: false }));

      setTimeout(() => {
        if (hashtagsInputRef.current) {
          hashtagsInputRef.current.focus();
          hashtagsInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 10);
    }
  };

  const handleSelectUser = (user: PublicUserProfile) => {
    const mentionToken = `@${user.name.replace(/\s+/g, '_')}`;
    const { newText, newCursorPos } = insertTriggerReplacement(
      content,
      suggestionState.startIndex,
      suggestionState.endIndex,
      mentionToken
    );
    setContent(newText);

    if (!mentionedUserIds.includes(user.uid)) {
      setMentionedUserIds(prev => [...prev, user.uid]);
    }
    setSuggestionState(prev => ({ ...prev, isOpen: false }));

    setTimeout(() => {
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
        contentTextareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const fileList = Array.from(files);
      const newImages: PostImage[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        try {
          const compressedDataUrl = await compressImage(file, 960, 960, 0.82);
          newImages.push({
            id: 'file_' + Date.now() + '_' + i + Math.random().toString(36).slice(2, 5),
            url: compressedDataUrl,
            caption: file.name
          });
        } catch (err) {
          console.warn('Image compression fallback for', file.name, err);
        }
      }

      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
      }
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (isDraft: boolean) => {
    if (!content.trim() && !title.trim()) {
      setErrorMessage('পোস্টের বিষয়বস্তু বা বিবরণ লিখুন।');
      return;
    }

    // Extract tags from both input field and content/title
    const explicitTags = hashtagsStr
      .split(' ')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => (t.startsWith('#') ? t : `#${t}`));

    const contentTagsMatch = (content + ' ' + title).match(/#[A-Za-z0-9_\u0980-\u09FF]+/g) || [];

    const tagMap = new Map<string, string>();
    [...explicitTags, ...contentTagsMatch].forEach(tag => {
      const clean = tag.replace(/^#+/, '').trim();
      if (clean) {
        tagMap.set(clean.toLowerCase(), '#' + clean);
      }
    });
    const finalTags = Array.from(tagMap.values());

    // Extract mentions from content
    const contentMentionsMatch = content.match(/@[A-Za-z0-9_\u0980-\u09FF]+/g) || [];
    const extractedMentionNames = contentMentionsMatch.map(m => m.replace(/^@+/, '').trim());

    const resolvedMentionUids = new Set<string>(mentionedUserIds);
    allUsers.forEach(u => {
      const cleanName = u.name.replace(/\s+/g, '_').toLowerCase();
      const rawName = u.name.toLowerCase();
      if (
        extractedMentionNames.some(
          m => m.toLowerCase() === cleanName || m.toLowerCase() === rawName
        )
      ) {
        resolvedMentionUids.add(u.uid);
      }
    });

    const postPayload: Partial<CommunityPost> = {
      title: title.trim(),
      content: content.trim(),
      type: postType,
      districtId,
      upazilaId: upazilaId.trim(),
      categoryId,
      locationName: locationName.trim(),
      hashtags: finalTags,
      mentions: Array.from(resolvedMentionUids),
      images,
      status: isDraft ? 'draft' : 'published',
      updatedAt: new Date().toISOString()
    };

    onSubmitPost(postPayload, isDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <FileEdit size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-serif">
                {initialPostToEdit ? 'পোস্ট সম্পাদনা করুন' : 'নতুন পোস্ট তৈরি করুন'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                খুলনা বিভাগের নাগরিকদের সাথে তথ্য শেয়ার করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
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
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">পোস্টের ধরন</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'general', label: 'সাধারণ', icon: Globe },
                { id: 'local_info', label: 'স্থানীয় তথ্য', icon: Info },
                { id: 'question', label: 'প্রশ্ন ও জিজ্ঞাসা', icon: HelpCircle },
                { id: 'service_recommendation', label: 'সেবা পর্যালোচনা', icon: ThumbsUp },
                { id: 'personal_blog', label: 'ব্যক্তিগত/ব্লগ', icon: FileEdit },
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
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
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
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">শিরোনাম (ঐচ্ছিক)</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="যেমন: রূপসা ঘাট ট্রাফিক আপডেট বা সেরা মিষ্টির দোকান..."
              className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none dark:text-slate-100"
            />
          </div>

          {/* CONTENT TEXTAREA WITH REAL-TIME HASHTAG & MENTION AUTOCOMPLETE */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
              </label>

              {/* Quick shortcut helper pills */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!contentTextareaRef.current) return;
                    const textarea = contentTextareaRef.current;
                    const pos = textarea.selectionStart || content.length;
                    const before = content.slice(0, pos);
                    const after = content.slice(pos);
                    const needsSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n');
                    const insert = needsSpace ? ' #' : '#';
                    const newText = before + insert + after;
                    setContent(newText);
                    setTimeout(() => {
                      textarea.focus();
                      const newPos = pos + insert.length;
                      textarea.setSelectionRange(newPos, newPos);
                      checkAndTriggerSuggestions(newText, newPos, 'content');
                    }, 15);
                  }}
                  className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  title="হ্যাশট্যাগ যোগ করুন (অথবা সরাসরি # টাইপ করুন)"
                >
                  <Hash size={11} className="text-emerald-600" />
                  <span># হ্যাশট্যাগ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!contentTextareaRef.current) return;
                    const textarea = contentTextareaRef.current;
                    const pos = textarea.selectionStart || content.length;
                    const before = content.slice(0, pos);
                    const after = content.slice(pos);
                    const needsSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n');
                    const insert = needsSpace ? ' @' : '@';
                    const newText = before + insert + after;
                    setContent(newText);
                    setTimeout(() => {
                      textarea.focus();
                      const newPos = pos + insert.length;
                      textarea.setSelectionRange(newPos, newPos);
                      checkAndTriggerSuggestions(newText, newPos, 'content');
                    }, 15);
                  }}
                  className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-lg flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  title="ইউজার মেনশন করুন (অথবা সরাসরি @ টাইপ করুন)"
                >
                  <AtSign size={11} className="text-blue-600" />
                  <span>@ মেনশন</span>
                </button>
              </div>
            </div>

            <textarea
              ref={contentTextareaRef}
              rows={4}
              value={content}
              onChange={handleContentChange}
              onKeyUp={e => checkAndTriggerSuggestions(content, e.currentTarget.selectionStart, 'content')}
              onClick={e => checkAndTriggerSuggestions(content, e.currentTarget.selectionStart, 'content')}
              onKeyDown={handleKeyDown}
              placeholder="আপনার অভিজ্ঞতা, তথ্য, জিজ্ঞাসা অথবা প্রয়োজনীয় নাগরিক আপডেট এখানে বিস্তারিত লিখুন... (# লিখে হ্যাশট্যাগ ও @ লিখে যেকোনো ইউজার মেনশন করুন)"
              className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none leading-relaxed resize-none dark:text-slate-100"
              required
            />

            {/* FLOATING REAL-TIME AUTOCOMPLETE SUGGESTION BOX */}
            {suggestionState.isOpen && suggestionState.targetField === 'content' && (
              <div className="absolute top-full left-0 mt-1 z-50">
                <HashtagMentionSuggestionBox
                  type={suggestionState.type}
                  hashtagSuggestions={filteredHashtags}
                  userSuggestions={filteredUsers}
                  query={suggestionState.query}
                  selectedIndex={suggestionState.selectedIndex}
                  onSelectHashtag={handleSelectHashtag}
                  onSelectUser={handleSelectUser}
                  onClose={() => setSuggestionState(prev => ({ ...prev, isOpen: false }))}
                />
              </div>
            )}
          </div>

          {/* DISTRICT & UPAZILA SELECT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">জেলা (ঐচ্ছিক)</label>
              <select
                value={districtId}
                onChange={e => setDistrictId(e.target.value)}
                className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none cursor-pointer dark:text-slate-100"
              >
                <option value="">নির্বাচন করুন</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">উপজেলা / এলাকা (ঐচ্ছিক)</label>
              <input
                type="text"
                value={upazilaId}
                onChange={e => setUpazilaId(e.target.value)}
                placeholder="যেমন: ডুমুরিয়া, ফুলতলা, সদর..."
                className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none dark:text-slate-100"
              />
            </div>
          </div>

          {/* CATEGORY & LOCATION NAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">ক্যাটাগরি (ঐচ্ছিক)</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none cursor-pointer dark:text-slate-100"
              >
                <option value="">নির্বাচন করুন</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">স্থানের নাম (ঐচ্ছিক)</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="যেমন: ডাকবাংলো মোড়, শিববাড়ি চত্বর..."
                className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none dark:text-slate-100"
              />
            </div>
          </div>

          {/* DEDICATED HASHTAGS INPUT WITH LIVE AUTOCOMPLETE & TRENDING PILLS */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag size={13} className="text-emerald-700" />
                <span>হ্যাশট্যাগ (স্পেস দিয়ে লিখুন)</span>
              </label>
              <span className="text-[10px] text-slate-400">যেমন: #SmartKhulna</span>
            </div>

            <div className="relative">
              <input
                ref={hashtagsInputRef}
                type="text"
                value={hashtagsStr}
                onChange={handleHashtagsInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (hashtagsStr.trim().length > 0) {
                    checkAndTriggerSuggestions(hashtagsStr, hashtagsStr.length, 'hashtags');
                  }
                }}
                placeholder="#SmartKhulna #KhulnaTraffic #HospitalHelp"
                className="w-full bg-slate-50/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none font-mono text-emerald-800 dark:text-emerald-400"
              />

              {/* Suggestions for Hashtags Input */}
              {suggestionState.isOpen && suggestionState.targetField === 'hashtags' && (
                <div className="absolute top-full left-0 mt-1 z-50">
                  <HashtagMentionSuggestionBox
                    type="hashtag"
                    hashtagSuggestions={filteredHashtags}
                    userSuggestions={[]}
                    query={suggestionState.query}
                    selectedIndex={suggestionState.selectedIndex}
                    onSelectHashtag={handleSelectHashtag}
                    onSelectUser={() => {}}
                    onClose={() => setSuggestionState(prev => ({ ...prev, isOpen: false }))}
                  />
                </div>
              )}
            </div>

            {/* REAL-TIME TRENDING HASHTAGS PILLS WITH POST COUNTS */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Flame size={12} className="text-amber-500 fill-amber-500" />
                  <span>জনপ্রিয় ট্রেন্ডিং হ্যাশট্যাগ (রিয়েল-টাইম পোস্ট সংখ্যা):</span>
                </span>
                <span className="text-[10px] text-slate-400">ট্যাপ করে যুক্ত করুন</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
                {allHashtags.slice(0, 10).map(tagItem => {
                  const isAdded = hashtagsStr.toLowerCase().includes(tagItem.tag.toLowerCase());
                  return (
                    <button
                      key={tagItem.tag}
                      type="button"
                      onClick={() => {
                        if (isAdded) {
                          const currentTags = hashtagsStr.split(' ').map(t => t.trim()).filter(Boolean);
                          setHashtagsStr(currentTags.filter(t => t.toLowerCase() !== tagItem.tag.toLowerCase()).join(' '));
                        } else {
                          setHashtagsStr(prev => (prev.trim() ? `${prev.trim()} ${tagItem.tag}` : tagItem.tag));
                        }
                      }}
                      className={`shrink-0 text-xs px-2.5 py-1 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 border select-none ${
                        isAdded
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60'
                      }`}
                      title={`${tagItem.tag} (${toBengaliNumber(tagItem.count)} টি পোস্ট)`}
                    >
                      <span>{tagItem.tag}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isAdded
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                        }`}
                      >
                        {tagItem.count > 0 ? `${toBengaliNumber(tagItem.count)} টি` : 'নতুন'}
                      </span>
                      {isAdded && <Check size={11} className="stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* IMAGES UPLOAD / URL ATTACHMENTS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-emerald-700" /> ছবি সংযুক্ত করুন ({images.length})
              </label>
              <div className="flex items-center gap-2">
                <label
                  className={`cursor-pointer text-[11px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 transition ${
                    isUploadingImages ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {isUploadingImages ? (
                    <Loader2 size={12} className="animate-spin text-emerald-700" />
                  ) : (
                    <UploadCloud size={12} />
                  )}
                  {isUploadingImages ? 'অপ্টিমাইজ হচ্ছে...' : 'ডিভাইস থেকে আপলোড'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingImages}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg cursor-pointer"
                >
                  লিংক যোগ করুন
                </button>
              </div>
            </div>

            {showImageInput && (
              <div className="flex gap-2 mb-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  placeholder="ছবির সরাসরি লিংক (https://...)"
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-800 cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>
            )}

            {/* PREVIEW ATTACHED IMAGES */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                {images.map(img => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900"
                  >
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
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] text-emerald-950 dark:text-emerald-200 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-700 dark:text-emerald-400" /> স্মার্ট খুলনা কমিউনিটি নির্দেশিকা:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-normal">
              আইন-শৃঙ্খলা রক্ষাকারী বাহিনী, সরকারি দপ্তর বা স্বাস্থ্য সেবার ভুয়া পরিচয় দিয়ে কোনো তথ্য পোস্ট করা দণ্ডনীয়। সকল পোস্ট মডারেশন দলের নজরদারিতে থাকে।
            </p>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl font-bold transition cursor-pointer"
          >
            বাতিল
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition cursor-pointer"
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
