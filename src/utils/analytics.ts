/**
 * STEAM-Craft Telemetry & Free Web Analytics Integration
 * Supports Google Analytics 4 (GA4) and built-in live telemetry stream.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  label?: string;
  value?: number;
  userRole?: string;
  path: string;
}

const LOCAL_STORAGE_KEY = 'steamcraft_telemetry_events';

// In-memory buffer for real-time dashboard listeners
type TelemetryListener = (event: AnalyticsEvent) => void;
const listeners: TelemetryListener[] = [];

export function subscribeTelemetry(listener: TelemetryListener): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function getTelemetryHistory(): AnalyticsEvent[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }

  // Initial realistic sample events if none exist
  const initialEvents: AnalyticsEvent[] = [
    {
      id: 'evt_1',
      timestamp: new Date(Date.now() - 45000).toLocaleTimeString('id-ID'),
      action: 'view_project',
      category: 'Research',
      label: 'Proyek IoT Sensor Kualitas Air Danau',
      userRole: 'Mahasiswa (FMIPA)',
      path: '/projects'
    },
    {
      id: 'evt_2',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString('id-ID'),
      action: 'consultation_request',
      category: 'Consultation',
      label: 'Bimbingan Metodologi Reproduktibilitas',
      userRole: 'Mahasiswa (Teknik)',
      path: '/consultations'
    },
    {
      id: 'evt_3',
      timestamp: new Date(Date.now() - 240000).toLocaleTimeString('id-ID'),
      action: 'rubric_eval_save',
      category: 'Assessment',
      label: 'Penilaian Rubrik Proyek Drone Terumbu Karang',
      userRole: 'Dosen Pembimbing',
      path: '/admin'
    },
    {
      id: 'evt_4',
      timestamp: new Date(Date.now() - 360000).toLocaleTimeString('id-ID'),
      action: 'user_login',
      category: 'Auth',
      label: 'Login Civitas SSO',
      userRole: 'Mitra Industri',
      path: '/login'
    }
  ];

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialEvents));
  } catch (e) {
    // ignore
  }
  return initialEvents;
}

export function trackEvent(
  action: string,
  category: string = 'General',
  label?: string,
  value?: number,
  userRole?: string
): void {
  // 1. Send to Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        user_role: userRole
      });
    } catch (err) {
      console.warn('[Analytics] GA4 event dispatch error:', err);
    }
  }

  // 2. Record to local telemetry buffer for live dashboard
  const newEvent: AnalyticsEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('id-ID'),
    action,
    category,
    label,
    value,
    userRole,
    path: window.location.pathname + window.location.search
  };

  try {
    const history = getTelemetryHistory();
    history.unshift(newEvent);
    // Keep max 50 events
    const trimmed = history.slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    // ignore storage error
  }

  // Notify active dashboard listeners
  listeners.forEach(fn => fn(newEvent));
}

export function trackPageView(pageName: string): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'page_view', {
        page_title: `STEAM-Craft — ${pageName}`,
        page_location: window.location.href,
        page_path: `/${pageName}`
      });
    } catch (err) {
      // ignore
    }
  }
  trackEvent('page_view', 'Navigation', pageName);
}
