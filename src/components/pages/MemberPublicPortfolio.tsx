import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Globe,
  Printer,
  Download,
  Share2,
  Code2,
  BookOpen
} from 'lucide-react';
import { DEFAULT_STEAM_MEMBERS, SteamMemberData, SteamLogoVector, SparkleIcon } from './SteamIdCard';

interface MemberPortfolioDetails {
  member: SteamMemberData;
  radarScores: { S: number; T: number; E: number; A: number; M: number };
  bio: string;
  leadProjects: {
    title: string;
    category: string;
    role: string;
    impact: string;
    tags: string[];
  }[];
  verifiedBadges: string[];
}

const MEMBER_PORTFOLIO_DATA: { [key: string]: MemberPortfolioDetails } = {
  naza: {
    member: DEFAULT_STEAM_MEMBERS[0],
    radarScores: { S: 90, T: 98, E: 92, A: 88, M: 94 },
    bio: 'Lead System Architect & Full-Stack Engineer yang merancang arsitektur terintegrasi platform STEAM-Craft. Berfokus pada keandalan sistem cloud, repositori data terverifikasi standar FAIR, dan integritas replikabilitas algoritma ilmiah.',
    leadProjects: [
      {
        title: 'STEAM-Craft — Platform Riset & Kolaborasi Multidisiplin Civitas Akademika',
        category: 'Perangkat Lunak Terpadu (Flagship)',
        role: 'Lead Architect & Core Full-Stack Developer',
        impact: 'Menghubungkan alur riset 5 tahap, audit rubrik ilmiah, logbook digital terenkripsi, dan modul bimbingan lintas prodi.',
        tags: ['React 19', 'TypeScript', 'FAIR Data', 'DevOps', 'Vite', 'Cloud Sync']
      },
      {
        title: 'AI Scientific Reproducibility & Data Integrity Engine',
        category: 'Kecerdasan Buatan & Pipa Riset',
        role: 'AI System Designer',
        impact: 'Mesin audit otomatis kurva sensor kalibrasi dan simulasi ketahanan stokastik Monte Carlo.',
        tags: ['Python AI Engine', 'Monte Carlo', 'Reproducibility', 'Security']
      }
    ],
    verifiedBadges: [
      'Master System Architect',
      'FAIR Data Specialist',
      'Full-Stack Vanguard',
      'Research Integrity Lead'
    ]
  },
  bima: {
    member: DEFAULT_STEAM_MEMBERS[1],
    radarScores: { S: 92, T: 95, E: 98, A: 84, M: 90 },
    bio: 'Hardware Engineer & IoT Telemetry Specialist dengan keahlian dalam perancangan sirkuit mikro-kontroler ESP32 berdaya rendah, antena transmisi LoRaWAN 915MHz, serta sistem konversi energi surya mandiri MPPT.',
    leadProjects: [
      {
        title: 'IoT Marine Buoy — Telemetri Otonom Pemantau Terumbu Karang',
        category: 'Hardware IoT & Konservasi Bahari',
        role: 'Lead Hardware & Firmware Engineer',
        impact: 'Pelampung pintar bertenaga surya mikro dengan jangkauan transmisi data oseanografi LoRaWAN hingga 8.5 km.',
        tags: ['ESP32', 'LoRaWAN 915MHz', 'BME280', 'Turbidity Sensor', 'Micro-Solar MPPT']
      },
      {
        title: 'Precision Agro-Drone — Pemantau Mikroklimat Pertanian Terasering',
        category: 'Robotika & Pertanian Presisi',
        role: 'Avionics Specialist',
        impact: 'Sistem autopilot quadcopter untuk pemetaan indeks vegetasi (NDVI) di kontur tanah terasering curam.',
        tags: ['PX4 Autopilot', 'Multispectral Camera', 'Agro-Robotics']
      }
    ],
    verifiedBadges: [
      'IoT Telemetry Lead',
      'Hardware Prototype Pioneer',
      'Solar Power Optimizer',
      'Firmware Specialist'
    ]
  },
  sandi: {
    member: DEFAULT_STEAM_MEMBERS[2],
    radarScores: { S: 95, T: 88, E: 86, A: 96, M: 92 },
    bio: 'Research Analyst & Creative Designer yang menggabungkan metodologi riset ilmiah, estetika identitas visual, dan analisis bioteknologi ramah lingkungan untuk menciptakan produk riset yang aplikatif dan human-centered.',
    leadProjects: [
      {
        title: 'EcoBiosynthesis Mycobattery — Baterai Organik Biodegradabel',
        category: 'Bioteknologi Material Hijau',
        role: 'Lead Bio-materials Researcher & Designer',
        impact: 'Inovasi sel baterai ramah lingkungan dari miselium jamur tiram dan elektrolit kitosan alami (>350 siklus).',
        tags: ['Miselium Jamur', 'Kitosan Alami', 'Cyclic Voltammetry', 'Non-Toxic Battery']
      },
      {
        title: 'Identitas Visual & Sistem Desain Brand STEAM',
        category: 'Seni, Estetika & Humaniora',
        role: 'Brand & UI/UX Director',
        impact: 'Perancangan 8 modul identitas visual, desain kartu tanda pengenal resmi, dan pedoman tata kelola grafis STEAM.',
        tags: ['Brand Guidelines', 'UI/UX Design', 'Design Thinking', 'Visual Assets']
      }
    ],
    verifiedBadges: [
      'Design Director',
      'Green Bio-materials Innovator',
      'Methodology Analyst',
      'Scientific Visualizer'
    ]
  }
};

export const MemberPublicPortfolio: React.FC<{ memberId: 'naza' | 'bima' | 'sandi' }> = ({ memberId }) => {
  const details = MEMBER_PORTFOLIO_DATA[memberId] || MEMBER_PORTFOLIO_DATA.naza;
  const { member, radarScores, bio, leadProjects, verifiedBadges } = details;

  // Calculate radar pentagon points
  const size = 260;
  const center = size / 2;
  const radius = size * 0.4;
  const angles = [
    -Math.PI / 2, // S: Top (0 rad)
    -Math.PI / 2 + (2 * Math.PI) / 5, // T
    -Math.PI / 2 + (4 * Math.PI) / 5, // E
    -Math.PI / 2 + (6 * Math.PI) / 5, // A
    -Math.PI / 2 + (8 * Math.PI) / 5 // M
  ];

  const scores = [radarScores.S, radarScores.T, radarScores.E, radarScores.A, radarScores.M];
  const labels = ['Science (S)', 'Tech (T)', 'Engineering (E)', 'Arts (A)', 'Math (M)'];

  const scorePoints = scores
    .map((score, i) => {
      const r = (score / 100) * radius;
      const x = center + r * Math.cos(angles[i]);
      const y = center + r * Math.sin(angles[i]);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 80% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 15% 25%, rgba(139, 92, 246, 0.06) 0%, transparent 45%), #f8fafc',
        color: '#0f172a',
        fontFamily: "'Montserrat', sans-serif",
        lineHeight: 1.6
      }}
    >
      {/* Top Banner Navigation */}
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="https://steamcraft.online"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#eff6ff',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '12.5px',
              fontWeight: 700
            }}
          >
            <ArrowLeft size={14} />
            <span>Hub Projek Tim (steamcraft.online)</span>
          </a>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            Portofolio Resmi Peneliti STEAM
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#1e3a8a',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={13} />
            <span>Cetak Dossier</span>
          </button>

          <a
            href="https://app.steamcraft.online"
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              color: '#fff',
              fontSize: '12.5px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            <span>Buka Aplikasi STEAM-Craft</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </header>

      {/* Hero Dossier Card */}
      <div style={{ maxWidth: '1100px', margin: '40px auto 0 auto', padding: '0 24px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 50px rgba(30, 58, 138, 0.08)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Top Gradient Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0b2e88 0%, #1e40af 40%, #3b82f6 80%, #7c3aed 100%)',
              height: '140px',
              position: 'relative',
              padding: '24px 32px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SteamLogoVector variant="white" size={40} />
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '2px' }}>STEAM</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              <ShieldCheck size={14} color="#38bdf8" />
              <span>TERVERIFIKASI RESMI • ID: {member.steamId}</span>
            </div>
          </div>

          {/* Dossier Body */}
          <div style={{ padding: '0 36px 36px 36px', marginTop: '-50px' }}>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {/* Avatar Circle */}
              <div
                style={{
                  width: '104px',
                  height: '104px',
                  borderRadius: '50%',
                  background: member.gradient,
                  color: '#ffffff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '34px',
                  fontWeight: 900,
                  boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)',
                  border: '5px solid #ffffff',
                  flexShrink: 0
                }}
              >
                {member.avatarInitial}
              </div>

              <div style={{ flex: 1, minWidth: '260px' }}>
                <h1
                  style={{
                    fontSize: 'clamp(24px, 3.5vw, 32px)',
                    fontWeight: 900,
                    color: '#1e3a8a',
                    margin: '0 0 4px 0',
                    lineHeight: 1.2
                  }}
                >
                  {member.name}
                </h1>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#2563eb',
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  {member.role}
                </span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  Divisi: {member.division} • Bergabung: {member.joinDate}
                </span>
              </div>
            </div>

            <p style={{ marginTop: '24px', fontSize: '14.5px', color: '#475569', lineHeight: 1.7, maxWidth: '860px' }}>
              {bio}
            </p>

            {/* Quote Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: '#1e40af',
                fontSize: '12.5px',
                fontStyle: 'italic',
                fontWeight: 600,
                marginTop: '14px'
              }}
            >
              <SparkleIcon size={14} color="#2563eb" />
              <span>&quot;{member.quote}&quot;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Radar Matrix + Projects */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '36px auto 60px auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px'
        }}
      >
        {/* Left Column: STEAM Pentagon Radar Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>
                Matriks Radar Pentagon STEAM
              </h3>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>
                Skor 5 Dimensi
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 20px 0' }}>
              Pemetaan kompetensi saintifik terstandarisasi berbasis integrasi 5 pilar keilmuan riset:
            </p>

            {/* SVG Pentagon Radar */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Concentric Webs */}
                {[0.25, 0.5, 0.75, 1].map((step, idx) => {
                  const pts = angles
                    .map((ang) => {
                      const r = step * radius;
                      const x = center + r * Math.cos(ang);
                      const y = center + r * Math.sin(ang);
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={idx}
                      points={pts}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1.2"
                      strokeDasharray={step === 1 ? 'none' : '3 3'}
                    />
                  );
                })}

                {/* Axis Spoke Lines */}
                {angles.map((ang, idx) => {
                  const x = center + radius * Math.cos(ang);
                  const y = center + radius * Math.sin(ang);
                  return <line key={idx} x1={center} y1={center} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />;
                })}

                {/* Score Area Polygon */}
                <polygon
                  points={scorePoints}
                  fill="rgba(37, 99, 235, 0.25)"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                />

                {/* Score Dots */}
                {scores.map((score, i) => {
                  const r = (score / 100) * radius;
                  const x = center + r * Math.cos(angles[i]);
                  const y = center + r * Math.sin(angles[i]);
                  return <circle key={i} cx={x} cy={y} r="4.5" fill="#1e3a8a" stroke="#fff" strokeWidth="2" />;
                })}
              </svg>
            </div>

            {/* Score Breakdown Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              {labels.map((lbl, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{lbl}</span>
                  <strong style={{ color: '#1e3a8a' }}>{scores[idx]} / 100</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Box */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              LENCANA KOMPETENSI TERVERIFIKASI
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {verifiedBadges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    color: '#1e3a8a',
                    border: '1px solid #e2e8f0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircle2 size={12} color="#16a34a" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Projects Portfolio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e3a8a', margin: '0 0 6px 0' }}>
              Inisiatif &amp; Portofolio Riset Utama
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 20px 0' }}>
              Proyek riset multidisiplin yang dipimpin dalam ekosistem STEAM-Craft:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {leadProjects.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '18px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    {p.category}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 6px 0' }}>
                    {p.title}
                  </h4>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>
                    Peran: {p.role}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                    {p.impact}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {p.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#ffffff',
                          color: '#475569',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Research Passport Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              borderRadius: '24px',
              padding: '24px 28px',
              color: '#ffffff',
              boxShadow: '0 12px 30px rgba(30, 58, 138, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Award size={18} color="#38bdf8" />
                <strong style={{ fontSize: '15px', letterSpacing: '0.5px' }}>Dossier Portofolio Terverifikasi</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                Dokumen ini memenuhi standar audit kelayakan ilmiah &amp; rubrik pendidikan tinggi nasional.
              </p>
            </div>

            <a
              href="https://app.steamcraft.online"
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#1e3a8a',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Verifikasi di Platform</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          padding: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#64748b'
        }}
      >
        &copy; 2026 Tim Peneliti STEAM-Craft. Terdaftar resmi di sistem domain steamcraft.online.
      </footer>
    </div>
  );
};
