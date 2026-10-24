import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Maximize2,
  ExternalLink,
  Download,
  X,
  Compass,
  Activity,
  Award
} from 'lucide-react';
import { SparkleIcon } from './SteamIdCard';

export const SteamEcosystemSection: React.FC<{ onOpenApp?: () => void }> = ({ onOpenApp }) => {
  const [showBrandModal, setShowBrandModal] = useState<boolean>(false);

  const pillars = [
    {
      icon: Compass,
      color: '#3b82f6',
      badge: 'Metodologi Ilmiah 5 Tahap',
      title: 'Sains & Metodologi Terverifikasi',
      desc: 'Standar riset terstruktur mulai dari penemuan fenomena, pencatatan logbook empiris, perancangan model, pengujian replikabilitas, hingga audit rubrik akademik terintegrasi.'
    },
    {
      icon: Layers,
      color: '#8b5cf6',
      badge: 'FAIR Data & VeriLab AI',
      title: 'Repositori Data & Engine Audit AI',
      desc: 'Pengelolaan data eksperimen berstandar FAIR terintegrasi langsung dengan engine saintifik VeriLab AI (verilab.steamcraft.online, dikembangkan oleh Muhammad Naza Firmansyah) untuk verifikasi replikabilitas, deteksi anomali sensor, dan sertifikat audit SHA-256.'
    },
    {
      icon: Cpu,
      color: '#10b981',
      badge: 'Hardware & Telemetri IoT',
      title: 'Rekayasa Fisik & Instrumentasi Cerdas',
      desc: 'Integrasi telemetri otonom berbasis ESP32 dan LoRaWAN jarak jauh, instrumen pelampung kelautan bertenaga mikro-solar, serta pengujian bio-material ramah lingkungan.'
    },
    {
      icon: Award,
      color: '#0891b2',
      badge: 'Radar Pentagon STEAM',
      title: 'Dossier Kompetensi & Evaluasi 360°',
      desc: 'Visualisasi pemetaan 5 dimensi STEAM melalui diagram Radar Pentagon interaktif, penilaian sejawat terverifikasi, dan sertifikasi kelayakan riset siap publikasi.'
    }
  ];

  return (
    <section id="philosophy" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Ambient Sparkles */}
      <div style={{ position: 'absolute', top: '20px', left: '10px', opacity: 0.5, pointerEvents: 'none' }}>
        <SparkleIcon size={26} color="#93c5fd" />
      </div>
      <div style={{ position: 'absolute', bottom: '40px', right: '20px', opacity: 0.55, pointerEvents: 'none' }}>
        <SparkleIcon size={30} color="#8b5cf6" />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 16px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#2563eb',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: '12px'
          }}
        >
          <Sparkles size={14} color="#3b82f6" />
          <span>EKOSISTEM &amp; METODOLOGI RISET TERPADU</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 900,
            color: '#1e3a8a',
            margin: '0 0 12px 0',
            letterSpacing: '-0.5px',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Pilar Keunggulan Riset STEAM-Craft
        </h2>

        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
          Menyatukan riset perangkat lunak, instrumen telemetri lab fisik, dan metodologi saintifik terverifikasi dalam satu
          ekosistem kolaboratif yang terhubung langsung ke platform riset digital.
        </p>
      </div>

      {/* 4 Core Pillars Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '22px',
          marginBottom: '36px'
        }}
      >
        {pillars.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '22px',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(30, 58, 138, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: item.color
                }}
              />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: `${item.color}15`,
                      color: item.color,
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    <IconComp size={22} />
                  </div>

                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: `${item.color}10`,
                      color: item.color,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quote Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '20px',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '780px' }}>
          <SparkleIcon size={24} color="#2563eb" />
          <p style={{ margin: 0, fontSize: '14px', color: '#1e40af', fontStyle: 'italic', fontWeight: 600, lineHeight: 1.5 }}>
            &quot;STEAM adalah ruang kolaborasi civitas akademika untuk mengubah rasa ingin tahu ilmiah menjadi inovasi
            nyata yang berdampak luas bagi masyarakat.&quot;
          </p>
        </div>

        {/* Small Action to View Original Brand Guidelines */}
        <button
          onClick={() => setShowBrandModal(true)}
          style={{
            padding: '9px 16px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#1e3a8a',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          <Maximize2 size={13} color="#2563eb" />
          <span>Lihat Brand Guideline Resmi</span>
        </button>
      </div>

      {/* Modal for Master Brand Guideline Sheet */}
      {showBrandModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowBrandModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '1040px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>
                  Dokumen Master Panduan Identitas Visual STEAM
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Aset resmi: steam-brand-guideline.jpg
                </span>
              </div>
              <button
                onClick={() => setShowBrandModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <img
                src="/steam-brand-guideline.jpg"
                alt="Brand Guideline Resmi STEAM"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                9 Panel Modul Identitas Terpadu • Lisensi Hak Cipta Tim Peneliti STEAM 2026
              </span>
              <a
                href="/steam-brand-guideline.jpg"
                download="steam-brand-guideline-official.jpg"
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} />
                <span>Unduh Dokumen Asli</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
