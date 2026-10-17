import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Compass, AlertTriangle, Users, CheckCircle2, FolderGit2, ArrowRight } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    projects,
    checkpoints,
    members,
    announcements,
    setCurrentPage,
    setSelectedProjectId,
    openModal,
    markAnnouncementRead
  } = useApp();

  // Metrics
  const activeProjects = projects.filter(p => p.status === 'Aktif' || p.status === 'Review diajukan');
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
          <div className="eyebrow">Workspace Overview</div>
          <h2>Selamat Datang di SteamCraft</h2>
          <p>
            Rancang proyek inovasi lintas disiplin, kumpulkan bukti empiris, lakukan simulasi terkontrol, dan susun
            laporan ilmiah yang siap diverifikasi dalam satu workspace terintegrasi.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => openModal('newProject')}>
              <Plus size={15} />
              <span>Buat Proyek Baru</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('projects')}>
              <Compass size={15} />
              <span>Jelajahi Katalog Proyek</span>
            </button>
          </div>
        </div>
        <div className="orbit-box">
          <span className="orbit-pill op1">🔬 Science + Tech</span>
          <div className="orbit-center">S</div>
          <span className="orbit-pill op2">📐 Math + Art</span>
        </div>
      </div>

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
          <div className="eyebrow">Akses Cepat Workspace</div>
          <h2 className="h1">Proyek Riset Multidisiplin Aktif</h2>
          <p className="sub">
            Pantau kemajuan checkpoint, logbook laboratorium, dan komunikasi tim kolaborator.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => setCurrentPage('projects')}>
          <span>Lihat Semua ({projects.length}) &rarr;</span>
        </button>
      </div>

      <div className="projects-grid">
        {projects.slice(0, 4).map(proj => (
          <div key={proj.id} className="project-card">
            <div>
              <div className="project-card-top">
                <span className="badge badge-blue">{proj.study}</span>
                <span className={`badge ${proj.blocker ? 'badge-rose' : proj.progress === 100 ? 'badge-teal' : 'badge-orange'}`}>
                  {proj.blocker ? '⚠️ Ada Blocker' : proj.status}
                </span>
              </div>

              <h3>{proj.name}</h3>
              <p>{proj.desc}</p>

              <div style={{ marginBottom: '8px' }}>
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

              <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '14px' }}>
                👨‍🏫 Pembimbing: <strong>{proj.lecturer}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
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
              >
                <span>Buka Ruang Kerja</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
