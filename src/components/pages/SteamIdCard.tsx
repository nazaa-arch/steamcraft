import React, { useState } from 'react';
import { Sparkles, ExternalLink, Edit3, X, Check } from 'lucide-react';

export interface SteamMemberData {
  id: string;
  name: string;
  role: string;
  division: string;
  steamId: string;
  joinDate: string;
  quote: string;
  avatarInitial: string;
  gradient: string;
  focus: string[];
  portfolioUrl: string;
}

// 3 Official Team Members exactly matching the uploaded screenshot layout
export const DEFAULT_STEAM_MEMBERS: SteamMemberData[] = [
  {
    id: 'naza',
    name: 'Muhammad Naza Firmansyah',
    role: 'TEAM MEMBER • PROJECT LEAD & LEAD SYSTEM ARCHITECT',
    division: 'Software Development & Architecture',
    steamId: 'STEAM-001',
    joinDate: '21 Oct 2026',
    quote: 'Together We Build the Future',
    avatarInitial: 'NF',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    focus: ['Cloud Architecture', 'Full-Stack React/Node Engine', 'FAIR Data Pipeline', 'Security & DevOps'],
    portfolioUrl: 'https://github.com/nazaa-arch'
  },
  {
    id: 'bima',
    name: 'Bima Sena',
    role: 'TEAM MEMBER • CO-LEAD ENGINEER & HARDWARE SPECIALIST',
    division: 'Engineering & IoT Telemetry',
    steamId: 'STEAM-002',
    joinDate: '21 Oct 2026',
    quote: 'Build Skills, Create Solutions, Make an Impact',
    avatarInitial: 'BS',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    focus: ['ESP32 Microcontroller', 'LoRaWAN Modulations', 'Sensor Array & MPPT Solar', 'Hardware Telemetry'],
    portfolioUrl: 'https://github.com/bimasena-iot'
  },
  {
    id: 'sandi',
    name: 'Sandi Ardi Prayitno',
    role: 'TEAM MEMBER • RESEARCH ANALYST & CREATIVE SPECIALIST',
    division: 'Research, Design & Data Analytics',
    steamId: 'STEAM-003',
    joinDate: '21 Oct 2026',
    quote: 'Learn, Create, and Deliver Real Impact',
    avatarInitial: 'SP',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
    focus: ['Scientific Methodology', 'UI/UX Visual Identity', 'Data Stochastic Modeling', 'Bio-materials Science'],
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
      <path
        d="M60 2 Q60 14 52 16 Q60 18 60 30 Q60 18 68 16 Q60 14 60 2 Z"
        fill={starColor}
        filter={isWhite ? 'none' : 'drop-shadow(0 0 3px rgba(14, 165, 233, 0.7))'}
      />
      <circle cx="60" cy="22" r="5.5" fill={centerColor} />
      <path
        d="M51 34 C54 28 66 28 69 34 C73 40 78 46 82 50 C77 50 72 46 67 42 L64 74 L56 74 L53 42 C48 46 43 50 38 50 C42 46 47 40 51 34 Z"
        fill={centerColor}
      />
      <circle cx="43" cy="29" r="5" fill={leftColor} />
      <path
        d="M34 38 C37 34 46 34 48 39 C46 45 42 56 46 72 C41 68 37 58 35 50 C32 46 30 42 34 38 Z"
        fill={leftColor}
      />
      <circle cx="77" cy="29" r="5" fill={rightColor} />
      <path
        d="M86 38 C83 34 74 34 72 39 C74 45 78 56 74 72 C79 68 83 58 85 50 C88 46 90 42 86 38 Z"
        fill={rightColor}
      />
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

// 4-pointed Sparkle SVG
export const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = '#00c0f7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z" />
  </svg>
);

// Individual Team Card matching exactly the uploaded screenshot layout
export const TeamMemberCard: React.FC<{
  member: SteamMemberData;
  onOpenPortfolio: (url: string) => void;
}> = ({ member, onOpenPortfolio }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onOpenPortfolio(member.portfolioUrl)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`Klik untuk membuka website portofolio resmi ${member.name}`}
      style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: isHovered ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
        boxShadow: isHovered
          ? '0 24px 50px rgba(30, 58, 138, 0.16), 0 8px 20px rgba(0,0,0,0.06)'
          : '0 16px 40px rgba(30, 58, 138, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none'
      }}
    >
      {/* ID Card Top Gradient Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
          padding: '24px 20px 28px 20px',
          color: '#ffffff',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Logo + STEAM text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/team-logo.jpg"
              alt="STEAM Logo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ffffff',
                padding: '3px',
                objectFit: 'contain'
              }}
            />
            <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '1px' }}>STEAM</span>
          </div>

          {/* Slogan + Sparkle */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', opacity: 0.9, display: 'block' }}>
              LEARN • CREATE • IMPACT
            </span>
            <Sparkles size={12} style={{ marginTop: '2px', opacity: 0.9 }} />
          </div>
        </div>
      </div>

      {/* ID Card Body */}
      <div style={{ padding: '0 24px 20px 24px', textAlign: 'center' }}>
        {/* Avatar Circle Overlapping Header */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: member.gradient,
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '28px',
            fontWeight: 900,
            margin: '-42px auto 14px auto',
            boxShadow: '0 8px 24px rgba(30, 58, 138, 0.22)',
            border: '4px solid #ffffff',
            position: 'relative',
            zIndex: 2
          }}
        >
          {member.avatarInitial}
        </div>

        {/* Member Name */}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 900,
            color: '#1e3a8a',
            margin: '0 0 4px 0',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          {member.name}
        </h3>

        {/* Role Subtitle */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.8px',
            color: '#2563eb',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
            lineHeight: 1.4
          }}
        >
          {member.role}
        </span>

        {/* ID Card Metadata Table */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '14px 16px',
            fontSize: '12px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>ID ANGGOTA:</span>
            <strong style={{ color: '#1e3a8a', fontWeight: 800 }}>{member.steamId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>DIVISI:</span>
            <strong style={{ color: '#1e3a8a', fontWeight: 800, textAlign: 'right', fontSize: '11.5px' }}>
              {member.division}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>TANGGAL BERGABUNG:</span>
            <strong style={{ color: '#1e3a8a', fontWeight: 800 }}>{member.joinDate}</strong>
          </div>
        </div>

        {/* Focus Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
          {member.focus.map((f, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #bfdbfe'
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Hover / Click Portfolio CTA Hint */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 800,
            color: isHovered ? '#2563eb' : '#64748b',
            transition: 'color 0.2s ease',
            marginTop: '2px'
          }}
        >
          <span>Kunjungi Website Portofolio</span>
          <ExternalLink size={12} />
        </div>
      </div>

      {/* ID Card Footer Ribbon */}
      <div
        style={{
          background: isHovered
            ? 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)'
            : 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%)',
          padding: '12px 20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color: isHovered ? '#1e40af' : '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
      >
        <Sparkles size={12} color="#3b82f6" />
        <span>{member.quote}</span>
      </div>
    </div>
  );
};

// Section Component displaying all 3 members simultaneously side-by-side
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
    naza: members[0].portfolioUrl,
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
    <section id="team" style={{ padding: '70px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#2563eb',
            letterSpacing: '0.8px',
            textTransform: 'uppercase'
          }}
        >
          SUSUNAN INOVATOR RESMI
        </span>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 900,
            color: '#1e3a8a',
            margin: '6px 0 10px 0',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Anggota Tim Peneliti STEAM
        </h2>
        <p style={{ fontSize: '14.5px', color: '#64748b', maxWidth: '640px', margin: '0 auto 12px auto' }}>
          Tiga inovator multidisiplin yang memimpin perancangan platform perangkat lunak, instrumen IoT, dan metodologi ilmiah.
        </p>
        <p style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700, margin: '0 0 14px 0' }}>
          💡 Klik pada kartu anggota mana pun untuk langsung mengunjungi website portofolio resmi masing-masing.
        </p>

        {/* Small Action to Customize Portfolio URLs */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setEditUrlModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <Edit3 size={11} />
            <span>Kustomisasi URL Portofolio</span>
          </button>
        </div>
      </div>

      {/* 3 ID Cards Grid - Lined Up Simultaneously Side-by-Side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          alignItems: 'stretch'
        }}
      >
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onOpenPortfolio={handleOpenPortfolio}
          />
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
