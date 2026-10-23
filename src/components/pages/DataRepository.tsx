import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, FileText, ExternalLink, Check, AlertCircle, Upload, Link2, Plus, ChevronRight, Shield, Eye, UploadCloud, X } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   FITUR 4 — REPOSITORY DATA EMPIRIS & REPRODUCIBILITY CHECKER
   Sistem manajemen artefak riset digital
   ────────────────────────────────────────────────────────── */

interface DataArtifact {
  id: number;
  project_id: number;
  name: string;
  type: 'dataset' | 'code' | 'protocol' | 'notebook' | 'model';
  format: string;
  size: string;
  url: string;
  description: string;
  license: string;
  uploaded_by: string;
  uploaded_at: string;
  verified: boolean;
}

interface ReproducibilityCheck {
  key: string;
  label: string;
  description: string;
  checked: boolean;
  category: 'data' | 'code' | 'env' | 'docs';
}

const INITIAL_ARTIFACTS: DataArtifact[] = [
  {
    id: 1, project_id: 1, name: 'weather_surabaya_2023_2026.csv',
    type: 'dataset', format: 'CSV', size: '4.2 MB', url: 'https://dataonline.bmkg.go.id',
    description: 'Dataset cuaca harian Stasiun Meteorologi Juanda Surabaya (2023-2026). Berisi 12.000 baris × 14 fitur termasuk suhu, kelembaban, curah hujan, tekanan udara, dan kecepatan angin.',
    license: 'CC BY 4.0 (BMKG Open Data)', uploaded_by: 'Budi Santoso', uploaded_at: '2026-10-15', verified: true
  },
  {
    id: 2, project_id: 1, name: 'lstm_weather_model.py',
    type: 'code', format: 'Python', size: '8.6 KB', url: 'https://github.com/nazaa-arch/steamcraft',
    description: 'Script pelatihan model LSTM untuk prediksi suhu 7 hari ke depan. Menggunakan PyTorch 2.4, window size 30 hari, 2 hidden layers (128 units).',
    license: 'MIT License', uploaded_by: 'Budi Santoso', uploaded_at: '2026-10-17', verified: true
  },
  {
    id: 3, project_id: 1, name: 'experiment_protocol_v2.md',
    type: 'protocol', format: 'Markdown', size: '3.1 KB', url: '',
    description: 'Protokol eksperimen standar operasional (SOP) untuk pengujian akurasi model prediksi cuaca. Mencakup prosedur pelatihan, validasi silang 5-fold, dan metrik evaluasi (MAE, RMSE, R²).',
    license: 'Internal STEAM-Craft', uploaded_by: 'Budi Santoso', uploaded_at: '2026-10-18', verified: false
  },
  {
    id: 4, project_id: 1, name: 'analysis_notebook.ipynb',
    type: 'notebook', format: 'Jupyter Notebook', size: '1.8 MB', url: 'https://colab.research.google.com/steam-weather',
    description: 'Notebook analisis eksploratif data (EDA) lengkap dengan visualisasi distribusi, korelasi antar-fitur, dan deteksi outlier menggunakan IQR method.',
    license: 'CC BY-SA 4.0', uploaded_by: 'Budi Santoso', uploaded_at: '2026-10-19', verified: true
  },
  {
    id: 5, project_id: 1, name: 'trained_lstm_weights.pt',
    type: 'model', format: 'PyTorch Weights', size: '12.4 MB', url: '',
    description: 'Bobot model LSTM terlatih (epoch 150, batch 32, lr 0.001). Best val_loss: 0.0234. Dapat dimuat ulang untuk inferensi atau fine-tuning.',
    license: 'MIT License', uploaded_by: 'Budi Santoso', uploaded_at: '2026-10-20', verified: false
  }
];

const REPRODUCIBILITY_CHECKS: ReproducibilityCheck[] = [
  { key: 'raw_data', label: 'Dataset mentah tersedia', description: 'File CSV/JSON asli sebelum preprocessing dapat diunduh', checked: true, category: 'data' },
  { key: 'data_dict', label: 'Kamus data (data dictionary) terdokumentasi', description: 'Setiap kolom/fitur memiliki penjelasan tipe, satuan, dan makna', checked: true, category: 'data' },
  { key: 'preprocess_log', label: 'Langkah preprocessing terdokumentasi', description: 'Handling missing values, normalisasi, encoding, dan transformasi', checked: true, category: 'data' },
  { key: 'source_code', label: 'Kode sumber tersedia di repositori publik', description: 'GitHub/GitLab repository dengan README yang jelas', checked: true, category: 'code' },
  { key: 'random_seed', label: 'Random seed dicantumkan untuk setiap eksperimen', description: 'np.random.seed() / torch.manual_seed() untuk reproduktibilitas', checked: true, category: 'code' },
  { key: 'hyperparams', label: 'Hyperparameter dan konfigurasi didokumentasikan', description: 'Learning rate, epochs, batch size, optimizer, dan arsitektur', checked: true, category: 'code' },
  { key: 'requirements', label: 'File dependensi environment tersedia', description: 'requirements.txt / environment.yml / Dockerfile', checked: false, category: 'env' },
  { key: 'python_ver', label: 'Versi runtime dicantumkan', description: 'Python 3.x, Node.js, CUDA version, dan OS', checked: false, category: 'env' },
  { key: 'docker', label: 'Container / Docker image tersedia (opsional)', description: 'Reproduksi 1-klik tanpa instalasi manual', checked: false, category: 'env' },
  { key: 'readme', label: 'README.md lengkap dengan instruksi setup', description: 'Langkah clone, install, run, dan expected output', checked: true, category: 'docs' },
  { key: 'sop', label: 'Protokol eksperimen / SOP terdokumentasi', description: 'Prosedur standar yang dapat diikuti oleh peneliti lain', checked: true, category: 'docs' },
  { key: 'results_log', label: 'Hasil eksperimen tercatat di logbook', description: 'Metrik evaluasi, screenshot output, dan analisis error', checked: true, category: 'docs' },
];

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  dataset: { icon: '📊', color: '#2563eb', label: 'Dataset' },
  code: { icon: '💻', color: '#16a34a', label: 'Source Code' },
  protocol: { icon: '📋', color: '#ea580c', label: 'Protokol SOP' },
  notebook: { icon: '📓', color: '#7c3aed', label: 'Notebook' },
  model: { icon: '🧠', color: '#0d9488', label: 'Trained Model' },
};

export const DataRepository: React.FC = () => {
  const { projects, currentUser, showToast } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [artifacts, setArtifacts] = useState<DataArtifact[]>(INITIAL_ARTIFACTS);
  const [checks, setChecks] = useState<ReproducibilityCheck[]>(REPRODUCIBILITY_CHECKS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'artifacts' | 'reproducibility'>('artifacts');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unverified' | 'verified'>('all');
  const [newArtifact, setNewArtifact] = useState({ name: '', type: 'dataset', format: '', url: '', description: '', license: 'CC BY 4.0' });
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Lecturer Verification Modal State
  const [verifyingArtifact, setVerifyingArtifact] = useState<DataArtifact | null>(null);
  const [endorsementNote, setEndorsementNote] = useState<string>('');

  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const verifiedArtifactsCount = artifacts.filter(a => a.verified).length;
  const unverifiedArtifactsCount = artifacts.length - verifiedArtifactsCount;

  const totalChecked = checks.filter(c => c.checked).length;
  const reproScore = Math.round((totalChecked / checks.length) * 100);

  const getReproGrade = (score: number) => {
    if (score >= 85) return { label: 'Sangat Reprodusibel', color: '#16a34a', emoji: '🏆' };
    if (score >= 65) return { label: 'Cukup Reprodusibel', color: '#0284c7', emoji: '✅' };
    if (score >= 40) return { label: 'Perlu Peningkatan', color: '#f59e0b', emoji: '⚠️' };
    return { label: 'Belum Reprodusibel', color: '#e11d48', emoji: '❌' };
  };

  const reproGrade = getReproGrade(reproScore);

  const toggleCheck = (key: string) => {
    setChecks(prev => prev.map(c => c.key === key ? { ...c, checked: !c.checked } : c));
  };

  const handleAddArtifact = () => {
    if (!newArtifact.name) return;
    const artifact: DataArtifact = {
      id: Date.now(), project_id: selectedProjectId,
      name: newArtifact.name, type: newArtifact.type as DataArtifact['type'],
      format: newArtifact.format || newArtifact.type.toUpperCase(), size: uploadedFileSize || '1.2 MB', url: newArtifact.url,
      description: newArtifact.description || 'Artefak penelitian digital telah diunggah ke repositori proyek.', license: newArtifact.license,
      uploaded_by: currentUser?.name || 'Mahasiswa', uploaded_at: new Date().toISOString().split('T')[0],
      verified: false
    };
    setArtifacts(prev => [artifact, ...prev]);
    setNewArtifact({ name: '', type: 'dataset', format: '', url: '', description: '', license: 'CC BY 4.0' });
    setUploadedFileSize('');
    setShowAddForm(false);
    showToast('✓ Artefak baru berhasil diunggah ke repositori! Menunggu verifikasi Dosen Pembimbing.');
  };

  const handleOpenVerifyModal = (artifact: DataArtifact) => {
    if (!isLecturerOrAdmin) {
      showToast('⚠️ Hanya Dosen Pembimbing yang memiliki wewenang memvalidasi artefak data.');
      return;
    }
    setVerifyingArtifact(artifact);
    setEndorsementNote('Artefak data telah diperiksa dan memenuhi kaidah FAIR data serta standar replikasi ilmiah PKM.');
  };

  const handleConfirmVerifyArtifact = () => {
    if (!verifyingArtifact) return;
    setArtifacts(prev =>
      prev.map(a =>
        a.id === verifyingArtifact.id
          ? { ...a, verified: true, description: a.description + (endorsementNote ? ` [Validasi Pembimbing: ${endorsementNote}]` : '') }
          : a
      )
    );
    showToast(`✓ Artefak "${verifyingArtifact.name}" berhasil divalidasi oleh Dosen Pembimbing.`);
    setVerifyingArtifact(null);
  };

  // Filtered artifacts
  const filteredArtifacts = artifacts.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (statusFilter === 'unverified' && a.verified) return false;
    if (statusFilter === 'verified' && !a.verified) return false;
    return true;
  });

  const categories = [
    { key: 'data', label: '📊 Data & Dataset', color: '#2563eb' },
    { key: 'code', label: '💻 Kode & Algoritma', color: '#16a34a' },
    { key: 'env', label: '⚙️ Environment & Runtime', color: '#ea580c' },
    { key: 'docs', label: '📋 Dokumentasi & SOP', color: '#7c3aed' },
  ];

  return (
    <section className="page active" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ flex: '1 1 320px' }}>
          <div className="eyebrow">{isLecturerOrAdmin ? 'Portal Verifikasi Data & Open Science Dosen' : 'Manajemen Artefak Digital & Standar Reproduktibilitas'}</div>
          <h2 className="h1" style={{ margin: '4px 0 6px 0' }}>Repository Data Empiris</h2>
          <p className="sub" style={{ margin: 0 }}>
            {isLecturerOrAdmin
              ? 'Tinjau dan validasi kelengkapan artefak data penelitian, notebook analisis Colab, serta pastikan standar reproduktibilitas riset memenuhi kaidah jurnal ilmiah bereputasi.'
              : 'Kelola dataset mentah, kode sumber, protokol eksperimen, dan notebook analisis. Verifikasi reproduktibilitas riset sesuai standar jurnal ilmiah internasional.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', flexWrap: 'wrap' }}>
          <select value={selectedProjectId} onChange={e => setSelectedProjectId(Number(e.target.value))} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontSize: '13px', fontWeight: 700, background: 'white' }}>
            {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
          <button type="button" className="btn btn-primary" onClick={() => { setShowAddForm(!showAddForm); setActiveTab('artifacts'); }} style={{ padding: '8px 14px' }}>
            <Upload size={15} /> <span>Unggah Artefak</span>
          </button>
        </div>
      </div>

      {/* Role Guidance Banner */}
      <div
        style={{
          background: isLecturerOrAdmin ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#eff6ff',
          border: `1.5px solid ${isLecturerOrAdmin ? '#86efac' : '#bfdbfe'}`,
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '20px',
          fontSize: '12.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
          <span style={{ fontSize: '24px', flexShrink: 0 }}>{isLecturerOrAdmin ? '👨‍🏫' : '🔬'}</span>
          <div style={{ color: isLecturerOrAdmin ? '#14532d' : '#1e40af', lineHeight: 1.45 }}>
            <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '2px' }}>
              {isLecturerOrAdmin ? 'Mode Tinjauan Dosen Pembimbing (Validasi FAIR Data & Replikasi):' : 'Standar Keterbukaan Sains & Reproduktibilitas (PKM Dikti):'}
            </div>
            {isLecturerOrAdmin
              ? 'Anda dapat meninjau dataset, kode pemrograman, dan notebook yang diunggah mahasiswa. Klik tombol "Verifikasi" untuk menyetujui artefak dan memberikan catatan kelayakan replikasi.'
              : 'Unggah dataset mentah dan skrip analisis untuk memenuhi standar Open Science. Status verifikasi oleh Dosen Pembimbing memastikan riset siap diajukan ke jurnal nasional/internasional.'}
          </div>
        </div>

        {isLecturerOrAdmin && unverifiedArtifactsCount > 0 && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setActiveTab('artifacts');
              setStatusFilter('unverified');
            }}
            style={{
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: 800,
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(234,88,12,0.25)'
            }}
          >
            <span>⏳ Tinjau {unverifiedArtifactsCount} Artefak Belum Terverifikasi &rarr;</span>
          </button>
        )}
      </div>

      {/* Summary Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Artefak Riset', value: artifacts.length, unit: 'Berkas', color: '#2563eb', icon: '📦', onClick: () => { setActiveTab('artifacts'); setTypeFilter('all'); setStatusFilter('all'); } },
          { label: 'Dataset Primer/Sekunder', value: artifacts.filter(a => a.type === 'dataset').length, unit: 'Data', color: '#0d9488', icon: '📊', onClick: () => { setActiveTab('artifacts'); setTypeFilter('dataset'); } },
          { label: 'Kode & Notebook', value: artifacts.filter(a => a.type === 'code' || a.type === 'notebook').length, unit: 'Skrip', color: '#7c3aed', icon: '💻', onClick: () => { setActiveTab('artifacts'); setTypeFilter('code'); } },
          { label: 'Terverifikasi Dosen', value: verifiedArtifactsCount, unit: `/ ${artifacts.length}`, color: '#16a34a', icon: '✅', onClick: () => { setActiveTab('artifacts'); setStatusFilter('verified'); } },
          { label: isLecturerOrAdmin ? 'Perlu Validasi Anda' : 'Menunggu Validasi', value: unverifiedArtifactsCount, unit: 'Berkas', color: '#f59e0b', icon: '⏳', onClick: () => { setActiveTab('artifacts'); setStatusFilter('unverified'); } },
        ].map((stat, i) => (
          <div
            key={i}
            className="card"
            onClick={stat.onClick}
            style={{
              padding: '16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: stat.onClick ? 'pointer' : 'default'
            }}
          >
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: stat.color }}>{stat.value} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>{stat.unit}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => setActiveTab('artifacts')}
          style={{
            padding: '8px 18px', borderRadius: '9px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            background: activeTab === 'artifacts' ? 'white' : 'transparent',
            color: activeTab === 'artifacts' ? 'var(--navy)' : 'var(--muted)',
            boxShadow: activeTab === 'artifacts' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} /> Artefak Digital ({artifacts.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reproducibility')}
          style={{
            padding: '8px 18px', borderRadius: '9px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            background: activeTab === 'reproducibility' ? 'white' : 'transparent',
            color: activeTab === 'reproducibility' ? 'var(--navy)' : 'var(--muted)',
            boxShadow: activeTab === 'reproducibility' ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} /> Reproducibility Check ({reproScore}%)
          </span>
        </button>
      </div>

      {/* TAB 1: ARTEFAK DIGITAL */}
      {activeTab === 'artifacts' && (
        <>
          {/* Kotak Modal Unggah Artefak Riset (seperti Kotak Ajukan) */}
          {showAddForm && (
            <div className="modal-overlay active" onClick={() => setShowAddForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
                <button className="modal-close" onClick={() => setShowAddForm(false)}>
                  &times;
                </button>

                <div className="eyebrow">Data Repository &amp; Open Science</div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
                  Unggah &amp; Publikasikan Artefak Riset
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '18px' }}>
                  Tambahkan dataset mentah, notebook analisis, protokol SOP, atau bobot model ke repositori riset untuk verifikasi reproduktibilitas.
                </p>

                {/* Target Project Card */}
                <div
                  style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Proyek Riset
                    </span>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--navy)' }}>
                      {projects.find(p => p.id === selectedProjectId)?.name || 'Proyek Riset'}
                    </div>
                  </div>
                  <span className="badge badge-blue" style={{ fontSize: '11px' }}>
                    Open Science
                  </span>
                </div>

                {/* Upload File Zone */}
                <div className="auth-field" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Unggah Berkas File Langsung (Opsional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.ipynb,.pdf,.zip,.xlsx,.png,.jpg,.docx,.py,.pt,.h5"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const ext = file.name.split('.').pop()?.toUpperCase() || 'DATA';
                        const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
                        setNewArtifact(p => ({ ...p, name: file.name, format: ext }));
                        setUploadedFileSize(sizeStr);
                      }
                    }}
                    style={{ display: 'none' }}
                  />

                  {!newArtifact.name ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #93c5fd',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        background: '#f8fbff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                      onMouseOut={e => (e.currentTarget.style.borderColor = '#93c5fd')}
                    >
                      <UploadCloud size={28} style={{ color: 'var(--primary)' }} />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>
                        Klik tombol ini untuk memilih berkas dari komputer / HP
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                        Format didukung: CSV, JSON, IPYNB, PDF, ZIP, H5, PT, DOCX
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        color: '#166534',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={18} style={{ color: '#15803d', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', wordBreak: 'break-all' }}>{newArtifact.name}</strong>
                          <span style={{ fontSize: '11px', color: '#166534', opacity: 0.85 }}>Format: {newArtifact.format || 'FILE'} &middot; {uploadedFileSize || 'Siap Unggah'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => fileInputRef.current?.click()}
                          style={{ fontSize: '11px', color: '#15803d', border: '1px solid #86efac', background: 'white' }}
                        >
                          Ganti
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() => {
                            setNewArtifact(p => ({ ...p, name: '' }));
                            setUploadedFileSize('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          style={{ fontSize: '11px', color: '#ef4444', border: '1px solid #fecaca', background: 'white' }}
                          title="Hapus berkas"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Fields Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div className="auth-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px', fontWeight: 700 }}>Nama File / Artefak *</label>
                    <input
                      type="text"
                      placeholder="weather_data_clean.csv"
                      value={newArtifact.name}
                      onChange={e => setNewArtifact(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="auth-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px', fontWeight: 700 }}>Jenis Artefak</label>
                    <select value={newArtifact.type} onChange={e => setNewArtifact(p => ({ ...p, type: e.target.value as any }))}>
                      <option value="dataset">📊 Dataset Primer / Sekunder</option>
                      <option value="code">💻 Source Code / Script</option>
                      <option value="protocol">📋 Protokol SOP &amp; Eksperimen</option>
                      <option value="notebook">📓 Jupyter / Colab Notebook</option>
                      <option value="model">🧠 Model Weights / Checkpoint</option>
                    </select>
                  </div>

                  <div className="auth-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px', fontWeight: 700 }}>URL / Tautan (GitHub/Colab/Zenodo)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={newArtifact.url}
                      onChange={e => setNewArtifact(p => ({ ...p, url: e.target.value }))}
                    />
                  </div>

                  <div className="auth-field" style={{ margin: 0 }}>
                    <label style={{ fontSize: '12px', fontWeight: 700 }}>Lisensi Distribusi Data</label>
                    <select value={newArtifact.license} onChange={e => setNewArtifact(p => ({ ...p, license: e.target.value }))}>
                      <option>CC BY 4.0</option>
                      <option>CC BY-SA 4.0</option>
                      <option>MIT License</option>
                      <option>Apache 2.0</option>
                      <option>Internal STEAM-Craft</option>
                    </select>
                  </div>
                </div>

                <div className="auth-field" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Deskripsi &amp; Catatan Reproducibility</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan deskripsi struktur kolom, parameter sampling, atau cara mereplikasi..."
                    value={newArtifact.description}
                    onChange={e => setNewArtifact(p => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddArtifact}
                    disabled={!newArtifact.name.trim()}
                  >
                    <Check size={14} style={{ marginRight: '4px' }} />
                    <span>Simpan &amp; Publikasikan Artefak</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Controls: Type and Status */}
          <div className="card" style={{ padding: '16px 18px', borderRadius: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px' }}>⚡</span>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>Status Validasi Artefak:</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '11.5px', padding: '5px 12px', borderRadius: '20px', border: '1px solid var(--line)' }}
                >
                  Semua ({artifacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('unverified')}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: `1.5px solid ${statusFilter === 'unverified' ? '#d97706' : '#fde68a'}`,
                    background: statusFilter === 'unverified' ? '#f59e0b' : '#fffbeb',
                    color: statusFilter === 'unverified' ? '#ffffff' : '#b45309',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⏳ Menunggu Validasi ({unverifiedArtifactsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('verified')}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: `1.5px solid ${statusFilter === 'verified' ? '#15803d' : '#bbf7d0'}`,
                    background: statusFilter === 'verified' ? '#16a34a' : '#f0fdf4',
                    color: statusFilter === 'verified' ? '#ffffff' : '#15803d',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✓ Terverifikasi Dosen ({verifiedArtifactsCount})
                </button>
              </div>
            </div>

            {/* Type Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Jenis Artefak:</span>
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`btn btn-sm ${typeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '20px' }}
              >
                Semua
              </button>
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                const count = artifacts.filter(a => a.type === key).length;
                const isSelected = typeFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTypeFilter(key)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                    <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '999px', background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--line)', color: isSelected ? '#fff' : 'var(--navy)' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Artifacts Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredArtifacts.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  borderRadius: '16px',
                  background: 'var(--surface-alt)',
                  border: '1.5px dashed var(--line)'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
                  Tidak Ada Artefak yang Sesuai Filter
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 auto 16px', maxWidth: '400px' }}>
                  Tidak ditemukan artefak dengan filter yang dipilih. Coba atur ulang filter status atau jenis artefak.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setTypeFilter('all'); setStatusFilter('all'); }}
                >
                  Reset Filter Artefak
                </button>
              </div>
            ) : (
              filteredArtifacts.map(artifact => {
                const cfg = TYPE_CONFIG[artifact.type] || TYPE_CONFIG.dataset;
                return (
                  <div key={artifact.id} className="card" style={{ padding: '18px 20px', borderRadius: '14px', borderLeft: `4px solid ${cfg.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '18px' }}>{cfg.icon}</span>
                          <strong style={{ fontSize: '14px', color: 'var(--navy)', wordBreak: 'break-all' }}>{artifact.name}</strong>
                          <span className={`badge badge-${artifact.type === 'dataset' ? 'blue' : artifact.type === 'code' ? 'teal' : artifact.type === 'protocol' ? 'orange' : artifact.type === 'notebook' ? 'purple' : 'teal'}`} style={{ fontSize: '10px' }}>
                            {cfg.label}
                          </span>
                          {artifact.verified ? (
                            <span className="badge badge-teal" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              ✓ Terverifikasi Dosen
                            </span>
                          ) : (
                            <span className="badge badge-orange" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              ⏳ Menunggu Validasi
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>{artifact.description}</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--muted)' }}>
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong>Format:</strong> {artifact.format}
                          </span>
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong>Ukuran:</strong> {artifact.size}
                          </span>
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong>Lisensi:</strong> {artifact.license}
                          </span>
                          <span style={{ background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <strong>Pengunggah:</strong> {artifact.uploaded_by} ({artifact.uploaded_at})
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
                        {artifact.url && (
                          <a href={artifact.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', fontSize: '11.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <ExternalLink size={12} /> <span>Buka Tautan</span>
                          </a>
                        )}
                        {isLecturerOrAdmin && !artifact.verified && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => handleOpenVerifyModal(artifact)}
                            style={{ padding: '6px 12px', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Validasi artefak ini sebagai Dosen Pembimbing"
                          >
                            <Check size={12} /> <span>Validasi</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* TAB 2: REPRODUCIBILITY CHECKER */}
      {activeTab === 'reproducibility' && (
        <>
          {/* Panel Evaluasi Dosen Pembimbing (Khusus Dosen) */}
          {isLecturerOrAdmin && (
            <div
              className="card"
              style={{
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '1.5px solid #86efac'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👨‍🏫</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#166534', margin: 0 }}>
                    Panel Evaluasi Dosen Pembimbing &mdash; Kesiapan Publikasi Ilmiah
                  </h4>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: reproScore >= 75 ? '#16a34a' : '#f59e0b',
                    color: '#ffffff'
                  }}
                >
                  {reproScore >= 75 ? '✓ Lolos Standar SINTA/Scopus (>=75%)' : '⚠️ Perlu Kelengkapan Replikasi (<75%)'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#166534', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                {reproScore >= 75
                  ? 'Proyek riset telah memenuhi standar reproduktibilitas PKM Dikti dan siap untuk penyusunan manuskrip jurnal ilmiah bereputasi. Semua komponen data mentah, skrip, dan dokumentasi telah memadai.'
                  : 'Proyek masih memerlukan pemenuhan dependensi environment (seperti requirements.txt atau Dockerfile) dan pencantuman random seed sebelum dapat diajukan ke jurnal internasional.'}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => showToast('Catatan evaluasi reproduktibilitas berhasil dikirimkan ke tim mahasiswa.')}
                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', fontSize: '11.5px', fontWeight: 700, padding: '6px 14px' }}
                >
                  <span>Kirim Rekomendasi Replikasi ke Mahasiswa</span>
                </button>
              </div>
            </div>
          )}

          {/* Score Card */}
          <div className="card" style={{ padding: '24px', borderRadius: '18px', marginBottom: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  SKOR REPRODUKTIBILITAS RISET
                </div>
                <div style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1, marginTop: '4px' }}>
                  {reproScore}<span style={{ fontSize: '20px', color: '#94a3b8' }}>%</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: reproGrade.color, marginTop: '4px' }}>
                  {reproGrade.emoji} {reproGrade.label}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {totalChecked} dari {checks.length} kriteria terpenuhi
                </div>
                <div style={{ width: '200px', height: '10px', borderRadius: '5px', background: '#334155', overflow: 'hidden', marginTop: '6px' }}>
                  <div style={{ width: `${reproScore}%`, height: '100%', borderRadius: '5px', background: `linear-gradient(90deg, ${reproGrade.color}, ${reproGrade.color}88)`, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  Standar minimum jurnal internasional: 75%
                </div>
              </div>
            </div>
          </div>

          {/* Checklist by Category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map(cat => {
              const catChecks = checks.filter(c => c.category === cat.key);
              const catChecked = catChecks.filter(c => c.checked).length;
              return (
                <div key={cat.key} className="card" style={{ padding: '18px 20px', borderRadius: '16px', borderLeft: `4px solid ${cat.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cat.label}
                    </h4>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: catChecked === catChecks.length ? '#16a34a' : '#f59e0b', padding: '3px 8px', borderRadius: '6px', background: catChecked === catChecks.length ? '#f0fdf4' : '#fffbeb' }}>
                      {catChecked}/{catChecks.length} terpenuhi
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {catChecks.map(check => (
                      <label key={check.key} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '8px 10px', borderRadius: '10px', cursor: 'pointer',
                        background: check.checked ? '#f0fdf4' : '#fafafa',
                        border: `1px solid ${check.checked ? '#bbf7d0' : '#e2e8f0'}`,
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="checkbox"
                          checked={check.checked}
                          onChange={() => toggleCheck(check.key)}
                          style={{ marginTop: '2px', accentColor: '#16a34a', width: '16px', height: '16px' }}
                        />
                        <div>
                          <strong style={{ fontSize: '12.5px', color: check.checked ? '#166534' : 'var(--navy)', display: 'block' }}>
                            {check.checked ? '✓ ' : ''}{check.label}
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{check.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal Dialog Validasi Artefak oleh Dosen Pembimbing */}
      {verifyingArtifact && (
        <div className="modal-overlay active" onClick={() => setVerifyingArtifact(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <button className="modal-close" onClick={() => setVerifyingArtifact(null)}>
              &times;
            </button>

            <div className="eyebrow">Validasi Artefak Open Science</div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
              Verifikasi Artefak Data Riset
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
              Validasi keaslian, kelengkapan metadata, dan kesesuaian lisensi artefak untuk menjamin reproduktibilitas ilmiah.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>{verifyingArtifact.type.toUpperCase()}</span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Format: {verifyingArtifact.format} &middot; {verifyingArtifact.size}</span>
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block', wordBreak: 'break-all', marginBottom: '4px' }}>
                {verifyingArtifact.name}
              </strong>
              <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', marginBottom: '6px' }}>
                {verifyingArtifact.description}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Lisensi: <strong>{verifyingArtifact.license}</strong> &middot; Diunggah oleh: <strong>{verifyingArtifact.uploaded_by}</strong>
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>
                Catatan Endorsement / Validasi Pembimbing
              </label>
              <textarea
                rows={3}
                value={endorsementNote}
                onChange={e => setEndorsementNote(e.target.value)}
                placeholder="Tuliskan catatan kelayakan replikasi, rekomendasi penggunaan dataset, dll..."
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12.5px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setVerifyingArtifact(null)}>
                Batal
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleConfirmVerifyArtifact}
                style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={14} />
                <span>Setujui &amp; Verifikasi Artefak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
