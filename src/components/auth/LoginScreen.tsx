import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, switchDemoUser, openModal } = useApp();
  const [roleTab, setRoleTab] = useState<'student' | 'lecturer'>('student');
  const [username, setUsername] = useState('202610101');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleTabChange = (role: 'student' | 'lecturer') => {
    setRoleTab(role);
    if (role === 'student') {
      setUsername('202610101');
      setPassword('password123');
    } else {
      setUsername('202509237');
      setPassword('dosen123');
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Identitas atau kata sandi tidak cocok. Silakan coba salah satu akun demo di bawah.');
    }
  };

  return (
    <div className="login-screen">
      {/* Left Showcase */}
      <section className="login-showcase">
        <div className="login-topline-spacer" aria-hidden="true" />

        <div className="login-brand-image">
          <img src="/logo.jpg?v=20261021" alt="SteamCraft Logo" />
        </div>

        <div className="login-copy">
          <h1>
            Ruang untuk Rasa Ingin Tahu <span>Lintas Disiplin.</span>
          </h1>
          <p>
            Integrasikan eksplorasi sains, implementasi teknologi, rancang bangun rekayasa, ekspresi estetika seni,
            dan ketelitian matematika dalam satu alur kerja riset civitas akademika.
          </p>

          <div className="login-discipline">
            <span className="disc-pill disc-indicator" title="Pilar Sains">
              <span className="dot dot-blue"></span> Science
            </span>
            <span className="disc-pill disc-indicator" title="Pilar Teknologi">
              <span className="dot dot-teal"></span> Technology
            </span>
            <span className="disc-pill disc-indicator" title="Pilar Rekayasa">
              <span className="dot dot-amber"></span> Engineering
            </span>
            <span className="disc-pill disc-indicator" title="Pilar Seni & Humaniora">
              <span className="dot dot-rose"></span> Art
            </span>
            <span className="disc-pill disc-indicator" title="Pilar Matematika & Komputasi">
              <span className="dot dot-purple"></span> Mathematics
            </span>
          </div>
        </div>

        <div className="login-footer-note">
          SteamCraft &copy; 2026. Standar Inovasi Pendidikan Tinggi Nasional.
        </div>
      </section>

      {/* Right Login Panel */}
      <section className="login-panel">
        {/* Mobile Brand Header */}
        <div className="login-mobile-brand" style={{ display: 'none' }}>
          <img src="/logo.jpg?v=20261021" alt="SteamCraft" className="brand-logo-img" style={{ width: '44px', height: '44px' }} />
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 900, color: 'var(--navy)', lineHeight: 1.1, margin: 0 }}>
              SteamCraft
            </h2>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Ruang Kolaborasi Multidisiplin
            </span>
          </div>
        </div>

        <div className="auth-card">
          <div className="eyebrow" style={{ marginBottom: '6px' }}>
            Autentikasi Terintegrasi
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
            Masuk ke Workspace
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
            Pilih peran Anda untuk mengakses ruang kerja riset STEAM.
          </p>

          {/* Role Tabs */}
          <div className="auth-role-tabs">
            <button
              type="button"
              className={roleTab === 'student' ? 'active' : ''}
              onClick={() => handleRoleTabChange('student')}
            >
              Mahasiswa
            </button>
            <button
              type="button"
              className={roleTab === 'lecturer' ? 'active' : ''}
              onClick={() => handleRoleTabChange('lecturer')}
            >
              Dosen / Pembimbing
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>
                {roleTab === 'student' ? 'NIM (Nomor Induk Mahasiswa) / Username' : 'NIDN / NIP Dosen / Username'}
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={roleTab === 'student' ? 'Contoh: 202610101 (NIM) atau budi' : 'Contoh: 202509237 atau dosen'}
                required
              />
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => openModal('forgotPassword')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn btn-primary auth-submit-btn" style={{ width: '100%', padding: '11px', marginTop: '6px' }}>
              <span>Masuk ke Ruang Kerja</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Switcher Bar - Compact & Clean ala SISTER */}
            <div className="auth-quick-demo">
              <div className="quick-demo-header">
                <Sparkles size={12} className="text-primary" />
                <span>Uji Coba Cepat (Akun Demo Juri & Penguji):</span>
              </div>
              <div className="quick-demo-grid">
                <button
                  type="button"
                  className="quick-demo-pill"
                  onClick={() => switchDemoUser('budi')}
                  title="Masuk sebagai Mahasiswa Peneliti Budi Santoso"
                >
                  <span className="demo-icon">🎓</span>
                  <div className="demo-text">
                    <strong>Budi Santoso</strong>
                    <small>Mahasiswa Sains Data</small>
                  </div>
                </button>
                <button
                  type="button"
                  className="quick-demo-pill highlight"
                  onClick={() => switchDemoUser('dosen')}
                  title="Masuk sebagai Dosen Pembimbing Dr. Belgis Ainatul Iza"
                >
                  <span className="demo-icon">👩‍🏫</span>
                  <div className="demo-text">
                    <strong>Dr. Belgis A. Iza</strong>
                    <small>Dosen FMIPA UNESA</small>
                  </div>
                </button>
              </div>
            </div>

            {/* Register New Account Text Link */}
            <div className="auth-register-row">
              <span>Belum punya akun peneliti?</span>{' '}
              <button
                type="button"
                className="auth-register-link-btn"
                onClick={() => openModal('register')}
              >
                Daftar Akun Baru
              </button>
            </div>

            {/* Hub Portofolio Projek Tim */}
            <div className="auth-hub-footer">
              <a href="https://steamcraft.online" target="_blank" rel="noopener noreferrer">
                🌐 Hub Portofolio Projek Tim (steamcraft.online) &rarr;
              </a>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
