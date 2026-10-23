import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserPlus, Sparkles, Search, Users, ArrowRight, Info } from 'lucide-react';

export const OpenRecruitmentHub: React.FC = () => {
  const { projects, openModal } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const recruitingProjects = projects.filter(
    p =>
      p.open_recruitment === 1 &&
      (filterQuery === '' ||
        p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        p.recruitment_roles.toLowerCase().includes(filterQuery.toLowerCase()) ||
        p.study.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Kolaborasi Lintas Program Studi</div>
          <h2 className="h1">Pusat Rekrutmen Riset (Open Recruitment)</h2>
          <p className="sub">
            Temukan tim riset ilmiah yang membutuhkan keahlian spesifik Anda — mulai dari pemrograman, instrumentasi
            perangkat keras, analisis data statistik, hingga perancangan visualisasi.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
          />
          <input
            type="text"
            placeholder="Cari posisi yang dicari (contoh: Data Analyst, IoT, Kimia, UI/UX, Biologi)..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%' }}
          />
        </div>
      </div>

      {/* Grid of Open Recruitment Projects */}
      <div className="projects-grid">
        {recruitingProjects.map(proj => (
          <div key={proj.id} className="project-card" style={{ borderTop: '4px solid var(--accent-teal)' }}>
            <div>
              <div className="project-card-top">
                <span className="badge badge-teal">Mencari Anggota Baru</span>
                <span className="badge badge-blue">{proj.study}</span>
              </div>

              <h3>{proj.name}</h3>
              <p>{proj.desc}</p>

              <div
                style={{
                  background: 'var(--accent-teal-light)',
                  border: '1px solid #99f6e4',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-teal)', marginBottom: '4px' }}>
                  PERAN YANG DIBUTUHKAN:
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--navy)' }}>
                  {proj.recruitment_roles || 'Terbuka untuk kolaborator multidisiplin'}
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginBottom: '12px' }}>
                👨‍🏫 Dosen Pembimbing: <strong>{proj.lecturer}</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--line)',
                paddingTop: '12px',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} />
                <span>{proj.members_count} anggota saat ini</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => openModal('projectDetail', proj)}
                  title="Lihat Abstrak & Rincian Riset"
                >
                  <Info size={13} />
                  <span>Info Riset</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal('apply', proj)}
                  title="Daftar & Ajukan Diri Bergabung"
                >
                  <UserPlus size={13} />
                  <span>Daftar Bergabung</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
