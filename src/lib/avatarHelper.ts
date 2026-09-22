/**
 * Avatar resolution helper to ensure:
 * 1. Users with uploaded custom avatars (base64 or URL) see their own actual picture.
 * 2. Users without custom avatars receive distinct, deterministic, color-coded initials avatars.
 * 3. Never falls back to identical hardcoded demo photos.
 */

export const getSafeAvatarUrl = (
  avatar?: string | null,
  name?: string | null,
  uid?: string | null
): string => {
  if (avatar && typeof avatar === 'string') {
    const trimmed = avatar.trim();
    // Exclude the demo Unsplash stock photo previously used as a hardcoded default
    if (
      trimmed &&
      !trimmed.includes('photo-1534528741775-53994a69daeb') &&
      (trimmed.startsWith('data:image/') ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://'))
    ) {
      return trimmed;
    }
  }

  const rawSeed = (name || uid || 'ব্যবহারকারী').trim();
  const seed = encodeURIComponent(rawSeed || 'Member');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=047857,059669,0d9488,0284c7,4f46e5,7c3aed,c026d3,d97706,e11d48&fontFamily=Arial,sans-serif&bold=true`;
};

export const getInitials = (name?: string | null): string => {
  if (!name || typeof name !== 'string') return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
