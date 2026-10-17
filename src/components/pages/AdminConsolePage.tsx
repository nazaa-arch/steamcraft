import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Database, RefreshCw, Download, UserCheck, Settings, AlertOctagon } from 'lucide-react';

export const AdminConsolePage: React.FC = () => {
  const { appMode, setAppMode, users, projects, resetAllData, exportDataJson, openModal } = useApp();
  const [userSearch, setUserSearch] = useState('');

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steamcraft-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetConfirm = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database kembali ke setelan default awal demo? Tindakan ini tidak dapat dibatalkan.')) {
      resetAllData();
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.identifier.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.study_program.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <section className="page active">
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ color: '#0284c7' }}>
            🛠️ Administrator & Lead Developer Control
          </div>
          <h2 className="h1">Konsol Administrasi Sistem</h2>
          <p className="sub">
            Tata kelola akun civitas akademika, audit integritas repositori ilmiah, pemeliharaan basis data, dan kontrol
            mode operasional sistem.
          </p>
        </div>
      </div>

      {/* Dual Mode Switcher Card */}
      <div className="card" style={{ marginBottom: '24px', border: '1px solid #38bdf8', background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-blue">Sistem Multi-Mode</span>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--navy)', margin: '4px 0' }}>
              Mode Operasi Sistem STEAM-Craft
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', margin: 0 }}>
              Pilih antara lingkungan demo terisi data lengkap untuk pameran atau lingkungan operasional riil.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn ${appMode === 'demo' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setAppMode('demo')}
            >
              <span>Mode Demo (Showcase Lomba)</span>
            </button>
            <button
              className={`btn ${appMode === 'production' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setAppMode('production')}
            >
              <span>Mode Operasional Riil</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: '12px', background: 'white', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bfdbfe', color: '#0369a1' }}>
          <strong>Status Mode Saat Ini:</strong>{' '}
          {appMode === 'demo'
            ? '✓ Aktif Mode Demo — Menampilkan 13 proyek sains data, bioteknologi, robotika, dan etnomatematika lengkap beserta riwayat logbook dan rubrik.'
            : '✓ Aktif Mode Operasional Riil — Ditujukan untuk implementasi nyata di lingkungan kampus dengan isolasi data mandiri.'}
        </div>
      </div>

      {/* Database Maintenance and Backup */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
          Audit & Pemeliharaan Database
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '16px' }}>
          Ekspor cadangan data JSON terenkripsi atau pulihkan basis data ke konfigurasi pabrik.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleDownloadBackup}>
            <Download size={14} />
            <span>Ekspor Cadangan Data (.json)</span>
          </button>
          <button className="btn btn-danger" onClick={handleResetConfirm}>
            <RefreshCw size={14} />
            <span>Reset Database ke Setelan Awal Demo</span>
          </button>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>
              Manajemen Pengguna Civitas Akademika ({users.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Daftar akun mahasiswa peneliti, dosen pembimbing, dan administrator sistem.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Cari nama, NIM/NIDN, prodi..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              style={{ width: '220px', fontSize: '12.5px' }}
            />
            <button className="btn btn-primary btn-sm" onClick={() => openModal('register')}>
              <span>+ Daftarkan Akun</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: 800 }}>PENGGUNA</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: 800 }}>PERAN</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: 800 }}>NIM / NIDN</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: 800 }}>PROGRAM STUDI & INSTITUSI</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: 800 }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line-light)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        className="user-avatar"
                        style={{ width: '28px', height: '28px', fontSize: '11px', backgroundColor: u.avatar_color || '#2878d7' }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--navy)', display: 'block' }}>{u.name}</strong>
                        <small style={{ color: 'var(--muted)' }}>@{u.username}</small>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      className={`badge ${
                        u.role === 'admin' ? 'badge-rose' : u.role === 'lecturer' ? 'badge-purple' : 'badge-blue'
                      }`}
                    >
                      {u.role === 'admin' ? 'Administrator' : u.role === 'lecturer' ? 'Dosen' : 'Mahasiswa'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600 }}>
                    {u.identifier}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div>{u.study_program}</div>
                    <small style={{ color: 'var(--muted)' }}>{u.university}</small>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openModal('profile', u)}
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      <span>Edit Profil</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
