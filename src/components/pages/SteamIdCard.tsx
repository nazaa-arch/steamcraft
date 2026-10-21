import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  Calendar,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Settings,
  Globe,
  RotateCw,
  Printer,
  Maximize2,
  X,
  Edit3,
  Check
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
  portfolioUrl: string;
}

// 3 Official Team Members with designated portfolio URLs
export const DEFAULT_STEAM_MEMBERS: SteamMemberData[] = [
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
    focus: ['Cloud Architecture', 'Full-Stack React/Node Engine', 'FAIR Data Standard', 'DevOps & Security'],
    portfolioUrl: 'https://github.com/nazaa-arch'
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
    focus: ['ESP32 Microcontroller', 'LoRaWAN 915MHz', 'Sensor Telemetry', 'Solar MPPT Systems'],
    portfolioUrl: 'https://github.com/bimasena-iot'
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
    focus: ['Scientific Methodology', 'UI/UX Visual Identity', 'Stochastic Data Modeling', 'Bio-materials'],
    portfolioUrl: 'https://github.com/sandiardi'
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

// Front Side Component of the ID Card with Clickable Portfolio Link
export const SteamIdCardFront: React.FC<{
  member: SteamMemberData;
  onFlip?: (e: React.MouseEvent) => void;
  onClickCard?: () => void;
}> = ({ member, onFlip, onClickCard }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClickCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`Klik untuk membuka website portofolio ${member.name}`}
      style={{
        width: '100%',
        maxWidth: '350px',
        minHeight: '540px',
        background: '#ffffff',
        borderRadius: '26px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 26px 55px rgba(37, 99, 235, 0.22), 0 8px 24px rgba(0, 0, 0, 0.08)'
          : '0 16px 40px rgba(30, 58, 138, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04)',
        border: isHovered ? '1.5px solid #38bdf8' : '1px solid rgba(226, 232, 240, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none'
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
        viewBox="0 0 350 540"
        fill="none"
      >
        <defs>
          <linearGradient id={`tl-navy-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id={`tl-purple-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id={`tl-cyan-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Bottom-Right Gradients */}
          <linearGradient id={`br-purple-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`br-blue-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id={`br-cyan-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Top-Left Wave Curves */}
        <path d="M0 0 L135 0 C110 32 65 48 45 92 C26 128 14 150 0 165 Z" fill={`url(#tl-navy-${member.id})`} />
        <path d="M0 35 C38 28 62 55 42 105 C26 140 12 165 0 180 Z" fill={`url(#tl-purple-${member.id})`} opacity="0.9" />
        <path d="M0 85 C22 80 38 108 28 145 C18 170 8 190 0 200 Z" fill={`url(#tl-cyan-${member.id})`} opacity="0.95" />

        {/* Bottom-Right Wave Curves */}
        <path d="M350 380 C320 400 290 435 270 470 C245 510 210 525 170 540 L350 540 Z" fill={`url(#br-purple-${member.id})`} />
        <path d="M350 415 C325 435 305 465 285 495 C260 525 230 535 200 540 L350 540 Z" fill={`url(#br-blue-${member.id})`} />
        <path d="M350 455 C335 470 315 495 295 520 C275 535 250 540 230 540 L350 540 Z" fill={`url(#br-cyan-${member.id})`} />
      </svg>

      {/* Faint Watermark Logo on Middle-Right */}
      <div
        style={{
          position: 'absolute',
          right: '-25px',
          top: '115px',
          width: '210px',
          height: '210px',
          opacity: 0.09,
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
            marginBottom: '14px',
            boxShadow: '0 8px 20px rgba(0, 192, 247, 0.2)'
          }}
        >
          {/* User Silhouette Placeholder */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#94a3b8">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>

        {/* Member Name */}
        <h3
          style={{
            fontSize: '23px',
            fontWeight: 900,
            color: '#1e293b',
            margin: '0 0 2px 0',
            letterSpacing: '-0.3px',
            fontFamily: "'Montserrat', sans-serif"
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
            marginBottom: '16px',
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
            gap: '9px',
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

      {/* Card Footer: Quote + Prominent Portfolio CTA */}
      <div
        style={{
          padding: '12px 20px 18px 20px',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Quote & Optional Flip Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

          {onFlip && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlip(e);
              }}
              title="Balik Kartu (Lihat Tampak Belakang)"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: 'none',
                borderRadius: '999px',
                padding: '4px 8px',
                color: '#2563eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontWeight: 700
              }}
            >
              <RotateCw size={11} />
              <span>Balik</span>
            </button>
          )}
        </div>

        {/* PROMINENT ACTION BUTTON: Kunjungi Website Portofolio */}
        <div
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '12px',
            background: isHovered
              ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
              : 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(37, 99, 235, 0.12) 100%)',
            border: isHovered ? '1px solid transparent' : '1px solid rgba(37, 99, 235, 0.3)',
            color: isHovered ? '#ffffff' : '#1e40af',
            fontSize: '12.5px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: isHovered ? '0 6px 20px rgba(37, 99, 235, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Kunjungi Website Portofolio</span>
          <ExternalLink size={14} />
        </div>
      </div>
    </div>
  );
};

// Back Side Component of the ID Card
export const SteamIdCardBack: React.FC<{
  member: SteamMemberData;
  onFlip?: (e: React.MouseEvent) => void;
  onClickCard?: () => void;
}> = ({ member, onFlip, onClickCard }) => {
  return (
    <div
      onClick={onClickCard}
      title={`Klik untuk membuka website portofolio ${member.name}`}
      style={{
        width: '100%',
        maxWidth: '350px',
        minHeight: '540px',
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
        padding: '28px 20px 20px 20px',
        boxSizing: 'border-box',
        color: '#ffffff',
        cursor: 'pointer',
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
        viewBox="0 0 350 540"
        fill="none"
      >
        <path d="M350 0 L220 0 C250 35 285 70 310 115 C325 145 335 180 350 210 Z" fill="rgba(56, 189, 248, 0.25)" />
        <path d="M0 430 C50 410 110 440 150 480 C180 505 210 540 240 540 L0 540 Z" fill="rgba(6, 182, 212, 0.25)" />
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
        <SteamLogoVector variant="white" size={56} />
        <span
          style={{
            fontSize: '18px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '2px',
            marginTop: '2px'
          }}
        >
          STEAM
        </span>

        {/* Tagline / Philosophy */}
        <p
          style={{
            fontSize: '12.5px',
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            lineHeight: 1.4,
            fontStyle: 'italic',
            margin: '8px 0 4px 0',
            maxWidth: '220px'
          }}
        >
          Build Skills,
          <br />
          Create Solutions,
          <br />
          Make an Impact.
        </p>

        <SparkleIcon size={12} color="#38bdf8" />
      </div>

      {/* Center QR Code Container */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '10px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          margin: '2px 0'
        }}
      >
        <SteamQrCodeVector size={105} />
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
          paddingTop: '6px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <GraduationCap size={16} color="#ffffff" />
          <span style={{ fontSize: '8.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Science &amp; Tech
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
          <Settings size={16} color="#ffffff" />
          <span style={{ fontSize: '8.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Engineering
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
          <Globe size={16} color="#ffffff" />
          <span style={{ fontSize: '8.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Arts
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>&pi;</span>
          <span style={{ fontSize: '8.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>
            Mathematics
          </span>
        </div>
      </div>

      {/* Bottom Action: Kunjungi Portofolio Ribbon */}
      <div
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '8px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          textAlign: 'center',
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
      >
        <span>Buka Portofolio ({member.name})</span>
        <ExternalLink size={13} />
      </div>

      {/* Flip Button */}
      {onFlip && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFlip(e);
          }}
          title="Balik ke Depan"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
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

// Flippable Card Wrapper for Individual Member in the Grid
export const FlippableMemberCard: React.FC<{
  member: SteamMemberData;
  onOpenPortfolio: (url: string) => void;
}> = ({ member, onOpenPortfolio }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '350px',
        minHeight: '540px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front */}
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
            onClickCard={() => onOpenPortfolio(member.portfolioUrl)}
          />
        </div>

        {/* Back */}
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
            onClickCard={() => onOpenPortfolio(member.portfolioUrl)}
          />
        </div>
      </div>
    </div>
  );
};

// Main Team Section: 3 Cards Lined Up Directly Side-by-Side
export const SteamTeamCardSection: React.FC = () => {
  const [members, setMembers] = useState<SteamMemberData[]>(() => {
    try {
      const saved = localStorage.getItem('steam_team_members_custom_urls');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_STEAM_MEMBERS;
  });

  const [editUrlModal, setEditUrlModal] = useState<boolean>(false);
  const [editingUrls, setEditingUrls] = useState<{ [id: string]: string }>({
    adhizentra: members[0].portfolioUrl,
    bima: members[1].portfolioUrl,
    sandi: members[2].portfolioUrl
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleOpenPortfolio = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveUrls = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = members.map((m) => ({
      ...m,
      portfolioUrl: editingUrls[m.id] || m.portfolioUrl
    }));
    setMembers(updated);
    try {
      localStorage.setItem('steam_team_members_custom_urls', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setEditUrlModal(false);
    }, 1200);
  };

  return (
    <section id="team" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '46px' }}>
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
          <Sparkles size={14} color="#2563eb" />
          <span>KARTU TANDA PENGENAL RESMI &amp; PORTOFOLIO TIM</span>
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
          Inovator Tim Peneliti STEAM
        </h2>

        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '720px', margin: '0 auto 16px auto', lineHeight: 1.6 }}>
          Tiga inovator multidisiplin yang memimpin perancangan platform perangkat lunak, instrumen IoT, dan metodologi riset ilmiah.
          <br />
          <strong style={{ color: '#2563eb' }}>Klik pada kartu anggota mana pun untuk langsung mengunjungi website portofolio resminya.</strong>
        </p>

        {/* Small URL Setting Link */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setEditUrlModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            <Edit3 size={12} />
            <span>Kustomisasi Tautan Website Portofolio Anggota</span>
          </button>
        </div>
      </div>

      {/* DIRECT 3-MEMBER CARDS GRID (LINED UP SIDE-BY-SIDE) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
      >
        {members.map((member) => (
          <div key={member.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <FlippableMemberCard
              member={member}
              onOpenPortfolio={handleOpenPortfolio}
            />
          </div>
        ))}
      </div>

      {/* Modal to Customize Portfolio URLs */}
      {editUrlModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setEditUrlModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e3a8a', margin: '0 0 4px 0' }}>
                  Atur Tautan Website Portofolio
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Sesuaikan URL tujuan saat masing-masing kartu anggota diklik oleh pengunjung.
                </span>
              </div>
              <button
                onClick={() => setEditUrlModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveUrls} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {members.map((m) => (
                <div key={m.id}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                    {m.name} ({m.steamId} • {m.division})
                  </label>
                  <input
                    type="url"
                    value={editingUrls[m.id] || ''}
                    onChange={(e) => setEditingUrls({ ...editingUrls, [m.id]: e.target.value })}
                    placeholder="https://..."
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditUrlModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#475569',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {saveSuccess ? <Check size={16} /> : null}
                  <span>{saveSuccess ? 'Tersimpan!' : 'Simpan Tautan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
