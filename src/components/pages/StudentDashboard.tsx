import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Compass,
  AlertTriangle,
  Users,
  CheckCircle2,
  Circle,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Rocket,
  UserCheck,
  Bot,
  Award
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    projects,
    checkpoints,
    members,
    announcements,
    setCurrentPage,
    setSelectedProjectId,
    openModal,
    markAnnouncementRead,
    showToast,
    setProjectCatalogTab,
    isUserMemberOfProject,
    getUserProjectRole,
    currentUser
  } = useApp();

  const isLecturer = currentUser?.role === 'lecturer';
  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';

  const myProjects = projects.filter(p => isUserMemberOfProject(p.id));
  const activeProjects = projects.filter(p => p.status === 'Aktif' || p.status === 'Review diajukan');

  const [projectTab, setProjectTab] = useState<'myProjects' | 'all'>('myProjects');
  const displayProjects = projectTab === 'myProjects' ? myProjects : activeProjects;

  // Onboarding Checklist State
  const [tasks, setTasks] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('steamcraft_onboarding_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default
      }
    }
    return {
      profile: false,
      workspace: false,
      aiChat: false,
      portfolio: false
    };
  });

  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    return localStorage.getItem('steamcraft_onboarding_dismissed') === 'true';
  });

  const toggleTask = (key: string) => {
    setTasks(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('steamcraft_onboarding_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const markTaskDone = (key: string) => {
    setTasks(prev => {
      if (prev[key]) return prev;
      const updated = { ...prev, [key]: true };
      localStorage.setItem('steamcraft_onboarding_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDismiss = () => {
    setOnboardingDismissed(true);
    localStorage.setItem('steamcraft_onboarding_dismissed', 'true');
    showToast('Panduan disembunyikan. Anda dapat membukanya kembali kapan saja.');
  };

  const handleRestore = () => {
    setOnboardingDismissed(false);
    localStorage.setItem('steamcraft_onboarding_dismissed', 'false');
  };

  const completedTasksCount = Object.values(tasks).filter(Boolean).length;

  // Metrics
  const totalCheckpoints = checkpoints.length;
  const completedCheckpoints = checkpoints.filter(c => c.is_completed === 1).length;
  const completionRate = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;
  const totalCollaborators = members.length;
  const blockerCount = projects.filter(p => p.blocker === 1).length;

  return (
    <section className="page active">
      {/* Hero Card */}
      <div className="hero-card">
        <div>
          <div className="eyebrow">{isLecturer ? 'Portal Dosen Pembimbing' : 'Workspace Overview'}</div>
          <h2>{isLecturer ? `Selamat Datang, ${currentUser?.name || 'Dosen Pembimbing'}` : 'Selamat Datang di SteamCraft'}</h2>
          <p>
            {isLecturer
              ? 'Pantau kemajuan penelitian multidisiplin mahasiswa bimbingan Anda, verifikasi logbook kegiatan riset berbasis checkpoint, dan validasi artefak data empiris.'
              : 'Rancang proyek inovasi lintas disiplin, kumpulkan bukti empiris, lakukan simulasi terkontrol, dan susun laporan ilmiah yang siap diverifikasi dalam satu workspace terintegrasi.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => openModal('newProject')}>
              <Plus size={15} />
              <span>{isLecturer ? 'Inisiasi Proyek Riset Baru' : 'Buat Proyek Baru'}</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('projects')}>
              <Compass size={15} />
              <span>Jelajahi Katalog Proyek</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => openModal('quickTour')}
              style={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid var(--line)', color: 'var(--navy)' }}
            >
              <Sparkles size={15} style={{ color: 'var(--primary)' }} />
              <span>Tur Pengguna Baru (2 Menit)</span>
            </button>
          </div>
        </div>
        <div className="orbit-box">
          <span className="orbit-pill op1">🔬 Science + Tech</span>
          <div className="orbit-center">{isLecturer ? 'D' : 'S'}</div>
          <span className="orbit-pill op2">📐 Math + Art</span>
        </div>
      </div>

      {/* ==================== ONBOARDING CHECKLIST WIDGET ==================== */}
      {!onboardingDismissed ? (
        <div
          className="onboarding-widget"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
            border: '1.5px solid #bfdbfe',
            borderRadius: '16px',
            padding: '22px',
            marginBottom: '24px',
            boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.08)',
            position: 'relative'
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                }}
              >
                <Rocket size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    Panduan Responden & Pengguna Baru
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      background: completedTasksCount === 4 ? '#f0fdf4' : '#fffbeb',
                      color: completedTasksCount === 4 ? '#166534' : '#b45309',
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: `1px solid ${completedTasksCount === 4 ? '#bbf7d0' : '#fde68a'}`
                    }}
                  >
                    {completedTasksCount} dari 4 Misi Selesai ({Math.round((completedTasksCount / 4) * 100)}%)
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 900, color: 'var(--navy)', margin: '4px 0 2px 0' }}>
                  Misi Eksplorasi 4 Langkah (Selesai dalam 3 Menit)
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                  Baru pertama kali masuk ke STEAM-Craft? Ikuti langkah praktis ini untuk memahami seluruh alur riset dan penilaian akademik.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => openModal('quickTour')}
                style={{ fontSize: '11.5px', padding: '6px 12px' }}
              >
                <Sparkles size={13} />
                <span>Buka Tur Interaktif</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleDismiss}
                style={{ fontSize: '11px', color: 'var(--muted)', padding: '6px 8px' }}
                title="Sembunyikan panduan ini"
              >
                Sembunyikan &times;
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(completedTasksCount / 4) * 100}%`,
                  background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* 4 Task Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
            {/* Task 1: Profile */}
            <div
              style={{
                background: tasks.profile ? '#f0fdf4' : 'white',
                border: `1.5px solid ${tasks.profile ? '#86efac' : 'var(--line)'}`,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: tasks.profile ? '#dcfce7' : '#eff6ff', color: tasks.profile ? '#15803d' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCheck size={16} />
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>Langkah 1</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTask('profile')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: tasks.profile ? '#16a34a' : 'var(--muted)', padding: '2px' }}
                    title={tasks.profile ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {tasks.profile ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                </div>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                  Lengkapi Profil & Afiliasi Riset
                </strong>
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                  Atur gelar akademik, universitas, program studi, dan tautan repositori profil Anda.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  openModal('profile');
                  markTaskDone('profile');
                }}
                style={{ width: '100%', marginTop: '12px', fontSize: '11.5px', justifyContent: 'center' }}
              >
                <span>{tasks.profile ? 'Perbarui Profil' : 'Atur Profil Riset'}</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Task 2: Workspace */}
            <div
              style={{
                background: tasks.workspace ? '#f0fdf4' : 'white',
                border: `1.5px solid ${tasks.workspace ? '#86efac' : 'var(--line)'}`,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: tasks.workspace ? '#dcfce7' : '#f0fdfa', color: tasks.workspace ? '#15803d' : '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderGit2 size={16} />
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>Langkah 2</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTask('workspace')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: tasks.workspace ? '#16a34a' : 'var(--muted)', padding: '2px' }}
                    title={tasks.workspace ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {tasks.workspace ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                </div>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                  Masuk ke Ruang Kerja Riset
                </strong>
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                  Pelajari alur 5 checkpoint ilmiah, logbook observasi lab, dan susunan tim proyek #1.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedProjectId(1);
                  setCurrentPage('workspace');
                  markTaskDone('workspace');
                }}
                style={{ width: '100%', marginTop: '12px', fontSize: '11.5px', justifyContent: 'center' }}
              >
                <span>Buka Ruang Kerja #1</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Task 3: AI Assistant */}
            <div
              style={{
                background: tasks.aiChat ? '#f0fdf4' : 'white',
                border: `1.5px solid ${tasks.aiChat ? '#86efac' : 'var(--line)'}`,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: tasks.aiChat ? '#dcfce7' : '#f5f3ff', color: tasks.aiChat ? '#15803d' : '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={16} />
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>Langkah 3</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTask('aiChat')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: tasks.aiChat ? '#16a34a' : 'var(--muted)', padding: '2px' }}
                    title={tasks.aiChat ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {tasks.aiChat ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                </div>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                  Coba AI Asisten Ilmiah STEAM
                </strong>
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                  Gunakan Asisten AI untuk validasi rumus, pembagian dataset, atau rekomendasi metodologi.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedProjectId(1);
                  setCurrentPage('workspace');
                  markTaskDone('aiChat');
                }}
                style={{ width: '100%', marginTop: '12px', fontSize: '11.5px', justifyContent: 'center' }}
              >
                <span>Tanya AI Asisten</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Task 4: Portfolio */}
            <div
              style={{
                background: tasks.portfolio ? '#f0fdf4' : 'white',
                border: `1.5px solid ${tasks.portfolio ? '#86efac' : 'var(--line)'}`,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: tasks.portfolio ? '#dcfce7' : '#fff7ed', color: tasks.portfolio ? '#15803d' : '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={16} />
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>Langkah 4</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTask('portfolio')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: tasks.portfolio ? '#16a34a' : 'var(--muted)', padding: '2px' }}
                    title={tasks.portfolio ? 'Tandai belum selesai' : 'Tandai selesai'}
                  >
                    {tasks.portfolio ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                </div>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                  Tinjau Radar Segi Lima & Sertifikat
                </strong>
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
                  Buka dossier akademik Anda, pelajari radar poligon segi lima S-T-E-A-M, dan cetak sertifikat.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setCurrentPage('studentPortfolio');
                  markTaskDone('portfolio');
                }}
                style={{ width: '100%', marginTop: '12px', fontSize: '11.5px', justifyContent: 'center' }}
              >
                <span>Buka Portofolio Riset</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleRestore}
            style={{ fontSize: '11.5px', background: 'var(--surface-alt)', border: '1px solid var(--line)' }}
          >
            <Rocket size={13} style={{ color: 'var(--primary)' }} />
            <span>Tampilkan Panduan Memulai ({completedTasksCount}/4 Selesai)</span>
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Proyek Aktif</div>
          <div className="stat-value">{activeProjects.length}</div>
          <div className="stat-sub">Terdaftar di workspace</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Checkpoint Selesai</div>
          <div className="stat-value" style={{ color: 'var(--accent-teal)' }}>
            {completionRate}%
          </div>
          <div className="stat-sub">Rata-rata progres ilmiah</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Kolaborator Terlibat</div>
          <div className="stat-value">{totalCollaborators}</div>
          <div className="stat-sub">Mahasiswa & Dosen</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Kendala (Blocker)</div>
          <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>
            {blockerCount}
          </div>
          <div className="stat-sub">Memerlukan klinik dosen</div>
        </div>
      </div>

      {/* ==================== INSTRUMEN UNGGULAN RISET STEAM ==================== */}
      <div style={{ marginTop: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div className="eyebrow" style={{ color: 'var(--primary)', marginBottom: '2px' }}>Instrumen Riset Baru</div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span>
              <span>Instrumen Unggulan Riset Ilmiah STEAM</span>
            </h3>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>
            Terintegrasi dengan Kurikulum Sains Data & Standar Dikti
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
          {/* Card 1: STEAM Radar Matrix */}
          <div
            className="card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1.5px solid #bfdbfe',
              background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '26px' }}>🎯</span>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>5 Pilar STEAM</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
                STEAM Radar Matrix
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, margin: 0 }}>
                Visualisasi interaktif keseimbangan 5 pilar riset (Science, Tech, Engineering, Art, Math). Deteksi pilar lemah dan dapatkan rekomendasi rekrutmen.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setCurrentPage('radar')}
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center', fontSize: '12px', padding: '8px 12px' }}
            >
              <span>Ukur Radar Riset</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: Logbook Riset & Ekspor PDF */}
          <div
            className="card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1.5px solid #bbf7d0',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
              boxShadow: '0 4px 14px rgba(16,185,129,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '26px' }}>📝</span>
                <span className="badge badge-teal" style={{ fontSize: '10px' }}>Standar PKM Dikti</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
                Logbook Riset & PDF Resmi
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, margin: 0 }}>
                {isLecturer
                  ? 'Validasi catatan aktivitas riset mahasiswa bimbingan, berikan umpan balik berkala, dan verifikasi dokumen cetak PDF resmi berkop universitas.'
                  : 'Pencatatan aktivitas riset harian/mingguan dengan verifikasi pembimbing (Dr. Belgis) serta fitur 1-klik cetak dokumen PDF resmi berkop surat universitas.'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => setCurrentPage('logbook')}
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center', fontSize: '12px', padding: '8px 12px' }}
            >
              <span>{isLecturer ? 'Validasi Logbook Riset' : 'Buka Logbook Riset'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Repository Data Empiris */}
          <div
            className="card"
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1.5px solid #ddd6fe',
              background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
              boxShadow: '0 4px 14px rgba(124,58,237,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '26px' }}>🔬</span>
                <span className="badge badge-purple" style={{ fontSize: '10px' }}>Reproducibility 100%</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
                Repository Data & Replikasi
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, margin: 0 }}>
                {isLecturer
                  ? 'Tinjau kelengkapan dataset mentah, script Python, notebook Colab, dan berikan validasi standar reproduktibilitas riset mahasiswa.'
                  : 'Kelola dataset mentah, notebook Google Colab, protokol SOP, dan evaluasi 12 kriteria reproduktibilitas standar jurnal ilmiah internasional.'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage('dataRepo')}
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center', fontSize: '12px', padding: '8px 12px' }}
            >
              <span>{isLecturer ? 'Tinjau Data Repository' : 'Buka Data Repository'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Announcement Widget */}
      <div
        className="card dashboard-announcement-card"
        style={{
          marginTop: '24px',
          marginBottom: '24px',
          padding: '18px 20px',
          borderRadius: '14px',
          border: '1px solid #bfdbfe',
          background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
          boxShadow: '0 2px 8px rgba(37,99,235,0.05)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>📢</span>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>
                Pemberitahuan & Pengumuman Kampus Terkini
              </strong>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Informasi penting terkait jadwal hibah, tenggat riset, dan kompetisi ilmiah
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage('announcements')}
            style={{ fontSize: '11px', padding: '5px 12px' }}
          >
            <span>Buka Pusat Informasi &rarr;</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {announcements.slice(0, 3).map(ann => (
            <div
              key={ann.id}
              className={`dash-ann-item ${!ann.is_read ? 'unread' : ''}`}
              onClick={() => {
                markAnnouncementRead(ann.id);
                openModal('announcementDetail', ann);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span
                  className={`badge badge-${ann.category === 'Akademik' ? 'blue' : ann.category === 'Metodologi' ? 'teal' : 'orange'}`}
                  style={{ fontSize: '10px' }}
                >
                  {ann.category}
                </span>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>{ann.title}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  {ann.author_name} · {new Date(ann.created_at).toLocaleDateString('id-ID')}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>Baca &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="section-head" style={{ marginTop: '32px' }}>
        <div>
          <div className="eyebrow">{isLecturer ? 'Monitoring Proyek Riset' : 'Akses Cepat Workspace'}</div>
          <h2 className="h1">{isLecturer ? 'Proyek Riset Bimbingan & Multidisiplin' : 'Proyek Riset Multidisiplin Aktif'}</h2>
          <p className="sub">
            {isLecturer
              ? 'Pantau progres checkpoint, validasi logbook mahasiswa bimbingan, dan evaluasi artefak data penelitian.'
              : 'Pantau kemajuan checkpoint, logbook laboratorium, dan komunikasi tim kolaborator.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setProjectCatalogTab('myProjects');
              setCurrentPage('projects');
            }}
            style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
          >
            <span>{isLecturer ? `Proyek Bimbingan (${myProjects.length}) →` : `Proyek Saya (${myProjects.length}) →`}</span>
          </button>
        </div>
      </div>

      {/* Interactive Tabs for Project Filtering directly on Dashboard */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <button
          type="button"
          onClick={() => setProjectTab('myProjects')}
          className={`btn btn-sm ${projectTab === 'myProjects' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            borderRadius: '20px',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: projectTab === 'myProjects' ? 800 : 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>{isLecturer ? '👨‍🏫 Proyek yang Anda Bimbing' : '⭐ Proyek yang Anda Ikuti'}</span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 7px',
              borderRadius: '999px',
              background: projectTab === 'myProjects' ? 'rgba(255,255,255,0.25)' : 'var(--line)',
              color: projectTab === 'myProjects' ? '#ffffff' : 'var(--navy)',
              fontWeight: 800
            }}
          >
            {myProjects.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setProjectTab('all')}
          className={`btn btn-sm ${projectTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            borderRadius: '20px',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: projectTab === 'all' ? 800 : 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🌐 Semua Proyek Riset Aktif</span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 7px',
              borderRadius: '999px',
              background: projectTab === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--line)',
              color: projectTab === 'all' ? '#ffffff' : 'var(--navy)',
              fontWeight: 800
            }}
          >
            {activeProjects.length}
          </span>
        </button>
      </div>

      {displayProjects.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '36px 24px',
            textAlign: 'center',
            borderRadius: '16px',
            background: 'var(--surface-alt)',
            border: '1.5px dashed var(--line)',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📂</div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
            {projectTab === 'myProjects'
              ? (isLecturer ? 'Belum Ada Proyek Bimbingan Terdaftar' : 'Belum Ada Proyek yang Anda Ikuti')
              : 'Tidak Ada Proyek Riset Aktif'}
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto 18px', lineHeight: 1.5 }}>
            {projectTab === 'myProjects'
              ? (isLecturer
                  ? 'Anda belum terdaftar sebagai dosen pembimbing pada proyek aktif. Buka katalog untuk melihat seluruh proyek riset mahasiswa.'
                  : 'Anda belum bergabung dalam tim riset. Jelajahi katalog riset atau open recruitment untuk bergabung!')
              : 'Saat ini belum ada proyek dengan status aktif.'}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setProjectCatalogTab('all');
                setCurrentPage('projects');
              }}
            >
              <Compass size={14} />
              <span>Jelajahi Katalog Proyek</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setProjectTab('all')}
            >
              <span>Lihat Semua Proyek Aktif ({activeProjects.length})</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="projects-grid">
          {displayProjects.map(proj => (
            <div key={proj.id} className="project-card">
              <div>
                <div className="project-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="badge badge-blue">{proj.study}</span>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {isUserMemberOfProject(proj.id) && (
                      <span className="badge badge-purple" title="Proyek yang Anda ikuti/bimbing">
                        {isLecturer ? '👨‍🏫 Bimbingan Anda' : '✓ Tim Saya'}
                      </span>
                    )}
                    <span className={`badge ${proj.blocker ? 'badge-rose' : proj.progress === 100 ? 'badge-teal' : 'badge-orange'}`}>
                      {proj.blocker ? '⚠️ Ada Blocker' : proj.status}
                    </span>
                  </div>
                </div>

                <h3>{proj.name}</h3>
                <p>{proj.desc}</p>

                {isUserMemberOfProject(proj.id) && getUserProjectRole(proj.id) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>Peran Anda:</span>
                    <span className="badge badge-purple" style={{ fontSize: '10.5px', padding: '2px 8px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getUserProjectRole(proj.id)}
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                    {proj.steam}
                  </span>
                </div>

                <div className="progress-bar-wrap">
                  <div className="progress-label-row">
                    <span>Progres Ilmiah</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '14px', wordBreak: 'break-word' }}>
                  👨‍🏫 Pembimbing: <strong>{proj.lecturer}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} />
                  <span>{proj.members_count} Peneliti</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setCurrentPage('workspace');
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>{isLecturer ? 'Buka Bimbingan' : 'Buka Ruang Kerja'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Projects Banner Link */}
      <div
        style={{
          marginTop: '16px',
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'var(--surface-alt)',
          border: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
          Menampilkan <strong>{displayProjects.length} proyek</strong> {projectTab === 'myProjects' ? (isLecturer ? 'bimbingan Anda' : 'yang Anda ikuti') : 'riset aktif'} dari total <strong>{projects.length} riset terdaftar</strong> di kampus.
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setProjectCatalogTab('myProjects');
              setCurrentPage('projects');
            }}
            style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
          >
            <span>{isLecturer ? `Proyek Bimbingan (${myProjects.length}) →` : `Proyek Saya (${myProjects.length}) →`}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setProjectCatalogTab('all');
              setCurrentPage('projects');
            }}
            style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
          >
            <span>Katalog Lengkap ({projects.length}) &rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};
