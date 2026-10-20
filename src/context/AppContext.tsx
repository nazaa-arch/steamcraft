import React, { createContext, useContext, useState, useEffect } from 'react';
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
  Rubric,
  AppMode,
  PageName,
  PeerFeedback
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  generateInitialCheckpoints,
  INITIAL_JOURNALS,
  INITIAL_VERSIONS,
  INITIAL_MEMBERS,
  INITIAL_CONSULTATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_RESOURCE_REQUESTS,
  INITIAL_APPLICATIONS,
  INITIAL_RUBRICS,
  INITIAL_PEER_FEEDBACKS,
  DEFAULT_TEMPLATES
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  appMode: AppMode;
  currentPage: PageName;
  selectedProjectId: number;
  projects: Project[];
  checkpoints: Checkpoint[];
  journals: Journal[];
  versions: Version[];
  members: ProjectMember[];
  applications: RecruitmentApplication[];
  consultations: Consultation[];
  announcements: Announcement[];
  resourceRequests: ResourceRequest[];
  rubrics: Rubric[];
  peerFeedbacks: PeerFeedback[];
  users: User[];
  activeModal: string | null;
  modalData: any;
  toastMessage: string | null;

  // Actions
  setCurrentPage: (page: PageName) => void;
  setSelectedProjectId: (id: number) => void;
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  showToast: (msg: string) => void;
  setAppMode: (mode: AppMode) => void;

  // Auth
  login: (identifierOrUsername: string, password?: string) => boolean;
  switchDemoUser: (roleOrUsername: string) => void;
  logout: () => void;
  registerUser: (data: Partial<User>) => boolean;
  updateProfile: (data: Partial<User>, targetUserId?: number) => void;

  // Projects & Workspace
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: number, data: Partial<Project>) => void;
  toggleCheckpoint: (checkpointId: number) => void;
  addCheckpoint: (projectId: number, title: string, description: string) => void;
  toggleBlocker: (projectId: number, reason: string) => void;
  addJournal: (projectId: number, tag: string, content: string, fileName?: string) => void;
  addVersion: (projectId: number, note: string, artifactUrl?: string, fileName?: string) => void;

  // Collaborations
  applyRecruitment: (projectId: number, applicantRole: string, applicantStudy: string, message: string) => void;
  updateApplicationStatus: (appId: number, status: 'Menunggu' | 'Diterima' | 'Ditolak') => void;

  // Consultations & Lab
  bookConsultation: (data: Omit<Consultation, 'id' | 'created_at' | 'status'>) => void;
  updateConsultation: (id: number, data: Partial<Consultation>) => void;
  markConsultationsRead: () => void;
  requestResource: (data: Omit<ResourceRequest, 'id' | 'created_at' | 'status'>) => void;
  updateResourceStatus: (id: number, status: 'Menunggu' | 'Disetujui' | 'Ditolak', feedback?: string) => void;

  // Rubrics & Assessments
  saveRubric: (
    projectId: number,
    scores: { completeness: number; evidence: number; contribution: number; reproducibility: number },
    feedback: string
  ) => void;

  // Peer-to-Peer Feedback
  addPeerFeedback: (data: Omit<PeerFeedback, 'id' | 'created_at' | 'overall_score'>) => void;

  // Announcements
  markAnnouncementRead: (id: number) => void;
  markAllAnnouncementsRead: () => void;
  toggleSaveAnnouncement: (id: number) => void;
  addAnnouncement: (data: Omit<Announcement, 'id' | 'created_at'>) => void;

  // System Administration
  resetAllData: () => void;
  exportDataJson: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'steamcraft_current_user',
  APP_MODE: 'steamcraft_app_mode',
  PROJECTS: 'steamcraft_projects',
  CHECKPOINTS: 'steamcraft_checkpoints',
  JOURNALS: 'steamcraft_journals',
  VERSIONS: 'steamcraft_versions',
  MEMBERS: 'steamcraft_members',
  APPLICATIONS: 'steamcraft_applications',
  CONSULTATIONS: 'steamcraft_consultations',
  ANNOUNCEMENTS: 'steamcraft_announcements',
  RESOURCES: 'steamcraft_resources',
  RUBRICS: 'steamcraft_rubrics',
  PEER_FEEDBACKS: 'steamcraft_peer_feedbacks',
  USERS: 'steamcraft_users'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to Budi Santoso (Student) for immediate accessibility
    return INITIAL_USERS[0];
  });

  const [appMode, setAppModeState] = useState<AppMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APP_MODE);
    return (saved as AppMode) || 'demo';
  });

  const [currentPage, setCurrentPage] = useState<PageName>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
    return saved ? JSON.parse(saved) : generateInitialCheckpoints();
  });

  const [journals, setJournals] = useState<Journal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return saved ? JSON.parse(saved) : INITIAL_JOURNALS;
  });

  const [versions, setVersions] = useState<Version[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VERSIONS);
    return saved ? JSON.parse(saved) : INITIAL_VERSIONS;
  });

  const [members, setMembers] = useState<ProjectMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [applications, setApplications] = useState<RecruitmentApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : INITIAL_RESOURCE_REQUESTS;
  });

  const [rubrics, setRubrics] = useState<Rubric[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RUBRICS);
    return saved ? JSON.parse(saved) : INITIAL_RUBRICS;
  });

  const [peerFeedbacks, setPeerFeedbacks] = useState<PeerFeedback[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PEER_FEEDBACKS);
    return saved ? JSON.parse(saved) : INITIAL_PEER_FEEDBACKS;
  });

  // UI state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_MODE, appMode);
  }, [appMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(checkpoints));
  }, [checkpoints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resourceRequests));
  }, [resourceRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RUBRICS, JSON.stringify(rubrics));
  }, [rubrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PEER_FEEDBACKS, JSON.stringify(peerFeedbacks));
  }, [peerFeedbacks]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openModal = (name: string, data?: any) => {
    setActiveModal(name);
    setModalData(data || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    showToast(
      mode === 'demo'
        ? '✓ Sistem beralih ke Mode Demo (Showcase Lomba & 13 Proyek Sampel)'
        : '✓ Sistem beralih ke Mode Operasional Riil (Data Kampus Bersih)'
    );
  };

  // Auth Handlers
  const login = (identifierOrUsername: string, password?: string): boolean => {
    const q = identifierOrUsername.trim().toLowerCase();
    const found = users.find(
      u =>
        u.username.toLowerCase() === q ||
        u.identifier.toLowerCase() === q ||
        (u.email && u.email.toLowerCase() === q)
    );

    if (found) {
      if (password && found.password && found.password !== password) {
        showToast('Kata sandi tidak sesuai!');
        return false;
      }
      setCurrentUser(found);
      showToast(`Selamat datang kembali, ${found.name}!`);
      return true;
    }

    showToast('Identitas pengguna tidak ditemukan!');
    return false;
  };

  const switchDemoUser = (roleOrUsername: string) => {
    let target = users.find(u => u.username.toLowerCase() === roleOrUsername.toLowerCase());
    if (!target) {
      target = users.find(u => u.role === roleOrUsername);
    }
    if (target) {
      setCurrentUser(target);
      showToast(`Beralih ke akun demo: ${target.name} (${target.role})`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari ruang kerja.');
  };

  const registerUser = (data: Partial<User>): boolean => {
    if (!data.name || !data.identifier || !data.study_program) {
      showToast('Mohon lengkapi seluruh field pendaftaran.');
      return false;
    }

    const username = data.username || data.identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase() || u.identifier === data.identifier);
    if (exists) {
      showToast('NIM / NIDN atau username ini sudah terdaftar.');
      return false;
    }

    const newUser: User = {
      id: Date.now(),
      username,
      name: data.name,
      role: data.role || 'student',
      identifier: data.identifier,
      study_program: data.study_program,
      faculty: data.faculty || 'Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)',
      university: data.university || 'Universitas Indonesia',
      research_interests: data.research_interests || 'Sains, Teknologi, Rekayasa & Matematika',
      bio: data.bio || '',
      academic_links: data.academic_links || '',
      avatar_color: data.avatar_color || '#2878d7',
      password: data.password || 'password123',
      email: data.email || `${username}@campus.ac.id`,
      email_verified: 1,
      created_at: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Registrasi berhasil! Selamat datang, ${newUser.name}.`);
    closeModal();
    return true;
  };

  const updateProfile = (data: Partial<User>, targetUserId?: number) => {
    if (!currentUser) return;
    const targetId = targetUserId ?? data.id ?? currentUser.id;
    const existing = users.find(u => u.id === targetId) || (targetId === currentUser.id ? currentUser : null);
    if (!existing) return;

    const updated: User = { ...existing, ...data, id: targetId };

    setUsers(prev => prev.map(u => (u.id === targetId ? updated : u)));

    if (currentUser.id === targetId) {
      setCurrentUser(updated);
    }

    // Sync user display name in projects if changed
    if (data.name && data.name !== existing.name) {
      setProjects(prev =>
        prev.map(p => {
          let modified = false;
          let newCreator = p.creator_name;
          let newLecturer = p.lecturer;
          if (p.creator_id === targetId || p.creator_username === existing.username) {
            newCreator = data.name!;
            modified = true;
          }
          if (existing.role === 'lecturer' && p.lecturer === existing.name) {
            newLecturer = data.name!;
            modified = true;
          }
          return modified ? { ...p, creator_name: newCreator, lecturer: newLecturer } : p;
        })
      );
    }

    showToast(`Profil ${updated.name} berhasil diperbarui!`);
    closeModal();
  };

  // Projects & Workspace Handlers
  const createProject = (data: Partial<Project>): Project => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const templateKey = data.template || 'free';
    const tpl = DEFAULT_TEMPLATES[templateKey] || DEFAULT_TEMPLATES.free;

    const newProject: Project = {
      id: newId,
      name: data.name || 'Proyek Riset Baru',
      desc: data.desc || 'Deskripsi penelitian multidisiplin STEAM.',
      study: data.study || currentUser?.study_program || 'Sains Data',
      steam: data.steam || 'Science + Tech',
      template: templateKey,
      status: 'Aktif',
      progress: 0,
      members_count: 1,
      open_recruitment: data.open_recruitment !== undefined ? data.open_recruitment : 1,
      recruitment_roles: data.recruitment_roles || 'Data Analyst, Hardware IoT, Designer',
      goal: data.goal || 'Tujuan riset dan hipotesis eksperimental.',
      tools: data.tools || 'Python, Git, Lab Instruments',
      repo_url: data.repo_url || 'https://github.com/steamcraft/new-research-project',
      lecturer: data.lecturer || 'Dr. Rahmat Wijaya, M.Sc.',
      creator_id: currentUser?.id || 1,
      creator_username: currentUser?.username || 'budi',
      versions_count: 1,
      blocker: 0,
      blocker_reason: '',
      steam_scores: { S: 85, T: 80, E: 75, A: 70, M: 80 },
      is_demo: appMode === 'demo' ? 1 : 0,
      created_at: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);

    // Create checkpoints for the new project
    const newCps: Checkpoint[] = tpl.cp.map((stage, idx) => ({
      id: Date.now() + idx,
      project_id: newId,
      stage_index: idx,
      title: stage[0],
      description: stage[1],
      is_completed: 0,
      completed_at: null,
      completed_by: null
    }));
    setCheckpoints(prev => [...prev, ...newCps]);

    // Add creator as lead member
    if (currentUser) {
      const leadMember: ProjectMember = {
        id: Date.now() + 100,
        project_id: newId,
        user_id: currentUser.id,
        name: currentUser.name,
        identifier: currentUser.identifier,
        study_program: currentUser.study_program,
        role: 'Ketua Tim Peneliti',
        is_lead: 1,
        avatar_color: currentUser.avatar_color || '#2878d7'
      };
      setMembers(prev => [...prev, leadMember]);
    }

    // Add initial journal entry
    const initJournal: Journal = {
      id: Date.now() + 200,
      project_id: newId,
      author_name: currentUser?.name || 'Ketua Tim',
      tag: 'Metodologi',
      content: 'Inisialisasi workspace riset STEAM-Craft dan penetapan rancangan kerangka kerja awal.',
      created_at: new Date().toISOString()
    };
    setJournals(prev => [initJournal, ...prev]);

    setSelectedProjectId(newId);
    showToast(`Proyek "${newProject.name}" berhasil dibuat!`);
    closeModal();
    return newProject;
  };

  const updateProject = (id: number, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p)));
    showToast('Proyek berhasil diperbarui!');
  };

  const toggleCheckpoint = (checkpointId: number) => {
    const cp = checkpoints.find(c => c.id === checkpointId);
    if (!cp) return;

    const newCompleted = cp.is_completed ? 0 : 1;
    const updatedCheckpoints = checkpoints.map(c =>
      c.id === checkpointId
        ? {
            ...c,
            is_completed: newCompleted,
            completed_at: newCompleted ? new Date().toISOString() : null,
            completed_by: newCompleted ? `${currentUser?.name || 'Peneliti'} (${currentUser?.study_program || 'STEAM'})` : null
          }
        : c
    );
    setCheckpoints(updatedCheckpoints);

    // Recalculate project progress
    const projectCps = updatedCheckpoints.filter(c => c.project_id === cp.project_id);
    const completedCount = projectCps.filter(c => c.is_completed === 1).length;
    const progressPct = projectCps.length > 0 ? Math.round((completedCount / projectCps.length) * 100) : 0;

    setProjects(prev =>
      prev.map(p =>
        p.id === cp.project_id
          ? {
              ...p,
              progress: progressPct,
              status: progressPct === 100 ? 'Selesai' : p.status === 'Selesai' ? 'Aktif' : p.status
            }
          : p
      )
    );

    showToast(newCompleted ? `✓ Checkpoint "${cp.title}" ditandai selesai!` : `Checkpoint "${cp.title}" dibuka kembali.`);
  };

  const addCheckpoint = (projectId: number, title: string, description: string) => {
    const projectCps = checkpoints.filter(c => c.project_id === projectId);
    const newCp: Checkpoint = {
      id: Date.now(),
      project_id: projectId,
      stage_index: projectCps.length,
      title,
      description,
      is_completed: 0,
      completed_at: null,
      completed_by: null
    };
    const updatedCheckpoints = [...checkpoints, newCp];
    setCheckpoints(updatedCheckpoints);

    // Update progress
    const allProjCps = updatedCheckpoints.filter(c => c.project_id === projectId);
    const completed = allProjCps.filter(c => c.is_completed === 1).length;
    const progress = Math.round((completed / allProjCps.length) * 100);

    setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, progress } : p)));
    showToast(`Checkpoint baru "${title}" berhasil ditambahkan!`);
  };

  const toggleBlocker = (projectId: number, reason: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          const nextBlocker = p.blocker ? 0 : 1;
          return {
            ...p,
            blocker: nextBlocker,
            blocker_reason: nextBlocker ? reason : ''
          };
        }
        return p;
      })
    );

    const proj = projects.find(p => p.id === projectId);
    if (proj?.blocker) {
      showToast('Kendala (Blocker) telah diselesaikan.');
    } else {
      showToast('Kendala (Blocker) dilaporkan. Dosen pembimbing akan menerima notifikasi klinik riset.');
    }
  };

  const addJournal = (projectId: number, tag: string, content: string, fileName?: string) => {
    const newJournal: Journal = {
      id: Date.now(),
      project_id: projectId,
      author_name: currentUser?.name || 'Peneliti Anggota',
      tag: tag || 'Catatan Umum',
      content,
      file_name: fileName || null,
      created_at: new Date().toISOString()
    };
    setJournals(prev => [newJournal, ...prev]);
    showToast('Catatan jurnal riset berhasil ditambahkan!');
  };

  const addVersion = (projectId: number, note: string, artifactUrl?: string, fileName?: string) => {
    const projectVersions = versions.filter(v => v.project_id === projectId);
    const nextVer = projectVersions.length + 1;
    const newVersion: Version = {
      id: Date.now(),
      project_id: projectId,
      version_number: nextVer,
      note,
      artifact_url: artifactUrl || '',
      file_name: fileName || null,
      created_at: new Date().toISOString()
    };
    setVersions(prev => [newVersion, ...prev]);
    setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, versions_count: nextVer } : p)));
    showToast(`Build v${nextVer}.0 berhasil didaftarkan ke reproducibility log.`);
  };

  // Applications
  const applyRecruitment = (projectId: number, applicantRole: string, applicantStudy: string, message: string) => {
    const newApp: RecruitmentApplication = {
      id: Date.now(),
      project_id: projectId,
      applicant_name: currentUser?.name || 'Mahasiswa Pendaftar',
      applicant_study: applicantStudy || currentUser?.study_program || 'Sains',
      applicant_role: applicantRole,
      message,
      status: 'Menunggu',
      created_at: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    showToast('Permohonan bergabung telah dikirimkan ke ketua tim riset!');
    closeModal();
  };

  const updateApplicationStatus = (appId: number, status: 'Menunggu' | 'Diterima' | 'Ditolak') => {
    setApplications(prev =>
      prev.map(a => {
        if (a.id === appId) {
          if (status === 'Diterima') {
            // Add as project member
            const newMember: ProjectMember = {
              id: Date.now(),
              project_id: a.project_id,
              name: a.applicant_name,
              identifier: '2026' + Math.floor(10000 + Math.random() * 90000),
              study_program: a.applicant_study,
              role: a.applicant_role,
              is_lead: 0,
              avatar_color: '#0d9488'
            };
            setMembers(m => [...m, newMember]);
            setProjects(p =>
              p.map(proj => (proj.id === a.project_id ? { ...proj, members_count: proj.members_count + 1 } : proj))
            );
          }
          return { ...a, status };
        }
        return a;
      })
    );
    showToast(`Status pelamar diubah menjadi "${status}".`);
  };

  // Consultations & Resources
  const bookConsultation = (data: Omit<Consultation, 'id' | 'created_at' | 'status'>) => {
    const newConsult: Consultation = {
      ...data,
      id: Date.now(),
      status: 'Terjadwal',
      created_at: new Date().toISOString()
    };
    setConsultations(prev => [newConsult, ...prev]);
    showToast('Sesi bimbingan riset berhasil dijadwalkan!');
    closeModal();
  };

  const updateConsultation = (id: number, data: Partial<Consultation>) => {
    setConsultations(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
    showToast('Jadwal / catatan bimbingan diperbarui!');
  };

  const markConsultationsRead = () => {
    if (!currentUser) return;
    const nameLower = currentUser.name.toLowerCase();
    setConsultations(prev =>
      prev.map(c => {
        const isBelongsToUser =
          c.student_name.toLowerCase().includes(nameLower) ||
          c.lecturer_name.toLowerCase().includes(nameLower);
        return isBelongsToUser ? { ...c, is_read: 1 } : c;
      })
    );
  };

  const requestResource = (data: Omit<ResourceRequest, 'id' | 'created_at' | 'status'>) => {
    const newReq: ResourceRequest = {
      ...data,
      id: Date.now(),
      status: 'Menunggu',
      created_at: new Date().toISOString()
    };
    setResourceRequests(prev => [newReq, ...prev]);
    showToast('Permohonan fasilitas lab berhasil diajukan!');
    closeModal();
  };

  const updateResourceStatus = (id: number, status: 'Menunggu' | 'Disetujui' | 'Ditolak', feedback?: string) => {
    setResourceRequests(prev => prev.map(r => (r.id === id ? { ...r, status, feedback: feedback || r.feedback } : r)));
    showToast(`Permohonan fasilitas lab "${status}".`);
  };

  const saveRubric = (
    projectId: number,
    scores: { completeness: number; evidence: number; contribution: number; reproducibility: number },
    feedback: string
  ) => {
    const total = scores.completeness + scores.evidence + scores.contribution + scores.reproducibility;
    let grade = 'B';
    if (total >= 90) grade = 'A (Sangat Memuaskan)';
    else if (total >= 80) grade = 'A- (Memuaskan)';
    else if (total >= 70) grade = 'B+ (Baik)';
    else grade = 'B (Cukup)';

    const existingIndex = rubrics.findIndex(r => r.project_id === projectId);
    const newRubric: Rubric = {
      id: existingIndex >= 0 ? rubrics[existingIndex].id : Date.now(),
      project_id: projectId,
      score_completeness: scores.completeness,
      score_evidence: scores.evidence,
      score_contribution: scores.contribution,
      score_reproducibility: scores.reproducibility,
      total_score: total,
      feedback,
      evaluator_name: currentUser?.name || 'Dosen Pembimbing',
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setRubrics(prev => prev.map((r, i) => (i === existingIndex ? newRubric : r)));
    } else {
      setRubrics(prev => [...prev, newRubric]);
    }

    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              final_score: total,
              final_grade: grade,
              final_note: feedback,
              evaluation_recorded: 1,
              package_compiled: 1,
              package_filename: `steamcraft-reproducibility-proj-${projectId}.json`
            }
          : p
      )
    );

    showToast(`Rubrik ilmiah disimpan! Skor akhir: ${total.toFixed(1)} (${grade}).`);
  };

  // Announcements
  const markAnnouncementRead = (id: number) => {
    setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, is_read: true } : a)));
  };

  const markAllAnnouncementsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, is_read: true })));
    showToast('Semua pemberitahuan telah ditandai dibaca.');
  };

  const toggleSaveAnnouncement = (id: number) => {
    setAnnouncements(prev =>
      prev.map(a => {
        if (a.id === id) {
          const nextSaved = !a.is_saved;
          showToast(nextSaved ? 'Pemberitahuan disimpan ke bookmark.' : 'Pemberitahuan dihapus dari bookmark.');
          return { ...a, is_saved: nextSaved };
        }
        return a;
      })
    );
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'created_at'>) => {
    const newAnn: Announcement = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
      is_read: false,
      is_saved: false
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast('Pengumuman baru berhasil disiarkan!');
    closeModal();
  };

  // Peer-to-Peer Feedback
  const addPeerFeedback = (data: Omit<PeerFeedback, 'id' | 'created_at' | 'overall_score'>) => {
    const scores = [data.ratings.technical, data.ratings.collaboration, data.ratings.scientificRigor, data.ratings.reliability];
    const overall = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
    const newFeedback: PeerFeedback = {
      ...data,
      id: Date.now(),
      overall_score: overall,
      created_at: new Date().toISOString()
    };
    setPeerFeedbacks(prev => [newFeedback, ...prev]);
    showToast(`✓ Feedback terstruktur untuk ${data.reviewee_name} berhasil dikirim!`);
    closeModal();
  };

  // System Administration
  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setAppModeState('demo');
    setProjects(INITIAL_PROJECTS);
    setCheckpoints(generateInitialCheckpoints());
    setJournals(INITIAL_JOURNALS);
    setVersions(INITIAL_VERSIONS);
    setMembers(INITIAL_MEMBERS);
    setConsultations(INITIAL_CONSULTATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setResourceRequests(INITIAL_RESOURCE_REQUESTS);
    setApplications(INITIAL_APPLICATIONS);
    setRubrics(INITIAL_RUBRICS);
    setPeerFeedbacks(INITIAL_PEER_FEEDBACKS);
    showToast('✓ Seluruh data sistem telah direset ke setelan bawaan demo.');
  };

  const exportDataJson = (): string => {
    const payload = {
      exported_at: new Date().toISOString(),
      app_mode: appMode,
      users,
      projects,
      checkpoints,
      journals,
      versions,
      members,
      consultations,
      announcements,
      resourceRequests,
      applications,
      rubrics,
      peerFeedbacks
    };
    return JSON.stringify(payload, null, 2);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        appMode,
        currentPage,
        selectedProjectId,
        projects,
        checkpoints,
        journals,
        versions,
        members,
        applications,
        consultations,
        announcements,
        resourceRequests,
        rubrics,
        peerFeedbacks,
        users,
        activeModal,
        modalData,
        toastMessage,

        setCurrentPage,
        setSelectedProjectId,
        openModal,
        closeModal,
        showToast,
        setAppMode,

        login,
        switchDemoUser,
        logout,
        registerUser,
        updateProfile,

        createProject,
        updateProject,
        toggleCheckpoint,
        addCheckpoint,
        toggleBlocker,
        addJournal,
        addVersion,

        applyRecruitment,
        updateApplicationStatus,

        bookConsultation,
        updateConsultation,
        markConsultationsRead,
        requestResource,
        updateResourceStatus,

        saveRubric,
        addPeerFeedback,

        markAnnouncementRead,
        markAllAnnouncementsRead,
        toggleSaveAnnouncement,
        addAnnouncement,

        resetAllData,
        exportDataJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
