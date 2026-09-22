import React, { useState, useEffect, useRef } from 'react';
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
  Award
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
  onViewProfile
}) => {
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(Boolean(activeConversationId));

  // Selection and Bulk Deletion States
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  
  // Theme State
  const [chatTheme, setChatTheme] = useState<string>(() => {
    return localStorage.getItem(`chat_theme_${activeConversationId || 'global'}`) || 'classic';
  });
  const [showThemePanel, setShowThemePanel] = useState(false);

  const THEMES: { [key: string]: { name: string; bgClass: string; myBubble: string; otherBubble: string; textMy: string; textOther: string; indicator: string } } = {
    classic: {
      name: 'Classic Green',
      bgClass: 'bg-slate-50 dark:bg-slate-950',
      myBubble: 'bg-emerald-700 text-white rounded-br-none',
      otherBubble: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none',
      textMy: 'text-emerald-200',
      textOther: 'text-slate-400',
      indicator: 'bg-emerald-600'
    },
    blue: {
      name: 'Ocean Blue',
      bgClass: 'bg-sky-50/50 dark:bg-slate-950 bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]',
      myBubble: 'bg-blue-600 text-white rounded-br-none shadow-sm',
      otherBubble: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none',
      textMy: 'text-blue-100',
      textOther: 'text-slate-400',
      indicator: 'bg-blue-500'
    },
    purple: {
      name: 'Lavender Purple',
      bgClass: 'bg-purple-50/50 dark:bg-slate-950 bg-[radial-gradient(#f3e8ff_1px,transparent_1px)] dark:bg-[radial-gradient(#2e1065_1px,transparent_1px)] [background-size:16px_16px]',
      myBubble: 'bg-purple-600 text-white rounded-br-none shadow-sm',
      otherBubble: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none',
      textMy: 'text-purple-100',
      textOther: 'text-slate-400',
      indicator: 'bg-purple-500'
    },
    sunset: {
      name: 'Sunset Glow',
      bgClass: 'bg-orange-50/50 dark:bg-slate-950 bg-[linear-gradient(to_bottom,rgba(254,242,242,0.4),rgba(255,237,213,0.4))]',
      myBubble: 'bg-orange-600 text-white rounded-br-none shadow-sm',
      otherBubble: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none',
      textMy: 'text-orange-100',
      textOther: 'text-slate-400',
      indicator: 'bg-orange-500'
    },
    forest: {
      name: 'Deep Forest',
      bgClass: 'bg-emerald-950/10 dark:bg-slate-950/40',
      myBubble: 'bg-teal-700 text-white rounded-br-none shadow-sm',
      otherBubble: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none',
      textMy: 'text-teal-100',
      textOther: 'text-slate-400',
      indicator: 'bg-teal-600'
    },
    dark_neon: {
      name: 'Dark Neon',
      bgClass: 'bg-slate-900 dark:bg-slate-950 text-slate-100',
      myBubble: 'bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-br-none shadow-md',
      otherBubble: 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-xs',
      textMy: 'text-emerald-300',
      textOther: 'text-slate-400',
      indicator: 'bg-emerald-500'
    }
  };

  const activeTheme = THEMES[chatTheme] || THEMES.classic;

  useEffect(() => {
    if (activeConversationId) {
      const savedTheme = localStorage.getItem(`chat_theme_${activeConversationId}`);
      setChatTheme(savedTheme || 'classic');
      setIsSelectionMode(false);
      setSelectedMessageIds([]);
      setShowThemePanel(false);
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

  if (!currentUserId) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 font-serif">
          প্রাইভেট মেসেজিংয়ে প্রবেশ করতে লগইন করুন
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          স্মার্ট খুলনা কমিউনিটিতে অন্য নাগরিক বা সেবাদাতার সাথে ব্যক্তিগত ও নিরাপদ বার্তা আদান-প্রদান করতে অনুগ্রহ করে আপনার একাউন্টে সাইন-ইন করুন।
        </p>
        <button
          onClick={onRequireAuth}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
        >
          গুগল দিয়ে লগইন করুন
        </button>
      </div>
    );
  }

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (conv.hiddenForUserIds?.includes(currentUserId)) return false;
    const otherParticipantUid = conv.participantIds.find(uid => uid !== currentUserId);
    const otherParticipant = otherParticipantUid ? conv.participants[otherParticipantUid] : null;
    const nameMatch = otherParticipant?.name.toLowerCase().includes(chatSearchQuery.toLowerCase());
    const lastMsgMatch = conv.lastMessage?.text.toLowerCase().includes(chatSearchQuery.toLowerCase());
    return nameMatch || lastMsgMatch;
  });

  // Get other participant in active conversation
  const otherParticipantUid = activeConv?.participantIds.find(uid => uid !== currentUserId);
  const otherParticipant: ConversationParticipant | undefined =
    otherParticipantUid && activeConv ? activeConv.participants[otherParticipantUid] : undefined;

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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden h-full flex flex-col md:flex-row">
      {/* LEFT COLUMN: CONVERSATION LIST */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 h-full ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* LIST HEADER */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <MessageCircle size={18} className="text-emerald-700" />
              মেসেজ
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <UserPlus size={13} /> নতুন চ্যাট
            </button>
          </div>

          {/* SEARCH CHATS */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={chatSearchQuery}
              onChange={e => setChatSearchQuery(e.target.value)}
              placeholder="চ্যাট অনুসন্ধান..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* CONVERSATION ITEMS */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <MessageCircle size={24} className="mx-auto text-slate-300" />
              <p>কোনো বার্তা বা কথোপকথন পাওয়া যায়নি।</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="text-emerald-700 hover:underline font-bold"
              >
                নতুন কথোপকথন শুরু করুন
              </button>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const otherUid = conv.participantIds.find(uid => uid !== currentUserId);
              const other = otherUid ? conv.participants[otherUid] : null;
              const unread = conv.unreadCounts?.[currentUserId] || 0;
              const isActive = conv.id === activeConversationId;

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setMobileShowChat(true);
                  }}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition cursor-pointer hover:bg-slate-100/70 ${
                    isActive ? 'bg-emerald-50/80 border-r-4 border-emerald-700' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={getSafeAvatarUrl(other?.avatar, other?.name, other?.uid)}
                      alt={other?.name || 'User'}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 bg-emerald-50"
                      onError={(e) => {
                        e.currentTarget.src = getSafeAvatarUrl('', other?.name, other?.uid);
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {other?.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {other?.name || 'ব্যবহারকারী'}
                      </h4>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {formatMessageTime(conv.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-slate-500 truncate">
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
        className={`flex-1 flex flex-col bg-white ${
          mobileShowChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConv && otherParticipant ? (
          <>
            {/* CHAT HEADER */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
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

                {/* Theme Palette Toggle */}
                <button
                  onClick={() => setShowThemePanel(!showThemePanel)}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    showThemePanel 
                      ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                  }`}
                  title="চ্যাট থিম পরিবর্তন করুন"
                >
                  <Palette size={16} />
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
                          setIsSelectionMode(true);
                          setSelectedMessageIds([]);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer font-medium"
                      >
                        <CheckSquare size={13} /> মেসেজ ডিলিট করুন (সিলেক্ট)
                      </button>
                      <button
                        onClick={() => {
                          setShowChatMenu(false);
                          onDeleteConversation(activeConv.id);
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
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
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

            {/* INLINE THEME PANEL */}
            {showThemePanel && (
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
                <div className="flex items-center gap-1.5">
                  <Palette size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">চ্যাট থিম নির্বাচন করুন:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(THEMES).map(([id, t]) => (
                    <button
                      key={id}
                      onClick={() => {
                        setChatTheme(id);
                        localStorage.setItem(`chat_theme_${activeConv.id}`, id);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition flex items-center gap-1.5 border cursor-pointer ${
                        chatTheme === id
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.indicator}`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES STREAM */}
            <div
              ref={scrollContainerRef}
              className={`flex-1 p-4 overflow-y-auto space-y-3 transition-all duration-300 ${activeTheme.bgClass}`}
            >
              {/* SECURITY NOTICE */}
              <div className="max-w-md mx-auto p-2 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-center text-[10px] text-emerald-900 flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-700" />
                <span>আপনার বার্তা সম্পূর্ণ ব্যক্তিগত। এডমিন বা তৃতীয় পক্ষ বার্তা দেখতে পারবে না।</span>
              </div>

              {currentMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  এখনও কোনো মেসেজ পাঠানো হয়নি। একটি শুভেচ্ছা বার্তা পাঠান!
                </div>
              ) : (
                currentMessages.map(msg => {
                  const isMine = msg.senderId === currentUserId;
                  const isSelected = selectedMessageIds.includes(msg.id);

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-center gap-2.5 w-full ${isMine ? 'justify-end' : 'justify-start'} ${
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
                      {/* Selection Checkbox */}
                      {isSelectionMode && (
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <CheckSquare size={16} className="text-red-500 fill-red-100 dark:fill-red-950/30" />
                          ) : (
                            <Square size={16} className="text-slate-400" />
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs relative group ${
                          isMine
                            ? activeTheme.myBubble
                            : activeTheme.otherBubble
                        }`}
                      >
                        {/* ATTACHED IMAGES */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-2 space-y-1.5">
                            {msg.attachments.map(att => (
                              <div key={att.id} className="rounded-xl overflow-hidden">
                                {att.type === 'image' ? (
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="max-h-56 object-cover rounded-xl"
                                  />
                                ) : (
                                  <a
                                    href={att.url}
                                    download={att.name}
                                    className={`flex items-center gap-2 p-2 rounded-xl text-xs ${
                                      isMine
                                        ? 'bg-black/25 text-white hover:bg-black/40'
                                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                                    }`}
                                  >
                                    <Paperclip size={13} />
                                    <span className="truncate max-w-xs">{att.name}</span>
                                    {att.size && <span className="opacity-70 text-[10px]">({att.size})</span>}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* MESSAGE TEXT */}
                        {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                        {/* TIME & READ STATUS */}
                        <div
                          className={`mt-1 flex items-center gap-1 text-[9px] ${
                            isMine ? `${activeTheme.textMy} justify-end` : activeTheme.textOther
                          }`}
                        >
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {isMine && (
                            <span>
                              {msg.isRead ? (
                                <CheckCheck size={11} className="text-emerald-300" />
                              ) : (
                                <Check size={11} />
                              )}
                            </span>
                          )}
                        </div>

                        {/* DELETE SINGLE MESSAGE BUTTON */}
                        {!isSelectionMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("আপনি কি এই মেসেজটি ডিলিট করতে চান?")) {
                                onDeleteMessage(activeConv.id, msg.id);
                              }
                            }}
                            className={`absolute -top-2 ${isMine ? '-left-2' : '-right-2'} bg-slate-800/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer z-10`}
                            title="মেসেজ মুছুন"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ATTACHMENTS PREVIEW BAR */}
            {attachments.length > 0 && (
              <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto">
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

            {/* INPUT FORM OR BULK SELECTION ACTION BAR */}
            {isSelectionMode ? (
              <div className="p-4 border-t border-red-100 dark:border-red-950/40 bg-red-50/50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
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
                    onClick={async () => {
                      if (selectedMessageIds.length === 0) {
                        alert("অনুগ্রহ করে অন্তত একটি মেসেজ সিলেক্ট করুন!");
                        return;
                      }
                      if (confirm(`আপনি কি নিশ্চিতভাবে এই ${selectedMessageIds.length}টি মেসেজ ডিলিট করতে চান?`)) {
                        try {
                          if (onDeleteMessages) {
                            onDeleteMessages(activeConv.id, selectedMessageIds);
                          } else {
                            // Loop delete if parent bulk delete prop is missing/not passed
                            await Promise.all(selectedMessageIds.map(id => onDeleteMessage(activeConv.id, id)));
                          }
                          setSelectedMessageIds([]);
                          setIsSelectionMode(false);
                          alert("সফলভাবে মেসেজসমূহ মুছে ফেলা হয়েছে।");
                        } catch (err) {
                          console.error(err);
                          alert("মেসেজগুলো মুছতে সমস্যা হয়েছে।");
                        }
                      }
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
                className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
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
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
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
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
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
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none placeholder:text-slate-400"
                />

                {/* SEND BUTTON */}
                <button
                  type="submit"
                  disabled={(!messageInput.trim() && attachments.length === 0) || isOtherBlocked}
                  className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl transition cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageCircle size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-700 font-serif">
              কোনো কথোপকথন নির্বাচিত নেই
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              বাম পাশের তালিকা থেকে একটি চ্যাট নির্বাচন করুন অথবা নতুন নাগরিকের সাথে কথোপকথন শুরু করুন।
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <UserPlus size={14} /> নতুন চ্যাট খুঁজুন
            </button>
          </div>
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
                .filter(u => u.uid !== currentUserId)
                .filter(
                  u =>
                    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    (u.district && u.district.toLowerCase().includes(userSearchQuery.toLowerCase()))
                )
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
    </div>
  );
};
