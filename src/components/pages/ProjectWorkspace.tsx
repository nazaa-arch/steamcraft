import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  FileText,
  GitBranch,
  Users,
  Award,
  Bot,
  Plus,
  Send,
  ExternalLink,
  Download,
  Check,
  X,
  FileCode,
  Tag,
  Paperclip
} from 'lucide-react';

export const ProjectWorkspace: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    checkpoints,
    toggleCheckpoint,
    addCheckpoint,
    journals,
    addJournal,
    versions,
    addVersion,
    members,
    applications,
    updateApplicationStatus,
    toggleBlocker,
    rubrics,
    currentUser,
    openModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'checkpoints' | 'journals' | 'versions' | 'team' | 'evaluation'>('checkpoints');

  // Form states
  const [newCpTitle, setNewCpTitle] = useState('');
  const [newCpDesc, setNewCpDesc] = useState('');
  const [showAddCp, setShowAddCp] = useState(false);

  const [journalTag, setJournalTag] = useState('Eksperimen');
  const [journalContent, setJournalContent] = useState('');
  const [journalFileName, setJournalFileName] = useState('');

  const [versionNote, setVersionNote] = useState('');
  const [versionUrl, setVersionUrl] = useState('');
  const [versionFileName, setVersionFileName] = useState('');
  const [showAddVer, setShowAddVer] = useState(false);

  const [blockerModalOpen, setBlockerModalOpen] = useState(false);
  const [blockerInputReason, setBlockerInputReason] = useState('');

  // AI chat states
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya asisten riset STEAM-Craft. Saya dapat membantu validasi metodologi ilmiah, saran eksperimen laboratorium, formulasi aktuaria, atau checklist reproduktibilitas penelitian Anda. Apa yang ingin Anda diskusikan?'
    }
  ]);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  if (!currentProject) return null;

  const projectCheckpoints = checkpoints.filter(c => c.project_id === currentProject.id);
  const projectJournals = journals.filter(j => j.project_id === currentProject.id);
  const projectVersions = versions.filter(v => v.project_id === currentProject.id);
  const projectMembers = members.filter(m => m.project_id === currentProject.id);
  const projectApplications = applications.filter(a => a.project_id === currentProject.id);
  const projectRubric = rubrics.find(r => r.project_id === currentProject.id);

  // Checkpoint calculation
  const completedCount = projectCheckpoints.filter(c => c.is_completed === 1).length;

  // Handle AI query
  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery.trim();
    setAiChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setAiQuery('');

    // Heuristic response based on STEAM project context
    setTimeout(() => {
      let reply = `Terkait pertanyaan "${userText}" pada topik "${currentProject.name}": `;
      if (userText.toLowerCase().includes('data') || userText.toLowerCase().includes('model')) {
        reply += `Pastikan Anda membagi dataset menjadi training (70%), validation (15%), dan testing (15%). Jangan lupa melakukan uji normalitas Kolmogorov-Smirnov atau evaluasi metrik RMSE/F1-Score agar reproduktibilitas hasil terjamin.`;
      } else if (userText.toLowerCase().includes('blocker') || userText.toLowerCase().includes('kendala')) {
        reply += `Untuk kendala metodologis saat ini, rekomendasinya adalah mengajukan sesi klinik riset melalui menu "Jadwal & Bimbingan" kepada dosen pembimbing ${currentProject.lecturer}.`;
      } else if (userText.toLowerCase().includes('rubrik') || userText.toLowerCase().includes('nilai')) {
        reply += `Bobot penilaian STEAM-Craft terdiri dari 4 pilar seimbang (masing-masing 25%): Kelengkapan Tahapan, Bukti Empiris & Jurnal, Kontribusi Multidisiplin Tim, dan Reproduktibilitas Artefak.`;
      } else {
        reply += `Langkah berikutnya yang disarankan: catat setiap anomali pengamatan ke dalam Jurnal Riset, commit kode ke repositori ${currentProject.repo_url || 'GitHub'}, dan simpan checkpoint ke-${completedCount + 1}.`;
      }
      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCpTitle.trim()) return;
    addCheckpoint(currentProject.id, newCpTitle.trim(), newCpDesc.trim() || 'Tahapan riset lanjutan');
    setNewCpTitle('');
    setNewCpDesc('');
    setShowAddCp(false);
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;
    addJournal(currentProject.id, journalTag, journalContent.trim(), journalFileName.trim() || undefined);
    setJournalContent('');
    setJournalFileName('');
  };

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionNote.trim()) return;
    addVersion(currentProject.id, versionNote.trim(), versionUrl.trim() || currentProject.repo_url, versionFileName.trim() || undefined);
    setVersionNote('');
    setVersionUrl('');
    setVersionFileName('');
    setShowAddVer(false);
  };

  const handleBlockerSubmit = () => {
    toggleBlocker(currentProject.id, blockerInputReason || 'Kendala metodologi atau ketersediaan bahan eksperimen');
    setBlockerModalOpen(false);
    setBlockerInputReason('');
  };

  return (
    <section className="page active">
      {/* Workspace Header Card */}
      <div className="workspace-header">
        <div className="ws-top">
          <div style={{ flex: 1 }}>
            {/* Project Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="eyebrow" style={{ margin: 0 }}>
                Ruang Kerja Riset:
              </span>
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(Number(e.target.value))}
                style={{
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  width: 'auto'
                }}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.name} ({p.study})
                  </option>
                ))}
              </select>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.2 }}>
              {currentProject.name}
            </h2>

            <p style={{ fontSize: '13.5px', color: 'var(--ink-secondary)', maxWidth: '750px', marginBottom: '14px' }}>
              {currentProject.desc}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="badge badge-blue">{currentProject.study}</span>
              <span className="badge badge-purple">{currentProject.steam}</span>
              <span className={`badge ${currentProject.blocker ? 'badge-rose' : 'badge-teal'}`}>
                {currentProject.blocker ? '⚠️ Memerlukan Bimbingan (Blocker)' : currentProject.status}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '6px' }}>
                👨‍🏫 Pembimbing: <strong>{currentProject.lecturer}</strong>
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="ws-actions">
            {currentProject.repo_url && (
              <a
                href={currentProject.repo_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
                title="Buka Repositori Kode Ilmiah"
              >
                <GitBranch size={13} />
                <span>Repositori</span>
                <ExternalLink size={11} />
              </a>
            )}

            <button
              className={`btn ${currentProject.blocker ? 'btn-success' : 'btn-ghost'} btn-sm`}
              onClick={() => {
                if (currentProject.blocker) {
                  toggleBlocker(currentProject.id, '');
                } else {
                  setBlockerModalOpen(true);
                }
              }}
            >
              <AlertTriangle size={13} />
              <span>{currentProject.blocker ? 'Selesaikan Kendala' : 'Laporkan Kendala'}</span>
            </button>
          </div>
        </div>

        {/* Blocker alert banner if present */}
        {currentProject.blocker === 1 && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertTriangle size={20} style={{ color: '#e11d48', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '13px', color: '#9f1239' }}>Kendala Metodologis (Blocker Aktif):</strong>
                <p style={{ fontSize: '12.5px', color: '#881337', margin: '2px 0 0 0' }}>
                  {currentProject.blocker_reason || 'Memerlukan review dan klinik pembimbing riset.'}
                </p>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openModal('consultation', { projectId: currentProject.id, lecturer: currentProject.lecturer })}
              style={{ fontSize: '11.5px', background: 'white' }}
            >
              <span>Jadwalkan Klinik Dosen &rarr;</span>
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div style={{ marginTop: '18px' }}>
          <div className="progress-label-row">
            <span>
              Kemajuan Riset Ilmiah ({completedCount} dari {projectCheckpoints.length} checkpoint)
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{currentProject.progress}% Selesai</span>
          </div>
          <div className="progress-track" style={{ height: '10px' }}>
            <div className="progress-fill" style={{ width: `${currentProject.progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="inspector-subtabs" style={{ marginBottom: '20px' }}>
        <button
          className={`inspector-subtab-btn ${activeTab === 'checkpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('checkpoints')}
        >
          Tahapan & Checkpoint ({completedCount}/{projectCheckpoints.length})
        </button>
        <button
          className={`inspector-subtab-btn ${activeTab === 'journals' ? 'active' : ''}`}
          onClick={() => setActiveTab('journals')}
        >
          Jurnal & Logbook ({projectJournals.length})
        </button>
        <button
          className={`inspector-subtab-btn ${activeTab === 'versions' ? 'active' : ''}`}
          onClick={() => setActiveTab('versions')}
        >
          Versi & Artefak ({projectVersions.length})
        </button>
        <button
          className={`inspector-subtab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Kolaborator Tim ({projectMembers.length})
        </button>
        <button
          className={`inspector-subtab-btn ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
        >
          Evaluasi STEAM & AI Asisten
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="workspace-layout">
        {/* Left Column: Active Tab Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TAB 1: CHECKPOINTS */}
          {activeTab === 'checkpoints' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                    Alur Kerja Checkpoint Ilmiah
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Centang tahapan yang telah selesai diverifikasi oleh tim atau pembimbing.
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddCp(!showAddCp)}
                >
                  <Plus size={13} />
                  <span>Tambah Checkpoint</span>
                </button>
              </div>

              {/* Add Checkpoint Form */}
              {showAddCp && (
                <form
                  onSubmit={handleCreateCheckpoint}
                  style={{
                    background: 'var(--surface-alt)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    marginBottom: '16px'
                  }}
                >
                  <div className="auth-field">
                    <label>Judul Tahapan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kalibrasi Sensor Suhu Ruang Bersih"
                      value={newCpTitle}
                      onChange={e => setNewCpTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="auth-field">
                    <label>Deskripsi & Syarat Verifikasi</label>
                    <input
                      type="text"
                      placeholder="Tentukan dokumen atau luaran bukti empiris yang wajib dipenuhi..."
                      value={newCpDesc}
                      onChange={e => setNewCpDesc(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddCp(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Simpan Checkpoint
                    </button>
                  </div>
                </form>
              )}

              {/* Checkpoints List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {projectCheckpoints.map((cp, idx) => (
                  <div key={cp.id} className={`checkpoint-item ${cp.is_completed ? 'done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={cp.is_completed === 1}
                      onChange={() => toggleCheckpoint(cp.id)}
                      id={`cp-${cp.id}`}
                    />
                    <div className="checkpoint-info">
                      <h4>
                        <span>
                          {idx + 1}. {cp.title}
                        </span>
                        <span className={`checkpoint-status-pill ${cp.is_completed ? 'done' : 'pending'}`}>
                          {cp.is_completed ? '✓ Selesai' : 'Belum Selesai'}
                        </span>
                      </h4>
                      <p>{cp.description}</p>
                      <div className="checkpoint-meta-row">
                        <span style={{ color: 'var(--muted)' }}>
                          Status: <strong>{cp.is_completed ? 'Terverifikasi' : 'Dalam Pengerjaan'}</strong>
                        </span>
                        {cp.completed_by && (
                          <span style={{ color: 'var(--primary)' }}>
                            Diselesaikan oleh: <strong>{cp.completed_by}</strong>
                          </span>
                        )}
                        {cp.completed_at && (
                          <span style={{ color: 'var(--muted)' }}>
                            Waktu: {new Date(cp.completed_at).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: JOURNALS */}
          {activeTab === 'journals' && (
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                Jurnal & Logbook Laboratorium
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                Catatan terperinci observasi harian, parameter alat, anomali, dan keputusan metodologi.
              </p>

              {/* Add Journal Form */}
              <form
                onSubmit={handleCreateJournal}
                style={{
                  background: 'var(--surface-alt)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="auth-field" style={{ margin: 0 }}>
                    <label>Kategori Catatan</label>
                    <select value={journalTag} onChange={e => setJournalTag(e.target.value)}>
                      <option value="Metodologi">Metodologi & Hipotesis</option>
                      <option value="Eksperimen">Eksperimen Lab / Lapangan</option>
                      <option value="Data">Pembersihan & Olah Data</option>
                      <option value="Observasi">Observasi & Temuan Awal</option>
                      <option value="Blocker">Kendala & Diskusi Solusi</option>
                      <option value="Validasi">Validasi & Peer Review</option>
                    </select>
                  </div>
                  <div className="auth-field" style={{ margin: 0 }}>
                    <label>Lampiran File (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: telemetri_sensor_bme.csv"
                      value={journalFileName}
                      onChange={e => setJournalFileName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Isi Catatan Jurnal Ilmiah</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan temuan kuantitatif, deviasi pengukuran, nomor seri reagen/alat ukur..."
                    value={journalContent}
                    onChange={e => setJournalContent(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    <Send size={13} />
                    <span>Publikasikan Catatan Jurnal</span>
                  </button>
                </div>
              </form>

              {/* Journal Entries List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {projectJournals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                    Belum ada entri logbook untuk proyek ini.
                  </div>
                ) : (
                  projectJournals.map(j => (
                    <div key={j.id} className="journal-item">
                      <div className="journal-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>{j.author_name}</strong>
                          <span
                            className={`badge badge-${
                              j.tag === 'Metodologi' ? 'blue' : j.tag === 'Eksperimen' ? 'teal' : j.tag === 'Blocker' ? 'rose' : 'purple'
                            }`}
                            style={{ fontSize: '10px' }}
                          >
                            {j.tag}
                          </span>
                        </div>
                        <small>{new Date(j.created_at).toLocaleString('id-ID')}</small>
                      </div>
                      <div className="journal-text">{j.content}</div>
                      {j.file_name && (
                        <div>
                          <a
                            href={`/uploads/${j.file_name}`}
                            className="attachment-pill"
                            download
                            onClick={e => {
                              // If running in browser simulation, show preview
                              e.preventDefault();
                              alert(`Mengunduh artefak data riset: ${j.file_name}`);
                            }}
                          >
                            <Paperclip size={12} />
                            <span>{j.file_name}</span>
                            <Download size={11} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: VERSIONS & REPRODUCIBILITY */}
          {activeTab === 'versions' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                    Versi & Artefak Reproducibility
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Jejak build rilis mandiri, skrip simulasi, data primer, dan metadata penelitian.
                  </p>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddVer(!showAddVer)}
                >
                  <Plus size={13} />
                  <span>Daftarkan Build / Rilis</span>
                </button>
              </div>

              {showAddVer && (
                <form
                  onSubmit={handleCreateVersion}
                  style={{
                    background: 'var(--surface-alt)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--line)',
                    marginBottom: '16px'
                  }}
                >
                  <div className="auth-field">
                    <label>Catatan Rilis / Iterasi Pengembangan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Implementasi kalibrasi sensor dan pipeline pra-pemrosesan data"
                      value={versionNote}
                      onChange={e => setVersionNote(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div className="auth-field" style={{ margin: 0 }}>
                      <label>URL Artefak / Commit Repositori</label>
                      <input
                        type="url"
                        placeholder="https://github.com/.../tree/vX.0"
                        value={versionUrl}
                        onChange={e => setVersionUrl(e.target.value)}
                      />
                    </div>
                    <div className="auth-field" style={{ margin: 0 }}>
                      <label>Nama File Artefak / Dataset</label>
                      <input
                        type="text"
                        placeholder="Contoh: dataset_hasil_pengujian.csv"
                        value={versionFileName}
                        onChange={e => setVersionFileName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddVer(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Daftarkan Versi
                    </button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projectVersions.map(v => (
                  <div
                    key={v.id}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-blue" style={{ fontWeight: 800 }}>
                          v{v.version_number}.0
                        </span>
                        <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>{v.note}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        Waktu Pendaftaran: {new Date(v.created_at).toLocaleString('id-ID')}
                      </div>
                      {v.file_name && (
                        <div style={{ marginTop: '4px' }}>
                          <span className="attachment-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>
                            <FileCode size={11} /> {v.file_name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      {v.artifact_url ? (
                        <a
                          href={v.artifact_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          <ExternalLink size={12} />
                          <span>Inspeksi Artefak</span>
                        </a>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => alert(`Artefak v${v.version_number}.0 telah tersimpan dalam repositori internal.`)}
                        >
                          <Check size={12} />
                          <span>Terverifikasi</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM & COLLABORATION */}
          {activeTab === 'team' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                    Struktur Tim Peneliti Multidisiplin
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Kolaborasi civitas akademika lintas disiplin ilmu STEAM.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>
                    Open Recruitment:
                  </span>
                  <span className={`badge ${currentProject.open_recruitment ? 'badge-teal' : 'badge-gray'}`}>
                    {currentProject.open_recruitment ? 'Sedang Dibuka' : 'Ditutup'}
                  </span>
                </div>
              </div>

              {/* Roster Grid */}
              <div className="team-roster-grid">
                {projectMembers.map(m => (
                  <div key={m.id} className={`member-card ${m.is_lead ? 'is-lead' : ''}`}>
                    <div
                      className="user-avatar"
                      style={{ backgroundColor: m.avatar_color || '#2878d7', width: '38px', height: '38px' }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.name}
                        </strong>
                        {m.is_lead === 1 && (
                          <span className="badge badge-blue" style={{ fontSize: '9px', padding: '1px 5px' }}>
                            Lead
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
                        {m.role}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                        {m.study_program} · {m.identifier}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recruitment Requirements */}
              {currentProject.open_recruitment === 1 && (
                <div style={{ marginTop: '24px', background: 'var(--surface-alt)', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                    Peran Kolaborator yang Dibutuhkan:
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginBottom: '10px' }}>
                    {currentProject.recruitment_roles || 'Terbuka untuk mahasiswa berminat dari prodi terkait.'}
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal('apply', currentProject)}
                  >
                    <span>Ajukan Diri Bergabung &rarr;</span>
                  </button>
                </div>
              )}

              {/* Pending Applicants List */}
              {projectApplications.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>
                    Permohonan Bergabung Mahasiswa ({projectApplications.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projectApplications.map(app => (
                      <div
                        key={app.id}
                        style={{
                          border: '1px solid var(--line)',
                          borderRadius: '12px',
                          padding: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                          background: app.status === 'Menunggu' ? '#f8fafc' : app.status === 'Diterima' ? '#f0fdf4' : '#fff1f2'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>{app.applicant_name}</strong>
                            <span className="badge badge-purple" style={{ fontSize: '10px' }}>{app.applicant_study}</span>
                            <span className="badge badge-blue" style={{ fontSize: '10px' }}>Peran: {app.applicant_role}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', margin: '4px 0 0 0' }}>
                            "{app.message}"
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {app.status === 'Menunggu' ? (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateApplicationStatus(app.id, 'Diterima')}
                              >
                                <Check size={13} />
                                <span>Terima</span>
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateApplicationStatus(app.id, 'Diterima')}
                              >
                                <X size={13} />
                                <span>Tolak</span>
                              </button>
                            </>
                          ) : (
                            <span className={`badge ${app.status === 'Diterima' ? 'badge-teal' : 'badge-rose'}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EVALUATION & AI ASSISTANT */}
          {activeTab === 'evaluation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* STEAM 5-Pillar Score Cards */}
              <div className="card">
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                  Distribusi Skor 5 Pilar STEAM
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
                  Indikator kedalaman eksplorasi interdisipliner proyek riset ini.
                </p>

                {currentProject.steam_scores ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8' }}>SCIENCE</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#1e40af' }}>{currentProject.steam_scores.S}</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Eksplorasi Hipotesis</div>
                    </div>
                    <div style={{ padding: '12px', background: '#f0fdfa', borderRadius: '12px', border: '1px solid #99f6e4' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e' }}>TECHNOLOGY</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#115e59' }}>{currentProject.steam_scores.T}</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Komputasi & Alat</div>
                    </div>
                    <div style={{ padding: '12px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#c2410c' }}>ENGINEERING</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#9a3412' }}>{currentProject.steam_scores.E}</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Rancang Bangun</div>
                    </div>
                    <div style={{ padding: '12px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#be123c' }}>ART</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#9f1239' }}>{currentProject.steam_scores.A}</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Desain & Estetika</div>
                    </div>
                    <div style={{ padding: '12px', background: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#6d28d9' }}>MATHEMATICS</div>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#5b21b6' }}>{currentProject.steam_scores.M}</div>
                      <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Model & Statistik</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--muted)' }}>
                    Skor STEAM dalam proses kalkulasi.
                  </div>
                )}
              </div>

              {/* Rubric Evaluation Result */}
              {projectRubric && (
                <div className="card" style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={20} style={{ color: '#16a34a' }} />
                      <strong style={{ fontSize: '15px', color: '#14532d' }}>
                        Penilaian Rubrik Ilmiah Terverifikasi ({projectRubric.evaluator_name})
                      </strong>
                    </div>
                    <span className="badge badge-teal" style={{ fontSize: '13px', fontWeight: 900 }}>
                      Skor Total: {projectRubric.total_score.toFixed(1)} ({currentProject.final_grade || 'A'})
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Tahapan (25%)</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                        {projectRubric.score_completeness}
                      </div>
                    </div>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Bukti Empiris (25%)</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                        {projectRubric.score_evidence}
                      </div>
                    </div>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Kontribusi Tim (25%)</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                        {projectRubric.score_contribution}
                      </div>
                    </div>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Reproducibility (25%)</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                        {projectRubric.score_reproducibility}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#166534', margin: 0 }}>
                    <strong>Catatan Reviewer:</strong> "{projectRubric.feedback}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: AI Research Assistant & Quick Inspector */}
        <div>
          {/* AI Research Assistant Panel */}
          <div className="ai-copilot-card">
            <div className="ai-copilot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={20} style={{ color: 'var(--primary)' }} />
                <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Asisten Ilmiah STEAM</strong>
              </div>
              <span className="ai-badge">AI Powered</span>
            </div>

            <div
              style={{
                maxHeight: '280px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '12px'
              }}
            >
              {aiChatHistory.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--ink)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #dbeafe',
                    maxWidth: '90%'
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleAiSend} className="ai-chat-input-row">
              <input
                type="text"
                placeholder="Tanyakan saran metodologi, checklist, atau rumus..."
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 14px' }}>
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Quick Project Summary Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
              Spesifikasi Proyek Riset
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--muted)' }}>Fokus Masalah:</span>
                <p style={{ margin: '2px 0 0 0', color: 'var(--ink)' }}>{currentProject.goal}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--muted)' }}>Alat / Perangkat Lunak:</span>
                <p style={{ margin: '2px 0 0 0', color: 'var(--ink)', fontWeight: 600 }}>{currentProject.tools}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--muted)' }}>Template Riset:</span>
                <span className="badge badge-teal" style={{ marginLeft: '6px' }}>
                  {currentProject.template.toUpperCase()}
                </span>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--muted)' }}>Dosen Pembimbing:</span>
                <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: 'var(--navy)' }}>
                  {currentProject.lecturer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Blocker Modal */}
      {blockerModalOpen && (
        <div className="modal-overlay active" onClick={() => setBlockerModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBlockerModalOpen(false)}>
              &times;
            </button>
            <div className="eyebrow" style={{ color: '#e11d48' }}>
              Klinik Riset Pembimbing
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
              Laporkan Kendala Metodologis (Blocker)
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
              Tandai kesulitan eksperimen, anomali data, atau kendala fasilitas agar dosen pembimbing dapat segera
              memberikan arahan intervensi.
            </p>

            <div className="auth-field">
              <label>Deskripsi Kendala yang Dihadapi</label>
              <textarea
                rows={4}
                placeholder="Jelaskan secara spesifik: variabel apa yang bermasalah, galat alat yang terjadi, atau keputusan statistik yang meragukan..."
                value={blockerInputReason}
                onChange={e => setBlockerInputReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button className="btn btn-ghost" onClick={() => setBlockerModalOpen(false)}>
                Batal
              </button>
              <button className="btn btn-danger" onClick={handleBlockerSubmit}>
                Kirim Laporan Kendala
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
