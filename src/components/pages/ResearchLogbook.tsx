import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Download,
  Check,
  FileText,
  Plus,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Paperclip,
  Link as LinkIcon,
  UploadCloud,
  X,
  Filter,
  Globe,
  BookOpen,
  Wrench,
  FlaskConical,
  BarChart3,
  Target,
  CheckCircle2,
  Clock3,
  ClipboardList,
  GraduationCap,
  Info,
  Zap
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   FITUR 2 — GENERATOR LOGBOOK RISET & EKSPOR PDF RESMI
   Standar SIMBELMAWA / PKM Dikti + Tanda Tangan Digital
   ────────────────────────────────────────────────────────── */

export interface LogbookEntry {
  id: number;
  project_id?: number;
  date: string;
  duration: string;
  checkpoint_category: string;
  activity: string;
  achievement: string;
  evidence_link?: string;
  evidence_file_name?: string;
  evidence_file_size?: string;
  evidence_file_data?: string;
  verified: boolean;
  verified_by: string;
  notes: string;
}

export const CHECKPOINT_CATEGORIES = [
  { id: 'all', label: 'Semua Checkpoint', code: 'ALL' },
  { id: 'cp1', label: 'CP-1: Studi Literatur & Hipotesis', code: 'CP-1' },
  { id: 'cp2', label: 'CP-2: Desain Metodologi & Kalibrasi', code: 'CP-2' },
  { id: 'cp3', label: 'CP-3: Eksperimen Lab & Data Empiris', code: 'CP-3' },
  { id: 'cp4', label: 'CP-4: Analisis Data & Validasi Model', code: 'CP-4' },
  { id: 'cp5', label: 'CP-5: Pelaporan & Publikasi Manuskrip', code: 'CP-5' },
];

export const renderCheckpointIcon = (id: string, size = 14) => {
  switch (id) {
    case 'all': return <Globe size={size} />;
    case 'cp1': return <BookOpen size={size} />;
    case 'cp2': return <Wrench size={size} />;
    case 'cp3': return <FlaskConical size={size} />;
    case 'cp4': return <BarChart3 size={size} />;
    case 'cp5': return <FileText size={size} />;
    default: return <Target size={size} />;
  }
};

const INITIAL_ENTRIES: LogbookEntry[] = [
  {
    id: 1,
    date: '2026-10-15',
    duration: '3 jam',
    checkpoint_category: 'CP-3: Eksperimen Lab & Data Empiris',
    activity: 'Eksplorasi dataset cuaca BMKG & preprocessing missing values',
    achievement: 'Dataset bersih (12.000 baris × 14 fitur) siap untuk pelatihan model LSTM',
    evidence_link: 'https://colab.research.google.com/steam-weather',
    evidence_file_name: 'bmkg_raw_sample_2026.csv',
    evidence_file_size: '342 KB',
    verified: true,
    verified_by: 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.',
    notes: 'Data sudah cukup representatif untuk 3 tahun terakhir.'
  },
  {
    id: 2,
    date: '2026-10-17',
    duration: '4 jam',
    checkpoint_category: 'CP-4: Analisis Data & Validasi Model',
    activity: 'Pelatihan model LSTM & optimasi hyperparameter (learning rate, epochs)',
    achievement: 'Akurasi prediksi 87.3% (MAE: 1.2°C) pada data validasi',
    evidence_link: 'https://github.com/nazaa-arch/steamcraft',
    evidence_file_name: 'training_loss_curve.png',
    evidence_file_size: '128 KB',
    verified: true,
    verified_by: 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.',
    notes: 'Pertimbangkan ensemble dengan XGBoost untuk meningkatkan akurasi.'
  },
  {
    id: 3,
    date: '2026-10-19',
    duration: '2 jam',
    checkpoint_category: 'CP-2: Desain Metodologi & Kalibrasi',
    activity: 'Kalibrasi sensor suhu DHT22 & uji konektivitas modul LoRa SX1278',
    achievement: 'Transmisi telemetri berhasil pada jarak 850m line-of-sight',
    evidence_link: '',
    evidence_file_name: 'kalibrasi_sensor_dht22.pdf',
    evidence_file_size: '512 KB',
    verified: false,
    verified_by: '',
    notes: ''
  },
  {
    id: 4,
    date: '2026-10-21',
    duration: '5 jam',
    checkpoint_category: 'CP-3: Eksperimen Lab & Data Empiris',
    activity: 'Desain dashboard visualisasi cuaca real-time dengan chart interaktif',
    achievement: 'Prototipe UI dashboard v1 selesai, siap presentasi ke dosen pembimbing',
    evidence_link: 'https://figma.com/steam-dashboard-v1',
    verified: false,
    verified_by: '',
    notes: ''
  },
  {
    id: 5,
    date: '2026-10-22',
    duration: '3 jam',
    checkpoint_category: 'CP-1: Studi Literatur & Hipotesis',
    activity: 'Penulisan bab 3 metodologi & analisis statistik deskriptif dataset',
    achievement: 'Draft bab 3 terselesaikan (15 halaman), tabel distribusi data & uji normalitas',
    evidence_link: '',
    evidence_file_name: 'draft_bab3_metodologi_v1.docx',
    evidence_file_size: '210 KB',
    verified: false,
    verified_by: '',
    notes: ''
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
  const { currentUser, projects, showToast } = useApp();
  const [entries, setEntries] = useState<LogbookEntry[]>(INITIAL_ENTRIES);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [selectedCpFilter, setSelectedCpFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unverified' | 'verified'>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDuration, setNewDuration] = useState('2 jam');
  const [newCpCategory, setNewCpCategory] = useState('CP-3: Eksperimen Lab & Data Empiris');
  const [newActivity, setNewActivity] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileSize, setNewFileSize] = useState('');
  const [newFileData, setNewFileData] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lecturer Verification Modal State
  const [verifyingEntry, setVerifyingEntry] = useState<LogbookEntry | null>(null);
  const [lecturerNoteInput, setLecturerNoteInput] = useState<string>('');

  const isLecturerOrAdmin = currentUser?.role === 'lecturer' || currentUser?.role === 'admin';
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Drill-down filtering based on checkpoint category & verification status
  const filteredEntries = entries.filter(e => {
    // Checkpoint filter
    if (selectedCpFilter !== 'all') {
      if (selectedCpFilter === 'cp1' && !e.checkpoint_category.includes('CP-1')) return false;
      if (selectedCpFilter === 'cp2' && !e.checkpoint_category.includes('CP-2')) return false;
      if (selectedCpFilter === 'cp3' && !e.checkpoint_category.includes('CP-3')) return false;
      if (selectedCpFilter === 'cp4' && !e.checkpoint_category.includes('CP-4')) return false;
      if (selectedCpFilter === 'cp5' && !e.checkpoint_category.includes('CP-5')) return false;
    }

    // Status filter
    if (statusFilter === 'unverified' && e.verified) return false;
    if (statusFilter === 'verified' && !e.verified) return false;

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pagedEntries = filteredEntries.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const verifiedCount = entries.filter(e => e.verified).length;
  const unverifiedCount = entries.length - verifiedCount;
  const totalHours = entries.reduce((sum, e) => {
    const num = parseInt(e.duration) || 0;
    return sum + num;
  }, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    const formatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    const objectUrl = URL.createObjectURL(file);

    setNewFileName(file.name);
    setNewFileSize(formatted);
    setNewFileData(objectUrl);
    showToast(`Berkas "${file.name}" berhasil diunggah dan terlampir.`);
  };

  const handleRemoveFile = () => {
    setNewFileName('');
    setNewFileSize('');
    setNewFileData('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddEntry = () => {
    if (!newDate || !newActivity.trim()) {
      showToast('Harap lengkapi tanggal dan uraian kegiatan riset.');
      return;
    }
    const entry: LogbookEntry = {
      id: Date.now(),
      project_id: selectedProjectId,
      date: newDate,
      duration: newDuration || '1 jam',
      checkpoint_category: newCpCategory,
      activity: newActivity.trim(),
      achievement: newAchievement.trim() || 'Kegiatan terdokumentasi dalam sistem.',
      evidence_link: newLink.trim() || undefined,
      evidence_file_name: newFileName || undefined,
      evidence_file_size: newFileSize || undefined,
      evidence_file_data: newFileData || undefined,
      verified: false,
      verified_by: '',
      notes: ''
    };

    setEntries(prev => [entry, ...prev]);
    setNewActivity('');
    setNewAchievement('');
    setNewLink('');
    setNewFileName('');
    setNewFileSize('');
    setNewFileData('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowAddForm(false);
    setPage(1);
    showToast('Entri logbook riset berhasil disimpan! Menunggu verifikasi Dosen Pembimbing.');
  };

  const handleOpenVerifyModal = (entry: LogbookEntry) => {
    if (!isLecturerOrAdmin) {
      showToast('Hanya Dosen Pembimbing yang memiliki wewenang memvalidasi logbook riset.');
      return;
    }
    setVerifyingEntry(entry);
    setLecturerNoteInput(entry.notes || 'Kegiatan riset terverifikasi valid dan sesuai indikator capaian.');
  };

  const handleConfirmVerify = () => {
    if (!verifyingEntry) return;
    setEntries(prev =>
      prev.map(e =>
        e.id === verifyingEntry.id
          ? {
              ...e,
              verified: true,
              verified_by: currentUser?.name || 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.',
              notes: lecturerNoteInput.trim() || 'Kegiatan riset terverifikasi valid oleh dosen pembimbing.'
            }
          : e
      )
    );
    showToast(`Entri logbook #${verifyingEntry.id} berhasil diverifikasi dengan catatan pembimbing.`);
    setVerifyingEntry(null);
  };

  const handleQuickVerify = (id: number) => {
    if (!isLecturerOrAdmin) {
      showToast('Hanya Dosen Pembimbing yang memiliki wewenang memvalidasi logbook riset.');
      return;
    }
    setEntries(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              verified: true,
              verified_by: currentUser?.name || 'Dr. Belgis Ainatul Iza, S.Si., M.Mat.',
              notes: e.notes || 'Kegiatan riset terverifikasi valid oleh dosen pembimbing.'
            }
          : e
      )
    );
    showToast('Entri logbook berhasil diverifikasi.');
  };

  const handleDelete = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    showToast('Entri logbook berhasil dihapus.');
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = entries.map((e, i) => `
      <tr>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:center">${i + 1}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;font-weight:600">${formatHumanDate(e.date)}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:center">${e.duration}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;font-size:10px;font-weight:700;color:#0284c7">${e.checkpoint_category || '-'}</td>
        <td style="padding:8px;border:1px solid #cbd5e1">${e.activity}</td>
        <td style="padding:8px;border:1px solid #cbd5e1">${e.achievement}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;font-size:10px">${e.evidence_file_name || e.evidence_link || '-'}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:center;font-weight:700;color:${e.verified ? '#16a34a' : '#f59e0b'}">${e.verified ? '✓ Terverifikasi Dosen' : '⏳ Menunggu'}</td>
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
    .header { text-align: center; margin-bottom: 24px; border-bottom: 3px double #0f172a; padding-bottom: 14px; }
    .header h1 { font-size: 17px; letter-spacing: 1.5px; margin-bottom: 4px; }
    .header h2 { font-size: 14px; font-weight: 400; margin-bottom: 4px; }
    .header p { font-size: 11px; color: #475569; }
    .info-table { width: 100%; margin-bottom: 18px; font-size: 12px; }
    .info-table td { padding: 3px 6px; vertical-align: top; }
    .info-table .label { font-weight: 700; width: 140px; }
    table.logbook { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 26px; }
    table.logbook th { background: #0f172a; color: white; padding: 7px; border: 1px solid #0f172a; text-align: center; font-size: 9.5px; text-transform: uppercase; }
    .signature { display: flex; justify-content: space-between; margin-top: 36px; }
    .sig-block { text-align: center; width: 45%; }
    .sig-line { border-bottom: 1px solid #0f172a; margin: 45px auto 6px; width: 200px; }
    .sig-name { font-weight: 700; font-size: 12px; }
    .sig-title { font-size: 10.5px; color: #475569; }
    @media print { body { padding: 20px 25px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>LOGBOOK KEGIATAN RISET ILMIAH BERBASIS CHECKPOINT</h1>
    <h2>Platform STEAM-Craft — Inkubasi Riset Multidisiplin</h2>
    <p>Universitas Negeri Surabaya (UNESA) • Fakultas Matematika dan Ilmu Pengetahuan Alam</p>
  </div>

  <table class="info-table">
    <tr><td class="label">Nama Proyek Riset</td><td>: ${selectedProject?.name || '-'}</td></tr>
    <tr><td class="label">Peneliti / Mahasiswa</td><td>: ${currentUser?.name || 'Budi Santoso'} (${currentUser?.identifier || '202610101'})</td></tr>
    <tr><td class="label">Dosen Pembimbing</td><td>: Dr. Belgis Ainatul Iza, S.Si., M.Mat. (NIP 202509237)</td></tr>
    <tr><td class="label">Total Kegiatan</td><td>: ${entries.length} Sesi (${totalHours} Jam Akumulatif)</td></tr>
    <tr><td class="label">Status Verifikasi</td><td>: ${verifiedCount} dari ${entries.length} sesi telah divalidasi oleh dosen pembimbing</td></tr>
  </table>

  <table class="logbook">
    <thead>
      <tr>
        <th style="width:28px">No</th>
        <th style="width:110px">Tanggal</th>
        <th style="width:48px">Durasi</th>
        <th style="width:110px">Kategori CP</th>
        <th>Kegiatan & Uraian</th>
        <th>Capaian & Hasil</th>
        <th style="width:110px">Bukti Lampiran</th>
        <th style="width:90px">Status Dosen</th>
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
      <p>Menyetujui (Validasi Resmi),</p>
      <p>Dosen Pembimbing</p>
      <div class="sig-line"></div>
      <p class="sig-name">Dr. Belgis Ainatul Iza, S.Si., M.Mat.</p>
      <p class="sig-title">NIP 202509237</p>
    </div>
  </div>

  <script>window.print();</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <section className="page active" style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-head" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ flex: '1 1 320px' }}>
          <div className="eyebrow">{isLecturerOrAdmin ? 'Portal Verifikasi Riset Dosen Pembimbing' : 'Dokumentasi &amp; Pencatatan Riset Berbasis Checkpoint'}</div>
          <h2 className="h1" style={{ margin: '4px 0 6px 0' }}>Logbook Riset Ilmiah</h2>
          <p className="sub" style={{ margin: 0 }}>
            {isLecturerOrAdmin
              ? 'Tinjau dan validasi aktivitas riset mahasiswa bimbingan, berikan catatan koreksi metodologi, serta verifikasi kelayakan capaian 5 checkpoint ilmiah PKM Dikti.'
              : 'Catatan kegiatan riset mahasiswa yang terhubung langsung dengan tahapan checkpoint, dilengkapi lampiran link/berkas bukti empiris dan validasi resmi oleh Dosen Pembimbing.'}
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
            <span>Catat Kegiatan Baru</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleExportPDF} style={{ padding: '8px 14px' }}>
            <Download size={15} />
            <span>Unduh PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Role Verification Guidance Banner */}
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
          {isLecturerOrAdmin ? (
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={22} />
            </div>
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Info size={22} />
            </div>
          )}
          <div style={{ color: isLecturerOrAdmin ? '#14532d' : '#1e40af', lineHeight: 1.45 }}>
            <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '2px' }}>
              {isLecturerOrAdmin ? 'Hak Validasi Penuh Dosen Pembimbing (Dr. Belgis Ainatul Iza, S.Si., M.Mat.):' : 'Alur Validasi Logbook & Checkpoint Mahasiswa:'}
            </div>
            {isLecturerOrAdmin
              ? 'Anda memiliki hak akses untuk memverifikasi laporan riset mahasiswa dan memberikan catatan akademik pada setiap entri. Entri yang diverifikasi akan memiliki tanda tangan digital resmi pada cetak PDF PKM Dikti.'
              : 'Mahasiswa mencatat aktivitas riset harian dan melampirkan bukti digital (link/file). Status "Terverifikasi" hanya dapat diberikan oleh Dosen Pembimbing.'}
          </div>
        </div>

        {isLecturerOrAdmin && unverifiedCount > 0 && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setStatusFilter('unverified');
              setPage(1);
            }}
            style={{
              background: '#ea580c',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: 800,
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(234,88,12,0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={13} />
            <span>Tinjau {unverifiedCount} Entri Menunggu Validasi &rarr;</span>
          </button>
        )}
      </div>

      {/* Summary Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Sesi Riset', value: entries.length, unit: 'Sesi', color: '#2563eb', bg: '#eff6ff', icon: <ClipboardList size={20} />, onClick: () => { setStatusFilter('all'); setPage(1); } },
          { label: 'Jam Akumulatif', value: totalHours, unit: 'Jam', color: '#0d9488', bg: '#f0fdfa', icon: <Clock3 size={20} /> },
          { label: 'Terverifikasi Dosen', value: verifiedCount, unit: `/ ${entries.length}`, color: '#16a34a', bg: '#f0fdf4', icon: <CheckCircle2 size={20} />, onClick: () => { setStatusFilter('verified'); setPage(1); } },
          { label: isLecturerOrAdmin ? 'Perlu Validasi Anda' : 'Menunggu Verifikasi', value: unverifiedCount, unit: 'Sesi', color: '#ea580c', bg: '#fff7ed', icon: <Clock size={20} />, onClick: () => { setStatusFilter('unverified'); setPage(1); } },
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
              cursor: stat.onClick ? 'pointer' : 'default',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: stat.color }}>{stat.value} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>{stat.unit}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER CONTROLS: Status Verifikasi & Drill-Down Checkpoint */}
      <div className="card" style={{ padding: '16px 18px', borderRadius: '14px', marginBottom: '20px' }}>
        {/* Row 1: Filter Status Validasi */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={15} style={{ color: 'var(--primary)' }} />
            <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>Status Validasi Dosen:</strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => { setStatusFilter('all'); setPage(1); }}
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid var(--line)',
                fontWeight: statusFilter === 'all' ? 800 : 500
              }}
            >
              Semua ({entries.length})
            </button>
            <button
              type="button"
              onClick={() => { setStatusFilter('unverified'); setPage(1); }}
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                borderRadius: '20px',
                border: `1.5px solid ${statusFilter === 'unverified' ? '#d97706' : '#fde68a'}`,
                background: statusFilter === 'unverified' ? '#f59e0b' : '#fffbeb',
                color: statusFilter === 'unverified' ? '#ffffff' : '#b45309',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Clock size={12} />
              <span>Menunggu Validasi ({unverifiedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => { setStatusFilter('verified'); setPage(1); }}
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                borderRadius: '20px',
                border: `1.5px solid ${statusFilter === 'verified' ? '#15803d' : '#bbf7d0'}`,
                background: statusFilter === 'verified' ? '#16a34a' : '#f0fdf4',
                color: statusFilter === 'verified' ? '#ffffff' : '#15803d',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <CheckCircle2 size={12} />
              <span>Terverifikasi Dosen ({verifiedCount})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Drill-Down Checkpoint Categories */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Filter size={14} style={{ color: 'var(--primary)' }} />
            <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>
              Drill-Down Kategori Checkpoint Riset Mahasiswa:
            </strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CHECKPOINT_CATEGORIES.map(cat => {
              const count = entries.filter(e => {
                if (cat.id === 'all') return true;
                return e.checkpoint_category.includes(cat.code);
              }).length;
              const isSelected = selectedCpFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCpFilter(cat.id);
                    setPage(1);
                  }}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '11.5px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: isSelected ? 800 : 600
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    {renderCheckpointIcon(cat.id, 13)}
                  </span>
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--line)',
                      color: isSelected ? '#ffffff' : 'var(--navy)'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px', borderLeft: '5px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} style={{ color: 'var(--primary)' }} />
              <span>Catat Kegiatan Riset Baru (Berbasis Checkpoint)</span>
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Akan ditandai "Menunggu Verifikasi Dosen" setelah disimpan
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Tanggal Kegiatan</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                required
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }}
              />
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Durasi Jam Riset</label>
              <input
                type="text"
                placeholder="Contoh: 3 jam"
                value={newDuration}
                onChange={e => setNewDuration(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px' }}
              />
            </div>

            <div className="auth-field" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Target size={14} />
                <span>Kategori Checkpoint Mahasiswa Terkait:</span>
              </label>
              <select
                value={newCpCategory}
                onChange={e => setNewCpCategory(e.target.value)}
                style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '13px', fontWeight: 700, background: '#f8fbff', color: 'var(--navy)' }}
              >
                {CHECKPOINT_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.label}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-field" style={{ gridColumn: '1 / -1', margin: 0 }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Kegiatan &amp; Uraian Riset</label>
              <textarea
                rows={2}
                placeholder="Deskripsikan pengamatan lab, kalibrasi alat, pengolahan dataset, atau penulisan naskah yang dilakukan..."
                value={newActivity}
                onChange={e => setNewActivity(e.target.value)}
                required
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            <div className="auth-field" style={{ gridColumn: '1 / -1', margin: 0 }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Capaian &amp; Hasil Empiris</label>
              <textarea
                rows={2}
                placeholder="Hasil yang didapat (misal: MAE 1.2, sampel terkristalisasi, grafik loss validasi, dll)..."
                value={newAchievement}
                onChange={e => setNewAchievement(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            {/* Evidence & Attachment Trigger Section */}
            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={14} style={{ color: 'var(--primary)' }} />
                    <span>Lampiran Bukti Ilmiah (Opsional)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                    {newFileName || newLink
                      ? 'Berkas atau tautan bukti telah terpasang dan siap disertakan pada logbook.'
                      : 'Unggah file dokumen/gambar hasil observasi atau sematkan tautan URL digital.'}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    fontSize: '12px',
                    padding: '7px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700,
                    background: '#ffffff',
                    border: '1.5px solid var(--primary)',
                    color: 'var(--primary)'
                  }}
                >
                  <UploadCloud size={14} />
                  <span>{newFileName || newLink ? 'Kelola / Ganti Lampiran' : 'Unggah File / Tautkan Bukti'}</span>
                </button>
              </div>

              {/* Instant Attachment Preview Chips */}
              {(newLink || newFileName) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                  {newFileName && (
                    <span style={{ fontSize: '11.5px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '5px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={13} />
                      <strong>{newFileName}</strong>
                      <small style={{ opacity: 0.75 }}>({newFileSize})</small>
                      <button type="button" onClick={handleRemoveFile} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }} title="Hapus berkas">
                        <X size={13} />
                      </button>
                    </span>
                  )}
                  {newLink && (
                    <span style={{ fontSize: '11.5px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '5px 12px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <LinkIcon size={13} />
                      <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{newLink}</span>
                      <button type="button" onClick={() => setNewLink('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }} title="Hapus tautan">
                        <X size={13} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)} style={{ padding: '8px 14px' }}>
              Batal
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleAddEntry} style={{ padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} />
              <span>Simpan Entri Logbook</span>
            </button>
          </div>
        </div>
      )}

      {/* Logbook Table */}
      <div className="card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--navy)', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
              <span>Riwayat Logbook — {selectedProject?.name}</span>
            </h3>
            {selectedCpFilter !== 'all' && (
              <span style={{ fontSize: '11.5px', color: 'var(--primary)', fontWeight: 700 }}>
                Filter Aktif: {CHECKPOINT_CATEGORIES.find(c => c.id === selectedCpFilter)?.label} ({filteredEntries.length} entri)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--line)', fontSize: '12px', fontWeight: 700 }}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>

        <div className="logbook-desktop-table" style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px', minWidth: '760px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--line)', background: '#f8fafc', color: 'var(--navy)' }}>
                <th style={{ padding: '10px 12px', width: '36px', fontWeight: 800 }}>NO</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, width: '130px' }}>TANGGAL</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, width: '150px' }}>TAHAPAN CHECKPOINT</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>KEGIATAN &amp; CAPAIAN</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, width: '160px' }}>BUKTI LAMPIRAN</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, whiteSpace: 'nowrap', width: '140px' }}>STATUS VALIDASI</th>
                <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right', width: '110px' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {pagedEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                    Tidak ada catatan kegiatan logbook untuk filter checkpoint ini.
                  </td>
                </tr>
              ) : (
                pagedEntries.map((entry, i) => {
                  const rowNum = (currentPage - 1) * rowsPerPage + i + 1;
                  return (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--muted)' }}>{rowNum}</td>

                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '12px' }}>{formatHumanDate(entry.date)}</div>
                        <div style={{ fontSize: '11px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <Clock size={11} /> {entry.duration}
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span
                          className="badge badge-blue"
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            display: 'inline-block',
                            lineHeight: 1.3
                          }}
                        >
                          {entry.checkpoint_category}
                        </span>
                      </td>

                      <td style={{ padding: '12px', maxWidth: '280px' }}>
                        <strong style={{ color: '#0f172a', lineHeight: 1.4, display: 'block', marginBottom: '3px' }}>
                          {entry.activity}
                        </strong>
                        <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', lineHeight: 1.4 }}>
                          {entry.achievement}
                        </div>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {entry.evidence_link && (
                            <a
                              href={entry.evidence_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '11px',
                                color: 'var(--primary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none',
                                fontWeight: 600
                              }}
                            >
                              <LinkIcon size={11} /> <span>Tautan Digital &rarr;</span>
                            </a>
                          )}

                          {entry.evidence_file_name && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                color: 'var(--navy)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                maxWidth: '140px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={`Berkas: ${entry.evidence_file_name} (${entry.evidence_file_size || ''})`}
                            >
                              <FileText size={11} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.evidence_file_name}</span>
                            </span>
                          )}

                          {!entry.evidence_link && !entry.evidence_file_name && (
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>- Tanpa lampiran -</span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        {entry.verified ? (
                          <div>
                            <span className="badge badge-teal" style={{ fontSize: '10.5px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} />
                              <span>Terverifikasi Dosen</span>
                            </span>
                            <div style={{ fontSize: '10px', color: '#15803d', marginTop: '3px', fontWeight: 600 }}>
                              oleh {entry.verified_by.split(',')[0]}
                            </div>
                            {entry.notes && (
                              <div style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '2px', fontStyle: 'italic', maxWidth: '180px', whiteSpace: 'normal' }}>
                                "{entry.notes}"
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-orange" style={{ fontSize: '10.5px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} />
                              <span>Menunggu Verifikasi</span>
                            </span>
                            <div style={{ fontSize: '9.5px', color: 'var(--muted)', marginTop: '2px' }}>
                              Wewenang Dosen Pembimbing
                            </div>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                          {isLecturerOrAdmin && !entry.verified && (
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => handleOpenVerifyModal(entry)}
                              style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                              title="Verifikasi entri logbook ini dengan catatan Dosen Pembimbing"
                            >
                              <Check size={12} /> <span>Validasi</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDelete(entry.id)}
                            style={{ padding: '4px 6px', color: '#e11d48' }}
                            title="Hapus entri logbook"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Dedicated Card List (< 640px) */}
        <div className="logbook-mobile-cards">
          {pagedEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--muted)', background: '#f8fafc', borderRadius: '12px' }}>
              Tidak ada catatan kegiatan logbook untuk filter ini.
            </div>
          ) : (
            pagedEntries.map((entry, i) => {
              const rowNum = (currentPage - 1) * rowsPerPage + i + 1;
              return (
                <div
                  key={entry.id}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${entry.verified ? '#bbf7d0' : '#e2e8f0'}`,
                    borderLeft: `4px solid ${entry.verified ? '#16a34a' : '#f59e0b'}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {/* Top Bar: Date, Duration, and Index */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        #{rowNum}
                      </span>
                      <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>{formatHumanDate(entry.date)}</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                      <Clock size={11} /> {entry.duration}
                    </span>
                  </div>

                  {/* Checkpoint Pill */}
                  <div>
                    <span className="badge badge-blue" style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px' }}>
                      {entry.checkpoint_category}
                    </span>
                  </div>

                  {/* Activity & Achievement */}
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '3px', lineHeight: 1.4 }}>
                      {entry.activity}
                    </strong>
                    <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.45 }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Capaian:</span> {entry.achievement}
                    </div>
                  </div>

                  {/* Attachments & Evidence */}
                  {(entry.evidence_link || entry.evidence_file_name) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                      {entry.evidence_link && (
                        <a
                          href={entry.evidence_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '11px',
                            color: 'var(--primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#eff6ff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: 700
                          }}
                        >
                          <LinkIcon size={11} /> <span>Tautan Digital &rarr;</span>
                        </a>
                      )}
                      {entry.evidence_file_name && (
                        <span
                          style={{
                            fontSize: '11px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            color: 'var(--navy)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            maxWidth: '100%',
                            wordBreak: 'break-all'
                          }}
                        >
                          <FileText size={11} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                          <span>{entry.evidence_file_name}</span>
                          {entry.evidence_file_size && <small style={{ opacity: 0.7 }}>({entry.evidence_file_size})</small>}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Verification Status & Notes */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      {entry.verified ? (
                        <div>
                          <span className="badge badge-teal" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={11} />
                            <span>Terverifikasi Dosen</span>
                          </span>
                          <div style={{ fontSize: '10.5px', color: '#15803d', marginTop: '2px', fontWeight: 600 }}>
                            oleh {entry.verified_by.split(',')[0]}
                          </div>
                          {entry.notes && (
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px', fontStyle: 'italic' }}>
                              "{entry.notes}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="badge badge-orange" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} />
                            <span>Menunggu Verifikasi Dosen</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {isLecturerOrAdmin && !entry.verified && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleOpenVerifyModal(entry)}
                          style={{ padding: '5px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Check size={12} /> <span>Validasi</span>
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(entry.id)}
                        style={{ padding: '5px 8px', color: '#e11d48', fontSize: '11px' }}
                        title="Hapus entri logbook"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filteredEntries.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              Menampilkan {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredEntries.length)} dari {filteredEntries.length} entri
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPage <= 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={13} /> <span>Prev</span>
              </button>
              <span style={{ fontSize: '11.5px', fontWeight: 700 }}>{currentPage} / {totalPages}</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                style={{ padding: '4px 8px', fontSize: '11px', opacity: currentPage >= totalPages ? 0.4 : 1 }}
              >
                <span>Next</span> <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Kotak Modal Unggah Lampiran & Bukti Riset */}
      {showUploadModal && (
        <div className="modal-overlay active" onClick={() => setShowUploadModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <button className="modal-close" onClick={() => setShowUploadModal(false)}>
              &times;
            </button>

            <div className="eyebrow">Lampiran Bukti Ilmiah</div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
              Unggah Berkas &amp; Tautkan Bukti Riset
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '18px' }}>
              Sertakan berkas observasi laboratorium atau tautan repositori digital untuk memperkuat validitas pencapaian checkpoint Anda.
            </p>

            {/* Upload File Zone */}
            <div className="auth-field" style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>1. Unggah Berkas File (Komputer / HP)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.docx,.zip,.ipynb,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {!newFileName ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #93c5fd',
                    borderRadius: '12px',
                    padding: '22px',
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
                  <UploadCloud size={30} style={{ color: 'var(--primary)' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>
                    Klik tombol ini untuk memilih berkas dari perangkat Anda
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    Format didukung: PDF, PNG, JPG, CSV, XLSX, DOCX, ZIP (Maks. 50 MB)
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
                      <strong style={{ fontSize: '13px', display: 'block', wordBreak: 'break-all' }}>{newFileName}</strong>
                      <span style={{ fontSize: '11px', color: '#166534', opacity: 0.85 }}>Ukuran: {newFileSize} &middot; Terpilih</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ fontSize: '11px', color: '#15803d', border: '1px solid #86efac', background: 'white' }}
                    >
                      Ganti Berkas
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={handleRemoveFile}
                      style={{ fontSize: '11px', color: '#ef4444', border: '1px solid #fecaca', background: 'white' }}
                      title="Hapus berkas"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Link URL Input */}
            <div className="auth-field" style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>2. Atau Sematkan Tautan Bukti Digital (URL)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://colab.research.google.com/... atau Google Drive / GitHub"
                  value={newLink}
                  onChange={e => setNewLink(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
                <LinkIcon size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--muted)' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', display: 'block' }}>
                Dapat berupa tautan Google Colab, repositori GitHub, folder Google Drive, atau prototipe Figma.
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowUploadModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setShowUploadModal(false);
                  showToast('Lampiran bukti riset berhasil dipasang!');
                }}
              >
                <Check size={14} style={{ marginRight: '4px' }} />
                <span>Terapkan Lampiran</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog Validasi Dosen dengan Catatan Pembimbing */}
      {verifyingEntry && (
        <div className="modal-overlay active" onClick={() => setVerifyingEntry(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <button className="modal-close" onClick={() => setVerifyingEntry(null)}>
              &times;
            </button>

            <div className="eyebrow">Validasi Akademik Dosen Pembimbing</div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
              Verifikasi Kegiatan Logbook Riset
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
              Validasi catatan aktivitas mahasiswa dan berikan catatan pembimbing untuk penyempurnaan riset PKM Dikti.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, marginBottom: '2px' }}>
                {verifyingEntry.checkpoint_category} &middot; {formatHumanDate(verifyingEntry.date)} ({verifyingEntry.duration})
              </div>
              <strong style={{ fontSize: '13px', color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
                {verifyingEntry.activity}
              </strong>
              <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)' }}>
                <strong>Capaian:</strong> {verifyingEntry.achievement}
              </div>
              {verifyingEntry.evidence_file_name && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Paperclip size={12} />
                  <span>Berkas terlampir: {verifyingEntry.evidence_file_name} ({verifyingEntry.evidence_file_size || ''})</span>
                </div>
              )}
            </div>

            <div className="auth-field" style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>
                Catatan / Masukan Pembimbing (Opsional)
              </label>
              <textarea
                rows={3}
                value={lecturerNoteInput}
                onChange={e => setLecturerNoteInput(e.target.value)}
                placeholder="Tuliskan apresiasi, saran penyempurnaan, atau arahan untuk checkpoint berikutnya..."
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '12.5px', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setVerifyingEntry(null)}>
                Batal
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleConfirmVerify}
                style={{ padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={14} />
                <span>Setujui &amp; Simpan Validasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
