import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  X,
  Check,
  ChevronRight,
  Loader2,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  AiAssistantService,
  AiChatMessage
} from '../../services/aiAssistantService';

interface SmartKhulnaAiChatProps {
  currentUserName?: string | null;
  currentUserAvatar?: string;
  onBackToConversations?: () => void;
  isMobile?: boolean;
}

export const SmartKhulnaAiChat: React.FC<SmartKhulnaAiChatProps> = ({
  currentUserName,
  currentUserAvatar,
  onBackToConversations,
  isMobile = false,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>(() => {
    return AiAssistantService.loadHistory();
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  // Attachment states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);
  const [attachedMime, setAttachedMime] = useState<string | null>(null);

  // Voice recording / Speech-to-text states
  const [isListening, setIsListening] = useState(false);

  // Text-to-Speech audio playback states
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save messages to persistence
  useEffect(() => {
    AiAssistantService.saveHistory(messages);
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Quick suggestion chips
  const quickPrompts = [
    { label: '🚑 জরুরি অ্যাম্বুলেন্স নম্বর', query: 'খুলনায় জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সিলিন্ডারের নম্বর দিন।' },
    { label: '🩺 বিশেষজ্ঞ ডাক্তার', query: 'খুলনা মেডিকেল কলেজ বা শহরের সেরা মেডিসিন বিশেষজ্ঞ ডাক্তারের তথ্য দিন।' },
    { label: '🐅 সুন্দরবন ভ্রমণ গাইড', query: 'সুন্দরবন ভ্রমণের জন্য করমজল ও হারবাড়িয়া যাওয়ার উপায় এবং খরচ কেমন?' },
    { label: '🌊 জোয়ার-ভাটার সূচি', query: 'রূপসা নদী ও মোংলা বন্দরের আজকের জোয়ার-ভাটার সূচি ও উচ্চতা জানান।' },
    { label: '🩸 ও-নেগেটিভ রক্ত সন্ধান', query: 'জরুরি O Negative রক্ত প্রয়োজন হলে কীভাবে ডোনার খুঁজে পেতে পারি?' },
    { label: '💡 সাধারণ জ্ঞান বা কোডিং প্রশ্ন', query: 'যেকোনো প্রোগ্রামিং, কোডিং বা সাধারণ জ্ঞানের প্রশ্নের উত্তর দিতে পারেন?' },
  ];

  // Handle file/image attachment selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachedImage(result);
      setAttachedImageName(file.name);
      setAttachedMime(file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  /**
   * Voice Input (Speech-to-Text) via Web Speech API
   */
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজার ভয়েস রিকগনিশন সমর্থন করে না। দয়া করে গুগল ক্রোম ব্রাউজার ব্যবহার করুন।');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD'; // Bengali
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  /**
   * Text-to-Speech Voice Playback
   */
  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingMsgId === msgId) {
      // Stop playing
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setPlayingMsgId(null);
      return;
    }

    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      setIsSynthesizing(true);
      setLoadingMsgId(msgId); // temporary loading state

      const res = await AiAssistantService.synthesizeSpeech(text, 'Kore');
      if (res.audioUrl) {
        const audio = new Audio(res.audioUrl);
        audioPlayerRef.current = audio;
        setPlayingMsgId(msgId);

        audio.onended = () => {
          setPlayingMsgId(null);
          audioPlayerRef.current = null;
        };

        audio.onerror = () => {
          setPlayingMsgId(null);
          audioPlayerRef.current = null;
        };

        await audio.play();
      }
    } catch (err) {
      console.error('TTS playback error:', err);
      alert('ভয়েস প্লেব্যাক করতে সমস্যা হয়েছে।');
      setPlayingMsgId(null);
    } finally {
      setIsSynthesizing(false);
      setLoadingMsgId(null);
    }
  };

  const [loadingMsgId, setLoadingMsgId] = useState<string | null>(null);

  /**
   * Handle text message submit with optional attachment
   */
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text && !attachedImage) return;

    if (isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const promptText = text || (attachedImageName ? `ফাইল বিশ্লেষণ করুন: ${attachedImageName}` : 'ছবি বা ফাইল বিশ্লেষণ করুন');

    const newUserMsg: AiChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toISOString(),
      msgType: attachedImage ? 'image' : 'text',
      imageUrl: attachedImage || undefined,
    };

    const currentImageToSend = attachedImage;
    const currentMimeToSend = attachedMime;

    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setAttachedImage(null);
    setAttachedImageName(null);
    setAttachedMime(null);
    setIsLoading(true);
    setLoadingStage('স্মার্ট খুলনা এআই চিন্তা করছে...');

    try {
      const response = await AiAssistantService.sendMessage(
        promptText,
        [...messages, newUserMsg],
        currentImageToSend || undefined,
        currentMimeToSend || undefined
      );

      const aiMsgId = 'ai-' + Date.now();
      const newAiMsg: AiChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toISOString(),
        msgType: 'text',
      };

      setMessages(prev => [...prev, newAiMsg]);

      // Automatically synthesize speech or let user click play
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: AiChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: 'দুঃখিত, সংযোগে বা ফাইল বিশ্লেষণে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toISOString(),
        msgType: 'text',
        error: err.message || 'API request failed',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full w-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* 1. TOP HEADER */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          {onBackToConversations && (
            <button
              onClick={onBackToConversations}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
          )}

          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Bot size={22} className="animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif flex items-center gap-1">
                স্মার্ট খুলনা এআই
                <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                AI সহকারী
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
              ২৪/৭ সক্রিয় • ভয়েস ও ফাইল বিশ্লেষণ সমর্থিত
            </p>
          </div>
        </div>

        {/* Clear history */}
        <button
          onClick={() => {
            if (confirm('আপনি কি এআই চ্যাট হিস্ট্রি রিসেট করতে চান?')) {
              setMessages(AiAssistantService.clearHistory());
            }
          }}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
          title="চ্যাট হিস্ট্রি মুছুন"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* 2. CHAT MESSAGES AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 overscroll-contain">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isPlaying = playingMsgId === msg.id;
          const isThisLoadingAudio = loadingMsgId === msg.id && isSynthesizing;

          return (
            <div
              key={msg.id || idx}
              className={`flex gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="shrink-0 mt-0.5">
                {isUser ? (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 overflow-hidden border border-slate-300 dark:border-slate-600">
                    {currentUserAvatar ? (
                      <img src={currentUserAvatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User size={15} />
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                    <Bot size={16} />
                  </div>
                )}
              </div>

              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] text-slate-400">
                    {isUser ? (currentUserName || 'আপনি') : 'স্মার্ট খুলনা এআই'}
                  </span>
                  {!isUser && msg.text && (
                    <button
                      onClick={() => handlePlayAudio(msg.id, msg.text)}
                      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full transition cursor-pointer ${
                        isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                      }`}
                      title="ভয়েসে শুনুন"
                    >
                      {isThisLoadingAudio ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : isPlaying ? (
                        <Volume2 size={12} className="animate-bounce" />
                      ) : (
                        <Volume2 size={12} />
                      )}
                      <span>{isPlaying ? 'থামান' : 'ভয়েস শুনুন'}</span>
                    </button>
                  )}
                </div>

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-[13px] leading-relaxed break-words shadow-xs ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* If user attached an image */}
                  {msg.imageUrl && (
                    <div className="mb-2.5 rounded-xl overflow-hidden max-w-[240px] max-h-[240px] border border-white/20">
                      <img src={msg.imageUrl} alt="Uploaded Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {msg.text && (
                    <div className="whitespace-pre-wrap select-text">
                      {msg.text.split('\n').map((line, lIdx) => {
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={lIdx} className={line.trim() === '' ? 'h-2' : ''}>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className="font-bold">
                                    {p.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return p;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-slate-400">
                    {formatTime(msg.timestamp)}
                  </span>
                  {isUser && (
                    <Check size={12} className="text-emerald-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in-50">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Bot size={16} />
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>{loadingStage || 'স্মার্ট খুলনা এআই উত্তর তৈরি করছে...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. QUICK PROMPT SUGGESTION CHIPS */}
      <div className="px-3 sm:px-4 py-2 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles size={12} className="text-amber-500" /> সাজেশন:
        </span>
        {quickPrompts.map((qp, qIdx) => (
          <button
            key={qIdx}
            onClick={() => handleSendMessage(qp.query)}
            className="px-3 py-1 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-full text-[11px] font-medium whitespace-nowrap transition cursor-pointer shrink-0 shadow-2xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* 4. ATTACHMENT PREVIEW (IF ANY) */}
      {attachedImage && (
        <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-700 shrink-0 bg-white">
              <img src={attachedImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate max-w-[200px] sm:max-w-xs">
                {attachedImageName || 'সংযুক্ত ছবি'}
              </p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                বিশ্লেষণের জন্য প্রস্তুত • এআই এই ছবিটি দেখে উত্তর দেবে
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAttachedImage(null);
              setAttachedImageName(null);
              setAttachedMime(null);
            }}
            className="p-1.5 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200/60 dark:hover:bg-emerald-900/60 rounded-lg transition cursor-pointer"
            title="সংযুক্ত ফাইল সরান"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 5. LISTENING BANNER (IF VOICE INPUT ACTIVE) */}
      {isListening && (
        <div className="px-4 py-2 bg-red-500 text-white flex items-center justify-between text-xs animate-pulse shrink-0">
          <div className="flex items-center gap-2 font-bold">
            <Mic size={16} className="animate-bounce" />
            <span>শুনছি... আপনার মুখে কথা বলুন (বাংলায়)...</span>
          </div>
          <button
            onClick={() => setIsListening(false)}
            className="bg-white/20 px-2 py-1 rounded-lg text-white font-bold"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* 6. INPUT BAR WITH FILE, MIC & SEND */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.txt,.doc,.docx"
          className="hidden"
        />

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* File Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
            title="ছবি বা ফাইল সংযুক্ত করুন"
          >
            <Paperclip size={18} />
          </button>

          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-2.5 rounded-xl transition border cursor-pointer shrink-0 ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 border-slate-200 dark:border-slate-700'
            }`}
            title="মুখে কথা বলুন (Voice Speech-to-Text)"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={isListening ? 'কথা বলুন শুনছি...' : (attachedImage ? 'সংযুক্ত ছবি বা ফাইল সম্পর্কে কিছু লিখুন...' : 'প্রশ্ন করুন বা মুখে বলুন...')}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />

          <button
            type="submit"
            disabled={(!inputMessage.trim() && !attachedImage) || isLoading}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center shrink-0"
            title="পাঠান"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
