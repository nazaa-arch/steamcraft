# 🎨 Rekapitulasi Catatan Perubahan Desain UI/UX (Design Changelog)
## Platform: STEAM-Craft (`app.steamcraft.online` & `steamcraft.online`)

Dokumen ini mencatat seluruh kronologi iterasi, perbaikan antarmuka (*User Interface*), dan peningkatan pengalaman pengguna (*User Experience*) yang telah diimplementasikan pada proyek platform STEAM-Craft.

---

### 1. 🌟 Identitas Visual & Branding (*Visual Identity*)
- **Diferensiasi Aset Logo**:
  - **`app.steamcraft.online`**: Mempertahankan **Logo Asli STEAM-Craft** (ikon huruf "S" dinamis warna-warni bernuansa sains, teknologi, dan eksplorasi atomik).
  - **`steamcraft.online`**: Menerapkan **Logo Resmi Tim STEAM** (siluet 3 figur peneliti, bintang kejora, dan lintasan orbit multidisiplin).
- **Penyederhanaan Judul Tab Browser (*Document Title / Tab Headline*)**:
  - Pada aplikasi utama (`app.steamcraft.online`), judul tab yang sebelumnya berupa kalimat panjang ("*STEAM-Craft — Platform Riset & Kolaborasi...*") disederhanakan menjadi:
    $$\text{SteamCraft}$$
  - Pada portal DevOps (`adm.steamcraft.online`), judul tab dan headline bilah navigasi diselaraskan menjadi:
    $$\text{Adm Steam}$$
- **Harmonisasi Sistem Warna Desain (STEAM Palette)**:
  - Mengadopsi pedoman warna resmi: *Deep Navy* (`#0A192F`), *Royal Blue* (`#1E3A8A`), *Electric Cyan* (`#38BDF8`), *Violet Insight* (`#8B5CF6`), dan *Emerald Verification* (`#10B981`).

---

### 2. 👥 Showcase Tim & Identitas Anggota (`steamcraft.online`)
- **Penetapan 3 Anggota Tim Pengembang Resmi**:
  - Muhammad Naza Firmansyah (Lead Architecture & Full-Stack Engine)
  - Bima Sena (Hardware IoT & Telemetri Sensor)
  - Sandi Ardi Prayitno (Scientific Methodology & UI/UX Designer)
- **Desain Kartu STEAM ID Card Interaktif (CR80 Standard)**:
  - Dilengkapi fitur interaktif *3D Flip Card* (melihat tampak depan dan belakang kartu identitas tim).
  - Aksen visual gelombang kurva organik (*ambient corner waves*), partikel bintang berpendar (*sparkle stars*), dan efek elevasi kartu saat kursor diarahkan (*hover lift effect*).
  - Tautan portofolio langsung ke laman sub-domain/repositori masing-masing anggota.
- **Pembersihan Elemen Antarmuka**:
  - Menghapus tombol non-fungsional ("Hubungi Tim & Near") sesuai arahan evaluasi.

---

### 3. 🔐 Antarmuka Autentikasi & Gerbang Masuk (*Auth & Gate UX*)
- **Pembersihan Gerbang Master Administrator (`adm.steamcraft.online`)**:
  - Menghapus kartu jalan pintas otomatis (*1-click bypass card*).
  - Menghapus seluruh teks petunjuk/bocoran sandi (*clue "admin123"*) dari placeholder, teks bantuan, maupun pesan validasi untuk memperkuat standar keamanan profesional.
- **Halaman Masuk Aplikasi (`app.steamcraft.online`)**:
  - Tombol demo 1-klik untuk Administrator dihapus dari layar login publik civitas (hanya disisakan akun demo Mahasiswa dan Dosen untuk pengujian dewan juri).
  - Input kredensial demo secara otomatis mengarahkan ke data mahasiswa dan dosen yang valid.
  - Penambahan alur lupa kata sandi (*Forgot Password Modal Flow*) dengan panduan interaktif.

---

### 4. 👩‍🏫 Profil Dosen Pembimbing & Analitik Riset (`AnalyticsPage.tsx`)
- **Penetapan Dosen Pembimbing Utama**:
  - Menetapkan profil resmi: **Dr. Belgis Ainatul Iza, S.Si., M.Mat.** (Dosen S1 Sains Data, FMIPA Universitas Negeri Surabaya / UNESA, NIP `202509237`, email `belgisiza@unesa.ac.id`).
  - Pembaruan ikon avatar menjadi dosen perempuan (`👩‍🏫`) dengan palet warna akademik teal (`#0d9488`).
  - Format penulisan gelar diselaraskan pada bilah atas (*topbar*) dan tanda tangan sertifikat portofolio agar terbebas dari duplikasi kata ("Dr. Dr.").
- **Redesain Bagian "Distribusi Riset Berdasarkan Program Studi Asal"**:
  - **Kartu Sorotan Home Base**: Menampilkan banner informasi resmi bahwa home base dosen pembimbing berpusat di **Program Studi S1 Sains Data — FMIPA UNESA**.
  - **Prioritas Tampilan**: Program studi Sains Data diposisikan di urutan teratas dengan lencana khusus:
    $$\text{★ HOME BASE DOSEN BELGIS}$$
    disertai bar kemajuan bergradasi warna biru royal (`#2563eb` $\rightarrow$ `#38bdf8`).
  - **Filter Interaktif 1-Klik**: Pengguna dapat beralih antara melihat seluruh riset kohort (13 proyek) atau khusus proyek bimbingan Dr. Belgis (6 proyek Sains Data & Klaster MIPA).

---

### 5. 🧭 Navigasi & Komponen Pengalaman Pengguna (*Navigation & UX Components*)
- **Bilah Navigasi Adaptif Layar Laptop (*Scrollable Topbar Nav*)**:
  - Menambahkan tombol kontrol geser horizontal kiri-kanan (*chevron scroll buttons*) pada navbar laptop berlayar 13–14 inci agar menu tidak terpotong atau tumpang tindih.
- **Pembersihan Tautan Antarmuka Luar**:
  - Menghapus tautan canggung ("Hub Projek Tim ↗") dari bilah navigasi internal aplikasi riset agar alur kerja pengguna tetap fokus pada ruang kerja.
- **Penanganan Kesalahan Visual (*Global ErrorBoundary*)**:
  - Menambahkan pelindung antarmuka global (*React ErrorBoundary*). Apabila terjadi kendala saat merender komponen, layar tidak akan menjadi putih kosong (*blank screen*), melainkan menampilkan kartu interaktif ramah pengguna lengkap dengan tombol *"Muat Ulang Halaman"* dan *"Kembali ke Beranda"*.
- **Aksesibilitas Modal**:
  - Seluruh jendela modal dialog kini dapat ditutup instan menggunakan tombol keyboard **Escape (Esc)** maupun klik di luar area modal (*backdrop dismiss*).

---

### 6. 🧪 Pembaruan UI/UX Tahap 2 Berdasarkan Dokumen Masukan Dosen Dr. Belgis (`beta.steamcraft.online`)
- **Halaman Masuk (Login Screen — Fit to Screen / 100vh Lock)**:
  - Mengunci tata letak layar desktop (`height: 100vh`) agar tidak perlu scroll vertikal pada resolusi laptop standar (1366×768 / 1440×900).
  - Menghapus redundansi teks *"Science · Technology · Engineering · Art · Mathematics"* (sebelumnya tercantum 3x, kini hanya 1x).
  - Mengganti ikon huruf `[S]` statis di pojok kiri atas menjadi lencana gradien modern dengan ikon *Sparkles*.
  - Mengadopsi tata letak minimalis dan bersih ala portal *SISTER Kemdikbudristek*:
    - Opsi *Uji Coba Cepat (Akun Demo)* disederhanakan menjadi bilah pil 2-kolom ringkas di bawah tombol utama (CTA).
    - Tautan pendaftaran akun civitas baru diubah menjadi tautan teks elegan.
  - Tag disiplin ilmu di kiri bawah diubah menjadi indikator statis non-klik (*flat data badge indicators*) agar tidak dikira tombol aksi oleh pengguna.
  - Menaikkan kontras teks hak cipta/footer (*"SteamCraft © 2026..."*) menjadi `#475569` agar jelas terbaca.

- **Bilah Navigasi Atas & Profil Dosen (Topbar)**:
  - **Pencegahan Nama Terpotong**: Chip profil di bilah atas menampilkan nama ringkas profesional:
    $$\mathbf{Dr.\ Belgis\ A.\ Iza}$$
    disertai avatar `👩‍🏫`, chevron interaktif, dan status *"Dosen"*.
  - **Dropdown Profil Peneliti (Popover Pojok Kanan Atas)**: Saat diklik, menampilkan popover elegan berisi:
    - Nama lengkap bergelar: **Dr. Belgis Ainatul Iza, S.Si., M.Mat.**
    - NIP: `202509237` | Home Base: S1 Sains Data — FMIPA UNESA | Surel: `belgisiza@unesa.ac.id`
    - Tombol aksi: *"Edit Profil"* & *"Keluar"*.
  - **Penghapusan Scroll Samping Navbar (Opsi 1 Dosen)**:
    - Melakukan penyederhanaan label menu panjang menjadi ringkas:
      *"Katalog Proyek"* $\rightarrow$ **"Proyek"**, *"Open Recruitment"* $\rightarrow$ **"Rekrutmen"**, *"Jadwal & Bimbingan"* $\rightarrow$ **"Bimbingan"**, *"Lab & Fasilitas"* $\rightarrow$ **"Fasilitas"**, *"Portofolio Saya"* $\rightarrow$ **"Portofolio"**, *"Mission Control"* $\rightarrow$ **"Supervisi"**, *"Analitik Kohort"* $\rightarrow$ **"Analitik"**.
    - Menu muat rapi dalam 1 baris tanpa perlu scroll horizontal pada laptop 13–14 inci.
  - **Harmonisasi Rasio Logo**: Menyesuaikan dimensi logo ikon "S" (36px), tipografi judul (17px), dan sub-teks agar seimbang dan proporsional.

- **Tata Kelola Lab & Fasilitas (`ResourcesPage.tsx`)**:
  - **Peningkatan Hierarki Spesifikasi**: Spesifikasi hardware/lab disajikan dalam bentuk *chip badge* modular (misal: `[24GB VRAM GDDR6X]`, `[CUDA 12.4]`, `[PyTorch & TensorFlow]`).
  - **Tombol Aksi Terintegrasi**: Menyejajarkan tombol utama `+ Ajukan Permohonan Fasilitas` dengan judul seksi, serta menambahkan tombol langsung *"Ajukan Peminjaman Fasilitas Ini →"* di dalam setiap kartu katalog.
  - **Ikon Persetujuan**: Tombol verifikasi dilengkapi ikon tegas `[✓ Setujui]` (hijau) dan `[✕ Tolak]` (merah).
  - **Aksi pada Status Disetujui**: Mengisi area aksi permohonan yang telah disetujui dengan tombol operasional:
    - `[📋 Detail Izin Lab]`, `[✓ Selesai]`, dan `[✕ Batalkan]`.
  - **Format Tanggal Humanis**: Mengubah format angka `22/10/2026` menjadi teks pendek yang mudah dicerna: **`22 Okt 2026`**.
  - **Pemisahan 2 Tabel + Paginasi (Mengacu Referensi Daily Task Dosen)**:
    - **Tabel 1**: Permohonan Menunggu Verifikasi Dosen/Lab (Pending Requests).
    - **Tabel 2**: Riwayat Permohonan Disetujui & Selesai (Approved / Archive).
    - Masing-masing tabel dilengkapi pemilih jumlah baris (*Rows per page: 3, 5, 10*) dan tombol navigasi *Prev - Next*.

- **Mission Control & Evaluasi Rubrik (`MissionControlPage.tsx`)**:
  - **Paginasi Daftar Proyek**: Menambahkan fitur *Rows per page* (4, 5, 8, 15) dan tombol navigasi *Prev - Next* pada bilah master proyek riset (13 proyek) agar tidak perlu scroll vertikal yang panjang.
  - **Desain Kartu Filter Interaktif (Gaya SIGAP-ZI FMIPA UNESA)**:
    - Kartu filter status (*"Semua Proyek"*, *"Kendala"*, *"Siap Evaluasi"*, *"Telah Selesai"*) yang sedang aktif diberikan efek **mengambang (*floating elevated card*)** dengan elevasi bayangan `rgba(37,99,235,0.25)` dan *double-layer border* (`0 0 0 2px #2563eb, inset 0 0 0 1px #93c5fd`).

- **Lingkungan Beta Staging (`beta.steamcraft.online`)**:
  - Routing aplikasi mengenali domain `beta.steamcraft.online` dan query `?env=beta`.
  - Dilengkapi banner atas:
    $$\text{🧪 LINGKUNGAN BETA STAGING — Uji Coba UI/UX Masukan Dosen (Dr. Belgis) Telah Aktif}$$
  - Judul tab browser otomatis menampilkan **`SteamCraft [BETA]`**.

---

*Catatan: Seluruh riwayat perubahan di atas tersimpan dengan riwayat diff baris kode per komit pada repositori Git (`main`).*
