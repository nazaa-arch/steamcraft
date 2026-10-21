/**
 * Active Users & Real-time Civitas Session Tracker
 * Tracks all currently connected users, their active pages, devices, and network locations.
 */

export interface ActiveSession {
  sessionId: string;
  userId: number;
  userName: string;
  role: 'student' | 'lecturer' | 'partner' | 'admin';
  identifier: string; // NIM or NIDN
  faculty: string;
  activePage: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ipAddress: string;
  location: string;
  loginTime: string;
  lastActive: string;
  lastPingTimestamp: number;
  status: 'active' | 'idle';
  requestsCount: number;
  avatarColor?: string;
}

const STORAGE_KEY = 'steamcraft_active_sessions';
const BROADCAST_NAME = 'steamcraft_sessions_sync';

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    sessionId: 'sess_live_101',
    userId: 2,
    userName: 'I Made Aditya Wijaya',
    role: 'student',
    identifier: 'NIM 2208561045',
    faculty: 'FMIPA — Informatika',
    activePage: 'Workspace: Drone Pemantau Terumbu Karang',
    device: 'Chrome 124 / Windows 11',
    deviceType: 'desktop',
    ipAddress: '180.252.74.112',
    location: 'Denpasar, Bali',
    loginTime: '15 menit lalu',
    lastActive: 'Aktif baru saja (2s)',
    lastPingTimestamp: Date.now() - 2000,
    status: 'active',
    requestsCount: 74,
    avatarColor: '#2563eb'
  },
  {
    sessionId: 'sess_live_102',
    userId: 3,
    userName: 'Ni Putu Ayu Pradnyani',
    role: 'student',
    identifier: 'NIM 2205551012',
    faculty: 'Fakultas Teknik — Elektro',
    activePage: 'Logbook Jurnal Ilmiah (Entry #14)',
    device: 'Safari 17.4 / macOS Sonoma',
    deviceType: 'desktop',
    ipAddress: '114.125.89.201',
    location: 'Badung, Bali',
    loginTime: '32 menit lalu',
    lastActive: 'Aktif 1m lalu',
    lastPingTimestamp: Date.now() - 45000,
    status: 'active',
    requestsCount: 128,
    avatarColor: '#7c3aed'
  },
  {
    sessionId: 'sess_live_103',
    userId: 4,
    userName: 'Dr. Eng. Hendra Kurniawan, S.T., M.Eng.',
    role: 'lecturer',
    identifier: 'NIDN 0012058201',
    faculty: 'Fakultas Teknik — Lab Robotika',
    activePage: 'Penilaian Rubrik Kompetisi Riset',
    device: 'Chrome 124 / Windows 10 Pro',
    deviceType: 'desktop',
    ipAddress: '36.85.112.45',
    location: 'Surabaya, Jawa Timur',
    loginTime: '48 menit lalu',
    lastActive: 'Aktif baru saja (8s)',
    lastPingTimestamp: Date.now() - 8000,
    status: 'active',
    requestsCount: 215,
    avatarColor: '#059669'
  },
  {
    sessionId: 'sess_live_104',
    userId: 5,
    userName: 'Prof. Dr. Ir. Wayan Windia, M.Sc.',
    role: 'lecturer',
    identifier: 'NIDN 0028096102',
    faculty: 'Fakultas Pertanian — Bioteknologi',
    activePage: 'Verifikasi Pengajuan Konsultasi Laboratorium',
    device: 'Safari / iPad Pro (iPadOS 17)',
    deviceType: 'tablet',
    ipAddress: '182.253.16.88',
    location: 'Denpasar, Bali',
    loginTime: '12 menit lalu',
    lastActive: 'Aktif 3m lalu',
    lastPingTimestamp: Date.now() - 180000,
    status: 'active',
    requestsCount: 42,
    avatarColor: '#d97706'
  },
  {
    sessionId: 'sess_live_105',
    userId: 6,
    userName: 'Bima Arya Santoso',
    role: 'student',
    identifier: 'NIM 2108561089',
    faculty: 'FMIPA — Sains Data',
    activePage: 'Katalog Inovasi & Open Recruitment',
    device: 'Chrome Mobile / Android 14',
    deviceType: 'mobile',
    ipAddress: '125.163.22.90',
    location: 'Jakarta Selatan',
    loginTime: '8 menit lalu',
    lastActive: 'Aktif baru saja (4s)',
    lastPingTimestamp: Date.now() - 4000,
    status: 'active',
    requestsCount: 36,
    avatarColor: '#0891b2'
  }
];

export function getActiveSessions(): ActiveSession[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACTIVE_SESSIONS));
  } catch (e) {
    // ignore
  }
  return INITIAL_ACTIVE_SESSIONS;
}

export function saveActiveSessions(sessions: ActiveSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_NAME);
      channel.postMessage({ type: 'SESSIONS_UPDATED', count: sessions.length });
      channel.close();
    }
  } catch (e) {
    // ignore
  }
}

// Register or update the currently active session from the browser
export function registerCurrentSession(user: { id: number; name: string; role: any; identifier: string; study_program?: string; faculty?: string }, activePage: string): void {
  try {
    let mySessionId = sessionStorage.getItem('steamcraft_my_session_id');
    if (!mySessionId) {
      mySessionId = `sess_live_${user.id}_${Date.now().toString(36)}`;
      sessionStorage.setItem('steamcraft_my_session_id', mySessionId);
    }

    const sessions = getActiveSessions();
    const existingIdx = sessions.findIndex(s => s.sessionId === mySessionId || s.userId === user.id);

    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isTablet = /iPad/i.test(ua);
    const deviceType: 'desktop' | 'mobile' | 'tablet' = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
    const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Safari') ? 'Safari' : ua.includes('Firefox') ? 'Firefox' : 'Browser';

    const sessionObj: ActiveSession = {
      sessionId: mySessionId,
      userId: user.id,
      userName: user.name,
      role: user.role,
      identifier: user.identifier || `UID-${user.id}`,
      faculty: user.study_program || user.faculty || 'Civitas STEAM',
      activePage: activePage || 'Dashboard',
      device: `${browser} / ${deviceType === 'desktop' ? 'PC' : 'Mobile'}`,
      deviceType,
      ipAddress: '163.223.227.38 (Client)',
      location: 'Indonesia (WITA/WIB)',
      loginTime: 'Baru saja',
      lastActive: 'Aktif sekarang (1s)',
      lastPingTimestamp: Date.now(),
      status: 'active',
      requestsCount: (existingIdx !== -1 ? sessions[existingIdx].requestsCount + 1 : 1),
      avatarColor: user.role === 'admin' ? '#0f172a' : user.role === 'lecturer' ? '#059669' : '#2563eb'
    };

    if (existingIdx !== -1) {
      sessions[existingIdx] = {
        ...sessions[existingIdx],
        ...sessionObj,
        requestsCount: sessions[existingIdx].requestsCount + 1
      };
    } else {
      sessions.unshift(sessionObj);
    }

    saveActiveSessions(sessions);
  } catch (e) {
    // ignore
  }
}

export function terminateActiveSession(sessionId: string): ActiveSession[] {
  const current = getActiveSessions();
  const updated = current.filter(s => s.sessionId !== sessionId);
  saveActiveSessions(updated);

  // Broadcast terminate command to the target tab
  try {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('steamcraft_terminate_channel');
      channel.postMessage({ type: 'FORCE_LOGOUT', sessionId });
      channel.close();
    }
  } catch (e) {
    // ignore
  }
  return updated;
}

export function sendAlertToSession(sessionId: string, message: string): boolean {
  try {
    const alertKey = `steamcraft_session_alert_${sessionId}`;
    localStorage.setItem(alertKey, JSON.stringify({
      message,
      timestamp: new Date().toISOString(),
      sentBy: 'Master Administrator / DevOps'
    }));
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('steamcraft_alert_channel');
      channel.postMessage({ type: 'DIRECT_ALERT', sessionId, message });
      channel.close();
    }
    return true;
  } catch (e) {
    return false;
  }
}
