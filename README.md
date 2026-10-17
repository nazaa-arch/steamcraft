# 🚀 STEAM-Craft — Ruang Kolaborasi Multidisiplin

**STEAM-Craft** adalah platform web terpadu untuk kolaborasi riset ilmiah dan inovasi mahasiswa berbasis pendekatan **STEAM** (*Science, Technology, Engineering, Art, Mathematics*).

Aplikasi ini mentransformasikan prototipe statis menjadi **aplikasi produksi nyata (Full-Stack Real Application)** dengan backend server, database relasional SQLite persisten, antarmuka modern yang responsif, manajemen multi-role (Mahasiswa & Dosen/Juri), asisten AI Copilot riset cerdas, serta sistem evaluasi rubrik terstandarisasi.

---

## 🌟 Fitur Utama

### 🎓 1. Portal Mahasiswa (Student Workspace)
- **Dashboard Progres & Metrik**: Menampilkan statistik proyek aktif, persentase checkpoint, kolaborator, dan status kendala teknis (blocker).
- **Katalog Proyek Multidisiplin**: Pencarian cerdas, filter berdasarkan program studi (Sains Data, AI, Aktuaria, Bioteknologi, Robotika) dan status riset.
- **Wizard Pembuatan Proyek**: 3-step wizard inisialisasi alur kerja ilmiah terstandarisasi dengan integrasi template:
  - *Analisis Data / AI*
  - *Eksperimen / Laboratorium*
  - *Model Risiko / Aktuaria*
  - *Proyek Bebas / Lintas Disiplin*
- **Ruang Kerja (Workspace) Interaktif**:
  - **Pipeline Metode Ilmiah 5 Tahap**: Checkpoint interaktif dengan update progres persentase otomatis.
  - **AI Research Copilot**: Asisten riset berbasis AI yang menganalisis konteks proyek secara dinamis, memberikan tinjauan metodologi, checklist langkah nyata, mitigasi risiko bias/error, serta fitur tanya jawab (chat) interaktif.
  - **Jurnal Riset Ilmiah (Audit Trail)**: Catatan riset terstruktur dengan kategori (*Observasi, Metodologi, Eksperimen, Evaluasi, Blocker, Catatan Umum*).
  - **Snapshot Versi & Repositori**: Riwayat rilis iterasi (v1.0, v2.0, dst.) dan integrasi tautan repositori eksternal (*GitHub, GitLab, Google Drive, Kaggle*).
  - **Klinik Blocker & Review**: Tombol penanda blocker dengan alasan teknis yang langsung memicu notifikasi pembimbing, serta pengajuan review resmi.
- **Open Recruitment Kolaborasi**: Mencari dan melamar posisi anggota tim riset lintas program studi.
- **Jadwal & Bimbingan**: Pengajuan jadwal bimbingan tatap muka atau daring (*Google Meet, Ruang Dosen, Lab*), catatan persiapan, dan log umpan balik dosen.
- **Papan Pengumuman**: Informasi terpusat dengan filter kategori (*Metodologi, Tenggat, Fasilitas*) serta fitur bookmark dan penanda baca.
- **Pengajuan Fasilitas Lab**: Sistem peminjaman fasilitas (*GPU Workstation RTX 4090, Printer 3D, Sensor IoT, Spektrofotometer*) dengan pelacakan status persetujuan.
- **Portofolio Mahasiswa**: Showcase pencapaian akademik, nilai akhir rubrik, serta ekspor portofolio ke **CSV** dan **JSON**.

### 👨‍🏫 2. Portal Dosen & Juri (Faculty Command)
- **Mission Control 4-in-1**:
  1. *Supervisi & Blocker Clinic*: Tinjauan proyek aktif, pemberian umpan balik terstruktur, dan penanganan kendala teknis.
  2. *Evaluasi Rubrik STEAM Resmi*: Penilaian 4 pilar terstandarisasi (Kelengkapan 25%, Bukti Empiris 25%, Kontribusi 25%, Reproducibility 25%) dengan kalkulasi otomatis nilai akhir dan predikat huruf.
  3. *Reproducibility Package Compiler & Arsip*: Kompilasi satu klik paket verifikasi open science JSON dan pengarsipan proyek terkunci.
  4. *Editor Template & Bobot*: Kustomisasi tahapan checkpoint dan validasi total bobot 100%.
- **Antrean Bimbingan**: Penerimaan, penolakan, penjadwalan, dan penyimpanan feedback sesi bimbingan.
- **Pusat Pengumuman (Broadcasting)**: Publikasi instruksi kepada seluruh mahasiswa atau tim tertentu, lengkap dengan fitur penyematan (*Pinned*).
- **Manajemen Fasilitas & Lab**: Verifikasi dan persetujuan permohonan peminjaman alat/komputasi.
- **Analitik Kohort**: Visualisasi progres kohort, distribusi bidang ilmu, bottleneck tahapan riset, dan ekspor data kohort ke **CSV**.

---

## 🛠️ Arsitektur Teknologi

- **Runtime**: Node.js (v20+ / v22+ / v24+)
- **Database**: Native SQLite (`node:sqlite` DatabaseSync) dengan mode WAL berkinerja tinggi
- **Backend API**: RESTful API terintegrasi pada server HTTP mandiri (*Zero External Dependencies*)
- **Frontend**: Vanilla JavaScript SPA, Semantic HTML5, CSS Modern (Glassmorphism, CSS Custom Properties, Responsive Mobile/Desktop)
- **Keamanan & Sesi**: Autentikasi berbasis peran (*Role-Based Access Control*) dengan akun demo instan 1-klik

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Menjalankan Cepat di Windows (Rekomendasi)
Cukup **klik dua kali** file:
```
start.bat
```
Server akan aktif dan browser otomatis membuka alamat: `http://localhost:3000`.

### Opsi 2: Menjalankan via Terminal / Command Prompt
```bash
node server.js
```
Lalu buka browser Anda di:
```
http://localhost:3000
```

---

## 🔑 Akun Demo Siap Pakai

Aplikasi telah dilengkapi tombol **Akses Demo 1-Klik** di halaman depan:
- **Akun Mahasiswa**: `budi` (Budi Santoso — Sains Data, NIM: 202610101)
- **Akun Dosen / Juri**: `dosen` (Dr. Rahmat Wijaya, M.Sc. — NIP: 198504122010121002)

Anda juga dapat berpindah peran kapan saja saat aplikasi berjalan dengan menekan tombol **"🔄 Tukar Peran"** pada bilah navigasi atas.
