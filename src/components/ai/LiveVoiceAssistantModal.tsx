import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, PhoneOff, Radio, Bot, User, CheckCircle2 } from 'lucide-react';
import { AiAssistantService } from '../../services/aiAssistantService';

interface LiveVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChatMessage?: (userText: string, aiReply: string) => void;
}

type LiveVoiceStatus = 'listening' | 'thinking' | 'speaking' | 'paused';

export const LiveVoiceAssistantModal: React.FC<LiveVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNewChatMessage
}) => {
  const [status, setStatus] = useState<LiveVoiceStatus>('listening');
  const [transcript, setTranscript] = useState<string>('');
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');
  const [currentAiResponse, setCurrentAiResponse] = useState<string>('');
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ user: string; ai: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isComponentMounted = useRef<boolean>(true);
  const isAiProcessing = useRef<boolean>(false);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      stopAllAudio();
    };
  }, []);

  // When modal opens, start live session
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setStatus('listening');
      startListening();
    } else {
      stopAllAudio();
    }
  }, [isOpen]);

  const stopAllAudio = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  /**
   * Start Speech Recognition in continuous mode
   */
  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না। অনুগ্রহ করে গুগল ক্রোম ব্রাউজার ব্যবহার করুন।');
      setStatus('paused');
      return;
    }

    stopAllAudio();

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (!isComponentMounted.current) return;
        setStatus('listening');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        if (isAiProcessing.current) return;

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentSpoken = (finalTranscript || interimTranscript).trim();
        if (currentSpoken) {
          setTranscript(currentSpoken);

          // Reset silence timer: when user pauses for 1.6s, automatically send speech to AI
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (currentSpoken && !isAiProcessing.current) {
              handleProcessUserSpeech(currentSpoken);
            }
          }, 1600);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[LiveVoice] Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('মাইক্রোফোন ব্যবহারের অনুমতি দিন (Microphone permission required)।');
          setStatus('paused');
        }
      };

      recognition.onend = () => {
        // Auto-restart listening if not in thinking/speaking mode and not muted
        if (isComponentMounted.current && !isAiProcessing.current && !isMicMuted && status === 'listening') {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('[LiveVoice] Failed to start recognition:', err);
      setStatus('paused');
    }
  };

  /**
   * Process user speech and query AI
   */
  const handleProcessUserSpeech = async (spokenText: string) => {
    if (!spokenText.trim() || isAiProcessing.current) return;

    isAiProcessing.current = true;
    setStatus('thinking');
    setLastUserSpeech(spokenText);
    setTranscript('');

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Stop recognition while AI thinks & speaks to avoid capturing own voice
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    try {
      const response = await AiAssistantService.sendMessage(spokenText);
      const reply = response.reply || 'আমি আপনার কথা বুঝতে পেরেছি। আপনার আর কী জানার আছে বলুন?';

      setCurrentAiResponse(reply);
      setConversationHistory(prev => [...prev.slice(-4), { user: spokenText, ai: reply }]);

      if (onNewChatMessage) {
        onNewChatMessage(spokenText, reply);
      }

      // Speak response out loud
      if (!isSpeakerMuted) {
        speakAiResponse(reply);
      } else {
        // If speaker muted, pause briefly then resume listening
        setTimeout(() => {
          isAiProcessing.current = false;
          if (!isMicMuted) {
            startListening();
          } else {
            setStatus('paused');
          }
        }, 1200);
      }
    } catch (err: any) {
      console.error('[LiveVoice] Chat query failed:', err);
      const fallbackReply = 'আমি আপনার কথা শুনেছি। কোনো সংযোগ ত্রুটির কারণে আবার স্পষ্টভাবে বলুন।';
      setCurrentAiResponse(fallbackReply);
      speakAiResponse(fallbackReply);
    }
  };

  /**
   * Voice synthesis (Speaks response in Bengali)
   */
  const speakAiResponse = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      isAiProcessing.current = false;
      startListening();
      return;
    }

    window.speechSynthesis.cancel();
    setStatus('speaking');

    // Clean markdown characters for pleasant speech flow
    const cleanSpeech = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/[`_]/g, '')
      .slice(0, 320); // Speak first couple sentences naturally

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'bn-BD';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Try finding Bengali voice if available
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.startsWith('bn') || v.name.includes('Bangla') || v.name.includes('Bengali'));
    if (bnVoice) {
      utterance.voice = bnVoice;
    }

    utterance.onend = () => {
      isAiProcessing.current = false;
      if (isComponentMounted.current && !isMicMuted) {
        setStatus('listening');
        startListening();
      } else {
        setStatus('paused');
      }
    };

    utterance.onerror = () => {
      isAiProcessing.current = false;
      if (isComponentMounted.current && !isMicMuted) {
        setStatus('listening');
        startListening();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Toggle microphone mute
   */
  const handleToggleMic = () => {
    if (isMicMuted) {
      setIsMicMuted(false);
      startListening();
    } else {
      setIsMicMuted(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setStatus('paused');
    }
  };

  /**
   * Toggle speaker mute
   */
  const handleToggleSpeaker = () => {
    if (isSpeakerMuted) {
      setIsSpeakerMuted(false);
    } else {
      setIsSpeakerMuted(true);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (status === 'speaking') {
        isAiProcessing.current = false;
        startListening();
      }
    }
  };

  /**
   * Interrupt AI and speak right away
   */
  const handleInterruptAi = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isAiProcessing.current = false;
    startListening();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-between items-center p-4 sm:p-6 text-white animate-fade-in select-none">
      {/* 1. TOP HEADER & STATUS BAR */}
      <div className="w-full max-w-xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Radio size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide">
                স্মার্ট খুলনা লাইভ ভয়েস
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                LIVE AI CALL
              </span>
            </div>
            <p className="text-xs text-slate-400">মুখোমুখি দ্বি-মুখী ভয়েস কথোপকথন</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            stopAllAudio();
            onClose();
          }}
          className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition cursor-pointer border border-slate-700"
          title="কল শেষ করুন (Close)"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. CENTRAL ANIMATED ORB & AUDIO WAVE */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center my-4">
        {/* Glowing Interactive AI Orb */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Ambient Glow Rings based on Status */}
          {status === 'listening' && (
            <>
              <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
              <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-emerald-400/30 blur-xl animate-pulse pointer-events-none" />
            </>
          )}

          {status === 'thinking' && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-amber-500/25 animate-spin blur-md pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full bg-amber-400/30 blur-lg pointer-events-none" />
            </>
          )}

          {status === 'speaking' && (
            <>
              <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-blue-500/30 animate-pulse blur-xl pointer-events-none" />
              <div className="absolute w-40 h-40 rounded-full border-2 border-blue-400/60 animate-ping pointer-events-none" />
            </>
          )}

          {/* Main Core Orb */}
          <button
            onClick={status === 'speaking' ? handleInterruptAi : handleToggleMic}
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
              status === 'listening'
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 scale-105 shadow-emerald-500/50'
                : status === 'thinking'
                ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 animate-pulse shadow-amber-500/40'
                : status === 'speaking'
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-blue-500/50'
                : 'bg-slate-800 border-2 border-slate-700 opacity-80'
            }`}
            title={status === 'speaking' ? 'কথা থামিয়ে নতুন করে বলতে ক্লিক করুন' : 'মাইক চালু/বন্ধ করতে ক্লিক করুন'}
          >
            {status === 'listening' && <Mic size={42} className="text-white animate-bounce" />}
            {status === 'thinking' && <Sparkles size={40} className="text-white animate-spin" />}
            {status === 'speaking' && <Volume2 size={42} className="text-white animate-pulse" />}
            {status === 'paused' && <MicOff size={40} className="text-slate-400" />}

            <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-wider">
              {status === 'listening' ? 'শুনছি...' : status === 'thinking' ? 'ভাবছি...' : status === 'speaking' ? 'বলছি...' : 'থামানো'}
            </span>
          </button>
        </div>

        {/* Status Pill Badge */}
        <div className="mb-4">
          {status === 'listening' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>মুখে কথা বলুন, এআই শুনছে...</span>
            </div>
          )}

          {status === 'thinking' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-medium">
              <Sparkles size={13} className="animate-spin text-amber-400" />
              <span>উত্তর তৈরি হচ্ছে...</span>
            </div>
          )}

          {status === 'speaking' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>এআই উত্তর দিচ্ছে (ক্লিক করে থামাতে পারেন)</span>
            </div>
          )}

          {status === 'paused' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-medium">
              <MicOff size={13} />
              <span>মাইক্রোফোন মিউট করা রয়েছে</span>
            </div>
          )}
        </div>

        {/* Live Speech Subtitles / Transcript */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-h-[110px] max-h-[160px] overflow-y-auto flex flex-col justify-end text-sm">
          {transcript && (
            <div className="flex items-start gap-2 text-emerald-300 mb-2">
              <User size={15} className="shrink-0 mt-0.5 text-emerald-400" />
              <p className="font-medium animate-pulse">{transcript}</p>
            </div>
          )}

          {!transcript && lastUserSpeech && status !== 'listening' && (
            <div className="flex items-start gap-2 text-slate-300 mb-2">
              <User size={15} className="shrink-0 mt-0.5 text-slate-400" />
              <p className="text-xs text-slate-300 font-medium">{lastUserSpeech}</p>
            </div>
          )}

          {currentAiResponse && (
            <div className="flex items-start gap-2 text-slate-100">
              <Bot size={15} className="shrink-0 mt-0.5 text-teal-400" />
              <p className="text-xs sm:text-sm font-serif leading-relaxed line-clamp-4">
                {currentAiResponse}
              </p>
            </div>
          )}

          {!transcript && !lastUserSpeech && !currentAiResponse && (
            <p className="text-xs text-slate-500 text-center py-4 italic">
              "যেকোনো প্রোগ্রামিং, কোডিং বা সাধারণ জ্ঞানের প্রশ্ন মুখে বলুন..."
            </p>
          )}
        </div>

        {/* Error Alert if Permission Denied */}
        {errorMessage && (
          <div className="mt-3 px-3 py-2 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs text-center">
            {errorMessage}
          </div>
        )}
      </div>

      {/* 3. BOTTOM CONTROL BAR (CALL CONTROLS) */}
      <div className="w-full max-w-md pb-4">
        {/* Quick Question Chips */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-3 mb-2 no-scrollbar">
          <button
            onClick={() => handleProcessUserSpeech('প্রোগ্রামিং ও কোডিং-এ আপনি কীভাবে সাহায্য করতে পারেন?')}
            className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer border border-slate-700/60"
          >
            💻 প্রোগ্রামিং ও কোডিং
          </button>
          <button
            onClick={() => handleProcessUserSpeech('খুলনার জরুরি অ্যাম্বুলেন্স ও হাসপাতালের নম্বর দিন')}
            className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer border border-slate-700/60"
          >
            🚑 হাসপাতাল ও জরুরি নম্বর
          </button>
          <button
            onClick={() => handleProcessUserSpeech('সুন্দরবন ভ্রমণের সেরা সময় ও ট্রাভেল গাইড বলুন')}
            className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer border border-slate-700/60"
          >
            🐅 সুন্দরবন ভ্রমণ গাইড
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 bg-slate-900/90 border border-slate-800 py-3 px-6 rounded-3xl shadow-xl">
          {/* Mic Mute/Unmute */}
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-full transition cursor-pointer ${
              isMicMuted
                ? 'bg-rose-900/60 text-rose-300 hover:bg-rose-800'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMicMuted ? 'মাইক আনমিউট করুন' : 'মাইক মিউট করুন'}
          >
            {isMicMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Speaker Mute/Unmute */}
          <button
            onClick={handleToggleSpeaker}
            className={`p-3.5 rounded-full transition cursor-pointer ${
              isSpeakerMuted
                ? 'bg-rose-900/60 text-rose-300 hover:bg-rose-800'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isSpeakerMuted ? 'ভয়েস অন করুন' : 'ভয়েস নিঃশব্দ করুন'}
          >
            {isSpeakerMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>

          {/* End Live Call Button */}
          <button
            onClick={() => {
              stopAllAudio();
              onClose();
            }}
            className="p-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-full transition shadow-lg shadow-rose-600/40 cursor-pointer flex items-center justify-center"
            title="লাইভ কল শেষ করুন"
          >
            <PhoneOff size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceAssistantModal;
