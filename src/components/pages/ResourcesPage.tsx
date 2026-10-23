import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  FlaskConical,
  Wifi,
  Layers,
  Check,
  X,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { currentUser, resourceRequests, updateResourceStatus, openModal, projects } = useApp();
  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';

  // Pagination state for Pending Requests Table
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingRowsPerPage, setPendingRowsPerPage] = useState(5);

  // Pagination state for Approved/History Table
  const [historyPage, setHistoryPage] = useState(1);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(5);

  const campusFacilities = [
    {
      name: 'GPU Workstation (NVIDIA RTX 4090)',
      category: 'Komputasi & AI',
      desc: 'Server komputasi akselerasi paralel untuk pelatihan model Deep Learning, Computer Vision, dan komputasi sains.',
      specs: ['24GB VRAM GDDR6X', 'CUDA 12.4', 'PyTorch & TensorFlow', 'PCIe 4.0'],
      status: 'Tersedia (Quota 4 Jam / Sesi)',
      badgeColor: 'badge-teal'
    },
    {
      name: 'Printer 3D & Rapid Prototyping Workshop',
      category: 'Rekayasa & Fabrikasi',
      desc: 'Pencetakan casing sirkuit terpadu, enclosure sensor outdoor tahan air, dan mounting robotika asistif.',
      specs: ['Filamen PLA/PETG/ABS', 'Nozzle 0.4mm', 'Akurasi 0.05mm', 'Volume 300x300mm'],
      status: 'Tersedia (Bahan Disediakan Lab)',
      badgeColor: 'badge-blue'
    },
    {
      name: 'Kit Mikrokontroler & Modul LoRa SX1278',
      category: 'Sensor & IoT',
      desc: 'Modul transmisi telemetri nirkabel jarak jauh (Long Range) berdaya rendah untuk jaringan stasiun sensor outdoor.',
      specs: ['Frekuensi 433/915 MHz', 'SPI Interface', 'Antena 5dBi High-Gain', 'Low Power Sleep'],
      status: 'Tersedia (Peminjaman Maks 14 Hari)',
      badgeColor: 'badge-orange'
    },
    {
      name: 'Spektrofotometer UV-Vis & FTIR',
      category: 'Kimia & Bioteknologi',
      desc: 'Analisis kualitatif dan kuantitatif gugus fungsi organik, adsorpsi polimer, dan uji konsentrasi larutan.',
      specs: ['Rentang 190 - 1100 nm', 'Dual Beam Optik', 'Kuvet Kuarsa UV Grade', 'Software Spektra'],
      status: 'Perlu Pendampingan Asisten Lab',
      badgeColor: 'badge-purple'
    }
  ];

  // Helper date formatter: e.g. "22 Okt 2026"
  const formatHumanDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Split requests into 2 distinct datasets (as requested by Dosen Belgis)
  const pendingRequests = resourceRequests.filter(r => r.status === 'Menunggu');
  const approvedRequests = resourceRequests.filter(r => r.status === 'Disetujui' || r.status === 'Selesai' || r.status === 'Ditolak');

  // Pending pagination slice
  const totalPendingPages = Math.max(1, Math.ceil(pendingRequests.length / pendingRowsPerPage));
  const currentPendingPage = Math.min(pendingPage, totalPendingPages);
  const pagedPending = pendingRequests.slice(
    (currentPendingPage - 1) * pendingRowsPerPage,
    currentPendingPage * pendingRowsPerPage
  );

  // Approved pagination slice
  const totalHistoryPages = Math.max(1, Math.ceil(approvedRequests.length / historyRowsPerPage));
  const currentHistoryPage = Math.min(historyPage, totalHistoryPages);
  const pagedHistory = approvedRequests.slice(
    (currentHistoryPage - 1) * historyRowsPerPage,
    currentHistoryPage * historyRowsPerPage
  );

  return (
    <section className="page active" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Section Head with Aligned Action Button */}
      <div className="section-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: '1 1 320px' }}>
          <div className="eyebrow">Infrastruktur & Sarana Penelitian Terpadu</div>
          <h2 className="h1" style={{ margin: '4px 0 6px 0' }}>
            {isLecturerOrAdmin ? 'Tata Kelola Lab & Fasilitas' : 'Ajukan Fasilitas & Laboratorium'}
          </h2>
          <p className="sub" style={{ margin: 0 }}>
            Akses fasilitas komputasi kinerja tinggi, laboratorium basah terpadu, dan perlengkapan fabrikasi prototipe.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal('resource')}
          style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'center' }}
        >
          <Plus size={16} />
          <span>Ajukan Permohonan Fasilitas</span>
        </button>
      </div>

      {/* Facilities Showcase Cards with Enhanced Spec Hierarchy */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={16} />
            </div>
            <span>Katalog Fasilitas Laboratorium Terpadu</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
            4 Fasilitas Siap Pakai
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
          {campusFacilities.map((fac, i) => (
            <div
              key={i}
              className="card facility-showcase-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                minWidth: 0,
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className={`badge ${fac.badgeColor}`} style={{ fontSize: '10px', lineHeight: 1.3, whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '100%' }}>
                    {fac.category}
                  </span>
                  <span className="badge badge-teal" style={{ fontSize: '9.5px', lineHeight: 1.3, whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '100%' }}>
                    {fac.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px', lineHeight: 1.35, wordBreak: 'break-word' }}>
                  {fac.name}
                </h4>

                <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.45, marginBottom: '14px', wordBreak: 'break-word', flex: '1 1 auto' }}>
                  {fac.desc}
                </p>

                {/* Structured Specification Chips */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    <Cpu size={12} style={{ color: 'var(--primary)' }} />
                    <span>Spesifikasi Teknis:</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {fac.specs.map((sp, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: '#0f172a',
                          background: 'white',
                          border: '1px solid #cbd5e1',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          wordBreak: 'break-word',
                          maxWidth: '100%'
                        }}
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Pinjam Action Button inside each card */}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => openModal('resource')}
                style={{ width: '100%', marginTop: 'auto', justifyContent: 'center', fontSize: '12px', padding: '8px 12px', fontWeight: 700 }}
              >
                <span>Ajukan Peminjaman Fasilitas Ini</span>
                <span style={{ fontSize: '13px' }}>&rarr;</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABEL 1: PERMOHONAN MENUNGGU VERIFIKASI (PENDING TABLE) */}
      {/* ======================================================== */}
      <div className="card" style={{ padding: '22px 24px', marginBottom: '28px', borderRadius: '16px', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                Permohonan Menunggu Verifikasi Dosen / Lab ({pendingRequests.length})
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0 18px' }}>
              Daftar permohonan fasilitas yang membutuhkan persetujuan penggunaan ruang/perangkat.
            </p>
          </div>

          {/* Rows per page selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
            <span>Rows per page:</span>
            <select
              value={pendingRowsPerPage}
              onChange={e => {
                setPendingRowsPerPage(Number(e.target.value));
                setPendingPage(1);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--line)',
                fontSize: '12px',
                background: 'white',
                fontWeight: 700
              }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>

        {pagedPending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--surface-alt)', borderRadius: '12px', color: 'var(--muted)', fontSize: '12.5px' }}>
            <CheckCircle2 size={24} style={{ color: '#10b981', margin: '0 auto 8px auto', display: 'block' }} />
            Tidak ada permohonan fasilitas yang sedang menunggu verifikasi saat ini.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', background: '#f8fafc', color: 'var(--navy)' }}>
                  <th style={{ padding: '10px 12px', width: '45px', fontWeight: 800 }}>NO</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>FASILITAS & KEPERLUAN</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>PEMOHON & PROYEK</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>TANGGAL PEMAKAIAN</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, whiteSpace: 'nowrap', minWidth: '115px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>AKSI VERIFIKASI</th>
                </tr>
              </thead>
              <tbody>
                {pagedPending.map((req, index) => {
                  const proj = projects.find(p => p.id === req.project_id);
                  const rowNumber = (currentPendingPage - 1) * pendingRowsPerPage + index + 1;
                  return (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                      <td style={{ padding: '12px', color: 'var(--muted)', fontWeight: 700 }}>
                        {rowNumber}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ display: 'block', color: 'var(--navy)', fontSize: '13px' }}>
                          {req.resource_name}
                        </strong>
                        {req.note && (
                          <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                            Keperluan: "{req.note}"
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{req.student_name}</span>
                        {proj && (
                          <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>
                            Proyek: {proj.name}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={13} style={{ color: 'var(--primary)' }} />
                          <span>{formatHumanDate(req.date_needed)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <span className="badge badge-orange" style={{ fontSize: '11px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <span>⏳</span>
                          <span>Menunggu</span>
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {isLecturerOrAdmin ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => updateResourceStatus(req.id, 'Disetujui', 'Disetujui untuk pemakaian laboratorium sesuai jadwal.')}
                              style={{ padding: '5px 10px', fontSize: '11.5px', fontWeight: 700 }}
                              title="Setujui permohonan fasilitas"
                            >
                              <Check size={13} />
                              <span>Setujui</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => updateResourceStatus(req.id, 'Ditolak', 'Fasilitas sedang dalam jadwal pemeliharaan berkala.')}
                              style={{ padding: '5px 10px', fontSize: '11.5px', fontWeight: 700 }}
                              title="Tolak permohonan fasilitas"
                            >
                              <X size={13} />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontStyle: 'italic' }}>
                            Menunggu tinjauan dosen
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Pagination Navigation */}
        {pendingRequests.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              Menampilkan {(currentPendingPage - 1) * pendingRowsPerPage + 1} - {Math.min(currentPendingPage * pendingRowsPerPage, pendingRequests.length)} dari {pendingRequests.length} permohonan
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPendingPage(p => Math.max(1, p - 1))}
                disabled={currentPendingPage <= 1}
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPendingPage <= 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>
              <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '0 6px' }}>
                {currentPendingPage} / {totalPendingPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPendingPage(p => Math.min(totalPendingPages, p + 1))}
                disabled={currentPendingPage >= totalPendingPages}
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPendingPage >= totalPendingPages ? 0.4 : 1 }}
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TABEL 2: RIWAYAT FASILITAS DISETUJUI & SELESAI (APPROVED) */}
      {/* ======================================================== */}
      <div className="card" style={{ padding: '22px 24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--navy)', margin: 0 }}>
                Riwayat Permohonan Disetujui & Selesai ({approvedRequests.length})
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0 18px' }}>
              Daftar izin fasilitas lab yang telah disetujui, sedang aktif digunakan, atau telah rampung.
            </p>
          </div>

          {/* Rows per page selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
            <span>Rows per page:</span>
            <select
              value={historyRowsPerPage}
              onChange={e => {
                setHistoryRowsPerPage(Number(e.target.value));
                setHistoryPage(1);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--line)',
                fontSize: '12px',
                background: 'white',
                fontWeight: 700
              }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>

        {pagedHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--surface-alt)', borderRadius: '12px', color: 'var(--muted)', fontSize: '12.5px' }}>
            Belum ada riwayat permohonan fasilitas yang disetujui.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)', background: '#f8fafc', color: 'var(--navy)' }}>
                  <th style={{ padding: '10px 12px', width: '45px', fontWeight: 800 }}>NO</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>FASILITAS & CATATAN LAB</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>PEMOHON & PROYEK</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800 }}>TANGGAL JADWAL</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, whiteSpace: 'nowrap', minWidth: '125px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800 }}>AKSI PENGGUNAAN</th>
                </tr>
              </thead>
              <tbody>
                {pagedHistory.map((req, index) => {
                  const proj = projects.find(p => p.id === req.project_id);
                  const rowNumber = (currentHistoryPage - 1) * historyRowsPerPage + index + 1;
                  return (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', color: 'var(--muted)', fontWeight: 700 }}>
                        {rowNumber}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <strong style={{ display: 'block', color: 'var(--navy)', fontSize: '13px' }}>
                          {req.resource_name}
                        </strong>
                        {req.feedback && (
                          <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600, marginTop: '2px' }}>
                            ✓ {req.feedback}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{req.student_name}</span>
                        {proj && (
                          <div style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px' }}>
                            Proyek: {proj.name}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={13} style={{ color: '#10b981' }} />
                          <span>{formatHumanDate(req.date_needed)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <span
                          className={`badge ${
                            req.status === 'Disetujui' ? 'badge-teal' : req.status === 'Selesai' ? 'badge-blue' : 'badge-rose'
                          }`}
                          style={{ fontSize: '11px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          {req.status === 'Disetujui' ? '✓ Disetujui' : req.status === 'Selesai' ? '★ Selesai Digunakan' : '✕ Ditolak'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {/* Aksi Lengkap untuk Status Disetujui (sesuai masukan dosen halaman 4) */}
                        {req.status === 'Disetujui' ? (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                alert(`[TIKET IZIN LAB RESMI]\n\nFasilitas: ${req.resource_name}\nPemohon: ${req.student_name}\nJadwal: ${formatHumanDate(req.date_needed)}\nStatus: Disetujui Dosen Pembimbing (Dr. Belgis Ainatul Iza)`);
                              }}
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              title="Lihat Detail Izin Lab"
                            >
                              <FileText size={12} />
                              <span>Detail</span>
                            </button>
                            {isLecturerOrAdmin && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => updateResourceStatus(req.id, 'Selesai', 'Sesi pemakaian fasilitas telah selesai dengan baik.')}
                                  style={{ padding: '4px 8px', fontSize: '11px', background: '#0284c7' }}
                                  title="Tandai pemakaian fasilitas selesai"
                                >
                                  <Check size={12} />
                                  <span>Selesai</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => updateResourceStatus(req.id, 'Menunggu', 'Persetujuan dibatalkan untuk penjadwalan ulang.')}
                                  style={{ padding: '4px 8px', fontSize: '11px', color: '#e11d48' }}
                                  title="Batalkan Persetujuan"
                                >
                                  <RotateCcw size={12} />
                                  <span>Batalkan</span>
                                </button>
                              </>
                            )}
                          </div>
                        ) : req.status === 'Selesai' ? (
                          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                            ✓ Terarsip Selesai
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => updateResourceStatus(req.id, 'Menunggu', 'Diajukan kembali untuk verifikasi ulang.')}
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                            title="Tinjau ulang permohonan yang ditolak"
                          >
                            <RotateCcw size={11} />
                            <span>Tinjau Ulang</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* History Pagination Navigation */}
        {approvedRequests.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              Menampilkan {(currentHistoryPage - 1) * historyRowsPerPage + 1} - {Math.min(currentHistoryPage * historyRowsPerPage, approvedRequests.length)} dari {approvedRequests.length} permohonan
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                disabled={currentHistoryPage <= 1}
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentHistoryPage <= 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={13} />
                <span>Prev</span>
              </button>
              <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '0 6px' }}>
                {currentHistoryPage} / {totalHistoryPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                disabled={currentHistoryPage >= totalHistoryPages}
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentHistoryPage >= totalHistoryPages ? 0.4 : 1 }}
              >
                <span>Next</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
