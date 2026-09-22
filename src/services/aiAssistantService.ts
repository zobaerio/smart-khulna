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
    text: `আসসালামু আলাইকুম ও নমস্কার! আমি **স্মার্ট খুলনা এআই (Smart Khulna AI)** — আপনার সার্বক্ষণিক ডিজিটাল নাগরিক সহকারী। 🌟

আমি আপনার সাথে **বাংলা**, **English** বা **বাংলিশ**-এ কথা বলতে পারি।

**আমি যেভাবে সাহায্য করতে পারি:**
• 🚑 **জরুরি স্বাস্থ্য ও হটলাইন:** ৯৯৯, ফায়ার সার্ভিস, ৩৩৩, অ্যাম্বুলেন্স ও ডাক্তারদের সিরিয়াল
• 🩸 **ব্লাড ব্যাংক:** যে কোনো গ্রুপের রক্তদাতা অনুসন্ধান ও SOS রিকোয়েস্ট
• 🐅 **সুন্দরবন ও পর্যটন:** দর্শনীয় স্থান, ট্রাভেল গাইড, লঞ্চ ও হোটেল বুকিং
• 🌊 **নদী ও আবহাওয়া:** রূপসা/পশুর নদীর জোয়ার-ভাটার সূচি ও মোংলা সমুদ্রবন্দর বার্তা
• 🏠 **মেস ও টু-লেট:** কুয়েট (KUET) ও খুবি (KU) এর নিকটবর্তী বাসা/মেস
• 🎨 **ছবি তৈরি:** আপনি যেকোনো ছবি তৈরির নির্দেশ দিলে আমি নিমিষেই ছবি এঁকে দেব!
• 🎙️ **ভয়েস কথোপকথন:** মাইক বাটনে চেপে সরাসরি মুখে কথা বলুন।

আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?`,
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
   * Send text message with context to backend
   */
  static async sendMessage(
    message: string,
    history: AiChatMessage[] = [],
    imageBase64?: string
  ): Promise<{ reply: string; model: string }> {
    const formattedHistory = history
      .filter(m => m.msgType !== 'image')
      .slice(-8)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: formattedHistory,
        imageBase64,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server returned error ${response.status}`);
    }

    return await response.json();
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
