const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'steamcraft.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'lecturer', 'admin')),
      identifier TEXT NOT NULL,
      study_program TEXT NOT NULL,
      faculty TEXT DEFAULT 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
      university TEXT DEFAULT 'Universitas Indonesia',
      research_interests TEXT DEFAULT 'Sains, Teknologi, Rekayasa & Matematika',
      bio TEXT DEFAULT '',
      academic_links TEXT DEFAULT '',
      avatar_color TEXT DEFAULT '#2878d7',
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT NOT NULL,
      study TEXT NOT NULL,
      steam TEXT NOT NULL,
      template TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Aktif',
      progress INTEGER NOT NULL DEFAULT 0,
      members_count INTEGER NOT NULL DEFAULT 1,
      open_recruitment INTEGER NOT NULL DEFAULT 1,
      recruitment_roles TEXT,
      goal TEXT,
      tools TEXT,
      repo_url TEXT DEFAULT '',
      lecturer TEXT DEFAULT 'Dosen Pembimbing',
      creator_id INTEGER,
      versions_count INTEGER NOT NULL DEFAULT 1,
      blocker INTEGER NOT NULL DEFAULT 0,
      blocker_reason TEXT DEFAULT '',
      steam_scores TEXT,
      final_score REAL,
      final_grade TEXT,
      final_note TEXT,
      evaluation_recorded INTEGER NOT NULL DEFAULT 0,
      package_compiled INTEGER NOT NULL DEFAULT 0,
      package_filename TEXT,
      archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (creator_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS checkpoints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      stage_index INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT 'Catatan Umum',
      content TEXT NOT NULL,
      file_name TEXT,
      file_url TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      version_number INTEGER NOT NULL,
      note TEXT NOT NULL,
      artifact_url TEXT DEFAULT '',
      file_name TEXT,
      file_url TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recruitment_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      applicant_name TEXT NOT NULL,
      applicant_study TEXT NOT NULL,
      applicant_role TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'Menunggu',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      lecturer_name TEXT NOT NULL,
      topic TEXT NOT NULL,
      type TEXT NOT NULL,
      mode TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      note TEXT,
      feedback TEXT,
      status TEXT NOT NULL DEFAULT 'Menunggu respons',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      target TEXT NOT NULL DEFAULT 'all',
      body TEXT NOT NULL,
      pinned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS announcement_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      announcement_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      is_saved INTEGER NOT NULL DEFAULT 0,
      UNIQUE(announcement_id, user_id),
      FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resource_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      resource_name TEXT NOT NULL,
      date_needed TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'Menunggu',
      feedback TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rubrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER UNIQUE NOT NULL,
      score_completeness REAL DEFAULT 0,
      score_evidence REAL DEFAULT 0,
      score_contribution REAL DEFAULT 0,
      score_reproducibility REAL DEFAULT 0,
      total_score REAL DEFAULT 0,
      feedback TEXT,
      evaluator_name TEXT,
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS template_configs (
      template_key TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      checkpoints_json TEXT NOT NULL,
      rubric_completeness REAL NOT NULL DEFAULT 25,
      rubric_evidence REAL NOT NULL DEFAULT 25,
      rubric_contribution REAL NOT NULL DEFAULT 25,
      rubric_reproducibility REAL NOT NULL DEFAULT 25
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      action_text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_id INTEGER,
      name TEXT NOT NULL,
      identifier TEXT NOT NULL,
      study_program TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Peneliti Anggota',
      is_lead INTEGER NOT NULL DEFAULT 0,
      avatar_color TEXT DEFAULT '#2878d7',
      joined_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Default app_mode in database: 'production' for real campus operations
  db.prepare("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('app_mode', 'production')").run();

  // Automatic Migration for dynamic columns
  const addColumnIfNotExists = (table, col, def) => {
    try {
      const cols = db.prepare(`PRAGMA table_info(${table})`).all();
      if (!cols.some(c => c.name === col)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def};`);
      }
    } catch (e) {}
  };
  addColumnIfNotExists('journals', 'file_name', 'TEXT');
  addColumnIfNotExists('journals', 'file_url', 'TEXT');
  addColumnIfNotExists('versions', 'file_name', 'TEXT');
  addColumnIfNotExists('versions', 'file_url', 'TEXT');
  addColumnIfNotExists('projects', 'steam_scores', 'TEXT');
  addColumnIfNotExists('projects', 'is_demo', 'INTEGER NOT NULL DEFAULT 0');
  db.exec('UPDATE projects SET is_demo = 1 WHERE id <= 13;');
  addColumnIfNotExists('checkpoints', 'completed_by', 'TEXT');
  addColumnIfNotExists('checkpoints', 'submission_notes', 'TEXT');
  addColumnIfNotExists('checkpoints', 'confirmed_by_lecturer', 'INTEGER DEFAULT 0');

  // Profile and Identity Columns
  addColumnIfNotExists('users', 'faculty', "TEXT DEFAULT 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)'");
  addColumnIfNotExists('users', 'university', "TEXT DEFAULT 'Universitas Indonesia'");
  addColumnIfNotExists('users', 'research_interests', "TEXT DEFAULT 'Sains, Teknologi, Rekayasa & Matematika'");
  addColumnIfNotExists('users', 'bio', "TEXT DEFAULT ''");
  addColumnIfNotExists('users', 'academic_links', "TEXT DEFAULT ''");

  // Populate default profiles for known users if bio is empty
  const defaultProfiles = {
    budi: {
      faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
      university: 'Universitas Indonesia',
      research_interests: 'Sains Data, IoT Presisi, Deep Learning LSTM',
      bio: 'Mahasiswa peneliti Sains Data angkatan 2026. Fokus pada integrasi pemantauan lingkungan mikroklimat presisi dan machine learning deret waktu.',
      academic_links: 'GitHub: github.com/budisantoso · ORCID: 0009-0002-4819-2101'
    },
    tiara: {
      faculty: 'Fakultas Keguruan dan Ilmu Pendidikan (FKIP)',
      university: 'Universitas Pendidikan Indonesia',
      research_interests: 'Pendidikan Fisika, Akustik 2D, Resonansi Chladni Plate',
      bio: 'Calon pendidik fisika dengan fokus visualisasi konsep gelombang mekanik melalui instrumen berestetika tinggi dan kit praktikum STEAM.',
      academic_links: 'GitHub: github.com/tiarasafitri-edu · Google Scholar: Tiara Safitri'
    },
    dimas: {
      faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
      university: 'Institut Teknologi Bandung',
      research_interests: 'Kimia Material, Green Chemistry, Bioplastik Kitosan',
      bio: 'Peneliti kimia polimer ramah lingkungan berbasis kitosan cangkang krustasea dengan pendekatan zero waste.',
      academic_links: 'ResearchGate: Dimas Anggara · LinkedIn: /in/dimas-anggara'
    },
    fitri: {
      faculty: 'Fakultas Biologi / FMIPA',
      university: 'Universitas Gadjah Mada',
      research_interests: 'Ekologi Perairan, Bioindikator Makrozoobentos, Analisis Mutu Air',
      bio: 'Peneliti ekologi perairan urban dan konservasi keanekaragaman makroinvertebrata untuk pemetaan mutu lingkungan hidup.',
      academic_links: 'ORCID: 0009-0004-1290-7731 · GitHub: github.com/fitri-bio'
    },
    laila: {
      faculty: 'Fakultas Keguruan dan Ilmu Pendidikan (FKIP)',
      university: 'Universitas Negeri Yogyakarta',
      research_interests: 'Etnomatematika, Geometri Fraktal Motif Batik, Media Digital GeoGebra',
      bio: 'Inovator pembelajaran matematika bermakna yang memadukan warisan budaya nusantara (Batik) dengan perangkat lunak manipulatif.',
      academic_links: 'Google Scholar: Laila Munawaroh · GitHub: github.com/laila-math'
    },
    prof_hartono: {
      faculty: 'Fakultas MIPA & Pascasarjana Pendidikan Sains',
      university: 'Universitas Negeri Malang',
      research_interests: 'Pendidikan STEAM Terintegrasi, Fisika Lingkungan, Pedagogi Inkuiri',
      bio: 'Guru Besar Pendidikan Sains dan pembimbing riset mahasiswa berprestasi tingkat nasional dengan fokus integrasi 5 pilar STEAM.',
      academic_links: 'Scopus ID: 57201928100 · SINTA ID: 219084'
    },
    dosen: {
      faculty: 'Fakultas Sains & Teknologi',
      university: 'Institut Teknologi Bandung',
      research_interests: 'Instrumentasi Sensor Cerdas, Pemodelan Sains Komputasi',
      bio: 'Dosen pembimbing riset dan penilai standarisasi rubrik ilmiah 4 pilar STEAM.',
      academic_links: 'Scopus ID: 56192841022 · ORCID: 0000-0002-1829-9281'
    }
  };

  for (const [uname, prof] of Object.entries(defaultProfiles)) {
    try {
      db.prepare(`
        UPDATE users
        SET faculty = CASE WHEN (bio IS NULL OR bio = '' OR faculty = 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)') THEN ? ELSE faculty END,
            university = CASE WHEN (bio IS NULL OR bio = '' OR university = 'Universitas Indonesia') THEN ? ELSE university END,
            research_interests = CASE WHEN (bio IS NULL OR bio = '' OR research_interests = 'Sains, Teknologi, Rekayasa & Matematika') THEN ? ELSE research_interests END,
            bio = CASE WHEN (bio IS NULL OR bio = '') THEN ? ELSE bio END,
            academic_links = CASE WHEN (academic_links IS NULL OR academic_links = '') THEN ? ELSE academic_links END
        WHERE username = ?
      `).run(prof.faculty, prof.university, prof.research_interests, prof.bio, prof.academic_links, uname);
    } catch (e) {}
  }

  // Populate default steam scores if missing
  const defaultScores = {
    1: JSON.stringify({ S: 92, T: 88, E: 80, A: 65, M: 85 }),
    2: JSON.stringify({ S: 75, T: 95, E: 88, A: 82, M: 78 }),
    3: JSON.stringify({ S: 80, T: 82, E: 70, A: 75, M: 96 }),
    4: JSON.stringify({ S: 95, T: 78, E: 92, A: 68, M: 84 }),
    5: JSON.stringify({ S: 88, T: 96, E: 94, A: 85, M: 90 })
  };
  for (const [pId, sc] of Object.entries(defaultScores)) {
    db.prepare('UPDATE projects SET steam_scores = COALESCE(steam_scores, ?) WHERE id = ?').run(sc, pId);
  }

  seedDefaultData();
  seedScienceAndEducationProjects();
  seedProjectMembers();
  seedAdminAndCivitasAccounts();
}

const DEFAULT_TEMPLATES = {
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

function seedDefaultData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return; // already seeded

  console.log('Seeding initial database with users, templates, projects, and activities...');

  // 1. Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (username, name, role, identifier, study_program, avatar_color, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('budi', 'Budi Santoso', 'student', '202610101', 'Sains Data', '#2878d7', 'password123');
  insertUser.run('siti', 'Siti Nurhaliza', 'student', '202610102', 'Artificial Intelligence', '#37b6a0', 'password123');
  insertUser.run('reza', 'Reza Pratama', 'student', '202610103', 'Sains Aktuaria', '#8060d5', 'password123');
  insertUser.run('zahra', 'Zahra Amalia', 'student', '202610104', 'Bioteknologi', '#ed7b64', 'password123');
  insertUser.run('dosen', 'Dr. Rahmat Wijaya, M.Sc.', 'lecturer', '198504122010121002', 'Fakultas Sains & Teknologi', '#1e3656', 'dosen123');
  insertUser.run('dewi', 'Prof. Dr. Ir. Dewi Kartika', 'lecturer', '197908252005012001', 'Departemen Teknik Komputer', '#2878d7', 'dosen123');

  // 2. Seed Templates
  const insertTpl = db.prepare(`
    INSERT INTO template_configs (template_key, label, checkpoints_json, rubric_completeness, rubric_evidence, rubric_contribution, rubric_reproducibility)
    VALUES (?, ?, ?, 25, 25, 25, 25)
  `);

  for (const [key, tpl] of Object.entries(DEFAULT_TEMPLATES)) {
    insertTpl.run(key, tpl.label, JSON.stringify(tpl.cp));
  }

  // 3. Seed Projects
  const projectsData = [
    {
      name: 'Prediksi Cuaca Mikro berbasis Stasiun Cuaca IoT',
      desc: 'Eksplorasi pola cuaca lokal dan evaluasi model prediksi berbasis deep learning untuk mitigasi pertanian presisi.',
      study: 'Sains Data',
      steam: 'Science + Data',
      template: 'data',
      status: 'Aktif',
      progress: 40,
      checks: [1, 1, 0, 0, 0],
      members_count: 4,
      open_recruitment: 1,
      recruitment_roles: 'Data Analyst, ML Engineer, Hardware IoT',
      goal: 'Bagaimana model deep learning LSTM dapat memprediksi anomali curah hujan dan kelembaban mikro pada lahan pertanian?',
      tools: 'Python, PyTorch, ESP32, Grafana, Pandas',
      repo_url: 'https://github.com/steamcraft/microclimate-iot-lstm',
      lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
      creator_id: 1,
      versions_count: 3,
      blocker: 0,
      blocker_reason: '',
      journals: [
        { author: 'Budi Santoso', tag: 'Metodologi', text: 'Melakukan kalibrasi sensor DHT22 dan BME280 di ruang terkendali. Didapatkan deviasi suhu rata-rata 0.2 C.' },
        { author: 'Budi Santoso', tag: 'Data', text: 'Mengunduh dataset historis BMKG stasiun terdekat (2020-2025) sebagai pembanding baseline.' },
        { author: 'Budi Santoso', tag: 'Eksperimen', text: 'Pengujian transmisi paket data LoRaWAN sejauh 1.2 KM berhasil dengan packet loss < 2%.' }
      ]
    },
    {
      name: 'Deteksi Sampah pada Citra Konveyor Real-Time',
      desc: 'Menguji klasifikasi dan segmentasi citra berbasis Edge AI untuk otomatisasi pemilahan sampah daur ulang.',
      study: 'Artificial Intelligence',
      steam: 'Technology + AI',
      template: 'data',
      status: 'Menunggu persetujuan',
      progress: 0,
      checks: [0, 0, 0, 0, 0],
      members_count: 5,
      open_recruitment: 1,
      recruitment_roles: 'ML Engineer, UI/UX Designer, Embedded Systems',
      goal: 'Seberapa akurat arsitektur YOLOv8 Nano mendeteksi jenis sampah plastik pada kecepatan konveyor 0.4 m/s?',
      tools: 'Python, YOLOv8, OpenCV, Jetson Nano, PySide6',
      repo_url: 'https://github.com/steamcraft/trash-edge-detector',
      lecturer: 'Prof. Dr. Ir. Dewi Kartika',
      creator_id: 2,
      versions_count: 1,
      blocker: 0,
      blocker_reason: '',
      journals: [
        { author: 'Siti Nurhaliza', tag: 'Observasi', text: 'Survei langsung ke TPS 3R kampus. Mengumpulkan 500 foto awal botol plastik PET, HDPE, dan kaleng.' }
      ]
    },
    {
      name: 'Model Risiko Keuangan Mahasiswa Perantau',
      desc: 'Mengeksplorasi skenario anggaran bulanan, inflasi living cost, dan indikator risiko defisit mahasiswa.',
      study: 'Sains Aktuaria',
      steam: 'Mathematics + Modelling',
      template: 'actuary',
      status: 'Aktif',
      progress: 20,
      checks: [1, 0, 0, 0, 0],
      members_count: 3,
      open_recruitment: 1,
      recruitment_roles: 'Risk Analyst, Data Visualizer, Frontend Dev',
      goal: 'Bagaimana perubahan harga pangan dan sewa kos memengaruhi probabilitas defisit bulanan mahasiswa perantau?',
      tools: 'R, Python, Monte Carlo Sim, Streamlit',
      repo_url: 'https://github.com/steamcraft/student-financial-risk',
      lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
      creator_id: 3,
      versions_count: 2,
      blocker: 1,
      blocker_reason: 'Distribusi pengeluaran non-makanan memiliki kemiringan (skewness) ekstrim dan kekurangan data dari mahasiswa tingkat akhir.',
      journals: [
        { author: 'Reza Pratama', tag: 'Metodologi', text: 'Menyusun kuesioner terstruktur dengan metode stratified random sampling 10 fakultas.' },
        { author: 'Reza Pratama', tag: 'Blocker', text: 'Distribusi pengeluaran non-rutin sangat bervariasi. Perlu konsultasi pemilihan distribusi Generalized Extreme Value (GEV).' }
      ]
    },
    {
      name: 'Bio-Filter Limbah Batik menggunakan Eceng Gondok Teraktivasi',
      desc: 'Sintesis dan karakterisasi karbon aktif dari limbah eceng gondok untuk adsorpsi zat warna sintetis tekstil.',
      study: 'Bioteknologi',
      steam: 'Science + Engineering',
      template: 'experiment',
      status: 'Review diajukan',
      progress: 80,
      checks: [1, 1, 1, 1, 0],
      members_count: 4,
      open_recruitment: 0,
      recruitment_roles: 'Kimia Analitik, Lab Assistant',
      goal: 'Berapa kapasitas adsorpsi maksimum (Qmax) karbon aktif eceng gondok terhadap zat warna Remazol Black B pada pH asam?',
      tools: 'Spektrofotometer UV-Vis, FTIR, Muffle Furnace, Shaker',
      repo_url: 'https://github.com/steamcraft/biochar-water-purifier',
      lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
      creator_id: 4,
      versions_count: 4,
      blocker: 0,
      blocker_reason: '',
      journals: [
        { author: 'Zahra Amalia', tag: 'Eksperimen', text: 'Karbonisasi pada suhu 500 C selama 2 jam dengan aktivator H3PO4 20%. Hasil rendemen 42.8%.' },
        { author: 'Zahra Amalia', tag: 'Evaluasi', text: 'Uji spektrofotometri menunjukkan penurunan konsentrasi warna hingga 94.2% dalam waktu kontak 60 menit.' }
      ]
    },
    {
      name: 'Robot Kursi Roda Cerdas Kendali Sinyal Gelombang Otak (EEG)',
      desc: 'Pengembangan assistive technology navigasi kursi roda menggunakan antarmuka otak-komputer (BCI) dan sensor LiDAR anti-tabrakan.',
      study: 'Teknik Biomedis & Komputer',
      steam: 'Technology + Engineering + Mathematics',
      template: 'experiment',
      status: 'Selesai',
      progress: 100,
      checks: [1, 1, 1, 1, 1],
      members_count: 4,
      open_recruitment: 0,
      recruitment_roles: '',
      goal: 'Dapatkah sinyal Motor Imagery EEG mengontrol orientasi kursi roda dengan latensi < 400ms dan tingkat keberhasilan navigasi > 90%?',
      tools: 'OpenBCI, ROS2, Arduino, LiDAR 2D, Python',
      repo_url: 'https://github.com/steamcraft/smart-wheelchair-bci',
      lecturer: 'Prof. Dr. Ir. Dewi Kartika',
      creator_id: 2,
      versions_count: 6,
      blocker: 0,
      blocker_reason: '',
      final_score: 94.5,
      final_grade: 'A (Sangat Memuaskan)',
      final_note: 'Karya inovatif luar biasa! Dokumentasi sangat lengkap, kode terstruktur rapi, validasi klinis pada subjek sehat terdokumentasi dengan sangat baik.',
      evaluation_recorded: 1,
      package_compiled: 1,
      package_filename: 'steamcraft-reproducibility-smart-wheelchair-bci.json',
      journals: [
        { author: 'Siti Nurhaliza', tag: 'Validasi', text: 'Pengujian rute labirin 15 meter dengan 5 rintangan dinamis berhasil diselesaikan 9 dari 10 percobaan.' }
      ]
    }
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (
      name, desc, study, steam, template, status, progress, members_count, open_recruitment,
      recruitment_roles, goal, tools, repo_url, lecturer, creator_id, versions_count,
      blocker, blocker_reason, final_score, final_grade, final_note, evaluation_recorded,
      package_compiled, package_filename
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?
    )
  `);

  const insertCP = db.prepare(`
    INSERT INTO checkpoints (project_id, stage_index, title, description, is_completed, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertJournal = db.prepare(`
    INSERT INTO journals (project_id, author_name, tag, content)
    VALUES (?, ?, ?, ?)
  `);

  const insertVersion = db.prepare(`
    INSERT INTO versions (project_id, version_number, note, artifact_url)
    VALUES (?, ?, ?, ?)
  `);

  const insertActivity = db.prepare(`
    INSERT INTO activity_logs (project_id, user_name, action_text)
    VALUES (?, ?, ?)
  `);

  projectsData.forEach((p, idx) => {
    const projId = idx + 1;
    insertProject.run(
      p.name, p.desc, p.study, p.steam, p.template, p.status, p.progress, p.members_count, p.open_recruitment,
      p.recruitment_roles, p.goal, p.tools, p.repo_url, p.lecturer, p.creator_id, p.versions_count,
      p.blocker, p.blocker_reason, p.final_score || null, p.final_grade || null, p.final_note || null,
      p.evaluation_recorded || 0, p.package_compiled || 0, p.package_filename || null
    );

    // Insert 5 Checkpoints
    const tplCps = DEFAULT_TEMPLATES[p.template].cp;
    tplCps.forEach((cp, cpIdx) => {
      const isDone = p.checks[cpIdx] || 0;
      insertCP.run(
        projId,
        cpIdx,
        cp[0],
        cp[1],
        isDone,
        isDone ? '2026-10-15 14:00:00' : null
      );
    });

    // Insert Journals
    p.journals.forEach(j => {
      insertJournal.run(projId, j.author, j.tag, j.text);
    });

    // Insert Versions
    for (let v = 1; v <= p.versions_count; v++) {
      insertVersion.run(projId, v, `Iterasi pengembangan build v${v}.0`, p.repo_url);
    }

    // Insert Initial Activities
    insertActivity.run(projId, 'Sistem', 'Proyek terdaftar dalam Workspace STEAM-Craft.');
    if (p.blocker) {
      insertActivity.run(projId, 'Mahasiswa', 'Menandai kendala metodologis (Blocker) untuk ditinjau dosen pembimbing.');
    }
  });

  // 4. Seed Consultations
  const insertConsult = db.prepare(`
    INSERT INTO consultations (project_id, student_name, lecturer_name, topic, type, mode, date, time, note, feedback, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertConsult.run(1, 'Budi Santoso', 'Dr. Rahmat Wijaya, M.Sc.', 'Review validasi model LSTM dan kalibrasi sensor IoT', 'Review checkpoint', 'Online (Google Meet)', '2026-10-20', '10:00', 'Siapkan grafik loss training vs validation dan data kalibrasi BME280.', null, 'Terjadwal');
  insertConsult.run(3, 'Reza Pratama', 'Dr. Rahmat Wijaya, M.Sc.', 'Klinik blocker penanganan outlier data pengeluaran ekstrem', 'Klinik metodologi', 'Ruang dosen', '2026-10-21', '13:30', 'Bawa ringkasan data kuesioner dan plot QQ-Normal.', null, 'Terjadwal');
  insertConsult.run(4, 'Zahra Amalia', 'Dr. Rahmat Wijaya, M.Sc.', 'Evaluasi kelayakan manuskrip jurnal dan hasil spektrofotometer', 'Review checkpoint', 'Laboratorium Kimia Terpadu', '2026-10-18', '09:00', 'Bawa sampel karbon aktif dan kuvet uji.', 'Hasil adsorpsi sangat menjanjikan, tambahkan uji isoterm Freundlich.', 'Selesai');

  // 5. Seed Announcements
  const insertAnnounce = db.prepare(`
    INSERT INTO announcements (author_name, title, category, target, body, pinned)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAnnounce.run(
    'Dr. Rahmat Wijaya, M.Sc.',
    'Standar Dokumentasi Checkpoint & Reproducibility Riset',
    'Metodologi',
    'all',
    'Setiap tim wajib mendokumentasikan dataset, parameter eksperimen, lisensi, dan log galat pada jurnal workspace. Reproducibility package akan menjadi bobot 25% penilaian akhir.',
    1
  );

  insertAnnounce.run(
    'Panitia Lomba STEAM Nasional 2026',
    'Tenggat Pengajuan Review Tengah Proyek (Mid-Evaluation)',
    'Tenggat',
    'all',
    'Batas akhir penyelesaian Checkpoint 3 (Model atau Solusi) adalah tanggal 25 Oktober 2026 pukul 23:59 WIB. Pastikan repositori GitHub terhubung.',
    1
  );

  insertAnnounce.run(
    'Laboratorium Riset Terpadu',
    'Prosedur Pengajuan Akses GPU Workstation & 3D Printing',
    'Fasilitas',
    'all',
    'Tim yang membutuhkan komputasi CUDA atau pencetakan casing prototipe dapat mengajukan permohonan melalui menu "Ajukan Fasilitas" H-2 sebelum pemakaian.',
    0
  );

  // 6. Seed Resource Requests
  const insertResource = db.prepare(`
    INSERT INTO resource_requests (project_id, student_name, resource_name, date_needed, note, status, feedback)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertResource.run(2, 'Siti Nurhaliza', 'GPU Workstation (NVIDIA RTX 4090)', '2026-10-22', 'Training model YOLOv8x dengan resolusi 640x640 selama 300 epochs.', 'Menunggu', null);
  insertResource.run(1, 'Budi Santoso', 'Kit Mikrokontroler & Modul LoRa SX1278', '2026-10-14', 'Pengujian transmisi stasiun cuaca mikro outdoor.', 'Disetujui', 'Peralatan telah diserahkan di Lab Elektronika Lantai 3.');
  insertResource.run(5, 'Siti Nurhaliza', 'Printer 3D & Rapid Prototyping', '2026-10-10', 'Pencetakan mounting sensor EEG dan case mikrokontroler.', 'Disetujui', 'Filament PLA warna biru telah digunakan.');

  // 7. Seed Recruitment Applications
  const insertApp = db.prepare(`
    INSERT INTO recruitment_applications (project_id, applicant_name, applicant_study, applicant_role, message, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertApp.run(1, 'Dimas Anggoro', 'Teknik Elektro', 'Hardware IoT', 'Saya memiliki pengalaman 2 tahun dengan protokol LoRaWAN dan ESP32 di perkebunan teh.', 'Menunggu');
  insertApp.run(2, 'Aulia Putri', 'Desain Komunikasi Visual', 'UI/UX Designer', 'Tertarik merancang dashboard monitoring pemilahan sampah yang ramah pengguna.', 'Menunggu');

  console.log('Database seeded successfully!');
}

function seedScienceAndEducationProjects() {
  // 1. Seed New Users for Science & Science Education Disciplines
  const insertUser = db.prepare(`
    INSERT INTO users (username, name, role, identifier, study_program, avatar_color, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const newUsers = [
    ['fitri', 'Fitri Handayani', 'student', '202610105', 'Biologi', '#10b981', 'password123'],
    ['anisa', 'Anisa Rahmawati', 'student', '202610106', 'Pendidikan Biologi', '#059669', 'password123'],
    ['dimas', 'Dimas Anggara', 'student', '202610107', 'Kimia', '#8b5cf6', 'password123'],
    ['nurul', 'Nurul Hidayah', 'student', '202610108', 'Pendidikan Kimia', '#7c3aed', 'password123'],
    ['bayu', 'Bayu Wicaksono', 'student', '202610109', 'Fisika', '#f97316', 'password123'],
    ['tiara', 'Tiara Safitri', 'student', '202610110', 'Pendidikan Fisika', '#ea580c', 'password123'],
    ['hendra', 'Hendra Kusuma', 'student', '202610111', 'Matematika', '#2563eb', 'password123'],
    ['laila', 'Laila Munawaroh', 'student', '202610112', 'Pendidikan Matematika', '#1d4ed8', 'password123'],
    ['prof_hartono', 'Prof. Dr. Hartono, M.Si.', 'lecturer', '197506141999031001', 'Fakultas MIPA / Pendidikan Sains', '#047857', 'dosen123']
  ];

  for (const u of newUsers) {
    const exists = db.prepare('SELECT COUNT(*) as c FROM users WHERE username = ?').get(u[0]).c;
    if (!exists) {
      insertUser.run(...u);
    }
  }

  // Helper map for user IDs
  const getUserId = (username) => {
    const row = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    return row ? row.id : 1;
  };

  // 2. Science & Science Education Projects Data
  const scienceProjects = [
    {
      name: 'Bioindikator Kualitas Air Sungai Menggunakan Keanekaragaman Makrozoobentos & Indeks Biotik',
      desc: 'Bioassessment keanekaragaman ordo EPT (Ephemeroptera, Plecoptera, Trichoptera) dan korelasi parameter fisikokimia untuk memetakan status mutu air sungai urban.',
      study: 'Biologi',
      steam: 'Science + Environment',
      template: 'experiment',
      status: 'Aktif',
      progress: 60,
      checks: [1, 1, 1, 0, 0],
      members_count: 4,
      open_recruitment: 1,
      recruitment_roles: 'Taksonomis Makroinvertebrata, Kimia Lingkungan, GIS Specialist',
      goal: 'Bagaimana korelasi indeks Family Biotic Index (FBI) dan EPT Richness terhadap konsentrasi nutrien fosfat dan amonia di stasiun sungai perkotaan?',
      tools: 'Surber Sampler, Mikroskop Stereo, DO Meter, GPS Garmin, PAST (Paleontological Statistics), QGIS',
      repo_url: 'https://github.com/steamcraft/macroinvertebrate-water-bioassessment',
      lecturer: 'Prof. Dr. Hartono, M.Si.',
      creator_username: 'fitri',
      versions_count: 3,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 95, T: 80, E: 78, A: 70, M: 88 }),
      journals: [
        { author: 'Fitri Handayani', tag: 'Metodologi', text: 'Penentuan 5 stasiun sampling di hulu, tengah, dan hilir sungai menggunakan metode purposive random sampling.' },
        { author: 'Fitri Handayani', tag: 'Eksperimen', text: 'Identifikasi 342 spesimen makrozoobentos dengan buku kunci determinasi Pennak (1989). Ditemukan dominasi Baetidae di stasiun 2.' },
        { author: 'Fitri Handayani', tag: 'Observasi', text: 'Pengukuran insitu: Suhu rata-rata 26.5°C, pH 7.2, dan Dissolved Oxygen (DO) 5.8 mg/L.' }
      ]
    },
    {
      name: 'Herbaria Digital & Lab Virtual 3D Anatomi Tumbuhan Berbasis Etnobotani Tanaman Obat',
      desc: 'Inovasi media ajar interaktif menggabungkan fotogrametri 3D spesimen herbaria dengan kearifan lokal etnofarmakologi untuk pembelajaran inkuiri STEAM.',
      study: 'Pendidikan Biologi',
      steam: 'Science + Art/Technology',
      template: 'free',
      status: 'Review diajukan',
      progress: 80,
      checks: [1, 1, 1, 1, 0],
      members_count: 5,
      open_recruitment: 0,
      recruitment_roles: '',
      goal: 'Apakah media herbaria digital 3D berpendekatan STEAM efektif meningkatkan keterampilan proses sains dan literasi konservasi tumbuhan siswa?',
      tools: 'Blender 3D, Unity, Kamera Makro Canon, AR.js, Google Sites, WebGL',
      repo_url: 'https://github.com/steamcraft/digital-herbaria-steam-education',
      lecturer: 'Prof. Dr. Hartono, M.Si.',
      creator_username: 'anisa',
      versions_count: 4,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 90, T: 88, E: 76, A: 94, M: 75 }),
      journals: [
        { author: 'Anisa Rahmawati', tag: 'Observasi', text: 'Eksplorasi etnobotani di desa adat lereng gunung: mencatat 24 spesies tanaman obat yang dimanfaatkan warga.' },
        { author: 'Anisa Rahmawati', tag: 'Eksperimen', text: 'Pemindaian 3D spesimen daun sirih merah dan rimpang jahe menggunakan teknik fotogrametri 120 foto per objek.' },
        { author: 'Anisa Rahmawati', tag: 'Evaluasi', text: 'Uji coba terbatas pada 30 siswa: peningkatan N-gain skor literasi botani sebesar 0.72 (kategori tinggi).' }
      ]
    },
    {
      name: 'Sintesis Bioplastik Kitosan dari Limbah Cangkang Rajungan dengan Pemlastis Gliserol',
      desc: 'Karakterisasi sifat mekanik, laju biodegradasi tanah, dan analisis gugus fungsi bioplastik berbahan dasar kitosan limbah industri perikanan.',
      study: 'Kimia',
      steam: 'Science + Engineering',
      template: 'experiment',
      status: 'Aktif',
      progress: 60,
      checks: [1, 1, 1, 0, 0],
      members_count: 4,
      open_recruitment: 1,
      recruitment_roles: 'Kimia Polimer, Material Testing, UI Visualizer',
      goal: 'Bagaimana pengaruh variasi rasio kitosan-gliserol terhadap kuat tarik (tensile strength) dan spektrum FTIR ikatan hidrogen bioplastik?',
      tools: 'Spektrofotometer FTIR, Universal Testing Machine, Desikator, Neraca Analitik, Muffle Furnace',
      repo_url: 'https://github.com/steamcraft/chitosan-bioplastic-green-chemistry',
      lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
      creator_username: 'dimas',
      versions_count: 3,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 96, T: 84, E: 90, A: 70, M: 85 }),
      journals: [
        { author: 'Dimas Anggara', tag: 'Metodologi', text: 'Deproteinasi cangkang rajungan dengan NaOH 3.5% pada 65°C selama 2 jam, dilanjutkan demineralisasi dengan HCl 1M.' },
        { author: 'Dimas Anggara', tag: 'Eksperimen', text: 'Deasetilasi kitin menjadi kitosan dengan NaOH 50% pada suhu 100°C menghasilkan derajat deasetilasi (DD) 82.4%.' },
        { author: 'Dimas Anggara', tag: 'Evaluasi', text: 'Uji tarik menunjukkan kuat tarik maksimum 18.4 MPa pada rasio kitosan:gliserol 70:30 dengan elongasi 28%.' }
      ]
    },
    {
      name: 'Laboratorium Virtual Gamifikasi Titrasi Asam-Basa Berprinsip Kimia Hijau (Green Chemistry)',
      desc: 'Pengembangan media eksperimen kimia virtual interaktif berbasis web untuk mereduksi miskonsepsi stoikiometri larutan dan limbah praktikum kimia.',
      study: 'Pendidikan Kimia',
      steam: 'Science + Technology/Art',
      template: 'free',
      status: 'Aktif',
      progress: 40,
      checks: [1, 1, 0, 0, 0],
      members_count: 3,
      open_recruitment: 1,
      recruitment_roles: 'Web Developer, Pedagogical Reviewer, Graphic Artist',
      goal: 'Bagaimana efektivitas simulasi laboratorium titrasi virtual dalam mereduksi miskonsepsi titik ekuivalen pada tes diagnostik Four-Tier siswa?',
      tools: 'Construct 3, WebGL, PhET Framework, Canva, Google Forms (Diagnostic Four-Tier Test)',
      repo_url: 'https://github.com/steamcraft/green-chemistry-virtual-lab',
      lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
      creator_username: 'nurul',
      versions_count: 2,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 88, T: 92, E: 75, A: 92, M: 86 }),
      journals: [
        { author: 'Nurul Hidayah', tag: 'Metodologi', text: 'Penyusunan instrumen tes diagnostik four-tier stoikiometri larutan dan validasi ahli materi pendidikan kimia.' },
        { author: 'Nurul Hidayah', tag: 'Observasi', text: 'Identifikasi miskonsepsi utama: 68% siswa menyamakan titik akhir titrasi dengan titik netralisasi pH 7.' }
      ]
    },
    {
      name: 'Rancang Bangun Spektrofotometer Mini Berbiaya Rendah berbasis Kisi Difraksi DVD dan Sensor CMOS',
      desc: 'Instrumentasi spektroskopi absorpsi mandiri menggunakan komponen berbiaya terjangkau untuk pengujian konsentrasi zat warna dan kekeruhan air.',
      study: 'Fisika',
      steam: 'Science + Engineering',
      template: 'experiment',
      status: 'Aktif',
      progress: 60,
      checks: [1, 1, 1, 0, 0],
      members_count: 4,
      open_recruitment: 1,
      recruitment_roles: 'Optika & Sensor, Python Developer, 3D Modeler PETG',
      goal: 'Berapa tingkat linearitas kalibrasi hukum Beer-Lambert pada spektrofotometer mini berbasis ESP32-CAM dibandingkan instrumen industri standar?',
      tools: 'ESP32-CAM, Kisi Difraksi DVD 1000 lines/mm, LED Putih High-CRI, Python, SciPy, 3D Printer PETG',
      repo_url: 'https://github.com/steamcraft/diy-mini-spectrophotometer',
      lecturer: 'Prof. Dr. Ir. Dewi Kartika',
      creator_username: 'bayu',
      versions_count: 3,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 96, T: 94, E: 92, A: 68, M: 90 }),
      journals: [
        { author: 'Bayu Wicaksono', tag: 'Metodologi', text: 'Desain enclosure ruang optik tertutup menggunakan CAD dan pencetakan 3D dengan filamen matte black anti-refleksi.' },
        { author: 'Bayu Wicaksono', tag: 'Eksperimen', text: 'Kalibrasi panjang gelombang menggunakan laser hijau 532nm dan laser merah 650nm. Deviasi terukur < 1.8 nm.' },
        { author: 'Bayu Wicaksono', tag: 'Evaluasi', text: 'Uji hukum Beer-Lambert larutan metilen biru menghasilkan koefisien determinasi R² = 0.994.' }
      ]
    },
    {
      name: 'Kit Eksperimen Resonansi Akustik Chladni Plate Digital untuk Visualisasi Modus Getar 2D',
      desc: 'Inovasi kit praktikum fisika gelombang mekanik berbantuan sinyal audio presisi mikrokontroler dan pemodelan pola simpul pasir dua dimensi.',
      study: 'Pendidikan Fisika',
      steam: 'Science + Art/Education',
      template: 'free',
      status: 'Selesai',
      progress: 100,
      checks: [1, 1, 1, 1, 1],
      members_count: 4,
      open_recruitment: 0,
      recruitment_roles: '',
      goal: 'Bagaimana pemanfaatan pola Chladni plate memudahkan visualisasi fungsi Bessel gelombang berdiri 2D serta mereduksi miskonsepsi getaran siswa?',
      tools: 'Generator Sinyal DDS, Driver Transduser Piezoelektrik, Pelat Logam, Pasir Kuarsa, Tracker Video Analysis',
      repo_url: 'https://github.com/steamcraft/chladni-plate-physics-education',
      lecturer: 'Prof. Dr. Hartono, M.Si.',
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
      steam_scores: JSON.stringify({ S: 95, T: 88, E: 85, A: 96, M: 90 }),
      journals: [
        { author: 'Tiara Safitri', tag: 'Metodologi', text: 'Rancang bangun osilator frekuensi variabel 100 Hz - 5000 Hz dengan kontrol step 1 Hz.' },
        { author: 'Tiara Safitri', tag: 'Eksperimen', text: 'Dokumentasi pola Chladni pada frekuensi eigen 482 Hz, 1024 Hz, dan 2410 Hz dengan kamera beresolusi tinggi.' },
        { author: 'Tiara Safitri', tag: 'Validasi', text: 'Uji efektivitas pada 45 siswa SMA: peningkatan pemahaman konsep simpul/perut gelombang 2D meningkat 44%.' }
      ]
    },
    {
      name: 'Pemodelan Dinamika Transmisi Epidemiologi SEIR Demam Berdarah Dengue dengan Kontrol Optimum',
      desc: 'Analisis stabilitas titik kesetimbangan, bilangan reproduksi dasar (R0), dan simulasi numerik strategi intervensi biokontrol nyamuk Wolbachia.',
      study: 'Matematika',
      steam: 'Mathematics + Science',
      template: 'actuary',
      status: 'Aktif',
      progress: 60,
      checks: [1, 1, 1, 0, 0],
      members_count: 3,
      open_recruitment: 1,
      recruitment_roles: 'Pemodelan Numerik, Biomatematika, Visualisasi Data',
      goal: 'Bagaimana analisis sensitivitas parameter transmisi penyakit pada model SEIR nonlinier menentukan efektivitas waktu pelepasan nyamuk Wolbachia?',
      tools: 'MATLAB, Wolfram Mathematica, Python (SciPy solve_ivp), LaTeX, Inkscape',
      repo_url: 'https://github.com/steamcraft/dengue-seir-mathematical-model',
      lecturer: 'Dr. Rahmat Wijaya, M.Sc.',
      creator_username: 'hendra',
      versions_count: 3,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 86, T: 84, E: 74, A: 70, M: 98 }),
      journals: [
        { author: 'Hendra Kusuma', tag: 'Metodologi', text: 'Formulasi sistem persamaan diferensial nonlinier 7 variabel keadaan (SEIR pada inang manusia dan SEI pada vektor nyamuk).' },
        { author: 'Hendra Kusuma', tag: 'Eksperimen', text: 'Perhitungan matriks generasi berikutnya (Next Generation Matrix) untuk menurunkan formula eksplisit R0.' },
        { author: 'Hendra Kusuma', tag: 'Simulasi', text: 'Simulasi integrasi numerik Runge-Kutta Ordo 4 dengan variasi efisiensi pelepasan nyamuk ber-Wolbachia.' }
      ]
    },
    {
      name: 'Etnomatematika Geometri Fraktal Batik Tradisional Nusantara Berbantuan Manipulatif Digital GeoGebra',
      desc: 'Eksplorasi konsep transformasi geometri, iterasi rekursif, dan dimensi fraktal Hausdorff pada motif Batik Kawung dan Parang untuk pembelajaran bermakna.',
      study: 'Pendidikan Matematika',
      steam: 'Mathematics + Art',
      template: 'free',
      status: 'Aktif',
      progress: 40,
      checks: [1, 1, 0, 0, 0],
      members_count: 4,
      open_recruitment: 1,
      recruitment_roles: 'GeoGebra Expert, Budayawan Batik, Desainer Modul Ajar STEAM',
      goal: 'Bagaimana pembelajaran matematika berbasis etnomatematika batik meningkatkan kemampuan koneksi matematis dan apresiasi budaya siswa?',
      tools: 'GeoGebra 3D, Fractint, Adobe Illustrator, Lembar Aktivitas Siswa (LAS) STEAM',
      repo_url: 'https://github.com/steamcraft/ethnomathematics-batik-geogebra',
      lecturer: 'Prof. Dr. Hartono, M.Si.',
      creator_username: 'laila',
      versions_count: 2,
      blocker: 0,
      blocker_reason: '',
      steam_scores: JSON.stringify({ S: 80, T: 85, E: 72, A: 98, M: 95 }),
      journals: [
        { author: 'Laila Munawaroh', tag: 'Observasi', text: 'Studi etnomatematika di sentra batik tradisional: menganalisis proporsi geometri simetri rotasi dan translasi motif Kawung.' },
        { author: 'Laila Munawaroh', tag: 'Metodologi', text: 'Penyusunan applet dinamis GeoGebra dengan slider parameter sudut dan skala rekursi fraktal motif batik.' }
      ]
    }
  ];

  const insertProj = db.prepare(`
    INSERT INTO projects (
      name, desc, study, steam, template, status, progress, members_count, open_recruitment,
      recruitment_roles, goal, tools, repo_url, lecturer, creator_id, versions_count,
      blocker, blocker_reason, final_score, final_grade, final_note, evaluation_recorded,
      package_compiled, package_filename, steam_scores
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const insertCP = db.prepare(`
    INSERT INTO checkpoints (project_id, stage_index, title, description, is_completed, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertJournal = db.prepare(`
    INSERT INTO journals (project_id, author_name, tag, content)
    VALUES (?, ?, ?, ?)
  `);

  const insertRubric = db.prepare(`
    INSERT INTO rubrics (project_id, score_completeness, score_evidence, score_contribution, score_reproducibility, total_score, feedback, evaluator_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAct = db.prepare(`
    INSERT INTO activity_logs (project_id, user_name, action_text)
    VALUES (?, ?, ?)
  `);

  for (const p of scienceProjects) {
    const exists = db.prepare('SELECT id FROM projects WHERE name = ?').get(p.name);
    if (!exists) {
      const creatorId = getUserId(p.creator_username);
      const res = insertProj.run(
        p.name, p.desc, p.study, p.steam, p.template, p.status, p.progress, p.members_count, p.open_recruitment,
        p.recruitment_roles, p.goal, p.tools, p.repo_url, p.lecturer, creatorId, p.versions_count,
        p.blocker, p.blocker_reason, p.final_score || null, p.final_grade || null, p.final_note || null, p.evaluation_recorded || 0,
        p.package_compiled || 0, p.package_filename || null, p.steam_scores
      );
      const newProjId = res.lastInsertRowid;

      // Checkpoints
      const tpl = DEFAULT_TEMPLATES[p.template] || DEFAULT_TEMPLATES.experiment;
      tpl.cp.forEach((stage, idx) => {
        const isDone = p.checks[idx] ? 1 : 0;
        const doneAt = isDone ? new Date(Date.now() - (5 - idx) * 86400000 * 3).toISOString() : null;
        insertCP.run(newProjId, idx, stage[0], stage[1], isDone, doneAt);
      });

      // Journals
      if (p.journals) {
        for (const j of p.journals) {
          insertJournal.run(newProjId, j.author, j.tag, j.text);
        }
      }

      // Rubric for evaluated project
      if (p.evaluation_recorded) {
        insertRubric.run(newProjId, 95.0, 92.0, 94.0, 94.0, p.final_score, p.final_note, p.lecturer);
      }

      // Activity logs
      insertAct.run(newProjId, p.creator_username, `Menginisialisasi workspace proyek riset: ${p.name}`);
      insertAct.run(newProjId, p.creator_username, `Menghubungkan repositori: ${p.repo_url}`);
    }
  }

  console.log('Science & Science Education programs seeded successfully!');
}

function seedProjectMembers() {
  const count = db.prepare('SELECT COUNT(*) as count FROM project_members').get().count;
  if (count > 0) return;

  console.log('Seeding multidisciplinary team members for all STEAM projects...');

  const insertMember = db.prepare(`
    INSERT INTO project_members (project_id, user_id, name, identifier, study_program, role, is_lead, avatar_color)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const teamData = {
    1: [ // Cuaca Mikro (Sains Data)
      { uname: 'budi', name: 'Budi Santoso', id: '202610101', prodi: 'Sains Data', role: 'Ketua Tim & Lead Data Scientist', isLead: 1, color: '#2878d7' },
      { uname: 'tiara', name: 'Tiara Safitri', id: '202610110', prodi: 'Pendidikan Fisika', role: 'Instrumentasi & Kalibrasi Sensor', isLead: 0, color: '#ea580c' },
      { uname: 'hendra', name: 'Hendra Kusuma', id: '202610111', prodi: 'Matematika', role: 'Pemodelan Deret Waktu & Galat', isLead: 0, color: '#2563eb' },
      { uname: 'laila', name: 'Laila Munawaroh', id: '202610112', prodi: 'Pendidikan Matematika', role: 'Visualisasi Dashboard & Dokumentasi', isLead: 0, color: '#1d4ed8' }
    ],
    2: [ // Deteksi Sampah (AI)
      { uname: 'siti', name: 'Siti Nurhaliza', id: '202610102', prodi: 'Artificial Intelligence', role: 'Ketua Tim & Computer Vision Engineer', isLead: 1, color: '#37b6a0' },
      { uname: 'bayu', name: 'Bayu Wicaksono', id: '202610109', prodi: 'Fisika', role: 'Optika Kamera & High-Speed Lighting', isLead: 0, color: '#f97316' },
      { uname: 'dimas', name: 'Dimas Anggara', id: '202610107', prodi: 'Kimia', role: 'Karakterisasi Polimer Plastik', isLead: 0, color: '#8b5cf6' },
      { uname: 'budi', name: 'Budi Santoso', id: '202610101', prodi: 'Sains Data', role: 'Pipeline Preprocessing Dataset', isLead: 0, color: '#2878d7' }
    ],
    3: [ // Risiko Keuangan (Aktuaria)
      { uname: 'reza', name: 'Reza Pratama', id: '202610103', prodi: 'Sains Aktuaria', role: 'Ketua Tim & Risk Modeler', isLead: 1, color: '#8060d5' },
      { uname: 'hendra', name: 'Hendra Kusuma', id: '202610111', prodi: 'Matematika', role: 'Formulasi Stokastik & Monte Carlo', isLead: 0, color: '#2563eb' },
      { uname: 'siti', name: 'Siti Nurhaliza', id: '202610102', prodi: 'Artificial Intelligence', role: 'Automated Scoring ML Pipeline', isLead: 0, color: '#37b6a0' },
      { uname: 'laila', name: 'Laila Munawaroh', id: '202610112', prodi: 'Pendidikan Matematika', role: 'Analisis Sensitivitas & Survei', isLead: 0, color: '#1d4ed8' }
    ],
    4: [ // Biofilter Eceng Gondok (Bioteknologi)
      { uname: 'zahra', name: 'Zahra Amalia', id: '202610104', prodi: 'Bioteknologi', role: 'Ketua Tim & Lead Biotechnologist', isLead: 1, color: '#ed7b64' },
      { uname: 'fitri', name: 'Fitri Handayani', id: '202610105', prodi: 'Biologi', role: 'Uji Fitoremediasi & Fisiologi Tanaman', isLead: 0, color: '#10b981' },
      { uname: 'dimas', name: 'Dimas Anggara', id: '202610107', prodi: 'Kimia', role: 'Spektrofotometri Logam Berat', isLead: 0, color: '#8b5cf6' },
      { uname: 'anisa', name: 'Anisa Rahmawati', id: '202610106', prodi: 'Pendidikan Biologi', role: 'Edukasi Komunitas Limbah Batik', isLead: 0, color: '#059669' }
    ],
    5: [ // Kursi Roda EEG (Biomedis & Komputer)
      { uname: 'siti', name: 'Siti Nurhaliza', id: '202610102', prodi: 'Artificial Intelligence', role: 'Ketua Tim & Brain-Computer Interface', isLead: 1, color: '#37b6a0' },
      { uname: 'bayu', name: 'Bayu Wicaksono', id: '202610109', prodi: 'Fisika', role: 'Instrumentasi Elektroda & Sinyal EEG', isLead: 0, color: '#f97316' },
      { uname: 'zahra', name: 'Zahra Amalia', id: '202610104', prodi: 'Bioteknologi', role: 'Neurobiologi & Uji Ergonomis', isLead: 0, color: '#ed7b64' },
      { uname: 'reza', name: 'Reza Pratama', id: '202610103', prodi: 'Sains Aktuaria', role: 'Uji Keandalan & Safety Assessment', isLead: 0, color: '#8060d5' }
    ],
    6: [ // Makrozoobentos (Biologi)
      { uname: 'fitri', name: 'Fitri Handayani', id: '202610105', prodi: 'Biologi', role: 'Ketua Tim & Taksonomis Bioindikator', isLead: 1, color: '#10b981' },
      { uname: 'dimas', name: 'Dimas Anggara', id: '202610107', prodi: 'Kimia', role: 'Analisis Fisikokimia Mutu Air', isLead: 0, color: '#8b5cf6' },
      { uname: 'hendra', name: 'Hendra Kusuma', id: '202610111', prodi: 'Matematika', role: 'Statistik Keanekaragaman PAST', isLead: 0, color: '#2563eb' },
      { uname: 'anisa', name: 'Anisa Rahmawati', id: '202610106', prodi: 'Pendidikan Biologi', role: 'Penyusunan Modul Konservasi Sungai', isLead: 0, color: '#059669' }
    ],
    7: [ // Herbaria Digital (Pendidikan Biologi)
      { uname: 'anisa', name: 'Anisa Rahmawati', id: '202610106', prodi: 'Pendidikan Biologi', role: 'Ketua Tim & Instructional Designer', isLead: 1, color: '#059669' },
      { uname: 'fitri', name: 'Fitri Handayani', id: '202610105', prodi: 'Biologi', role: 'Kurator Botani & Etnofarmakologi', isLead: 0, color: '#10b981' },
      { uname: 'siti', name: 'Siti Nurhaliza', id: '202610102', prodi: 'Artificial Intelligence', role: 'Rekonstruksi Model 3D WebGL', isLead: 0, color: '#37b6a0' },
      { uname: 'budi', name: 'Budi Santoso', id: '202610101', prodi: 'Sains Data', role: 'Arsitektur Database Taksonomi', isLead: 0, color: '#2878d7' }
    ],
    8: [ // Kitosan Bioplastik (Kimia)
      { uname: 'dimas', name: 'Dimas Anggara', id: '202610107', prodi: 'Kimia', role: 'Ketua Tim & Kimia Material Hijau', isLead: 1, color: '#8b5cf6' },
      { uname: 'bayu', name: 'Bayu Wicaksono', id: '202610109', prodi: 'Fisika', role: 'Uji Kuat Tarik Mekanik (UTM)', isLead: 0, color: '#f97316' },
      { uname: 'zahra', name: 'Zahra Amalia', id: '202610104', prodi: 'Bioteknologi', role: 'Uji Biodegradabilitas Tanah', isLead: 0, color: '#ed7b64' },
      { uname: 'nurul', name: 'Nurul Hidayah', id: '202610108', prodi: 'Pendidikan Kimia', role: 'Reviewer Metrik Kimia Hijau', isLead: 0, color: '#7c3aed' }
    ],
    9: [ // Lab Virtual Titrasi (Pendidikan Kimia)
      { uname: 'nurul', name: 'Nurul Hidayah', id: '202610108', prodi: 'Pendidikan Kimia', role: 'Ketua Tim & Pedagogi Kimia Virtual', isLead: 1, color: '#7c3aed' },
      { uname: 'dimas', name: 'Dimas Anggara', id: '202610107', prodi: 'Kimia', role: 'Validasi Model Reaksi Stoikiometri', isLead: 0, color: '#8b5cf6' },
      { uname: 'siti', name: 'Siti Nurhaliza', id: '202610102', prodi: 'Artificial Intelligence', role: 'Pengembang Gamifikasi Interaktif', isLead: 0, color: '#37b6a0' },
      { uname: 'laila', name: 'Laila Munawaroh', id: '202610112', prodi: 'Pendidikan Matematika', role: 'Validasi Four-Tier Diagnostic Test', isLead: 0, color: '#1d4ed8' }
    ],
    10: [ // Spektrofotometer Mini (Fisika)
      { uname: 'bayu', name: 'Bayu Wicaksono', id: '202610109', prodi: 'Fisika', role: 'Ketua Tim & Lead Optical Physicist', isLead: 1, color: '#f97316' },
      { uname: 'budi', name: 'Budi Santoso', id: '202610101', prodi: 'Sains Data', role: 'Pengolahan Sinyal Spektrum Python', isLead: 0, color: '#2878d7' },
      { uname: 'dimas', name: 'Dimas Anggara', id: '202610107', prodi: 'Kimia', role: 'Kalibrasi Larutan Hukum Beer-Lambert', isLead: 0, color: '#8b5cf6' },
      { uname: 'tiara', name: 'Tiara Safitri', id: '202610110', prodi: 'Pendidikan Fisika', role: 'Diseminasi Sains & Modul Praktikum', isLead: 0, color: '#ea580c' }
    ],
    11: [ // Chladni Plate (Pendidikan Fisika)
      { uname: 'tiara', name: 'Tiara Safitri', id: '202610110', prodi: 'Pendidikan Fisika', role: 'Ketua Tim & Desainer Kit Resonansi 2D', isLead: 1, color: '#ea580c' },
      { uname: 'bayu', name: 'Bayu Wicaksono', id: '202610109', prodi: 'Fisika', role: 'Desain Driver Piezo & Generator DDS', isLead: 0, color: '#f97316' },
      { uname: 'hendra', name: 'Hendra Kusuma', id: '202610111', prodi: 'Matematika', role: 'Pemodelan Fungsi Bessel Modus Getar', isLead: 0, color: '#2563eb' },
      { uname: 'laila', name: 'Laila Munawaroh', id: '202610112', prodi: 'Pendidikan Matematika', role: 'Evaluasi Simetri Visual Geometri', isLead: 0, color: '#1d4ed8' }
    ],
    12: [ // Model SEIR Dengue (Matematika)
      { uname: 'hendra', name: 'Hendra Kusuma', id: '202610111', prodi: 'Matematika', role: 'Ketua Tim & Biomathematician', isLead: 1, color: '#2563eb' },
      { uname: 'fitri', name: 'Fitri Handayani', id: '202610105', prodi: 'Biologi', role: 'Parameter Biologis Wolbachia', isLead: 0, color: '#10b981' },
      { uname: 'budi', name: 'Budi Santoso', id: '202610101', prodi: 'Sains Data', role: 'Simulasi Numerik Runge-Kutta Ordo 4', isLead: 0, color: '#2878d7' },
      { uname: 'reza', name: 'Reza Pratama', id: '202610103', prodi: 'Sains Aktuaria', role: 'Analisis Sensitivitas & Risiko Epidemi', isLead: 0, color: '#8060d5' }
    ],
    13: [ // Etnomatematika Fraktal Batik (Pendidikan Matematika)
      { uname: 'laila', name: 'Laila Munawaroh', id: '202610112', prodi: 'Pendidikan Matematika', role: 'Ketua Tim & Spesialis Etnomatematika', isLead: 1, color: '#1d4ed8' },
      { uname: 'hendra', name: 'Hendra Kusuma', id: '202610111', prodi: 'Matematika', role: 'Kalkulasi Dimensi Fraktal Hausdorff', isLead: 0, color: '#2563eb' },
      { uname: 'tiara', name: 'Tiara Safitri', id: '202610110', prodi: 'Pendidikan Fisika', role: 'Kajian Simetri Fisika & Optik Batik', isLead: 0, color: '#ea580c' },
      { uname: 'anisa', name: 'Anisa Rahmawati', id: '202610106', prodi: 'Pendidikan Biologi', role: 'Pewarnaan Alami & Motif Flora Nusantara', isLead: 0, color: '#059669' }
    ]
  };

  for (const [projId, members] of Object.entries(teamData)) {
    for (const m of members) {
      const u = db.prepare('SELECT id FROM users WHERE username = ?').get(m.uname);
      const uid = u ? u.id : null;
      insertMember.run(Number(projId), uid, m.name, m.id, m.prodi, m.role, m.isLead, m.color);
    }
    db.prepare('UPDATE projects SET members_count = ? WHERE id = ?').run(members.length, Number(projId));
  }

  // Populate completed_by for completed checkpoints
  const completedCheckpoints = db.prepare('SELECT id, project_id, stage_index FROM checkpoints WHERE is_completed = 1').all();
  for (const cp of completedCheckpoints) {
    const lead = db.prepare('SELECT name, study_program FROM project_members WHERE project_id = ? AND is_lead = 1').get(cp.project_id);
    const assignedName = lead ? `${lead.name} (${lead.study_program})` : 'Ketua Tim Riset';
    db.prepare("UPDATE checkpoints SET completed_by = ? WHERE id = ? AND (completed_by IS NULL OR completed_by = '')").run(assignedName, cp.id);
  }

  // Mark seeded projects as demo projects
  db.exec('UPDATE projects SET is_demo = 1 WHERE id <= 13;');

  console.log('Project team members and task assignees seeded successfully!');
}

function upgradeUsersTableForAdmin() {
  try {
    const tableDef = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (tableDef && tableDef.sql && !tableDef.sql.includes("'admin'")) {
      db.exec(`
        PRAGMA foreign_keys = OFF;
        CREATE TABLE users_migrated (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('student', 'lecturer', 'admin')),
          identifier TEXT NOT NULL,
          study_program TEXT NOT NULL,
          avatar_color TEXT DEFAULT '#2878d7',
          password TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          faculty TEXT DEFAULT 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
          university TEXT DEFAULT 'Universitas Indonesia',
          research_interests TEXT DEFAULT 'Sains, Teknologi, Rekayasa & Matematika',
          bio TEXT DEFAULT '',
          academic_links TEXT DEFAULT ''
        );
        INSERT INTO users_migrated (id, username, name, role, identifier, study_program, avatar_color, password, created_at, faculty, university, research_interests, bio, academic_links)
        SELECT id, username, name, role, identifier, study_program, avatar_color, password, created_at, faculty, university, research_interests, bio, academic_links FROM users;
        DROP TABLE users;
        ALTER TABLE users_migrated RENAME TO users;
        PRAGMA foreign_keys = ON;
      `);
      console.log('✓ Users table upgraded to support role "admin"!');
    }
  } catch (err) {
    console.error('Error upgrading users table:', err.message);
  }
}

function seedAdminAndCivitasAccounts() {
  upgradeUsersTableForAdmin();

  // 1. Seed Administrator / Lead Dev Account
  const adminUser = db.prepare("SELECT * FROM users WHERE username = 'admin'").get();
  if (!adminUser) {
    db.prepare(`
      INSERT INTO users (username, name, role, identifier, study_program, faculty, university, research_interests, bio, academic_links, avatar_color, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admin',
      'Administrator Sistem (Lead Dev & Architect)',
      'admin',
      'ADM-2026-DEV01',
      'Pusat Riset & Rekayasa Sistem',
      'Direktorat Sistem Informasi & Laboratorium Terpadu',
      'Universitas Indonesia',
      'System Architecture, Cloud Infrastructure, AI Pipeline & Data Science',
      'Akun administrator utama platform STEAM-Craft untuk monitoring telemetri riset, tata kelola akses dosen & mahasiswa, audit repositori, dan kontrol mode sistem.',
      'GitHub: github.com/steamcraft-admin · Docs: steamcraft.online/docs',
      '#0f172a',
      'admin2026!'
    );
    console.log('✓ Administrator / Lead Dev account seeded: @admin (pass: admin2026!)');
  }

  // 2. Seed Realistic Civitas Accounts for Production Mode
  const civitasList = [
    {
      username: 'sarah.biotech',
      name: 'Sarah Amanda Putri, S.Si.',
      role: 'student',
      identifier: '202610201',
      study_program: 'Bioteknologi',
      faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
      university: 'Institut Pertanian Bogor',
      research_interests: 'Bioteknologi Enzim, Biopolimer, Rekayasa Genetika Mikroba',
      bio: 'Mahasiswa peneliti laboratorium bioteknologi mikrobial. Sedang meneliti sintesis enzim termostabil.',
      academic_links: 'GitHub: github.com/sarahamanda · LinkedIn: linkedin.com/in/sarahamanda',
      avatar_color: '#059669',
      password: 'password123'
    },
    {
      username: 'kevin.ai',
      name: 'Kevin Pratama',
      role: 'student',
      identifier: '202610202',
      study_program: 'Artificial Intelligence',
      faculty: 'Fakultas Ilmu Komputer & Sains Data',
      university: 'Universitas Indonesia',
      research_interests: 'Computer Vision, Edge AI, Automated Defect Detection',
      bio: 'Mahasiswa periset model deteksi objek berkecepatan tinggi pada lini produksi industri manufaktur.',
      academic_links: 'GitHub: github.com/kevinpratama · HuggingFace: huggingface.co/kevinai',
      avatar_color: '#2563eb',
      password: 'password123'
    },
    {
      username: 'prof.hendra',
      name: 'Prof. Dr. Hendra Gunawan, M.Sc.',
      role: 'lecturer',
      identifier: '197808152003121001',
      study_program: 'Matematika',
      faculty: 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
      university: 'Institut Teknologi Bandung',
      research_interests: 'Analisis Harmonik, Teori Ruang Fungsi, Pemodelan Sains STEAM',
      bio: 'Guru Besar Matematika Analisis. Pembina program riset multidisiplin dan standarisasi rubrik luaran ilmiah.',
      academic_links: 'Scopus ID: 6602938102 · Google Scholar: Hendra Gunawan ITB',
      avatar_color: '#1e3a8a',
      password: 'dosen123'
    },
    {
      username: 'dr.citra',
      name: 'Dr. Citra Lestari, M.Biomed.',
      role: 'lecturer',
      identifier: '198302142008122003',
      study_program: 'Biologi',
      faculty: 'Fakultas Kedokteran & Sains Hayati',
      university: 'Universitas Indonesia',
      research_interests: 'Biomedika Molekuler, Biomaterial Alami, Pengujian Biokompatibilitas',
      bio: 'Dosen pembimbing riset sintesis bahan hayati, regenerasi sel, dan aplikasi bioplastik medis.',
      academic_links: 'ORCID: 0000-0003-4912-8821 · SINTA ID: 598214',
      avatar_color: '#0d9488',
      password: 'dosen123'
    }
  ];

  const insertCivitas = db.prepare(`
    INSERT INTO users (username, name, role, identifier, study_program, faculty, university, research_interests, bio, academic_links, avatar_color, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of civitasList) {
    const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(c.username);
    if (!exists) {
      insertCivitas.run(
        c.username, c.name, c.role, c.identifier, c.study_program,
        c.faculty, c.university, c.research_interests, c.bio, c.academic_links,
        c.avatar_color, c.password
      );
    }
  }
  console.log('✓ Civitas accounts seeded successfully for production mode!');
}

function getAppMode() {
  const row = db.prepare("SELECT value FROM system_settings WHERE key = 'app_mode'").get();
  return row ? row.value : 'demo';
}

function setAppMode(mode) {
  const validMode = mode === 'production' ? 'production' : 'demo';
  db.prepare(`
    INSERT INTO system_settings (key, value, updated_at)
    VALUES ('app_mode', ?, datetime('now', 'localtime'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(validMode);
  return validMode;
}

module.exports = {
  db,
  dbPath,
  dataDir,
  initDatabase,
  DEFAULT_TEMPLATES,
  getAppMode,
  setAppMode
};
