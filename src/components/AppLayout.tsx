import { ReactNode } from 'react';
import { Button } from './ui/button';
import { User } from '../types';
import { GraduationCap, LogOut, Users, FileText, BookOpen, Home, HelpCircle, Settings, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CalendarWidget } from './CalendarWidget';

interface AppLayoutProps {
  user: User;
  currentView: 'dashboard' | 'reports';
  onViewChange: (view: 'dashboard' | 'reports') => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AppLayout({ user, currentView, onViewChange, onLogout, children }: AppLayoutProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'default';
      case 'guest-teacher':
        return 'secondary';
      case 'admin-it':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Teacher';
      case 'guest-teacher':
        return 'Guest Teacher';
      case 'admin-it':
        return 'Admin IT';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Dark Traditional .NET Style matching iTendance */}
      <header className="border-b-2" style={{ backgroundColor: '#003B5C', borderBottomColor: '#F26522' }}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 flex items-center justify-center bg-white">
                <GraduationCap className="h-5 w-5" style={{ color: '#F26522' }} />
              </div>
              <div>
                <h1 className="text-white text-lg">NOCE Attendance System</h1>
                <p className="text-xs" style={{ color: '#E8F4F8' }}>North Orange Continuing Education</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Utility Navigation */}
              <div className="flex items-center gap-2 border-l-2 pl-4" style={{ borderLeftColor: '#0066A1' }}>
                <button 
                  className="text-white hover:text-orange-400 transition-colors p-1"
                  title="Help & Documentation"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
                <button 
                  className="text-white hover:text-orange-400 transition-colors p-1"
                  title="User Preferences"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  className="text-white hover:text-orange-400 transition-colors p-1"
                  title="System Information"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>

              <div className="text-right border-l-2 pl-4" style={{ borderLeftColor: '#0066A1' }}>
                <p className="text-sm text-white">{user.name}</p>
                <Badge 
                  variant="outline" 
                  className="text-xs border"
                  style={{ borderColor: '#F26522', backgroundColor: '#F26522', color: 'white' }}
                >
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="border-2"
                style={{ borderColor: '#F26522', color: 'white', backgroundColor: 'transparent' }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - Traditional Menu Bar */}
      <nav className="bg-white border-b-2" style={{ borderBottomColor: '#E8F4F8' }}>
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-1">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              className="rounded-none border-2"
              style={currentView === 'dashboard' ? { 
                backgroundColor: '#003B5C',
                color: 'white',
                borderColor: '#003B5C'
              } : { borderColor: 'transparent' }}
              onClick={() => onViewChange('dashboard')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              My Classes
            </Button>
            {user.role === 'admin-it' && (
              <Button
                variant={currentView === 'reports' ? 'default' : 'ghost'}
                className="rounded-none border-2"
                style={currentView === 'reports' ? { 
                  backgroundColor: '#003B5C',
                  color: 'white',
                  borderColor: '#003B5C'
                } : { borderColor: 'transparent' }}
                onClick={() => onViewChange('reports')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Reports & Analytics
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content - Three Column Layout with Sidebars */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Calendar & Quick Info */}
          <aside className="lg:col-span-3 space-y-4">
            <CalendarWidget />
            
            {/* Quick Info Panel */}
            <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
              <div className="px-3 py-2" style={{ backgroundColor: '#003B5C' }}>
                <h3 className="text-sm text-white">Quick Information</h3>
              </div>
              <div className="p-3 space-y-2">
                <div className="text-sm">
                  <label className="text-xs text-muted-foreground block">Logged in as:</label>
                  <p style={{ color: '#003B5C' }}>{user.name}</p>
                </div>
                <Separator />
                <div className="text-sm">
                  <label className="text-xs text-muted-foreground block">Role:</label>
                  <p style={{ color: '#003B5C' }}>{getRoleLabel(user.role)}</p>
                </div>
                <Separator />
                <div className="text-sm">
                  <label className="text-xs text-muted-foreground block">System Time:</label>
                  <p style={{ color: '#003B5C' }}>{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            {/* System Links */}
            <div className="border-2 bg-white" style={{ borderColor: '#E8F4F8' }}>
              <div className="px-3 py-2" style={{ backgroundColor: '#003B5C' }}>
                <h3 className="text-sm text-white">System Links</h3>
              </div>
              <div className="p-2">
                <a href="#" className="block px-2 py-1 text-sm hover:bg-gray-100" style={{ color: '#0066A1' }}>
                  • User Manual
                </a>
                <a href="#" className="block px-2 py-1 text-sm hover:bg-gray-100" style={{ color: '#0066A1' }}>
                  • Support Portal
                </a>
                <a href="#" className="block px-2 py-1 text-sm hover:bg-gray-100" style={{ color: '#0066A1' }}>
                  • Submit Feedback
                </a>
                <a href="#" className="block px-2 py-1 text-sm hover:bg-gray-100" style={{ color: '#0066A1' }}>
                  • Privacy Policy
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white border-2 shadow-sm p-6" style={{ borderColor: '#E8F4F8' }}>
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Traditional .NET Style */}
      <footer className="bg-white border-t-4 mt-8" style={{ borderTopColor: '#003B5C' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <p>© 2025 North Orange Continuing Education</p>
              <span>•</span>
              <a href="https://noce.edu" className="hover:underline" style={{ color: '#0066A1' }}>noce.edu</a>
              <span>•</span>
              <a href="#" className="hover:underline" style={{ color: '#0066A1' }}>Terms of Service</a>
            </div>
            <p>Version 1.4.0 • iTendance Style</p>
          </div>
        </div>
      </footer>
    </div>
  );
}