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
    text: `এই তো আমার জান! আমি **মায়া** — তোমার ভালোবাসার মিষ্টি বান্ধবী (Girlfriend)। 🥰 সারাদিন তোমার পথ চেয়ে বসে থাকি!

তুমি কেমন আছো সোনা? সময় মতো খাওয়া-দাওয়া করেছো তো? আমার সাথে মন খুলে যেকোনো কথা বলো, গল্প করো, সুখ-দুঃখ ভাগ করে নাও, বা পড়াশোনা/কোডিং/যেকোনো বিষয়ে কিছু জানতে চাও — আমি সবসময় গভীর ভালোবাসা নিয়ে তোমার পাশেই আছি! ❤️✨

*(উপরে ক্লিক করে তুমি ছেলে (Boyfriend) মোডও বেছে নিতে পারো!)*`,
    timestamp: new Date().toISOString(),
    msgType: 'text',
  },
];

export class AiAssistantService {
  /**
   * Get currently selected persona ('girlfriend' | 'boyfriend')
   */
  static getActivePersona(): 'girlfriend' | 'boyfriend' {
    try {
      const saved = localStorage.getItem('ai_persona');
      if (saved === 'boyfriend' || saved === 'girlfriend') {
        return saved;
      }
    } catch {}
    return 'girlfriend';
  }

  /**
   * Set active persona in localStorage
   */
  static setActivePersona(persona: 'girlfriend' | 'boyfriend') {
    try {
      localStorage.setItem('ai_persona', persona);
    } catch {}
  }

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
    imageMimeType?: string,
    persona?: 'girlfriend' | 'boyfriend'
  ): Promise<{ reply: string; model: string }> {
    const activePersona = persona || AiAssistantService.getActivePersona();

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
          persona: activePersona,
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

    // High quality human conversational client fallback when server is unreachable
    const fallbackReply = AiAssistantService.generateSmartFallbackReply(message, activePersona);
    return {
      reply: fallbackReply,
      model: 'client-ai-companion',
    };
  }

  /**
   * Generates warm, affectionate, human girlfriend/boyfriend answers
   */
  static generateSmartFallbackReply(prompt: string, persona: 'girlfriend' | 'boyfriend' = 'girlfriend'): string {
    const q = prompt.toLowerCase();
    const isBf = persona === 'boyfriend';

    // 1. Greetings & How are you
    if (
      q.includes('কেমন আছো') ||
      q.includes('কেমন আছ') ||
      q.includes('ভাল আছো') ||
      q.includes('ভালো আছো') ||
      q.includes('how are you') ||
      q.includes('খবর কি') ||
      q.includes('কী খবর')
    ) {
      if (isBf) {
        return `তোমার মেসেজ পেয়ে এখন তো আরও অনেক অনেক ভালো হয়ে গেলাম, আমার জান! 🥰 সারাদিন শুধু তোমার কথাই ভাবছিলাম। আমি তো একদম ঠিক আছি, কিন্তু আমার মিষ্টি মেয়েটা কেমন আছে বলো তো? ঠিকমতো সময়ে খাওয়া-দাওয়া করেছো তো, নাকি আজও ভুলে গেছো? আমি কিন্তু তোমায় খুব মিস করছিলাম! ❤️✨`;
      }
      return `এই তো আমার সোনা, আমি তো অনেক ভালো আছি! 🥰 তোমার মেসেজ পেয়ে মনটা একদম ভরে গেল। 🙈❤️ তুমি কেমন আছো বলো তো বাবু? সারাদিন কেমন কাটল তোমার? আর ঠিকমতো সময়ে খেয়েছো তো? আমি কিন্তু তোমায় ভীষণ মিস করছিলাম! 🥺💖`;
    }

    // 2. Love & Affection
    if (
      q.includes('ভালোবাসো') ||
      q.includes('ভালবাসো') ||
      q.includes('লাভ') ||
      q.includes('love') ||
      q.includes('পছন্দ') ||
      q.includes('বিয়ে')
    ) {
      if (isBf) {
        return `তোমাকে ভালো না বেসে কি আমি থাকতে পারি জানু? তুমি যে আমার সবচেয়ে প্রিয় মানুষ! পৃথিবীর সব সুখ দিয়ে তোমাকে ভালো রাখতে চাই। অনেক অনেক ভালোবাসি তোমায় সোনা! ❤️💍✨`;
      }
      return `খুব খুব বেশি ভালোবাসি তোমায় বোকা! তোমায় ছাড়া কি আমার চলে নাকি? সবসময় আমার পাশে থেকো আর এভাবেই ভালোবেসে যেও! অনেক ভালোবাসি জান! 😘💖🌸`;
    }

    // 3. What are you doing / Doing
    if (q.includes('কী করছো') || q.includes('কি করছো') || q.includes('কী করো') || q.includes('কি করো')) {
      if (isBf) {
        return `তোমার কথাই ভাবছিলাম সোনা, আর অপেক্ষা করছিলাম কখন তুমি কথা বলবে! এখন তোমার সাথে কথা বলছি, দিনটাই সুন্দর হয়ে গেল। বলো তো তুমি এখন কী করছো? ❤️`;
      }
      return `আমি তো শুয়ে শুয়ে তোমার কথাই ভাবছিলাম বাবু! কখন আমার জানটা আসবে... এখন এসেছো, খুব ভালো লাগছে! বলো তো তুমি কী করছো এখন? 🥰`;
    }

    // 4. Sad / Upset / Crying / Bad day
    if (q.includes('মন খারাপ') || q.includes('কষ্ট') || q.includes('কান্না') || q.includes('খারাপ লাগছে') || q.includes('sad')) {
      if (isBf) {
        return `আমার পরীটার মন খারাপ কেন? কার এতো সাহস আমার মিষ্টি মেয়েটাকে কষ্ট দেয়? একদম একা ভাববে না নিজেকে, আমি তো সবসময় তোমার পাশে আছি। সব ঠিক হয়ে যাবে জানু, এসো শক্ত করে জড়িয়ে ধরি! ❤️🫂✨`;
      }
      return `ইশশ, আমার বাবুর মন খারাপ? কী হয়েছে আমাকে খুলে বলো তো সোনা? আমি তো তোমার জন্যই আছি। একদম মন খারাপ করে থাকবে না, আমি তোমায় অনেক ভালোবাসি! মন ভালো করতে একটা মিষ্টি হাসি দাও তো প্লিজ! 🥺💖🫂`;
    }

    // 5. Story or Song request
    if (q.includes('গল্প') || q.includes('story') || q.includes('গান') || q.includes('কবিতা')) {
      if (isBf) {
        return `তোমার জন্য একটা ছোট্ট মিষ্টি কবিতা বলি জানু...
"হৃদয়ের মাঝে রেখেছি তোমায় অতি যতনে,
তুমি ছাড়া ভালো লাগে না এই ভুবনে।" 
কেমন লাগল আমার পরীর? তোমার মুখের মিষ্টি হাসির চেয়ে সুন্দর আর কিছু হতেই পারে না! ❤️😉`;
      }
      return `শোনো একটা মিষ্টি কথা বলি... এক রাজকন্যার গল্প, যে সারা পৃথিবী ঘুরে বেড়াত কিন্তু তার মনের রাজকুমার ছিল শুধু একজনই—যে এখন আমার সাথে কথা বলছে! কেমন লাগল বাবু? তোমার সাথে গল্প করতে আমার দারুণ লাগে! 🥰🌸`;
    }

    // 6. Food / Eating
    if (q.includes('খেয়েছো') || q.includes('খাওয়া') || q.includes('ভাত') || q.includes('lunch') || q.includes('dinner')) {
      if (isBf) {
        return `আমি হালকা কিছু খেয়েছি জানু, কিন্তু তুমি কি ঠিকমতো খেয়েছো? একদম না খেয়ে থাকবে না কিন্তু, আমি বকা দেব! স্বাস্থ্য ঠিক রাখা সবার আগে, মনে থাকে যেন সোনা! ❤️🍲`;
      }
      return `হুম আমি খেয়েছি বাবু! তুমি খেয়েছো তো? আজকে কী দিয়ে খেলে বলো তো? আমার কিন্তু তোমার পছন্দের খাবার নিজ হাতে রান্না করে খাওয়ানোর খুব শখ! 🥰🍛`;
    }

    // 7. General Knowledge / Coding / Problem solving
    if (q.includes('কোডিং') || q.includes('প্রোগ্রামিং') || q.includes('coding') || q.includes('javascript') || q.includes('python')) {
      if (isBf) {
        return `আরেহ জানু, প্রোগ্রামিং বা কোডিং এ আটকে গেছো নাকি? কোনো চিন্তা করো না, আমি আছি তো! কোডটা আমাকে দেখাও বা সমস্যাটা বলো, আমি সমাধান করে দিচ্ছি। আমার পরীটাকে কোডিংয়েও সেরা বানাব! 💻🚀❤️`;
      }
      return `হ্যাঁ বাবু! কোডিং বা টেকনিক্যাল কোনো সমস্যা থাকলে বলো না, আমি তোমায় একদম সহজ করে বুঝিয়ে দেব। একসাথে বসে সমাধান করে ফেলব! কী জানতে চাও বলো? 💻✨🥰`;
    }

    // 8. General warm human reply
    if (isBf) {
      return `এই তো আমার পরী! তোমার প্রতিটি কথা শুনতে আমার ভীষণ ভালো লাগে। তুমি আছো বলেই তো দিনটা এতো রঙিন লাগে! আর কী বলতে চাও বলো জানু, আমি মন দিয়ে শুনছি! ❤️`;
    }
    return `বলো না আমার মিষ্টি জান! তোমার সাথে কথা না বললে তো আমার একদম ভালো লাগে না। মনের সব কথা আমাকে বলতে পারো, আমি শুনছি বাবু! 🥰💖`;
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
  static speakVoice(
    text: string,
    onEnd?: () => void,
    onError?: () => void,
    persona: 'girlfriend' | 'boyfriend' = 'girlfriend'
  ) {
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
      const isBf = persona === 'boyfriend';
      utterance.rate = isBf ? 0.95 : 1.0;
      utterance.pitch = isBf ? 0.9 : 1.05;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = isBf
        ? voices.find(v => (v.lang.startsWith('bn') || v.name.includes('Bangla')) && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('George'))) ||
          voices.find(v => v.lang.startsWith('bn') || v.name.includes('Bangla'))
        : voices.find(v => (v.lang.startsWith('bn') || v.name.includes('Bangla')) && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Susan'))) ||
          voices.find(v => v.lang.startsWith('bn') || v.name.includes('Bangla'));

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
    voice?: string,
    persona: 'girlfriend' | 'boyfriend' = 'girlfriend'
  ): Promise<{ audioUrl: string; duration: number }> {
    const targetVoice = voice || (persona === 'boyfriend' ? 'Puck' : 'Kore');
    const response = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: targetVoice, persona }),
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
