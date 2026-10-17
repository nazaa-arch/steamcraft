import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, PieChart } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { projects, checkpoints, members, rubrics } = useApp();

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Selesai' || p.progress === 100).length;
  const evaluatedCount = projects.filter(p => p.evaluation_recorded === 1).length;
  const avgProgress = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) : 0;
  const blockerCount = projects.filter(p => p.blocker === 1).length;

  // Study program distribution
  const studyCounts: { [key: string]: number } = {};
  projects.forEach(p => {
    studyCounts[p.study] = (studyCounts[p.study] || 0) + 1;
  });

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Evaluasi Institusional & Penjaminan Mutu</div>
          <h2 className="h1">Analitik Kohort & Metrik Riset STEAM</h2>
          <p className="sub">
            Pemantauan agregat performa penelitian lintas disiplin, distribusi keterlibatan civitas akademika, dan
            kepatuhan standar keterbukaan data ilmiah.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Riset Terdaftar</div>
          <div className="stat-value">{totalProjects}</div>
          <div className="stat-sub">13 topik aktif di kohort ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rata-rata Kemajuan</div>
          <div className="stat-value" style={{ color: 'var(--accent-teal)' }}>
            {avgProgress}%
          </div>
          <div className="stat-sub">Berdasarkan 5 checkpoint ilmiah</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Telah Lolos Uji Rubrik</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {evaluatedCount}
          </div>
          <div className="stat-sub">Penilaian terakreditasi dosen</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Kendala Terbuka</div>
          <div className="stat-value" style={{ color: blockerCount > 0 ? 'var(--accent-orange)' : '#16a34a' }}>
            {blockerCount}
          </div>
          <div className="stat-sub">Perlu klinik metodologis</div>
        </div>
      </div>

      {/* Program Studi Distribution */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
          Distribusi Riset Berdasarkan Program Studi Asal
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
          Keterlibatan departemen dalam ekosistem riset interdisipliner civitas akademika.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(studyCounts).map(([study, count]) => {
            const pct = Math.round((count / totalProjects) * 100);
            return (
              <div key={study}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--navy)' }}>{study}</strong>
                  <span style={{ color: 'var(--muted)' }}>
                    {count} proyek ({pct}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Pillars Quality Compliance */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
          Tingkat Kepatuhan Rubrik Standar Nasional (4 Pilar)
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
          Berdasarkan penilaian resmi dari tim penilai dan guru besar pembina lomba ilmiah.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--surface-alt)', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800 }}>PILAR 1</div>
            <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Kelengkapan Tahapan</strong>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', margin: '4px 0' }}>94.2%</div>
            <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', margin: 0 }}>
              Sistematika 5 checkpoint terpenuhi secara teratur
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface-alt)', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800 }}>PILAR 2</div>
            <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Bukti Empiris & Jurnal</strong>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-teal)', margin: '4px 0' }}>91.8%</div>
            <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', margin: 0 }}>
              Sensor terkalibrasi dan logbook pengujian tercatat
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface-alt)', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800 }}>PILAR 3</div>
            <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Kontribusi Tim</strong>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-purple)', margin: '4px 0' }}>93.5%</div>
            <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', margin: 0 }}>
              Keterlibatan aktif minimal 2 program studi berbeda
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--surface-alt)', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800 }}>PILAR 4</div>
            <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Reproducibility</strong>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#16a34a', margin: '4px 0' }}>95.0%</div>
            <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', margin: 0 }}>
              Repositori kode dan artefak data dapat direplikasi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
