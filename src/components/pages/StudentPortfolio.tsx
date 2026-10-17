import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle, Download, ExternalLink, ShieldCheck, User } from 'lucide-react';

export const StudentPortfolio: React.FC = () => {
  const { currentUser, projects, openModal } = useApp();

  const userProjects = projects.filter(
    p => p.creator_id === currentUser?.id || p.creator_username === currentUser?.username
  );

  const completedProjects = projects.filter(p => p.status === 'Selesai' || p.progress === 100);

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Rekam Jejak & Portofolio Akademik</div>
          <h2 className="h1">Portofolio Peneliti STEAM</h2>
          <p className="sub">
            Bukti empiris kompetensi riset interdisipliner, repositori publik terverifikasi, dan sertifikat kelayakan
            ilmiah.
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => openModal('profile', currentUser)}
        >
          <span>Edit Profil Akademik &rarr;</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ marginBottom: '24px', padding: '28px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            className="user-avatar"
            style={{
              width: '64px',
              height: '64px',
              fontSize: '24px',
              backgroundColor: currentUser?.avatar_color || '#2878d7'
            }}
          >
            {currentUser?.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)' }}>
                {currentUser?.name}
              </h3>
              <span className="badge badge-teal">Terverifikasi Kampus</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>
              {currentUser?.study_program} · {currentUser?.identifier}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {currentUser?.faculty} — {currentUser?.university}
            </div>
            {currentUser?.bio && (
              <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginTop: '8px', maxWidth: '680px' }}>
                "{currentUser.bio}"
              </p>
            )}
            {currentUser?.academic_links && (
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                🔗 {currentUser.academic_links}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEAM Competency Breakdown */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
          Profil Radar Kompetensi 5 Pilar STEAM
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
          Dihitung secara algoritmik dari partisipasi proyek, checkpoint teruji, dan penilaian rubrik pembimbing.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#1e40af' }}>🔬 Science (Sains & Eksplorasi Hipotesis)</span>
              <span>94 / 100</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '94%', background: '#2563eb' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#0f766e' }}>💻 Technology (Teknologi & Algoritma Komputasi)</span>
              <span>89 / 100</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '89%', background: '#0d9488' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#c2410c' }}>⚙️ Engineering (Rekayasa Alat & Instrumentasi)</span>
              <span>86 / 100</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '86%', background: '#ea580c' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#be123c' }}>🎨 Art (Estetika, Ergonomi & Desain Visual)</span>
              <span>80 / 100</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '80%', background: '#e11d48' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#6d28d9' }}>📐 Mathematics (Analisis Matematika & Ketelitian Statistik)</span>
              <span>92 / 100</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '92%', background: '#7c3aed' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed & Verified Research Showcase */}
      <div className="section-head">
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
            Karya Riset yang Telah Selesai & Terverifikasi
          </h3>
        </div>
      </div>

      <div className="projects-grid">
        {completedProjects.map(proj => (
          <div key={proj.id} className="card" style={{ padding: '22px', borderTop: '4px solid #16a34a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="badge badge-teal">✓ Selesai 100%</span>
              <span className="badge badge-purple">{proj.final_grade || 'Nilai: A'}</span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
              {proj.name}
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginBottom: '14px' }}>
              {proj.desc}
            </p>
            {proj.final_note && (
              <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: '10px', fontSize: '11.5px', color: '#166534', marginBottom: '14px' }}>
                <strong>Review Dosen:</strong> "{proj.final_note}"
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Pembimbing: <strong>{proj.lecturer}</strong>
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => alert(`Paket Reproducibility Ilmiah ${proj.name} siap diunduh dalam format JSON.`)}
              >
                <Download size={12} />
                <span>Unduh Paket Riset</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
