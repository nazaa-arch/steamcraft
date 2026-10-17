/**
 * STEAM-Craft AI Research Copilot Engine
 * Provides intelligent, discipline-aware scientific assistance,
 * methodology validation, blocker diagnoses, and interactive STEAM consulting.
 */

function generateGuidance(project, currentStage = 0) {
  const { name, study, steam, template, goal, tools, blocker, blocker_reason } = project;

  const stageNames = [
    'Tahap 1: Fenomena atau Rumusan Masalah',
    'Tahap 2: Data, Bukti Empiris, dan Jurnal',
    'Tahap 3: Model Teoretis atau Arsitektur Solusi',
    'Tahap 4: Simulasi, Eksperimen, dan Pengujian',
    'Tahap 5: Validasi, Refleksi, dan Reproducibility'
  ];

  const currentStageName = stageNames[currentStage] || stageNames[0];

  let guidance = {
    stage: currentStageName,
    title: `Asisten Riset STEAM untuk: ${name}`,
    disciplineAdvice: '',
    actionSteps: [],
    scientificRisk: '',
    suggestedStandards: '',
    rubricFocus: ''
  };

  // 1. Discipline Specific Advice
  const sLow = study.toLowerCase();

  if (sLow.includes('pendidikan')) {
    guidance.disciplineAdvice = `Sebagai proyek ${study} berpendekatan STEAM, fokus utama adalah inovasi pedagogis, rekonstruksi didaktis materi sains/matematika, serta efektivitas media ajar interaktif dalam mereduksi miskonsepsi siswa.`;
    guidance.actionSteps = [
      'Gunakan instrumen diagnostik terstandarisasi (misal: Four-Tier Diagnostic Test atau rubrik Keterampilan Proses Sains) untuk pre-test dan post-test.',
      'Hitung skor Normalized Gain (N-gain) Hake dan uji ukuran efek (Cohen’s d effect size) untuk membuktikan signifikansi peningkatan literasi siswa.',
      'Sertakan panduan Lembar Aktivitas Siswa (LAS) berbasis model inkuiri STEAM atau Problem-Based Learning (PBL).',
      'Dokumentasikan foto implementasi pembelajaran di kelas, interaksi siswa dengan media, dan respon kualitatif peserta didik.'
    ];
    guidance.scientificRisk = 'Bias subjektivitas instrumen evaluasi pedagogi dan kurangnya kontrol terhadap variabel lingkungan belajar kelas.';
    guidance.suggestedStandards = 'Standar Pembelajaran Abad 21 (4C: Critical Thinking, Creativity, Collaboration, Communication), BNSP, ISTE Standards.';
    guidance.rubricFocus = 'Bobot Kontribusi & Dampak Pedagogis (25%): Juri akan mengevaluasi kemudahan replikasi media oleh guru di sekolah.';
  } else if (sLow.includes('biologi')) {
    guidance.disciplineAdvice = `Sebagai proyek ${study} (Sains Hayati), pastikan protokol penanganan spesimen hidup, replikasi biologis (bukan sekadar replikasi teknis), dan kontrol lingkungan in-situ/ex-situ didokumentasikan dengan ketat.`;
    guidance.actionSteps = [
      'Terapkan metode sampling terstandarisasi (misal: purposive random sampling dengan kuadran/transek) dan catat koordinat GPS lokasi.',
      'Gunakan buku kunci determinasi taksonomi yang diakui secara internasional dan sertakan foto mikroskopis berkalibrasi mikrometer.',
      'Lakukan minimal triplo (3 ulangan biologis) untuk uji fisiologis atau kultur mikroorganisme guna memastikan reprodusibilitas.',
      'Hitung indeks keanekaragaman (Shannon-Wiener H\', Evenness E, atau Family Biotic Index) beserta uji signifikansi ANOVA/Kruskal-Wallis.'
    ];
    guidance.scientificRisk = 'Variabilitas biologis alami spesimen dan kontaminasi media kultur. Pastikan prosedur aseptik terdokumentasi.';
    guidance.suggestedStandards = 'Biosafety in Microbiological and Biomedical Laboratories (BMBL), IUCN Red List Guidelines, ISO 17025 Biological Testing.';
    guidance.rubricFocus = 'Bobot Bukti Empiris & Keabsahan (25%): Dokumentasi foto spesimen, preparat mikroskop, dan data mentah pengukuran.';
  } else if (sLow.includes('kimia')) {
    guidance.disciplineAdvice = `Sebagai proyek ${study} (Sains Kimia & Material), presisi stoikiometri reaksi, kemurnian reagen (*analytical grade*), dan karakterisasi instrumen spektroskopi menjadi tolok ukur keabsahan temuan.`;
    guidance.actionSteps = [
      'Catat spesifikasi reagen, derajat deasetilasi/kemurnian, serta perhitungan stoikiometri dan rendemen persentase (% yield).',
      'Lakukan uji blanko kalibrasi instrumen (misal: baseline correction pada FTIR dan kurva kalibrasi konsentrasi seri standar UV-Vis dengan R² > 0.99).',
      'Terapkan prinsip Green Chemistry (Kimia Hijau): minimalkan pelarut toksik, gunakan katalis terbarukan, dan dokumentasikan penanganan limbah praktikum.',
      'Uji replikasi minimal triplo untuk setiap konsentrasi variasi dan tampilkan rentang simpangan baku (standard deviation error bar).'
    ];
    guidance.scientificRisk = 'Interferensi serapan pelarut pada spektroskopi dan degradasi sampel sebelum pengukuran. Gunakan desikator yang tepat.';
    guidance.suggestedStandards = 'IUPAC Compendium of Chemical Terminology, ACS Guidelines, 12 Principles of Green Chemistry, ISO 17025.';
    guidance.rubricFocus = 'Bobot Reproducibility & Open Data (25%): Lampirkan file spektrum mentah (CSV/DAT) dari FTIR, UV-Vis, atau XRD.';
  } else if (sLow.includes('fisika')) {
    guidance.disciplineAdvice = `Sebagai proyek ${study} (Sains Fisika & Instrumentasi), ketelitian perambatan galat (error propagation), kalibrasi sensor fisik, dan kesesuaian hukum fisika fundamental merupakan inti penilaian.`;
    guidance.actionSteps = [
      'Hitung batas ketidakpastian pengukuran (\\Delta x) dari skala terkecil instrumen dan lakukan perambatan ralat diferensial pada besaran turunan.',
      'Kalibrasi instrumen terhadap standar sekunder (misal: laser referensi pada kisi difraksi optik atau osiloskop terkalibrasi pada generator sinyal).',
      'Gunakan regresi linear kuadrat terkecil (least squares method) untuk memverifikasi hukum fisika (Beer-Lambert, Ohm, Snellius, atau resonansi gelombang).',
      'Sertakan diagram skematik rangkaian instrumen, spesifikasi respons frekuensi sensor, dan proteksi sinyal dari derau (noise filtering).'
    ];
    guidance.scientificRisk = 'Derau elektronik (noise SNR), efek pembebanan sensor (*loading effect*), dan fluktuasi temperatur ruang ukur.';
    guidance.suggestedStandards = 'BIPM GUM (Guide to the Expression of Uncertainty in Measurement), NIST Physical Reference Data, IEEE Sensors Standards.';
    guidance.rubricFocus = 'Bobot Kelengkapan Checkpoint (25%): Validasi analitik matematis dari model fisika hingga eksperimen teruji.';
  } else if (sLow.includes('matematika')) {
    guidance.disciplineAdvice = `Sebagai proyek ${study} (Pemodelan Matematika & Analisis Dinamik), ketelitian pembuktian analitis (*rigorous mathematical proof*), kestabilan numerik, dan justifikasi parameter dunia nyata adalah pilar utama.`;
    guidance.actionSteps = [
      'Turunkan formulasi analitis (misal: eksistensi titik kesetimbangan bebas penyakit dan endemik, matriks Jacobian, serta nilai eigen stabilitas).',
      'Hitung bilangan reproduksi dasar (R0) dengan Next Generation Matrix dan lakukan analisis sensitivitas parameter (Forward Sensitivity Index).',
      'Lakukan simulasi numerik menggunakan metode integrasi adaptif (Runge-Kutta Ordo 4-5) dan periksa konvergensi terhadap variasi step size.',
      'Sajikan grafik fase (phase portrait), diagram bifurkasi, dan interpretasikan implikasi fisik/biologis dari hasil matematis.'
    ];
    guidance.scientificRisk = 'Ketidakstabilan numerik (*stiff differential equations*) dan over-simplifikasi asumsi yang menyimpang dari fenomena nyata.';
    guidance.suggestedStandards = 'SIAM Journal Standards, AMS Mathematical Subject Classification (MSC2020), IEEE Transactions on Automatic Control.';
    guidance.rubricFocus = 'Bobot Kontribusi & Kerapian Model (25%): Kode skrip simulasi (MATLAB/Python) harus terverifikasi dan dapat dijalankan ulang.';
  } else if (template === 'data' || sLow.includes('data') || sLow.includes('intelligence')) {
    guidance.disciplineAdvice = `Sebagai proyek ${steam}, pastikan integritas siklus data diperhatikan mulai dari data provenance, handling data leakage, pemisahan train/validation/test yang ketat, hingga interpretasi metrik (jangan hanya mengandalkan akurasi; sertakan F1-score, AUC-ROC, atau MAE/RMSE).`;
    guidance.actionSteps = [
      'Dokumentasikan metadata dataset (sumber, lisensi, rentang tanggal, potensi missing values, dan teknik imputasi).',
      'Tetapkan baseline sederhana (misal: regresi linier / random forest / naive Bayes) sebelum menguji model deep learning yang kompleks.',
      'Lakukan pengujian cross-validation (5-fold atau 10-fold) untuk memastikan model tidak mengalami overfitting.',
      'Simpan snapshot model weights dan konfigurasi hiperparameter (learning rate, batch size, optimizer) di setiap checkpoint.'
    ];
    guidance.scientificRisk = 'Risiko Data Leakage dan seleksi bias sampel. Pastikan data preprocessing dilakukan hanya pada fold latih.';
    guidance.suggestedStandards = 'Kaggle Dataset Guidelines, MLflow Model Registry, DVC (Data Version Control), IEEE Dataport standards.';
    guidance.rubricFocus = 'Bobot Reproducibility (25%): Penguji akan memeriksa apakah notebook/script dapat dijalankan ulang dengan hasil yang identik.';
  } else if (template === 'actuary' || sLow.includes('aktuaria')) {
    guidance.disciplineAdvice = `Sebagai proyek ${steam} pemodelan risiko dan matematika aktuaria, validitas asumsi teoretis dan uji sensitivitas skenario stres (stress testing) menjadi fondasi ilmiah.`;
    guidance.actionSteps = [
      'Uji goodness-of-fit distribusi probabilitas (Kolmogorov-Smirnov atau Anderson-Darling test) sebelum mengasumsikan distribusi normal.',
      'Terapkan simulasi Monte Carlo minimal 10.000 iterasi untuk estimasi interval kepercayaan (95% dan 99% CI).',
      'Analisis sensitivitas parameter terhadap skenario terburuk (worst-case scenario) dan estimasi Value at Risk (VaR).',
      'Jelaskan batasan model secara transparan pada bagian refleksi dan implikasi bagi pengambil keputusan.'
    ];
    guidance.scientificRisk = 'Model risk akibat over-simplifikasi asumsi dunia nyata atau data historis yang tidak stasioner.';
    guidance.suggestedStandards = 'Society of Actuaries (SOA) standards, Basel III/IV risk frameworks, IFRS 17 actuarial disclosures.';
    guidance.rubricFocus = 'Bobot Kontribusi & Dampak (25%): Tunjukkan bagaimana model ini memberikan solusi kuantitatif bagi masalah nyata.';
  } else {
    guidance.disciplineAdvice = `Sebagai proyek ${steam} multidisiplin terintegrasi, sinergi antara sains, rekayasa, dan estetika/desain harus tampak harmonis dalam memecahkan masalah kemanusiaan.`;
    guidance.actionSteps = [
      'Gunakan pendekatan Human-Centered Design untuk memvalidasi kebutuhan pengguna akhir.',
      'Dokumentasikan matriks pembagian peran dan integrasi antar disiplin ilmu dalam tim.',
      'Uji prototipe fungsional kepada pengguna riil dan kumpulkan feedback kualitatif serta kuantitatif.',
      'Sertakan aspek etika, keberlanjutan lingkungan, dan nilai tambah sosial dalam laporan akhir.'
    ];
    guidance.scientificRisk = 'Disparitas integrasi antar disiplin atau dominasi satu aspek teknis yang mengabaikan kegunaan pengguna.';
    guidance.suggestedStandards = 'Design Thinking Standard Framework, UN Sustainable Development Goals (SDGs), IEEE Ethics in Engineering.';
    guidance.rubricFocus = 'Keseimbangan STEAM: Penilaian proporsional pada aspek Sains, Teknologi, Rekayasa, Seni, dan Matematika.';
  }

  // 2. Blocker Analysis
  if (blocker) {
    guidance.blockerAnalysis = {
      isBlocked: true,
      reason: blocker_reason || 'Kendala metodologi belum dideskripsikan secara spesifik.',
      urgentAction: 'Proyek ini memiliki blocker aktif! Jadwalkan segera "Klinik Metodologi" dengan Dosen Pembimbing melalui menu Bimbingan, dan siapkan dokumen ringkasan data atau skema masalah yang dihadapi.'
    };
  }

  return guidance;
}

function answerUserQuery(question, project) {
  const q = question.toLowerCase();
  const projName = project ? project.name : 'Proyek STEAM';
  const study = project ? project.study : 'Sains & Teknologi';

  if (q.includes('blocker') || q.includes('macet') || q.includes('kendala') || q.includes('error')) {
    return `Untuk mengatasi kendala pada **${projName}**, langkah pertama adalah isolasi masalah:\n1. Buka jurnal riset dan catat gejala error secara rinci (log galat, parameter yang diuji, atau anomali data).\n2. Aktifkan tombol **Tandai Blocker** di ruang kerja agar dosen pembimbing langsung menerima notifikasi darurat.\n3. Masuk ke menu **Bimbingan** dan ajukan sesi "Klinik Metodologi" untuk bedah masalah bersama dosen pembimbing.`;
  }

  if (q.includes('dataset') || q.includes('data') || q.includes('sumber')) {
    return `Dalam standar kompetisi STEAM-Craft, data untuk bidang **${study}** harus memenuhi kriteria **FAIR** (Findable, Accessible, Interoperable, Reusable):\n- Catat lisensi data (Creative Commons, MIT, atau izin resmi instansi).\n- Simpan link dataset publik atau unggah sample data ke repositori GitHub yang terhubung.\n- Jangan lupa sertakan dictionary variabel pada Checkpoint 2 (Data, Bukti, dan Jurnal).`;
  }

  if (q.includes('rubrik') || q.includes('nilai') || q.includes('skor') || q.includes('juri')) {
    return `Evaluasi akhir STEAM-Craft dinilai oleh juri dan dosen melalui 4 pilar rubrik terstandarisasi (masing-masing 25%):\n1. **Kelengkapan Checkpoint (25%)**: Kelima tahapan ilmiah terselesaikan dengan bukti nyata.\n2. **Bukti & Jurnal Ilmiah (25%)**: Catatan proses, data mentah, dan log iterasi terdokumentasi teratur.\n3. **Kontribusi Multidisiplin (25%)**: Sinergi nyata anggota tim lintas disiplin (Science, Tech, Eng, Art, Math).\n4. **Reproducibility (25%)**: Kode, model, atau eksperimen dapat diuji ulang dengan paket reproducibility resmi.`;
  }

  if (q.includes('alat') || q.includes('lab') || q.includes('gpu') || q.includes('fasilitas')) {
    return `Jika tim Anda memerlukan fasilitas komputasi tinggi (seperti GPU NVIDIA RTX 4090), mesin 3D Printing, atau peralatan Lab Kimia/Elektronika, gunakan fitur **Ajukan Fasilitas** pada menu navigasi mahasiswa. Permohonan Anda akan ditinjau dan disetujui langsung oleh pengelola lab/dosen pembimbing.`;
  }

  if (q.includes('checkpoint') || q.includes('langkah') || q.includes('alur')) {
    return `Alur kerja riset STEAM-Craft mengikuti 5 tahap metode ilmiah terintegrasi:\n1. **Fenomena/Masalah**: Latar belakang, rumusan hipotesis, dan urgensi solusi.\n2. **Data & Bukti**: Pengumpulan data empiris, kalibrasi alat, dan studi pustaka.\n3. **Model & Solusi**: Perancangan model matematika, arsitektur AI, atau rancang bangun alat.\n4. **Simulasi & Pengujian**: Pengujian terkontrol, replikasi data, dan optimasi parameter.\n5. **Validasi & Refleksi**: Pengukuran kinerja akhir, analisis ketidakpastian, dan penyusunan Reproducibility Package.`;
  }

  // Default intelligent assistant response
  return `Halo! Saya adalah **STEAM-Craft AI Research Copilot** untuk **${projName}** (${study}).\n\nBerdasarkan progres tim Anda, saya menyarankan Anda fokus melengkapi dokumentasi jurnal riset dan menghubungkan repositori eksternal (GitHub/Google Drive) agar setiap iterasi memiliki bukti rekam jejak yang valid untuk penilaian juri. Ada aspek metodologi atau teknis tertentu yang ingin Anda diskusikan?`;
}

module.exports = {
  generateGuidance,
  answerUserQuery
};
