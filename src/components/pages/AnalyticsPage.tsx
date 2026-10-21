import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, PieChart, Star, Award, GraduationCap } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { projects, checkpoints, members, rubrics } = useApp();
  const [filterBelgisOnly, setFilterBelgisOnly] = useState(false);

  const belgisProjectsCount = projects.filter(p => p.lecturer?.includes('Belgis')).length;
  const displayProjects = filterBelgisOnly
    ? projects.filter(p => p.lecturer?.includes('Belgis'))
    : projects;

  const totalProjects = displayProjects.length;
  const evaluatedCount = displayProjects.filter(p => p.evaluation_recorded === 1).length;
  const avgProgress = totalProjects > 0 ? Math.round(displayProjects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) : 0;
  const blockerCount = displayProjects.filter(p => p.blocker === 1).length;

  // Study program distribution (Sorted so Sains Data / Home Base is at the top)
  const studyCounts: { [key: string]: number } = {};
  displayProjects.forEach(p => {
    studyCounts[p.study] = (studyCounts[p.study] || 0) + 1;
  });

  const sortedStudies = Object.entries(studyCounts).sort(([studyA], [studyB]) => {
    if (studyA.includes('Sains Data')) return -1;
    if (studyB.includes('Sains Data')) return 1;
    return 0;
  });

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow">Evaluasi Institusional &amp; Penjaminan Mutu</div>
          <h2 className="h1">Analitik Kohort &amp; Metrik Riset STEAM</h2>
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
          <div className="stat-sub">
            {filterBelgisOnly ? 'Topik bimbingan Dr. Belgis' : '13 topik aktif di kohort ini'}
          </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px 0' }}>
              Distribusi Riset Berdasarkan Program Studi Asal
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
              Keterlibatan departemen dalam ekosistem riset interdisipliner civitas akademika FMIPA UNESA.
            </p>
          </div>

          {/* Quick Filter Switcher */}
          <div style={{ display: 'flex', gap: '6px', background: 'var(--surface-alt)', padding: '4px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <button
              type="button"
              className={`btn btn-sm ${!filterBelgisOnly ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterBelgisOnly(false)}
              style={{ fontSize: '11.5px', padding: '4px 10px', height: '28px' }}
            >
              Semua Prodi ({projects.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterBelgisOnly ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilterBelgisOnly(true)}
              style={{ fontSize: '11.5px', padding: '4px 10px', height: '28px' }}
            >
              ⭐ Bimbingan Dr. Belgis ({belgisProjectsCount})
            </button>
          </div>
        </div>

        {/* Informational Callout Box: Home Base Dosen Belgis */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            margin: '14px 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '18px'
              }}
            >
              👩‍🏫
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
                Home Base Dosen Pembimbing:{' '}
                <span style={{ color: '#0284c7' }}>Program Studi S1 Sains Data — FMIPA UNESA</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                Dr. Belgis Ainatul Iza, S.Si., M.Mat. (NIP: 202509237 • belgisiza@unesa.ac.id)
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              border: '1px solid rgba(37, 99, 235, 0.25)'
            }}
          >
            Fokus: Sains Data, AI &amp; Pemodelan Matematika
          </span>
        </div>

        {/* Distribution Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedStudies.map(([study, count]) => {
            const isHomeBase = study.toLowerCase().includes('sains data');
            const pct = Math.round((count / totalProjects) * 100);
            return (
              <div
                key={study}
                style={{
                  padding: isHomeBase ? '10px 14px' : '0',
                  background: isHomeBase ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                  borderRadius: isHomeBase ? '10px' : '0',
                  border: isHomeBase ? '1px solid rgba(37, 99, 235, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ color: isHomeBase ? '#1d4ed8' : 'var(--navy)' }}>
                      {study}
                    </strong>
                    {isHomeBase && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '1px 7px',
                          borderRadius: '6px',
                          background: '#2563eb',
                          color: '#fff',
                          letterSpacing: '0.3px'
                        }}
                      >
                        ★ HOME BASE DOSEN BELGIS
                      </span>
                    )}
                  </div>
                  <span style={{ color: isHomeBase ? '#1d4ed8' : 'var(--muted)', fontWeight: isHomeBase ? 700 : 500 }}>
                    {count} proyek ({pct}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: isHomeBase
                        ? 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)'
                        : undefined
                    }}
                  />
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
            <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>Bukti Empiris &amp; Jurnal</strong>
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
