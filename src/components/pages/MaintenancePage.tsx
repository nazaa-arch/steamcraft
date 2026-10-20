import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
  Sparkles,
  Cpu,
  Layers,
  Lock,
  Unlock,
  Server,
  Zap,
  Check,
  Send,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const {
    currentUser,
    setCurrentPage,
    maintenanceMode,
    setMaintenanceMode,
    login,
    showToast
  } = useApp();

  // Countdown timer in seconds (starts at 10 minutes = 600s)
  const [timeLeft, setTimeLeft] = useState<number>(584);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [showAdminBypass, setShowAdminBypass] = useState<boolean>(false);

  // Admin login form state (kosongkan secara default agar tidak terisi otomatis)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 1 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
  };

  const handleCheckStatus = () => {
    setIsChecking(true);
    setCheckResult(null);

    setTimeout(() => {
      setIsChecking(false);
      setCheckResult('🟢 Server merespons (Latency 18ms). Deployment tahap akhir 88% berjalan.');
      showToast('Status server aktif: Sinkronisasi akhir sedang berlangsung.');
    }, 1200);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const success = login(adminUsername, adminPassword);
    if (success) {
      showToast('Akses Administrator berhasil dikonfirmasi.');
      setShowAdminBypass(false);
      setCurrentPage('dashboard');
    } else {
      setAdminError('Kredensial Administrator tidak valid.');
    }
  };

  return (
    <div className="maintenance-wrapper" style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 10%, #0f172a 0%, #060913 100%)', color: '#f8fafc', padding: '36px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Admin Notice Strip (If Admin is viewing this page) */}
      {currentUser?.role === 'admin' && (
        <div
          style={{
            width: '100%',
            maxWidth: '860px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid #f59e0b',
            borderRadius: '16px',
            padding: '14px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <strong style={{ color: '#fbbf24', fontSize: '13px', display: 'block' }}>
                PRATINJAU MODE ADMINISTRATOR: {maintenanceMode ? 'SISTEM MAINTENANCE AKTIF' : 'SISTEM NORMAL (HANYA PRATINJAU)'}
              </strong>
              <small style={{ color: '#cbd5e1', fontSize: '11.5px' }}>
                {maintenanceMode
                  ? 'Pengguna umum non-admin saat ini melihat tampilan halaman ini.'
                  : 'Halaman ini sedang Anda uji/tinjau. Sistem publik masih berjalan normal.'}
              </small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {maintenanceMode ? (
              <button
                className="btn btn-sm btn-primary"
                style={{ background: '#22c55e', borderColor: '#16a34a', color: '#fff', fontWeight: 800 }}
                onClick={() => setMaintenanceMode(false)}
              >
                <Unlock size={14} />
                <span>Matikan Maintenance Sekarang</span>
              </button>
            ) : (
              <button
                className="btn btn-sm btn-primary"
                style={{ background: '#f59e0b', borderColor: '#d97706', color: '#000', fontWeight: 800 }}
                onClick={() => setMaintenanceMode(true)}
              >
                <Lock size={14} />
                <span>Aktifkan Maintenance Publik</span>
              </button>
            )}

            <button
              className="btn btn-sm btn-secondary"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => setCurrentPage('dashboard')}
            >
              Kembali ke Dashboard Admin &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Glass Maintenance Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '28px',
          padding: 'clamp(24px, 5vw, 48px)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(56, 189, 248, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Futuristic Glowing Top Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #ec4899 100%)'
          }}
        />

        {/* Brand Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
                fontWeight: 900,
                fontSize: '20px',
                color: '#fff'
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '1px', color: '#f8fafc' }}>
                STEAM-CRAFT
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Platform Kolaborasi Riset &amp; Inovasi Multidisiplin Civitas Akademika
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#38bdf8',
                display: 'inline-block',
                boxShadow: '0 0 10px #38bdf8',
                animation: 'pulse 1.8s infinite'
              }}
            />
            SEDANG DIPERBARUI &amp; SINKRONISASI
          </div>
        </div>

        {/* Center Hero Graphic & Headline */}
        <div style={{ textAlign: 'center', margin: '20px 0 32px 0' }}>
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '28px',
              background: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 12px 36px rgba(56, 189, 248, 0.15)',
              position: 'relative'
            }}
          >
            <Cpu size={44} style={{ color: '#38bdf8' }} />
            <div
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#f59e0b',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Wrench size={18} style={{ color: '#000' }} />
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.3,
              marginBottom: '12px'
            }}
          >
            Peningkatan Infrastruktur &amp; Pembaruan Sistem Riset
          </h1>

          <p
            style={{
              fontSize: '14.5px',
              color: '#94a3b8',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Platform STEAM-Craft saat ini sedang menjalani proses deployment berkala, peningkatan kecepatan rubrik penilaian,
            serta optimalisasi sinkronisasi data antar disiplin ilmu. Seluruh data riset Anda tersimpan aman dan terenkripsi.
          </p>
        </div>

        {/* Live Progress Bar & Countdown Meter */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} style={{ color: '#f59e0b' }} />
              <strong style={{ fontSize: '13px', color: '#f8fafc' }}>
                Kemajuan Deployment &amp; Verifikasi: 84% Selesai
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '13px', fontWeight: 800 }}>
              <Clock size={15} />
              <span>Estimasi Selesai: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div
            style={{
              width: '100%',
              height: '10px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '84%',
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #818cf8 100%)',
                boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          {checkResult && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={15} />
              <span>{checkResult}</span>
            </div>
          )}
        </div>

        {/* 4-Stage Deployment Pipeline */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '14px' }}>
            Tahapan Peningkatan Sistem
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>TAHAP 1</span>
                <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
              </div>
              <strong style={{ fontSize: '13px', color: '#f8fafc' }}>Backup Basis Data</strong>
              <small style={{ fontSize: '11px', color: '#94a3b8' }}>100% snapshot aman</small>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>TAHAP 2</span>
                <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
              </div>
              <strong style={{ fontSize: '13px', color: '#f8fafc' }}>Sinkronisasi Riset</strong>
              <small style={{ fontSize: '11px', color: '#94a3b8' }}>Rubrik &amp; alur kerja siap</small>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>TAHAP 3</span>
                <Activity size={16} style={{ color: '#38bdf8', animation: 'spin 4s linear infinite' }} />
              </div>
              <strong style={{ fontSize: '13px', color: '#38bdf8' }}>Deploy Cloud 84%</strong>
              <small style={{ fontSize: '11px', color: '#cbd5e1' }}>Penyebaran kode baru</small>
            </div>

            {/* Step 4 */}
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.2)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>TAHAP 4</span>
                <Clock size={16} style={{ color: '#64748b' }} />
              </div>
              <strong style={{ fontSize: '13px', color: '#94a3b8' }}>Verifikasi Sistem</strong>
              <small style={{ fontSize: '11px', color: '#64748b' }}>Antrean peluncuran</small>
            </div>
          </div>
        </div>

        {/* Changelog: What's New in this update */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '32px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={16} style={{ color: '#38bdf8' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Apa yang Baru dalam Pembaruan Versi Ini?
            </h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              fontSize: '12.5px',
              color: '#cbd5e1'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>&bull;</span>
              <div>
                <strong style={{ color: '#fff' }}>Fitur Undangan Proyek via Link &amp; Kode</strong>: Kolaborasi tim lebih mudah dengan tautan instan dan kode unik.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>&bull;</span>
              <div>
                <strong style={{ color: '#fff' }}>Peningkatan Tampilan Mobile &amp; Layar Kecil</strong>: Tata letak responsif, navigasi tab scrollable, dan penataan kartu yang lega.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>&bull;</span>
              <div>
                <strong style={{ color: '#fff' }}>Smart Passport Peneliti STEAM</strong>: Peningkatan visibilitas ID identitas keamanan digital di footer kartu profil.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#38bdf8' }}>&bull;</span>
              <div>
                <strong style={{ color: '#fff' }}>Dashboard Eksekutif Administrator</strong>: Pelaporan riset berkala dan pemantauan kendala metodologi ilmiah secara terpusat.
              </div>
            </div>
          </div>
        </div>

        {/* Primary Interactive Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}
        >
          <button
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '13.5px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.4)'
            }}
            onClick={handleCheckStatus}
            disabled={isChecking}
          >
            <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
            <span>{isChecking ? 'Menguji Koneksi Server...' : 'Periksa Status Server Sekarang'}</span>
          </button>

          <button
            className="btn btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '13.5px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#f8fafc'
            }}
            onClick={() => window.location.reload()}
          >
            <Server size={16} />
            <span>Muat Ulang Halaman</span>
          </button>

          <button
            className="btn btn-ghost"
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              color: '#94a3b8',
              borderColor: 'transparent'
            }}
            onClick={() => setShowAdminBypass(!showAdminBypass)}
          >
            <Shield size={16} />
            <span>{showAdminBypass ? 'Tutup Akses Admin' : 'Akses Khusus Administrator'}</span>
          </button>
        </div>

        {/* Admin Login / Emergency Bypass Collapsible Box */}
        {showAdminBypass && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              maxWidth: '520px',
              margin: '0 auto 24px auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Shield size={18} style={{ color: '#f59e0b' }} />
              <strong style={{ fontSize: '14px', color: '#fbbf24' }}>
                Autentikasi Akses Administrator / Tim Pengembang
              </strong>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
              Jika Anda adalah staf IT, dosen pengelola, atau juri lomba yang memerlukan akses verifikasi saat pemeliharaan,
              silakan masuk menggunakan akun administrator:
            </p>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  NIP / Username Admin:
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                  placeholder="admin atau 197901012005011003"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Kata Sandi Admin:
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                  placeholder="••••••••"
                />
              </div>

              {adminError && (
                <div style={{ fontSize: '11.5px', color: '#f87171' }}>
                  ⚠️ {adminError}
                </div>
              )}

              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', background: '#f59e0b', borderColor: '#d97706', color: '#000', fontWeight: 800, padding: '10px' }}
                >
                  <Lock size={14} />
                  <span>Masuk Sebagai Administrator</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Support Info */}
        <div
          style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.15)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div>
            Butuh bantuan mendesak? Hubungi{' '}
            <a href="mailto:cs@steamcraft.online" style={{ color: '#38bdf8', textDecoration: 'none' }}>
              cs@steamcraft.online
            </a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} STEAM-Craft Development &bull; Server ID: ID-JKT-NODE-01
          </div>
        </div>
      </div>
    </div>
  );
};
