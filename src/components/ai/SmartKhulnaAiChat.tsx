import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Image as ImageIcon,
  Paperclip,
  Download,
  Share2,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot,
  User,
  Trash2,
  Maximize2,
  X,
  Check,
  Clock,
  ChevronRight,
  AlertCircle,
  Loader2,
  FileQuestion,
  HelpCircle,
  Info
} from 'lucide-react';
import {
  AiAssistantService,
  AiChatMessage,
  INITIAL_AI_MESSAGES
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
  
  // Voice Input (Speech-to-text) States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  const recordingTimerRef = useRef<any>(null);

  // Auto Voice Output toggle
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);

  // Audio Playback state
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Image Generation Modal/Bar State
  const [showImagePromptBar, setShowImagePromptBar] = useState(false);
  const [imagePromptInput, setImagePromptInput] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');

  // Image Lightbox Preview
  const [previewImage, setPreviewImage] = useState<{ url: string; prompt: string } | null>(null);

  // Image Attachment for multimodal question
  const [selectedAttachment, setSelectedAttachment] = useState<{ base64: string; preview: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save messages to persistence
  useEffect(() => {
    AiAssistantService.saveHistory(messages);
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Cleanup audio player on unmount
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Quick suggestion chips
  const quickPrompts = [
    { label: '🚑 জরুরি অ্যাম্বুলেন্স নম্বর', query: 'খুলনায় জরুরি অ্যাম্বুলেন্স ও অক্সিজেন সিলিন্ডারের নম্বর দিন।' },
    { label: '🎨 ছবি তৈরি: রূপসা সেতু', isImage: true, prompt: 'একটি সুন্দর খুলনা রূপসা সেতুর সূর্যাস্তের দৃশ্য' },
    { label: '🩺 বিশেষজ্ঞ ডাক্তার', query: 'খুলনা মেডিকেল কলেজ বা শহরের সেরা মেডিসিন বিশেষজ্ঞ ডাক্তারের তথ্য দিন।' },
    { label: '🐅 সুন্দরবন ভ্রমণ গাইড', query: 'সুন্দরবন ভ্রমণের জন্য করমজল ও হারবাড়িয়া যাওয়ার উপায় এবং খরচ কেমন?' },
    { label: '🌊 জোয়ার-ভাটার সূচি', query: 'রূপসা নদী ও মোংলা বন্দরের আজকের জোয়ার-ভাটার সূচি ও উচ্চতা জানান।' },
    { label: '🩸 ও-নেগেটিভ রক্ত সন্ধান', query: 'জরুরি O Negative রক্ত প্রয়োজন হলে কীভাবে ডোনার খুঁজে পেতে পারি?' },
  ];

  /**
   * Handle text message submit
   */
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    const attachment = selectedAttachment;
    if (!text && !attachment) return;

    if (isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const newUserMsg: AiChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text || 'ছবি সম্পর্কিত তথ্য বিশ্লেষণ করুন',
      timestamp: new Date().toISOString(),
      msgType: 'text',
      imageUrl: attachment ? attachment.preview : undefined,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setSelectedAttachment(null);
    setIsLoading(true);
    setLoadingStage('স্মার্ট খুলনা এআই চিন্তা করছে...');

    try {
      const response = await AiAssistantService.sendMessage(
        text,
        [...messages, newUserMsg],
        attachment ? attachment.base64 : undefined
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

      // If auto voice playback is turned on, speak response
      if (autoPlayVoice) {
        triggerSpeechForMessage(aiMsgId, response.reply);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: AiChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: 'দুঃখিত, সংযোগে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা আপনার প্রশ্নটি পুনরায় লিখুন।',
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

  /**
   * Handle Image Generation Submit
   */
  const handleGenerateImage = async (promptToGen?: string) => {
    const prompt = (promptToGen || imagePromptInput || inputMessage).trim();
    if (!prompt) return;

    setShowImagePromptBar(false);
    setImagePromptInput('');
    setInputMessage('');

    // Add user message for record
    const userMsgId = 'user-img-' + Date.now();
    const userMsg: AiChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: `🎨 ছবি তৈরি: "${prompt}"`,
      timestamp: new Date().toISOString(),
      msgType: 'text',
    };

    // Add temporary loading placeholder message
    const placeholderId = 'ai-img-loading-' + Date.now();
    const placeholderMsg: AiChatMessage = {
      id: placeholderId,
      sender: 'ai',
      text: `"${prompt}"-এর জন্য ছবি তৈরি করা হচ্ছে...`,
      timestamp: new Date().toISOString(),
      msgType: 'image',
      imagePrompt: prompt,
      isGenerating: true,
    };

    setMessages(prev => [...prev, userMsg, placeholderMsg]);
    setIsLoading(true);
    setLoadingStage('ছবি তৈরি হচ্ছে: প্রম্পট অপ্টিমাইজ ও আর্টওয়ার্ক জেনারেট হচ্ছে...');

    try {
      const result = await AiAssistantService.generateImage(prompt, selectedAspectRatio);

      setMessages(prev =>
        prev.map(m => {
          if (m.id === placeholderId) {
            return {
              ...m,
              id: 'ai-img-' + Date.now(),
              text: `আপনার অনুরোধ অনুযায়ী তৈরি করা ছবি:`,
              imageUrl: result.imageUrl,
              imagePrompt: prompt,
              refinedPrompt: result.refinedPrompt,
              isGenerating: false,
            };
          }
          return m;
        })
      );
    } catch (err: any) {
      console.error('Image gen error:', err);
      setMessages(prev =>
        prev.map(m => {
          if (m.id === placeholderId) {
            return {
              ...m,
              isGenerating: false,
              text: 'দুঃখিত, ছবিটি তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
              error: err.message,
            };
          }
          return m;
        })
      );
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  /**
   * Trigger Text-to-Speech for a specific message
   */
  const triggerSpeechForMessage = async (messageId: string, text: string) => {
    // Check if message already has audioUrl
    const targetMsg = messages.find(m => m.id === messageId);
    if (targetMsg?.audioUrl) {
      playAudio(messageId, targetMsg.audioUrl);
      return;
    }

    setLoadingStage('ভয়েস তৈরি হচ্ছে...');
    try {
      const result = await AiAssistantService.synthesizeSpeech(text);
      if (result.audioUrl) {
        setMessages(prev =>
          prev.map(m =>
            m.id === messageId
              ? { ...m, audioUrl: result.audioUrl, audioDuration: result.duration }
              : m
          )
        );
        playAudio(messageId, result.audioUrl);
      }
    } catch (err) {
      console.error('TTS error:', err);
      alert('ভয়েস অডিও তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setLoadingStage('');
    }
  };

  /**
   * Play audio URL
   */
  const playAudio = (messageId: string, audioUrl: string) => {
    if (playingMessageId === messageId && audioPlayerRef.current) {
      if (audioPlayerRef.current.paused) {
        audioPlayerRef.current.play();
      } else {
        audioPlayerRef.current.pause();
        setPlayingMessageId(null);
      }
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    setPlayingMessageId(messageId);
    setAudioProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setPlayingMessageId(null);
      setAudioProgress(0);
    };

    audio.onerror = () => {
      setPlayingMessageId(null);
    };

    audio.play().catch(e => console.warn('Audio play error:', e));
  };

  /**
   * Voice Input - Start recording with SpeechRecognition or MediaRecorder
   */
  const startVoiceRecording = () => {
    // Try browser SpeechRecognition API first (Chrome/Android/Edge natively supports Bangla)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'bn-BD';

        recognition.onstart = () => {
          setIsRecording(true);
          setRecordingSeconds(0);
          recordingTimerRef.current = setInterval(() => {
            setRecordingSeconds(s => s + 1);
          }, 1000);
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputMessage(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          stopVoiceRecording();
        };

        recognition.onend = () => {
          stopVoiceRecording();
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('Web Speech API failed, falling back to MediaRecorder:', err);
      }
    }

    // Fallback: MediaRecorder with server transcription
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());

            // Convert to base64 and transcribe on server
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              if (base64) {
                setIsLoading(true);
                setLoadingStage('রেকর্ড করা অডিও কথা অনুবাদ হচ্ছে...');
                try {
                  const text = await AiAssistantService.transcribeAudio(base64, 'audio/webm');
                  if (text) {
                    setInputMessage(text);
                    handleSendMessage(text);
                  }
                } catch (err) {
                  console.error('Transcription error:', err);
                } finally {
                  setIsLoading(false);
                  setLoadingStage('');
                }
              }
            };
            reader.readAsDataURL(audioBlob);
          };

          mediaRecorder.start();
          setIsRecording(true);
          setRecordingSeconds(0);
          recordingTimerRef.current = setInterval(() => {
            setRecordingSeconds(s => s + 1);
          }, 1000);
        })
        .catch(err => {
          console.error('Microphone access denied:', err);
          alert('মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজার সেটিংসে পারমিশন দিন।');
        });
    } else {
      alert('আপনার ব্রাউজারে ভয়েস রেকর্ড সাপোর্ট নেই।');
    }
  };

  /**
   * Stop voice recording
   */
  const stopVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
  };

  /**
   * Cancel voice recording
   */
  const cancelVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.abort();
      } catch (e) {}
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  /**
   * Attachment File Handler
   */
  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ফাইলের আকার সর্বোচ্চ ১০ মেগাবাইট হতে পারে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedAttachment({
        base64,
        preview: base64,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  /**
   * Download generated image
   */
  const handleDownloadImage = (url: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-khulna-ai-${Date.now()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Share generated image
   */
  const handleShareImage = async (url: string, prompt: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'স্মার্ট খুলনা এআই দিয়ে তৈরি ছবি',
          text: `প্রম্পট: "${prompt}" - স্মার্ট খুলনা এআই`,
          url: url,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(url);
      alert('ছবির লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!');
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

          {/* AI Avatar with pulsing status indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Bot size={22} className="animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
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
              ২৪/৭ সক্রিয় • টেক্সট, ছবি ও ভয়েস সাপোর্ট
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Auto voice output toggle */}
          <button
            onClick={() => setAutoPlayVoice(!autoPlayVoice)}
            className={`p-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1 border ${
              autoPlayVoice
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300'
                : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
            title={autoPlayVoice ? 'ভয়েস অটো-প্লে চালু' : 'ভয়েস অটো-প্লে বন্ধ'}
          >
            {autoPlayVoice ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline text-[11px]">ভয়েস</span>
          </button>

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
      </div>

      {/* 2. CHAT MESSAGES AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 overscroll-contain">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id || idx}
              className={`flex gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Message Avatar */}
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

              {/* Message Bubble Content */}
              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Sender Name */}
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {isUser ? (currentUserName || 'আপনি') : 'স্মার্ট খুলনা এআই'}
                </span>

                <div
                  className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-[13px] leading-relaxed break-words shadow-xs ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Attached user image preview if any */}
                  {msg.imageUrl && isUser && (
                    <div className="mb-2.5 rounded-xl overflow-hidden max-w-xs border border-white/20">
                      <img src={msg.imageUrl} alt="Attached" className="w-full h-auto object-cover max-h-60" />
                    </div>
                  )}

                  {/* 1. TEXT CONTENT */}
                  {msg.text && (
                    <div className="whitespace-pre-wrap select-text">
                      {msg.text.split('\n').map((line, lIdx) => {
                        // Bold formatting support for **text**
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

                  {/* 2. GENERATED IMAGE CARD */}
                  {msg.msgType === 'image' && (
                    <div className="mt-3 w-full">
                      {msg.isGenerating ? (
                        <div className="w-full aspect-square max-w-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-emerald-500/40 flex flex-col items-center justify-center p-6 text-center animate-pulse">
                          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            ছবি তৈরি হচ্ছে...
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                            "{msg.imagePrompt}"
                          </p>
                        </div>
                      ) : msg.imageUrl ? (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-md">
                          <div className="relative group cursor-pointer" onClick={() => setPreviewImage({ url: msg.imageUrl!, prompt: msg.imagePrompt || '' })}>
                            <img
                              src={msg.imageUrl}
                              alt={msg.imagePrompt || 'AI Generated Image'}
                              className="w-full max-w-md h-auto object-cover rounded-t-2xl transition duration-200 group-hover:brightness-95"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-xs text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition">
                              <Maximize2 size={14} />
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                              <Sparkles size={11} className="text-amber-400" />
                              AI Generated
                            </div>
                          </div>

                          {/* Image Prompt details */}
                          {msg.imagePrompt && (
                            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                                "{msg.imagePrompt}"
                              </p>

                              {/* Action Buttons: Save, Share, Regenerate */}
                              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadImage(msg.imageUrl!, msg.imagePrompt!)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Download size={12} /> সংরক্ষণ
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleShareImage(msg.imageUrl!, msg.imagePrompt!)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Share2 size={12} /> শেয়ার
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleGenerateImage(msg.imagePrompt)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ml-auto"
                                  title="পুনরায় ছবি তৈরি করুন"
                                >
                                  <RefreshCw size={12} /> আবার বানান
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* 3. VOICE AUDIO CARD */}
                  {msg.audioUrl && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => playAudio(msg.id, msg.audioUrl!)}
                        className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
                      >
                        {playingMessageId === msg.id ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                      </button>

                      {/* Waveform Visualization Bars */}
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-1 h-5">
                          {[40, 75, 20, 90, 50, 80, 30, 60, 100, 45, 70, 35, 85, 25, 65, 40].map((h, bIdx) => (
                            <span
                              key={bIdx}
                              style={{ height: `${h}%` }}
                              className={`w-1 rounded-full transition-all duration-200 ${
                                playingMessageId === msg.id
                                  ? 'bg-emerald-600 dark:bg-emerald-400 animate-pulse'
                                  : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{playingMessageId === msg.id ? 'বাজছে...' : 'স্মার্ট ভয়েস বার্তা'}</span>
                          {msg.audioDuration && <span>{msg.audioDuration}s</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => playAudio(msg.id, msg.audioUrl!)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition"
                        title="পুনরায় শুনুন"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  )}

                  {/* AI Quick Actions (Audio / Copy) on standard text */}
                  {!isUser && !msg.isGenerating && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => triggerSpeechForMessage(msg.id, msg.text)}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={13} />
                        {msg.audioUrl ? 'ভয়েস প্লে করুন' : 'ভয়েসে শুনুন'}
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          alert('মেসেজটি কপি করা হয়েছে!');
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer"
                      >
                        কপি
                      </button>
                    </div>
                  )}
                </div>

                {/* Timestamp & Status */}
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

        {/* Loading Indicator */}
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
            onClick={() => {
              if (qp.isImage && qp.prompt) {
                handleGenerateImage(qp.prompt);
              } else if (qp.query) {
                handleSendMessage(qp.query);
              }
            }}
            className="px-3 py-1 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-full text-[11px] font-medium whitespace-nowrap transition cursor-pointer shrink-0 shadow-2xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* 4. IMAGE GENERATION PROMPT DRAWER/BAR */}
      {showImagePromptBar && (
        <div className="p-3 bg-emerald-50 dark:bg-slate-900 border-t border-emerald-200 dark:border-emerald-800/80 flex flex-col gap-2 shrink-0 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 font-serif">
              <Sparkles size={14} className="text-amber-500 fill-amber-500" />
              এআই দিয়ে নতুন ছবি তৈরি করুন (AI Image Generation)
            </span>
            <button
              onClick={() => setShowImagePromptBar(false)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
            >
              <X size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={imagePromptInput}
              onChange={e => setImagePromptInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateImage();
                }
              }}
              placeholder="যেমন: একটি সুন্দর খুলনা শহরের দৃশ্য, সুন্দরবনের রয়েল বেঙ্গল টাইগার..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              autoFocus
            />

            {/* Aspect Ratio Selector */}
            <select
              value={selectedAspectRatio}
              onChange={e => setSelectedAspectRatio(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="1:1">১:১ (বর্গাকার)</option>
              <option value="16:9">১৬:৯ (ওয়াইড)</option>
              <option value="9:16">৯:১৬ (পোর্ট্রেট)</option>
            </select>

            <button
              type="button"
              onClick={() => handleGenerateImage()}
              disabled={!imagePromptInput.trim() || isLoading}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles size={14} /> তৈরি করুন
            </button>
          </div>
        </div>
      )}

      {/* 5. RECORDING ACTIVE OVERLAY */}
      {isRecording && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-900 flex items-center justify-between gap-3 shrink-0 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400">
              রেকর্ডিং হচ্ছে... ({recordingSeconds}s)
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              আপনার প্রশ্ন বাংলায় বলুন, শেষ হলে থামান বাটনে চাপ দিন
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cancelVoiceRecording}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={stopVoiceRecording}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MicOff size={14} /> থামান ও পাঠান
            </button>
          </div>
        </div>
      )}

      {/* 6. INPUT BAR */}
      {!isRecording && (
        <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {/* Selected Attachment preview */}
          {selectedAttachment && (
            <div className="mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between max-w-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <img src={selectedAttachment.preview} alt="Upload" className="w-9 h-9 rounded-lg object-cover" />
                <span className="text-xs text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {selectedAttachment.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Generate Image button */}
            <button
              type="button"
              onClick={() => setShowImagePromptBar(!showImagePromptBar)}
              className={`p-2 rounded-xl transition cursor-pointer shrink-0 border ${
                showImagePromptBar
                  ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
              title="এআই ছবি তৈরি করুন"
            >
              <Sparkles size={17} className={showImagePromptBar ? 'text-amber-600 fill-amber-600' : ''} />
            </button>

            {/* Image attachment button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAttachmentSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer shrink-0"
              title="ছবি সংযুক্তি (AI Analysis)"
            >
              <Paperclip size={17} />
            </button>

            {/* Microphone button */}
            <button
              type="button"
              onClick={startVoiceRecording}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer shrink-0"
              title="মুখে কথা বলুন (ভয়েস ইনপুট)"
            >
              <Mic size={17} />
            </button>

            {/* Text Input area */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                rows={1}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="স্মার্ট খুলনা এআই-কে কিছু জিজ্ঞেস করুন..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-[13px] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none resize-none max-h-24"
              />
            </div>

            {/* Send button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={(!inputMessage.trim() && !selectedAttachment) || isLoading}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shrink-0 shadow-xs"
              title="বার্তা পাঠান"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 7. IMAGE LIGHTBOX PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="text-xs font-bold truncate max-w-md">
                🎨 {previewImage.prompt}
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/40">
              <img
                src={previewImage.url}
                alt={previewImage.prompt}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-3.5 border-t border-slate-800 bg-slate-900 flex items-center justify-end gap-2">
              <button
                onClick={() => handleDownloadImage(previewImage.url, previewImage.prompt)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download size={14} /> ডাউনলোড করুন
              </button>
              <button
                onClick={() => handleShareImage(previewImage.url, previewImage.prompt)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 size={14} /> শেয়ার
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
