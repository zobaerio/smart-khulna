import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { aiRouter } from './src/server/aiRouter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Multimodal AI Assistant APIs
  app.use('/api/ai', aiRouter);

  // Lazily retrieve the Gemini SDK client
  let ai: any = null;
  function getAI() {
    if (!ai) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        console.warn("GEMINI_API_KEY is not defined. Grounding features will operate in offline mock mode.");
        return null;
      }
      ai = new GoogleGenAI({ apiKey: key });
    }
    return ai;
  }

  // API Endpoint: Search & Maps Grounding
  app.post('/api/gemini/grounding', async (req: express.Request, res: express.Response) => {
    const { query, type } = req.body;
    try {
      const aiClient = getAI();
      if (!aiClient) {
        return res.json({
          content: `স্মার্ট অনুসন্ধান ফলাফল:\n\n দুঃখিত, এপিআই কী অনুপস্থিত। কিন্তু আপনি "${query}" এর তথ্য জানতে চেয়েছেন। এটি খুলনা বিভাগের একটি বিশেষ স্থান/সেবা।`,
          sources: [
            { title: "খুলনা বিভাগীয় পোর্টালে অনুসন্ধান করুন", uri: "https://www.khulnadiv.gov.bd" }
          ]
        });
      }

      const isMaps = type === 'maps';
      const prompt = isMaps
        ? `You are Smart Khulna, a local services AI helper. A user is looking for map locations, address, landmarks, directions, or contact details for "${query}" in Khulna Division, Bangladesh. Search for up-to-date local maps data and provide precise information on how to get there. Answer in clear Bangla.`
        : `You are Smart Khulna, a local services AI helper. A user is looking for general services, details, status, or phone numbers for "${query}" in Khulna Division, Bangladesh. Search for verified and latest local info. Answer in clear Bangla.`;

      // Use gemini-3.6-flash with Google Search Tool enabled for real-time grounding
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || '';
      const candidates = response.candidates || [];
      const groundingMetadata = candidates[0]?.groundingMetadata || {};
      const sources = groundingMetadata.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || chunk.web?.uri,
        uri: chunk.web?.uri
      })).filter((s: any) => s.uri) || [];

      return res.json({ content: text, sources });
    } catch (error: any) {
      console.error("Gemini Grounding Endpoint Error:", error);
      return res.status(500).json({ error: error.message || "Failed to contact Gemini Grounding API" });
    }
  });

  // Supabase Storage Chat Attachment Upload endpoint
  app.post('/api/chat/upload', async (req, res) => {
    try {
      const { fileName, fileType, fileData, conversationId } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: 'Missing required file data' });
      }

      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_ANON_KEY;
      const bucket =
        process.env.SUPABASE_STORAGE_BUCKET ||
        process.env.VITE_SUPABASE_STORAGE_BUCKET ||
        'chat-attachments';

      if (!supabaseUrl || !supabaseKey) {
        return res.status(501).json({
          error: 'Supabase storage credentials not configured on server',
          configured: false
        });
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Clean base64 prefix if present (e.g. data:image/jpeg;base64,...)
      const matches = typeof fileData === 'string' ? fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) : null;
      let buffer: Buffer;
      let contentType = fileType || 'image/jpeg';

      if (matches && matches.length === 3) {
        contentType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(fileData, 'base64');
      }

      const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const convId = conversationId || 'general';
      const filePath = `chat/${convId}/${Date.now()}_${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType,
          upsert: true
        });

      if (uploadError) {
        console.error('Supabase server upload error:', uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return res.json({
        success: true,
        url: publicUrlData.publicUrl,
        storagePath: filePath,
        storageProvider: 'supabase'
      });
    } catch (err: any) {
      console.error('API /api/chat/upload error:', err);
      return res.status(500).json({ error: err.message || 'Server error uploading file' });
    }
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Explicitly return 404 for /file_* requests inside the container so that
  // the platform's reverse proxy can intercept them rather than receiving index.html (SPA fallback)
  app.get('/file_*', (req, res) => {
    res.status(404).send('Not Found');
  });

  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Smart Khulna Server started on http://0.0.0.0:${port}`);
  });
}

startServer();
