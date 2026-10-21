import React, { useState } from 'react';
import { SteamTeamCardSection, SparkleIcon } from './SteamIdCard';
import { SteamBrandGuidelineSection } from './SteamBrandGuideline';
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
  ChevronRight,
  Award,
  IdCard,
  QrCode,
  GraduationCap,
  Settings,
  Palette,
  Binary
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  steamId: string;
  joinDate: string;
  quote: string;
  focus: string[];
  avatarInitial: string;
  gradient: string;
}

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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeMemberTab, setActiveMemberTab] = useState<string>('all');

  // Official 3 Team Members
  const teamMembers: TeamMember[] = [
    {
      id: 'naza',
      name: 'Muhammad Naza Firmansyah',
      role: 'Project Lead & Lead System Architect',
      division: 'Software Development & Architecture',
      steamId: 'STEAM-001',
      joinDate: '21 Oct 2026',
      quote: 'Together We Build the Future',
      focus: ['Cloud Architecture', 'Full-Stack React/Node Engine', 'FAIR Data Pipeline', 'Security & DevOps'],
      avatarInitial: 'NF',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
    },
    {
      id: 'bima',
      name: 'Bima Sena',
      role: 'Co-Lead Engineer & Hardware Specialist',
      division: 'Engineering & IoT Telemetry',
      steamId: 'STEAM-002',
      joinDate: '21 Oct 2026',
      quote: 'Build Skills, Create Solutions, Make an Impact',
      focus: ['ESP32 Microcontroller', 'LoRaWAN Modulations', 'Sensor Array & MPPT Solar', 'Hardware Telemetry'],
      avatarInitial: 'BS',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
    },
    {
      id: 'sandi',
      name: 'Sandi Ardi Prayitno',
      role: 'Research Analyst & Creative Specialist',
      division: 'Research, Design & Data Analytics',
      steamId: 'STEAM-003',
      joinDate: '21 Oct 2026',
      quote: 'Learn, Create, and Deliver Real Impact',
      focus: ['Scientific Methodology', 'UI/UX Visual Identity', 'Data Stochastic Modeling', 'Bio-materials Science'],
      avatarInitial: 'SP',
      gradient: 'linear-gradient(135deg, #10b981 0%, #0891b2 100%)'
    }
  ];

  // Official Projects Portfolio
  const projects: ProjectCard[] = [
    {
      id: 'steamcraft-platform',
      title: 'STEAM-Craft — Platform Riset & Kolaborasi Multidisiplin',
      category: 'software',
      categoryBadge: 'Platform Perangkat Lunak Terpadu (Flagship)',
      badgeColor: '#3b82f6',
      isFlagship: true,
      description:
        'Platform resmi inkubasi dan manajemen riset berbasis metodologi STEAM untuk civitas akademika. Dilengkapi repositori data berstandar FAIR, logbook digital, pelacak checkpoint proyek, modul open recruitment kolaborator lintas prodi, serta sistem audit rubrik penilaian ilmiah terverifikasi.',
      status: 'live',
      statusText: 'Production Live (Aktif)',
      tags: ['React 19', 'TypeScript', 'FAIR Data Standard', 'Rubrik Ilmiah', 'Vite', 'Cloud Sync'],
      metrics: [
        { label: 'Domain Akses', value: 'app.steamcraft.online' },
        { label: 'Dimensi Evaluasi', value: '4 Pilar Rubrik' },
        { label: 'Hosting Node', value: 'AnymHost Cloud (163.223.227.38)' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'iot-coral-reef',
      title: 'IoT Marine Buoy — Telemetri Otonom Pemantau Terumbu Karang',
      category: 'hardware',
      categoryBadge: 'Hardware IoT & Konservasi Bahari',
      badgeColor: '#10b981',
      description:
        'Pelampung telemetri cerdas otonom bertenaga surya mikro berbasis ESP32 dan LoRaWAN. Memantau parameter oseanografi (suhu air, pH, salinitas, dan kekeruhan) untuk mitigasi pemutihan karang di pesisir tropis tanpa tergantung jaringan seluler.',
      status: 'lab',
      statusText: 'Inkubasi Prototipe Hardware Lab',
      tags: ['ESP32', 'LoRaWAN 915MHz', 'BME280', 'Turbidity Sensor', 'Micro-Solar MPPT'],
      metrics: [
        { label: 'Jarak Transmisi', value: 'Hingga 8.5 km' },
        { label: 'Interval Sampling', value: '15 Menit' },
        { label: 'Daya Mandiri', value: 'Solar Cell 100%' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'bio-mycobattery',
      title: 'EcoBiosynthesis Mycobattery — Baterai Organik Biodegradabel',
      category: 'bio',
      categoryBadge: 'Bioteknologi Material Hijau & Energi Bersih',
      badgeColor: '#8b5cf6',
      description:
        'Inovasi sel baterai ramah lingkungan yang mengintegrasikan miselium jamur tiram (Pleurotus ostreatus) dan elektrolit padat biopolimer kitosan alami. Mengurangi limbah kimia beracun dan dapat terurai secara biologis dalam tanah.',
      status: 'lab',
      statusText: 'Uji Validasi Siklus Elektrokimia',
      tags: ['Miselium Jamur', 'Kitosan Alami', 'Cyclic Voltammetry', 'Non-Toxic Battery'],
      metrics: [
        { label: 'Tegangan Sel', value: '1.24 V / Sel' },
        { label: 'Biodegradabilitas', value: '100% Organik' },
        { label: 'Siklus Lab', value: '> 350 Siklus' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'ai-reproducibility-verifier',
      title: 'AI Scientific Reproducibility & Data Integrity Engine',
      category: 'pipeline',
      categoryBadge: 'Kecerdasan Buatan & Pipa Riset Masa Depan',
      badgeColor: '#6366f1',
      description:
        'Mesin audit data eksperimen dan replikasi kode otomatis berbasis AI untuk mendeteksi anomali kurva kalibrasi sensor, pengujian replikabilitas algoritma, dan simulasi ketahanan stokastik Monte Carlo.',
      status: 'pipeline',
      statusText: 'Pipa Sambungan Riset Lanjutan',
      tags: ['Python AI Engine', 'Monte Carlo Simulation', 'Reproducibility', 'Jupyter Pipeline'],
      metrics: [
        { label: 'Tahap Inkubasi', value: 'Perancangan Algoritma' },
        { label: 'Integrasi', value: 'STEAM-Craft API' },
        { label: 'Target Rilis', value: 'Q4 2026' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    },
    {
      id: 'precision-agrodrone',
      title: 'Precision Agro-Drone — Pemantau Mikroklimat Pertanian Terasering',
      category: 'pipeline',
      categoryBadge: 'Robotika & Pertanian Presisi Tropis',
      badgeColor: '#0891b2',
      description:
        'Wahana drone quadcopter otonom ringan yang dilengkapi kamera multispektral untuk memetakan indeks vegetasi tanaman (NDVI) dan kelembapan tanah di lereng kontur terasering.',
      status: 'pipeline',
      statusText: 'Pipa Sambungan Riset Lanjutan',
      tags: ['PX4 Autopilot', 'Multispectral Camera', 'NDVI Indexing', 'Agro-Robotics'],
      metrics: [
        { label: 'Radius Terbang', value: '3.2 km' },
        { label: 'Fase', value: 'Studi Kelayakan Avionik' },
        { label: 'Laboratorium', value: 'Lab Robotika Terpadu' }
      ],
      targetUrl: 'https://app.steamcraft.online'
    }
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleOpenApp = (url?: string) => {
    if (onLaunchApp) {
      onLaunchApp();
      return;
    }
    if (typeof window !== 'undefined' && window.location.hostname.includes('steamcraft.online')) {
      window.location.href = url || 'https://app.steamcraft.online';
    } else {
      const search = new URLSearchParams(window.location.search);
      search.set('view', 'app');
      window.location.search = search.toString();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 80% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 15% 25%, rgba(139, 92, 246, 0.06) 0%, transparent 45%), radial-gradient(ellipse at 85% 65%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 20% 85%, rgba(59, 130, 246, 0.06) 0%, transparent 50%), #f8fafc',
        color: '#0f172a',
        fontFamily: "'Montserrat', sans-serif",
        lineHeight: 1.6,
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Ambient Decorative Background Waves & Sparkles */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        {/* Soft Wave Ribbon Top Right */}
        <svg
          style={{ position: 'absolute', top: '-60px', right: '-120px', width: '620px', height: '620px', opacity: 0.45 }}
          viewBox="0 0 600 600"
          fill="none"
        >
          <path d="M100 0 C250 150 350 220 450 350 C550 480 580 540 600 600 L600 0 Z" fill="url(#bg-wave-1)" />
          <defs>
            <linearGradient id="bg-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Soft Wave Ribbon Mid Left */}
        <svg
          style={{ position: 'absolute', top: '35%', left: '-150px', width: '500px', height: '600px', opacity: 0.35 }}
          viewBox="0 0 500 600"
          fill="none"
        >
          <path d="M0 0 C180 80 280 200 320 340 C360 480 300 550 0 600 Z" fill="url(#bg-wave-2)" />
          <defs>
            <linearGradient id="bg-wave-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Sparkle Stars Scattered Authentically */}
        <div style={{ position: 'absolute', top: '12%', left: '3%', opacity: 0.55 }}>
          <SparkleIcon size={26} color="#3b82f6" />
        </div>
        <div style={{ position: 'absolute', top: '22%', right: '5%', opacity: 0.65 }}>
          <SparkleIcon size={34} color="#8b5cf6" />
        </div>
        <div style={{ position: 'absolute', top: '48%', right: '3%', opacity: 0.5 }}>
          <SparkleIcon size={28} color="#06b6d4" />
        </div>
        <div style={{ position: 'absolute', top: '65%', left: '3%', opacity: 0.45 }}>
          <SparkleIcon size={36} color="#c4b5fd" />
        </div>
        <div style={{ position: 'absolute', top: '82%', right: '4%', opacity: 0.55 }}>
          <SparkleIcon size={30} color="#93c5fd" />
        </div>
      </div>
      {/* Top Banner Tagline */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
          color: '#fff',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 600,
          textAlign: 'center',
          letterSpacing: '1px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span>LEARN</span>
        <span>•</span>
        <span>CREATE</span>
        <span>•</span>
        <span>IMPACT</span>
        <span style={{ opacity: 0.8, fontSize: '11px', display: 'none' }} className="hide-mobile">
          | Together We Build the Future
        </span>
      </div>

      {/* Navigation Bar */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
          backdropFilter: 'blur(16px)',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.05)'
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/team-logo.jpg"
            alt="STEAM Logo"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              objectFit: 'contain',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#1e3a8a',
                  letterSpacing: '0.5px'
                }}
              >
                STEAM
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#2563eb',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}
              >
                OFFICIAL HUB
              </span>
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
              Pusat Inovasi Tim Riset Multidisiplin
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <a
            href="#projects"
            style={{ color: '#475569', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Projek Tim
          </a>
          <a
            href="#team"
            style={{ color: '#475569', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Anggota Tim
          </a>
          <a
            href="#philosophy"
            style={{ color: '#475569', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Filosofi STEAM
          </a>
          <a
            href="#roadmap"
            style={{ color: '#475569', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '6px 12px' }}
          >
            Peta Sambungan Riset
          </a>

          {/* Launch Application Button */}
          <button
            onClick={() => handleOpenApp()}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
              transition: 'transform 0.15s ease'
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
          background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
          borderBottom: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Soft Background Wave Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 60%, transparent 100%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Logo Showcase Hero Badge */}
          <div style={{ marginBottom: '24px' }}>
            <img
              src="/team-logo.jpg"
              alt="Logo STEAM Resmi"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
                borderRadius: '24px',
                padding: '8px',
                background: '#ffffff',
                boxShadow: '0 12px 36px rgba(30, 58, 138, 0.12)',
                border: '1px solid #e2e8f0',
                margin: '0 auto'
              }}
            />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: '#1e3a8a',
              fontSize: '12.5px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              marginBottom: '16px'
            }}
          >
            <Sparkles size={14} color="#3b82f6" />
            <span>PANDUAN IDENTITAS VISUAL &amp; PORTAL RESMI RISET TIM</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900,
              lineHeight: 1.18,
              margin: '0 0 16px 0',
              color: '#1e3a8a',
              letterSpacing: '-0.8px'
            }}
          >
            Build Skills, Create Solutions, Make an Impact.
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#475569',
              maxWidth: '820px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >
            STEAM adalah ruang tumbuh bagi ide, kreativitas, dan kolaborasi tim kami untuk menciptakan dampak nyata melalui 
            <strong> sains, teknologi, rekayasa, seni, dan matematika</strong>. Menghubungkan platform digital utama dengan 
            seluruh inisiatif riset kolaboratif masa depan.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '44px' }}>
            <button
              onClick={() => handleOpenApp()}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(30, 58, 138, 0.25)'
              }}
            >
              <Rocket size={18} />
              <span>Masuk ke Platform STEAM-Craft (app.steamcraft.online)</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#team"
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                color: '#1e3a8a',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
            >
              <Users size={18} color="#3b82f6" />
              <span>Profil Anggota Tim &darr;</span>
            </a>
          </div>

          {/* 3 Core Philosophical Pillars from Brand Guidelines */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              maxWidth: '960px',
              margin: '0 auto',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={18} color="#8b5cf6" />
                <strong style={{ fontSize: '15px', color: '#1e3a8a' }}>Kolaborasi</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Tiga figur saling terhubung, melambangkan keberagaman disiplin ilmu yang berjalan bersama menuju tujuan yang sama.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                borderLeft: '4px solid #3b82f6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#3b82f6" />
                <strong style={{ fontSize: '15px', color: '#1e3a8a' }}>Inovasi</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Bintang di tengah sebagai simbol ide-ide baru yang lahir dari perpaduan sains murni, rekayasa teknologi, dan estetika.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                borderLeft: '4px solid #10b981'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Globe size={18} color="#10b981" />
                <strong style={{ fontSize: '15px', color: '#1e3a8a' }}>Dampak Nyata</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Orbit yang mengelilingi melambangkan penyebaran manfaat riset ke lingkungan civitas akademika dan masyarakat.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Section: Official Team Members (Official ID Cards Section) */}
      <SteamTeamCardSection />

      {/* Section: Collaborative Projects Showcase */}
      <section id="projects" style={{ padding: '70px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              PORTOFOLIO RISET TIM BERSAMA
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1e3a8a', margin: '6px 0 12px 0' }}>
              Projek Tim &amp; Gateway Sambungan Inovasi
            </h2>
            <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '720px', margin: '0 auto' }}>
              Halaman ini berfungsi sebagai portal penghubung utama ke platform aplikasi STEAM-Craft dan beberapa inisiatif proyek tim selanjutnya.
            </p>

            {/* Category Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
              {[
                { id: 'all', label: 'Semua Projek' },
                { id: 'software', label: '💻 Platform Perangkat Lunak' },
                { id: 'hardware', label: '📡 IoT & Hardware Laut' },
                { id: 'bio', label: '🌱 Bioteknologi & Baterai' },
                { id: 'pipeline', label: '⚡ Riset Lanjutan (Pipeline)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: activeCategory === tab.id ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                    background: activeCategory === tab.id ? '#eff6ff' : '#ffffff',
                    color: activeCategory === tab.id ? '#1e40af' : '#64748b'
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
                    ? 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)'
                    : '#ffffff',
                  border: proj.isFlagship ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: proj.isFlagship ? '0 12px 36px rgba(59, 130, 246, 0.12)' : '0 4px 16px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                {proj.isFlagship && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '24px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    ★ PROYEK UTAMA TIM
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: `${proj.badgeColor}15`,
                        color: proj.badgeColor,
                        border: `1px solid ${proj.badgeColor}44`
                      }}
                    >
                      {proj.categoryBadge}
                    </span>

                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: proj.status === 'live' ? '#16a34a' : proj.status === 'lab' ? '#d97706' : '#7c3aed',
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
                          background: proj.status === 'live' ? '#16a34a' : proj.status === 'lab' ? '#d97706' : '#7c3aed',
                          display: 'inline-block'
                        }}
                      />
                      {proj.statusText}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                    {proj.description}
                  </p>

                  {/* Metrics Box */}
                  {proj.metrics && (
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                        gap: '10px',
                        marginBottom: '18px'
                      }}
                    >
                      {proj.metrics.map((m, mIdx) => (
                        <div key={mIdx}>
                          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>{m.label}</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a' }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '22px' }}>
                    {proj.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#475569',
                          fontWeight: 500
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Launch Action */}
                <button
                  onClick={() => handleOpenApp(proj.targetUrl)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: proj.isFlagship
                      ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                      : 'rgba(59, 130, 246, 0.08)',
                    border: proj.isFlagship ? 'none' : '1px solid #bfdbfe',
                    color: proj.isFlagship ? '#fff' : '#1e40af',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: proj.isFlagship ? '0 4px 14px rgba(30, 58, 138, 0.2)' : 'none'
                  }}
                >
                  <span>{proj.isFlagship ? 'Buka Aplikasi STEAM-Craft (app.steamcraft.online)' : 'Akses di Platform STEAM-Craft'}</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: STEAM Brand Guideline & Philosophy (Official Guidelines Panel 01-08) */}
      <div id="philosophy">
        <SteamBrandGuidelineSection />
      </div>

      {/* Section: Future Pipeline Roadmap */}
      <section id="roadmap" style={{ padding: '60px 24px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              PETA SAMBUNGAN RISET TIM
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1e3a8a', margin: '6px 0 10px 0' }}>
              Bagaimana Seluruh Proyek Saling Terhubung?
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
              Domain utama ini mengikat seluruh inkubasi tim menjadi satu ekosistem riset yang berkelanjutan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <Layers size={18} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 6px 0' }}>
                1. Portal Kerja STEAM-Craft
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Sebagai repositori pusat, buku log ilmiah terverifikasi, dan manajemen pengajuan bimbingan dosen pakar.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <Cpu size={18} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 6px 0' }}>
                2. Implementasi Lab Fisik &amp; IoT
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Data telemetri sensor pelampung laut dan siklus baterai jamur langsung diintegrasikan ke basis data riset kampus.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed', display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
                <Activity size={18} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 6px 0' }}>
                3. Pipa Inovasi Lanjutan
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Inkubasi mesin AI verifikasi reproduktibilitas kode dan drone pertanian presisi siap ditambahkan secara modular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: '#0f172a',
          color: '#94a3b8',
          padding: '40px 24px 30px 24px',
          fontSize: '12.5px',
          borderTop: '1px solid #1e293b'
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <img
                src="/team-logo.jpg"
                alt="STEAM Logo"
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff', padding: '2px' }}
              />
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>
                TIM INOVASI STEAM
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              &copy; 2026 Tim Peneliti: Muhammad Naza Firmansyah • Bima Sena • Sandi Ardi Prayitno.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
              <Mail size={14} color="#38bdf8" /> Kontak: <a href="mailto:cs@steamcraft.online" style={{ color: '#38bdf8', textDecoration: 'none' }}>cs@steamcraft.online</a>
            </span>
            <span>•</span>
            <button
              onClick={() => handleOpenApp()}
              style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 700, cursor: 'pointer', fontSize: '12.5px', padding: 0 }}
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
