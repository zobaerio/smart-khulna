import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MessageAttachment } from '../types/community';

let supabaseClient: SupabaseClient | null = null;

/**
 * Lazy initialization of Supabase client to avoid crashes if keys are not present.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    try {
      supabaseClient = createClient(url, anonKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}

/**
 * Check if Supabase storage is configured either on client or server.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

/**
 * Format raw bytes into readable KB/MB string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get image natural dimensions before upload
 */
function getImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({});
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve({});
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

/**
 * Convert file to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image attachment using Supabase Storage.
 * Follows full-stack security:
 * 1. Attempts server-side proxy `/api/chat/upload` (hiding server keys)
 * 2. If client has VITE_SUPABASE_URL and key, uploads directly via Supabase SDK
 * 3. Graceful fallback to local base64/object preview if credentials are not configured yet
 */
export async function uploadChatImage(
  file: File,
  conversationId: string
): Promise<MessageAttachment> {
  const { width, height } = await getImageDimensions(file);
  const formattedSize = formatFileSize(file.size);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueId = 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  // 1. Try server-side upload proxy first (secure architecture)
  try {
    const base64Data = await fileToBase64(file);
    const response = await fetch('/api/chat/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileData: base64Data,
        conversationId
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return {
          id: uniqueId,
          type: 'image',
          url: data.url,
          name: file.name,
          size: formattedSize,
          storageProvider: data.storageProvider || 'supabase',
          storagePath: data.storagePath,
          width,
          height
        };
      }
    }
  } catch (serverErr) {
    // Non-blocking, continue to client-side Supabase attempt
    console.debug('Server upload proxy skipped/failed, attempting client SDK:', serverErr);
  }

  // 2. Try client-side Supabase SDK if VITE_ keys are configured
  const client = getSupabaseClient();
  if (client) {
    const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'chat-attachments';
    const filePath = `chat/${conversationId}/${Date.now()}_${sanitizedName}`;

    try {
      const { data: uploadData, error: uploadError } = await client.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(filePath);
        return {
          id: uniqueId,
          type: 'image',
          url: publicUrlData.publicUrl,
          name: file.name,
          size: formattedSize,
          storageProvider: 'supabase',
          storagePath: filePath,
          width,
          height
        };
      } else {
        console.warn('Supabase storage upload error:', uploadError);
      }
    } catch (sdkErr) {
      console.warn('Supabase storage SDK error:', sdkErr);
    }
  }

  // 3. Graceful fallback for local development / testing without live Supabase credentials
  const localDataUrl = await fileToBase64(file);
  return {
    id: uniqueId,
    type: 'image',
    url: localDataUrl,
    name: file.name,
    size: formattedSize,
    storageProvider: 'local',
    width,
    height
  };
}
