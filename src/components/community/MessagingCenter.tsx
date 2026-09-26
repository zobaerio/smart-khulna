import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MessageCircle,
  Search,
  Send,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Trash2,
  Ban,
  AlertTriangle,
  UserPlus,
  ShieldAlert,
  Clock,
  Circle,
  X,
  User,
  ShieldCheck,
  Cloud,
  Download,
  Maximize2,
  Loader2,
  UploadCloud,
  ExternalLink,
  CheckCircle2,
  Palette,
  CheckSquare,
  Square,
  Award,
  Bot,
  Sparkles,
  Edit2,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff
} from 'lucide-react';
import {
  Conversation,
  ChatMessage,
  ConversationParticipant,
  MessageAttachment,
  PublicUserProfile
} from '../../types/community';
import { District } from '../../dbData';
import { uploadChatImage, isSupabaseConfigured } from '../../lib/supabase';
import { getSafeAvatarUrl } from '../../lib/avatarHelper';
import { CHAT_THEMES, ChatThemeAnimationOverlay, ThemeSelectorModal } from './chatThemes';
import { SmartKhulnaAiChat } from '../ai/SmartKhulnaAiChat';

interface MessagingCenterProps {
  currentUserId: string | null;
  currentUserEmail: string | null;
  currentUserName: string | null;
  currentUserAvatar?: string;
  districts: District[];
  allUsers: PublicUserProfile[];
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (convId: string) => void;
  onSendMessage: (convId: string, text: string, attachments?: MessageAttachment[]) => void;
  onDeleteMessage: (convId: string, messageId: string) => void;
  onDeleteMessages?: (convId: string, messageIds: string[]) => void;
  onDeleteConversation: (convId: string) => void;
  onStartConversationWithUser: (targetUser: PublicUserProfile) => void;
  onBlockUser: (targetUid: string) => void;
  onReportUser: (targetUid: string, name: string) => void;
  onRequireAuth: () => void;
  messagesMap: { [convId: string]: ChatMessage[] };
  blockedUserIds: string[];
  onViewProfile?: (uid: string, name: string, email: string, avatar?: string) => void;
  onEditMessage?: (convId: string, messageId: string, newText: string) => void;
}

export const MessagingCenter: React.FC<MessagingCenterProps> = ({
  currentUserId,
  currentUserEmail,
  currentUserName,
  currentUserAvatar,
  districts,
  allUsers,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onDeleteMessage,
  onDeleteMessages,
  onDeleteConversation,
  onStartConversationWithUser,
  onBlockUser,
  onReportUser,
  onRequireAuth,
  messagesMap,
  blockedUserIds,
  onViewProfile,
  onEditMessage
}) => {
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(activeConversationId));
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState('');

  // Selection and Bulk Deletion States
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    mode: 'single' | 'bulk';
    messageId?: string;
    messageIds?: string[];
    textPreview?: string;
  }>({ isOpen: false, mode: 'single' });
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);
  
  // Theme State
  const [chatTheme, setChatTheme] = useState<string>(() => {
    return localStorage.getItem(`chat_theme_${activeConversationId || 'global'}`) || 'classic';
  });
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Audio and Video Call State
  const [activeCall, setActiveCall] = useState<{
    type: 'audio' | 'video';
    targetName: string;
    targetAvatar: string;
    status: 'ringing' | 'connected';
    durationSeconds: number;
    isMuted: boolean;
    isVideoOff: boolean;
  } | null>(null);

  useEffect(() => {
    let timer: any;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  const activeTheme = CHAT_THEMES[chatTheme] || CHAT_THEMES.classic;

  useEffect(() => {
    if (activeConversationId) {
      const savedTheme = localStorage.getItem(`chat_theme_${activeConversationId}`);
      setChatTheme(savedTheme || 'classic');
      setIsSelectionMode(false);
      setSelectedMessageIds([]);
      setShowThemeModal(false);
    }
  }, [activeConversationId]);

  // Supabase Storage & Lightbox States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [lightboxAttachment, setLightboxAttachment] = useState<MessageAttachment | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];
  const lastMessageCount = useRef(currentMessages.length);

  // Scroll to bottom when conversation changes or new message from self
  useEffect(() => {
    const isNewMessage = currentMessages.length > lastMessageCount.current;
    const lastMsg = currentMessages[currentMessages.length - 1];
    const isFromMe = lastMsg?.senderId === currentUserId;

    // 1. Always scroll to bottom when changing conversations
    if (activeConversationId !== scrollContainerRef.current?.getAttribute('data-active-conv')) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      scrollContainerRef.current?.setAttribute('data-active-conv', activeConversationId || '');
    } else if (currentMessages.length > (lastMessageCount.current || 0)) {
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 250;
        if (isFromMe || isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    lastMessageCount.current = currentMessages.length;
  }, [currentMessages.length, activeConversationId, currentUserId]);

  useEffect(() => {
    if (activeConversationId) {
      setMobileShowChat(true);
    }
  }, [activeConversationId]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxAttachment(null);
      }
    };
    if (lightboxAttachment) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxAttachment]);

  // Filter conversations (only for logged in users, guest users can chat with Smart Khulna AI)
  const filteredConversations = currentUserId
    ? conversations.filter(conv => {
        if (!conv || !conv.participantIds) return false;
        if (conv.hiddenForUserIds?.includes(currentUserId)) return false;
        const otherUid = conv.participantIds.find(uid => uid !== currentUserId);
        const otherObj = (otherUid && conv.participants) ? conv.participants[otherUid] : null;
        const otherUserFromList = otherUid ? allUsers.find(u => u.uid === otherUid) : null;
        const resolvedName = otherObj?.name || otherUserFromList?.name || 'ব্যবহারকারী';
        const nameMatch = chatSearchQuery
          ? resolvedName.toLowerCase().includes(chatSearchQuery.toLowerCase())
          : true;
        const lastMsgMatch = chatSearchQuery
          ? (conv.lastMessage?.text || '').toLowerCase().includes(chatSearchQuery.toLowerCase())
          : false;
        return nameMatch || lastMsgMatch;
      })
    : [];

  // Get other participant UID in active conversation (with fallback from conversation ID if conv not in array yet)
  const otherParticipantUid = useMemo(() => {
    if (!activeConversationId || activeConversationId === 'smart-khulna-ai') return null;
    if (activeConv?.participantIds) {
      return activeConv.participantIds.find(uid => uid !== currentUserId) || null;
    }
    if (activeConversationId.startsWith('conv_')) {
      const parts = activeConversationId.replace('conv_', '').split('_');
      if (currentUserId) {
        return parts.find(uid => uid !== currentUserId) || parts[1] || parts[0] || null;
      }
      return parts[0] || null;
    }
    return null;
  }, [activeConversationId, activeConv, currentUserId]);

  // Resolve other participant object with multi-level fallback
  const otherParticipant = useMemo(() => {
    if (!otherParticipantUid) {
      return {
        uid: '',
        name: 'ব্যবহারকারী',
        email: '',
        avatar: '',
        badge: undefined,
        isOnline: false
      };
    }
    if (activeConv?.participants?.[otherParticipantUid]) {
      const p = activeConv.participants[otherParticipantUid];
      return {
        uid: p.uid || otherParticipantUid,
        name: p.name || 'ব্যবহারকারী',
        email: p.email || '',
        avatar: p.avatar || '',
        badge: p.badge,
        isOnline: true
      };
    }
    const foundUser = allUsers.find(u => u.uid === otherParticipantUid);
    if (foundUser) {
      return {
        uid: foundUser.uid,
        name: foundUser.name || 'ব্যবহারকারী',
        email: foundUser.email || '',
        avatar: foundUser.avatar || '',
        badge: foundUser.badge,
        isOnline: true
      };
    }
    return {
      uid: otherParticipantUid,
      name: 'ব্যবহারকারী',
      email: '',
      avatar: '',
      isOnline: true
    };
  }, [otherParticipantUid, activeConv, allUsers]);

  const isOtherBlocked = otherParticipantUid ? blockedUserIds.includes(otherParticipantUid) : false;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    if ((!messageInput.trim() && attachments.length === 0) || !activeConversationId) return;
    if (isOtherBlocked) {
      alert('আপনি এই ব্যবহারকারীকে ব্লক করেছেন। মেসেজ পাঠাতে আগে আনব্লক করুন।');
      return;
    }
    onSendMessage(activeConversationId, messageInput.trim(), attachments);
    setMessageInput('');
    setAttachments([]);
  };

  /**
   * Process and upload image attachment using Supabase storage
   */
  const processImageFile = async (file: File) => {
    if (!activeConversationId) return;
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি সঠিক ছবির ফাইল নির্বাচন করুন (JPEG, PNG, WebP, GIF)');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ২০ মেগাবাইট হতে পারে।');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatusText('Supabase ক্লাউড স্টোরেজে আপলোড হচ্ছে...');
      const uploadedAttachment = await uploadChatImage(file, activeConversationId);
      setAttachments(prev => [...prev, uploadedAttachment]);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      setUploadStatusText('');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await processImageFile(files[i]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (!activeConversationId) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          await processImageFile(files[i]);
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachments(prev => [
          ...prev,
          {
            id: 'att_' + Date.now(),
            type: 'file',
            url: reader.result as string,
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`
          }
        ]);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 md:rounded-3xl md:border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden h-full max-h-full w-full flex-1 min-h-0 flex flex-col md:flex-row">
      {/* LEFT COLUMN: CONVERSATION LIST */}
      <div
        id="messages-conversation-sidebar"
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/50 flex-1 md:flex-initial h-full max-h-full min-h-0 overflow-hidden md:shrink-0 ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* LIST HEADER (FIXED TOP) */}
        <div id="messages-list-header" className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shrink-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
              <MessageCircle size={18} className="text-emerald-700 dark:text-emerald-400" />
              মেসেজ
            </h2>
            <button
              id="new-chat-header-btn"
              onClick={() => setShowNewChatModal(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <UserPlus size={13} /> নতুন চ্যাট
            </button>
          </div>

          {/* SEARCH CHATS */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              id="messages-search-input"
              type="text"
              value={chatSearchQuery}
              onChange={e => setChatSearchQuery(e.target.value)}
              placeholder="মেসেজ খুঁজুন..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* CONVERSATION ITEMS (ONLY THIS AREA SCROLLS) */}
        <div
          id="messages-conversation-list"
          className="flex-1 min-h-0 h-0 w-full overflow-y-auto overflow-x-hidden overscroll-contain conversation-list-scroll divide-y divide-slate-100 dark:divide-slate-800/60 pb-28 md:pb-8 touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* PINNED SMART KHULNA AI ASSISTANT CONTACT */}
          <button
            id="conversation-item-smart-khulna-ai"
            onClick={() => {
              onSelectConversation('smart-khulna-ai');
              setMobileShowChat(true);
            }}
            className={`w-full p-3.5 flex items-start gap-3 text-left transition cursor-pointer border-b border-emerald-100/60 dark:border-slate-800 touch-pan-y ${
              activeConversationId === 'smart-khulna-ai' || (!activeConversationId && !activeConv)
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-r-4 border-emerald-700 dark:border-emerald-500'
                : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 bg-white/50 dark:bg-slate-900/40'
            }`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-xs">
                <Bot size={22} className="animate-pulse" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1 font-serif">
                    স্মার্ট খুলনা এআই
                    <Sparkles size={12} className="text-amber-500 fill-amber-500" />
                  </h4>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0">
                  অনলাইন
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                  টেক্সট, ছবি তৈরি ও ভয়েস কথোপকথন
                </p>
              </div>
            </div>
          </button>

          {!currentUserId && (
            <div className="p-4 m-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-2">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-serif">
                নাগরিক বার্তা আদান-প্রদান
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                অন্যান্য নাগরিক ও সেবাদাতাদের সাথে ব্যক্তিগত চ্যাট করতে অনুগ্রহ করে লগইন করুন।
              </p>
              <button
                type="button"
                onClick={onRequireAuth}
                className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                গুগল দিয়ে লগইন করুন
              </button>
            </div>
          )}

          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2.5 my-auto flex flex-col items-center justify-center min-h-[250px]">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                <MessageCircle size={24} />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300">কোনো মেসেজ নেই</h4>
              <p className="text-[11px] max-w-xs leading-relaxed">
                {chatSearchQuery ? 'অনুসন্ধানের সাথে মেলে এমন কোনো কথোপকথন পাওয়া যায়নি।' : 'আপনার কোনো কথোপকথন এখনো শুরু হয়নি।'}
              </p>
              {!chatSearchQuery && (
                <button
                  onClick={() => setShowNewChatModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5 mt-2"
                >
                  <UserPlus size={14} /> নতুন কথোপকথন শুরু করুন
                </button>
              )}
            </div>
          ) : (
            filteredConversations.map(conv => {
              const otherUid = conv.participantIds.find(uid => uid !== currentUserId);
              const other = otherUid ? conv.participants[otherUid] : null;
              const unread = (currentUserId && conv.unreadCounts?.[currentUserId]) || 0;
              const isActive = conv.id === activeConversationId;

              return (
                <button
                  key={conv.id}
                  id={`conversation-item-${conv.id}`}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setMobileShowChat(true);
                  }}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/60 touch-pan-y ${
                    isActive ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-r-4 border-emerald-700 dark:border-emerald-500' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={getSafeAvatarUrl(other?.avatar, other?.name, other?.uid)}
                      alt={other?.name || 'User'}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-emerald-50"
                      onError={(e) => {
                        e.currentTarget.src = getSafeAvatarUrl('', other?.name, other?.uid);
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {other?.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {other?.name || 'ব্যবহারকারী'}
                      </h4>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                          {formatMessageTime(conv.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {conv.lastMessage?.text || 'ছবি বা ফাইল পাঠানো হয়েছে'}
                      </p>
                      {unread > 0 && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE CHAT VIEW */}
      <div
        className={`flex-1 flex flex-col bg-white dark:bg-slate-900 h-full min-h-0 overflow-hidden ${
          mobileShowChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConversationId === 'smart-khulna-ai' || (!activeConv && !activeConversationId) ? (
          <SmartKhulnaAiChat
            currentUserName={currentUserName}
            currentUserAvatar={currentUserAvatar}
            onBackToConversations={() => setMobileShowChat(false)}
            isMobile={mobileShowChat}
          />
        ) : activeConversationId ? (
          <>
            {/* CHAT HEADER (FIXED TOP) */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0 z-20">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>

                <div
                  className={`flex items-center gap-2.5 ${onViewProfile ? 'cursor-pointer group' : ''}`}
                  onClick={() => {
                    if (onViewProfile && otherParticipant.uid) {
                      onViewProfile(
                        otherParticipant.uid,
                        otherParticipant.name,
                        otherParticipant.email || '',
                        otherParticipant.avatar
                      );
                    }
                  }}
                  title={onViewProfile ? `${otherParticipant.name} এর প্রোফাইল দেখুন` : undefined}
                >
                  <div className="relative">
                    <img
                      src={getSafeAvatarUrl(otherParticipant.avatar, otherParticipant.name, otherParticipant.uid)}
                      alt={otherParticipant.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:ring-2 ring-emerald-500 transition bg-emerald-50"
                      onError={(e) => {
                        e.currentTarget.src = getSafeAvatarUrl('', otherParticipant.name, otherParticipant.uid);
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {otherParticipant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-slate-900 font-serif group-hover:text-emerald-700 transition">
                        {otherParticipant.name}
                      </h3>
                      {otherParticipant.badge === 'admin' && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                          এডমিন
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {otherParticipant.isOnline ? (
                        <span className="text-emerald-600 font-medium">● অনলাইন আছেন</span>
                      ) : (
                        'অফলাইন'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* CHAT ACTIONS MENU */}
              <div className="flex items-center gap-1.5">
                {/* Selection Mode Toggle */}
                <button
                  onClick={() => {
                    setIsSelectionMode(!isSelectionMode);
                    setSelectedMessageIds([]);
                  }}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isSelectionMode 
                      ? 'bg-red-100 dark:bg-red-950/40 text-red-600' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                  title={isSelectionMode ? "সিলেকশন মোড বন্ধ করুন" : "একসাথে একাধিক মেসেজ সিলেক্ট করে মুছুন"}
                >
                  <CheckSquare size={16} />
                </button>

                {/* Audio Call */}
                <button
                  onClick={() => {
                    setActiveCall({
                      type: 'audio',
                      targetName: otherParticipant.name,
                      targetAvatar: otherParticipant.avatar,
                      status: 'ringing',
                      durationSeconds: 0,
                      isMuted: false,
                      isVideoOff: false,
                    });
                    setTimeout(() => {
                      setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
                    }, 2500);
                  }}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="অডিও কল করুন"
                >
                  <Phone size={16} />
                </button>

                {/* Video Call */}
                <button
                  onClick={() => {
                    setActiveCall({
                      type: 'video',
                      targetName: otherParticipant.name,
                      targetAvatar: otherParticipant.avatar,
                      status: 'ringing',
                      durationSeconds: 0,
                      isMuted: false,
                      isVideoOff: false,
                    });
                    setTimeout(() => {
                      setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
                    }, 2500);
                  }}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="ভিডিও কল করুন"
                >
                  <Video size={16} />
                </button>

                {/* Theme Palette Toggle */}
                <button
                  onClick={() => setShowThemeModal(true)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
                  title="চ্যাট ওয়ালপেপার ও থিম পরিবর্তন করুন"
                >
                  <Palette size={16} />
                  <span className="hidden sm:inline text-[11px] font-bold text-slate-700 dark:text-slate-300">থিম</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowChatMenu(!showChatMenu)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {showChatMenu && (
                    <div className="absolute right-0 top-9 z-30 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 text-xs text-slate-700 animate-in fade-in duration-150">
                      <button
                        onClick={() => {
                          setShowChatMenu(false);
                          setShowThemeModal(true);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                      >
                        <Palette size={13} className="text-blue-600" /> ওয়ালপেপার ও থিম গ্যালারি
                      </button>
                      <button
                        onClick={() => {
                          setShowChatMenu(false);
                          setIsSelectionMode(true);
                          setSelectedMessageIds([]);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium border-t border-slate-100"
                      >
                        <CheckSquare size={13} /> মেসেজ ডিলিট করুন (সিলেক্ট)
                      </button>
                      <button
                        onClick={() => {
                          setShowChatMenu(false);
                          if (activeConv?.id) {
                            onDeleteConversation(activeConv.id);
                          } else if (activeConversationId) {
                            onDeleteConversation(activeConversationId);
                          }
                          setMobileShowChat(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer border-t border-slate-100"
                      >
                        <Trash2 size={13} /> চ্যাট ইতিহাস সরান
                      </button>
                      <button
                        onClick={() => {
                          setShowChatMenu(false);
                          if (otherParticipantUid) {
                            onBlockUser(otherParticipantUid);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100"
                      >
                        <Ban size={13} /> {isOtherBlocked ? 'আনব্লক করুন' : 'ব্লক করুন'}
                      </button>
                      <button
                        onClick={() => {
                          setShowChatMenu(false);
                          if (otherParticipantUid) {
                            onReportUser(otherParticipantUid, otherParticipant.name);
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100"
                      >
                        <AlertTriangle size={13} /> ব্যবহারকারী রিপোর্ট করুন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION SUCCESS TOAST */}
            {actionSuccessToast && (
              <div className="bg-emerald-600 text-white px-3.5 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200 shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{actionSuccessToast}</span>
                </div>
                <button
                  onClick={() => setActionSuccessToast(null)}
                  className="p-0.5 hover:bg-emerald-700 rounded cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* MESSAGES STREAM (ONLY SCROLLING AREA) */}
            <div
              ref={scrollContainerRef}
              className={`flex-1 min-h-0 w-full p-4 overflow-y-auto overscroll-contain custom-chat-scrollbar space-y-3 transition-all duration-300 relative ${activeTheme.bgClass}`}
            >
              {/* Dynamic Theme Ambient Animation Overlay */}
              <ChatThemeAnimationOverlay animationType={activeTheme.animationType} />

              {/* SECURITY NOTICE */}
              <div className="relative z-10 max-w-md mx-auto p-2 bg-emerald-50/80 dark:bg-emerald-950/60 backdrop-blur-xs border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl text-center text-[10px] text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-1.5 shadow-xs">
                <ShieldCheck size={12} className="text-emerald-700 dark:text-emerald-400" />
                <span>আপনার বার্তা সম্পূর্ণ ব্যক্তিগত। এডমিন বা তৃতীয় পক্ষ বার্তা দেখতে পারবে না।</span>
              </div>

              {currentMessages.length === 0 ? (
                <div className="relative z-10 text-center py-12 text-xs text-slate-400">
                  এখনও কোনো মেসেজ পাঠানো হয়নি। একটি শুভেচ্ছা বার্তা পাঠান!
                </div>
              ) : (
                currentMessages.map((msg, idx) => {
                  const isMine = msg.senderId === currentUserId;
                  const isSelected = selectedMessageIds.includes(msg.id);
                  const prevMsg = idx > 0 ? currentMessages[idx - 1] : null;
                  const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;

                  return (
                    <div
                      key={msg.id}
                      className={`relative z-10 flex items-end gap-2 w-full ${isMine ? 'justify-end' : 'justify-start'} ${
                        isSameSender ? 'mt-1' : 'mt-3'
                      } ${
                        isSelectionMode 
                          ? 'cursor-pointer hover:bg-slate-500/5 dark:hover:bg-slate-200/5 p-1 rounded-xl transition-colors duration-150' 
                          : ''
                      }`}
                      onClick={() => {
                        if (isSelectionMode) {
                          if (selectedMessageIds.includes(msg.id)) {
                            setSelectedMessageIds(prev => prev.filter(id => id !== msg.id));
                          } else {
                            setSelectedMessageIds(prev => [...prev, msg.id]);
                          }
                        }
                      }}
                    >
                      {/* Selection Checkbox in selection mode */}
                      {isSelectionMode && (
                        <div className="flex-shrink-0 mb-1">
                          {isSelected ? (
                            <CheckSquare size={16} className="text-red-500 fill-red-100 dark:fill-red-950/30" />
                          ) : (
                            <Square size={16} className="text-slate-400" />
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[72%] p-2.5 sm:p-3 text-xs sm:text-[13px] leading-relaxed shadow-xs relative group break-words select-text ${
                          isMine
                            ? `${activeTheme.myBubble} rounded-2xl ${isSameSender ? 'rounded-tr-md' : 'rounded-tr-xs'}`
                            : `${activeTheme.otherBubble} rounded-2xl ${isSameSender ? 'rounded-tl-md' : 'rounded-tl-xs'}`
                        }`}
                      >
                        {/* ATTACHED IMAGES */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-2 space-y-1.5">
                            {msg.attachments.map(att => (
                              <div key={att.id} className="rounded-xl overflow-hidden shadow-2xs">
                                {att.type === 'image' ? (
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="max-h-60 w-full object-cover rounded-xl cursor-pointer hover:opacity-95 transition"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxAttachment(att);
                                    }}
                                  />
                                ) : (
                                  <a
                                    href={att.url}
                                    download={att.name}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium ${
                                      isMine
                                        ? 'bg-black/20 text-white hover:bg-black/30'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                                    }`}
                                  >
                                    <Paperclip size={13} className="shrink-0" />
                                    <span className="truncate max-w-[180px] sm:max-w-xs">{att.name}</span>
                                    {att.size && <span className="opacity-70 text-[10px] shrink-0">({att.size})</span>}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* MESSAGE TEXT */}
                        {editingMessageId === msg.id ? (
                          <div className="space-y-2 mt-1">
                            <textarea
                              value={editMessageText}
                              onChange={(e) => setEditMessageText(e.target.value)}
                              className="w-full p-2 bg-white/90 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              rows={2}
                            />
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingMessageId(null);
                                  setEditMessageText('');
                                }}
                                className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold"
                              >
                                বাতিল
                              </button>
                              <button
                                onClick={() => {
                                  if (!editMessageText.trim() || !onEditMessage || !activeConversationId) return;
                                  onEditMessage(activeConversationId, msg.id, editMessageText.trim());
                                  setEditingMessageId(null);
                                  setEditMessageText('');
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                              >
                                সেভ করুন
                              </button>
                            </div>
                          </div>
                        ) : (
                          msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        )}

                        {/* TIME & READ STATUS */}
                        <div
                          className={`mt-1 flex items-center gap-1.5 text-[9px] select-none ${
                            isMine ? `${activeTheme.textMy} justify-end` : `${activeTheme.textOther} justify-end`
                          }`}
                        >
                          {(msg.isEdited || msg.editedAt) && (
                            <span className="opacity-75 italic">(সম্পাদিত)</span>
                          )}
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {isMine && ((Date.now() - new Date(msg.createdAt).getTime()) <= 2 * 60 * 60 * 1000) && editingMessageId !== msg.id && onEditMessage && (
                            <button
                              onClick={() => {
                                setEditingMessageId(msg.id);
                                setEditMessageText(msg.text);
                              }}
                              className="opacity-60 hover:opacity-100 transition p-0.5 ml-1 cursor-pointer"
                              title="বার্তা সম্পাদনা"
                            >
                              <Edit2 size={10} />
                            </button>
                          )}
                          {isMine && (
                            <span className="inline-flex items-center ml-1">
                              {msg.isRead ? (
                                <CheckCheck size={12} className="text-emerald-300 stroke-[2.5]" />
                              ) : (
                                <Check size={12} className="opacity-80 stroke-[2]" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ATTACHMENTS PREVIEW BAR (FIXED) */}
            {attachments.length > 0 && (
              <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto shrink-0 z-20">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="relative flex-shrink-0 bg-white border border-slate-200 rounded-lg p-1.5 flex items-center gap-2 text-xs"
                  >
                    {att.type === 'image' ? (
                      <img src={att.url} alt="preview" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <Paperclip size={14} className="text-emerald-700" />
                    )}
                    <span className="truncate max-w-[100px] text-[11px] text-slate-700">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                      className="text-rose-500 hover:text-rose-700"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* INPUT FORM OR BULK SELECTION ACTION BAR (FIXED BOTTOM) */}
            {isSelectionMode ? (
              <div className="p-3 sm:p-4 border-t border-red-100 dark:border-red-950/40 bg-red-50/60 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200 shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-red-600 dark:text-red-400">
                    {selectedMessageIds.length}টি মেসেজ সিলেক্ট করা হয়েছে
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (যেগুলো ডিলিট করতে চান সেগুলোর উপর ক্লিক করুন)
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMessageIds.length === currentMessages.length) {
                        setSelectedMessageIds([]);
                      } else {
                        setSelectedMessageIds(currentMessages.map(m => m.id));
                      }
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  >
                    {selectedMessageIds.length === currentMessages.length ? 'সব সিলেকশন মুছুন' : 'সব সিলেক্ট করুন'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMessageIds.length === 0) {
                        alert("অনুগ্রহ করে অন্তত একটি মেসেজ সিলেক্ট করুন!");
                        return;
                      }
                      setDeleteModal({
                        isOpen: true,
                        mode: 'bulk',
                        messageIds: selectedMessageIds,
                        textPreview: `${selectedMessageIds.length}টি নির্বাচিত বার্তা`
                      });
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-[10px] font-black bg-red-600 hover:bg-red-700 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10 cursor-pointer"
                  >
                    <Trash2 size={13} /> সিলেক্ট করা মেসেজ ডিলিট
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedMessageIds([]);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                  >
                    বাতিল করুন
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSend}
                className="p-2.5 sm:p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 sm:gap-2 shrink-0 z-20"
              >
                {/* IMAGE ATTACH BUTTON */}
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer shrink-0"
                  title="ছবি সংযুক্ত করুন"
                >
                  <ImageIcon size={18} />
                </button>

                {/* FILE ATTACH BUTTON */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer shrink-0"
                  title="ফাইল সংযুক্ত করুন"
                >
                  <Paperclip size={18} />
                </button>

                {/* TEXT INPUT */}
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder={
                    isOtherBlocked
                      ? 'আপনি এই ব্যবহারকারীকে ব্লক করেছেন'
                      : 'একটি বার্তা লিখুন...'
                  }
                  disabled={isOtherBlocked}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none placeholder:text-slate-400"
                />

                {/* SEND BUTTON */}
                <button
                  type="submit"
                  disabled={(!messageInput.trim() && attachments.length === 0) || isOtherBlocked}
                  className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shrink-0 shadow-xs"
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </>
        ) : (
          <SmartKhulnaAiChat
            currentUserName={currentUserName}
            currentUserAvatar={currentUserAvatar}
            onBackToConversations={() => setMobileShowChat(false)}
            isMobile={mobileShowChat}
          />
        )}
      </div>

      {/* NEW CHAT MODAL: SEARCH USERS */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                <UserPlus size={16} className="text-emerald-700" />
                নতুন চ্যাট শুরু করুন
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  placeholder="নাম বা ইমেইল দিয়ে নাগরিক খুঁজুন..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-2 overflow-y-auto max-h-72 divide-y divide-slate-100 text-xs">
              {allUsers
                .filter(u => u && u.uid !== currentUserId)
                .filter(u => {
                  const q = userSearchQuery.toLowerCase();
                  const nameMatch = (u.name || '').toLowerCase().includes(q);
                  const emailMatch = (u.email || '').toLowerCase().includes(q);
                  const districtMatch = (u.district || '').toLowerCase().includes(q);
                  return nameMatch || emailMatch || districtMatch;
                })
                .map(targetUser => (
                  <div
                    key={targetUser.uid}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl transition"
                  >
                    <div
                      className="flex items-center gap-2.5 cursor-pointer flex-1"
                      onClick={() => {
                        if (onViewProfile) {
                          onViewProfile(targetUser.uid, targetUser.name, targetUser.email, targetUser.avatar);
                        }
                      }}
                      title={`${targetUser.name} এর প্রোফাইল দেখুন`}
                    >
                      <img
                        src={getSafeAvatarUrl(targetUser.avatar, targetUser.name, targetUser.uid)}
                        alt={targetUser.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 hover:ring-2 ring-emerald-500 bg-emerald-50"
                        onError={(e) => {
                          e.currentTarget.src = getSafeAvatarUrl('', targetUser.name, targetUser.uid);
                        }}
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 hover:text-emerald-700 transition">{targetUser.name}</h4>
                        <p className="text-[10px] text-slate-500">
                          {targetUser.district ? `${targetUser.district} জেলা` : 'নাগরিক'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowNewChatModal(false);
                        onStartConversationWithUser(targetUser);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <MessageCircle size={12} /> মেসেজ
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* THEME SELECTION GALLERY MODAL */}
      {showThemeModal && (
        <ThemeSelectorModal
          currentTheme={chatTheme}
          onSelectTheme={(themeId) => {
            setChatTheme(themeId);
            if (activeConv) {
              localStorage.setItem(`chat_theme_${activeConv.id}`, themeId);
            }
            setActionSuccessToast("চ্যাট থিম সফলভাবে পরিবর্তিত হয়েছে!");
            setTimeout(() => setActionSuccessToast(null), 3000);
          }}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150 p-5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                {deleteModal.mode === 'bulk' ? 'সিলেক্ট করা মেসেজ মুছবেন?' : 'মেসেজটি মুছবেন?'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {deleteModal.mode === 'bulk'
                  ? `আপনি কি নিশ্চিতভাবে এই ${deleteModal.messageIds?.length || 0}টি বার্তা চ্যাট ইতিহাস থেকে মুছে ফেলতে চান? এটি স্থায়ীভাবে মুছে যাবে।`
                  : 'আপনি কি নিশ্চিতভাবে এই বার্তাটি আপনার চ্যাট থেকে মুছে ফেলতে চান?'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, mode: 'single' })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!activeConv) return;
                  const convId = activeConv.id;
                  try {
                    if (deleteModal.mode === 'bulk' && deleteModal.messageIds?.length) {
                      if (onDeleteMessages) {
                        onDeleteMessages(convId, deleteModal.messageIds);
                      } else {
                        await Promise.all(deleteModal.messageIds.map(id => onDeleteMessage(convId, id)));
                      }
                      setSelectedMessageIds([]);
                      setIsSelectionMode(false);
                      setActionSuccessToast(`${deleteModal.messageIds.length}টি মেসেজ সফলভাবে মুছে ফেলা হয়েছে`);
                    } else if (deleteModal.messageId) {
                      onDeleteMessage(convId, deleteModal.messageId);
                      setActionSuccessToast('মেসেজ মুছে ফেলা হয়েছে');
                    }
                    setDeleteModal({ isOpen: false, mode: 'single' });
                    setTimeout(() => setActionSuccessToast(null), 3000);
                  } catch (err) {
                    console.error('Failed to delete message:', err);
                    setDeleteModal({ isOpen: false, mode: 'single' });
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-md shadow-red-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO / VIDEO CALL MODAL */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center shadow-2xl text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 via-transparent to-blue-600/10 pointer-events-none" />

            {activeCall.type === 'video' && activeCall.status === 'connected' && !activeCall.isVideoOff ? (
              <div className="w-full h-64 sm:h-72 bg-slate-950 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 to-slate-950 flex items-center justify-center">
                  <img
                    src={getSafeAvatarUrl(activeCall.targetAvatar, activeCall.targetName)}
                    alt={activeCall.targetName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-500/50 shadow-lg animate-pulse"
                  />
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {activeCall.targetName}
                </div>
                <div className="absolute top-3 right-3 w-20 h-28 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-center justify-center shadow-md">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    আপনি
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-blue-500 animate-pulse shadow-xl">
                  <img
                    src={getSafeAvatarUrl(activeCall.targetAvatar, activeCall.targetName)}
                    alt={activeCall.targetName}
                    className="w-full h-full rounded-full object-cover bg-slate-900"
                  />
                </div>
                {activeCall.status === 'ringing' && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-slate-950 text-[11px] font-bold rounded-full shadow-md animate-bounce">
                    রিং হচ্ছে...
                  </span>
                )}
              </div>
            )}

            <h3 className="text-lg sm:text-xl font-bold font-serif mb-1">{activeCall.targetName}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              {activeCall.status === 'ringing'
                ? (activeCall.type === 'video' ? 'ভিডিও কল রিং হচ্ছে...' : 'অডিও কল রিং হচ্ছে...')
                : `${Math.floor(activeCall.durationSeconds / 60).toString().padStart(2, '0')}:${(activeCall.durationSeconds % 60).toString().padStart(2, '0')} • ${activeCall.type === 'video' ? 'ভিডিও কল চলমান' : 'অডিও কল চলমান'}`}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null)}
                className={`p-4 rounded-full transition cursor-pointer shadow-md ${
                  activeCall.isMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={activeCall.isMuted ? 'আনমিউট করুন' : 'মিউট করুন'}
              >
                {activeCall.isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {activeCall.type === 'video' && (
                <button
                  onClick={() => setActiveCall(prev => prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null)}
                  className={`p-4 rounded-full transition cursor-pointer shadow-md ${
                    activeCall.isVideoOff ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={activeCall.isVideoOff ? 'ক্যামেরা চালু করুন' : 'ক্যামেরা বন্ধ করুন'}
                >
                  {activeCall.isVideoOff ? <CameraOff size={20} /> : <Camera size={20} />}
                </button>
              )}

              <button
                onClick={() => setActiveCall(null)}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition cursor-pointer shadow-lg animate-pulse"
                title="কল কাটুন"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATTACHMENT LIGHTBOX MODAL */}
      {lightboxAttachment && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxAttachment(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={lightboxAttachment.url}
              alt={lightboxAttachment.name}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-3" onClick={e => e.stopPropagation()}>
              <a
                href={lightboxAttachment.url}
                download={lightboxAttachment.name}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> ছবি ডাউনলোড করুন
              </a>
              <button
                onClick={() => setLightboxAttachment(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
