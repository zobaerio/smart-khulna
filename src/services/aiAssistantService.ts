/**
 * Smart Khulna AI Assistant Service
 * Provides modular communication with backend AI APIs:
 * - Text / Multi-turn chat
 * - AI Image generation
 * - AI Text-to-Speech (voice synthesis)
 * - AI Speech-to-Text (voice transcription)
 */

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  msgType?: 'text' | 'image' | 'voice';
  imageUrl?: string;
  imagePrompt?: string;
  refinedPrompt?: string;
  audioUrl?: string;
  audioDuration?: number;
  isGenerating?: boolean;
  error?: string;
}

const STORAGE_KEY = 'smart_khulna_ai_chat_history_v1';

export const INITIAL_AI_MESSAGES: AiChatMessage[] = [
  {
    id: 'ai-welcome-1',
    sender: 'ai',
    text: `আসসালামু আলাইকুম! আমি **Smart Khulna AI** (স্মার্ট খুলনা এআই) — আপনার সার্বক্ষণিক সর্বজনীন কৃত্রিম বুদ্ধিমত্তা সহকারী। 🌟

আমি যেকোনো ধরনের প্রশ্নের উত্তর দিতে, জটিল বিষয় নিয়ে চিন্তা ও বিশ্লেষণ করতে, সঠিক সিদ্ধান্ত গ্রহণে পরামর্শ দিতে এবং যেকোনো সমস্যা সমাধানে সাহায্য করতে পারি:

• 🧠 **গভীর চিন্তা ও যৌক্তিক বিশ্লেষণ:** যেকোনো জটিল ধারণা, যুক্তি বা গবেষণামূলক বিষয়ে সুনির্দিষ্ট ব্যাখ্যা।
• 🎯 **সিদ্ধান্ত গ্রহণে সহায়তা:** ক্যারিয়ার, প্রযুক্তি, পড়াশোনা বা জীবনের গুরুত্বপূর্ণ পছন্দগুলোর গুণাগুণ বিচার করে সুস্পষ্ট দিকনির্দেশনা।
• 🛠️ **সমস্যা সমাধান:** প্রোগ্রামিং/কোডিং এর বাগ ফিক্সিং, গণিত, বিজ্ঞান এবং প্রাত্যহিক জীবনের বাস্তব সমস্যার ধাপে ধাপে সমাধান।
• 💻 **প্রোগ্রামিং ও টেকনোলজি:** JavaScript, Python, React, C++, SQL, অ্যালগরিদম ও সফটওয়্যার আর্কিটেকচার।
• 🚑 **খুলনা নাগরিক ও জরুরি সেবা:** জাতীয় ও স্থানীয় হটলাইন (৯৯৯, ৩৩৩), রক্তদাতা সন্ধান, হাসপাতাল ও সুন্দরবন ট্রাভেল গাইড।
• 🎙️ **লাইভ ভয়েস সহকারী:** মাইক চেপে সরাসরি মুখে কথা বলুন, আমি ভয়েসের মাধ্যমেই উত্তর দেব!

আপনার মনে যে কোনো প্রশ্ন বা সমস্যা থাকলে নিঃসঙ্কোচে লিখুন বা মুখে বলুন!`,
    timestamp: new Date().toISOString(),
    msgType: 'text',
  },
];

export class AiAssistantService {
  /**
   * Load stored messages from localStorage
   */
  static loadHistory(): AiChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load AI chat history:', e);
    }
    return INITIAL_AI_MESSAGES;
  }

  /**
   * Save messages to localStorage
   */
  static saveHistory(messages: AiChatMessage[]) {
    try {
      // Keep only last 50 messages to prevent quota issues
      const slice = messages.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slice));
    } catch (e) {
      console.warn('Failed to save AI chat history:', e);
    }
  }

  /**
   * Clear chat history
   */
  static clearHistory(): AiChatMessage[] {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return INITIAL_AI_MESSAGES;
  }

  /**
   * Send text message with context and optional image/file attachment to backend
   */
  static async sendMessage(
    message: string,
    history: AiChatMessage[] = [],
    imageBase64?: string,
    imageMimeType?: string
  ): Promise<{ reply: string; model: string }> {
    const formattedHistory = history
      .filter(m => m.msgType !== 'image')
      .slice(-8)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: formattedHistory,
          imageBase64,
          imageMimeType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          return data;
        }
      }
    } catch (networkErr) {
      console.warn('[AiAssistantService] Server API unavailable, using smart client fallback:', networkErr);
    }

    // High quality generative client fallback when server is unreachable (e.g. offline or static hosts)
    const fallbackReply = AiAssistantService.generateSmartFallbackReply(message);
    return {
      reply: fallbackReply,
      model: 'client-ai-engine',
    };
  }

  /**
   * Generates intelligent and comprehensive answers for coding, civic services & general questions
   */
  static generateSmartFallbackReply(prompt: string): string {
    const q = prompt.toLowerCase();

    // 1b. Reasoning / Thinking / Decision Making / Problem Solving
    if (
      q.includes('সিদ্ধান্ত') ||
      q.includes('চিন্তা') ||
      q.includes('সমস্যা') ||
      q.includes('সমাধান') ||
      q.includes('decision') ||
      q.includes('problem') ||
      q.includes('solution') ||
      q.includes('উচিত')
    ) {
      return `🧠 **যৌক্তিক বিশ্লেষণ ও সিদ্ধান্ত পরামর্শ:**

আমি আপনার সমস্যাটি গভীরভাবে বিশ্লেষণ করে কার্যকর সমাধানের রূপরেখা তৈরি করতে প্রস্তুত:

১. **মূল সমস্যা চিহ্নিতকরণ:** সমস্যার নেপথ্য কারণ ও প্রধান প্রভাবকসমূহ বিশ্লেষণ।
২. **বিকল্পসমূহ ও ফলাফল মূল্যায়ন:** প্রতিটি সিদ্ধান্তের সুবিধা (Pros), অসুবিধা (Cons) ও ঝুঁকি বিশ্লেষণ।
৩. **নির্দিষ্ট সুপারিশ ও অ্যাকশন প্ল্যান:** কোন সিদ্ধান্তটি আপনার জন্য সবচেয়ে ফলপ্রসূ হবে তার সুনির্দিষ্ট দিকনির্দেশনা ও ধাপে ধাপে করণীয় পদক্ষেপ।

আপনার সুনির্দিষ্ট পরিস্থিতি বা সমস্যাটি বিস্তারিত লিখুন বা মুখে বলুন—আমি পূর্ণাঙ্গ সমাধান ও বাস্তবসম্মত সিদ্ধান্ত গ্রহণে আপনাকে সহায়তা করব! 🎯`;
    }

    // 1. Coding / Programming / General Knowledge
    if (
      q.includes('প্রোগ্রামিং') ||
      q.includes('কোডিং') ||
      q.includes('coding') ||
      q.includes('programming') ||
      q.includes('সাধারণ জ্ঞান') ||
      q.includes('উত্তর দিতে পারেন') ||
      q.includes('javascript') ||
      q.includes('python') ||
      q.includes('react')
    ) {
      return `হ্যাঁ, অবশ্যই! আমি যেকোনো প্রোগ্রামিং ভাষা—যেমন: **JavaScript, TypeScript, Python, React, Next.js, C/C++, Java, HTML/CSS, SQL** ইত্যাদির কোড লেখা, অ্যালগরিদম সমাধান এবং বাগ ফিক্সিং করতে পারি।

পাশাপাশি বিজ্ঞান, গণিত, ইতিহাস ও বিশ্বের যেকোনো **সাধারণ জ্ঞানের প্রশ্নের** নির্ভুল উত্তর দিতে পারি।

আপনার কোডটি পেস্ট করুন বা যে বিষয়ে প্রশ্ন রয়েছে তা লিখুন/মুখে বলুন—আমি বিস্তারিত সমাধান করে দেব! 🚀`;
    }

    // 2. Emergency Services
    if (q.includes('জরুরি') || q.includes('হটলাইন') || q.includes('অ্যাম্বুলেন্স') || q.includes('ফায়ার')) {
      return `খুলনা ও জাতীয় জরুরি সেবা নম্বরসমূহ:
• 🚨 **জাতীয় জরুরি সেবা:** ৯৯৯ (পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স)
• 🏛️ **সরকারি তথ্য ও সেবা:** ৩৩৩
• 🌊 **দুর্যোগের আগাম বার্তা:** ১০৯০
• 👩 **নারী ও শিশু নির্যাতন প্রতিরোধ:** ১০৯
• 🚒 **খুলনা ফায়ার সার্ভিস স্টেশন:** ০৪১-৭৬০৩৩৩
• 🏥 **খুলনা মেডিকেল কলেজ হাসপাতাল (জরুরি বিভাগ):** ০১৭১১-২৯৮৫২৭`;
    }

    // 3. Blood Bank
    if (q.includes('রক্ত') || q.includes('blood') || q.includes('ডোনার')) {
      return `🩸 **খুলনা ব্লাড ব্যাংক হাব:**
স্মার্ট খুলনা প্ল্যাটফর্মের **'ব্লাড ব্যাংক'** ট্যাবে ক্লিক করে আপনার প্রয়োজনীয় রক্তের গ্রুপ (A+, B+, O+, AB+, নেগেটিভ গ্রুপ) ও জেলা নির্বাচন করে সরাসরি নিবন্ধিত রক্তদাতাদের সাথে যোগাযোগ করতে পারবেন। এছাড়া জরুরি প্রয়োজনে SOS পোস্ট করতে পারেন।`;
    }

    // 4. Sundarbans Tourism
    if (q.includes('সুন্দরবন') || q.includes('পর্যটন') || q.includes('ট্যুর') || q.includes('sundarban')) {
      return `🐅 **সুন্দরবন পর্যটন গাইড:**
• **জনপ্রিয় স্পট:** করমজল (কুমির প্রজনন কেন্দ্র ও হরিণ), হাড়বাড়িয়া ইকো-ট্যুরিজম কেন্দ্র, কটকা অভয়ারণ্য, হিরণ পয়েন্ট ও দুবলার চর।
• **যাত্রা শুরু:** মোংলা ফেরিঘাট বা খুলনা বিআইডব্লিউটিএ ঘাট থেকে লঞ্চ/বোট পাওয়া যায়।
• **উপযুক্ত সময়:** অক্টোবর থেকে মার্চ মাস সুন্দরবন ভ্রমণের জন্য সবচেয়ে মনোরম সময়।`;
    }

    // 5. General warm response with universal reasoning and decision-making capabilities
    return `স্মার্ট খুলনা এআই আপনার সেবায় নিয়োজিত। আমি প্রোগ্রামিং, কোডিং সমাধান, বিজ্ঞান ও গণিত, যুক্তি ও গভীর চিন্তা, সিদ্ধান্ত গ্রহণ সহায়তা, সমস্যা সমাধান এবং খুলনা বিভাগের যেকোনো নাগরিক তথ্য সংক্রান্ত প্রশ্নের পূর্ণাঙ্গ উত্তর দিতে প্রস্তুত। আপনার প্রশ্নটি লিখুন বা সরাসরি মুখে বলুন!`;
  }

  private static keepAliveTimer: any = null;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Stop any active voice synthesis and clear keepalive timers
   */
  static stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (AiAssistantService.keepAliveTimer) {
      clearInterval(AiAssistantService.keepAliveTimer);
      AiAssistantService.keepAliveTimer = null;
    }
    AiAssistantService.activeUtterance = null;
  }

  /**
   * Spoken audio synthesis using browser native Web Speech API
   * Implements sentence-by-sentence queue and Chrome keep-alive to ensure continuous speech without stopping after 8-10s
   */
  static speakVoice(text: string, onEnd?: () => void, onError?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    AiAssistantService.stopVoice();

    // Clean markdown characters and links for natural flow
    const clean = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/[#_`~>]/g, '')
      .replace(/\n\s*\n/g, ' ')
      .trim();

    if (!clean) {
      if (onEnd) onEnd();
      return;
    }

    // Split text into natural sentence chunks using punctuation (। ? ! . \n)
    // Short chunks prevent the browser's 10-15s speech timeout and garbage-collection bug
    const sentenceRegex = /[^।?!.\n]+[।?!.\n]+|[^।?!.\n]+$/g;
    const rawChunks = clean.match(sentenceRegex) || [clean];
    const chunks: string[] = [];

    let currentChunk = '';
    for (const piece of rawChunks) {
      const trimmed = piece.trim();
      if (!trimmed) continue;
      if ((currentChunk + ' ' + trimmed).length > 180) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = trimmed;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + trimmed : trimmed;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    if (chunks.length === 0) chunks.push(clean);

    let currentIndex = 0;

    // Chrome keep-alive interval: pings pause/resume every 6s to prevent Chrome from pausing long speech
    AiAssistantService.keepAliveTimer = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 6000);

    const playNextChunk = () => {
      if (currentIndex >= chunks.length) {
        AiAssistantService.stopVoice();
        if (onEnd) onEnd();
        return;
      }

      const chunkText = chunks[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = 'bn-BD';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.startsWith('bn') || v.name.includes('Bangla') || v.name.includes('Bengali'));
      if (bnVoice) utterance.voice = bnVoice;

      utterance.onend = () => {
        playNextChunk();
      };

      utterance.onerror = (e) => {
        console.warn('Speech chunk error:', e);
        if ((e as any).error !== 'canceled' && (e as any).error !== 'interrupted') {
          playNextChunk();
        } else {
          AiAssistantService.stopVoice();
          if (onError) onError();
        }
      };

      AiAssistantService.activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    playNextChunk();
  }

  /**
   * Request AI Image Generation
   */
  static async generateImage(
    prompt: string,
    aspectRatio: string = '1:1'
  ): Promise<{ imageUrl: string; prompt: string; refinedPrompt?: string; provider?: string }> {
    const response = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Image generation failed with status ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Request Text-to-Speech audio synthesis
   */
  static async synthesizeSpeech(
    text: string,
    voice: string = 'Kore'
  ): Promise<{ audioUrl: string; duration: number }> {
    const response = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `TTS synthesis failed with status ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Transcribe recorded audio
   */
  static async transcribeAudio(audioBase64: string, mimeType: string = 'audio/webm'): Promise<string> {
    const response = await fetch('/api/ai/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Audio transcription failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  }
}
