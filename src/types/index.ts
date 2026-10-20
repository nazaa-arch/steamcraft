export type UserRole = 'student' | 'lecturer' | 'admin';
export type AppMode = 'demo' | 'production';

export type PageName =
  | 'dashboard'
  | 'projects'
  | 'workspace'
  | 'recruitment'
  | 'studentConsultations'
  | 'studentResources'
  | 'studentPortfolio'
  | 'mission'
  | 'consultations'
  | 'resources'
  | 'analytics'
  | 'admin'
  | 'announcements'
  | 'maintenance'
  | 'adminDev'
  | 'hub';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  identifier: string;
  study_program: string;
  faculty?: string;
  university?: string;
  research_interests?: string;
  bio?: string;
  academic_links?: string;
  avatar_color?: string;
  avatar_icon?: string;
  title_prefix?: string;
  title_suffix?: string;
  steam_focus?: string[];
  phone?: string;
  office_room?: string;
  scholar_id?: string;
  orcid_id?: string;
  github_url?: string;
  linkedin_url?: string;
  password?: string;
  email?: string;
  email_verified?: number;
  created_at?: string;
}

export interface SteamScores {
  S: number;
  T: number;
  E: number;
  A: number;
  M: number;
}

export interface Project {
  id: number;
  name: string;
  desc: string;
  study: string;
  steam: string;
  template: 'data' | 'experiment' | 'actuary' | 'free';
  status: 'Aktif' | 'Menunggu persetujuan' | 'Review diajukan' | 'Selesai' | 'Ditolak';
  progress: number;
  members_count: number;
  open_recruitment: number;
  recruitment_roles: string;
  goal: string;
  tools: string;
  repo_url: string;
  lecturer: string;
  creator_id: number;
  creator_username?: string;
  creator_name?: string;
  versions_count: number;
  blocker: number;
  blocker_reason?: string;
  steam_scores?: SteamScores;
  final_score?: number | null;
  final_grade?: string | null;
  final_note?: string | null;
  evaluation_recorded?: number;
  package_compiled?: number;
  package_filename?: string | null;
  is_demo?: number;
  invite_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Checkpoint {
  id: number;
  project_id: number;
  stage_index: number;
  title: string;
  description: string;
  is_completed: number;
  completed_at?: string | null;
  completed_by?: string | null;
}

export interface Journal {
  id: number;
  project_id: number;
  author_name: string;
  tag: string;
  content: string;
  file_name?: string | null;
  file_url?: string | null;
  created_at: string;
}

export interface Version {
  id: number;
  project_id: number;
  version_number: number;
  note: string;
  artifact_url?: string | null;
  file_name?: string | null;
  file_url?: string | null;
  created_at: string;
}

export interface ProjectMember {
  id: number;
  project_id: number;
  user_id?: number | null;
  name: string;
  identifier: string;
  study_program: string;
  role: string;
  is_lead: number;
  avatar_color: string;
  joined_at?: string;
}

export interface RecruitmentApplication {
  id: number;
  project_id: number;
  applicant_name: string;
  applicant_study: string;
  applicant_role: string;
  message: string;
  status: 'Menunggu' | 'Diterima' | 'Ditolak';
  created_at: string;
}

export interface Consultation {
  id: number;
  project_id: number;
  student_name: string;
  lecturer_name: string;
  topic: string;
  type: string;
  mode: string;
  date: string;
  time: string;
  note?: string;
  feedback?: string | null;
  status: 'Menunggu respons' | 'Terjadwal' | 'Selesai' | 'Dibatalkan';
  is_read?: number;
  created_at: string;
}

export interface Announcement {
  id: number;
  author_name: string;
  title: string;
  category: 'Akademik' | 'Metodologi' | 'Tenggat' | 'Fasilitas' | 'Lomba';
  target: 'all' | 'teams' | 'lecturers';
  body: string;
  pinned: number;
  created_at: string;
  is_read?: boolean;
  is_saved?: boolean;
}

export interface ResourceRequest {
  id: number;
  project_id: number;
  student_name: string;
  resource_name: string;
  date_needed: string;
  note?: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  feedback?: string | null;
  created_at: string;
}

export interface Rubric {
  id: number;
  project_id: number;
  score_completeness: number;
  score_evidence: number;
  score_contribution: number;
  score_reproducibility: number;
  total_score: number;
  feedback?: string;
  evaluator_name?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: number;
  project_id: number;
  user_name: string;
  action_text: string;
  created_at: string;
}

export interface PeerFeedbackRating {
  technical: number; // 1-5 (Kontribusi Teknis & Eksekusi)
  collaboration: number; // 1-5 (Kolaborasi Multidisiplin & Komunikasi)
  scientificRigor: number; // 1-5 (Ketelitian Ilmiah & Problem Solving)
  reliability: number; // 1-5 (Keandalan & Tanggung Jawab Tim)
}

export interface PeerFeedback {
  id: number;
  project_id: number;
  reviewer_id?: number | null;
  reviewer_name: string;
  reviewer_study?: string;
  reviewer_role?: string;
  reviewee_id?: number | null;
  reviewee_name: string;
  reviewee_study?: string;
  reviewee_role?: string;
  ratings: PeerFeedbackRating;
  overall_score: number; // 1-5 scale
  strengths: string;
  improvements: string;
  badges: string[];
  created_at: string;
}

