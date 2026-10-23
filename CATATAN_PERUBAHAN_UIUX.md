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

*Catatan: Seluruh riwayat perubahan di atas tersimpan dengan riwayat diff baris kode per komit pada repositori Git (`main`).*
