import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Class, User } from '../types';
import { mockClasses, getAtRiskCountByClass, mockStudents } from '../lib/mockData';
import { Users, ChevronRight, Home, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface DashboardProps {
  user: User;
  onSelectClass: (classId: string) => void;
}

export function Dashboard({ user, onSelectClass }: DashboardProps) {
  // Filter classes based on user role
  const getClassesForUser = () => {
    if (user.role === 'admin-it') {
      return mockClasses; // Admin sees all classes
    }
    // Teachers and guest teachers see their assigned classes
    return mockClasses.filter((c) => c.teacherId === user.id);
  };

  const userClasses = getClassesForUser();
  
  // Calculate total at-risk students across all user's classes
  const totalAtRisk = userClasses.reduce((sum, classItem) => {
    return sum + getAtRiskCountByClass(classItem.id);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Classes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator />

      {/* Page Header - Traditional .NET Style */}
      <div className="border-l-4 pl-4" style={{ borderLeftColor: '#003B5C' }}>
        <h2 style={{ color: '#003B5C' }}>Class Management</h2>
        <p className="text-muted-foreground">
          {user.role === 'admin-it'
            ? 'View all classes and attendance records in the system'
            : 'Select a class to mark or edit student attendance records'}
        </p>
      </div>

      {/* At-Risk Students Alert */}
      {totalAtRisk > 0 && (
        <div className="border-4 border-red-600 bg-red-50">
          <div className="bg-red-600 px-4 py-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-white" />
            <h3 className="text-sm text-white">ATTENDANCE ALERT - ACTION REQUIRED</h3>
          </div>
          <div className="p-4">
            <p style={{ color: '#dc2626' }}>
              <strong>{totalAtRisk} student{totalAtRisk > 1 ? 's' : ''}</strong> across your classes {totalAtRisk > 1 ? 'have' : 'has'} missed 3 or more days in the last 10 days and may require intervention.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              These students are highlighted in red when viewing attendance records. Please review their attendance patterns and consider reaching out to discuss their absences.
            </p>
          </div>
        </div>
      )}

      {/* Classes GridView-Style Table */}
      <div className="border-2" style={{ borderColor: '#E8F4F8' }}>
        <div className="bg-gray-50 border-b-2 px-4 py-3" style={{ borderBottomColor: '#003B5C' }}>
          <h3 className="text-sm" style={{ color: '#003B5C' }}>Available Classes ({userClasses.length})</h3>
        </div>
        
        <div className="divide-y">
          {userClasses.map((classItem, index) => {
            const atRiskCount = getAtRiskCountByClass(classItem.id);
            return (
              <div 
                key={classItem.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Class Name</label>
                      <div className="flex items-center gap-2">
                        <p style={{ color: '#003B5C' }}>{classItem.name}</p>
                        {atRiskCount > 0 && (
                          <div className="flex items-center gap-1 border-2 border-red-600 bg-red-50 px-2 py-0.5">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-red-600">{atRiskCount} At Risk</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Grade Level</label>
                      <p>{classItem.grade}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Instructor</label>
                      <p>{classItem.teacherName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center border-2 px-3 py-2" style={{ borderColor: '#E8F4F8' }}>
                      <label className="text-xs text-muted-foreground block">Students</label>
                      <p style={{ color: '#003B5C' }}>{classItem.studentCount}</p>
                    </div>
                    <Button
                      onClick={() => onSelectClass(classItem.id)}
                      className="rounded-none border-2"
                      size="sm"
                      style={{ backgroundColor: '#003B5C', color: 'white', borderColor: '#003B5C' }}
                    >
                      View Attendance
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {userClasses.length === 0 && (
        <div className="border-2 bg-gray-50 p-12 text-center" style={{ borderColor: '#E8F4F8' }}>
          <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#003B5C', opacity: 0.3 }} />
          <p style={{ color: '#003B5C' }}>No classes assigned to your account</p>
          <p className="text-sm text-muted-foreground mt-2">Please contact the administrator if you believe this is an error.</p>
        </div>
      )}
    </div>
  );
}