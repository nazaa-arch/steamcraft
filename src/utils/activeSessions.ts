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
  status: 'active' | 'idle';
  requestsCount: number;
  avatarColor?: string;
}

const STORAGE_KEY = 'steamcraft_active_sessions';

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
    loginTime: '24 menit lalu',
    lastActive: 'Aktif baru saja (5s)',
    status: 'active',
    requestsCount: 68,
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
    loginTime: '45 menit lalu',
    lastActive: 'Aktif 1m lalu',
    status: 'active',
    requestsCount: 114,
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
    loginTime: '1 jam lalu',
    lastActive: 'Aktif baru saja (12s)',
    status: 'active',
    requestsCount: 203,
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
    status: 'active',
    requestsCount: 37,
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
    lastActive: 'Aktif baru saja (2s)',
    status: 'active',
    requestsCount: 29,
    avatarColor: '#0891b2'
  },
  {
    sessionId: 'sess_live_106',
    userId: 7,
    userName: 'Dewi Lestari, S.Farm.',
    role: 'partner',
    identifier: 'Mitra PT Bali Bio Herbal',
    faculty: 'Kolaborator Industri Riset',
    activePage: 'Review Portofolio Ekstrak Herbal Mangrove',
    device: 'Safari / iPhone 15 Pro',
    deviceType: 'mobile',
    ipAddress: '139.195.44.18',
    location: 'Bandung, Jawa Barat',
    loginTime: '32 menit lalu',
    lastActive: 'Idle 4m lalu',
    status: 'idle',
    requestsCount: 52,
    avatarColor: '#e11d48'
  },
  {
    sessionId: 'sess_live_107',
    userId: 8,
    userName: 'Kadek Surya Dharmawan',
    role: 'student',
    identifier: 'NIM 2308561008',
    faculty: 'FMIPA — Kimia Terapan',
    activePage: 'Workspace Proyek: Baterai Biosintesis Jamur',
    device: 'Edge 123 / Windows 11',
    deviceType: 'desktop',
    ipAddress: '180.244.15.221',
    location: 'Singaraja, Bali',
    loginTime: '50 menit lalu',
    lastActive: 'Aktif baru saja (8s)',
    status: 'active',
    requestsCount: 88,
    avatarColor: '#4f46e5'
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

  // Save initial if not existing
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
  } catch (e) {
    // ignore
  }
}

export function terminateActiveSession(sessionId: string): ActiveSession[] {
  const current = getActiveSessions();
  const updated = current.filter(s => s.sessionId !== sessionId);
  saveActiveSessions(updated);
  return updated;
}

export function sendAlertToSession(sessionId: string, message: string): boolean {
  // Store a pending alert for this session in localStorage so that tab can display it
  try {
    const alertKey = `steamcraft_session_alert_${sessionId}`;
    localStorage.setItem(alertKey, JSON.stringify({
      message,
      timestamp: new Date().toISOString(),
      sentBy: 'Master Administrator / DevOps'
    }));
    return true;
  } catch (e) {
    return false;
  }
}
