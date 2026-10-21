# 🚀 STEAM-Craft — Ruang Kolaborasi Multidisiplin (React + TypeScript)

**STEAM-Craft** adalah platform web terpadu untuk inkubasi dan kolaborasi riset ilmiah mahasiswa dan dosen berbasis pendekatan **STEAM** (*Science, Technology, Engineering, Art, and Mathematics*).

Direkayasa ulang secara penuh menggunakan arsitektur **React 19 + TypeScript + Vite** modern, mempertahankan seluruh integritas alur kerja riset, manajemen peran multi-role, 13 proyek penelitian unggulan, penilaian rubrik 4 pilar standar nasional, dan asisten riset cerdas.

---

## 🌟 Fitur Utama

### 🎓 1. Portal Mahasiswa (Student Workspace)
- **Dashboard Progres & Metrik**: Menampilkan statistik proyek aktif, persentase rata-rata checkpoint, total kolaborator, dan status kendala teknis (blocker).
- **Katalog Proyek Multidisiplin**: Pencarian instan dan filter multi-kategori (Sains Data, AI, Biologi, Kimia, Fisika, Matematika, Bioteknologi) dan status riset.
- **Inisiasi Proyek Riset Baru**: Wizard pendaftaran proyek baru dengan 4 template ilmiah:
  - *Analisis Data / AI*
  - *Eksperimen / Laboratorium*
  - *Model Risiko / Aktuaria*
  - *Proyek Bebas / Lintas Disiplin*
- **Ruang Kerja (Workspace) Interaktif**:
  - **Pipeline Metode Ilmiah 5 Tahap**: Checkpoint interaktif dengan kalkulasi progres persentase otomatis dan log assignee penanggung jawab.
  - **Jurnal & Logbook Laboratorium**: Catatan terperinci observasi harian dengan filter kategori (*Metodologi, Eksperimen, Data, Blocker, Validasi*) dan lampiran file.
  - **Jejak Versi & Reproducibility**: Riwayat rilis iterasi (v1.0, v2.0, dst.) dan integrasi repositori kode eksternal (*GitHub*).
  - **Struktur Tim & Kolaborator**: Tinjauan anggota multidisiplin, status open recruitment, serta persetujuan pelamar.
  - **AI Research Copilot**: Asisten riset kontekstual untuk validasi metodologi, checklist langkah nyata, dan mitigasi bias eksperimen.
- **Pusat Rekrutmen (Open Recruitment)**: Eksplorasi tim yang sedang mencari keahlian khusus lintas departemen dan pendaftaran kolaborasi 1-klik.
- **Jadwal & Bimbingan**: Pengajuan bimbingan tatap muka atau daring, catatan agenda, dan log umpan balik dosen.
- **Ajukan Fasilitas Lab**: Alokasi peminjaman fasilitas (*GPU Workstation RTX 4090, Printer 3D, Modul LoRa, Spektrofotometer UV-Vis*).
- **Portofolio Riset Mahasiswa**: Profil radar 5 pilar STEAM, rekam jejak riset terselesaikan, dan ekspor paket kelayakan ilmiah.

### 👨‍🏫 2. Portal Dosen & Juri (Faculty Command)
- **Mission Control Master-Detail**:
  - Tinjauan proyek aktif dan penanganan kendala teknis (Blocker Clinic).
  - Form penilaian rubrik 4 pilar standar nasional (Kelengkapan 25%, Bukti Empiris 25%, Kontribusi 25%, Reproducibility 25%) dengan kalkulasi otomatis nilai akhir dan predikat grade.
- **Antrean Bimbingan**: Konfirmasi, penjadwalan, dan pencatatan umpan balik sesi bimbingan.
- **Pusat Siaran Pengumuman**: Publikasi instruksi resmi, filter kategori, dan penyematan (*Pinned*).
- **Tata Kelola Lab**: Persetujuan dan verifikasi permohonan peminjaman instrumen riset.
- **Analitik Kohort**: Metrik agregat performa mahasiswa, distribusi riset per program studi, dan kepatuhan standar data terbuka.

### 🛠️ 3. Administrator Sistem
- **Dual Mode Switcher**: Beralih instan antara Mode Demo (Showcase Lomba dengan 13 proyek sampel) dan Mode Operasional Riil.
- **Manajemen Pengguna**: Tata kelola akun civitas akademika, pencarian, dan penyesuaian peran.
- **Audit & Ekspor Data**: Unduh cadangan database dalam format JSON dan reset ke konfigurasi pabrik.

---

## 🛠️ Arsitektur Teknologi

- **Frontend Framework**: React 19 dengan TypeScript
- **Bundler & Dev Server**: Vite (host: 0.0.0.0, port: 3000)
- **Styling**: Modern CSS Design System & Tailwind CSS Integration
- **Icons**: Lucide Icons
- **State & Persistence**: In-memory + LocalStorage State Management terintegrasi

---

## 🚀 Menjalankan Aplikasi

Jalankan perintah berikut pada terminal:

```bash
npm run dev
```

Aplikasi akan berjalan di:
`http://localhost:3000`

Untuk build produksi:
```bash
npm run build
```

---

## 🔑 Akun Demo Siap Pakai

- **Mahasiswa**: `budi` / `202610101` (Budi Santoso — Sains Data, pass: `password123`)
- **Dosen**: `dosen` / `202509237` (Dr. Belgis Ainatul Iza, S.Si., M.Mat. — S1 Sains Data FMIPA UNESA, pass: `dosen123`)
- **Admin**: `admin` (Administrator Sistem, pass: `admin2026!`)
