import {
  User,
  Project,
  Checkpoint,
  Journal,
  Version,
  ProjectMember,
  RecruitmentApplication,
  Consultation,
  Announcement,
  ResourceRequest,
  Rubric
} from '../types';

export const DEFAULT_TEMPLATES = {
  data: {
    label: 'Analisis Data / AI',
    cp: [
      ['Fenomena atau masalah', 'Definisikan target, konteks, dan pertanyaan utama riset.'],
      ['Data, bukti, dan jurnal', 'Catat sumber data, lisensi, kualitas, missing values, dan keputusan preprocessing.'],
      ['Model atau solusi', 'Tetapkan baseline, fitur, algoritma, asumsi, dan metrik evaluasi.'],
      ['Simulasi dan pengujian', 'Uji model, simpan parameter dan versi eksperimen, periksa bias atau error.'],
      ['Validasi dan refleksi', 'Evaluasi pada data yang tepat, jelaskan keterbatasan, dan lakukan peer-review.']
    ]
  },
  experiment: {
    label: 'Eksperimen / Laboratorium',
    cp: [
      ['Fenomena atau masalah', 'Rumuskan hipotesis, variabel independen/dependen, dan kondisi eksperimen.'],
      ['Data, bukti, dan jurnal', 'Catat observasi, foto, alat ukur, bahan, kalibrasi, dan replikasi.'],
      ['Model atau solusi', 'Susun prosedur standar operasional (SOP), kebutuhan alat/lab, dan model teoretis.'],
      ['Simulasi dan pengujian', 'Jalankan percobaan, catat hasil pengulangan, galat statistik, serta anomali.'],
      ['Validasi dan refleksi', 'Bandingkan hasil terhadap teori, bahas ketidakpastian, dan lakukan peer-review.']
    ]
  },
  actuary: {
    label: 'Model Risiko / Aktuaria',
    cp: [
      ['Fenomena atau masalah', 'Tentukan profil risiko, populasi studi, horizon waktu, dan tujuan keputusan.'],
      ['Data, bukti, dan jurnal', 'Dokumentasikan sumber data historis, uji distribusi, dan batas keterbatasan.'],
      ['Model atau solusi', 'Pilih pendekatan aktuaria, formulasi matematis, parameter, dan ukuran risiko (VaR/CVaR).'],
      ['Simulasi dan pengujian', 'Uji skenario stres, analisis sensitivitas, dan dampak perubahan parameter makro.'],
      ['Validasi dan refleksi', 'Evaluasi backtesting, kalibrasi model, batas asumsi, dan kepatuhan standar.']
    ]
  },
  free: {
    label: 'Proyek Bebas / Lintas Disiplin',
    cp: [
      ['Fenomena atau masalah', 'Tentukan kebutuhan pengguna riil, urgensi masalah sosial/industri lintas bidang.'],
      ['Data, bukti, dan jurnal', 'Kumpulkan riset terdahulu, observasi lapangan, wawancara, dan bukti pendukung.'],
      ['Model atau solusi', 'Rancang arsitektur solusi multidisiplin dan pembagian kontribusi anggota tim.'],
      ['Simulasi dan pengujian', 'Uji prototipe fungsional bersama pengguna sasaran dan catat umpan balik.'],
      ['Validasi dan refleksi', 'Evaluasi dampak komprehensif, kelayakan implementasi, dan peta jalan iterasi berikutnya.']
    ]
  }
};

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'budi',
    name: 'Budi Santoso',
    role: 'student',
    identifier: '202610101',
    study_program: 'Sains Data',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    university: 'Universitas Indonesia',
    research_interests: 'Machine Learning, IoT Telemetri, Prediksi Cuaca Mikro',
    bio: 'Lead data scientist tim proyek sensor cuaca pertanian presisi.',
    academic_links: 'GitHub: github.com/budisantoso · LinkedIn: /in/budisantoso-sd',
    avatar_color: '#2878d7',
    password: 'password123',
    email: 'budi.santoso@ui.ac.id',
    email_verified: 1
  },
  {
    id: 2,
    username: 'siti',
    name: 'Siti Nurhaliza',
    role: 'student',
    identifier: '202610102',
    study_program: 'Artificial Intelligence',
    faculty: 'Fakultas Ilmu Komputer',
    university: 'Universitas Indonesia',
    research_interests: 'Computer Vision, Edge AI, Brain-Computer Interface',
    bio: 'Pengembang sistem visi komputer cerdas dan otomasi pemilahan sampah.',
    academic_links: 'GitHub: github.com/sitinurhaliza-ai',
    avatar_color: '#37b6a0',
    password: 'password123',
    email: 'siti.nurhaliza@ui.ac.id',
    email_verified: 1
  },
  {
    id: 3,
    username: 'reza',
    name: 'Reza Pratama',
    role: 'student',
    identifier: '202610103',
    study_program: 'Sains Aktuaria',
    faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
    university: 'Institut Teknologi Bandung',
    research_interests: 'Financial Risk Modelling, Monte Carlo, Valuasi Kontinjensi',
    bio: 'Analis risiko finansial mahasiswa perantau berbasis simulasi stokastik.',
    academic_links: 'LinkedIn: /in/rezapratama-actuary',
    avatar_color: '#8060d5',
    password: 'password123',
    email: 'reza.pratama@itb.ac.id',
    email_verified: 1
  },
  {
    id: 4,
    username: 'zahra',
    name: 'Zahra Amalia',
    role: 'student',
    identifier: '202610104',
    study_program: 'Bioteknologi',
    faculty: 'Fakultas Biologi',
    university: 'Universitas Gadjah Mada',
    research_interests: 'Adsorpsi Biochar, Pengolahan Air Limbah, Fitoremediasi',
    bio: 'Peneliti remediasi limbah pewarna batik dengan karbon aktif eceng gondok.',
    academic_links: 'ResearchGate: Zahra Amalia',
    avatar_color: '#ed7b64',
    password: 'password123',
    email: 'zahra.amalia@ugm.ac.id',
    email_verified: 1
  },
  {
    id: 5,
    username: 'dosen',
    name: 'Dr. Rahmat Wijaya, M.Sc.',
    role: 'lecturer',
    identifier: '198504122010121002',
    study_program: 'Fakultas Sains & Teknologi',
    faculty: 'Fakultas Sains & Teknologi',
    university: 'Institut Teknologi Bandung',
    research_interests: 'Instrumentasi Sensor Cerdas, Pemodelan Sains Komputasi',
    bio: 'Dosen pembimbing riset dan penilai standarisasi rubrik ilmiah 4 pilar STEAM.',
    academic_links: 'Scopus ID: 56192841022 · ORCID: 0000-0002-1829-9281',
    avatar_color: '#1e3656',
    password: 'dosen123',
    email: 'rahmat.wijaya@itb.ac.id',
    email_verified: 1
  },
  {
    id: 6,
    username: 'dewi',
    name: 'Prof. Dr. Ir. Dewi Kartika',
    role: 'lecturer',
    identifier: '197908252005012001',
    study_program: 'Departemen Teknik Komputer',
    faculty: 'Fakultas Teknik',
    university: 'Universitas Indonesia',
    research_interests: 'Embedded Robotics, Edge AI, Assisted Living Tech',
    bio: 'Guru besar teknologi rekayasa komputer dan pembina tim robotika nasional.',
    academic_links: 'Scopus ID: 57193821034',
    avatar_color: '#2878d7',
    password: 'dosen123',
    email: 'dewi.kartika@ui.ac.id',
    email_verified: 1
  },
  {
    id: 7,
    username: 'prof_hartono',
    name: 'Prof. Dr. Hartono, M.Si.',
    role: 'lecturer',
    identifier: '197506141999031001',
    study_program: 'Fakultas MIPA / Pendidikan Sains',
    faculty: 'Fakultas MIPA & Pascasarjana Pendidikan Sains',
    university: 'Universitas Negeri Malang',
    research_interests: 'Pendidikan STEAM Terintegrasi, Fisika Lingkungan, Pedagogi Inkuiri',
    bio: 'Guru Besar Pendidikan Sains dan pembimbing riset mahasiswa berprestasi tingkat nasional.',
    academic_links: 'Scopus ID: 57201928100 · SINTA ID: 219084',
    avatar_color: '#047857',
    password: 'dosen123',
    email: 'hartono@um.ac.id',
    email_verified: 1
  },
  {
    id: 8,
    username: 'admin',
    name: 'Administrator Sistem (Lead Dev & Architect)',
    role: 'admin',
    identifier: 'ADM-2026-DEV01',
    study_program: 'Pusat Riset & Rekayasa Sistem',
    faculty: 'Direktorat Sistem Informasi & Laboratorium Terpadu',
    university: 'Universitas Indonesia',
    research_interests: 'System Architecture, Cloud Infrastructure, AI Pipeline & Data Science',
    bio: 'Akun administrator utama platform STEAM-Craft untuk monitoring telemetri riset, tata kelola akses, audit repositori, dan kontrol mode sistem.',
    academic_links: 'GitHub: github.com/steamcraft-admin · Docs: steamcraft.online/docs',
    avatar_color: '#0f172a',
    password: 'admin2026!',
    email: 'admin@steamcraft.ac.id',
    email_verified: 1
  },
  {
    id: 9,
    username: 'fitri',
    name: 'Fitri Handayani',
    role: 'student',
    identifier: '202610105',
    study_program: 'Biologi',
    faculty: 'Fakultas Biologi / FMIPA',
    university: 'Universitas Gadjah Mada',
    research_interests: 'Ekologi Perairan, Bioindikator Makrozoobentos, Analisis Mutu Air',
    bio: 'Peneliti ekologi perairan urban dan konservasi keanekaragaman makroinvertebrata.',
    academic_links: 'ORCID: 0009-0004-1290-7731 · GitHub: github.com/fitri-bio',
    avatar_color: '#10b981',
    password: 'password123',
    email: 'fitri.handayani@mail.ugm.ac.id',
    email_verified: 1
  },
  {
    id: 10,
    username: 'anisa',
    name: 'Anisa Rahmawati',
    role: 'student',
    identifier: '202610106',
    study_program: 'Pendidikan Biologi',
    faculty: 'Fakultas MIPA',
    university: 'Universitas Negeri Yogyakarta',
    research_interests: 'Herbaria 3D, Virtual Lab, Media Pembelajaran STEAM',
    bio: 'Pengembang media pembelajaran interaktif etnobotani dan anatomi tumbuhan 3D.',
    academic_links: 'Google Scholar: Anisa Rahmawati',
    avatar_color: '#059669',
    password: 'password123',
    email: 'anisa.rahmawati@uny.ac.id',
    email_verified: 1
  },
  {
    id: 11,
    username: 'dimas',
    name: 'Dimas Anggara',
    role: 'student',
    identifier: '202610107',
    study_program: 'Kimia',
    faculty: 'Fakultas MIPA',
    university: 'Institut Teknologi Sepuluh Nopember',
    research_interests: 'Kimia Material, Green Chemistry, Bioplastik Kitosan',
    bio: 'Peneliti kimia polimer ramah lingkungan berbasis kitosan cangkang krustasea dengan pendekatan zero waste.',
    academic_links: 'ResearchGate: Dimas Anggara · LinkedIn: /in/dimas-anggara',
    avatar_color: '#8b5cf6',
    password: 'password123',
    email: 'dimas.anggara@its.ac.id',
    email_verified: 1
  },
  {
    id: 12,
    username: 'nurul',
    name: 'Nurul Hidayah',
    role: 'student',
    identifier: '202610108',
    study_program: 'Pendidikan Kimia',
    faculty: 'Fakultas Keguruan dan Ilmu Pendidikan',
    university: 'Universitas Sebelas Maret',
    research_interests: 'Gamifikasi Kimia, Four-Tier Test, Green Chemistry',
    bio: 'Inovator laboratorium titrasi virtual untuk mengatasi miskonsepsi stoikiometri larutan.',
    academic_links: 'LinkedIn: /in/nurul-hidayah-chem',
    avatar_color: '#7c3aed',
    password: 'password123',
    email: 'nurul.hidayah@fkip.uns.ac.id',
    email_verified: 1
  },
  {
    id: 13,
    username: 'bayu',
    name: 'Bayu Wicaksono',
    role: 'student',
    identifier: '202610109',
    study_program: 'Fisika',
    faculty: 'Fakultas MIPA',
    university: 'Universitas Brawijaya',
    research_interests: 'Instrumentasi Optika, Spektroskopi CMOS, Sensor Berbiaya Rendah',
    bio: 'Perancang spektrofotometer mini berbasis kisi difraksi DVD dan modul kamera ESP32-CAM.',
    academic_links: 'GitHub: github.com/bayu-physics',
    avatar_color: '#f97316',
    password: 'password123',
    email: 'bayu.wicaksono@ub.ac.id',
    email_verified: 1
  },
  {
    id: 14,
    username: 'tiara',
    name: 'Tiara Safitri',
    role: 'student',
    identifier: '202610110',
    study_program: 'Pendidikan Fisika',
    faculty: 'Fakultas Tarbiyah dan Keguruan',
    university: 'UIN Sunan Kalijaga',
    research_interests: 'Resonansi Akustik, Pola Chladni, Media Eksperimen Gelombang',
    bio: 'Inovator kit Chladni plate digital untuk visualisasi modus getar 2 dimensi.',
    academic_links: 'Google Scholar: Tiara Safitri',
    avatar_color: '#ea580c',
    password: 'password123',
    email: 'tiara.safitri@uin-suka.ac.id',
    email_verified: 1
  },
  {
    id: 15,
    username: 'hendra',
    name: 'Hendra Kusuma',
    role: 'student',
    identifier: '202610111',
    study_program: 'Matematika',
    faculty: 'Fakultas MIPA',
    university: 'Universitas Airlangga',
    research_interests: 'Pemodelan Epidemiologi SEIR, Sistem Dinamik, Kontrol Optimum',
    bio: 'Peneliti model matematika dinamika penularan DBD dan pelepasan nyamuk Wolbachia.',
    academic_links: 'GitHub: github.com/hendra-math',
    avatar_color: '#2563eb',
    password: 'password123',
    email: 'hendra.kusuma@fst.unair.ac.id',
    email_verified: 1
  },
  {
    id: 16,
    username: 'laila',
    name: 'Laila Munawaroh',
    role: 'student',
    identifier: '202610112',
    study_program: 'Pendidikan Matematika',
    faculty: 'Fakultas Keguruan dan Ilmu Pendidikan (FKIP)',
    university: 'Universitas Negeri Yogyakarta',
    research_interests: 'Etnomatematika, Geometri Fraktal Motif Batik, Media Digital GeoGebra',
    bio: 'Inovator pembelajaran matematika bermakna yang memadukan warisan budaya nusantara (Batik) dengan perangkat lunak manipulatif.',
    academic_links: 'Google Scholar: Laila Munawaroh · GitHub: github.com/laila-math',
    avatar_color: '#1d4ed8',
    password: 'password123',
    email: 'laila.munawaroh@uny.ac.id',
    email_verified: 1
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Prediksi Cuaca Mikro berbasis Stasiun Cuaca IoT',
    desc: 'Eksplorasi pola cuaca lokal dan evaluasi model prediksi berbasis deep learning untuk mitigasi pertanian presisi.',
    study: 'Sains Data',
    steam: 'Science + Data',
    template: 'data',
    status: 'Aktif',
    progress: 40,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'Data Analyst, ML Engineer, Hardware IoT',
    goal: 'Bagaimana model deep learning LSTM dapat memprediksi anomali curah hujan dan kelembaban mikro pada lahan pertanian?',
    tools: 'Python, PyTorch, ESP32, Grafana, Pandas',
    repo_url: 'https://github.com/steamcraft/microclimate-iot-lstm',
    lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
    creator_id: 1,
    creator_username: 'budi',
    versions_count: 3,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 92, T: 88, E: 80, A: 65, M: 85 },
    is_demo: 1
  },
  {
    id: 2,
    name: 'Deteksi Sampah pada Citra Konveyor Real-Time',
    desc: 'Menguji klasifikasi dan segmentasi citra berbasis Edge AI untuk otomatisasi pemilahan sampah daur ulang.',
    study: 'Artificial Intelligence',
    steam: 'Technology + AI',
    template: 'data',
    status: 'Menunggu persetujuan',
    progress: 0,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'ML Engineer, UI/UX Designer, Embedded Systems',
    goal: 'Seberapa akurat arsitektur YOLOv8 Nano mendeteksi jenis sampah plastik pada kecepatan konveyor 0.4 m/s?',
    tools: 'Python, YOLOv8, OpenCV, Jetson Nano, PySide6',
    repo_url: 'https://github.com/steamcraft/trash-edge-detector',
    lecturer: 'Prof. Dr. Ir. Dewi Kartika',
    creator_id: 2,
    creator_username: 'siti',
    versions_count: 1,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 75, T: 95, E: 88, A: 82, M: 78 },
    is_demo: 1
  },
  {
    id: 3,
    name: 'Model Risiko Keuangan Mahasiswa Perantau',
    desc: 'Mengeksplorasi skenario anggaran bulanan, inflasi living cost, dan indikator risiko defisit mahasiswa.',
    study: 'Sains Aktuaria',
    steam: 'Mathematics + Modelling',
    template: 'actuary',
    status: 'Aktif',
    progress: 20,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'Risk Analyst, Data Visualizer, Frontend Dev',
    goal: 'Bagaimana perubahan harga pangan dan sewa kos memengaruhi probabilitas defisit bulanan mahasiswa perantau?',
    tools: 'R, Python, Monte Carlo Sim, Streamlit',
    repo_url: 'https://github.com/steamcraft/student-financial-risk',
    lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
    creator_id: 3,
    creator_username: 'reza',
    versions_count: 2,
    blocker: 1,
    blocker_reason: 'Distribusi pengeluaran non-makanan memiliki kemiringan (skewness) ekstrim dan kekurangan data dari mahasiswa tingkat akhir.',
    steam_scores: { S: 80, T: 82, E: 70, A: 75, M: 96 },
    is_demo: 1
  },
  {
    id: 4,
    name: 'Bio-Filter Limbah Batik menggunakan Eceng Gondok Teraktivasi',
    desc: 'Sintesis dan karakterisasi karbon aktif dari limbah eceng gondok untuk adsorpsi zat warna sintetis tekstil.',
    study: 'Bioteknologi',
    steam: 'Science + Engineering',
    template: 'experiment',
    status: 'Review diajukan',
    progress: 80,
    members_count: 4,
    open_recruitment: 0,
    recruitment_roles: 'Kimia Analitik, Lab Assistant',
    goal: 'Berapa kapasitas adsorpsi maksimum (Qmax) karbon aktif eceng gondok terhadap zat warna Remazol Black B pada pH asam?',
    tools: 'Spektrofotometer UV-Vis, FTIR, Muffle Furnace, Shaker',
    repo_url: 'https://github.com/steamcraft/biochar-water-purifier',
    lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
    creator_id: 4,
    creator_username: 'zahra',
    versions_count: 4,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 95, T: 78, E: 92, A: 68, M: 84 },
    is_demo: 1
  },
  {
    id: 5,
    name: 'Robot Kursi Roda Cerdas Kendali Sinyal Gelombang Otak (EEG)',
    desc: 'Pengembangan assistive technology navigasi kursi roda menggunakan antarmuka otak-komputer (BCI) dan sensor LiDAR anti-tabrakan.',
    study: 'Teknik Biomedis & Komputer',
    steam: 'Technology + Engineering + Mathematics',
    template: 'experiment',
    status: 'Selesai',
    progress: 100,
    members_count: 4,
    open_recruitment: 0,
    recruitment_roles: '',
    goal: 'Dapatkah sinyal Motor Imagery EEG mengontrol orientasi kursi roda dengan latensi < 400ms dan tingkat keberhasilan navigasi > 90%?',
    tools: 'OpenBCI, ROS2, Arduino, LiDAR 2D, Python',
    repo_url: 'https://github.com/steamcraft/smart-wheelchair-bci',
    lecturer: 'Prof. Dr. Ir. Dewi Kartika',
    creator_id: 2,
    creator_username: 'siti',
    versions_count: 6,
    blocker: 0,
    blocker_reason: '',
    final_score: 94.5,
    final_grade: 'A (Sangat Memuaskan)',
    final_note: 'Karya inovatif luar biasa! Dokumentasi sangat lengkap, kode terstruktur rapi, validasi klinis pada subjek sehat terdokumentasi dengan sangat baik.',
    evaluation_recorded: 1,
    package_compiled: 1,
    package_filename: 'steamcraft-reproducibility-smart-wheelchair-bci.json',
    steam_scores: { S: 88, T: 96, E: 94, A: 85, M: 90 },
    is_demo: 1
  },
  {
    id: 6,
    name: 'Bioindikator Kualitas Air Sungai Menggunakan Keanekaragaman Makrozoobentos & Indeks Biotik',
    desc: 'Bioassessment keanekaragaman ordo EPT (Ephemeroptera, Plecoptera, Trichoptera) dan korelasi parameter fisikokimia untuk memetakan status mutu air sungai urban.',
    study: 'Biologi',
    steam: 'Science + Environment',
    template: 'experiment',
    status: 'Aktif',
    progress: 60,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'Taksonomis Makroinvertebrata, Kimia Lingkungan, GIS Specialist',
    goal: 'Bagaimana korelasi indeks Family Biotic Index (FBI) dan EPT Richness terhadap konsentrasi nutrien fosfat dan amonia di stasiun sungai perkotaan?',
    tools: 'Surber Sampler, Mikroskop Stereo, DO Meter, GPS Garmin, PAST, QGIS',
    repo_url: 'https://github.com/steamcraft/macroinvertebrate-water-bioassessment',
    lecturer: 'Prof. Dr. Hartono, M.Si.',
    creator_id: 9,
    creator_username: 'fitri',
    versions_count: 3,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 95, T: 80, E: 78, A: 70, M: 88 },
    is_demo: 1
  },
  {
    id: 7,
    name: 'Herbaria Digital & Lab Virtual 3D Anatomi Tumbuhan Berbasis Etnobotani Tanaman Obat',
    desc: 'Inovasi media ajar interaktif menggabungkan fotogrametri 3D spesimen herbaria dengan kearifan lokal etnofarmakologi untuk pembelajaran inkuiri STEAM.',
    study: 'Pendidikan Biologi',
    steam: 'Science + Art/Technology',
    template: 'free',
    status: 'Review diajukan',
    progress: 80,
    members_count: 4,
    open_recruitment: 0,
    recruitment_roles: '',
    goal: 'Apakah media herbaria digital 3D berpendekatan STEAM efektif meningkatkan keterampilan proses sains dan literasi konservasi tumbuhan siswa?',
    tools: 'Blender 3D, Unity, Kamera Makro Canon, AR.js, Google Sites, WebGL',
    repo_url: 'https://github.com/steamcraft/digital-herbaria-steam-education',
    lecturer: 'Prof. Dr. Hartono, M.Si.',
    creator_id: 10,
    creator_username: 'anisa',
    versions_count: 4,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 90, T: 88, E: 76, A: 94, M: 75 },
    is_demo: 1
  },
  {
    id: 8,
    name: 'Sintesis Bioplastik Kitosan dari Limbah Cangkang Rajungan dengan Pemlastis Gliserol',
    desc: 'Karakterisasi sifat mekanik, laju biodegradasi tanah, dan analisis gugus fungsi bioplastik berbahan dasar kitosan limbah industri perikanan.',
    study: 'Kimia',
    steam: 'Science + Engineering',
    template: 'experiment',
    status: 'Aktif',
    progress: 60,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'Kimia Polimer, Material Testing, UI Visualizer',
    goal: 'Bagaimana pengaruh variasi rasio kitosan-gliserol terhadap kuat tarik (tensile strength) dan spektrum FTIR ikatan hidrogen bioplastik?',
    tools: 'Spektrofotometer FTIR, Universal Testing Machine, Desikator, Neraca Analitik, Muffle Furnace',
    repo_url: 'https://github.com/steamcraft/chitosan-bioplastic-green-chemistry',
    lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
    creator_id: 11,
    creator_username: 'dimas',
    versions_count: 3,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 96, T: 84, E: 90, A: 70, M: 85 },
    is_demo: 1
  },
  {
    id: 9,
    name: 'Laboratorium Virtual Gamifikasi Titrasi Asam-Basa Berprinsip Kimia Hijau (Green Chemistry)',
    desc: 'Pengembangan media eksperimen kimia virtual interaktif berbasis web untuk mereduksi miskonsepsi stoikiometri larutan dan limbah praktikum kimia.',
    study: 'Pendidikan Kimia',
    steam: 'Science + Technology/Art',
    template: 'free',
    status: 'Aktif',
    progress: 40,
    members_count: 3,
    open_recruitment: 1,
    recruitment_roles: 'Web Developer, Pedagogical Reviewer, Graphic Artist',
    goal: 'Bagaimana efektivitas simulasi laboratorium titrasi virtual dalam mereduksi miskonsepsi titik ekuivalen pada tes diagnostik Four-Tier siswa?',
    tools: 'Construct 3, WebGL, PhET Framework, Canva, Google Forms (Diagnostic Four-Tier Test)',
    repo_url: 'https://github.com/steamcraft/green-chemistry-virtual-lab',
    lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
    creator_id: 12,
    creator_username: 'nurul',
    versions_count: 2,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 88, T: 92, E: 75, A: 92, M: 86 },
    is_demo: 1
  },
  {
    id: 10,
    name: 'Rancang Bangun Spektrofotometer Mini Berbiaya Rendah berbasis Kisi Difraksi DVD dan Sensor CMOS',
    desc: 'Instrumentasi spektroskopi absorpsi mandiri menggunakan komponen berbiaya terjangkau untuk pengujian konsentrasi zat warna dan kekeruhan air.',
    study: 'Fisika',
    steam: 'Science + Engineering',
    template: 'experiment',
    status: 'Aktif',
    progress: 60,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'Optika & Sensor, Python Developer, 3D Modeler PETG',
    goal: 'Berapa tingkat linearitas kalibrasi hukum Beer-Lambert pada spektrofotometer mini berbasis ESP32-CAM dibandingkan instrumen industri standar?',
    tools: 'ESP32-CAM, Kisi Difraksi DVD 1000 lines/mm, LED Putih High-CRI, Python, SciPy, 3D Printer PETG',
    repo_url: 'https://github.com/steamcraft/diy-mini-spectrophotometer',
    lecturer: 'Prof. Dr. Ir. Dewi Kartika',
    creator_id: 13,
    creator_username: 'bayu',
    versions_count: 3,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 96, T: 94, E: 92, A: 68, M: 90 },
    is_demo: 1
  },
  {
    id: 11,
    name: 'Kit Eksperimen Resonansi Akustik Chladni Plate Digital untuk Visualisasi Modus Getar 2D',
    desc: 'Inovasi kit praktikum fisika gelombang mekanik berbantuan sinyal audio presisi mikrokontroler dan pemodelan pola simpul pasir dua dimensi.',
    study: 'Pendidikan Fisika',
    steam: 'Science + Art/Education',
    template: 'free',
    status: 'Selesai',
    progress: 100,
    members_count: 4,
    open_recruitment: 0,
    recruitment_roles: '',
    goal: 'Bagaimana pemanfaatan pola Chladni plate memudahkan visualisasi fungsi Bessel gelombang berdiri 2D serta mereduksi miskonsepsi getaran siswa?',
    tools: 'Generator Sinyal DDS, Driver Transduser Piezoelektrik, Pelat Logam, Pasir Kuarsa, Tracker Video Analysis',
    repo_url: 'https://github.com/steamcraft/chladni-plate-physics-education',
    lecturer: 'Prof. Dr. Hartono, M.Si.',
    creator_id: 14,
    creator_username: 'tiara',
    versions_count: 5,
    blocker: 0,
    blocker_reason: '',
    final_score: 93.8,
    final_grade: 'A (Sangat Memuaskan)',
    final_note: 'Karya media STEAM luar biasa! Menggabungkan sains gelombang murni dengan estetika visual simetris yang sangat kuat untuk pedagogi fisika.',
    evaluation_recorded: 1,
    package_compiled: 1,
    package_filename: 'steamcraft-reproducibility-chladni-plate.json',
    steam_scores: { S: 95, T: 88, E: 85, A: 96, M: 90 },
    is_demo: 1
  },
  {
    id: 12,
    name: 'Pemodelan Dinamika Transmisi Epidemiologi SEIR Demam Berdarah Dengue dengan Kontrol Optimum',
    desc: 'Analisis stabilitas titik kesetimbangan, bilangan reproduksi dasar (R0), dan simulasi numerik strategi intervensi biokontrol nyamuk Wolbachia.',
    study: 'Matematika',
    steam: 'Mathematics + Science',
    template: 'actuary',
    status: 'Aktif',
    progress: 60,
    members_count: 3,
    open_recruitment: 1,
    recruitment_roles: 'Pemodelan Numerik, Biomatematika, Visualisasi Data',
    goal: 'Bagaimana analisis sensitivitas parameter transmisi penyakit pada model SEIR nonlinier menentukan efektivitas waktu pelepasan nyamuk Wolbachia?',
    tools: 'MATLAB, Wolfram Mathematica, Python (SciPy solve_ivp), LaTeX, Inkscape',
    repo_url: 'https://github.com/steamcraft/dengue-seir-mathematical-model',
    lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
    creator_id: 15,
    creator_username: 'hendra',
    versions_count: 3,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 86, T: 84, E: 74, A: 70, M: 98 },
    is_demo: 1
  },
  {
    id: 13,
    name: 'Etnomatematika Geometri Fraktal Batik Tradisional Nusantara Berbantuan Manipulatif Digital GeoGebra',
    desc: 'Eksplorasi konsep transformasi geometri, iterasi rekursif, dan dimensi fraktal Hausdorff pada motif Batik Kawung dan Parang untuk pembelajaran bermakna.',
    study: 'Pendidikan Matematika',
    steam: 'Mathematics + Art',
    template: 'free',
    status: 'Aktif',
    progress: 40,
    members_count: 4,
    open_recruitment: 1,
    recruitment_roles: 'GeoGebra Expert, Budayawan Batik, Desainer Modul Ajar STEAM',
    goal: 'Bagaimana pembelajaran matematika berbasis etnomatematika batik meningkatkan kemampuan koneksi matematis dan apresiasi budaya siswa?',
    tools: 'GeoGebra 3D, Fractint, Adobe Illustrator, Lembar Aktivitas Siswa (LAS) STEAM',
    repo_url: 'https://github.com/steamcraft/ethnomathematics-batik-geogebra',
    lecturer: 'Prof. Dr. Hartono, M.Si.',
    creator_id: 16,
    creator_username: 'laila',
    versions_count: 2,
    blocker: 0,
    blocker_reason: '',
    steam_scores: { S: 80, T: 85, E: 72, A: 98, M: 95 },
    is_demo: 1
  }
];

export function generateInitialCheckpoints(): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];
  let cpId = 1;

  const projectStatusList: Record<number, number[]> = {
    1: [1, 1, 0, 0, 0],
    2: [0, 0, 0, 0, 0],
    3: [1, 0, 0, 0, 0],
    4: [1, 1, 1, 1, 0],
    5: [1, 1, 1, 1, 1],
    6: [1, 1, 1, 0, 0],
    7: [1, 1, 1, 1, 0],
    8: [1, 1, 1, 0, 0],
    9: [1, 1, 0, 0, 0],
    10: [1, 1, 1, 0, 0],
    11: [1, 1, 1, 1, 1],
    12: [1, 1, 1, 0, 0],
    13: [1, 1, 0, 0, 0]
  };

  INITIAL_PROJECTS.forEach(p => {
    const tpl = DEFAULT_TEMPLATES[p.template] || DEFAULT_TEMPLATES.experiment;
    const checks = projectStatusList[p.id] || [0, 0, 0, 0, 0];

    tpl.cp.forEach((stage, idx) => {
      const isDone = checks[idx] || 0;
      checkpoints.push({
        id: cpId++,
        project_id: p.id,
        stage_index: idx,
        title: stage[0],
        description: stage[1],
        is_completed: isDone,
        completed_at: isDone ? '2026-10-15 14:00:00' : null,
        completed_by: isDone ? `${p.creator_username || 'Ketua Tim'} (${p.study})` : null
      });
    });
  });

  return checkpoints;
}

export const INITIAL_JOURNALS: Journal[] = [
  {
    id: 1,
    project_id: 1,
    author_name: 'Budi Santoso',
    tag: 'Metodologi',
    content: 'Melakukan kalibrasi sensor DHT22 dan BME280 di ruang terkendali. Didapatkan deviasi suhu rata-rata 0.2 C.',
    file_name: 'kalibrasi_sensor_bme280.csv',
    created_at: '2026-10-12 11:20:00'
  },
  {
    id: 2,
    project_id: 1,
    author_name: 'Budi Santoso',
    tag: 'Data',
    content: 'Mengunduh dataset historis BMKG stasiun terdekat (2020-2025) sebagai pembanding baseline.',
    created_at: '2026-10-14 09:15:00'
  },
  {
    id: 3,
    project_id: 1,
    author_name: 'Budi Santoso',
    tag: 'Eksperimen',
    content: 'Pengujian transmisi paket data LoRaWAN sejauh 1.2 KM berhasil dengan packet loss < 2%.',
    created_at: '2026-10-16 16:45:00'
  },
  {
    id: 4,
    project_id: 2,
    author_name: 'Siti Nurhaliza',
    tag: 'Observasi',
    content: 'Survei langsung ke TPS 3R kampus. Mengumpulkan 500 foto awal botol plastik PET, HDPE, dan kaleng.',
    created_at: '2026-10-10 14:00:00'
  },
  {
    id: 5,
    project_id: 3,
    author_name: 'Reza Pratama',
    tag: 'Metodologi',
    content: 'Menyusun kuesioner terstruktur dengan metode stratified random sampling 10 fakultas.',
    created_at: '2026-10-11 13:00:00'
  },
  {
    id: 6,
    project_id: 3,
    author_name: 'Reza Pratama',
    tag: 'Blocker',
    content: 'Distribusi pengeluaran non-rutin sangat bervariasi. Perlu konsultasi pemilihan distribusi Generalized Extreme Value (GEV).',
    file_name: 'monte_carlo_risk_simulation.py',
    created_at: '2026-10-15 10:30:00'
  },
  {
    id: 7,
    project_id: 4,
    author_name: 'Zahra Amalia',
    tag: 'Eksperimen',
    content: 'Karbonisasi pada suhu 500 C selama 2 jam dengan aktivator H3PO4 20%. Hasil rendemen 42.8%.',
    created_at: '2026-10-13 15:20:00'
  },
  {
    id: 8,
    project_id: 4,
    author_name: 'Zahra Amalia',
    tag: 'Evaluasi',
    content: 'Uji spektrofotometri menunjukkan penurunan konsentrasi warna hingga 94.2% dalam waktu kontak 60 menit.',
    created_at: '2026-10-16 11:40:00'
  },
  {
    id: 9,
    project_id: 5,
    author_name: 'Siti Nurhaliza',
    tag: 'Validasi',
    content: 'Pengujian rute labirin 15 meter dengan 5 rintangan dinamis berhasil diselesaikan 9 dari 10 percobaan.',
    created_at: '2026-10-14 17:00:00'
  },
  {
    id: 10,
    project_id: 6,
    author_name: 'Fitri Handayani',
    tag: 'Metodologi',
    content: 'Penentuan 5 stasiun sampling di hulu, tengah, dan hilir sungai menggunakan metode purposive random sampling.',
    created_at: '2026-10-14 08:30:00'
  },
  {
    id: 11,
    project_id: 11,
    author_name: 'Tiara Safitri',
    tag: 'Validasi',
    content: 'Uji efektivitas pada 45 siswa SMA: pemahaman konsep simpul dan perut gelombang 2D meningkat 44%.',
    created_at: '2026-10-15 14:10:00'
  }
];

export const INITIAL_VERSIONS: Version[] = [
  {
    id: 1,
    project_id: 1,
    version_number: 1,
    note: 'Inisialisasi arsitektur sensor ESP32 dan skrip penerima Flask lokal.',
    artifact_url: 'https://github.com/steamcraft/microclimate-iot-lstm/tree/v1.0',
    file_name: 'sensor_setup.ino',
    created_at: '2026-10-08 10:00:00'
  },
  {
    id: 2,
    project_id: 1,
    version_number: 2,
    note: 'Implementasi kalibrasi sensor BME280 dan buffer penyimpanan microSD lokal.',
    artifact_url: 'https://github.com/steamcraft/microclimate-iot-lstm/tree/v2.0',
    created_at: '2026-10-12 14:30:00'
  },
  {
    id: 3,
    project_id: 1,
    version_number: 3,
    note: 'Integrasi modul transmisi LoRa SX1278 dan visualisasi Grafana.',
    artifact_url: 'https://github.com/steamcraft/microclimate-iot-lstm/tree/v3.0',
    created_at: '2026-10-16 16:00:00'
  },
  {
    id: 4,
    project_id: 5,
    version_number: 6,
    note: 'Final verified release: ROS2 control node, filter bandpass EEG Butterworth, and LiDAR obstacle avoidance package.',
    artifact_url: 'https://github.com/steamcraft/smart-wheelchair-bci/releases/tag/v6.0-final',
    file_name: 'steamcraft-reproducibility-smart-wheelchair-bci.json',
    created_at: '2026-10-16 18:00:00'
  }
];

export const INITIAL_MEMBERS: ProjectMember[] = [
  // Proyek 1: Cuaca Mikro
  { id: 1, project_id: 1, user_id: 1, name: 'Budi Santoso', identifier: '202610101', study_program: 'Sains Data', role: 'Ketua Tim & Lead Data Scientist', is_lead: 1, avatar_color: '#2878d7' },
  { id: 2, project_id: 1, user_id: 14, name: 'Tiara Safitri', identifier: '202610110', study_program: 'Pendidikan Fisika', role: 'Instrumentasi & Kalibrasi Sensor', is_lead: 0, avatar_color: '#ea580c' },
  { id: 3, project_id: 1, user_id: 15, name: 'Hendra Kusuma', identifier: '202610111', study_program: 'Matematika', role: 'Pemodelan Deret Waktu & Galat', is_lead: 0, avatar_color: '#2563eb' },
  { id: 4, project_id: 1, user_id: 16, name: 'Laila Munawaroh', identifier: '202610112', study_program: 'Pendidikan Matematika', role: 'Visualisasi Dashboard & Dokumentasi', is_lead: 0, avatar_color: '#1d4ed8' },

  // Proyek 2: Deteksi Sampah
  { id: 5, project_id: 2, user_id: 2, name: 'Siti Nurhaliza', identifier: '202610102', study_program: 'Artificial Intelligence', role: 'Ketua Tim & Computer Vision Engineer', is_lead: 1, avatar_color: '#37b6a0' },
  { id: 6, project_id: 2, user_id: 13, name: 'Bayu Wicaksono', identifier: '202610109', study_program: 'Fisika', role: 'Optika Kamera & High-Speed Lighting', is_lead: 0, avatar_color: '#f97316' },
  { id: 7, project_id: 2, user_id: 11, name: 'Dimas Anggara', identifier: '202610107', study_program: 'Kimia', role: 'Karakterisasi Polimer Plastik', is_lead: 0, avatar_color: '#8b5cf6' },
  { id: 8, project_id: 2, user_id: 1, name: 'Budi Santoso', identifier: '202610101', study_program: 'Sains Data', role: 'Pipeline Preprocessing Dataset', is_lead: 0, avatar_color: '#2878d7' },

  // Proyek 3: Risiko Keuangan
  { id: 9, project_id: 3, user_id: 3, name: 'Reza Pratama', identifier: '202610103', study_program: 'Sains Aktuaria', role: 'Ketua Tim & Risk Modeler', is_lead: 1, avatar_color: '#8060d5' },
  { id: 10, project_id: 3, user_id: 15, name: 'Hendra Kusuma', identifier: '202610111', study_program: 'Matematika', role: 'Formulasi Stokastik & Monte Carlo', is_lead: 0, avatar_color: '#2563eb' },
  { id: 11, project_id: 3, user_id: 2, name: 'Siti Nurhaliza', identifier: '202610102', study_program: 'Artificial Intelligence', role: 'Automated Scoring ML Pipeline', is_lead: 0, avatar_color: '#37b6a0' },
  { id: 12, project_id: 3, user_id: 16, name: 'Laila Munawaroh', identifier: '202610112', study_program: 'Pendidikan Matematika', role: 'Analisis Sensitivitas & Survei', is_lead: 0, avatar_color: '#1d4ed8' },

  // Proyek 4: Biofilter Eceng Gondok
  { id: 13, project_id: 4, user_id: 4, name: 'Zahra Amalia', identifier: '202610104', study_program: 'Bioteknologi', role: 'Ketua Tim & Lead Biotechnologist', is_lead: 1, avatar_color: '#ed7b64' },
  { id: 14, project_id: 4, user_id: 9, name: 'Fitri Handayani', identifier: '202610105', study_program: 'Biologi', role: 'Uji Fitoremediasi & Fisiologi Tanaman', is_lead: 0, avatar_color: '#10b981' },
  { id: 15, project_id: 4, user_id: 11, name: 'Dimas Anggara', identifier: '202610107', study_program: 'Kimia', role: 'Spektrofotometri Logam Berat', is_lead: 0, avatar_color: '#8b5cf6' },
  { id: 16, project_id: 4, user_id: 10, name: 'Anisa Rahmawati', identifier: '202610106', study_program: 'Pendidikan Biologi', role: 'Edukasi Komunitas Limbah Batik', is_lead: 0, avatar_color: '#059669' },

  // Proyek 5: Kursi Roda EEG
  { id: 17, project_id: 5, user_id: 2, name: 'Siti Nurhaliza', identifier: '202610102', study_program: 'Artificial Intelligence', role: 'Ketua Tim & Brain-Computer Interface', is_lead: 1, avatar_color: '#37b6a0' },
  { id: 18, project_id: 5, user_id: 13, name: 'Bayu Wicaksono', identifier: '202610109', study_program: 'Fisika', role: 'Instrumentasi Elektroda & Sinyal EEG', is_lead: 0, avatar_color: '#f97316' },
  { id: 19, project_id: 5, user_id: 4, name: 'Zahra Amalia', identifier: '202610104', study_program: 'Bioteknologi', role: 'Neurobiologi & Uji Ergonomis', is_lead: 0, avatar_color: '#ed7b64' },
  { id: 20, project_id: 5, user_id: 3, name: 'Reza Pratama', identifier: '202610103', study_program: 'Sains Aktuaria', role: 'Uji Keandalan & Safety Assessment', is_lead: 0, avatar_color: '#8060d5' }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 1,
    project_id: 1,
    student_name: 'Budi Santoso',
    lecturer_name: 'Dr. Rahmat Wijaya, M.Sc.',
    topic: 'Review validasi model LSTM dan kalibrasi sensor IoT',
    type: 'Review checkpoint',
    mode: 'Online (Google Meet)',
    date: '2026-10-20',
    time: '10:00',
    note: 'Siapkan grafik loss training vs validation dan data kalibrasi BME280.',
    feedback: null,
    status: 'Terjadwal',
    created_at: '2026-10-15 10:00:00'
  },
  {
    id: 2,
    project_id: 3,
    student_name: 'Reza Pratama',
    lecturer_name: 'Dr. Rahmat Wijaya, M.Sc.',
    topic: 'Klinik blocker penanganan outlier data pengeluaran ekstrem',
    type: 'Klinik metodologi',
    mode: 'Ruang dosen FST 302',
    date: '2026-10-21',
    time: '13:30',
    note: 'Bawa ringkasan data kuesioner dan plot QQ-Normal.',
    feedback: null,
    status: 'Terjadwal',
    created_at: '2026-10-15 14:00:00'
  },
  {
    id: 3,
    project_id: 4,
    student_name: 'Zahra Amalia',
    lecturer_name: 'Dr. Rahmat Wijaya, M.Sc.',
    topic: 'Evaluasi kelayakan manuskrip jurnal dan hasil spektrofotometer',
    type: 'Review checkpoint',
    mode: 'Laboratorium Kimia Terpadu',
    date: '2026-10-18',
    time: '09:00',
    note: 'Bawa sampel karbon aktif dan kuvet uji.',
    feedback: 'Hasil adsorpsi sangat menjanjikan, tambahkan uji isoterm Freundlich dan kaji laju kinetika pseudo orde kedua.',
    status: 'Selesai',
    created_at: '2026-10-12 11:00:00'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    author_name: 'Biro Riset & Kemahasiswaan',
    title: 'Panduan Awal & Kolaborasi Riset Multidisiplin Mahasiswa',
    category: 'Akademik',
    target: 'all',
    body: 'Selamat datang di platform STEAM-Craft. Mahasiswa baru dapat menjelajahi Katalog Proyek untuk bergabung dengan tim lintas program studi, atau mempublikasikan topik riset mandiri melalui menu Buat Proyek Baru.',
    pinned: 1,
    created_at: '2026-10-15 08:00:00',
    is_read: true,
    is_saved: false
  },
  {
    id: 2,
    author_name: 'Dr. Rahmat Wijaya, M.Sc.',
    title: 'Standar Dokumentasi Checkpoint & Reproducibility Riset',
    category: 'Metodologi',
    target: 'teams',
    body: 'Setiap tim wajib mendokumentasikan dataset, parameter eksperimen, lisensi, dan log galat pada jurnal workspace. Reproducibility package akan menjadi bobot 25% penilaian akhir.',
    pinned: 1,
    created_at: '2026-10-15 09:30:00',
    is_read: false,
    is_saved: true
  },
  {
    id: 3,
    author_name: 'Panitia Lomba STEAM Nasional 2026',
    title: 'Tenggat Pengajuan Review Tengah Proyek (Mid-Evaluation)',
    category: 'Tenggat',
    target: 'teams',
    body: 'Batas akhir penyelesaian Checkpoint 3 (Model atau Solusi) adalah tanggal 25 Oktober 2026 pukul 23:59 WIB. Pastikan repositori GitHub terhubung.',
    pinned: 1,
    created_at: '2026-10-16 11:00:00',
    is_read: false,
    is_saved: false
  },
  {
    id: 4,
    author_name: 'Laboratorium Riset Terpadu',
    title: 'Prosedur Pengajuan Akses GPU Workstation & 3D Printing',
    category: 'Fasilitas',
    target: 'teams',
    body: 'Tim yang membutuhkan komputasi CUDA atau pencetakan casing prototipe dapat mengajukan permohonan melalui menu "Ajukan Fasilitas" H-2 sebelum pemakaian.',
    pinned: 0,
    created_at: '2026-10-14 13:00:00',
    is_read: true,
    is_saved: false
  }
];

export const INITIAL_RESOURCE_REQUESTS: ResourceRequest[] = [
  {
    id: 1,
    project_id: 2,
    student_name: 'Siti Nurhaliza',
    resource_name: 'GPU Workstation (NVIDIA RTX 4090)',
    date_needed: '2026-10-22',
    note: 'Training model YOLOv8x dengan resolusi 640x640 selama 300 epochs.',
    status: 'Menunggu',
    feedback: null,
    created_at: '2026-10-15 15:30:00'
  },
  {
    id: 2,
    project_id: 1,
    student_name: 'Budi Santoso',
    resource_name: 'Kit Mikrokontroler & Modul LoRa SX1278',
    date_needed: '2026-10-14',
    note: 'Pengujian transmisi stasiun cuaca mikro outdoor.',
    status: 'Disetujui',
    feedback: 'Peralatan telah diserahkan di Lab Elektronika Lantai 3.',
    created_at: '2026-10-11 10:15:00'
  },
  {
    id: 3,
    project_id: 5,
    student_name: 'Siti Nurhaliza',
    resource_name: 'Printer 3D & Rapid Prototyping',
    date_needed: '2026-10-10',
    note: 'Pencetakan mounting sensor EEG dan case mikrokontroler.',
    status: 'Disetujui',
    feedback: 'Filament PLA warna biru telah digunakan.',
    created_at: '2026-10-08 09:00:00'
  }
];

export const INITIAL_APPLICATIONS: RecruitmentApplication[] = [
  {
    id: 1,
    project_id: 1,
    applicant_name: 'Dimas Anggara',
    applicant_study: 'Teknik Elektro',
    applicant_role: 'Hardware IoT',
    message: 'Saya memiliki pengalaman 2 tahun dengan protokol LoRaWAN dan ESP32 di perkebunan teh.',
    status: 'Menunggu',
    created_at: '2026-10-15 11:00:00'
  },
  {
    id: 2,
    project_id: 2,
    applicant_name: 'Aulia Putri',
    applicant_study: 'Desain Komunikasi Visual',
    applicant_role: 'UI/UX Designer',
    message: 'Tertarik merancang dashboard monitoring pemilahan sampah yang ramah pengguna.',
    status: 'Menunggu',
    created_at: '2026-10-16 14:20:00'
  }
];

export const INITIAL_RUBRICS: Rubric[] = [
  {
    id: 1,
    project_id: 5,
    score_completeness: 95.0,
    score_evidence: 92.0,
    score_contribution: 94.0,
    score_reproducibility: 94.0,
    total_score: 94.5,
    feedback: 'Karya inovatif luar biasa! Dokumentasi sangat lengkap, kode terstruktur rapi, validasi klinis pada subjek sehat terdokumentasi dengan sangat baik.',
    evaluator_name: 'Prof. Dr. Ir. Dewi Kartika',
    updated_at: '2026-10-16 18:30:00'
  },
  {
    id: 2,
    project_id: 11,
    score_completeness: 95.0,
    score_evidence: 92.0,
    score_contribution: 94.0,
    score_reproducibility: 94.0,
    total_score: 93.8,
    feedback: 'Karya media STEAM luar biasa! Menggabungkan sains gelombang murni dengan estetika visual simetris yang sangat kuat untuk pedagogi fisika.',
    evaluator_name: 'Prof. Dr. Hartono, M.Si.',
    updated_at: '2026-10-15 16:00:00'
  }
];
