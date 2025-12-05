import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './components/Dashboard';
import { ClassAttendance } from './components/ClassAttendance';
import { ClassAttendanceInline } from './components/ClassAttendanceInline';
import { AdminReports } from './components/AdminReports';
import { DepartmentalDashboard } from './components/DepartmentalDashboard';
import { User } from './types';

type AppView = 'login' | 'dashboard' | 'class-attendance' | 'class-attendance-inline' | 'reports' | 'departmental';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    setSelectedClassId(null);
  };

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    // Use inline version by default
    setCurrentView('class-attendance-inline');
  };

  const handleBackToDashboard = () => {
    setSelectedClassId(null);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: 'dashboard' | 'reports' | 'departmental') => {
    setCurrentView(view);
  };

  if (currentView === 'login' || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AppLayout
      user={user}
      currentView={currentView === 'reports' ? 'reports' : 'dashboard'}
      onViewChange={handleViewChange}
      onLogout={handleLogout}
    >
      {currentView === 'dashboard' && (
        <Dashboard user={user} onSelectClass={handleSelectClass} />
      )}
      {currentView === 'class-attendance' && selectedClassId && (
        <ClassAttendance
          user={user}
          classId={selectedClassId}
          onBack={handleBackToDashboard}
        />
      )}
      {currentView === 'class-attendance-inline' && selectedClassId && (
        <ClassAttendanceInline
          user={user}
          classId={selectedClassId}
          onBack={handleBackToDashboard}
        />
      )}
      {currentView === 'reports' && user.role === 'admin-it' && <AdminReports />}
      {currentView === 'departmental' && user.role === 'departmental' && <DepartmentalDashboard user={user} />}
    </AppLayout>
  );
}