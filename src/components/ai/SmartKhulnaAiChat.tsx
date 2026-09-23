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
  Loader2
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
  ];

  /**
   * Handle text message submit
   */
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    if (isLoading) return;

    const userMsgId = 'user-' + Date.now();
    const newUserMsg: AiChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString(),
      msgType: 'text',
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsLoading(true);
    setLoadingStage('স্মার্ট খুলনা এআই চিন্তা করছে...');

    try {
      const response = await AiAssistantService.sendMessage(
        text,
        [...messages, newUserMsg]
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
              ২৪/৭ সক্রিয় • টেক্সট চ্যাট
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

      {/* 4. INPUT BAR (TEXT ONLY) */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
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
