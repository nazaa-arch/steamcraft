import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Award, FileText, ChevronRight, Save } from 'lucide-react';

export const MissionControlPage: React.FC = () => {
  const { projects, rubrics, saveRubric, toggleBlocker, setSelectedProjectId, setCurrentPage } = useApp();

  const [selectedId, setSelectedId] = useState<number>(projects[0]?.id || 1);
  const [filterMode, setFilterMode] = useState<'all' | 'blocker' | 'review' | 'done'>('all');

  const activeProject = projects.find(p => p.id === selectedId) || projects[0];
  const existingRubric = rubrics.find(r => r.project_id === activeProject?.id);

  // Rubric score states
  const [scoreCompleteness, setScoreCompleteness] = useState<number>(existingRubric?.score_completeness || 23.5);
  const [scoreEvidence, setScoreEvidence] = useState<number>(existingRubric?.score_evidence || 23.0);
  const [scoreContribution, setScoreContribution] = useState<number>(existingRubric?.score_contribution || 24.0);
  const [scoreReproducibility, setScoreReproducibility] = useState<number>(existingRubric?.score_reproducibility || 23.5);
  const [evalFeedback, setEvalFeedback] = useState<string>(
    existingRubric?.feedback || 'Penelitian menunjukkan kedalaman metodologi dan dokumentasi data empiris yang sangat baik.'
  );

  // Update form if selected project changes
  const handleSelectProject = (id: number) => {
    setSelectedId(id);
    const r = rubrics.find(rub => rub.project_id === id);
    if (r) {
      setScoreCompleteness(r.score_completeness);
      setScoreEvidence(r.score_evidence);
      setScoreContribution(r.score_contribution);
      setScoreReproducibility(r.score_reproducibility);
      setEvalFeedback(r.feedback || '');
    } else {
      setScoreCompleteness(23.5);
      setScoreEvidence(23.0);
      setScoreContribution(24.0);
      setScoreReproducibility(23.5);
      setEvalFeedback('Penelitian menunjukkan kedalaman metodologi dan dokumentasi data empiris yang sangat baik.');
    }
  };

  const totalScore = Number((scoreCompleteness + scoreEvidence + scoreContribution + scoreReproducibility).toFixed(1));

  const handleSaveRubric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    saveRubric(
      activeProject.id,
      {
        completeness: scoreCompleteness,
        evidence: scoreEvidence,
        contribution: scoreContribution,
        reproducibility: scoreReproducibility
      },
      evalFeedback
    );
  };

  const filteredProjects = projects.filter(p => {
    if (filterMode === 'blocker') return p.blocker === 1;
    if (filterMode === 'review') return p.status === 'Review diajukan' || (p.progress >= 80 && p.status !== 'Selesai');
    if (filterMode === 'done') return p.status === 'Selesai';
    return true;
  });

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Mission Control & Supervisi Dosen</div>
          <h2 className="h1">Pusat Evaluasi Rubrik & Supervisi Riset</h2>
          <p className="sub">
            Pantau seluruh tim bimbingan, berikan intervensi klinik pada kendala metodologis, dan lakukan penilaian
            berbasis 4 pilar standar STEAM-Craft.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mission-tabs">
        <button
          className={`mission-tab-btn ${filterMode === 'all' ? 'active' : ''}`}
          onClick={() => setFilterMode('all')}
        >
          <div className="mission-mode-num">{projects.length}</div>
          <div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--navy)' }}>Semua Proyek</strong>
            <small style={{ fontSize: '11px', color: 'var(--muted)' }}>Dalam supervisi</small>
          </div>
        </button>

        <button
          className={`mission-tab-btn ${filterMode === 'blocker' ? 'active' : ''}`}
          onClick={() => setFilterMode('blocker')}
        >
          <div className="mission-mode-num" style={{ color: '#e11d48', borderColor: '#fecdd3' }}>
            {projects.filter(p => p.blocker === 1).length}
          </div>
          <div>
            <strong style={{ fontSize: '13px', display: 'block', color: '#e11d48' }}>Kendala (Blocker)</strong>
            <small style={{ fontSize: '11px', color: 'var(--muted)' }}>Butuh klinik segera</small>
          </div>
        </button>

        <button
          className={`mission-tab-btn ${filterMode === 'review' ? 'active' : ''}`}
          onClick={() => setFilterMode('review')}
        >
          <div className="mission-mode-num" style={{ color: 'var(--accent-teal)' }}>
            {projects.filter(p => p.status === 'Review diajukan' || (p.progress >= 80 && p.status !== 'Selesai')).length}
          </div>
          <div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--navy)' }}>Siap Evaluasi</strong>
            <small style={{ fontSize: '11px', color: 'var(--muted)' }}>Checkpoint &ge; 80%</small>
          </div>
        </button>

        <button
          className={`mission-tab-btn ${filterMode === 'done' ? 'active' : ''}`}
          onClick={() => setFilterMode('done')}
        >
          <div className="mission-mode-num" style={{ color: '#16a34a' }}>
            {projects.filter(p => p.status === 'Selesai').length}
          </div>
          <div>
            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--navy)' }}>Telah Selesai</strong>
            <small style={{ fontSize: '11px', color: 'var(--muted)' }}>Terbit sertifikat</small>
          </div>
        </button>
      </div>

      {/* Master-Detail Layout */}
      <div className="mission-master-detail">
        {/* Left Master List */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>
            Daftar Proyek Riset ({filteredProjects.length})
          </h4>
          <div className="mission-project-list">
            {filteredProjects.map(proj => (
              <div
                key={proj.id}
                className={`project-list-item ${proj.id === selectedId ? 'selected' : ''}`}
                onClick={() => handleSelectProject(proj.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>{proj.study}</span>
                  {proj.blocker === 1 && (
                    <span className="badge badge-rose" style={{ fontSize: '9px' }}>Blocker</span>
                  )}
                  {proj.status === 'Selesai' && (
                    <span className="badge badge-teal" style={{ fontSize: '9px' }}>Selesai</span>
                  )}
                </div>
                <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block', lineHeight: 1.3 }}>
                  {proj.name}
                </strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                  <span>Progres: {proj.progress}%</span>
                  <span>{proj.members_count} Anggota</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Inspector & Rubric Form */}
        {activeProject && (
          <div className="project-inspector">
            <div className="inspector-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-blue">{activeProject.study}</span>
                    <span className="badge badge-purple">{activeProject.steam}</span>
                    <span className={`badge ${activeProject.blocker ? 'badge-rose' : 'badge-teal'}`}>
                      {activeProject.blocker ? '⚠️ Memerlukan Bimbingan' : activeProject.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--navy)', lineHeight: 1.2 }}>
                    {activeProject.name}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
                    {activeProject.desc}
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm inspector-ws-btn"
                  onClick={() => {
                    setSelectedProjectId(activeProject.id);
                    setCurrentPage('workspace');
                  }}
                >
                  <span>Buka Ruang Kerja &rarr;</span>
                </button>
              </div>

              {activeProject.blocker === 1 && (
                <div
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    marginTop: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12.5px', color: '#9f1239' }}>Kendala Ilmiah Mahasiswa:</strong>
                    <div style={{ fontSize: '12px', color: '#881337', marginTop: '2px' }}>
                      {activeProject.blocker_reason}
                    </div>
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => toggleBlocker(activeProject.id, '')}
                  >
                    <span>✓ Tandai Selesai Diintervensi</span>
                  </button>
                </div>
              )}
            </div>

            {/* Rubric Evaluation Form */}
            <form onSubmit={handleSaveRubric}>
              <div className="rubric-form-header">
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                    Form Penilaian Rubrik STEAM (Standar Nasional)
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '2px 0 0 0' }}>
                    Setiap pilar dinilai dengan rentang 0.0 - 25.0 (Total akumulasi 100).
                  </p>
                </div>
                <div
                  className={`rubric-valid-pill ${totalScore >= 70 ? 'valid' : 'invalid'}`}
                >
                  <span className="rubric-pill-total">Total: {totalScore}</span>
                  <span className="rubric-pill-divider">•</span>
                  <span className="rubric-pill-grade">
                    {totalScore >= 90 ? 'Grade A' : totalScore >= 80 ? 'Grade A-' : totalScore >= 70 ? 'Grade B+' : 'Grade B'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div className="rubric-row">
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>1. Kelengkapan Tahapan (Completeness)</strong>
                    <div className="rubric-subtext" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Penyelesaian 5 tahapan riset ilmiah secara terstruktur (Bobot 25%)
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={scoreCompleteness}
                    onChange={e => setScoreCompleteness(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="rubric-row">
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>2. Bukti Empiris & Jurnal (Evidence)</strong>
                    <div className="rubric-subtext" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Data laboratorium terkalibrasi, logbook riset, dan analisis galat (Bobot 25%)
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={scoreEvidence}
                    onChange={e => setScoreEvidence(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="rubric-row">
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>3. Kontribusi Multidisiplin (Contribution)</strong>
                    <div className="rubric-subtext" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Keterpaduan peran kolaborator lintas prodi dan implementasi solusi (Bobot 25%)
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={scoreContribution}
                    onChange={e => setScoreContribution(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="rubric-row">
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)' }}>4. Reproducibility & Artefak (Reproducibility)</strong>
                    <div className="rubric-subtext" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Ketersediaan kode, dataset publik, dan kepatuhan replikasi pihak ketiga (Bobot 25%)
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={scoreReproducibility}
                    onChange={e => setScoreReproducibility(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Umpan Balik Kualitatif & Rekomendasi Manuskrip Ilmiah</label>
                <textarea
                  rows={3}
                  value={evalFeedback}
                  onChange={e => setEvalFeedback(e.target.value)}
                  placeholder="Berikan masukan mendalam mengenai metodologi, kesiapan publikasi jurnal, atau saran pengembangan prototipe..."
                  required
                />
              </div>

              <div className="rubric-submit-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary rubric-submit-btn">
                  <Save size={15} />
                  <span>Simpan & Terbitkan Hasil Evaluasi Rubrik</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
