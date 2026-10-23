import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Topbar } from './components/layout/Topbar';
import { LoginScreen } from './components/auth/LoginScreen';
import { StudentDashboard } from './components/pages/StudentDashboard';
import { ProjectCatalog } from './components/pages/ProjectCatalog';
import { ProjectWorkspace } from './components/pages/ProjectWorkspace';
import { OpenRecruitmentHub } from './components/pages/OpenRecruitmentHub';
import { ConsultationsPage } from './components/pages/ConsultationsPage';
import { ResourcesPage } from './components/pages/ResourcesPage';
import { StudentPortfolio } from './components/pages/StudentPortfolio';
import { MissionControlPage } from './components/pages/MissionControlPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AnnouncementsPage } from './components/pages/AnnouncementsPage';
import { AdminConsolePage } from './components/pages/AdminConsolePage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { AdminDevPortal } from './components/pages/AdminDevPortal';
import { TeamProjectHub } from './components/pages/TeamProjectHub';
import { MemberPublicPortfolio } from './components/pages/MemberPublicPortfolio';
import { MaintenancePage } from './components/pages/MaintenancePage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { Modals } from './components/modals/Modals';
import { Toast } from './components/common/Toast';

export const App: React.FC = () => {
  const { currentUser, currentPage, maintenanceMode, setMaintenanceMode, setCurrentPage } = useApp();

  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

  // 1. Dedicated Master Admin & DevOps Portal route: adm.steamcraft.online or ?portal=adm or currentPage === 'adminDev'
  const isAdmSubdomain =
    hostname.startsWith('adm.') ||
    hostname === 'adm.steamcraft.online' ||
    searchParams.get('portal') === 'adm' ||
    currentPage === 'adminDev';

  // 1.2 Dedicated Beta / Staging Environment route: beta.steamcraft.online or ?env=beta or ?beta=true
  const isBetaSubdomain =
    hostname.startsWith('beta.') ||
    hostname === 'beta.steamcraft.online' ||
    searchParams.get('env') === 'beta' ||
    searchParams.get('beta') === 'true';

  // 1.5 Dedicated Member Portfolio Subdomains:
  // portofolionaza.steamcraft.online / ?portfolio=naza
  // portofoliobima.steamcraft.online / ?portfolio=bima
  // portofoliosandi.steamcraft.online / ?portfolio=sandi
  const portfolioTarget: 'naza' | 'bima' | 'sandi' | null =
    hostname.includes('portofolionaza') || searchParams.get('portfolio') === 'naza' || searchParams.get('member') === 'naza'
      ? 'naza'
      : hostname.includes('portofoliobima') || searchParams.get('portfolio') === 'bima' || searchParams.get('member') === 'bima'
      ? 'bima'
      : hostname.includes('portofoliosandi') || searchParams.get('portfolio') === 'sandi' || searchParams.get('member') === 'sandi'
      ? 'sandi'
      : null;

  // Dynamic Browser Tab Headline Title Sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isAdmSubdomain) {
        document.title = 'Adm Steam';
      } else if (isBetaSubdomain) {
        document.title = 'SteamCraft [BETA]';
      } else if (portfolioTarget === 'naza') {
        document.title = 'Portofolio Muhammad Naza Firmansyah — STEAM';
      } else if (portfolioTarget === 'bima') {
        document.title = 'Portofolio Bima Sena — STEAM';
      } else if (portfolioTarget === 'sandi') {
        document.title = 'Portofolio Sandi Ardi Prayitno — STEAM';
      } else {
        document.title = 'SteamCraft';
      }
    }
  }, [isAdmSubdomain, isBetaSubdomain, portfolioTarget, currentPage]);

  if (isAdmSubdomain) {
    return (
      <>
        <AdminDevPortal />
        <Modals />
        <Toast />
      </>
    );
  }

  // Render individual member portfolio if accessing their dedicated portfolio subdomain
  if (portfolioTarget) {
    return (
      <>
        <MemberPublicPortfolio memberId={portfolioTarget} />
        <Toast />
      </>
    );
  }

  // 2. Main Team Project Hub Domain: steamcraft.online / www.steamcraft.online (Showcase Projek Tim Bersama)
  // When visitor opens steamcraft.online, show the Team Collaborative Projects Showcase & Multi-Project Gateway!
  // When visitor opens app.steamcraft.online, beta.steamcraft.online or ?view=app, show the full STEAM-Craft Application!
  const isAppSubdomain =
    isBetaSubdomain ||
    hostname.startsWith('app.') ||
    hostname === 'app.steamcraft.online' ||
    searchParams.get('view') === 'app' ||
    searchParams.get('app') === 'true';

  const isMainHub =
    !isAppSubdomain &&
    (hostname === 'steamcraft.online' ||
      hostname === 'www.steamcraft.online' ||
      searchParams.get('view') === 'hub' ||
      currentPage === 'hub');

  if (isMainHub) {
    return (
      <>
        <TeamProjectHub
          onLaunchApp={() => {
            if (hostname.includes('steamcraft.online')) {
              window.location.href = 'https://app.steamcraft.online';
            } else {
              setCurrentPage('dashboard');
              const sp = new URLSearchParams(window.location.search);
              sp.set('view', 'app');
              window.location.search = sp.toString();
            }
          }}
        />
        <Modals />
        <Toast />
      </>
    );
  }

  // 3. Application Area (app.steamcraft.online, beta.steamcraft.online or ?view=app):
  // If Maintenance Mode is globally active and user is not an Admin, show MaintenancePage directly
  if (maintenanceMode && currentUser?.role !== 'admin') {
    return (
      <>
        <MaintenancePage />
        <Modals />
        <Toast />
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        {isBetaSubdomain && (
          <aside
            role="region"
            aria-label="Lingkungan Beta Staging"
            style={{
              background: 'linear-gradient(90deg, #1e3a8a, #0284c7)',
              color: 'white',
              padding: '6px 16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 700,
              zIndex: 99999,
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧪</span>
              <span>
                <strong>LINGKUNGAN BETA STAGING</strong> &mdash; Uji Coba UI/UX Masukan Dosen (Dr. Belgis) Telah Aktif
              </span>
            </div>
            <a
              href="https://app.steamcraft.online"
              style={{
                color: '#38bdf8',
                background: 'rgba(255,255,255,0.15)',
                padding: '2px 8px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '11px'
              }}
            >
              Versi Stabil &rarr;
            </a>
          </aside>
        )}
        {currentPage === 'maintenance' ? <MaintenancePage /> : <LoginScreen />}
        <Modals />
        <Toast />
      </>
    );
  }

  return (
    <div className={`workspace-app ${currentUser.role === 'admin' ? 'dev-mode-active' : ''}`}>
      {/* Top Banner for Beta Staging Environment */}
      {isBetaSubdomain && (
        <aside
          role="region"
          aria-label="Lingkungan Beta Staging"
          style={{
            background: 'linear-gradient(90deg, #1e3a8a, #0284c7)',
            color: 'white',
            padding: '6px 16px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 700,
            zIndex: 99999,
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧪</span>
            <span>
              <strong>LINGKUNGAN BETA STAGING</strong> &mdash; Uji Coba UI/UX Masukan Dosen (Dr. Belgis) Telah Aktif
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', opacity: 0.9 }}>Domain Utama: app.steamcraft.online</span>
            <a
              href="https://app.steamcraft.online"
              style={{
                color: '#38bdf8',
                background: 'rgba(255,255,255,0.15)',
                padding: '2px 8px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '11px'
              }}
            >
              Buka Versi Stabil &rarr;
            </a>
          </div>
        </aside>
      )}
      {/* Top Banner when Maintenance Mode is ON for Admin */}
      {maintenanceMode && currentUser.role === 'admin' && (
        <div
          style={{
            background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
            color: '#fff',
            padding: '10px 16px',
            fontSize: '12.5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)',
            position: 'sticky',
            top: 0,
            zIndex: 9999
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#fef08a',
                display: 'inline-block',
                boxShadow: '0 0 8px #fef08a'
              }}
            />
            <strong>MODE PEMELIHARAAN SISTEM SEDANG AKTIF:</strong>
            <span>Akses dibatasi hanya untuk Administrator. Pengguna umum dialihkan ke halaman pemeliharaan.</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-sm btn-ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', padding: '4px 10px', fontSize: '11.5px' }}
              onClick={() => setCurrentPage('maintenance')}
            >
              👁️ Pratinjau Maintenance
            </button>
            <button
              className="btn btn-sm btn-primary"
              style={{ background: '#22c55e', borderColor: '#16a34a', color: '#fff', fontWeight: 800, padding: '4px 10px', fontSize: '11.5px' }}
              onClick={() => setMaintenanceMode(false)}
            >
              Matikan Mode Pemeliharaan
            </button>
          </div>
        </div>
      )}

      <Topbar />

      <main className="wrap">
        {currentPage === 'dashboard' && (
          currentUser.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />
        )}
        {currentPage === 'projects' && <ProjectCatalog />}
        {currentPage === 'workspace' && <ProjectWorkspace />}
        {currentPage === 'recruitment' && <OpenRecruitmentHub />}
        {currentPage === 'studentConsultations' && <ConsultationsPage />}
        {currentPage === 'studentResources' && <ResourcesPage />}
        {currentPage === 'studentPortfolio' && <StudentPortfolio />}
        {currentPage === 'mission' && <MissionControlPage />}
        {currentPage === 'consultations' && <ConsultationsPage />}
        {currentPage === 'resources' && <ResourcesPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'announcements' && <AnnouncementsPage />}
        {currentPage === 'admin' && <AdminConsolePage />}
        {currentPage === 'hub' && <TeamProjectHub />}
        {currentPage === 'maintenance' && <MaintenancePage />}
        {![
          'dashboard', 'projects', 'workspace', 'recruitment', 'studentConsultations',
          'studentResources', 'studentPortfolio', 'mission', 'consultations', 'resources',
          'analytics', 'announcements', 'admin', 'adminDev', 'hub', 'maintenance'
        ].includes(currentPage) && <NotFoundPage />}
      </main>

      <Modals />
      <Toast />
    </div>
  );
};
