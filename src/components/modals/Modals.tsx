import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Bookmark, Calendar, Clock, MapPin, Send, Sparkles, Star, Award, ThumbsUp } from 'lucide-react';
import { User, Project } from '../../types';

export const Modals: React.FC = () => {
  const {
    activeModal,
    modalData,
    closeModal,
    projects,
    currentUser,
    createProject,
    updateProfile,
    bookConsultation,
    requestResource,
    applyRecruitment,
    addAnnouncement,
    registerUser,
    toggleSaveAnnouncement,
    addPeerFeedback,
    members
  } = useApp();

  if (!activeModal) return null;

  return (
    <div className="modal-overlay active" onClick={closeModal}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>

        {activeModal === 'newProject' && <NewProjectModalContent onClose={closeModal} />}
        {activeModal === 'profile' && <ProfileModalContent user={modalData || currentUser} onClose={closeModal} />}
        {activeModal === 'consultation' && <ConsultationModalContent data={modalData} onClose={closeModal} />}
        {activeModal === 'resource' && <ResourceModalContent data={modalData} onClose={closeModal} />}
        {activeModal === 'apply' && <ApplyModalContent project={modalData} onClose={closeModal} />}
        {activeModal === 'peerFeedback' && <PeerFeedbackModalContent data={modalData} onClose={closeModal} />}
        {activeModal === 'announcementDetail' && <AnnouncementDetailContent ann={modalData} onClose={closeModal} />}
        {activeModal === 'newAnnouncement' && <NewAnnouncementContent onClose={closeModal} />}
        {activeModal === 'register' && <RegisterModalContent onClose={closeModal} />}
      </div>
    </div>
  );
};

/* ==================== 1. NEW PROJECT MODAL ==================== */
const NewProjectModalContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createProject, currentUser } = useApp();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [study, setStudy] = useState(currentUser?.study_program || 'Sains Data');
  const [steam, setSteam] = useState('Science + Tech');
  const [template, setTemplate] = useState<'data' | 'experiment' | 'actuary' | 'free'>('data');
  const [goal, setGoal] = useState('');
  const [tools, setTools] = useState('Python, Git, Lab Instruments');
  const [repoUrl, setRepoUrl] = useState('');
  const [lecturer, setLecturer] = useState('Dr. Rahmat Wijaya, M.Sc.');
  const [openRec, setOpenRec] = useState(1);
  const [recRoles, setRecRoles] = useState('Data Analyst, Hardware IoT, UI/UX');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject({
      name,
      desc,
      study,
      steam,
      template,
      goal,
      tools,
      repo_url: repoUrl || 'https://github.com/steamcraft/research-project',
      lecturer,
      open_recruitment: openRec,
      recruitment_roles: recRoles
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Inisiasi Riset Multidisiplin</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Buat Proyek Riset Baru
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
        Daftarkan judul penelitian baru berbasis kerangka kerja 5 pilar STEAM.
      </p>

      <div className="auth-field">
        <label>Judul Proyek Penelitian</label>
        <input
          type="text"
          placeholder="Contoh: Klasifikasi Kualitas Air Sungai dengan Bioindikator Makrozoobentos"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label>Ringkasan Abstrak & Masalah</label>
        <textarea
          rows={3}
          placeholder="Jelaskan fenomena masalah, target observasi, dan urgensi penelitian..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Program Studi Utama</label>
          <select value={study} onChange={e => setStudy(e.target.value)}>
            <option value="Sains Data">Sains Data</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Biologi">Biologi</option>
            <option value="Pendidikan Biologi">Pendidikan Biologi</option>
            <option value="Kimia">Kimia</option>
            <option value="Pendidikan Kimia">Pendidikan Kimia</option>
            <option value="Fisika">Fisika</option>
            <option value="Pendidikan Fisika">Pendidikan Fisika</option>
            <option value="Matematika">Matematika</option>
            <option value="Pendidikan Matematika">Pendidikan Matematika</option>
            <option value="Sains Aktuaria">Sains Aktuaria</option>
            <option value="Bioteknologi">Bioteknologi</option>
          </select>
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Template Alur Kerja</label>
          <select value={template} onChange={e => setTemplate(e.target.value as any)}>
            <option value="data">Analisis Data / AI</option>
            <option value="experiment">Eksperimen / Laboratorium</option>
            <option value="actuary">Model Risiko / Aktuaria</option>
            <option value="free">Proyek Bebas / Lintas Disiplin</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Pilar STEAM Terkait</label>
          <input
            type="text"
            placeholder="Science + Tech, Math + Art, dll"
            value={steam}
            onChange={e => setSteam(e.target.value)}
          />
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Dosen Pembimbing</label>
          <select value={lecturer} onChange={e => setLecturer(e.target.value)}>
            <option value="Dr. Rahmat Wijaya, M.Sc.">Dr. Rahmat Wijaya, M.Sc.</option>
            <option value="Prof. Dr. Ir. Dewi Kartika">Prof. Dr. Ir. Dewi Kartika</option>
            <option value="Prof. Dr. Hartono, M.Si.">Prof. Dr. Hartono, M.Si.</option>
          </select>
        </div>
      </div>

      <div className="auth-field">
        <label>Pertanyaan Riset / Hipotesis Utama</label>
        <input
          type="text"
          placeholder="Contoh: Bagaimana korelasi nilai pH dan DO terhadap kelimpahan taksa Baetidae?"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Alat Ukur / Perangkat Lunak</label>
          <input
            type="text"
            placeholder="Python, Spectrophotometer, R, dsb"
            value={tools}
            onChange={e => setTools(e.target.value)}
          />
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>URL Repositori GitHub (Opsional)</label>
          <input
            type="url"
            placeholder="https://github.com/..."
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="auth-field">
        <label>Buka Rekrutmen Anggota Baru?</label>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <input
              type="radio"
              name="openRec"
              checked={openRec === 1}
              onChange={() => setOpenRec(1)}
            />
            Ya, Buka Rekrutmen Multidisiplin
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <input
              type="radio"
              name="openRec"
              checked={openRec === 0}
              onChange={() => setOpenRec(0)}
            />
            Tidak (Tim Lengkap)
          </label>
        </div>
      </div>

      {openRec === 1 && (
        <div className="auth-field">
          <label>Peran yang Dibutuhkan</label>
          <input
            type="text"
            placeholder="Contoh: Data Analyst, Hardware IoT, UI/UX Designer"
            value={recRoles}
            onChange={e => setRecRoles(e.target.value)}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Inisialisasi Proyek Baru &rarr;
        </button>
      </div>
    </form>
  );
};

/* ==================== 2. PROFILE MODAL ==================== */
const ProfileModalContent: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
  const { updateProfile } = useApp();
  const [name, setName] = useState(user.name || '');
  const [identifier, setIdentifier] = useState(user.identifier || '');
  const [study, setStudy] = useState(user.study_program || '');
  const [faculty, setFaculty] = useState(user.faculty || 'Fakultas MIPA');
  const [university, setUniversity] = useState(user.university || 'Universitas Indonesia');
  const [researchInterests, setResearchInterests] = useState(user.research_interests || '');
  const [bio, setBio] = useState(user.bio || '');
  const [academicLinks, setAcademicLinks] = useState(user.academic_links || '');
  const [avatarColor, setAvatarColor] = useState(user.avatar_color || '#2878d7');

  const avatarColors = ['#2878d7', '#0d9488', '#ea580c', '#7c3aed', '#e11d48', '#059669', '#0f172a'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      identifier,
      study_program: study,
      faculty,
      university,
      research_interests: researchInterests,
      bio,
      academic_links: academicLinks,
      avatar_color: avatarColor
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Identitas Civitas Akademika</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Edit Profil Peneliti STEAM
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
        Perbarui identitas akademik, fokus penelitian, dan tautan publikasi ilmiah Anda.
      </p>

      {/* Avatar Color Picker */}
      <div className="auth-field">
        <label>Warna Avatar Peneliti</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
          {avatarColors.map(c => (
            <button
              key={c}
              type="button"
              className={`color-dot-btn ${avatarColor === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setAvatarColor(c)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Nama Lengkap & Gelar</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>NIM / NIDN / NIP</label>
          <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Program Studi</label>
          <input type="text" value={study} onChange={e => setStudy(e.target.value)} required />
        </div>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Fakultas / Departemen</label>
          <input type="text" value={faculty} onChange={e => setFaculty(e.target.value)} />
        </div>
      </div>

      <div className="auth-field">
        <label>Perguruan Tinggi / Universitas</label>
        <input type="text" value={university} onChange={e => setUniversity(e.target.value)} />
      </div>

      <div className="auth-field">
        <label>Fokus Minat Riset (Disiplin STEAM)</label>
        <input
          type="text"
          placeholder="Contoh: Biochar Kitosan, Sensor IoT, Machine Learning"
          value={researchInterests}
          onChange={e => setResearchInterests(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label>Biografi Singkat Peneliti</label>
        <textarea
          rows={2}
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Ringkasan rekam jejak akademik..."
        />
      </div>

      <div className="auth-field">
        <label>Tautan Akademik (Scopus, ORCID, GitHub, LinkedIn)</label>
        <input
          type="text"
          value={academicLinks}
          onChange={e => setAcademicLinks(e.target.value)}
          placeholder="Contoh: GitHub: github.com/username · ORCID: 0000-..."
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Simpan Profil Peneliti
        </button>
      </div>
    </form>
  );
};

/* ==================== 3. CONSULTATION MODAL ==================== */
const ConsultationModalContent: React.FC<{ data?: any; onClose: () => void }> = ({ data, onClose }) => {
  const { projects, currentUser, bookConsultation } = useApp();
  const [projectId, setProjectId] = useState<number>(data?.projectId || projects[0]?.id || 1);
  const [lecturerName, setLecturerName] = useState(data?.lecturer || 'Dr. Rahmat Wijaya, M.Sc.');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Review checkpoint');
  const [mode, setMode] = useState('Online (Google Meet)');
  const [date, setDate] = useState('2026-10-22');
  const [time, setTime] = useState('10:00');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookConsultation({
      project_id: projectId,
      student_name: currentUser?.name || 'Mahasiswa Peneliti',
      lecturer_name: lecturerName,
      topic,
      type,
      mode,
      date,
      time,
      note,
      feedback: null
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Klinik & Review Dosen</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Jadwalkan Sesi Bimbingan Riset
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
        Konsultasikan kemajuan riset, validasi data eksperimen, atau diskusi solusi atas kendala metodologis.
      </p>

      <div className="auth-field">
        <label>Pilih Proyek Riset</label>
        <select value={projectId} onChange={e => setProjectId(Number(e.target.value))}>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              #{p.id} - {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Dosen Pembimbing</label>
          <select value={lecturerName} onChange={e => setLecturerName(e.target.value)}>
            <option value="Dr. Rahmat Wijaya, M.Sc.">Dr. Rahmat Wijaya, M.Sc.</option>
            <option value="Prof. Dr. Ir. Dewi Kartika">Prof. Dr. Ir. Dewi Kartika</option>
            <option value="Prof. Dr. Hartono, M.Si.">Prof. Dr. Hartono, M.Si.</option>
          </select>
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Jenis Bimbingan</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="Review checkpoint">Review Checkpoint Ilmiah</option>
            <option value="Klinik metodologi">Klinik Penanganan Kendala (Blocker)</option>
            <option value="Evaluasi akhir">Evaluasi Akhir & Persiapan Manuskrip</option>
          </select>
        </div>
      </div>

      <div className="auth-field">
        <label>Topik / Agenda Bimbingan Spesifik</label>
        <input
          type="text"
          placeholder="Contoh: Kalibrasi sensor BME280 dan penanganan anomali data"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Metode Konsultasi</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="Online (Google Meet)">Online (Google Meet)</option>
            <option value="Ruang dosen FST">Ruang Dosen</option>
            <option value="Laboratorium Terpadu">Laboratorium Terpadu</option>
          </select>
        </div>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Tanggal</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Waktu (WIB)</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
        </div>
      </div>

      <div className="auth-field">
        <label>Bahan yang Disiapkan / Catatan Khusus</label>
        <textarea
          rows={3}
          placeholder="Tuliskan dokumen, plot grafik, atau manuskrip yang akan dibawa..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Kirim Jadwal Bimbingan &rarr;
        </button>
      </div>
    </form>
  );
};

/* ==================== 4. RESOURCE REQUEST MODAL ==================== */
const ResourceModalContent: React.FC<{ data?: any; onClose: () => void }> = ({ onClose }) => {
  const { projects, currentUser, requestResource } = useApp();
  const [projectId, setProjectId] = useState<number>(projects[0]?.id || 1);
  const [resourceName, setResourceName] = useState('GPU Workstation (NVIDIA RTX 4090)');
  const [dateNeeded, setDateNeeded] = useState('2026-10-24');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestResource({
      project_id: projectId,
      student_name: currentUser?.name || 'Mahasiswa Peneliti',
      resource_name: resourceName,
      date_needed: dateNeeded,
      note,
      feedback: null
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Sarana & Prasarana Kampus</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Ajukan Pemakaian Fasilitas Laboratorium
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
        Dapatkan alokasi waktu pemakaian instrumen presisi dan komputasi sains berdaya tinggi.
      </p>

      <div className="auth-field">
        <label>Untuk Proyek Penelitian</label>
        <select value={projectId} onChange={e => setProjectId(Number(e.target.value))}>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              #{p.id} - {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Peralatan / Fasilitas yang Dibutuhkan</label>
          <select value={resourceName} onChange={e => setResourceName(e.target.value)}>
            <option value="GPU Workstation (NVIDIA RTX 4090)">GPU Workstation (NVIDIA RTX 4090)</option>
            <option value="Printer 3D & Rapid Prototyping Workshop">Printer 3D & Rapid Prototyping Workshop</option>
            <option value="Kit Mikrokontroler & Modul LoRa SX1278">Kit Mikrokontroler & Modul LoRa SX1278</option>
            <option value="Spektrofotometer UV-Vis & FTIR">Spektrofotometer UV-Vis & FTIR</option>
            <option value="Mikroskop Fluoresens & Stereo">Mikroskop Fluoresens & Stereo</option>
          </select>
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Tanggal Pemakaian</label>
          <input type="date" value={dateNeeded} onChange={e => setDateNeeded(e.target.value)} required />
        </div>
      </div>

      <div className="auth-field">
        <label>Tujuan & Rencana Penggunaan Detail</label>
        <textarea
          rows={3}
          placeholder="Jelaskan sampel atau parameter eksperimen yang akan diuji..."
          value={note}
          onChange={e => setNote(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Kirim Permohonan &rarr;
        </button>
      </div>
    </form>
  );
};

/* ==================== 5. APPLY RECRUITMENT MODAL ==================== */
const ApplyModalContent: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const { currentUser, applyRecruitment } = useApp();
  const [role, setRole] = useState('Data Analyst');
  const [study, setStudy] = useState(currentUser?.study_program || 'Sains Data');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyRecruitment(project.id, role, study, message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Kolaborasi Multidisiplin</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Ajukan Diri Bergabung ke Tim Riset
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
        Proyek: <strong>{project.name}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Peran yang Diajukan</label>
          <input
            type="text"
            placeholder="Contoh: Hardware IoT, Data Analyst, dsb"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          />
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Program Studi Anda</label>
          <input
            type="text"
            value={study}
            onChange={e => setStudy(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label>Pernyataan Motivasi & Portofolio Relevan</label>
        <textarea
          rows={4}
          placeholder="Jelaskan keterampilan spesifik yang Anda bawa ke dalam proyek ini..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Kirim Permohonan Kolaborasi
        </button>
      </div>
    </form>
  );
};

/* ==================== 6. ANNOUNCEMENT DETAIL MODAL ==================== */
const AnnouncementDetailContent: React.FC<{ ann: any; onClose: () => void }> = ({ ann, onClose }) => {
  const { toggleSaveAnnouncement } = useApp();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span
          className={`badge badge-${
            ann.category === 'Akademik' ? 'blue' : ann.category === 'Metodologi' ? 'teal' : 'orange'
          }`}
        >
          {ann.category}
        </span>
        {ann.pinned === 1 && <span className="badge badge-purple">📌 Disematkan</span>}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        {ann.title}
      </h2>

      <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
        Diterbitkan oleh: <strong>{ann.author_name}</strong> · Tanggal: {new Date(ann.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      <div style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '24px' }}>
        {ann.body}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => toggleSaveAnnouncement(ann.id)}
        >
          <Bookmark size={13} />
          <span>{ann.is_saved ? 'Tersimpan di Bookmark' : 'Simpan Pengumuman'}</span>
        </button>

        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          <span>Tutup</span>
        </button>
      </div>
    </div>
  );
};

/* ==================== 7. NEW ANNOUNCEMENT MODAL ==================== */
const NewAnnouncementContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, addAnnouncement } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Akademik' | 'Metodologi' | 'Tenggat' | 'Fasilitas' | 'Lomba'>('Akademik');
  const [target, setTarget] = useState<'all' | 'teams' | 'lecturers'>('all');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      author_name: currentUser?.name || 'Biro Riset Akademik',
      title,
      category,
      target,
      body,
      pinned
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Siaran Informasi Kampus</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Buat Pengumuman Riset Baru
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
        Kirimkan pemberitahuan resmi kepada seluruh mahasiswa peneliti dan dosen pembimbing.
      </p>

      <div className="auth-field">
        <label>Judul Pengumuman</label>
        <input
          type="text"
          placeholder="Contoh: Jadwal Pembukaan Pendaftaran Hibah Riset STEAM 2026"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Kategori</label>
          <select value={category} onChange={e => setCategory(e.target.value as any)}>
            <option value="Akademik">Akademik</option>
            <option value="Metodologi">Metodologi & Reproducibility</option>
            <option value="Tenggat">Tenggat Checkpoint</option>
            <option value="Fasilitas">Akses Fasilitas & Lab</option>
            <option value="Lomba">Kompetisi Ilmiah Nasional</option>
          </select>
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Target Audiens</label>
          <select value={target} onChange={e => setTarget(e.target.value as any)}>
            <option value="all">Seluruh Civitas Akademika</option>
            <option value="teams">Khusus Tim Peneliti Mahasiswa</option>
            <option value="lecturers">Khusus Dosen Pembimbing</option>
          </select>
        </div>
      </div>

      <div className="auth-field">
        <label>Isi Siaran Pengumuman</label>
        <textarea
          rows={5}
          placeholder="Tuliskan detail instruksi, tautan petunjuk teknis, atau jadwal resmi..."
          value={body}
          onChange={e => setBody(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={pinned === 1}
            onChange={e => setPinned(e.target.checked ? 1 : 0)}
          />
          <span>Sematkan di bagian atas (Pinned Announcement)</span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Siarkan Pengumuman &rarr;
        </button>
      </div>
    </form>
  );
};

/* ==================== 8. REGISTER USER MODAL ==================== */
const RegisterModalContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { registerUser } = useApp();
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [study, setStudy] = useState('Sains Data');
  const [faculty, setFaculty] = useState('Fakultas MIPA');
  const [university, setUniversity] = useState('Universitas Indonesia');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser({
      name,
      identifier,
      role,
      study_program: study,
      faculty,
      university,
      password
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow">Pendaftaran Civitas Akademika</div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '8px' }}>
        Daftar Akun Peneliti STEAM
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px' }}>
        Buat akun baru untuk mulai mengajukan proyek penelitian atau membimbing tim mahasiswa.
      </p>

      <div className="auth-role-tabs" style={{ marginBottom: '16px' }}>
        <button
          type="button"
          className={role === 'student' ? 'active' : ''}
          onClick={() => setRole('student')}
        >
          Mahasiswa Peneliti
        </button>
        <button
          type="button"
          className={role === 'lecturer' ? 'active' : ''}
          onClick={() => setRole('lecturer')}
        >
          Dosen / Pembimbing
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Nama Lengkap</label>
          <input
            type="text"
            placeholder="Contoh: Rian Pratama, S.Si."
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>{role === 'student' ? 'NIM' : 'NIDN / NIP'}</label>
          <input
            type="text"
            placeholder={role === 'student' ? 'Contoh: 202610255' : 'Contoh: 198205142010...'}
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div className="auth-field" style={{ margin: 0 }}>
          <label>Program Studi</label>
          <select value={study} onChange={e => setStudy(e.target.value)}>
            <option value="Sains Data">Sains Data</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Biologi">Biologi</option>
            <option value="Pendidikan Biologi">Pendidikan Biologi</option>
            <option value="Kimia">Kimia</option>
            <option value="Pendidikan Kimia">Pendidikan Kimia</option>
            <option value="Fisika">Fisika</option>
            <option value="Pendidikan Fisika">Pendidikan Fisika</option>
            <option value="Matematika">Matematika</option>
            <option value="Pendidikan Matematika">Pendidikan Matematika</option>
            <option value="Sains Aktuaria">Sains Aktuaria</option>
            <option value="Bioteknologi">Bioteknologi</option>
          </select>
        </div>

        <div className="auth-field" style={{ margin: 0 }}>
          <label>Perguruan Tinggi</label>
          <input
            type="text"
            value={university}
            onChange={e => setUniversity(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label>Kata Sandi Akun</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary">
          Daftarkan Akun &rarr;
        </button>
      </div>
    </form>
  );
};

/* ==================== 9. PEER-TO-PEER FEEDBACK MODAL ==================== */
const PeerFeedbackModalContent: React.FC<{ data?: any; onClose: () => void }> = ({ data, onClose }) => {
  const { members, currentUser, addPeerFeedback, projects } = useApp();
  const projectId = data?.projectId || projects[0]?.id || 1;
  const projectMembers = members.filter(m => m.project_id === projectId);

  // Exclude current user by default for peer review
  const otherMembers = projectMembers.filter(m => m.name !== currentUser?.name);
  const candidateMembers = otherMembers.length > 0 ? otherMembers : projectMembers;

  const [selectedRevieweeName, setSelectedRevieweeName] = useState<string>(
    data?.revieweeName || candidateMembers[0]?.name || ''
  );

  const selectedMember = projectMembers.find(m => m.name === selectedRevieweeName) || candidateMembers[0];
  const isSelfReview = selectedMember && currentUser && selectedMember.name === currentUser.name;

  // Ratings (1-5)
  const [techRating, setTechRating] = useState<number>(5);
  const [collabRating, setCollabRating] = useState<number>(5);
  const [rigorRating, setRigorRating] = useState<number>(5);
  const [reliabilityRating, setReliabilityRating] = useState<number>(5);

  // Qualitative notes
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  // Selected Badges
  const availableBadges = [
    'Teliti & Presisi',
    'Problem Solver',
    'Kolaborator Hebat',
    'Visualisasi Unggul',
    'Pekerja Keras',
    'Inovatif',
    'Komunikasi Efektif',
    'Riset Lab Teladan',
    'Keahlian Teoretis'
  ];
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Teliti & Presisi', 'Kolaborator Hebat']);

  const strengthSuggestions = [
    'Sangat teliti dalam validasi data dan metodologi eksperimen.',
    'Komunikasi lintas disiplin sangat lancar dan mudah dipahami.',
    'Cepat tanggap memecahkan anomali data dan kendala teknis.',
    'Dokumentasi logbook dan penulisan laporan sangat terstruktur.'
  ];

  const improvementSuggestions = [
    'Dapat menambahkan diagram alir untuk konsep matematis/algoritma.',
    'Bisa meningkatkan kecepatan update logbook harian di workspace.',
    'Tingkatkan keterlibatan aktif dalam sesi bimbingan bersama dosen.'
  ];

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const avgScore = Number(((techRating + collabRating + rigorRating + reliabilityRating) / 4).toFixed(2));

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Sangat Unggul & Teladan';
    if (score >= 4.0) return 'Baik & Memuaskan';
    if (score >= 3.0) return 'Cukup Sesuai Standar';
    return 'Perlu Peningkatan Fokus';
  };

  const getStarLabel = (rating: number) => {
    switch (rating) {
      case 5: return 'Sangat Baik (5/5)';
      case 4: return 'Baik (4/5)';
      case 3: return 'Cukup (3/5)';
      case 2: return 'Kurang (2/5)';
      case 1: return 'Perlu Bimbingan (1/5)';
      default: return `${rating}/5`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || isSelfReview) return;

    addPeerFeedback({
      project_id: projectId,
      reviewer_id: currentUser?.id || null,
      reviewer_name: currentUser?.name || 'Rekan Peneliti',
      reviewer_study: currentUser?.study_program || 'Sains Data',
      reviewer_role: 'Peneliti Anggota',
      reviewee_id: selectedMember.user_id || null,
      reviewee_name: selectedMember.name,
      reviewee_study: selectedMember.study_program,
      reviewee_role: selectedMember.role,
      ratings: {
        technical: techRating,
        collaboration: collabRating,
        scientificRigor: rigorRating,
        reliability: reliabilityRating
      },
      strengths: strengths.trim() || 'Kontribusi rekan sangat membantu kemajuan checkpoint penelitian tim.',
      improvements: improvements.trim() || 'Pertahankan ketelitian dan komunikasi yang sudah berjalan baik.',
      badges: selectedBadges
    });
  };

  // Helper star selector renderer
  const renderStarInput = (val: number, setter: (n: number) => void) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            style={{
              background: 'none',
              border: 'none',
              padding: '3px',
              cursor: 'pointer',
              color: star <= val ? '#f59e0b' : '#cbd5e1',
              transition: 'transform 0.15s ease'
            }}
            title={`${star} dari 5 bintang`}
          >
            <Star size={20} fill={star <= val ? '#f59e0b' : 'none'} />
          </button>
        ))}
      </div>
      <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--navy)' }}>
        {getStarLabel(val)}
      </span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="eyebrow" style={{ color: 'var(--accent-teal)' }}>
        Evaluasi Sejawat Formatif (360° Peer Review)
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>
        Beri Peer Feedback Tim Riset
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '18px' }}>
        Berikan penilaian formatif terstruktur atas kontribusi teknis, ketelitian ilmiah, kolaborasi multidisiplin, dan keandalan rekan tim Anda.
      </p>

      {/* Reviewee Selector */}
      <div className="auth-field">
        <label>Pilih Rekan Tim yang Dinilai</label>
        <select
          value={selectedRevieweeName}
          onChange={e => setSelectedRevieweeName(e.target.value)}
          required
        >
          {projectMembers.map(m => (
            <option key={m.id} value={m.name} disabled={m.name === currentUser?.name}>
              {m.name} — {m.role} ({m.study_program}) {m.name === currentUser?.name ? '(Anda — Tidak dapat menilai diri sendiri)' : ''}
            </option>
          ))}
        </select>
      </div>

      {isSelfReview && (
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '10px 14px', borderRadius: '10px', color: '#9f1239', fontSize: '12px', marginBottom: '14px' }}>
          ⚠️ Evaluasi sejawat dirancang untuk menilai kontribusi rekan tim. Silakan pilih rekan kolaborator lainnya pada daftar di atas.
        </div>
      )}

      {selectedMember && !isSelfReview && (
        <div
          style={{
            background: 'var(--surface-alt)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="user-avatar"
              style={{ backgroundColor: selectedMember.avatar_color || '#2878d7', width: '36px', height: '36px', fontSize: '14px' }}
            >
              {selectedMember.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--navy)' }}>
                {selectedMember.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                {selectedMember.study_program} · {selectedMember.role}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontWeight: 800,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>Skor Evaluasi: {avgScore} / 5.0 ({getScoreLabel(avgScore)})</span>
          </div>
        </div>
      )}

      {/* 4 Structured Dimensions */}
      <div
        style={{
          background: 'white',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
              1. Kontribusi Teknis & Eksekusi Tugas
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Penyelesaian kode, analisis data, instrumentasi laboratorium, atau rancang bangun
            </div>
          </div>
          {renderStarInput(techRating, setTechRating)}
        </div>

        <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
              2. Kolaborasi Multidisiplin & Komunikasi
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Kemampuan berkomunikasi terbuka, mendengarkan, dan menjembatani disiplin ilmu lain
            </div>
          </div>
          {renderStarInput(collabRating, setCollabRating)}
        </div>

        <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
              3. Ketelitian Ilmiah & Problem Solving
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Akurasi data, kepatuhan reproduktibilitas riset, dan inisiatif mengatasi kendala
            </div>
          </div>
          {renderStarInput(rigorRating, setRigorRating)}
        </div>

        <div style={{ borderTop: '1px solid var(--line-light)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
              4. Keandalan & Tanggung Jawab Tim
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Ketepatan waktu checkpoint, kesiapan hadir bimbingan, dan konsistensi kerja tim
            </div>
          </div>
          {renderStarInput(reliabilityRating, setReliabilityRating)}
        </div>
      </div>

      {/* Recognition Badges */}
      <div className="auth-field">
        <label>Sematkan Lencana Apresiasi (Badges) Ilmiah</label>
        <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '0 0 8px 0' }}>
          Pilih satu atau beberapa lencana apresiasi yang mencerminkan etos kerja rekan.
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {availableBadges.map(badge => {
            const isSelected = selectedBadges.includes(badge);
            return (
              <button
                key={badge}
                type="button"
                onClick={() => toggleBadge(badge)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid var(--accent-teal)' : '1px solid var(--line)',
                  background: isSelected ? '#f0fdf4' : 'var(--surface-alt)',
                  color: isSelected ? '#0f766e' : 'var(--ink-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSelected ? '✓ ' : '+ '}
                {badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qualitative Strengths */}
      <div className="auth-field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ margin: 0 }}>💡 Kekuatan & Kontribusi Menonjol Rekan</label>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Deskripsikan kontribusi nyata</span>
        </div>
        <textarea
          rows={3}
          placeholder="Tuliskan kontribusi nyata rekan yang paling berharga bagi kemajuan riset..."
          value={strengths}
          onChange={e => setStrengths(e.target.value)}
          required
        />
        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--muted)', alignSelf: 'center' }}>Saran cepat:</span>
          {strengthSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '12px', background: '#f8fafc' }}
              onClick={() => setStrengths(prev => (prev ? `${prev} ${s}` : s))}
            >
              + {s.slice(0, 38)}...
            </button>
          ))}
        </div>
      </div>

      {/* Constructive Improvements */}
      <div className="auth-field" style={{ marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label style={{ margin: 0 }}>🌱 Saran Pengembangan Ilmiah Konstruktif</label>
          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Rekomendasi pengembangan diri</span>
        </div>
        <textarea
          rows={3}
          placeholder="Berikan masukan positif untuk meningkatkan kualitas riset berikutnya..."
          value={improvements}
          onChange={e => setImprovements(e.target.value)}
          required
        />
        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
          <span style={{ fontSize: '10.5px', color: 'var(--muted)', alignSelf: 'center' }}>Saran cepat:</span>
          {improvementSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '12px', background: '#f8fafc' }}
              onClick={() => setImprovements(prev => (prev ? `${prev} ${s}` : s))}
            >
              + {s.slice(0, 38)}...
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSelfReview}>
          <Send size={13} />
          <span>Kirim Peer Review Ilmiah</span>
        </button>
      </div>
    </form>
  );
};

