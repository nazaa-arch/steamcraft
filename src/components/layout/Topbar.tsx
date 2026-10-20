import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Edit3, Shield, LogOut, Check, X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
    projects
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifWrapperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkNavScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkNavScroll();
    window.addEventListener('resize', checkNavScroll);
    return () => window.removeEventListener('resize', checkNavScroll);
  }, [currentPage, currentUser]);

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
      setTimeout(checkNavScroll, 300);
    }
  };

  const handleNavWheel = (e: React.WheelEvent) => {
    if (navRef.current && e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
      checkNavScroll();
    }
  };

  // Close notification dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!notifDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (notifWrapperRef.current && !notifWrapperRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotifDropdownOpen(false);
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
  }, [notifDropdownOpen]);

  if (!currentUser) return null;

  const role = currentUser.role;

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

  return (
    <header className="topbar">
      <a
        href="#"
        className="brand"
        onClick={e => {
          e.preventDefault();
          setCurrentPage('dashboard');
        }}
      >
        <img src="/logo.jpg" alt="Logo" className="brand-logo-img" />
        <div className="brand-text">
          <h2>SteamCraft</h2>
          <span>Ruang Kolaborasi Multidisiplin</span>
        </div>
      </a>

      {/* Role-Separated Navigation with Laptop Horizontal Scroll Support */}
      <div className="nav-container">
        {canScrollLeft && (
          <button
            type="button"
            className="nav-scroll-btn nav-scroll-left"
            onClick={() => scrollNav('left')}
            title="Geser menu ke kiri"
            aria-label="Geser navigasi ke kiri"
          >
            <ChevronLeft size={15} />
          </button>
        )}

        <nav
          className="nav"
          id="mainNav"
          ref={navRef}
          onScroll={checkNavScroll}
          onWheel={handleNavWheel}
        >
        {/* Student Navigation */}
        {role === 'student' && (
          <>
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={currentPage === 'projects' ? 'active' : ''}
              onClick={() => setCurrentPage('projects')}
            >
              Katalog Proyek
            </button>
            <button
              className={currentPage === 'workspace' ? 'active' : ''}
              onClick={() => setCurrentPage('workspace')}
            >
              Ruang Kerja
            </button>
            <button
              className={currentPage === 'recruitment' ? 'active' : ''}
              onClick={() => setCurrentPage('recruitment')}
            >
              Open Recruitment
            </button>
            <button
              className={currentPage === 'studentConsultations' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('studentConsultations');
                markConsultationsRead();
              }}
            >
              <span>Jadwal & Bimbingan</span>
              {pendingStudentConsults > 0 && (
                <span className="nav-badge">{pendingStudentConsults}</span>
              )}
            </button>
            <button
              className={currentPage === 'studentResources' ? 'active' : ''}
              onClick={() => setCurrentPage('studentResources')}
            >
              Ajukan Fasilitas
            </button>
            <button
              className={currentPage === 'studentPortfolio' ? 'active' : ''}
              onClick={() => setCurrentPage('studentPortfolio')}
            >
              Portofolio Saya
            </button>
          </>
        )}

        {/* Lecturer Navigation */}
        {role === 'lecturer' && (
          <>
            <button
              className={currentPage === 'mission' ? 'active' : ''}
              onClick={() => setCurrentPage('mission')}
            >
              <span>Mission Control</span>
              {blockerProjectsCount > 0 && (
                <span className="nav-badge warning">{blockerProjectsCount}</span>
              )}
            </button>
            <button
              className={currentPage === 'projects' ? 'active' : ''}
              onClick={() => setCurrentPage('projects')}
            >
              Katalog Proyek
            </button>
            <button
              className={currentPage === 'workspace' ? 'active' : ''}
              onClick={() => setCurrentPage('workspace')}
            >
              Ruang Kerja
            </button>
            <button
              className={currentPage === 'consultations' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('consultations');
                markConsultationsRead();
              }}
            >
              <span>Bimbingan</span>
              {pendingLecturerConsults > 0 && (
                <span className="nav-badge">{pendingLecturerConsults}</span>
              )}
            </button>
            <button
              className={currentPage === 'resources' ? 'active' : ''}
              onClick={() => setCurrentPage('resources')}
            >
              Lab & Fasilitas
            </button>
            <button
              className={currentPage === 'analytics' ? 'active' : ''}
              onClick={() => setCurrentPage('analytics')}
            >
              Analitik Kohort
            </button>
          </>
        )}

        {/* Admin Navigation */}
        {role === 'admin' && (
          <>
            <button
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={currentPage === 'projects' ? 'active' : ''}
              onClick={() => setCurrentPage('projects')}
            >
              Katalog Proyek
            </button>
            <button
              className={currentPage === 'workspace' ? 'active' : ''}
              onClick={() => setCurrentPage('workspace')}
            >
              Ruang Kerja
            </button>
            <button
              className={currentPage === 'mission' ? 'active' : ''}
              onClick={() => setCurrentPage('mission')}
            >
              Supervisi
            </button>
            <button
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={() => setCurrentPage('admin')}
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
        </nav>

        {canScrollRight && (
          <button
            type="button"
            className="nav-scroll-btn nav-scroll-right"
            onClick={() => scrollNav('right')}
            title="Geser menu ke kanan"
            aria-label="Geser navigasi ke kanan"
          >
            <ChevronRight size={15} />
          </button>
        )}
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

        {/* User Profile Badge */}
        <div
          className="user-badge"
          onClick={() => openModal('profile', currentUser)}
          title="Klik untuk mengedit identitas & profil peneliti STEAM"
          tabIndex={0}
          role="button"
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>
                {[currentUser.title_prefix, currentUser.name, currentUser.title_suffix].filter(Boolean).join(' ')}
              </strong>
              <Edit3 size={11} className="profile-edit-indicator" />
            </div>
            <small>
              {role === 'student' ? 'Mahasiswa Peneliti' : role === 'lecturer' ? 'Dosen Pembimbing' : 'Administrator'}
            </small>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="btn btn-ghost btn-sm topbar-logout-btn"
          onClick={logout}
          title="Keluar"
        >
          <LogOut size={13} />
          <span className="logout-text">Keluar</span>
        </button>
      </div>
    </header>
  );
};
