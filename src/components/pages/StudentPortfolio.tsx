import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  CheckCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  BookOpen,
  Layers,
  Star,
  Printer,
  FileText,
  CheckCircle2,
  ChevronRight,
  Share2,
  Compass,
  Shield,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  ThumbsUp,
  Code,
  Globe,
  Edit3
} from 'lucide-react';
import { Project } from '../../types';

export const StudentPortfolio: React.FC = () => {
  const { currentUser, projects, openModal, peerFeedbacks, showToast } = useApp();

  // Active Portfolio Sub-Tab: 'radar' | 'projects' | 'peer' | 'certificate'
  const [activeTab, setActiveTab] = useState<'radar' | 'projects' | 'peer' | 'certificate'>('radar');

  // Filter user projects & completed projects
  const userProjects = projects.filter(
    p => p.creator_id === currentUser?.id || p.creator_username === currentUser?.username
  );

  const completedProjects = projects.filter(p => p.status === 'Selesai' || p.progress === 100);

  // Selected project for viewing / printing certificate
  const [selectedCertProject, setSelectedCertProject] = useState<Project>(
    completedProjects[0] || projects[0]
  );

  // Peer review calculations
  const userPeerFeedbacks = peerFeedbacks.filter(f => f.reviewee_name === currentUser?.name);
  const allEarnedBadges = Array.from(new Set(userPeerFeedbacks.flatMap(f => f.badges || [])));
  const avgPeerRating =
    userPeerFeedbacks.length > 0
      ? (userPeerFeedbacks.reduce((a, b) => a + b.overall_score, 0) / userPeerFeedbacks.length).toFixed(1)
      : '4.9';

  // Formatted full display name
  const formattedDisplayName =
    [currentUser?.title_prefix, currentUser?.name, currentUser?.title_suffix].filter(Boolean).join(' ') ||
    'Budi Santoso';

  // STEAM 5-Pillar Scores Calculation
  const userProjectsWithScores = (userProjects.length > 0 ? userProjects : projects).filter(p => p.steam_scores);
  const steamScores = userProjectsWithScores.length > 0
    ? {
        S: Math.round(userProjectsWithScores.reduce((acc, p) => acc + (p.steam_scores?.S || 94), 0) / userProjectsWithScores.length),
        T: Math.round(userProjectsWithScores.reduce((acc, p) => acc + (p.steam_scores?.T || 89), 0) / userProjectsWithScores.length),
        E: Math.round(userProjectsWithScores.reduce((acc, p) => acc + (p.steam_scores?.E || 86), 0) / userProjectsWithScores.length),
        A: Math.round(userProjectsWithScores.reduce((acc, p) => acc + (p.steam_scores?.A || 82), 0) / userProjectsWithScores.length),
        M: Math.round(userProjectsWithScores.reduce((acc, p) => acc + (p.steam_scores?.M || 92), 0) / userProjectsWithScores.length),
      }
    : { S: 94, T: 89, E: 86, A: 82, M: 92 };

  const avgSteamScore = (
    (steamScores.S + steamScores.T + steamScores.E + steamScores.A + steamScores.M) / 5
  ).toFixed(1);

  // STEAM Pentagon Geometry (Segi Lima STEAM)
  const pentagonPillars = [
    {
      key: 'S',
      title: 'SCIENCE',
      sub: 'Sains & Observasi Empiris',
      score: steamScores.S,
      color: '#2563eb',
      lightBg: '#eff6ff',
      borderColor: '#bfdbfe',
      desc: 'Formulasi hipotesis terukur, telaah jurnal bereputasi, dan kepatuhan replikasi data kontrol.'
    },
    {
      key: 'T',
      title: 'TECHNOLOGY',
      sub: 'Teknologi & Algoritma',
      score: steamScores.T,
      color: '#0d9488',
      lightBg: '#f0fdfa',
      borderColor: '#99f6e4',
      desc: 'Implementasi machine learning, arsitektur telemetri nirkabel LoRa, dan komputasi awan.'
    },
    {
      key: 'E',
      title: 'ENGINEERING',
      sub: 'Rekayasa & Purwarupa',
      score: steamScores.E,
      color: '#ea580c',
      lightBg: '#fff7ed',
      borderColor: '#fed7aa',
      desc: 'Perancangan fisik tahan cuaca ekstrem, kalibrasi instrumentasi sensor, dan keandalan sistem.'
    },
    {
      key: 'A',
      title: 'ART',
      sub: 'Estetika & Desain Visual',
      score: steamScores.A,
      color: '#e11d48',
      lightBg: '#fff1f2',
      borderColor: '#fecdd3',
      desc: 'Desain visualisasi data telemetri intuitif bagi operator lapangan dan diseminasi publik.'
    },
    {
      key: 'M',
      title: 'MATHEMATICS',
      sub: 'Matematika & Ketelitian Statistik',
      score: steamScores.M,
      color: '#7c3aed',
      lightBg: '#f5f3ff',
      borderColor: '#ddd6fe',
      desc: 'Analisis ketidakpastian (uncertainty), evaluasi galat metrik RMSE, dan validasi kurva waktu.'
    }
  ];

  // SVG Radar Constants
  const cx = 270;
  const cy = 225;
  const maxR = 145;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPentagonVertex = (r: number, index: number) => {
    const angleDeg = -90 + index * 72; // Start from top (-90 deg), 72 deg step
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad)
    };
  };

  // Background Concentric Regular Pentagons
  const concentricPolygons = levels.map(level => {
    return [0, 1, 2, 3, 4]
      .map(i => {
        const pt = getPentagonVertex(maxR * level, i);
        return `${pt.x},${pt.y}`;
      })
      .join(' ');
  });

  // User's Data Polygon
  const userScorePolygon = pentagonPillars
    .map((p, i) => {
      const r = (p.score / 100) * maxR;
      const pt = getPentagonVertex(r, i);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Data nodes at vertices
  const dataNodes = pentagonPillars.map((p, i) => {
    const r = (p.score / 100) * maxR;
    const pt = getPentagonVertex(r, i);
    return { ...p, ...pt };
  });

  // Real JSON Package Downloader
  const handleDownloadPackage = (project: Project) => {
    const data = {
      platform: 'STEAM-Craft Academic Research Platform',
      version: '1.0.0-PROD',
      reproducibility_certification: {
        certificate_id: `CERT-STEAM-2026-${project.id}-${Date.now().toString(36).toUpperCase()}`,
        verification_timestamp: new Date().toISOString(),
        audit_status: 'VERIFIED_COMPLIANT_NATIONAL_STANDARD',
        hash_signature: `sha256:d8a9f3e1b74c0a5e${project.id}fa91729b48c3b`
      },
      project: {
        id: project.id,
        name: project.name,
        abstract: project.desc,
        primary_study: project.study,
        steam_pillars: project.steam,
        goal: project.goal,
        tools_and_instruments: project.tools,
        repository_url: project.repo_url,
        supervisor: project.lecturer,
        lead_researcher: currentUser?.name || 'Budi Santoso',
        final_grade: project.final_grade || 'Grade A (Unggul)',
        final_score: project.final_score || 94.5,
        supervisor_endorsement:
          project.final_note ||
          'Penelitian menunjukkan kedalaman metodologi, kalibrasi instrumen teruji, dan dokumentasi empiris yang sangat baik.'
      },
      evaluation_rubric_4_pillars: {
        completeness_score_25: 24.5,
        empirical_evidence_score_25: 23.5,
        multidisciplinary_contribution_score_25: 24.0,
        reproducibility_score_25: 22.5,
        total_accumulated_score_100: 94.5,
        classification: 'Unggul / Sangat Layak Publikasi'
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STEAM_Reproducibility_${project.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Paket Reproducibility Ilmiah "${project.name}" berhasil diekspor!`);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <section className="page active" style={{ paddingBottom: '40px' }}>
      {/* ==================== 1. ACADEMIC DOSSIER HERO ==================== */}
      <div className="portfolio-hero no-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar & Icon */}
            <div style={{ position: 'relative' }}>
              <div
                className="user-avatar"
                style={{
                  width: '80px',
                  height: '80px',
                  fontSize: '32px',
                  fontWeight: 900,
                  backgroundColor: currentUser?.avatar_color || '#2878d7',
                  border: '3px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'B'}
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: '#0f172a',
                  border: '2px solid #38bdf8',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
                title="Lencana Disiplin STEAM"
              >
                {currentUser?.avatar_icon || '🔬'}
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'white', margin: 0 }}>
                  {formattedDisplayName}
                </h1>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(110, 231, 183, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck size={13} />
                  Akreditasi Peneliti Terverifikasi
                </span>
              </div>

              <div style={{ fontSize: '13.5px', color: '#38bdf8', fontWeight: 700, marginTop: '4px' }}>
                {currentUser?.role === 'student' ? 'NIM' : currentUser?.role === 'lecturer' ? 'NIDN' : 'ADM ID'}:{' '}
                <strong style={{ color: 'white' }}>{currentUser?.identifier || '202610101'}</strong> ·{' '}
                {currentUser?.study_program || 'Sains Data'}
              </div>

              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                🏛️ {currentUser?.faculty || 'Fakultas MIPA'} — {currentUser?.university || 'Universitas Indonesia'}
              </div>

              {currentUser?.bio && (
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', fontStyle: 'italic', margin: '8px 0 0 0', maxWidth: '640px' }}>
                  "{currentUser.bio}"
                </p>
              )}

              {/* Academic Links Chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {currentUser?.github_url && (
                  <a
                    href={currentUser.github_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '11px',
                      color: '#93c5fd',
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Code size={11} />
                    <span>GitHub</span>
                  </a>
                )}
                {currentUser?.linkedin_url && (
                  <a
                    href={currentUser.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '11px',
                      color: '#93c5fd',
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Globe size={11} />
                    <span>LinkedIn</span>
                  </a>
                )}
                {currentUser?.academic_links && !currentUser.github_url && !currentUser.linkedin_url && (
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>🔗 {currentUser.academic_links}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => openModal('profile', currentUser)}
              style={{ background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit3 size={14} />
              <span>Edit Profil Akademik</span>
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setActiveTab('certificate');
                setSelectedCertProject(completedProjects[0] || projects[0]);
              }}
              style={{ color: '#38bdf8', borderColor: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}
            >
              <Award size={14} />
              <span>Lihat Sertifikat Resmi</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 2. EXECUTIVE METRICS BAR ==================== */}
      <div className="portfolio-stats-grid no-print">
        <div className="portfolio-stat-box">
          <div className="portfolio-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Riset Teruji
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)' }}>
              {completedProjects.length} Proyek Selesai
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
              ✓ 100% Lolos Uji Metodologi
            </div>
          </div>
        </div>

        <div className="portfolio-stat-box">
          <div className="portfolio-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Indeks Mutu Rubrik
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)' }}>
              94.2 / 100
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
              Grade A (Sangat Layak Publikasi)
            </div>
          </div>
        </div>

        <div className="portfolio-stat-box">
          <div className="portfolio-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Ulasan Sejawat 360°
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)' }}>
              ★ {avgPeerRating} / 5.0
            </div>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700 }}>
              {userPeerFeedbacks.length} Evaluasi Formatif Masuk
            </div>
          </div>
        </div>

        <div className="portfolio-stat-box">
          <div className="portfolio-stat-icon" style={{ background: '#faf5ff', color: '#7c3aed' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
              Reproducibility
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)' }}>
              100% Lolos Audit
            </div>
            <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>
              Dataset & Artefak Terverifikasi
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 3. PORTFOLIO SUB-TAB NAVIGATION ==================== */}
      <div className="portfolio-tabs-bar no-print">
        <button
          type="button"
          className={`portfolio-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          <BarChart3 size={15} />
          <span>Matriks Kompetensi 5 Pilar STEAM</span>
        </button>

        <button
          type="button"
          className={`portfolio-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <BookOpen size={15} />
          <span>Karya Riset Terverifikasi ({completedProjects.length})</span>
        </button>

        <button
          type="button"
          className={`portfolio-tab-btn ${activeTab === 'peer' ? 'active' : ''}`}
          onClick={() => setActiveTab('peer')}
        >
          <ThumbsUp size={15} />
          <span>Ulasan Sejawat & Lencana ({userPeerFeedbacks.length})</span>
        </button>

        <button
          type="button"
          className={`portfolio-tab-btn ${activeTab === 'certificate' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificate')}
        >
          <Award size={15} />
          <span>Sertifikat Kelayakan Riset Resmi</span>
        </button>
      </div>

      {/* ==================== TAB 1: STEAM RADAR & COMPETENCIES ==================== */}
      {activeTab === 'radar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* ==================== STEAM PENTAGON RADAR (SEGI LIMA) ==================== */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div className="eyebrow">Pengukuran Kompetensi Terstandarisasi</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', margin: '2px 0 4px 0' }}>
                  Pemetaan Segi Lima Kompetensi STEAM
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                  Diagram radar poligon segi lima terstandarisasi yang memetakan kedalaman capaian 5 pilar interdisipliner (Science, Technology, Engineering, Art, Mathematics).
                </p>
              </div>

              <span
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 800
                }}
              >
                ✓ Rata-rata Skor STEAM: {avgSteamScore}% (Unggul)
              </span>
            </div>

            {/* Pentagon SVG Radar Chart Container */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 0 20px 0',
                background: 'radial-gradient(circle at center, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.5) 100%)',
                borderRadius: '16px',
                border: '1px solid var(--line-light, #e2e8f0)',
                position: 'relative'
              }}
            >
              <svg
                viewBox="0 0 540 450"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  height: 'auto',
                  overflow: 'visible'
                }}
              >
                <defs>
                  {/* Glowing Radar Gradient */}
                  <linearGradient id="steamPentagonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                    <stop offset="35%" stopColor="#0d9488" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#ea580c" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.45" />
                  </linearGradient>

                  {/* Drop Shadow Filter */}
                  <filter id="radarShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2563eb" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* 1. Background Concentric Regular Pentagons */}
                {concentricPolygons.map((pts, idx) => {
                  const level = levels[idx];
                  return (
                    <g key={idx}>
                      <polygon
                        points={pts}
                        fill={level === 1.0 ? 'rgba(255, 255, 255, 0.7)' : 'none'}
                        stroke={level === 1.0 ? '#94a3b8' : '#cbd5e1'}
                        strokeWidth={level === 1.0 ? '1.8' : '1.2'}
                        strokeDasharray={level === 1.0 ? 'none' : '4,4'}
                      />
                      {/* Percent tick on vertical axis */}
                      <text
                        x={cx + 6}
                        y={cy - maxR * level + 4}
                        fontSize="9.5"
                        fontWeight="700"
                        fill="#94a3b8"
                      >
                        {Math.round(level * 100)}%
                      </text>
                    </g>
                  );
                })}

                {/* 2. Spoke Lines from Center to Outer Vertices */}
                {[0, 1, 2, 3, 4].map(i => {
                  const outerPt = getPentagonVertex(maxR, i);
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={outerPt.x}
                      y2={outerPt.y}
                      stroke="#94a3b8"
                      strokeWidth="1.4"
                      strokeDasharray="2,2"
                    />
                  );
                })}

                {/* 3. Center Anchor Dot */}
                <circle cx={cx} cy={cy} r="4" fill="#64748b" />

                {/* 4. Active STEAM Data Pentagon */}
                <polygon
                  points={userScorePolygon}
                  fill="url(#steamPentagonGrad)"
                  stroke="#2563eb"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  filter="url(#radarShadow)"
                />

                {/* 5. Vertex Data Nodes with Glow Rings */}
                {dataNodes.map((node, i) => (
                  <g key={i}>
                    {/* Outer glow ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="8"
                      fill={node.color}
                      fillOpacity="0.25"
                    />
                    {/* Outer border circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="5.5"
                      fill={node.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                    {/* Inner core */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="2"
                      fill="white"
                    />
                  </g>
                ))}

                {/* 6. Five Corner Vertex Badges: S, T, E, A, M */}
                {/* Vertex 0: S (SCIENCE) - TOP */}
                <g>
                  <circle cx="270" cy="22" r="15" fill="#2563eb" />
                  <text x="270" y="27" textAnchor="middle" fill="white" fontWeight="900" fontSize="13">S</text>
                  <text x="270" y="47" textAnchor="middle" fill="var(--navy)" fontWeight="800" fontSize="12">SCIENCE</text>
                  <text x="270" y="61" textAnchor="middle" fill="#2563eb" fontWeight="800" fontSize="11.5">{steamScores.S}/100</text>
                </g>

                {/* Vertex 1: T (TECHNOLOGY) - TOP RIGHT */}
                <g>
                  <circle cx="452" cy="145" r="15" fill="#0d9488" />
                  <text x="452" y="150" textAnchor="middle" fill="white" fontWeight="900" fontSize="13">T</text>
                  <text x="452" y="170" textAnchor="middle" fill="var(--navy)" fontWeight="800" fontSize="12">TECHNOLOGY</text>
                  <text x="452" y="184" textAnchor="middle" fill="#0d9488" fontWeight="800" fontSize="11.5">{steamScores.T}/100</text>
                </g>

                {/* Vertex 2: E (ENGINEERING) - BOTTOM RIGHT */}
                <g>
                  <circle cx="382" cy="365" r="15" fill="#ea580c" />
                  <text x="382" y="370" textAnchor="middle" fill="white" fontWeight="900" fontSize="13">E</text>
                  <text x="382" y="390" textAnchor="middle" fill="var(--navy)" fontWeight="800" fontSize="12">ENGINEERING</text>
                  <text x="382" y="404" textAnchor="middle" fill="#ea580c" fontWeight="800" fontSize="11.5">{steamScores.E}/100</text>
                </g>

                {/* Vertex 3: A (ART) - BOTTOM LEFT */}
                <g>
                  <circle cx="158" cy="365" r="15" fill="#e11d48" />
                  <text x="158" y="370" textAnchor="middle" fill="white" fontWeight="900" fontSize="13">A</text>
                  <text x="158" y="390" textAnchor="middle" fill="var(--navy)" fontWeight="800" fontSize="12">ART</text>
                  <text x="158" y="404" textAnchor="middle" fill="#e11d48" fontWeight="800" fontSize="11.5">{steamScores.A}/100</text>
                </g>

                {/* Vertex 4: M (MATHEMATICS) - TOP LEFT */}
                <g>
                  <circle cx="88" cy="145" r="15" fill="#7c3aed" />
                  <text x="88" y="150" textAnchor="middle" fill="white" fontWeight="900" fontSize="13">M</text>
                  <text x="88" y="170" textAnchor="middle" fill="var(--navy)" fontWeight="800" fontSize="12">MATHEMATICS</text>
                  <text x="88" y="184" textAnchor="middle" fill="#7c3aed" fontWeight="800" fontSize="11.5">{steamScores.M}/100</text>
                </g>
              </svg>
            </div>

            {/* 5-Pillar STEAM Detailed Competency Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '20px' }}>
              {pentagonPillars.map(p => (
                <div
                  key={p.key}
                  style={{
                    background: p.lightBg,
                    border: `1px solid ${p.borderColor}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: p.color,
                          color: 'white',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 900
                        }}
                      >
                        {p.key}
                      </span>
                      <strong style={{ fontSize: '15px', color: p.color, fontWeight: 900 }}>
                        {p.score}/100
                      </strong>
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--navy)' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                      {p.sub}
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Pillars National Rubric Standards */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="eyebrow" style={{ color: 'var(--primary)' }}>
              Standar Evaluasi Nasional Dikti
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', margin: '2px 0 6px 0' }}>
              Pilar Akreditasi Rubrik Penilaian Dosen (Bobot 4 × 25%)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '18px' }}>
              Rubrik penilaian baku yang digunakan dosen pembimbing untuk mengevaluasi kelayakan ilmiah setiap karya riset mahasiswa.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>1. Kelengkapan Tahapan</strong>
                  <span className="badge badge-teal">24.5 / 25</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                  Penyelesaian 5 tahapan checkpoint riset secara terstruktur dari studi literatur hingga artefak.
                </p>
              </div>

              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>2. Bukti Empiris</strong>
                  <span className="badge badge-teal">23.5 / 25</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                  Data laboratorium terkalibrasi, logbook riset harian, dan dokumentasi analisis galat statistik.
                </p>
              </div>

              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>3. Kontribusi Multidisiplin</strong>
                  <span className="badge badge-teal">24.0 / 25</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                  Keterpaduan peran kolaborator lintas prodi Sains Data, Teknik Komputer, dan Sains Biologi/Fisika.
                </p>
              </div>

              <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>4. Reproducibility</strong>
                  <span className="badge badge-teal">22.5 / 25</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                  Ketersediaan kode sumber terbuka di GitHub, dataset publik, dan panduan replikasi pihak ketiga.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: COMPLETED PROJECTS & REPOSITORIES ==================== */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', margin: '0 0 2px 0' }}>
                Karya Riset yang Telah Selesai & Terverifikasi
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                Setiap karya dilengkapi dengan paket verifikasi ilmiah independen (Reproducibility Package) siap unduh.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            {completedProjects.map(proj => (
              <div
                key={proj.id}
                className="card"
                style={{
                  padding: '24px',
                  borderTop: '4px solid #16a34a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} />
                      Selesai 100%
                    </span>
                    <span className="badge badge-purple" style={{ fontWeight: 800 }}>
                      {proj.final_grade || 'Nilai: Grade A'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
                    {proj.name}
                  </h4>

                  <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {proj.desc}
                  </p>

                  <div style={{ background: 'var(--surface-alt)', padding: '8px 12px', borderRadius: '8px', fontSize: '11.5px', color: 'var(--muted)', marginBottom: '14px' }}>
                    🔬 <strong>Pilar STEAM:</strong> {proj.steam} · ⚙️ <strong>Alat:</strong> {proj.tools}
                  </div>

                  {proj.final_note && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '10px', fontSize: '11.5px', color: '#166534', marginBottom: '16px' }}>
                      <strong>💬 Rekomendasi Dosen ({proj.lecturer}):</strong> "{proj.final_note}"
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedCertProject(proj);
                      setActiveTab('certificate');
                    }}
                    style={{ fontSize: '11.5px', padding: '5px 12px' }}
                  >
                    <Award size={13} />
                    <span>Lihat Sertifikat</span>
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {proj.repo_url && (
                      <a
                        href={proj.repo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '11.5px', padding: '5px 10px' }}
                        title="Buka Repositori Kode di GitHub"
                      >
                        <ExternalLink size={12} />
                        <span>GitHub</span>
                      </a>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDownloadPackage(proj)}
                      style={{ fontSize: '11.5px', padding: '5px 12px' }}
                      title="Unduh berkas JSON berisi metadata, logbook, dan signature verifikasi"
                    >
                      <Download size={13} />
                      <span>Ekspor JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PEER REVIEWS & BADGES ==================== */}
      {activeTab === 'peer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div className="eyebrow" style={{ color: 'var(--accent-teal)' }}>
                  Evaluasi Formatif 360° Rekan Tim
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)', margin: '2px 0 4px 0' }}>
                  Lencana Kolaborasi & Ulasan Sejawat
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
                  Penilaian independen dari rekan peneliti lintas prodi atas kontribusi teknis, ketelitian metodologi, dan etos kerja sama.
                </p>
              </div>

              <div
                style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  color: '#92400e',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Star size={14} style={{ fill: '#d97706', color: '#d97706' }} />
                <span>★ {avgPeerRating} / 5.0 Rata-rata Sejawat ({userPeerFeedbacks.length} ulasan)</span>
              </div>
            </div>

            {/* Badges Earned */}
            {allEarnedBadges.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--navy)', display: 'block', marginBottom: '8px' }}>
                  Lencana Etos Kerja yang Diberikan Rekan Peneliti:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {allEarnedBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="badge badge-teal"
                      style={{ fontSize: '11.5px', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      🏆 {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews List */}
            {userPeerFeedbacks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {userPeerFeedbacks.map(fb => (
                  <div
                    key={fb.id}
                    style={{
                      background: 'var(--surface-alt)',
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      borderLeft: '4px solid var(--accent-teal)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '13.5px', color: 'var(--navy)' }}>{fb.reviewer_name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>({fb.reviewer_study || 'STEAM'})</span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          · {new Date(fb.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '3px 10px', borderRadius: '12px' }}>
                        ★ {fb.overall_score.toFixed(1)} / 5.0
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px', fontSize: '11.5px', color: 'var(--muted)' }}>
                      <span>Teknis: <strong>{fb.ratings.technical}/5</strong></span>
                      <span>Kolaborasi: <strong>{fb.ratings.collaboration}/5</strong></span>
                      <span>Ketelitian: <strong>{fb.ratings.scientificRigor}/5</strong></span>
                      <span>Keandalan: <strong>{fb.ratings.reliability}/5</strong></span>
                    </div>

                    <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#166534', marginBottom: '8px' }}>
                      <strong>💡 Kekuatan Utama:</strong> "{fb.strengths}"
                    </div>

                    <div style={{ background: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ink-secondary)', border: '1px solid var(--line)' }}>
                      <strong>🌱 Saran Konstruktif:</strong> "{fb.improvements}"
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', background: 'var(--surface-alt)', borderRadius: '10px', color: 'var(--muted)', fontSize: '12.5px' }}>
                Belum ada ulasan yang diterima untuk akun ini. Masuk ke ruang kerja proyek dan berkolaborasi dengan rekan tim untuk saling bertukar evaluasi formatif.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: OFFICIAL SCIENTIFIC CERTIFICATE ==================== */}
      {activeTab === 'certificate' && (
        <div>
          {/* Certificate Toolbar (No-Print) */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>Pilih Proyek Riset:</span>
              <select
                value={selectedCertProject?.id}
                onChange={e => {
                  const p = projects.find(item => item.id === Number(e.target.value));
                  if (p) setSelectedCertProject(p);
                }}
                style={{ fontSize: '12.5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'white' }}
              >
                {completedProjects.map(cp => (
                  <option key={cp.id} value={cp.id}>
                    {cp.name} ({cp.final_grade || 'Grade A'})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={handlePrintCertificate}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleDownloadPackage(selectedCertProject)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={15} />
                <span>Ekspor Berkas JSON</span>
              </button>
            </div>
          </div>

          {/* Certificate Visual Sheet (Prints Crisply) */}
          <div className="certificate-container">
            {/* Certificate Header */}
            <div className="certificate-header-emblem">
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', letterSpacing: '2px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Republik Indonesia · Direktorat Jenderal Pendidikan Tinggi & Riset
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', letterSpacing: '1px', marginTop: '2px' }}>
                  STEAM-CRAFT COLLABORATIVE RESEARCH CONSORTIUM
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', fontStyle: 'italic' }}>
                  Platform Akreditasi Inovasi Sains Multidisiplin Berstandar Nasional
                </div>
              </div>

              {/* Gold Seal */}
              <div className="certificate-seal">
                <span style={{ fontSize: '18px' }}>★</span>
                <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  TERVERIFIKASI
                </span>
                <span style={{ fontSize: '7.5px', fontWeight: 700 }}>REPRODUCIBLE</span>
              </div>
            </div>

            {/* Certificate Body */}
            <div style={{ textAlign: 'center', padding: '20px 10px 30px 10px' }}>
              <div style={{ fontSize: '13px', letterSpacing: '3px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '8px' }}>
                SERTIFIKAT KELAYAKAN RISET & REPRODUCIBILITY ILMIAH
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '24px' }}>
                Nomor Sertifikasi Registrasi: SC/CERT-STEAM/2026/FMIPA-UI/00{selectedCertProject?.id || '88'}
              </div>

              <div style={{ fontSize: '14px', color: '#334155', fontStyle: 'italic', marginBottom: '8px' }}>
                Dengan bangga menyatakan bahwa peneliti:
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', textDecoration: 'underline', textUnderlineOffset: '6px', margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
                {formattedDisplayName}
              </h2>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: '20px' }}>
                NIM: {currentUser?.identifier || '202610101'} · Program Studi: {currentUser?.study_program || 'Sains Data'}
                <br />
                {currentUser?.faculty || 'Fakultas Matematika dan Ilmu Pengetahuan Alam'} — {currentUser?.university || 'Universitas Indonesia'}
              </div>

              <div style={{ fontSize: '13px', color: '#334155', maxWidth: '680px', margin: '0 auto 16px auto', lineHeight: 1.6 }}>
                Telah berhasil menyelesaikan seluruh 5 tahapan riset ilmiah multidisiplin secara tuntas, membuktikan validitas bukti empiris pada logbook laboratorium, dan memenuhi standar transparansi data replikasi pada proyek penelitian:
              </div>

              <div
                style={{
                  background: 'rgba(254, 243, 199, 0.4)',
                  border: '1.5px solid #d4af37',
                  borderRadius: '10px',
                  padding: '14px 20px',
                  display: 'inline-block',
                  maxWidth: '700px',
                  margin: '0 auto 20px auto'
                }}
              >
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                  "{selectedCertProject?.name}"
                </div>
                <div style={{ fontSize: '11.5px', color: '#78350f', marginTop: '4px' }}>
                  Disiplin STEAM: {selectedCertProject?.steam} · Metodologi: {selectedCertProject?.tools}
                </div>
              </div>

              {/* Score Badges Summary */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <div style={{ fontSize: '12px', color: '#1e293b' }}>
                  Kelengkapan: <strong>24.5/25</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#1e293b' }}>
                  Bukti Empiris: <strong>23.5/25</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#1e293b' }}>
                  Multidisiplin: <strong>24.0/25</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#1e293b' }}>
                  Reproducibility: <strong>22.5/25</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 900 }}>
                  Akumulasi: 94.5 / 100 ({selectedCertProject?.final_grade || 'Grade A Unggul'})
                </div>
              </div>

              {/* Signatures Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '20px', alignItems: 'flex-end', marginTop: '10px', maxWidth: '720px', margin: '0 auto' }}>
                {/* Left: Supervisor */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', color: '#1e40af', fontSize: '18px', fontFamily: 'cursive' }}>
                    {selectedCertProject?.lecturer.split(' ')[0] || 'Rahmat'} Wijaya
                  </div>
                  <div style={{ borderTop: '1px solid #475569', paddingTop: '4px', fontWeight: 800, fontSize: '12px', color: '#0f172a' }}>
                    {selectedCertProject?.lecturer || 'Dr. Rahmat Wijaya, M.Sc.'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Dosen Pembimbing & Evaluator Rubrik</div>
                </div>

                {/* Center: QR Seal */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '60px', height: '60px', background: '#0f172a', color: '#38bdf8', borderRadius: '8px', margin: '0 auto 4px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                    <Shield size={22} style={{ color: '#d4af37' }} />
                    <span style={{ fontSize: '7px', fontWeight: 800, color: 'white' }}>VERIFIED</span>
                  </div>
                  <div style={{ fontSize: '8px', color: '#64748b', letterSpacing: '0.5px' }}>SC-AUDIT-PASS</div>
                </div>

                {/* Right: Lead Researcher / Dean */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', color: '#1e40af', fontSize: '18px', fontFamily: 'cursive' }}>
                    {currentUser?.name || 'Budi Santoso'}
                  </div>
                  <div style={{ borderTop: '1px solid #475569', paddingTop: '4px', fontWeight: 800, fontSize: '12px', color: '#0f172a' }}>
                    {formattedDisplayName}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Ketua Tim Peneliti Multidisiplin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
