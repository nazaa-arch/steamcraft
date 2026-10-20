/**
 * Cross-domain Maintenance Mode Synchronization
 * Works across steamcraft.online, adm.steamcraft.online, and localhost.
 * Synchronizes via Cookie (.steamcraft.online), LocalStorage, BroadcastChannel, and Backend JSON.
 */

const COOKIE_NAME = 'steamcraft_maintenance';
const STORAGE_KEY = 'steamcraft_maintenance_mode';
const BROADCAST_NAME = 'steamcraft_sync_channel';

// Helper to get cookie
export function getMaintenanceCookie(): boolean | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  if (match) {
    return match[2] === 'true' || match[2] === '1';
  }
  return null;
}

// Helper to set cookie across all subdomains (*.steamcraft.online)
export function setMaintenanceCookie(active: boolean): void {
  if (typeof document === 'undefined') return;
  const isSteamcraft = window.location.hostname.includes('steamcraft.online');
  const domainPart = isSteamcraft ? '; domain=.steamcraft.online' : '';
  const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${active ? 'true' : 'false'}${domainPart}; path=/; max-age=31536000; SameSite=Lax${securePart}`;
}

// Read current maintenance state
export function getInitialMaintenanceState(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check URL override
  const params = new URLSearchParams(window.location.search);
  if (params.get('maintenance') === 'true' || params.get('maintenance') === '1') return true;
  if (params.get('maintenance') === 'false' || params.get('maintenance') === '0' || params.get('bypass') === 'admin') return false;

  // 2. Check cross-subdomain cookie
  const cookieVal = getMaintenanceCookie();
  if (cookieVal !== null) return cookieVal;

  // 3. Check localStorage
  const localVal = localStorage.getItem(STORAGE_KEY);
  if (localVal !== null) return localVal === 'true';

  return false;
}

// Save & broadcast maintenance state
export async function syncMaintenanceState(
  active: boolean,
  reason: string = 'Pemeliharaan sistem berkala',
  updatedBy: string = 'Master DevOps Administrator'
): Promise<void> {
  // 1. Update Cookie for all subdomains
  setMaintenanceCookie(active);

  // 2. Update localStorage
  localStorage.setItem(STORAGE_KEY, active ? 'true' : 'false');

  // 3. Broadcast to all open tabs/subdomains via BroadcastChannel
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_NAME);
      channel.postMessage({ type: 'MAINTENANCE_CHANGE', active, reason, updatedBy });
      channel.close();
    }
  } catch (e) {
    // ignore
  }

  // 4. Update Server JSON file via PHP API on AnymHost
  try {
    await fetch(`/api/maintenance.php?action=set&status=${active ? '1' : '0'}&reason=${encodeURIComponent(reason)}&updated_by=${encodeURIComponent(updatedBy)}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
  } catch (err) {
    // If offline or static host, cookie & local storage still work perfectly
    console.warn('[MaintenanceSync] Server API update skipped or failed:', err);
  }
}

// Poll server maintenance state periodically (every 30 seconds)
export function startServerMaintenancePolling(callback: (active: boolean) => void): () => void {
  const check = async () => {
    try {
      const res = await fetch(`/maintenance_status.json?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof json.maintenance === 'boolean') {
          callback(json.maintenance);
        }
      }
    } catch (e) {
      // ignore
    }
  };

  // Run initial check after 2 seconds
  const initTimer = setTimeout(check, 2000);
  const interval = setInterval(check, 30000);

  // Listen to BroadcastChannel
  let channel: BroadcastChannel | null = null;
  try {
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(BROADCAST_NAME);
      channel.onmessage = (evt) => {
        if (evt.data && evt.data.type === 'MAINTENANCE_CHANGE') {
          callback(Boolean(evt.data.active));
        }
      };
    }
  } catch (e) {
    // ignore
  }

  return () => {
    clearTimeout(initTimer);
    clearInterval(interval);
    if (channel) channel.close();
  };
}
