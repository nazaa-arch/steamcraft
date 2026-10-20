import React from 'react';
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
import { MaintenancePage } from './components/pages/MaintenancePage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { Modals } from './components/modals/Modals';
import { Toast } from './components/common/Toast';

export const App: React.FC = () => {
  const { currentUser, currentPage, maintenanceMode, setMaintenanceMode, setCurrentPage } = useApp();

  // Detect adm.steamcraft.online subdomain or ?portal=adm query param
  const isAdmSubdomain = typeof window !== 'undefined' && (
    window.location.hostname.startsWith('adm.') ||
    window.location.hostname === 'adm.steamcraft.online' ||
    new URLSearchParams(window.location.search).get('portal') === 'adm'
  );

  // Dedicated Master Admin & DevOps Portal route
  if (isAdmSubdomain || currentPage === 'adminDev') {
    return (
      <>
        <AdminDevPortal />
        <Modals />
        <Toast />
      </>
    );
  }

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
        {currentPage === 'maintenance' ? <MaintenancePage /> : <LoginScreen />}
        <Modals />
        <Toast />
      </>
    );
  }

  return (
    <div className={`workspace-app ${currentUser.role === 'admin' ? 'dev-mode-active' : ''}`}>
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
        {currentPage === 'adminDev' && <AdminDevPortal />}
        {currentPage === 'maintenance' && <MaintenancePage />}
        {![
          'dashboard', 'projects', 'workspace', 'recruitment', 'studentConsultations',
          'studentResources', 'studentPortfolio', 'mission', 'consultations', 'resources',
          'analytics', 'announcements', 'admin', 'adminDev', 'maintenance'
        ].includes(currentPage) && <NotFoundPage />}
      </main>

      <Modals />
      <Toast />
    </div>
  );
};
