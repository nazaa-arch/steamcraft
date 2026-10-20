import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Filter, Users, ArrowRight, UserPlus, CheckCircle, AlertCircle, Link as LinkIcon, KeyRound } from 'lucide-react';

export const ProjectCatalog: React.FC = () => {
  const { projects, setSelectedProjectId, setCurrentPage, openModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStudy, setFilterStudy] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(p => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.study.toLowerCase().includes(q) ||
      p.tools.toLowerCase().includes(q) ||
      p.lecturer.toLowerCase().includes(q);

    // Study program filter
    const matchesStudy = filterStudy === 'all' || p.study.toLowerCase() === filterStudy.toLowerCase();

    // Status filter
    let matchesStatus = true;
    if (filterStatus === 'active') matchesStatus = p.status === 'Aktif' || p.status === 'Review diajukan';
    else if (filterStatus === 'completed') matchesStatus = p.status === 'Selesai';
    else if (filterStatus === 'recruiting') matchesStatus = p.open_recruitment === 1;
    else if (filterStatus === 'blocker') matchesStatus = p.blocker === 1;

    return matchesSearch && matchesStudy && matchesStatus;
  });

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Repositori Riset Civitas Akademika</div>
          <h2 className="h1">Katalog Proyek Riset Multidisiplin</h2>
          <p className="sub">
            Eksplorasi seluruh riset berbasis 5 pilar STEAM di lingkungan kampus. Bergabunglah dengan tim yang sedang
            membuka rekrutmen atau jadikan referensi untuk inisiasi topik baru.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => openModal('joinProject')}>
            <KeyRound size={15} />
            <span>Gabung via Kode / Link</span>
          </button>
          <button className="btn btn-primary" onClick={() => openModal('newProject')}>
            <Plus size={15} />
            <span>Buat Proyek Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
          />
          <input
            id="searchProjects"
            type="text"
            placeholder="Cari judul proyek, kata kunci, metodologi, atau alat riset..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            id="filterStudy"
            value={filterStudy}
            onChange={e => setFilterStudy(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">Semua Program Studi</option>
            <option value="Sains Data">Sains Data</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Biologi">Biologi</option>
            <option value="Pendidikan Biologi">Pendidikan Biologi</option>
            <option value="Kimia">Kimia</option>
            <option value="Pendidikan Kimia">Pendidikan Kimia</option>
            <option value="Fisika">Fisika</option>
            <option value="Pendidikan Fisika">Pendidikan Fisika</option>
            <option value="Matematika">Matematika</option>
            <option value="Pendidikan Matematika">Pendidikan Matematika</option>
            <option value="Sains Aktuaria">Sains Aktuaria</option>
            <option value="Bioteknologi">Bioteknologi</option>
            <option value="Teknik Biomedis & Komputer">Teknik Biomedis & Komputer</option>
          </select>

          <select
            id="filterStatus"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">Semua Status</option>
            <option value="active">Sedang Berjalan (Aktif)</option>
            <option value="recruiting">Membuka Rekrutmen Anggota</option>
            <option value="completed">Telah Selesai & Terverifikasi</option>
            <option value="blocker">Memiliki Kendala (Blocker)</option>
          </select>
        </div>
      </div>

      {/* Projects Count */}
      <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--muted)' }}>
        Menampilkan <strong>{filteredProjects.length}</strong> dari {projects.length} proyek penelitian
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={36} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', color: 'var(--navy)', marginBottom: '6px' }}>Tidak ada proyek yang cocok</h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Coba sesuaikan kata kunci pencarian atau ubah filter program studi dan status.
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(proj => (
            <div key={proj.id} className="project-card">
              <div>
                <div className="project-card-top">
                  <span className="badge badge-blue">{proj.study}</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {proj.open_recruitment === 1 && (
                      <span className="badge badge-teal" title="Membuka rekrutmen kolaborator">
                        Open Rec
                      </span>
                    )}
                    <span
                      className={`badge ${
                        proj.blocker
                          ? 'badge-rose'
                          : proj.progress === 100
                          ? 'badge-teal'
                          : proj.status === 'Review diajukan'
                          ? 'badge-purple'
                          : 'badge-orange'
                      }`}
                    >
                      {proj.blocker ? '⚠️ Blocker' : proj.status}
                    </span>
                  </div>
                </div>

                <h3>{proj.name}</h3>
                <p>{proj.desc}</p>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                    {proj.steam}
                  </span>
                  {proj.evaluation_recorded === 1 && (
                    <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                      ✓ Teruji ({proj.final_grade?.split(' ')[0] || 'A'})
                    </span>
                  )}
                </div>

                <div className="progress-bar-wrap">
                  <div className="progress-label-row">
                    <span>Kemajuan Checkpoint Ilmiah</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginBottom: '6px' }}>
                  🎯 <strong>Fokus:</strong> {proj.goal.slice(0, 90)}...
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '14px' }}>
                  👨‍🏫 Pembimbing: <strong>{proj.lecturer}</strong>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '12px',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} />
                  <span>{proj.members_count} Peneliti</span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {proj.open_recruitment === 1 && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openModal('apply', proj)}
                      title="Ajukan diri bergabung dalam tim riset ini"
                    >
                      <UserPlus size={12} />
                      <span>Ajukan</span>
                    </button>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setCurrentPage('workspace');
                    }}
                  >
                    <span>Ruang Kerja</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
