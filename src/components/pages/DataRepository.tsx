import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, FileText, ExternalLink, Check, AlertCircle, Upload, Link2, Plus, ChevronRight, Shield, Eye } from 'lucide-react';

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
  const { projects, currentUser } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [artifacts, setArtifacts] = useState<DataArtifact[]>(INITIAL_ARTIFACTS);
  const [checks, setChecks] = useState<ReproducibilityCheck[]>(REPRODUCIBILITY_CHECKS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'artifacts' | 'reproducibility'>('artifacts');
  const [newArtifact, setNewArtifact] = useState({ name: '', type: 'dataset', format: '', url: '', description: '', license: 'CC BY 4.0' });

  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

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
      format: newArtifact.format || newArtifact.type, size: '-', url: newArtifact.url,
      description: newArtifact.description, license: newArtifact.license,
      uploaded_by: currentUser?.name || 'Mahasiswa', uploaded_at: new Date().toISOString().split('T')[0],
      verified: false
    };
    setArtifacts(prev => [artifact, ...prev]);
    setNewArtifact({ name: '', type: 'dataset', format: '', url: '', description: '', license: 'CC BY 4.0' });
    setShowAddForm(false);
  };

  const handleVerifyArtifact = (id: number) => {
    setArtifacts(prev => prev.map(a => a.id === id ? { ...a, verified: true } : a));
  };

  const categories = [
    { key: 'data', label: '📊 Data & Dataset', color: '#2563eb' },
    { key: 'code', label: '💻 Kode & Algoritma', color: '#16a34a' },
    { key: 'env', label: '⚙️ Environment & Runtime', color: '#ea580c' },
    { key: 'docs', label: '📋 Dokumentasi & SOP', color: '#7c3aed' },
  ];

  return (
    <section className="page active" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: '1 1 320px' }}>
          <div className="eyebrow">Manajemen Artefak Digital & Standar Reproduktibilitas</div>
          <h2 className="h1" style={{ margin: '4px 0 6px 0' }}>Repository Data Empiris</h2>
          <p className="sub" style={{ margin: 0 }}>
            Kelola dataset mentah, kode sumber, protokol eksperimen, dan notebook analisis.
            Verifikasi reproduktibilitas riset sesuai standar jurnal ilmiah internasional.
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
          {showAddForm && (
            <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px', borderLeft: '5px solid #2563eb' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)', marginBottom: '14px' }}>📦 Unggah / Tautkan Artefak Riset Baru</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="auth-field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Nama File / Artefak</label>
                  <input type="text" placeholder="weather_data_clean.csv" value={newArtifact.name} onChange={e => setNewArtifact(p => ({ ...p, name: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }} />
                </div>
                <div className="auth-field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Jenis Artefak</label>
                  <select value={newArtifact.type} onChange={e => setNewArtifact(p => ({ ...p, type: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }}>
                    <option value="dataset">📊 Dataset</option>
                    <option value="code">💻 Source Code</option>
                    <option value="protocol">📋 Protokol SOP</option>
                    <option value="notebook">📓 Notebook</option>
                    <option value="model">🧠 Trained Model</option>
                  </select>
                </div>
                <div className="auth-field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>URL / Tautan (opsional)</label>
                  <input type="url" placeholder="https://github.com/..." value={newArtifact.url} onChange={e => setNewArtifact(p => ({ ...p, url: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }} />
                </div>
                <div className="auth-field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Lisensi</label>
                  <select value={newArtifact.license} onChange={e => setNewArtifact(p => ({ ...p, license: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }}>
                    <option>CC BY 4.0</option><option>CC BY-SA 4.0</option><option>MIT License</option><option>Apache 2.0</option><option>Internal Only</option>
                  </select>
                </div>
                <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Deskripsi</label>
                  <textarea rows={2} placeholder="Deskripsi artefak..." value={newArtifact.description} onChange={e => setNewArtifact(p => ({ ...p, description: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleAddArtifact} style={{ padding: '8px 16px' }}>
                    <Check size={14} /> <span>Simpan</span>
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)} style={{ padding: '8px 12px' }}>Batal</button>
                </div>
              </div>
            </div>
          )}

          {/* Artifacts Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {artifacts.map(artifact => {
              const cfg = TYPE_CONFIG[artifact.type] || TYPE_CONFIG.dataset;
              return (
                <div key={artifact.id} className="card" style={{ padding: '18px 20px', borderRadius: '14px', borderLeft: `4px solid ${cfg.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px' }}>{cfg.icon}</span>
                        <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>{artifact.name}</strong>
                        <span className={`badge badge-${artifact.type === 'dataset' ? 'blue' : artifact.type === 'code' ? 'teal' : artifact.type === 'protocol' ? 'orange' : artifact.type === 'notebook' ? 'purple' : 'teal'}`} style={{ fontSize: '10px' }}>
                          {cfg.label}
                        </span>
                        {artifact.verified && (
                          <span className="badge badge-teal" style={{ fontSize: '10px' }}>✓ Terverifikasi</span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>{artifact.description}</p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--muted)' }}>
                        <span><strong>Format:</strong> {artifact.format}</span>
                        <span><strong>Ukuran:</strong> {artifact.size}</span>
                        <span><strong>Lisensi:</strong> {artifact.license}</span>
                        <span><strong>Oleh:</strong> {artifact.uploaded_by}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {artifact.url && (
                        <a href={artifact.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '11px', textDecoration: 'none' }}>
                          <ExternalLink size={12} /> <span>Buka</span>
                        </a>
                      )}
                      {isLecturerOrAdmin && !artifact.verified && (
                        <button type="button" className="btn btn-success btn-sm" onClick={() => handleVerifyArtifact(artifact.id)} style={{ padding: '5px 10px', fontSize: '11px' }}>
                          <Check size={12} /> <span>Verifikasi</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TAB 2: REPRODUCIBILITY CHECKER */}
      {activeTab === 'reproducibility' && (
        <>
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
    </section>
  );
};
