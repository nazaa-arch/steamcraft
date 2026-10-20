import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Check,
  Bookmark,
  Calendar,
  Clock,
  MapPin,
  Send,
  Sparkles,
  Star,
  Award,
  ThumbsUp,
  User as UserIcon,
  Shield,
  GraduationCap,
  Briefcase,
  Link as LinkIcon,
  Lock,
  Eye,
  EyeOff,
  Palette,
  FileText,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Hash,
  AtSign,
  Globe,
  Code,
  BookOpen,
  Layers,
  Key,
  Phone,
  Mail,
  Compass,
  FolderGit2,
  Bot,
  ArrowRight
} from 'lucide-react';
import { User, Project, UserRole } from '../../types';

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
      <div className={`modal-box ${activeModal === 'profile' || activeModal === 'quickTour' ? 'modal-box-xl' : ''}`} onClick={e => e.stopPropagation()}>
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
        {activeModal === 'quickTour' && <QuickTourModalContent onClose={closeModal} />}
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
  const { updateProfile, currentUser } = useApp();

  const isSelf = !user || user.id === currentUser?.id;
  const isAdminEditor = currentUser?.role === 'admin';

  // Tabs: 'identity' | 'steam' | 'links' | 'customization'
  const [activeTab, setActiveTab] = useState<'identity' | 'steam' | 'links' | 'customization'>('identity');

  // Form states
  const [name, setName] = useState(user.name || '');
  const [titlePrefix, setTitlePrefix] = useState(user.title_prefix || '');
  const [titleSuffix, setTitleSuffix] = useState(user.title_suffix || '');
  const [identifier, setIdentifier] = useState(user.identifier || '');
  const [role, setRole] = useState<UserRole>(user.role || 'student');
  const [study, setStudy] = useState(user.study_program || '');
  const [faculty, setFaculty] = useState(user.faculty || 'Fakultas MIPA');
  const [university, setUniversity] = useState(user.university || 'Universitas Indonesia');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [officeRoom, setOfficeRoom] = useState(user.office_room || '');

  // STEAM & Research Focus
  const [researchInterests, setResearchInterests] = useState(user.research_interests || '');
  const [bio, setBio] = useState(user.bio || '');

  // 5 STEAM Pillars toggles
  const defaultPillars = user.steam_focus && user.steam_focus.length > 0
    ? user.steam_focus
    : role === 'student'
      ? ['Science', 'Technology']
      : role === 'lecturer'
        ? ['Science', 'Technology', 'Engineering', 'Mathematics']
        : ['Science', 'Technology', 'Engineering', 'Art', 'Mathematics'];

  const [steamFocus, setSteamFocus] = useState<string[]>(defaultPillars);

  // Academic links
  const [academicLinks, setAcademicLinks] = useState(user.academic_links || '');
  const [scholarId, setScholarId] = useState(user.scholar_id || '');
  const [orcidId, setOrcidId] = useState(user.orcid_id || '');
  const [githubUrl, setGithubUrl] = useState(user.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedin_url || '');

  // Avatar & Security
  const [avatarColor, setAvatarColor] = useState(user.avatar_color || '#2878d7');
  const [avatarIcon, setAvatarIcon] = useState(
    user.avatar_icon || (role === 'student' ? '🔬' : role === 'lecturer' ? '👨‍🏫' : '🛠️')
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 12 Curated Academic Colors
  const avatarColors = [
    '#2878d7', // Royal Blue
    '#0d9488', // Deep Teal
    '#059669', // Emerald
    '#16a34a', // Bio Green
    '#ea580c', // Engineering Orange
    '#d97706', // Amber Gold
    '#e11d48', // Rose Crimson
    '#7c3aed', // Math Violet
    '#4f46e5', // Tech Indigo
    '#0891b2', // Cyber Cyan
    '#0f172a', // Navy Slate
    '#475569'  // Steel Slate
  ];

  // 10 STEAM Icons
  const avatarIcons = ['🔬', '💻', '⚙️', '🎨', '📐', '🧬', '🚀', '💡', '🛡️', '👨‍🏫'];

  // Fast Tag Suggestions
  const suggestedTags = [
    'Machine Learning',
    'IoT Telemetri',
    'Sensor Cerdas',
    'Biochar Kitosan',
    'Computer Vision',
    'Deep Learning',
    'Robotika Kursi Roda',
    'Etnomatematika',
    'Biomonitoring Air',
    'Simulasi Monte Carlo',
    'Teknik Biomedis',
    'Edge AI'
  ];

  // STEAM Pillars definitions
  const steamPillars = [
    { key: 'Science', label: '🔬 Science (Sains)', code: 's' },
    { key: 'Technology', label: '💻 Technology (Teknologi)', code: 't' },
    { key: 'Engineering', label: '⚙️ Engineering (Rekayasa)', code: 'e' },
    { key: 'Art', label: '🎨 Art (Desain & Humaniora)', code: 'a' },
    { key: 'Mathematics', label: '📐 Mathematics (Matematika)', code: 'm' }
  ];

  const togglePillar = (pillarKey: string) => {
    if (steamFocus.includes(pillarKey)) {
      if (steamFocus.length > 1) {
        setSteamFocus(steamFocus.filter(p => p !== pillarKey));
      }
    } else {
      setSteamFocus([...steamFocus, pillarKey]);
    }
  };

  const toggleTagChip = (tag: string) => {
    const currentTags = researchInterests
      ? researchInterests.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    if (currentTags.some(t => t.toLowerCase() === tag.toLowerCase())) {
      const filtered = currentTags.filter(t => t.toLowerCase() !== tag.toLowerCase());
      setResearchInterests(filtered.join(', '));
    } else {
      const updated = [...currentTags, tag];
      setResearchInterests(updated.join(', '));
    }
  };

  // Profile completeness percentage
  const calculateCompleteness = () => {
    let score = 0;
    if (name.trim()) score += 20;
    if (identifier.trim()) score += 15;
    if (study.trim()) score += 15;
    if (faculty.trim()) score += 10;
    if (researchInterests.trim()) score += 15;
    if (bio.trim()) score += 10;
    if (academicLinks.trim() || githubUrl.trim() || linkedinUrl.trim() || scholarId.trim()) score += 15;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  // Preset quick-fill based on role
  const loadPresetDemoData = () => {
    if (role === 'student') {
      setName('Budi Santoso');
      setTitlePrefix('');
      setTitleSuffix('S.Stat (Kandidat)');
      setIdentifier('202610101');
      setStudy('Sains Data');
      setFaculty('Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)');
      setUniversity('Universitas Indonesia');
      setEmail('budi.santoso@ui.ac.id');
      setPhone('0812-3456-7890');
      setResearchInterests('Machine Learning, IoT Telemetri, Prediksi Cuaca Mikro, Deep Learning');
      setBio('Lead data scientist tim proyek sensor cuaca pertanian presisi berbasis transmisi nirkabel LoRa.');
      setSteamFocus(['Science', 'Technology', 'Mathematics']);
      setGithubUrl('https://github.com/budisantoso');
      setLinkedinUrl('https://linkedin.com/in/budisantoso-sd');
      setAcademicLinks('GitHub: github.com/budisantoso · LinkedIn: /in/budisantoso-sd');
      setAvatarColor('#2878d7');
      setAvatarIcon('🔬');
    } else if (role === 'lecturer') {
      setName('Dr. Rahmat Wijaya, M.Sc.');
      setTitlePrefix('Dr.');
      setTitleSuffix('M.Sc.');
      setIdentifier('198504122010121002');
      setStudy('Fakultas Sains & Teknologi');
      setFaculty('Departemen Fisika & Instrumentasi Komputasi');
      setUniversity('Institut Teknologi Bandung');
      setEmail('rahmat.wijaya@itb.ac.id');
      setPhone('0811-9876-5432');
      setOfficeRoom('Lab Sensor Cerdas Lt. 3, Gedung Riset FMIPA');
      setResearchInterests('Instrumentasi Sensor Cerdas, Pemodelan Sains Komputasi, Kalibrasi Empiris');
      setBio('Dosen pembimbing riset dan penilai standarisasi rubrik ilmiah 4 pilar STEAM tingkat nasional.');
      setSteamFocus(['Science', 'Technology', 'Engineering', 'Mathematics']);
      setScholarId('56192841022');
      setOrcidId('0000-0002-1829-9281');
      setAcademicLinks('Scopus ID: 56192841022 · ORCID: 0000-0002-1829-9281');
      setAvatarColor('#0d9488');
      setAvatarIcon('👨‍🏫');
    } else {
      setName('Administrator Sistem (Lead Dev & Architect)');
      setTitlePrefix('');
      setTitleSuffix('Lead Dev');
      setIdentifier('ADM-2026-DEV01');
      setStudy('Pusat Riset & Rekayasa Sistem');
      setFaculty('Direktorat Sistem Informasi & Laboratorium Terpadu');
      setUniversity('Universitas Indonesia');
      setEmail('admin@steamcraft.ac.id');
      setPhone('0813-8888-9999');
      setOfficeRoom('Pusat Komputasi Data & Server Lt. 2');
      setResearchInterests('System Architecture, Cloud Infrastructure, AI Pipeline & Data Science, Reproducibility');
      setBio('Akun administrator utama platform STEAM-Craft untuk monitoring telemetri riset, tata kelola akses, audit repositori, dan kontrol mode sistem.');
      setSteamFocus(['Science', 'Technology', 'Engineering', 'Art', 'Mathematics']);
      setGithubUrl('https://github.com/steamcraft-admin');
      setAcademicLinks('GitHub: github.com/steamcraft-admin · Docs: steamcraft.online/docs');
      setAvatarColor('#0f172a');
      setAvatarIcon('🛠️');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi password baru tidak cocok. Harap periksa kembali.');
      setActiveTab('customization');
      return;
    }

    // Build unified academic links
    const linksList: string[] = [];
    if (scholarId) linksList.push(`Scopus/Scholar: ${scholarId}`);
    if (orcidId) linksList.push(`ORCID: ${orcidId}`);
    if (githubUrl) linksList.push(`GitHub: ${githubUrl}`);
    if (linkedinUrl) linksList.push(`LinkedIn: ${linkedinUrl}`);
    if (academicLinks && !scholarId && !orcidId && !githubUrl && !linkedinUrl) {
      linksList.push(academicLinks);
    }
    const finalLinks = linksList.length > 0 ? linksList.join(' · ') : academicLinks;

    const payload: Partial<User> = {
      name: name.trim(),
      title_prefix: titlePrefix.trim(),
      title_suffix: titleSuffix.trim(),
      identifier: identifier.trim(),
      role: role,
      study_program: study.trim(),
      faculty: faculty.trim(),
      university: university.trim(),
      email: email.trim(),
      phone: phone.trim(),
      office_room: officeRoom.trim(),
      research_interests: researchInterests.trim(),
      bio: bio.trim(),
      steam_focus: steamFocus,
      academic_links: finalLinks,
      scholar_id: scholarId.trim(),
      orcid_id: orcidId.trim(),
      github_url: githubUrl.trim(),
      linkedin_url: linkedinUrl.trim(),
      avatar_color: avatarColor,
      avatar_icon: avatarIcon,
      ...(newPassword ? { password: newPassword } : {})
    };

    updateProfile(payload, user.id);
  };

  // Formatted displayed name
  const formattedDisplayName = [titlePrefix, name, titleSuffix].filter(Boolean).join(' ') || 'Nama Peneliti';

  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: '82vh', overflowY: 'auto', paddingRight: '4px' }}>
      {/* Header with Role Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--primary)' }} />
            <span>
              {role === 'student'
                ? 'Profil Peneliti STEAM'
                : role === 'lecturer'
                  ? 'Identitas Kepakaran Dosen'
                  : 'Konsol Identitas Administrator'}
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--navy)', margin: '2px 0 4px 0' }}>
            {role === 'student'
              ? 'Edit Profil Mahasiswa Peneliti'
              : role === 'lecturer'
                ? 'Edit Profil Dosen Pembimbing'
                : 'Edit Profil Administrator Sistem'}
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
            {role === 'student'
              ? 'Kelola rekam jejak riset, pilar multidisiplin STEAM, dan repositori karya ilmiah Anda.'
              : role === 'lecturer'
                ? 'Perbarui data kepakaran, laboratorium riset bimbingan, dan identitas publikasi ilmiah.'
                : 'Konfigurasi identitas arsitek sistem, unit kerja direktorat TI, dan otoritas audit platform.'}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={loadPresetDemoData}
          style={{ fontSize: '11px', padding: '5px 10px', color: 'var(--primary)', borderColor: 'var(--line)' }}
          title="Otomatis mengisi format riset standar berdasarkan peran"
        >
          <RefreshCw size={12} />
          <span>Format Standar Demo</span>
        </button>
      </div>

      {/* Admin Warning Banner if editing another user */}
      {isAdminEditor && !isSelf && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#92400e'
          }}
        >
          <Shield size={16} style={{ color: '#d97706', flexShrink: 0 }} />
          <div>
            <strong>Mode Konsol Administrator:</strong> Anda sedang menyunting data akun pengguna{' '}
            <span style={{ textDecoration: 'underline' }}>{user.name}</span> (@{user.username}) dengan ID #{user.id}.
          </div>
        </div>
      )}

      {/* Error message if any */}
      {errorMsg && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#b91c1c'
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ==================== 1. LIVE RESEARCHER PASSPORT PREVIEW ==================== */}
      <div className="researcher-passport-card">
        <div className="passport-watermark">
          STEAM-CRAFT ID: SC-2026-{identifier || 'DEV01'}
        </div>

        <div className="passport-header">
          <div className="passport-brand">
            <Layers size={14} />
            <span>STEAM-Craft Researcher Passport</span>
          </div>
          <div className={`passport-role-badge ${role}`}>
            {role === 'student' && <GraduationCap size={12} />}
            {role === 'lecturer' && <Briefcase size={12} />}
            {role === 'admin' && <Shield size={12} />}
            <span>
              {role === 'student'
                ? 'Mahasiswa Peneliti'
                : role === 'lecturer'
                  ? 'Dosen Pembimbing'
                  : 'Lead Dev & Admin'}
            </span>
          </div>
        </div>

        <div className="passport-body">
          <div className="passport-avatar-wrap">
            <div className="passport-avatar" style={{ backgroundColor: avatarColor }}>
              {name ? name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="passport-avatar-icon" title="Ikon Disiplin STEAM">
              {avatarIcon}
            </div>
          </div>

          <div className="passport-details">
            <h3 className="passport-name">
              <span>{formattedDisplayName}</span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: '#34d399',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '1px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(52, 211, 153, 0.3)'
                }}
              >
                <CheckCircle2 size={10} />
                Terverifikasi Kampus
              </span>
            </h3>

            <div className="passport-id-pill">
              {role === 'student' ? 'NIM' : role === 'lecturer' ? 'NIDN/NIP' : 'ADM ID'}:{' '}
              <strong style={{ color: '#38bdf8' }}>{identifier || 'Belum diisi'}</strong> · {study || 'Program Studi STEAM'}
            </div>

            <div className="passport-meta">
              🏛️ {faculty || 'Fakultas Riset'} — {university || 'Universitas'}
              {officeRoom && <span> · 📍 {officeRoom}</span>}
            </div>

            {bio && (
              <div style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic', margin: '4px 0 6px 0', maxWidth: '620px' }}>
                "{bio}"
              </div>
            )}

            {/* Active STEAM Pillars & Research tags preview */}
            <div className="passport-steam-tags">
              {steamFocus.map(p => (
                <span key={p} className="passport-tag highlight">
                  ★ {p}
                </span>
              ))}
              {researchInterests
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
                .slice(0, 3)
                .map((t, idx) => (
                  <span key={idx} className="passport-tag">
                    {t}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness Bar */}
      <div className="profile-completion-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          <span>Kelengkapan Profil Akademik:</span>
          <span style={{ color: completeness >= 80 ? '#16a34a' : 'var(--primary)' }}>{completeness}%</span>
        </div>
        <div className="profile-completion-bar-track">
          <div className="profile-completion-bar-fill" style={{ width: `${completeness}%` }} />
        </div>
      </div>

      {/* ==================== 2. TAB NAVIGATION ==================== */}
      <div className="profile-nav-tabs">
        <button
          type="button"
          className={`profile-nav-tab ${activeTab === 'identity' ? 'active' : ''}`}
          onClick={() => setActiveTab('identity')}
        >
          <UserIcon size={14} />
          <span>1. Identitas & Akademik</span>
        </button>

        <button
          type="button"
          className={`profile-nav-tab ${activeTab === 'steam' ? 'active' : ''}`}
          onClick={() => setActiveTab('steam')}
        >
          <Layers size={14} />
          <span>2. Fokus Riset STEAM</span>
        </button>

        <button
          type="button"
          className={`profile-nav-tab ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => setActiveTab('links')}
        >
          <LinkIcon size={14} />
          <span>3. Publikasi & Tautan</span>
        </button>

        <button
          type="button"
          className={`profile-nav-tab ${activeTab === 'customization' ? 'active' : ''}`}
          onClick={() => setActiveTab('customization')}
        >
          <Palette size={14} />
          <span>4. Kustomisasi & Sandi</span>
        </button>
      </div>

      {/* ==================== TAB 1: IDENTITAS & AKADEMIK ==================== */}
      {activeTab === 'identity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Admin Role Selector (Only for Admin editing) */}
          {isAdminEditor && (
            <div className="auth-field" style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid var(--line)' }}>
              <label style={{ color: '#0f172a', fontWeight: 800 }}>Otoritas Peran Sistem (Hak Akses Akun)</label>
              <select value={role} onChange={e => setRole(e.target.value as UserRole)} style={{ marginTop: '4px' }}>
                <option value="student">🎓 Mahasiswa Peneliti (Student)</option>
                <option value="lecturer">👨‍🏫 Dosen Pembimbing & Reviewer Rubrik (Lecturer)</option>
                <option value="admin">🛠️ Administrator Sistem & Lead Dev (Admin)</option>
              </select>
            </div>
          )}

          {/* Name & Titles */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px', gap: '10px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label>Gelar Depan</label>
              <input
                type="text"
                placeholder="Dr. / Prof."
                value={titlePrefix}
                onChange={e => setTitlePrefix(e.target.value)}
              />
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>Nama Lengkap *</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>Gelar Belakang</label>
              <input
                type="text"
                placeholder="M.Sc. / Ph.D."
                value={titleSuffix}
                onChange={e => setTitleSuffix(e.target.value)}
              />
            </div>
          </div>

          {/* Identifier & Program Studi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label>
                {role === 'student'
                  ? 'Nomor Induk Mahasiswa (NIM) *'
                  : role === 'lecturer'
                    ? 'NIDN / NIP Dosen *'
                    : 'Kode Identifikasi Petugas (ADM ID) *'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={role === 'student' ? 'Contoh: 202610101' : role === 'lecturer' ? 'Contoh: 198504122010121002' : 'ADM-2026-DEV01'}
                required
              />
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>Program Studi / Unit Keilmuan *</label>
              <input
                type="text"
                value={study}
                onChange={e => setStudy(e.target.value)}
                placeholder="Contoh: Sains Data, Bioteknologi, Fisika"
                required
              />
            </div>
          </div>

          {/* Fakultas & Universitas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label>Fakultas / Departemen</label>
              <input
                type="text"
                value={faculty}
                onChange={e => setFaculty(e.target.value)}
                placeholder="Contoh: FMIPA, Fasilkom, STEI"
              />
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>Perguruan Tinggi / Kampus</label>
              <input
                type="text"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                placeholder="Contoh: Universitas Indonesia, ITB, UGM"
              />
            </div>
          </div>

          {/* Kontak Email & Telepon */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label>Email Resmi Kampus</label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>No. WhatsApp / Telepon</label>
              <div style={{ position: 'relative' }}>
                <Phone size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>
          </div>

          {/* Ruang Kantor / Lokasi Riset (Khusus Dosen / Admin) */}
          {(role === 'lecturer' || role === 'admin') && (
            <div className="auth-field" style={{ margin: 0 }}>
              <label>Lokasi Ruang Kantor / Laboratorium Riset Bimbingan</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={officeRoom}
                  onChange={e => setOfficeRoom(e.target.value)}
                  placeholder="Contoh: Gedung Lab Terpadu Lt. 3, Ruang Sensor Cerdas"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: FOKUS RISET & STEAM ==================== */}
      {activeTab === 'steam' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Interactive STEAM Pillars Selector */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
              Pilar STEAM yang Ditekuni (Pilih Minimal 1 Disiplin)
            </label>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 8px 0' }}>
              Menentukan pemetaan keterpaduan multidisiplin dalam portofolio akademik dan pencocokan rekan tim.
            </p>

            <div className="steam-pillar-btn-grid">
              {steamPillars.map(p => {
                const isActive = steamFocus.includes(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    className={`steam-pillar-toggle ${isActive ? `active ${p.code}` : ''}`}
                    onClick={() => togglePillar(p.key)}
                  >
                    <CheckCircle2 size={14} style={{ opacity: isActive ? 1 : 0.2 }} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Research Interests with Quick Chips */}
          <div className="auth-field" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 800, color: 'var(--navy)' }}>Topik Minat Riset & Keahlian Ilmiah</label>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Pisahkan dengan koma</span>
            </div>
            <input
              type="text"
              value={researchInterests}
              onChange={e => setResearchInterests(e.target.value)}
              placeholder="Contoh: Biochar Kitosan, Sensor IoT, Machine Learning, Computer Vision"
            />

            {/* Quick Suggestion Chips */}
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                💡 Rekomendasi Kata Kunci Riset Populer (Klik untuk tambah/hapus):
              </span>
              <div className="tag-chips-wrapper">
                {suggestedTags.map(tag => {
                  const isAdded = researchInterests
                    .split(',')
                    .map(t => t.trim().toLowerCase())
                    .includes(tag.toLowerCase());
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-suggestion-chip ${isAdded ? 'added' : ''}`}
                      onClick={() => toggleTagChip(tag)}
                    >
                      <span>{isAdded ? '✓' : '+'}</span>
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Academic Bio */}
          <div className="auth-field" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: 800, color: 'var(--navy)' }}>Biografi Singkat Riset</label>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{bio.length} karakter</span>
            </div>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Deskripsikan rekam jejak akademik, peran dalam penelitian multidisiplin, dan fokus kontribusi ilmiah Anda..."
              style={{
                width: '100%',
                minHeight: '100px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PUBLIKASI & TAUTAN AKADEMIK ==================== */}
      {activeTab === 'links' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0 }}>
            Tautkan akun profil ilmiah Anda untuk mendukung audit <strong>Reproducibility</strong> dan validasi rekam jejak publikasi.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label>Scopus Author ID / SINTA ID</label>
              <div style={{ position: 'relative' }}>
                <BookOpen size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={scholarId}
                  onChange={e => setScholarId(e.target.value)}
                  placeholder="Contoh: 56192841022 / SINTA: 219084"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>ORCID iD</label>
              <div style={{ position: 'relative' }}>
                <Globe size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={orcidId}
                  onChange={e => setOrcidId(e.target.value)}
                  placeholder="0000-0002-1829-9281"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-field" style={{ margin: 0 }}>
              <label>URL Repositori GitHub</label>
              <div style={{ position: 'relative' }}>
                <Code size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            <div className="auth-field" style={{ margin: 0 }}>
              <label>URL Profil LinkedIn</label>
              <div style={{ position: 'relative' }}>
                <ExternalLink size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>
          </div>

          <div className="auth-field" style={{ margin: 0 }}>
            <label>Tautan Akademik Tambahan (Google Scholar, ResearchGate, Portofolio Web)</label>
            <input
              type="text"
              value={academicLinks}
              onChange={e => setAcademicLinks(e.target.value)}
              placeholder="Contoh: ResearchGate: /profile/budi · Blog: budisantoso.dev"
            />
          </div>
        </div>
      )}

      {/* ==================== TAB 4: KUSTOMISASI & KEAMANAN ==================== */}
      {activeTab === 'customization' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Avatar Color Picker */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
              Palet Warna Avatar Peneliti
            </label>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 8px 0' }}>
              Pilih warna aksen khas yang merepresentasikan identitas riset Anda di seluruh dashboard dan kartu proyek.
            </p>
            <div className="color-swatch-grid">
              {avatarColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch-btn ${avatarColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAvatarColor(color)}
                  title={`Pilih warna ${color}`}
                >
                  {avatarColor === color && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* STEAM Icon Picker */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)', display: 'block', marginBottom: '4px' }}>
              Ikon Disiplin Utama Peneliti
            </label>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 8px 0' }}>
              Lencana simbolik yang muncul pada sudut avatar digital Anda.
            </p>
            <div className="icon-selector-grid">
              {avatarIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-selector-btn ${avatarIcon === icon ? 'active' : ''}`}
                  onClick={() => setAvatarIcon(icon)}
                  title={`Gunakan lencana ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Change Password Section */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--navy)' }}>
                Perbarui Kata Sandi / PIN Akun (Opsional)
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPassword(!showPassword)}
                style={{ fontSize: '11px', padding: '2px 8px' }}
              >
                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="auth-field" style={{ margin: 0 }}>
                <label>Kata Sandi Baru</label>
                <div style={{ position: 'relative' }}>
                  <Key size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Kosongkan jika tidak diubah"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ paddingLeft: '34px' }}
                  />
                </div>
              </div>

              <div className="auth-field" style={{ margin: 0 }}>
                <label>Konfirmasi Sandi Baru</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi baru"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ paddingLeft: '34px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. FOOTER ACTIONS ==================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
          paddingTop: '16px',
          marginTop: '20px'
        }}
      >
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Batal
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={15} />
            <span>Simpan Profil Peneliti</span>
          </button>
        </div>
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

/* ==================== 10. QUICK TOUR / ALUR RISET MODAL CONTENT ==================== */
const QuickTourModalContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { setCurrentPage, setSelectedProjectId, showToast } = useApp();
  const [slide, setSlide] = useState(1);

  const totalSlides = 5;

  const tourSlides = [
    {
      step: 1,
      tag: 'Pengenalan Platform',
      title: 'Selamat Datang di Ekosistem Riset STEAM-Craft',
      subtitle: 'Platform riset terintegrasi civitas akademika untuk kolaborasi 5 pilar (Science, Technology, Engineering, Art, Mathematics).',
      icon: Sparkles,
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            STEAM-Craft memfasilitasi mahasiswa dan dosen untuk merancang proyek ilmiah, mengumpulkan bukti eksperimen laboratorium, melakukan simulasi terkontrol, dan menyusun laporan penelitian yang siap diakreditasi.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '8px' }}>
            <div style={{ background: '#eff6ff', padding: '10px 12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <strong style={{ fontSize: '12px', color: '#1d4ed8' }}>🔬 Science</strong>
              <div style={{ fontSize: '11px', color: '#1e40af' }}>Hipotesis & Observasi</div>
            </div>
            <div style={{ background: '#f0fdfa', padding: '10px 12px', borderRadius: '10px', border: '1px solid #99f6e4' }}>
              <strong style={{ fontSize: '12px', color: '#0f766e' }}>💻 Technology</strong>
              <div style={{ fontSize: '11px', color: '#115e59' }}>Algoritma & Komputasi</div>
            </div>
            <div style={{ background: '#fff7ed', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fed7aa' }}>
              <strong style={{ fontSize: '12px', color: '#c2410c' }}>⚙️ Engineering</strong>
              <div style={{ fontSize: '11px', color: '#9a3412' }}>Rekayasa & Purwarupa</div>
            </div>
            <div style={{ background: '#fff1f2', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fecdd3' }}>
              <strong style={{ fontSize: '12px', color: '#be123c' }}>🎨 Art</strong>
              <div style={{ fontSize: '11px', color: '#9f1239' }}>Estetika & Desain UI</div>
            </div>
            <div style={{ background: '#f5f3ff', padding: '10px 12px', borderRadius: '10px', border: '1px solid #ddd6fe' }}>
              <strong style={{ fontSize: '12px', color: '#6d28d9' }}>📐 Mathematics</strong>
              <div style={{ fontSize: '11px', color: '#5b21b6' }}>Statistik & Model</div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 2,
      tag: 'Alur 1: Inisiasi Riset',
      title: 'Katalog Proyek & Perekrutan Terbuka (Open Recruitment)',
      subtitle: 'Temukan proyek riset yang sedang berlangsung atau rekrut anggota tim lintas program studi.',
      icon: Compass,
      iconColor: '#0d9488',
      iconBg: '#f0fdfa',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            Kolaborasi ilmiah modern membutuhkan sinergi keahlian. Di STEAM-Craft, Anda dapat:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--surface-alt)', padding: '12px', borderRadius: '10px', border: '1px solid var(--line)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0d9488', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>1</div>
              <div>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>Jelajahi Katalog Proyek</strong>
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: '2px 0 0 0' }}>Telusuri proyek berbasis Sains Data, Internet of Things, atau Aktuaria yang dibimbing oleh dosen-dosen terkemuka.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'var(--surface-alt)', padding: '12px', borderRadius: '10px', border: '1px solid var(--line)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>2</div>
              <div>
                <strong style={{ fontSize: '12.5px', color: 'var(--navy)' }}>Daftar di Open Recruitment Hub</strong>
                <p style={{ fontSize: '11.5px', color: 'var(--muted)', margin: '2px 0 0 0' }}>Ajukan diri sebagai data engineer, desainer UI, atau hardware specialist pada tim riset yang membuka lowongan kolaborasi.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 3,
      tag: 'Alur 2: Eksekusi Ilmiah',
      title: 'Ruang Kerja Riset: Checkpoint, Logbook & AI Asisten',
      subtitle: 'Pusat operasional eksperimen harian, pencatatan bukti empiris, dan asistensi kecerdasan buatan.',
      icon: FolderGit2,
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            Ruang Kerja (Workspace) dirancang dengan standar reproduktibilitas penelitian:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#2563eb' }}>✓ 5 Tahapan Checkpoint</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Alur checkpoint terstruktur dari perumusan hipotesis hingga rilis artefak.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#0d9488' }}>📖 Jurnal Logbook Lab</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Catat anomali ukur, parameter sensor, dan lampiran berkas data empiris.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#7c3aed' }}>🤖 Asisten Ilmiah STEAM</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>AI copilot untuk validasi rumus statistik, pembagian dataset, dan uji RMSE.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#ea580c' }}>📦 Versi & Artefak Build</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Catat commit repositori GitHub dan file luaran riset yang teruji.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 4,
      tag: 'Alur 3: Dukungan Kampus',
      title: 'Klinik Pembimbing & Pengajuan Fasilitas Laboratorium',
      subtitle: 'Dukungan intervensi dosen saat menemui kendala metodologis serta akses sarana uji kampus.',
      icon: Calendar,
      iconColor: '#e11d48',
      iconBg: '#fff1f2',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            Penelitian tidak boleh mandek karena kendala teknis atau kekurangan alat:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#fff1f2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecdd3' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <strong style={{ fontSize: '12.5px', color: '#9f1239' }}>Tombol "Laporkan Kendala" (Blocker Alert)</strong>
                <p style={{ fontSize: '11.5px', color: '#881337', margin: '2px 0 0 0' }}>Tandai kendala reagen, galat alat, atau bias statistik agar dosen segera menjadwalkan intervensi.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#f0fdf4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '20px' }}>🏛️</span>
              <div>
                <strong style={{ fontSize: '12.5px', color: '#166534' }}>Peminjaman Fasilitas & Sensor Laboratorium</strong>
                <p style={{ fontSize: '11.5px', color: '#14532d', margin: '2px 0 0 0' }}>Ajukan peminjaman modul mikrokontroler, server komputasi awan, atau ruang uji kampus secara resmi.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 5,
      tag: 'Alur 4: Luaran Akademik',
      title: 'Radar Segi Lima STEAM, Ulasan Sejawat & Sertifikasi',
      subtitle: 'Pengakuan kompetensi multidisiplin, ulasan 360°, dan ekspor paket kelayakan ilmiah terverifikasi.',
      icon: Award,
      iconColor: '#7c3aed',
      iconBg: '#f5f3ff',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            Hasil akhir penelitian Anda diakreditasi secara formal dengan standar kompetensi teruji:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#7c3aed' }}>📐 Radar Segi Lima STEAM</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Pemetaan visual poligon segi lima S-T-E-A-M terstandarisasi.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#2563eb' }}>⭐ Ulasan Sejawat 360°</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Evaluasi formatif antar anggota tim lengkap dengan lencana penghargaan.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#0d9488' }}>📜 Sertifikat Kelayakan Riset</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Sertifikat resmi cetak A4 dengan segel emas dan tanda tangan dosen.</p>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '12px', color: '#ea580c' }}>💾 Ekspor Paket Reproducibility</strong>
              <p style={{ fontSize: '11px', color: 'var(--muted)', margin: '4px 0 0 0' }}>Unduh berkas JSON berisi metadata riset lengkap dan hash verifikasi SHA-256.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = tourSlides[slide - 1];
  const IconComponent = current.icon;

  const handleFinish = () => {
    showToast('Tur selesai! Selamat bereksplorasi di STEAM-Craft.');
    onClose();
  };

  return (
    <div style={{ padding: '8px 4px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-blue" style={{ fontSize: '11px', fontWeight: 800 }}>
            Langkah {slide} dari {totalSlides}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
            {current.tag}
          </span>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Lewati Tur &times;
        </button>
      </div>

      {/* Step Pills Navigation */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {tourSlides.map(s => (
          <button
            key={s.step}
            type="button"
            onClick={() => setSlide(s.step)}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '999px',
              background: s.step === slide ? 'var(--primary)' : s.step < slide ? '#93c5fd' : '#e2e8f0',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease'
            }}
            title={`Langkah ${s.step}: ${s.tag}`}
          />
        ))}
      </div>

      {/* Slide Content Card */}
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: current.iconBg, color: current.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconComponent size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--navy)', margin: '0 0 4px 0', lineHeight: 1.3 }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
              {current.subtitle}
            </p>
          </div>
        </div>

        {current.content}
      </div>

      {/* Slide Navigation Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={slide === 1}
          onClick={() => setSlide(prev => Math.max(1, prev - 1))}
          style={{ opacity: slide === 1 ? 0.4 : 1 }}
        >
          &larr; Sebelumnya
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {slide < totalSlides ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setSlide(prev => Math.min(totalSlides, prev + 1))}
              style={{ padding: '8px 18px' }}
            >
              <span>Lanjut</span>
              &rarr;
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedProjectId(1);
                  setCurrentPage('workspace');
                  handleFinish();
                }}
              >
                <span>Buka Ruang Kerja #1</span>
                <ArrowRight size={13} />
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleFinish}
              >
                <span>Mulai Eksplorasi 🚀</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

