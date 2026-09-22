/**
 * App Version Management and Live Update Service for Smart Khulna
 */

export const APP_VERSION = "1.0.0"; // Current client installed base version

export interface VersionInfo {
  version: string;
  releaseDate?: string;
  minSupportedVersion?: string;
  title?: string;
  description?: string;
  changelog?: string[];
}

export interface CheckUpdateResult {
  status: 'update_available' | 'up_to_date' | 'error';
  currentVersion: string;
  latestVersion: string;
  versionInfo?: VersionInfo;
  errorMessage?: string;
}

/**
 * Compare semantic versions: returns 1 if v2 > v1, 0 if equal, -1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.replace(/^v/i, '').split('.').map(Number);
  const parts2 = v2.replace(/^v/i, '').split('.').map(Number);
  const maxLen = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num2 > num1) return 1; // v2 is newer
    if (num1 > num2) return -1; // v1 is newer
  }
  return 0;
}

/**
 * Fetch latest version metadata from public/version.json with cache-busting
 */
export async function checkForAppUpdate(): Promise<CheckUpdateResult> {
  const currentVersion = localStorage.getItem('smart_khulna_app_version') || APP_VERSION;

  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch version info`);
    }

    const data: VersionInfo = await res.json();
    const latestVersion = data.version || APP_VERSION;

    const isNewer = compareVersions(currentVersion, latestVersion) > 0;

    return {
      status: isNewer ? 'update_available' : 'up_to_date',
      currentVersion,
      latestVersion,
      versionInfo: data
    };
  } catch (error: any) {
    console.warn("App update check failed:", error);
    return {
      status: 'error',
      currentVersion,
      latestVersion: currentVersion,
      errorMessage: error?.message || 'ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।'
    };
  }
}

/**
 * Apply live application update:
 * 1. Clear old service worker caches
 * 2. Unregister / update service worker
 * 3. Update localStorage version tracker
 * 4. Hard reload page to fetch fresh bundle
 */
export async function applyAppUpdate(newVersion: string): Promise<void> {
  try {
    // 1. Clear all service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // 2. Refresh service worker registration if available
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
    }

    // 3. Set updated version in local storage
    localStorage.setItem('smart_khulna_app_version', newVersion);
    localStorage.setItem('smart_khulna_last_updated', new Date().toISOString());

    // 4. Set temporary session flag for update success toast
    sessionStorage.setItem('smart_khulna_update_success', 'true');

    // 5. Reload the application
    window.location.reload();
  } catch (err) {
    console.error("Error executing app update:", err);
    // Fallback reload
    localStorage.setItem('smart_khulna_app_version', newVersion);
    window.location.reload();
  }
}
