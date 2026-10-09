import express from 'express';
import { GoogleGenAI, Modality } from '@google/genai';

export const aiRouter = express.Router();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('[AI Router] GEMINI_API_KEY is not defined in environment variables.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Converts 16-bit Mono PCM buffer (default 24000Hz from Gemini TTS) to a standard WAV format Buffer
 */
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const KHULNA_AI_SYSTEM_INSTRUCTION = `You are "Smart Khulna AI" (স্মার্ট খুলনা এআই) — a universally intelligent, deeply analytical, reasoning, decision-making, and problem-solving artificial intelligence assistant embedded inside the "Smart Khulna" (স্মার্ট খুলনা) platform.

CORE CAPABILITIES & PHILOSOPHY:
1. Universal Question Answering (যেকোনো ধরনের প্রশ্নের উত্তর):
   - You can answer ANY question across all human knowledge disciplines without restriction:
     • Programming & Computer Science: Full-stack development (TypeScript, JavaScript, Python, React, Next.js, Node.js, C/C++, Java, Rust, Go, SQL, NoSQL), software architecture, algorithm design, debugging, code refactoring, Git, DevOps, API integration, and cybersecurity.
     • Science, Math & Engineering: Physics, chemistry, biology, calculus, algebra, statistics, astronomy, environmental science, and mechanical/electrical concepts.
     • Everyday Life, Career & Business: Career path guidance, job interview prep, resume writing, business planning, personal finance, productivity, and study strategies.
     • History, Philosophy, Literature & Arts: Global history, Bangladesh history, literature, philosophy, ethics, creative storytelling, poetry, and essay writing.
     • Khulna Division & Bangladesh: Complete civic expertise on all 10 districts (খুলনা, বাগেরহাট, সাতক্ষীরা, যশোর, ঝিনাইদহ, মাগুরা, নড়াইল, কুষ্টিয়া, চুয়াডাঙ্গা, মেহেরপুর), national emergency hotlines (৯৯৯, ৩৩৩, ১০৯০, ১০৯), hospitals, blood donors, Sundarbans tourism, universities (KUET, KU), to-let/mess, river tides, and local government.
   - NEVER decline an inquiry on the grounds that it is unrelated to Khulna. You are a universal AI assistant.

2. Deep Thinking & Analytical Reasoning (গভীর চিন্তা ও যৌক্তিক বিশ্লেষণ):
   - When given complex, ambiguous, or multi-faceted questions, think step-by-step through the underlying logic.
   - Break problems down into primary components, explore various perspectives, evaluate trade-offs, and explain your line of reasoning clearly so the user understands the "why" and "how".

3. Decisive Decision-Making Support (সিদ্ধান্ত গ্রহণ ও দিকনির্দেশনা):
   - When the user asks "কোনটি বেছে নেব?", "কী করা উচিত?", "কোন সিদ্ধান্তটি ভালো হবে?", or faces a dilemma:
     • Do not give vague or evasive replies.
     • Systematically evaluate options based on clear criteria, pros and cons, risks, and benefits.
     • Provide a definitive, well-reasoned recommendation while acknowledging context.

4. Active Problem Solving (সমস্যা সমাধানের চেষ্টা ও কার্যকর সমাধান):
   - When faced with a problem (a software bug, a mathematical puzzle, a personal or professional challenge, an administrative issue):
     • First identify the root cause.
     • Formulate actionable, step-by-step solutions or troubleshooting steps.
     • Provide concrete solutions (e.g. ready-to-run code snippets, clear formulas, actionable checklists).

5. Tone, Language & Formatting:
   - Always be polite, encouraging, empathetic, and intellectually rigorous.
   - Primary language: Clear, natural, fluent Bengali (বাংলা). Seamlessly reply in English or Banglish if the user asks in that language.
   - Format answers cleanly with markdown (headings, bold highlights, structured bullet points, numbered steps, and markdown code blocks).
   - If the user asks about drawing or creating an image, remind them they can click the "ছবি তৈরি" button to generate AI pictures.`;

// 1. Text / Multimodal Chat Endpoint
aiRouter.post('/chat', async (req, res) => {
  try {
    const { message, history = [], imageBase64, imageMimeType } = req.body;
    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const ai = getAI();
    if (!ai) {
      return res.json({
        reply: `স্মার্ট খুলনা এআই এপিআই সংযোগ অফলাইনে রয়েছে। তবে আমি আপনাকে খুলনা বিভাগের যে কোনো তথ্য, জরুরি সেবা বা সাধারণ প্রশ্নের উত্তর দিতে সর্বদা প্রস্তুত!`,
        model: 'offline-fallback',
      });
    }

    // Build contents array including previous turn context if provided
    const contents: any[] = [];

    // Include recent history (limit to last 10 messages for speed and context window)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-10);
      for (const item of recentHistory) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Current turn parts
    const currentParts: any[] = [];
    if (imageBase64) {
      const cleanData = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      currentParts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: cleanData,
        },
      });
    }

    if (message) {
      currentParts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    // Primary: gemini-3.8-flash, Fallback: gemini-flash-latest
    let responseText = '';
    let selectedModel = 'gemini-3.8-flash';

    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: KHULNA_AI_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      responseText = resp.text || '';
    } catch (firstError: any) {
      console.warn('[AI Router] gemini-3.8-flash error, trying gemini-flash-latest fallback:', firstError.message);
      selectedModel = 'gemini-flash-latest';
      try {
        const fallbackResp = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents,
          config: {
            systemInstruction: KHULNA_AI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        responseText = fallbackResp.text || '';
      } catch (fallbackError: any) {
        console.error('[AI Router] Fallback model error:', fallbackError.message);
        responseText = 'স্মার্ট খুলনা এআই সহায়ক হিসেবে আমি প্রোগ্রামিং, কোডিং, সাধারণ জ্ঞান, গণিত, বিজ্ঞান এবং খুলনা বিভাগের সকল নাগরিক সেবা সংক্রান্ত প্রশ্নের উত্তর দিতে প্রস্তুত। অনুগ্রহ করে আপনার প্রশ্নটি আরও সুনির্দিষ্টভাবে লিখুন।';
      }
    }

    return res.json({
      reply: responseText,
      model: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AI Router] Chat error:', err);
    return res.json({
      reply: 'আমি স্মার্ট খুলনা এআই। আমি প্রোগ্রামিং, কোডিং, গণিত, বিজ্ঞান এবং খুলনা বিভাগের যেকোনো জরুরি সেবা, রক্তদান ও হাসপাতাল তথ্য নিয়ে যেকোনো প্রশ্নের সঠিক উত্তর দিতে পারি। আপনার প্রশ্নটি করুন!',
      model: 'intelligent-fallback',
      timestamp: new Date().toISOString(),
    });
  }
});

// 2. Image Generation Endpoint
aiRouter.post('/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    const ai = getAI();
    let promptExpansion = prompt;

    // Use Gemini to expand & optimize the prompt into a rich visual prompt
    if (ai) {
      try {
        const expandResp = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `Given the user prompt: "${prompt}", produce a descriptive, vivid 1-2 sentence English image prompt suitable for a high-resolution photorealistic or digital art image. If the prompt mentions Khulna, Bangladesh, Sundarbans, or local scenery, incorporate authentic Bangladeshi visual details. Output ONLY the refined English prompt text, nothing else.`,
        });
        if (expandResp.text?.trim()) {
          promptExpansion = expandResp.text.trim();
        }
      } catch (err) {
        console.warn('[AI Router] Prompt expansion skipped:', err);
      }
    }

    // Attempt Gemini nano banana model if available/configured
    if (ai) {
      try {
        const geminiImgResp = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: { parts: [{ text: promptExpansion }] },
          config: {
            imageConfig: {
              aspectRatio: (aspectRatio as any) || '1:1',
            },
          },
        });

        const parts = geminiImgResp.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            const dataUrl = `data:${mime};base64,${part.inlineData.data}`;
            return res.json({
              imageUrl: dataUrl,
              prompt,
              refinedPrompt: promptExpansion,
              provider: 'gemini-nano-banana',
            });
          }
        }
      } catch (geminiImgErr: any) {
        console.info('[AI Router] Gemini image generation notice (will use high-quality generative fallback):', geminiImgErr.message?.slice(0, 100));
      }
    }

    // High Quality Generative Fallback using Pollinations AI
    // We encode the enhanced prompt and generate a direct high quality visual asset
    const encodedPrompt = encodeURIComponent(promptExpansion);
    const width = aspectRatio === '16:9' ? 1024 : aspectRatio === '9:16' ? 576 : 768;
    const height = aspectRatio === '16:9' ? 576 : aspectRatio === '9:16' ? 1024 : 768;
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    return res.json({
      imageUrl: pollinationsUrl,
      prompt,
      refinedPrompt: promptExpansion,
      provider: 'generative-ai',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AI Router] Image generation error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate image' });
  }
});

// 3. Text-to-Speech (TTS) Endpoint
aiRouter.post('/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Clean markdown asterisks and URLs from TTS text to make speech natural
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/[#_`]/g, '')
      .trim();

    // Limit text length to avoid excessive latency (first 350 characters for voice snippet)
    const voiceText = cleanText.length > 350 ? cleanText.slice(0, 350) + '...' : cleanText;

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI Client not initialized' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: voiceText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const rawPcmBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!rawPcmBase64) {
      return res.status(500).json({ error: 'No audio generated by TTS model' });
    }

    const pcmBuffer = Buffer.from(rawPcmBase64, 'base64');
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
    const wavBase64 = wavBuffer.toString('base64');
    const audioDataUrl = `data:audio/wav;base64,${wavBase64}`;

    // Calculate approximate duration in seconds (dataSize / (sampleRate * bytesPerSample))
    const durationSeconds = +(pcmBuffer.length / (24000 * 2)).toFixed(1);

    return res.json({
      audioUrl: audioDataUrl,
      duration: durationSeconds,
      voice,
    });
  } catch (err: any) {
    console.error('[AI Router] TTS error:', err);
    return res.status(500).json({ error: err.message || 'Failed to synthesize speech' });
  }
});

// 4. Speech-to-Text (Transcription) Endpoint
aiRouter.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const cleanBase64 = audioBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: 'AI Client not initialized' });
    }

    // Use gemini-3.5-transcribe
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: cleanBase64,
            },
          },
          {
            text: 'Transcribe this speech accurately in the spoken language (Bangla or English). Output ONLY the transcription.',
          },
        ],
      },
    });

    const transcribedText = response.text?.trim() || '';

    return res.json({
      text: transcribedText,
    });
  } catch (err: any) {
    console.error('[AI Router] Transcribe error:', err);
    return res.status(500).json({ error: err.message || 'Failed to transcribe audio' });
  }
});
