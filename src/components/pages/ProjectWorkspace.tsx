import React, { useState, useRef } from 'react';
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
  Paperclip,
  Star,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  Layers,
  UserCheck,
  BookOpen,
  Sparkles,
  UserPlus,
  Link as LinkIcon,
  Target,
  Database,
  GraduationCap,
  Info,
  Clock,
  Lightbulb,
  Trophy,
  Leaf
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
    peerFeedbacks,
    addPeerFeedback,
    currentUser,
    openModal,
    showToast,
    setCurrentPage,
    setProjectCatalogTab,
    isUserMemberOfProject
  } = useApp();

  const myProjects = projects.filter(p => isUserMemberOfProject(p.id));

  const [activeTab, setActiveTab] = useState<'checkpoints' | 'journals' | 'versions' | 'team' | 'peerFeedback' | 'evaluation'>('checkpoints');
  const [peerFilterReviewee, setPeerFilterReviewee] = useState<string>('all');
  const [peerFilterBadge, setPeerFilterBadge] = useState<string>('all');
  const [peerSearchKeyword, setPeerSearchKeyword] = useState<string>('');
  const [showInlineFeedback, setShowInlineFeedback] = useState<boolean>(false);

  // Inline feedback form state
  const [inlineRevieweeName, setInlineRevieweeName] = useState<string>('');
  const [inlineTechRating, setInlineTechRating] = useState<number>(5);
  const [inlineCollabRating, setInlineCollabRating] = useState<number>(5);
  const [inlineRigorRating, setInlineRigorRating] = useState<number>(5);
  const [inlineReliabilityRating, setInlineReliabilityRating] = useState<number>(5);
  const [inlineStrengths, setInlineStrengths] = useState<string>('');
  const [inlineImprovements, setInlineImprovements] = useState<string>('');
  const [inlineBadges, setInlineBadges] = useState<string[]>(['Teliti & Presisi', 'Kolaborator Hebat']);

  // Form states
  const [newCpTitle, setNewCpTitle] = useState('');
  const [newCpDesc, setNewCpDesc] = useState('');
  const [showAddCp, setShowAddCp] = useState(false);

  const [journalTag, setJournalTag] = useState('Eksperimen');
  const [journalContent, setJournalContent] = useState('');
  const [journalFileName, setJournalFileName] = useState('');
  const journalFileInputRef = useRef<HTMLInputElement>(null);

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
  const isMember = isUserMemberOfProject(currentProject.id);
  const currentMemberRecord = projectMembers.find(
    m =>
      (m.user_id && m.user_id === currentUser?.id) ||
      (m.identifier && currentUser?.identifier && m.identifier === currentUser.identifier) ||
      (m.name && currentUser?.name && m.name.toLowerCase().includes(currentUser.name.toLowerCase())) ||
      (currentUser?.id === 1 && (m.user_id === 1 || m.name.toLowerCase().includes('budi')))
  );
  const isLead = Boolean(currentMemberRecord?.is_lead === 1);
  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  const projectApplications = applications.filter(a => a.project_id === currentProject.id);
  const projectRubric = rubrics.find(r => r.project_id === currentProject.id);
  const projectPeerFeedbacks = peerFeedbacks.filter(f => f.project_id === currentProject.id);

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
      <div className="workspace-header workspace-header-enhanced">
        <div className="ws-top-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="ws-category-badge">
              <span className="ws-live-pulse"></span>
              Ruang Kerja Riset
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
              Proyek #{currentProject.id} dari {projects.length}
            </span>
          </div>

          {/* Dedicated Project Selector Button (Navigates to My Projects Tab) */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setProjectCatalogTab('myProjects');
              setCurrentPage('projects');
            }}
            title="Buka daftar Proyek Saya untuk berganti ruang kerja tim"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11.5px',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'white',
              border: '1.5px solid #cbd5e1',
              color: 'var(--navy)'
            }}
          >
            <Layers size={13} style={{ color: 'var(--primary)' }} />
            <span>Ganti Proyek ({myProjects.length} Proyek Saya) &rarr;</span>
          </button>
        </div>

        {/* Project Title & Description */}
        <div className="ws-title-row">
          <h2 className="ws-project-title">
            {currentProject.name}
          </h2>
          <p className="ws-project-desc">
            {currentProject.desc}
          </p>
        </div>

        {/* Metadata & Supervisor Row */}
        <div className="ws-meta-bar">
          <span className="badge badge-blue">{currentProject.study}</span>
          <span className="badge badge-purple">{currentProject.steam}</span>
          <span className={`badge ${currentProject.blocker ? 'badge-rose' : 'badge-teal'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {currentProject.blocker ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
            <span>{currentProject.blocker ? 'Memerlukan Bimbingan' : currentProject.status}</span>
          </span>
          <div className="ws-supervisor-chip">
            <UserCheck size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>Pembimbing: <strong>{currentProject.lecturer}</strong></span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="ws-actions-row">
          <button
            type="button"
            className="ws-btn-repo"
            onClick={() => setCurrentPage('radar')}
            title="Buka STEAM Radar Matrix untuk proyek ini"
            style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Target size={13} />
            <span>Radar STEAM</span>
          </button>

          <button
            type="button"
            className="ws-btn-repo"
            onClick={() => setCurrentPage('logbook')}
            title="Buka Logbook Riset Ilmiah & Ekspor PDF Standar PKM"
            style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <FileText size={13} />
            <span>Logbook Riset</span>
          </button>

          <button
            type="button"
            className="ws-btn-repo"
            onClick={() => setCurrentPage('dataRepo')}
            title="Buka Repository Data Empiris & Reproducibility Checker"
            style={{ background: '#faf5ff', borderColor: '#ddd6fe', color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Database size={13} />
            <span>Data Repo</span>
          </button>

          <button
            type="button"
            className="ws-btn-repo"
            onClick={() => openModal('inviteProject', currentProject)}
            title="Undang kolaborator baru lewat tautan atau kode unik"
            style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: 'var(--navy)' }}
          >
            <UserPlus size={13} />
            <span>Undang Kolaborator</span>
          </button>

          {currentProject.repo_url && (
            <a
              href={currentProject.repo_url}
              target="_blank"
              rel="noreferrer"
              className="ws-btn-repo"
              title="Buka Repositori Kode Ilmiah"
            >
              <GitBranch size={13} />
              <span>Repositori Riset</span>
              <ExternalLink size={11} />
            </a>
          )}

          <button
            type="button"
            className={currentProject.blocker ? 'ws-btn-blocker-active' : 'ws-btn-blocker'}
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

        {/* Blocker alert banner if present */}
        {currentProject.blocker === 1 && (
          <div
            style={{
              marginBottom: '16px',
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
        <div className="ws-progress-box">
          <div className="ws-progress-label">
            <span>
              Kemajuan Riset Ilmiah ({completedCount} dari {projectCheckpoints.length} checkpoint)
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
              {currentProject.progress}% Selesai
            </span>
          </div>
          <div className="ws-progress-track">
            <div className="ws-progress-fill" style={{ width: `${currentProject.progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Workspace Subtabs Navigation */}
      <div className="ws-subtabs-nav">
        <button
          className={`ws-subtab-pill ${activeTab === 'checkpoints' ? 'active' : ''}`}
          onClick={() => setActiveTab('checkpoints')}
        >
          <CheckCircle2 size={13} />
          <span>Tahapan ({completedCount}/{projectCheckpoints.length})</span>
        </button>
        <button
          className={`ws-subtab-pill ${activeTab === 'journals' ? 'active' : ''}`}
          onClick={() => setActiveTab('journals')}
        >
          <BookOpen size={13} />
          <span>Logbook ({projectJournals.length})</span>
        </button>
        <button
          className={`ws-subtab-pill ${activeTab === 'versions' ? 'active' : ''}`}
          onClick={() => setActiveTab('versions')}
        >
          <Layers size={13} />
          <span>Artefak ({projectVersions.length})</span>
        </button>
        <button
          className={`ws-subtab-pill ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={13} />
          <span>Tim ({projectMembers.length})</span>
        </button>
        <button
          className={`ws-subtab-pill ${activeTab === 'peerFeedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('peerFeedback')}
        >
          <Star size={13} />
          <span>Peer 360 ({projectPeerFeedbacks.length})</span>
        </button>
        <button
          className={`ws-subtab-pill ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
        >
          <Sparkles size={13} />
          <span>Evaluasi & AI</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="workspace-layout">
        {/* Left Column: Active Tab Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* TAB 1: CHECKPOINTS */}
          {activeTab === 'checkpoints' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                    Alur Kerja Checkpoint Ilmiah
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {isLecturerOrAdmin
                      ? 'Sebagai Dosen Pembimbing, Anda berwenang memvalidasi dan mengesahkan tahapan riset yang telah memenuhi syarat.'
                      : 'Tahapan riset wajib divalidasi oleh Dosen Pembimbing. Mahasiswa mencatat observasi dan kemajuan di Logbook.'}
                  </p>
                </div>
                {isLecturerOrAdmin && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAddCp(!showAddCp)}
                  >
                    <Plus size={13} />
                    <span>Tambah Checkpoint</span>
                  </button>
                )}
              </div>

              {/* Informative Workflow Guidance Banner */}
              <div
                style={{
                  background: isLecturerOrAdmin ? '#f0fdf4' : '#eff6ff',
                  border: `1px solid ${isLecturerOrAdmin ? '#bbf7d0' : '#bfdbfe'}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isLecturerOrAdmin ? '#dcfce7' : '#dbeafe', color: isLecturerOrAdmin ? '#15803d' : '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isLecturerOrAdmin ? <GraduationCap size={18} /> : <Info size={18} />}
                </div>
                <div style={{ color: isLecturerOrAdmin ? '#166534' : '#1e40af', lineHeight: 1.4 }}>
                  <strong>{isLecturerOrAdmin ? 'Otoritas Validasi Checkpoint (Dosen):' : 'Prosedur Validasi Checkpoint:'}</strong>{' '}
                  {isLecturerOrAdmin
                    ? 'Centang tahapan alur kerja di bawah ini untuk memvalidasi pencapaian ilmiah tim mahasiswa bimbingan Anda.'
                    : 'Validasi checkpoint ini merupakan wewenang Dosen Pembimbing. Silakan ajukan konsultasi/bimbingan setelah menyiapkan bukti empiris.'}
                </div>
              </div>

              {/* Add Checkpoint Form (Lecturer/Admin only) */}
              {isLecturerOrAdmin && showAddCp && (
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
                    {isLecturerOrAdmin ? (
                      <input
                        type="checkbox"
                        checked={cp.is_completed === 1}
                        onChange={() => toggleCheckpoint(cp.id)}
                        id={`cp-${cp.id}`}
                        title="Klik untuk memvalidasi / membatalkan verifikasi tahapan ini sebagai Dosen Pembimbing"
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <div
                        onClick={() => showToast('Validasi checkpoint ilmiah hanya dapat dilakukan oleh Dosen Pembimbing.')}
                        title="Hanya Dosen Pembimbing yang berhak memvalidasi tahapan ini"
                        style={{ cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}
                      >
                        <input
                          type="checkbox"
                          checked={cp.is_completed === 1}
                          disabled
                          style={{ cursor: 'not-allowed', opacity: cp.is_completed ? 1 : 0.6 }}
                        />
                      </div>
                    )}
                    <div className="checkpoint-info">
                      <h4>
                        <span>
                          {idx + 1}. {cp.title}
                        </span>
                        <span className={`checkpoint-status-pill ${cp.is_completed ? 'done' : 'pending'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {cp.is_completed ? (
                            <>
                              <CheckCircle2 size={11} />
                              <span>Divalidasi Dosen</span>
                            </>
                          ) : (
                            <>
                              <Clock size={11} />
                              <span>Menunggu Verifikasi Dosen</span>
                            </>
                          )}
                        </span>
                      </h4>
                      <p>{cp.description}</p>
                      <div className="checkpoint-meta-row">
                        <span style={{ color: 'var(--muted)' }}>
                          Status: <strong>{cp.is_completed ? 'Terverifikasi Dosen' : 'Dalam Pengerjaan Mahasiswa'}</strong>
                        </span>
                        {cp.completed_by && (
                          <span style={{ color: 'var(--primary)' }}>
                            Divalidasi oleh: <strong>{cp.completed_by}</strong>
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
                <div className="ws-form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                    <label>Lampiran Berkas (Opsional)</label>
                    <input
                      ref={journalFileInputRef}
                      type="file"
                      accept=".csv,.pdf,.png,.jpg,.jpeg,.xlsx,.docx,.zip,.ipynb,.txt"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setJournalFileName(file.name);
                          showToast(`Berkas "${file.name}" terlampir.`);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    {!journalFileName ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => journalFileInputRef.current?.click()}
                        style={{ width: '100%', height: '38px', justifyContent: 'center', fontSize: '12px' }}
                      >
                        <Paperclip size={13} />
                        <span>Unggah Berkas Lampiran</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#166534',
                          fontSize: '12px',
                          height: '38px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                          <FileText size={14} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{journalFileName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setJournalFileName('');
                            if (journalFileInputRef.current) journalFileInputRef.current.value = '';
                          }}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }}
                          title="Hapus berkas"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
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
                              showToast(`Mengunduh artefak data riset: ${j.file_name}`);
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
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal('registerBuild', { project: currentProject, nextVersion: projectVersions.length + 1 })}
                >
                  <Plus size={13} />
                  <span>Daftarkan Build / Rilis</span>
                </button>
              </div>

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
                          onClick={() => showToast(`Artefak v${v.version_number}.0 telah tersimpan dalam repositori internal.`)}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>
                      Open Recruitment:
                    </span>
                    <span className={`badge ${currentProject.open_recruitment ? 'badge-teal' : 'badge-gray'}`}>
                      {currentProject.open_recruitment ? 'Sedang Dibuka' : 'Ditutup'}
                    </span>
                  </div>
                  {isLead && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openModal('inviteProject', currentProject)}
                      style={{ fontSize: '11.5px', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      title="Undang kolaborator baru melalui tautan, kode, atau civitas terdaftar"
                    >
                      <UserPlus size={13} />
                      <span>+ Undang Tim</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Roster Grid */}
              <div className="team-roster-grid">
                {projectMembers.map(m => {
                  const mReviews = projectPeerFeedbacks.filter(f => f.reviewee_name === m.name);
                  const mAvg =
                    mReviews.length > 0
                      ? (mReviews.reduce((acc, cur) => acc + cur.overall_score, 0) / mReviews.length).toFixed(1)
                      : null;

                  return (
                    <div key={m.id} className={`member-card ${m.is_lead ? 'is-lead' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div
                          className="user-avatar"
                          style={{ backgroundColor: m.avatar_color || '#2878d7', width: '38px', height: '38px', flexShrink: 0 }}
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

                      {/* Peer Review Summary & Quick Action */}
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--line-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px'
                        }}
                      >
                        {mAvg ? (
                          <span
                            style={{
                              fontSize: '10.5px',
                              background: '#fef3c7',
                              color: '#92400e',
                              border: '1px solid #fde68a',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            <Star size={11} style={{ fill: '#d97706', color: '#d97706' }} />
                            <span>{mAvg} ({mReviews.length} ulasan)</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>Belum ada ulasan</span>
                        )}

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '10.5px', padding: '3px 8px' }}
                            onClick={() => {
                              setActiveTab('peerFeedback');
                              setPeerFilterReviewee(m.name);
                            }}
                            title="Lihat ulasan sejawat anggota ini"
                          >
                            Lihat
                          </button>
                          {m.name !== currentUser?.name && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '10.5px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              onClick={() => openModal('peerFeedback', { projectId: currentProject.id, revieweeName: m.name })}
                              title="Beri feedback sejawat untuk anggota ini"
                            >
                              <Star size={11} />
                              <span>Review</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recruitment Requirements */}
              {currentProject.open_recruitment === 1 && (
                <div style={{ marginTop: '24px', background: 'var(--surface-alt)', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: '1 1 280px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                        Peran Kolaborator yang Dibutuhkan:
                      </h4>
                      <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                        {currentProject.recruitment_roles || 'Terbuka untuk mahasiswa berminat dari prodi terkait.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {isMember ? (
                        <>
                          <span
                            className="badge badge-teal"
                            style={{ fontSize: '11px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            title="Status keanggotaan Anda di proyek riset ini"
                          >
                            <CheckCircle2 size={12} />
                            <span>{isLead ? 'Anda adalah Ketua Tim' : 'Anda Anggota Tim Aktif'}</span>
                          </span>
                          {isLead && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => openModal('inviteProject', currentProject)}
                              style={{ fontSize: '11.5px', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                              title="Undang mahasiswa secara langsung via tautan, kode, atau civitas"
                            >
                              <UserPlus size={13} />
                              <span>+ Undang Anggota</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openModal('apply', currentProject)}
                          title="Ajukan diri bergabung dalam tim riset ini"
                        >
                          <UserPlus size={13} />
                          <span>Ajukan Diri Bergabung &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>
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
                                onClick={() => updateApplicationStatus(app.id, 'Ditolak')}
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

          {/* TAB 5: PEER-TO-PEER FEEDBACK */}
          {activeTab === 'peerFeedback' && (() => {
            // Team metrics calculations
            const totalProjectFeedbacks = projectPeerFeedbacks.length;
            const avgTeamScore =
              totalProjectFeedbacks > 0
                ? Number(
                    (
                      projectPeerFeedbacks.reduce((acc, cur) => acc + cur.overall_score, 0) /
                      totalProjectFeedbacks
                    ).toFixed(2)
                  )
                : 0;

            const avgDimTech =
              totalProjectFeedbacks > 0
                ? Number(
                    (
                      projectPeerFeedbacks.reduce((acc, cur) => acc + cur.ratings.technical, 0) /
                      totalProjectFeedbacks
                    ).toFixed(2)
                  )
                : 0;

            const avgDimCollab =
              totalProjectFeedbacks > 0
                ? Number(
                    (
                      projectPeerFeedbacks.reduce((acc, cur) => acc + cur.ratings.collaboration, 0) /
                      totalProjectFeedbacks
                    ).toFixed(2)
                  )
                : 0;

            const avgDimRigor =
              totalProjectFeedbacks > 0
                ? Number(
                    (
                      projectPeerFeedbacks.reduce((acc, cur) => acc + cur.ratings.scientificRigor, 0) /
                      totalProjectFeedbacks
                    ).toFixed(2)
                  )
                : 0;

            const avgDimRel =
              totalProjectFeedbacks > 0
                ? Number(
                    (
                      projectPeerFeedbacks.reduce((acc, cur) => acc + cur.ratings.reliability, 0) /
                      totalProjectFeedbacks
                    ).toFixed(2)
                  )
                : 0;

            // Members coverage
            const reviewedMemberNames = new Set(projectPeerFeedbacks.map(f => f.reviewee_name));
            const coveragePct = projectMembers.length > 0 ? Math.round((reviewedMemberNames.size / projectMembers.length) * 100) : 0;
            const totalBadgesEarned = projectPeerFeedbacks.reduce((acc, cur) => acc + (cur.badges ? cur.badges.length : 0), 0);

            // Filter logic
            const filteredFeedbacks = projectPeerFeedbacks.filter(fb => {
              if (peerFilterReviewee !== 'all' && fb.reviewee_name !== peerFilterReviewee) {
                return false;
              }
              if (peerFilterBadge !== 'all' && (!fb.badges || !fb.badges.includes(peerFilterBadge))) {
                return false;
              }
              if (peerSearchKeyword.trim()) {
                const kw = peerSearchKeyword.toLowerCase();
                const matchStrengths = fb.strengths?.toLowerCase().includes(kw);
                const matchImprovements = fb.improvements?.toLowerCase().includes(kw);
                const matchReviewer = fb.reviewer_name?.toLowerCase().includes(kw);
                const matchReviewee = fb.reviewee_name?.toLowerCase().includes(kw);
                if (!matchStrengths && !matchImprovements && !matchReviewer && !matchReviewee) {
                  return false;
                }
              }
              return true;
            });

            const allAvailableBadges = [
              'Teliti & Presisi',
              'Problem Solver',
              'Kolaborator Hebat',
              'Visualisasi Unggul',
              'Pekerja Keras',
              'Inovatif',
              'Komunikasi Efektif',
              'Riset Lab Teladan',
              'Keahlian Teoretis'
            ];

            const strengthSuggestions = [
              'Sangat teliti dalam validasi data dan metodologi eksperimen.',
              'Komunikasi lintas disiplin sangat lancar dan mudah dipahami.',
              'Cepat tanggap memecahkan anomali data dan kendala teknis.',
              'Dokumentasi logbook dan penulisan laporan sangat terstruktur.'
            ];

            const improvementSuggestions = [
              'Dapat menambahkan diagram alir untuk konsep matematis/algoritma.',
              'Bisa meningkatkan kecepatan update logbook harian di workspace.',
              'Tingkatkan keterlibatan aktif dalam sesi bimbingan bersama dosen.'
            ];

            // Inline form handlers
            const handleInlinePeerSubmit = (e: React.FormEvent) => {
              e.preventDefault();
              const targetMember = projectMembers.find(m => m.name === inlineRevieweeName) || projectMembers.find(m => m.name !== currentUser?.name) || projectMembers[0];
              if (!targetMember || targetMember.name === currentUser?.name) return;

              addPeerFeedback({
                project_id: currentProject.id,
                reviewer_id: currentUser?.id || null,
                reviewer_name: currentUser?.name || 'Rekan Peneliti',
                reviewer_study: currentUser?.study_program || 'Sains Data',
                reviewer_role: 'Peneliti Anggota',
                reviewee_id: targetMember.user_id || null,
                reviewee_name: targetMember.name,
                reviewee_study: targetMember.study_program,
                reviewee_role: targetMember.role,
                ratings: {
                  technical: inlineTechRating,
                  collaboration: inlineCollabRating,
                  scientificRigor: inlineRigorRating,
                  reliability: inlineReliabilityRating
                },
                strengths: inlineStrengths.trim() || 'Kontribusi rekan sangat membantu kemajuan checkpoint penelitian tim.',
                improvements: inlineImprovements.trim() || 'Pertahankan ketelitian dan komunikasi yang sudah berjalan baik.',
                badges: inlineBadges
              });

              setShowInlineFeedback(false);
              setInlineStrengths('');
              setInlineImprovements('');
            };

            const toggleInlineBadge = (b: string) => {
              setInlineBadges(prev => (prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]));
            };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Header & Overview Card */}
                <div className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <div className="eyebrow" style={{ color: 'var(--accent-teal)' }}>
                        Evaluasi Sejawat Formatif (360° Peer Review)
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)', margin: '2px 0 6px 0' }}>
                        Peer-to-Peer Feedback & Evaluasi Kontribusi Rekan Tim
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
                        Fitur penjaminan mutu riset kolaboratif: Anggota tim saling memberikan umpan balik formatif terstruktur
                        berdasarkan 4 pilar kompetensi riset (Teknis, Kolaborasi, Ketelitian Ilmiah, dan Keandalan) serta apresiasi lencana ilmiah.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={`btn ${showInlineFeedback ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                        onClick={() => {
                          setShowInlineFeedback(!showInlineFeedback);
                          if (!inlineRevieweeName) {
                            const firstOther = projectMembers.find(m => m.name !== currentUser?.name);
                            if (firstOther) setInlineRevieweeName(firstOther.name);
                          }
                        }}
                      >
                        <MessageSquare size={13} />
                        <span>{showInlineFeedback ? 'Tutup Form Cepat' : 'Tulis Ulasan di Sini'}</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openModal('peerFeedback', { projectId: currentProject.id })}
                      >
                        <Star size={13} fill="currentColor" />
                        <span>+ Beri Feedback Rekan (Modal)</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Team Summary Tiles - 4 Boxes in 1 Row on Desktop, 2x2 on Mobile */}
                  <div className="peer-summary-grid">
                    <div className="peer-summary-card">
                      <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                        Total Ulasan Sejawat
                      </span>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginTop: '4px', marginBottom: '4px' }}>
                        {totalProjectFeedbacks} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>ulasan</span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={11} />
                        <span>Formatif aktif</span>
                      </span>
                    </div>

                    <div className="peer-summary-card">
                      <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                        Skor Rata-Rata Tim
                      </span>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#b45309', marginTop: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={18} style={{ fill: '#d97706', color: '#d97706' }} />
                        <span>{avgTeamScore > 0 ? avgTeamScore : '0.0'}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>/ 5.0</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                        {avgTeamScore >= 4.5 ? 'Predikat: Sangat Unggul' : avgTeamScore >= 4.0 ? 'Predikat: Baik' : 'Predikat: Cukup'}
                      </span>
                    </div>

                    <div className="peer-summary-card">
                      <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                        Cakupan Evaluasi 360°
                      </span>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginTop: '4px', marginBottom: '4px' }}>
                        {coveragePct}%
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        {reviewedMemberNames.size} dari {projectMembers.length} anggota dinilai
                      </span>
                    </div>

                    <div className="peer-summary-card">
                      <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                        Lencana Tersemat
                      </span>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#0d9488', marginTop: '4px', marginBottom: '4px' }}>
                        {totalBadgesEarned} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>penghargaan</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        Lencana etos kerja riset
                      </span>
                    </div>
                  </div>

                  {/* Team Dimension Strengths Progress Meters */}
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                        Rata-Rata Kompetensi Tim Berdasarkan 4 Dimensi Riset
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Skala 1.0 - 5.0</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--navy)', fontWeight: 700 }}>1. Kontribusi Teknis</span>
                          <strong style={{ color: '#2563eb' }}>{avgDimTech} / 5.0</strong>
                        </div>
                        <div className="progress-track" style={{ height: '7px' }}>
                          <div className="progress-fill" style={{ width: `${(avgDimTech / 5) * 100}%`, background: '#2563eb' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--navy)', fontWeight: 700 }}>2. Kolaborasi & Komunikasi</span>
                          <strong style={{ color: '#0d9488' }}>{avgDimCollab} / 5.0</strong>
                        </div>
                        <div className="progress-track" style={{ height: '7px' }}>
                          <div className="progress-fill" style={{ width: `${(avgDimCollab / 5) * 100}%`, background: '#0d9488' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--navy)', fontWeight: 700 }}>3. Ketelitian Ilmiah</span>
                          <strong style={{ color: '#7c3aed' }}>{avgDimRigor} / 5.0</strong>
                        </div>
                        <div className="progress-track" style={{ height: '7px' }}>
                          <div className="progress-fill" style={{ width: `${(avgDimRigor / 5) * 100}%`, background: '#7c3aed' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--navy)', fontWeight: 700 }}>4. Keandalan Tim</span>
                          <strong style={{ color: '#ea580c' }}>{avgDimRel} / 5.0</strong>
                        </div>
                        <div className="progress-track" style={{ height: '7px' }}>
                          <div className="progress-fill" style={{ width: `${(avgDimRel / 5) * 100}%`, background: '#ea580c' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inline Quick Feedback Form (Collapsible) */}
                {showInlineFeedback && (
                  <form
                    onSubmit={handleInlinePeerSubmit}
                    className="card"
                    style={{
                      padding: '24px',
                      background: '#f8fafc',
                      border: '2px solid var(--accent-teal)',
                      borderRadius: '14px',
                      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={15} />
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                          Tulis Ulasan Sejawat Langsung (Inline Fast Review)
                        </h4>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowInlineFeedback(false)}
                      >
                        Batal
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                      <div className="auth-field" style={{ margin: 0 }}>
                        <label>Pilih Rekan Tim yang Dinilai</label>
                        <select
                          value={inlineRevieweeName}
                          onChange={e => setInlineRevieweeName(e.target.value)}
                          required
                        >
                          {projectMembers.map(m => (
                            <option key={m.id} value={m.name} disabled={m.name === currentUser?.name}>
                              {m.name} — {m.role} ({m.study_program}) {m.name === currentUser?.name ? '(Anda)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ background: 'white', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>Penilai Aktif:</span>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 800 }}>
                          {currentUser?.name || 'Mahasiswa Peneliti'} ({currentUser?.study_program || 'Sains Data'})
                        </span>
                      </div>
                    </div>

                    {/* 4 Dimension Star Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          1. Kontribusi Teknis ({inlineTechRating}/5)
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setInlineTechRating(s)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: s <= inlineTechRating ? '#f59e0b' : '#cbd5e1' }}
                            >
                              <Star size={18} fill={s <= inlineTechRating ? '#f59e0b' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          2. Kolaborasi ({inlineCollabRating}/5)
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setInlineCollabRating(s)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: s <= inlineCollabRating ? '#f59e0b' : '#cbd5e1' }}
                            >
                              <Star size={18} fill={s <= inlineCollabRating ? '#f59e0b' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          3. Ketelitian Ilmiah ({inlineRigorRating}/5)
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setInlineRigorRating(s)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: s <= inlineRigorRating ? '#f59e0b' : '#cbd5e1' }}
                            >
                              <Star size={18} fill={s <= inlineRigorRating ? '#f59e0b' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
                          4. Keandalan Tim ({inlineReliabilityRating}/5)
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setInlineReliabilityRating(s)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: s <= inlineReliabilityRating ? '#f59e0b' : '#cbd5e1' }}
                            >
                              <Star size={18} fill={s <= inlineReliabilityRating ? '#f59e0b' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Lencana Apresiasi */}
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: '6px' }}>
                        Sematkan Lencana Apresiasi:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {allAvailableBadges.map(b => {
                          const isSel = inlineBadges.includes(b);
                          return (
                            <button
                              key={b}
                              type="button"
                              onClick={() => toggleInlineBadge(b)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '16px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: isSel ? '1.5px solid var(--accent-teal)' : '1px solid var(--line)',
                                background: isSel ? '#f0fdf4' : 'white',
                                color: isSel ? '#0f766e' : 'var(--ink-secondary)'
                              }}
                            >
                              {isSel ? '✓ ' : '+ '}
                              {b}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Qualitative Texts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                      <div className="auth-field" style={{ margin: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Lightbulb size={13} style={{ color: '#0d9488' }} />
                          <span>Kekuatan &amp; Kontribusi Menonjol Rekan</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Jelaskan kontribusi nyata rekan dalam riset..."
                          value={inlineStrengths}
                          onChange={e => setInlineStrengths(e.target.value)}
                          required
                        />
                      </div>

                      <div className="auth-field" style={{ margin: 0 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Sparkles size={13} style={{ color: '#2563eb' }} />
                          <span>Saran Pengembangan Konstruktif</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Berikan masukan positif untuk checkpoint berikutnya..."
                          value={inlineImprovements}
                          onChange={e => setInlineImprovements(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowInlineFeedback(false)}
                      >
                        Batal
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        <Send size={13} />
                        <span>Kirim Ulasan Sejawat Sekarang</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Team Members Scorecard Summary */}
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                        Rapor Feedback per Anggota Tim ({projectMembers.length} Peneliti)
                      </h4>
                      <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                        Klik tombol untuk memberikan ulasan atau melihat rincian masukan untuk masing-masing rekan
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {projectMembers.map(member => {
                      const received = projectPeerFeedbacks.filter(f => f.reviewee_name === member.name);
                      const avgMemberScore =
                        received.length > 0
                          ? (received.reduce((acc, cur) => acc + cur.overall_score, 0) / received.length).toFixed(1)
                          : null;

                      // Member specific dimensions
                      const memTech = received.length > 0 ? (received.reduce((a, b) => a + b.ratings.technical, 0) / received.length).toFixed(1) : '-';
                      const memCollab = received.length > 0 ? (received.reduce((a, b) => a + b.ratings.collaboration, 0) / received.length).toFixed(1) : '-';
                      const memRigor = received.length > 0 ? (received.reduce((a, b) => a + b.ratings.scientificRigor, 0) / received.length).toFixed(1) : '-';
                      const memRel = received.length > 0 ? (received.reduce((a, b) => a + b.ratings.reliability, 0) / received.length).toFixed(1) : '-';

                      const memberBadges = Array.from(new Set(received.flatMap(f => f.badges || [])));

                      return (
                        <div
                          key={member.id}
                          style={{
                            background: 'var(--surface-alt)',
                            border: '1px solid var(--line)',
                            borderRadius: '12px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                  className="user-avatar"
                                  style={{ backgroundColor: member.avatar_color || '#2878d7', width: '36px', height: '36px', fontSize: '13px' }}
                                >
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <strong style={{ fontSize: '13.5px', color: 'var(--navy)', display: 'block' }}>
                                    {member.name}
                                  </strong>
                                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                    {member.study_program}
                                  </span>
                                </div>
                              </div>
                              {avgMemberScore ? (
                                <span
                                  style={{
                                    background: '#fef3c7',
                                    color: '#b45309',
                                    border: '1px solid #fde68a',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11.5px',
                                    fontWeight: 800,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                >
                                  <Star size={11} style={{ fill: '#d97706', color: '#d97706' }} />
                                  <span>{avgMemberScore}</span>
                                </span>
                              ) : (
                                <span style={{ fontSize: '10.5px', color: 'var(--muted)', background: 'white', padding: '2px 6px', borderRadius: '10px' }}>
                                  Belum Dinilai
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: 700, marginBottom: '6px' }}>
                              {member.role}
                            </div>

                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>
                              {received.length} ulasan sejawat diterima
                            </div>

                            {/* 4 Dimension Mini Matrix */}
                            {received.length > 0 && (
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(4, 1fr)',
                                  gap: '4px',
                                  background: 'white',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  border: '1px solid var(--line)',
                                  marginBottom: '10px',
                                  textAlign: 'center'
                                }}
                              >
                                <div>
                                  <span style={{ fontSize: '9.5px', color: 'var(--muted)', display: 'block' }}>Teknis</span>
                                  <strong style={{ fontSize: '11.5px', color: '#2563eb' }}>{memTech}</strong>
                                </div>
                                <div>
                                  <span style={{ fontSize: '9.5px', color: 'var(--muted)', display: 'block' }}>Kolab</span>
                                  <strong style={{ fontSize: '11.5px', color: '#0d9488' }}>{memCollab}</strong>
                                </div>
                                <div>
                                  <span style={{ fontSize: '9.5px', color: 'var(--muted)', display: 'block' }}>Teliti</span>
                                  <strong style={{ fontSize: '11.5px', color: '#7c3aed' }}>{memRigor}</strong>
                                </div>
                                <div>
                                  <span style={{ fontSize: '9.5px', color: 'var(--muted)', display: 'block' }}>Andal</span>
                                  <strong style={{ fontSize: '11.5px', color: '#ea580c' }}>{memRel}</strong>
                                </div>
                              </div>
                            )}

                            {/* Member Badges */}
                            {memberBadges.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                {memberBadges.slice(0, 3).map((b, idx) => (
                                  <span
                                    key={idx}
                                    className="badge badge-teal"
                                    style={{ fontSize: '9.5px', padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                  >
                                    <Tag size={10} />
                                    <span>{b}</span>
                                  </span>
                                ))}
                                {memberBadges.length > 3 && (
                                  <span style={{ fontSize: '9.5px', color: 'var(--muted)', alignSelf: 'center' }}>
                                    +{memberBadges.length - 3} lainnya
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => setPeerFilterReviewee(member.name)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                            >
                              Filter Ulasan
                            </button>

                            {member.name !== currentUser?.name && (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => openModal('peerFeedback', { projectId: currentProject.id, revieweeName: member.name })}
                                style={{ fontSize: '11px', padding: '4px 10px' }}
                              >
                                <Star size={12} fill="currentColor" />
                                <span>Beri Ulasan</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div
                  className="card"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>
                        Anggota:
                      </span>
                      <select
                        value={peerFilterReviewee}
                        onChange={e => setPeerFilterReviewee(e.target.value)}
                        style={{ fontSize: '12px', padding: '5px 10px', width: 'auto' }}
                      >
                        <option value="all">Semua Anggota Tim ({projectPeerFeedbacks.length})</option>
                        {projectMembers.map(m => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({projectPeerFeedbacks.filter(f => f.reviewee_name === m.name).length})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>
                        Lencana:
                      </span>
                      <select
                        value={peerFilterBadge}
                        onChange={e => setPeerFilterBadge(e.target.value)}
                        style={{ fontSize: '12px', padding: '5px 10px', width: 'auto' }}
                      >
                        <option value="all">Semua Lencana</option>
                        {allAvailableBadges.map(b => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Cari komentar / nama..."
                        value={peerSearchKeyword}
                        onChange={e => setPeerSearchKeyword(e.target.value)}
                        style={{ fontSize: '12px', padding: '5px 10px', width: '180px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(peerFilterReviewee !== 'all' || peerFilterBadge !== 'all' || peerSearchKeyword.trim() !== '') && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                        onClick={() => {
                          setPeerFilterReviewee('all');
                          setPeerFilterBadge('all');
                          setPeerSearchKeyword('');
                        }}
                      >
                        ✕ Reset Filter
                      </button>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                      Menampilkan {filteredFeedbacks.length} ulasan
                    </span>
                  </div>
                </div>

                {/* Feedbacks List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filteredFeedbacks.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
                      <Star size={36} style={{ color: '#cbd5e1', margin: '0 auto 10px' }} />
                      <h4 style={{ fontSize: '15px', color: 'var(--navy)', marginBottom: '6px' }}>
                        Belum ada ulasan sejawat yang sesuai kriteria filter
                      </h4>
                      <p style={{ fontSize: '12.5px', marginBottom: '16px', maxWidth: '480px', margin: '0 auto 16px' }}>
                        Berikan apresiasi dan masukan konstruktif pertama untuk meningkatkan kualitas riset multidisiplin tim.
                      </p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openModal('peerFeedback', { projectId: currentProject.id })}
                      >
                        <span>Beri Ulasan Sejawat Sekarang &rarr;</span>
                      </button>
                    </div>
                  ) : (
                    filteredFeedbacks.map(fb => (
                      <div
                        key={fb.id}
                        className="card"
                        style={{
                          padding: '20px 22px',
                          borderLeft: '4px solid var(--accent-teal)',
                          transition: 'box-shadow 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <div
                                className="user-avatar"
                                style={{ backgroundColor: '#2878d7', width: '28px', height: '28px', fontSize: '11px' }}
                              >
                                {fb.reviewer_name?.charAt(0) || 'P'}
                              </div>
                              <strong style={{ fontSize: '13.5px', color: 'var(--navy)' }}>
                                {fb.reviewer_name}
                              </strong>
                              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                ({fb.reviewer_study || 'STEAM'})
                              </span>
                              <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 900 }}>&rarr;</span>
                              <div
                                className="user-avatar"
                                style={{ backgroundColor: '#0d9488', width: '28px', height: '28px', fontSize: '11px' }}
                              >
                                {fb.reviewee_name?.charAt(0) || 'R'}
                              </div>
                              <strong style={{ fontSize: '13.5px', color: 'var(--navy)' }}>
                                {fb.reviewee_name}
                              </strong>
                              <span className="badge badge-blue" style={{ fontSize: '10.5px' }}>
                                {fb.reviewee_role || 'Peneliti'}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', marginLeft: '36px' }}>
                              Diterbitkan pada: {new Date(fb.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          </div>

                          <div
                            style={{
                              background: '#fef3c7',
                              border: '1px solid #fde68a',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: '#92400e',
                              fontWeight: 800,
                              fontSize: '13px'
                            }}
                          >
                            <Star size={15} fill="#f59e0b" color="#f59e0b" />
                            <span>Skor Evaluasi: {fb.overall_score.toFixed(1)} / 5.0</span>
                          </div>
                        </div>

                        {/* 4 Dimension Breakdown Bar */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                            gap: '10px',
                            background: 'var(--surface-alt)',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            marginBottom: '14px',
                            fontSize: '11.5px'
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10.5px' }}>
                              1. Kontribusi Teknis & Eksekusi:
                            </span>
                            <strong style={{ color: 'var(--navy)', fontSize: '12px' }}>
                              {'★'.repeat(fb.ratings.technical)}{'☆'.repeat(5 - fb.ratings.technical)} ({fb.ratings.technical}/5)
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10.5px' }}>
                              2. Kolaborasi & Komunikasi:
                            </span>
                            <strong style={{ color: 'var(--navy)', fontSize: '12px' }}>
                              {'★'.repeat(fb.ratings.collaboration)}{'☆'.repeat(5 - fb.ratings.collaboration)} ({fb.ratings.collaboration}/5)
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10.5px' }}>
                              3. Ketelitian Ilmiah & Problem Solving:
                            </span>
                            <strong style={{ color: 'var(--navy)', fontSize: '12px' }}>
                              {'★'.repeat(fb.ratings.scientificRigor)}{'☆'.repeat(5 - fb.ratings.scientificRigor)} ({fb.ratings.scientificRigor}/5)
                            </strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10.5px' }}>
                              4. Keandalan & Tanggung Jawab:
                            </span>
                            <strong style={{ color: 'var(--navy)', fontSize: '12px' }}>
                              {'★'.repeat(fb.ratings.reliability)}{'☆'.repeat(5 - fb.ratings.reliability)} ({fb.ratings.reliability}/5)
                            </strong>
                          </div>
                        </div>

                        {/* Badges */}
                        {fb.badges && fb.badges.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                            {fb.badges.map((b, idx) => (
                              <span key={idx} className="badge badge-teal" style={{ fontSize: '11px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Trophy size={11} />
                                {b}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Qualitative Comments */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #0d9488' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '4px', letterSpacing: '0.4px' }}>
                              <Lightbulb size={12} />
                              Kekuatan & Kontribusi Menonjol
                            </span>
                            <p style={{ fontSize: '13px', color: 'var(--ink)', margin: 0, lineHeight: 1.6 }}>
                              "{fb.strengths}"
                            </p>
                          </div>

                          <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #3b82f6' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '4px', letterSpacing: '0.4px' }}>
                              <Leaf size={12} />
                              Saran Pengembangan Ilmiah Konstruktif
                            </span>
                            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', margin: 0, lineHeight: 1.6 }}>
                              "{fb.improvements}"
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 6: EVALUATION & AI ASSISTANT */}
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
                  <div className="steam-score-grid">
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

                  <div className="rubric-score-grid">
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

          {/* Peer Review Status Widget */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-teal)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                  Evaluasi Sejawat Tim
                </h4>
              </div>
              <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                {projectPeerFeedbacks.length} Ulasan
              </span>
            </div>

            <p style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
              Ulasan 360° formatif antar kolaborator tim untuk meninjau kontribusi teknis dan ketelitian riset.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-alt)', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Skor Rata-Rata:</span>
              <strong style={{ fontSize: '13px', color: '#b45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} /> {projectPeerFeedbacks.length > 0 ? (projectPeerFeedbacks.reduce((a, b) => a + b.overall_score, 0) / projectPeerFeedbacks.length).toFixed(1) : '0.0'} / 5.0
              </strong>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', fontSize: '11.5px' }}
              onClick={() => setActiveTab('peerFeedback')}
            >
              <span>Buka Tab Peer Feedback &rarr;</span>
            </button>
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
