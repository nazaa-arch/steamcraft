import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Edit3, Shield, LogOut, Check, X, Sparkles, ChevronDown, UserCheck } from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    setCurrentPage,
    announcements,
    markAnnouncementRead,
    markAllAnnouncementsRead,
    openModal,
    logout,
    consultations,
    markConsultationsRead,
    projects,
    projectCatalogTab,
    setProjectCatalogTab,
    isUserMemberOfProject
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifWrapperRef = useRef<HTMLDivElement>(null);
  const profileWrapperRef = useRef<HTMLDivElement>(null);
  const toolsWrapperRef = useRef<HTMLDivElement>(null);
  const projectWrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (notifDropdownOpen && notifWrapperRef.current && !notifWrapperRef.current.contains(target)) {
        setNotifDropdownOpen(false);
      }
      if (profileDropdownOpen && profileWrapperRef.current && !profileWrapperRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (toolsDropdownOpen && toolsWrapperRef.current && !toolsWrapperRef.current.contains(target)) {
        setToolsDropdownOpen(false);
      }
      if (projectDropdownOpen && projectWrapperRef.current && !projectWrapperRef.current.contains(target)) {
        setProjectDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotifDropdownOpen(false);
        setProfileDropdownOpen(false);
        setToolsDropdownOpen(false);
        setProjectDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifDropdownOpen, profileDropdownOpen, toolsDropdownOpen, projectDropdownOpen]);

  if (!currentUser) return null;

  const role = currentUser.role;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Unread announcements
  const unreadAnnouncements = announcements.filter(a => !a.is_read);
  const unreadCount = unreadAnnouncements.length;

  // Consultation badges: only count if status is active and not yet marked as read/seen
  const pendingStudentConsults = consultations.filter(
    c =>
      c.student_name.toLowerCase().includes(currentUser.name.toLowerCase()) &&
      c.status === 'Terjadwal' &&
      c.is_read !== 1
  ).length;

  const pendingLecturerConsults = consultations.filter(
    c => c.status === 'Menunggu respons' && c.is_read !== 1
  ).length;

  const blockerProjectsCount = projects.filter(p => p.blocker === 1).length;
  const myProjectsCount = projects.filter(p => isUserMemberOfProject(p.id)).length;

  const renderProjectDropdown = () => (
    <div className="nav-dropdown-wrapper" ref={projectWrapperRef}>
      <button
        type="button"
        className={`nav-btn nav-dropdown-btn ${['projects', 'workspace', 'recruitment'].includes(currentPage) ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setProjectDropdownOpen(prev => !prev);
          setToolsDropdownOpen(false);
        }}
        aria-expanded={projectDropdownOpen}
        title="Pusat Riset & Proyek Multidisiplin"
      >
        <span>Riset dan Proyek</span>
        <ChevronDown size={11} style={{ transform: projectDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {projectDropdownOpen && (
        <div
          className="nav-dropdown-menu nav-dropdown-left"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            className={`dropdown-menu-item ${currentPage === 'workspace' ? 'active' : ''}`}
            onClick={() => {
              setCurrentPage('workspace');
              setProjectDropdownOpen(false);
              closeMobileMenu();
            }}
          >
            <span style={{ fontSize: '15px' }}>💻</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>Ruang Kerja Tim (Workspace)</div>
              <small style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>Kanban, Editor Naskah, & Logbook aktif</small>
            </div>
          </button>

          <button
            type="button"
            className={`dropdown-menu-item ${currentPage === 'projects' && projectCatalogTab === 'myProjects' ? 'active' : ''}`}
            onClick={() => {
              setProjectCatalogTab('myProjects');
              setCurrentPage('projects');
              setProjectDropdownOpen(false);
              closeMobileMenu();
            }}
          >
            <span style={{ fontSize: '15px' }}>🗂️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>
                {role === 'lecturer' ? 'Proyek Bimbingan' : role === 'admin' ? 'Semua Proyek' : 'Proyek Saya'} ({myProjectsCount})
              </div>
              <small style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>Daftar proyek riset yang Anda ikuti / bina</small>
            </div>
          </button>

          <button
            type="button"
            className={`dropdown-menu-item ${currentPage === 'projects' && projectCatalogTab !== 'myProjects' ? 'active' : ''}`}
            onClick={() => {
              setProjectCatalogTab('all');
              setCurrentPage('projects');
              setProjectDropdownOpen(false);
              closeMobileMenu();
            }}
          >
            <span style={{ fontSize: '15px' }}>🌐</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>Katalog & Rekrutmen Riset</div>
              <small style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>Eksplorasi riset & lowongan kolaborasi</small>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="topbar">
      <a
        href="#"
        className="brand"
        onClick={e => {
          e.preventDefault();
          setCurrentPage('dashboard');
          closeMobileMenu();
        }}
      >
        <img src="/logo.jpg?v=20261021" alt="Logo" className="brand-logo-img" />
        <div className="brand-text">
          <h2>SteamCraft</h2>
          <span>Ruang Kolaborasi Multidisiplin</span>
        </div>
      </a>

      <button
        type="button"
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Buka menu navigasi"
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(prev => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Role-Separated Primary Navigation */}
      <div className={`nav-container ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <nav className="nav" id="mainNav">
        {/* Student Navigation */}
        {role === 'student' && (
          <>
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('dashboard');
                closeMobileMenu();
              }}
            >
              Dashboard
            </button>
            {renderProjectDropdown()}
            <button
              className={currentPage === 'studentConsultations' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('studentConsultations');
                markConsultationsRead();
                closeMobileMenu();
              }}
            >
              <span>Bimbingan</span>
              {pendingStudentConsults > 0 && (
                <span className="nav-badge">{pendingStudentConsults}</span>
              )}
            </button>
            <button
              className={currentPage === 'studentResources' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('studentResources');
                closeMobileMenu();
              }}
            >
              Fasilitas
            </button>
            <button
              className={currentPage === 'studentPortfolio' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('studentPortfolio');
                closeMobileMenu();
              }}
            >
              Portofolio
            </button>
          </>
        )}

        {/* Lecturer Navigation */}
        {role === 'lecturer' && (
          <>
            <button
              className={currentPage === 'mission' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('mission');
                closeMobileMenu();
              }}
            >
              <span>Supervisi</span>
              {blockerProjectsCount > 0 && (
                <span className="nav-badge warning">{blockerProjectsCount}</span>
              )}
            </button>
            {renderProjectDropdown()}
            <button
              className={currentPage === 'consultations' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('consultations');
                markConsultationsRead();
                closeMobileMenu();
              }}
            >
              <span>Bimbingan</span>
              {pendingLecturerConsults > 0 && (
                <span className="nav-badge">{pendingLecturerConsults}</span>
              )}
            </button>
            <button
              className={currentPage === 'resources' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('resources');
                closeMobileMenu();
              }}
            >
              Fasilitas
            </button>
            <button
              className={currentPage === 'analytics' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('analytics');
                closeMobileMenu();
              }}
            >
              Analitik
            </button>
          </>
        )}

        {/* Admin Navigation */}
        {role === 'admin' && (
          <>
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('dashboard');
                closeMobileMenu();
              }}
            >
              Dashboard
            </button>
            {renderProjectDropdown()}
            <button
              className={currentPage === 'mission' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('mission');
                closeMobileMenu();
              }}
            >
              Supervisi
            </button>
            <button
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('admin');
                closeMobileMenu();
              }}
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                fontWeight: 800,
                border: '1px solid #38bdf8'
              }}
            >
              <span>🛠️ Admin Console</span>
            </button>
          </>
        )}

        {/* Dropdown Menu: Instrumen Riset STEAM (Available for Student, Lecturer, & Admin) */}
        <div className="nav-dropdown-wrapper" ref={toolsWrapperRef}>
          <button
            type="button"
            className={`nav-btn nav-dropdown-btn ${['radar', 'logbook', 'dataRepo'].includes(currentPage) ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setToolsDropdownOpen(prev => !prev);
            }}
            aria-expanded={toolsDropdownOpen}
            title="Instrumen Riset Ilmiah STEAM"
          >
            <Sparkles size={13} style={{ color: 'var(--primary)' }} />
            <span>Instrumen STEAM</span>
            <ChevronDown size={11} style={{ transform: toolsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {toolsDropdownOpen && (
            <div
              className="nav-dropdown-menu nav-dropdown-right"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className={`dropdown-menu-item ${currentPage === 'radar' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage('radar');
                  setToolsDropdownOpen(false);
                  closeMobileMenu();
                }}
              >
                <span style={{ fontSize: '15px' }}>🎯</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>STEAM Radar Matrix</div>
                  <small style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>Keseimbangan 5 pilar riset</small>
                </div>
              </button>

              <button
                type="button"
                className={`dropdown-menu-item ${currentPage === 'logbook' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage('logbook');
                  setToolsDropdownOpen(false);
                  closeMobileMenu();
                }}
              >
                <span style={{ fontSize: '15px' }}>📝</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Logbook Riset Ilmiah</div>
                  <small style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>Catatan & Ekspor PDF PKM</small>
                </div>
              </button>

              <button
                type="button"
                className={`dropdown-menu-item ${currentPage === 'dataRepo' ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage('dataRepo');
                  setToolsDropdownOpen(false);
                  closeMobileMenu();
                }}
              >
                <span style={{ fontSize: '15px' }}>🔬</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Repository Data Empiris</div>
                  <small style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>Dataset & Reproducibility</small>
                </div>
              </button>
            </div>
          )}
        </div>
        </nav>
      </div>

      {/* User Controls */}
      <div className="user-controls">
        {/* Administrator Mode Indicator Pill */}
        {role === 'admin' && (
          <div
            id="devModeIndicator"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0f172a',
              border: '1px solid #38bdf8',
              padding: '4px 12px',
              borderRadius: '20px'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8'
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#38bdf8',
                letterSpacing: '0.5px'
              }}
            >
              ADMINISTRATOR SISTEM
            </span>
          </div>
        )}

        {/* Quick Tour / Panduan Button */}
        <button
          type="button"
          className="btn btn-ghost btn-sm topbar-tour-btn"
          onClick={() => openModal('quickTour')}
          style={{
            padding: '5px 10px',
            fontSize: '11.5px',
            borderRadius: '10px',
            color: 'var(--navy)',
            background: 'var(--surface-alt)',
            border: '1px solid var(--line)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
          title="Buka Panduan & Tur Alur Riset STEAM-Craft"
        >
          <Sparkles size={13} style={{ color: 'var(--primary)' }} />
          <span className="tour-text">Panduan</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="notif-bell-wrapper" ref={notifWrapperRef}>
          <button
            className="notif-bell-btn"
            onClick={() => {
              if (!notifDropdownOpen) {
                // Otomatis hilangkan notifikasi begitu menu dibuka / diklik
                if (unreadCount > 0) {
                  markAllAnnouncementsRead(true);
                }
                setNotifDropdownOpen(true);
              } else {
                setNotifDropdownOpen(false);
              }
            }}
            title="Pemberitahuan & Pengumuman Kampus"
            aria-label="Notifikasi"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {/* Fullscreen Backdrop for Mobile & Desktop (Click/Tap outside to close) */}
          {notifDropdownOpen && (
            <div
              className="notif-backdrop"
              onClick={() => setNotifDropdownOpen(false)}
              onTouchStart={() => setNotifDropdownOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Dropdown Popover */}
          {notifDropdownOpen && (
            <div
              className="notif-dropdown"
              style={{ display: 'flex' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="notif-dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📢</span>
                  <strong style={{ fontSize: '13.5px', color: 'var(--navy)' }}>
                    Pemberitahuan & Pengumuman
                  </strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <span className="badge badge-rose" style={{ fontSize: '10px' }}>
                      {unreadCount} baru
                    </span>
                  )}
                  <button
                    type="button"
                    className="notif-close-btn"
                    onClick={() => setNotifDropdownOpen(false)}
                    title="Tutup Notifikasi"
                    aria-label="Tutup"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="notif-dropdown-list">
                {announcements.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px', fontSize: '12px' }}>
                    Belum ada pengumuman kampus.
                  </div>
                ) : (
                  announcements.slice(0, 5).map(ann => (
                    <div
                      key={ann.id}
                      className={`notif-dropdown-item ${!ann.is_read ? 'unread' : ''}`}
                      onClick={() => {
                        markAnnouncementRead(ann.id);
                        openModal('announcementDetail', ann);
                        setNotifDropdownOpen(false);
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`badge badge-${ann.category === 'Akademik' ? 'blue' : ann.category === 'Metodologi' ? 'teal' : 'orange'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                          {ann.category}
                        </span>
                        <small style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          {new Date(ann.created_at).toLocaleDateString('id-ID')}
                        </small>
                      </div>
                      <strong style={{ fontSize: '12px', color: 'var(--navy)' }}>{ann.title}</strong>
                      <p style={{ fontSize: '11px', color: 'var(--ink-secondary)', margin: 0 }} className="line-clamp-2">
                        {ann.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="notif-dropdown-footer">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    markAllAnnouncementsRead();
                    setNotifDropdownOpen(false);
                  }}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  <Check size={12} />
                  <span>Tandai Semua Dibaca</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setCurrentPage('announcements');
                    setNotifDropdownOpen(false);
                  }}
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                >
                  <span>Lihat Halaman Penuh &rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Dropdown */}
        <div className="user-profile-wrapper" ref={profileWrapperRef}>
          <div
            className={`user-badge ${profileDropdownOpen ? 'active' : ''}`}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            title="Klik untuk membuka menu profil & identitas peneliti"
            tabIndex={0}
            role="button"
            aria-expanded={profileDropdownOpen}
          >
            <div
              className="user-avatar"
              style={{ backgroundColor: currentUser.avatar_color || '#2878d7', position: 'relative' }}
            >
              {currentUser.avatar_icon ? (
                <span style={{ fontSize: '15px' }}>{currentUser.avatar_icon}</span>
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="user-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <strong style={{ whiteSpace: 'nowrap' }}>
                  {(() => {
                    if (currentUser.role === 'lecturer' || currentUser.name.includes('Belgis')) {
                      return 'Dr. Belgis A. Iza';
                    }
                    const parts = (currentUser.name || '').split(' ');
                    return parts.length > 2 ? `${parts[0]} ${parts[1]}` : currentUser.name;
                  })()}
                </strong>
                <ChevronDown size={12} className={`profile-chevron ${profileDropdownOpen ? 'open' : ''}`} />
              </div>
              <small>
                {role === 'student' ? 'Mahasiswa' : role === 'lecturer' ? 'Dosen' : 'Admin'}
              </small>
            </div>
          </div>

          {/* Profile Dropdown Popover */}
          {profileDropdownOpen && (
            <div className="user-profile-dropdown" onClick={e => e.stopPropagation()}>
              <div className="user-profile-dropdown-header">
                <div
                  className="dropdown-avatar"
                  style={{ backgroundColor: currentUser.avatar_color || '#2878d7' }}
                >
                  {currentUser.avatar_icon || currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="dropdown-user-main">
                  <strong>
                    {(() => {
                      let str = currentUser.name || '';
                      if (currentUser.title_prefix && !str.startsWith(currentUser.title_prefix)) {
                        str = `${currentUser.title_prefix} ${str}`;
                      }
                      if (currentUser.title_suffix && !str.endsWith(currentUser.title_suffix)) {
                        str = `${str}, ${currentUser.title_suffix}`;
                      }
                      return str;
                    })()}
                  </strong>
                  <div className="dropdown-role-pill">
                    <UserCheck size={11} />
                    <span>{role === 'student' ? 'Mahasiswa Peneliti' : role === 'lecturer' ? 'Dosen Pembimbing Utama' : 'Administrator Sistem'}</span>
                  </div>
                </div>
              </div>

              <div className="user-profile-dropdown-body">
                <div className="profile-detail-row">
                  <span className="detail-label">{role === 'student' ? 'NIM' : 'NIP / NIDN'}</span>
                  <span className="detail-val">{currentUser.identifier || (role === 'student' ? '202610101' : '202509237')}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="detail-label">Program Studi</span>
                  <span className="detail-val">{currentUser.study_program || 'S1 Sains Data — FMIPA UNESA'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="detail-label">Surel Kampus</span>
                  <span className="detail-val">{currentUser.email || (role === 'student' ? 'budi.santoso@unesa.ac.id' : 'belgisiza@unesa.ac.id')}</span>
                </div>
              </div>

              <div className="user-profile-dropdown-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    openModal('profile', currentUser);
                    setProfileDropdownOpen(false);
                  }}
                  style={{ flex: 1, fontSize: '11.5px', justifyContent: 'center' }}
                >
                  <Edit3 size={13} />
                  <span>Edit Profil</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  style={{ color: '#e11d48', fontSize: '11.5px', padding: '6px 12px' }}
                  title="Keluar dari akun"
                >
                  <LogOut size={13} />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
