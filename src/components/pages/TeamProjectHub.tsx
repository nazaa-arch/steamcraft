import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  Cpu,
  Leaf,
  Globe,
  Radio,
  Shield,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Code2,
  Rocket,
  Terminal,
  Activity,
  Zap,
  Mail,
  ChevronRight
} from 'lucide-react';

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  categoryBadge: string;
  badgeColor: string;
  description: string;
  status: 'live' | 'lab' | 'pipeline';
  statusText: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  targetUrl: string;
  isFlagship?: boolean;
}

export const TeamProjectHub: React.FC<{ onLaunchApp?: () => void }> = ({ onLaunchApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const projects: ProjectCard[] = [
    {
      id: 'steamcraft-platform',
      title: 'STEAM-Craft — Platform Riset & Kolaborasi Multidisiplin',
      category: 'software',
      categoryBadge: 'Platform Perangkat Lunak Terintegrasi',
      badgeColor: '#0284c7',
      isFlagship: true,
      description:
        'Platform resmi inkubasi dan orkestrasi riset kolaboratif mahasiswa dan dosen pembimbing berbasis metodologi STEAM. Dilengkapi manajemen checkpoint terstruktur, logbook digital, open recruitment pencarian talenta lintas prodi, repositori berstandar FAIR, serta sistem audit rubrik ilmiah nasional.',
      status: 'live',
      statusText: 'Production Live (Aktif)',
      tags: ['React 19', 'TypeScript', 'FAIR Data', 'Rubrik Ilmiah', 'Vite', 'Multi-tenant'],
      metrics: [
        { label: 'Domain Akses', value: 'app.steamcraft.online' },
        { label: 'Model Evaluasi', value: '4 Dimensi Rubrik' },
        { label: 'Status Server', value: 'AnymHost Cloud Node' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'iot-coral-reef',
      title: 'IoT Marine Buoy — Telemetri Otonom Pemantau Terumbu Karang',
      category: 'hardware',
      categoryBadge: 'Hardware IoT & Konservasi Bahari',
      badgeColor: '#059669',
      description:
        'Sistem pelampung telemetri cerdas bertenaga surya mikro berbasis mikrokontroler ESP32 dan modulasi LoRaWAN. Memantau parameter oseanografi secara berkala (pH air laut, salinitas, kekeruhan turbidity, dan fluktuasi suhu permukaan) untuk mitigasi pemutihan karang (coral bleaching) di perairan tropis.',
      status: 'lab',
      statusText: 'Inkubasi Prototipe Hardware',
      tags: ['ESP32', 'LoRaWAN 915MHz', 'BME280', 'Analog Turbidity Sensor', 'Solar MPPT'],
      metrics: [
        { label: 'Jangkauan Radio', value: 'Hingga 8.5 km' },
        { label: 'Sampling Interval', value: '15 Menit Sekali' },
        { label: 'Otonomi Baterai', value: 'Tanpa Henti (Solar)' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'bio-mycobattery',
      title: 'EcoBiosynthesis Mycobattery — Baterai Organik Biodegradabel',
      category: 'bio',
      categoryBadge: 'Bioteknologi Material Hijau & Energi Bersih',
      badgeColor: '#d97706',
      description:
        'Inovasi sel penyimpanan daya sekunder ramah lingkungan yang memanfaatkan jaringan miselium jamur tiram (Pleurotus ostreatus) dan membran biopolimer kitosan sebagai elektrolit padat non-toksik. Mengeliminasi penggunaan logam berat berbahaya pada perangkat sensor portabel.',
      status: 'lab',
      statusText: 'Uji Validasi Siklus Siklik Lab',
      tags: ['Miselium Jamur', 'Kitosan Alami', 'Cyclic Voltammetry', 'Zero Toxic Waste'],
      metrics: [
        { label: 'Densitas Daya', value: '1.24 V / Sel' },
        { label: 'Biodegradabilitas', value: '100% Organik (90 Hari)' },
        { label: 'Siklus Pengisian', value: '> 350 Cycles' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'ai-reproducibility-verifier',
      title: 'AI Scientific Reproducibility & Data Integrity Engine',
      category: 'pipeline',
      categoryBadge: 'Kecerdasan Buatan & Pipa Riset Masa Depan',
      badgeColor: '#7c3aed',
      description:
        'Modul kecerdasan buatan untuk verifikasi replikasi kode dan audit integritas data eksperimen secara otomatis. Melakukan pengecekan konsistensi statistik, deteksi anomali kurva kalibrasi sensor, dan pengujian robustness berbasis simulasi stokastik Monte Carlo.',
      status: 'pipeline',
      statusText: 'Pipa Riset Tim Selanjutnya (Roadmap)',
      tags: ['Python AI Engine', 'Monte Carlo Simulation', 'Reproducibility Check', 'Jupyter Pipeline'],
      metrics: [
        { label: 'Fase Inkubasi', value: 'Perancangan Algoritma' },
        { label: 'Target Rilis', value: 'Q4 2026' },
        { label: 'Integrasi', value: 'STEAM-Craft Core API' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'precision-agrodrone',
      title: 'Precision Agro-Drone — Pemantau Mikroklimat Terasering',
      category: 'pipeline',
      categoryBadge: 'Robotika & Pertanian Presisi',
      badgeColor: '#0891b2',
      description:
        'Platform wahana udara tanpa awak (UAV) ringan berbasis arsitektur quadcopter dengan sensor multispektral. Didesain untuk memetakan indeks vegetasi tanaman (NDVI) dan kelembapan tanah di area kontur terasering pertanian berkelanjutan.',
      status: 'pipeline',
      statusText: 'Pipa Riset Tim Lanjutan (Roadmap)',
      tags: ['PX4 Autopilot', 'Multispectral Camera', 'NDVI Indexing', 'Precision Farming'],
      metrics: [
        { label: 'Radius Jelajah', value: '3.2 km' },
        { label: 'Fase', value: 'Studi Kelayakan Avionik' },
        { label: 'Afiliasi', value: 'Lab Robotika & Pertanian' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleOpenApp = (url?: string) => {
    if (onLaunchApp) {
      onLaunchApp();
      return;
    }
    // If running on production, direct to app.steamcraft.online
    if (window.location.hostname.includes('steamcraft.online')) {
      window.location.href = url || 'https://app.steamcraft.online';
    } else {
      // Localhost / dev fallback
      const search = new URLSearchParams(window.location.search);
      search.set('view', 'app');
      window.location.search = search.toString();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070b14',
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.6
      }}
    >
      {/* Navigation Bar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(7, 11, 20, 0.92)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          backdropFilter: 'blur(16px)',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo.jpg"
            alt="STEAM-Craft Logo"
            style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #38bdf8' }}
          />
          <div>
            <span style={{ fontSize: '17px', fontWeight: 900, letterSpacing: '-0.3px', color: '#fff' }}>
              STEAM-Craft <span style={{ color: '#38bdf8' }}>Team Innovation Hub</span>
            </span>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', letterSpacing: '0.2px' }}>
              Pusat Portofolio Riset Tim &amp; Gateway Multidisiplin
            </span>
          </div>
        </div>

        {/* Center / Right Links & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <a
            href="#projects"
            style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Projek Tim
          </a>
          <a
            href="#roadmap"
            style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Peta Jalan (Roadmap)
          </a>
          <a
            href="#team"
            style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Tentang Tim
          </a>

          <button
            onClick={() => handleOpenApp()}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Rocket size={15} />
            <span>Buka Aplikasi STEAM-Craft &nearr;</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        style={{
          position: 'relative',
          padding: '80px 24px 60px 24px',
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          overflow: 'hidden'
        }}
      >
        {/* Glow ambient circle */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(37, 99, 235, 0.05) 60%, transparent 100%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '12.5px',
              fontWeight: 700,
              letterSpacing: '0.4px',
              marginBottom: '20px'
            }}
          >
            <Sparkles size={14} />
            <span>PORTAL RESMI INOVASI &amp; EKOSISTEM RISET KOLABORATIF TIM</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 20px 0',
              letterSpacing: '-1px',
              background: 'linear-gradient(180deg, #ffffff 30%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Mewujudkan Inovasi Multidisiplin Berkelanjutan Berbasis STEAM
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#94a3b8',
              maxWidth: '820px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6
            }}
          >
            Portal terpadu konsorsium riset tim mahasiswa dan dosen pembimbing. Menghubungkan platform kerja ilmiah 
            <strong> STEAM-Craft</strong> dengan portofolio inisiatif riset perangkat keras IoT, bioteknologi terbarukan, 
            serta instrumen rekayasa komputasi masa depan.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={() => handleOpenApp()}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 28px rgba(37, 99, 235, 0.45)'
              }}
            >
              <Rocket size={18} />
              <span>Masuk ke Platform Aplikasi (app.steamcraft.online)</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#projects"
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#e2e8f0',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Compass size={18} color="#38bdf8" />
              <span>Eksplorasi Projek Tim &darr;</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              padding: '20px 24px',
              maxWidth: '960px',
              margin: '0 auto',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#38bdf8' }}>5+</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>Proyek Kolaborasi Berjalan</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#22c55e' }}>5 Pilar</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>Integrasi Lengkap S-T-E-A-M</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#fbbf24' }}>FAIR Ready</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>Standar Reproduktibilitas Ilmiah</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#c084fc' }}>1 Konsorsium</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>Kolaborasi Multidisiplin Kampus</div>
            </div>
          </div>
        </div>
      </header>

      {/* Section: Collaborative Projects Showcase */}
      <section id="projects" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            PORTFOLIO &amp; SHOWCASE INOVASI
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '6px 0 12px 0', color: '#fff' }}>
            Projek Tim Bersama &amp; Peta Sambungan Inovasi
          </h2>
          <p style={{ fontSize: '14.5px', color: '#94a3b8', maxWidth: '720px', margin: '0 auto' }}>
            Seluruh proyek riset tim terhubung secara simbiosis dengan platform manajemen kerja STEAM-Craft 
            sebagai poros tata kelola data dan kolaborasi.
          </p>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
            {[
              { id: 'all', label: 'Semua Inisiatif' },
              { id: 'software', label: '💻 Platform Perangkat Lunak' },
              { id: 'hardware', label: '📡 IoT & Hardware' },
              { id: 'bio', label: '🌱 Bioteknologi & Energi' },
              { id: 'pipeline', label: '⚡ Riset Lanjutan (Pipeline)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: selectedCategory === tab.id ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.25)',
                  background: selectedCategory === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedCategory === tab.id ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              style={{
                background: proj.isFlagship
                  ? 'linear-gradient(180deg, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: proj.isFlagship ? '2px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '20px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: proj.isFlagship ? '0 16px 40px rgba(56, 189, 248, 0.15)' : '0 8px 24px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              {proj.isFlagship && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  ★ PROYEK UTAMA (FLAGSHIP)
                </div>
              )}

              <div>
                {/* Category & Status Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: `${proj.badgeColor}22`,
                      color: proj.badgeColor,
                      border: `1px solid ${proj.badgeColor}55`
                    }}
                  >
                    {proj.categoryBadge}
                  </span>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: proj.status === 'live' ? '#22c55e' : proj.status === 'lab' ? '#fbbf24' : '#c084fc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: proj.status === 'live' ? '#22c55e' : proj.status === 'lab' ? '#fbbf24' : '#c084fc',
                        display: 'inline-block'
                      }}
                    />
                    {proj.statusText}
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 12px 0', lineHeight: 1.3 }}>
                  {proj.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                  {proj.description}
                </p>

                {/* Metrics Highlight */}
                {proj.metrics && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.15)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                      gap: '12px',
                      marginBottom: '20px'
                    }}
                  >
                    {proj.metrics.map((m, idx) => (
                      <div key={idx}>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>{m.label}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                  {proj.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#cbd5e1'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => handleOpenApp(proj.targetUrl)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    background: proj.isFlagship
                      ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                      : 'rgba(56, 189, 248, 0.12)',
                    border: proj.isFlagship ? 'none' : '1px solid rgba(56, 189, 248, 0.3)',
                    color: proj.isFlagship ? '#fff' : '#38bdf8',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: proj.isFlagship ? '0 4px 16px rgba(37, 99, 235, 0.3)' : 'none'
                  }}
                >
                  <span>{proj.isFlagship ? 'Buka Platform STEAM-Craft (app.steamcraft.online)' : 'Lihat Data & Logbook di STEAM-Craft'}</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Innovation Roadmap & Connectivity */}
      <section
        id="roadmap"
        style={{
          padding: '60px 24px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              PETA JALAN INTEGRASI MASA DEPAN
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 900, margin: '6px 0 10px 0', color: '#fff' }}>
              Bagaimana Seluruh Projek Tim Saling Terhubung?
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '680px', margin: '0 auto' }}>
              Arsitektur terdistribusi yang menyatukan platform aplikasi perangkat lunak dengan implementasi fisik di laboratorium.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                <Layers size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
                1. Fondasi Platform Digital (STEAM-Craft)
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                Berfungsi sebagai inkubator, repositori protokol eksperimen, buku log ilmiah terenkripsi, dan verifikasi kelayakan rubrik sebelum proyek diimplementasikan.
              </p>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                <Cpu size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
                2. Realisasi Hardware &amp; Lab Organik
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                Data lapangan dari pelampung IoT laut dan baterai jamur diunggah langsung ke platform STEAM-Craft via sensor telemetry endpoint untuk analisis komparatif.
              </p>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', display: 'grid', placeItems: 'center', marginBottom: '14px' }}>
                <Activity size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
                3. Integrasi Pipeline Lanjutan
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                Proyek tim berikutnya (mesin AI reproduktibilitas dan drone presisi) langsung mewarisi protokol autentikasi civitas dan basis data riset yang telah terbentuk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: About Team & Multidisciplinary Pillars */}
      <section id="team" style={{ padding: '60px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            KONSORSIUM RISET MULTIDISIPLIN
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 900, margin: '6px 0 12px 0', color: '#fff' }}>
            5 Pilar Pendekatan STEAM
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '680px', margin: '0 auto' }}>
            Menyatukan perspektif dari berbagai disiplin ilmu untuk menciptakan solusi rekayasa yang teruji secara ilmiah dan berdampak luas.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { letter: 'S', title: 'Science', desc: 'Metodologi saintifik, kontrol variabel & validasi lab biokimia.' },
            { letter: 'T', title: 'Technology', desc: 'Komputasi awan, modulasi LoRaWAN & arsitektur web modern.' },
            { letter: 'E', title: 'Engineering', desc: 'Rancang bangun prototipe instrumentasi fisik & efisiensi daya.' },
            { letter: 'A', title: 'Art & Design', desc: 'Ergonomi antarmuka, infografis data & estetika purwarupa.' },
            { letter: 'M', title: 'Mathematics', desc: 'Analitik stokastik, kalibrasi regresi sensor & model risiko.' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: 900,
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 12px auto'
                }}
              >
                {item.letter}
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>{item.title}</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.15)',
          padding: '40px 24px 30px 24px',
          background: '#04070d',
          fontSize: '12.5px',
          color: '#94a3b8'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
              <span>STEAM-Craft Collaborative Hub</span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              &copy; 2026 Tim Riset Inovasi STEAM-Craft. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#38bdf8" /> Kontak: <a href="mailto:cs@steamcraft.online" style={{ color: '#38bdf8', textDecoration: 'none' }}>cs@steamcraft.online</a>
            </span>
            <span>•</span>
            <button
              onClick={() => handleOpenApp()}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 700, cursor: 'pointer', fontSize: '12.5px', padding: 0 }}
            >
              Aplikasi (app.steamcraft.online) &rarr;
            </button>
            <span>•</span>
            <a
              href="https://adm.steamcraft.online"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#64748b', textDecoration: 'none' }}
            >
              DevOps Command (adm)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
