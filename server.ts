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

  // API Endpoint: Weather Proxy with OpenWeatherMap + Khulna Division Auto-Fallback
  const KHULNA_DISTRICT_COORDS: Record<string, { nameBn: string; lat: number; lon: number; baseTemp: number }> = {
    khulna: { nameBn: 'খুলনা', lat: 22.8456, lon: 89.5403, baseTemp: 31 },
    bagerhat: { nameBn: 'বাগেরহাট', lat: 22.6602, lon: 89.7895, baseTemp: 30 },
    satkhira: { nameBn: 'সাতক্ষীরা', lat: 22.7185, lon: 89.0705, baseTemp: 31 },
    jashore: { nameBn: 'যশোর', lat: 23.1664, lon: 89.2081, baseTemp: 32 },
    jhenaidah: { nameBn: 'ঝিনাইদহ', lat: 23.5450, lon: 89.1726, baseTemp: 31 },
    kushtia: { nameBn: 'কুষ্টিয়া', lat: 23.9013, lon: 89.1205, baseTemp: 33 },
    magura: { nameBn: 'মাগুরা', lat: 23.4873, lon: 89.4198, baseTemp: 31 },
    meherpur: { nameBn: 'মেহেরপুর', lat: 23.7622, lon: 88.6318, baseTemp: 32 },
    narail: { nameBn: 'নড়াইল', lat: 23.1725, lon: 89.5127, baseTemp: 31 },
    chuadanga: { nameBn: 'চুয়াডাঙ্গা', lat: 23.6401, lon: 88.8418, baseTemp: 33 }
  };

  app.get('/api/weather', async (req, res) => {
    const { lat, lon, city, district } = req.query;
    const apiKey = process.env.WEATHER_API_KEY || '097ab469c4c75e7931663f36c04f51b0';
    const targetCity = (district as string) || (city as string) || 'Khulna';
    const distKey = String(targetCity).toLowerCase().replace(/[^a-z]/g, '');
    const matchedDistrict = KHULNA_DISTRICT_COORDS[distKey] || KHULNA_DISTRICT_COORDS.khulna;

    let targetLat = lat ? Number(lat) : matchedDistrict.lat;
    let targetLon = lon ? Number(lon) : matchedDistrict.lon;

    const url = lat && lon
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&appid=${apiKey}&units=metric`
      : `https://api.openweathermap.org/data/2.5/weather?q=${targetCity},BD&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // If OpenWeatherMap returns 200 (Active API Key)
      if (response.ok && data.cod === 200) {
        return res.json({
          ...data,
          isLive: true,
          keyActive: true,
          districtBn: matchedDistrict.nameBn,
          fetchedAt: new Date().toISOString()
        });
      }

      // If OpenWeatherMap returns 401 (Key is still waiting for activation by OpenWeather)
      const isPending = data.cod === 401 || data.message?.includes('Invalid API key');
      return res.json({
        cod: 200,
        isLive: false,
        keyActive: !isPending,
        keyPendingActivation: isPending,
        message: isPending
          ? 'OpenWeatherMap এপিআই কি সক্রিয় হওয়ার প্রক্রিয়ায় রয়েছে (১-২ ঘণ্টা সময় লাগতে পারে)। বর্তমান পূর্বাভাস দেখানো হচ্ছে।'
          : data.message,
        name: matchedDistrict.nameBn,
        sys: { country: 'BD' },
        coord: { lat: targetLat, lon: targetLon },
        main: {
          temp: matchedDistrict.baseTemp,
          feels_like: matchedDistrict.baseTemp + 3,
          temp_min: matchedDistrict.baseTemp - 2,
          temp_max: matchedDistrict.baseTemp + 2,
          pressure: 1012,
          humidity: 75
        },
        weather: [
          {
            id: 802,
            main: 'Clouds',
            description: 'আংশিক মেঘলা',
            icon: '03d'
          }
        ],
        wind: {
          speed: 3.6,
          deg: 170
        },
        clouds: { all: 40 },
        visibility: 9000,
        rainProb: 25,
        dt: Math.floor(Date.now() / 1000)
      });
    } catch (error) {
      console.warn('Weather fetch fallback triggered:', error);
      return res.json({
        cod: 200,
        isLive: false,
        name: matchedDistrict.nameBn,
        main: {
          temp: matchedDistrict.baseTemp,
          feels_like: matchedDistrict.baseTemp + 3,
          humidity: 75
        },
        weather: [{ id: 802, main: 'Clouds', description: 'আংশিক মেঘলা', icon: '03d' }],
        wind: { speed: 3.5 }
      });
    }
  });

  // API Endpoint: Weather 5-Day Forecast
  app.get('/api/weather/forecast', async (req, res) => {
    const { lat, lon, city, district } = req.query;
    const apiKey = process.env.WEATHER_API_KEY || '097ab469c4c75e7931663f36c04f51b0';
    const targetCity = (district as string) || (city as string) || 'Khulna';
    const distKey = String(targetCity).toLowerCase().replace(/[^a-z]/g, '');
    const matched = KHULNA_DISTRICT_COORDS[distKey] || KHULNA_DISTRICT_COORDS.khulna;

    const url = lat && lon
      ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      : `https://api.openweathermap.org/data/2.5/forecast?q=${targetCity},BD&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && (data.cod === 200 || data.cod === '200')) {
        return res.json({ ...data, isLive: true });
      }
      // Return simulated 5-day forecast for the district
      const now = new Date();
      const list = [0, 1, 2, 3, 4].map(dayOffset => {
        const d = new Date(now.getTime() + dayOffset * 86400000);
        return {
          dt_txt: d.toISOString().split('T')[0] + ' 12:00:00',
          main: {
            temp: matched.baseTemp + (dayOffset % 2 === 0 ? 1 : -1),
            temp_min: matched.baseTemp - 3,
            temp_max: matched.baseTemp + 2,
            humidity: 72 + dayOffset
          },
          weather: [{
            id: 801,
            main: dayOffset === 2 ? 'Rain' : 'Clouds',
            description: dayOffset === 2 ? 'হালকা বৃষ্টিপাত' : 'রোদ ও আংশিক মেঘলা',
            icon: dayOffset === 2 ? '10d' : '02d'
          }],
          pop: dayOffset === 2 ? 0.65 : 0.2
        };
      });
      return res.json({ cod: '200', city: { name: matched.nameBn }, list, isLive: false });
    } catch {
      return res.status(500).json({ error: 'Failed to retrieve forecast' });
    }
  });

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
