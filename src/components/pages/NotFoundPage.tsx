import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Home, BookOpen, Sparkles, ArrowRight, Layers } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setCurrentPage, openModal } = useApp();

  return (
    <section className="page active" style={{ display: 'block', minHeight: '75vh', padding: '40px 16px' }}>
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          textAlign: 'center',
          background: 'white',
          border: '1px solid var(--line)',
          borderRadius: '24px',
          padding: '48px 24px',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Top Gradient Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 50%, #9333ea 100%)'
          }}
        />

        {/* 404 Illustration Badge */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
            border: '2px solid #bfdbfe',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)'
          }}
        >
          <Compass size={48} style={{ color: 'var(--primary)', animation: 'spin 12s linear infinite' }} />
        </div>

        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            background: '#fee2e2',
            color: '#b91c1c',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '1px',
            marginBottom: '14px',
            border: '1px solid #fecdd3'
          }}
        >
          STATUS 404 &bull; KOORDINAT TIDAK DITEMUKAN
        </div>

        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 900,
            color: 'var(--navy)',
            lineHeight: 1.2,
            marginBottom: '12px'
          }}
        >
          Eksplorasi Melebihi Batas Direktori Riset
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--ink-secondary)',
            maxWidth: '540px',
            margin: '0 auto 28px',
            lineHeight: 1.6
          }}
        >
          Halaman atau modul alur kerja yang Anda tuju tidak terdaftar di repositori sistem STEAM-Craft.
          Tautan mungkin telah diperbarui, berganti hak akses, atau berada di domain penelitian lain.
        </p>

        {/* Primary Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '32px'
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage('dashboard')}
            style={{ padding: '11px 22px', fontSize: '13.5px' }}
          >
            <Home size={16} />
            <span>Kembali ke Dashboard Utama</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage('projects')}
            style={{ padding: '11px 20px', fontSize: '13.5px' }}
          >
            <BookOpen size={16} />
            <span>Jelajahi Katalog Proyek</span>
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => openModal('quickTour')}
            style={{ padding: '11px 18px', fontSize: '13.5px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            <span>Buka Panduan Riset</span>
          </button>
        </div>

        {/* Quick Directory Jump Pill Links */}
        <div
          style={{
            borderTop: '1px solid var(--line-light)',
            paddingTop: '20px',
            maxWidth: '540px',
            margin: '0 auto'
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
            DESTINASI CEPAT ALUR RISET MAHASISWA &amp; DOSEN:
          </span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="disc-pill"
              onClick={() => setCurrentPage('workspace')}
              style={{ cursor: 'pointer', border: '1px solid var(--line)' }}
            >
              <Layers size={13} style={{ color: 'var(--primary)' }} />
              <span>Ruang Kerja Interaktif</span>
            </button>
            <button
              className="disc-pill"
              onClick={() => setCurrentPage('recruitment')}
              style={{ cursor: 'pointer', border: '1px solid var(--line)' }}
            >
              <span className="dot dot-teal" />
              <span>Open Recruitment</span>
            </button>
            <button
              className="disc-pill"
              onClick={() => setCurrentPage('studentPortfolio')}
              style={{ cursor: 'pointer', border: '1px solid var(--line)' }}
            >
              <span className="dot dot-orange" />
              <span>Portofolio STEAM</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
