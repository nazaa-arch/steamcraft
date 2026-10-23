import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Download, Check, FileText, Plus, Clock, User, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   FITUR 2 — GENERATOR LOGBOOK RISET & EKSPOR PDF RESMI
   Standar SIMBELMAWA / PKM Dikti + Tanda Tangan Digital
   ────────────────────────────────────────────────────────── */

interface LogbookEntry {
  id: number;
  date: string;
  duration: string;
  activity: string;
  achievement: string;
  evidence_link: string;
  verified: boolean;
  verified_by: string;
  notes: string;
}

const INITIAL_ENTRIES: LogbookEntry[] = [
  {
    id: 1, date: '2026-10-15', duration: '3 jam', activity: 'Eksplorasi dataset cuaca BMKG & preprocessing missing values',
    achievement: 'Dataset bersih (12.000 baris × 14 fitur) siap untuk pelatihan model LSTM',
    evidence_link: 'https://colab.research.google.com/steam-weather', verified: true,
    verified_by: 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.', notes: 'Data sudah cukup representatif untuk 3 tahun terakhir.'
  },
  {
    id: 2, date: '2026-10-17', duration: '4 jam', activity: 'Pelatihan model LSTM & optimasi hyperparameter (learning rate, epochs)',
    achievement: 'Akurasi prediksi 87.3% (MAE: 1.2°C) pada data validasi',
    evidence_link: 'https://github.com/nazaa-arch/steamcraft', verified: true,
    verified_by: 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.', notes: 'Pertimbangkan ensemble dengan XGBoost untuk meningkatkan akurasi.'
  },
  {
    id: 3, date: '2026-10-19', duration: '2 jam', activity: 'Kalibrasi sensor suhu DHT22 & uji konektivitas modul LoRa SX1278',
    achievement: 'Transmisi telemetri berhasil pada jarak 850m line-of-sight',
    evidence_link: '', verified: false, verified_by: '', notes: ''
  },
  {
    id: 4, date: '2026-10-21', duration: '5 jam', activity: 'Desain dashboard visualisasi cuaca real-time dengan chart interaktif',
    achievement: 'Prototipe UI dashboard v1 selesai, siap presentasi ke dosen pembimbing',
    evidence_link: 'https://figma.com/steam-dashboard-v1', verified: false, verified_by: '', notes: ''
  },
  {
    id: 5, date: '2026-10-22', duration: '3 jam', activity: 'Penulisan bab 3 metodologi & analisis statistik deskriptif dataset',
    achievement: 'Draft bab 3 terselesaikan (15 halaman), tabel distribusi data & uji normalitas',
    evidence_link: '', verified: false, verified_by: '', notes: ''
  }
];

const formatHumanDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const ResearchLogbook: React.FC = () => {
  const { currentUser, projects } = useApp();
  const [entries, setEntries] = useState<LogbookEntry[]>(INITIAL_ENTRIES);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: '', duration: '', activity: '', achievement: '', evidence_link: '' });

  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const totalPages = Math.max(1, Math.ceil(entries.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pagedEntries = entries.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const verifiedCount = entries.filter(e => e.verified).length;
  const totalHours = entries.reduce((sum, e) => {
    const num = parseInt(e.duration) || 0;
    return sum + num;
  }, 0);

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.activity) return;
    const entry: LogbookEntry = {
      id: Date.now(),
      date: newEntry.date,
      duration: newEntry.duration || '1 jam',
      activity: newEntry.activity,
      achievement: newEntry.achievement,
      evidence_link: newEntry.evidence_link,
      verified: false, verified_by: '', notes: ''
    };
    setEntries(prev => [entry, ...prev]);
    setNewEntry({ date: '', duration: '', activity: '', achievement: '', evidence_link: '' });
    setShowAddForm(false);
    setPage(1);
  };

  const handleVerify = (id: number) => {
    setEntries(prev => prev.map(e => e.id === id ? {
      ...e,
      verified: true,
      verified_by: 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.',
      notes: e.notes || 'Kegiatan riset terverifikasi oleh dosen pembimbing.'
    } : e));
  };

  const handleDelete = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = entries.map((e, i) => `
      <tr>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:center">${i + 1}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;font-weight:600">${formatHumanDate(e.date)}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:center">${e.duration}</td>
        <td style="padding:8px;border:1px solid #cbd5e1">${e.activity}</td>
        <td style="padding:8px;border:1px solid #cbd5e1">${e.achievement}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:center;font-weight:700;color:${e.verified ? '#16a34a' : '#f59e0b'}">${e.verified ? '✓ Terverifikasi' : '⏳ Menunggu'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Logbook Riset - ${selectedProject?.name || 'STEAM-Craft'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Times New Roman', serif; }
    body { padding: 40px 50px; color: #0f172a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px double #0f172a; padding-bottom: 16px; }
    .header h1 { font-size: 18px; letter-spacing: 2px; margin-bottom: 4px; }
    .header h2 { font-size: 15px; font-weight: 400; margin-bottom: 4px; }
    .header p { font-size: 12px; color: #475569; }
    .info-table { width: 100%; margin-bottom: 20px; font-size: 13px; }
    .info-table td { padding: 4px 8px; vertical-align: top; }
    .info-table .label { font-weight: 700; width: 140px; }
    table.logbook { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 30px; }
    table.logbook th { background: #0f172a; color: white; padding: 8px; border: 1px solid #0f172a; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .signature { display: flex; justify-content: space-between; margin-top: 40px; }
    .sig-block { text-align: center; width: 45%; }
    .sig-line { border-bottom: 1px solid #0f172a; margin: 50px auto 6px; width: 200px; }
    .sig-name { font-weight: 700; font-size: 13px; }
    .sig-title { font-size: 11px; color: #475569; }
    .qr-section { text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; }
    @media print { body { padding: 20px 30px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>LOGBOOK KEGIATAN RISET ILMIAH</h1>
    <h2>Platform STEAM-Craft — Inkubasi Riset Multidisiplin</h2>
    <p>Universitas Negeri Surabaya (UNESA) • Fakultas Matematika dan Ilmu Pengetahuan Alam</p>
  </div>

  <table class="info-table">
    <tr><td class="label">Nama Proyek Riset</td><td>: ${selectedProject?.name || '-'}</td></tr>
    <tr><td class="label">Peneliti / Mahasiswa</td><td>: ${currentUser?.name || 'Budi Santoso'} (${currentUser?.identifier || '202610101'})</td></tr>
    <tr><td class="label">Dosen Pembimbing</td><td>: Dr. Belgis Ainatul Iza, S.Si., M.Mat. (NIP 202509237)</td></tr>
    <tr><td class="label">Program Studi</td><td>: S1 Sains Data — FMIPA UNESA</td></tr>
    <tr><td class="label">Total Kegiatan</td><td>: ${entries.length} Sesi (${totalHours} Jam Akumulatif)</td></tr>
    <tr><td class="label">Status Verifikasi</td><td>: ${verifiedCount} dari ${entries.length} sesi telah diverifikasi dosen pembimbing</td></tr>
  </table>

  <table class="logbook">
    <thead>
      <tr>
        <th style="width:30px">No</th>
        <th style="width:130px">Tanggal</th>
        <th style="width:55px">Durasi</th>
        <th>Kegiatan & Uraian</th>
        <th>Capaian & Hasil</th>
        <th style="width:90px">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="signature">
    <div class="sig-block">
      <p>Surabaya, ${formatHumanDate(new Date().toISOString().split('T')[0])}</p>
      <p>Peneliti / Mahasiswa</p>
      <div class="sig-line"></div>
      <p class="sig-name">${currentUser?.name || 'Budi Santoso'}</p>
      <p class="sig-title">NIM ${currentUser?.identifier || '202610101'}</p>
    </div>
    <div class="sig-block">
      <p>Menyetujui,</p>
      <p>Dosen Pembimbing</p>
      <div class="sig-line"></div>
      <p class="sig-name">Dr. Belgis Ainatul Iza, S.Si., M.Mat.</p>
      <p class="sig-title">NIP 202509237</p>
    </div>
  </div>

  <div class="qr-section">
    <p>Dokumen ini dicetak secara otomatis oleh platform STEAM-Craft pada ${new Date().toLocaleString('id-ID')}.</p>
    <p>Verifikasi keaslian: https://app.steamcraft.online/verify/${Date.now()}</p>
  </div>

  <script>window.print();</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <section className="page active" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: '1 1 320px' }}>
          <div className="eyebrow">Dokumentasi & Pencatatan Riset Harian</div>
          <h2 className="h1" style={{ margin: '4px 0 6px 0' }}>Logbook Riset Ilmiah</h2>
          <p className="sub" style={{ margin: 0 }}>
            Catatan kronologis kegiatan riset harian/mingguan dengan verifikasi dosen pembimbing
            dan ekspor PDF resmi berformat standar SIMBELMAWA / PKM Dikti.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignSelf: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(Number(e.target.value))}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--line)', fontSize: '13px', fontWeight: 700, background: 'white' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button type="button" className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)} style={{ padding: '8px 14px' }}>
            <Plus size={15} />
            <span>Catat Kegiatan</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleExportPDF} style={{ padding: '8px 14px' }}>
            <Download size={15} />
            <span>Unduh PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Sesi Riset', value: entries.length, unit: 'Sesi', color: '#2563eb', icon: '📋' },
          { label: 'Jam Akumulatif', value: totalHours, unit: 'Jam', color: '#0d9488', icon: '⏱️' },
          { label: 'Terverifikasi Dosen', value: verifiedCount, unit: `/ ${entries.length}`, color: '#16a34a', icon: '✅' },
          { label: 'Menunggu Verifikasi', value: entries.length - verifiedCount, unit: 'Sesi', color: '#f59e0b', icon: '⏳' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: stat.color }}>{stat.value} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>{stat.unit}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px', borderLeft: '5px solid #2563eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)', marginBottom: '14px' }}>📝 Catat Kegiatan Riset Baru</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field">
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Tanggal Kegiatan</label>
              <input type="date" value={newEntry.date} onChange={e => setNewEntry(p => ({ ...p, date: e.target.value }))} required style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }} />
            </div>
            <div className="auth-field">
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Durasi</label>
              <input type="text" placeholder="Contoh: 3 jam" value={newEntry.duration} onChange={e => setNewEntry(p => ({ ...p, duration: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }} />
            </div>
            <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Kegiatan & Uraian</label>
              <textarea rows={2} placeholder="Deskripsikan kegiatan riset yang dilakukan..." value={newEntry.activity} onChange={e => setNewEntry(p => ({ ...p, activity: e.target.value }))} required style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', resize: 'vertical' }} />
            </div>
            <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Capaian & Hasil</label>
              <textarea rows={2} placeholder="Apa yang berhasil dicapai..." value={newEntry.achievement} onChange={e => setNewEntry(p => ({ ...p, achievement: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', resize: 'vertical' }} />
            </div>
            <div className="auth-field">
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Tautan Bukti (opsional)</label>
              <input type="url" placeholder="https://colab.research.google.com/..." value={newEntry.evidence_link} onChange={e => setNewEntry(p => ({ ...p, evidence_link: e.target.value }))} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddEntry} style={{ padding: '8px 16px' }}>
                <Check size={14} /> <span>Simpan Entri</span>
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)} style={{ padding: '8px 12px' }}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logbook Table */}
      <div className="card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
            📋 Riwayat Logbook — {selectedProject?.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }} style={{ padding: '3px 6px', borderRadius: '6px', border: '1px solid var(--line)', fontSize: '12px', fontWeight: 700 }}>
              <option value={3}>3</option><option value={5}>5</option><option value={10}>10</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', background: '#f8fafc', color: 'var(--navy)' }}>
                <th style={{ padding: '10px 12px', width: '40px', fontWeight: 800 }}>NO</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>TANGGAL</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, width: '60px' }}>DURASI</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>KEGIATAN & URAIAN</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>CAPAIAN</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {pagedEntries.map((entry, i) => {
                const rowNum = (currentPage - 1) * rowsPerPage + i + 1;
                return (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--muted)' }}>{rowNum}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '12px' }}>{formatHumanDate(entry.date)}</div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {entry.duration}
                      </div>
                    </td>
                    <td style={{ padding: '12px', maxWidth: '250px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>{entry.activity}</div>
                      {entry.evidence_link && (
                        <a href={entry.evidence_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                          <FileText size={11} /> Bukti Digital &rarr;
                        </a>
                      )}
                    </td>
                    <td style={{ padding: '12px', maxWidth: '220px' }}>
                      <div style={{ color: 'var(--ink-secondary)', lineHeight: 1.4 }}>{entry.achievement || '-'}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {entry.verified ? (
                        <div>
                          <span className="badge badge-teal" style={{ fontSize: '10px' }}>✓ Terverifikasi</span>
                          <div style={{ fontSize: '10px', color: '#15803d', marginTop: '3px', fontWeight: 600 }}>
                            oleh {entry.verified_by.split(',')[0]}
                          </div>
                          {entry.notes && (
                            <div style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '2px', fontStyle: 'italic' }}>
                              "{entry.notes}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-orange" style={{ fontSize: '10px' }}>⏳ Menunggu</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        {isLecturerOrAdmin && !entry.verified && (
                          <button type="button" className="btn btn-success btn-sm" onClick={() => handleVerify(entry.id)} style={{ padding: '4px 8px', fontSize: '11px' }} title="Verifikasi sebagai Dosen Pembimbing">
                            <Check size={12} /> <span>Verifikasi</span>
                          </button>
                        )}
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleDelete(entry.id)} style={{ padding: '4px 6px', color: '#e11d48' }} title="Hapus entri">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              Menampilkan {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, entries.length)} dari {entries.length} entri
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPage === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={13} /> <span>Prev</span>
              </button>
              <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{currentPage} / {totalPages}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPage === totalPages ? 0.5 : 1 }}>
                <span>Next</span> <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
