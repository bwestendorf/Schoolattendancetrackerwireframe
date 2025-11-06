import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, UserRole } from '../types';
import { mockUsers } from '../lib/mockData';
import { GraduationCap } from 'lucide-react';
import { Label } from './ui/label';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');

  const handleLogin = () => {
    const user = mockUsers.find((u) => u.role === selectedRole);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8F4F8' }}>
      {/* Traditional .NET Login Panel - iTendance Style */}
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="bg-white border-2 shadow-lg mb-4 text-center py-6" style={{ borderColor: '#003B5C' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-20 h-20 border-2 flex items-center justify-center bg-white" style={{ borderColor: '#003B5C' }}>
              <GraduationCap className="h-10 w-10" style={{ color: '#F26522' }} />
            </div>
          </div>
          <h1 style={{ color: '#003B5C' }}>NOCE iTendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Attendance Management System v1.4</p>
          <p className="text-xs text-muted-foreground">North Orange Continuing Education</p>
        </div>

        {/* Login Panel */}
        <div className="bg-white border-2 shadow-lg" style={{ borderColor: '#003B5C' }}>
          {/* Panel Header */}
          <div className="px-4 py-3 border-b-2" style={{ backgroundColor: '#003B5C', borderBottomColor: '#F26522' }}>
            <h2 className="text-sm text-white">User Authentication</h2>
          </div>

          {/* Login Form */}
          <div className="px-6 py-6 space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 px-4 py-3">
              <p className="text-sm text-blue-800">
                <strong>Authentication:</strong> This is a wireframe demonstration. In production, users will authenticate through Microsoft EntraID (Azure AD).
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm">Select User Type (Demo Mode)</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <SelectTrigger id="role" className="border-2" style={{ borderColor: '#E8F4F8' }}>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher - Regular Faculty</SelectItem>
                    <SelectItem value="guest-teacher">Guest Teacher - Substitute</SelectItem>
                    <SelectItem value="admin-it">Admin IT - System Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full border-2"
                style={{ backgroundColor: '#003B5C', color: 'white', borderColor: '#003B5C' }}
              >
                Sign in with EntraID
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t-2 px-6 py-3" style={{ borderTopColor: '#E8F4F8' }}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p>Version 1.4.0 • iTendance Style</p>
              <a href="https://noce.edu" className="hover:underline" style={{ color: '#0066A1' }}>noce.edu</a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="#" className="hover:underline" style={{ color: '#003B5C' }}>Help & Support</a>
            <span style={{ color: '#003B5C' }}>•</span>
            <a href="#" className="hover:underline" style={{ color: '#003B5C' }}>Privacy Policy</a>
            <span style={{ color: '#003B5C' }}>•</span>
            <a href="#" className="hover:underline" style={{ color: '#003B5C' }}>Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}