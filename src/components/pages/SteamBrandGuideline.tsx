import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Maximize2,
  Download,
  Laptop,
  Share2,
  Shirt,
  Presentation,
  FileText,
  Megaphone,
  Palette,
  Type,
  Eye,
  X,
  Users,
  Globe,
  AlertTriangle
} from 'lucide-react';
import { SteamLogoVector, SparkleIcon } from './SteamIdCard';

interface ColorItem {
  name: string;
  idName: string;
  hex: string;
  meaning: string;
  textColor: string;
}

export const SteamBrandGuidelineSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showSheetModal, setShowSheetModal] = useState<boolean>(false);
  const [selectedLogoVariant, setSelectedLogoVariant] = useState<'main' | 'mono' | 'reverse' | 'icon'>('main');

  // Primary Palet Warna
  const primaryColors: ColorItem[] = [
    {
      name: 'Deep Blue',
      idName: 'Biru Tua',
      hex: '#1E3A8A',
      meaning: 'Profesionalisme, kepercayaan, dan keteguhan riset ilmiah.',
      textColor: '#ffffff'
    },
    {
      name: 'Blue',
      idName: 'Biru',
      hex: '#3B82F6',
      meaning: 'Inovasi, teknologi modern, dan orientasi masa depan.',
      textColor: '#ffffff'
    },
    {
      name: 'Purple',
      idName: 'Ungu',
      hex: '#8B5CF6',
      meaning: 'Kreativitas, imajinasi, dan pertumbuhan multidisiplin.',
      textColor: '#ffffff'
    },
    {
      name: 'Teal',
      idName: 'Hijau Tosca',
      hex: '#10B981',
      meaning: 'Keseimbangan, kolaborasi tim, dan keberlanjutan.',
      textColor: '#ffffff'
    },
    {
      name: 'Light Blue',
      idName: 'Biru Muda',
      hex: '#93C5FD',
      meaning: 'Keterbukaan ide, optimisme, dan kesegaran visi baru.',
      textColor: '#1e3a8a'
    }
  ];

  // Supporting Colors
  const supportingColors = [
    { name: 'Indigo', hex: '#6366F1', textColor: '#ffffff' },
    { name: 'Lavender', hex: '#C4B5FD', textColor: '#1e3a8a' },
    { name: 'Mint', hex: '#A7F3D0', textColor: '#064e3b' },
    { name: 'Grey', hex: '#E5E7EB', textColor: '#1f2937' },
    { name: 'White', hex: '#F8FAFC', textColor: '#0f172a' }
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section id="guidelines" style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
      {/* Ambient Floating Sparkles in Background */}
      <div style={{ position: 'absolute', top: '20px', left: '10px', opacity: 0.7, pointerEvents: 'none' }}>
        <SparkleIcon size={28} color="#93c5fd" />
      </div>
      <div style={{ position: 'absolute', top: '140px', right: '30px', opacity: 0.6, pointerEvents: 'none' }}>
        <SparkleIcon size={34} color="#c4b5fd" />
      </div>
      <div style={{ position: 'absolute', bottom: '80px', left: '40px', opacity: 0.5, pointerEvents: 'none' }}>
        <SparkleIcon size={24} color="#a7f3d0" />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 16px',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#1e3a8a',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: '12px'
          }}
        >
          <Sparkles size={14} color="#3b82f6" />
          <span>STANDAR IDENTITAS VISUAL RESMI (BRAND GUIDELINE)</span>
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
          Panduan Lengkap Identitas Visual STEAM
        </h2>

        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '720px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Rancangan sistem visual terpadu mulai dari filosofi, palet warna, tipografi, hingga variasi logo resmi yang
          menjaga konsistensi identitas inovasi riset kita.
        </p>

        {/* View Switcher / Quick Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button
            onClick={() => setShowSheetModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1.5px solid #2563eb',
              color: '#2563eb',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.1)'
            }}
          >
            <Maximize2 size={15} />
            <span>Buka Lembar Panduan Grafis Asli (Brand Guideline Sheet)</span>
          </button>
        </div>
      </div>

      {/* Grid of the Official 8 Guideline Cards (Matching the uploaded image) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '26px' }}>

        {/* PANEL COVER: Panduan Identitas Visual (Cover Card in Dark Blue) */}
        <div
          style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, #0b2e88 0%, #1e40af 40%, #3b82f6 80%, #7c3aed 100%)',
            borderRadius: '26px',
            padding: '44px 36px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(11, 46, 136, 0.22)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '260px'
          }}
        >
          {/* Top-Right Decorative Waves */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '450px',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
            viewBox="0 0 450 300"
            fill="none"
          >
            <path
              d="M150 0 C220 80 280 120 340 180 C400 240 430 280 450 300 L450 0 Z"
              fill="rgba(255, 255, 255, 0.08)"
            />
            <path
              d="M260 0 C310 60 360 110 400 170 C430 220 445 260 450 300 L450 0 Z"
              fill="rgba(56, 189, 248, 0.15)"
            />
          </svg>

          {/* Top Row: Brand Guideline Label */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: 'rgba(255, 255, 255, 0.85)',
                textTransform: 'uppercase'
              }}
            >
              Brand Guideline
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                STANDAR RESMI NASIONAL
              </span>
              <SparkleIcon size={16} color="#38bdf8" />
            </div>
          </div>

          {/* Center Body: Logo + Big Headline */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              margin: '28px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              flexWrap: 'wrap'
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: '20px',
                padding: '16px 24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <SteamLogoVector variant="white" size={72} />
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '3px', marginTop: '4px' }}>
                STEAM
              </span>
            </div>

            <div style={{ maxWidth: '640px' }}>
              <h3
                style={{
                  fontSize: 'clamp(24px, 3.5vw, 36px)',
                  fontWeight: 900,
                  margin: '0 0 10px 0',
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px'
                }}
              >
                Panduan Identitas Visual
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.92)',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                STEAM adalah ruang tumbuh bagi ide, kreativitas, dan kolaborasi untuk menciptakan dampak nyata melalui{' '}
                <strong>sains, teknologi, teknik, seni, dan matematika</strong>.
              </p>
            </div>
          </div>

          {/* Footer of Cover Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              color: 'rgba(255, 255, 255, 0.9)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '16px'
            }}
          >
            <span>LEARN</span>
            <SparkleIcon size={10} color="#38bdf8" />
            <span>CREATE</span>
            <SparkleIcon size={10} color="#38bdf8" />
            <span>IMPACT</span>
          </div>
        </div>

        {/* PANEL 01: Palet Warna */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>01</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Palet Warna</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Warna utama dan pendukung yang merepresentasikan nilai, semangat, dan karakter STEAM.
            </p>

            {/* Warna Utama Swatches */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
                WARNA UTAMA (KLIK UNTUK SALIN HEX)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                {primaryColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handleCopy(color.hex)}
                    title={`Klik untuk salin ${color.hex}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: color.hex,
                        boxShadow: `0 4px 12px ${color.hex}44`,
                        display: 'grid',
                        placeItems: 'center',
                        color: color.textColor,
                        border: '2px solid #ffffff'
                      }}
                    >
                      {copiedHex === color.hex ? <Check size={16} /> : null}
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#1e293b' }}>{color.name}</span>
                    <code style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 700 }}>{color.hex}</code>
                  </button>
                ))}
              </div>
            </div>

            {/* Warna Pendukung */}
            <div style={{ marginBottom: '22px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>
                WARNA PENDUKUNG
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {supportingColors.map((sc) => (
                  <div
                    key={sc.hex}
                    onClick={() => handleCopy(sc.hex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: sc.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                    <span style={{ fontWeight: 700, color: '#334155' }}>{sc.name}</span>
                    <code style={{ color: '#64748b', fontSize: '10px' }}>{sc.hex}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Makna Warna Accordion / Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px',
              fontSize: '11.5px',
              color: '#475569'
            }}
          >
            <strong style={{ display: 'block', color: '#1e3a8a', marginBottom: '6px', fontSize: '12px' }}>
              Makna Filosofis Warna:
            </strong>
            <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.6 }}>
              <li><strong>Biru Tua:</strong> Profesionalisme, kepercayaan, keteguhan.</li>
              <li><strong>Biru:</strong> Inovasi, teknologi, masa depan.</li>
              <li><strong>Ungu:</strong> Kreativitas, imajinasi, pertumbuhan.</li>
              <li><strong>Hijau Tosca:</strong> Keseimbangan, kolaborasi, keberlanjutan.</li>
              <li><strong>Biru Muda:</strong> Keterbukaan, optimisme, kesegaran.</li>
            </ul>
          </div>
        </div>

        {/* PANEL 02: Arti Nama */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Faint Sparkle in Card Corner */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.25, pointerEvents: 'none' }}>
            <SparkleIcon size={70} color="#93c5fd" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>02</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Arti Nama</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px 0' }}>
              STEAM merupakan akronim resmi dari integrasi 5 pilar keilmuan:
            </p>

            {/* S - T - E - A - M Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { letter: 'S', title: 'Science', desc: 'Ilmu pengetahuan, rasa ingin tahu, dan pencarian kebenaran.', color: '#1e3a8a' },
                { letter: 'T', title: 'Technology', desc: 'Teknologi, inovasi, dan solusi mutakhir untuk masa depan.', color: '#3b82f6' },
                { letter: 'E', title: 'Engineering', desc: 'Rekayasa, proses terstruktur, dan implementasi ide fisik.', color: '#8b5cf6' },
                { letter: 'A', title: 'Arts', desc: 'Seni, kreativitas, ekspresi, estetika, dan nilai kemanusiaan.', color: '#10b981' },
                { letter: 'M', title: 'Mathematics', desc: 'Logika, analisis kuantitatif, dan dasar dari semua ilmu.', color: '#0ea5e9' }
              ].map((item) => (
                <div
                  key={item.letter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: item.color,
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 900,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    {item.letter}
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#1e3a8a', display: 'block' }}>{item.title}</strong>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Banner */}
          <div
            style={{
              marginTop: '20px',
              background: 'linear-gradient(90deg, #eff6ff 0%, #f5f3ff 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '14px 16px',
              fontSize: '12px',
              color: '#1e40af',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <SparkleIcon size={14} color="#3b82f6" />
            <span>&quot;STEAM adalah tentang bagaimana ilmu, teknologi, rekayasa, seni, dan matematika bersatu untuk menciptakan dampak positif bagi masa depan.&quot;</span>
          </div>
        </div>

        {/* PANEL 03: Arti Logo */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>03</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Arti Logo</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
              Setiap elemen geometris dalam logo STEAM memiliki makna yang mendalam.
            </p>

            {/* Elements List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Tiga Figur Manusia', desc: 'Melambangkan kolaborasi, keberagaman, dan perjalanan bersama.', iconColor: '#8b5cf6' },
                { title: 'Bintang di Tengah', desc: 'Melambangkan tujuan, potensi, dan masa depan yang lebih baik.', iconColor: '#3b82f6' },
                { title: 'Orbit / Lingkaran', desc: 'Melambangkan koneksi, kesinambungan, dan ekosistem pembelajaran.', iconColor: '#0ea5e9' },
                { title: 'Bentuk Dinamis', desc: 'Melambangkan pertumbuhan, inovasi, dan semangat untuk terus maju.', iconColor: '#10b981' },
                { title: 'Tipografi Modern', desc: 'Mencerminkan profesionalisme, progresif, dan mudah diingat.', iconColor: '#1e3a8a' }
              ].map((elem, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: `${elem.iconColor}15`,
                      color: elem.iconColor,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    <SparkleIcon size={12} color={elem.iconColor} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#1e3a8a', display: 'block' }}>{elem.title}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>{elem.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Logo Mark Display */}
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}
          >
            <SteamLogoVector variant="color" size={54} />
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '2px' }}>
              STEAM
            </span>
          </div>
        </div>

        {/* PANEL 04: Filosofi Logo */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>04</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Filosofi Logo</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
              Logo STEAM dirancang untuk menggambarkan semangat kolaborasi, inovasi, dan dampak nyata.
            </p>

            {/* 3 Core Philosophical Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Kolaborasi */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#8b5cf6',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    fontWeight: 800,
                    fontSize: '11px'
                  }}
                ><Users size={18} /></div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#1e3a8a', display: 'block' }}>Kolaborasi</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
                    Tiga figur saling terhubung, berjalan bersama menuju tujuan yang sama.
                  </span>
                </div>
              </div>

              {/* Inovasi */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    fontWeight: 800,
                    fontSize: '11px'
                  }}
                ><Sparkles size={18} /></div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#1e3a8a', display: 'block' }}>Inovasi</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
                    Bintang sebagai simbol ide-ide baru yang lahir dari perpaduan ilmu dan kreativitas.
                  </span>
                </div>
              </div>

              {/* Dampak */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    fontWeight: 800,
                    fontSize: '11px'
                  }}
                ><Globe size={18} /></div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#1e3a8a', display: 'block' }}>Dampak</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45 }}>
                    Orbit yang mengelilingi, melambangkan penyebaran manfaat ke lingkungan sekitar dan masa depan.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Motto Box */}
          <div
            style={{
              marginTop: '20px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 16px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#334155',
              fontStyle: 'italic'
            }}
          >
            &quot;Bersama, kita membangun masa depan melalui ilmu, teknologi, rekayasa, seni, dan matematika.&quot;
          </div>
        </div>

        {/* PANEL 05: Tipografi */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>05</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Tipografi</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Font primer yang digunakan pada identitas visual STEAM:
            </p>

            {/* Typography Showcase */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '16px'
              }}
            >
              <div style={{ fontSize: '54px', fontWeight: 900, color: '#1e3a8a', lineHeight: 1, marginBottom: '6px' }}>
                Aa
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a8a', margin: '0 0 4px 0' }}>Montserrat</h4>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                (Bold / SemiBold / Medium)
              </span>

              <div style={{ marginTop: '12px', fontSize: '10.5px', color: '#94a3b8', letterSpacing: '1px', wordBreak: 'break-all' }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz
                <br />
                0123456789
              </div>
            </div>

            {/* Character Traits */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '11.5px', fontWeight: 700, color: '#2563eb', marginBottom: '16px' }}>
              <span>Modern</span>
              <span>•</span>
              <span>Clean</span>
              <span>•</span>
              <span>Readable</span>
            </div>
          </div>

          {/* Penggunaan Tipografi Rules */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 16px',
              fontSize: '11.5px',
              color: '#334155'
            }}
          >
            <strong style={{ display: 'block', color: '#1e3a8a', marginBottom: '6px' }}>Penggunaan Tipografi:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={12} color="#16a34a" />
                <span><strong>Judul / Logo:</strong> Montserrat Bold</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={12} color="#16a34a" />
                <span><strong>Subjudul:</strong> Montserrat SemiBold</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={12} color="#16a34a" />
                <span><strong>Teks Isi:</strong> Montserrat Medium</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 06: Versi Logo */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>06</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Versi Logo</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px 0' }}>
              Gunakan versi logo yang sesuai dengan kebutuhan media:
            </p>

            {/* 4 Logo Variants Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {/* 1. Full Color */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <SteamLogoVector variant="color" size={48} />
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '1px' }}>STEAM</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>Logo Utama (Full Color)</span>
              </div>

              {/* 2. Monokrom */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ filter: 'grayscale(100%) brightness(0.6)' }}>
                  <SteamLogoVector variant="color" size={48} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#1e293b', letterSpacing: '1px' }}>STEAM</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>Monokrom (One Color)</span>
              </div>

              {/* 3. Putih (Reverse) */}
              <div
                style={{
                  background: '#1e3a8a',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fff'
                }}
              >
                <SteamLogoVector variant="white" size={48} />
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#ffffff', letterSpacing: '1px' }}>STEAM</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Putih (Reverse)</span>
              </div>

              {/* 4. Ikon / Favicon */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: '#1e3a8a',
                    display: 'grid',
                    placeItems: 'center'
                  }}
                >
                  <SteamLogoVector variant="white" size={32} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>Ikon / Favicon</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
            Aset logo resmi berformat SVG vektor berstandar industri.
          </div>
        </div>

        {/* PANEL 07: Do's & Don'ts */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>07</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Do&apos;s &amp; Don&apos;ts</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px 0' }}>
              Pastikan logo selalu digunakan dengan benar di semua media publikasi:
            </p>

            {/* Do's (Green) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#16a34a', fontWeight: 800, fontSize: '12.5px' }}>
                <CheckCircle2 size={16} />
                <span>Do&apos;s (Dianjurkan)</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#475569', lineHeight: 1.6 }}>
                <li>Gunakan warna asli dari palet resmi.</li>
                <li>Jaga proporsi dan jarak aman logo (*clear space*).</li>
                <li>Pastikan keterbacaan di berbagai media digital &amp; cetak.</li>
                <li>Gunakan latar belakang yang kontras tinggi.</li>
              </ul>
            </div>

            {/* Don'ts (Red) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#dc2626', fontWeight: 800, fontSize: '12.5px' }}>
                <XCircle size={16} />
                <span>Don&apos;ts (Dilarang)</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11.5px', color: '#475569', lineHeight: 1.6 }}>
                <li>Jangan mengubah warna logo di luar palet.</li>
                <li>Jangan merubah bentuk, distorsi, atau proporsi logo.</li>
                <li>Jangan menambahkan efek berlebihan (*drop shadow* kasar).</li>
                <li>Jangan menempatkan logo di latar belakang yang ramai/mengganggu.</li>
              </ul>
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#991b1b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={13} /> Pelanggaran proporsi logo mengurangi standar audit identitas ilmiah.</span>
          </div>
        </div>

        {/* PANEL 08: Aplikasi Media */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#2563eb' }}>08</span>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1e3a8a', margin: 0 }}>Aplikasi Media</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px 0' }}>
              Logo STEAM siap digunakan di berbagai media resmi:
            </p>

            {/* 6 Applications Icons Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Website & Aplikasi', icon: Laptop, color: '#3b82f6' },
                { label: 'Media Sosial', icon: Share2, color: '#8b5cf6' },
                { label: 'Merchandise', icon: Shirt, color: '#10b981' },
                { label: 'Presentasi', icon: Presentation, color: '#f59e0b' },
                { label: 'Dokumen Riset', icon: FileText, color: '#6366f1' },
                { label: 'Bahan Promosi', icon: Megaphone, color: '#06b6d4' }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 8px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `${item.color}15`,
                        color: item.color,
                        display: 'grid',
                        placeItems: 'center'
                      }}
                    >
                      <IconComp size={18} />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#334155', lineHeight: 1.3 }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Motto */}
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#2563eb',
              letterSpacing: '1px'
            }}
          >
            <SparkleIcon size={12} color="#00c0f7" />
            <span>LEARN</span>
            <span>+</span>
            <span>CREATE</span>
            <span>+</span>
            <span>IMPACT</span>
          </div>
        </div>

      </div>

      {/* Modal to inspect official original image steam-brand-guideline.jpg */}
      {showSheetModal && (
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
          onClick={() => setShowSheetModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '1060px',
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
                  Dokumen Master Panduan Identitas Visual STEAM (Sheet Asli)
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Aset resmi: steam-brand-guideline.jpg (Resolusi Tinggi 1024x682)
                </span>
              </div>
              <button
                onClick={() => setShowSheetModal(false)}
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
