import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Filter, Users, ArrowRight, UserPlus, CheckCircle, AlertCircle, Link as LinkIcon, KeyRound, Sparkles, FolderGit2 } from 'lucide-react';

export const ProjectCatalog: React.FC = () => {
  const {
    projects,
    setSelectedProjectId,
    setCurrentPage,
    openModal,
    currentUser,
    projectCatalogTab,
    setProjectCatalogTab,
    isUserMemberOfProject,
    getUserProjectRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStudy, setFilterStudy] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const myProjects = projects.filter(p => isUserMemberOfProject(p.id));
  const baseProjects = projectCatalogTab === 'myProjects' ? myProjects : projects;

  const filteredProjects = baseProjects.filter(p => {
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
          <div className="eyebrow">
            {projectCatalogTab === 'myProjects'
              ? 'Ruang Kolaborasi Tim Aktif'
              : 'Repositori Riset Civitas Akademika'}
          </div>
          <h2 className="h1">
            {projectCatalogTab === 'myProjects'
              ? (currentUser?.role === 'lecturer' ? 'Daftar Proyek Riset Bimbingan Saya' : 'Daftar Proyek Riset Saya')
              : 'Katalog Proyek Riset Multidisiplin'}
          </h2>
          <p className="sub">
            {projectCatalogTab === 'myProjects'
              ? 'Kelola ruang kerja dan pantau perkembangan proyek riset di mana Anda terdaftar aktif sebagai anggota tim atau pembimbing.'
              : 'Eksplorasi seluruh riset berbasis 5 pilar STEAM di lingkungan kampus. Bergabunglah dengan tim yang sedang membuka rekrutmen atau jadikan referensi untuk inisiasi topik baru.'}
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
            placeholder={
              projectCatalogTab === 'myProjects'
                ? 'Cari di proyek saya (judul, topik, metodologi)...'
                : 'Cari judul proyek, kata kunci, metodologi, atau pembimbing...'
            }
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
        Menampilkan <strong>{filteredProjects.length}</strong> dari {baseProjects.length} proyek{' '}
        {projectCatalogTab === 'myProjects' ? 'yang Anda ikuti' : 'terdaftar'}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={36} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', color: 'var(--navy)', marginBottom: '6px' }}>
            {projectCatalogTab === 'myProjects'
              ? 'Anda belum memiliki proyek riset yang cocok'
              : 'Tidak ada proyek yang cocok'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
            {projectCatalogTab === 'myProjects'
              ? 'Silakan buat proyek baru atau jelajahi katalog riset kampus untuk bergabung dengan tim kolaborator.'
              : 'Coba sesuaikan kata kunci pencarian atau ubah filter program studi dan status.'}
          </p>
          {projectCatalogTab === 'myProjects' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setProjectCatalogTab('all')}
              style={{ margin: '0 auto' }}
            >
              <span>Jelajahi Semua Riset Kampus &rarr;</span>
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(proj => {
            const isMember = isUserMemberOfProject(proj.id);
            const userRole = getUserProjectRole(proj.id);

            return (
              <div
                key={proj.id}
                className="project-card"
                style={{
                  borderTop: isMember ? '4px solid var(--primary)' : undefined
                }}
              >
                <div>
                  <div className="project-card-top">
                    <span className="badge badge-blue">{proj.study}</span>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {isMember && (
                        <span className="badge badge-purple" title="Peran Anda dalam proyek ini">
                          ✓ {userRole || 'Anggota Tim'}
                        </span>
                      )}
                      {proj.open_recruitment === 1 && !isMember && (
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
                    {isMember ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                          setCurrentPage('workspace');
                        }}
                        title="Masuk ke ruang kerja kolaborasi tim Anda"
                      >
                        <span>Buka Ruang Kerja</span>
                        <ArrowRight size={13} />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openModal('projectDetail', proj)}
                          title="Lihat Abstrak & Rincian Riset Publik"
                        >
                          <span>Detail Riset</span>
                        </button>
                        {proj.open_recruitment === 1 ? (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openModal('apply', proj)}
                            title="Ajukan diri bergabung dalam tim riset ini"
                          >
                            <UserPlus size={13} />
                            <span>Ajukan</span>
                          </button>
                        ) : (
                          <span
                            className="badge badge-gray"
                            style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', display: 'inline-flex', alignItems: 'center' }}
                            title="Tim telah terisi penuh"
                          >
                            🔒 Tim Penuh
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
