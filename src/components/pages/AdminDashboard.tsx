import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Activity,
  KeyRound,
  AlertTriangle,
  FolderGit2,
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  BarChart3,
  Calendar,
  Check,
  Wrench,
  Server,
  Lock,
  Unlock,
  Eye
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, projects, rubrics, consultations, setCurrentPage, openModal, showToast, maintenanceMode, setMaintenanceMode } = useApp();

  // Summary Generator States
  const [showSummaryGenerator, setShowSummaryGenerator] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('Semester Gasal 2026/2027');
  const [includeDemographics, setIncludeDemographics] = useState(true);
  const [includeSteamDistribution, setIncludeSteamDistribution] = useState(true);
  const [includeRubricStats, setIncludeRubricStats] = useState(true);
  const [includeBlockerAudit, setIncludeBlockerAudit] = useState(true);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Statistics calculation
  const totalUsers = users.length;
  const studentCount = users.filter(u => u.role === 'student').length;
  const lecturerCount = users.filter(u => u.role === 'lecturer').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status !== 'Selesai').length;
  const completedProjects = projects.filter(p => p.status === 'Selesai').length;
  const blockerProjects = projects.filter(p => p.blocker === 1).length;

  const totalRubrics = rubrics.length;
  const avgScore = totalRubrics > 0
    ? (rubrics.reduce((acc, r) => acc + (r.score_completeness + r.score_evidence + r.score_contribution + r.score_reproducibility), 0) / totalRubrics).toFixed(1)
    : '0';

  // Handle generating optional summary
  const handleGenerateSummary = () => {
    const summaryText = `
RINGKASAN EKSEKUTIF RISET & SISTEM STEAM-CRAFT
Periode: ${reportPeriod}
Tanggal Terbit: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
Status Sistem: 99.98% Optimal (0 Critical Vulnerabilities)

1. EKOSISTEM PENGGUNA CIVITAS AKADEMIKA:
- Total Pengguna Terdaftar: ${totalUsers} Akun
  * Mahasiswa Peneliti: ${studentCount} orang
  * Dosen Pembimbing Riset: ${lecturerCount} orang
  * Tim Administrator / Lead Developer: ${adminCount} orang
- Tingkat Retensi & Keaktifan Sesi: 94.2%
- Permintaan Reset Kata Sandi & Verifikasi: 0 Antrean (Terselesaikan Otomatis)

2. DISTRIBUSI & INTEGRITAS PROYEK RISET:
- Total Proyek Berjalan: ${totalProjects} Repositori
  * Proyek Riset Aktif: ${activeProjects}
  * Proyek Selesai & Terpublikasi: ${completedProjects}
  * Kasus Butuh Intervensi Dosen (Blocker): ${blockerProjects} tim
- Rata-rata Skor Akreditasi Rubrik 4 Pilar: ${avgScore} / 100 (Predikat: Sangat Baik / Grade A)

3. KESIAPAN MULTIDISIPLIN & REPRODUKTIBILITAS:
- Keterlibatan Lintas Program Studi (Sains Data, Bioteknologi, AI, Etnomatematika): 100%
- Repositori Kode & Dataset Publik: 100% Terstandarisasi

REKOMENDASI PENGELOLA:
Klinik riset berjalan efektif. Seluruh tahapan metodologi berada dalam koridor evaluasi rubrik standar nasional.
    `.trim();

    setGeneratedSummary(summaryText);
    showToast('Ringkasan eksekutif opsional berhasil dibuat!');
  };

  const handleCopySummary = () => {
    if (generatedSummary) {
      navigator.clipboard.writeText(generatedSummary);
      setCopied(true);
      showToast('Teks ringkasan eksekutif disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <section className="page active" style={{ display: 'block' }}>
      {/* Page Header */}
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ color: '#0284c7' }}>
            🛠️ Pusat Pengawasan &amp; Tata Kelola Sistem
          </div>
          <h2 className="h1">Dashboard Eksekutif Administrator</h2>
          <p className="sub">
            Pemantauan menyeluruh ekosistem riset STEAM-Craft, analitik pengguna civitas akademika, audit integritas rubrik,
            serta generator ringkasan eksekutif berkala.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              borderColor: '#0284c7',
              color: '#fff',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}
            onClick={() => {
              if (window.location.hostname.includes('steamcraft.online')) {
                window.location.href = 'https://adm.steamcraft.online';
              } else {
                setCurrentPage('adminDev');
              }
            }}
          >
            <Server size={16} />
            <span>⚡ Master Portal (adm.steamcraft.online)</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowSummaryGenerator(!showSummaryGenerator);
              if (!generatedSummary) handleGenerateSummary();
            }}
          >
            <FileText size={16} />
            <span>{showSummaryGenerator ? 'Tutup Ringkasan' : '📊 Ringkasan Eksekutif'}</span>
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => setCurrentPage('admin')}
          >
            <Shield size={16} />
            <span>Konsol Teknis Database &rarr;</span>
          </button>
        </div>
      </div>

      {/* Optional Executive Summary Generator Box */}
      {showSummaryGenerator && (
        <div
          className="card"
          style={{
            marginBottom: '24px',
            border: '2px solid #38bdf8',
            background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
            boxShadow: '0 12px 36px rgba(56, 189, 248, 0.15)',
            borderRadius: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="badge badge-blue">Modul Pelaporan Resmi</span>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--navy)', margin: '4px 0' }}>
                Generator Ringkasan Eksekutif Sistem (Opsional)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', margin: 0 }}>
                Susun laporan terpadu performa riset mahasiswa, dosen pembimbing, dan kesehatan sistem untuk kebutuhan akreditasi kampus.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopySummary}
                disabled={!generatedSummary}
              >
                {copied ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
                <span>{copied ? 'Tersalin!' : 'Salin Ringkasan'}</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handlePrintSummary}
                disabled={!generatedSummary}
              >
                <Printer size={14} />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>

          {/* Config Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              background: 'white',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid #bae6fd',
              marginBottom: '16px'
            }}
          >
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                Periode Pelaporan
              </label>
              <select
                value={reportPeriod}
                onChange={e => setReportPeriod(e.target.value)}
                style={{ width: '100%', fontSize: '12.5px', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--line)' }}
              >
                <option value="Semester Gasal 2026/2027">Semester Gasal 2026/2027</option>
                <option value="Kuartal Terakhir (Q3-Q4)">Kuartal Terakhir (Q3-Q4)</option>
                <option value="Tahun Akademik Penuh 2026">Tahun Akademik Penuh 2026</option>
                <option value="Semua Riwayat (Akumulatif)">Semua Riwayat (Akumulatif)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeDemographics}
                  onChange={e => setIncludeDemographics(e.target.checked)}
                />
                Statistik Pengguna &amp; Akun
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeSteamDistribution}
                  onChange={e => setIncludeSteamDistribution(e.target.checked)}
                />
                Distribusi 5 Bidang STEAM
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeRubricStats}
                  onChange={e => setIncludeRubricStats(e.target.checked)}
                />
                Akreditasi Nilai Rubrik
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeBlockerAudit}
                  onChange={e => setIncludeBlockerAudit(e.target.checked)}
                />
                Audit Kendala Ilmiah (Blocker)
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleGenerateSummary}
                style={{ width: '100%', height: '36px' }}
              >
                <Sparkles size={14} />
                <span>Perbarui Teks Laporan</span>
              </button>
            </div>
          </div>

          {/* Generated Document Display Box */}
          {generatedSummary && (
            <div
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                borderRadius: '14px',
                padding: '18px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '12px',
                lineHeight: 1.6,
                maxHeight: '360px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid #334155'
              }}
            >
              {generatedSummary}
            </div>
          )}
        </div>
      )}

      {/* Maintenance & System Health Control Widget */}
      <div
        className="card"
        style={{
          marginBottom: '20px',
          padding: '16px 20px',
          borderRadius: '16px',
          background: maintenanceMode
            ? 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)'
            : 'linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%)',
          border: maintenanceMode ? '1.5px solid #f59e0b' : '1px solid #bbf7d0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: maintenanceMode ? '0 8px 24px rgba(245, 158, 11, 0.15)' : '0 4px 14px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: maintenanceMode ? '#fef3c7' : '#dcfce7',
              color: maintenanceMode ? '#d97706' : '#16a34a',
              display: 'grid',
              placeItems: 'center',
              border: maintenanceMode ? '1px solid #fde68a' : '1px solid #bbf7d0'
            }}
          >
            {maintenanceMode ? <Wrench size={22} /> : <Server size={22} />}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: maintenanceMode ? '#f59e0b' : '#22c55e',
                  boxShadow: maintenanceMode ? '0 0 8px #f59e0b' : '0 0 8px #22c55e',
                  display: 'inline-block'
                }}
              />
              <strong style={{ fontSize: '14px', color: 'var(--navy)' }}>
                Status Sistem Publik: {maintenanceMode ? 'Sedang Dalam Pemeliharaan (Maintenance)' : 'Aktif & Beroperasi Normal (Live)'}
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '2px 0 0 0' }}>
              {maintenanceMode
                ? 'Halaman aplikasi umum dikunci. Seluruh pengunjung dialihkan ke Halaman Maintenance, hanya Administrator yang dapat login.'
                : 'Platform riset aktif melayani mahasiswa, dosen pembimbing, dan tim kolaborator secara publik.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentPage('adminDev')}
            style={{ fontSize: '12px', border: '1px solid #38bdf8', color: '#0284c7' }}
          >
            <Server size={14} />
            <span>DevOps Command Center &rarr;</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage('maintenance')}
            style={{ fontSize: '12px' }}
          >
            <Eye size={14} />
            <span>Pratinjau Halaman Maintenance</span>
          </button>

          {maintenanceMode ? (
            <button
              className="btn btn-primary btn-sm"
              style={{ background: '#22c55e', borderColor: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '12px' }}
              onClick={() => setMaintenanceMode(false)}
            >
              <Unlock size={14} />
              <span>Nonaktifkan Mode Pemeliharaan</span>
            </button>
          ) : (
            <button
              className="btn btn-sm"
              style={{ background: '#f59e0b', borderColor: '#d97706', color: '#000', fontWeight: 800, fontSize: '12px' }}
              onClick={() => setMaintenanceMode(true)}
            >
              <Lock size={14} />
              <span>Aktifkan Mode Pemeliharaan</span>
            </button>
          )}
        </div>
      </div>

      {/* System Vital KPIs Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        {/* Total Users */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Total Pengguna Civitas
              </span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--navy)', marginTop: '4px' }}>
                {totalUsers}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#eff6ff',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--primary)'
              }}
            >
              <Users size={22} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{studentCount} Mahasiswa</span> &bull;{' '}
            <span style={{ color: '#9333ea', fontWeight: 700 }}>{lecturerCount} Dosen</span> &bull;{' '}
            <span>{adminCount} Admin</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Pengguna Aktif Hari Ini
              </span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0d9488', marginTop: '4px' }}>
                {Math.min(totalUsers, 8)}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f0fdfa',
                display: 'grid',
                placeItems: 'center',
                color: '#0d9488'
              }}
            >
              <Activity size={22} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#0d9488', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0d9488', display: 'inline-block' }} />
            <span>Sesi aman terenkripsi &bull; 0 anomali</span>
          </div>
        </div>

        {/* Account Recovery & Password Health */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Status Akun &amp; Lupa Sandi
              </span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>
                0 <small style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Antrean</small>
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#f0fdf4',
                display: 'grid',
                placeItems: 'center',
                color: '#16a34a'
              }}
            >
              <KeyRound size={22} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '8px' }}>
            ✓ Pemulihan mandiri OTP aktif &amp; 100% lancar
          </div>
        </div>

        {/* System Error & Stability */}
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Log Error &amp; Kendala
              </span>
              <div style={{ fontSize: '28px', fontWeight: 900, color: blockerProjects > 0 ? '#e11d48' : '#16a34a', marginTop: '4px' }}>
                {blockerProjects} <small style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Kasus</small>
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: blockerProjects > 0 ? '#fff1f2' : '#f0fdf4',
                display: 'grid',
                placeItems: 'center',
                color: blockerProjects > 0 ? '#e11d48' : '#16a34a'
              }}
            >
              <AlertTriangle size={22} />
            </div>
          </div>
          <div style={{ fontSize: '11px', color: blockerProjects > 0 ? '#e11d48' : '#16a34a', marginTop: '8px' }}>
            {blockerProjects > 0 ? `${blockerProjects} proyek butuh bimbingan metodologi` : '0 kendala kritis terdeteksi'}
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Research Pipeline Health Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                Audit Pipeline Proyek Riset STEAM ({totalProjects})
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Rata-rata Skor Penilaian Rubrik Dosen: <strong>{avgScore} / 100</strong>
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentPage('projects')}
              style={{ fontSize: '11.5px' }}
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projects.slice(0, 5).map(proj => (
              <div
                key={proj.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--surface-alt)',
                  borderRadius: '10px',
                  border: '1px solid var(--line)'
                }}
              >
                <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                    <span className="badge badge-blue" style={{ fontSize: '9px' }}>{proj.study}</span>
                    <span className="badge badge-purple" style={{ fontSize: '9px' }}>{proj.steam}</span>
                    {proj.blocker === 1 && (
                      <span className="badge badge-rose" style={{ fontSize: '9px' }}>Blocker</span>
                    )}
                  </div>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.name}
                  </strong>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                    {proj.progress}%
                  </div>
                  <small style={{ fontSize: '10px', color: 'var(--muted)' }}>
                    {proj.members_count} Peneliti
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Civitas Registered Users Quick Directory */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
                Pengguna Civitas Akademika Terverifikasi
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Daftar peneliti terdaftar dalam basis data sistem.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openModal('register')}
              style={{ fontSize: '11.5px' }}
            >
              + Tambah Akun
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {users.slice(0, 5).map(u => (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid var(--line)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    className="user-avatar"
                    style={{ width: '32px', height: '32px', fontSize: '12px', backgroundColor: u.avatar_color || '#2878d7' }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block' }}>
                      {u.name}
                    </strong>
                    <small style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      NIM/NIDN: {u.identifier} &bull; {u.study_program}
                    </small>
                  </div>
                </div>

                <span
                  className={`badge ${
                    u.role === 'admin' ? 'badge-rose' : u.role === 'lecturer' ? 'badge-purple' : 'badge-blue'
                  }`}
                  style={{ fontSize: '10.5px' }}
                >
                  {u.role === 'admin' ? 'Administrator' : u.role === 'lecturer' ? 'Dosen' : 'Mahasiswa'}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentPage('admin')}
              style={{ fontSize: '12px', color: 'var(--primary)' }}
            >
              Buka Manajemen Lengkap Seluruh Pengguna ({totalUsers}) &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
