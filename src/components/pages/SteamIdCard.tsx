import React, { useState } from 'react';
import {
  User,
  Users,
  Calendar,
  Sparkles,
  RotateCw,
  Printer,
  Download,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Settings,
  Globe,
  Maximize2,
  X
} from 'lucide-react';

export interface SteamMemberData {
  id: string;
  name: string;
  fullName: string;
  role: string;
  roleTitle: string;
  division: string;
  steamId: string;
  joinDate: string;
  quote: string;
  avatarInitial: string;
  focus: string[];
}

// 3 Official Team Members matching brand guidelines & ID Card mockup
export const OFFICIAL_STEAM_MEMBERS: SteamMemberData[] = [
  {
    id: 'adhizentra',
    name: 'Adhizentra',
    fullName: 'Muhammad Naza Firmansyah',
    role: 'TEAM MEMBER',
    roleTitle: 'Project Lead & Lead System Architect',
    division: 'Development',
    steamId: 'STEAM-001',
    joinDate: '21 Oct 2026',
    quote: 'Together We Build the Future',
    avatarInitial: 'A',
    focus: ['Cloud Architecture', 'Full-Stack React/Node Engine', 'FAIR Data Standard', 'DevOps & Security']
  },
  {
    id: 'bima',
    name: 'Bima Sena',
    fullName: 'Bima Sena',
    role: 'TEAM MEMBER',
    roleTitle: 'Co-Lead Engineer & Hardware Specialist',
    division: 'Engineering',
    steamId: 'STEAM-002',
    joinDate: '21 Oct 2026',
    quote: 'Build Skills, Create Solutions, Make an Impact',
    avatarInitial: 'B',
    focus: ['ESP32 Microcontroller', 'LoRaWAN 915MHz', 'Sensor Telemetry', 'Solar MPPT Systems']
  },
  {
    id: 'sandi',
    name: 'Sandi Ardi Prayitno',
    fullName: 'Sandi Ardi Prayitno',
    role: 'TEAM MEMBER',
    roleTitle: 'Research Analyst & Creative Specialist',
    division: 'Research & Arts',
    steamId: 'STEAM-003',
    joinDate: '21 Oct 2026',
    quote: 'Together We Build the Future',
    avatarInitial: 'S',
    focus: ['Scientific Methodology', 'UI/UX Visual Identity', 'Stochastic Data Modeling', 'Bio-materials']
  }
];

// Reusable SVG for STEAM Logo (Figures + Star + Orbit)
export const SteamLogoVector: React.FC<{ variant?: 'color' | 'white'; size?: number }> = ({
  variant = 'color',
  size = 56
}) => {
  const isWhite = variant === 'white';
  const centerColor = isWhite ? '#ffffff' : '#1e3a8a';
  const leftColor = isWhite ? '#ffffff' : '#8b5cf6';
  const rightColor = isWhite ? '#ffffff' : '#06b6d4';
  const starColor = isWhite ? '#ffffff' : '#ffffff';
  const ringColor = isWhite ? 'rgba(255, 255, 255, 0.9)' : '#0ea5e9';

  return (
    <svg width={size} height={size * 0.92} viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 4-pointed Star at top */}
      <path
        d="M60 2 Q60 14 52 16 Q60 18 60 30 Q60 18 68 16 Q60 14 60 2 Z"
        fill={starColor}
        filter={isWhite ? 'none' : 'drop-shadow(0 0 3px rgba(14, 165, 233, 0.7))'}
      />
      {/* Center Figure Head */}
      <circle cx="60" cy="22" r="5.5" fill={centerColor} />
      {/* Center Figure Body & Raised Arms */}
      <path
        d="M51 34 C54 28 66 28 69 34 C73 40 78 46 82 50 C77 50 72 46 67 42 L64 74 L56 74 L53 42 C48 46 43 50 38 50 C42 46 47 40 51 34 Z"
        fill={centerColor}
      />
      {/* Left Figure Head */}
      <circle cx="43" cy="29" r="5" fill={leftColor} />
      {/* Left Figure Body */}
      <path
        d="M34 38 C37 34 46 34 48 39 C46 45 42 56 46 72 C41 68 37 58 35 50 C32 46 30 42 34 38 Z"
        fill={leftColor}
      />
      {/* Right Figure Head */}
      <circle cx="77" cy="29" r="5" fill={rightColor} />
      {/* Right Figure Body */}
      <path
        d="M86 38 C83 34 74 34 72 39 C74 45 78 56 74 72 C79 68 83 58 85 50 C88 46 90 42 86 38 Z"
        fill={rightColor}
      />
      {/* Orbit Ring Swoosh */}
      <ellipse
        cx="60"
        cy="52"
        rx="46"
        ry="13"
        transform="rotate(-18 60 52)"
        stroke={ringColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

// High-Precision SVG QR Code for steamcraft.online
export const SteamQrCodeVector: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 27 27"
    shapeRendering="crispEdges"
    style={{ display: 'block', borderRadius: '4px' }}
  >
    <path fill="#ffffff" d="M0 0h27v27H0z" />
    <path
      stroke="#1e293b"
      strokeWidth="1"
      d="M1 1.5h7m3 0h2m1 0h1m4 0h7M1 2.5h1m5 0h1m1 0h1m2 0h2m1 0h1m3 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h1m1 0h3m3 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h1m3 0h3m1 0h1m1 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m2 0h1m1 0h3m2 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m3 0h1m2 0h2m1 0h1m1 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h2m1 0h1M1 9.5h1m5 0h1m1 0h1m1 0h2m1 0h3m1 0h2m2 0h3M3 10.5h4m1 0h1m3 0h5m1 0h1m1 0h5M1 11.5h4m1 0h4m2 0h1m1 0h3m1 0h5m1 0h2M3 12.5h2m3 0h1m1 0h1m1 0h1m2 0h2m2 0h1m2 0h1m2 0h1M1 13.5h4m2 0h1m2 0h4m2 0h1m2 0h1m5 0h1M1 14.5h3m6 0h1m3 0h1m1 0h2m2 0h1m3 0h1M1 15.5h1m2 0h2m1 0h1m1 0h1m1 0h12m1 0h2M1 16.5h1m1 0h2m3 0h5m2 0h6m1 0h2m1 0h1M1 17.5h1m1 0h1m3 0h1m4 0h10m1 0h1M9 18.5h1m1 0h1m1 0h2m2 0h1m3 0h1M1 19.5h7m2 0h3m1 0h1m2 0h1m1 0h1m1 0h1m3 0h1M1 20.5h1m5 0h1m2 0h2m4 0h2m3 0h1m2 0h2M1 21.5h1m1 0h3m1 0h1m2 0h1m2 0h9m1 0h1M1 22.5h1m1 0h3m1 0h1m2 0h1m1 0h1m1 0h6m4 0h2M1 23.5h1m1 0h3m1 0h1m2 0h2m1 0h1m3 0h1m4 0h2m1 0h1M1 24.5h1m5 0h1m3 0h2m2 0h1m1 0h1m1 0h3m3 0h1M1 25.5h7m1 0h3m1 0h1m3 0h1m1 0h1m2 0h1m2 0h1"
    />
  </svg>
);

// 4-pointed Sparkle SVG
export const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#00c0f7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z" />
  </svg>
);

// Front Side Component of the ID Card
export const SteamIdCardFront: React.FC<{
  member: SteamMemberData;
  onFlip?: () => void;
  showFlipButton?: boolean;
}> = ({ member, onFlip, showFlipButton = false }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '340px',
        height: '520px',
        background: '#ffffff',
        borderRadius: '26px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(30, 58, 138, 0.12), 0 4px 16px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(226, 232, 240, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Top-Left Waves SVG */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
        viewBox="0 0 340 520"
        fill="none"
      >
        <defs>
          <linearGradient id="front-tl-navy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="front-tl-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="front-tl-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Bottom-Right Gradients */}
          <linearGradient id="front-br-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="front-br-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="front-br-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Top-Left Wave Curves */}
        <path d="M0 0 L135 0 C110 32 65 48 45 92 C26 128 14 150 0 165 Z" fill="url(#front-tl-navy)" />
        <path d="M0 35 C38 28 62 55 42 105 C26 140 12 165 0 180 Z" fill="url(#front-tl-purple)" opacity="0.9" />
        <path d="M0 85 C22 80 38 108 28 145 C18 170 8 190 0 200 Z" fill="url(#front-tl-cyan)" opacity="0.95" />

        {/* Bottom-Right Wave Curves */}
        <path d="M340 370 C310 390 280 425 260 460 C235 500 200 515 160 520 L340 520 Z" fill="url(#front-br-purple)" />
        <path d="M340 405 C315 425 295 455 275 485 C250 515 220 520 190 520 L340 520 Z" fill="url(#front-br-blue)" />
        <path d="M340 445 C325 460 305 485 285 508 C265 520 240 520 220 520 L340 520 Z" fill="url(#front-br-cyan)" />
      </svg>

      {/* Faint Watermark Logo on Middle-Right */}
      <div
        style={{
          position: 'absolute',
          right: '-25px',
          top: '115px',
          width: '210px',
          height: '210px',
          opacity: 0.1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1
        }}
      >
        <SteamLogoVector variant="color" size={210} />
      </div>

      {/* Card Header */}
      <div
        style={{
          padding: '24px 22px 10px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* STEAM Logo + Text */}
        <div style={{ marginLeft: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SteamLogoVector variant="color" size={54} />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#1e3a8a',
              letterSpacing: '1.5px',
              marginTop: '1px'
            }}
          >
            STEAM
          </span>
        </div>

        {/* Tagline Stack: LEARN | CREATE | IMPACT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
          <div style={{ width: '1.5px', height: '42px', background: 'rgba(59, 130, 246, 0.4)' }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '9.5px',
              fontWeight: 800,
              color: '#2563eb',
              letterSpacing: '1.2px',
              lineHeight: 1.35
            }}
          >
            <span>LEARN</span>
            <span>CREATE</span>
            <span>IMPACT</span>
          </div>
          <SparkleIcon size={12} color="#00c0f7" />
        </div>
      </div>

      {/* Card Center: Avatar + Identity Info */}
      <div
        style={{
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2,
          marginTop: '-4px'
        }}
      >
        {/* Profile Circle Avatar with Cyan Ring */}
        <div
          style={{
            width: '92px',
            height: '92px',
            borderRadius: '50%',
            border: '3.5px solid #00c0f7',
            background: '#f1f5f9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(0, 192, 247, 0.2)'
          }}
        >
          {/* User Silhouette Placeholder matching exact mockup */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#94a3b8">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>

        {/* Member Name */}
        <h3
          style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#1e293b',
            margin: '0 0 3px 0',
            letterSpacing: '-0.3px',
            fontFamily: "'Montserrat', 'Inter', sans-serif"
          }}
        >
          {member.name}
        </h3>

        {/* Role Tag */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#2563eb',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '18px',
            display: 'block'
          }}
        >
          {member.role}
        </span>

        {/* Info Rows Table with Line Icons */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '12px'
          }}
        >
          {/* ID Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '22px 84px 1fr', alignItems: 'center' }}>
            <User size={15} color="#94a3b8" />
            <span style={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.8px', fontSize: '11px' }}>ID</span>
            <strong style={{ color: '#1e293b', fontWeight: 800, letterSpacing: '0.5px' }}>{member.steamId}</strong>
          </div>

          {/* Division Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '22px 84px 1fr', alignItems: 'center' }}>
            <Users size={15} color="#94a3b8" />
            <span style={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.8px', fontSize: '11px' }}>DIVISION</span>
            <strong style={{ color: '#1e293b', fontWeight: 800 }}>{member.division}</strong>
          </div>

          {/* Join Date Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '22px 84px 1fr', alignItems: 'center' }}>
            <Calendar size={15} color="#94a3b8" />
            <span style={{ color: '#64748b', fontWeight: 600, letterSpacing: '0.8px', fontSize: '11px' }}>JOIN DATE</span>
            <strong style={{ color: '#1e293b', fontWeight: 800 }}>{member.joinDate}</strong>
          </div>
        </div>
      </div>

      {/* Card Footer Quote & Accent */}
      <div
        style={{
          padding: '14px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <SparkleIcon size={12} color="#00c0f7" />
          <span
            style={{
              fontSize: '11px',
              fontStyle: 'italic',
              color: '#64748b',
              fontWeight: 500,
              letterSpacing: '0.2px'
            }}
          >
            {member.quote}
          </span>
        </div>

        {/* Optional Flip Button */}
        {showFlipButton && onFlip && (
          <button
            onClick={onFlip}
            title="Balik Kartu (Lihat Bagian Belakang)"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 10px',
              color: '#2563eb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px',
              fontWeight: 700
            }}
          >
            <RotateCw size={12} />
            <span>Balik</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Back Side Component of the ID Card
export const SteamIdCardBack: React.FC<{
  member: SteamMemberData;
  onFlip?: () => void;
  showFlipButton?: boolean;
}> = ({ onFlip, showFlipButton = false }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '340px',
        height: '520px',
        background: 'linear-gradient(160deg, #0b2e88 0%, #1e40af 35%, #2563eb 70%, #0284c7 100%)',
        borderRadius: '26px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(11, 46, 136, 0.28), 0 4px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '28px 20px 22px 20px',
        boxSizing: 'border-box',
        color: '#ffffff',
        userSelect: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Background Fluid Wave Accents */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
        viewBox="0 0 340 520"
        fill="none"
      >
        <defs>
          <linearGradient id="back-tr-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="back-bl-wave" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Top-Right Curve */}
        <path d="M340 0 L220 0 C250 35 285 70 310 115 C325 145 335 180 340 210 Z" fill="url(#back-tr-cyan)" />
        {/* Bottom Curve Accent */}
        <path d="M0 430 C50 410 110 440 150 480 C180 505 210 520 240 520 L0 520 Z" fill="url(#back-bl-wave)" />
      </svg>

      {/* Top STEAM Logo in White */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <SteamLogoVector variant="white" size={60} />
        <span
          style={{
            fontSize: '19px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '2px',
            marginTop: '3px'
          }}
        >
          STEAM
        </span>

        {/* Tagline / Philosophy */}
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            lineHeight: 1.45,
            fontStyle: 'italic',
            margin: '10px 0 6px 0',
            maxWidth: '220px'
          }}
        >
          Build Skills,
          <br />
          Create Solutions,
          <br />
          Make an Impact.
        </p>

        {/* Sparkle below tagline */}
        <div style={{ marginTop: '2px' }}>
          <SparkleIcon size={14} color="#38bdf8" />
        </div>
      </div>

      {/* Center QR Code Container */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '12px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          margin: '4px 0'
        }}
      >
        <SteamQrCodeVector size={110} />
      </div>

      {/* Bottom Row: 4 STEAM Pillars */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          paddingTop: '8px'
        }}
      >
        {/* Pillar 1: Science & Tech */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <GraduationCap size={17} color="#ffffff" />
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Science &amp;
            <br />
            Technology
          </span>
        </div>

        {/* Pillar 2: Engineering */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderLeft: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Settings size={17} color="#ffffff" />
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Engineering
          </span>
        </div>

        {/* Pillar 3: Arts */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderLeft: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Globe size={17} color="#ffffff" />
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Arts
          </span>
        </div>

        {/* Pillar 4: Mathematics */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            borderLeft: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>&pi;</span>
          <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Mathematics
          </span>
        </div>
      </div>

      {/* Decorative Cyan Sparkle at Bottom Right */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          right: '18px',
          zIndex: 2
        }}
      >
        <SparkleIcon size={16} color="#38bdf8" />
      </div>

      {/* Optional Flip Button */}
      {showFlipButton && onFlip && (
        <button
          onClick={onFlip}
          title="Balik ke Bagian Depan"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 3,
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '999px',
            padding: '5px 10px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            fontWeight: 700,
            backdropFilter: 'blur(8px)'
          }}
        >
          <RotateCw size={12} />
          <span>Depan</span>
        </button>
      )}
    </div>
  );
};

// 3D Flippable Card Wrapper
export const SteamIdCardFlip: React.FC<{ member: SteamMemberData }> = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '340px',
        height: '520px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Face */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            top: 0,
            left: 0
          }}
        >
          <SteamIdCardFront
            member={member}
            onFlip={() => setIsFlipped(true)}
            showFlipButton={true}
          />
        </div>

        {/* Back Face */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            top: 0,
            left: 0
          }}
        >
          <SteamIdCardBack
            member={member}
            onFlip={() => setIsFlipped(false)}
            showFlipButton={true}
          />
        </div>
      </div>
    </div>
  );
};

// Main Team Showcase Section with Side-by-Side Mockup & 3D Cards
export const SteamTeamCardSection: React.FC = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('adhizentra');
  const [viewMode, setViewMode] = useState<'mockup' | 'interactive' | 'all'>('mockup');
  const [showOriginalModal, setShowOriginalModal] = useState<boolean>(false);

  const currentMember =
    OFFICIAL_STEAM_MEMBERS.find((m) => m.id === selectedMemberId) || OFFICIAL_STEAM_MEMBERS[0];

  return (
    <section id="team" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#2563eb',
            fontSize: '11.5px',
            fontWeight: 800,
            letterSpacing: '1px',
            marginBottom: '10px'
          }}
        >
          <Sparkles size={13} color="#2563eb" />
          <span>KARTU TANDA PENGENAL RESMI (OFFICIAL STEAM ID CARD)</span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 38px)',
            fontWeight: 900,
            color: '#1e3a8a',
            margin: '0 0 10px 0',
            letterSpacing: '-0.5px'
          }}
        >
          Identitas &amp; Profil Peneliti Tim STEAM
        </h2>

        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '680px', margin: '0 auto 28px auto' }}>
          Kartu pengenal resmi yang memadukan 5 pilar STEAM, identitas visual tim, serta kode verifikasi kredensial
          digital untuk setiap inovator riset.
        </p>

        {/* Member Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '22px'
          }}
        >
          {OFFICIAL_STEAM_MEMBERS.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMemberId(member.id)}
              style={{
                padding: '9px 18px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                border: selectedMemberId === member.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: selectedMemberId === member.id ? '#eff6ff' : '#ffffff',
                color: selectedMemberId === member.id ? '#1e40af' : '#475569',
                boxShadow:
                  selectedMemberId === member.id
                    ? '0 4px 14px rgba(37, 99, 235, 0.15)'
                    : '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: selectedMemberId === member.id ? '#2563eb' : '#94a3b8',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                {member.avatarInitial}
              </div>
              <span>
                {member.name} ({member.steamId})
              </span>
            </button>
          ))}
        </div>

        {/* Mode Selector Tabs (Mockup Side-by-Side vs 3D Flip vs All 3 Members) */}
        <div
          style={{
            display: 'inline-flex',
            background: '#e2e8f0',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px',
            marginBottom: '32px'
          }}
        >
          <button
            onClick={() => setViewMode('mockup')}
            style={{
              padding: '7px 16px',
              borderRadius: '9px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: viewMode === 'mockup' ? '#ffffff' : 'transparent',
              color: viewMode === 'mockup' ? '#1e3a8a' : '#64748b',
              boxShadow: viewMode === 'mockup' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Tampilan Berdampingan (Depan &amp; Belakang)
          </button>
          <button
            onClick={() => setViewMode('interactive')}
            style={{
              padding: '7px 16px',
              borderRadius: '9px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: viewMode === 'interactive' ? '#ffffff' : 'transparent',
              color: viewMode === 'interactive' ? '#1e3a8a' : '#64748b',
              boxShadow: viewMode === 'interactive' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Kartu Interaktif 3D (Bisa Dibalik)
          </button>
          <button
            onClick={() => setViewMode('all')}
            style={{
              padding: '7px 16px',
              borderRadius: '9px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: viewMode === 'all' ? '#ffffff' : 'transparent',
              color: viewMode === 'all' ? '#1e3a8a' : '#64748b',
              boxShadow: viewMode === 'all' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Semua 3 Anggota Tim
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Mockup Side-by-Side (Persis Desain Gambar Resmi yang Diunggah) */}
      {viewMode === 'mockup' && (
        <div
          style={{
            background: 'radial-gradient(ellipse at center, rgba(238, 242, 255, 0.9) 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '32px',
            padding: '50px 24px',
            boxShadow: '0 20px 50px rgba(30, 58, 138, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 80%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '36px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Front Card */}
            <div>
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#2563eb',
                  letterSpacing: '0.8px'
                }}
              >
                TAMPAK DEPAN (FRONT)
              </div>
              <SteamIdCardFront member={currentMember} />
            </div>

            {/* Back Card */}
            <div>
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#2563eb',
                  letterSpacing: '0.8px'
                }}
              >
                TAMPAK BELAKANG (BACK)
              </div>
              <SteamIdCardBack member={currentMember} />
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Interactive 3D Flippable Card */}
      {viewMode === 'interactive' && (
        <div
          style={{
            background: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '28px',
            padding: '50px 24px',
            textAlign: 'center'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <span
              style={{
                fontSize: '12.5px',
                color: '#64748b',
                background: '#ffffff',
                padding: '6px 16px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCw size={14} color="#2563eb" />
              <span>Klik tombol &quot;Balik&quot; pada kartu di bawah untuk membalik kartu tanda pengenal secara interaktif</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SteamIdCardFlip member={currentMember} />
          </div>
        </div>
      )}

      {/* VIEW MODE 3: All 3 Team Members in a Responsive Grid */}
      {viewMode === 'all' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            justifyItems: 'center'
          }}
        >
          {OFFICIAL_STEAM_MEMBERS.map((member) => (
            <div key={member.id} style={{ width: '100%', maxWidth: '340px' }}>
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#2563eb',
                  letterSpacing: '0.5px'
                }}
              >
                {member.fullName}
              </div>
              <SteamIdCardFlip member={member} />
            </div>
          ))}
        </div>
      )}

      {/* Action Bar Below Cards */}
      <div
        style={{
          marginTop: '36px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setShowOriginalModal(true)}
          style={{
            padding: '11px 20px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#1e3a8a',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
        >
          <Maximize2 size={15} color="#2563eb" />
          <span>Lihat Gambar Mockup Asli (steam-id-card.png)</span>
        </button>

        <button
          onClick={() => window.print()}
          style={{
            padding: '11px 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            border: 'none',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)'
          }}
        >
          <Printer size={15} />
          <span>Cetak / Simpan PDF Kartu Tanda Anggota</span>
        </button>
      </div>

      {/* Modal for Original Mockup Image Inspection */}
      {showOriginalModal && (
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
          onClick={() => setShowOriginalModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
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
                  Dokumen Desain Resmi Kartu Tanda Anggota (ID Card Mockup)
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Aset resmi STEAM: steam-id-card.png (Depan &amp; Belakang)
                </span>
              </div>
              <button
                onClick={() => setShowOriginalModal(false)}
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

            <div style={{ textAlign: 'center', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <img
                src="/steam-id-card.png"
                alt="Desain Asli ID Card STEAM"
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
                Format: Kartu CR80 Standar Industri • Rasio Asli 1024x682
              </span>
              <a
                href="/steam-id-card.png"
                download="steam-id-card-official.png"
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
                <span>Unduh Gambar Asli</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
