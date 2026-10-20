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
import { NotFoundPage } from './components/pages/NotFoundPage';
import { Modals } from './components/modals/Modals';
import { Toast } from './components/common/Toast';

export const App: React.FC = () => {
  const { currentUser, currentPage } = useApp();

  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        <Modals />
        <Toast />
      </>
    );
  }

  return (
    <div className={`workspace-app ${currentUser.role === 'admin' ? 'dev-mode-active' : ''}`}>
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
        {![
          'dashboard', 'projects', 'workspace', 'recruitment', 'studentConsultations',
          'studentResources', 'studentPortfolio', 'mission', 'consultations', 'resources',
          'analytics', 'announcements', 'admin'
        ].includes(currentPage) && <NotFoundPage />}
      </main>

      <Modals />
      <Toast />
    </div>
  );
};
