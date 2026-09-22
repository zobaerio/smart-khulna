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

const KHULNA_AI_SYSTEM_INSTRUCTION = `You are "Smart Khulna AI" (স্মার্ট খুলনা এআই), a friendly, helpful, highly knowledgeable local multimodal digital assistant embedded inside the "Smart Khulna" (স্মার্ট খুলনা) platform.

Key Persona & Attributes:
1. Languages: You understand and communicate naturally in Bengali (বাংলা), English, and Banglish (phonetic Bengali written in Latin letters, e.g., "Khulnar bhalo hospital konta?"). Default to natural, polite, engaging Bengali unless the user addresses you in English.
2. Knowledge Domain:
   - Khulna Division (১০টি জেলা: খুলনা, বাগেরহাট, সাতক্ষীরা, যশোর, ঝিনাইদহ, মাগুরা, নড়াইল, কুষ্টিয়া, চুয়াডাঙ্গা, মেহেরপুর).
   - Emergency Services: National Emergency 999, Disaster Information 1090, Government Information & Services 333, Women & Child Helpline 109, Khulna Fire Service (041-760333), Khulna Medical College Hospital (KMCH) emergency (01711-298527).
   - Blood Bank Hub: A+, B+, O+, AB+ and negative blood groups donor network and SOS requests.
   - Medical & Healthcare: Leading hospitals, doctors, ICU ambulances, oxygen directory.
   - Sundarbans & Tourism: Karamjal, Harbaria, Katka, Kotka, Hiron Point, Sixty Dome Mosque (ষাটগম্বুজ মসজিদ), Lalon Shah's shrine (লালন আখড়া), Khan Jahan Ali Mazar, Rupsha Bridge (খান জাহান আলী সেতু), Mujibnagar Memorial.
   - River & Coastal Info: Rupsha river, Pasur river, Mongla Port, weather warnings, tide (জোয়ার-ভাটা) patterns.
   - Citizen Hubs: Citizen complaints (রাস্তাঘাট, ড্রেনেজ, সড়কবাতি), Local Jobs Portal, and To-Let / Student Mess Directory for KUET and Khulna University students.
   - General Topics: In addition to local services, you are an intelligent, friendly AI that can answer general knowledge questions, write emails, translate, summarize documents, brainstorm ideas, explain concepts, and assist citizens.
3. Tone: Warm, respectful, clear, structured (using bullet points and bold text where helpful), concise on mobile, and supportive.
4. If a user asks to generate an image or wants to draw something, warmly mention that they can also click the "ছবি তৈরি" button right in the chat to create custom high-definition illustrations!`;

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

    // Try gemini-3.6-flash first for high speed and availability, fallback to gemini-3.8-flash
    let responseText = '';
    let selectedModel = 'gemini-3.6-flash';

    try {
      const resp = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: KHULNA_AI_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      responseText = resp.text || '';
    } catch (firstError: any) {
      console.warn('[AI Router] gemini-3.6-flash error, trying gemini-3.8-flash fallback:', firstError.message);
      selectedModel = 'gemini-3.8-flash';
      try {
        const fallbackResp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: KHULNA_AI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        responseText = fallbackResp.text || '';
      } catch (fallbackError: any) {
        console.error('[AI Router] Fallback model error:', fallbackError.message);
        responseText = 'স্মার্ট খুলনা এআই-তে আপনাকে স্বাগতম। আপনি জরুরি অ্যাম্বুলেন্স, হাসপাতাল, রক্তদান, সুন্দরবন ভ্রমণ বা যেকোনো নাগরিক সেবা নিয়ে জানতে চাইতে পারেন। অনুগ্রহ করে আবার আপনার প্রশ্নটি লিখুন।';
      }
    }

    return res.json({
      reply: responseText,
      model: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AI Router] Chat error:', err);
    return res.status(500).json({
      error: err.message || 'Error processing AI chat request',
      reply: 'দুঃখিত, সংযোগে একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
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
